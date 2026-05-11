/**
 * Supabase report persistence service
 *
 * Table: reports
 * Columns:
 *   id         text  primary key   — short alphanumeric ID, e.g. "a3f9k2xz"
 *   created_at timestamptz         — auto-set by Supabase
 *   data       jsonb               — full AuditResult serialised as JSON
 *
 * Design decisions:
 * - IDs are short (8 chars) and human-readable — easy to share verbally
 * - The full AuditResult is stored as a single JSONB blob — no relational
 *   schema needed for MVP. Easy to query, easy to migrate later.
 * - All functions return typed results and never throw — callers get null
 *   on failure so the UI can degrade gracefully without try/catch everywhere.
 */

import { supabase } from './client';
import type { AuditResult } from '@/types/audit';

// ─── Types ────────────────────────────────────────────────────────────────────

/** The shape stored in the `reports` table */
export interface PersistedReport {
    id: string;
    created_at: string;
    data: AuditResult;
}

// ─── ID generation ────────────────────────────────────────────────────────────

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * generateReportId
 * Returns an 8-character random alphanumeric string.
 * Collision probability at MVP scale is negligible.
 */
export function generateReportId(): string {
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return id;
}

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * saveReportToSupabase
 *
 * Inserts an AuditResult into the `reports` table.
 * Returns the generated ID on success, null on any failure.
 *
 * Failure modes handled:
 * - Network error
 * - Supabase insert error (e.g. RLS policy, duplicate key)
 * - Missing environment variables
 */
export async function saveReportToSupabase(audit: AuditResult): Promise<string | null> {
    try {
        const id = generateReportId();

        const { error } = await supabase
            .from('reports')
            .insert({ id, data: audit });

        if (error) {
            console.warn('[Whittle] Supabase insert failed:', error.message);
            return null;
        }

        return id;
    } catch (err) {
        console.warn('[Whittle] saveReportToSupabase threw:', err);
        return null;
    }
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * fetchReportFromSupabase
 *
 * Retrieves a report by ID from the `reports` table.
 * Returns the AuditResult on success, null if not found or on any error.
 *
 * Failure modes handled:
 * - Network error
 * - Row not found (PGRST116)
 * - Malformed data in the `data` column
 * - Missing environment variables
 */
export async function fetchReportFromSupabase(id: string): Promise<AuditResult | null> {
    if (!id || id.length < 4) return null;

    try {
        const { data, error } = await supabase
            .from('reports')
            .select('data')
            .eq('id', id)
            .single();

        if (error) {
            // PGRST116 = row not found — expected for invalid IDs, not a real error
            if (error.code !== 'PGRST116') {
                console.warn('[Whittle] Supabase fetch failed:', error.message);
            }
            return null;
        }

        return (data?.data as AuditResult) ?? null;
    } catch (err) {
        console.warn('[Whittle] fetchReportFromSupabase threw:', err);
        return null;
    }
}
