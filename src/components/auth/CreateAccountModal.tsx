import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  User,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { User as UserType } from '../../types';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType, initialPassword?: string) => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<UserType | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      const err = isTamil ? 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும்.' : isHindi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.';
      setError(err);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      const err = isTamil ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : isHindi ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.';
      setError(err);
      return;
    }

    if (password.length < 6) {
      const err = isTamil ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் கொண்டிருக்க வேண்டும்.' : isHindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.';
      setError(err);
      return;
    }

    if (password !== confirmPassword) {
      const err = isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் சரிபார்க்கவும்.' : isHindi ? 'पासवर्ड मेल नहीं खाते। कृपया पुनः प्रयास करें।' : 'Passwords do not match. Please re-enter.';
      setError(err);
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });

      setCreatedUser(res.user);

      if (isTamil) {
        speak(`${res.user.name} அவர்களே, உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.`);
      } else if (isHindi) {
        speak(`${res.user.name}, आपका खाता सफलतापूर्वक बना दिया गया है।`);
      } else {
        speak(`Account created successfully for ${res.user.name}. You may now sign in.`);
      }

      setTimeout(() => {
        onSuccess(res.user, password);
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isTamil ? 'புதிய குடிமக்கள் கணக்கு உருவாக்குக' : isHindi ? 'नया नागरिक खाता बनाएं' : 'Create Citizen Sovereign Account'}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isTamil ? 'ஜீரோ-நாலெட்ஜ் பிளாக்செயின் பாதுகாப்பு' : isHindi ? 'शून्य-ज्ञान ब्लॉकचेन सुरक्षा' : 'Zero-Knowledge Blockchain Identity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {createdUser ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-800">
                  {isTamil ? 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!' : isHindi ? 'खाता सफलतापूर्वक बना दिया गया!' : 'Account Created Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {isTamil
                    ? `${createdUser.name} (${createdUser.email}) க்கான சவரன் அடையாள பாஸ்போர்ட் பிளாக்செயினில் உருவாக்கப்பட்டது.`
                    : isHindi
                    ? `${createdUser.name} (${createdUser.email}) के लिए सार्वभौम पहचान पासपोर्ट ब्लॉकचेन पर दर्ज किया गया है।`
                    : `Sovereign identity passport anchored on blockchain for ${createdUser.name} (${createdUser.email}).`}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold">
                <span>{isTamil ? 'உள்நுழைவு பக்கத்திற்கு மாற்றுகிறது...' : isHindi ? 'लॉगिन पृष्ठ पर स्थानांतरित कर रहा है...' : 'Redirecting to sign in...'}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isTamil ? 'முழு பெயர்' : isHindi ? 'पूरा नाम' : 'Full Legal Name'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isTamil ? 'எ.கா. முஹம்மது ஆரிஃப்' : isHindi ? 'उदा. मोहम्मद आरिफ' : 'e.g. Priya Sharma'}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isTamil ? 'மின்னஞ்சல் முகவரி' : isHindi ? 'ईमेल पता' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isTamil ? 'மொபைல் எண் (விருப்பத்தேர்வு)' : isHindi ? 'मोबाइल नंबर (वैकल्पिक)' : 'Mobile Number (Optional)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('password')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('confirmPassword')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Security Enclave Notice */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2 text-xs text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  {isTamil
                    ? 'பதிவு செய்யும் போது உங்களுக்கான ஜீரோ-நாலெட்ஜ் KYC பாஸ்போர்ட் தானாக உருவாக்கப்படும்.'
                    : isHindi
                    ? 'पंजीकरण करते समय आपका शून्य-ज्ञान केवाईसी पासपोर्ट स्वचालित रूप से उत्पन्न होगा।'
                    : 'A tamper-proof Zero-Knowledge KYC Passport credential will be automatically generated upon creation.'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  {isTamil ? 'ரத்து செய்' : isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <span>{isTamil ? 'உருவாக்குகிறது...' : isHindi ? 'बनाया जा रहा है...' : 'Creating Sovereign Account...'}</span>
                  ) : (
                    <>
                      <span>{isTamil ? 'கணக்கை உருவாக்கு' : isHindi ? 'खाता बनाएं' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
