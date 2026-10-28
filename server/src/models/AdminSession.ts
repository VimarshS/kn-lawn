import { InferSchemaType, model, Schema } from 'mongoose';

const adminSessionSchema = new Schema(
  {
    // We store a hash of the session token, never the token itself,
    // so a copy of the database cannot be used to log in.
    tokenHash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
    lastSeenAt: { type: Date, default: Date.now },
    // Absolute end of the session's life
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// MongoDB deletes each session by itself once expiresAt has passed.
adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminSessionData = InferSchemaType<typeof adminSessionSchema>;
export const AdminSession = model('AdminSession', adminSessionSchema);