import { UserRepository } from '@/lib/modules/users/UserRepository';
import { ApiError } from '@/lib/core/ApiError';
import { JwtManager } from '@/lib/security/JwtManager';
import { EmailService } from '@/lib/services/EmailService';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';

export class AuthService {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }
    
    /**
     * Registers a new user.
     * @param name - The user's name.
     * @param email - The user's email.
     * @param password - The user's raw password.
     * @returns The newly created user document.
     */
    public async register(name: string, email: string, password: string) {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new ApiError(409, 'User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        
        await this.emailService.sendWelcomeEmail(email, name);

        // Exclude password from the returned user object
        const userObject = newUser.toObject();
        delete userObject.password;
        
        return userObject;
    }

    /**
     * Logs a user in.
     * @param email - The user's email.
     * @param password - The user's raw password.
     * @returns An object containing the access token and user information.
     */
    public async login(email: string, password: string) {
        const user = await UserRepository.findByEmail(email);

        if (!user || !user.password) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const userObject = user.toObject();
        delete userObject.password;

        const accessToken = await JwtManager.sign({ userId: user._id });

        return { accessToken, user: userObject };
    }

    /**
     * Retrieves the current user's data based on a valid JWT.
     * @param token - The JWT access token.
     * @returns The user's data (excluding the password).
     */
    public async getCurrentUser(token: string) {
        const payload = await JwtManager.verify(token);
        if (!payload || !payload.userId) {
            throw new ApiError(401, 'Invalid or expired authentication token.');
        }

        const user = await UserRepository.findById(payload.userId);
        if (!user) {
            throw new ApiError(404, 'User not found.');
        }

        const userObject = user.toObject();
        delete userObject.password;

        return userObject;
    }

    /**
     * Generates a password reset token and sends it via email.
     * @param email The user's email address.
     * @param origin The origin URL of the request (e.g., https://yourapp.com)
     */
    public async sendPasswordResetEmail(email: string, origin: string) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            // Don't reveal that the user does not exist
            console.log(`Password reset attempt for non-existent user: ${email}`);
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.forgotPasswordToken = hashedToken;
        user.forgotPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        if (!origin) {
            throw new ApiError(500, 'Could not determine application origin.');
        }

        const resetUrl = `${origin}/reset-password?token=${resetToken}`;
        await this.emailService.sendPasswordResetEmail(email, resetUrl);
    }

    /**
     * Resets a user's password using a valid token.
     * @param token The password reset token from the URL.
     * @param newPassword The new password.
     */
    public async resetPassword(token: string, newPassword: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await UserRepository.findByPasswordResetToken(hashedToken);
        
        if (!user) {
            throw new ApiError(400, 'Invalid or expired password reset token.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        // Automatically log the user in
        const userObject = user.toObject();
        delete userObject.password;
        const accessToken = await JwtManager.sign({ userId: user._id });

        return { accessToken, user: userObject };
    }
}
