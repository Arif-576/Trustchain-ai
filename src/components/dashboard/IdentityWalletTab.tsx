import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Calendar,
  Building,
  Eye,
  EyeOff,
  CheckCircle,
  Lock,
  Sparkles,
  Fingerprint,
  FileCheck,
  ExternalLink,
  PlusCircle,
  Volume2,
  Cpu,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useVoice } from '../../voice/VoiceContext';
import { useEasyMode } from '../../context/EasyModeContext';
import { api } from '../../services/api';
import { User, Credential, BiometricPasskey } from '../../types';
import { BiometricFingerprintModal } from '../verification/BiometricFingerprintModal';

interface IdentityWalletTabProps {
  user: User;
  credentials: Credential[];
  onGenerateProofClick: () => void;
}

export const IdentityWalletTab: React.FC<IdentityWalletTabProps> = ({
  user,
  credentials,
  onGenerateProofClick,
}) => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const { isEasyMode } = useEasyMode();
  const [showRawData, setShowRawData] = useState(false);
  const [passkeys, setPasskeys] = useState<BiometricPasskey[]>([]);
  const [loadingPasskeys, setLoadingPasskeys] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricModalMode, setBiometricModalMode] = useState<'test' | 'enroll'>('test');

  const primaryCred = credentials[0];

  const fetchPasskeys = async () => {
    try {
      setLoadingPasskeys(true);
      const res = await api.getPasskeys();
      if (res && Array.isArray(res.passkeys)) {
        setPasskeys(res.passkeys);
      } else {
        setPasskeys([]);
      }
    } catch (e) {
      console.warn('Could not fetch passkeys:', e);
      setPasskeys([]);
    } finally {
      setLoadingPasskeys(false);
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  const handleEnrollPasskey = () => {
    setBiometricModalMode('enroll');
    setIsBiometricModalOpen(true);
  };

  const handleTestPasskey = () => {
    setBiometricModalMode('test');
    setIsBiometricModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Sovereign Status */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t('valid')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sovereign SSI Credential ID: <span className="font-mono text-slate-700 font-semibold">{primaryCred?.id || 'cred-ssi-8904'}</span>
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                {t('selectiveDisclosureActive')} - {t('selectiveDisclosureDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGenerateProofClick}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t('zkProofTitle')}
            </button>
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showRawData ? t('hideFullData') : t('viewFullData')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Credential Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Verifiable Claims (Proof View) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Cryptographic Verifiable Claims
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Zero-Knowledge Ready
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  18+
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {t('ageEligibilityClaim')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Predicate verified cryptographically. Raw DOB remains hidden.
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg shadow-2xs border border-slate-100">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  ID
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {t('identityClaim')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    UIDAI e-Sign Hash & Biometric Enclave Match
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg shadow-2xs border border-slate-100">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  LOC
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {t('addressClaim')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    State & Postal Jurisdiction Verified
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg shadow-2xs border border-slate-100">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Credential Authority & Metadata */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Issuer & Trust Registry
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              W3C DID/VC
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('issuer')}:</span>
              <span className="font-semibold text-slate-800 text-right max-w-[220px]">
                {primaryCred?.issuer || 'TrustChain Sovereign Authority'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('issueDate')}:</span>
              <span className="font-mono font-semibold text-slate-700">
                {primaryCred?.issueDate || '2026-01-10'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('validUntil')}:</span>
              <span className="font-mono font-semibold text-slate-700">
                {primaryCred?.expiryDate || '2029-01-10'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Root Credential Hash:</span>
              <span className="font-mono text-[10px] text-indigo-600 truncate max-w-[180px]">
                {primaryCred?.credentialHash || '0x9a84f18b48...'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Ledger Anchor Tx:</span>
              <span className="font-mono text-[10px] text-indigo-600 truncate max-w-[180px]">
                {primaryCred?.txHash || '0x4892c90e1...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Data Section (Redacted by default, only shown if explicitly toggled) */}
      {showRawData && (
        <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Raw Sensitive Identifiers (Confidential Device Enclave View)
              </h4>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              NEVER EXPOSED TO VERIFIERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Email Address</span>
              <span className="font-semibold text-slate-800 truncate block">{user.email}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Phone Number</span>
              <span className="font-semibold text-slate-800">{user.phone}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Date of Birth (Unredacted)</span>
              <span className="font-semibold text-slate-800">{user.dob}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">Masked Govt ID</span>
              <span className="font-semibold font-mono text-slate-800">{user.aadhaarMasked}</span>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Passkeys & Blockchain Enclave Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Biometric Passkeys & Blockchain Enclave
                </h3>
                <button
                  type="button"
                  onClick={() => speak('உங்கள் கணினி அல்லது போனில் உள்ள கைரேகை மூலம் கடவுச்சொல் இல்லாமல் உள்நுழைய இந்த பாஸ்கீ பயன்படுகிறது. உங்கள் கைரேகை உங்கள் போனை விட்டு வெளியே போகாது.')}
                  title="Listen explanation aloud"
                  className="p-1 rounded-full hover:bg-indigo-50 text-indigo-600 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Hardware FIDO2 WebAuthn credentials anchored cryptographically on the TrustChain sovereign ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestPasskey}
              className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Test Biometric</span>
            </button>

            <button
              onClick={handleEnrollPasskey}
              disabled={isEnrolling}
              className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isEnrolling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{isEnrolling ? 'Enrolling...' : '+ Create New Passkey'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Status or Feedback */}
        {enrollStatus && (
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2 animate-in fade-in">
            <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0 animate-spin" />
            <span className="font-medium">{enrollStatus}</span>
          </div>
        )}

        {testResult && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 animate-in fade-in ${
            testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="font-medium">{testResult.message}</span>
          </div>
        )}

        {/* Enrolled Passkeys List */}
        <div className="space-y-3">
          {loadingPasskeys ? (
            <div className="text-center py-6 text-xs text-slate-400">Loading enrolled passkeys...</div>
          ) : passkeys.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <Key className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">No hardware passkeys enrolled yet.</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Click "+ Create New Passkey" above to enroll Touch ID, Windows Hello, or your device’s security chip.
              </p>
            </div>
          ) : (
            (Array.isArray(passkeys) ? passkeys : []).map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
                    <Fingerprint className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{p.deviceName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ACTIVE
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-medium">
                        Block #{p.blockNumber}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-500 font-mono">
                      <span>Public Hash: <strong className="text-slate-700">{p.publicKeyHash.substring(0, 16)}...</strong></span>
                      <span>Tx: <strong className="text-indigo-600">{p.txHash.substring(0, 14)}...</strong></span>
                      <span>Created: {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    <CheckCircle className="w-3 h-3" />
                    Enclave Protected
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Interactive Biometric Fingerprint Scanner Modal */}
      <BiometricFingerprintModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        mode={biometricModalMode}
        user={user}
        onSuccess={() => {
          fetchPasskeys();
        }}
      />
    </div>
  );
};
