import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  FileEdit,
  Sparkles,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { api, ApiError } from '../../services/api';
import { useApiData } from '../../hooks/useApiData';
import { useAuth } from '../../context/AuthContext';
import { LawnEvent } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminEventsPage: React.FC = () => {
  const toast = useToast();
  const { logout } = useAuth();
  const { data, error, isLoading, reload } = useApiData<{ events: LawnEvent[] }>('/admin/events');
  const events = data?.events ?? [];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Delete modal state
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Shows the server's own message. If the login has ended, goes back to the login page.
  const reportError = async (err: unknown, fallback: string) => {
    if (err instanceof ApiError && err.status === 401) {
      toast.error('Your session has ended. Please log in again.');
      await logout();
      return;
    }
    toast.error(err instanceof ApiError ? err.message : fallback);
  };

  const handleToggleStatus = async (evt: LawnEvent) => {
    const nextStatus = evt.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/admin/events/${evt.id}/status`, { status: nextStatus });
      toast.success(`Event status changed to ${nextStatus}.`);
      reload();
    } catch (err) {
      await reportError(err, 'Could not change the status.');
    }
  };

  const confirmDelete = async () => {
    if (!deletingEventId) return;
    try {
      await api.delete(`/admin/events/${deletingEventId}`);
      toast.success('Event album has been deleted.');
      reload();
    } catch (err) {
      await reportError(err, 'Could not delete the event.');
    } finally {
      setDeletingEventId(null);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#102820]">
            Event Portfolio Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Publish wedding galleries, edit photo albums, and manage public portfolio showcases.
          </p>
        </div>

        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#183D32] hover:bg-[#102820] shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#DFC493]" />
          <span>Add New Event</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-stone-500 whitespace-nowrap">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] bg-white"
          >
            <option value="all">All Categories</option>
            <option value="wedding">Weddings</option>
            <option value="reception">Receptions</option>
            <option value="engagement">Engagements</option>
            <option value="anniversary">Anniversaries</option>
            <option value="celebration">Family Celebrations</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Cover</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    Loading events…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-stone-700 mb-2">Could not load the events.</p>
                    <button
                      type="button"
                      onClick={reload}
                      className="px-3 py-1.5 text-xs font-semibold text-[#183D32] border border-[#183D32]/30 rounded-lg hover:bg-stone-50"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No events match your criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={evt.coverImageUrl}
                        alt={evt.title}
                        className="w-14 h-11 object-cover rounded-md border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-stone-900 line-clamp-1">{evt.title}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{evt.images.length} Photos</span>
                        <span>·</span>
                        <span>{evt.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-stone-700">
                      {evt.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-700">
                      {evt.eventDate}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(evt)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                          evt.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {evt.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <FileEdit className="w-3 h-3 text-stone-500" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {evt.status === 'published' && (
                          <Link
                            to={`/events/${evt.slug}`}
                            target="_blank"
                            title="View on Public Site"
                            className="p-1.5 rounded text-stone-600 hover:bg-stone-100 hover:text-[#183D32]"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/events/${evt.id}/edit`}
                          title="Edit Event"
                          className="p-1.5 rounded text-stone-600 hover:bg-stone-100 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingEventId(evt.id)}
                          title="Delete Event"
                          className="p-1.5 rounded text-stone-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Confirmation Dialog Modal */}
      {deletingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display text-lg font-bold text-stone-900">
                Confirm Event Deletion
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete this event album from the portfolio? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingEventId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
