import { NextRequest, NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/email/client';
import { getLeadEmailHtml, getConsultationEmailHtml } from '@/lib/email/templates';

/**
 * POST /api/email
 * 
 * Secure server-side endpoint to send transactional emails via Resend.
 * Prevents exposing the API key to the client.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, email, name, savings } = body;

        if (!resend) {
            console.error('Resend client not initialized');
            return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 });
        }

        if (!email || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let subject = '';
        let html = '';

        if (type === 'lead') {
            subject = 'Your Whittle AI Audit Report';
            html = getLeadEmailHtml(name, savings || 0);
        } else if (type === 'consultation') {
            subject = 'Whittle — Consultation Request Received';
            html = getConsultationEmailHtml(name, savings || 0);
        } else {
            return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: DEFAULT_FROM_EMAIL,
            to: [email],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (err) {
        console.error('Email API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
