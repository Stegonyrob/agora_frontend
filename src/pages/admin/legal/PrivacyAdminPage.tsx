import LegalTextManager from '@/assets/Components/Legal/LegalTextManager';
import React from 'react';

/**
 * Página de administración para la Política de Privacidad
 * 
 * Esta página permite a los administradores:
 * - Ver la política de privacidad actual
 * - Editar la política usando el editor HTML
 * - Ver una vista previa de cómo se ve para los usuarios
 */
const PrivacyAdminPage: React.FC = () => {
    return (
        <LegalTextManager
            type="privacy"
            asAdmin={true}
        />
    );
};

export default PrivacyAdminPage;
