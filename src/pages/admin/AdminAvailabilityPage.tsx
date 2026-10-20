import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Clock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AvailabilityBlock, AvailabilityStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminAvailabilityPage: React.FC = () => {
  const toast = useToast();
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(() =>
    dataService.getAvailabilityBlocks()
  );

  // Month navigation for admin calendar
  const [viewDate, setViewDate] = useState(() => new Date(2026, 9, 1)); // Oct 2026

  // Form states for adding or editing a block
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [blockStatus, setBlockStatus] = useState<AvailabilityStatus>('unavailable');
  const [privateNote, setPrivateNote] = useState('');

  // Conflict state
  const [conflictWarning, setConflictWarning] = useState<AvailabilityBlock | null>(null);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setBlocks(dataService.getAvailabilityBlocks());
    });
    return unsub;
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    if (endDate < startDate) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    const res = dataService.saveAvailabilityBlock({
      startDate,
      endDate,
      status: blockStatus,
      privateNote: privateNote.trim() || 'Blocked by administrator',
    });

    if (!res.success && res.conflictBlock) {
      setConflictWarning(res.conflictBlock);
      toast.error('Date conflict: Date or range overlaps an existing blocked schedule.');
      return;
    }

    toast.success('Availability block updated successfully!');
    setPrivateNote('');
  };

  const handleDeleteBlock = (id: string) => {
    dataService.deleteAvailabilityBlock(id);
    toast.success('Date block removed. Date marked available.');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#102820]">
          Lawn Availability & Date Blocks
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Lock confirmed wedding dates, set tentative holds, and manage multi-day event blocks with automatic conflict checking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Admin Calendar View */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#183D32] text-white flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#DFC493]">
                Admin Calendar View
              </div>
              <h2 className="font-display text-xl font-bold">
                {monthNames[month]} {year}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12 bg-stone-50 rounded" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const mm = String(month + 1).padStart(2, '0');
                const dd = String(dayNum).padStart(2, '0');
                const dateStr = `${year}-${mm}-${dd}`;
                const { status, block } = dataService.getDateStatus(dateStr);

                let bgClass = 'bg-emerald-50/70 border-emerald-200 text-stone-800';
                if (status === 'unavailable') {
                  bgClass = 'bg-rose-50 border-rose-300 text-rose-900';
                } else if (status === 'pending') {
                  bgClass = 'bg-amber-50 border-amber-300 text-amber-900';
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      setStartDate(dateStr);
                      setEndDate(dateStr);
                      if (block) {
                        setBlockStatus(block.status);
                        setPrivateNote(block.privateNote);
                      }
                    }}
                    className={`h-12 p-1 rounded border text-left flex flex-col justify-between transition-colors hover:ring-2 hover:ring-[#C6A66B] ${bgClass}`}
                  >
                    <span className="text-xs font-bold leading-none">{dayNum}</span>
                    <span className="text-[9px] uppercase font-mono font-medium truncate">
                      {status === 'unavailable' ? 'Blocked' : status === 'pending' ? 'Hold' : 'Open'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Date Block Editor Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-[#102820]">
              Create or Modify Date Block
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select date or date range to lock on the availability calendar.
            </p>
          </div>

          {conflictWarning && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Date Overlap Conflict!</span>
              </div>
              <p>
                The selected range conflicts with existing block: <strong>{conflictWarning.startDate} to {conflictWarning.endDate}</strong> ({conflictWarning.privateNote}).
              </p>
            </div>
          )}

          <form onSubmit={handleSaveBlock} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value > endDate) setEndDate(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  End Date <span className="text-stone-400 font-normal">(Multi-day)</span>
                </label>
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Calendar Status
              </label>
              <select
                value={blockStatus}
                onChange={(e) => setBlockStatus(e.target.value as AvailabilityStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] bg-white font-medium"
              >
                <option value="unavailable">Unavailable (Confirmed Booking / Blocked)</option>
                <option value="pending">Pending Confirmation (Hold / Negotiation)</option>
                <option value="available">Available (Open for Enquiries)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Private Admin Note <span className="text-stone-400 font-normal">(Internal only, never public)</span>
              </label>
              <input
                type="text"
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="e.g. Verma Vivah (Token Received, 800 guests)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#183D32] hover:bg-[#102820] shadow-sm transition-colors"
            >
              Save Schedule Block
            </button>
          </form>

          {/* Existing Blocks List */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="font-display text-sm font-bold text-stone-800 mb-3">
              Active Calendar Blocks ({blocks.length})
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {blocks.map((blk) => (
                <div
                  key={blk.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-stone-800">
                        {blk.startDate} {blk.endDate !== blk.startDate ? `→ ${blk.endDate}` : ''}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold ${
                          blk.status === 'unavailable'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {blk.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 truncate mt-0.5">
                      {blk.privateNote}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteBlock(blk.id)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                    title="Remove date block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
