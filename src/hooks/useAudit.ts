'use client';

import { useState } from 'react';
import { useAuditStore } from '@/store/audit.store';
import { auditService } from '@/services/audit.service';
import type { AuditFormData, AuditResult } from '@/types';

/**
 * useAudit Hook
 * Custom hook for audit operations
 * Handles form submission, loading states, and error handling
 */

export function useAudit() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        formData,
        setFormData,
        setAuditResults,
        addToPreviousAudits,
        clearFormData,
    } = useAuditStore();

    /**
     * Submit audit form
     */
    const submitAudit = async (data: AuditFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Update form data in store
            setFormData(data);

            // Call API
            const results = await auditService.submitAudit(data);

            // Store results
            setAuditResults(results);
            addToPreviousAudits(results);

            return results;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to submit audit';
            setError(errorMessage);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Get audit results
     */
    const getResults = async (auditId: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const results = await auditService.getAuditResults(auditId);
            setAuditResults(results);
            return results;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to fetch results';
            setError(errorMessage);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Share audit
     */
    const shareAudit = async (auditId: string) => {
        try {
            const { shareToken, shareUrl } = await auditService.shareAudit(auditId);
            return { shareToken, shareUrl };
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to share audit';
            setError(errorMessage);
            throw err;
        }
    };

    /**
     * Export audit
     */
    const exportAudit = async (auditId: string, format: 'pdf' | 'csv') => {
        try {
            const blob =
                format === 'pdf'
                    ? await auditService.exportAuditPDF(auditId)
                    : await auditService.exportAuditCSV(auditId);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit-${auditId}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to export audit';
            setError(errorMessage);
            throw err;
        }
    };

    return {
        formData,
        isSubmitting,
        error,
        submitAudit,
        getResults,
        shareAudit,
        exportAudit,
        setFormData,
        clearFormData,
    };
}
