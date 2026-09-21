import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  recognizedText: string;
  errorMessage: string | null;
  supported: boolean;
  voiceEnabled: boolean;
  rate: number;
  lastActionFeedback: string | null;
  isMicBlocked: boolean;
  showCommandModal: boolean;
}

interface VoiceContextType {
  voiceState: VoiceState;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  closeMic: () => void;
  requestMicrophonePermission: () => Promise<boolean>;
  clearError: () => void;
  speak: (text: string, langOverride?: string) => void;
  stopSpeaking: () => void;
  toggleVoiceEnabled: () => void;
  setSpeechRate: (rate: number) => void;
  registerCommandHandler: (handler: (command: string) => boolean | void) => () => void;
  processCommand: (command: string) => boolean;
  setLastActionFeedback: (feedback: string | null) => void;
  setShowCommandModal: (show: boolean) => void;
  triggerSimulatedCommand: (command: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Define SpeechRecognition interface for browsers
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    recognizedText: '',
    errorMessage: null,
    supported: false,
    voiceEnabled: true,
    rate: 1.0,
    lastActionFeedback: null,
    isMicBlocked: false,
    showCommandModal: false,
  });

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const commandHandlersRef = useRef<Array<(command: string) => boolean | void>>([]);
  const lastSpokenTextRef = useRef<string>('');
  const isFirstMountRef = useRef<boolean>(true);

  // Load and cache voices when ready
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const vList = window.speechSynthesis.getVoices();
        setVoices(vList);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  useEffect(() => {
    const win = window as IWindow;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setVoiceState(prev => ({ ...prev, supported: true }));
    }
  }, []);

  // Update speech synthesis speech with language-aware voice selection
  const speak = useCallback((text: string, langOverride?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!voiceState.voiceEnabled || !text) return;

    lastSpokenTextRef.current = text;
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = langOverride || (language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.lang = targetLang;
    utterance.rate = voiceState.rate;

    // Find best matching voice for the target language
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const langPrefix = targetLang.slice(0, 2).toLowerCase();
    
    // Exact match first (e.g. 'ta-IN', 'hi-IN', 'en-IN')
    let matchedVoice = currentVoices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
    if (!matchedVoice) {
      // Prefix match (e.g. any 'ta', 'hi', or 'en')
      matchedVoice = currentVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    }
    if (!matchedVoice && targetLang.startsWith('en')) {
      matchedVoice = currentVoices.find(v => v.lang.toLowerCase().includes('en'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    };
    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };
    utterance.onerror = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };

    window.speechSynthesis.speak(utterance);
  }, [language, voiceState.voiceEnabled, voiceState.rate, voices]);

  // Proactive check if microphone permission is explicitly granted in browser/iframe
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((res) => {
        if (res.state === 'granted') {
          setVoiceState(prev => ({ ...prev, isMicBlocked: false }));
        }
        res.onchange = () => {
          if (res.state === 'granted') {
            setVoiceState(prev => ({ ...prev, isMicBlocked: false }));
          } else if (res.state === 'denied') {
            setVoiceState(prev => ({ ...prev, isMicBlocked: true }));
          }
        };
      }).catch(() => {
        // Permission query not supported in this environment
      });
    }
  }, []);

  // When the user changes language, announce confirmation in that language
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    let announcement = '';
    let targetLang = 'en-IN';

    if (language === 'ta') {
      announcement = 'வணக்கம்! மொழி தமிழுக்கு மாற்றப்பட்டது. நீங்கள் குரல் மூலம் இந்த செயலியை இயக்கலாம்.';
      targetLang = 'ta-IN';
    } else if (language === 'hi') {
      announcement = 'नमस्ते! भाषा बदलकर हिंदी कर दी गई है। आप अपनी आवाज़ से इस ऐप का उपयोग कर सकते हैं।';
      targetLang = 'hi-IN';
    } else {
      announcement = 'Language switched to English. You can navigate and access TrustChain using your voice.';
      targetLang = 'en-IN';
    }

    setVoiceState(prev => ({
      ...prev,
      lastActionFeedback: language === 'ta' ? 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது' : language === 'hi' ? 'हिंदी भाषा चुनी गई' : 'Language set to English',
    }));

    speak(announcement, targetLang);
  }, [language, speak]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const registerCommandHandler = useCallback((handler: (command: string) => boolean | void) => {
    commandHandlersRef.current.push(handler);
    return () => {
      commandHandlersRef.current = commandHandlersRef.current.filter(h => h !== handler);
    };
  }, []);

  const setLastActionFeedback = useCallback((feedback: string | null) => {
    setVoiceState(prev => ({ ...prev, lastActionFeedback: feedback }));
  }, []);

  const processCommand = useCallback((transcript: string) => {
    const clean = transcript.trim().toLowerCase();
    let handled = false;
    // Iterate handlers in reverse (current view handlers take priority over global handlers)
    const handlers = [...commandHandlersRef.current].reverse();
    for (const handler of handlers) {
      try {
        const result = handler(clean);
        if (result) {
          handled = true;
          break;
        }
      } catch (err) {
        console.warn('Error in voice command handler:', err);
      }
    }
    return handled;
  }, []);

  const closeMic = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState(prev => ({
      ...prev,
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
      showCommandModal: false,
      errorMessage: null,
      isMicBlocked: false,
    }));
  }, []);

  const startListening = useCallback(async () => {
    const win = window as IWindow;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    // Check if SpeechRecognition is supported
    if (!SpeechRecognitionAPI) {
      console.warn('SpeechRecognition API not supported in this browser');
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
        supported: false,
        errorMessage:
          language === 'ta'
            ? 'உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. Google Chrome அல்லது Safari உலாவியைப் பயன்படுத்தவும்.'
            : language === 'hi'
            ? 'ब्राउज़र में आवाज़ पहचान समर्थित नहीं है। कृपया Google Chrome या Safari का उपयोग करें।'
            : 'Speech recognition is not supported in this browser. Please use Google Chrome or Safari.',
      }));
      return;
    }

    try {
      // 1. Stop any active speech synthesis immediately so it doesn't feed back into mic
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      // 2. Abort previous instance if any
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // 3. Check / request real device microphone permission & keep active stream
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          setVoiceState(prev => ({ ...prev, isMicBlocked: false }));
        } catch (micErr: any) {
          console.warn('Microphone permission request status:', micErr);
          if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
            setVoiceState(prev => ({
              ...prev,
              isListening: false,
              isProcessing: false,
              isMicBlocked: true,
              errorMessage:
                language === 'ta'
                  ? 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. தயவுசெய்து உலாவியில் அனுமதிக்கவும்.'
                  : language === 'hi'
                  ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र में अनुमति दें।'
                  : 'Microphone permission denied. Please allow access in your browser.',
            }));
            return;
          } else {
            setVoiceState(prev => ({
              ...prev,
              isListening: false,
              isProcessing: false,
              errorMessage:
                language === 'ta'
                  ? 'மைக்ரோஃபோன் அணுகல் தோல்வியடைந்தது. அமைப்புகளை சரிபார்க்கவும்.'
                  : language === 'hi'
                  ? 'माइक्रोफ़ोन एक्सेस विफल। कृपया सेटिंग्स जांचें।'
                  : 'Microphone access failed. Please check device settings.',
            }));
            return;
          }
        }
      }

      // 4. Create single-shot SpeechRecognition instance
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Select proper recognition locale: English -> en-IN, Tamil -> ta-IN, Hindi -> hi-IN
      const recognitionLang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.lang = recognitionLang;

      let hasProcessed = false;
      let latestTranscript = '';

      const triggerCommand = (text: string) => {
        if (hasProcessed) return;
        const trimmed = text.trim();
        if (!trimmed) return;
        hasProcessed = true;

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        setVoiceState(prev => ({ ...prev, isProcessing: true, recognizedText: trimmed }));

        try {
          recognition.stop();
        } catch {
          // ignore
        }

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }

        // Execute matching command action
        processCommand(trimmed);

        setTimeout(() => {
          setVoiceState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
          }));
        }, 400);

        setTimeout(() => {
          setVoiceState(prev => ({
            ...prev,
            recognizedText: '',
          }));
        }, 3200);
      };

      recognition.onstart = () => {
        setVoiceState(prev => ({
          ...prev,
          isListening: true,
          isProcessing: false,
          isMicBlocked: false,
          errorMessage: null,
          recognizedText: '',
          showCommandModal: false,
        }));
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          latestTranscript = currentText;
          setVoiceState(prev => ({ ...prev, recognizedText: currentText }));
        }

        if (finalTranscript && finalTranscript.trim()) {
          triggerCommand(finalTranscript.trim());
        } else if (currentText.length > 2) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (latestTranscript) {
              triggerCommand(latestTranscript);
            }
          }, 1200);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event status:', event.error);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }

        if (event.error === 'no-speech' || event.error === 'aborted') {
          setVoiceState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            errorMessage: null,
          }));
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            isMicBlocked: true,
            errorMessage:
              language === 'ta'
                ? 'மைக்ரோஃபோன் அனுமதி தேவை. உலாவியில் அனுமதிக்கவும்.'
                : language === 'hi'
                ? 'माइक्रोफ़ोन अनुमति आवश्यक है।'
                : 'Microphone permission required.',
          }));
          return;
        }

        if (event.error === 'audio-capture') {
          setVoiceState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
            errorMessage:
              language === 'ta'
                ? 'மைக்ரோஃபோன் கிடைக்கவில்லை. சாதன அமைப்பை சரிபார்க்கவும்.'
                : language === 'hi'
                ? 'माइक्रोफ़ोन उपलब्ध नहीं है।'
                : 'Microphone capture failed. Please check device settings.',
          }));
          return;
        }

        setVoiceState(prev => ({
          ...prev,
          isListening: false,
          isProcessing: false,
          errorMessage: null,
        }));
      };

      recognition.onend = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }

        if (!hasProcessed && latestTranscript && latestTranscript.trim()) {
          triggerCommand(latestTranscript.trim());
        } else {
          setVoiceState(prev => ({
            ...prev,
            isListening: false,
            isProcessing: false,
          }));
        }
      };

      try {
        recognition.start();
      } catch (startErr: any) {
        if (startErr.name !== 'InvalidStateError') {
          console.warn('Recognition start caught exception:', startErr);
        }
      }
    } catch (err: any) {
      console.warn('Failed to start speech recognition', err);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
      }));
    }
  }, [language, processCommand]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setVoiceState(prev => ({ ...prev, isListening: false, isProcessing: false }));
  }, []);

  const toggleListening = useCallback(() => {
    if (voiceState.isListening || voiceState.showCommandModal) {
      closeMic();
    } else {
      startListening();
    }
  }, [voiceState.isListening, voiceState.showCommandModal, closeMic, startListening]);

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      setVoiceState(prev => ({
        ...prev,
        isMicBlocked: false,
        errorMessage: null,
      }));

      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setVoiceState(prev => ({ ...prev, isMicBlocked: false, errorMessage: null }));
        return true;
      }
      return true;
    } catch (err: any) {
      console.warn('Microphone permission request failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setVoiceState(prev => ({
          ...prev,
          isMicBlocked: true,
          errorMessage:
            language === 'ta'
              ? 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவியில் அனுமதிக்கவும்.'
              : language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र में अनुमति दें।'
              : 'Microphone permission denied. Please allow access in your browser.',
        }));
      }
      return false;
    }
  }, [language]);

  const clearError = useCallback(() => {
    setVoiceState(prev => ({ ...prev, errorMessage: null, isMicBlocked: false }));
  }, []);

  const setShowCommandModal = useCallback((show: boolean) => {
    setVoiceState(prev => ({ ...prev, showCommandModal: show }));
  }, []);

  const triggerSimulatedCommand = useCallback((commandText: string) => {
    const trimmed = commandText.trim();
    if (!trimmed) return;
    setVoiceState(prev => ({
      ...prev,
      recognizedText: trimmed,
      isProcessing: true,
      errorMessage: null,
    }));
    setTimeout(() => {
      processCommand(trimmed);
      setVoiceState(prev => ({
        ...prev,
        isProcessing: false,
        showCommandModal: false,
      }));
    }, 200);
  }, [processCommand]);

  const toggleVoiceEnabled = useCallback(() => {
    setVoiceState(prev => {
      const next = !prev.voiceEnabled;
      if (!next) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
      return { ...prev, voiceEnabled: next };
    });
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    setVoiceState(prev => ({ ...prev, rate }));
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        voiceState,
        startListening,
        stopListening,
        toggleListening,
        closeMic,
        requestMicrophonePermission,
        clearError,
        speak,
        stopSpeaking,
        toggleVoiceEnabled,
        setSpeechRate,
        registerCommandHandler,
        processCommand,
        setLastActionFeedback,
        setShowCommandModal,
        triggerSimulatedCommand,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
