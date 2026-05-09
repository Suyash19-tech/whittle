/**
 * shareReport — lightweight client-side report persistence
 *
 * Reports are stored in localStorage under the key `whittle_report_<id>`.
 * The ID is a short random alphanumeric string — collision probability is
 * negligible for an MVP with no concurrent users sharing the same browser.
 *
 * Storage contract:
 *   key:   "whittle_report_<id>"
 *   value: JSON-serialised SharedReport
 *
 * When Supabase is added later, replace saveReport / loadReport with
 * API calls — the ID format and ShareReport shape stay the same.
 */

import type { AuditResult } from '@/types/audit';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SharedReport {
    /** Short unique identifier, e.g. "a3f9k2" */
    id: string;
    /** ISO timestamp of when the report was shared */
    createdAt: string;
    /** The full audit result to display on the share page */
    audit: AuditResult;
}

// ─── ID generation ────────────────────────────────────────────────────────────

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 8;

/**
 * generateReportId
 * Returns a short random alphanumeric string, e.g. "a3f9k2xz"
 */
export function generateReportId(): string {
    let id = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        id += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return id;
}

// ─── Storage key ──────────────────────────────────────────────────────────────

const storageKey = (id: string) => `whittle_report_${id}`;

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * saveReport
 * Persists an AuditResult to localStorage and returns the share ID.
 * Returns null if localStorage is unavailable (SSR or private browsing).
 */
export function saveReport(audit: AuditResult): string | null {
    if (typeof window === 'undefined') return null;

    try {
        const id = generateReportId();
        const report: SharedReport = {
            id,
            createdAt: new Date().toISOString(),
            audit,
        };
        localStorage.setItem(storageKey(id), JSON.stringify(report));
        return id;
    } catch {
        // localStorage full or blocked
        console.warn('[Whittle] Could not save report to localStorage');
        return null;
    }
}

// ─── Load ─────────────────────────────────────────────────────────────────────

/**
 * loadReport
 * Retrieves a SharedReport by ID from localStorage.
 * Returns null if not found or if the stored data is malformed.
 */
export function loadReport(id: string): SharedReport | null {
    if (typeof window === 'undefined') return null;

    try {
        const raw = localStorage.getItem(storageKey(id));
        if (!raw) return null;
        return JSON.parse(raw) as SharedReport;
    } catch {
        console.warn('[Whittle] Could not parse stored report for id:', id);
        return null;
    }
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
