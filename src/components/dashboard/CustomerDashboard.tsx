import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ShieldCheck,
  Zap,
  Bot,
  Cpu,
  Building2,
  QrCode,
  FileCheck2,
  Banknote,
  History,
  Bell,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { User, Credential, BankRequest, ConsentRecord, AuditEvent, NotificationItem, LoanProduct } from '../../types';

import { IdentityWalletTab } from './IdentityWalletTab';
import { KYCPassportTab } from './KYCPassportTab';
import { PrivacyScoreTab } from './PrivacyScoreTab';
import { TrustAITab } from './TrustAITab';
import { ZKProofTab } from './ZKProofTab';
import { BankRequestsTab } from './BankRequestsTab';
import { QRVerificationTab } from './QRVerificationTab';
import { ConsentTab } from './ConsentTab';
import { LoansTab } from './LoansTab';
import { AuditHistoryTab } from './AuditHistoryTab';
import { NotificationsTab } from './NotificationsTab';
import { CustomerSettingsTab } from './CustomerSettingsTab';
import { EasyModeCitizenHub } from './EasyModeCitizenHub';
import { useEasyMode } from '../../context/EasyModeContext';
import { PageVoiceGuideBanner } from '../common/PageVoiceGuideBanner';
import { getPageVoiceGuide } from '../../voice/pageVoiceGuides';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onEditIdentityProfile?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  onLogout,
  activeTab: controlledTab,
  onTabChange,
  onEditIdentityProfile,
}) => {
  const { language, t } = useLanguage();
  const { registerCommandHandler, speak } = useVoice();
  const { isEasyMode } = useEasyMode();
  const [activeTab, setActiveTab] = useState<string>(controlledTab || 'wallet');

  // Backend state
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [bankRequests, setBankRequests] = useState<BankRequest[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loans, setLoans] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync controlled tab from props (e.g. from TrustAI assistant modal)
  useEffect(() => {
    if (controlledTab && controlledTab !== activeTab) {
      setActiveTab(controlledTab);
    }
  }, [controlledTab]);

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);

    // Speak page instructions in active language
    const guide = getPageVoiceGuide(`customer_${tabId}`);
    const speechText = language === 'ta' ? guide.speechTa : language === 'hi' ? guide.speechHi : guide.speechEn;
    const targetSpeechLang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    speak(speechText, targetSpeechLang);
  };

  // Register Voice Commands for hands-free navigation
  useEffect(() => {
    const unregister = registerCommandHandler((cmd: string) => {
      const lower = cmd.toLowerCase().trim();

      // Open KYC
      if (
        lower.includes('kyc') ||
        lower.includes('passport') ||
        lower.includes('verification') ||
        lower.includes('கடவுச்சீட்டு') ||
        lower.includes('கேஒய்சி') ||
        lower.includes('केवाईसी')
      ) {
        switchTab('passport');
        speak(language === 'ta' ? 'மறுபயன்பாட்டு கேஒய்சி பக்கம் திறக்கப்படுகிறது' : language === 'hi' ? 'केवाईसी पासपोर्ट खोला जा रहा है' : 'Opening Reusable KYC Passport');
        return true;
      }

      // Open Wallet
      if (
        lower.includes('wallet') ||
        lower.includes('identity') ||
        lower.includes('வாலட்') ||
        lower.includes('वॉलेट')
      ) {
        switchTab('wallet');
        speak(language === 'ta' ? 'அடையாள வாலட் திறக்கப்படுகிறது' : language === 'hi' ? 'आईडेंटिटी वॉलेट खोला जा रहा है' : 'Opening Identity Wallet');
        return true;
      }

      // Open Requests
      if (
        lower.includes('request') ||
        lower.includes('கோரிக்கைகள்') ||
        lower.includes('கோரிக்கை') ||
        lower.includes('अनुरोध')
      ) {
        switchTab('requests');
        speak(language === 'ta' ? 'வங்கி கோரிக்கைகள் திறக்கப்படுகிறது' : language === 'hi' ? 'बैंक अनुरोध खोले जा रहे हैं' : 'Opening Bank Requests');
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
        switchTab('notifications');
        speak(language === 'ta' ? 'அறிவிப்புகள் திறக்கப்படுகிறது' : language === 'hi' ? 'सूचनाएं खोली जा रही हैं' : 'Opening Notifications');
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
        switchTab('settings');
        speak(language === 'ta' ? 'அமைப்புகள் திறக்கப்படுகிறது' : language === 'hi' ? 'सेटिंग्स खोली जा रही हैं' : 'Opening Settings');
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
        switchTab('wallet');
        speak(language === 'ta' ? 'முகப்பு வாலட்டிற்கு திரும்புகிறது' : language === 'hi' ? 'वॉलेट पर वापस जा रहे हैं' : 'Going back to Wallet');
        return true;
      }

      // Other dashboard features
      if (lower.includes('privacy') || lower.includes('score')) {
        switchTab('privacy');
        speak('Opening Privacy Score Card');
        return true;
      }
      if (lower.includes('ai') || lower.includes('trustai') || lower.includes('risk')) {
        switchTab('trustai');
        speak('Opening TrustAI Risk Engine');
        return true;
      }
      if (lower.includes('proof') || lower.includes('zkp') || lower.includes('zero knowledge')) {
        switchTab('zkp');
        speak('Opening Zero-Knowledge Proof Generator');
        return true;
      }
      if (lower.includes('qr') || lower.includes('code') || lower.includes('scan')) {
        switchTab('qr');
        speak('Opening Verifiable QR Token');
        return true;
      }
      if (lower.includes('consent') || lower.includes('revoke')) {
        switchTab('consent');
        speak('Opening Consent Management');
        return true;
      }
      if (lower.includes('loan') || lower.includes('credit') || lower.includes('கடன்') || lower.includes('ऋण')) {
        switchTab('loans');
        speak('Opening Loan Facilities');
        return true;
      }
      if (lower.includes('blockchain') || lower.includes('audit') || lower.includes('history') || lower.includes('ledger') || lower.includes('பிளாக்செயின்') || lower.includes('ब्लॉकचेन')) {
        switchTab('audit');
        speak('Opening Blockchain Audit Ledger');
        return true;
      }

      return false;
    });

    return () => unregister();
  }, [registerCommandHandler, speak, language]);

  const loadData = async () => {
    try {
      const [creds, reqs, con, logs, notifs, ln] = await Promise.all([
        api.getCredentials(),
        api.getBankRequests(),
        api.getConsents(),
        api.getAuditLogs(),
        api.getNotifications(),
        api.getLoans(),
      ]);

      setCredentials(Array.isArray(creds) ? creds : []);
      setBankRequests(Array.isArray(reqs) ? reqs : []);
      setConsents(Array.isArray(con) ? con : []);
      setAuditLogs(Array.isArray(logs) ? logs : []);
      setNotifications(Array.isArray(notifs) ? notifs : []);
      setLoans(Array.isArray(ln) ? ln : []);
    } catch (err) {
      console.warn('Failed loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingRequestsCount = bankRequests.filter((r) => r.status === 'pending').length;

  const navTabs = [
    { id: 'wallet', label: t('identityWalletTitle'), icon: Wallet },
    { id: 'passport', label: t('reusableKycPassport'), icon: ShieldCheck },
    { id: 'privacy', label: t('privacyScoreTitle'), icon: Zap },
    { id: 'trustai', label: t('trustAIEngine'), icon: Bot },
    { id: 'zkp', label: t('zkProofTitle'), icon: Cpu },
    {
      id: 'requests',
      label: t('bankRequestsTitle'),
      icon: Building2,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: 'qr', label: t('qrVerificationTitle'), icon: QrCode },
    { id: 'consent', label: t('consentCenterTitle'), icon: FileCheck2 },
    { id: 'loans', label: t('loansTitle'), icon: Banknote },
    { id: 'audit', label: t('auditHistoryTitle'), icon: History },
    {
      id: 'notifications',
      label: t('notificationsTitle'),
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'settings',
      label: language === 'ta' ? 'அமைப்புகள்' : language === 'hi' ? 'सेटिंग्स' : 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 w-full">
      {/* Neat Active Section Top Header */}
      {(() => {
        const currentTabInfo = navTabs.find((t) => t.id === activeTab) || navTabs[0];
        const CurrentIcon = currentTabInfo.icon;
        return (
          <div className="glass-panel p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/80 bg-white/85 shadow-sm flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <CurrentIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-800">
                    {currentTabInfo.label}
                  </h2>
                  {currentTabInfo.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] sm:text-[11px] font-black animate-pulse">
                      {currentTabInfo.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  TrustChain Self-Sovereign Identity Network • Zero-Knowledge Secured
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl border border-slate-200/90 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{t('refresh')}</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Customer Portal Top Navigation Tabs - Streamlined Scrollable Strip & Responsive Toolbar */}
      <div className="relative w-full" id="customer-portal-top-tabs-container">
        <div
          id="customer-portal-top-tabs-bar"
          className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs overflow-x-auto scrollbar-none snap-x"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`customer-top-tab-${tab.id}-btn`}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`shrink-0 snap-start flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold sm:font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Multilingual Voice Guide Banner with interactive Listen & Speech controls for this specific page */}
      <PageVoiceGuideBanner pageKey={`customer_${activeTab}`} />

      {/* Main Content Area */}
      <main className="transition-all duration-200">
        {isEasyMode && activeTab === 'wallet' && (
          <div className="mb-6">
            <EasyModeCitizenHub
              user={user}
              credentials={credentials}
              bankRequests={bankRequests}
              onOpenQR={() => switchTab('qr')}
              onOpenRequests={() => switchTab('requests')}
              onOpenWallet={() => switchTab('passport')}
              onOpenLoans={() => switchTab('loans')}
            />
          </div>
        )}

        {activeTab === 'wallet' && (
          <IdentityWalletTab
            user={user}
            credentials={credentials}
            onGenerateProofClick={() => switchTab('zkp')}
          />
        )}

        {activeTab === 'passport' && (
          <KYCPassportTab
            user={user}
            credentials={credentials}
            onGenerateQR={() => switchTab('qr')}
          />
        )}

        {activeTab === 'privacy' && <PrivacyScoreTab user={user} />}

        {activeTab === 'trustai' && <TrustAITab />}

        {activeTab === 'zkp' && (
          <ZKProofTab
            user={user}
            onProofGenerated={() => loadData()}
          />
        )}

        {activeTab === 'requests' && (
          <BankRequestsTab
            requests={bankRequests}
            onRequestUpdated={loadData}
            onNavigateToQR={() => switchTab('qr')}
          />
        )}

        {activeTab === 'qr' && <QRVerificationTab user={user} />}

        {activeTab === 'consent' && (
          <ConsentTab
            consents={consents || []}
            onConsentUpdated={loadData}
          />
        )}

        {activeTab === 'loans' && (
          <LoansTab
            loans={loans}
            onLoanApplied={loadData}
          />
        )}

        {activeTab === 'audit' && <AuditHistoryTab logs={auditLogs} />}

        {activeTab === 'notifications' && (
          <NotificationsTab
            notifications={notifications}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'settings' && (
          <CustomerSettingsTab
            user={user}
            onLogout={onLogout}
            onEditIdentityProfile={onEditIdentityProfile}
          />
        )}
      </main>
    </div>
  );
};
