import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldAlert,
  Building,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { ConsentRecord } from '../../types';

interface ConsentTabProps {
  consents?: ConsentRecord[];
  onConsentUpdated: () => void;
}

export const ConsentTab: React.FC<ConsentTabProps> = ({
  consents = [],
  onConsentUpdated,
}) => {
  const { t } = useLanguage();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const safeConsents = Array.isArray(consents) ? consents.filter(Boolean) : [];

  const handleRevoke = async (id: string) => {
    if (!id) return;
    setProcessingId(id);
    try {
      await api.revokeConsent(id);
      if (typeof onConsentUpdated === 'function') {
        onConsentUpdated();
      }
    } catch (err) {
      console.error('Failed to revoke consent:', err);
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
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('consentCenterTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('consentCenterSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Consent Table / Cards */}
      <div className="space-y-4">
        {safeConsents.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/90 bg-white/85 shadow-sm space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Active Selective Disclosure Consents
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When you approve bank verification requests or share zero-knowledge credentials, your active data consents will appear here for easy revocation.
            </p>
          </div>
        ) : (
          safeConsents.map((consent) => {
            if (!consent || !consent.id) return null;
            const isActive = consent.status === 'active';
            const rawDisclosed =
              Array.isArray(consent.grantedData) && consent.grantedData.length > 0
                ? consent.grantedData
                : Array.isArray(consent.requestedData) && consent.requestedData.length > 0
                ? consent.requestedData
                : [];
            const disclosedList = Array.isArray(rawDisclosed) ? rawDisclosed.filter(Boolean) : [];

            return (
              <div
                key={consent.id}
                className={`glass-panel p-6 rounded-3xl border transition-all ${
                  isActive
                    ? 'bg-white/90 border-white/90 shadow-lg'
                    : 'bg-slate-50/70 border-slate-200/70 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800">
                          {consent.organization || 'Organization'}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {consent.status || 'unknown'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-slate-600">Purpose:</strong> {consent.purpose || 'Verification & Identity Claims'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Granted: {consent.approvedDate || 'Recent'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Expiry: {consent.expiryDate || '1 Year'}</span>
                    </div>
                  </div>
                </div>

                {/* Granted Data Badges */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Attested Data & Claims Disclosed:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {disclosedList.length > 0 ? (
                        disclosedList.map((d, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                          >
                            {String(d)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Zero-Knowledge Predicate (No raw attributes disclosed)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Revoke Button */}
                  {isActive && (
                    <button
                      onClick={() => handleRevoke(consent.id)}
                      disabled={processingId === consent.id}
                      className="py-2 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{processingId === consent.id ? 'Revoking on Ledger...' : t('revokeConsent')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
