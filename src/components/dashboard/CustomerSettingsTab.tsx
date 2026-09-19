import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  User,
  LogOut,
  Globe,
  Mic,
  Volume2,
  VolumeX,
  Fingerprint,
  Lock,
  Cpu,
  KeyRound,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { useEasyMode } from '../../context/EasyModeContext';
import { User as UserType, SupportedLanguage } from '../../types';
import { BiometricAuthModal } from '../auth/BiometricAuthModal';
import { getSavedAccountProfile } from '../../services/identityProfile';

interface CustomerSettingsTabProps {
  user: UserType;
  onLogout: () => void;
  onOpenAiAssistant?: () => void;
  onEditIdentityProfile?: () => void;
}

export const CustomerSettingsTab: React.FC<CustomerSettingsTabProps> = ({
  user,
  onLogout,
  onOpenAiAssistant,
  onEditIdentityProfile,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { voiceState, toggleVoiceEnabled, toggleListening, speak } = useVoice();
  const { isEasyMode, toggleEasyMode } = useEasyMode();
  const savedProfile = getSavedAccountProfile(user);

  const [showBiometricTest, setShowBiometricTest] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [zkpAgeOnly, setZkpAgeOnly] = useState(true);
  const [zkpIncomeRange, setZkpIncomeRange] = useState(true);
  const [sessionAutoLock, setSessionAutoLock] = useState<'15' | '30' | 'never'>('15');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Floating AI bubble preference
  const [hideFloatingAI, setHideFloatingAI] = useState<boolean>(() => {
    return localStorage.getItem('trustchain_hide_ai_fab') === 'true';
  });

  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const triggerSaveFeedback = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const toggleFloatingAiPreference = () => {
    const nextVal = !hideFloatingAI;
    setHideFloatingAI(nextVal);
    localStorage.setItem('trustchain_hide_ai_fab', String(nextVal));
    window.dispatchEvent(new Event('storage'));
    triggerSaveFeedback(
      nextVal
        ? (isTamil ? 'AI மிதக்கும் ஐகான் மறைக்கப்பட்டது' : 'Floating AI bubble hidden from screen corner')
        : (isTamil ? 'AI மிதக்கும் ஐகான் காட்டப்படுகிறது' : 'Floating AI bubble enabled')
    );
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    const msg =
      lang === 'ta'
        ? 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது'
        : lang === 'hi'
        ? 'हिंदी भाषा चुनी गई'
        : 'English language selected';
    speak(msg);
    triggerSaveFeedback(msg);
  };

  const handleLogoutAction = () => {
    speak(
      isTamil
        ? 'அடையாள வாலட்டிலிருந்து வெற்றிகரமாக வெளியேறியுள்ளீர்கள்.'
        : isHindi
        ? 'आप सफलतापूर्वक साइन आउट हो गए हैं।'
        : 'You have signed out from your identity wallet.'
    );
    onLogout();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Settings Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 backdrop-blur-md flex items-center justify-center text-indigo-300 shadow-md">
            <Settings className="w-7 h-7 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {isTamil ? 'அமைப்புகள் & பாதுகாப்பு' : isHindi ? 'सेटिंग्स और सुरक्षा' : 'Settings & Security'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Encrypted
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-lg">
              {isTamil
                ? 'உங்கள் சுய-கட்டுப்பாட்டு அடையாளம், குரல் வழிகாட்டுதல், பயோமெட்ரிக் மற்றும் வெளியேறும் அமைப்புகளை நிர்வகிக்கவும்.'
                : 'Manage your sovereign identity preferences, voice accessibility, ZKP privacy gates, and device security.'}
            </p>
          </div>
        </div>

        {/* Prominent Quick Logout Button in Header */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="settings-header-logout-btn"
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isTamil ? 'கணக்கிலிருந்து வெளியேறு' : isHindi ? 'साइन आउट' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Temporary save notification badge */}
      {savedFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* 2-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: Sovereign User Identity & DID Profile */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-800">
                {isTamil ? 'சுயவிவரம் & டிஜிட்டல் அடையாளம்' : 'Sovereign Identity Profile'}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
              W3C DID v1.0
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-extrabold text-slate-900">{user.name}</h4>
              <div className="text-xs text-slate-600 font-medium">{user.email}</div>
              <div className="text-[11px] text-indigo-700 font-mono font-bold mt-0.5">
                Aadhaar: {user.aadhaarMasked} • Phone: {user.phone}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Decentralized Identifier (DID)
              </span>
              <span className="font-mono text-[11px] text-slate-800 break-all select-all font-semibold">
                did:trustchain:0x9841c8e3fa02b9a714d5e68
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/90">
              <div>
                <span className="font-bold text-slate-800 block">UIDAI Aadhaar Verification</span>
                <span className="text-[11px] text-slate-500">Cryptographically bound sovereign credential</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>VERIFIED</span>
              </span>
            </div>

            {savedProfile && (
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-indigo-800 block">
                    TrustChain Credential ID
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-600">
                    {savedProfile.qrVerificationRef}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-indigo-950 font-bold break-all">
                  {savedProfile.credentialId}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Proof: {savedProfile.proofId}
                </div>
              </div>
            )}

            {onEditIdentityProfile && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onEditIdentityProfile}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'அடையாள விவரங்களைத் திருத்து / புதுப்பி' : isHindi ? 'पहचान विवरण अपडेट करें' : 'Edit / Update Identity Details'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 2: Language & Voice Accessibility Preferences */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-800">
                {isTamil ? 'மொழி & குரல் அணுகல்' : 'Language & Accessibility'}
              </h3>
            </div>
          </div>

          {/* Language Switcher Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              {isTamil ? 'பயன்பாட்டு மொழி / Preferred Language' : 'Preferred Language'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'ta', label: 'தமிழ்', sub: 'Tamil' },
                { code: 'en', label: 'English', sub: 'English' },
                { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code as SupportedLanguage)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    language === item.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-extrabold">{item.label}</div>
                  <div className={`text-[10px] ${language === item.code ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Audio Readout Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                {voiceState.voiceEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{isTamil ? 'குரல் வழி வாசித்தல் (Spoken Audio)' : 'Spoken Audio Guidance'}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isTamil ? 'திரை தகவல்களை குரலில் கேட்க உதவும்' : 'Read aloud answers and instructions'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleVoiceEnabled}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                voiceState.voiceEnabled
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {voiceState.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Easy Mode Toggle for Elderly / Illiterate Users */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90">
            <div className="space-y-0.5">
              <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isTamil ? 'எளிய பயன்முறை (Senior / Easy Mode)' : 'Simplified Senior Citizen Mode'}</span>
              </div>
              <p className="text-[11px] text-amber-900/80">
                {isTamil ? 'பெரிய எழுத்துகள் & எளிய ஐகான்கள்' : 'Enlarged controls & minimal layout'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleEasyMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isEasyMode
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {isEasyMode ? 'ACTIVE' : 'INACTIVE'}
            </button>
          </div>

          {/* Floating AI Chatbox Widget Visibility Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
            <div className="space-y-0.5 max-w-[280px]">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{isTamil ? 'மிதக்கும் AI ஐகான் நிலை' : 'Floating AI Widget in Corner'}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isTamil
                  ? 'மூலையில் இருக்கும் ஐகான் திரையை மறைப்பதாக உணர்ந்தால் மறைத்துக் கொள்ளலாம் (மேல் பகுதியில் எப்போதும் இருக்கும்)'
                  : 'Hide corner floating bubble if it covers buttons. TrustAI remains available in top header.'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleFloatingAiPreference}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hideFloatingAI
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {hideFloatingAI ? (isTamil ? 'மறைக்கப்பட்டுள்ளது' : 'Hidden') : (isTamil ? 'காட்டப்படுகிறது' : 'Visible')}
            </button>
          </div>
        </div>

        {/* PANEL 3: Biometric Security & WebAuthn Passkeys */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-800">
                {isTamil ? 'பயோமெட்ரிக் & சாதன பாதுகாப்பு' : 'Biometrics & Passkey Security'}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Hardware Secure Enclave
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">
                  {isTamil ? 'விரல் ரேகை / முக ஸ்கேன் (WebAuthn)' : 'Touch ID / Face ID Biometric'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Hardware-bound credential on this device
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBiometricTest(true)}
                className="py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer border border-indigo-200"
              >
                {isTamil ? 'சோதி / ஸ்கேன்' : 'Test Scan'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">
                  {isTamil ? 'தானியங்கி லாக் நேரம்' : 'Auto-Lock Inactivity Timeout'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Locks wallet when inactive
                </span>
              </div>
              <select
                value={sessionAutoLock}
                onChange={(e) => {
                  setSessionAutoLock(e.target.value as any);
                  triggerSaveFeedback('Auto-lock timeout updated');
                }}
                className="py-1 px-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="15">15 mins</option>
                <option value="30">30 mins</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* PANEL 4: Zero-Knowledge Privacy & Consents */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-800">
                {isTamil ? 'ZKP ஜீரோ-நாலெட்ஜ் தனியுரிமை விதிகள்' : 'Zero-Knowledge Privacy Gates'}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              Groth16 zk-SNARK
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5 max-w-[260px]">
                <span className="font-bold text-slate-800 block">
                  {isTamil ? 'பிறந்த தேதியை மறைத்து வயதை மட்டும் காட்டு' : 'Zero DOB Leakage (Age >= 18)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Verifies legal adulthood without revealing date of birth
                </span>
              </div>
              <input
                type="checkbox"
                checked={zkpAgeOnly}
                onChange={() => {
                  setZkpAgeOnly(!zkpAgeOnly);
                  triggerSaveFeedback('ZKP predicate policy updated');
                }}
                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5 max-w-[260px]">
                <span className="font-bold text-slate-800 block">
                  {isTamil ? 'துல்லிய வருமானத்தை மறைத்து வரம்பை மட்டும் காட்டு' : 'Salary Bracket Gate'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Proves salary threshold without revealing bank account balance
                </span>
              </div>
              <input
                type="checkbox"
                checked={zkpIncomeRange}
                onChange={() => {
                  setZkpIncomeRange(!zkpIncomeRange);
                  triggerSaveFeedback('Salary predicate updated');
                }}
                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DANGER ZONE / ACCOUNT LOGOUT BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50/50 via-white to-rose-50/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>{isTamil ? 'கணக்கு அமர்வு மற்றும் வெளியேறுதல்' : 'Session & Account Security'}</span>
            </div>
            <p className="text-xs text-slate-600">
              {isTamil
                ? 'உங்கள் வாலட் அமர்வை முடித்து, மீண்டும் உள்நுழைவு பக்கத்திற்கு செல்ல கீழே உள்ள பொத்தானை அழுத்தவும்.'
                : 'Safely end your sovereign identity session and return to the login screen.'}
            </p>
          </div>

          <button
            id="settings-main-logout-btn"
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>{isTamil ? 'கணக்கிலிருந்து வெளியேறு (Sign Out)' : isHindi ? 'खाते से साइन आउट करें' : 'Sign Out of TrustChain'}</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {isTamil ? 'வெளியேற விரும்புகிறீர்களா?' : isHindi ? 'क्या आप साइन आउट करना चाहते हैं?' : 'Confirm Sign Out?'}
              </h3>
              <p className="text-xs text-slate-500">
                {isTamil
                  ? 'உங்கள் அமர்வு பாதுகாக்கப்பட்டு மூடப்படும். நீங்கள் எந்த நேரத்திலும் கைரேகை அல்லது பாஸ்வர்டு மூலம் மீண்டும் உள்நுழையலாம்.'
                  : 'Your encrypted session keys will be cleared. You can sign back in anytime using biometrics or password.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isTamil ? 'ரத்து செய்' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleLogoutAction}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{isTamil ? 'ஆம், வெளியேறு' : 'Yes, Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biometric WebAuthn Test Modal */}
      <BiometricAuthModal
        isOpen={showBiometricTest}
        onClose={() => setShowBiometricTest(false)}
        defaultContact={user.email}
        onSuccess={() => {
          setShowBiometricTest(false);
          triggerSaveFeedback(
            isTamil ? 'கைரேகை சரிபார்ப்பு வெற்றிகரமாக முடிந்தது!' : 'Biometric hardware passkey verified!'
          );
        }}
      />
    </div>
  );
};
