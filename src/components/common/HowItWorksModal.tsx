import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Fingerprint,
  Mic,
  FileCheck2,
  Database,
  CheckCircle2,
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { speak } = useVoice();

  if (!isOpen) return null;

  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const handleReadAloud = () => {
    let textToSpeak = '';
    if (isTamil) {
      textToSpeak =
        'ட்ரஸ்ட்செயின் எப்படி இயங்குகிறது: 1. ஒரு முறை சரிபார்ப்பு: ஒரு முறை மட்டும் உங்கள் அடையாளத்தை சரிபார்த்து டிஜிட்டல் பாஸ்போர்ட் பெறுங்கள். 2. ஜீரோ-நாலெட்ஜ் ப்ரூஃப்: வங்கிகளுக்கு உங்கள் அசல் ஆவண எண்கள் தெரியாது, தகுதியை மட்டும் கணித ரீதியாக நிரூபிக்கும். 3. கைரேகை மற்றும் குரல் வசதி: படிக்க தெரியாதவர்களும் வாய்ஸ் மைக் மற்றும் விரல் ரேகை மூலம் மிக எளிதாக இயக்கலாம். 4. முழு பயனர் கட்டுப்பாடு: உங்கள் அனுமதியின்றி யாரும் தகவலை பார்க்க முடியாது.';
    } else if (isHindi) {
      textToSpeak =
        'TrustChain कैसे काम करता है: 1. एक बार सत्यापन: अपनी पहचान को एक बार सत्यापित करें और डिजिटल पासपोर्ट पाएं। 2. ज़ीरो-नॉलेज प्रूफ़: बैंकों को आपके दस्तावेज़ नहीं दिखते, केवल पात्रता सत्यापित होती है। 3. बायोमेट्रिक और वॉइस एक्सेस: अनपढ़ नागरिक भी आवाज़ और फिंगरप्रिंट से आसानी से चला सकते हैं। 4. पूर्ण नियंत्रण: आपकी अनुमति के बिना कोई भी डेटा नहीं देख सकता।';
    } else {
      textToSpeak =
        'How TrustChain works: 1. Reusable KYC: Verify once and use across all banks without repeatedly sharing documents. 2. Zero-Knowledge Proofs: Banks verify eligibility without seeing your raw identity numbers. 3. Voice and Biometric First: Accessible to illiterate citizens through voice speech and fingerprint recognition. 4. Sovereign Consent: You hold 100% control over which bank accesses your data.';
    }
    speak(textToSpeak);
  };

  const steps = [
    {
      step: '01',
      icon: ShieldCheck,
      color: 'bg-indigo-600 text-white',
      titleEn: '1. Reusable KYC Passport',
      titleTa: '1. மறுபயன்பாட்டு KYC பாஸ்போர்ட்',
      titleHi: '1. पुनः प्रयोज्य केवाईसी पासपोर्ट',
      descEn:
        'Verify your Aadhaar/Passport once with biometric liveness. You never need to hand over physical photocopies to multiple banks again.',
      descTa:
        'உங்கள் அடையாளத்தை ஒரு முறை பயோமெட்ரிக் மூலம் சரிபார்த்து பாஸ்போர்ட் பெறுங்கள். இனி ஒவ்வொரு வங்கிக்கும் மீண்டும் மீண்டும் நகல்களை கொடுக்க தேவையில்லை.',
      descHi:
        'बायोमेट्रिक से एक बार सत्यापन करें और डिजिटल पासपोर्ट पाएं। फिर से बैंकों को कागज़ात देने की आवश्यकता नहीं है।',
    },
    {
      step: '02',
      icon: Cpu,
      color: 'bg-blue-600 text-white',
      titleEn: '2. Zero-Knowledge Cryptography (ZKP)',
      titleTa: '2. ஜீரோ-நாலெட்ஜ் ரகசிய சரிபார்ப்பு',
      titleHi: '2. ज़ीरो-नॉलेज प्रूफ़ प्राइवेसी',
      descEn:
        'Banks verify your criteria (e.g. age ≥ 18, creditworthy, state resident) via zk-SNARK cryptographic math WITHOUT ever seeing your sensitive raw numbers.',
      descTa:
        'வங்கிகள் உங்கள் வயது அல்லது வருமான தகுதியை கணித சூத்திரம் மூலம் அறியலாம். ஆனால் உங்கள் அசல் எண்கள் முற்றிலும் ரகசியமாக இருக்கும்.',
      descHi:
        'बैंक आपकी पात्रता को गणितीय प्रमाण से जांचते हैं, लेकिन आपके वास्तविक पहचान नंबर पूरी तरह गोपनीय रहते हैं।',
    },
    {
      step: '03',
      icon: Mic,
      color: 'bg-emerald-600 text-white',
      titleEn: '3. Voice & Fingerprint Accessibility',
      titleTa: '3. படிக்க தெரியாதவர்களுக்கான வாய்ஸ் & கைரேகை',
      titleHi: '3. आवाज़ और फिंगरप्रिंट आसान सुविधा',
      descEn:
        'Designed for everyone: citizens who cannot read or write can speak in Tamil, Hindi, or English to navigate, and sign in instantly using fingerprint or face recognition.',
      descTa:
        'படிக்க எழுத தெரியாத கிராமப்புற மற்றும் மூத்த குடிமக்கள் தங்கள் சொந்த குரல் மூலமாகவோ அல்லது விரல் ரேகை மூலமாகவோ எளிதாக இந்த செயலியை பயன்படுத்தலாம்.',
      descHi:
        'जो नागरिक पढ़ नहीं सकते, वे भी अपनी मातृभाषा में बोलकर और फिंगरप्रिंट टच करके इस ऐप को आसानी से चला सकते हैं।',
    },
    {
      step: '04',
      icon: FileCheck2,
      color: 'bg-purple-600 text-white',
      titleEn: '4. Sovereign Consent & Instant Revocation',
      titleTa: '4. உங்கள் முழு கட்டுப்பாடு மற்றும் ரத்து செய்யும் உரிமை',
      titleHi: '4. नागरिक सहमति और नियंत्रण',
      descEn:
        'Banks can only inspect claims when you explicitly grant consent. You can revoke institutional access at any second with 1-click.',
      descTa:
        'உங்கள் அனுமதியின்றி எந்த வங்கியும் தகவலை பார்க்க முடியாது. எப்போது வேண்டுமானாலும் ஒரு நொடியில் உங்கள் அனுமதியை ரத்து செய்யலாம்.',
      descHi:
        'आपकी स्पष्ट सहमति के बिना कोई बैंक डेटा नहीं देख सकता। आप कभी भी एक क्लिक में सहमति वापस ले सकते हैं।',
    },
    {
      step: '05',
      icon: Database,
      color: 'bg-amber-600 text-white',
      titleEn: '5. Sovereign Blockchain Audit Trail',
      titleTa: '5. பிளாக்செயின் மாற்றமுடியாத லெட்ஜர்',
      titleHi: '5. ब्लॉकचेन अपरिवर्तनीय ऑडिट लेजर',
      descEn:
        'Every verification timestamp, hash, and institutional check is anchored onto an immutable blockchain ledger for tamper-proof fraud prevention.',
      descTa:
        'ஒவ்வொரு சரிபார்ப்பு பதிவும் மாற்ற முடியாத பிளாக்செயினில் பதியப்படுவதால் எந்த மோசடியும் செய்ய இயலாது.',
      descHi:
        'प्रत्येक सत्यापन टाइमस्टैम्प ब्लॉकचेन लेज़र पर दर्ज होता है, जिससे धोखाधड़ी पूरी तरह से रोकी जा सकती है।',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {isTamil
                  ? 'TrustChain எப்படி இயங்குகிறது?'
                  : isHindi
                  ? 'TrustChain कैसे काम करता है?'
                  : 'How TrustChain Works'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isTamil
                  ? 'பாதுகாப்பான டிஜிட்டல் அடையாளம் மற்றும் ரகசிய சரிபார்ப்பு'
                  : isHindi
                  ? 'सुरक्षित डिजिटल पहचान और प्राइवेसी सुरक्षा'
                  : 'Privacy-preserving reusable digital identity and zero-knowledge KYC'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadAloud}
              className="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="குரலில் கேட்க / Listen Aloud"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isTamil ? 'குரலில் கேட்க' : isHindi ? 'सुनें' : 'Listen'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - Step Cards */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 font-medium leading-relaxed">
              {isTamil
                ? 'TrustChain என்பது நீங்கள் ஒருமுறை மட்டுமே ஆவணங்களை சரிபார்த்துவிட்டு, வாழ்நாள் முழுவதும் பல வங்கிகளில் கடன் அல்லது கணக்கு தொடங்க ஒரே நொடியில் பயன்படுத்தக்கூடிய டிஜிட்டல் பாஸ்போர்ட் ஆகும்.'
                : isHindi
                ? 'TrustChain एक बार की सत्यापन सेवा है जिससे आप बिना बार-बार कागजात दिए विभिन्न बैंकों में तुरंत ऋण या खाता खोल सकते हैं।'
                : 'TrustChain acts as your digital identity passport: verify your credentials once, and apply to any bank with zero paper leakage and instant cryptographic proofs.'}
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-1">
                      {isTamil ? item.titleTa : isHindi ? item.titleHi : item.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isTamil ? item.descTa : isHindi ? item.descHi : item.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {isTamil ? 'அனைத்து தரவுகளும் உங்கள் கைபேசியில் மட்டுமே ரகசியமாக இருக்கும்' : 'Self-sovereign encrypted storage'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            {isTamil ? 'புரிந்தது' : isHindi ? 'समझ गया' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
