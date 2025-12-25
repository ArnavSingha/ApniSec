import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the TypeScript interface for the Issue document
export interface IIssue extends Document {
  title: string;
  type: 'Cloud Security' | 'RedTeam Assessment' | 'VAPT';
  description: string;
  priority?: string;
  status: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema for the Issue
const IssueSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    type: {
      type: String,
      enum: ['Cloud Security', 'RedTeam Assessment', 'VAPT'],
      required: [true, 'Issue type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    priority: {
      type: String,
    },
    status: {
      type: String,
      default: 'OPEN',
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
 * The Issue model.
 *
 * We check if the model is already compiled to prevent errors during Next.js hot-reloading in development.
 */
export const Issue = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);
