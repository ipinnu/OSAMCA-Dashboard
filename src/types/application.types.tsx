// src/types/application.types.ts
export interface LoanApplicationData {
  applicantName: string;
  groupName?: string;
  dateOfBirth: string;
  maritalStatus: 'single' | 'married' | 'widow';
  businessName: string;
  businessAddress: string;
  businessSector: string[];
  loanCycle?: string;
  amountApplied: number;
  purpose: string;
  projectCost: number;
  ownContribution: number;
  repaymentPeriod: number;
  monthlyRepayments: number;
  guarantors: Array<{
    name: string;
    address: string;
    description?: string;
    casp?: string;
    phone: string;
  }>;
}