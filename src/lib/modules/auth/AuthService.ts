import { UserRepository } from '@/lib/modules/users/UserRepository';
import { ApiError } from '@/lib/core/ApiError';
import { JwtManager } from '@/lib/security/JwtManager';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;


export class AuthService {
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
        
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: email,
                    subject: 'Welcome to ApniSec!',
                    html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining ApniSec.</p>`,
                });
            } catch (error) {
                console.error('Resend API Error:', error);
                // Non-fatal error, we can still proceed with user creation.
            }
        } else {
            console.log("Resend API key not configured. Skipping welcome email.");
        }


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
}
