import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Password is required for creation but should not always be returned
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema for the User
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Automatically exclude password from query results
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * The User model.
 * 
 * We check if the model is already compiled to prevent errors during Next.js hot-reloading in development.
 */
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
