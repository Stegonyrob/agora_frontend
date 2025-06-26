import { useEffect, useState } from 'react';

export type FontSize = 'small' | 'medium' | 'large';

export const useFontSize = () => {
    const [fontSize, setFontSize] = useState<FontSize>('small');

    const updateFontSizeFromStorage = () => {
        try {
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (settings.fontSize && ['small', 'medium', 'large'].includes(settings.fontSize)) {
                    setFontSize(settings.fontSize);
                }
            }
        } catch (error) {
            console.error('Error parsing saved settings:', error);
        }
    };

    useEffect(() => {
        // Load initial fontSize from localStorage
        updateFontSizeFromStorage();

        // Listen for storage changes (when settings are updated)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'settings') {
                updateFontSizeFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events when settings modal is used in the same tab
        const handleSettingsUpdate = () => {
            updateFontSizeFromStorage();
        };

        window.addEventListener('settingsUpdated', handleSettingsUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('settingsUpdated', handleSettingsUpdate);
        };
    }, []);

    useEffect(() => {
        // Apply font size class to body only
        const bodyElement = document.body;

        // Remove existing font size classes
        bodyElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');

        // Add the new font size class
        bodyElement.classList.add(`font-size-${fontSize}`);
    }, [fontSize]);

    return { fontSize, setFontSize };
};
