import { Database } from '@/lib/core/Database';
import { Issue, IIssue } from '@/lib/models/Issue';

/**
 * IssueRepository provides a data access layer for the Issue model.
 */
export class IssueRepository {
  /**
   * Creates a new issue in the database.
   * @param data - The issue data to create.
   * @returns A promise that resolves to the newly created issue document.
   */
  public static async create(data: Partial<IIssue>): Promise<IIssue> {
    await Database.getConnection();
    const issue = new Issue(data);
    return issue.save();
  }

  /**
   * Finds all issues submitted by a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of issue documents.
   */
  public static async findByUser(userId: string): Promise<IIssue[]> {
    await Database.getConnection();
    return Issue.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  /**
   * Finds all issues of a specific type submitted by a user.
   * @param userId - The ID of the user.
   * @param type - The type of the issue.
   * @returns A promise that resolves to an array of issue documents.
   */
  public static async findByType(userId: string, type: string): Promise<IIssue[]> {
    await Database.getConnection();
    return Issue.find({ userId, type }).sort({ createdAt: -1 }).exec();
  }

  /**
   * Updates an existing issue.
   * @param id - The ID of the issue to update.
   * @param data - The partial issue data to update.
   * @returns A promise that resolves to the updated issue document or null if not found.
   */
  public static async update(id: string, data: Partial<IIssue>): Promise<IIssue | null> {
    await Database.getConnection();
    return Issue.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Deletes an issue from the database.
   * @param id - The ID of the issue to delete.
   * @returns A promise that resolves to true if deletion was successful, false otherwise.
   */
  public static async delete(id: string): Promise<boolean> {
    await Database.getConnection();
    const result = await Issue.findByIdAndDelete(id).exec();
    return !!result;
  }
}
