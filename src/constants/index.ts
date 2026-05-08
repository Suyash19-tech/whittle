/**
 * Application constants
 * Centralized configuration for tools, pricing, and use cases
 */

// Supported AI Tools with pricing plans
export const SUPPORTED_AI_TOOLS = [
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        provider: 'OpenAI',
        category: 'llm' as const,
        icon: '🤖',
        plans: [
            { id: 'free', name: 'Free', price: 0 },
            { id: 'plus', name: 'Plus', price: 20 },
            { id: 'team', name: 'Team', price: 30 },
            { id: 'enterprise', name: 'Enterprise', price: 'Custom' },
        ],
    },
    {
        id: 'claude',
        name: 'Claude',
        provider: 'Anthropic',
        category: 'llm' as const,
        icon: '🧠',
        plans: [
            { id: 'free', name: 'Free', price: 0 },
            { id: 'pro', name: 'Pro', price: 20 },
            { id: 'team', name: 'Team', price: 30 },
        ],
    },
    {
        id: 'cursor',
        name: 'Cursor',
        provider: 'Cursor',
        category: 'code' as const,
        icon: '💻',
        plans: [
            { id: 'free', name: 'Free', price: 0 },
            { id: 'pro', name: 'Pro', price: 20 },
            { id: 'business', name: 'Business', price: 40 },
        ],
    },
    {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        provider: 'GitHub',
        category: 'code' as const,
        icon: '🐙',
        plans: [
            { id: 'free', name: 'Free', price: 0 },
            { id: 'individual', name: 'Individual', price: 10 },
            { id: 'business', name: 'Business', price: 21 },
        ],
    },
    {
        id: 'gemini',
        name: 'Gemini',
        provider: 'Google',
        category: 'llm' as const,
        icon: '✨',
        plans: [
            { id: 'free', name: 'Free', price: 0 },
            { id: 'pro', name: 'Pro', price: 20 },
        ],
    },
    {
        id: 'openai-api',
        name: 'OpenAI API',
        provider: 'OpenAI',
        category: 'api' as const,
        icon: '🔌',
        plans: [
            { id: 'payg', name: 'Pay-as-you-go', price: 'Variable' },
        ],
    },
    {
        id: 'anthropic-api',
        name: 'Anthropic API',
        provider: 'Anthropic',
        category: 'api' as const,
        icon: '🔗',
        plans: [
            { id: 'payg', name: 'Pay-as-you-go', price: 'Variable' },
        ],
    },
    {
        id: 'windsurf',
        name: 'Windsurf',
        provider: 'Codeium',
        category: 'code' as const,
        icon: '🌊',
        plans: [
            { id: 'free', name: 'Free', price: 0 },
            { id: 'pro', name: 'Pro', price: 15 },
        ],
    },
];

// Use Cases
export const USE_CASES = [
    {
        id: 'coding',
        label: 'Coding & Development',
        description: 'AI-powered code generation and assistance',
    },
    {
        id: 'writing',
        label: 'Writing & Content',
        description: 'Blog posts, marketing copy, documentation',
    },
    {
        id: 'research',
        label: 'Research & Analysis',
        description: 'Data research and analysis',
    },
    {
        id: 'data-analysis',
        label: 'Data Analysis',
        description: 'Processing and analyzing datasets',
    },
    {
        id: 'mixed',
        label: 'Mixed Use',
        description: 'Multiple use cases across team',
    },
];

// Pain Points
export const PAIN_POINTS = [
    'Unclear spending breakdown',
    'Duplicate tool usage',
    'Underutilized subscriptions',
    'No cost optimization strategy',
    'Difficult vendor management',
    'Lack of usage visibility',
];

// Pricing Plans (Placeholder)
export const PRICING_PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        description: 'Perfect for getting started',
        features: [
            'One free audit',
            'Basic recommendations',
            'Email support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 99,
        description: 'For growing teams',
        features: [
            'Unlimited audits',
            'Advanced recommendations',
            'Priority support',
            'Team collaboration',
            'Custom integrations',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        description: 'For large organizations',
        features: [
            'Everything in Pro',
            'Dedicated account manager',
            'Custom reporting',
            'SLA guarantee',
            'On-premise deployment',
        ],
    },
];

// Team Size Options
export const TEAM_SIZES = [
    { value: '1-5', label: '1-5 people' },
    { value: '6-20', label: '6-20 people' },
    { value: '21-50', label: '21-50 people' },
    { value: '51-100', label: '51-100 people' },
    { value: '100+', label: '100+ people' },
];

// Recommendation Impact Levels
export const IMPACT_LEVELS = {
    high: { label: 'High Impact', color: 'text-red-600', bgColor: 'bg-red-50' },
    medium: {
        label: 'Medium Impact',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
    },
    low: {
        label: 'Low Impact',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
    },
};

// API Configuration
export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 3,
};

// Feature Flags
export const FEATURE_FLAGS = {
    enableSharing: true,
    enableExport: true,
    enableTeamCollaboration: false,
    enableAdvancedAnalytics: false,
};
