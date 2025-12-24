import { Resend } from 'resend';
import { IssueRepository } from './IssueRepository';
import { ApiError } from '@/lib/core/ApiError';
import { IIssue } from '@/lib/models/Issue';
import mongoose from 'mongoose';


const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface CreateIssueData {
  title: string;
  type: 'Cloud Security' | 'Reteam Assessment' | 'VAPT';
  description: string;
  priority?: string;
}

/**
 * IssueService encapsulates the business logic for issue management.
 */
export class IssueService {
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

    if (resend) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'admin@example.com', // Replace with a real admin email
          subject: `New Issue Created: ${newIssue.title}`,
          html: `
            <h1>A new issue has been submitted.</h1>
            <p><strong>Title:</strong> ${newIssue.title}</p>
            <p><strong>Type:</strong> ${newIssue.type}</p>
            <p><strong>Description:</strong> ${newIssue.description}</p>
            <p><strong>Submitted by User ID:</strong> ${userId}</p>
          `,
        });
      } catch (error) {
        console.error('Resend API Error:', error);
        // Non-fatal error, the issue was still created.
      }
    } else {
        console.log("Resend API key not configured. Skipping email notification.");
    }

    return newIssue;
  }

  /**
   * Retrieves issues for a specific user, optionally filtered by type.
   * @param userId - The ID of the user.
   * @param type - Optional issue type to filter by.
   * @returns A list of the user's issues.
   */
  public async getUserIssues(userId: string, type?: string): Promise<IIssue[]> {
    if (type) {
      return IssueRepository.findByType(userId, type);
    }
    return IssueRepository.findByUser(userId);
  }
}
