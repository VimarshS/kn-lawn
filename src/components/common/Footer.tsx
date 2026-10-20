import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#102820] text-[#F8F5EF] border-t border-[#C6A66B]/30 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full border border-[#C6A66B] flex items-center justify-center bg-[#183D32] text-[#C6A66B] font-display text-lg font-bold">
                KN
              </div>
              <span className="font-display text-2xl font-bold tracking-wide text-[#F8F5EF]">
                K.N. Lawn
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#F8F5EF]/75 font-sans">
              A premier open-air wedding and celebratory lawn venue in Rae Bareli.
              Offering lush lawns, regal illumination, and traditional hospitality
              for life’s most cherished milestones.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/919450023456"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-[#C6A66B]/50 text-[#DFC493] hover:bg-[#183D32] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="tel:+919450023456"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-[#C6A66B]/50 text-[#DFC493] hover:bg-[#183D32] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Call Venue</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-[#DFC493] tracking-wide mb-4">
              Explore Venue
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#F8F5EF]/80">
              <li>
                <Link to="/" className="hover:text-[#DFC493] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#DFC493] transition-colors">
                  About K.N. Lawn & Heritage
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#DFC493] transition-colors">
                  Wedding & Reception Gallery
                </Link>
              </li>
              <li>
                <Link to="/availability" className="hover:text-[#DFC493] transition-colors">
                  Check Calendar Availability
                </Link>
              </li>
              <li>
                <Link to="/enquire" className="hover:text-[#DFC493] transition-colors">
                  Submit Booking Enquiry
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#DFC493] transition-colors">
                  Location & Driving Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Visiting Hours */}
          <div>
            <h4 className="font-display text-base font-semibold text-[#DFC493] tracking-wide mb-4">
              Contact & Visits
            </h4>
            <div className="space-y-3 text-xs text-[#F8F5EF]/80">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-[#F8F5EF]">+91 94500 23456</div>
                  <span className="text-[11px] text-[#F8F5EF]/60">Proprietor / Booking Desk</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <a
                  href="mailto:contact@knlawn.com"
                  className="hover:text-[#DFC493] transition-colors"
                >
                  contact@knlawn.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#F8F5EF]">9:00 AM – 8:00 PM Daily</div>
                  <span className="text-[11px] text-[#F8F5EF]/60">For site visits & consultation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Map Direction */}
          <div>
            <h4 className="font-display text-base font-semibold text-[#DFC493] tracking-wide mb-4">
              Venue Location
            </h4>
            <div className="space-y-3 text-xs text-[#F8F5EF]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  K.N. Lawn, Near Sultanpur Road / Highway Junction,
                  Rae Bareli, Uttar Pradesh 229001
                </address>
              </div>
              <div>
                <a
                  href="https://www.google.com/maps/place/K.N.+Lawn/@26.2340202,81.2282857,17z/data=!4m8!3m7!1s0x399ba1fecc044b89:0xa25560fcbd641e7c!8m2!3d26.2340154!4d81.2308606!9m1!1b1!16s%2Fg%2F11fsnh0lvw"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#DFC493] hover:underline font-medium"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F5EF]/60">
          <p>© {currentYear} K.N. Lawn. All rights reserved. Indian Wedding & Event Venue.</p>

          <div className="flex items-center gap-6">
            <span className="text-[11px]">Rae Bareli, Uttar Pradesh</span>
            <span aria-hidden="true">·</span>
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              className="inline-flex items-center gap-1 text-[#DFC493] hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Admin Workspace' : 'Owner Sign In'}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
