import React, { useState, useEffect } from 'react';
import { Mic, Radio } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { VoiceProvider, useVoice } from './voice/VoiceContext';
import { EasyModeProvider } from './context/EasyModeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { VoiceControlBar } from './components/common/VoiceControlBar';
import { AIAssistantModal } from './components/common/AIAssistantModal';
import { LoginPage } from './components/auth/LoginPage';
import { BankLoginPage } from './components/auth/BankLoginPage';
import { SecureVerificationFlow } from './components/verification/SecureVerificationFlow';
import { CompleteIdentityProfileFlow } from './components/verification/CompleteIdentityProfileFlow';
import { isAccountProfileCompleted } from './services/identityProfile';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { BankPortalView } from './components/bank/BankPortalView';
import { BottomNavigationBar } from './components/common/BottomNavigationBar';
import { MicrophonePermissionNotice } from './components/common/MicrophonePermissionNotice';
import { User, BankStaff } from './types';

export function AppContent() {
  const { language, setLanguage } = useLanguage();
  const {
    voiceState,
    toggleListening,
    stopListening,
    registerCommandHandler,
    speak,
    setLastActionFeedback,
  } = useVoice();
  const [activeRole, setActiveRole] = useState<'customer' | 'bank_staff'>('customer');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStaff, setCurrentStaff] = useState<BankStaff | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isCompletingProfile, setIsCompletingProfile] = useState<boolean>(false);
  const [activeCustomerTab, setActiveCustomerTab] = useState<string>('wallet');
  const [activeBankTab, setActiveBankTab] = useState<any>('overview');

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('trustchain_user');
      const savedStaff = localStorage.getItem('trustchain_staff');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        if (!isAccountProfileCompleted(parsedUser)) {
          setIsCompletingProfile(true);
        }
      }
      if (savedStaff) {
        setCurrentStaff(JSON.parse(savedStaff));
      }
    } catch (e) {
      console.warn('Failed restoring stored session:', e);
    }
  }, []);

  // Global Voice Commands Handler across the entire platform
  useEffect(() => {
    const unregister = registerCommandHandler((cmd: string) => {
      const lower = cmd.toLowerCase().trim();

      // Continue with Google
      if (
        lower.includes('google') ||
        lower.includes('continue with google') ||
        lower.includes('sign in with google') ||
        lower.includes('கூகுள்') ||
        lower.includes('கூகிள்') ||
        lower.includes('गूगल')
      ) {
        const googleBtn = document.getElementById('google-signin-btn') as HTMLButtonElement | null;
        if (googleBtn) {
          googleBtn.click();
          setLastActionFeedback('Continue with Google');
          speak(
            language === 'ta'
              ? 'கூகுள் மூலம் தொடர்கிறது'
              : language === 'hi'
              ? 'गूगल से जारी रख रहे हैं'
              : 'Continuing with Google'
          );
          return true;
        }
      }

      // Open KYC
      if (
        lower.includes('kyc') ||
        lower.includes('passport') ||
        lower.includes('கடவுச்சீட்டு') ||
        lower.includes('கேஒய்சி') ||
        lower.includes('केवाईसी')
      ) {
        setActiveCustomerTab('passport');
        setLastActionFeedback('Opening KYC');
        speak(
          language === 'ta'
            ? 'மறுபயன்பாட்டு கேஒய்சி பக்கம் திறக்கப்படுகிறது'
            : language === 'hi'
            ? 'केवाईसी पासपोर्ट खोला जा रहा है'
            : 'Opening Reusable KYC Passport'
        );
        return true;
      }

      // Open Wallet
      if (
        lower.includes('wallet') ||
        lower.includes('வாலட்') ||
        lower.includes('वॉलेट') ||
        (lower.includes('identity') && !lower.includes('profile'))
      ) {
        setActiveCustomerTab('wallet');
        setLastActionFeedback('Opening Wallet');
        speak(
          language === 'ta'
            ? 'அடையாள வாலட் திறக்கப்படுகிறது'
            : language === 'hi'
            ? 'आईडेंटिटी वॉलेट खोला जा रहा है'
            : 'Opening Identity Wallet'
        );
        return true;
      }

      // Open Requests
      if (
        lower.includes('request') ||
        lower.includes('கோரிக்கைகள்') ||
        lower.includes('கோரிக்கை') ||
        lower.includes('अनुरोध')
      ) {
        if (activeRole === 'bank_staff') {
          setActiveBankTab('requests');
        } else {
          setActiveCustomerTab('requests');
        }
        setLastActionFeedback('Opening Requests');
        speak(
          language === 'ta'
            ? 'வங்கி கோரிக்கைகள் திறக்கப்படுகிறது'
            : language === 'hi'
            ? 'बैंक अनुरोध खोले जा रहे हैं'
            : 'Opening Bank Requests'
        );
        return true;
      }

      // Open Notifications
      if (
        lower.includes('notification') ||
        lower.includes('alert') ||
        lower.includes('அறிவிப்பு') ||
        lower.includes('அறிவிப்புகள்') ||
        lower.includes('सूचना')
      ) {
        setActiveCustomerTab('notifications');
        setLastActionFeedback('Opening Notifications');
        speak(
          language === 'ta'
            ? 'அறிவிப்புகள் திறக்கப்படுகிறது'
            : language === 'hi'
            ? 'सूचनाएं खोली जा रही हैं'
            : 'Opening Notifications'
        );
        return true;
      }

      // Open Settings
      if (
        lower.includes('setting') ||
        lower.includes('அமைப்பு') ||
        lower.includes('அமைப்புகள்') ||
        lower.includes('செட்டிங்ஸ்') ||
        lower.includes('सेटिंग')
      ) {
        setActiveCustomerTab('settings');
        setLastActionFeedback('Opening Settings');
        speak(
          language === 'ta'
            ? 'அமைப்புகள் திறக்கப்படுகிறது'
            : language === 'hi'
            ? 'सेटिंग्स खोली जा रही हैं'
            : 'Opening Settings'
        );
        return true;
      }

      // Go back
      if (
        lower.includes('go back') ||
        lower.includes('back') ||
        lower.includes('previous') ||
        lower.includes('பின் செல்') ||
        lower.includes('திரும்பு') ||
        lower.includes('பின்னால்') ||
        lower.includes('வாபஸ்') ||
        lower.includes('वापस') ||
        lower.includes('पीछे')
      ) {
        if (isVerifying) {
          setIsVerifying(false);
        } else if (isCompletingProfile) {
          setIsCompletingProfile(false);
        } else if (activeCustomerTab !== 'wallet') {
          setActiveCustomerTab('wallet');
        } else if (typeof window !== 'undefined' && window.history.length > 1) {
          window.history.back();
        }
        setLastActionFeedback('Going back');
        speak(
          language === 'ta'
            ? 'பின்னோக்கி செல்கிறது'
            : language === 'hi'
            ? 'वापस जा रहे हैं'
            : 'Going back'
        );
        return true;
      }

      // Language switching commands
      if (lower.includes('tamil') || lower.includes('தமிழ்')) {
        setLanguage('ta');
        setLastActionFeedback('தமிழ் மொழிக்கு மாற்றப்பட்டது');
        return true;
      }
      if (lower.includes('hindi') || lower.includes('हिंदी')) {
        setLanguage('hi');
        setLastActionFeedback('हिंदी भाषा चुनी गई');
        return true;
      }
      if (lower.includes('english') || lower.includes('ஆங்கிலம்') || lower.includes('अंग्रेजी')) {
        setLanguage('en');
        setLastActionFeedback('Switched to English');
        return true;
      }

      // Role switching commands
      if (
        lower.includes('bank portal') ||
        lower.includes('switch to bank') ||
        lower.includes('வங்கி போர்டல்') ||
        lower.includes('வங்கி') ||
        lower.includes('बैंक पोर्टल') ||
        lower.includes('बैंक')
      ) {
        setActiveRole('bank_staff');
        setLastActionFeedback('Switched to Bank Manager Portal');
        const speech = language === 'ta' ? 'வங்கி மேலாளர் போர்டல் திறக்கப்பட்டது.' : language === 'hi' ? 'बैंक पोर्टल खोला गया।' : 'Switched to Bank Manager Portal.';
        speak(speech);
        return true;
      }

      if (
        lower.includes('citizen portal') ||
        lower.includes('switch to citizen') ||
        lower.includes('customer portal') ||
        lower.includes('வாடிக்கையாளர்') ||
        lower.includes('குடிமகன்') ||
        lower.includes('नागरिक')
      ) {
        setActiveRole('customer');
        setLastActionFeedback('Switched to Citizen Portal');
        const speech = language === 'ta' ? 'வாடிக்கையாளர் போர்டல் திறக்கப்பட்டது.' : language === 'hi' ? 'नागरिक पोर्टल खोला गया।' : 'Switched to Citizen Portal.';
        speak(speech);
        return true;
      }

      // Additional customer features
      if (activeRole === 'customer') {
        if (lower.includes('loan') || lower.includes('credit') || lower.includes('கடன்') || lower.includes('ऋण')) {
          setActiveCustomerTab('loans');
          setLastActionFeedback('Opening Loans Facility');
          speak(language === 'ta' ? 'கடன் திட்டங்கள் திறக்கப்படுகிறது' : 'Opening Loan Facilities');
          return true;
        }
        if (lower.includes('proof') || lower.includes('zkp') || lower.includes('zero knowledge')) {
          setActiveCustomerTab('zkp');
          setLastActionFeedback('Opening Zero-Knowledge Proofs');
          speak('Opening Zero-Knowledge Proofs');
          return true;
        }
        if (lower.includes('radar') || lower.includes('privacy') || lower.includes('score')) {
          setActiveCustomerTab('privacy');
          setLastActionFeedback('Opening Privacy Score');
          speak('Opening Privacy Score');
          return true;
        }
      }

      // Tab navigation commands for Bank Staff
      if (activeRole === 'bank_staff') {
        if (lower.includes('overview') || lower.includes('மேலோட்டம்')) {
          setActiveBankTab('overview');
          speak('Opening Bank Overview');
          return true;
        }
        if (lower.includes('queue') || lower.includes('verification') || lower.includes('சரிபார்ப்பு')) {
          setActiveBankTab('requests');
          speak('Opening Verification Queue');
          return true;
        }
        if (lower.includes('citizen') || lower.includes('customer') || lower.includes('வாடிக்கையாளர்')) {
          setActiveBankTab('customers');
          speak('Opening Customer Directory');
          return true;
        }
        if (lower.includes('radar') || lower.includes('fraud') || lower.includes('மோசடி') || lower.includes('धोखाधड़ी')) {
          setActiveBankTab('fraud_radar');
          speak('Opening Risk and Fraud Radar');
          return true;
        }
      }

      // Logout command
      if (lower.includes('logout') || lower.includes('sign out') || lower.includes('வெளியேறு') || lower.includes('लॉगआउट')) {
        handleLogout();
        speak(language === 'ta' ? 'வெளியேறினீர்கள்' : language === 'hi' ? 'लॉगआउट हो गया' : 'Signed out successfully');
        return true;
      }

      return false;
    });

    return () => unregister();
  }, [
    registerCommandHandler,
    language,
    activeRole,
    isVerifying,
    isCompletingProfile,
    activeCustomerTab,
    speak,
    setLanguage,
    setLastActionFeedback,
  ]);

  const handleCustomerLoginSuccess = (user: User, requiresVerification: boolean) => {
    setCurrentUser(user);
    setActiveRole('customer');
    if (requiresVerification) {
      setIsVerifying(true);
      setIsCompletingProfile(false);
    } else {
      setIsVerifying(false);
      // Check whether the currently selected account has completed its TrustChain Identity Profile
      const completed = isAccountProfileCompleted(user);
      setIsCompletingProfile(!completed);
    }
  };

  const handleBankLoginSuccess = (staff: BankStaff) => {
    setCurrentStaff(staff);
    setActiveRole('bank_staff');
  };

  const handleLogout = () => {
    localStorage.removeItem('trustchain_user');
    localStorage.removeItem('trustchain_token');
    localStorage.removeItem('trustchain_staff');
    localStorage.removeItem('trustchain_staff_token');
    setCurrentUser(null);
    setCurrentStaff(null);
    setIsVerifying(false);
    setIsCompletingProfile(false);
  };

  // After successful Login + Biometric Verification, check whether the currently selected account has completed its TrustChain Identity Profile
  const handleVerificationComplete = () => {
    setIsVerifying(false);
    if (currentUser) {
      const completed = isAccountProfileCompleted(currentUser);
      if (!completed) {
        setIsCompletingProfile(true);
      } else {
        setIsCompletingProfile(false);
      }
    }
  };

  const isUserLoggedIn = Boolean(
    (activeRole === 'customer' && currentUser && !isVerifying && !isCompletingProfile) ||
    (activeRole === 'bank_staff' && currentStaff)
  );

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white relative ${isUserLoggedIn ? 'pb-28' : ''}`}>
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        currentStaff={currentStaff}
        activeRole={activeRole}
        onRoleSwitch={(role) => {
          setActiveRole(role);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <div className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* BANK STAFF PORTAL ROUTE */}
        {activeRole === 'bank_staff' ? (
          currentStaff ? (
            <BankPortalView
              staff={currentStaff}
              onLogout={handleLogout}
              activeTab={activeBankTab}
              onTabChange={(tabId) => setActiveBankTab(tabId)}
            />
          ) : (
            <BankLoginPage
              onBankLoginSuccess={handleBankLoginSuccess}
              onBackToCustomer={() => setActiveRole('customer')}
            />
          )
        ) : (
          /* CUSTOMER ROUTE */
          currentUser ? (
            isVerifying ? (
              <SecureVerificationFlow
                user={currentUser}
                onVerificationComplete={handleVerificationComplete}
                onCancel={() => {
                  handleLogout();
                }}
              />
            ) : isCompletingProfile ? (
              <CompleteIdentityProfileFlow
                user={currentUser}
                onProfileComplete={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  setIsCompletingProfile(false);
                }}
                onCancel={() => {
                  handleLogout();
                }}
              />
            ) : (
              <CustomerDashboard
                user={currentUser}
                onLogout={handleLogout}
                activeTab={activeCustomerTab}
                onTabChange={(tabId) => setActiveCustomerTab(tabId)}
                onEditIdentityProfile={() => setIsCompletingProfile(true)}
              />
            )
          ) : (
            <LoginPage
              onLoginSuccess={handleCustomerLoginSuccess}
              onOpenBankPortal={() => setActiveRole('bank_staff')}
            />
          )
        )}
      </div>

      {/* Persistent Fixed Bottom Navigation Bar with Center Voice Mic - ONLY SHOWN AFTER LOGIN */}
      {isUserLoggedIn && (
        <BottomNavigationBar
          activeRole={activeRole}
          isLoggedIn={isUserLoggedIn}
          activeCustomerTab={activeCustomerTab}
          onCustomerTabChange={(tabId) => setActiveCustomerTab(tabId)}
          activeBankTab={activeBankTab}
          onBankTabChange={(tabId) => setActiveBankTab(tabId)}
          onRoleSwitch={(role) => setActiveRole(role)}
          onLogout={handleLogout}
          onOpenSettings={() => setActiveCustomerTab('settings')}
        />
      )}

      {/* Floating TrustAI Assistant Modal (Customer mode) */}
      {activeRole === 'customer' && (
        <AIAssistantModal
          currentUser={currentUser}
          onNavigateTab={(tabId) => setActiveCustomerTab(tabId)}
        />
      )}

      {/* Floating Live Voice Status Pill (Clean, small, existing UI) */}
      {(voiceState.isListening || voiceState.recognizedText || voiceState.lastActionFeedback) && (
        <div
          id="global-voice-status-pill"
          className={`fixed ${isUserLoggedIn ? 'bottom-20' : 'bottom-6'} left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-150`}
        >
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/95 backdrop-blur-md text-slate-800 shadow-xl border border-indigo-200 shadow-indigo-500/10">
            <button
              type="button"
              onClick={toggleListening}
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                voiceState.isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              title={voiceState.isListening ? 'Stop listening' : 'Start listening'}
            >
              {voiceState.isListening ? <Radio className="w-3.5 h-3.5 animate-spin" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <div className="max-w-[220px] sm:max-w-[320px] truncate text-xs font-semibold text-slate-700">
              {voiceState.isListening
                ? (voiceState.recognizedText || (language === 'ta' ? 'பேசுங்கள்... கேட்கிறது (Listening...)' : language === 'hi' ? 'बोलिए... सुन रहे हैं (Listening...)' : 'Listening... Speak now'))
                : (voiceState.lastActionFeedback || (language === 'ta' ? 'குரல் தயார்' : language === 'hi' ? 'आவாज़ तैयार' : 'Voice Ready'))
              }
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold shrink-0">
              {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : 'EN'}
            </span>
            <button
              type="button"
              onClick={() => {
                stopListening();
                setLastActionFeedback(null);
              }}
              className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer shrink-0 ml-1"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Global Microphone Permission & Testing Notice */}
      <MicrophonePermissionNotice />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <VoiceProvider>
          <EasyModeProvider>
            <AppContent />
          </EasyModeProvider>
        </VoiceProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
