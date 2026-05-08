import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Premium fintech palette - sky blue aesthetic
                slate: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                },
                // Primary: Sky Blue (light, airy, approachable)
                sky: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c3d66',
                    950: '#051e3e',
                },
                // Secondary: Cyan (fresh, modern)
                cyan: {
                    50: '#ecf9ff',
                    100: '#cff2ff',
                    200: '#a3e9ff',
                    300: '#67deff',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                },
                // Accent: Teal (growth, positive)
                teal: {
                    50: '#f0fdfa',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                },
                // Warning: Soft amber
                amber: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                // Error: Soft red
                red: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
            },
            spacing: {
                // Premium whitespace system
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '3rem',
                '2xl': '4rem',
                '3xl': '6rem',
            },
            borderRadius: {
                // Rounded-xl aesthetic
                xs: '0.375rem',
                sm: '0.5rem',
                md: '0.75rem',
                lg: '1rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                // Subtle shadows for glassmorphism
                xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                glass: '0 8px 32px 0 rgba(6, 182, 212, 0.1)',
                'glass-sm': '0 4px 16px 0 rgba(6, 182, 212, 0.08)',
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '16px',
            },
            backgroundImage: {
                // Soft gradients for premium feel
                'gradient-soft': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                'gradient-sky': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                'gradient-subtle': 'linear-gradient(135deg, #f0f9ff 0%, #ecf9ff 100%)',
            },
            animation: {
                // Smooth motion animations
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
