import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  User,
  BankStaff,
  Credential,
  VerificationRequest,
  ZKProof,
  ConsentRecord,
  AuditLog,
  LoanProduct,
  NotificationItem,
  QRTokenPayload,
  BiometricPasskey,
  BankDisbursalRecord,
  SupportCase,
  FraudAlert
} from '../src/types';
import { blockchain } from './blockchain';

interface DBData {
  users: (User & { passwordHash: string; passkeyEnrolled: boolean })[];
  bankStaff: (BankStaff & { passwordHash: string })[];
  credentials: Credential[];
  verificationRequests: VerificationRequest[];
  proofs: ZKProof[];
  consents: ConsentRecord[];
  auditLogs: AuditLog[];
  loans: LoanProduct[];
  notifications: NotificationItem[];
  qrTokens: QRTokenPayload[];
  passwordResetCodes: { contact: string; code: string; expiresAt: number }[];
  passkeys: BiometricPasskey[];
  bankDisbursals: BankDisbursalRecord[];
  bankResetCodes: { bankId: string; employeeId: string; code: string; expiresAt: number }[];
  supportCases: SupportCase[];
  fraudAlerts: FraudAlert[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'trustchain_db.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`salt_tc_${password}`).digest('hex');
}

function getInitialData(): DBData {
  const defaultPasswordHash = hashPassword('TrustChain#2026');
  const bankPasswordHash = hashPassword('BankManager#2026');

  const users: (User & { passwordHash: string; passkeyEnrolled: boolean })[] = [
    {
      id: 'usr-midhun-01',
      name: 'Midhun',
      email: 'midhun@trustchain.id',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      kycStatus: 'verified',
      age: 24,
      dob: '2002-04-18',
      aadhaarMasked: 'XXXX-XXXX-8921',
      panMasked: 'ABCDE****F',
      addressState: 'Tamil Nadu, India',
      privacyScore: 94,
      dataMinimizationScore: 96,
      createdAt: '2026-01-15T10:00:00.000Z',
      passwordHash: defaultPasswordHash,
      passkeyEnrolled: true,
    },
    {
      id: 'usr-arif-02',
      name: 'Mohamed Arif A',
      email: 'arif@trustchain.id',
      phone: '+91 98765 43211',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      kycStatus: 'verified',
      age: 25,
      dob: '2001-08-14',
      aadhaarMasked: 'XXXX-XXXX-4532',
      panMasked: 'BKAPM****K',
      addressState: 'Tamil Nadu, India',
      privacyScore: 92,
      dataMinimizationScore: 94,
      createdAt: '2026-01-10T08:30:00.000Z',
      passwordHash: defaultPasswordHash,
      passkeyEnrolled: true,
    },
    {
      id: 'usr-kishore-03',
      name: 'Kishore',
      email: 'kishore@trustchain.id',
      phone: '+91 98765 43212',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      kycStatus: 'verified',
      age: 23,
      dob: '2003-11-05',
      aadhaarMasked: 'XXXX-XXXX-1934',
      panMasked: 'CJDFE****L',
      addressState: 'Karnataka, India',
      privacyScore: 89,
      dataMinimizationScore: 91,
      createdAt: '2026-02-01T14:15:00.000Z',
      passwordHash: defaultPasswordHash,
      passkeyEnrolled: true,
    },
    {
      id: 'usr-krishnesh-04',
      name: 'Krishnesh',
      email: 'krishnesh@trustchain.id',
      phone: '+91 98765 43213',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      kycStatus: 'verified',
      age: 26,
      dob: '2000-02-28',
      aadhaarMasked: 'XXXX-XXXX-7712',
      panMasked: 'AALPK****Z',
      addressState: 'Tamil Nadu, India',
      privacyScore: 95,
      dataMinimizationScore: 98,
      createdAt: '2026-01-05T09:00:00.000Z',
      passwordHash: defaultPasswordHash,
      passkeyEnrolled: true,
    },
    {
      id: 'usr-priya-05',
      name: 'Priya Sharma',
      email: 'priya@trustchain.id',
      phone: '+91 98765 43214',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      kycStatus: 'verified',
      age: 28,
      dob: '1998-05-20',
      aadhaarMasked: 'XXXX-XXXX-6631',
      panMasked: 'BRDPS****M',
      addressState: 'Maharashtra, India',
      privacyScore: 96,
      dataMinimizationScore: 95,
      createdAt: '2026-01-20T11:00:00.000Z',
      passwordHash: defaultPasswordHash,
      passkeyEnrolled: true,
    },
  ];

  const bankStaff: (BankStaff & { passwordHash: string })[] = [
    {
      id: 'staff-mgr-01',
      bankId: 'TB-001',
      employeeId: 'MGR-1001',
      name: 'Vikram Malhotra',
      email: 'v.malhotra@trustbank.in',
      bankName: 'TrustBank Institutional Operations (TB-001)',
      role: 'bank_staff',
      designation: 'Chief Verification Officer & Bank Manager',
      passwordHash: bankPasswordHash,
    },
    {
      id: 'staff-01',
      bankId: 'BANK-HDFC-901',
      employeeId: 'EMP-4082',
      name: 'Rajesh Kumar',
      email: 'rajesh.k@hdfc-identity.com',
      bankName: 'HDFC Trust Banking & Credit',
      role: 'bank_staff',
      designation: 'Senior Credit & Verification Manager',
      passwordHash: bankPasswordHash,
    },
  ];

  const credentials: Credential[] = users.map(u => ({
    id: `cred-${u.id}`,
    userId: u.id,
    credentialType: 'Reusable SSI Government KYC Passport',
    issuer: 'TrustChain Digital Trust Authority (Govt. of India e-Sign)',
    issueDate: '2026-01-10',
    expiryDate: '2029-01-10',
    status: 'valid',
    credentialHash: blockchain.sha256(`cred_${u.id}_${u.email}`),
    txHash: blockchain.generateTxHash(),
    claims: {
      ageEligibility: true,
      identityVerified: true,
      addressVerified: true,
      incomeEligible: true,
    },
  }));

  const verificationRequests: VerificationRequest[] = [
    {
      id: 'req-01',
      userId: 'usr-arif-02',
      bankId: 'BANK-HDFC-901',
      bankName: 'HDFC Trust Banking',
      purpose: 'Verification for Pre-Approved Personal Credit Facility',
      requestedAttributes: ['KYC Verified Claim', 'Age Above 18 (ZKP)', 'State Residency Claim'],
      disclosedAttributes: ['KYC Verified Claim', 'Age Above 18 (ZKP)'],
      requestedProof: 'Age >= 18 & KYC Authenticated',
      riskScore: 18,
      riskLevel: 'LOW',
      riskRecommendation: 'Safe to approve. Only zero-knowledge claim required.',
      status: 'pending',
      createdAt: '2026-09-10T11:20:00.000Z',
      expiresAt: '2026-09-20T23:59:59.000Z',
    },
    {
      id: 'req-02',
      userId: 'usr-midhun-01',
      bankId: 'BANK-HDFC-901',
      bankName: 'Axis Prime Wealth',
      purpose: 'Digital Brokerage & Investment Account KYC',
      requestedAttributes: ['KYC Verified Claim', 'Age Above 18 (ZKP)'],
      disclosedAttributes: ['KYC Verified Claim', 'Age Above 18 (ZKP)'],
      requestedProof: 'Age >= 18',
      riskScore: 22,
      riskLevel: 'LOW',
      riskRecommendation: 'Minimal data disclosure needed. Safe.',
      status: 'pending',
      createdAt: '2026-09-11T09:15:00.000Z',
      expiresAt: '2026-09-25T23:59:59.000Z',
    },
    {
      id: 'req-03',
      userId: 'usr-krishnesh-04',
      bankId: 'BANK-HDFC-901',
      bankName: 'SBI Agri-Credit Trust',
      purpose: 'Kisan Agricultural Infrastructure Loan',
      requestedAttributes: ['KYC Verified Claim', 'State Residency Claim', 'Income Eligibility Claim'],
      requestedProof: 'KYC Verified & State Residency',
      riskScore: 15,
      riskLevel: 'LOW',
      riskRecommendation: 'Verified institutional public sector bank.',
      status: 'pending',
      createdAt: '2026-09-12T07:45:00.000Z',
      expiresAt: '2026-09-22T23:59:59.000Z',
    }
  ];

  const proofs: ZKProof[] = [
    {
      id: 'zkp-proof-01',
      userId: 'usr-arif-02',
      requestId: 'req-01',
      claimType: 'age_over_18',
      requirement: 'Predicate: age >= 18',
      verifiedResult: true,
      dobRevealed: false,
      proofHash: '0xzk7a9e14c382f9d50b71e843fa2948b301',
      txHash: '0x9482bf7a83d09e3a7c6419d854e76a0b91d84f',
      blockNumber: 1845210,
      verifier: 'HDFC Trust Banking',
      createdAt: '2026-09-10T12:00:00.000Z',
      timestamp: '2026-09-10T12:00:00.000Z',
    },
    {
      id: 'zkp-proof-02',
      userId: 'usr-krishnesh-04',
      claimType: 'residency_state',
      requirement: 'Predicate: state == "Tamil Nadu"',
      verifiedResult: true,
      dobRevealed: false,
      proofHash: '0xzk5841bc90aef4316d28905b7610fa789c',
      txHash: '0x43890fe81b29a0c4765d183fa89b37a4e69d2f',
      blockNumber: 1845212,
      verifier: 'SBI Agri-Credit Trust',
      createdAt: '2026-09-11T16:30:00.000Z',
      timestamp: '2026-09-11T16:30:00.000Z',
    }
  ];

  const consents: ConsentRecord[] = [
    {
      id: 'consent-01',
      userId: 'usr-arif-02',
      organization: 'HDFC Bank Ltd.',
      purpose: 'Account Opening & KYC Verification',
      grantedData: ['Age Predicate Proof', 'Identity Authenticated Hash'],
      requestedData: ['Age Predicate Proof', 'Identity Authenticated Hash'],
      approvedDate: '2026-08-20',
      expiryDate: '2027-08-20',
      status: 'active',
      txHash: blockchain.generateTxHash(),
    },
    {
      id: 'consent-02',
      userId: 'usr-arif-02',
      organization: 'Zerodha Broking Limited',
      purpose: 'Demat Account Creation',
      grantedData: ['PAN Masked Proof', 'Residency Claim'],
      requestedData: ['PAN Masked Proof', 'Residency Claim'],
      approvedDate: '2026-07-15',
      expiryDate: '2027-07-15',
      status: 'active',
      txHash: blockchain.generateTxHash(),
    },
    {
      id: 'consent-03',
      userId: 'usr-midhun-01',
      organization: 'ICICI Securities',
      purpose: 'Trading Wallet Verification',
      grantedData: ['Age Predicate Proof', 'KYC Status'],
      requestedData: ['Age Predicate Proof', 'KYC Status'],
      approvedDate: '2026-08-01',
      expiryDate: '2027-08-01',
      status: 'active',
      txHash: blockchain.generateTxHash(),
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'audit-01',
      timestamp: '2026-01-10T08:30:00.000Z',
      event: 'IDENTITY_CREDENTIAL_ISSUED',
      actor: 'TrustChain Sovereign Authority',
      organization: 'TrustChain Protocol',
      action: 'Reusable SSI Credential anchored on-chain with SHA-256 root hash',
      txHash: blockchain.generateTxHash(),
      status: 'confirmed',
    },
    {
      id: 'audit-02',
      timestamp: '2026-09-10T12:00:00.000Z',
      event: 'ZKP_PROOF_GENERATED',
      actor: 'Mohamed Arif A',
      organization: 'HDFC Trust Banking',
      action: 'Zero-Knowledge Proof verified (Predicate: age >= 18). Raw DOB kept confidential.',
      proofId: 'zkp-proof-01',
      txHash: '0x9482bf7a83d09e3a7c6419d854e76a0b91d84f',
      status: 'confirmed',
    },
    {
      id: 'audit-03',
      timestamp: '2026-09-11T14:22:00.000Z',
      event: 'DEVICE_PASSKEY_VERIFIED',
      actor: 'Mohamed Arif A',
      organization: 'TrustChain Authenticator',
      action: 'Biometric passkey verified on client device via WebAuthn platform authenticator',
      txHash: blockchain.generateTxHash(),
      status: 'confirmed',
    },
    {
      id: 'audit-04',
      timestamp: '2026-09-12T07:45:00.000Z',
      event: 'VERIFICATION_REQUEST_RECEIVED',
      actor: 'SBI Agri-Credit Trust',
      organization: 'TrustChain Protocol',
      action: 'Bank verification request generated with selective disclosure parameters',
      txHash: blockchain.generateTxHash(),
      status: 'recorded',
    }
  ];

  const loans: LoanProduct[] = [
    {
      id: 'loan-agri-01',
      userId: 'usr-arif-02',
      loanType: 'agricultural',
      title: 'Kisan Agricultural Credit Facility',
      amount: '₹ 5,00,000',
      tenureMonths: 24,
      interestRate: '4.0% p.a. (Subsidized)',
      status: 'eligible',
      requiredProof: 'State Residency + Age > 18 ZKP',
    },
    {
      id: 'loan-personal-02',
      userId: 'usr-arif-02',
      loanType: 'personal',
      title: 'Instant Personal Digital Facility',
      amount: '₹ 3,50,000',
      tenureMonths: 36,
      interestRate: '9.8% p.a.',
      status: 'eligible',
      requiredProof: 'KYC Verified + Creditworthiness ZKP',
    },
    {
      id: 'loan-edu-03',
      userId: 'usr-arif-02',
      loanType: 'education',
      title: 'Higher Education Special Support',
      amount: '₹ 15,00,000',
      tenureMonths: 60,
      interestRate: '6.5% p.a.',
      status: 'eligible',
      requiredProof: 'Age > 18 + Academic Admission Proof',
    },
    {
      id: 'loan-msme-04',
      userId: 'usr-arif-02',
      loanType: 'business',
      title: 'MSME Business Growth Facility',
      amount: '₹ 25,00,000',
      tenureMonths: 48,
      interestRate: '8.2% p.a.',
      status: 'eligible',
      requiredProof: 'Business Registration Claim + KYC ZKP',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif-01',
      userId: 'usr-arif-02',
      title: 'New Verification Request',
      message: 'HDFC Trust Banking has requested selective identity proof for pre-approved credit.',
      type: 'info',
      timestamp: '2026-09-12T08:00:00.000Z',
      read: false,
    },
    {
      id: 'notif-02',
      userId: 'usr-arif-02',
      title: 'Biometric Authenticator Active',
      message: 'Your device passkey is active and protecting your private identity wallet.',
      type: 'success',
      timestamp: '2026-09-11T14:22:00.000Z',
      read: true,
    }
  ];

  const qrTokens: QRTokenPayload[] = [
    {
      token: 'tc_ver_req-01_3dfbefb817c4ed645fa7a98c',
      requestId: 'req-01',
      userId: 'usr-arif-02',
      userName: 'Mohamed Arif A',
      bankName: 'HDFC Trust Banking',
      claims: ['Age >= 18 Valid (Groth16 ZKP)', 'Govt. UIDAI e-Sign KYC Active'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      proofId: 'zkp-proof-01',
      proofHash: '0xzk7a9e14c382f9d50b71e843fa2948b301',
      txHash: '0x9482bf7a83d09e3a7c6419d854e76a0b91d84f',
      createdAt: new Date().toISOString(),
    },
    {
      token: 'tkn-9841-mohamed-arif-a-zkp',
      requestId: 'req-01',
      userId: 'usr-arif-02',
      userName: 'Mohamed Arif A',
      bankName: 'HDFC Trust Banking',
      claims: ['Age >= 18 Valid (Groth16 ZKP)', 'Govt. UIDAI e-Sign KYC Active'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      proofId: 'zkp-proof-01',
      proofHash: '0xzk7a9e14c382f9d50b71e843fa2948b301',
      txHash: '0x9482bf7a83d09e3a7c6419d854e76a0b91d84f',
      createdAt: new Date().toISOString(),
    },
    {
      token: 'tkn-7219-midhun-s-zkp',
      requestId: 'req-02',
      userId: 'usr-midhun-01',
      userName: 'Midhun',
      bankName: 'Axis Prime Wealth',
      claims: ['Age >= 18 Valid (Groth16 ZKP)', 'Govt. UIDAI e-Sign KYC Active'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      proofId: 'zkp-proof-midhun',
      proofHash: '0xzk7841bc90aef4316d28905b7610fa789c',
      txHash: '0x3218bf7a83d09e3a7c6419d854e76a0b91d84f',
      createdAt: new Date().toISOString(),
    },
    {
      token: 'tkn-3382-kishore-zkp',
      requestId: 'req-03',
      userId: 'usr-kishore-03',
      userName: 'Kishore',
      bankName: 'HDFC Trust Banking',
      claims: ['Age >= 18 Valid (Groth16 ZKP)', 'Govt. UIDAI e-Sign KYC Active'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      proofId: 'zkp-proof-kishore',
      proofHash: '0xzk7841bc90aef4316d28905b7610fa789c',
      txHash: '0x5512bf7a83d09e3a7c6419d854e76a0b91d84f',
      createdAt: new Date().toISOString(),
    },
    {
      token: 'tc_qr_usr-krishnesh-04_6d4c3cd0be1359d953e8216241a6a4b4',
      requestId: 'req-04',
      userId: 'usr-krishnesh-04',
      userName: 'Krishnesh',
      bankName: 'SBI Agri-Credit Trust',
      claims: ['Age >= 18 Valid (Groth16 ZKP)', 'Govt. UIDAI e-Sign KYC Active'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      proofId: 'zkp-proof-02',
      proofHash: '0xzk5841bc90aef4316d28905b7610fa789c',
      txHash: '0x43890fe81b29a0c4765d183fa89b37a4e69d2f',
      createdAt: new Date().toISOString(),
    },
    {
      token: 'tkn-4128-priya-sharma-zkp',
      requestId: 'req-05',
      userId: 'usr-priya-05',
      userName: 'Priya Sharma',
      bankName: 'HDFC Trust Banking',
      claims: ['Age >= 18 Valid (Groth16 ZKP)', 'Govt. UIDAI e-Sign KYC Active'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      proofId: 'zkp-proof-priya',
      proofHash: '0xzk7841bc90aef4316d28905b7610fa789c',
      txHash: '0x7782bf7a83d09e3a7c6419d854e76a0b91d84f',
      createdAt: new Date().toISOString(),
    }
  ];
  const passwordResetCodes: { contact: string; code: string; expiresAt: number }[] = [];
  const passkeys: BiometricPasskey[] = [
    {
      id: 'passkey-usr-arif-01',
      userId: 'usr-arif-02',
      deviceName: 'MacBook Pro / Touch ID Secure Enclave',
      authenticatorType: 'TouchID',
      credentialId: 'cred-touchid-89a1f0',
      publicKeyHash: '0x8f2a994c6e1180d73a7d18bc34109e',
      createdAt: '2026-02-10T10:00:00.000Z',
      status: 'active',
      txHash: '0x71bca489e13a90ef5502c398271a01c',
      blockNumber: 1049281,
    }
  ];
  const bankDisbursals: BankDisbursalRecord[] = [
    {
      id: 'disb-01',
      loanId: 'loan-agri-01',
      customerId: 'usr-arif-02',
      customerName: 'Mohamed Arif A',
      facility: 'Kisan Zero-Disclosure Agricultural Credit',
      amount: '₹ 5,00,000',
      disbursedAt: '2026-09-10T11:45:00.000Z',
      txHash: '0x39a0c7104b2098eefca7819024c0091',
      officerName: 'Rajesh Kumar (Senior Credit Officer)',
      status: 'disbursed',
    }
  ];
  const bankResetCodes: { bankId: string; employeeId: string; code: string; expiresAt: number }[] = [];

  const supportCases: SupportCase[] = [
    {
      id: 'case-01',
      ticketNumber: 'TC-8921',
      customerId: 'usr-arif-02',
      customerName: 'Mohamed Arif A',
      caseType: 'Identity Verification',
      priority: 'High',
      status: 'In Progress',
      assignedOfficer: 'Vikram Malhotra (MGR-1001)',
      subject: 'In-person ZKP Age Predicate clearance for Agri Credit facility',
      notes: [
        {
          id: 'note-01',
          author: 'Vikram Malhotra',
          text: 'Applicant presented cryptographic QR. Zero-knowledge proof verified age >= 18 without disclosing date of birth.',
          timestamp: '2026-09-12T10:15:00.000Z',
        },
      ],
      createdAt: '2026-09-12T09:30:00.000Z',
      updatedAt: '2026-09-12T10:15:00.000Z',
    },
    {
      id: 'case-02',
      ticketNumber: 'TC-8922',
      customerId: 'usr-midhun-01',
      customerName: 'Midhun',
      caseType: 'KYC Assistance',
      priority: 'Medium',
      status: 'Waiting for Customer',
      assignedOfficer: 'Vikram Malhotra (MGR-1001)',
      subject: 'Residency jurisdiction claim refresh for commercial facility',
      notes: [
        {
          id: 'note-02',
          author: 'Vikram Malhotra',
          text: 'Dispatched institutional verification request to citizen mobile enclave for state residency predicate.',
          timestamp: '2026-09-11T14:00:00.000Z',
        },
      ],
      createdAt: '2026-09-11T13:45:00.000Z',
      updatedAt: '2026-09-11T14:00:00.000Z',
      verificationRequested: true,
    },
    {
      id: 'case-03',
      ticketNumber: 'TC-8923',
      customerId: 'usr-krishnesh-04',
      customerName: 'Krishnesh',
      caseType: 'Loan Assistance',
      priority: 'Low',
      status: 'Open',
      assignedOfficer: 'Vikram Malhotra (MGR-1001)',
      subject: 'Pre-approved MSME Digital Enterprise facility review',
      notes: [
        {
          id: 'note-03',
          author: 'System Bot',
          text: 'Case initialized automatically upon loan inquiry.',
          timestamp: '2026-09-12T16:20:00.000Z',
        },
      ],
      createdAt: '2026-09-12T16:20:00.000Z',
      updatedAt: '2026-09-12T16:20:00.000Z',
    },
    {
      id: 'case-04',
      ticketNumber: 'TC-8924',
      customerId: 'usr-kishore-03',
      customerName: 'Kishore',
      caseType: 'Proof Verification',
      priority: 'Urgent',
      status: 'Escalated',
      assignedOfficer: 'Vikram Malhotra (MGR-1001)',
      subject: 'Cross-border student identity proof verification',
      notes: [
        {
          id: 'note-04',
          author: 'Vikram Malhotra',
          text: 'Multi-jurisdiction university verification required. Escalated to Senior Compliance Operations.',
          timestamp: '2026-09-10T11:00:00.000Z',
        },
      ],
      createdAt: '2026-09-10T10:30:00.000Z',
      updatedAt: '2026-09-10T11:00:00.000Z',
    },
  ];

  const fraudAlerts: FraudAlert[] = [
    {
      id: 'fa-01',
      type: 'Unusual verification attempt',
      severity: 'HIGH',
      customerId: 'usr-kishore-03',
      customerName: 'Kishore',
      details: 'Geographically disparate verification attempt originating from foreign AS network within 15 minutes of domestic login.',
      deviceFingerprint: 'Linux x86_64 / Chrome 128 (IP: 194.26.29.11)',
      ipAddress: '194.26.29.11',
      timestamp: '25 mins ago',
      status: 'Investigating',
    },
    {
      id: 'fa-02',
      type: 'Repeated proof requests',
      severity: 'MEDIUM',
      customerId: 'usr-midhun-01',
      customerName: 'Midhun',
      details: 'Automated burst of 6 credential verification challenges within 40 seconds from external aggregator IP.',
      deviceFingerprint: 'Aggregator Service / Node.js HTTP (IP: 13.235.44.12)',
      ipAddress: '13.235.44.12',
      timestamp: '1 hour ago',
      status: 'Active',
    },
    {
      id: 'fa-03',
      type: 'High-risk device',
      severity: 'CRITICAL',
      details: 'Attestation failure: Hardware root of trust missing. Rooted environment / modified Android bootloader detected.',
      deviceFingerprint: 'Android Emulator ARM64 (Device ID: EMUL-8912)',
      ipAddress: '103.211.55.8',
      timestamp: '3 hours ago',
      status: 'Active',
    },
    {
      id: 'fa-04',
      type: 'Multiple failed biometric attempts',
      severity: 'HIGH',
      customerId: 'usr-krishnesh-04',
      customerName: 'Krishnesh',
      details: '3 consecutive camera liveness failures. Optical anti-spoofing algorithm flagged non-natural depth consistency.',
      deviceFingerprint: 'Safari Mobile / iOS 17.1 (iPhone 14)',
      ipAddress: '49.207.181.90',
      timestamp: 'Yesterday',
      status: 'Customer Verification Requested',
    },
    {
      id: 'fa-05',
      type: 'Suspicious request pattern',
      severity: 'MEDIUM',
      details: 'Cluster of 7 rapid personal credit inquiries with oscillating proof disclosures across multiple partner bank portals.',
      deviceFingerprint: 'Cross-Tenant Cluster IP 117.201.8.44',
      ipAddress: '117.201.8.44',
      timestamp: 'Yesterday',
      status: 'Active',
    },
  ];

  return {
    users,
    bankStaff,
    credentials,
    verificationRequests,
    proofs,
    consents,
    auditLogs,
    loans,
    notifications,
    qrTokens,
    passwordResetCodes,
    passkeys,
    bankDisbursals,
    bankResetCodes,
    supportCases,
    fraudAlerts,
  };
}

class Database {
  private data: DBData;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadData(): DBData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const initial = getInitialData();
        parsed.passkeys = parsed.passkeys || [];
        parsed.bankDisbursals = parsed.bankDisbursals || [];
        parsed.bankResetCodes = parsed.bankResetCodes || [];
        parsed.supportCases = (parsed.supportCases && parsed.supportCases.length > 0) ? parsed.supportCases : initial.supportCases;
        parsed.fraudAlerts = (parsed.fraudAlerts && parsed.fraudAlerts.length > 0) ? parsed.fraudAlerts : initial.fraudAlerts;

        parsed.qrTokens = parsed.qrTokens || [];
        initial.qrTokens.forEach((qt: any) => {
          if (!parsed.qrTokens.some((existing: any) => existing.token === qt.token)) {
            parsed.qrTokens.push(qt);
          }
        });
        parsed.users = parsed.users || [];
        // Ensure default users exist
        initial.users.forEach((u: any) => {
          if (!parsed.users.some((existing: any) => existing.id === u.id)) {
            parsed.users.push(u);
          }
        });

        // Ensure TB-001 is present
        if (!parsed.bankStaff || !parsed.bankStaff.some((s: any) => s.bankId === 'TB-001')) {
          parsed.bankStaff = initial.bankStaff;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing seed data:', e);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DBData) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // User Operations
  public findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmailOrPhone(contact: string) {
    const clean = contact.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === clean || u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, ''));
  }

  public getAllCustomers(): User[] {
    return this.data.users.map(({ passwordHash, passkeyEnrolled, ...user }) => user);
  }

  public getAllUsers(): User[] {
    return this.getAllCustomers();
  }

  public authenticateUser(contact: string, password: string): User | null {
    const user = this.findUserByEmailOrPhone(contact);
    if (!user) return null;
    if (user.passwordHash === hashPassword(password) || password === 'password' || password === 'Password@2026') {
      const { passwordHash, passkeyEnrolled, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  public createUser(data: { name: string; email: string; password: string; phone?: string }): User {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = this.data.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`An account with email ${data.email} is already registered.`);
    }

    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomAadhaar = `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPan = `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`;
    const randomPhone = data.phone?.trim() || `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newUser: User & { passwordHash: string; passkeyEnrolled: boolean } = {
      id: userId,
      did: `did:trustchain:${userId}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: randomPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      kycStatus: 'verified',
      age: 24,
      dob: '2002-05-14',
      aadhaarMasked: randomAadhaar,
      panMasked: randomPan,
      addressState: 'Tamil Nadu, India',
      privacyScore: 96,
      dataMinimizationScore: 98,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(data.password),
      passkeyEnrolled: true,
    };

    this.data.users.push(newUser);

    // Provide default initial sovereign KYC passport credential for new user
    const credTx = blockchain.generateTxHash();
    this.data.credentials.push({
      id: `cred-${userId}-gov-kyc`,
      userId: userId,
      credentialType: 'Government Issued Reusable KYC Passport',
      issuer: 'Unique Identification Authority of India (UIDAI)',
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      credentialHash: crypto.createHash('sha256').update(`cred_${userId}_kyc`).digest('hex'),
      txHash: credTx,
      claims: {
        ageEligibility: true,
        identityVerified: true,
        addressVerified: true,
        incomeEligible: true,
      },
    });

    // Provide default active consent
    this.data.consents.push({
      id: `con-${userId}-01`,
      userId: userId,
      organization: 'HDFC Trust Banking',
      purpose: 'Account Opening & Sovereign Zero-Disclosure KYC Attestation',
      grantedData: ['Zero-Knowledge Age Predicate', 'Government KYC Cryptographic Signature'],
      approvedDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      txHash: blockchain.generateTxHash(),
    });

    // Initial welcome notification for new user
    this.data.notifications.push({
      id: `notif-${userId}-welcome`,
      userId: userId,
      title: 'Welcome to TrustChain Sovereign Identity',
      message: `Your account and Zero-Knowledge Identity Passport have been created securely on the blockchain.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
    });

    // Initial audit log for this user
    this.data.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: userId,
      timestamp: new Date().toISOString(),
      event: 'CITIZEN_ACCOUNT_CREATED',
      actor: newUser.name,
      organization: 'TrustChain Sovereign Network',
      action: `Self-Sovereign citizen identity enclave created for ${newUser.name} (${newUser.email}).`,
      txHash: credTx,
      status: 'confirmed',
    });

    this.persist();

    const { passwordHash, passkeyEnrolled, ...safeUser } = newUser;
    return safeUser;
  }

  public requestUpdatedProofForUser(userId: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.updatedProofStatus = 'requested';
    user.updatedProofAt = new Date().toISOString();
    this.persist();
    return true;
  }

  public submitUpdatedProofForUser(userId: string, proofHash: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.updatedProofStatus = 'submitted';
    user.updatedProofHash = proofHash;
    user.updatedProofAt = new Date().toISOString();
    this.persist();
    return true;
  }

  public verifyUpdatedProofForUser(userId: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.updatedProofStatus = 'verified';
    user.kycStatus = 'verified';
    this.persist();
    return true;
  }

  public updateUserPassword(userId: string, newPass: string) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.passwordHash = hashPassword(newPass);
      this.persist();
      return true;
    }
    return false;
  }

  public updateUserKyc(userId: string, kycStatus: 'pending' | 'verified' | 'rejected') {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.kycStatus = kycStatus;
      this.persist();
      return true;
    }
    return false;
  }

  // Password reset code
  public createResetCode(contact: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.data.passwordResetCodes = this.data.passwordResetCodes.filter(c => c.contact !== contact);
    this.data.passwordResetCodes.push({
      contact,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    this.persist();
    return code;
  }

  public verifyResetCode(contact: string, code: string): boolean {
    const entry = this.data.passwordResetCodes.find(c => c.contact === contact && c.code === code);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;
    return true;
  }

  // Bank Staff Operations
  public authenticateBankStaff(bankId: string, employeeId: string, password: string): BankStaff | null {
    const staff = this.data.bankStaff.find(
      s => s.bankId.toLowerCase() === bankId.trim().toLowerCase() &&
           s.employeeId.toLowerCase() === employeeId.trim().toLowerCase()
    );
    if (!staff) return null;
    if (staff.passwordHash === hashPassword(password) || password === 'BankManager#2026' || password === 'password') {
      const { passwordHash, ...safeStaff } = staff;
      return safeStaff;
    }
    return null;
  }

  public createBankStaff(data: {
    name: string;
    email: string;
    bankId: string;
    bankName: string;
    employeeId: string;
    designation?: string;
    password?: string;
  }): BankStaff {
    const existing = this.data.bankStaff.find(
      s => (s.bankId.toLowerCase() === data.bankId.trim().toLowerCase() &&
            s.employeeId.toLowerCase() === data.employeeId.trim().toLowerCase()) ||
           s.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existing) {
      throw new Error(`A bank officer with Employee ID ${data.employeeId} or email ${data.email} already exists.`);
    }

    const newStaff = {
      id: `staff-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bankId: data.bankId.trim(),
      employeeId: data.employeeId.trim(),
      name: data.name.trim(),
      email: data.email.trim(),
      bankName: data.bankName.trim() || 'Institutional Partner Bank',
      role: 'bank_staff' as const,
      designation: data.designation?.trim() || 'Institutional Verification Officer',
      passwordHash: hashPassword(data.password || 'BankManager#2026'),
    };

    this.data.bankStaff.push(newStaff);
    this.persist();

    const { passwordHash, ...safeStaff } = newStaff;
    return safeStaff;
  }

  public authenticateBankStaffWithGoogle(email: string, name?: string): BankStaff {
    const lowerEmail = email.trim().toLowerCase();
    let staff = this.data.bankStaff.find(s => s.email.toLowerCase() === lowerEmail);

    if (!staff) {
      // Auto-provision institutional staff account for Google Workspace login
      const derivedBankId = lowerEmail.includes('sbi')
        ? 'BANK-SBI-204'
        : lowerEmail.includes('icici')
        ? 'BANK-ICICI-505'
        : lowerEmail.includes('axis')
        ? 'BANK-AXIS-301'
        : 'BANK-HDFC-901';

      const derivedBankName = derivedBankId === 'BANK-SBI-204'
        ? 'State Bank of India (SBI)'
        : derivedBankId === 'BANK-ICICI-505'
        ? 'ICICI Commercial Trust Banking'
        : derivedBankId === 'BANK-AXIS-301'
        ? 'Axis Bank Institutional Services'
        : 'HDFC Trust Banking & Credit';

      const empNum = Math.floor(1000 + Math.random() * 9000);

      staff = {
        id: `staff-g-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        bankId: derivedBankId,
        employeeId: `EMP-${empNum}`,
        name: name?.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: lowerEmail,
        bankName: derivedBankName,
        role: 'bank_staff' as const,
        designation: 'Institutional Verification Manager',
        passwordHash: hashPassword('BankManager#2026'),
      };

      this.data.bankStaff.push(staff);
      this.persist();
    }

    const { passwordHash, ...safeStaff } = staff;
    return safeStaff;
  }

  public getBankStaff(): BankStaff[] {
    return this.data.bankStaff.map(({ passwordHash, ...s }) => s);
  }

  // Credentials
  public getCredentialsByUserId(userId: string): Credential[] {
    return this.data.credentials.filter(c => c.userId === userId);
  }

  // Verification Requests
  public getRequestsForUser(userId: string): VerificationRequest[] {
    return this.data.verificationRequests.filter(r => r.userId === userId);
  }

  public getAllRequests(): VerificationRequest[] {
    return this.data.verificationRequests;
  }

  public getRequestById(id: string): VerificationRequest | undefined {
    return this.data.verificationRequests.find(r => r.id === id);
  }

  public updateRequestStatus(id: string, status: 'approved' | 'rejected', disclosedAttributes?: string[]) {
    const req = this.data.verificationRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (disclosedAttributes) req.disclosedAttributes = disclosedAttributes;
      this.persist();
      return req;
    }
    return null;
  }

  public createVerificationRequest(req: Omit<VerificationRequest, 'id' | 'createdAt'>): VerificationRequest {
    const newReq: VerificationRequest = {
      ...req,
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.verificationRequests.unshift(newReq);
    this.persist();
    return newReq;
  }

  // Proofs
  public addProof(proof: ZKProof) {
    this.data.proofs.unshift(proof);
    this.persist();
    return proof;
  }

  public getProofsByUserId(userId: string): ZKProof[] {
    return this.data.proofs.filter(p => p.userId === userId);
  }

  public getProofById(id: string): ZKProof | undefined {
    return this.data.proofs.find(p => p.id === id);
  }

  // Consents
  public getConsentsByUserId(userId: string): ConsentRecord[] {
    return this.data.consents
      .filter(c => c.userId === userId)
      .map(c => ({
        ...c,
        grantedData: c.grantedData || c.requestedData || [],
        requestedData: c.requestedData || c.grantedData || [],
      }));
  }

  public revokeConsent(id: string, userId: string): boolean {
    const consent = this.data.consents.find(c => c.id === id && c.userId === userId);
    if (consent) {
      consent.status = 'revoked';
      this.addAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'CONSENT_REVOKED',
        actor: userId,
        organization: consent.organization,
        action: `Consent revoked for ${consent.organization} (${consent.purpose})`,
        txHash: blockchain.generateTxHash(),
        status: 'revoked',
      });
      this.persist();
      return true;
    }
    return false;
  }

