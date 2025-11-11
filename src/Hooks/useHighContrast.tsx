import { useEffect, useState } from 'react';

export const useHighContrast = () => {
    const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

    const updateHighContrastFromStorage = () => {
        try {
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (typeof settings.highContrast === 'boolean') {
                    setIsHighContrast(settings.highContrast);
                }
            }
        } catch (error) {
            console.error('Error parsing saved settings for high contrast:', error);
        }
    };

    useEffect(() => {
        // Load initial high contrast from localStorage
        updateHighContrastFromStorage();

        // Listen for storage changes (when settings are updated)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'settings') {
                updateHighContrastFromStorage();
            }
        };

        globalThis.addEventListener('storage', handleStorageChange);

        // Also listen for custom events when settings modal is used in the same tab
        const handleSettingsUpdate = () => {
            updateHighContrastFromStorage();
        };

        globalThis.addEventListener('settingsUpdated', handleSettingsUpdate);

        return () => {
            globalThis.removeEventListener('storage', handleStorageChange);
            globalThis.removeEventListener('settingsUpdated', handleSettingsUpdate);
        };
    }, []);

    useEffect(() => {
        // Apply high contrast class to body
        const bodyElement = document.body;
        const htmlElement = document.documentElement;

        if (isHighContrast) {
            bodyElement.classList.add('high-contrast-mode');
            // Aplicar estilos de alto contraste directamente
            bodyElement.style.borderLeft = '8px solid #ff00ff';
            bodyElement.style.boxShadow = 'inset 8px 0 20px rgba(255, 0, 255, 0.3)';
            bodyElement.style.background = '#000000';
            bodyElement.style.color = '#ffffff';
            htmlElement.style.background = '#000000';

            // Aplicar filtro de alto contraste solo al contenido principal
            // Excluir modales de Bootstrap que tienen clase .modal
            const mainContent = document.querySelector('#root');
            if (mainContent instanceof HTMLElement) {
                mainContent.style.filter = 'contrast(1.5) brightness(1.2)';
            }
        } else {
            bodyElement.classList.remove('high-contrast-mode');
            bodyElement.style.borderLeft = '';
            bodyElement.style.boxShadow = '';
            bodyElement.style.background = '';
            bodyElement.style.color = '';
            htmlElement.style.background = '';

            // Remover filtro del contenido principal
            const mainContent = document.querySelector('#root');
            if (mainContent instanceof HTMLElement) {
                mainContent.style.filter = '';
            }
        }
    }, [isHighContrast]);

    return { isHighContrast, setIsHighContrast };
};
