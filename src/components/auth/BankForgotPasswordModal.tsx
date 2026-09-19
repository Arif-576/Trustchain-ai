import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Building2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

interface BankForgotPasswordModalProps {
  isOpen: boolean;
  defaultBankId?: string;
  defaultEmployeeId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const BankForgotPasswordModal: React.FC<BankForgotPasswordModalProps> = ({
  isOpen,
  defaultBankId = 'BANK-HDFC-901',
  defaultEmployeeId = 'EMP-4082',
  onClose,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [method, setMethod] = useState<'email' | 'credentials'>('email');
  const [email, setEmail] = useState('manager.hdfc@trustchain.bank');
  const [bankId, setBankId] = useState(defaultBankId);
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentCodeHint, setSentCodeHint] = useState<string | null>(null);
  const [activeEmail, setActiveEmail] = useState<string>('');

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let res;
      if (method === 'email') {
        if (!email.trim() || !email.includes('@')) {
          setError(
            isTamil
              ? 'சரியான வங்கி மின்னஞ்சலை உள்ளிடவும்.'
              : isHindi
              ? 'कृपया मान्य बैंक ईमेल दर्ज करें।'
              : 'Please provide a valid registered institutional email.'
          );
          setLoading(false);
          return;
        }
        res = await api.bankForgotPassword({ email: email.trim() });
        setActiveEmail(res.email || email.trim());
      } else {
        if (!bankId.trim() || !employeeId.trim()) {
          setError('Please provide both Bank ID and Employee ID.');
          setLoading(false);
          return;
        }
        res = await api.bankForgotPassword({ bankId: bankId.trim(), employeeId: employeeId.trim() });
        setActiveEmail(res.email || `${employeeId}@${bankId.toLowerCase()}.bank`);
      }

      setSentCodeHint(res.verificationCode);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Institutional personnel not found. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim() || code.length < 6) {
      setError('Please enter the 6-digit institutional reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Staff password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await api.bankResetPassword({
        email: method === 'email' ? activeEmail || email.trim() : undefined,
        bankId: bankId.trim(),
        employeeId: employeeId.trim(),
        code: code.trim(),
        newPassword,
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired institutional reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isTamil ? 'வங்கி கடவுச்சொல் மீட்பு' : isHindi ? 'बैंक पासवर्ड पुनर्प्राप्ति' : 'Bank Officer Password Recovery'}
              </h3>
              <p className="text-xs text-slate-500">
                Institutional Sovereign Access Enclave
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: REQUEST CODE */}
          {step === 'request' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              {/* Method Toggle */}
              <div className="flex rounded-xl p-1 bg-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    method === 'email' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isTamil ? 'மின்னஞ்சல் மூலம்' : isHindi ? 'ईमेल द्वारा' : 'Institutional Email'}
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('credentials')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    method === 'credentials' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isTamil ? 'வங்கி & பணியாளர் எண்' : isHindi ? 'बैंक और कर्मचारी आईडी' : 'Bank & Employee ID'}
                </button>
              </div>

              {method === 'email' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isTamil ? 'பதிவு செய்யப்பட்ட வங்கி மின்னஞ்சல்' : isHindi ? 'पंजीकृत बैंक ईमेल' : 'Registered Bank Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="bankmanager@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-slate-50/50"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isTamil
                      ? 'உங்கள் கணக்குடன் தொடர்புடைய மின்னஞ்சலை உள்ளிடவும்.'
                      : isHindi
                      ? 'अपने बैंक खाते से संबद्ध ईमेल दर्ज करें।'
                      : 'Enter your registered officer email.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bank Institutional ID
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={bankId}
                        onChange={(e) => setBankId(e.target.value)}
                        placeholder="e.g. BANK-HDFC-901"
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Employee ID
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="e.g. EMP-4082"
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-purple-200"
              >
                {loading ? 'Dispatching Enclave Code...' : isTamil ? 'மீட்புக் குறியீடு அனுப்புக' : isHindi ? 'पुनर्प्राप्ति कोड भेजें' : 'Send Recovery Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY AND SET NEW PASSWORD */}
          {step === 'verify' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1">
                <div className="font-semibold">
                  Password reset verification sent to <span className="font-bold underline">{activeEmail || email}</span>
                </div>
                <div className="text-[11px] text-purple-700">
                  Verification Code: <span className="font-mono font-bold tracking-wider bg-white px-1.5 py-0.5 rounded border border-purple-300">{sentCodeHint}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  6-Digit Recovery Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 748291"
                  className="w-full py-2.5 px-3 text-center text-base tracking-widest font-mono font-bold rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-purple-200"
                >
                  {loading ? 'Updating Credentials...' : 'Save New Password'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  Password Updated Successfully
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your institutional bank credentials have been updated and anchored to the local security enclave. You may now sign in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
              >
                Return to Bank Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
