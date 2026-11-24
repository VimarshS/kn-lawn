import { LawnEvent } from '../models/LawnEvent';

import { HttpError } from '../middleware/errorHandler';
import { slugify } from '../utils/slug';
import type { EventInput } from '../validation/eventSchemas';
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


// ---------------------------------------------------------------------------
// Owner-only operations (used by the admin routes, which require a login)
// ---------------------------------------------------------------------------

/** What the owner sees: the public fields plus status and dates. */
export interface AdminEvent extends PublicEvent {
  status: string;
  createdAt: string;
  updatedAt: string;
}

function toAdminEvent(event: EventDoc): AdminEvent {
  return {
    ...toPublicEvent(event),
    status: event.status,
    createdAt: (event.get('createdAt') as Date).toISOString(),
    updatedAt: (event.get('updatedAt') as Date).toISOString(),
  };
}

const notFound = () => new HttpError(404, 'EVENT_NOT_FOUND', 'Event not found');

/** knownPublicIds keeps the hidden Cloudinary ID of photos that are still in the album. */
function toStoredFields(input: EventInput, knownPublicIds: Map<string, string> = new Map()) {
  return {
    title: input.title,
    category: input.category,
    eventDate: input.eventDate,
    endDate: input.endDate,
    description: input.description,
    coverImageUrl: input.coverImageUrl,
    images: input.images.map((url) => ({ url, publicId: knownPublicIds.get(url) ?? '' })),
    status: input.status,
    featured: input.featured,
    guestCountEstimated: input.guestCountEstimated,
  };
}

/** Saves, turning a "slug already used" database error into a clear 409 answer. */
async function saveEvent(event: EventDoc): Promise<void> {
  try {
    await event.save();
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      throw new HttpError(409, 'SLUG_TAKEN', 'Another event already uses this web address');
    }
    throw error;
  }
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let number = 2;
  while (await LawnEvent.exists({ slug: candidate })) {
    candidate = `${base}-${number}`;
    number += 1;
  }
  return candidate;
}

export async function listAdminEvents(): Promise<AdminEvent[]> {
  const events = await LawnEvent.find().sort({ eventDate: -1 }).limit(500);
  return events.map(toAdminEvent);
}

export async function getAdminEvent(id: string): Promise<AdminEvent> {
  const event = await LawnEvent.findById(id);
  if (!event) throw notFound();
  return toAdminEvent(event);
}

export async function createEvent(input: EventInput): Promise<AdminEvent> {
  const slug = input.slug ?? (await uniqueSlug(slugify(input.title)));
  const event = new LawnEvent({ ...toStoredFields(input), slug });
  await saveEvent(event);
  return toAdminEvent(event);
}

export async function updateEvent(id: string, input: EventInput): Promise<AdminEvent> {
  const event = await LawnEvent.findById(id);
  if (!event) throw notFound();
  const known = new Map<string, string>(
    event.images.map((image) => [image.url, image.publicId ?? '']),
  );
  event.set({ ...toStoredFields(input, known), slug: input.slug ?? event.slug });
  await saveEvent(event);
  return toAdminEvent(event);
}

export async function setEventStatus(
  id: string,
  status: 'draft' | 'published',
): Promise<AdminEvent> {
  const event = await LawnEvent.findById(id);
  if (!event) throw notFound();
  if (status === 'published' && !event.coverImageUrl) {
    throw new HttpError(400, 'NOT_READY_TO_PUBLISH', 'Add a cover photo before publishing');
  }
  event.status = status;
  await event.save();
  return toAdminEvent(event);
}

export async function deleteEvent(id: string): Promise<void> {
  const result = await LawnEvent.deleteOne({ _id: id });
  if (result.deletedCount === 0) throw notFound();
  // Phase 9 will also remove the album's pictures from Cloudinary here.
}