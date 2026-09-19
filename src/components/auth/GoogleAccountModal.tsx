import React from 'react';
import { X, UserCheck, Shield } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string) => void;
}

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Midhun',
      email: 'midhun@trustchain.id',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      initials: 'M',
      color: 'bg-emerald-600',
    },
    {
      name: 'Mohamed Arif A',
      email: 'arif@trustchain.id',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      initials: 'A',
      color: 'bg-blue-600',
    },
    {
      name: 'Kishore',
      email: 'kishore@trustchain.id',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      initials: 'K',
      color: 'bg-purple-600',
    },
    {
      name: 'Krishnesh',
      email: 'krishnesh@trustchain.id',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      initials: 'KR',
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Standard Multicolor Google "G" SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {t('chooseAccount')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('toContinueTo')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account list */}
        <div className="p-3 divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
          {accounts.map((acc, index) => (
            <button
              key={index}
              onClick={() => onSelectAccount(acc.email, acc.name)}
              className="w-full p-3.5 flex items-center gap-3.5 hover:bg-indigo-50/50 rounded-2xl transition-all text-left cursor-pointer group"
            >
              <img
                src={acc.avatar}
                alt={acc.name}
                className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-xs group-hover:ring-2 group-hover:ring-indigo-500"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-800 block truncate group-hover:text-indigo-700">
                  {acc.name}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {acc.email}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 text-indigo-600 transition-opacity">
                <UserCheck className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Encrypted OAuth SSI Enclave</span>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
