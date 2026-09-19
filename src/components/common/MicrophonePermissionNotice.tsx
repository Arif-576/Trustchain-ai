import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle2, X, ExternalLink, Sparkles, Send, Volume2, ShieldCheck, Building2, UserCheck, CreditCard, Banknote } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const MicrophonePermissionNotice: React.FC = () => {
  const { voiceState, requestMicrophonePermission, clearError, triggerSimulatedCommand, setShowCommandModal, speak, closeMic } = useVoice();
  const { language, setLanguage } = useLanguage();
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [typedCommand, setTypedCommand] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMic();
        clearError();
        setShowCommandModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMic, clearError, setShowCommandModal]);

  // Show ONLY if voice command guide modal is explicitly requested by user
  const isVisible = Boolean(voiceState.showCommandModal);
  if (!isVisible) return null;

  const isTamil = language === 'ta';
  const isHindi = language === 'hi';
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleTestMic = async () => {
    setTesting(true);
    setTestSuccess(null);
    const granted = await requestMicrophonePermission();
    setTesting(false);
    setTestSuccess(granted);
    if (granted) {
      setTimeout(() => {
        clearError();
        setShowCommandModal(false);
      }, 800);
    }
  };

  const handleClose = () => {
    closeMic();
    clearError();
    setShowCommandModal(false);
  };

  const handleExecute = (cmd: string, feedbackText?: string) => {
    if (feedbackText) {
      speak(feedbackText);
    }
    triggerSimulatedCommand(cmd);
    setShowCommandModal(false);
    clearError();
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;
    handleExecute(typedCommand.trim());
    setTypedCommand('');
  };

  const quickCommands = isTamil
    ? [
        { label: 'வங்கி போர்டல்', cmd: 'bank', icon: Building2, spoken: 'வங்கி ஊழியர் போர்டலுக்கு மாறுகிறது' },
        { label: 'கேஒய்சி ஆவணம்', cmd: 'kyc', icon: ShieldCheck, spoken: 'மறுபயன்பாட்டு கேஒய்சி விவரங்கள் திறக்கப்படுகிறது' },
        { label: 'அடையாள வாலட்', cmd: 'wallet', icon: CreditCard, spoken: 'டிஜிட்டல் அடையாள வாலட் திறக்கப்படுகிறது' },
        { label: 'வாடிக்கையாளர்', cmd: 'customer', icon: UserCheck, spoken: 'குடிமகன் போர்டலுக்கு மாறுகிறது' },
        { label: 'கடன் திட்டங்கள்', cmd: 'loans', icon: Banknote, spoken: 'கடன் விண்ணப்ப பக்கத்திற்கு செல்கிறது' },
        { label: 'வாசித்து காட்டு', cmd: 'read', icon: Volume2, spoken: 'திரை தகவலை வாசிக்கிறது' },
      ]
    : isHindi
    ? [
        { label: 'बैंक पोर्टल', cmd: 'bank', icon: Building2, spoken: 'बैंक स्टाफ पोर्टल पर जा रहे हैं' },
        { label: 'केवाईसी विवरण', cmd: 'kyc', icon: ShieldCheck, spoken: 'केवाईसी पासपोर्ट खोला जा रहा है' },
        { label: 'आईडी वॉलेट', cmd: 'wallet', icon: CreditCard, spoken: 'डिजिटल वॉलेट खोला जा रहा है' },
        { label: 'नागरिक पोर्टल', cmd: 'customer', icon: UserCheck, spoken: 'ग्राहक पोर्टल पर जा रहे हैं' },
        { label: 'ऋण सेवाएं', cmd: 'loans', icon: Banknote, spoken: 'ऋण सेवाओं को खोला जा रहा है' },
        { label: 'बोलकर सुनाएं', cmd: 'read', icon: Volume2, spoken: 'स्क्रीन पढ़कर सुनाई जा रही है' },
      ]
    : [
        { label: 'Bank Portal', cmd: 'bank', icon: Building2, spoken: 'Switching to Bank Staff Portal' },
        { label: 'KYC Passport', cmd: 'kyc', icon: ShieldCheck, spoken: 'Opening reusable KYC Passport' },
        { label: 'Identity Wallet', cmd: 'wallet', icon: CreditCard, spoken: 'Opening Digital Identity Wallet' },
        { label: 'Citizen Portal', cmd: 'customer', icon: UserCheck, spoken: 'Switching to Citizen Portal' },
        { label: 'Micro-Loans', cmd: 'loans', icon: Banknote, spoken: 'Opening micro loans section' },
        { label: 'Read Screen', cmd: 'read', icon: Volume2, spoken: 'Reading current screen aloud' },
      ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="voice-command-floating-assistant"
        className="w-full sm:max-w-lg bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-indigo-500/40 animate-in fade-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-label="Voice Command Assistant"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              {voiceState.errorMessage ? (
                <MicOff className="w-5 h-5 text-amber-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>
                  {isTamil
                    ? 'குரல் கட்டளை மையம் (Voice Assistant)'
                    : isHindi
                    ? 'आवाज सहायक केंद्र (Voice Assistant)'
                    : 'Voice Command & Control Center'}
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                {isTamil
                  ? isInsideIframe
                    ? 'உலாவி ஐபிரேமில் மைக் கட்டுப்படுத்தப்பட்டுள்ளது. முழு மைக் வசதிக்கு "நேரடி தாவலில் திறக்க" அல்லது கீழே உள்ள கட்டளையைத் தொடவும்:'
                    : 'மைக் அனுமதி இல்லையா? கவலை வேண்டாம்! கீழே உள்ள கட்டளையைத் தொடவும் அல்லது தட்டச்சு செய்யவும்:'
                  : isHindi
                  ? isInsideIframe
                    ? 'ब्राउज़र पूर्वावलोकन में माइक सीमित है। पूर्ण माइक के लिए "नए टैब में खोलें" चुनें या नीचे आदेश पर टैप करें:'
                    : 'माइक अनुमति उपलब्ध नहीं है? कोई बात नहीं! नीचे दिए गए आदेश पर टैप करें या लिखें:'
                  : isInsideIframe
                  ? 'Microphone is restricted in preview frame. Tap "Open in New Tab" for direct hardware mic, or tap commands below:'
                  : "Can't grant mic permission in this browser? Tap any instant command or type below:"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
            title="Close voice assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick 1-tap commands */}
        <div className="mt-3.5 pt-2.5 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {isTamil ? 'உடனடி கட்டளைகள் (தட்டவும்):' : 'Instant Voice Commands (Tap to run):'}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">No mic required</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {quickCommands.map((qc) => {
              const Icon = qc.icon;
              return (
                <button
                  key={qc.cmd}
                  type="button"
                  onClick={() => handleExecute(qc.cmd, qc.spoken)}
                  className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-indigo-600/80 active:bg-indigo-700 text-white text-xs font-semibold transition-all cursor-pointer border border-white/15 flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                  <span className="truncate">{qc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Command Input */}
        <form onSubmit={handleSubmitText} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={typedCommand}
            onChange={(e) => setTypedCommand(e.target.value)}
            placeholder={
              isTamil
                ? 'கட்டளையைத் தட்டச்சு செய்யவும் (எ.கா: bank, kyc, wallet)...'
                : isHindi
                ? 'आदेश लिखें (उदा: bank, kyc, wallet)...'
                : 'Type command (e.g. bank, kyc, wallet, loans)...'
            }
            className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={!typedCommand.trim()}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isTamil ? 'இயக்கு' : 'Send'}</span>
          </button>
        </form>

        {/* Hardware Mic & Standalone Option Footer */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Open in Standalone Tab to use hardware microphone with zero iframe restrictions"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>{isTamil ? 'நேரடி தாவலில் திறக்க (மைக்)' : isHindi ? 'नए टैब में खोलें' : 'Open in New Tab'}</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestMic}
              disabled={testing}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              {testing ? (
                <span>Checking...</span>
              ) : testSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isTamil ? 'அனுமதிக்கப்பட்டது' : 'Granted'}</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'மைக் மீண்டும் முயற்சி' : 'Retry Mic Permission'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold transition-all cursor-pointer"
            >
              {isTamil ? 'மூடு (Close)' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

