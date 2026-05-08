import { apiService } from './api';
import type { AuditFormData, AuditResult, ApiResponse } from '@/types';

/**
 * Audit Service
 * Handles all audit-related API calls
 * Placeholder for backend integration
 */

export const auditService = {
    /**
     * Submit audit form and get results
     */
    async submitAudit(data: AuditFormData): Promise<AuditResult> {
        return apiService.post<AuditResult>('/api/audits', data);
    },

    /**
     * Get audit results by ID
     */
    async getAuditResults(auditId: string): Promise<AuditResult> {
        return apiService.get<AuditResult>(`/api/audits/${auditId}`);
    },

    /**
     * Get user's audit history
     */
    async getAuditHistory(): Promise<AuditResult[]> {
        return apiService.get<AuditResult[]>('/api/audits');
    },

    /**
     * Share audit results
     */
    async shareAudit(
        auditId: string,
        expiresIn?: number
    ): Promise<{ shareToken: string; shareUrl: string }> {
        return apiService.post(`/api/audits/${auditId}/share`, { expiresIn });
    },

    /**
     * Get shared audit results
     */
    async getSharedAudit(shareToken: string): Promise<AuditResult> {
        return apiService.get<AuditResult>(`/api/audits/share/${shareToken}`);
    },

    /**
     * Export audit results as PDF
     */
    async exportAuditPDF(auditId: string): Promise<Blob> {
        return apiService.get<Blob>(`/api/audits/${auditId}/export/pdf`, {
            responseType: 'blob',
        });
    },

    /**
     * Export audit results as CSV
     */
    async exportAuditCSV(auditId: string): Promise<Blob> {
        return apiService.get<Blob>(`/api/audits/${auditId}/export/csv`, {
            responseType: 'blob',
        });
    },
};
