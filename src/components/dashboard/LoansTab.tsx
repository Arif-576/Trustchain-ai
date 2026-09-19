import React, { useState } from 'react';
import {
  Banknote,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { LoanProduct } from '../../types';

interface LoansTabProps {
  loans?: LoanProduct[];
  onLoanApplied: () => void;
}

export const LoansTab: React.FC<LoansTabProps> = ({ loans = [], onLoanApplied }) => {
  const { t } = useLanguage();
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<any>(null);

  const safeLoans = Array.isArray(loans) ? loans : [];

  const handleApply = async (loan: LoanProduct) => {
    setApplyingId(loan.id);
    try {
      // Simulate fast ZKP credential submission
      await new Promise((r) => setTimeout(r, 800));
      const res = await api.applyLoan(loan.id);
      setSuccessModal({
        productName: loan.name || loan.title || 'Credit Facility',
        amount: loan.maxAmount || loan.amount || '₹ 5,00,000',
        interestRate: loan.interestRate,
        proofHash: res.proofHash,
      });
      onLoanApplied();
    } catch (err) {
      console.error('Failed to apply for loan:', err);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('loansTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('loansSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Loans Grid */}
      {safeLoans.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/90 bg-white/85 shadow-sm space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Loan Facilities Available
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Pre-approved credit and loan facilities will appear here once verified against your sovereign identity profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeLoans.map((loan) => (
            <div
              key={loan.id}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/80 bg-white/85 shadow-lg flex flex-col justify-between space-y-5 hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
                    {loan.category || loan.loanType || 'Credit'}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {loan.instantPreApproved || loan.status === 'eligible' ? 'Pre-Approved' : 'Available'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mt-3">
                  {loan.name || loan.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {loan.description || `Required proof: ${loan.requiredProof || 'ZKP KYC'}`}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Max Facility
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {loan.maxAmount || loan.amount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Interest Rate
                    </span>
                    <span className="font-extrabold text-indigo-600 text-sm">
                      {loan.interestRate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleApply(loan)}
                  disabled={applyingId === loan.id}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {applyingId === loan.id ? 'Anchoring ZKP Verification...' : t('oneClickApply')}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Loan Facility Pre-Approved!
            </h3>
            <p className="text-xs text-slate-600">
              Your application for <strong>{successModal.productName}</strong> ({successModal.amount} at {successModal.interestRate}) was verified instantly using your reusable SSI KYC Passport. Zero physical documents or paperwork required.
            </p>
            <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[10px] rounded-xl truncate text-left">
              Proof Anchor: {successModal.proofHash}
            </div>
            <button
              onClick={() => setSuccessModal(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Continue to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
