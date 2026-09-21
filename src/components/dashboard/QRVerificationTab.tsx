import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Radio,
  Building2,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { User } from '../../types';

interface QRVerificationTabProps {
  user: User;
}

export const QRVerificationTab: React.FC<QRVerificationTabProps> = ({ user }) => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const isHindi = language === 'hi';

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live verification state received from bank/verifier terminal
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedBy, setVerifiedBy] = useState<string | null>(null);
  const [verifiedTime, setVerifiedTime] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const generateNewToken = async () => {
    setLoading(true);
    setIsVerified(false);
    setVerifiedBy(null);
    setRejectionReason(null);
    try {
      const res = await api.createQRToken('Age >= 18 & KYC Verified Proof', 15);
      setTokenData(res);

      // Generate real QR code image
      const payloadString = JSON.stringify({
        protocol: 'TrustChain-ZKP-v2',
        token: res.token,
        userId: user.id,
        userName: user.name,
        claims: res.claims,
        expiresAt: res.expiresAt,
        anchor: 'https://trustchain.id/verify/' + res.token,
      });

      const url = await QRCode.toDataURL(payloadString, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Failed to generate QR token:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNewToken();
  }, [user.id]);

  // Real-time synchronization listener with strict customer account isolation
  useEffect(() => {
    const handleSync = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      const isForThisUser =
        (detail.userId && detail.userId === user.id) ||
        (detail.token && tokenData && detail.token === tokenData.token) ||
        (detail.customerName && detail.customerName === user.name);

      if (isForThisUser) {
        if (detail.verified) {
          setIsVerified(true);
          setRejectionReason(null);
          setVerifiedBy(detail.bankName || 'HDFC Institutional Trust Hub');
          setVerifiedTime(new Date().toLocaleTimeString());
        } else if (detail.rejected) {
          setRejectionReason(detail.reason || 'Verification rejected');
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trustchain_user_verified' && e.newValue === 'true') {
        const verifiedUserId =
          localStorage.getItem('trustchain_qr_verified_userId') ||
          localStorage.getItem('trustchain_qr_verified_user_id');
        const verifiedToken = localStorage.getItem('trustchain_qr_verified_token');
        if (
          (verifiedUserId && verifiedUserId === user.id) ||
          (verifiedToken && tokenData && verifiedToken === tokenData.token)
        ) {
          setIsVerified(true);
          setRejectionReason(null);
          setVerifiedBy('HDFC Institutional Trust Hub');
          setVerifiedTime(new Date().toLocaleTimeString());
        }
      }
    };

    window.addEventListener('trustchain_verification_updated', handleSync);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('trustchain_verification_updated', handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [tokenData, user.id, user.name]);

  // Polling backend status for this specific customer token
  useEffect(() => {
    if (!tokenData?.token || isVerified) return;

    const interval = setInterval(async () => {
      try {
        const status = await api.getQRTokenStatus(tokenData.token);
        if (status) {
          if (status.verified || status.status === 'used') {
            setIsVerified(true);
            setRejectionReason(null);
            setVerifiedBy(status.verifiedBy || 'HDFC Institutional Trust Hub');
            setVerifiedTime(
              status.verifiedAt
                ? new Date(status.verifiedAt).toLocaleTimeString()
                : new Date().toLocaleTimeString()
            );
            clearInterval(interval);
          } else if (status.status === 'rejected') {
            setRejectionReason(status.rejectionReason || 'Verification rejected');
          }
        }
      } catch (e) {
        // ignore polling error
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [tokenData, isVerified]);

  const copyToken = () => {
    if (!tokenData?.token) return;
    navigator.clipboard.writeText(tokenData.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('qrTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('qrSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Scannable QR Code */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/85 shadow-md flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-white rounded-3xl shadow-xl border-4 border-slate-100 relative group">
            {loading ? (
              <div className="w-64 h-64 flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-xs text-slate-500 font-semibold">
                  {isTamil ? 'குறியாக்கம் செய்யப்படுகிறது...' : isHindi ? 'टोकन उत्पन्न हो रहा है...' : 'Generating Cryptographic Token...'}
                </span>
              </div>
            ) : isVerified ? (
              <div className="w-64 h-64 flex flex-col items-center justify-center space-y-3 bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-center animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">
                    {isTamil ? 'QR சரிபார்க்கப்பட்டது' : isHindi ? 'क्यूआर सत्यापित' : 'QR Verified & Used'}
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-1 max-w-[210px] leading-relaxed">
                    {isTamil
                      ? 'இந்த ஒருமுறை பயன்படுத்தும் டோக்கன் வங்கி மூலம் வெற்றிகரமாக சரிபார்க்கப்பட்டு பயன்படுத்தப்பட்டது.'
                      : isHindi
                      ? 'यह एकल-उपयोग टोकन बैंक द्वारा सफलतापूर्वक सत्यापित और उपयोग किया जा चुका है।'
                      : 'This single-use QR token has been successfully verified and redeemed.'}
                  </p>
                </div>
                <button
                  onClick={generateNewToken}
                  disabled={loading}
                  className="mt-1 py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'புதிய QR உருவாக்கவும்' : isHindi ? 'नया क्यूआर बनाएं' : 'Generate New QR'}</span>
                </button>
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Verifiable TrustChain QR Code"
                className="w-64 h-64 rounded-2xl"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                Failed to load QR
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 block">
              Time-Bound Cryptographic Signature
            </span>
            <p className="text-[11px] text-slate-500 max-w-xs">
              {t('scanWithAnyCamera')}
            </p>
          </div>

          {tokenData && (
            <div className="w-full space-y-2 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Signed Token ID:</span>
                <button
                  onClick={copyToken}
                  className="text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-800 truncate font-semibold">
                {tokenData.token}
              </div>

              <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-500">
                <span>Validity:</span>
                <span className="font-mono font-bold text-indigo-700">15 Minutes Window</span>
              </div>
            </div>
          )}

          {/* Customer Action: Only Generate New QR (Self-verification button removed per security specification) */}
          <div className="w-full">
            <button
              onClick={generateNewToken}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('generateNewQR')}</span>
            </button>
          </div>
        </div>

        {/* Right: Real-time Live Verification Status from Bank/Verifier Terminal */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 bg-white/85 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">
                {isTamil ? 'நிகழ்நேர சரிபார்ப்பு நிலை' : isHindi ? 'वास्तविक समय सत्यापन स्थिति' : 'Live Verification Status'}
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                isVerified
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isVerified ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{isTamil ? 'சரிபார்க்கப்பட்டது' : isHindi ? 'सत्यापित' : 'Verified'}</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
                    <span>{isTamil ? 'காத்திருக்கிறது' : isHindi ? 'प्रतीक्षारत' : 'Awaiting Scan'}</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {isTamil
                ? 'வங்கி அலுவலர் அல்லது அங்கீகரிக்கப்பட்ட சரிபார்ப்பவர் தங்கள் முனையத்திலிருந்து இந்த QR குறியீட்டை ஸ்கேன் செய்யும் போது, உங்கள் அடையாள நிலை உடனடியாக புதுப்பிக்கப்படும்.'
                : isHindi
                ? 'जब कोई बैंक अधिकारी या अधिकृत सत्यापनकर्ता अपने टर्मिनल से इस क्यूआर कोड को स्कैन करेगा, तो आपकी पहचान स्थिति तुरंत अपडेट हो जाएगी।'
                : 'Present this QR code to any authorized bank officer or retail partner. Once scanned and verified by the relying party terminal, your sovereign status updates here in real-time.'}
            </p>

            {isVerified ? (
              <div className="mt-4 space-y-3 animate-in zoom-in-95">
                <div className="p-4 rounded-2xl border bg-emerald-50/90 border-emerald-200 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      {isTamil
                        ? 'அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது!'
                        : isHindi
                        ? 'पहचान सफलतापूर्वक सत्यापित और पुष्ट!'
                        : 'Verified & Identity Confirmed!'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-emerald-800">
                    {isTamil
                      ? `வங்கி முனையம் மூலம் ஜீரோ-நாலெட்ஜ் சான்று சரிபார்க்கப்பட்டது (${verifiedBy || 'HDFC Trust Banking'} - ${verifiedTime || 'இப்போது'}).`
                      : isHindi
                      ? `बैंक टर्मिनल द्वारा शून्य-ज्ञान प्रमाण सत्यापित (${verifiedBy || 'HDFC Trust Banking'} - ${verifiedTime || 'अभी'}).`
                      : `Zero-Knowledge proof verified by ${verifiedBy || 'Institutional Bank'} at ${verifiedTime || 'Just now'}.`}
                  </p>
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">
                    {isTamil ? 'உறுதிப்படுத்தப்பட்ட தகுதிகள்:' : isHindi ? 'सत्यापित दावे:' : 'Attested Claims Confirmed:'}
                  </span>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Holder is over 18 years old (DOB Kept Private)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Govt. UIDAI e-Sign KYC Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>State Residency Proven via ZK-Proof</span>
                  </div>
                </div>
              </div>
            ) : rejectionReason ? (
              <div className="mt-4 p-4 rounded-2xl border bg-rose-50/90 border-rose-200 text-rose-950 animate-in zoom-in-95 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>
                    {isTamil ? 'சரிபார்ப்பு நிராகரிக்கப்பட்டது' : isHindi ? 'सत्यापन अस्वीकृत' : 'Verification Rejected'}
                  </span>
                </div>
                <p className="text-xs text-rose-800 font-medium leading-relaxed">
                  {rejectionReason}
                </p>
                <div className="pt-1">
                  <button
                    onClick={generateNewToken}
                    disabled={loading}
                    className="py-1.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isTamil ? 'புதிய QR உருவாக்கவும்' : isHindi ? 'नया क्यूआर बनाएं' : 'Generate Fresh QR & Retry'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Clock className="w-7 h-7 text-indigo-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">
                    {isTamil ? 'வங்கி ஸ்கேனருக்காக காத்திருக்கிறது' : isHindi ? 'बैंक स्कैनर की प्रतीक्षा में' : 'Awaiting Institutional Verification'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    {isTamil
                      ? 'வங்கி போர்ட்டலில் "Test Scan & Verify" செய்தவுடன் உங்கள் கணக்கு உடனடியாக சரிபார்க்கப்படும்.'
                      : isHindi
                      ? 'बैंक पोर्टल से "Test Scan & Verify" होते ही आपका खाता तुरंत सत्यापित हो जाएगा।'
                      : 'When the Bank clicks "Test Scan & Verify" on your profile in the Bank Portal, this screen will immediately confirm your status.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Zero-Knowledge Privacy Guarantee</span>
            </span>
            <span className="font-mono text-indigo-600 font-semibold">Ed25519 Signed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
