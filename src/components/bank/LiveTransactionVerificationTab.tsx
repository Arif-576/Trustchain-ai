import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  EyeOff,
  Building2,
  Lock,
  Sparkles,
  Info,
  Clock,
  FileCheck2,
  RefreshCw,
  Cpu,
  BadgeCheck,
  Zap,
  Check,
  PlusCircle,
  UserCheck,
  Hash,
  FileText,
  Key,
  Filter,
  Search,
  CheckCheck
} from 'lucide-react';
import { LiveTransactionDecision, BankStaff, User } from '../../types';
import { api } from '../../services/api';

interface LiveTransactionVerificationTabProps {
  staff: BankStaff;
}

export const LiveTransactionVerificationTab: React.FC<LiveTransactionVerificationTabProps> = ({
  staff,
}) => {
  const [decisions, setDecisions] = useState<LiveTransactionDecision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'ALLOW' | 'EXTRA_VERIFICATION' | 'BLOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableCitizens, setAvailableCitizens] = useState<{ id: string; name: string; kycStatus?: string; privacyScore?: number }[]>([
    { id: 'usr-midhun-01', name: 'Midhun S (Citizen)', kycStatus: 'verified', privacyScore: 92 },
    { id: 'usr-priya-02', name: 'Priya Ramanathan (Citizen)', kycStatus: 'verified', privacyScore: 88 },
    { id: 'usr-arif-03', name: 'Mohamed Arif (Citizen)', kycStatus: 'verified', privacyScore: 84 },
  ]);

  // Create Form State
  const [formUserId, setFormUserId] = useState('usr-midhun-01');
  const [formServiceType, setFormServiceType] = useState('loan');
  const [formServiceName, setFormServiceName] = useState('CBDC Priority MSME Loan Approval');
  const [formServiceReason, setFormServiceReason] = useState('Underwrite credit facility eligibility with zero leakage.');
  const [formDataRequested, setFormDataRequested] = useState('KYC Verified Status, Age >= 18 Confirmation, Business Tier-1 Registration');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDecisions = async () => {
    try {
      setIsLoading(true);
      const [allTx, directory] = await Promise.all([
        api.getLiveTransactions(),
        api.getBankCustomersDirectory().catch(() => []),
      ]);
      if (Array.isArray(allTx)) setDecisions(allTx);
      if (Array.isArray(directory) && directory.length > 0) {
        setAvailableCitizens(directory.map(d => ({
          id: d.id,
          name: d.name,
          kycStatus: d.kycStatus,
          privacyScore: d.privacyScore,
        })));
      }
    } catch (err) {
      console.error('Failed to load live transaction decisions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const selectedUser = availableCitizens.find(c => c.id === formUserId);
      const requestedArray = formDataRequested.split(',').map(s => s.trim()).filter(Boolean);

      const payload: Partial<LiveTransactionDecision> = {
        userId: formUserId,
        userName: selectedUser ? selectedUser.name : 'Citizen',
        serviceType: formServiceType,
        serviceName: formServiceName,
        serviceReason: formServiceReason,
        dataRequested: requestedArray,
        bankName: staff.bankName || 'State Bank of India (SBI)',
        bankId: staff.bankId || 'bank-sbi',
        verifiedAttributes: requestedArray.map(item => `${item} (Verified)`),
        protectedHiddenAttributes: [
          'Full Date of Birth (Hidden)',
          'Raw Aadhaar & PAN Card (Hidden)',
          'Complete House Address (Hidden)',
          'Personal Bank Ledger Details (Hidden)',
        ],
      };

      const res = await api.createLiveTransaction(payload);
      if (res && res.id) {
        setDecisions(prev => [res, ...prev]);
        setShowCreateModal(false);
        setFeedbackMsg({
          type: 'success',
          text: `Live Transaction Verification request created for ${res.userName}. Decision: ${res.decision}.`,
        });
        setTimeout(() => setFeedbackMsg(null), 5000);
      }
    } catch (err) {
      console.error('Failed to create live transaction decision', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to initiate transaction verification.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick preset loader for Bank Manager
  const loadServicePreset = (type: string) => {
    setFormServiceType(type);
    if (type === 'loan') {
      setFormServiceName('CBDC Priority MSME Loan Approval');
      setFormServiceReason('Underwrite credit facility eligibility with zero leakage.');
      setFormDataRequested('KYC Verified Status, Age >= 18 Confirmation, Business Tier-1 Registration');
    } else if (type === 'kyc') {
      setFormServiceName('High-Net-Worth Sovereign KYC Periodic Re-verification');
      setFormServiceReason('Regulatory mandate compliance without paper re-collection.');
      setFormDataRequested('Active UIDAI Status, Proof of Non-Revocation, Current State Residency');
    } else if (type === 'insurance') {
      setFormServiceName('Arogya Sanjeevani Health Insurance Disbursal');
      setFormServiceReason('Instant cashless claim authorization without medical history over-sharing.');
      setFormDataRequested('Identity e-Sign Valid, Age Range 18-65, Nominee Standing Active');
    } else if (type === 'passport') {
      setFormServiceName('MEA Sovereign Passport Clearance Fast-Track');
      setFormServiceReason('Verify citizenship and active identity attestation for expedited clearance.');
      setFormDataRequested('Citizenship Credential Attested, Non-Revoked Standing, Biometric Passkey Bound');
    } else if (type === 'account_opening') {
      setFormServiceName('Zero-Paper Instant Sovereign Savings Account');
      setFormServiceReason('RBI Master Direction digital onboarding without storing paper photocopies.');
      setFormDataRequested('Active Indian Resident KYC, Age above 18, State Jurisdictional Match');
    }
  };

  const filteredDecisions = decisions.filter(d => {
    if (filterDecision !== 'ALL' && d.decision !== filterDecision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.serviceName.toLowerCase().includes(q) ||
        d.userName.toLowerCase().includes(q) ||
        d.auditRef.toLowerCase().includes(q) ||
        (d.proofId && d.proofId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-sm font-medium shadow-xs ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Institutional Differentiator Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 shadow-lg border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Institutional Live Transaction Decision Layer</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              Institutional Zero-Disclosure Mode
            </span>
          </div>

          <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-indigo-100 italic bg-white/5 p-4 rounded-2xl border border-white/10">
            “DigiLocker helps you access and share trusted digital documents. TrustChain adds a transaction-time identity decision layer that determines what needs to be proven for a specific service and helps the organization verify the transaction without unnecessarily exposing unrelated personal information.”
          </blockquote>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-indigo-200/90 font-medium">
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Verification Result (No Unnecessary Data Received)
            </span>
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              Automated Decision: ALLOW / EXTRA / BLOCK
            </span>
          </div>
        </div>
      </div>

      {/* Header Controls: Filters & New Request Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Decision Filter Tabs */}
          {(['ALL', 'ALLOW', 'EXTRA_VERIFICATION', 'BLOCK'] as const).map(dec => (
            <button
              key={dec}
              onClick={() => setFilterDecision(dec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterDecision === dec
                  ? dec === 'ALLOW'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : dec === 'EXTRA_VERIFICATION'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : dec === 'BLOCK'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dec === 'EXTRA_VERIFICATION' ? 'EXTRA VERIFY' : dec}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search service, citizen, audit..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <button
            onClick={fetchDecisions}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Transaction Request</span>
          </button>
        </div>
      </div>

      {/* Decisions List Table / Cards */}
      {isLoading && decisions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading Live Transaction Verifications...</p>
        </div>
      ) : filteredDecisions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Transaction Verification Records</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click &quot;New Transaction Request&quot; above to issue a service-time identity verification challenge to a citizen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDecisions.map((decision) => {
            const isAllow = decision.decision === 'ALLOW';
            const isExtra = decision.decision === 'EXTRA_VERIFICATION';
            const isBlock = decision.decision === 'BLOCK';

            return (
              <div
                key={decision.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-indigo-200 transition-all"
              >
                {/* Header Strip */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-indigo-50/20 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/60 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">{decision.serviceName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                          {decision.serviceType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-indigo-600" />
                          <span>{decision.userName}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{decision.userId}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Verification Status & Decision Badges */}
                  <div className="flex items-center gap-2">
                    {/* Decision Outcome */}
                    {isAllow && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ALLOW</span>
                      </span>
                    )}
                    {isExtra && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-200 shadow-2xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>EXTRA VERIFICATION</span>
                      </span>
                    )}
                    {isBlock && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-100 text-rose-900 text-xs font-extrabold border border-rose-200 shadow-2xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>BLOCK</span>
                      </span>
                    )}

                    {/* Customer Status */}
                    {decision.status === 'approved' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1 border border-blue-200">
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Customer Approved</span>
                      </span>
                    ) : decision.status === 'pending' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Awaiting Customer Consent</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  {/* Institutional Decision Rule Rationale */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-700">Decision Reason:</span>
                      <span className="text-slate-600 font-medium">{decision.decisionReason}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Audit Ref: <span className="font-bold text-slate-600">{decision.auditRef}</span>
                    </div>
                  </div>

                  {/* 5 Technical Verification Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    {/* 1. Verification Status */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verification Status</span>
                      <span className={`font-bold capitalize inline-flex items-center gap-1 ${
                        decision.status === 'approved' ? 'text-emerald-700' : decision.status === 'pending' ? 'text-amber-700' : 'text-slate-600'
                      }`}>
                        {decision.status === 'approved' && <Check className="w-3.5 h-3.5" />}
                        <span>{decision.status}</span>
                      </span>
                    </div>

                    {/* 2. User Consent Status */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">User Consent</span>
                      <span className={`font-bold inline-flex items-center gap-1 ${
                        decision.consentStatus === 'Valid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{decision.consentStatus}</span>
                      </span>
                    </div>

                    {/* 3. Credential Status */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Credential Status</span>
                      <span className={`font-bold inline-flex items-center gap-1 ${
                        decision.credentialStatus === 'Active' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        <Key className="w-3.5 h-3.5" />
                        <span>{decision.credentialStatus}</span>
                      </span>
                    </div>

                    {/* 4. TrustAI Risk */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">TrustAI Risk</span>
                      <span className={`font-bold inline-flex items-center gap-1 ${
                        decision.trustAIRisk === 'Low' ? 'text-emerald-700' : decision.trustAIRisk === 'Medium' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        <Zap className="w-3.5 h-3.5" />
                        <span>{decision.trustAIRisk} Risk</span>
                      </span>
                    </div>

                    {/* 5. Proof ID & Timestamp */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Proof Reference</span>
                      <span className="font-mono text-[11px] font-bold text-indigo-700 truncate block">
                        {decision.proofId || 'Pending Anchor'}
                      </span>
                    </div>
                  </div>

                  {/* Required Attributes vs Verified Attributes vs Protected Attributes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Required Attributes */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Required Attributes</span>
                      </div>
                      <ul className="space-y-1 text-xs font-medium text-slate-800">
                        {decision.dataRequested.map((req, idx) => (
                          <li key={idx} className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Verified Attributes (The Result Bank Receives) */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Attributes (Result)</span>
                      </div>
                      <ul className="space-y-1 text-xs font-bold text-emerald-900">
                        {(decision.verifiedAttributes && decision.verifiedAttributes.length > 0
                          ? decision.verifiedAttributes
                          : decision.minimumDataToProve
                        ).map((vAttr, idx) => (
                          <li key={idx} className="bg-white p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5 shadow-2xs">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{vAttr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Protected / Hidden Attributes (Unnecessary data withheld from bank) */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                        <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                        <span>Protected / Hidden Attributes</span>
                      </div>
                      <ul className="space-y-1 text-xs font-medium text-purple-900">
                        {(decision.protectedHiddenAttributes && decision.protectedHiddenAttributes.length > 0
                          ? decision.protectedHiddenAttributes
                          : decision.notExposed
                        ).map((hAttr, idx) => (
                          <li key={idx} className="bg-white p-2 rounded-xl border border-purple-100 flex items-center gap-1.5 shadow-2xs">
                            <Lock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>{hAttr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Cryptographic Proof Verification Card */}
                  {decision.status === 'approved' && (
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                          <Cpu className="w-4 h-4" />
                          <span>Proof Verified: {decision.proofId}</span>
                        </div>
                        {decision.proofHash && (
                          <p className="font-mono text-[11px] text-slate-300 break-all">
                            Proof Hash: {decision.proofHash}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Verification Timestamp</span>
                        <span className="font-mono text-xs text-indigo-200">
                          {new Date(decision.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Transaction Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Initiate Live Transaction Verification</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Service Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">
                Quick Service Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Loan Approval', type: 'loan' },
                  { label: 'KYC Re-verification', type: 'kyc' },
                  { label: 'Health Insurance', type: 'insurance' },
                  { label: 'Passport Clearance', type: 'passport' },
                  { label: 'Account Opening', type: 'account_opening' },
                ].map(p => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => loadServicePreset(p.type)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      formServiceType === p.type
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-4 text-xs">
              {/* Select Citizen */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Target Citizen</label>
                <select
                  value={formUserId}
                  onChange={e => setFormUserId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-indigo-500"
                >
                  {availableCitizens.length > 0 ? (
                    availableCitizens.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id}) — KYC: {c.kycStatus} (Score: {c.privacyScore})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="usr-midhun-01">Midhun (usr-midhun-01) — KYC: verified</option>
                      <option value="usr-arif-02">Mohamed Arif A (usr-arif-02) — KYC: verified</option>
                      <option value="usr-kishore-03">Kishore (usr-kishore-03) — KYC: verified</option>
                      <option value="usr-krishnesh-04">Krishnesh (usr-krishnesh-04) — KYC: verified</option>
                      <option value="usr-priya-05">Priya Sharma (usr-priya-05) — KYC: verified</option>
                    </>
                  )}
                </select>
              </div>

              {/* Service Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Service Name</label>
                <input
                  type="text"
                  value={formServiceName}
                  onChange={e => setFormServiceName(e.target.value)}
                  required
                  placeholder="e.g. Instant MSME Credit Facility"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Why Verification Is Required (Institutional Purpose)</label>
                <input
                  type="text"
                  value={formServiceReason}
                  onChange={e => setFormServiceReason(e.target.value)}
                  required
                  placeholder="e.g. Underwrite loan eligibility with zero over-exposure"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Data Requested */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Attributes Requested (comma-separated)</label>
                <textarea
                  value={formDataRequested}
                  onChange={e => setFormDataRequested(e.target.value)}
                  rows={2}
                  required
                  placeholder="e.g. KYC Verified Status, Age above 18, State Jurisdiction"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Info notice about zero disclosure */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2 text-[11px] text-indigo-900">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  The bank will receive cryptographically attested predicates only. Unnecessary attributes (raw Aadhaar/PAN, complete DOB, street address) remain zero-knowledge masked.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Issue Verification Challenge</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
