import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { BankRequest } from '../../types';

interface BankRequestsTabProps {
  requests?: BankRequest[];
  onRequestUpdated: () => void;
  onNavigateToQR?: () => void;
}

export const BankRequestsTab: React.FC<BankRequestsTabProps> = ({
  requests = [],
  onRequestUpdated,
  onNavigateToQR,
}) => {
  const { t } = useLanguage();
  const safeRequests = Array.isArray(requests) ? requests : [];
  const [disclosedFieldsMap, setDisclosedFieldsMap] = useState<Record<string, string[]>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Initialize selected fields if empty
  const getSelectedFields = (req: BankRequest) => {
    return disclosedFieldsMap[req.id] || req.requestedAttributes || [];
  };

  const toggleField = (reqId: string, field: string) => {
    const current = disclosedFieldsMap[reqId] || safeRequests.find(r => r.id === reqId)?.requestedAttributes || [];
    const updated = current.includes(field)
      ? current.filter(f => f !== field)
      : [...current, field];
    setDisclosedFieldsMap(prev => ({ ...prev, [reqId]: updated }));
  };

  const handleApprove = async (req: BankRequest) => {
    setProcessingId(req.id);
    try {
      const selected = getSelectedFields(req);
      await api.approveBankRequest(req.id, selected);
      onRequestUpdated();
      if (onNavigateToQR) onNavigateToQR();
    } catch (err) {
      console.error('Failed to approve request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (reqId: string) => {
    setProcessingId(reqId);
    try {
      await api.declineBankRequest(reqId);
      onRequestUpdated();
    } catch (err) {
      console.error('Failed to decline request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('incomingRequests')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('bankRequestsSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {safeRequests.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/90 bg-white/85 shadow-sm space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Pending Verification Requests
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Any incoming verification or KYC access requests from partner banks and financial institutions will appear here for one-click selective disclosure.
            </p>
          </div>
        ) : (
          safeRequests.map((req) => {
            const selectedFields = getSelectedFields(req);
            const isPending = req.status === 'pending';
            const attributes = Array.isArray(req.requestedAttributes) ? req.requestedAttributes : [];

          return (
            <div
              key={req.id}
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                isPending
                  ? 'bg-white/90 border-white/90 shadow-lg'
                  : req.status === 'approved'
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-800">
                        {req.bankName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          req.trustAiRiskLevel === 'LOW'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        TrustAI: {req.trustAiRiskLevel} RISK ({req.trustAiScore}/100)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong className="text-slate-700">Purpose:</strong> {req.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {req.timestamp}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      req.status === 'pending'
                        ? 'bg-indigo-100 text-indigo-700'
                        : req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Selective Disclosure Attributes */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('selectiveDisclosureActive')} (Choose attributes to disclose):
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    Zero-Knowledge proofs are automatically generated for claims.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {attributes.map((attr) => {
                    const isChecked = selectedFields.includes(attr);
                    return (
                      <label
                        key={attr}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={!isPending}
                          onChange={() => toggleField(req.id, attr)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                        <span className="truncate">{attr}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              {isPending && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={() => handleDecline(req.id)}
                    disabled={processingId === req.id}
                    className="w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                  >
                    {t('declineRequest')}
                  </button>

                  <button
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id || selectedFields.length === 0}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{processingId === req.id ? 'Generating ZKP...' : t('approveRequest')}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
