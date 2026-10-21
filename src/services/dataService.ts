import {
  LawnEvent,
  AvailabilityBlock,
  BookingEnquiry,
  SiteSettings,
  AdminUser,
  AvailabilityStatus,
  EnquiryStatus,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_EVENTS,
  INITIAL_AVAILABILITY_BLOCKS,
  INITIAL_ENQUIRIES,
  INITIAL_ADMIN_USER,
} from './mockData';
import { getTodayIST } from '../utils/date';

const STORAGE_KEYS = {
  SETTINGS: 'kn_lawn_settings_v1',
  EVENTS: 'kn_lawn_events_v1',
  AVAILABILITY: 'kn_lawn_availability_v1',
  ENQUIRIES: 'kn_lawn_enquiries_v1',
  AUTH: 'kn_lawn_admin_session_v1',
};

// Safe localStorage access with memory fallback
class DataStore {
  private memoryFallback: Record<string, any> = {};

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch {
      if (this.memoryFallback[key] !== undefined) {
        return this.memoryFallback[key] as T;
      }
    }
    return defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      this.memoryFallback[key] = value;
    }
  }

  // --- Settings ---
  getSettings(): SiteSettings {
    return this.getItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  updateSettings(updated: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const merged = { ...current, ...updated };
    this.setItem(STORAGE_KEYS.SETTINGS, merged);
    this.notifyChange('settings');
    return merged;
  }

  // --- Events ---
  getEvents(onlyPublished = false): LawnEvent[] {
    const all = this.getItem<LawnEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    if (onlyPublished) {
      return all.filter((e) => e.status === 'published');
    }
    return all;
  }

  getEventBySlug(slug: string): LawnEvent | undefined {
    const events = this.getEvents(false);
    return events.find((e) => e.slug === slug);
  }

  getEventById(id: string): LawnEvent | undefined {
    const events = this.getEvents(false);
    return events.find((e) => e.id === id);
  }

  saveEvent(eventData: Partial<LawnEvent> & { title: string }): LawnEvent {
    const events = this.getEvents(false);
    const now = new Date().toISOString();

    if (eventData.id) {
      // Update
      const index = events.findIndex((e) => e.id === eventData.id);
      if (index === -1) throw new Error('Event not found');
      const updatedEvent: LawnEvent = {
        ...events[index],
        ...eventData,
        updatedAt: now,
      };
      events[index] = updatedEvent;
      this.setItem(STORAGE_KEYS.EVENTS, events);
      this.notifyChange('events');
      return updatedEvent;
    } else {
      // Create
      const slug =
        eventData.slug ||
        eventData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

      const newEvent: LawnEvent = {
        id: `evt-${Date.now()}`,
        title: eventData.title,
        slug,
        category: eventData.category || 'wedding',
        eventDate: eventData.eventDate || getTodayIST(),
        endDate: eventData.endDate,
        description: eventData.description || '',
        coverImageUrl: eventData.coverImageUrl || '/images/hero_wedding_lawn_1792477779485.jpg',
        images: eventData.images && eventData.images.length > 0 ? eventData.images : ['/images/hero_wedding_lawn_1792477779485.jpg'],
        status: eventData.status || 'draft',
        featured: Boolean(eventData.featured),
        guestCountEstimated: eventData.guestCountEstimated,
        createdAt: now,
        updatedAt: now,
      };
      events.unshift(newEvent);
      this.setItem(STORAGE_KEYS.EVENTS, events);
      this.notifyChange('events');
      return newEvent;
    }
  }

  deleteEvent(id: string): void {
    const events = this.getEvents(false);
    const filtered = events.filter((e) => e.id !== id);
    this.setItem(STORAGE_KEYS.EVENTS, filtered);
    this.notifyChange('events');
  }

  // --- Availability ---
  getAvailabilityBlocks(): AvailabilityBlock[] {
    return this.getItem<AvailabilityBlock[]>(
      STORAGE_KEYS.AVAILABILITY,
      INITIAL_AVAILABILITY_BLOCKS
    );
  }

  getDateStatus(dateStr: string): {
    status: AvailabilityStatus;
    block?: AvailabilityBlock;
  } {
    const blocks = this.getAvailabilityBlocks();
    // A date falls in block if startDate <= dateStr <= endDate
    const match = blocks.find(
      (b) => dateStr >= b.startDate && dateStr <= b.endDate
    );
    if (match) {
      return { status: match.status, block: match };
    }
    return { status: 'available' };
  }

  checkConflict(
    startDate: string,
    endDate: string,
    excludeBlockId?: string
  ): AvailabilityBlock | null {
    const blocks = this.getAvailabilityBlocks();
    for (const b of blocks) {
      if (excludeBlockId && b.id === excludeBlockId) continue;
      // Overlap formula: (startDate <= b.endDate) and (endDate >= b.startDate)
      if (startDate <= b.endDate && endDate >= b.startDate) {
        if (b.status === 'unavailable' || b.status === 'pending') {
          return b;
        }
      }
    }
    return null;
  }

  saveAvailabilityBlock(
    blockData: Omit<AvailabilityBlock, 'id' | 'createdAt'> & { id?: string }
  ): { success: boolean; conflictBlock?: AvailabilityBlock; block?: AvailabilityBlock } {
    const conflict = this.checkConflict(
      blockData.startDate,
      blockData.endDate,
      blockData.id
    );

    if (conflict) {
      return { success: false, conflictBlock: conflict };
    }

    const blocks = this.getAvailabilityBlocks();
    const now = new Date().toISOString();

    if (blockData.id) {
      const idx = blocks.findIndex((b) => b.id === blockData.id);
      if (idx !== -1) {
        const updated = { ...blocks[idx], ...blockData };
        blocks[idx] = updated;
        this.setItem(STORAGE_KEYS.AVAILABILITY, blocks);
        this.notifyChange('availability');
        return { success: true, block: updated };
      }
    }

    const newBlock: AvailabilityBlock = {
      ...blockData,
      id: `av-${Date.now()}`,
      createdAt: now,
    };
    blocks.push(newBlock);
    this.setItem(STORAGE_KEYS.AVAILABILITY, blocks);
    this.notifyChange('availability');
    return { success: true, block: newBlock };
  }

  deleteAvailabilityBlock(id: string): void {
    const blocks = this.getAvailabilityBlocks();
    const filtered = blocks.filter((b) => b.id !== id);
    this.setItem(STORAGE_KEYS.AVAILABILITY, filtered);
    this.notifyChange('availability');
  }

  // --- Enquiries ---
  getEnquiries(): BookingEnquiry[] {
    return this.getItem<BookingEnquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  }

  getEnquiryById(id: string): BookingEnquiry | undefined {
    return this.getEnquiries().find((e) => e.id === id);
  }

  submitEnquiry(
    data: Omit<BookingEnquiry, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'updatedAt'>
  ): BookingEnquiry {
    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `KNL-2026-${randomSuffix}`;

    const newEnquiry: BookingEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      referenceCode,
      status: 'new',
      createdAt: now,
      updatedAt: now,
      privateAdminNotes: 'Submitted through online public enquiry form.',
    };

    const enquiries = this.getEnquiries();
    enquiries.unshift(newEnquiry);
    this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    this.notifyChange('enquiries');
    return newEnquiry;
  }

  updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    adminNotes?: string,
    createCalendarBlock = false
  ): { enquiry: BookingEnquiry; blockCreated?: AvailabilityBlock; conflict?: AvailabilityBlock } {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Enquiry not found');

    const enquiry = enquiries[idx];
    let conflictFound: AvailabilityBlock | null = null;
    let createdBlock: AvailabilityBlock | undefined = undefined;

    if (status === 'confirmed' && createCalendarBlock) {
      const conflict = this.checkConflict(enquiry.preferredDate, enquiry.preferredDate);
      if (conflict) {
        conflictFound = conflict;
      } else {
        const blockResult = this.saveAvailabilityBlock({
          startDate: enquiry.preferredDate,
          endDate: enquiry.preferredDate,
          status: 'unavailable',
          privateNote: `Confirmed Booking: ${enquiry.customerName} (${enquiry.referenceCode})`,
          linkedBookingId: enquiry.id,
        });
        if (blockResult.block) {
          createdBlock = blockResult.block;
        }
      }
    }

    const updated: BookingEnquiry = {
      ...enquiry,
      status,
      updatedAt: new Date().toISOString(),
      privateAdminNotes: adminNotes !== undefined ? adminNotes : enquiry.privateAdminNotes,
    };

    enquiries[idx] = updated;
    this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    this.notifyChange('enquiries');

    return {
      enquiry: updated,
      blockCreated: createdBlock,
      conflict: conflictFound || undefined,
    };
  }

  // --- Auth ---
  getCurrentAdminUser(): AdminUser | null {
    return this.getItem<AdminUser | null>(STORAGE_KEYS.AUTH, null);
  }

  loginAdmin(email: string, pass: string): { success: boolean; user?: AdminUser; error?: string } {
    // In this prototype, mock owner credentials for review
    if (email.toLowerCase() === 'admin@knlawn.com' && pass === 'admin123') {
      const user = INITIAL_ADMIN_USER;
      this.setItem(STORAGE_KEYS.AUTH, user);
      this.notifyChange('auth');
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password. Use demo credentials: admin@knlawn.com / admin123' };
  }

  logoutAdmin(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      delete this.memoryFallback[STORAGE_KEYS.AUTH];
    }
    this.notifyChange('auth');
  }

  // --- Reset to Factory Demo Defaults ---
  resetToDefaults(): void {
    this.setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    this.setItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.setItem(STORAGE_KEYS.AVAILABILITY, INITIAL_AVAILABILITY_BLOCKS);
    this.setItem(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    this.notifyChange('all');
  }

  // Event listener subscription for multi-component reactivity
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyChange(_domain: string): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export const dataService = new DataStore();
