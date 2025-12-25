
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the TypeScript interface for the Note document
export interface INote extends Document {
  title: string;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema for the Note
const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * The Note model.
 *
 * We check if the model is already compiled to prevent errors during Next.js hot-reloading in development.
 */
export const Note = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
