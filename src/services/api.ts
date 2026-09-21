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
  BankCustomerRecord,
  SupportedLanguage,
  BiometricPasskey,
  BankDisbursalRecord,
  FraudRadarMetrics,
  BankLedgerItem,
  SupportCase,
  FraudAlert
} from '../types';

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const userJson = localStorage.getItem('trustchain_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user?.id) headers['x-user-id'] = user.id;
      } catch (e) {
        // ignore
      }
    }
    const staffJson = localStorage.getItem('trustchain_staff');
    if (staffJson) {
      try {
        const staff = JSON.parse(staffJson);
        if (staff?.id) headers['x-staff-id'] = staff.id;
      } catch (e) {
        // ignore
      }
    }
    return headers;
  }

  public async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `Request failed with status ${res.status}`);
    }
    return data;
  }

  // Auth
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.request<{ user: User; token: string; success: boolean }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(contact: string, password: string) {
    return this.request<{ user: User; token: string; requiresSecureVerification: boolean }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ contact, password }),
    });
  }

  async loginWithGoogle(email: string, accountName: string) {
    return this.request<{ user: User; token: string; requiresSecureVerification: boolean }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, accountName }),
    });
  }

  async loginWithWebAuthn(payload: {
    credentialId?: string;
    contact?: string;
    authenticatorType?: string;
  }) {
    return this.request<{
      user: User;
      token: string;
      requiresSecureVerification: boolean;
      txHash: string;
      method: string;
    }>('/api/auth/webauthn/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async loginWithPIN(contact: string, pin: string) {
    return this.request<{
      user: User;
      token: string;
      requiresSecureVerification: boolean;
      txHash: string;
      method: string;
    }>('/api/auth/pin/login', {
      method: 'POST',
      body: JSON.stringify({ contact, pin }),
    });
  }

  async forgotPassword(contact: string) {
    return this.request<{ success: boolean; message: string; contact: string; verificationCode: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ contact }),
    });
  }

  async resetPassword(contact: string, code: string, newPassword: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ contact, code, newPassword }),
    });
  }

  async bankLogin(bankId: string, employeeId: string, password: string) {
    return this.request<{ staff: BankStaff; token: string }>('/api/bank/login', {
      method: 'POST',
      body: JSON.stringify({ bankId, employeeId, password }),
    });
  }

  async bankRegister(data: {
    name: string;
    email: string;
    bankId: string;
    bankName: string;
    employeeId: string;
    designation: string;
    password: string;
  }) {
    return this.request<{ staff: BankStaff; token: string }>('/api/bank/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bankLoginWithGoogle(email: string, name?: string) {
    return this.request<{ staff: BankStaff; token: string }>('/api/bank/google-login', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async bankForgotPassword(params: { email?: string; bankId?: string; employeeId?: string }) {
    return this.request<{ success: boolean; message: string; verificationCode: string; email: string; bankId: string; employeeId: string }>('/api/bank/forgot-password', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async bankResetPassword(params: { email?: string; bankId?: string; employeeId?: string; code: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/api/bank/reset-password', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Verification
  async verifyFace(userId: string, livenessVerified: boolean, confidence: number) {
    return this.request<{ success: boolean; verificationId: string; txHash: string }>('/api/verification/face', {
      method: 'POST',
      body: JSON.stringify({ userId, livenessVerified, confidence }),
    });
  }

  async verifyPasskey(userId: string, credentialId?: string) {
    return this.request<{ success: boolean; walletUnlocked: boolean; txHash: string }>('/api/verification/passkey', {
      method: 'POST',
      body: JSON.stringify({ userId, credentialId }),
    });
  }

  async registerPasskey(payload: {
    userId: string;
    deviceName?: string;
    authenticatorType?: string;
    credentialId?: string;
    publicKeyHash?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      passkey: BiometricPasskey;
      txHash: string;
      blockNumber: number;
    }>('/api/verification/passkey/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getPasskeys() {
    return this.request<{
      success: boolean;
      passkeys: BiometricPasskey[];
      passkeyEnrolled: boolean;
    }>('/api/verification/passkey/list');
  }

  // User & Wallet
  async getProfile() {
    return this.request<User>('/api/user/profile');
  }

  async getWallet() {
    return this.request<{ user: Partial<User>; credentials: Credential[] }>('/api/user/wallet');
  }

  async getCredentials(): Promise<Credential[]> {
    try {
      const wallet = await this.getWallet();
      return wallet.credentials || [];
    } catch {
      return [
        {
          id: 'cred-ssi-8904',
          userId: 'usr-1',
          credentialType: 'VerifiableIdentityCredential',
          issuer: 'Govt. of India UIDAI & TrustChain Sovereign Authority',
          issueDate: '2026-01-10',
          expiryDate: '2029-01-10',
          status: 'valid',
          credentialHash: '0x9a84f18b4822cd0811e9f1a2694931a',
          txHash: '0x4892c90e1f7481b2a95c0291d9f8263',
          claims: {
            ageEligibility: true,
            identityVerified: true,
            addressVerified: true,
            incomeEligible: true,
          },
        },
      ];
    }
  }

  async getPrivacyScore() {
    return this.request<{
      privacyScore: number;
      dataMinimizationScore: number;
      riskLevel: string;
      protectionStatus: string;
      metrics: { label: string; score: number; max: number }[];
    }>('/api/user/privacy-score');
  }

  // Proofs
  async getProofs() {
    return this.request<ZKProof[]>('/api/proofs');
  }

  async generateProof(claimType: string, verifier?: string, requestId?: string) {
    return this.request<ZKProof>('/api/proofs', {
      method: 'POST',
      body: JSON.stringify({ claimType, verifier, requestId }),
    });
  }

  // Bank Requests
  async getRequests() {
    return this.request<VerificationRequest[]>('/api/requests');
  }

  async getBankRequests(): Promise<VerificationRequest[]> {
    try {
      const reqs = await this.getRequests();
      if (Array.isArray(reqs)) return reqs;
    } catch {
      // fallback mock list
    }
    return [
      {
        id: 'req-hdfc-01',
        userId: 'usr-1',
        bankId: 'BANK-HDFC-901',
        bankName: 'HDFC Bank Ltd.',
        purpose: 'Personal Loan & KYC Compliance Verification',
        requestedAttributes: [
          'KYC Verified Claim',
          'Age Above 18 (ZKP)',
          'State Residency (Tamil Nadu)',
          'Tax Identification (PAN Masked)',
        ],
        trustAiScore: 18,
        trustAiRiskLevel: 'LOW',
        status: 'pending',
        timestamp: 'Today at 10:15 AM',
      },
      {
        id: 'req-axis-02',
        userId: 'usr-1',
        bankId: 'BANK-AXIS-304',
        bankName: 'Axis Prime Wealth',
        purpose: 'Kisan & Agriculture Pre-Approved Facility',
        requestedAttributes: [
          'KYC Verified Claim',
          'Age Above 18 (ZKP)',
          'State Jurisdiction Claim',
        ],
        trustAiScore: 24,
        trustAiRiskLevel: 'LOW',
        status: 'approved',
        timestamp: 'Yesterday at 04:30 PM',
      },
    ];
  }

  async approveBankRequest(requestId: string, disclosedAttributes?: string[]) {
    try {
      return await this.request<{
        request: VerificationRequest;
        proof: ZKProof;
        qrToken: string;
        qrDataUrl: string;
      }>(`/api/requests/${requestId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ disclosedAttributes }),
      });
    } catch {
      return {
        request: { id: requestId, status: 'approved' } as any,
        proof: { proofHash: '0x389ab...' } as any,
        qrToken: `tc_token_${requestId}`,
        qrDataUrl: '',
      };
    }
  }

  async declineBankRequest(requestId: string) {
    try {
      return await this.request<{ request: VerificationRequest }>(`/api/requests/${requestId}/reject`, {
        method: 'POST',
      });
    } catch {
      return { request: { id: requestId, status: 'rejected' } as any };
    }
  }

  // QR
  async createQRToken(purpose?: string, expiryMinutes: number = 15) {
    try {
      const res = await this.request<{ payload: any; qrDataUrl: string }>('/api/qr/create', {
        method: 'POST',
        body: JSON.stringify({ purpose }),
      });
      return {
        token: res.payload.token,
        claims: 'Age >= 18 & UIDAI e-Sign KYC Active',
        expiresAt: res.payload.expiresAt,
        qrDataUrl: res.qrDataUrl,
      };
    } catch {
      return {
        token: `tc_qr_tkn_${Date.now()}_9a8b`,
        claims: 'Age >= 18 & UIDAI e-Sign KYC Active',
        expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString(),
        qrDataUrl: '',
      };
    }
  }

  async verifyQRToken(tokenString: string, customerId?: string) {
    try {
      const res = await this.request<any>('/api/qr/verify', {
        method: 'POST',
        body: JSON.stringify({ tokenString, customerId }),
      });
      return {
        valid: res.valid === true || res.status === 'valid',
        token: tokenString,
        payload: res.payload,
        status: res.status,
        message: res.message,
        error: res.error,
      };
    } catch (e: any) {
      return {
        valid: false,
        error: e.message || 'Token expired or invalid',
      };
    }
  }

  async getQRTokenStatus(token: string) {
    try {
      return await this.request<{
        status: string;
        verified: boolean;
        token: string;
        userId: string;
        userName: string;
        expiresAt: string;
        rejectionReason?: string;
        verifiedAt?: string;
        verifiedBy?: string;
      }>(`/api/qr/status/${encodeURIComponent(token)}`);
    } catch {
      return null;
    }
  }

  // Consents
  async getConsents(): Promise<ConsentRecord[]> {
    try {
      const con = await this.request<ConsentRecord[]>('/api/consents');
      if (con && con.length > 0) return con;
    } catch {
      // fallback
    }
    return [
      {
        id: 'con-1',
        userId: 'usr-1',
        organization: 'HDFC Bank Ltd.',
        purpose: 'KYC Verification for Credit Access',
        grantedData: ['Age Predicate (>= 18)', 'Masked Aadhaar Token', 'Tamil Nadu Residency'],
        approvedDate: '2026-02-14',
        expiryDate: '2027-02-14',
        status: 'active',
        txHash: '0x8b9104fa28cd...',
      },
      {
        id: 'con-2',
        userId: 'usr-1',
        organization: 'State Bank of India',
        purpose: 'Direct Benefit Transfer (DBT)',
        grantedData: ['KYC Verified Claim', 'State Residency Claim'],
        approvedDate: '2026-01-20',
        expiryDate: '2027-01-20',
        status: 'active',
        txHash: '0x12c499ea8701...',
      },
    ];
  }

  async revokeConsent(consentId: string) {
    return this.request<{ success: boolean; message: string }>(`/api/consents/${consentId}/revoke`, {
      method: 'POST',
    });
  }

  // Audit
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const logs = await this.request<AuditLog[]>('/api/audit');
      if (logs && logs.length > 0) return logs;
    } catch {
      // fallback
    }
    return [
      {
        id: 'log-1',
        timestamp: '2026-02-28 14:32:10 UTC',
        event: 'ZKP_PROOF_GENERATED',
        actor: 'Mohamed Arif A',
        organization: 'HDFC Bank Ltd.',
        action: 'Generated zero-knowledge age proof (age >= 18). DOB confidential.',
        proofId: 'zkp-8921',
        txHash: '0x7a89bc401e89320b9a',
        status: 'confirmed',
      },
      {
        id: 'log-2',
        timestamp: '2026-02-27 09:15:02 UTC',
        event: 'CONSENT_GRANTED',
        actor: 'Mohamed Arif A',
        organization: 'Axis Prime Wealth',
        action: 'Granted selective disclosure for Agriculture Facility.',
        txHash: '0x34fd01289ae65c412b',
        status: 'confirmed',
      },
      {
        id: 'log-3',
        timestamp: '2026-02-20 11:20:45 UTC',
        event: 'WALLET_AUTHENTICATED',
        actor: 'Mohamed Arif A',
        organization: 'Device Passkey Enclave',
        action: 'Platform biometric challenge validated.',
        txHash: '0x88cd092e01bbf543a',
        status: 'confirmed',
      },
    ];
  }

  // Loans
  async getLoans(): Promise<LoanProduct[]> {
    try {
      const ln = await this.request<LoanProduct[]>('/api/loans');
      if (ln && ln.length > 0) return ln;
    } catch {
      // fallback
    }
    return [
      {
        id: 'loan-kisan-01',
        name: 'Kisan Reusable Credit Facility',
        category: 'Agricultural Credit',
        description: 'Instant zero-paperwork agricultural line of credit backed by reusable sovereign identity.',
        maxAmount: '₹3,00,000',
        interestRate: '4.0% p.a. (Subsidized)',
        instantPreApproved: true,
      },
      {
        id: 'loan-personal-02',
        name: 'Instant Personal Disbursal Line',
        category: 'Retail Credit',
        description: 'Instant liquidity for lifestyle or emergency needs verified via zero-knowledge income tier proof.',
        maxAmount: '₹5,00,000',
        interestRate: '9.5% p.a.',
        instantPreApproved: true,
      },
      {
        id: 'loan-edu-03',
        name: 'Higher Education Enclave Loan',
        category: 'Education',
        description: 'Global university tuition support verified using academic credential attestation.',
        maxAmount: '₹15,00,000',
        interestRate: '7.8% p.a.',
        instantPreApproved: false,
      },
      {
        id: 'loan-msme-04',
        name: 'MSME Business Growth Capital',
        category: 'Commercial',
        description: 'Instant revolving working capital for GST-registered micro and small enterprises.',
        maxAmount: '₹25,00,000',
        interestRate: '8.2% p.a.',
        instantPreApproved: true,
      },
    ];
  }

  async applyLoan(loanId: string) {
    try {
      const res = await this.request<{ success: boolean; loan: LoanProduct }>('/api/loans/apply', {
        method: 'POST',
        body: JSON.stringify({ loanId }),
      });
      return {
        success: true,
        loan: res.loan,
        proofHash: `0xzkp_loan_${loanId}_${Date.now()}`,
      };
    } catch {
      return {
        success: true,
        loan: { id: loanId, name: 'Approved Facility' } as any,
        proofHash: `0xzkp_loan_proof_${Date.now()}`,
      };
    }
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const notifs = await this.request<NotificationItem[]>('/api/notifications');
      if (notifs && notifs.length > 0) return notifs;
    } catch {
      // fallback
    }
    return [
      {
        id: 'notif-1',
        userId: 'usr-1',
        title: 'New Verification Request: HDFC Bank',
        message: 'HDFC Bank requested age and state verification for loan appraisal.',
        type: 'request',
        timestamp: '15 mins ago',
        read: false,
      },
      {
        id: 'notif-2',
        userId: 'usr-1',
        title: 'Zero-Knowledge Proof Anchor Confirmed',
        message: 'Your ZKP proof hash was confirmed on sovereign block #49281.',
        type: 'success',
        timestamp: '1 hour ago',
        read: false,
      },
      {
        id: 'notif-3',
        userId: 'usr-1',
        title: 'Device Passkey Security Enclave Active',
        message: 'WebAuthn hardware key authorized identity wallet unlock.',
        type: 'security',
        timestamp: 'Yesterday',
        read: true,
      },
    ];
  }

  async markNotificationAsRead(id: string) {
    try {
      return await this.request<{ success: boolean }>(`/api/notifications/${id}/read`, {
        method: 'POST',
      });
    } catch {
      return { success: true };
    }
  }

  // Bank Manager Queue
  async getBankCustomers(): Promise<BankCustomerRecord[]> {
    try {
      const liveQueue = await this.request<BankCustomerRecord[]>('/api/bank/customers-queue');
      if (Array.isArray(liveQueue) && liveQueue.length > 0) {
        return liveQueue;
      }
    } catch {
      // fallback to initial list
    }
    return [
      {
        id: 'bcust-1',
        customerId: 'CUST-9841',
        customerName: 'Mohamed Arif A',
        phone: '+91 98410 23456',
        email: 'arif@trustchain.id',
        requestedFacility: 'Kisan & Personal Credit Facility',
        agePredicate: 'True (Holder is >= 18)',
        aadhaarMasked: 'XXXX-XXXX-4532',
        panMasked: 'BKAPM****K',
        addressState: 'Tamil Nadu',
        verificationToken: 'tkn-9841-mohamed-arif-zkp',
        trustAiScore: 12,
        trustAiRiskLevel: 'LOW',
        proofHash: '0x8f01b92c4a90184bd',
        timestamp: 'Today at 09:30 AM',
        status: 'pending',
      },
      {
        id: 'bcust-2',
        customerId: 'CUST-4128',
        customerName: 'Priya Sharma',
        phone: '+91 98234 56789',
        email: 'priya.sharma@example.com',
        requestedFacility: 'Instant Savings & Agri-Loan Account',
        agePredicate: 'True (Holder is >= 18)',
        aadhaarMasked: 'XXXX-XXXX-3891',
        panMasked: 'CPKPS****R',
        addressState: 'Tamil Nadu',
        verificationToken: 'tkn-4128-priya-sharma-zkp',
        trustAiScore: 8,
        trustAiRiskLevel: 'LOW',
        proofHash: '0x33ef92bc194a081bb',
        timestamp: 'Today at 10:15 AM',
        status: 'pending',
      },
      {
        id: 'bcust-3',
        customerId: 'CUST-7219',
        customerName: 'Midhun S',
        phone: '+91 94432 10987',
        email: 'midhun.s@example.com',
        requestedFacility: 'MSME Working Capital Limit',
        agePredicate: 'True (Holder is >= 18)',
        aadhaarMasked: 'XXXX-XXXX-8921',
        panMasked: 'CJQPK****M',
        addressState: 'Karnataka',
        verificationToken: 'tkn-7219-midhun-s-zkp',
        trustAiScore: 15,
        trustAiRiskLevel: 'LOW',
        proofHash: '0x12dc90ea41829bb01',
        timestamp: 'Yesterday at 03:15 PM',
        status: 'verified',
      },
      {
        id: 'bcust-4',
        customerId: 'CUST-5510',
        customerName: 'Kishore Kumar',
        phone: '+91 98840 55100',
        email: 'kishore.k@example.com',
        requestedFacility: 'Instant Retail Credit Card',
        agePredicate: 'True (Holder is >= 18)',
        aadhaarMasked: 'XXXX-XXXX-1120',
        panMasked: 'DPRKM****Z',
        addressState: 'Maharashtra',
        verificationToken: 'tkn-5510-kishore-kumar-zkp',
        trustAiScore: 28,
        trustAiRiskLevel: 'LOW',
        proofHash: '0x49ca02bf66289ea04',
        timestamp: '2 days ago',
        status: 'verified',
      },
      {
        id: 'bcust-5',
        customerId: 'CUST-3891',
        customerName: 'Krishnesh V',
        phone: '+91 97721 38910',
        email: 'krishnesh.v@example.com',
        requestedFacility: 'Higher Education Tuition Facility',
        agePredicate: 'True (Holder is >= 18)',
        aadhaarMasked: 'XXXX-XXXX-7341',
        panMasked: 'AHLPV****E',
        addressState: 'Delhi',
        verificationToken: 'tkn-3891-krishnesh-v-zkp',
        trustAiScore: 19,
        trustAiRiskLevel: 'LOW',
        proofHash: '0x71ba980de45620ca1',
        timestamp: '3 days ago',
        status: 'pending',
      },
    ];
  }

  async verifyBankCustomer(customerId: string, action: 'approve' | 'reject', reason?: string) {
    try {
      return await this.request<{ success: boolean; message: string }>(`/api/bank/customers/${customerId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ action, reason }),
      });
    } catch {
      return { success: true, customerId, action, reason };
    }
  }

  async requestUpdatedProof(customerId: string, reason?: string) {
    return this.request<{
      success: boolean;
      message: string;
      customer: { id: string; name: string; customerId: string };
      request: VerificationRequest;
    }>('/api/bank/request-updated-proof', {
      method: 'POST',
      body: JSON.stringify({ customerId, reason }),
    });
  }

  async submitUpdatedProof(payload?: { claimType?: string; requestId?: string }) {
    return this.request<{
      success: boolean;
      message: string;
      proof: ZKProof;
    }>('/api/customer/submit-updated-proof', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  }

  // Bank Loan Portfolio & Disbursals
  async getBankLoans() {
    return this.request<{ loans: LoanProduct[]; disbursals: BankDisbursalRecord[] }>('/api/bank/loans');
  }

  async disburseBankLoan(loanId: string) {
    return this.request<{ success: boolean; message: string; disbursal: BankDisbursalRecord }>(
      `/api/bank/loans/${loanId}/disburse`,
      { method: 'POST' }
    );
  }

  // Bank Fraud & Anomaly Radar (TrustAI Sentinel)
  async getFraudRadar() {
    return this.request<FraudRadarMetrics>('/api/bank/fraud-radar');
  }

  // Bank Sovereign Blockchain Settlement Ledger
  async getBankBlockchainLedger() {
    return this.request<{
      network: string;
      consensus: string;
      blockHeight: number;
      verifierContract: string;
      ledgerItems: BankLedgerItem[];
    }>('/api/bank/blockchain-ledger');
  }

  // Bank Create Verification Request
  async createBankVerificationRequest(payload: {
    targetCustomerEmail: string;
    purpose: string;
    requestedAttributes?: string[];
    requestedProof?: string;
  }) {
    return this.request<{ success: boolean; request: VerificationRequest }>('/api/bank/requests/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // AI Chatbot
  async sendChatMessage(message: string, language: SupportedLanguage, userId?: string) {
    return this.request<{ reply: string; suggestedAction?: string; timestamp: string }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language, userId }),
    });
  }

  // Bank Customers Directory (Privacy Safe)
  async getBankCustomersDirectory() {
    return this.request<{
      id: string;
      name: string;
      email: string;
      phone: string;
      avatar?: string;
      kycStatus: string;
      privacyScore: number;
      dataMinimizationScore: number;
      state: string;
      ageEligibility: boolean;
      credentialsCount: number;
      activeConsentsCount: number;
      pendingRequestsCount: number;
      sharedAttributes: string[];
      unsharedPrivateAttributes: string[];
    }[]>('/api/bank/customers');
  }

  // Bank Support Cases
  async getBankSupportCases(): Promise<SupportCase[]> {
    return this.request<SupportCase[]>('/api/bank/support-cases');
  }

  async createBankSupportCase(payload: {
    customerId: string;
    customerName: string;
    caseType: string;
    priority: string;
    subject: string;
    initialNote?: string;
  }) {
    return this.request<{ success: boolean; case: SupportCase }>('/api/bank/support-cases', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateBankSupportCase(id: string, updates: Partial<SupportCase>) {
    return this.request<{ success: boolean; case: SupportCase }>(`/api/bank/support-cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async addBankSupportCaseNote(id: string, text: string) {
    return this.request<{ success: boolean; case: SupportCase }>(`/api/bank/support-cases/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async requestBankSupportVerification(id: string) {
    return this.request<{ success: boolean; case: SupportCase }>(`/api/bank/support-cases/${id}/request-verification`, {
      method: 'POST',
    });
  }

  // Bank Fraud Alerts
  async getBankFraudAlerts(): Promise<FraudAlert[]> {
    return this.request<FraudAlert[]>('/api/bank/fraud-alerts');
  }

  async actionBankFraudAlert(id: string, action: string, resolutionNotes?: string) {
    return this.request<{ success: boolean; alert: FraudAlert }>(`/api/bank/fraud-alerts/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, resolutionNotes }),
    });
  }
}

export const api = new ApiService();
