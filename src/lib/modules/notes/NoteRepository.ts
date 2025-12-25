
import { Database } from '@/lib/core/Database';
import { Note, INote } from '@/lib/models/Note';
import mongoose from 'mongoose';

/**
 * NoteRepository provides a data access layer for the Note model.
 */
export class NoteRepository {
  /**
   * Creates a new note in the database.
   * @param data - The note data to create.
   * @returns A promise that resolves to the newly created note document.
   */
  public static async create(data: Partial<INote>): Promise<INote> {
    await Database.getConnection();
    const note = new Note(data);
    return note.save();
  }

  /**
   * Finds all notes submitted by a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of note documents.
   */
  public static async findByUser(userId: string): Promise<INote[]> {
    await Database.getConnection();
    return Note.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
