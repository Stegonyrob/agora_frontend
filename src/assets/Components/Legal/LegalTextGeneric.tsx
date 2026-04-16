import React from "react";
import styles from "./legaltextgeneric.module.scss";

interface LegalTextGenericProps {
    type: string;
    mainTitle: string;
    text: string; // HTML desde backend
    updatedAt: string;
}

function removeFirstH1(html: string) {
    return html.replace(/<h1[^>]*>.*?<\/h1>/i, "");
}

const LegalTextGeneric: React.FC<LegalTextGenericProps> = ({ mainTitle, text, updatedAt }) => {
    const cleanHtml = removeFirstH1(text);

    return (
        <div className={styles["legal-content"]}>
            <h1>{mainTitle}</h1>
            <div
                className={styles["legal-html"]}
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
        </div>
    );
};

export default LegalTextGeneric;