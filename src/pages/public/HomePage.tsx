import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Trees,
  DoorClosed,
  Zap,
  Utensils,
  Car,
  LampFloor,
  Clock,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useSettings } from '../../hooks/useSettings';
import { LawnEvent } from '../../types';
import { AvailabilityCalendar } from '../../components/calendar/AvailabilityCalendar';

export const HomePage: React.FC = () => {
  const settings = useSettings();
  const [featuredEvents, setFeaturedEvents] = useState<LawnEvent[]>(() =>
    dataService.getEvents(true).slice(0, 3)
  );

  useEffect(() => {
    const unsub = dataService.subscribe(() => { 
      setFeaturedEvents(dataService.getEvents(true).slice(0, 3));
    });
    return unsub;
  }, []);

  const eventCategories = [
    {
      title: 'Grand Weddings',
      desc: 'Sprawling green lawns under illuminated star-lit canopies and custom mandap architecture.',
      image: '/images/hero_wedding_lawn_1792477779485.jpg',
      category: 'wedding',
    },
    {
      title: 'Evening Receptions',
      desc: 'Sophisticated open-air stage setups, banquet table hospitality, and live acoustics.',
      image: '/images/lawn_reception_stage_1792477779365.jpg',
      category: 'reception',
    },
    {
      title: 'Vedic Pheras & Sangeet',
      desc: 'Sacred ceremonies, fragrant marigold decor, brass diyas, and celebratory family vibes.',
      image: '/images/lawn_mandap_ceremony_1792477779867.jpg',
      category: 'wedding',
    },
    {
      title: 'Engagements & Anniversaries',
      desc: 'Intimate royal celebrations with grand illuminated floral walkways and customized catering lawns.',
      image: '/images/lawn_entrance_walkway_1792477779864.jpg',
      category: 'engagement',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Full-width Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImageUrl || '/images/hero_wedding_lawn_1792477779485.jpg'}
            alt="K.N. Lawn illuminated wedding celebration"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Measured Scrim & Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#102820] via-[#102820]/70 to-[#102820]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#F8F5EF] pt-12 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C6A66B]/20 border border-[#C6A66B]/40 text-[#DFC493] text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Rae Bareli’s Premier Wedding & Event Lawn</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#F8F5EF] max-w-4xl mx-auto text-balance">
            {settings.heroHeading}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#F8F5EF]/85 max-w-2xl mx-auto font-sans leading-relaxed">
            {settings.heroDescription}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/availability"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Check Availability
            </Link>

            <Link
              to="/events"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg text-sm font-semibold tracking-wider text-[#F8F5EF] border border-[#C6A66B]/50 hover:bg-[#183D32]/80 hover:border-[#C6A66B] backdrop-blur-sm transition-all duration-200"
            >
              Explore Our Gallery
            </Link>
          </div>

          {/* Key Venue Attributes Strip */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="text-white/90">
              <div className="font-display text-xl sm:text-2xl font-bold text-[#DFC493]">Sprawling</div>
              <div className="text-xs text-white/70">Manicured Open Lawn</div>
            </div>
            <div className="text-white/90">
              <div className="font-display text-xl sm:text-2xl font-bold text-[#DFC493]">1,200+</div>
              <div className="text-xs text-white/70">Guest Gathering Space</div>
            </div>
            <div className="text-white/90">
              <div className="font-display text-xl sm:text-2xl font-bold text-[#DFC493]">Illuminated</div>
              <div className="text-xs text-white/70">Floral Entry & Mandap</div>
            </div>
            <div className="text-white/90">
              <div className="font-display text-xl sm:text-2xl font-bold text-[#DFC493]">100%</div>
              <div className="text-xs text-white/70">Silent Power Backup</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Venue Introduction & Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Welcome to K.N. Lawn
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#102820] leading-snug">
              An Idyllic Lawn for Life’s Most Revered Celebrations
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              Located conveniently in Rae Bareli, K.N. Lawn offers an open-air sanctuary designed for royal Indian weddings, ring ceremonies, and celebratory galas. From the moment guests arrive through our illuminated floral gateway, they are greeted by lush emerald grass, grand banquet spaces, and dedicated hospitality.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              Whether you are planning a traditional Vedic mandap ritual under the starlit night or a lively Sangeet evening, our expansive grounds and personalized coordination ensure your family’s event is seamless and memorable.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#183D32] hover:text-[#C6A66B] transition-colors group"
              >
                <span>Discover Our Venue Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-stone-300">|</span>
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C6A66B] hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>Call: {settings.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/images/lawn_mandap_ceremony_1792477779867.jpg"
                  alt="Vedic Mandap ceremony at K.N. Lawn"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#183D32] text-white p-5 rounded-xl shadow-xl hidden sm:block max-w-xs border border-[#C6A66B]/40">
                <div className="font-display text-lg font-bold text-[#DFC493]">
                  Host with Confidence
                </div>
                <div className="text-xs text-white/80 mt-1">
                  Dedicated bridal suites, heavy power backup, and catering layouts ready for your vendors.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Event Categories Showcase */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Celebrations
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#102820] mt-1">
              Events We Host
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Each function has its own cadence. Our flexible lawn layout seamlessly accommodates every ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventCategories.map((cat) => (
              <Link
                key={cat.title}
                to={`/events?category=${cat.category}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200/80 transition-all duration-200 flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs uppercase font-semibold tracking-wider text-white bg-[#102820]/80 px-2.5 py-1 rounded">
                    {cat.title}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#183D32] group-hover:text-[#C6A66B]">
                    <span>View Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Events Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Portfolio & Memories
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#102820] mt-1">
              Recent Celebrations at K.N. Lawn
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#183D32] hover:text-[#C6A66B] transition-colors"
          >
            <span>View All Event Albums</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.map((evt) => (
            <Link
              key={evt.id}
              to={`/events/${evt.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={evt.coverImageUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#102820]/80 backdrop-blur-sm text-xs font-medium text-[#DFC493] px-2.5 py-1 rounded">
                  {evt.category.toUpperCase()}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[11px] text-white px-2 py-0.5 rounded font-mono">
                  {evt.images.length} Photos
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-stone-500 font-mono mb-1">
                    {evt.eventDate}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#102820] group-hover:text-[#183D32] transition-colors leading-snug line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Est. {evt.guestCountEstimated || 500}+ Guests
                  </span>
                  <span className="font-semibold text-[#183D32] group-hover:text-[#C6A66B] flex items-center gap-1">
                    View Album <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Venue Highlights & Facilities Section (Configurable by Owner) */}
      <section className="bg-[#102820] text-[#F8F5EF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#DFC493]">
              Lawn Facilities
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F8F5EF] mt-1">
              Thoughtfully Equipped for Grand Events
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#F8F5EF]/75">
              Everything required to orchestrate a memorable wedding ceremony, royal banquet, and seamless guest hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-[#183D32]/80 border border-[#C6A66B]/30 rounded-xl p-5 hover:border-[#C6A66B] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#C6A66B]/20 border border-[#C6A66B]/40 flex items-center justify-center text-[#DFC493] mb-4">
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
                <h3 className="font-display text-base font-bold text-[#F8F5EF]">
                  {fac.name}
                </h3>
                <p className="mt-2 text-xs text-[#F8F5EF]/80 leading-relaxed font-sans">
                  {fac.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Prominent Availability & Calendar CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Real-time Availability
            </div>
            <h2 className="font-display text-3xl font-bold text-[#102820]">
              Check Dates for Your Auspicious Celebration
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Wedding muhurats and auspicious dates fill quickly during the peak wedding seasons. Use our live calendar to review available, blocked, and pending dates.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-100 border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-snug">
                  <strong>Transparent Status:</strong> Review which dates are currently open before contacting family members or vendors.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-100 border border-stone-200">
                <Clock className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-snug">
                  <strong>Prompt Owner Response:</strong> Enquiries submitted through the portal are responded to within 24 hours.
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Submit Direct Enquiry</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AvailabilityCalendar />
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section (Transparent Editable Sample Placeholders) */}
      <section className="bg-stone-50 py-16 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A66B]">
              Guest Experiences
            </div>
            <h2 className="font-display text-3xl font-bold text-[#102820] mt-1">
              Memories from Families
            </h2>
            <div className="inline-block mt-2 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
              Sample Reviews Placeholder (Owner can update with verified Google & guest testimonials)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                “Our daughter’s wedding was celebrated here with over 750 guests. The manicured lawn looked spectacular under fairy lights and the generator backup kept everything uninterrupted throughout the night.”
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-xs">
                  RM
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">R. Mishra & Family</div>
                  <div className="text-[11px] text-stone-500">Wedding Ceremony Host</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                “The spacious bridal room gave our daughter complete comfort while getting ready. The entrance walkway with floral arches was the highlight of our reception photos.”
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-xs">
                  SS
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">S. Sharma</div>
                  <div className="text-[11px] text-stone-500">Reception Gala Host</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                “Convenient road access from Sultanpur Highway and ample space for car parking. The lawn management was extremely supportive with sound and catering vendor setups.”
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#183D32] text-[#DFC493] flex items-center justify-center font-display font-bold text-xs">
                  AT
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">A. Tiwari</div>
                  <div className="text-[11px] text-stone-500">Engagement & Sangeet Host</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Location & Embedded Google Map Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Details Column */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#183D32] text-white">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#DFC493]">
                  Find Us
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  Visit K.N. Lawn
                </h3>
                <p className="text-xs text-white/80 mt-2">
                  We welcome families and wedding planners for on-site walk-throughs and layout consultations.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Venue Address</strong>
                    <span className="text-white/80 leading-relaxed block mt-0.5">
                      {settings.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Direct Phone</strong>
                    <a href={`tel:${settings.phone}`} className="text-[#DFC493] hover:underline font-medium">
                      {settings.phone}
                    </a>
                    <span className="block text-[11px] text-white/60">
                      {settings.ownerName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Visiting Hours</strong>
                    <span className="text-white/80">{settings.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap gap-3">
              <a
                href={settings.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow"
              >
                <Compass className="w-4 h-4" />
                <span>Get Driving Directions</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white border border-white/30 hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Map Embed Column */}
          <div className="lg:col-span-7 h-[360px] lg:h-auto min-h-[360px] relative bg-stone-100">
            <iframe
              title="K.N. Lawn Google Maps Location"
              src={settings.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
