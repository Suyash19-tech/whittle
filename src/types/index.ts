/**
 * Core type definitions for Whittle
 * Centralized type management for consistency across the app
 */

// AI Tools and Services
export interface AITool {
    id: string;
    name: string;
    category: 'llm' | 'embedding' | 'vision' | 'audio' | 'other';
    provider: string;
    monthlySpend: number;
    usageMetrics?: {
        apiCalls: number;
        tokens?: number;
        requests?: number;
    };
    costPerUnit: number;
    currency: string;
}

// Audit Form Data
export interface AuditFormData {
    companyName: string;
    teamSize: number;
    useCase: string;
    tools: AITool[];
    monthlyBudget: number;
    painPoints: string[];
}

// Audit Results
export interface AuditResult {
    id: string;
    createdAt: Date;
    companyName: string;
    totalMonthlySpend: number;
    potentialSavings: number;
    savingsPercentage: number;
    recommendations: Recommendation[];
    tools: AITool[];
    summary: string;
}

// Recommendations
export interface Recommendation {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    estimatedSavings: number;
    priority: number;
    actionItems: string[];
}

// User Profile
export interface UserProfile {
    id: string;
    email: string;
    companyName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

// Audit Share
export interface AuditShare {
    id: string;
    auditId: string;
    shareToken: string;
    createdAt: Date;
    expiresAt?: Date;
    viewCount: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Form State
export interface FormState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}
