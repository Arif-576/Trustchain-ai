import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, X, Delete, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { User } from '../../types';

interface PINAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  defaultContact?: string;
}

export const PINAuthModal: React.FC<PINAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultContact = 'arif@trustchain.id',
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [pin, setPin] = useState('');
  const [contact, setContact] = useState(defaultContact);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      speak(
        language === 'ta'
          ? 'உங்கள் 4 அல்லது 6 இலக்க ரகசிய பின் எண்ணை உள்ளிடவும்.'
          : language === 'hi'
          ? 'कृपया अपना 4 या 6 अंकों का सुरक्षा पिन दर्ज करें।'
          : 'Please enter your 4 or 6 digit security PIN to sign in.'
      );
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(null);

      // Auto-submit if 4 or 6 digits entered
      if (newPin.length === 4 || newPin.length === 6) {
        submitPIN(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const submitPIN = async (pinToVerify = pin) => {
    if (pinToVerify.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.loginWithPIN(contact, pinToVerify);
      localStorage.setItem('trustchain_user', JSON.stringify(res.user));
      localStorage.setItem('trustchain_token', res.token);
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid security PIN. Default demo PIN is 1234 or 2026.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm glass-panel p-6 sm:p-7 rounded-3xl shadow-2xl border border-white/90 bg-white/95 text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">
          {language === 'ta' ? 'பாதுகாப்பு பின் (PIN) உள்நுழைவு' : language === 'hi' ? 'सुरक्षा पिन लॉगिन' : 'Security PIN Sign In'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {language === 'ta'
            ? 'உங்கள் 4 அல்லது 6 இலக்க ரகசிய PIN எண்ணை உள்ளிட்டு விரைவாக உள்நுழையவும்'
            : language === 'hi'
            ? 'त्वरित प्रवेश के लिए अपना 4 या 6 अंकों का पिन दर्ज करें'
            : 'Enter your 4 or 6-digit security PIN for instant secure access'}
        </p>

        {/* User preview badge */}
        <div className="my-3 py-1.5 px-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between text-left text-xs">
          <div>
            <span className="font-bold text-indigo-950 block">Mohamed Arif A</span>
            <span className="text-[10px] text-indigo-600 font-mono">{contact}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 shadow-2xs border border-indigo-200">
            Citizen
          </span>
        </div>

        {/* PIN Indicators */}
        <div className="my-4 flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-indigo-600 scale-125 shadow-md shadow-indigo-200'
                    : 'bg-slate-200 border-2 border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-lg font-bold text-slate-800 hover:text-indigo-700 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-slate-100/70 hover:bg-slate-200/80 text-xs font-bold text-slate-600 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-lg font-bold text-slate-800 hover:text-indigo-700 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || pin.length === 0}
            className="w-full h-12 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all active:scale-95 cursor-pointer flex items-center justify-center disabled:opacity-40"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo PIN shortcut */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setPin('1234');
              submitPIN('1234');
            }}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Default PIN (1234)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
