
import { NextRequest } from 'next/server';
import { UserService } from './UserService';
import { ApiError } from '@/lib/core/ApiError';
import { ApiResponse } from '@/lib/core/ApiResponse';
import { JwtManager } from '@/lib/security/JwtManager';
import { RateLimiter, RateLimitResult } from '@/lib/security/RateLimiter';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    
    private getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
        return {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
        };
    }

    /**
     * Extracts the user ID from the JWT in the request cookie.
     * @param req - The NextRequest object.
     * @returns The user ID string.
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
     * Handles the request to get the current user's profile.
     * @param req - The NextRequest object.
     * @returns A NextResponse object with the user's profile data.
     */
    public async getProfile(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier);
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const userId = await this.getUserIdFromToken(req);
            const user = await this.userService.getUserProfile(userId);
            return ApiResponse.success(user, 'Profile retrieved successfully', 200, headers);
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }

    /**
     * Handles the request to update the current user's profile.
     * @param req - The NextRequest object.
     * @returns A NextResponse object with the updated user data.
     */
    public async updateProfile(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier);
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const userId = await this.getUserIdFromToken(req);
            const body = await req.json();

            const { name, dob, gender, phoneNumber, companyUrl, jobTitle, bio, country } = body;
            
            const updateData: any = {};
            
            if (name !== undefined) {
                if (typeof name !== 'string' || name.length < 2) {
                    throw new ApiError(400, 'A valid name is required.');
                }
                updateData.name = name;
            }
            // Allow null to be passed to clear the date
            if (dob !== undefined) updateData.dob = dob;
            if (gender !== undefined) updateData.gender = gender;
            if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
            if (companyUrl !== undefined) updateData.companyUrl = companyUrl;
            if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
            if (bio !== undefined) updateData.bio = bio;
            if (country !== undefined) updateData.country = country;


            const updatedUser = await this.userService.updateUserProfile(userId, updateData);
            return ApiResponse.success(updatedUser, 'Profile updated successfully', 200, headers);
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }
}
