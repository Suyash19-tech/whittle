/**
 * Email Service (Client Side)
 * 
 * Non-blocking helper to trigger transactional emails after form submissions.
 * Guaranteed not to break the main UI flow if it fails.
 */

interface SendEmailParams {
    type: 'lead' | 'consultation';
    email: string;
    name: string;
    savings: number;
}

export async function triggerConfirmationEmail(params: SendEmailParams) {
    try {
        // Non-blocking fire-and-forget (or at least we don't await the result in the UI)
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const error = await response.json();
            console.warn('Email trigger failed:', error);
        }
    } catch (err) {
        // We catch everything because this is non-critical for the user UX
        console.error('Failed to trigger email:', err);
    }
}
