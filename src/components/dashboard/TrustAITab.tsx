import React, { useState } from 'react';
import { Bot, ShieldAlert, CheckCircle, AlertTriangle, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';

export const TrustAITab: React.FC = () => {
  const { t } = useLanguage();
  const [bankName, setBankName] = useState('HDFC Bank Ltd.');
  const [purpose, setPurpose] = useState('Personal Loan Eligibility');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    'KYC Verified Claim',
    'Age Above 18 (ZKP)',
  ]);
  const [analysis, setAnalysis] = useState<any>({
    riskScore: 18,
    riskLevel: 'LOW',
    recommendation: 'Safe to approve. Minimal disclosure required with Zero-Knowledge Proof.',
    flags: [],
    dataMinimizationScore: 95,
  });
  const [loading, setLoading] = useState(false);

  const availableAttributes = [
    'KYC Verified Claim',
    'Age Above 18 (ZKP)',
    'State Residency Claim',
    'Unredacted Date of Birth (Raw DOB)',
    'Full 12-Digit Raw Aadhaar Number',
    'Granular Home Street GPS Address',
  ];

  const toggleAttribute = (attr: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.request<any>('/api/trustai/analyze', {
        method: 'POST',
        body: JSON.stringify({
          bankName,
          purpose,
          requestedAttributes: selectedAttributes,
        }),
      });
      setAnalysis(res);
    } catch (e) {
      console.warn('TrustAI analysis failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('trustAIEngine')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('trustAIDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation & Analysis Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration / Request inspection */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Verification Request Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('requestingOrg')}
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full py-2 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('purpose')}
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full py-2 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('requestedFields')}
            </label>
            <div className="space-y-2">
              {availableAttributes.map((attr) => {
                const isSelected = selectedAttributes.includes(attr);
                const isSensitive = attr.includes('Raw') || attr.includes('Full') || attr.includes('GPS');
                return (
                  <button
                    key={attr}
                    type="button"
                    onClick={() => toggleAttribute(attr)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                      isSelected
                        ? isSensitive
                          ? 'bg-rose-50 border-rose-300 text-rose-800'
                          : 'bg-indigo-50 border-indigo-300 text-indigo-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{attr}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? isSensitive
                            ? 'bg-rose-200 text-rose-800'
                            : 'bg-indigo-200 text-indigo-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isSelected ? 'Included' : 'Omitted'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Evaluating Risk...' : 'Run TrustAI Analysis'}
          </button>
        </div>

        {/* Right: AI Risk Engine Output */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">
              {t('riskAssessment')}
            </h3>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                analysis.riskLevel === 'LOW'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : analysis.riskLevel === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {analysis.riskLevel} RISK ({analysis.riskScore}/100)
            </span>
          </div>

          {/* Recommendation card */}
          <div
            className={`p-4 rounded-2xl border ${
              analysis.riskLevel === 'LOW'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : analysis.riskLevel === 'MEDIUM'
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {analysis.riskLevel === 'LOW' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                  TrustAI Action Recommendation:
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {analysis.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Flags detected */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Privacy & Over-Collection Signals
            </h4>
            {analysis.flags && analysis.flags.length > 0 ? (
              <div className="space-y-2">
                {analysis.flags.map((flag: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Zero excessive personal data attributes requested. Standard zero-knowledge verification ready.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
