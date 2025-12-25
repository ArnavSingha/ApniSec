
import { Database } from '@/lib/core/Database';
import { User, IUser } from '@/lib/models/User';
import mongoose from 'mongoose';

/**
 * UserRepository provides a data access layer for the User model.
 * It encapsulates all database operations for Users, following the repository pattern.
 */
export class UserRepository {
  /**
   * Creates a new user in the database.
   * @param data - The partial user data to create the user with.
   * @returns A promise that resolves to the newly created user document.
   */
  public static async create(data: Partial<IUser>): Promise<IUser> {
    await Database.getConnection();
    const user = new User(data);
    return user.save();
  }

  /**
   * Finds a user by their email address.
   * Includes the password field in the result, which is normally excluded.
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user document or null if not found.
   */
  public static async findByEmail(email: string): Promise<IUser | null> {
    await Database.getConnection();
    return User.findOne({ email }).select('+password').exec();
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the user document or null if not found.
   */
  public static async findById(id: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    await Database.getConnection();
    return User.findById(id).exec();
  }

  /**
   * Finds a user by a password reset token.
   * @param token - The hashed password reset token.
   * @returns A promise that resolves to the user document or null if not found.
   */
  public static async findByPasswordResetToken(token: string): Promise<IUser | null> {
    await Database.getConnection();
    return User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    }).select('+password');
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param data - The data to update.
   * @returns A promise that resolves to the updated user document or null.
   */
  public static async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await Database.getConnection();
    return User.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
