import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Image,
  Inbox,
  Settings,
  Plus,
  ArrowRight,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { LawnEvent, BookingEnquiry, AvailabilityBlock } from '../../types';
import { getTodayIST } from '../../utils/date';

export const AdminDashboardPage: React.FC = () => {
  const [events, setEvents] = useState<LawnEvent[]>(() => dataService.getEvents(false));
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>(() => dataService.getEnquiries());
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(() => dataService.getAvailabilityBlocks());

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setEvents(dataService.getEvents(false));
      setEnquiries(dataService.getEnquiries());
      setBlocks(dataService.getAvailabilityBlocks());
    });
    return unsub;
  }, []);

  // Metrics
  const publishedEventsCount = events.filter((e) => e.status === 'published').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'pending' || e.status === 'contacted').length;
  const blockedDatesCount = blocks.filter((b) => b.status === 'unavailable').length;

  const recentEnquiries = enquiries.slice(0, 5);
  const upcomingEvents = events
    .filter((e) => e.eventDate >= getTodayIST())
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#102820]">
            Venue Management Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time status of bookings, lawn schedule, and portfolio publications.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#183D32] hover:bg-[#102820] shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#DFC493]" />
            <span>Add New Event</span>
          </Link>
          <Link
            to="/admin/availability"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Manage Calendar</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>
            <strong>Prototype Demo Mode:</strong> Changes are saved in your browser session and immediately synchronize with the public website.
          </span>
        </div>
        <Link to="/" target="_blank" className="font-semibold text-amber-900 hover:underline shrink-0 text-[11px] flex items-center gap-1">
          <span>Open Public Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">New Enquiries</span>
            <Inbox className="w-4 h-4 text-[#C6A66B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#183D32]">
            {newEnquiriesCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Awaiting first proprietor response
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Discussion</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900">
            {pendingEnquiriesCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Site visit or token advance pending
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Blocked Dates</span>
            <CalendarDays className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-900">
            {blockedDatesCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Confirmed unavailable on calendar
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Albums</span>
            <Image className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900">
            {publishedEventsCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Published in public gallery
          </div>
        </div>
      </div>

      {/* Main Content: Recent Enquiries & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#102820]">
                Recently Received Enquiries
              </h2>
              <p className="text-xs text-stone-500">
                Incoming customer requests via online booking form
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-[#183D32] hover:text-[#C6A66B] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Event Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-stone-800">
                      {enq.referenceCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{enq.customerName}</div>
                      <div className="text-[11px] text-stone-500">{enq.eventType}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-700">
                      {enq.preferredDate}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          enq.status === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'contacted'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`tel:${enq.phone}`}
                          title="Call Customer"
                          className="p-1 rounded bg-stone-100 text-stone-700 hover:bg-[#183D32] hover:text-white transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Customer"
                          className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          to={`/admin/enquiries?id=${enq.id}`}
                          className="px-2 py-1 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 text-[11px] font-semibold"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Scheduled Events */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-display text-base font-bold text-[#102820]">
                Upcoming Scheduled Events
              </h2>
              <p className="text-[11px] text-stone-500">From live portfolio albums</p>
            </div>
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-[#183D32] hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <img
                  src={evt.coverImageUrl}
                  alt={evt.title}
                  className="w-12 h-12 rounded object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-stone-900 truncate">
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5 font-mono">
                    <span>{evt.eventDate}</span>
                    <span>·</span>
                    <span className="uppercase text-[10px] text-[#C6A66B] font-sans font-bold">
                      {evt.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/admin/settings"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 hover:bg-stone-50"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>Edit Lawn & Contact Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
