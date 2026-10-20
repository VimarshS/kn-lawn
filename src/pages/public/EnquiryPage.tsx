import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { BookingEnquiry } from '../../types';
import { useToast } from '../../context/ToastContext';

export const EnquiryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillDate = searchParams.get('date') || '';
  const prefillType = searchParams.get('type') || '';

  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState(prefillType || 'Wedding Ceremony');
  const [preferredDate, setPreferredDate] = useState(prefillDate);
  const [alternativeDate, setAlternativeDate] = useState('');
  const [guestCount, setGuestCount] = useState<string>('500');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<BookingEnquiry | null>(null);

  // Today's date string for min date (current year 2026)
  const todayStr = '2026-10-19';

  useEffect(() => {
    if (prefillDate) {
      setPreferredDate(prefillDate);
    }
  }, [prefillDate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    // Indian Phone Number validation:
    // Can start with optional +91 or 0, followed by 10 digits starting with 6, 7, 8, or 9
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required so our manager can reach you.';
    } else if (!indianPhoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g., 98390 12345).';
    }

    // Optional email validation
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please provide a valid email address.';
      }
    }

    if (!eventType) {
      newErrors.eventType = 'Please select an event type.';
    }

    if (!preferredDate) {
      newErrors.preferredDate = 'Please choose your preferred celebration date.';
    } else {
      if (preferredDate < todayStr) {
        newErrors.preferredDate = 'Event date cannot be in the past.';
      } else {
        const { status } = dataService.getDateStatus(preferredDate);
        if (status === 'unavailable') {
          newErrors.preferredDate = 'This date is already blocked on the lawn calendar. Please select another date.';
        }
      }
    }

    if (!consent) {
      newErrors.consent = 'Please confirm that you agree to be contacted regarding this date enquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the form errors highlighted below.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = dataService.submitEnquiry({
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        eventType,
        preferredDate,
        alternativeDate: alternativeDate || undefined,
        guestCount: guestCount ? parseInt(guestCount, 10) : undefined,
        message: message.trim(),
      });

      setSubmittedEnquiry(created);
      toast.success('Your booking enquiry has been recorded!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header Banner */}
      <section className="bg-[#102820] text-white py-16 border-b border-[#C6A66B]/30 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A66B]/20 text-[#DFC493] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Venue Reservation Desk</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F5EF]">
            Venue Booking Enquiry
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F8F5EF]/80 max-w-2xl mx-auto leading-relaxed">
            Reserve your preferred date at K.N. Lawn. Our proprietor will personally review your requirements and provide package details.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedEnquiry ? (
          /* Confirmation Screen */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="text-xs uppercase font-semibold tracking-widest text-[#C6A66B]">
                Enquiry Successfully Received
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#102820] mt-1">
                Thank You, {submittedEnquiry.customerName}
              </h2>
              <div className="mt-3 inline-block bg-stone-100 border border-stone-300 rounded-lg px-4 py-2 text-xs font-mono text-stone-800">
                Enquiry Reference: <span className="font-bold text-[#183D32]">{submittedEnquiry.referenceCode}</span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-4 text-left max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed font-sans">
                  <strong>Please Note:</strong> This submission is an <em>official enquiry</em> and does not yet constitute a confirmed or binding booking. Dates are confirmed only after proprietor review, layout agreement, and receipt of the token advance.
                </div>
              </div>
            </div>

            {/* Submitted Summary */}
            <div className="bg-stone-50 rounded-xl p-5 text-left text-xs text-stone-700 max-w-xl mx-auto space-y-2 border border-stone-200">
              <div className="flex justify-between py-1 border-b border-stone-200/70">
                <span className="text-stone-500">Event Type:</span>
                <span className="font-semibold">{submittedEnquiry.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/70">
                <span className="text-stone-500">Preferred Date:</span>
                <span className="font-semibold">{submittedEnquiry.preferredDate}</span>
              </div>
              {submittedEnquiry.alternativeDate && (
                <div className="flex justify-between py-1 border-b border-stone-200/70">
                  <span className="text-stone-500">Alternative Date:</span>
                  <span className="font-semibold">{submittedEnquiry.alternativeDate}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-stone-200/70">
                <span className="text-stone-500">Contact Number:</span>
                <span className="font-semibold">{submittedEnquiry.phone}</span>
              </div>
              {submittedEnquiry.guestCount && (
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Estimated Guests:</span>
                  <span className="font-semibold">{submittedEnquiry.guestCount} People</span>
                </div>
              )}
            </div>

            {/* Next Steps & Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/919450023456?text=${encodeURIComponent(
                  `Namaste, I submitted an enquiry for K.N. Lawn (Ref: ${submittedEnquiry.referenceCode}) for ${submittedEnquiry.preferredDate}. Please let me know the availability.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              <a
                href="tel:+919450023456"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-stone-200 hover:bg-stone-300"
              >
                <Phone className="w-4 h-4" />
                <span>Call Venue Desk</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedEnquiry(null);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setPreferredDate('');
                  setMessage('');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-10">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Customer Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Verma"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                      errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-stone-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98390 12345"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                      errors.phone ? 'border-red-500 bg-red-50/30' : 'border-stone-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email & Event Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. verma.family@example.com"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                      errors.email ? 'border-red-500 bg-red-50/30' : 'border-stone-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] bg-white"
                  >
                    <option value="Wedding Ceremony">Wedding Ceremony (Vivah)</option>
                    <option value="Wedding Reception">Wedding Reception Gala</option>
                    <option value="Ring Ceremony / Engagement">Ring Ceremony / Engagement</option>
                    <option value="Sangeet & Haldi Night">Sangeet & Haldi Night</option>
                    <option value="Silver / Golden Anniversary">Silver / Golden Anniversary</option>
                    <option value="Birthday & Family Gathering">Birthday & Family Gathering</option>
                    <option value="Corporate / Community Function">Corporate / Community Function</option>
                  </select>
                  {errors.eventType && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.eventType}</p>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Preferred Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                      errors.preferredDate ? 'border-red-500 bg-red-50/30' : 'border-stone-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Alternative Date <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={alternativeDate}
                    onChange={(e) => setAlternativeDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Estimated Guests <span className="text-stone-400 font-normal">(Approx)</span>
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] bg-white"
                  >
                    <option value="200">Up to 250 Guests</option>
                    <option value="500">250 to 500 Guests</option>
                    <option value="800">500 to 800 Guests</option>
                    <option value="1200">800 to 1,200+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Message / Special Needs */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Message / Special Requirements
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your timing, catering preferences, mandap decoration, or sound requirements..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-stone-300 text-[#183D32] focus:ring-[#C6A66B]"
                  />
                  <span className="text-xs text-stone-600 leading-snug">
                    I understand this is an availability enquiry and request the K.N. Lawn proprietor to contact me by phone or WhatsApp with venue details and schedule confirmation. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium pl-7">{errors.consent}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-stone-500">
                  Response within 24 hours · No payment required for enquiry
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow hover:shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Booking Enquiry'}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};
