import LegalTextGeneric from "@/assets/Components/Legal/LegalTextGeneric";
import { LegalTextDTO } from "@/core/legals/LegalTextDTO";
import { LegalTextService } from "@/core/legals/LegalTextService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LegalTextView: React.FC = () => {
    const validTypes = ["terms", "privacy", "cookies"];;
    const { type } = useParams<{ type?: string }>();
    const selectedType = validTypes.includes(type ?? "") ? type! : "terms";
    const [legalText, setLegalText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const legalTextService = new LegalTextService();
        legalTextService.getLegalTextByType(selectedType)
            .then(data => setLegalText(data))
            .catch(() => setLegalText(null))
            .finally(() => setLoading(false));
    }, [selectedType]);

    return (
        <div className="legal-text-view">
            {loading ? (
                <p>Cargando...</p>
            ) : legalText ? (
                <LegalTextGeneric
                    type={selectedType}
                    mainTitle={legalText.title}
                    text={legalText.content}
                    updatedAt={legalText.updatedAt ?? ""}
                />
            ) : (
                <p>No encontrado</p>
            )}
        </div>
    );
};

export default LegalTextView;