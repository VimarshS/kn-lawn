import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Trees,
  DoorClosed,
  Zap,
  Utensils,
  Car,
  LampFloor,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { SiteSettings } from '../../types';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => dataService.getSettings());

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setSettings(dataService.getSettings());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Page Header Banner */}
      <section className="bg-[#102820] text-white py-16 sm:py-20 border-b border-[#C6A66B]/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/hero_wedding_lawn_1792477779485.jpg"
            alt="K.N. Lawn background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A66B]/20 text-[#DFC493] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Heritage & Hospitality</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F5EF]">
            About K.N. Lawn
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#F8F5EF]/80 max-w-2xl mx-auto leading-relaxed">
            A sanctuary of celebration designed to host India’s grandest traditions with elegance, space, and peace of mind.
          </p>
        </div>
      </section>

      {/* Main Narrative & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Our Foundation
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#102820] leading-snug">
              Crafted for Royal Moments & Joyous Family Gatherings
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed font-sans">
              {settings.aboutStory}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed font-sans">
              Indian weddings are multi-layered celebrations involving sacred rituals, joyous music, lavish banquets, and heartfelt reunions of extended families. At K.N. Lawn, our grounds are engineered to provide spacious, uninterrupted zones for each facet of your function: from the welcoming baraat entrance along our grand walkway to the sacred mandap and royal dining pavilions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <div className="font-display text-lg font-bold text-[#183D32]">
                  Open-Air Majesty
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  Ample ventilation, natural greenery, and unconstrained space under the starlit sky.
                </div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <div className="font-display text-lg font-bold text-[#183D32]">
                  Vendor Freedom
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  Flexible policies for your chosen caterers, decor stylists, and photographers.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src="/images/lawn_reception_stage_1792477779365.jpg"
                alt="Reception decor at K.N. Lawn"
                className="w-full h-72 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src="/images/lawn_entrance_walkway_1792477779864.jpg"
                alt="Grand entrance walkway at K.N. Lawn"
                className="w-full h-72 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Amenities Grid */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Venue Highlights
            </div>
            <h2 className="font-display text-3xl font-bold text-[#102820] mt-1">
              Facilities Included with Lawn Booking
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              Configured directly by the venue management to ensure transparency for prospective families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-[#183D32]/10 text-[#183D32] flex items-center justify-center mb-4">
                  {fac.iconName === 'Trees' && <Trees className="w-5 h-5" />}
                  {fac.iconName === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                  {fac.iconName === 'DoorClosed' && <DoorClosed className="w-5 h-5" />}
                  {fac.iconName === 'LampFloor' && <LampFloor className="w-5 h-5" />}
                  {fac.iconName === 'Car' && <Car className="w-5 h-5" />}
                  {fac.iconName === 'Zap' && <Zap className="w-5 h-5" />}
                  {fac.iconName === 'Utensils' && <Utensils className="w-5 h-5" />}
                  {!['Trees', 'Sparkles', 'DoorClosed', 'LampFloor', 'Car', 'Zap', 'Utensils'].includes(fac.iconName) && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-display text-base font-bold text-[#102820]">
                  {fac.name}
                </h3>
                <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                  {fac.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#183D32] rounded-2xl p-8 sm:p-12 text-center text-white border border-[#C6A66B]/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F8F5EF]">
              Plan Your Visit & Walk the Grounds
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Nothing compares to experiencing the sprawling greenery and evening atmosphere in person. Contact our proprietor or submit a date enquiry to schedule your consultation.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/availability"
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow"
              >
                Check Date Availability
              </Link>
              <a
                href={`tel:${settings.phone}`}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-semibold text-white border border-white/30 hover:bg-white/10"
              >
                Call: {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
