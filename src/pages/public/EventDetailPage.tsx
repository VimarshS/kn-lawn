import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  ArrowLeft,
  CalendarCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useApiData } from '../../hooks/useApiData';
import { PublicEvent } from '../../types';
import { Lightbox } from '../../components/common/Lightbox';
import { useToast } from '../../context/ToastContext';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data, error, isLoading, reload } = useApiData<{ event: PublicEvent }>(
    `/events/${encodeURIComponent(slug ?? '')}`,
  );
  const event = data?.event;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (isLoading) {
    return <p className="text-center text-sm text-stone-500 py-24">Loading album…</p>;
  }

  // Something other than "not found" went wrong, for example the server was unreachable.
  if (error && error.status !== 404) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-3">
        <p className="text-sm text-stone-700">We could not load this album right now.</p>
        <button
          type="button"
          onClick={reload}
          className="px-4 py-2 text-xs font-semibold text-[#183D32] border border-[#183D32]/30 rounded-lg hover:bg-stone-50"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Celebration Album Not Found
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          This album may have been removed, or the link may be incorrect.
        </p>
        <Link
          to="/events"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#183D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Celebrations</span>
        </Link>
      </div>
    );
  }

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % event.images.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Album link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#183D32] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Albums</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-300 text-xs text-stone-700 hover:bg-stone-50"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Album</span>
          </button>
        </div>
      </div>

      {/* Main Event Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded bg-[#102820] text-[#DFC493] text-xs font-semibold uppercase tracking-wider">
              {event.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{event.eventDate}</span>
            </div>
            {event.guestCountEstimated && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Users className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Est. {event.guestCountEstimated} Guests</span>
              </div>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#102820] leading-tight max-w-4xl">
            {event.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans max-w-3xl">
            {event.description}
          </p>

          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Showing {event.images.length} photographs from this celebration
            </div>

            <Link
              to={`/enquire?type=${encodeURIComponent(event.category)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Enquire for a Similar {event.category}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Gallery Grid with Lightbox Triggers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {event.images.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-stone-100 border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <img
                src={imgUrl}
                alt={`${event.title} photograph ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Full Photo</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        images={event.images}
        currentIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        title={event.title}
      />
    </div>
  );
};
