import { ITextItem } from "@/core/texts/ITextItem";
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./CardText.module.scss";

interface CardTextProps {
  texts: ITextItem[];
  category?: string;
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.src = "../../img/agoraLogo.png";
}

const CardText: React.FC<CardTextProps> = ({ texts, category }) => {
  // Obtención de roles y modo usuario
  const userRole = sessionStorage.getItem("role");
  const viewAsUser = sessionStorage.getItem("viewAsUser") === "true";
  const isAdmin = userRole === "ROLE_ADMIN";

  if (!texts || texts.length === 0) {
    return <div className={styles.noDataMessage}>No hay datos disponibles.</div>;
  }

  return (
    <>
      {texts.map((cardText: ITextItem | null, index: number) => {
        if (!cardText) {
          return <div key={index} className={styles.noDataMessage}>No hay datos disponibles.</div>;
        }

        return (
          <div key={cardText.id} className={styles.cardContainer}>
            <div className={styles.cardText}>
              <Card.Img
                className={styles.cardImage}
                src={cardText.image || ""}
                alt={cardText.description || "Default description"}
                onError={handleImgLoadingError}
                style={{ float: index % 2 === 0 ? "left" : "right" }}
              />
              <Card.Body>
                <Card.Title className={styles.cardTitle}>
                  {cardText.title}
                </Card.Title>
                <Card.Text className={styles.cardDescription}>
                  {typeof cardText.description === "string"
                    ? cardText.description.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))
                    : cardText.description}
                </Card.Text>
                {isAdmin && !viewAsUser && (
                  <Button
                    variant="primary"
                  // onClick={...} // Integrar edición con redux si lo deseas
                  >
                    Editar
                  </Button>
                )}
              </Card.Body>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardText;