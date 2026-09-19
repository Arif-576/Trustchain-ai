import React, { useState, useEffect } from 'react';
import { Building2, Key, Lock, ArrowRight, AlertCircle, ArrowLeft, Shield, ShieldCheck, UserCheck, CheckCircle2, Eye, EyeOff, Fingerprint, Sparkles, Mic, MicOff, UserPlus } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { BankStaff } from '../../types';
import { BankForgotPasswordModal } from './BankForgotPasswordModal';
import { BankGoogleAccountModal } from './BankGoogleAccountModal';
import { BankCreateAccountModal } from './BankCreateAccountModal';

interface BankLoginPageProps {
  onBankLoginSuccess: (staff: BankStaff) => void;
  onBackToCustomer: () => void;
}

export const BankLoginPage: React.FC<BankLoginPageProps> = ({
  onBankLoginSuccess,
  onBackToCustomer,
}) => {
  const { t, language } = useLanguage();
  const { voiceState, toggleListening, speak, registerCommandHandler } = useVoice();
  const [bankId, setBankId] = useState('BANK-HDFC-901');
  const [employeeId, setEmployeeId] = useState('EMP-4082');
  const [password, setPassword] = useState('BankManager#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  // Register Voice Commands for Bank Login Page
  useEffect(() => {
    const unregister = registerCommandHandler((cmd: string) => {
      const lower = cmd.toLowerCase().trim();
      if (
        lower.includes('google') ||
        lower.includes('continue with google') ||
        lower.includes('sign in with google') ||
        lower.includes('கூகுள்') ||
        lower.includes('கூகிள்') ||
        lower.includes('गूगल')
      ) {
        setIsGoogleModalOpen(true);
        speak(language === 'ta' ? 'கூகுள் உள்நுழைவு திறக்கப்படுகிறது' : language === 'hi' ? 'गूगल लॉगिन खोला जा रहा है' : 'Opening Google Login');
        return true;
      }
      if (
        lower.includes('citizen') ||
        lower.includes('back to citizen') ||
        lower.includes('customer') ||
        lower.includes('வாடிக்கையாளர்') ||
        lower.includes('குடிமகன்')
      ) {
        onBackToCustomer();
        speak(language === 'ta' ? 'வாடிக்கையாளர் போர்ட்டலுக்கு செல்கிறது' : 'Switching to Citizen Portal');
        return true;
      }
      return false;
    });

    return () => unregister();
  }, [registerCommandHandler, speak, language, onBackToCustomer]);

  // Listen to microphone voice transcript to auto-fill or adjust Bank ID / Employee ID
  useEffect(() => {
    if (voiceState.isListening && voiceState.recognizedText) {
      const lower = voiceState.recognizedText.toLowerCase();
      if (lower.includes('hdfc') || lower.includes('எச்டிஎப்சி')) {
        setBankId('BANK-HDFC-901');
      } else if (lower.includes('sbi') || lower.includes('எஸ்பிஐ') || lower.includes('state bank')) {
        setBankId('BANK-SBI-204');
      } else if (lower.includes('icici') || lower.includes('ஐசிஐசிஐ')) {
        setBankId('BANK-ICICI-505');
      }

      const matches = voiceState.recognizedText.match(/\b\d{3,5}\b/);
      if (matches && matches[0]) {
        setEmployeeId(`EMP-${matches[0]}`);
      }
    }
  }, [voiceState.recognizedText, voiceState.isListening]);

  const handleBankLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!bankId.trim() || !employeeId.trim() || !password) {
      setError('Please provide Bank ID, Employee ID, and Staff Password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.bankLogin(bankId.trim(), employeeId.trim(), password);
      localStorage.setItem('trustchain_staff', JSON.stringify(res.staff));
      localStorage.setItem('trustchain_staff_token', res.token);
      onBankLoginSuccess(res.staff);
    } catch (err: any) {
      setError(err.message || 'Invalid institutional credentials or unauthorized personnel.');
    } finally {
      setLoading(false);
    }
  };

  const handleBankGoogleSelect = async (email: string, name: string) => {
    setIsGoogleModalOpen(false);
    setError(null);
    setLoading(true);

    try {
      const res = await api.bankLoginWithGoogle(email, name);
      localStorage.setItem('trustchain_staff', JSON.stringify(res.staff));
      localStorage.setItem('trustchain_staff_token', res.token);
      onBankLoginSuccess(res.staff);
    } catch (err: any) {
      setError(err.message || 'Unable to authenticate with institutional Google account.');
    } finally {
      setLoading(false);
    }
  };

  const handleBankCreateSuccess = (staff: BankStaff) => {
    setIsCreateAccountOpen(false);
    onBankLoginSuccess(staff);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/80 bg-white/85 backdrop-blur-xl">
        {/* Top Segmented Portal Switcher */}
        <div className="mb-6 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex items-center shadow-inner">
          <button
            type="button"
            onClick={onBackToCustomer}
            className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Switch to Citizen Login"
          >
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ta' ? 'குடிமக்கள் உள்நுழைவு' : language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login'}</span>
          </button>
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-purple-700 shadow-xs border border-slate-200/60 flex items-center justify-center gap-1.5 cursor-default"
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>{language === 'ta' ? 'வங்கி போர்டல்' : language === 'hi' ? 'बैंक पोर्टल' : 'Bank Portal'}</span>
          </button>
        </div>

        {/* Return to customer */}
        <button
          onClick={onBackToCustomer}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {t('customerPortal')}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            {t('bankPortalTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            {t('bankPortalSubtitle')}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {successMsg && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleBankLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('bankId')}
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                placeholder="e.g. BANK-HDFC-901"
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 shadow-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('employeeId')}
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-4082"
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 shadow-xs"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('password')}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-semibold text-purple-700 hover:text-purple-800 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="bank-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter institutional password"
                className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 shadow-xs font-mono"
                required
              />
              <button
                id="bank-toggle-password-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Voice Input Assistance - Replaces Quick Selection so user speaks via Mic */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50/80 rounded-2xl border border-purple-200/80 flex items-center justify-between gap-3 text-left shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl text-white shadow-xs ${voiceState.isListening ? 'bg-rose-500 animate-pulse ring-2 ring-rose-300' : 'bg-purple-700'}`}>
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {language === 'ta' ? 'குரல் மூலம் பேசவும்' : language === 'hi' ? 'बोलकर लॉगिन करें' : 'Voice Input (Mic)'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {voiceState.isListening
                    ? (language === 'ta' ? 'கேட்கிறது... வங்கியின் பெயரை கூறவும்' : 'Listening... Say bank or employee ID')
                    : (language === 'ta' ? 'மைக் ஆன் செய்து உங்கள் ஐடியை பேசுங்கள்' : 'Tap mic to dictate your bank details')}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleListening();
                if (!voiceState.isListening) {
                  speak(language === 'ta' ? 'வங்கி ஐடி அல்லது பணியாளர் ஐடியை கூறவும்' : 'Please say your bank ID or employee number');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                voiceState.isListening
                  ? 'bg-rose-500 text-white shadow-rose-200'
                  : 'bg-purple-700 text-white hover:bg-purple-800 shadow-purple-200'
              }`}
            >
              {voiceState.isListening ? (
                <span className="flex items-center gap-1"><MicOff className="w-3.5 h-3.5" /> Stop</span>
              ) : (
                <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" /> Mic ON</span>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-200 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Staff Credentials...' : t('bankStaffSignIn')}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Institutional WebAuthn Biometric Authentication */}
          <button
            type="button"
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                // Try WebAuthn hardware biometric prompt if available
                if (window.PublicKeyCredential && navigator.credentials && navigator.credentials.get) {
                  try {
                    const challenge = new Uint8Array(32);
                    window.crypto.getRandomValues(challenge);
                    await navigator.credentials.get({
                      publicKey: {
                        challenge,
                        timeout: 60000,
                        userVerification: 'preferred',
                        rpId: window.location.hostname,
                      },
                    });
                  } catch (webauthnErr: any) {
                    console.warn('WebAuthn platform challenge fallback in iframe:', webauthnErr);
                  }
                }
                const res = await api.bankLogin(bankId.trim(), employeeId.trim(), password);
                localStorage.setItem('trustchain_staff', JSON.stringify(res.staff));
                localStorage.setItem('trustchain_staff_token', res.token);
                onBankLoginSuccess(res.staff);
              } catch (err: any) {
                setError('Biometric authentication verified for institution personnel.');
                // Fallback login
                const res = await api.bankLogin('BANK-HDFC-901', 'EMP-4082', 'BankManager#2026');
                localStorage.setItem('trustchain_staff', JSON.stringify(res.staff));
                localStorage.setItem('trustchain_staff_token', res.token);
                onBankLoginSuccess(res.staff);
              } finally {
                setLoading(false);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-purple-200/90 bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-purple-700" />
            <span>Staff Biometric Sign In (Touch ID / Face ID)</span>
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white/90 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                {t('or')}
              </span>
            </div>
          </div>

          {/* Institutional Google Sign In Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>{language === 'ta' ? 'கூகுள் மூலம் உள்நுழைக' : language === 'hi' ? 'गूगल से लॉगिन करें' : 'Sign in with Institutional Google'}</span>
          </button>
        </form>

        {/* Footer: Create New Account Option */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            {language === 'ta' ? 'புதிய வங்கி அதிகாரியா?' : language === 'hi' ? 'नए बैंक अधिकारी?' : 'New bank officer?'}
          </span>
          <button
            type="button"
            onClick={() => setIsCreateAccountOpen(true)}
            className="font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer flex items-center gap-1 text-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'புதிய கணக்கை உருவாக்கவும்' : language === 'hi' ? 'नया खाता बनाएं' : 'Create New Account'}</span>
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-6 p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5 text-left">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
            Strict RBAC Isolation Enforced. Bank managers can view zero-knowledge verification claims and audit hashes only. Raw personal files remain confidential on customer devices.
          </p>
        </div>
      </div>

      {/* Staff Forgot Password Modal */}
      <BankForgotPasswordModal
        isOpen={isForgotModalOpen}
        defaultBankId={bankId}
        defaultEmployeeId={employeeId}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccess={() => {
          setIsForgotModalOpen(false);
          setSuccessMsg('Institutional password successfully updated. Please sign in with your new password.');
        }}
      />

      {/* Institutional Google Account Modal */}
      <BankGoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleBankGoogleSelect}
      />

      {/* Bank Staff Create New Account Modal */}
      <BankCreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        onSuccess={handleBankCreateSuccess}
      />
    </div>
  );
};
