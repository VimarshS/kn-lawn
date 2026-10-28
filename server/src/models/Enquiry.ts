import { InferSchemaType, model, Schema } from 'mongoose';
import { countDaysInclusive, isValidDateString } from '../utils/dates';
import { MAX_BLOCK_DAYS } from './AvailabilityBlock';

export const ENQUIRY_STATUSES = [
  'new',
  'contacted',
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
] as const;

const dateValidator = {
  validator: isValidDateString,
  message: 'Date must be a real day in the form YYYY-MM-DD',
};

const enquirySchema = new Schema(
  {
    // Random, hard-to-guess code shown to the customer, e.g. KNL-7K3M-9QX2
    referenceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },

    // --- Details the visitor typed in. These are private customer data. ---
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, default: '', trim: true, lowercase: true, maxlength: 254 },
    eventType: { type: String, required: true, trim: true, maxlength: 80 },
    preferredDate: { type: String, required: true, validate: dateValidator },
    // Optional: only for events that run for more than one day
    preferredEndDate: { type: String, validate: dateValidator },
    alternativeDate: { type: String, validate: dateValidator },
    guestCount: {
      type: Number,
      min: 1,
      max: 100000,
      validate: { validator: Number.isInteger, message: 'Guest count must be a whole number' },
    },
    message: { type: String, default: '', trim: true, maxlength: 2000 },

    // --- Managed by the owner only ---
    // A new enquiry NEVER confirms a booking by itself.
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'new' },
    // Admin-only. select: false keeps it out of normal query results,
    // so it cannot leak by accident. Admin code must ask for it by name.
    privateAdminNotes: { type: String, default: '', trim: true, maxlength: 3000, select: false },
    // The date range reserved for this enquiry once it is held or confirmed
    block: { type: Schema.Types.ObjectId, ref: 'AvailabilityBlock' },
  },
  { timestamps: true },
);

// Rule involving two fields: the end date cannot come before the start,
// and a multi-day enquiry cannot be longer than a block may be.
enquirySchema.pre('validate', function () {
  const start = this.preferredDate ?? '';
  const end = this.preferredEndDate ?? '';
  if (!isValidDateString(start) || !isValidDateString(end)) {
    return; // missing or malformed dates are already reported by the checks above
  }
  if (end < start) {
    this.invalidate('preferredEndDate', 'End date cannot be before the start date');
  } else if (countDaysInclusive(start, end) > MAX_BLOCK_DAYS) {
    this.invalidate('preferredEndDate', `An enquiry can cover at most ${MAX_BLOCK_DAYS} days`);
  }
});

// Admin list: newest first, optionally filtered by status
enquirySchema.index({ status: 1, createdAt: -1 });
// Finding enquiries for a date
enquirySchema.index({ preferredDate: 1 });

export type EnquiryData = InferSchemaType<typeof enquirySchema>;
export const Enquiry = model('Enquiry', enquirySchema);