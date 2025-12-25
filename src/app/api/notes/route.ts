
import { NextRequest } from 'next/server';
import { NoteController } from '@/lib/modules/notes/NoteController';

const noteController = new NoteController();

/**
 * API endpoint to create a new note.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function POST(req: NextRequest) {
  return noteController.create(req);
}

/**
 * API endpoint to get all notes for the authenticated user.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function GET(req: NextRequest) {
  return noteController.getAll(req);
}
