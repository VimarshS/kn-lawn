import { InferSchemaType, model, Schema } from 'mongoose';

// One facility card, such as "Ample Dedicated Parking Space"
const facilitySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', trim: true, maxlength: 500 },
  iconName: { type: String, default: '', trim: true, maxlength: 50 },
  isHighlight: { type: Boolean, default: false },
});

const siteSettingsSchema = new Schema(
  {
    // There is only ever ONE settings document. This fixed, unique key enforces that.
    key: { type: String, required: true, unique: true, default: 'main', immutable: true },

    lawnName: { type: String, default: '', trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 600 },
    address: { type: String, default: '', trim: true, maxlength: 300 },
    ownerName: { type: String, default: '', trim: true, maxlength: 120 },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    whatsapp: { type: String, default: '', trim: true, maxlength: 30 },
    email: { type: String, default: '', trim: true, lowercase: true, maxlength: 254 },
    mapsEmbedUrl: { type: String, default: '', trim: true, maxlength: 500 },
    directionsUrl: { type: String, default: '', trim: true, maxlength: 500 },
    businessHours: { type: String, default: '', trim: true, maxlength: 200 },

    socialLinks: {
      instagram: { type: String, default: '', trim: true, maxlength: 300 },
      facebook: { type: String, default: '', trim: true, maxlength: 300 },
      youtube: { type: String, default: '', trim: true, maxlength: 300 },
    },

    heroHeading: { type: String, default: '', trim: true, maxlength: 200 },
    heroDescription: { type: String, default: '', trim: true, maxlength: 500 },
    heroImageUrl: { type: String, default: '', trim: true, maxlength: 500 },
    aboutStory: { type: String, default: '', trim: true, maxlength: 3000 },

    facilities: {
      type: [facilitySchema],
      default: [],
      validate: [(list: unknown[]) => list.length <= 30, 'At most 30 facilities are allowed'],
    },

    enquiryInstructions: { type: String, default: '', trim: true, maxlength: 1000 },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatically
);

export type SiteSettingsData = InferSchemaType<typeof siteSettingsSchema>;
export const SiteSettings = model('SiteSettings', siteSettingsSchema);