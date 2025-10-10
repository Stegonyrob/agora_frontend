import { useEffect, useState } from 'react';

export const useDaltonicMode = () => {
    const [isDaltonicMode, setIsDaltonicMode] = useState<boolean>(false);

    const updateDaltonicModeFromStorage = () => {
        try {
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (typeof settings.daltonic === 'boolean') {
                    setIsDaltonicMode(settings.daltonic);
                }
            }
        } catch (error) {
            console.error('Error parsing saved settings for daltonic mode:', error);
        }
    };

    useEffect(() => {
        // Load initial daltonic mode from localStorage
        updateDaltonicModeFromStorage();

        // Listen for storage changes (when settings are updated)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'settings') {
                updateDaltonicModeFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events when settings modal is used in the same tab
        const handleSettingsUpdate = () => {
            updateDaltonicModeFromStorage();
        };

        window.addEventListener('settingsUpdated', handleSettingsUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('settingsUpdated', handleSettingsUpdate);
        };
    }, []);

    useEffect(() => {
        // Apply daltonic mode class to body
        const bodyElement = document.body;

        if (isDaltonicMode) {
            bodyElement.classList.add('daltonic-mode');
        } else {
            bodyElement.classList.remove('daltonic-mode');
        }
    }, [isDaltonicMode]);

    return { isDaltonicMode, setIsDaltonicMode };
};