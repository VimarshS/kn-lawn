export type EventCategory =
  | 'wedding'
  | 'engagement'
  | 'reception'
  | 'birthday'
  | 'anniversary'
  | 'celebration';

export interface LawnEvent {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  eventDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  description: string;
  coverImageUrl: string;
  images: string[];
  status: 'draft' | 'published';
  featured?: boolean;
  guestCountEstimated?: number;
  createdAt: string;
  updatedAt: string;
}

/** An event as the public API returns it: no status and no timestamps. */
export type PublicEvent = Omit<LawnEvent, 'status' | 'createdAt' | 'updatedAt'>;

export type AvailabilityStatus = 'available' | 'unavailable' | 'pending';

export interface AvailabilityBlock {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: AvailabilityStatus;
  privateNote: string;
  linkedBookingId?: string;
  createdAt?: string;
}

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled';

export interface BookingEnquiry {
  id: string;
  referenceCode: string;
  customerName: string;
  phone: string;
  email?: string;
  eventType: string;
  preferredDate: string;
  alternativeDate?: string;
  guestCount?: number;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  privateAdminNotes?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isHighlight: boolean;
}

export interface SiteSettings {
  lawnName: string;
  description: string;
  address: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapsEmbedUrl: string;
  directionsUrl: string;
  businessHours: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  heroHeading: string;
  heroDescription: string;
  heroImageUrl: string;
  aboutStory: string;
  facilities: Facility[];
  enquiryInstructions: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager';
  createdAt?: string;
}
