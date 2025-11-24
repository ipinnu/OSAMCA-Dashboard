// src/types/user.types.ts
export interface PersonalInfo {
  last_name: string;
  middle_name: string;
  first_name: string;
  phone_number: string;
}

export interface BusinessInfo {
  enterprise_type: string;
  business_name: string;
}

export interface AddressInfo {
  business_address: string;
  home_address: string;
}

export interface LoanInfo {
  loan_amount: number;
  loan_purpose: string;
  loan_duration: number;
  monthly_repayment: number;
  currency: string;
}

export interface Guarantor {
  full_name: string;
  staff_id: string;
  phone_number: string;
  office_address: string;
}

export interface FacialPhoto {
  photo_data: string;
}

export interface BioData {
  personal_info: PersonalInfo;
  business_info: BusinessInfo;
  address_info: AddressInfo;
  loan_info: LoanInfo;
  guarantors: Guarantor[];
  facial_photo?: FacialPhoto;
  additional_info?: {
    comments: string;
  };
}

export interface ApplicationStatus {
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'not_submitted';
  submitted_date?: string;
  approved_date?: string;
  assigned_officer?: string;
}

export interface RepaymentScheduleItem {
  due_date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  payment_date?: string;
  balance: number;
}

export interface UserProfile {
  id: number;
  personal_info: PersonalInfo;
  bio_data?: BioData;
  application_status: ApplicationStatus;
  empowerment_date?: string;
  repayment_schedule?: RepaymentScheduleItem[];
  account_info?: {
    registration_date: string;
  };
}


