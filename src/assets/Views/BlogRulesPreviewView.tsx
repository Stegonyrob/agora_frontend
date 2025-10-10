import LegalTextGeneric from "@/assets/Components/Legal/LegalTextGeneric";
import { LegalTextDTO } from "@/core/legals/LegalTextDTO";
import { LegalTextService } from "@/core/legals/LegalTextService";
import React, { useEffect, useState } from "react";

const BlogRulesPreviewView: React.FC = () => {
    const [legalText, setLegalText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const legalTextService = new LegalTextService();

        legalTextService.getLegalTextByType("blog-rules")
            .then(data => {

                setLegalText(data);
            })
            .catch((err) => {
                console.error('[BlogRulesPreviewView] Error fetching blog rules:', err);
                setLegalText(null);
            })
            .finally(() => {

                setLoading(false);
            });
    }, []);

    return (
        <div className="blog-rules-preview-view">
            {loading ? (
                <p>Cargando reglas del blog...</p>
            ) : legalText ? (
                <>
                    <LegalTextGeneric
                        type="blog-rules"
                        mainTitle={legalText.title}
                        text={legalText.content}
                        updatedAt={legalText.updatedAt ?? ""}
                    />
                </>
            ) : (
                <>
                    <p>No se encontraron las reglas del blog</p>
                </>
            )}
        </div>
    );
};

export default BlogRulesPreviewView;
