import { useEffect, useState } from 'react';

export const useColorBlindMode = () => {
    const [isColorBlindMode, setIsColorBlindMode] = useState<boolean>(false);

    const updateColorBlindModeFromStorage = () => {
        try {
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (typeof settings.colorBlind === 'boolean') {
                    setIsColorBlindMode(settings.colorBlind);
                }
            }
        } catch (error) {
            console.error('Error parsing saved settings for color blind mode:', error);
        }
    };

    useEffect(() => {
        // Load initial color blind mode from localStorage
        updateColorBlindModeFromStorage();

        // Listen for storage changes (when settings are updated)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'settings') {
                updateColorBlindModeFromStorage();
            }
        };

        globalThis.addEventListener('storage', handleStorageChange);

        // Also listen for custom events when settings modal is used in the same tab
        const handleSettingsUpdate = () => {
            updateColorBlindModeFromStorage();
        };

        globalThis.addEventListener('settingsUpdated', handleSettingsUpdate);

        return () => {
            globalThis.removeEventListener('storage', handleStorageChange);
            globalThis.removeEventListener('settingsUpdated', handleSettingsUpdate);
        };
    }, []);

    useEffect(() => {
        // Apply color blind mode class to body
        const bodyElement = document.body;

        if (isColorBlindMode) {
            bodyElement.classList.add('color-blind-mode');
            // Aplicar estilos directamente como indicador visual
            bodyElement.style.borderTop = '5px solid #f39c12';
            bodyElement.style.boxShadow = 'inset 0 5px 15px rgba(243, 156, 18, 0.2)';

            // Aplicar filtro para mejorar distinción de colores (deuteranopia - daltonismo rojo-verde)
            // Ajusta saturación y matiz para hacer colores más distinguibles
            const mainContent = document.querySelector('#root');
            if (mainContent instanceof HTMLElement) {
                mainContent.style.filter = 'saturate(1.3) hue-rotate(-10deg) contrast(1.1)';
            }
        } else {
            bodyElement.classList.remove('color-blind-mode');
            bodyElement.style.borderTop = '';
            bodyElement.style.boxShadow = '';

            // Remover filtro del contenido principal
            const mainContent = document.querySelector('#root');
            if (mainContent instanceof HTMLElement) {
                mainContent.style.filter = '';
            }
        }
    }, [isColorBlindMode]);

    return { isColorBlindMode, setIsColorBlindMode };
};
