import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from './IssueService';
import { ApiError } from '@/lib/core/ApiError';
import { ApiResponse } from '@/lib/core/ApiResponse';
import { JwtManager } from '@/lib/security/JwtManager';

/**
 * IssueController handles the HTTP layer for issue-related requests.
 */
export class IssueController {
  private issueService: IssueService;

  constructor() {
    this.issueService = new IssueService();
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
   * Handles the creation of a new issue.
   * @param req - The NextRequest object.
   * @returns A NextResponse object.
   */
  public async create(req: NextRequest) {
    try {
      const userId = await this.getUserIdFromToken(req);
      const body = await req.json();

      const newIssue = await this.issueService.createIssue(userId, body);
      return ApiResponse.success(newIssue, 'Issue created successfully', 201);
    } catch (error) {
      return ApiResponse.handle(error);
    }
  }

  /**
   * Handles fetching all issues for the authenticated user, with optional filtering.
   * @param req - The NextRequest object.
   * @returns A NextResponse object.
   */
  public async getAll(req: NextRequest) {
    try {
      const userId = await this.getUserIdFromToken(req);
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type') || undefined;

      const issues = await this.issueService.getUserIssues(userId, type);
      return ApiResponse.success(issues, 'Issues retrieved successfully');
    } catch (error) {
      return ApiResponse.handle(error);
    }
  }
}
