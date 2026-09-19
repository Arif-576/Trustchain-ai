import React from 'react';
import { Mic, MicOff, Volume2, X, RefreshCw, Sparkles, AudioWaveform } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface VoiceControlBarProps {
  onExecuteCommand?: (cmd: string) => void;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({ onExecuteCommand }) => {
  const { voiceState, startListening, stopListening, toggleListening, setSpeechRate, speak, stopSpeaking } = useVoice();
  const { language, t } = useLanguage();

  if (!voiceState.isListening && !voiceState.recognizedText && !voiceState.errorMessage) {
    return null; // keep clean when idle
  }

  return (
    <div
      id="voice-control-banner"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-full px-4"
    >
      <div className="glass-panel p-4 rounded-2xl shadow-2xl border border-indigo-200/80 bg-white/90 backdrop-blur-xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Top row: Status & Action buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                voiceState.isListening
                  ? 'bg-rose-500 animate-pulse shadow-md shadow-rose-200'
                  : voiceState.isProcessing
                  ? 'bg-amber-500 animate-spin'
                  : 'bg-indigo-600'
              }`}
            >
              {voiceState.isListening ? (
                <Mic className="w-5 h-5" />
              ) : (
                <AudioWaveform className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                {t('voiceAssistant')}
                {voiceState.isListening && (
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </h4>
              <p className="text-xs text-slate-500">
                {voiceState.isListening
                  ? t('voiceListening')
                  : voiceState.isProcessing
                  ? t('voiceProcessing')
                  : t('voiceTryCommands')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {voiceState.isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                {t('stopSpeaking')}
              </button>
            )}

            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                voiceState.isListening
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {voiceState.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopListening();
                stopSpeaking();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live transcript or Recognized Text */}
        {voiceState.recognizedText && (
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-0.5">
              Recognized Speech:
            </span>
            <p className="text-sm font-medium text-slate-800 italic">
              "{voiceState.recognizedText}"
            </p>
          </div>
        )}

        {/* Error state */}
        {voiceState.errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
            <span>{voiceState.errorMessage}</span>
            <button
              onClick={startListening}
              className="px-2 py-1 bg-rose-100 rounded text-xs font-bold hover:bg-rose-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Speed presets */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <span>Voice Speed:</span>
          <div className="flex items-center gap-1 font-semibold">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeechRate(s)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  voiceState.rate === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
