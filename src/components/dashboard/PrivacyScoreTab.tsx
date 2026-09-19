import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, EyeOff, Lock, CheckCircle, Zap } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { User } from '../../types';

interface PrivacyScoreTabProps {
  user: User;
}

export const PrivacyScoreTab: React.FC<PrivacyScoreTabProps> = ({ user }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Main Privacy Score Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Protection Rating</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {t('privacyScoreTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {t('privacyExplanation')}
            </p>
          </div>

          {/* Big Score Visual Circle */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 p-1.5 shadow-xl shadow-indigo-200">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-2">
                <span className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-br from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  {user.privacyScore}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Out of 100
                </span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">{t('riskLevel')}:</span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {t('lowRisk')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Status:</span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {t('protectionStatus')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">
              {t('dataMinimizationScore')}
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-600">
              {user.dataMinimizationScore} / 100
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Measures the proportion of verification requests satisfied with zero-knowledge cryptographic predicates instead of unencrypted documents.
          </p>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full"
              style={{ width: `${user.dataMinimizationScore}%` }}
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">
              Hardware Security & Passkeys
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-600">
              100 / 100
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            WebAuthn device platform biometrics are enrolled and validated for each identity unlock. Private keys never leave device storage.
          </p>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
