import React from "react";
import { Card } from "react-bootstrap";
import styles from "./CardHeaderGeneral.module.scss";

interface CardHeaderGeneralProps {
    title: string;
    subtitle?: string;
    imageUrl?: string; // Imagen opcional para el encabezado
    customContent?: React.ReactNode; // Contenido personalizado
}

const CardHeaderGeneral: React.FC<CardHeaderGeneralProps> = ({
    title,
    subtitle,
    imageUrl,
    customContent,
}) => {
    return (
        <Card.Header className={styles.cardHeader}>
            {imageUrl && <img src={imageUrl} alt={title} className={styles.headerImage} />}
            <div className={styles.headerContent}>
                <h5 className={styles.title}>{title}</h5>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {customContent}
            </div>
        </Card.Header>
    );
};

export default CardHeaderGeneral;