import { Resend } from 'resend';

// Initializing as null if key is missing to avoid constructor errors during build time
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends a welcome email to new students.
 * Uses onboarding@resend.dev for testing if no custom domain is verified.
 */
export async function sendWelcomeEmail(to: string, name: string) {
    if (!resend) {
        console.warn('RESEND_API_KEY not found. Skipping welcome email.');
        return;
    }

    try {
        await resend.emails.send({
            from: 'CoursePro <onboarding@resend.dev>',
            to,
            subject: 'Welcome to CoursePro! 🚀',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; rounded: 24px;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to the community, ${name}!</h1>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">We're thrilled to have you here. Your account is ready, and you can start browsing our expert-led courses immediately.</p>
                    <div style="margin-top: 32px; padding: 20px; background: #f8fafc; border-radius: 16px;">
                        <h2 style="color: #7c3aed; font-size: 18px; font-weight: 700; margin-bottom: 8px;">Next Steps:</h2>
                        <ul style="color: #475569; font-size: 14px; padding-left: 20px;">
                            <li>Complete your profile in the dashboard.</li>
                            <li>Enroll in your first course.</li>
                            <li>Join our student community on Discord.</li>
                        </ul>
                    </div>
                    <p style="margin-top: 32px; color: #94a3b8; font-size: 12px; text-align: center;">© 2026 CoursePro. Built for builders.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}

/**
 * Sends a confirmation email after a manual payment is activated by an admin.
 */
export async function sendPaymentConfirmedEmail(to: string, name: string, amount: number, plan: string) {
    if (!resend) {
        console.warn('RESEND_API_KEY not found. Skipping payment confirmation email.');
        return;
    }

    try {
        await resend.emails.send({
            from: 'CoursePro <onboarding@resend.dev>',
            to,
            subject: 'Your Access is Active! ✅',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 24px;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Good news, ${name}!</h1>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Your payment has been verified. Your access to <strong>${plan}</strong> is now active.</p>
                    <div style="margin: 32px 0; padding: 24px; border: 2px dashed #e2e8f0; border-radius: 16px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Amount Processed</p>
                        <p style="color: #0f172a; font-size: 32px; font-weight: 900; margin: 0;">$${amount}</p>
                    </div>
                    <a href="http://localhost:3000/dashboard" style="display: block; width: 100%; text-align: center; padding: 16px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700;">Go to Dashboard</a>
                    <p style="margin-top: 32px; color: #94a3b8; font-size: 12px; text-align: center;">© 2026 CoursePro. All rights reserved.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send payment confirmation email:', error);
    }
}
