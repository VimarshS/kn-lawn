import { InferSchemaType, model, Schema } from 'mongoose';
import { BLOCK_STATUSES } from './AvailabilityBlock';
import { isValidDateString } from '../utils/dates';

/**
 * One record per locked calendar day.
 *
 * The UNIQUE index on "date" is what makes double booking impossible:
 * the database refuses to lock the same day twice, even when two requests
 * arrive at the same moment.
 *
 * This collection holds NO private information, so the public calendar
 * can read it safely. Private notes live in AvailabilityBlock.
 */
const blockedDaySchema = new Schema({
  date: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isValidDateString,
      message: 'Date must be a real day in the form YYYY-MM-DD',
    },
  },
  // A copy of the owning block's status, so the public calendar needs only this collection
  status: { type: String, enum: BLOCK_STATUSES, required: true },
  // The range this day belongs to. Indexed so a block's days can be removed quickly.
  block: { type: Schema.Types.ObjectId, ref: 'AvailabilityBlock', required: true, index: true },
});

export type BlockedDayData = InferSchemaType<typeof blockedDaySchema>;
export const BlockedDay = model('BlockedDay', blockedDaySchema);