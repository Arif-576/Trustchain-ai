import React, { useState } from 'react';
import { Shield, Globe, Mic, MicOff, LogOut, User as UserIcon, Building2, Volume2, VolumeX, Sparkles, HelpCircle, Settings } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { useEasyMode } from '../../context/EasyModeContext';
import { SupportedLanguage, User, BankStaff } from '../../types';
import { HowItWorksModal } from './HowItWorksModal';

interface HeaderProps {
  currentUser: User | null;
  currentStaff: BankStaff | null;
  activeRole: 'customer' | 'bank_staff';
  onRoleSwitch?: (role: 'customer' | 'bank_staff') => void;
  onLogout: () => void;
  onOpenSettings?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentStaff,
  activeRole,
  onRoleSwitch,
  onLogout,
  onOpenSettings,
  onOpenAiAssistant,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { voiceState, toggleListening, toggleVoiceEnabled } = useVoice();
  const { isEasyMode, toggleEasyMode } = useEasyMode();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const isLoggedIn = Boolean(currentUser || currentStaff);

  return (
    <>
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/60 bg-white/85 backdrop-blur-md transition-all overflow-x-hidden">
        {/* DESKTOP & TABLET SINGLE-ROW HEADER (sm and above) */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  TRUSTCHAIN
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  KYC & SSI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block font-medium">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* How it works info button */}
            <button
              id="header-how-it-works-btn"
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
              title="How TrustChain works / எப்படி இயங்குகிறது?"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden xl:inline">{language === 'ta' ? 'எப்படி இயங்குகிறது?' : language === 'hi' ? 'कैसे काम करता है?' : 'Help'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center shrink-0">
              <label htmlFor="language-select" className="sr-only">Choose Language</label>
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/95 border border-slate-200 hover:border-indigo-300 text-slate-700 shadow-xs transition-colors">
                <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  aria-label="Select Application Language"
                  className="bg-transparent text-xs font-bold text-slate-700 cursor-pointer focus:outline-none pr-1"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ்</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>

            {/* Easy Mode */}
            {isLoggedIn && (
              <button
                id="easy-mode-header-toggle"
                onClick={toggleEasyMode}
                title={isEasyMode ? 'Exit Easy Simplified Mode' : 'Switch to Easy Simplified Mode'}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 ${
                  isEasyMode
                    ? 'bg-amber-500 text-white shadow-amber-200 ring-2 ring-amber-400 animate-pulse'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEasyMode ? 'Easy ON' : 'Easy Mode'}</span>
              </button>
            )}

            {/* Voice Accessibility Button */}
            <button
              id="voice-toggle-btn"
              onClick={toggleListening}
              title={voiceState.isListening ? 'Microphone Active - Tap to Close' : 'Turn on Voice Microphone'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 ${
                voiceState.isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-200 ring-2 ring-rose-400'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
              }`}
            >
              {voiceState.isListening ? <Mic className="w-3.5 h-3.5 animate-bounce" /> : <Mic className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">
                {voiceState.isListening ? (language === 'ta' ? 'மைக் மூடு' : language === 'hi' ? 'माइक बंद' : 'Stop Mic') : (language === 'ta' ? 'குரல் மைக்' : language === 'hi' ? 'माइक' : 'Voice Mic')}
              </span>
            </button>

            {/* Voice Audio Guidance Mute/Unmute */}
            <button
              id="tts-mute-toggle"
              onClick={toggleVoiceEnabled}
              title={voiceState.voiceEnabled ? 'Mute Spoken Audio' : 'Enable Spoken Audio'}
              className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100/80 border border-slate-200/80 transition-all cursor-pointer shrink-0"
            >
              {voiceState.voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* TrustAI Header Button */}
            <button
              id="header-trustai-btn"
              type="button"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white text-xs font-bold shadow-xs hover:from-indigo-700 hover:to-blue-700 transition-all cursor-pointer border border-indigo-400/30 shrink-0"
              title="Open TrustAI Assistant / சாட்பாக்ஸ்"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>TrustAI</span>
            </button>

            {/* Portal Switcher (Logged out) */}
            {!currentUser && !currentStaff && onRoleSwitch && (
              <div
                id="header-portal-navigation-top"
                className="flex items-center p-0.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold shrink-0 shadow-xs"
              >
                <button
                  id="header-nav-citizen-portal-btn"
                  type="button"
                  onClick={() => onRoleSwitch('customer')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRole === 'customer'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs border border-indigo-100'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Citizen Portal"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{t('customerPortal')}</span>
                </button>
                <button
                  id="header-nav-bank-portal-btn"
                  type="button"
                  onClick={() => onRoleSwitch('bank_staff')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRole === 'bank_staff'
                      ? 'bg-purple-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Bank Staff Portal"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t('bankStaffPortal')}</span>
                </button>
              </div>
            )}

            {/* Profile Avatar / Badge */}
            {currentUser && activeRole === 'customer' && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-indigo-200 object-cover shadow-xs"
                />
                <span className="text-xs font-bold text-slate-700 hidden lg:block">
                  {currentUser.name}
                </span>
              </div>
            )}

            {currentStaff && activeRole === 'bank_staff' && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">
                    {currentStaff.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {currentStaff.employeeId}
                  </span>
                </div>
              </div>
            )}

            {/* Prominent Logout Button */}
            {(currentUser || currentStaff) && (
              <button
                id="logout-button"
                type="button"
                onClick={onLogout}
                title={t('logout')}
                className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logout')}</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE RESPONSIVE HEADER (< sm screens) */}
        <div className="sm:hidden w-full">
          {/* Top Row: Brand on Left, Language & Profile/Logout on Right */}
          <div className="h-14 px-3 flex items-center justify-between gap-2">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                TRUSTCHAIN
              </span>
            </div>

            {/* Right Controls: Language Selector + Profile + Logout (or Portal Switcher) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Language Selector */}
              <div className="relative flex items-center shrink-0">
                <label htmlFor="language-select-mobile" className="sr-only">Choose Language</label>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/95 border border-slate-200 text-slate-700 shadow-xs">
                  <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
                  <select
                    id="language-select-mobile"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    aria-label="Select Application Language"
                    className="bg-transparent text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="en">EN</option>
                    <option value="ta">தமிழ்</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                </div>
              </div>

              {/* Portal Switcher if logged out */}
              {!currentUser && !currentStaff && onRoleSwitch && (
                <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => onRoleSwitch('customer')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      activeRole === 'customer'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => onRoleSwitch('bank_staff')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      activeRole === 'bank_staff'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Bank
                  </button>
                </div>
              )}

              {/* User Profile Avatar if logged in */}
              {currentUser && activeRole === 'customer' && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full border border-indigo-200 object-cover shadow-xs shrink-0"
                />
              )}

              {currentStaff && activeRole === 'bank_staff' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Logout Button if logged in */}
              {(currentUser || currentStaff) && (
                <button
                  type="button"
                  onClick={onLogout}
                  title={t('logout')}
                  className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-xs shrink-0"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Utility Toolbar: Help | TrustAI | Voice Mic | Audio | Easy Mode */}
          <div className="h-10 px-2 py-1 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-1.5">
            {/* Help */}
            <button
              id="header-how-it-works-btn-mobile"
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="flex-1 min-w-0 h-7.5 px-1.5 rounded-lg text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] font-bold shadow-xs truncate"
              title="How TrustChain works / எப்படி இயங்குகிறது?"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{language === 'ta' ? 'உதவி' : language === 'hi' ? 'मदद' : 'Help'}</span>
            </button>

            {/* TrustAI */}
            <button
              id="header-trustai-btn-mobile"
              type="button"
              onClick={onOpenAiAssistant}
              className="flex-1 min-w-0 h-7.5 px-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[11px] font-bold shadow-xs hover:from-indigo-700 hover:to-blue-700 transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 truncate"
              title="Open TrustAI Assistant"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse shrink-0" />
              <span className="truncate">TrustAI</span>
            </button>

            {/* Voice Mic */}
            <button
              id="voice-toggle-btn-mobile"
              type="button"
              onClick={toggleListening}
              title={voiceState.isListening ? 'Microphone Active - Tap to Close' : 'Turn on Voice Microphone'}
              className={`flex-1 min-w-0 h-7.5 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1 truncate ${
                voiceState.isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
              }`}
            >
              {voiceState.isListening ? <Mic className="w-3.5 h-3.5 animate-bounce shrink-0" /> : <Mic className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">
                {voiceState.isListening ? (language === 'ta' ? 'மூடு' : 'Stop') : (language === 'ta' ? 'குரல்' : language === 'hi' ? 'माइक' : 'Voice')}
              </span>
            </button>

            {/* Speaker Audio TTS */}
            <button
              id="tts-mute-toggle-mobile"
              type="button"
              onClick={toggleVoiceEnabled}
              title={voiceState.voiceEnabled ? 'Mute Spoken Audio' : 'Enable Spoken Audio'}
              className="h-7.5 px-2 rounded-lg text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-xs"
            >
              {voiceState.voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Easy Mode Toggle */}
            {isLoggedIn && (
              <button
                id="easy-mode-header-toggle-mobile"
                type="button"
                onClick={toggleEasyMode}
                title={isEasyMode ? 'Exit Easy Simplified Mode' : 'Switch to Easy Simplified Mode'}
                className={`h-7.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1 ${
                  isEasyMode
                    ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                    : 'bg-amber-50 text-amber-900 border border-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Easy</span>
              </button>
            )}
          </div>
        </div>
      </header>

    {/* How It Works Modal */}
    <HowItWorksModal
      isOpen={isHowItWorksOpen}
      onClose={() => setIsHowItWorksOpen(false)}
    />
  </>
  );
};
