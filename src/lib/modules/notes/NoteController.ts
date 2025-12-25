
import { NextRequest } from 'next/server';
import { NoteService } from './NoteService';
import { ApiError } from '@/lib/core/ApiError';
import { ApiResponse } from '@/lib/core/ApiResponse';
import { JwtManager } from '@/lib/security/JwtManager';
import { RateLimiter, RateLimitResult } from '@/lib/security/RateLimiter';

/**
 * NoteController handles the HTTP layer for note-related requests.
 */
export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  private getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
    };
  }

  /**
   * Extracts the JWT from the request cookie and verifies it.
   * @param req - The NextRequest object.
   * @returns The user ID from the token payload.
   * @throws {ApiError} if the token is missing or invalid.
   */
  private async getUserIdFromToken(req: NextRequest): Promise<string> {
    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      throw new ApiError(401, 'Authentication token not provided.');
    }

    const payload = await JwtManager.verify(token);
    if (!payload || !payload.userId) {
      throw new ApiError(401, 'Invalid or expired authentication token.');
    }

    return payload.userId as string;
  }

  /**
   * Handles the creation of a new note.
   * @param req - The NextRequest object.
   * @returns A NextResponse object.
   */
  public async create(req: NextRequest) {
    const identifier = req.ip ?? '127.0.0.1';
    const rateLimitResult = RateLimiter.check(identifier);
    const headers = this.getRateLimitHeaders(rateLimitResult);

    try {
      if (!rateLimitResult.success) {
          throw new ApiError(429, 'Too many requests. Please try again later.');
      }
      const userId = await this.getUserIdFromToken(req);
      const body = await req.json();

      const newNote = await this.noteService.createNote(userId, body);
      return ApiResponse.success(newNote, 'Note created successfully', 201, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }

  /**
   * Handles fetching all notes for the authenticated user.
   * @param req - The NextRequest object.
   * @returns A NextResponse object.
   */
  public async getAll(req: NextRequest) {
    const identifier = req.ip ?? '127.0.0.1';
    const rateLimitResult = RateLimiter.check(identifier);
    const headers = this.getRateLimitHeaders(rateLimitResult);

    try {
      if (!rateLimitResult.success) {
          throw new ApiError(429, 'Too many requests. Please try again later.');
      }
      const userId = await this.getUserIdFromToken(req);
      const notes = await this.noteService.getUserNotes(userId);
      return ApiResponse.success(notes, 'Notes retrieved successfully', 200, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }
}
