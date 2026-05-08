/**
 * Tool Icons — clean monochrome SVG icons for each AI tool
 * Replaces emojis for a professional, fintech-grade appearance
 */

interface IconProps {
    className?: string;
}

export function ChatGPTIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M22.28 9.28a5.76 5.76 0 0 0-.49-4.73 5.83 5.83 0 0 0-6.27-2.8A5.76 5.76 0 0 0 11.18 0a5.83 5.83 0 0 0-5.56 4.04 5.76 5.76 0 0 0-3.84 2.8 5.83 5.83 0 0 0 .72 6.84 5.76 5.76 0 0 0 .49 4.73 5.83 5.83 0 0 0 6.27 2.8A5.76 5.76 0 0 0 12.82 24a5.83 5.83 0 0 0 5.56-4.04 5.76 5.76 0 0 0 3.84-2.8 5.83 5.83 0 0 0-.72-6.84l-.22.16ZM12.82 22.5a4.33 4.33 0 0 1-2.78-1.01l.14-.08 4.62-2.67a.77.77 0 0 0 .38-.66v-6.51l1.95 1.13a.07.07 0 0 1 .04.05v5.4a4.34 4.34 0 0 1-4.35 4.35ZM3.38 18.37a4.33 4.33 0 0 1-.52-2.91l.14.08 4.62 2.67a.77.77 0 0 0 .76 0l5.64-3.26v2.26a.07.07 0 0 1-.03.06L9.3 20.01a4.34 4.34 0 0 1-5.92-1.64ZM2.2 7.87a4.33 4.33 0 0 1 2.26-1.9v5.47a.77.77 0 0 0 .38.66l5.64 3.26-1.95 1.13a.07.07 0 0 1-.07 0L3.8 13.8A4.34 4.34 0 0 1 2.2 7.87Zm16.04 3.73-5.64-3.26 1.95-1.13a.07.07 0 0 1 .07 0l4.66 2.69a4.34 4.34 0 0 1-.67 7.83v-5.47a.77.77 0 0 0-.37-.66Zm1.94-2.93-.14-.08-4.62-2.67a.77.77 0 0 0-.76 0L9.02 9.18V6.92a.07.07 0 0 1 .03-.06l4.66-2.69a4.34 4.34 0 0 1 6.47 4.5ZM8.07 12.9 6.12 11.77a.07.07 0 0 1-.04-.05V6.32a4.34 4.34 0 0 1 7.12-3.33l-.14.08-4.62 2.67a.77.77 0 0 0-.38.66L8.07 12.9Zm1.06-2.28 2.51-1.45 2.51 1.45v2.9l-2.51 1.45-2.51-1.45v-2.9Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function ClaudeIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M17.33 2H6.67A4.67 4.67 0 0 0 2 6.67v10.66A4.67 4.67 0 0 0 6.67 22h10.66A4.67 4.67 0 0 0 22 17.33V6.67A4.67 4.67 0 0 0 17.33 2ZM13.6 16.4h-1.4l-3.6-8.8h1.5l2.8 7.1 2.8-7.1h1.5L13.6 16.4Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function CursorIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M4 2L20 12L13 13.5L9.5 20L4 2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}

export function GithubCopilotIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function GeminiIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.5 11h-3.5v3.5h-2V13H7.5v-2H11V7.5h2V11h3.5v2Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function OpenAIIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M22.28 9.28a5.76 5.76 0 0 0-.49-4.73 5.83 5.83 0 0 0-6.27-2.8A5.76 5.76 0 0 0 11.18 0a5.83 5.83 0 0 0-5.56 4.04 5.76 5.76 0 0 0-3.84 2.8 5.83 5.83 0 0 0 .72 6.84 5.76 5.76 0 0 0 .49 4.73 5.83 5.83 0 0 0 6.27 2.8A5.76 5.76 0 0 0 12.82 24a5.83 5.83 0 0 0 5.56-4.04 5.76 5.76 0 0 0 3.84-2.8 5.83 5.83 0 0 0-.72-6.84l-.22.16Z"
                fill="currentColor"
                opacity="0.9"
            />
        </svg>
    );
}

export function AnthropicIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M13.8 3h-3.6L4 21h3.6l1.3-3.6h6.2L16.4 21H20L13.8 3Zm-3.9 11.4 2.1-5.9 2.1 5.9H9.9Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function WindsurfIcon({ className = 'h-5 w-5' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M3 18 C6 10, 12 4, 21 3 C18 8, 14 11, 12 18 Z"
                fill="currentColor"
                opacity="0.85"
            />
            <path
                d="M3 18 C7 16, 10 16, 12 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}

// Map tool IDs to icon components
export const TOOL_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
    'chatgpt': ChatGPTIcon,
    'claude': ClaudeIcon,
    'cursor': CursorIcon,
    'github-copilot': GithubCopilotIcon,
    'gemini': GeminiIcon,
    'openai-api': OpenAIIcon,
    'anthropic-api': AnthropicIcon,
    'windsurf': WindsurfIcon,
};
