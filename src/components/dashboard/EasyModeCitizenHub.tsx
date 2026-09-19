import React from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Building2,
  Volume2,
  Sparkles,
  QrCode,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  User as UserIcon,
  Banknote
} from 'lucide-react';
import { User, Credential, BankRequest } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { useEasyMode } from '../../context/EasyModeContext';

interface EasyModeCitizenHubProps {
  user: User;
  credentials: Credential[];
  bankRequests: BankRequest[];
  onOpenQR: () => void;
  onOpenRequests: () => void;
  onOpenWallet: () => void;
  onOpenLoans: () => void;
}

export const EasyModeCitizenHub: React.FC<EasyModeCitizenHubProps> = ({
  user,
  credentials,
  bankRequests,
  onOpenQR,
  onOpenRequests,
  onOpenWallet,
  onOpenLoans,
}) => {
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { toggleEasyMode } = useEasyMode();

  const pendingRequests = bankRequests.filter((r) => r.status === 'pending');

  const speakFullSummary = () => {
    if (language === 'ta') {
      speak(`வணக்கம் ${user.name}! உங்கள் அடையாள அட்டை சரிபார்க்கப்பட்டு பாதுகாப்பாக உள்ளது. உங்களிடம் ${pendingRequests.length} வங்கி கோரிக்கைகள் காத்திருக்கின்றன.`);
    } else if (language === 'hi') {
      speak(`नमस्ते ${user.name}! आपका पहचान पत्र सत्यापित और सुरक्षित है। आपके पास ${pendingRequests.length} बैंक अनुरोध लंबित हैं।`);
    } else {
      speak(`Hello ${user.name}! Your sovereign identity is verified and active. You have ${pendingRequests.length} pending bank verification requests.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Prominent Easy Mode Banner with Sound Button */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Sparkles className="w-8 h-8" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {language === 'ta'
                  ? 'எளிய பயன்முறை (Easy Mode Active)'
                  : language === 'hi'
                  ? 'आसान मोड (Easy Mode Active)'
                  : 'Easy Simplified Mode Active'}
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 font-semibold">
                {language === 'ta'
                  ? 'படிக்கத் தெரியாதவர்களுக்கும் முதியவர்களுக்கும் பெரிய எழுத்துக்கள் & குரல் உதவி'
                  : 'High contrast, big icons, and full audio voice guidance'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={speakFullSummary}
            className="py-3 px-5 rounded-2xl text-xs sm:text-sm font-black bg-white text-amber-900 hover:bg-amber-50 shadow-lg shadow-amber-900/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Volume2 className="w-5 h-5 text-amber-600 animate-bounce" />
            <span>
              {language === 'ta' ? 'குரல் வழிகாட்டி கேள்' : 'Listen Status'}
            </span>
          </button>

          <button
            onClick={toggleEasyMode}
            className="py-3 px-4 rounded-2xl text-xs font-bold bg-amber-700/80 hover:bg-amber-800 text-white border border-amber-400 transition-all cursor-pointer"
          >
            {language === 'ta' ? 'வழக்கமான பக்கத்திற்கு மாறு' : 'Switch to Standard UI'}
          </button>
        </div>
      </div>

      {/* 4 Big Action Cards for Easy Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Verified Identity */}
        <div
          onClick={onOpenWallet}
          className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-emerald-300 bg-white/95 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black">
                {language === 'ta' ? '100% சரிபார்க்கப்பட்டது' : '100% VERIFIED'}
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {language === 'ta' ? '1. எனது அடையாள அட்டை' : '1. My Verified Identity Card'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {language === 'ta'
                  ? 'உங்கள் ஆதார், பான் கார்டு மற்றும் பாஸ்போர்ட் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.'
                  : 'Your Aadhaar, PAN, and Bank Passports securely anchored on blockchain.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-800">{user.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">DID: {(user.did || user.id).substring(0, 16)}...</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>{language === 'ta' ? 'அடையாள அட்டையை பார்க்க தொடவும்' : 'Tap to View Identity'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Bank Requests */}
        <div
          onClick={onOpenRequests}
          className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-indigo-300 bg-white/95 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Building2 className="w-10 h-10" />
              </div>
              {pendingRequests.length > 0 ? (
                <span className="px-3.5 py-1 rounded-full bg-rose-500 text-white text-xs font-black animate-pulse">
                  {pendingRequests.length} {language === 'ta' ? 'அனுமதி தேவை' : 'Action Required'}
                </span>
              ) : (
                <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {language === 'ta' ? 'எல்லாம் சரி' : 'All Clear'}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                {language === 'ta' ? '2. வங்கி அனுமதிகள்' : '2. Bank Approvals'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {language === 'ta'
                  ? 'வங்கி உங்கள் ஆவணங்களை சரிபார்க்க அனுமதி கேட்கிறது. ஒரு தொடுதலில் ஒப்புதல் தரலாம்.'
                  : 'Banks requesting verification proof. Approve or deny with a single tap.'}
              </p>
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs font-semibold text-indigo-900">
              {pendingRequests.length > 0
                ? `${pendingRequests[0].bankName} - ${pendingRequests[0].purpose}`
                : 'No pending requests from any bank.'}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>{language === 'ta' ? 'அனுமதிகளை பார்க்க தொடவும்' : 'Tap to View Requests'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Instant QR Code */}
        <div
          onClick={onOpenQR}
          className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-purple-300 bg-white/95 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <QrCode className="w-10 h-10" />
              </div>
              <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                {language === 'ta' ? 'ஸ்கேன் செய்' : 'Instant Scan'}
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                {language === 'ta' ? '3. க்யூஆர் கோடு (QR Code)' : '3. Verifiable QR Code'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {language === 'ta'
                  ? 'வங்கியில் இந்த க்யூஆரை காட்டினால் போதும், அதிகாரிகள் உடனே சரிபார்ப்பார்கள்.'
                  : 'Show this QR code at bank counters to verify instantly without paper documents.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
            <span>{language === 'ta' ? 'க்யூஆர் கோடை திறக்க தொடவும்' : 'Tap to Open QR'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Micro Loans & Schemes */}
        <div
          onClick={onOpenLoans}
          className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-300 bg-white/95 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Banknote className="w-10 h-10" />
              </div>
              <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                {language === 'ta' ? 'நேரடி கடன்' : 'Instant Credit'}
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                {language === 'ta' ? '4. விவசாய & தொழில் கடன்' : '4. Loans & Direct Benefits'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {language === 'ta'
                  ? 'அரசு நலத்திட்டங்கள் மற்றும் குறைந்த வட்டி உடனடி கடன் வசதி.'
                  : 'Access pre-approved government subsidies and sovereign micro-loans directly.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>{language === 'ta' ? 'கடன்களை பார்க்க தொடவும்' : 'Tap to View Loans'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
