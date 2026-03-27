export interface BankDetail {
  id: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
  bankCode: string;
  bankLogo: string;
}

export interface NoK {
  id: number;
  nextOfKinFirstName: string;
  nextOfKinLastName: string;
  nextOfKinEmail: string;
  nextOfKinDialCode: string;
  nextOfKinPhone: string;
}

export interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dialCode?: string;
  accountType?: string;

  // balances
  walletBalance: number;
  savingsBalance: number;
  sharesBalance: number;
  creditSalesBalance: number;
  investmentsBalance: number;
  dividendsBalance: number;
  shareholdersBalance: number;
  loanBalance: number;
  thriftBalance: number;
  frozenBal: number;


  // subscription & roles
  isSubscribed: boolean;
  nextBillingDate?: string;
  roles: string[];

  // profile
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  addressLine1: string;
  addressLine2: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;

  // bank
  bankDetail?: BankDetail;
  nok?: NoK;

  // metadata
  joinedDate: string;
  isActivated: boolean;
  isNew: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isPinSet: boolean;

  //KYC Status for quick access
  kycStatus: string;
  //newly added
  nextOfKinFirstName?: string;
  nextOfKinLastName?: string;
  nextOfKinDialCode?: string;
  nextOfKinPhone?: string;
  nextOfKinEmail?: string;
  
  profilePicture: string;

  profileCompletionStatus: boolean;
  hasJoinedThrift: boolean;
  hasWatchedWelcomeVideo: boolean;
  isSharesCompleted: boolean;  
  checkpoints: any;
  completionRate: Number;
}
