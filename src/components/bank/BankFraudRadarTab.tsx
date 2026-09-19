import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Fingerprint,
  Users,
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Radio,
  Search,
  Send,
  Shield,
  Smartphone,
  Globe,
  Sliders,
  Check,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { FraudRadarMetrics, FraudAlert } from '../../types';
import { useVoice } from '../../voice/VoiceContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const BankFraudRadarTab: React.FC = () => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [metrics, setMetrics] = useState<FraudRadarMetrics | null>(null);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const fetchRadarData = async () => {
    try {
      setLoading(true);
      const [radarData, alertsData] = await Promise.all([
        api.getFraudRadar(),
        api.getBankFraudAlerts(),
      ]);
      setMetrics(radarData);
      setAlerts(alertsData);
      if (alertsData.length > 0 && !selectedAlert) {
        setSelectedAlert(alertsData[0]);
      } else if (selectedAlert) {
        const updated = alertsData.find((a) => a.id === selectedAlert.id);
        if (updated) setSelectedAlert(updated);
      }
    } catch (e) {
      console.warn('Failed to load fraud radar metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadarData();
  }, []);

  const handleAlertAction = async (action: string) => {
    if (!selectedAlert) return;
    setActionLoading(true);
    try {
      await api.actionBankFraudAlert(selectedAlert.id, action, resolutionText.trim());
      if (action === 'request_verification') {
        speak('Live cryptographic liveness check dispatched to customer device.');
      }
      setResolutionText('');
      await fetchRadarData();
    } catch (e) {
      console.error('Failed to execute alert action:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'all' || a.severity === filterSeverity
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-700 via-purple-800 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-rose-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{t('fraudRadarTitle')}</h2>
          </div>
          <p className="text-xs text-rose-100 max-w-xl">
            {t('fraudRadarDesc')}
          </p>
        </div>

        <button
          onClick={fetchRadarData}
          className="self-start md:self-auto py-2.5 px-4 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('refreshSentinel')}</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('threatStatus')}</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {metrics.threatVelocity} VELOCITY
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('zkpGuardsActive')}</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('deepfakesBlocked')}</span>
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Eye className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-rose-600">
              {metrics.deepfakeAttacksBlocked}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {t('deepfakesDesc')}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('sybilAttacksStopped')}</span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-purple-700">
              {metrics.sybilAttacksPrevented}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {t('sybilDesc')}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/80 bg-white/85 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('nonceReplayBlocks')}</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-600">
              {metrics.nonceReplayBlocks}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {t('amlClearRate')}: {metrics.amlClearRate}%
            </div>
          </div>
        </div>
      )}

      {/* Requirement 25: Actionable Fraud & Risk Alerts List */}
      <div className="glass-panel rounded-3xl border border-white/80 bg-white/85 shadow-md overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-extrabold text-slate-800">
              {t('activeFraudAlerts')}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {alerts.filter((a) => a.status !== 'Resolved').length} {t('activeAlertsCount')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">{t('filterSeverity')}:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="py-1 px-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">{t('allSeverities')}</option>
              <option value="CRITICAL">{t('critical')}</option>
              <option value="HIGH">{t('high')}</option>
              <option value="MEDIUM">{t('medium')}</option>
            </select>
          </div>
        </div>

        {/* 2-Column Split: Alerts on Left, Action Workbench on Right */}
        <div className="p-5 pt-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">{t('noAlertsMatching')}</p>
            ) : (
              filteredAlerts.map((alt) => {
                const isSelected = selectedAlert?.id === alt.id;
                return (
                  <button
                    key={alt.id}
                    onClick={() => setSelectedAlert(alt)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer block ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : alt.severity === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {alt.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{alt.type}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="font-semibold text-slate-700">{alt.customerName || 'Unauthenticated'}</span>
                      <span
                        className={`font-semibold ${
                          alt.status === 'Resolved'
                            ? 'text-emerald-600'
                            : alt.status === 'Investigating'
                            ? 'text-amber-600'
                            : alt.status === 'Escalated'
                            ? 'text-rose-600'
                            : 'text-purple-600'
                        }`}
                      >
                        {alt.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Workbench on Right */}
          <div className="lg:col-span-7">
            {selectedAlert ? (
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        selectedAlert.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : selectedAlert.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedAlert.severity} PRIORITY
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{selectedAlert.type}</h4>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedAlert.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedAlert.status === 'Escalated'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedAlert.status === 'Investigating'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedAlert.status}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">{t('incidentForensicAnalysis')}:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{selectedAlert.details}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 font-mono">
                    <div>
                      Device: <strong className="text-slate-700">{selectedAlert.deviceFingerprint || 'Unknown'}</strong>
                    </div>
                    <div>
                      Network IP: <strong className="text-slate-700">{selectedAlert.ipAddress || 'External Gateway'}</strong>
                    </div>
                  </div>
                </div>

                {/* Quick Action Workflows */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t('institutionalMitigation')}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleAlertAction('investigate')}
                      disabled={actionLoading || selectedAlert.status === 'Investigating'}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer"
                    >
                      {t('investigate')}
                    </button>
                    <button
                      onClick={() => handleAlertAction('request_verification')}
                      disabled={actionLoading}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer"
                    >
                      {t('challengeCitizen')}
                    </button>
                    <button
                      onClick={() => handleAlertAction('escalate')}
                      disabled={actionLoading || selectedAlert.status === 'Escalated'}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                    >
                      {t('escalate')}
                    </button>
                    <button
                      onClick={() => handleAlertAction('resolve')}
                      disabled={actionLoading || selectedAlert.status === 'Resolved'}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
                    >
                      {t('resolveAndClear')}
                    </button>
                  </div>
                </div>

                {/* Resolution note */}
                <div className="pt-2">
                  <input
                    type="text"
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder={t('complianceNotePlaceholder')}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs font-medium">
                {t('selectAlertPrompt')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
