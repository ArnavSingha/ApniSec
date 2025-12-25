
import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from './IssueService';
import { ApiError } from '@/lib/core/ApiError';
import { ApiResponse } from '@/lib/core/ApiResponse';
import { JwtManager } from '@/lib/security/JwtManager';
import { RateLimiter, RateLimitResult } from '@/lib/security/RateLimiter';

/**
 * IssueController handles the HTTP layer for issue-related requests.
 */
export class IssueController {
  private issueService: IssueService;

  constructor() {
    this.issueService = new IssueService();
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
   * Handles the creation of a new issue.
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

      const newIssue = await this.issueService.createIssue(userId, body);
      return ApiResponse.success(newIssue, 'Issue created successfully', 201, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }

  /**
   * Handles fetching all issues for the authenticated user, with optional filtering.
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
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type') || undefined;
      const searchQuery = searchParams.get('search') || undefined;

      const issues = await this.issueService.getUserIssues(userId, { type, searchQuery });
      return ApiResponse.success(issues, 'Issues retrieved successfully', 200, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }
  
    /**
   * Handles fetching a single issue by its ID.
   * @param req - The NextRequest object.
   * @param issueId - The ID of the issue to fetch.
   * @returns A NextResponse object.
   */
  public async getById(req: NextRequest, issueId: string) {
    const identifier = req.ip ?? '127.0.0.1';
    const rateLimitResult = RateLimiter.check(identifier);
    const headers = this.getRateLimitHeaders(rateLimitResult);

    try {
      if (!rateLimitResult.success) {
          throw new ApiError(429, 'Too many requests. Please try again later.');
      }
      const userId = await this.getUserIdFromToken(req);
      const issue = await this.issueService.getIssueById(issueId, userId);
      return ApiResponse.success(issue, 'Issue retrieved successfully', 200, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }

  /**
   * Handles updating an issue.
   * @param req - The NextRequest object.
   * @param issueId - The ID of the issue to update.
   * @returns A NextResponse object.
   */
  public async update(req: NextRequest, issueId: string) {
    const identifier = req.ip ?? '127.0.0.1';
    const rateLimitResult = RateLimiter.check(identifier);
    const headers = this.getRateLimitHeaders(rateLimitResult);

    try {
      if (!rateLimitResult.success) {
          throw new ApiError(429, 'Too many requests. Please try again later.');
      }
      const userId = await this.getUserIdFromToken(req);
      const body = await req.json();
      const updatedIssue = await this.issueService.updateIssue(issueId, userId, body);
      return ApiResponse.success(updatedIssue, 'Issue updated successfully', 200, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }

  /**
   * Handles deleting an issue.
   * @param req - The NextRequest object.
   * @param issueId - The ID of the issue to delete.
   * @returns A NextResponse object.
   */
  public async delete(req: NextRequest, issueId: string) {
    const identifier = req.ip ?? '127.0.0.1';
    const rateLimitResult = RateLimiter.check(identifier);
    const headers = this.getRateLimitHeaders(rateLimitResult);

    try {
      if (!rateLimitResult.success) {
          throw new ApiError(429, 'Too many requests. Please try again later.');
      }
      const userId = await this.getUserIdFromToken(req);
      await this.issueService.deleteIssue(issueId, userId);
      return ApiResponse.success({}, 'Issue deleted successfully', 200, headers);
    } catch (error) {
      return ApiResponse.handle(error, headers);
    }
  }
}
