// src/screens/main/UsersListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../types/navigation.types';
import { usersService } from '../../services/users.service';
import { UserProfile } from '../../types/user.types';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type UsersListScreenProps = {
  navigation: NativeStackNavigationProp<DashboardStackParamList, 'UsersList'>;
};

const UsersListScreen: React.FC<UsersListScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, statusFilter]);

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.application_status.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.personal_info.first_name.toLowerCase().includes(query) ||
          user.personal_info.last_name.toLowerCase().includes(query) ||
          user.personal_info.phone_number.includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const renderUserCard = ({ item }: { item: UserProfile }) => {
    const fullName = `${item.personal_info.last_name} ${item.personal_info.first_name} ${item.personal_info.middle_name || ''}`;
    const statusColor = getStatusColor(item.application_status.status);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
        activeOpacity={0.7}
      >
        <Card style={styles.userCard}>
          <View style={styles.cardContent}>
            <View style={styles.photoContainer}>
              {item.bio_data?.facial_photo ? (
                <Image
                  source={{ uri: item.bio_data.facial_photo.photo_data }}
                  style={styles.photo}
                />
              ) : (
                <Ionicons name="person" size={40} color="#ccc" />
              )}
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{fullName}</Text>
              <Text style={styles.phoneNumber}>
                <Ionicons name="call" size={14} color="#666" /> {item.personal_info.phone_number}
              </Text>

              {item.bio_data?.business_info && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.bio_data.business_info.enterprise_type}
                  </Text>
                </View>
              )}

              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {formatStatus(item.application_status.status)}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#1e5799" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <FilterButton
          title="All"
          active={statusFilter === 'all'}
          onPress={() => setStatusFilter('all')}
        />
        <FilterButton
          title="Pending"
          active={statusFilter === 'pending'}
          onPress={() => setStatusFilter('pending')}
        />
        <FilterButton
          title="Approved"
          active={statusFilter === 'approved'}
          onPress={() => setStatusFilter('approved')}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard label="Total Users" value={users.length.toString()} />
        <StatCard
          label="Approved"
          value={users.filter((u) => u.application_status.status === 'approved').length.toString()}
        />
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </View>
  );
};

const FilterButton: React.FC<{ title: string; active: boolean; onPress: () => void }> = ({
  title,
  active,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return '#d1edff';
    case 'pending':
      return '#fff3cd';
    case 'rejected':
      return '#f8d7da';
    default:
      return '#f8f9fa';
  }
};

const formatStatus = (status: string): string => {
  return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#1e5799',
    borderColor: '#1e5799',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e5799',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  userCard: {
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 15,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#e8f4ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 12,
    color: '#1e5799',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#17a2b8',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0c5460',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default UsersListScreen;