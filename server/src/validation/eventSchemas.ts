import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../models/LawnEvent';
import { isValidDateString } from '../utils/dates';
import { isAllowedHttpsUrl } from './settingsSchemas';

const dateString = z
  .string()
  .refine(isValidDateString, 'Date must be a real day in the form YYYY-MM-DD');

// A picture that ships with the website, or one hosted on our Cloudinary (Phase 9).
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      /^\/images\/[A-Za-z0-9._-]+$/.test(value) ||
      isAllowedHttpsUrl(value, ['res.cloudinary.com']),
    'Use a picture from this website (/images/...) or an uploaded picture',
  );

// The editable fields of an event. Any other field in a request is dropped.
export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(160),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .max(120)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Web address may only contain lowercase letters, numbers and single hyphens',
      )
      .optional(),
    category: z.enum(EVENT_CATEGORIES),
    eventDate: dateString,
    endDate: z
      .union([dateString, z.literal('')])
      .optional()
      .transform((value) => value || undefined),
    description: z.string().trim().max(3000).default(''),
    coverImageUrl: z.union([imageUrl, z.literal('')]).default(''),
    images: z.array(imageUrl).max(40, 'At most 40 photos per album').default([]),
    status: z.enum(EVENT_STATUSES).default('draft'),
    featured: z.boolean().default(false),
    guestCountEstimated: z
      .number()
      .int('Guest count must be a whole number')
      .min(0)
      .max(100000)
      .nullable()
      .optional()
      .transform((value) => value ?? undefined),
  })
  .superRefine((event, ctx) => {
    if (event.endDate && event.endDate < event.eventDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before the event date',
      });
    }
    if (event.coverImageUrl && !event.images.includes(event.coverImageUrl)) {
      ctx.addIssue({
        code: 'custom',
        path: ['coverImageUrl'],
        message: 'The cover photo must be one of the album photos',
      });
    }
    if (event.status === 'published' && !event.coverImageUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['coverImageUrl'],
        message: 'Add a cover photo before publishing',
      });
    }
  });

export const eventStatusSchema = z.object({ status: z.enum(EVENT_STATUSES) });

export type EventInput = z.infer<typeof eventInputSchema>;