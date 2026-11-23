import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';
import { useApiData } from '../../hooks/useApiData';
import { PublicEvent } from '../../types';

export const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { data, error, isLoading, reload } = useApiData<{ events: PublicEvent[] }>('/events');
  const events = data?.events ?? [];
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const categories = [
    { id: 'all', label: 'All Celebrations' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'reception', label: 'Receptions' },
    { id: 'engagement', label: 'Engagements' },
    { id: 'anniversary', label: 'Anniversaries' },
    { id: 'celebration', label: 'Family Parties' },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesCategory =
      activeCategory === 'all' || evt.category === activeCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="bg-[#102820] text-white py-16 border-b border-[#C6A66B]/30 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A66B]/20 text-[#DFC493] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Portfolio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F5EF]">
            Events & Celebration Gallery
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F8F5EF]/80 max-w-2xl mx-auto leading-relaxed">
            Browse through real weddings, elegant evening receptions, and festive gatherings held at K.N. Lawn.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#183D32] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search albums by name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] focus:border-transparent bg-stone-50/50"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-8">
          {isLoading ? (
            <p className="text-center text-sm text-stone-500 py-20">Loading albums…</p>
          ) : error ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-sm text-stone-700">We could not load the albums right now.</p>
              <button
                type="button"
                onClick={reload}
                className="px-4 py-2 text-xs font-semibold text-[#183D32] border border-[#183D32]/30 rounded-lg hover:bg-stone-50"
              >
                Try again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 max-w-lg mx-auto">
              <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-stone-800">
                No matching albums found
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Try selecting a different celebration category or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#183D32] border border-[#183D32]/30 rounded-lg hover:bg-stone-50"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((evt) => (
                <Link
                  key={evt.id}
                  to={`/events/${evt.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={evt.coverImageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#102820]/85 backdrop-blur-sm text-xs font-medium text-[#DFC493] px-2.5 py-1 rounded">
                      {evt.category.toUpperCase()}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[11px] text-white px-2 py-0.5 rounded font-mono">
                      {evt.images.length} Photos
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-stone-500 font-mono mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                        <span>{evt.eventDate}</span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-[#102820] group-hover:text-[#183D32] transition-colors leading-snug line-clamp-2">
                        {evt.title}
                      </h2>
                      <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500">
                        {evt.guestCountEstimated ? `Est. ${evt.guestCountEstimated} Guests` : 'Full Lawn Setup'}
                      </span>
                      <span className="font-semibold text-[#183D32] group-hover:text-[#C6A66B] flex items-center gap-1">
                        Explore Album <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
