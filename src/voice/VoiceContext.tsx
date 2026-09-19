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
        errorMessage:
          language === 'ta'
            ? 'உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை.'
            : language === 'hi'
            ? 'ब्राउज़र में आवाज़ पहचान समर्थित नहीं है।'
            : 'Speech recognition is not supported in this browser.',
      }));
      return;
    }

    try {
      // 1. Stop any active speech synthesis immediately so it doesn't feed back into mic
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      // 2. If already listening, abort previous instance cleanly
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      // 3. Check / request real browser microphone permission if not yet granted
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        let alreadyGranted = false;
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (status.state === 'granted') {
              alreadyGranted = true;
            }
          } catch {
            // Permission query unsupported, proceed to request
          }
        }

        if (!alreadyGranted) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setVoiceState(prev => ({ ...prev, isMicBlocked: false }));
          } catch (micErr: any) {
            console.warn('Microphone permission request status:', micErr);
            if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
              setVoiceState(prev => ({
                ...prev,
                isListening: false,
                isProcessing: false,
                errorMessage:
                  language === 'ta'
                    ? 'மைக்ரோஃபோன் அனுமதி தேவை. தயவுசெய்து உலாவியில் அனுமதிக்கவும்.'
                    : language === 'hi'
                    ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र में अनुमति दें।'
                    : 'Microphone permission denied. Please allow access in your browser.',
              }));
              return;
            }
          }
        }
      }

      // 4. Create single-shot SpeechRecognition instance
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.continuous = false; // Never continuously listen; single-shot utterance capture
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Select proper recognition locale: English -> en-IN, Tamil -> ta-IN, Hindi -> hi-IN
      const recognitionLang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.lang = recognitionLang;

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
        setVoiceState(prev => ({ ...prev, recognizedText: currentText }));

        // When user finishes speaking the utterance
        if (finalTranscript && finalTranscript.trim()) {
          const commandText = finalTranscript.trim();
          setVoiceState(prev => ({ ...prev, isProcessing: true, recognizedText: commandText }));
          
          // Stop recognition cleanly
          try {
            recognition.stop();
          } catch {
            // ignore
          }

          // Execute matching command action
          processCommand(commandText);

          // Return to normal microphone state cleanly
          setTimeout(() => {
            setVoiceState(prev => ({
              ...prev,
              isListening: false,
              isProcessing: false,
            }));
          }, 400);

          // Clear recognized text after brief delay so user can verify what was recognized
          setTimeout(() => {
            setVoiceState(prev => ({
              ...prev,
              recognizedText: '',
            }));
          }, 3200);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event status:', event.error);

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
            errorMessage:
              language === 'ta'
                ? 'மைக்ரோஃபோன் அனுமதி தேவை. உலாவியில் அனுமதிக்கவும்.'
                : language === 'hi'
                ? 'माइक्रोफ़ोन अनुमति आवश्यक है।'
                : 'Microphone permission required.',
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
        setVoiceState(prev => ({
          ...prev,
          isListening: false,
          isProcessing: false,
        }));
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
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
      }));
    }
  }, [language, processCommand]);

  const stopListening = useCallback(() => {
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

      // Directly activate speech recognition
      await startListening();

      // Also trigger browser prompt if available
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop());
            setVoiceState(prev => ({ ...prev, isMicBlocked: false }));
          })
          .catch(e => {
            console.warn('Browser getUserMedia check result:', e);
          });
      }
      return true;
    } catch (err: any) {
      console.warn('Microphone permission request failed:', err);
      return false;
    }
  }, [startListening]);

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
