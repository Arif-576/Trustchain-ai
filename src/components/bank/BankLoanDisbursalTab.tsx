import React, { useState, useEffect } from 'react';
import {
  Banknote,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { BankDisbursalRecord } from '../../types';
import { useVoice } from '../../voice/VoiceContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const BankLoanDisbursalTab: React.FC = () => {
  const { t } = useLanguage();
  const [loans, setLoans] = useState<BankDisbursalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [disbursingId, setDisbursingId] = useState<string | null>(null);
  const [disbursalResult, setDisbursalResult] = useState<{
    loanId: string;
    txHash: string;
    customerName: string;
    amount: string;
  } | null>(null);
  const { speak } = useVoice();

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.getBankLoans();
      setLoans(res.disbursals || []);
    } catch (e) {
      console.warn('Failed to fetch bank loans:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDisburse = async (loanId: string, customerName: string, amount: string) => {
    setDisbursingId(loanId);
    setDisbursalResult(null);

    try {
      const res = await api.disburseBankLoan(loanId);
      setDisbursalResult({
        loanId,
        txHash: res.disbursal.txHash,
        customerName,
        amount,
      });

      speak(`Smart loan facility disbursed successfully on blockchain to ${customerName}`);
      await fetchLoans();
    } catch (err: any) {
      console.error('Disbursal failed:', err);
      alert(`Loan disbursal failed: ${err.message || 'Network error'}`);
    } finally {
      setDisbursingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Banknote className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black">{t('loanDisbursalBannerTitle')}</h2>
            </div>
            <p className="text-xs text-emerald-100 max-w-xl">
              {t('loanDisbursalBannerDesc')}
            </p>
          </div>

          <button
            onClick={fetchLoans}
            className="self-start md:self-auto py-2.5 px-4 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('refreshApplications')}</span>
          </button>
        </div>
      </div>

      {/* Disbursal Success Notification */}
      {disbursalResult && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-md space-y-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{t('disbursalSuccessTitle')}</span>
          </div>
          <p className="text-xs text-emerald-700">
            {disbursalResult.amount} {t('transferredToWallet')} ({disbursalResult.customerName})
          </p>
          <div className="font-mono text-[11px] text-emerald-800 bg-emerald-100/70 p-2.5 rounded-xl break-all">
            {t('txHashLabel')}: {disbursalResult.txHash}
          </div>
        </div>
      )}

      {/* Loans Grid / Table */}
      <div className="glass-panel rounded-3xl border border-white/80 bg-white/85 shadow-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            {t('verifiedPipeline')} ({loans.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {t('pendingDisbursals')}: {loans.filter(l => l.status === 'pending').length}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">{t('loadingLoanApps')}</div>
        ) : loans.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">{t('noLoanApps')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">{t('thApplicantId')}</th>
                  <th className="py-3.5 px-4">{t('thFacilityType')}</th>
                  <th className="py-3.5 px-4">{t('thSanctionedAmount')}</th>
                  <th className="py-3.5 px-4">{t('thStatus')}</th>
                  <th className="py-3.5 px-4">{t('thBlockchainTx')}</th>
                  <th className="py-3.5 px-4 text-right">{t('thAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loans.map((loan) => {
                  const isDisbursed = loan.status === 'disbursed';
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{loan.customerName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{loan.customerId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                          {loan.facility}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{t('approvedBy')}: {loan.officerName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-black text-slate-900">
                          {loan.amount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isDisbursed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t('disbursedStatus')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {t('pendingDisbursalStatus')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {loan.txHash ? (
                          <span className="font-mono text-[10px] text-indigo-600 block truncate max-w-[140px]" title={loan.txHash}>
                            {loan.txHash}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">{t('awaitingExecution')}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isDisbursed ? (
                          <span className="text-[11px] text-slate-400 font-medium">{t('settled')}</span>
                        ) : (
                          <button
                            onClick={() => handleDisburse(loan.loanId || loan.id, loan.customerName, loan.amount)}
                            disabled={disbursingId === (loan.loanId || loan.id)}
                            className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            {disbursingId === (loan.loanId || loan.id) ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>{t('executing')}</span>
                              </>
                            ) : (
                              <>
                                <Banknote className="w-3.5 h-3.5" />
                                <span>{t('disburseFunds')}</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
