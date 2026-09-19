import React, { useState } from 'react';
import { History, ShieldCheck, Search, Copy, Check, ExternalLink, Filter } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AuditEvent } from '../../types';

interface AuditHistoryTabProps {
  logs?: AuditEvent[];
}

export const AuditHistoryTab: React.FC<AuditHistoryTabProps> = ({ logs = [] }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const safeLogs = Array.isArray(logs) ? logs : [];

  const filteredLogs = safeLogs.filter(
    (l) =>
      (l.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.organization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.txHash || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                {t('auditHistoryTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {t('auditHistorySubtitle')}
              </p>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-3xl border border-white/80 bg-white/85 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Tx Anchor Hash</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="p-4 pl-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    {log.action}
                  </td>
                  <td className="p-4 text-slate-600">
                    {log.organization}
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">
                    {log.actor}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-indigo-600">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[140px]">{log.txHash}</span>
                      <button
                        onClick={() => copyHash(log.txHash)}
                        className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                        title="Copy Tx Hash"
                      >
                        {copiedHash === log.txHash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 pr-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
