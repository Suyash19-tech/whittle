/**
 * shareReport — public API for report sharing
 *
 * This module is the single entry point for all sharing operations.
 * Internally it delegates to Supabase for persistence.
 *
 * The public interface (saveReport, buildShareUrl) is unchanged from the
 * localStorage version — callers don't need to know about the storage layer.
 *
 * Migration note:
 *   saveReport is now async (was sync). Callers must await it.
 */

import type { AuditResult } from '@/types/audit';
import { saveReportToSupabase } from './supabase/reports';

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * saveReport
 * Persists an AuditResult to Supabase and returns the share ID.
 * Returns null if the insert fails for any reason.
 */
export async function saveReport(audit: AuditResult): Promise<string | null> {
    return saveReportToSupabase(audit);
}

// ─── Share URL ────────────────────────────────────────────────────────────────

/**
 * buildShareUrl
 * Returns the full public URL for a shared report.
 */
export function buildShareUrl(id: string): string {
    const base =
        typeof window !== 'undefined'
            ? window.location.origin
            : (process.env.NEXT_PUBLIC_APP_URL ?? 'https://whittle.app');
    return `${base}/share/${id}`;
}
