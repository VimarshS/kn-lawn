import { InferSchemaType, model, Schema } from 'mongoose';
import { isValidDateString } from '../utils/dates';

export const EVENT_CATEGORIES = [
  'wedding',
  'engagement',
  'reception',
  'birthday',
  'anniversary',
  'celebration',
] as const;

export const EVENT_STATUSES = ['draft', 'published'] as const;

// Calendar days are stored as text in the form YYYY-MM-DD (see utils/dates.ts)
const dateValidator = {
  validator: isValidDateString,
  message: 'Date must be a real day in the form YYYY-MM-DD',
};

const eventImageSchema = new Schema({
  url: { type: String, required: true, trim: true, maxlength: 500 },
  // Cloudinary's ID for the picture, needed later to delete it from the cloud.
  // Empty for pictures that ship with the website itself.
  publicId: { type: String, default: '', trim: true, maxlength: 200 },
});

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug may only contain lowercase letters, numbers and single hyphens',
      ],
    },
    category: { type: String, enum: EVENT_CATEGORIES, required: true },
    eventDate: { type: String, required: true, validate: dateValidator },
    endDate: { type: String, validate: dateValidator },
    description: { type: String, default: '', trim: true, maxlength: 3000 },
    coverImageUrl: { type: String, default: '', trim: true, maxlength: 500 },
    images: {
      type: [eventImageSchema],
      default: [],
      validate: [(list: unknown[]) => list.length <= 40, 'At most 40 images per event'],
    },
    // New events are drafts until the owner publishes them.
    status: { type: String, enum: EVENT_STATUSES, default: 'draft' },
    featured: { type: Boolean, default: false },
    guestCountEstimated: {
      type: Number,
      min: 0,
      max: 100000,
      validate: { validator: Number.isInteger, message: 'Guest count must be a whole number' },
    },
  },
  { timestamps: true },
);

// Rule that involves two fields: an event cannot end before it starts.
// Text comparison works because YYYY-MM-DD sorts in calendar order.
eventSchema.pre('validate', function () {
  if (this.eventDate && this.endDate && this.endDate < this.eventDate) {
    this.invalidate('endDate', 'End date cannot be before the event date');
  }
});

// "Published events, newest first": the question the public gallery asks.
eventSchema.index({ status: 1, eventDate: -1 });

export type LawnEventData = InferSchemaType<typeof eventSchema>;
export const LawnEvent = model('LawnEvent', eventSchema);