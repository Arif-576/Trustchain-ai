import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  EyeOff,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  FileCheck2,
  RefreshCw,
  Cpu,
  BadgeCheck,
  Zap,
  Check,
  AlertOctagon,
  Key
} from 'lucide-react';
import { LiveTransactionDecision, User } from '../../types';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

interface TransactionVerificationTabProps {
  user: User;
  onNavigateToTab?: (tabId: string) => void;
}

export const TransactionVerificationTab: React.FC<TransactionVerificationTabProps> = ({
  user,
}) => {
  const { language } = useLanguage();
  const [decisions, setDecisions] = useState<LiveTransactionDecision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchDecisions = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLiveTransactions();
      if (Array.isArray(data)) {
        setDecisions(data);
      }
    } catch (err) {
      console.error('Failed to load transaction decisions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [user.id]);

  const handleApprove = async (id: string, serviceName: string) => {
    try {
      setActionLoadingId(id);
      const res = await api.approveLiveTransaction(id);
      if (res.success && res.transaction) {
        setDecisions(prev => prev.map(d => d.id === id ? res.transaction : d));
        setSuccessToast(`Transaction verification for ${serviceName} approved with zero data leakage.`);
        setTimeout(() => setSuccessToast(null), 4500);
      }
    } catch (err) {
      console.error('Failed to approve transaction decision', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await api.rejectLiveTransaction(id);
      if (res.success && res.transaction) {
        setDecisions(prev => prev.map(d => d.id === id ? res.transaction : d));
      }
    } catch (err) {
      console.error('Failed to reject transaction decision', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredDecisions = decisions.filter(d => {
    if (selectedFilter === 'pending') return d.status === 'pending';
    if (selectedFilter === 'approved') return d.status === 'approved';
    return true;
  });

  const pendingCount = decisions.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <span className="font-bold">Cryptographic Result Verified: </span>
            {successToast}
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Prominent Architectural Differentiator Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white p-5 sm:p-7 shadow-lg border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Live Transaction Identity Decision Layer</span>
          </div>

          <blockquote className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-indigo-50/95 italic bg-white/5 p-4 rounded-2xl border border-white/10">
            “DigiLocker helps you access and share trusted digital documents. TrustChain adds a transaction-time identity decision layer that determines what needs to be proven for a specific service and helps the organization verify the transaction without unnecessarily exposing unrelated personal information.”
          </blockquote>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-indigo-200/90 font-medium">
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Service-Specific Predicates
            </span>
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
              <EyeOff className="w-3.5 h-3.5 text-blue-300" />
              Zero Over-Disclosure
            </span>
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              ALLOW / EXTRA / BLOCK Engine
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Status Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Requests ({decisions.length})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Action Required</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedFilter === 'pending' ? 'bg-white text-amber-800' : 'bg-amber-500 text-white'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Verified & Anchored
          </button>
        </div>

        <button
          onClick={fetchDecisions}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Decisions List */}
      {isLoading && decisions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Evaluating transaction identity decisions...</p>
        </div>
      ) : filteredDecisions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Transaction Verification Requests</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When institutional partners or banks initiate service verification (loan, KYC, insurance, passport, account opening), you will review and approve decisions here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDecisions.map((decision) => {
            const isAllow = decision.decision === 'ALLOW';
            const isExtra = decision.decision === 'EXTRA_VERIFICATION';
            const isBlock = decision.decision === 'BLOCK';

            return (
              <div
                key={decision.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Decision Header Bar */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">{decision.serviceName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider">
                          {decision.serviceType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-700">{decision.bankName}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-400">{decision.auditRef}</span>
                      </p>
                    </div>
                  </div>

                  {/* Decision Outcome Badge */}
                  <div className="flex items-center gap-2">
                    {isAllow && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100/90 text-emerald-900 text-xs font-extrabold border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ALLOW</span>
                      </span>
                    )}
                    {isExtra && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/90 text-amber-900 text-xs font-extrabold border border-amber-200 shadow-2xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>EXTRA VERIFICATION</span>
                      </span>
                    )}
                    {isBlock && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-100/90 text-rose-900 text-xs font-extrabold border border-rose-200 shadow-2xs">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>BLOCK</span>
                      </span>
                    )}

                    {decision.status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1 border border-blue-200">
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Verified</span>
                      </span>
                    )}
                    {decision.status === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  {/* Service: Why verification is required */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">Service Rationale</span>
                      <p className="text-xs text-indigo-800 font-medium mt-0.5 leading-relaxed">
                        {decision.serviceReason}
                      </p>
                    </div>
                  </div>

                  {/* Operational Status Matrix: Privacy Impact, TrustAI Risk, Credential Status, Consent Status */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {/* PRIVACY IMPACT */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Privacy Impact</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                        decision.privacyImpact === 'Low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : decision.privacyImpact === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {decision.privacyImpact === 'Low' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{decision.privacyImpact}</span>
                      </span>
                    </div>

                    {/* TRUSTAI RISK */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">TrustAI Risk</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                        decision.trustAIRisk === 'Low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : decision.trustAIRisk === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <Zap className="w-3 h-3" />
                        <span>{decision.trustAIRisk} Risk</span>
                      </span>
                    </div>

                    {/* CREDENTIAL STATUS */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Credential Status</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                        decision.credentialStatus === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : decision.credentialStatus === 'Expired'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <Key className="w-3 h-3" />
                        <span>{decision.credentialStatus}</span>
                      </span>
                    </div>

                    {/* CONSENT STATUS */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Consent Status</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                        decision.consentStatus === 'Valid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : decision.consentStatus === 'Expired'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <FileCheck2 className="w-3 h-3" />
                        <span>{decision.consentStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Decision Engine Assessment Banner */}
                  <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs font-medium ${
                    isAllow
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : isExtra
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}>
                    {isAllow && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {isExtra && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                    {isBlock && <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                    <div>
                      <span className="font-bold">
                        Decision Engine: {decision.decision} —{' '}
                      </span>
                      <span>{decision.decisionReason}</span>
                    </div>
                  </div>

                  {/* Tri-Column Layout: DATA REQUESTED vs MINIMUM DATA PROVED vs NOT EXPOSED */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* DATA REQUESTED */}
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Data Requested</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Exactly what the bank is asking for:</p>
                      <ul className="space-y-1.5 text-xs font-medium text-slate-800">
                        {decision.dataRequested.map((reqItem, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                            <span>{reqItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* MINIMUM DATA (TrustChain Result) */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Minimum Data Proved</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">What TrustChain proves cryptographically:</p>
                      <ul className="space-y-1.5 text-xs font-bold text-emerald-900">
                        {decision.minimumDataToProve.map((minItem, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{minItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* NOT EXPOSED (Hidden / Protected) */}
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                        <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                        <span>Not Exposed (Protected)</span>
                      </div>
                      <p className="text-[11px] text-purple-700">Unnecessary personal data withheld:</p>
                      <ul className="space-y-1.5 text-xs font-medium text-purple-900">
                        {decision.notExposed.map((hiddenItem, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-purple-100 shadow-2xs">
                            <Lock className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                            <span>{hiddenItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Cryptographic Result / Proof Anchoring Metadata (if already approved) */}
                  {decision.status === 'approved' && decision.proofHash && (
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-[11px] text-indigo-300 font-sans font-bold">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Cryptographic Verification Anchored On-Chain</span>
                        </span>
                        <span className="text-emerald-400 font-bold">Zero Personal Data Retained</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-slate-400">Proof Hash: </span>
                          <span className="text-indigo-200 break-all">{decision.proofHash}</span>
                        </div>
                        {decision.txHash && (
                          <div>
                            <span className="text-slate-400">Tx Hash: </span>
                            <span className="text-emerald-200 break-all">{decision.txHash}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Action Trigger */}
                  {decision.status === 'pending' && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleReject(decision.id)}
                        disabled={actionLoadingId === decision.id}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(decision.id, decision.serviceName)}
                        disabled={actionLoadingId === decision.id}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                          isBlock
                            ? 'bg-slate-500 hover:bg-slate-600 shadow-slate-200'
                            : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-200'
                        }`}
                      >
                        {actionLoadingId === decision.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating Cryptographic Decision...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Approve Transaction Verification</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
