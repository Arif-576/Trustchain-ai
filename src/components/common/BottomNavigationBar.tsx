import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ShieldCheck,
  Building2,
  Banknote,
  Mic,
  MicOff,
  Radio,
  Cpu,
  Zap,
  Globe,
  MoreHorizontal,
  FileCheck2,
  QrCode,
  History,
  Bell,
  AlertTriangle,
  Users,
  ShieldAlert,
  Headphones,
  Home,
  CheckCircle2,
  Sparkles,
  Volume2,
  Settings,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { SupportedLanguage } from '../../types';

interface BottomNavigationBarProps {
  activeRole: 'customer' | 'bank_staff';
  isLoggedIn: boolean;
  activeCustomerTab?: string;
  onCustomerTabChange?: (tabId: string) => void;
  activeBankTab?: string;
  onBankTabChange?: (tabId: any) => void;
  onRoleSwitch?: (role: 'customer' | 'bank_staff') => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  pendingCustomerRequestsCount?: number;
  unreadNotificationsCount?: number;
  pendingBankQueueCount?: number;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeRole,
  isLoggedIn,
  activeCustomerTab = 'wallet',
  onCustomerTabChange,
  activeBankTab = 'overview',
  onBankTabChange,
  onRoleSwitch,
  onLogout,
  onOpenSettings,
  pendingCustomerRequestsCount = 0,
  unreadNotificationsCount = 0,
  pendingBankQueueCount = 0,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    voiceState,
    startListening,
    stopListening,
    toggleListening,
    speak,
    setLastActionFeedback,
  } = useVoice();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreMenuOpen(false);
        setShowVoiceHelp(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Strict check: Do NOT show navigation bar or bottom buttons on the login page!
  // Only show after user is successfully logged in.
  if (!isLoggedIn) {
    return null;
  }

  // Quick Language Toggle
  const cycleLanguage = () => {
    const langs: SupportedLanguage[] = ['en', 'ta', 'hi'];
    const currentIndex = langs.indexOf(language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    setLanguage(nextLang);
  };

  return (
    <>
      {/* Voice Commands Help Modal / Drawer */}
      {showVoiceHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowVoiceHelp(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Voice Navigation Commands</h4>
                  <p className="text-[11px] text-slate-500">Access the full app hands-free in your language</p>
                </div>
              </div>
              <button
                onClick={() => setShowVoiceHelp(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1">
                  <span>English</span>
                </div>
                <ul className="text-[11px] text-indigo-800 space-y-1 font-medium">
                  <li>• "Open Wallet"</li>
                  <li>• "Open KYC Passport"</li>
                  <li>• "Open Bank Requests"</li>
                  <li>• "Open Loans"</li>
                  <li>• "Switch to Bank Portal"</li>
                  <li>• "Biometric Sign In"</li>
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                <div className="font-bold text-purple-900">தமிழ் (Tamil)</div>
                <ul className="text-[11px] text-purple-800 space-y-1 font-medium">
                  <li>• "வாலட் திற"</li>
                  <li>• "கேஒய்சி கடவுச்சீட்டு"</li>
                  <li>• "வங்கி கோரிக்கைகள்"</li>
                  <li>• "கடன் திட்டங்கள்"</li>
                  <li>• "வங்கி போர்டல்"</li>
                  <li>• "கைரேகை பதிவு"</li>
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
                <div className="font-bold text-amber-900">हिंदी (Hindi)</div>
                <ul className="text-[11px] text-amber-800 space-y-1 font-medium">
                  <li>• "वॉलेट खोलो"</li>
                  <li>• "केवाईसी पासपोर्ट"</li>
                  <li>• "बैंक अनुरोध"</li>
                  <li>• "ऋण पोर्टल"</li>
                  <li>• "बैंक पोर्टल बदलो"</li>
                  <li>• "बायोमेट्रिक लॉगिन"</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">
                Language selected: <strong>{language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : 'English'}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowVoiceHelp(false);
                  toggleListening();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-200 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Start Speaking Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded "More" Popover / Drawer */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end justify-center sm:justify-end sm:pr-8 pb-20 sm:pb-24 animate-in fade-in"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm mx-3 sm:mx-0 bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-3 duration-200 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider pb-2.5 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Additional Modules</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                aria-label="Close More Menu"
              >
                ✕
              </button>
            </div>

            {/* Voice Control Quick Action Card inside More Drawer */}
            <div className="my-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-blue-50/80 border border-indigo-100/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-all cursor-pointer ${
                    voiceState.isListening
                      ? 'bg-rose-600 scale-105 ring-2 ring-rose-300 animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  aria-label="Toggle Voice Input"
                >
                  {voiceState.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1">
                    <span>Voice Assistant</span>
                    <span className={`w-2 h-2 rounded-full ${voiceState.isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {voiceState.isListening ? 'Listening now...' : 'Tap mic to speak'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setShowVoiceHelp(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-indigo-200 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 shrink-0 cursor-pointer shadow-2xs"
              >
                Help
              </button>
            </div>

            <div className="py-1 space-y-1 max-h-64 overflow-y-auto pr-0.5">
              {activeRole === 'customer' ? (
                <>
                  <button
                    onClick={() => {
                      onCustomerTabChange?.('requests');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'requests' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="truncate">Institutional Requests</span>
                    </div>
                    {pendingCustomerRequestsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse shadow-xs">
                        {pendingCustomerRequestsCount} pending
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('qr');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'qr' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate">Verifiable QR Token</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('zkp');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'zkp' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">Zero-Knowledge Proofs</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('privacy');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'privacy' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Privacy Score & Radar</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('trustai');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'trustai' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate">TrustAI Sentinel Analysis</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('consent');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'consent' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="truncate">Consent Center</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('loans');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'loans' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Smart CBDC Loans</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('audit');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'audit' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <History className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">Blockchain Audit Ledger</span>
                  </button>

                  <button
                    onClick={() => {
                      onCustomerTabChange?.('notifications');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'notifications' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Settings Option in More Drawer */}
                  <button
                    onClick={() => {
                      onCustomerTabChange?.('settings');
                      onOpenSettings?.();
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeCustomerTab === 'settings' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{language === 'ta' ? 'அமைப்புகள் (Settings)' : language === 'hi' ? 'सेटिंग्स (Settings)' : 'Account Settings'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onBankTabChange?.('fraud_radar');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeBankTab === 'fraud_radar' || activeBankTab === 'radar' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">{t('fraudRadarHeaderTitle')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onBankTabChange?.('support');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeBankTab === 'support' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Headphones className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate">{t('customerSupportDeskHeader')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onBankTabChange?.('loans');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeBankTab === 'loans' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{t('smartContractLoanHeader')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onBankTabChange?.('assisted');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeBankTab === 'assisted' || activeBankTab === 'rural' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{t('assistedDeskTitle')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onBankTabChange?.('ledger');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeBankTab === 'ledger' || activeBankTab === 'blockchain' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <History className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{t('ledgerExplorerHeader')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onBankTabChange?.('settings');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeBankTab === 'settings' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="truncate">{t('institutionalSettingsHeader')}</span>
                  </button>
                </>
              )}

              {/* Bottom Actions inside More Drawer */}
              <div className="pt-2.5 mt-2 border-t border-slate-100 space-y-2">
                {/* Language Switcher inside More Drawer */}
                <div className="bg-slate-50/90 p-2 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{language === 'ta' ? 'மொழி தேர்வு' : language === 'hi' ? 'भाषा चुनें' : 'Language'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{language}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['en', 'ta', 'hi'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`py-1 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          language === lang
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout Option in More Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-all cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>{language === 'ta' ? 'வெளியேறு (Logout)' : language === 'hi' ? 'लॉग आउट (Logout)' : 'Sign Out'}</span>
                </button>

                {/* Switch Portal is ONLY shown for Bank Staff, completely removed from Customer Login */}
                {activeRole === 'bank_staff' && (
                  <button
                    type="button"
                    onClick={() => {
                      onRoleSwitch?.('customer');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-purple-700 hover:bg-purple-50/60 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{t('citizenPortalSwitch')}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">⌘S</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE FIXED BOTTOM NAVIGATION BAR */}
      <nav
        id="persistent-bottom-navigation-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-1 pb-2 transition-all"
        aria-label="Bottom Navigation Bar"
      >
        <div className="max-w-lg mx-auto grid grid-cols-5 items-end justify-items-center w-full relative">
          {/* CUSTOMER 5-ITEM NAVIGATION (Dashboard, KYC, Center Mic, Blockchain, More) */}
          {activeRole === 'customer' && isLoggedIn ? (
            <>
              {/* 1. Dashboard */}
              <button
                id="bottom-nav-dashboard-btn"
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onCustomerTabChange?.('wallet');
                }}
                className={`w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCustomerTab === 'wallet'
                    ? 'text-indigo-600 bg-indigo-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Wallet className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('dashboardNav')}</span>
              </button>

              {/* 2. KYC */}
              <button
                id="bottom-nav-kyc-btn"
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onCustomerTabChange?.('passport');
                }}
                className={`w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCustomerTab === 'passport'
                    ? 'text-indigo-600 bg-indigo-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('kycNav')}</span>
              </button>

              {/* 3. CENTER MIC (Microphone with proper elevated alignment) */}
              <div className="flex flex-col items-center justify-center w-full pb-0.5">
                <button
                  id="bottom-nav-center-mic-btn"
                  type="button"
                  onClick={toggleListening}
                  className={`relative -mt-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 cursor-pointer shrink-0 ${
                    voiceState.isListening
                      ? 'bg-gradient-to-tr from-rose-600 to-red-500 scale-110 ring-4 ring-rose-200 shadow-rose-300 animate-pulse'
                      : 'bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 hover:scale-105 shadow-indigo-300/70 ring-2 ring-white'
                  }`}
                  title={voiceState.isListening ? 'Microphone Active - Tap to Close' : 'Tap to speak voice commands'}
                  aria-label="Voice Control Microphone"
                >
                  {voiceState.isListening ? (
                    <>
                      <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60 pointer-events-none" />
                      <MicOff className="w-5 h-5" />
                    </>
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
                <span className={`text-[10px] sm:text-[11px] font-bold mt-1 text-center leading-tight select-none transition-colors ${
                  voiceState.isListening ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-600'
                }`}>
                  {voiceState.isListening ? (language === 'ta' ? 'மூடு' : language === 'hi' ? 'रोकें' : 'Stop') : (language === 'ta' ? 'குரல்' : language === 'hi' ? 'माइक' : 'Voice')}
                </span>
              </div>

              {/* 4. BLOCKCHAIN */}
              <button
                id="bottom-nav-blockchain-btn"
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onCustomerTabChange?.('audit');
                }}
                className={`w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCustomerTab === 'audit'
                    ? 'text-indigo-600 bg-indigo-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <History className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('blockchainNav')}</span>
              </button>

              {/* 5. MORE */}
              <button
                id="bottom-nav-more-btn"
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`relative w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isMoreMenuOpen
                    ? 'text-indigo-600 bg-indigo-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <MoreHorizontal className="w-5 h-5 mb-0.5 shrink-0" />
                  {pendingCustomerRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-2.5 min-w-3.5 h-3.5 px-1 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center animate-pulse shadow-xs">
                      {pendingCustomerRequestsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('moreNav')}</span>
              </button>
            </>
          ) : activeRole === 'bank_staff' && isLoggedIn ? (
            <>
              {/* 1. Overview */}
              <button
                id="bottom-nav-bank-overview-btn"
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onBankTabChange?.('overview');
                }}
                className={`w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBankTab === 'overview'
                    ? 'text-purple-700 bg-purple-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Home className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('overviewNav')}</span>
              </button>

              {/* 2. Queue with Count */}
              <button
                id="bottom-nav-bank-queue-btn"
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onBankTabChange?.('requests');
                }}
                className={`relative w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBankTab === 'requests'
                    ? 'text-purple-700 bg-purple-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 mb-0.5 shrink-0" />
                  {pendingBankQueueCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse shadow-xs">
                      {pendingBankQueueCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('queueNav')}</span>
              </button>

              {/* 3. CENTER MIC (Microphone with proper elevated alignment) */}
              <div className="flex flex-col items-center justify-center w-full pb-0.5">
                <button
                  id="bottom-nav-bank-center-mic-btn"
                  type="button"
                  onClick={toggleListening}
                  className={`relative -mt-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 cursor-pointer shrink-0 ${
                    voiceState.isListening
                      ? 'bg-gradient-to-tr from-rose-600 to-red-500 scale-110 ring-4 ring-rose-200 shadow-rose-300 animate-pulse'
                      : 'bg-gradient-to-tr from-purple-700 via-indigo-700 to-purple-800 hover:scale-105 shadow-purple-300/70 ring-2 ring-white'
                  }`}
                  title={voiceState.isListening ? 'Microphone Active - Tap to Close' : 'Tap to speak voice commands'}
                  aria-label="Voice Control Microphone"
                >
                  {voiceState.isListening ? (
                    <>
                      <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60 pointer-events-none" />
                      <MicOff className="w-5 h-5" />
                    </>
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
                <span className={`text-[10px] sm:text-[11px] font-bold mt-1 text-center leading-tight select-none transition-colors ${
                  voiceState.isListening ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-600'
                }`}>
                  {voiceState.isListening ? (language === 'ta' ? 'மூடு' : language === 'hi' ? 'रोकें' : 'Stop') : (language === 'ta' ? 'குரல்' : language === 'hi' ? 'माइक' : 'Voice')}
                </span>
              </div>

              {/* 4. BLOCKCHAIN */}
              <button
                id="bottom-nav-bank-blockchain-btn"
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onBankTabChange?.('ledger');
                }}
                className={`w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBankTab === 'ledger' || activeBankTab === 'blockchain'
                    ? 'text-purple-700 bg-purple-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <History className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('blockchainNav')}</span>
              </button>

              {/* 5. MORE */}
              <button
                id="bottom-nav-bank-more-btn"
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`w-full min-h-[48px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isMoreMenuOpen
                    ? 'text-purple-700 bg-purple-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <MoreHorizontal className="w-5 h-5 mb-0.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] truncate w-full text-center leading-tight font-semibold">{t('moreNav')}</span>
              </button>
            </>
          ) : (
            /* Logged Out / Login Screen Options */
            <div className="col-span-5 flex items-center justify-center gap-3 w-full py-1">
              <button
                id="bottom-nav-role-citizen-btn"
                type="button"
                onClick={() => onRoleSwitch?.('customer')}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'customer'
                    ? 'text-indigo-600 bg-indigo-50 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>{t('citizenPortalSwitch')}</span>
              </button>

              <button
                id="bottom-nav-role-bank-btn"
                type="button"
                onClick={() => onRoleSwitch?.('bank_staff')}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'bank_staff'
                    ? 'text-purple-700 bg-purple-50 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t('bankStaffPortalSwitch')}</span>
              </button>

              <button
                id="bottom-nav-login-lang-btn"
                type="button"
                onClick={cycleLanguage}
                className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all cursor-pointer"
                title={`Language: ${language}. Click to switch.`}
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="font-extrabold text-indigo-700">
                  {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : 'EN'}
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
