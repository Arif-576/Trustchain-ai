import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Lock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { ZKProof, User } from '../../types';

interface ZKProofTabProps {
  user: User;
  onProofGenerated?: (proof: ZKProof) => void;
}

export const ZKProofTab: React.FC<ZKProofTabProps> = ({ user, onProofGenerated }) => {
  const { t } = useLanguage();
  const [claimType, setClaimType] = useState('age_over_18');
  const [verifier, setVerifier] = useState('HDFC Bank Ltd. (Identity Verification Desk)');
  const [loading, setLoading] = useState(false);
  const [generatedProof, setGeneratedProof] = useState<ZKProof | null>(null);
  const [copied, setCopied] = useState(false);

  const claims = [
    {
      id: 'age_over_18',
      title: t('claimAgeOver18'),
      predicate: 'Predicate: age >= 18',
      confidential: 'Date of Birth (DOB) NOT REVEALED',
    },
    {
      id: 'identity_verified',
      title: 'Prove Identity Authentication (Aadhaar & PAN raw digits confidential)',
      predicate: 'Predicate: kycStatus == "verified"',
      confidential: 'Full Government ID Numbers NOT REVEALED',
    },
    {
      id: 'residency_state',
      title: t('claimResidentState'),
      predicate: 'Predicate: state == "Tamil Nadu"',
      confidential: 'Street Address & Postal Coordinates NOT REVEALED',
    },
    {
      id: 'income_eligible',
      title: t('claimIncomeEligible'),
      predicate: 'Predicate: tier_rating == "Grade_A"',
      confidential: 'Monthly Paycheck & Bank Balance NOT REVEALED',
    },
  ];

  const handleGenerateProof = async () => {
    setLoading(true);
    setGeneratedProof(null);

    try {
      // Simulate slight cryptographic SNARK generation animation
      await new Promise((r) => setTimeout(r, 900));
      const proof = await api.generateProof(claimType, verifier);
      setGeneratedProof(proof);
      if (onProofGenerated) onProofGenerated(proof);
    } catch (err) {
      console.error('Failed to generate proof', err);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('zkProofTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('zkProofTagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form & Proof Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Claim Selection */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            {t('selectProofClaim')}
          </h3>

          <div className="space-y-2.5">
            {claims.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setClaimType(c.id)}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  claimType === c.id
                    ? 'bg-indigo-50/80 border-indigo-400 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">
                    {c.title}
                  </span>
                  {claimType === c.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono text-slate-500 font-medium">
                    {c.predicate}
                  </span>
                  <span className="text-indigo-600 font-bold bg-indigo-100/60 px-2 py-0.5 rounded-md">
                    {c.confidential}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Designated Verifier (Relying Party)
            </label>
            <input
              type="text"
              value={verifier}
              onChange={(e) => setVerifier(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <button
            id="generate-zkp-btn"
            onClick={handleGenerateProof}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Computing zk-SNARK Commitment...' : t('generateProofBtn')}
          </button>
        </div>

        {/* Right: Cryptographic Proof Output */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-sm">
                {t('proofResultTitle')}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                zk-SNARK Validated
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
                <p className="text-xs font-semibold text-slate-600">
                  Generating zero-knowledge circuit proof without revealing raw records...
                </p>
              </div>
            ) : generatedProof ? (
              <div className="space-y-4 animate-in zoom-in-95">
                {/* Fact banner */}
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      {t('verifiedFact')}: True (Valid Credential)
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">
                      {generatedProof.requirement}
                    </span>
                  </div>
                </div>

                {/* Confidentiality Notice */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-900">
                  <EyeOff className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold">
                    {t('rawDobConfidential')}
                  </span>
                </div>

                {/* Technical Cryptographic Data */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 overflow-hidden shadow-inner">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1">
                    <span>{t('proofHash')}:</span>
                    <button
                      onClick={() => copyHash(generatedProof.proofHash)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-indigo-300 truncate font-bold">
                    {generatedProof.proofHash}
                  </div>

                  <div className="text-slate-400 pt-1 border-t border-slate-800">
                    Blockchain Transaction Anchor:
                  </div>
                  <div className="text-emerald-400 truncate">
                    {generatedProof.txHash}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Block: #{generatedProof.blockNumber}</span>
                    <span>Verifier: {generatedProof.verifier}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-xs">
                  Select a claim and click "Generate Cryptographic Proof" above.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Cryptographic Standard: Groth16 / Plonk ZKP</span>
            <span className="text-indigo-600 font-semibold">Zero-Knowledge Enclave</span>
          </div>
        </div>
      </div>
    </div>
  );
};
