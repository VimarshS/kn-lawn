import { SiteSettings } from '../models/SiteSettings';

/** The settings that are safe to show to any visitor. Nothing else may be added by accident. */
export interface PublicSettings {
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
  socialLinks: { instagram: string; facebook: string; youtube: string };
  heroHeading: string;
  heroDescription: string;
  heroImageUrl: string;
  aboutStory: string;
  facilities: {
    id: string;
    name: string;
    description: string;
    iconName: string;
    isHighlight: boolean;
  }[];
  enquiryInstructions: string;
}

export async function getPublicSettings(): Promise<PublicSettings> {
  // Before the owner has saved anything, fall back to the model's empty defaults.
  const doc = (await SiteSettings.findOne({ key: 'main' })) ?? new SiteSettings({});

  // An allowlist: every field that leaves the server is named here, one by one.
  return {
    lawnName: doc.lawnName,
    description: doc.description,
    address: doc.address,
    ownerName: doc.ownerName,
    phone: doc.phone,
    whatsapp: doc.whatsapp,
    email: doc.email,
    mapsEmbedUrl: doc.mapsEmbedUrl,
    directionsUrl: doc.directionsUrl,
    businessHours: doc.businessHours,
    socialLinks: {
      instagram: doc.socialLinks?.instagram ?? '',
      facebook: doc.socialLinks?.facebook ?? '',
      youtube: doc.socialLinks?.youtube ?? '',
    },
    heroHeading: doc.heroHeading,
    heroDescription: doc.heroDescription,
    heroImageUrl: doc.heroImageUrl,
    aboutStory: doc.aboutStory,
    facilities: doc.facilities.map((facility) => ({
      id: String(facility._id),
      name: facility.name,
      description: facility.description,
      iconName: facility.iconName,
      isHighlight: facility.isHighlight,
    })),
    enquiryInstructions: doc.enquiryInstructions,
  };
}