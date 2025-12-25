import { UserRepository } from './UserRepository';
import { ApiError } from '@/lib/core/ApiError';
import { IUser } from '@/lib/models/User';
import { EmailService } from '@/lib/services/EmailService';

type UpdatableUserData = {
    name?: string;
    dob?: Date;
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    phoneNumber?: string;
    companyUrl?: string;
    jobTitle?: string;
    bio?: string;
    country?: string;
};

export class UserService {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    /**
     * Retrieves a user's profile.
     * @param userId - The ID of the user to retrieve.
     * @returns The user's data (excluding password).
     */
    public async getUserProfile(userId: string) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found.');
        }
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
    }

    /**
     * Updates a user's profile.
     * @param userId - The ID of the user to update.
     * @param data - The data to update.
     * @returns The updated user's data.
     */
    public async updateUserProfile(userId: string, data: UpdatableUserData) {
        const updatedUser = await UserRepository.update(userId, data);
        if (!updatedUser) {
            throw new ApiError(404, 'User not found.');
        }

        // Send a notification email about the profile update
        await this.emailService.sendProfileUpdateNotification(updatedUser.email);
        
        const userObject = updatedUser.toObject();
        delete userObject.password;
        
        return userObject;
    }
}
