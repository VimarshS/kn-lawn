import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Phone,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { AvailabilityCalendar } from '../../components/calendar/AvailabilityCalendar';
import { dataService } from '../../services/dataService';

export const AvailabilityPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleStartEnquiry = () => {
    if (selectedDate) {
      navigate(`/enquire?date=${encodeURIComponent(selectedDate)}`);
    } else {
      navigate('/enquire');
    }
  };

  const dateStatus = selectedDate ? dataService.getDateStatus(selectedDate) : null;
  const isDateUnavailable = dateStatus?.status === 'unavailable';

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-[#102820] text-white py-16 border-b border-[#C6A66B]/30 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A66B]/20 text-[#DFC493] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Venue Schedule</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F5EF]">
            Lawn Date Availability
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F8F5EF]/80 max-w-2xl mx-auto leading-relaxed">
            Review real-time calendar availability for Indian wedding seasons, vivah muhurats, and celebratory gatherings.
          </p>
        </div>
      </section>

      {/* Main Calendar & Selection Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Calendar on the Left / Main Column */}
          <div className="lg:col-span-8">
            <AvailabilityCalendar
              onSelectDate={handleDateSelect}
              selectedDate={selectedDate || undefined}
            />
          </div>

          {/* Quick Date Action & Info Card on the Right */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-[#102820]">
                {selectedDate ? `Date: ${selectedDate}` : 'Select a Celebration Date'}
              </h3>

              {selectedDate ? (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                        isDateUnavailable
                          ? 'bg-rose-100 text-rose-800'
                          : dateStatus?.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isDateUnavailable && 'Date Blocked / Confirmed'}
                      {dateStatus?.status === 'pending' && 'Pending Confirmation'}
                      {dateStatus?.status === 'available' && 'Available for Booking'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isDateUnavailable
                      ? 'This date is already scheduled for another wedding or function. Please explore neighboring dates or speak with the proprietor.'
                      : dateStatus?.status === 'pending'
                      ? 'An enquiry is currently under review for this date. You may submit an enquiry to be placed on priority hold.'
                      : 'This date is currently open. You can submit your requirements now to lock in this date.'}
                  </p>

                  <button
                    onClick={handleStartEnquiry}
                    disabled={isDateUnavailable}
                    className={`w-full mt-2 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                      isDateUnavailable
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#C6A66B] to-[#DFC493] text-[#102820] hover:from-[#DFC493] hover:to-[#C6A66B] shadow'
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Proceed with Enquiry</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-stone-500 leading-relaxed">
                  Click any date on the calendar to view its booking status and proceed directly with your enquiry.
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-stone-100 space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#183D32] shrink-0 mt-0.5" />
                  <span>
                    <strong>Official Lawn Protection:</strong> No double-booking. Confirmed dates are reserved exclusively for one primary event per day.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#183D32] shrink-0 mt-0.5" />
                  <span>
                    <strong>24-Hour Review:</strong> Lawn management reviews all submitted forms and confirms via phone call or WhatsApp.
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Call Assistance Card */}
            <div className="bg-[#183D32] text-white rounded-xl p-6 border border-[#C6A66B]/30 shadow-sm space-y-4">
              <div className="font-display text-lg font-bold text-[#DFC493]">
                Need Date Assistance?
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                If you are planning a multi-day ceremony (e.g. Sangeet + Vivah) or have specific muhurat timings, call our booking desk directly.
              </p>
              <a
                href="tel:+919450023456"
                className="inline-flex items-center gap-2 w-full justify-center py-2.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#DFC493]" />
                <span>Call +91 94500 23456</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Process & Verification Steps */}
      <section className="bg-stone-100/70 py-16 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Step-by-Step
            </div>
            <h2 className="font-display text-3xl font-bold text-[#102820] mt-1">
              How Venue Booking Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              Transparent, straightforward steps from initial date inquiry to confirmed reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-display text-base font-bold text-[#102820]">
                Select Preferred Date
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                Check the calendar for available dates and submit an enquiry with your estimated guest count.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-display text-base font-bold text-[#102820]">
                Proprietor Consultation
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                Our lawn manager contacts you within 24 hours to discuss mandap setup, power needs, and timing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-display text-base font-bold text-[#102820]">
                On-Site Walk-through
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                Visit K.N. Lawn with family or wedding planners to inspect bridal suites, dining pavilions, and lawn lighting.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-display text-base font-bold text-[#102820]">
                Date Locked & Confirmed
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                Upon agreement and token advance, your date is marked strictly unavailable on the public calendar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
