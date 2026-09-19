import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Bot,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Globe,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { User, SupportedLanguage } from '../../types';

interface AIAssistantModalProps {
  currentUser: User | null;
  onNavigateTab?: (tabId: string) => void;
  isOpenControlled?: boolean;
  onCloseControlled?: () => void;
  onOpenControlled?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  currentUser,
  onNavigateTab,
  isOpenControlled,
  onCloseControlled,
  onOpenControlled,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [hideFloating, setHideFloating] = useState(() => localStorage.getItem('trustchain_hide_ai_fab') === 'true');

  useEffect(() => {
    const handleStorage = () => {
      setHideFloating(localStorage.getItem('trustchain_hide_ai_fab') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;

  const handleOpen = () => {
    if (onOpenControlled) {
      onOpenControlled();
    } else {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (onCloseControlled) {
      onCloseControlled();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { voiceState, startListening, stopListening, closeMic, speak, stopSpeaking, requestMicrophonePermission } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text:
        language === 'ta'
          ? 'வணக்கம்! நான் உங்கள் TrustChain தனியுரிமை மற்றும் அடையாள உதவியாளர். உங்களுக்கு எவ்வாறு உதவ வேண்டும்? கீழே தட்டச்சு செய்யலாம் அல்லது மைக் பயன்படுத்தலாம்.'
          : language === 'hi'
          ? 'नमस्ते! मैं आपका TrustChain प्राइवेसी एवं पहचान सहायक हूँ। आप नीचे लिखकर या माइक से प्रश्न पूछ सकते हैं।'
          : 'Hello! I am your TrustChain Assistant. You can type your question below or use the microphone to ask anything about your KYC, loans, or identity.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync voice transcript to input if assistant is open
  useEffect(() => {
    if (isOpen && voiceState.recognizedText) {
      setInputMessage(voiceState.recognizedText);
    }
  }, [isOpen, voiceState.recognizedText]);

  const handleChatMicToggle = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      stopSpeaking(); // silence any talking
      startListening();
    }
  };

  const handleOpenStandalone = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank');
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend, language, currentUser?.id);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: res.suggestedAction,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Speak response aloud if voice enabled
      if (voiceState.voiceEnabled) {
        speak(res.reply);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach assistant engine. Please verify your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: t('quickKycStatus'), query: 'Show my KYC status and credential details' },
    { label: t('quickPrivacyScore'), query: 'What is my current privacy score?' },
    { label: t('quickGenProof'), query: 'How do I generate a zero-knowledge proof for age?' },
    { label: t('quickMyLoans'), query: 'Show available loans and credit facilities' },
    { label: t('quickConsent'), query: 'Manage my bank consents and permissions' },
    { label: t('quickSecurity'), query: 'How does device passkey protect my data?' },
  ];

  return (
    <>
      {/* Floating Trigger Button (Positioned safely above bottom navigation bar, with dismiss option) */}
      {!hideFloating && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-30 flex items-center group">
          <button
            id="open-ai-assistant-btn"
            onClick={handleOpen}
            title={t('aiAssistantTitle')}
            className="p-3 sm:px-3.5 sm:py-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-bold text-xs hidden sm:inline">TrustAI</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHideFloating(true);
              localStorage.setItem('trustchain_hide_ai_fab', 'true');
            }}
            title="Hide floating icon (access TrustAI anytime from the top Header)"
            className="ml-1 p-1 rounded-full bg-slate-800/70 hover:bg-slate-900 text-white/80 hover:text-white text-[10px] transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-xs"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Assistant Drawer/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-900/30 backdrop-blur-xs">
          <div className="w-full sm:max-w-md h-[88vh] sm:h-[650px] glass-panel bg-white/95 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    TrustAI Assistant
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 px-1.5 py-0.2 rounded-full font-medium">
                      Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-indigo-100">
                    {language === 'ta' ? 'தனியுரிமை & அடையாள உதவியாளர்' : language === 'hi' ? 'पहचान एवं प्राइवेसी सहायक' : 'Privacy, KYC & Verification Advisor'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Language Switcher inside Chatbox */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/15 border border-white/20 text-white text-xs">
                  <Globe className="w-3.5 h-3.5 text-white/80" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    aria-label="Change Chat Language"
                    className="bg-transparent text-white text-xs font-bold cursor-pointer focus:outline-none pr-0.5 [&>option]:text-slate-800"
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ்</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                </div>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  aria-label="Close Chat"
                  title="Close AI Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="px-4 py-2 bg-indigo-50/60 border-b border-indigo-100/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.query)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 whitespace-nowrap transition-all shadow-xs cursor-pointer"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Chat message stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-xs shadow-md shadow-indigo-100'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.suggestedAction && onNavigateTab && (
                      <button
                        onClick={() => {
                          onNavigateTab(m.suggestedAction!);
                          handleClose();
                        }}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center justify-between border border-indigo-200 cursor-pointer"
                      >
                        <span>Open {t(m.suggestedAction)}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-200" />
                  <span>TrustAI analyzing query...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Mic Blocked / Standalone Tab Helper */}
            {voiceState.isMicBlocked && !voiceState.isListening && (
              <div className="px-3.5 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs text-amber-800">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] leading-tight">
                    {language === 'ta'
                      ? 'மைக் தடுக்கப்பட்டுள்ளது: கீழே தட்டச்சு செய்யவும் அல்லது நேரடி தாவலில் திறக்கவும்'
                      : language === 'hi'
                      ? 'माइक अवरुद्ध: नीचे लिखें या नए टैब में खोलें'
                      : 'Mic blocked in frame: Type below or open in new tab'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenStandalone}
                  className="px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{language === 'ta' ? 'புதிய தாவல்' : 'New Tab'}</span>
                </button>
              </div>
            )}

            {/* Voice Listening Banner with explicit Close Mic button */}
            {voiceState.isListening && (
              <div className="px-3.5 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 font-semibold animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>{language === 'ta' ? 'கேட்கிறது... பேசுங்கள்' : language === 'hi' ? 'सुन रहा है... बोलें' : 'Listening... Speak now'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeMic}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'மைக் மூடு (Close Mic)' : 'Close Mic'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
              <button
                id="chat-mic-btn"
                type="button"
                onClick={handleChatMicToggle}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  voiceState.isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={voiceState.isListening ? 'Close & send' : 'Speak your question (or click to talk)'}
              >
                {voiceState.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                id="ai-chat-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('aiAssistantPlaceholder')}
                className="flex-1 py-2 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />

              <button
                id="ai-chat-send-btn"
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
