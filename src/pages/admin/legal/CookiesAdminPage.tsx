import LegalTextManager from '@/assets/Components/Legal/LegalTextManager';
import React from 'react';

/**
 * Página de administración para la Política de Cookies
 * 
 * Esta página permite a los administradores:
 * - Ver la política de cookies actual
 * - Editar la política usando el editor HTML
 * - Ver una vista previa de cómo se ve para los usuarios
 */
const CookiesAdminPage: React.FC = () => {
    return (
        <LegalTextManager
            type="cookies"
            asAdmin={true}
        />
    );
};

export default CookiesAdminPage;
