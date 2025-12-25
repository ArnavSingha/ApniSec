
import { NoteRepository } from './NoteRepository';
import { ApiError } from '@/lib/core/ApiError';
import { INote } from '@/lib/models/Note';
import mongoose from 'mongoose';

interface CreateNoteData {
  title: string;
  content: string;
}

/**
 * NoteService encapsulates the business logic for note management.
 */
export class NoteService {
  /**
   * Creates a new note.
   * @param userId - The ID of the user creating the note.
   * @param data - The data for the new note.
   * @returns The newly created note.
   */
  public async createNote(userId: string, data: CreateNoteData): Promise<INote> {
    const { title, content } = data;
    if (!title || !content) {
      throw new ApiError(400, 'Title and content are required');
    }

    const noteData: Partial<INote> = {
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    };

    const newNote = await NoteRepository.create(noteData);
    return newNote;
  }

  /**
   * Retrieves notes for a specific user.
   * @param userId - The ID of the user.
   * @returns A list of the user's notes.
   */
  public async getUserNotes(userId: string): Promise<INote[]> {
    return NoteRepository.findByUser(userId);
  }
}
