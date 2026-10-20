import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Calendar,
  Save,
  Users,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { BookingEnquiry, EnquiryStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminEnquiriesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');

  const toast = useToast();
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>(() =>
    dataService.getEnquiries()
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<BookingEnquiry | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('new');

  // Confirmation modal for auto-blocking calendar on status = confirmed
  const [showConfirmBlockModal, setShowConfirmBlockModal] = useState(false);
  const [pendingConfirmationTarget, setPendingConfirmationTarget] = useState<BookingEnquiry | null>(null);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      const all = dataService.getEnquiries();
      setEnquiries(all);
      if (selectedEnquiry) {
        const found = all.find((e) => e.id === selectedEnquiry.id);
        if (found) {
          setSelectedEnquiry(found);
          setEditNotes(found.privateAdminNotes || '');
          setEditStatus(found.status);
        }
      }
    });
    return unsub;
  }, [selectedEnquiry]);

  useEffect(() => {
    if (targetId) {
      const match = enquiries.find((e) => e.id === targetId);
      if (match) {
        handleOpenDetail(match);
      }
    }
  }, [targetId, enquiries]);

  const handleOpenDetail = (enq: BookingEnquiry) => {
    setSelectedEnquiry(enq);
    setEditNotes(enq.privateAdminNotes || '');
    setEditStatus(enq.status);
  };

  const handleStatusChangeRequest = (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;

    if (newStatus === 'confirmed') {
      // Check date conflict before anything else
      const conflict = dataService.checkConflict(
        selectedEnquiry.preferredDate,
        selectedEnquiry.preferredDate
      );
      if (conflict) {
        toast.error(
          `Conflict Detected! Date ${selectedEnquiry.preferredDate} is already blocked (${conflict.privateNote}). Resolve conflict first.`
        );
        return;
      }
      // If no conflict, prompt admin if they want to block the calendar automatically
      setPendingConfirmationTarget(selectedEnquiry);
      setShowConfirmBlockModal(true);
      return;
    }

    // Direct status update for other statuses
    dataService.updateEnquiryStatus(selectedEnquiry.id, newStatus, editNotes);
    toast.success(`Enquiry status changed to ${newStatus}.`);
    setEditStatus(newStatus);
  };

  const handleConfirmWithCalendarBlock = (blockCalendar: boolean) => {
    if (!pendingConfirmationTarget) return;

    const res = dataService.updateEnquiryStatus(
      pendingConfirmationTarget.id,
      'confirmed',
      editNotes,
      blockCalendar
    );

    if (res.conflict) {
      toast.error('Date conflict detected. Calendar was not blocked.');
    } else {
      toast.success(
        blockCalendar
          ? `Enquiry confirmed & ${pendingConfirmationTarget.preferredDate} locked on calendar!`
          : 'Enquiry marked confirmed.'
      );
    }

    setShowConfirmBlockModal(false);
    setPendingConfirmationTarget(null);
    setEditStatus('confirmed');
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    dataService.updateEnquiryStatus(selectedEnquiry.id, editStatus, editNotes);
    toast.success('Admin notes saved.');
  };

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSearch =
      e.customerName.toLowerCase().includes(search.toLowerCase()) ||
      e.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#102820]">
          Booking Enquiry Inquiries
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review visitor requests, call or WhatsApp prospective hosts, add internal notes, and lock dates upon confirmation.
        </p>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or reference..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] bg-white font-medium"
          >
            <option value="all">All Enquiries ({enquiries.length})</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    No enquiries match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                      {enq.referenceCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{enq.customerName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{enq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {enq.eventType}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-stone-800">
                      {enq.preferredDate}
                      {enq.alternativeDate && (
                        <div className="text-[10px] text-stone-400">Alt: {enq.alternativeDate}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-stone-500 font-mono">
                      {enq.createdAt.split('T')[0]}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          enq.status === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'contacted'
                            ? 'bg-purple-100 text-purple-800'
                            : enq.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`tel:${enq.phone}`}
                          title="Call"
                          className="p-1 rounded bg-stone-100 text-stone-700 hover:bg-[#183D32] hover:text-white"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp"
                          className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenDetail(enq)}
                          className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 text-[11px] font-semibold"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Action Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div>
                <div className="text-[11px] font-mono uppercase text-[#C6A66B]">
                  Enquiry ID: {selectedEnquiry.referenceCode}
                </div>
                <h2 className="font-display text-2xl font-bold text-[#102820]">
                  {selectedEnquiry.customerName}
                </h2>
                <div className="text-xs text-stone-500 mt-0.5 font-mono">
                  Submitted on {selectedEnquiry.createdAt.split('T')[0]} at {selectedEnquiry.createdAt.split('T')[1]?.slice(0, 5)}
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Direct Contact Bar */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-300"
              >
                <Phone className="w-3.5 h-3.5 text-[#183D32]" />
                <span>Call {selectedEnquiry.phone}</span>
              </a>

              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Namaste ${selectedEnquiry.customerName}, regarding your K.N. Lawn booking enquiry (${selectedEnquiry.referenceCode}) for ${selectedEnquiry.preferredDate}...`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              {selectedEnquiry.email && (
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-300"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
            </div>

            {/* Event Specification Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-stone-50/60 p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 uppercase text-[10px] font-semibold block">
                  Event Category
                </span>
                <span className="font-semibold text-stone-800">{selectedEnquiry.eventType}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[10px] font-semibold block">
                  Requested Date
                </span>
                <span className="font-mono font-bold text-[#183D32]">{selectedEnquiry.preferredDate}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase text-[10px] font-semibold block">
                  Estimated Guests
                </span>
                <span className="font-semibold text-stone-800">
                  {selectedEnquiry.guestCount ? `${selectedEnquiry.guestCount} People` : 'Not specified'}
                </span>
              </div>
              {selectedEnquiry.alternativeDate && (
                <div>
                  <span className="text-stone-400 uppercase text-[10px] font-semibold block">
                    Alternative Date
                  </span>
                  <span className="font-mono text-stone-800">{selectedEnquiry.alternativeDate}</span>
                </div>
              )}
            </div>

            {/* Customer Message */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Customer Message & Special Requests
              </label>
              <div className="p-3 rounded-lg bg-stone-100 text-xs text-stone-800 leading-relaxed font-sans">
                {selectedEnquiry.message || 'No additional notes provided by customer.'}
              </div>
            </div>

            {/* Status Changer */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['new', 'contacted', 'pending', 'confirmed', 'rejected', 'cancelled'] as EnquiryStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChangeRequest(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        editStatus === st
                          ? 'bg-[#183D32] text-white shadow'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Private Admin Notes */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Private Admin Notes (Visible only to venue owners)
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Log call conversation, token advance status, custom package notes..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Conflict & Auto Calendar Block Confirmation Modal */}
      {showConfirmBlockModal && pendingConfirmationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <h3 className="font-display text-lg font-bold text-stone-900">
                Confirm Booking & Block Date?
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              No schedule conflicts detected for <strong>{pendingConfirmationTarget.preferredDate}</strong>.
            </p>

            <p className="text-xs text-stone-600 leading-relaxed">
              Would you like to automatically lock this date as <strong>Unavailable (Confirmed Booking)</strong> on the public lawn availability calendar?
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                onClick={() => handleConfirmWithCalendarBlock(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Confirm Without Blocking
              </button>
              <button
                onClick={() => handleConfirmWithCalendarBlock(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#183D32] hover:bg-[#102820] shadow"
              >
                Yes, Lock Date on Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