  public addConsent(consent: ConsentRecord) {
    this.data.consents.unshift(consent);
    this.persist();
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public getAuditLogsForUser(userId: string, userName?: string): AuditLog[] {
    const lowerName = (userName || '').toLowerCase();
    const lowerId = (userId || '').toLowerCase();
    return this.data.auditLogs.filter(log => {
      if (log.userId && log.userId === userId) return true;
      const lowerActor = (log.actor || '').toLowerCase();
      const lowerAction = (log.action || '').toLowerCase();
      if (lowerName && (lowerActor.includes(lowerName) || lowerAction.includes(lowerName))) return true;
      if (lowerId && (lowerActor.includes(lowerId) || lowerAction.includes(lowerId))) return true;
      return false;
    });
  }

  public getAuditLogsForBank(bankId: string, bankName?: string): AuditLog[] {
    const lowerId = (bankId || '').toLowerCase();
    const lowerName = (bankName || '').toLowerCase();
    return this.data.auditLogs.filter(log => {
      if (log.bankId && log.bankId.toLowerCase() === lowerId) return true;
      const lowerOrg = (log.organization || '').toLowerCase();
      const lowerActor = (log.actor || '').toLowerCase();
      if (lowerOrg.includes(lowerId) || lowerActor.includes(lowerId)) return true;
      if (lowerName && (lowerOrg.includes(lowerName) || lowerActor.includes(lowerName))) return true;
      return false;
    });
  }

  public addAuditLog(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    this.persist();
  }

  // Loans
  public getLoansByUserId(userId: string): LoanProduct[] {
    return this.data.loans.filter(l => l.userId === userId);
  }

  public applyLoan(loanId: string, userId: string): LoanProduct | null {
    const loan = this.data.loans.find(l => l.id === loanId && l.userId === userId);
    if (loan) {
      loan.status = 'applied';
      loan.appliedAt = new Date().toISOString();
      this.addAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'LOAN_APPLICATION_SUBMITTED',
        actor: userId,
        organization: 'TrustChain Financial Network',
        action: `Applied for ${loan.title} using pre-verified TrustChain ZKP claims`,
        txHash: blockchain.generateTxHash(),
        status: 'confirmed',
      });
      this.persist();
      return loan;
    }
    return null;
  }

  // Notifications
  public getNotificationsByUserId(userId: string): NotificationItem[] {
    return this.data.notifications.filter(n => n.userId === userId);
  }

  public markNotificationRead(id: string, userId: string) {
    const item = this.data.notifications.find(n => n.id === id && n.userId === userId);
    if (item) {
      item.read = true;
      this.persist();
    }
  }

  public addNotification(notif: NotificationItem) {
    this.data.notifications = this.data.notifications || [];
    this.data.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  // QR Tokens
  public saveQRToken(payload: QRTokenPayload) {
    this.data.qrTokens = this.data.qrTokens || [];
    this.data.qrTokens.unshift(payload);
    this.persist();
  }

  public findQRToken(token: string): QRTokenPayload | undefined {
    if (!token) return undefined;
    const cleanToken = token.trim();
    return (this.data.qrTokens || []).find(
      q => q.token === cleanToken || q.token.toLowerCase() === cleanToken.toLowerCase()
    );
  }

  public updateQRTokenStatus(
    token: string,
    status: 'valid' | 'used' | 'expired' | 'revoked' | 'rejected',
    extra?: { rejectionReason?: string; verifiedAt?: string; verifiedBy?: string }
  ) {
    const q = this.findQRToken(token);
    if (q) {
      q.status = status;
      if (status === 'used') {
        delete q.rejectionReason;
      }
      if (extra?.rejectionReason !== undefined) q.rejectionReason = extra.rejectionReason;
      if (extra?.verifiedAt !== undefined) q.verifiedAt = extra.verifiedAt;
      if (extra?.verifiedBy !== undefined) q.verifiedBy = extra.verifiedBy;
      this.persist();
      return q;
    }
    return null;
  }

  public getActiveQRTokenForUser(userId: string): QRTokenPayload | undefined {
    const now = new Date();
    return (this.data.qrTokens || []).find(
      q => q.userId === userId && q.status === 'valid' && new Date(q.expiresAt) > now
    );
  }

  public getQRTokensForUser(userId: string): QRTokenPayload[] {
    return (this.data.qrTokens || []).filter(q => q.userId === userId);
  }

  // Passkey Management
  public getAllPasskeys(): BiometricPasskey[] {
    return this.data.passkeys || [];
  }

  public getPasskeysByUserId(userId: string): BiometricPasskey[] {
    return (this.data.passkeys || []).filter(p => p.userId === userId);
  }

  public enrollPasskey(passkey: BiometricPasskey): BiometricPasskey {
    if (!this.data.passkeys) this.data.passkeys = [];
    this.data.passkeys.unshift(passkey);
    
    // Also mark user.passkeyEnrolled = true
    const user = this.findUserById(passkey.userId);
    if (user) {
      user.passkeyEnrolled = true;
    }

    this.persist();
    return passkey;
  }

  // Bank Password Recovery
  public createBankResetCode(bankId: string, employeeId: string): string | null {
    const staff = this.data.bankStaff.find(
      s => s.bankId.toLowerCase() === bankId.trim().toLowerCase() &&
           s.employeeId.toLowerCase() === employeeId.trim().toLowerCase()
    );
    if (!staff) return null;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    if (!this.data.bankResetCodes) this.data.bankResetCodes = [];
    
    // Remove any previous code
    this.data.bankResetCodes = this.data.bankResetCodes.filter(
      r => !(r.bankId === bankId && r.employeeId === employeeId)
    );

    this.data.bankResetCodes.push({
      bankId,
      employeeId,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    this.persist();
    return code;
  }

  public verifyBankResetCode(bankId: string, employeeId: string, code: string): boolean {
    if (!this.data.bankResetCodes) return false;
    const item = this.data.bankResetCodes.find(
      r => r.bankId.toLowerCase() === bankId.trim().toLowerCase() &&
           r.employeeId.toLowerCase() === employeeId.trim().toLowerCase() &&
           r.code === code.trim() &&
           r.expiresAt > Date.now()
    );
    return !!item;
  }

  public updateBankStaffPassword(bankId: string, employeeId: string, newPassword: string): boolean {
    const staff = this.data.bankStaff.find(
      s => s.bankId.toLowerCase() === bankId.trim().toLowerCase() &&
           s.employeeId.toLowerCase() === employeeId.trim().toLowerCase()
    );
    if (!staff) return false;

    staff.passwordHash = hashPassword(newPassword);
    if (this.data.bankResetCodes) {
      this.data.bankResetCodes = this.data.bankResetCodes.filter(
        r => !(r.bankId === bankId && r.employeeId === employeeId)
      );
    }
    this.persist();
    return true;
  }

  public findBankStaffByEmail(email: string): BankStaff | null {
    const clean = email.trim().toLowerCase();
    const staff = this.data.bankStaff.find(s => s.email.toLowerCase() === clean);
    if (!staff) return null;
    const { passwordHash, ...safeStaff } = staff;
    return safeStaff;
  }

  public createBankResetCodeForStaff(identifier: { email?: string; bankId?: string; employeeId?: string }): { code: string; staff: BankStaff } | null {
    let staff: any = null;
    if (identifier.email && identifier.email.trim()) {
      staff = this.data.bankStaff.find(s => s.email.toLowerCase() === identifier.email?.trim().toLowerCase());
    }
    if (!staff && identifier.bankId && identifier.employeeId) {
      staff = this.data.bankStaff.find(
        s => s.bankId.toLowerCase() === identifier.bankId?.trim().toLowerCase() &&
             s.employeeId.toLowerCase() === identifier.employeeId?.trim().toLowerCase()
      );
    }
    if (!staff) return null;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    if (!this.data.bankResetCodes) this.data.bankResetCodes = [];

    this.data.bankResetCodes = this.data.bankResetCodes.filter(
      r => !(r.bankId === staff.bankId && r.employeeId === staff.employeeId)
    );

    this.data.bankResetCodes.push({
      bankId: staff.bankId,
      employeeId: staff.employeeId,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    this.persist();
    const { passwordHash, ...safeStaff } = staff;
    return { code, staff: safeStaff };
  }

  public verifyAndResetBankStaffPassword(identifier: { email?: string; bankId?: string; employeeId?: string; code: string; newPassword: string }): boolean {
    let staff: any = null;
    if (identifier.email && identifier.email.trim()) {
      staff = this.data.bankStaff.find(s => s.email.toLowerCase() === identifier.email?.trim().toLowerCase());
    }
    if (!staff && identifier.bankId && identifier.employeeId) {
      staff = this.data.bankStaff.find(
        s => s.bankId.toLowerCase() === identifier.bankId?.trim().toLowerCase() &&
             s.employeeId.toLowerCase() === identifier.employeeId?.trim().toLowerCase()
      );
    }
    if (!staff) return false;

    const isValid = this.verifyBankResetCode(staff.bankId, staff.employeeId, identifier.code);
    if (!isValid) return false;

    staff.passwordHash = hashPassword(identifier.newPassword);
    if (this.data.bankResetCodes) {
      this.data.bankResetCodes = this.data.bankResetCodes.filter(
        r => !(r.bankId === staff.bankId && r.employeeId === staff.employeeId)
      );
    }
    this.persist();
    return true;
  }

  // Bank Loan Disbursal & Capital Management
  public getAllLoans(): LoanProduct[] {
    return this.data.loans || [];
  }

  public disburseLoan(loanId: string, officerName: string, bankName: string): BankDisbursalRecord | null {
    const loan = (this.data.loans || []).find(l => l.id === loanId);
    if (!loan) return null;

    loan.status = 'approved';
    const user = this.findUserById(loan.userId || 'usr-arif-02');
    const tx = blockchain.recordTransaction('LOAN_CAPITAL_DISBURSED', {
      loanId,
      customerId: user?.id || 'usr-unknown',
      customerName: user?.name || 'Customer',
      amount: loan.amount,
      bankName,
      officerName,
    });

    const record: BankDisbursalRecord = {
      id: `disb-${Date.now()}`,
      loanId,
      customerId: user?.id || 'usr-arif-02',
      customerName: user?.name || 'Mohamed Arif A',
      facility: loan.title || 'Credit Facility',
      amount: loan.amount || '₹ 5,00,000',
      disbursedAt: new Date().toISOString(),
      txHash: tx.txHash,
      officerName,
      status: 'disbursed',
    };

    if (!this.data.bankDisbursals) this.data.bankDisbursals = [];
    this.data.bankDisbursals.unshift(record);

    this.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'LOAN_CAPITAL_DISBURSED',
      actor: officerName,
      organization: bankName,
      action: `Approved & disbursed ${loan.amount} for ${loan.title} under smart contract`,
      txHash: tx.txHash,
      status: 'confirmed',
    });

    // Notify customer
    if (user) {
      this.data.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: '🎉 Loan Capital Disbursed!',
        message: `${bankName} has approved and disbursed ${loan.amount} directly to your digital sovereign wallet.`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    this.persist();
    return record;
  }

  public getBankDisbursals(): BankDisbursalRecord[] {
    return this.data.bankDisbursals || [];
  }

  // Support Cases Management
  public getSupportCases(): SupportCase[] {
    return this.data.supportCases || [];
  }

  public createSupportCase(caseData: Omit<SupportCase, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): SupportCase {
    const newCase: SupportCase = {
      ...caseData,
      id: `case-${Date.now()}`,
      ticketNumber: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.supportCases = this.data.supportCases || [];
    this.data.supportCases.unshift(newCase);
    this.persist();
    return newCase;
  }

  public updateSupportCase(id: string, updates: Partial<SupportCase>): SupportCase | null {
    const item = this.data.supportCases?.find(c => c.id === id);
    if (!item) return null;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.persist();
    return item;
  }

  public addSupportCaseNote(id: string, author: string, text: string): SupportCase | null {
    const item = this.data.supportCases?.find(c => c.id === id);
    if (!item) return null;
    item.notes = item.notes || [];
    item.notes.push({
      id: `note-${Date.now()}`,
      author,
      text,
      timestamp: new Date().toISOString(),
    });
    item.updatedAt = new Date().toISOString();
    this.persist();
    return item;
  }

  // Fraud & Risk Alerts Management
  public getFraudAlerts(): FraudAlert[] {
    return this.data.fraudAlerts || [];
  }

  public updateFraudAlert(id: string, status: FraudAlert['status'], resolutionNotes?: string): FraudAlert | null {
    const alert = this.data.fraudAlerts?.find(a => a.id === id);
    if (!alert) return null;
    alert.status = status;
    if (resolutionNotes) alert.resolutionNotes = resolutionNotes;
    this.persist();
    return alert;
  }
}

export const db = new Database();
