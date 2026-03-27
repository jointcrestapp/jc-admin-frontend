import { Member } from "src/app/shared/interface/member.interface";
import { appConfig } from "../config/config";

export function mapMemberProfileResponse(resp: any): Member {
  // Handle noks as an array (picking the first record if it exists)
  // 1. Robust Next of Kin Validation
  const hasNokArray = Array.isArray(resp.noks) && resp.noks.length > 0;
  const hasNokObject = resp.noks && typeof resp.noks === 'object' && Object.keys(resp.noks).length > 0;
  
  // Extract the actual data to use for mapping
  const primaryNokData = hasNokArray ? resp.noks[0] : (hasNokObject ? resp.nok : null);

  // Validation logic: Must exist AND have at least a first name and phone
  const isNokValid = !!(primaryNokData && primaryNokData.first_name && primaryNokData.phone);

  // 2. Expanded Checkpoints (10 Total)
  const checkpoints = [
    { label: 'KYC Verification', met: resp.kyc_status === appConfig.kyc_status.VERIFIED },
    { label: 'Transaction PIN', met: resp.is_pin_set === 1 },
    { label: 'Gender', met: !!(resp.gender && resp.gender.trim().length > 0) },
    { label: 'Country', met: !!(resp.country && resp.country.trim().length > 0) },
    { label: 'State/Province', met: !!(resp.state && resp.state.trim().length > 0) },
    { label: 'City', met: !!(resp.city && resp.city.trim().length > 0) },
    { label: 'Residential Address', met: !!(resp.address_line1 && resp.address_line1.trim().length > 5) },
    { label: 'Phone Number', met: !!(resp.phone && resp.phone.length > 5) },
    { label: 'Bank Account', met: !!(resp.bank_detail?.id || resp.bank_detail?.id) },
    { label: 'Next of Kin', met: isNokValid }
  ];

  const completedCount = checkpoints.filter(c => c.met).length;
  const completionRate = (completedCount / checkpoints.length) * 100;
  return {
    id: resp.id,
    memberId: resp.member_id,
    firstName: resp.first_name,
    lastName: resp.last_name,
    fullName: `${resp.first_name} ${resp.last_name}`,
    email: resp.email,
    phone: resp.phone,
    dialCode: resp.dial_code,
    accountType: resp.account_type,

    // Financial Balances (10 Total)
    walletBalance: resp.wallet_bal || 0,
    savingsBalance: resp.savings_bal || 0,
    sharesBalance: resp.shares_bal || 0,
    creditSalesBalance: resp.credit_sales_bal || 0,
    investmentsBalance: resp.investments_bal || 0,
    dividendsBalance: resp.dividends_bal || 0,
    shareholdersBalance: resp.shareholders_bal || 0,
    loanBalance: resp.loan_bal || 0,
    thriftBalance: resp.thrift_bal || 0,
    frozenBal: resp.frozen_bal || 0,

    isSubscribed: resp.is_subscribed === 1,
    roles: resp.roles ?? ['member'],
    nextBillingDate: resp.next_billing_date,
    location: resp.location,
    country: resp.country,
    state: resp.state,
    city: resp.city,
    addressLine1: resp.address_line1,
    addressLine2: resp.address_line2,
    dob: resp.dob,
    gender: resp.gender,
    maritalStatus: resp.marital_status,

    bankDetail: resp.bank_detail 
      ? {
          id: resp.bank_detail.id,
          accountNumber: resp.bank_detail.accountNumber,
          bankName: resp.bank_detail.bankName,
          accountName: resp.bank_detail.accountName,
          bankCode: resp.bank_detail.bankCode,
          bankLogo: resp.bank_detail.bankLogo,
        }
      : undefined,

    nok: isNokValid ? {
        id: primaryNokData.id,
        nextOfKinFirstName: primaryNokData.first_name,
        nextOfKinLastName: primaryNokData.last_name,
        nextOfKinEmail: primaryNokData.email,
        nextOfKinDialCode: primaryNokData.dial_code,
        nextOfKinPhone: primaryNokData.phone,
    } : undefined,
    joinedDate: resp.createdAt,
    isActivated: resp.is_activated === 1,
    isNew: resp.is_new === true || resp.is_new === 'true',
    isEmailVerified: resp.is_email_verified === 1,
    isPhoneVerified: resp.is_phone_verified === 1,
    kycStatus: resp.kyc_status,
    profilePicture: resp.profile_picture,
    isPinSet: resp.is_pin_set === 1,
    hasWatchedWelcomeVideo: resp.has_watched_welcome_video === 1,
    hasJoinedThrift: resp.has_joined_thrift === 1,
    isSharesCompleted: resp.is_shares_completed === 1,

    completionRate,
    checkpoints, // 👈 Pass this to the template
    profileCompletionStatus: completionRate === 100
  };
}