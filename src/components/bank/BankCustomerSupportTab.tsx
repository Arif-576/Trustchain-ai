import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  UserCheck,
  Send,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Filter,
  Languages,
  Sparkles,
  Volume2
} from 'lucide-react';
import { api } from '../../services/api';
import { SupportCase } from '../../types';
import { useVoice } from '../../voice/VoiceContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface BankCustomerSupportTabProps {
  onOpenAssistedDesk?: () => void;
}

export const BankCustomerSupportTab: React.FC<BankCustomerSupportTabProps> = ({
  onOpenAssistedDesk,
}) => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Case Form
  const [newCustomerId, setNewCustomerId] = useState('usr-arif-02');
  const [newCustomerName, setNewCustomerName] = useState('Mohamed Arif A');
  const [newCaseType, setNewCaseType] = useState<SupportCase['caseType']>('Identity Verification');
  const [newPriority, setNewPriority] = useState<SupportCase['priority']>('Medium');
  const [newSubject, setNewSubject] = useState('');
  const [newInitialNote, setNewInitialNote] = useState('');

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.getBankSupportCases();
      setCases(data);
      if (data.length > 0 && !selectedCase) {
        setSelectedCase(data[0]);
      } else if (selectedCase) {
        const updated = data.find((c) => c.id === selectedCase.id);
        if (updated) setSelectedCase(updated);
      }
    } catch (e) {
      console.warn('Failed to load support cases:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNoteText.trim()) return;
    setActionLoading(true);
    try {
      await api.addBankSupportCaseNote(selectedCase.id, newNoteText.trim());
      setNewNoteText('');
      await loadCases();
    } catch (e) {
      console.error('Failed to add note:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    if (!selectedCase) return;
    setActionLoading(true);
    try {
      await api.requestBankSupportVerification(selectedCase.id);
      speak('Customer identity verification challenge has been dispatched.');
      await loadCases();
    } catch (e) {
      console.error('Failed to request verification:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (status: SupportCase['status']) => {
    if (!selectedCase) return;
    setActionLoading(true);
    try {
      await api.updateBankSupportCase(selectedCase.id, { status });
      await loadCases();
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setActionLoading(true);
    try {
      const res = await api.createBankSupportCase({
        customerId: newCustomerId,
        customerName: newCustomerName,
        caseType: newCaseType,
        priority: newPriority,
        subject: newSubject.trim(),
        initialNote: newInitialNote.trim(),
      });
      setShowCreateModal(false);
      setNewSubject('');
      setNewInitialNote('');
      await loadCases();
      if (res.case) setSelectedCase(res.case);
    } catch (e) {
      console.error('Failed to create case:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch =
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    total: cases.length,
    open: cases.filter((c) => c.status === 'Open').length,
    inProgress: cases.filter((c) => c.status === 'In Progress').length,
    waiting: cases.filter((c) => c.status === 'Waiting for Customer').length,
    resolved: cases.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Stats and Assisted Desk trigger */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-300">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">{t('supportDeskTitle')}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Officer Tier 1/2
                </span>
              </div>
              <p className="text-purple-200 text-xs font-semibold">
                {t('supportDeskDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenAssistedDesk && (
            <button
              onClick={onOpenAssistedDesk}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-amber-950 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-900/20"
            >
              <Languages className="w-4 h-4" />
              <span>{t('voiceAssistedDeskBtn')} (தமிழ் / हिंदी)</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-purple-900 hover:bg-purple-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newSupportTicketBtn')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t('statTotalCases')}</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">{counts.total}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">{t('statOpen')}</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{counts.open}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">{t('statInProgress')}</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{counts.inProgress}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">{t('statWaitingCustomer')}</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">{counts.waiting}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">{t('statResolved')}</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{counts.resolved}</span>
        </div>
      </div>

      {/* Main 2-Column Split: Case List on Left, Active Case Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-3xl border border-white/80 bg-white/85 shadow-sm space-y-3">
            {/* Filters and search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchTicketsPlaceholder')}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-1.5 px-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="Open">{t('statOpen')}</option>
                <option value="In Progress">{t('statInProgress')}</option>
                <option value="Waiting for Customer">{t('statWaitingCustomer')}</option>
                <option value="Resolved">{t('statResolved')}</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {loading && <p className="text-xs text-slate-500 text-center py-6">{t('loadingCases')}</p>}
              {!loading && filteredCases.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">{t('noMatchingCases')}</p>
              )}
              {filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer block ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-300 shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-black text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
                        #{c.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : c.priority === 'High'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{c.subject}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="font-semibold text-slate-700">{c.customerName}</span>
                      <span
                        className={`font-semibold ${
                          c.status === 'Resolved'
                            ? 'text-emerald-600'
                            : c.status === 'Waiting for Customer'
                            ? 'text-purple-600'
                            : c.status === 'In Progress'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Details & Workflow Action */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="glass-panel p-6 rounded-3xl border border-white/80 bg-white/90 shadow-md space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
                      #{selectedCase.ticketNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        selectedCase.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedCase.status === 'Waiting for Customer'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedCase.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedCase.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedCase.subject}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <strong className="text-slate-700">{selectedCase.customerName}</strong> ({selectedCase.customerId}) | Type: <strong>{selectedCase.caseType}</strong>
                  </p>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCase.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as SupportCase['status'])}
                    disabled={actionLoading}
                    className="py-1.5 px-3 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Open">Status: Open</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Waiting for Customer">Status: Waiting</option>
                    <option value="Resolved">Status: Resolved</option>
                    <option value="Escalated">Status: Escalated</option>
                  </select>
                </div>
              </div>

              {/* Requirement 24 Core Action: Request Verification from Customer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-extrabold text-purple-900">
                      {t('dispatchedIdentityChallenge')}
                    </span>
                  </div>
                  <p className="text-xs text-purple-700">
                    {t('dispatchedIdentityDesc')}
                  </p>
                </div>

                <button
                  onClick={handleRequestVerification}
                  disabled={actionLoading}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white transition-all cursor-pointer whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('requestVerificationBtn')}</span>
                </button>
              </div>

              {/* Case History / Notes Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('caseHistoryNotes')}</span>
                </h4>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {selectedCase.notes && selectedCase.notes.length > 0 ? (
                    selectedCase.notes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-bold text-slate-800">{note.author}</span>
                          <span className="font-mono text-[10px]">{new Date(note.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-3 italic text-center">{t('noNotesRecorded')}</p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={t('addNotePlaceholder')}
                    className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !newNoteText.trim()}
                    className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{t('addNoteBtn')}</span>
                  </button>
                </form>
              </div>

              {/* Case Meta info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">{t('assignedOfficerLabel')}</span>
                  <span className="font-bold text-slate-700">{selectedCase.assignedOfficer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{t('createdOnLabel')}</span>
                  <span className="font-mono text-slate-700">{new Date(selectedCase.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{t('auditRecordLabel')}</span>
                  <span className="font-mono text-emerald-600 font-bold">{t('cryptographicallyLogged')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-white/80 bg-white/80 shadow-sm text-center text-slate-500">
              <LifeBuoy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">{t('selectTicketPrompt')}</p>
            </div>
          )}
        </div>
      </div>

      {/* New Case Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">{t('createTicketModalTitle')}</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('customerLabel')}</label>
                <select
                  value={newCustomerId}
                  onChange={(e) => {
                    setNewCustomerId(e.target.value);
                    const names: Record<string, string> = {
                      'usr-arif-02': 'Mohamed Arif A',
                      'usr-midhun-01': 'Midhun',
                      'usr-kishore-03': 'Kishore',
                      'usr-krishnesh-04': 'Krishnesh',
                    };
                    setNewCustomerName(names[e.target.value] || 'Customer');
                  }}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="usr-arif-02">Mohamed Arif A (usr-arif-02)</option>
                  <option value="usr-midhun-01">Midhun (usr-midhun-01)</option>
                  <option value="usr-kishore-03">Kishore (usr-kishore-03)</option>
                  <option value="usr-krishnesh-04">Krishnesh (usr-krishnesh-04)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('caseTypeLabel')}</label>
                  <select
                    value={newCaseType}
                    onChange={(e) => setNewCaseType(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Identity Verification">Identity Verification</option>
                    <option value="KYC Assistance">KYC Assistance</option>
                    <option value="Loan Assistance">Loan Assistance</option>
                    <option value="Proof Verification">Proof Verification</option>
                    <option value="Account Security">Account Security</option>
                    <option value="Fraud Concern">Fraud Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('priorityLabel')}</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('subjectLabel')}</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Assistance with agricultural KYC claim"
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('initialNoteLabel')}</label>
                <textarea
                  value={newInitialNote}
                  onChange={(e) => setNewInitialNote(e.target.value)}
                  placeholder="Details of the customer request or verification issue..."
                  rows={3}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all cursor-pointer"
                >
                  {actionLoading ? t('creatingTicket') : t('createTicketSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
