export type SupportedLanguage = 'en' | 'ta' | 'hi';

export type UserRole = 'customer' | 'bank_staff';

export interface User {
  id: string;
  did?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'customer';
  kycStatus: 'verified' | 'pending' | 'rejected';
  updatedProofStatus?: 'requested' | 'submitted' | 'verified';
  updatedProofHash?: string;
  updatedProofAt?: string;
  age: number;
  dob: string;
  aadhaarMasked: string;
  panMasked: string;
  addressState: string;
  privacyScore: number;
  dataMinimizationScore: number;
  createdAt: string;
}

export interface BankStaff {
  id: string;
  bankId: string;
  employeeId: string;
  name: string;
  email: string;
  bankName: string;
  role: 'bank_staff';
  designation: string;
}

export interface Credential {
  id: string;
  userId: string;
  credentialType: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
  credentialHash: string;
  txHash: string;
  claims: {
    ageEligibility?: boolean;
    identityVerified?: boolean;
    addressVerified?: boolean;
    incomeEligible?: boolean;
  };
}

export interface VerificationRequest {
  id: string;
  userId: string;
  bankId: string;
  bankName: string;
  bankLogo?: string;
  purpose: string;
  requestedAttributes: string[];
  disclosedAttributes?: string[];
  requestedProof?: string;
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  trustAiScore?: number;
  trustAiRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  riskRecommendation?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  timestamp?: string;
  expiresAt?: string;
  proofId?: string;
  qrToken?: string;
}

export type BankRequest = VerificationRequest;

export interface ZKProof {
  id: string;
  userId: string;
  requestId?: string;
  claimType: string;
  requirement: string;
  verifiedResult: boolean;
  dobRevealed: boolean;
  proofHash: string;
  txHash: string;
  blockNumber: number;
  verifier: string;
  createdAt: string;
  timestamp: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  organization: string;
  purpose: string;
  grantedData?: string[];
  requestedData?: string[];
  approvedDate: string;
  expiryDate: string;
  status: 'active' | 'revoked';
  txHash: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  bankId?: string;
  timestamp: string;
  event: string;
  actor: string;
  organization: string;
  action: string;
  proofId?: string;
  txHash: string;
  status: 'confirmed' | 'recorded' | 'revoked';
}

export type AuditEvent = AuditLog;

export interface LoanProduct {
  id: string;
  userId?: string;
  loanType?: 'agricultural' | 'personal' | 'education' | 'business';
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  amount?: string;
  maxAmount?: string;
  tenureMonths?: number;
  interestRate: string;
  instantPreApproved?: boolean;
  status?: 'eligible' | 'applied' | 'under_review' | 'approved';
  requiredProof?: string;
  appliedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'security' | 'request';
  timestamp: string;
  read: boolean;
}

export interface QRTokenPayload {
  token: string;
  requestId: string;
  userId: string;
  userName: string;
  bankName: string;
  proofId: string;
  proofHash: string;
  txHash: string;
  status: 'valid' | 'used' | 'expired' | 'revoked' | 'rejected';
  createdAt: string;
  expiresAt: string;
  claims?: string[];
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface BankCustomerRecord {
  id: string;
  customerId: string;
  customerName: string;
  requestedFacility: string;
  agePredicate: string;
  aadhaarMasked: string;
  panMasked: string;
  addressState: string;
  trustAiScore: number;
  trustAiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  proofHash: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected' | 'updated_proof_requested' | 'updated_proof_submitted';
  updatedProofStatus?: 'requested' | 'submitted' | 'verified';
  updatedProofAt?: string;
  verificationToken?: string;
  phone?: string;
  email?: string;
}

export interface BiometricPasskey {
  id: string;
  userId: string;
  deviceName: string;
  authenticatorType: 'TouchID' | 'WindowsHello' | 'FaceID' | 'SecurityKey' | 'EnclavePasskey';
  credentialId: string;
  publicKeyHash: string;
  createdAt: string;
  status: 'active' | 'revoked';
  txHash: string;
  blockNumber: number;
}

export interface BankDisbursalRecord {
  id: string;
  loanId: string;
  customerName: string;
  customerId: string;
  facility: string;
  amount: string;
  disbursedAt: string;
  txHash: string;
  officerName: string;
  status: 'disbursed' | 'pending';
}

export interface FraudRadarMetrics {
  sybilAttacksPrevented: number;
  deepfakeAttacksBlocked: number;
  nonceReplayBlocks: number;
  amlClearRate: number;
  threatVelocity: 'LOW' | 'ELEVATED' | 'HIGH';
  recentSecurityIncidents: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: 'neutralized' | 'investigated';
  }[];
}

export interface BankLedgerItem {
  id: string;
  blockNumber: number;
  txHash: string;
  method: string;
  customerRef: string;
  merkleRoot: string;
  verifierContract: string;
  timestamp: string;
  gasUsed: string;
  status: 'confirmed' | 'finalized';
}

export interface SupportCase {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  caseType: 'KYC Assistance' | 'Identity Verification' | 'Loan Assistance' | 'Proof Verification' | 'Account Security' | 'Fraud Concern';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Escalated';
  assignedOfficer: string;
  subject: string;
  notes: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
  verificationRequested?: boolean;
}

export interface FraudAlert {
  id: string;
  type: 'Unusual verification attempt' | 'Repeated proof requests' | 'High-risk device' | 'Multiple failed biometric attempts' | 'Suspicious request pattern';
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  customerId?: string;
  customerName?: string;
  details: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  timestamp: string;
  status: 'Active' | 'Investigating' | 'Customer Verification Requested' | 'Escalated' | 'Resolved';
  resolutionNotes?: string;
}
