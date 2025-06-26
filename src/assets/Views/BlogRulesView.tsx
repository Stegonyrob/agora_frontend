import LegalTextGeneric from "@/assets/Components/Legal/LegalTextGeneric";
import { LegalTextDTO } from "@/core/legals/LegalTextDTO";
import { LegalTextService } from "@/core/legals/LegalTextService";
import React, { useEffect, useState } from "react";

const BlogRulesView: React.FC = () => {
    const [legalText, setLegalText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const legalTextService = new LegalTextService();
        legalTextService.getLegalTextByType('blog-rules')
            .then(data => setLegalText(data))
            .catch(() => setLegalText(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="legal-text-view">
            {loading ? (
                <p>Cargando reglas de la comunidad...</p>
            ) : legalText ? (
                <LegalTextGeneric
                    type="blog-rules"
                    mainTitle={legalText.title}
                    text={legalText.content}
                    updatedAt={legalText.updatedAt ?? ""}
                />
            ) : (
                <p>Reglas de la comunidad no encontradas</p>
            )}
        </div>
    );
};

export default BlogRulesView;
