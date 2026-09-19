import React, { useState } from 'react';
import { X, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface BankGoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string) => void;
}

export const BankGoogleAccountModal: React.FC<BankGoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const { language } = useLanguage();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const institutionalAccounts = [
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.k@hdfc-identity.com',
      bankName: 'HDFC Trust Banking & Credit',
      role: 'Senior Credit & Verification Manager',
      initials: 'RK',
      color: 'bg-blue-700',
    },
    {
      name: 'Vikram Malhotra',
      email: 'v.malhotra@trustbank.in',
      bankName: 'TrustBank Institutional Operations',
      role: 'Chief Verification Officer & Bank Manager',
      initials: 'VM',
      color: 'bg-purple-700',
    },
    {
      name: 'Ananya Sen',
      email: 'ananya.sen@sbi-identity.com',
      bankName: 'State Bank of India (SBI)',
      role: 'Lead Compliance & ZKP Officer',
      initials: 'AS',
      color: 'bg-emerald-700',
    },
    {
      name: 'Priya Natarajan',
      email: 'priya.n@icici-identity.com',
      bankName: 'ICICI Commercial Trust Banking',
      role: 'Auditor & Sovereign Lending Specialist',
      initials: 'PN',
      color: 'bg-amber-700',
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail.trim()) {
      onSelectAccount(customEmail.trim(), customName.trim() || customEmail.split('@')[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {language === 'ta' ? 'வங்கி கூகுள் கணக்கைத் தேர்வுசெய்க' : language === 'hi' ? 'बैंक गूगल खाता चुनें' : 'Select Institutional Google Account'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'ta' ? 'TrustChain வங்கி போர்ட்டலில் உள்நுழைய' : 'Sign in to TrustChain Institutional Bank Portal'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Institutional account list */}
        <div className="p-3 divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
          {institutionalAccounts.map((acc, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectAccount(acc.email, acc.name)}
              className="w-full p-3 flex items-center gap-3 hover:bg-purple-50/60 rounded-2xl transition-all text-left cursor-pointer group"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0 ${acc.color}`}
              >
                {acc.initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700 truncate">
                    {acc.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-100/70 text-purple-700 font-bold">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate">{acc.email}</p>
                <p className="text-[10px] text-purple-900/80 font-medium truncate mt-0.5">
                  {acc.bankName} • {acc.role}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom institutional email toggle / input */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-purple-700 hover:border-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Use another institutional Google account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Officer Full Name (optional)"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="officer@bank-domain.com"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-2xs cursor-pointer shrink-0"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom security assurance */}
        <div className="p-3 bg-purple-50/40 border-t border-purple-100/60 text-center">
          <p className="text-[10px] text-purple-900 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-600 shrink-0" />
            <span>Institutional OAuth 2.0 Identity Federation • RBI & GDPR Compliant</span>
          </p>
        </div>

      </div>
    </div>
  );
};
