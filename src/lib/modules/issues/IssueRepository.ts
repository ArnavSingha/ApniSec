
import { Database } from '@/lib/core/Database';
import { Issue, IIssue } from '@/lib/models/Issue';
import mongoose, { FilterQuery } from 'mongoose';

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
   * Finds an issue by its ID.
   * @param id - The ID of the issue to find.
   * @returns A promise that resolves to the issue document or null if not found.
   */
  public static async findById(id: string): Promise<IIssue | null> {
    await Database.getConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Issue.findById(id).exec();
  }

  /**
   * Finds issues based on a filter query.
   * @param filter - The MongoDB filter query.
   * @returns A promise that resolves to an array of issue documents.
   */
  public static async find(filter: FilterQuery<IIssue>): Promise<IIssue[]> {
    await Database.getConnection();
    return Issue.find(filter).sort({ createdAt: -1 }).exec();
  }

  /**
   * Updates an existing issue.
   * @param id - The ID of the issue to update.
   * @param userId - The ID of the user who owns the issue.
   * @param data - The partial issue data to update.
   * @returns A promise that resolves to the updated issue document or null if not found.
   */
  public static async update(id: string, userId: string, data: Partial<IIssue>): Promise<IIssue | null> {
    await Database.getConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Issue.findOneAndUpdate({ _id: id, userId }, data, { new: true }).exec();
  }

  /**
   * Deletes an issue from the database.
   * @param id - The ID of the issue to delete.
   * @param userId - The ID of the user who owns the issue.
   * @returns A promise that resolves to true if deletion was successful, false otherwise.
   */
  public static async delete(id: string, userId: string): Promise<boolean> {
    await Database.getConnection();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Issue.deleteOne({ _id: id, userId }).exec();
    return result.deletedCount > 0;
  }
}
