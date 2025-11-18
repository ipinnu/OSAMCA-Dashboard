// src/screens/main/UserProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../types/navigation.types';
import { usersService } from '../../services/users.service';
import { UserProfile as UserProfileType } from '../../types/user.types';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<DashboardStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const data = await usersService.getUserById(userId);
      setUser(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user profile');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const fullName = `${user.personal_info.last_name} ${user.personal_info.first_name} ${user.personal_info.middle_name || ''}`;
  const loanAmount = user.bio_data?.loan_info?.loan_amount || 0;
  const paidAmount = user.repayment_schedule
    ?.filter((item) => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0) || 0;
  const progress = loanAmount > 0 ? Math.round((paidAmount / loanAmount) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <View style={styles.photoContainer}>
          {user.bio_data?.facial_photo ? (
            <Image
              source={{ uri: user.bio_data.facial_photo.photo_data }}
              style={styles.photo}
            />
          ) : (
            <Ionicons name="person" size={60} color="#ccc" />
          )}
        </View>

        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.phone}>
          <Ionicons name="call" size={16} color="#666" /> {user.personal_info.phone_number}
        </Text>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {formatStatus(user.application_status.status)}
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          <DetailItem label="Member Since" value={formatDate(user.account_info?.registration_date)} />
          <DetailItem label="Empowered" value={formatDate(user.empowerment_date)} />
        </View>
      </Card>

      {/* Bio Data */}
      {user.bio_data && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Bio-Data Information</Text>

          <InfoItem label="Business Name" value={user.bio_data.business_info?.business_name} />
          <InfoItem label="Enterprise Type" value={user.bio_data.business_info?.enterprise_type} />
          <InfoItem label="Business Address" value={user.bio_data.address_info?.business_address} />
          <InfoItem label="Home Address" value={user.bio_data.address_info?.home_address} />

          {user.bio_data.loan_info && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subsectionTitle}>Loan Information</Text>
              <InfoItem label="Loan Amount" value={formatCurrency(user.bio_data.loan_info.loan_amount)} />
              <InfoItem label="Purpose" value={user.bio_data.loan_info.loan_purpose} />
              <InfoItem label="Duration" value={`${user.bio_data.loan_info.loan_duration} months`} />
              <InfoItem label="Monthly Payment" value={formatCurrency(user.bio_data.loan_info.monthly_repayment)} />
            </>
          )}

          {user.bio_data.guarantors && user.bio_data.guarantors.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subsectionTitle}>Guarantors</Text>
              {user.bio_data.guarantors.map((guarantor, index) => (
                <Card key={index} style={styles.guarantorCard}>
                  <Text style={styles.guarantorName}>{guarantor.full_name}</Text>
                  <InfoItem label="Staff ID" value={guarantor.staff_id} />
                  <InfoItem label="Phone" value={guarantor.phone_number} />
                  <InfoItem label="Office" value={guarantor.office_address} />
                </Card>
              ))}
            </>
          )}
        </Card>
      )}

      {/* Repayment Schedule */}
      {user.repayment_schedule && user.repayment_schedule.length > 0 && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Repayment Schedule & Progress</Text>

          <View style={styles.statsRow}>
            <StatBox label="Total Loan" value={formatCurrency(loanAmount)} />
            <StatBox label="Paid" value={formatCurrency(paidAmount)} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <View style={styles.scheduleList}>
            {user.repayment_schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleDate}>{formatDate(item.due_date)}</Text>
                  <Text style={styles.scheduleAmount}>{formatCurrency(item.amount)}</Text>
                </View>
                <View style={[styles.scheduleStatus, getScheduleStatusStyle(item.status)]}>
                  <Text style={styles.scheduleStatusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Generate Statement"
          onPress={() => Alert.alert('Info', 'Generate statement functionality')}
          variant="primary"
          style={styles.actionButton}
        />
        <Button
          title="Send Reminder"
          onPress={() => Alert.alert('Info', 'Send reminder functionality')}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

const InfoItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
  </View>
);

const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};

const formatStatus = (status: string): string => {
  return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const getScheduleStatusStyle = (status: string) => {
  switch (status) {
    case 'paid':
      return { backgroundColor: '#d4edda' };
    case 'pending':
      return { backgroundColor: '#fff3cd' };
    case 'overdue':
      return { backgroundColor: '#f8d7da' };
    default:
      return { backgroundColor: '#f8f9fa' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 15,
    alignItems: 'center',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 15,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1edff',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#17a2b8',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c5460',
  },
  detailsGrid: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e5799',
  },
  section: {
    margin: 15,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  guarantorCard: {
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    padding: 15,
  },
  guarantorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e5799',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e5799',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e5799',
  },
  scheduleList: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  scheduleAmount: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  scheduleStatus: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  scheduleStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    padding: 15,
    gap: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
});

export default UserProfileScreen;

