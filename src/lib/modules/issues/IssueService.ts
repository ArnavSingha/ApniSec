
import { IssueRepository } from './IssueRepository';
import { UserRepository } from '../users/UserRepository';
import { ApiError } from '@/lib/core/ApiError';
import { IIssue } from '@/lib/models/Issue';
import { EmailService } from '@/lib/services/EmailService';
import mongoose, { FilterQuery } from 'mongoose';
import 'dotenv/config';

interface CreateIssueData {
  title: string;
  type: 'Cloud Security' | 'Reteam Assessment' | 'VAPT';
  description: string;
  priority?: string;
  status?: string;
}

type UpdateIssueData = Partial<CreateIssueData>;

interface GetIssuesFilters {
  type?: string;
  searchQuery?: string;
}

/**
 * IssueService encapsulates the business logic for issue management.
 */
export class IssueService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Creates a new issue and sends a notification email.
   * @param userId - The ID of the user creating the issue.
   * @param data - The data for the new issue.
   * @returns The newly created issue.
   */
  public async createIssue(userId: string, data: CreateIssueData): Promise<IIssue> {
    const { title, type, description } = data;
    if (!title || !type || !description) {
      throw new ApiError(400, 'Title, type, and description are required');
    }

    const issueData: Partial<IIssue> = {
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    };

    const newIssue = await IssueRepository.create(issueData);
    
    // Fetch the user to get their email for the notification
    const user = await UserRepository.findById(userId);
    if(user && user.email) {
      await this.emailService.sendNewIssueNotification(user.email, newIssue);
    }

    return newIssue;
  }

  /**
   * Retrieves issues for a specific user, optionally filtered by type and search query.
   * @param userId - The ID of the user.
   * @param filters - Optional filters for type and search query.
   * @returns A list of the user's issues.
   */
  public async getUserIssues(userId: string, filters: GetIssuesFilters = {}): Promise<IIssue[]> {
    const { type, searchQuery } = filters;
    const query: FilterQuery<IIssue> = { userId };

    if (type) {
      // Map URL-friendly type to schema enum value
      const typeMap: { [key: string]: string } = {
        'vapt': 'VAPT',
        'cloud-security': 'Cloud Security',
        'redteam-assessment': 'RedTeam Assessment',
      };
      const mappedType = typeMap[type.toLowerCase()];
      if (mappedType) {
        query.type = mappedType;
      }
    }

    if (searchQuery) {
        query.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
        ];
    }
    
    return IssueRepository.find(query);
  }
  
    /**
   * Retrieves a single issue by its ID.
   * @param issueId - The ID of the issue.
   * @param userId - The ID of the user requesting the issue.
   * @returns The issue object.
   */
  public async getIssueById(issueId: string, userId: string): Promise<IIssue> {
    const issue = await IssueRepository.findById(issueId);
    if (!issue || issue.userId.toString() !== userId) {
      throw new ApiError(404, 'Issue not found or access denied.');
    }
    return issue;
  }

  /**
   * Updates an existing issue.
   * @param issueId - The ID of the issue to update.
   * @param userId - The ID of the user updating the issue.
   * @param data - The data to update.
   * @returns The updated issue.
   */
  public async updateIssue(issueId: string, userId: string, data: UpdateIssueData): Promise<IIssue> {
    const issue = await IssueRepository.update(issueId, userId, data);
    if (!issue) {
      throw new ApiError(404, 'Issue not found or access denied.');
    }
    return issue;
  }

  /**
   * Deletes an issue.
   * @param issueId - The ID of the issue to delete.
   * @param userId - The ID of the user deleting the issue.
   */
  public async deleteIssue(issueId: string, userId: string): Promise<void> {
    const success = await IssueRepository.delete(issueId, userId);
    if (!success) {
      throw new ApiError(404, 'Issue not found or access denied.');
    }
  }
}
