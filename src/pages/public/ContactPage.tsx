import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { SiteSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => dataService.getSettings());
  const toast = useToast();

  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setSettings(dataService.getSettings());
    });
    return unsub;
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderContact.trim() || !message.trim()) {
      toast.error('Please complete all message fields.');
      return;
    }

    // In this prototype, mock sending direct enquiry
    setIsSent(true);
    toast.success('Your message has been sent to the proprietor.');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-[#102820] text-white py-16 border-b border-[#C6A66B]/30 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A66B]/20 text-[#DFC493] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Communications</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F5EF]">
            Contact & Venue Directions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F8F5EF]/80 max-w-2xl mx-auto leading-relaxed">
            Reach out to our management for venue bookings, visiting appointments, and event planning inquiries.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#102820]">
                  Get in Touch
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  We are glad to assist you with dates, quotes, and on-site visits.
                </p>
              </div>

              <div className="space-y-5 text-xs text-stone-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#183D32]/10 text-[#183D32] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#102820]">Venue Address</strong>
                    <address className="not-italic leading-relaxed text-stone-600 mt-0.5">
                      {settings.address}
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#183D32]/10 text-[#183D32] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#102820]">Phone Call</strong>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-[#183D32] hover:text-[#C6A66B] font-semibold text-xs transition-colors"
                    >
                      {settings.phone}
                    </a>
                    <span className="block text-[11px] text-stone-500 mt-0.5">
                      {settings.ownerName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#102820]">WhatsApp Chat</strong>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline font-semibold text-xs"
                    >
                      Chat on WhatsApp ({settings.whatsapp})
                    </a>
                    <span className="block text-[11px] text-stone-500 mt-0.5">
                      Instant response for date and brochure queries
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#183D32]/10 text-[#183D32] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#102820]">Email Address</strong>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[#183D32] hover:underline font-medium"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#183D32]/10 text-[#183D32] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#102820]">Visiting & Enquiry Hours</strong>
                    <span className="text-stone-600 block mt-0.5">
                      {settings.businessHours}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-3">
                <a
                  href={settings.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow"
                >
                  <Compass className="w-4 h-4" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <h3 className="font-display text-2xl font-bold text-[#102820] mb-2">
                Send a Message to Management
              </h3>
              <p className="text-xs text-stone-600 mb-6">
                Have questions about lawn capacity, catering permissions, or custom lighting setup? Send us a quick note.
              </p>

              {isSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-display text-lg font-bold text-emerald-900">
                    Message Delivered
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you. We have received your note and will reach back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setMessage('');
                    }}
                    className="mt-2 text-xs font-semibold text-emerald-900 underline"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Alok Mishra"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone or Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={senderContact}
                        onChange={(e) => setSenderContact(e.target.value)}
                        placeholder="e.g. 98390 12345 or email"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Message or Inquiry <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about dates, timing, mandap arrangement, or general questions..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#183D32] hover:bg-[#102820] shadow"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Embedded Google Map */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-stone-200 shadow-sm h-80 bg-stone-100">
              <iframe
                title="K.N. Lawn Map Directions"
                src={settings.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
