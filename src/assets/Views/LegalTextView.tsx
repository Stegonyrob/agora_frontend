import LegalTextGeneric from "@/assets/Components/Legal/LegalTextGeneric";
import { LegalTextDTO } from "@/core/legals/LegalTextDTO";
import { LegalTextService } from "@/core/legals/LegalTextService";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const LegalTextView: React.FC = () => {
    const validTypes = ["terms", "privacy", "cookies", "blog-rules"];
    const { type } = useParams<{ type?: string }>();
    const location = useLocation();

    // Si estamos en /blog-rules-preview, usar "blog-rules" como tipo
    const selectedType = location.pathname === '/blog-rules-preview'
        ? 'blog-rules'
        : validTypes.includes(type ?? "") ? type! : "terms";

    const [legalText, setLegalText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const legalTextService = new LegalTextService();

        legalTextService.getLegalTextByType(selectedType)
            .then(data => {

                setLegalText(data);
            })
            .catch((err) => {
                console.error('[LegalTextView] Error fetching legal text:', err);
                setLegalText(null);
            })
            .finally(() => {

                setLoading(false);
            });
    }, [selectedType]);

    return (
        <div className="legal-text-view">
            {loading ? (
                <p>Cargando...</p>
            ) : legalText ? (
                <>
                    {console.log('[LegalTextView] Renderizando LegalTextGeneric:', legalText)}
                    <LegalTextGeneric
                        type={selectedType}
                        mainTitle={legalText.title}
                        text={legalText.content}
                        updatedAt={legalText.updatedAt ?? ""}
                    />
                </>
            ) : (
                <>
                    {console.log('[LegalTextView] No encontrado para type:', selectedType)}
                    <p>No encontrado</p>
                </>
            )}
        </div>
    );
};

export default LegalTextView;
