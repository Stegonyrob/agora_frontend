import { IText } from "@/core/texts/IText";
import TextService from "@/core/texts/TextService";
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import styles from "./scss/FaqView.module.scss";

const FaqView: React.FC = () => {
    const [faqs, setFaqs] = useState<IText[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const service = new TextService();
        service
            .getTextsByCategory("faq")
            .then((data) => {
                setFaqs(data.filter((item) => !item.archived));
            })
            .catch((err) => {
                console.error("[FaqView] Error fetching FAQ texts:", err);
                setError("No se pudieron cargar las preguntas frecuentes.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.faqContent}>
            <h1>Preguntas Frecuentes</h1>

            {loading && <p className={styles.statusMessage}>Cargando preguntas frecuentes...</p>}

            {error && <p className={styles.statusMessage}>{error}</p>}

            {!loading && !error && faqs.length === 0 && (
                <p className={styles.statusMessage}>No hay preguntas frecuentes disponibles.</p>
            )}

            {!loading && !error && faqs.length > 0 && (
                <Accordion flush className={styles.accordion}>
                    {faqs.map((faq, index) => (
                        <Accordion.Item eventKey={String(index)} key={faq.id}>
                            <Accordion.Header>{faq.title}</Accordion.Header>
                            <Accordion.Body>
                                {faq.message.split("\n").map((line, i) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <span key={`${faq.id}-${i}`}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </div>
    );
};

export default FaqView;
