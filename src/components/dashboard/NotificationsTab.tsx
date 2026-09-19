import React from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';

interface NotificationsTabProps {
  notifications?: NotificationItem[];
  onRefresh: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications = [],
  onRefresh,
}) => {
  const { t } = useLanguage();
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      onRefresh();
    } catch (e) {
      console.warn('Mark as read failed:', e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/90 bg-white/85 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {t('notificationsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('notificationsSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {safeNotifications.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/90 bg-white/85 shadow-sm space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No New Notifications
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You are all caught up. Security alerts, consent activities, and bank verification notices will show here in real time.
            </p>
          </div>
        ) : (
          safeNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.read
                  ? 'bg-white/70 border-slate-200/80 text-slate-500'
                  : 'bg-white border-indigo-200 shadow-md text-slate-800 ring-1 ring-indigo-500/20'
              }`}
            >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'security'
                    ? 'bg-rose-50 text-rose-600'
                    : n.type === 'request'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {n.type === 'security' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold block">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  {n.timestamp}
                </span>
              </div>
            </div>

            {!n.read && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="py-1 px-2.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 shrink-0 cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark Read</span>
              </button>
            )}
          </div>
        ))
      )}
      </div>
    </div>
  );
};
