import { supabase } from './client';

export interface AuditLead {
    name: string;
    email: string;
    company?: string;
    role?: string;
    team_size: string;
    report_id: string;
    estimated_savings: number;
}

export async function saveLeadToSupabase(lead: AuditLead): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('audit_leads')
            .insert({
                name: lead.name,
                email: lead.email,
                company: lead.company || null,
                role: lead.role || null,
                team_size: lead.team_size,
                report_id: lead.report_id,
                estimated_savings: lead.estimated_savings
            });

        if (error) {
            console.warn('[Whittle] Supabase lead insert failed:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.warn('[Whittle] saveLeadToSupabase threw:', err);
        return false;
    }
}
