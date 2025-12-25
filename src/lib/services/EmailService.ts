import { Resend } from 'resend';
import { ApiError } from '../core/ApiError';
import { IIssue } from '../models/Issue';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;

export class EmailService {
    private resend: Resend | null;

    constructor() {
        if (resendApiKey && fromEmail) {
            this.resend = new Resend(resendApiKey);
        } else {
            this.resend = null;
            console.warn("Resend API key or From Email not configured. Emails will not be sent. Please add RESEND_API_KEY and FROM_EMAIL to your .env file.");
        }
    }

    private async send(to: string, subject: string, html: string) {
        if (!this.resend || !fromEmail) {
            console.log(`Skipping email send. To: ${to}, Subject: ${subject}`);
            return;
        }

        try {
            await this.resend.emails.send({
                from: fromEmail,
                to,
                subject,
                html,
            });
        } catch (error) {
            console.error('Resend API Error:', error);
            // This makes it a non-fatal error for the application flow.
            // In a real-world scenario, you might want to add this to a retry queue.
        }
    }

    public async sendWelcomeEmail(to: string, name: string) {
        const subject = 'Welcome to ApniSec!';
        const html = `<h1>Welcome, ${name}!</h1><p>Thank you for joining ApniSec. We're excited to have you on board.</p>`;
        await this.send(to, subject, html);
    }
    
    public async sendPasswordResetEmail(to: string, resetUrl: string) {
        const subject = 'Your Password Reset Request';
        const html = `
            <h1>Password Reset Request</h1>
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste it into your browser to complete the process within 10 minutes of receiving it:</p>
            <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;
        await this.send(to, subject, html);
    }

    public async sendNewIssueNotification(userEmail: string, issue: IIssue) {
        const subject = `Confirmation: Your Issue "${issue.title}" has been created`;
        const html = `
            <h1>Thank you for your submission.</h1>
            <p>This is a confirmation that your issue has been successfully created.</p>
            <p><strong>ID:</strong> ${issue._id}</p>
            <p><strong>Title:</strong> ${issue.title}</p>
            <p><strong>Type:</strong> ${issue.type}</p>
            <p><strong>Priority:</strong> ${issue.priority || 'Not set'}</p>
            <p>Our team will review it shortly.</p>
        `;
        await this.send(userEmail, subject, html);
    }

    public async sendProfileUpdateNotification(to: string) {
        const subject = 'Your Profile Has Been Updated';
        const html = `<p>This is a confirmation that your ApniSec profile details were recently updated.</p>`;
        await this.send(to, subject, html);
    }
}
