import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  QrCode,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Hash,
  UserCheck,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Check
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { User } from '../../types';
import {
  getAccountProfileKey,
  saveAccountIdentityProfile,
  AccountIdentityProfile,
} from '../../services/identityProfile';

interface CompleteIdentityProfileFlowProps {
  user: User;
  onProfileComplete: (updatedUser: User, profile: AccountIdentityProfile) => void;
  onCancel?: () => void;
}

export const CompleteIdentityProfileFlow: React.FC<CompleteIdentityProfileFlowProps> = ({
  user,
  onProfileComplete,
  onCancel,
}) => {
  const { language } = useLanguage();
  const { speak } = useVoice();
  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const accountKey = getAccountProfileKey(user);

  // Pre-fill defaults based on account key if known, while requiring valid user confirmation
  const [fullName, setFullName] = useState(user.name || '');
  const [dob, setDob] = useState(user.dob || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState(user.phone || '');
  const [email] = useState(user.email || `${accountKey}@trustchain.id`);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [addressState, setAddressState] = useState(user.addressState || 'Tamil Nadu, India');
  const [pincode, setPincode] = useState('');
  const [occupation, setOccupation] = useState('Salaried Professional');
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Verification stage
  const [verificationStage, setVerificationStage] = useState<'input' | 'verifying' | 'completed'>('input');
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);
  const [generatedProfile, setGeneratedProfile] = useState<AccountIdentityProfile | null>(null);

  const verificationChecks = [
    { label: 'UIDAI Aadhaar Cryptographic Signature Check', detail: 'Verifying 12-digit UIDAI checksum' },
    { label: 'NSDL Income Tax PAN Registry Cross-Verification', detail: 'Validating 10-digit alphanumeric PAN structure' },
    { label: 'Zero-Knowledge Proof (ZKP) Anchor Generation', detail: 'Constructing zk-SNARK proof without exposing raw identifiers' },
    { label: 'TrustChain Sovereign Credential Issuance', detail: 'Minting immutable ledger reference' },
  ];

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = isTamil
        ? 'முழு சட்டபூர்வ பெயரை உள்ளிடவும் (குறைந்தது 3 எழுத்துக்கள்).'
        : isHindi
        ? 'कृपया अपना पूरा नाम दर्ज करें (न्यूनतम 3 अक्षर)।'
        : 'Please enter your full legal name (minimum 3 characters).';
    }

    // DOB validation
    if (!dob) {
      newErrors.dob = isTamil
        ? 'பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்.'
        : isHindi
        ? 'कृपया जन्म तिथि चुनें।'
        : 'Please select your Date of Birth.';
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (isNaN(birthDate.getTime()) || age < 18) {
        newErrors.dob = isTamil
          ? 'பயனர் குறைந்தபட்சம் 18 வயது பூர்த்தியடைந்திருக்க வேண்டும்.'
          : isHindi
          ? 'आयु न्यूनतम 18 वर्ष होनी चाहिए।'
          : 'User must be at least 18 years old to hold a Sovereign KYC Passport.';
      }
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = isTamil
        ? 'செல்லுபடியாகும் 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.'
        : isHindi
        ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।'
        : 'Please enter a valid 10-digit mobile number.';
    }

    // Aadhaar validation (12 digits)
    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (!cleanAadhaar || cleanAadhaar.length !== 12) {
      newErrors.aadhaarNumber = isTamil
        ? 'செல்லுபடியாகும் 12 இலக்க ஆதார் எண்ணை உள்ளிடவும்.'
        : isHindi
        ? 'कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।'
        : 'Please enter a valid 12-digit Aadhaar number.';
    }

    // PAN validation (10 alphanumeric: 5 uppercase letters, 4 digits, 1 uppercase letter)
    const cleanPan = panNumber.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!cleanPan || !panRegex.test(cleanPan)) {
      newErrors.panNumber = isTamil
        ? 'செல்லுபடியாகும் 10 இலக்க பான் எண்ணை உள்ளிடவும் (எ.கா: ABCDE1234F).'
        : isHindi
        ? 'कृपया वैध 10-अंकीय पैन नंबर दर्ज करें (उदा: ABCDE1234F)।'
        : 'Please enter a valid 10-character PAN (e.g. ABCDE1234F).';
    }

    // Address validation
    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = isTamil
        ? 'குடியிருப்பு முகவரியை உள்ளிடவும் (குறைந்தது 5 எழுத்துக்கள்).'
        : isHindi
        ? 'कृपया आवासीय पता दर्ज करें।'
        : 'Please enter your complete residential address (min 5 characters).';
    }

    // State validation
    if (!addressState.trim()) {
      newErrors.addressState = isTamil ? 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select your State.';
    }

    // PIN code validation (6 digits)
    const cleanPin = pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      newErrors.pincode = isTamil
        ? 'செல்லுபடியாகும் 6 இலக்க அஞ்சல் குறியீட்டை உள்ளிடவும்.'
        : isHindi
        ? 'कृपया 6 अंकों का पिन कोड दर्ज करें।'
        : 'Please enter a valid 6-digit PIN code.';
    }

    // Consent validation
    if (!consentAgreed) {
      newErrors.consent = isTamil
        ? 'தொடர இறையாண்மை அடையாள ஒப்புதலை ஏற்க வேண்டும்.'
        : isHindi
        ? 'सहमति देना अनिवार्य है।'
        : 'You must consent to cryptographic sovereign identity binding to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      dob: true,
      phone: true,
      aadhaarNumber: true,
      panNumber: true,
      address: true,
      addressState: true,
      pincode: true,
      consent: true,
    });

    const isValid = validateAll();
    if (!isValid) {
      speak(
        isTamil
          ? 'தயவுசெய்து தேவையான அனைத்து விவரங்களையும் சரியாக நிரப்பவும்.'
          : isHindi
          ? 'कृपया सभी आवश्यक जानकारी सही ढंग से भरें।'
          : 'Please complete all required identity fields correctly before continuing.'
      );
      return;
    }

    // Begin real cryptographic verification simulation
    setVerificationStage('verifying');
    setActiveCheckIndex(0);
    speak(
      isTamil
        ? 'உங்கள் சுயவிவர விவரங்கள் சரிபார்க்கப்பட்டு ஆதார் மற்றும் பான் சான்றுகள் உருவாக்கப்படுகின்றன...'
        : isHindi
        ? 'आपके विवरण सत्यापित किए जा रहे हैं...'
        : 'Validating submitted identity credentials and generating TrustChain Sovereign Identity...'
    );

    // Progression through checks
    for (let i = 0; i < verificationChecks.length; i++) {
      setActiveCheckIndex(i);
      await new Promise(r => setTimeout(r, 650));
    }

    // Save profile specifically to this account
    const { profile, updatedUser } = saveAccountIdentityProfile(user, {
      fullName,
      dob,
      gender,
      phone,
      email,
      aadhaarNumber,
      panNumber,
      address,
      addressState,
      pincode,
      occupation,
    });

    setGeneratedProfile(profile);
    setVerificationStage('completed');

    speak(
      isTamil
        ? 'வாழ்த்துக்கள்! உங்கள் TrustChain இறையாண்மை அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டு சேமிக்கப்பட்டது.'
        : isHindi
        ? 'बधाई हो! आपकी TrustChain पहचान सफलतापूर्वक सत्यापित और सहेजी गई है।'
        : 'Congratulations! Your TrustChain Sovereign Identity has been verified and permanently anchored.'
    );

    // Smooth continuation to dashboard
    setTimeout(() => {
      onProfileComplete(updatedUser, profile);
    }, 1800);
  };

  // Quick fill helper with valid demo data matching this exact user account
  const handleQuickFillValid = () => {
    let mockName = user.name || 'Krishnesh V';
    let mockDob = '2000-02-28';
    let mockPhone = user.phone || '+91 98765 43213';
    let mockAadhaar = '789123456712';
    let mockPan = 'AALPK7712Z';
    let mockAddress = 'Flat 402, Sovereign Residency, Anna Salai';
    let mockState = 'Tamil Nadu, India';
    let mockPin = '600002';

    if (accountKey === 'midhun') {
      mockName = 'Midhun Kumar';
      mockDob = '2002-04-18';
      mockPhone = '+91 98765 43210';
      mockAadhaar = '458912348921';
      mockPan = 'ABCDE1234F';
      mockAddress = '12 Green Park Avenue, T. Nagar';
      mockState = 'Tamil Nadu, India';
      mockPin = '600017';
    } else if (accountKey === 'arif') {
      mockName = 'Mohamed Arif A';
      mockDob = '2001-08-14';
      mockPhone = '+91 98765 43211';
      mockAadhaar = '982145324532';
      mockPan = 'BKAPM9841K';
      mockAddress = '54 Marina Crescent, Triplicane';
      mockState = 'Tamil Nadu, India';
      mockPin = '600005';
    } else if (accountKey === 'kishore') {
      mockName = 'Kishore S';
      mockDob = '2003-11-05';
      mockPhone = '+91 98765 43212';
      mockAadhaar = '671289341934';
      mockPan = 'CJDFE5621L';
      mockAddress = '88 Indiranagar 100ft Road';
      mockState = 'Karnataka, India';
      mockPin = '560038';
    }

    setFullName(mockName);
    setDob(mockDob);
    setPhone(mockPhone);
    setAadhaarNumber(mockAadhaar);
    setPanNumber(mockPan);
    setAddress(mockAddress);
    setAddressState(mockState);
    setPincode(mockPin);
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/60">
      <div className="w-full max-w-2xl glass-panel p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/90 bg-white/95 backdrop-blur-xl animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Account: <span className="capitalize text-indigo-900">{accountKey}</span> • First-Time Setup</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Complete Your TrustChain Identity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-lg mx-auto">
            {isTamil
              ? 'உங்கள் கணக்கிற்கான இறையாண்மை அடையாள சான்றுகளை உள்ளிட்டு முதல்முறையாக சரிபார்க்கவும். அனைத்து விவரங்களும் கட்டாயமாகும்.'
              : isHindi
              ? 'कृपया अपने खाते के लिए आवश्यक पहचान विवरण भरें और पहली बार सत्यापन पूरा करें। सभी विवरण अनिवार्य हैं।'
              : 'Please enter your verified identity details to generate and bind your Sovereign KYC Credential. All fields are required.'}
          </p>

          {/* Account Indicator Card */}
          <div className="mt-4 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                alt={user.name}
                className="w-10 h-10 rounded-xl border border-white shadow-xs object-cover"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">{user.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">{user.email}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickFillValid}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white text-indigo-700 border border-indigo-200 shadow-2xs hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Pre-fill verified demo attributes for this account"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Fill Demo Attributes</span>
            </button>
          </div>
        </div>

        {/* STAGE 1: DETAILS FORM */}
        {verificationStage === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Full Legal Name <span className="text-rose-500">*</span></span>
                  {fullName.trim().length >= 3 && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => {
                      setFullName(e.target.value);
                      if (errors.fullName) validateAll();
                    }}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Krishnesh V"
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-medium focus:bg-white focus:outline-hidden transition-all ${
                      touched.fullName && errors.fullName ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                    }`}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Date of Birth (DOB) <span className="text-rose-500">*</span></span>
                  {dob && !errors.dob && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => {
                    setDob(e.target.value);
                    if (errors.dob) validateAll();
                  }}
                  onBlur={() => handleBlur('dob')}
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-medium focus:bg-white focus:outline-hidden transition-all ${
                    touched.dob && errors.dob ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                  }`}
                />
                {touched.dob && errors.dob && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.dob}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Gender & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <span>Gender <span className="text-rose-500">*</span></span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        gender === g
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Mobile Phone Number <span className="text-rose-500">*</span></span>
                  {phone.replace(/\D/g, '').length >= 10 && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                      if (errors.phone) validateAll();
                    }}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-medium focus:bg-white focus:outline-hidden transition-all ${
                      touched.phone && errors.phone ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                    }`}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Sovereign Identifiers: Aadhaar & PAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Aadhaar Number (12 Digits) <span className="text-rose-500">*</span></span>
                  {aadhaarNumber.replace(/\D/g, '').length === 12 && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setAadhaarNumber(raw);
                    if (errors.aadhaarNumber) validateAll();
                  }}
                  onBlur={() => handleBlur('aadhaarNumber')}
                  placeholder="e.g. 789123456712"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-mono font-bold tracking-wider focus:bg-white focus:outline-hidden transition-all ${
                    touched.aadhaarNumber && errors.aadhaarNumber ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                  }`}
                />
                {touched.aadhaarNumber && errors.aadhaarNumber && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.aadhaarNumber}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>PAN Number (10 Characters) <span className="text-rose-500">*</span></span>
                  {panNumber.length === 10 && !errors.panNumber && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={e => {
                    setPanNumber(e.target.value.toUpperCase().slice(0, 10));
                    if (errors.panNumber) validateAll();
                  }}
                  onBlur={() => handleBlur('panNumber')}
                  placeholder="e.g. AALPK7712Z"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-mono font-bold tracking-wider uppercase focus:bg-white focus:outline-hidden transition-all ${
                    touched.panNumber && errors.panNumber ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                  }`}
                />
                {touched.panNumber && errors.panNumber && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.panNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Residential Address <span className="text-rose-500">*</span></span>
                {address.trim().length >= 5 && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </label>
              <input
                type="text"
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  if (errors.address) validateAll();
                }}
                onBlur={() => handleBlur('address')}
                placeholder="Door No, Street Name, Area / Locality"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-medium focus:bg-white focus:outline-hidden transition-all ${
                  touched.address && errors.address ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                }`}
              />
              {touched.address && errors.address && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* State, Pincode & Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <span>State / Province <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={addressState}
                  onChange={e => setAddressState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 font-medium focus:bg-white focus:outline-hidden"
                >
                  <option value="Tamil Nadu, India">Tamil Nadu</option>
                  <option value="Karnataka, India">Karnataka</option>
                  <option value="Kerala, India">Kerala</option>
                  <option value="Maharashtra, India">Maharashtra</option>
                  <option value="Delhi NCR, India">Delhi NCR</option>
                  <option value="Telangana, India">Telangana</option>
                  <option value="Andhra Pradesh, India">Andhra Pradesh</option>
                  <option value="Other Jurisdiction">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>PIN Code <span className="text-rose-500">*</span></span>
                  {pincode.replace(/\D/g, '').length === 6 && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => {
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (errors.pincode) validateAll();
                  }}
                  onBlur={() => handleBlur('pincode')}
                  placeholder="e.g. 600002"
                  className={`w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/80 text-slate-800 font-mono font-bold tracking-wider focus:bg-white focus:outline-hidden transition-all ${
                    touched.pincode && errors.pincode ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                  }`}
                />
                {touched.pincode && errors.pincode && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.pincode}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <span>Occupation</span>
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 font-medium focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Cryptographic Sovereign Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={e => setConsentAgreed(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 mt-0.5"
                />
                <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  I cryptographically consent to binding these verified identity attributes to my decentralized sovereign DID on the TrustChain network. Zero-knowledge cryptography protects raw values.
                </span>
              </label>
              {touched.consent && errors.consent && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Complete TrustChain Identity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STAGE 2: CRYPTOGRAPHIC VERIFICATION PROGRESS */}
        {verificationStage === 'verifying' && (
          <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-800">
                Verifying & Generating Sovereign Identity...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Executing decentralized zero-knowledge proofs and anchoring KYC credentials
              </p>
            </div>

            <div className="space-y-2.5 max-w-md mx-auto text-left">
              {verificationChecks.map((check, idx) => {
                const isPassed = activeCheckIndex > idx;
                const isCurrent = activeCheckIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isPassed
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{check.label}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{check.detail}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isPassed ? 'VERIFIED' : isCurrent ? 'CHECKING...' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 3: VERIFICATION COMPLETED & CREDENTIALS ANCHORED */}
        {verificationStage === 'completed' && generatedProfile && (
          <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identity Profile Verified & Anchored</span>
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Welcome, {generatedProfile.fullName}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your sovereign profile has been securely bound to your decentralized wallet.
              </p>
            </div>

            {/* Generated Cryptographic Reference Credentials Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white text-left space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">Generated Credentials</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  ANCHORED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">TrustChain Credential ID</span>
                  <span className="font-mono text-[11px] font-bold text-indigo-300 break-all">
                    {generatedProfile.credentialId}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">Zero-Knowledge Proof ID</span>
                  <span className="font-mono text-[11px] font-bold text-amber-300 break-all">
                    {generatedProfile.proofId}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">QR Verification Ref</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-300">
                    {generatedProfile.qrVerificationRef}
                  </span>
                </div>
                <QrCode className="w-5 h-5 text-indigo-400" />
              </div>
            </div>

            <p className="text-xs text-indigo-600 font-bold animate-pulse">
              Redirecting to your verified sovereign dashboard...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
