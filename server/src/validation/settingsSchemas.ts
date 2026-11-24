import { z } from 'zod';

// Plain text typed into a form: spaces trimmed, with a maximum length.
const text = (max: number) => z.string().trim().max(max);

// Phone: empty is allowed. Otherwise 10 to 15 digits, with an optional leading +.
// Spaces, dashes and brackets are allowed for readability.
const phone = z
  .string()
  .trim()
  .max(30)
  .refine(
    (value) => value === '' || /^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g, '')),
    'Enter a valid phone number, for example +91 98765 43210',
  );

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email address');

/** A link must use https, carry no embedded login, and (optionally) come from allowed hosts. */
export function isAllowedHttpsUrl(value: string, allowedHosts?: string[]): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    if (url.username || url.password) return false;
    return !allowedHosts || allowedHosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const httpsUrl = (max: number, hint: string, allowedHosts?: string[]) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((value) => value === '' || isAllowedHttpsUrl(value, allowedHosts), hint);

const GOOGLE_MAPS_EMBED_HOSTS = ['www.google.com', 'google.com', 'maps.google.com'];
const GOOGLE_MAPS_LINK_HOSTS = [...GOOGLE_MAPS_EMBED_HOSTS, 'maps.app.goo.gl', 'goo.gl'];

// A picture that ships with the website (/images/...) or an https link
const heroImage = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === '' || /^\/images\/[A-Za-z0-9._-]+$/.test(value) || isAllowedHttpsUrl(value),
    'Use a picture from this website (/images/...) or a link starting with https://',
  );

const facility = z.object({
  name: z.string().trim().min(1, 'Facility name is required').max(120),
  description: text(500).default(''),
  iconName: text(50).default(''),
  isHighlight: z.boolean().default(false),
});

// The complete settings. Any field not listed here is dropped, never saved.
export const updateSettingsSchema = z.object({
  lawnName: text(120),
  description: text(600),
  address: text(300),
  ownerName: text(120),
  phone,
  whatsapp: phone,
  email,
  mapsEmbedUrl: httpsUrl(
    500,
    'Use a Google Maps embed link starting with https://www.google.com/maps/',
    GOOGLE_MAPS_EMBED_HOSTS,
  ),
  directionsUrl: httpsUrl(
    500,
    'Use a Google Maps link starting with https://',
    GOOGLE_MAPS_LINK_HOSTS,
  ),
  businessHours: text(200),
  socialLinks: z.object({
    instagram: httpsUrl(300, 'Use an Instagram link starting with https://', [
      'instagram.com',
      'www.instagram.com',
    ]),
    facebook: httpsUrl(300, 'Use a Facebook link starting with https://', [
      'facebook.com',
      'www.facebook.com',
      'm.facebook.com',
      'fb.com',
    ]),
    youtube: httpsUrl(300, 'Use a YouTube link starting with https://', [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtu.be',
    ]),
  }),
  heroHeading: text(200),
  heroDescription: text(500),
  heroImageUrl: heroImage,
  aboutStory: text(3000),
  facilities: z.array(facility).max(30, 'At most 30 facilities are allowed'),
  enquiryInstructions: text(1000),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;