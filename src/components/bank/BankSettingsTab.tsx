import React from 'react';
import {
  Settings,
  Building2,
  ShieldCheck,
  Lock,
  Cpu,
  KeyRound,
  FileCode,
  Layers,
  Database,
  CheckCircle2,
  Users,
  Server
} from 'lucide-react';
import { BankStaff } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface BankSettingsTabProps {
  staff: BankStaff;
}

export const BankSettingsTab: React.FC<BankSettingsTabProps> = ({ staff }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Node Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-purple-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">{staff.bankName}</h2>
              <span className="text-xs text-purple-200 font-mono">
                {t('nodeIdLabel')} {staff.bankId} | {t('sovereignEnclaveNode')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('nodeSynchronizedBlock')}</span>
        </div>
      </div>

      {/* Grid: Institutional Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Cryptographic Engine Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-purple-700" />
            <h3 className="text-sm font-extrabold text-slate-800">
              {t('zkVerifierConfigHeader')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">{t('zkProverProtocolLabel')}</span>
                <span className="text-[11px] text-slate-500">{t('zkCircuitsDesc')}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[10px]">
                {t('enabledStatus')}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">{t('biometricEnclaveBridgeLabel')}</span>
                <span className="text-[11px] text-slate-500">{t('webAuthnAttestationDesc')}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">
                {t('activeStatus')}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">{t('dataMinimizationPolicyLabel')}</span>
                <span className="text-[11px] text-slate-500">{t('zeroRawPiiDesc')}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px]">
                {t('enforcedStatus')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">{t('smartContractVerifierAddrLabel')}</span>
              <span className="font-mono text-[11px] text-slate-600 break-all block">
                0x71bca489e13a90ef5502c398271a01c9402e1b
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Operator & Branch Profile */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-indigo-700" />
            <h3 className="text-sm font-extrabold text-slate-800">
              {t('authorizedOperatorCredentials')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <span className="text-[11px] text-purple-700 font-bold uppercase">{t('currentActiveSession')}</span>
              <div className="text-sm font-extrabold text-slate-900">{staff.name}</div>
              <div className="text-slate-600 text-xs">
                {t('designationLabel')} <strong className="text-slate-800">{staff.designation}</strong>
              </div>
              <div className="text-slate-600 text-xs">
                {t('employeeIdLabel')} <span className="font-mono font-bold text-purple-800">{staff.employeeId}</span> | {t('emailLabel')} {staff.email}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">{t('regulatoryComplianceCertifications')}</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {t('rbiCompliantBadge')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                  W3C DID v1.0
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {t('isoPrivacyBadge')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold">
                  {t('zeroPiiLiabilityBadge')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
