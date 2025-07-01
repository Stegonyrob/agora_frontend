import LegalTextManager from '@/assets/Components/Legal/LegalTextManager';
import { LegalTextType } from '@/core/legals/LegalTextTemplates';
import React from 'react';
import { useParams } from 'react-router-dom';

const AdminLegalTextView: React.FC = () => {
    const validTypes: LegalTextType[] = ['terms', 'privacy', 'cookies', 'blog-rules'];
    const { type } = useParams<{ type?: string }>();
    const selectedType = validTypes.includes(type as LegalTextType) ? type as LegalTextType : 'terms';

    return <LegalTextManager type={selectedType} asAdmin={true} />;
};

export default AdminLegalTextView;
