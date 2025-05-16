import React from "react";
import { Card } from "react-bootstrap";
import CardBodyGeneral from "./body/CardBodyGeneral";
import styles from "./CardGeneral.module.scss";
import CardGeneralProps from "./CardGeneralContainer";
import CardFooterGeneral from "./footer/CardFooterGeneral";
import CardHeaderGeneral from "./header/CardHeaderGeneral";

interface CardGeneralProps {
    className?: string;
    type: "post" | "event"
    isLoggedIn: boolean
    headerProps: {
        title: string;
        subtitle: string;
        imageUrl: string;
        customContent?: React.ReactNode;
    }
    bodyProps: {
        type: "post" | "event";
        title: string;
        message: string;
        description: string;
        image: string;
        customContent?: React.ReactNode;
    }
    footerProps: {
        userId: number;
        postId: number;
        onSelect: () => void;
        showComments: boolean;
        showFavoriteButton: boolean;
        comments: any[];
        customButtons?: React.ReactNode;
    }
}



const CardGeneral: React.FC<CardGeneralProps> = ({
    type,
    isLoggedIn = false,
    headerProps,
    bodyProps,
    footerProps,
}) => {
    // Comportamiento específico para posts privados
    if (type === "post" && !isLoggedIn) {
        return (
            <Card className={styles.cardGeneral}>
                <Card.Body className={styles.cardBody}>
                    <p>Debes iniciar sesión para ver este contenido.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className={styles.cardGeneral}>
            <CardHeaderGeneral {...headerProps} title={headerProps.title} />
            <CardBodyGeneral type={undefined} {...bodyProps} />
            <CardFooterGeneral {...footerProps} />
        </Card>
    );
};

export default CardGeneral;