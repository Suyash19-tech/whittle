import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI Store
 * Manages global UI state like theme, modals, and notifications
 */

interface UIState {
    // Theme
    isDarkMode: boolean;

    // Modal States
    isAuditModalOpen: boolean;
    isShareModalOpen: boolean;

    // Notification
    notification: {
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    } | null;

    // Actions
    toggleDarkMode: () => void;
    setDarkMode: (isDark: boolean) => void;
    openAuditModal: () => void;
    closeAuditModal: () => void;
    openShareModal: () => void;
    closeShareModal: () => void;
    showNotification: (
        type: 'success' | 'error' | 'info' | 'warning',
        message: string
    ) => void;
    clearNotification: () => void;
}

export const useUIStore = create<UIState>()(
    devtools((set) => ({
        // Initial state
        isDarkMode: false,
        isAuditModalOpen: false,
        isShareModalOpen: false,
        notification: null,

        // Actions
        toggleDarkMode: () =>
            set((state) => ({
                isDarkMode: !state.isDarkMode,
            })),

        setDarkMode: (isDark) => set({ isDarkMode: isDark }),

        openAuditModal: () => set({ isAuditModalOpen: true }),

        closeAuditModal: () => set({ isAuditModalOpen: false }),

        openShareModal: () => set({ isShareModalOpen: true }),

        closeShareModal: () => set({ isShareModalOpen: false }),

        showNotification: (type, message) =>
            set({
                notification: { type, message },
            }),

        clearNotification: () => set({ notification: null }),
    }))
);
