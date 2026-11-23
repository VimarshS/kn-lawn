/**
 * DEMO events for DEVELOPMENT ONLY.
 *
 * The family names and descriptions are placeholders copied from the original
 * website mock-up. The last event is a DRAFT, used to test that unpublished
 * events never appear on the public site.
 */
const HERO = 'hero_wedding_lawn_1792477779485.jpg';
const MANDAP = 'lawn_mandap_ceremony_1792477779867.jpg';
const ENTRANCE = 'lawn_entrance_walkway_1792477779864.jpg';
const RECEPTION = 'lawn_reception_stage_1792477779365.jpg';

const picture = (fileName: string) => ({ url: `/images/${fileName}`, publicId: '' });

interface DemoEvent {
  title: string;
  slug: string;
  category: 'wedding' | 'engagement' | 'reception' | 'birthday' | 'anniversary' | 'celebration';
  eventDate: string;
  description: string;
  coverImageUrl: string;
  images: { url: string; publicId: string }[];
  status: 'draft' | 'published';
  featured: boolean;
  guestCountEstimated?: number;
}

export const demoEvents: DemoEvent[] = [
  {
    title: 'The Royal Verma & Kapoor Wedding Celebration',
    slug: 'verma-kapoor-wedding-celebration',
    category: 'wedding',
    eventDate: '2026-11-14',
    description:
      'A breathtaking traditional Indian wedding ceremony on the main lawn. Features an intricately decorated floral mandap under a canopy of golden fairy lights, welcoming over 800 guests with imperial hospitality.',
    coverImageUrl: `/images/${HERO}`,
    images: [picture(HERO), picture(MANDAP), picture(ENTRANCE), picture(RECEPTION)],
    status: 'published',
    featured: true,
    guestCountEstimated: 850,
  },
  {
    title: 'Ananya & Kabir’s Grand Evening Reception',
    slug: 'ananya-kabir-evening-reception',
    category: 'reception',
    eventDate: '2026-12-05',
    description:
      'An enchanting starlit reception gala featuring grand floral chandeliers, royal sofa seating, orchestral live instrumental setup, and warm gold lighting along the banquet tables.',
    coverImageUrl: `/images/${RECEPTION}`,
    images: [picture(RECEPTION), picture(ENTRANCE), picture(HERO)],
    status: 'published',
    featured: true,
    guestCountEstimated: 650,
  },
  {
    title: 'Traditional Vedic Pheras: Sharma Family Wedding',
    slug: 'sharma-vedic-pheras-wedding',
    category: 'wedding',
    eventDate: '2026-11-28',
    description:
      'An intimate, spiritually resonant Vedic pheras setup adorned with fresh marigold tassels, brass diyas, sacred havan kund, and traditional charpai seating for close family members.',
    coverImageUrl: `/images/${MANDAP}`,
    images: [picture(MANDAP), picture(HERO), picture(ENTRANCE)],
    status: 'published',
    featured: true,
    guestCountEstimated: 450,
  },
  {
    title: 'Silver Jubilee & 25th Wedding Anniversary',
    slug: 'silver-jubilee-anniversary-singh',
    category: 'anniversary',
    eventDate: '2026-12-18',
    description:
      'A magical milestone celebration welcoming three generations of family through the illuminated red-carpet floral walkway, complemented by dinner and cake-cutting under fairy lights.',
    coverImageUrl: `/images/${ENTRANCE}`,
    images: [picture(ENTRANCE), picture(RECEPTION)],
    status: 'published',
    featured: false,
    guestCountEstimated: 350,
  },
  {
    title: 'Rhea & Devendra Royal Ring Ceremony',
    slug: 'rhea-devendra-ring-ceremony',
    category: 'engagement',
    eventDate: '2027-01-16',
    description:
      'A sophisticated evening engagement with romantic pastel floral installations, floating candle troughs, and an amphitheater lawn seating arrangement.',
    coverImageUrl: `/images/${HERO}`,
    images: [picture(HERO), picture(RECEPTION)],
    status: 'published',
    featured: false,
    guestCountEstimated: 300,
  },
  {
    title: 'Demo draft: upcoming Sangeet night',
    slug: 'demo-draft-sangeet-night',
    category: 'celebration',
    eventDate: '2027-02-06',
    description:
      'A draft event used to test that unpublished events stay hidden from visitors. It must never appear on the public website.',
    coverImageUrl: `/images/${HERO}`,
    images: [picture(HERO)],
    status: 'draft',
    featured: false,
  },
];