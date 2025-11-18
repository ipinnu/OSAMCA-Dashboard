import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { applicationsService } from '../../services/applications.service';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoanApplicationScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [amountApplied, setAmountApplied] = useState('');
  const [purpose, setPurpose] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('');

  const handleSubmit = async () => {
    if (!applicantName || !businessName || !amountApplied) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await applicationsService.submitApplication({
        applicantName,
        businessName,
        businessAddress,
        amountApplied: parseFloat(amountApplied),
        purpose,
        repaymentPeriod: parseInt(repaymentPeriod),
        dateOfBirth: '',
        maritalStatus: 'single',
        businessSector: [],
        projectCost: 0,
        ownContribution: 0,
        monthlyRepayments: 0,
        guarantors: [],
      });

      Alert.alert('Success', 'Application submitted successfully!');
      // Reset form
      setApplicantName('');
      setBusinessName('');
      setBusinessAddress('');
      setAmountApplied('');
      setPurpose('');
      setRepaymentPeriod('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.formCard}>
          <Text style={styles.title}>Loan Application Form</Text>

          <Input
            label="Applicant Name *"
            value={applicantName}
            onChangeText={setApplicantName}
            placeholder="Enter your full name"
          />

          <Input
            label="Business Name *"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter business name"
          />

          <Input
            label="Business Address"
            value={businessAddress}
            onChangeText={setBusinessAddress}
            placeholder="Enter business address"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Amount Applied (₦) *"
            value={amountApplied}
            onChangeText={setAmountApplied}
            placeholder="Enter amount"
            keyboardType="numeric"
          />

          <Input
            label="Purpose"
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Purpose of loan"
          />

          <Input
            label="Repayment Period (months)"
            value={repaymentPeriod}
            onChangeText={setRepaymentPeriod}
            placeholder="e.g., 12"
            keyboardType="numeric"
          />

          <Button
            title="Submit Application"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 15,
  },
  formCard: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 10,
  },
});

export default LoanApplicationScreen;