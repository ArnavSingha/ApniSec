import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from './AuthService';
import { ApiError } from '@/lib/core/ApiError';
import { ApiResponse } from '@/lib/core/ApiResponse';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * Handles the user registration request.
     * @param req - The Next.js request object.
     * @returns A Next.js response object.
     */
    public async register(req: NextRequest) {
        try {
            const body = await req.json();
            const { name, email, password } = body;

            if (!name || !email || !password) {
                throw new ApiError(400, 'Name, email, and password are required');
            }

            const user = await this.authService.register(name, email, password);
            return ApiResponse.success(user, 'User registered successfully', 201);
        } catch (error) {
            return ApiResponse.handle(error);
        }
    }

    /**
     * Handles the user login request.
     * @param req - The Next.js request object.
     * @returns A Next.js response object with an access token cookie.
     */
    public async login(req: NextRequest) {
        try {
            const body = await req.json();
            const { email, password } = body;

            if (!email || !password) {
                throw new ApiError(400, 'Email and password are required');
            }

            const { accessToken, user } = await this.authService.login(email, password);

            const response = ApiResponse.success({ user }, 'Login successful');

            response.cookies.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 15, // 15 minutes
            });

            return response;
        } catch (error) {
            return ApiResponse.handle(error);
        }
    }

    /**
     * Handles the user logout request.
     * @returns A Next.js response object clearing the access token cookie.
     */
    public async logout() {
        try {
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
}
