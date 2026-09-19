import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Search,
  SlidersHorizontal,
  FileText,
  BadgeCheck,
  Sparkles,
  Info,
  Shield,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

interface CustomerDirectoryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  kycStatus: string;
  privacyScore: number;
  dataMinimizationScore: number;
  state: string;
  ageEligibility: boolean;
  credentialsCount: number;
  activeConsentsCount: number;
  pendingRequestsCount: number;
  sharedAttributes: string[];
  unsharedPrivateAttributes: string[];
}

export const BankCustomersDirectoryTab: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<CustomerDirectoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCust, setSelectedCust] = useState<CustomerDirectoryRecord | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.getBankCustomersDirectory();
        setCustomers(data);
      } catch (e) {
        console.warn('Failed to load customers directory:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Section 26: Customer Data Sharing Explanation Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/90 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">
                {t('custDataSharingTitle')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-2xl">
              {t('custDataSharingDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-2xl text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('zkpArchBadge')}</span>
          </div>
        </div>

        {/* Visual Data Minimization Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What Bank CAN See */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>{t('whatBankCanAccess')}</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>{t('mathProofAge')}</strong> {t('mathProofAgeDesc')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>{t('govtKycAttestation')}</strong> {t('govtKycAttestationDesc')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>{t('stateResidency')}</strong> {t('stateResidencyDesc')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>{t('cryptoAnchorHash')}</strong> {t('cryptoAnchorHashDesc')}</span>
              </li>
            </ul>
          </div>

          {/* What Bank CANNOT See */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-rose-500" />
              <span>{t('whatBankCannotAccess')}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{t('rawBiometrics')}</strong> {t('rawBiometricsDesc')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{t('fullAadhaarPan')}</strong> {t('fullAadhaarPanDesc')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{t('exactDobAddress')}</strong> {t('exactDobAddressDesc')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>{t('unrelatedCreds')}</strong> {t('unrelatedCredsDesc')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Minimization Ratio */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-900 font-semibold">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{t('avgDataMinimization')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-44 bg-purple-200/80 rounded-full h-2.5 overflow-hidden">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '96%' }}></div>
            </div>
            <span className="font-extrabold text-purple-900 text-sm">{t('minimizedBadge')}</span>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-3xl border border-white/80 bg-white/90 shadow-md overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-700" />
              <span>{t('custVerifDirectory')}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {filtered.length} {t('customersCount')}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('filterCitizenState')}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4 pl-6">{t('thCustomer')}</th>
                <th className="p-4">{t('thJurisdiction')}</th>
                <th className="p-4">{t('thKycStatus')}</th>
                <th className="p-4">{t('thPrivacyScore')}</th>
                <th className="p-4">{t('thDataMinimization')}</th>
                <th className="p-4">{t('thActiveConsents')}</th>
                <th className="p-4 pr-6 text-right">{t('thDataSharingAudit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {t('loadingCustomers')}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {t('noCustomersFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{cust.name}</span>
                          <span className="font-mono text-[11px] text-slate-400">{cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{cust.state}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{cust.kycStatus.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{cust.privacyScore}/100</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${cust.dataMinimizationScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">
                          {cust.dataMinimizationScore}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-700">
                      {cust.activeConsentsCount} active
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedCust(cust)}
                        className="py-1.5 px-3 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-50 border border-purple-200 transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('auditDisclosures')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Data Sharing Explanation Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedCust.name}</h3>
                <p className="text-xs text-slate-500">
                  {t('dataSharingBreakdown')} ({selectedCust.id})
                </p>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>{t('sharedWithBank')}</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCust.sharedAttributes.map((attr, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-900 font-semibold text-[11px]"
                    >
                      ✓ {attr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>{t('strictlyProtected')}</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCust.unsharedPrivateAttributes.map((attr, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-700 font-medium text-[11px]"
                    >
                      🔒 {attr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
                {t('zkpGuarantee')}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCust(null)}
                className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all cursor-pointer"
              >
                {t('closeAudit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
