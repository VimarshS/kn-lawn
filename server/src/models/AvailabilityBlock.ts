import { InferSchemaType, model, Schema } from 'mongoose';
import { countDaysInclusive, isValidDateString } from '../utils/dates';

// "Available" is not stored: a day with no block is already available.
export const BLOCK_STATUSES = ['unavailable', 'pending'] as const;
export const BLOCK_SOURCES = ['manual', 'booking'] as const;

// A block may cover at most this many days (about two months).
export const MAX_BLOCK_DAYS = 62;

const dateValidator = {
  validator: isValidDateString,
  message: 'Date must be a real day in the form YYYY-MM-DD',
};

const availabilityBlockSchema = new Schema(
  {
    startDate: { type: String, required: true, validate: dateValidator },
    endDate: { type: String, required: true, validate: dateValidator },
    status: { type: String, enum: BLOCK_STATUSES, required: true },
    // Admin-only. Must never appear in public API responses.
    privateNote: { type: String, default: '', trim: true, maxlength: 1000 },
    // 'manual' = the owner blocked it; 'booking' = created from a confirmed enquiry
    source: { type: String, enum: BLOCK_SOURCES, default: 'manual' },
    // Set when the block comes from a booking enquiry (used in Phase 12)
    enquiry: { type: Schema.Types.ObjectId, ref: 'Enquiry' },
  },
  { timestamps: true },
);

// Rules that involve two fields at once.
availabilityBlockSchema.pre('validate', function () {
  if (!isValidDateString(this.startDate ?? '') || !isValidDateString(this.endDate ?? '')) {
    return; // the single-field checks above already report the problem
  }
  if (this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date cannot be before the start date');
  } else if (countDaysInclusive(this.startDate, this.endDate) > MAX_BLOCK_DAYS) {
    this.invalidate('endDate', `A block can cover at most ${MAX_BLOCK_DAYS} days`);
  }
});

// Lets the admin calendar load "blocks that touch this month" quickly.
availabilityBlockSchema.index({ startDate: 1, endDate: 1 });

export type AvailabilityBlockData = InferSchemaType<typeof availabilityBlockSchema>;
export const AvailabilityBlock = model('AvailabilityBlock', availabilityBlockSchema);