import { LawnEvent } from '../models/LawnEvent';

type EventDoc = InstanceType<typeof LawnEvent>;

/** The event fields that are safe to show to any visitor. */
export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  category: string;
  eventDate: string;
  endDate?: string;
  description: string;
  coverImageUrl: string;
  images: string[];
  featured: boolean;
  guestCountEstimated?: number;
}

// An allowlist: every field that leaves the server is named here, one by one.
// (Not included: status, timestamps, and the internal picture IDs.)
function toPublicEvent(event: EventDoc): PublicEvent {
  return {
    id: String(event._id),
    title: event.title,
    slug: event.slug,
    category: event.category,
    eventDate: event.eventDate,
    endDate: event.endDate || undefined,
    description: event.description,
    coverImageUrl: event.coverImageUrl,
    images: event.images.map((image) => image.url),
    featured: event.featured,
    guestCountEstimated: event.guestCountEstimated ?? undefined,
  };
}

/** Published events, newest event date first. */
export async function listPublicEvents(category?: string): Promise<PublicEvent[]> {
  const filter: Record<string, string> = { status: 'published' };
  if (category) filter.category = category;
  const events = await LawnEvent.find(filter).sort({ eventDate: -1 }).limit(200);
  return events.map(toPublicEvent);
}

/** One published event, or null. A draft is treated exactly like a missing event. */
export async function findPublicEventBySlug(slug: string): Promise<PublicEvent | null> {
  const event = await LawnEvent.findOne({ slug, status: 'published' });
  return event ? toPublicEvent(event) : null;
}