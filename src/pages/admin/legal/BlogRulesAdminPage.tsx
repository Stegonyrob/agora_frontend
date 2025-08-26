import LegalTextManager from '@/assets/Components/Legal/LegalTextManager';
import React from 'react';

/**
 * Página de administración para las Reglas del Blog
 * 
 * Esta página permite a los administradores:
 * - Ver las reglas actuales del blog
 * - Editar las reglas usando el editor HTML
 * - Ver una vista previa de cómo se ven para los usuarios
 * 
 * Las reglas editadas aquí serán las que se muestren en:
 * - El modal de registro de usuarios
 * - La página pública de reglas del blog
 */
const BlogRulesAdminPage: React.FC = () => {
    return (
        <LegalTextManager
            type="blog-rules"
            asAdmin={true}
        />
    );
};

export default BlogRulesAdminPage;
