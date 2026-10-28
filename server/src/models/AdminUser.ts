import { InferSchemaType, model, Schema } from 'mongoose';

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    // Only a hash is ever stored, never the password itself.
    // select: false keeps it out of normal query results.
    passwordHash: { type: String, required: true, select: false },
    // Least privilege: anyone created without a stated role is a manager, not the owner.
    role: { type: String, enum: ['owner', 'manager'], default: 'manager' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminUserData = InferSchemaType<typeof adminUserSchema>;
export const AdminUser = model('AdminUser', adminUserSchema);