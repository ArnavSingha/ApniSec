
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from './AuthService';
import { ApiError } from '@/lib/core/ApiError';
import { ApiResponse } from '@/lib/core/ApiResponse';
import { JwtManager } from '@/lib/security/JwtManager';
import { RateLimiter, RateLimitResult } from '@/lib/security/RateLimiter';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }
    
    private getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
        return {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
        };
    }

    /**
     * Handles the user registration request.
     * @param req - The Next.js request object.
     * @returns A Next.js response object.
     */
    public async register(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier, 'register', { limit: 10 }); // Stricter limit
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const body = await req.json();
            const { name, email, password } = body;

            if (!name || !email || !password) {
                throw new ApiError(400, 'Name, email, and password are required');
            }

            const user = await this.authService.register(name, email, password);
            return ApiResponse.success(user, 'User registered successfully', 201, headers);
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }

    /**
     * Handles the user login request.
     * @param req - The Next.js request object.
     * @returns A Next.js response object with an access token cookie.
     */
    public async login(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier, 'login', { limit: 10 }); // Stricter limit
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const body = await req.json();
            const { email, password } = body;

            if (!email || !password) {
                throw new ApiError(400, 'Email and password are required');
            }

            const { accessToken, user } = await this.authService.login(email, password);

            const response = ApiResponse.success({ user }, 'Login successful', 200, headers);

            response.cookies.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 15, // 15 minutes
            });

            return response;
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }

    /**
     * Handles the user logout request.
     * @returns A Next.js response object clearing the access token cookie.
     */
    public async logout() {
        try {
            // No rate limit on logout
            const response = ApiResponse.success({}, 'Logout successful');

            // Set the cookie with an immediate expiration date to remove it
            response.cookies.set('accessToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: -1,
            });

            return response;
        } catch (error) {
            return ApiResponse.handle(error);
        }
    }
    
    /**
     * Handles the request to get the current authenticated user's data.
     * @param req - The NextRequest object.
     * @returns A NextResponse object containing the user data.
     */
    public async getCurrentUser(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier);
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const token = req.cookies.get('accessToken')?.value;
            if (!token) {
                throw new ApiError(401, 'Authentication token not provided.');
            }

            const user = await this.authService.getCurrentUser(token);
            return ApiResponse.success(user, 'User data retrieved successfully', 200, headers);
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }

    /**
     * Handles the forgot password request.
     * @param req - The NextRequest object.
     * @returns A NextResponse object.
     */
    public async forgotPassword(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier, 'forgot-password', { limit: 5 }); // Stricter limit
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const { email } = await req.json();
            if (!email) {
                throw new ApiError(400, 'Email is required');
            }
            const origin = new URL(req.url).origin;
            await this.authService.sendPasswordResetEmail(email, origin);
            return ApiResponse.success({}, 'Password reset email sent successfully.', 200, headers);
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }

    /**
     * Handles the password reset request.
     * @param req - The NextRequest object.
     * @returns A NextResponse object.
     */
    public async resetPassword(req: NextRequest) {
        const identifier = req.ip ?? '127.0.0.1';
        const rateLimitResult = RateLimiter.check(identifier, 'reset-password', { limit: 5 }); // Stricter limit
        const headers = this.getRateLimitHeaders(rateLimitResult);

        try {
            if (!rateLimitResult.success) {
                throw new ApiError(429, 'Too many requests. Please try again later.');
            }
            const { token, password } = await req.json();
            if (!token || !password) {
                throw new ApiError(400, 'Token and new password are required');
            }

            const { accessToken, user } = await this.authService.resetPassword(token, password);
            const response = ApiResponse.success({ user }, 'Password has been reset successfully.', 200, headers);

            // Log the user in
            response.cookies.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 15,
            });

            return response;
        } catch (error) {
            return ApiResponse.handle(error, headers);
        }
    }
}
