import React, { useState, useEffect } from 'react';
import {
  Database,
  Layers,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Cpu,
  Fingerprint,
  Banknote,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { BankLedgerItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

export const BankBlockchainLedgerTab: React.FC = () => {
  const { t } = useLanguage();
  const [ledger, setLedger] = useState<BankLedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await api.getBankBlockchainLedger();
      setLedger(res.ledgerItems || []);
    } catch (e) {
      console.warn('Failed to load blockchain ledger:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filteredItems = ledger.filter((item) => {
    const matchesFilter = filterType === 'all' || item.method.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      item.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.blockNumber.toString().includes(searchQuery) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-900/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black">{t('ledgerExplorerHeader')}</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            {t('ledgerExplorerSub')}
          </p>
        </div>

        <button
          onClick={fetchLedger}
          className="self-start md:self-auto py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('syncLedgerAction')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/80 bg-white/85 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchLedgerInputPlaceholder')}
            className="w-full py-1.5 px-2 text-xs rounded-xl focus:outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 text-xs font-semibold overflow-x-auto">
          {['all', 'PASSKEY_ENROLLED', 'LOAN_DISBURSED', 'ZKP_VERIFICATION', 'PASSPORT_ANCHOR'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterType === type ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'all' ? t('allTransactions') : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-3xl border border-white/80 bg-white/85 shadow-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              {t('immutableLedgerFeed')} ({filteredItems.length} {t('blocks')})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            {t('networkPoA')}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">{t('syncingWithPeers')}</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">{t('noTransactionsMatch')}</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                    {item.method.includes('PASSKEY') && <Fingerprint className="w-5 h-5" />}
                    {item.method.includes('LOAN') && <Banknote className="w-5 h-5 text-emerald-600" />}
                    {item.method.includes('ZK') && <ShieldCheck className="w-5 h-5 text-purple-600" />}
                    {!item.method.includes('PASSKEY') && !item.method.includes('LOAN') && !item.method.includes('ZK') && <Layers className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {t('blockNumCol')} {item.blockNumber}
                      </span>
                      <span className="font-bold text-indigo-700">{item.method}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status === 'confirmed' ? t('confirmedBadge') : t('finalizedBadge')}
                      </span>
                    </div>

                    <p className="text-slate-600">{item.customerRef}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-slate-500">
                      <span>Tx: <strong className="text-slate-700">{item.txHash}</strong></span>
                      <span>Gas: <strong className="text-slate-700">{item.gasUsed}</strong></span>
                      <span>Merkle: <strong className="text-slate-700">{item.merkleRoot.substring(0, 14)}...</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">
                    {t('consensusConfirmed')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
