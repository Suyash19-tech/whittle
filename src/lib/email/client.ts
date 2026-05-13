import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    // Only throw in production if you want to be strict, 
    // or just log a warning to prevent breaking the build/dev server.
    if (process.env.NODE_ENV === 'production') {
        console.warn('RESEND_API_KEY is missing');
    }
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// The default "from" email for Resend trial accounts is onboarding@resend.dev
// For custom domains, this should be updated.
export const DEFAULT_FROM_EMAIL = 'Whittle <onboarding@resend.dev>';
