import React, { useState } from 'react';
import {
  Volume2,
  Fingerprint,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Banknote,
  Languages
} from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';

export const BankAssistedDeskTab: React.FC = () => {
  const { speak } = useVoice();
  const { language, t } = useLanguage();

  const [citizenName, setCitizenName] = useState('Muthulakshmi R (முத்துலட்சுமி)');
  const [citizenAadhaar, setCitizenAadhaar] = useState('XXXX-XXXX-4892');
  const [selectedScheme, setSelectedScheme] = useState('PM Kisan Direct Benefit / Kisan Credit Scheme (₹25,000)');
  const [verifying, setVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [blockchainTx, setBlockchainTx] = useState<string | null>(null);

  const speakGuidance = (text: string) => {
    speak(text);
  };

  const handleSimulateAssistedBiometric = async () => {
    setVerifying(true);
    const audioMsg = language === 'hi' 
      ? 'नागरिक का फिंगरप्रिंट और चेहरा सत्यापित किया जा रहा है। कृपया प्रतीक्षा करें।'
      : language === 'ta'
      ? 'பயனாளியின் கைரேகை மற்றும் முக அடையாளம் சரிபார்க்கப்படுகிறது. தயவுசெய்து காத்திருக்கவும்.'
      : 'Beneficiary fingerprint and face liveness are being verified. Please wait.';
    speak(audioMsg);

    setTimeout(async () => {
      setVerifying(false);
      setVerificationDone(true);
      const tx = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
      setBlockchainTx(tx);
      const successMsg = language === 'hi'
        ? 'सत्यापन सफल हुआ। राशि आपके खाते में सीधे जमा कर दी गई है।'
        : language === 'ta'
        ? 'சரிபார்ப்பு வெற்றி பெற்றது. பணம் உங்கள் கணக்கில் நேரடியாக செலுத்தப்பட்டது.'
        : 'Verification successful. Funds transferred directly to sovereign account.';
      speak(successMsg);
    }, 2000);
  };

  const resetForm = () => {
    setVerificationDone(false);
    setBlockchainTx(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Visual Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Languages className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t('assistedDeskTitle')}
              </h2>
              <p className="text-amber-100 text-xs font-semibold">
                {t('assistedDeskSub')}
              </p>
            </div>
          </div>
          <p className="text-xs text-amber-50 max-w-2xl leading-relaxed">
            {t('assistedDeskGuideNotice')}
          </p>
        </div>

        <button
          onClick={() => {
            const guide = language === 'hi'
              ? 'नमस्ते! इस पोर्टल पर ग्रामीण नागरिक बिना किसी जटिलता के अपने फिंगरप्रिंट से बैंक सत्यापन और ऋण लाभ प्राप्त कर सकते हैं।'
              : language === 'ta'
              ? 'வணக்கம்! இந்த பக்கத்தில் படிக்கத் தெரியாத முதியவர்கள் மற்றும் கிராமப்புற மக்கள் எளிதாக தங்கள் கைரேகை மூலம் வங்கிக் கணக்கை சரிபார்த்து கடன் அல்லது உதவித்தொகையைப் பெறலாம்.'
              : 'Welcome! On this desk, elderly and rural citizens can easily verify their identity and receive benefit schemes using biometric sensors.';
            speak(guide);
          }}
          className="self-start md:self-auto py-3 px-5 rounded-2xl text-xs sm:text-sm font-black bg-white text-amber-900 hover:bg-amber-50 shadow-lg shadow-amber-900/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <Volume2 className="w-5 h-5 text-amber-600 animate-bounce" />
          <span>{t('listenVoiceGuideBtn')}</span>
        </button>
      </div>

      {/* Main 2-Step Assisted Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Citizen Details & Scheme Selection */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" />
              <span>{t('beneficiaryInfoHeader')}</span>
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {t('assistedMode')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{t('applicantNameLabel')}</span>
                <button
                  type="button"
                  onClick={() => speak(`${t('applicantNameLabel')}: ${citizenName}`)}
                  className="text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{t('aadhaarMaskedIdLabel')}</span>
                <button
                  type="button"
                  onClick={() => speak(language === 'hi' ? 'आधार नंबर अंतिम चार अंक 4892' : language === 'ta' ? 'ஆதார் எண் கடைசி நான்கு இலக்கங்கள் 4892' : 'Aadhaar last four digits 4892')}
                  className="text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </label>
              <input
                type="text"
                value={citizenAadhaar}
                onChange={(e) => setCitizenAadhaar(e.target.value)}
                className="w-full py-2.5 px-3.5 text-xs sm:text-sm font-mono font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>{t('selectAssistedSchemeLabel')}</span>
              <button
                type="button"
                onClick={() => speak(selectedScheme)}
                className="text-amber-600 hover:text-amber-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="PM Kisan Direct Benefit / Kisan Credit Scheme (₹25,000)">
                PM Kisan Direct Benefit / Kisan Credit Scheme (₹25,000)
              </option>
              <option value="Women Self-Help Group (SHG) Micro Loan (₹50,000)">
                Women Self-Help Group (SHG) Micro Loan (₹50,000)
              </option>
              <option value="Senior Citizen Pension Direct Sovereign Disbursal (₹3,000/mo)">
                Senior Citizen Pension Direct Sovereign Disbursal (₹3,000/mo)
              </option>
              <option value="Rural Solar Irrigation Subsidy Grant (₹40,000)">
                Rural Solar Irrigation Subsidy Grant (₹40,000)
              </option>
            </select>
          </div>

          {/* Large Interactive Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSimulateAssistedBiometric}
              disabled={verifying || verificationDone}
              className="flex-1 py-4 px-6 rounded-2xl text-sm sm:text-base font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Fingerprint className="w-6 h-6" />
              <span>
                {verifying
                  ? t('scanningFingerprint')
                  : verificationDone
                  ? t('verifiedBadge')
                  : t('verifyWithFingerprint')}
              </span>
            </button>

            {verificationDone && (
              <button
                onClick={resetForm}
                className="py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
              >
                {t('nextCitizen')}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Instant High-Contrast Confirmation Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('assistedProofCard')}
              </h4>
            </div>

            {verificationDone ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h5 className="font-extrabold text-sm text-emerald-950">{t('approvedSuccessTitle')}</h5>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {t('biometricMatchedDesc')}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-[10px] text-slate-700 space-y-1">
                  <div>Status: <span className="font-bold text-emerald-600">{t('fundsDisbursed')}</span></div>
                  <div>Block: <span className="font-bold">#18942</span></div>
                  <div className="truncate">Tx: <span className="text-indigo-600">{blockchainTx}</span></div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 text-center space-y-3">
                <Fingerprint className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-amber-900">
                  {t('waitingForFingerprint')}
                </p>
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                  {t('waitingForFingerprintDesc')}
                </p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-indigo-700 block">{t('accessibilityFeatures')}</span>
            <span>• {t('voiceNarrationFeature')}</span>
            <br />
            <span>• {t('noTypingFeature')}</span>
            <br />
            <span>• {t('instantReceiptFeature')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
