import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AvailabilityStatus } from '../../types';

interface AvailabilityCalendarProps {
  onSelectDate?: (dateStr: string) => void;
  selectedDate?: string;
  isAdmin?: boolean;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  onSelectDate,
  selectedDate,
  isAdmin = false,
}) => {
  // Current view month (default: current date 2026-10 or today)
  const [viewDate, setViewDate] = useState(() => {
    // Current date from metadata: 2026-10-19
    return new Date(2026, 9, 1); // October 2026
  });

  const [activeDate, setActiveDate] = useState<string | null>(selectedDate || null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Helper to format YYYY-MM-DD
  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Days in month calculation
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { dateStr: string; dayNumber: number; status: AvailabilityStatus }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, month, d);
    const { status } = dataService.getDateStatus(dateStr);
    days.push({
      dateStr,
      dayNumber: d,
      status,
    });
  }

  const handleDayClick = (dateStr: string, status: AvailabilityStatus) => {
    setActiveDate(dateStr);
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  const activeDateDetails = activeDate ? dataService.getDateStatus(activeDate) : null;
  const isSelectedUnavailable = activeDateDetails?.status === 'unavailable';
  const isSelectedPending = activeDateDetails?.status === 'pending';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-sm overflow-hidden">
      {/* Calendar Header with Navigation */}
      <div className="p-4 sm:p-6 bg-[#183D32] text-white flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#DFC493] font-medium">
            Lawn Schedule
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            {monthNames[month]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Accessible Legend */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-500 inline-block" />
            <span className="font-medium text-stone-700">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500 inline-block" />
            <span className="font-medium text-stone-700">Pending Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-500 inline-block" />
            <span className="font-medium text-stone-700">Booked / Blocked</span>
          </div>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
          <span>Subject to owner confirmation</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty spacer cells for day of week offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-14 rounded-lg bg-stone-50/50" />
          ))}

          {/* Actual days */}
          {days.map((day) => {
            const isSelected = activeDate === day.dateStr;

            let statusClasses = 'bg-emerald-50/60 hover:bg-emerald-100 text-stone-800 border-emerald-200';
            let badgeText = 'Avail';

            if (day.status === 'unavailable') {
              statusClasses = 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/70';
              badgeText = 'Booked';
            } else if (day.status === 'pending') {
              statusClasses = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/70';
              badgeText = 'Hold';
            }

            if (isSelected) {
              statusClasses = 'ring-2 ring-[#C6A66B] ring-offset-2 bg-[#183D32] text-white border-transparent';
            }

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => handleDayClick(day.dateStr, day.status)}
                className={`h-11 sm:h-16 p-1 sm:p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-150 focus:outline-none ${statusClasses}`}
                aria-label={`${day.dateStr}: ${day.status}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>
                    {day.dayNumber}
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1 py-0.5 rounded font-mono hidden sm:inline-block ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : day.status === 'unavailable'
                        ? 'text-rose-700 font-semibold'
                        : day.status === 'pending'
                        ? 'text-amber-800 font-semibold'
                        : 'text-emerald-700'
                    }`}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* Mobile tiny dot indicator */}
                <div className="sm:hidden flex justify-end">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-[#C6A66B]'
                        : day.status === 'unavailable'
                        ? 'bg-rose-500'
                        : day.status === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Date Insight Panel */}
        {activeDate && (
          <div className="mt-6 p-4 rounded-xl border border-stone-200 bg-stone-50 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <CalendarIcon className="w-4 h-4 text-[#C6A66B]" />
                  <span>Selected Date: {activeDate}</span>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                      isSelectedUnavailable
                        ? 'bg-rose-100 text-rose-800'
                        : isSelectedPending
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isSelectedUnavailable && 'Date Confirmed Booked'}
                    {isSelectedPending && 'Pending Confirmation / Tentative Hold'}
                    {!isSelectedUnavailable && !isSelectedPending && 'Currently Available for Enquiry'}
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-600">
                  {isSelectedUnavailable
                    ? 'This date is currently blocked for another event. You can check alternative dates or contact the owner for special coordination.'
                    : isSelectedPending
                    ? 'An enquiry is currently in active review for this date. You may submit an enquiry as an alternate priority request.'
                    : 'This date appears open. Submitting an enquiry sends your request directly to the lawn management team.'}
                </p>

                {isAdmin && activeDateDetails?.block?.privateNote && (
                  <div className="mt-2 p-2 bg-stone-200/60 rounded text-xs text-stone-800 font-mono">
                    <strong>Admin Note:</strong> {activeDateDetails.block.privateNote}
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {!isAdmin && (
                  <a
                    href={
                      isSelectedUnavailable
                        ? '#contact'
                        : `/enquire?date=${encodeURIComponent(activeDate)}`
                    }
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isSelectedUnavailable
                        ? 'bg-stone-200 text-stone-500 cursor-not-allowed pointer-events-none'
                        : 'bg-[#183D32] hover:bg-[#102820] text-white shadow-sm'
                    }`}
                  >
                    <span>{isSelectedUnavailable ? 'Date Unavailable' : 'Enquire for this Date'}</span>
                    {!isSelectedUnavailable && <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
