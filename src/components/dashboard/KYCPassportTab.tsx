import React from 'react';
import { ShieldCheck, CheckCircle2, QrCode, Lock, FileText, BadgeCheck, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { User, Credential } from '../../types';

interface KYCPassportTabProps {
  user: User;
  credentials: Credential[];
  onGenerateQR: () => void;
}

export const KYCPassportTab: React.FC<KYCPassportTabProps> = ({
  user,
  credentials,
  onGenerateQR,
}) => {
  const { t } = useLanguage();
  const primaryCred = credentials[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Passport Visual Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-2xl overflow-hidden border border-indigo-700/50">
        {/* Decorative background watermark */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Award className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 block">
                  DIGITAL SOVEREIGN IDENTITY
                </span>
                <h2 className="text-xl font-extrabold tracking-tight">
                  REUSABLE KYC PASSPORT
                </h2>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold block">
                  Holder Legal Name
                </span>
                <span className="text-base font-bold tracking-wide">
                  {user.name}
                </span>
              </div>
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold block">
                  KYC Status
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-300">
                  <BadgeCheck className="w-4 h-4" />
                  VERIFIED
                </span>
              </div>
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold block">
                  Jurisdiction
                </span>
                <span className="font-semibold text-white">
                  {user.addressState}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-indigo-300 uppercase font-semibold block">
                Verification Ledger Reference
              </span>
              <span className="font-mono text-xs text-indigo-100 font-semibold truncate block max-w-[200px]">
                {primaryCred?.txHash || '0x7b841a0293ec...'}
              </span>
            </div>

            <button
              onClick={onGenerateQR}
              className="mt-4 py-2 px-4 rounded-xl text-xs font-bold bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>{t('generateNewQR')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Data Claims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/80 bg-white/85 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Identity Proof</span>
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-800 font-mono">
            {user.aadhaarMasked}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Government e-Sign authenticated. Masked Aadhaar token anchored with zero raw biometrics.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/80 bg-white/85 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Tax & Financial Claim</span>
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-800 font-mono">
            {user.panMasked}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Financial identity verified. Masked Permanent Account Number ready for instant bank credit.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/80 bg-white/85 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Address Jurisdiction</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-800">
            {user.addressState}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            State residency proof established without revealing precise residential house coordinates.
          </p>
        </div>
      </div>
    </div>
  );
};
