import { supabase } from './client';

export interface ConsultationRequest {
    name: string;
    email: string;
    preferred_time: string;
    challenge: string;
    estimated_savings: number;
    report_id: string;
}

export async function saveConsultationToSupabase(
    request: ConsultationRequest
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('consultation_requests')
            .insert({
                name: request.name,
                email: request.email,
                preferred_time: request.preferred_time,
                challenge: request.challenge,
                estimated_savings: request.estimated_savings,
                report_id: request.report_id,
            });

        if (error) {
            console.warn('[Whittle] Supabase consultation insert failed:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.warn('[Whittle] saveConsultationToSupabase threw:', err);
        return false;
    }
}
