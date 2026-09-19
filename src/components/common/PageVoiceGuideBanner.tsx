import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Sparkles, ChevronDown, ChevronUp, Mic, Headphones } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { getPageVoiceGuide } from '../../voice/pageVoiceGuides';
import { SupportedLanguage } from '../../types';

interface PageVoiceGuideBannerProps {
  pageKey: string;
  autoSpeakOnMount?: boolean;
}

export const PageVoiceGuideBanner: React.FC<PageVoiceGuideBannerProps> = ({
  pageKey,
  autoSpeakOnMount = false
}) => {
  const { language, setLanguage } = useLanguage();
  const { voiceState, speak, stopSpeaking } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);
  const guide = getPageVoiceGuide(pageKey);

  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const title = isTamil ? guide.titleTa : isHindi ? guide.titleHi : guide.titleEn;
  const description = isTamil ? guide.whatYouCanDoTa : isHindi ? guide.whatYouCanDoHi : guide.whatYouCanDoEn;
  const speechText = isTamil ? guide.speechTa : isHindi ? guide.speechHi : guide.speechEn;
  const targetSpeechLang = isTamil ? 'ta-IN' : isHindi ? 'hi-IN' : 'en-IN';

  const handleToggleSpeak = () => {
    if (voiceState.isSpeaking) {
      stopSpeaking();
    } else {
      speak(speechText, targetSpeechLang);
    }
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    // Speak immediately in the selected language
    const newSpeechText = newLang === 'ta' ? guide.speechTa : newLang === 'hi' ? guide.speechHi : guide.speechEn;
    const newTargetLang = newLang === 'ta' ? 'ta-IN' : newLang === 'hi' ? 'hi-IN' : 'en-IN';
    speak(newSpeechText, newTargetLang);
  };

  return (
    <section
      id={`page-voice-guide-${pageKey}`}
      aria-label="Page Audio Instructions and Guide"
      className="w-full bg-gradient-to-r from-indigo-50/90 via-blue-50/60 to-purple-50/80 rounded-2xl border border-indigo-100/90 shadow-2xs p-3 sm:p-4 mb-4 transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left info: Icon, Title, & Brief text */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
            {voiceState.isSpeaking ? (
              <Headphones className="w-4 h-4 animate-bounce text-amber-300" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                {title}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200/60">
                {isTamil ? 'குரல் வழிகாட்டி' : isHindi ? 'आवाज मार्गदर्शन' : 'Voice Guide'}
              </span>
              {voiceState.isSpeaking && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  {isTamil ? 'ஒலிக்கிறது...' : isHindi ? 'बोल रहा है...' : 'Speaking...'}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 sm:line-clamp-none leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Right Controls: Play/Stop Button + Language Switchers */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-indigo-100/60">
          {/* Audio Listen / Stop Button */}
          <button
            id={`btn-listen-page-${pageKey}`}
            type="button"
            onClick={handleToggleSpeak}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              voiceState.isSpeaking
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-200 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/60'
            }`}
            title={voiceState.isSpeaking ? 'Stop speech audio' : 'Listen to page instructions in chosen language'}
          >
            {voiceState.isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{isTamil ? 'நிறுத்து' : isHindi ? 'रोकें' : 'Stop'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{isTamil ? 'கேளுங்கள் (Listen)' : isHindi ? 'सुनें (Listen)' : 'Listen (குரல்)'}</span>
              </>
            )}
          </button>

          {/* 3 Language Quick Buttons */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-indigo-100 shadow-2xs">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title="Listen in English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('ta')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title="தமிழில் கேட்க"
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title="हिंदी में सुनें"
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
