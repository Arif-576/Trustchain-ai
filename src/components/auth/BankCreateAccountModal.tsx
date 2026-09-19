import React, { useState } from 'react';
import {
  X,
  Building2,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Fingerprint,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { api } from '../../services/api';
import { BankStaff } from '../../types';

interface BankCreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (staff: BankStaff) => void;
}

const INSTITUTIONS = [
  { id: 'BANK-HDFC-901', name: 'HDFC Trust Banking & Credit' },
  { id: 'BANK-SBI-204', name: 'State Bank of India (SBI)' },
  { id: 'BANK-ICICI-505', name: 'ICICI Commercial Trust Banking' },
  { id: 'BANK-AXIS-301', name: 'Axis Bank Institutional Services' },
  { id: 'BANK-PNB-108', name: 'Punjab National Bank (PNB)' },
  { id: 'BANK-CANARA-702', name: 'Canara Bank Institutional Hub' },
];

export const BankCreateAccountModal: React.FC<BankCreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const { speak } = useVoice();
  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const [selectedBankId, setSelectedBankId] = useState(INSTITUTIONS[0].id);
  const [bankName, setBankName] = useState(INSTITUTIONS[0].name);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Senior Credit & Verification Manager');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bId = e.target.value;
    setSelectedBankId(bId);
    const found = INSTITUTIONS.find(i => i.id === bId);
    if (found) {
      setBankName(found.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 3) {
      setError('Please provide your full legal name (minimum 3 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return;
    }
    if (!employeeId.trim()) {
      setError('Please enter your Employee / Staff ID (e.g. EMP-5102).');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.bankRegister({
        name: name.trim(),
        email: email.trim(),
        bankId: selectedBankId,
        bankName: bankName,
        employeeId: employeeId.trim().toUpperCase(),
        designation: designation.trim(),
        password,
      });

      localStorage.setItem('trustchain_staff', JSON.stringify(res.staff));
      localStorage.setItem('trustchain_staff_token', res.token);

      speak(
        isTamil
          ? `வணக்கம் ${res.staff.name}, புதிய வங்கி கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.`
          : isHindi
          ? `नमस्ते ${res.staff.name}, आपका बैंक खाता सफलतापूर्वक बनाया गया है।`
          : `Institutional account successfully created for ${res.staff.name}.`
      );

      onSuccess(res.staff);
    } catch (err: any) {
      setError(err.message || 'Failed to create institutional bank staff account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                {isTamil ? 'புதிய வங்கி பணியாளர் கணக்கை உருவாக்கவும்' : isHindi ? 'नया बैंक कर्मचारी खाता बनाएं' : 'Create Bank Staff Account'}
              </h3>
              <p className="text-xs text-slate-500">
                Institutional Officer Registration & RBAC Access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Institution Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Financial Institution / Bank
              </label>
              <select
                value={selectedBankId}
                onChange={handleBankSelect}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                {INSTITUTIONS.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Officer Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Officer Full Name
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@bank-identity.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employee ID & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-5102"
                  className="w-full px-3 py-2 text-xs font-mono uppercase font-bold rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Designation / Role
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Senior Credit & Verification Manager">Senior Credit & Verification Manager</option>
                  <option value="Lead Compliance & ZKP Officer">Lead Compliance & ZKP Officer</option>
                  <option value="Chief Verification Officer & Bank Manager">Chief Verification Officer & Bank Manager</option>
                  <option value="Auditor & Sovereign Lending Specialist">Auditor & Sovereign Lending Specialist</option>
                  <option value="Branch Operations Head">Branch Operations Head</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-purple-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Regulatory compliance badge */}
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
                Institutional registration links your cryptographic officer key directly to the bank's RBI regulatory node on TrustChain.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-200 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Registering Institutional Account...</span>
              ) : (
                <>
                  <span>Create Account & Sign In to Bank Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
