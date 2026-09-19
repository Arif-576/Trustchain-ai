import React, { useState, useEffect } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Radio,
  HelpCircle,
  Zap,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { User } from '../../types';
import { GoogleAccountModal } from './GoogleAccountModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { CreateAccountModal } from './CreateAccountModal';
import { PINAuthModal } from './PINAuthModal';
import { HowItWorksModal } from '../common/HowItWorksModal';

interface LoginPageProps {
  onLoginSuccess: (user: User, requiresVerification: boolean) => void;
  onOpenBankPortal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenBankPortal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    voiceState,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    registerCommandHandler,
    setLastActionFeedback,
  } = useVoice();

  const [contact, setContact] = useState('arif@trustchain.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isInputListening, setIsInputListening] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  // Hands-free voice commands on Login Page
  useEffect(() => {
    const unregister = registerCommandHandler((cmd) => {
      const lower = cmd.toLowerCase().trim();

      // Continue with Google
      if (
        lower.includes('google') ||
        lower.includes('continue with google') ||
        lower.includes('sign in with google') ||
        lower.includes('login with google') ||
        lower.includes('கூகுள்') ||
        lower.includes('கூகிள்') ||
        lower.includes('गूगल')
      ) {
        if (isGoogleModalOpen) {
          handleGoogleAccountSelect('arif@trustchain.id', 'Mohamed Arif A');
        } else {
          setIsGoogleModalOpen(true);
          speak(
            isTamil
              ? 'கூகுள் மூலம் தொடர்கிறது'
              : isHindi
              ? 'गूगल से जारी रख रहे हैं'
              : 'Continuing with Google'
          );
        }
        return true;
      }

      // If Google modal is open, voice select account
      if (isGoogleModalOpen) {
        if (
          lower.includes('arif') ||
          lower.includes('mohamed') ||
          lower.includes('second') ||
          lower.includes('2')
        ) {
          handleGoogleAccountSelect('arif@trustchain.id', 'Mohamed Arif A');
          return true;
        }
        if (
          lower.includes('midhun') ||
          lower.includes('first') ||
          lower.includes('1')
        ) {
          handleGoogleAccountSelect('midhun@trustchain.id', 'Midhun');
          return true;
        }
        if (
          lower.includes('close') ||
          lower.includes('cancel') ||
          lower.includes('back')
        ) {
          setIsGoogleModalOpen(false);
          return true;
        }
      }

      // PIN trigger
      if (
        lower.includes('pin') ||
        lower.includes('பின்') ||
        lower.includes('ரகசிய பின்') ||
        lower.includes('पिन')
      ) {
        setIsPinModalOpen(true);
        speak(
          isTamil
            ? 'உங்கள் பாதுகாப்பு பின் எண்ணை உள்ளிடவும்.'
            : isHindi
            ? 'कृपया अपना सुरक्षा पिन दर्ज करें।'
            : 'Please enter your security PIN.'
        );
        return true;
      }

      // Quick voice login / demo login
      if (
        lower.includes('login') ||
        lower.includes('sign in') ||
        lower.includes('demo') ||
        lower.includes('லாகின்') ||
        lower.includes('உள்நுழை') ||
        lower.includes('டெமோ') ||
        lower.includes('लॉगिन') ||
        lower.includes('प्रवेश')
      ) {
        handleQuickDemoLogin();
        return true;
      }

      // How it works command
      if (
        lower.includes('how it works') ||
        lower.includes('help') ||
        lower.includes('எப்படி இயங்குகிறது') ||
        lower.includes('உதவி') ||
        lower.includes('मदद')
      ) {
        setIsHowItWorksOpen(true);
        return true;
      }

      // Bank portal switch
      if (
        lower.includes('bank') ||
        lower.includes('manager') ||
        lower.includes('வங்கி') ||
        lower.includes('बैंक')
      ) {
        onOpenBankPortal();
        return true;
      }

      // Language commands
      if (lower.includes('tamil') || lower.includes('தமிழ்')) {
        setLanguage('ta');
        return true;
      }
      if (lower.includes('hindi') || lower.includes('हिंदी')) {
        setLanguage('hi');
        return true;
      }
      if (lower.includes('english') || lower.includes('ஆங்கிலம்') || lower.includes('अंग्रेजी')) {
        setLanguage('en');
        return true;
      }

      // Dictation into contact field if numbers or email-like
      if (lower.includes('@') || lower.includes('.com') || /\d{5,}/.test(lower)) {
        setContact(lower.replace(/\s+/g, ''));
        setLastActionFeedback(`Contact set to: ${lower}`);
        return true;
      }

      return false;
    });

    return unregister;
  }, [
    registerCommandHandler,
    onOpenBankPortal,
    isGoogleModalOpen,
    isTamil,
    isHindi,
    setLanguage,
    speak,
    setLastActionFeedback,
  ]);

  // Fast 1-Tap Quick Citizen Login for illiterate / elderly users
  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login('arif@trustchain.id', 'password123');
      localStorage.setItem('trustchain_user', JSON.stringify(res.user));
      localStorage.setItem('trustchain_token', res.token);
      speak(
        isTamil
          ? `வணக்கம் ${res.user.name}, உங்கள் அடையாள வாலட்டில் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்.`
          : isHindi
          ? `नमस्ते ${res.user.name}, आप सफलतापूर्वक लॉगिन हो गए हैं।`
          : `Welcome ${res.user.name}, you have successfully signed into your Identity Wallet.`
      );
      onLoginSuccess(res.user, res.requiresSecureVerification ?? true);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!contact.trim()) {
      setError(isTamil ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setError(isTamil ? 'கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(contact.trim(), password);
      localStorage.setItem('trustchain_user', JSON.stringify(res.user));
      localStorage.setItem('trustchain_token', res.token);
      onLoginSuccess(res.user, res.requiresSecureVerification);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your contact and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAccountSelect = async (email: string, name: string) => {
    setIsGoogleModalOpen(false);
    setError(null);
    setLoading(true);

    try {
      const res = await api.loginWithGoogle(email, name);
      localStorage.setItem('trustchain_user', JSON.stringify(res.user));
      localStorage.setItem('trustchain_token', res.token);
      onLoginSuccess(res.user, res.requiresSecureVerification);
    } catch (err: any) {
      setError(err.message || 'Unable to authenticate with Google account.');
    } finally {
      setLoading(false);
    }
  };

  // Sync voice speech directly into contact field without app talking over user
  useEffect(() => {
    if (isInputListening && voiceState.recognizedText) {
      let text = voiceState.recognizedText.trim();
      text = text
        .replace(/\bat gmail dot com\b/gi, '@gmail.com')
        .replace(/\bat yahoo dot com\b/gi, '@yahoo.com')
        .replace(/\s+/g, '');
      setContact(text);
    }
  }, [isInputListening, voiceState.recognizedText]);

  useEffect(() => {
    if (!voiceState.isListening && isInputListening) {
      setIsInputListening(false);
    }
  }, [voiceState.isListening, isInputListening]);

  // Dedicated input microphone toggle - listens directly without computer speaking over the user
  const handleInputMicClick = () => {
    if (voiceState.isListening) {
      stopListening();
      setIsInputListening(false);
    } else {
      stopSpeaking();
      setIsInputListening(true);
      startListening();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/90 bg-white/90 backdrop-blur-xl">
        {/* TOP PORTAL SWITCHER: Citizen / User vs Bank Staff Portal */}
        <div className="mb-6 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex items-center shadow-inner">
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-indigo-700 shadow-xs border border-slate-200/60 flex items-center justify-center gap-1.5 cursor-default"
          >
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>{isTamil ? 'குடிமக்கள் உள்நுழைவு' : isHindi ? 'नागरिक लॉगिन' : 'Citizen Login'}</span>
          </button>
          <button
            id="login-page-switch-to-bank-btn"
            type="button"
            onClick={onOpenBankPortal}
            className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Switch to Bank Staff & Manager Portal"
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>{isTamil ? 'வங்கி போர்டல்' : isHindi ? 'बैंक पोर्टल' : 'Bank Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>

        {/* LOGO & HEADING */}
        <div className="text-center mb-5">
          <div className="w-13 h-13 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-300">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800">
            {t('loginTitle')}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            {isTamil
              ? 'சுய-கட்டுப்பாட்டு டிஜிட்டல் அடையாளம் மற்றும் ஜீரோ-நாலெட்ஜ் KYC'
              : isHindi
              ? 'सुरक्षित पुनः प्रयोज्य डिजिटल पहचान और शून्य-ज्ञान केवाईसी'
              : t('loginSubtitle')}
          </p>
        </div>

        {/* VOICE ACCESS & MICROPHONE SPOTLIGHT FOR NON-READERS */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100/90 text-center relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="text-left flex-1 min-w-0">
              <div className="text-[11px] font-extrabold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{isTamil ? 'படிக்க சிரமமாக உள்ளதா? வாய்ஸ் மூலம் அணுகவும்' : isHindi ? 'आवाज़ से चलाएं' : 'Voice-First Access'}</span>
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                {isTamil
                  ? 'மைக்கை அழுத்தி "லாகின்" அல்லது உங்கள் விவரங்களைப் பேசுங்கள்'
                  : isHindi
                  ? 'माइक दबाकर "लॉगिन" बोलें या अपनी जानकारी बोलें'
                  : 'Tap the mic to say "Login" or dictate your contact'}
              </p>
            </div>

            {/* Glowing Big Microphone Button */}
            <button
              id="login-voice-mic-main-btn"
              type="button"
              onClick={toggleListening}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 cursor-pointer shrink-0 ${
                voiceState.isListening
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 scale-110 ring-4 ring-rose-300 shadow-rose-300'
                  : 'bg-gradient-to-tr from-indigo-600 to-blue-600 hover:scale-105 shadow-indigo-200'
              }`}
              title={voiceState.isListening ? 'கேட்கிறது... நிறுத்த அழுத்தவும்' : 'பேச மைக்கை அழுத்தவும் / Tap to Speak'}
            >
              {voiceState.isListening ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
                  <Radio className="w-5 h-5 animate-spin" />
                </>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Live Transcript / Feedback Indicator */}
          {(voiceState.isListening || voiceState.recognizedText) && (
            <div className="mt-2.5 pt-2 border-t border-indigo-100 flex items-center justify-center gap-2 text-xs font-bold text-indigo-900 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="truncate max-w-[280px]">
                {voiceState.recognizedText || (isTamil ? 'பேசுங்கள்...' : isHindi ? 'बोलिए...' : 'Listening...')}
              </span>
            </div>
          )}
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 font-medium">{successBanner}</div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STANDARD / FORM INPUTS */}
        <form onSubmit={handleStandardLogin} className="space-y-3.5">
          {/* Email / Phone with built-in voice dictation mic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('emailOrPhone')}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-contact-input"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="arif@trustchain.id"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs"
                required
              />
              {/* Mic button right inside input box */}
              <button
                id="input-inline-mic-btn"
                type="button"
                onClick={handleInputMicClick}
                className={`absolute right-2.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isInputListening && voiceState.isListening
                    ? 'text-rose-600 bg-rose-100 animate-pulse ring-2 ring-rose-300'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                }`}
                title="குரல் மூலம் உள்ளிட / Speak into field"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            {isInputListening && voiceState.isListening && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>{isTamil ? 'கேட்கிறது... உங்கள் மின்னஞ்சல் அல்லது எண்ணைப் பேசுங்கள்' : isHindi ? 'सुन रहा है... बोलें' : 'Listening... Speak your email or phone'}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('password')}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Standard Sign In Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : t('signIn')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* FAST ACCESS / CITIZEN 1-TAP & PIN */}
        <div className="mt-3.5 space-y-2">
          {/* Quick 1-Tap Citizen Demo Login */}
          <button
            id="quick-demo-login-btn"
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isTamil ? '1-கிளிக் நேரடி உள்நுழைவு (Mohamed Arif)' : isHindi ? '1-क्लिक त्वरित नागरिक लॉगिन' : 'Quick 1-Tap Verified Citizen Access'}</span>
          </button>

          {/* Security PIN */}
          <button
            id="pin-login-btn"
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTamil ? 'ரகசிய 4-இலக்க பின் மூலம் உள்நுழைக (PIN)' : isHindi ? '4-अंकीय पिन से लॉगिन करें' : 'Login with 4-Digit Security PIN'}</span>
          </button>
        </div>

        {/* PROMINENT BANK STAFF PORTAL ACCESS BANNER */}
        <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-purple-100/90 via-indigo-50 to-purple-50 border border-purple-200 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-extrabold text-purple-950 truncate">
                {isTamil ? 'வங்கி அலுவலர் போர்டல்' : isHindi ? 'बैंक अधिकारी पोर्टल' : 'Bank Manager & Staff Portal'}
              </div>
              <div className="text-[10px] text-purple-700 font-medium truncate">
                {isTamil ? 'HDFC, SBI கடன் & KYC சரிபார்ப்பு' : 'HDFC, SBI Loan & KYC Verification'}
              </div>
            </div>
          </div>
          <button
            id="login-access-bank-portal-card-btn"
            type="button"
            onClick={onOpenBankPortal}
            className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Open Bank Staff Portal"
          >
            <span>{isTamil ? 'போர்டல் செல்' : isHindi ? 'बैंक पोर्टल' : 'Open Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-3 bg-white/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {t('orContinueWith')}
          </span>
        </div>

        {/* Google Sign In Button */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>{t('googleSignIn')}</span>
        </button>

        {/* Footer: How it works & Create Account */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setIsHowItWorksOpen(true)}
            className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isTamil ? 'இந்த ஆப் எப்படி இயங்குகிறது?' : isHindi ? 'यह ऐप कैसे काम करता है?' : 'How TrustChain Works'}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {t('createAccount')}
          </button>
        </div>
      </div>

      {/* Real Citizen Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newUser, initialPass) => {
          setIsCreateModalOpen(false);
          setContact(newUser.email);
          if (initialPass) {
            setPassword(initialPass);
          }
          setSuccessBanner(
            isTamil
              ? `${newUser.name} அவர்களே, உங்கள் கணக்கு உருவாக்கப்பட்டது! இப்போது நீங்கள் உள்நுழையலாம்.`
              : isHindi
              ? `${newUser.name}, आपका खाता बन गया है! अब आप साइन इन कर सकते हैं।`
              : `Account created for ${newUser.name}! You can now sign in with your credentials.`
          );
          setError(null);
        }}
      />

      {/* Google Account Modal */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccess={() => {
          setIsForgotModalOpen(false);
          setError('Password reset completed. You may now sign in.');
        }}
      />

      {/* Security PIN Modal */}
      <PINAuthModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        defaultContact={contact || 'arif@trustchain.id'}
        onSuccess={(user) => {
          setIsPinModalOpen(false);
          onLoginSuccess(user, false);
        }}
      />

      {/* Dedicated How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
};
