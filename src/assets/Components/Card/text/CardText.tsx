import TextImageService from "@/core/texts/images/TextImageService";
import { useTextsWithImages } from "@/hooks/useTextsWithImages";
import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./CardText.module.scss";

interface CardTextProps {
  category?: string;
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const failedSrc = e.currentTarget.src;
  console.error('🔍 [CardText] Image loading failed:', failedSrc);
  e.currentTarget.src = "/images/agoraLogo.png";
}

const CardText: React.FC<CardTextProps> = React.memo(({ category }) => {
  const { texts, loading, error } = useTextsWithImages(category);
  const textImageService = new TextImageService();

  const userConfig = useMemo(() => {
    const userRole = sessionStorage.getItem("role");
    const viewAsUser = sessionStorage.getItem("viewAsUser") === "true";
    const isAdmin = userRole === "ROLE_ADMIN";
    return { userRole, viewAsUser, isAdmin };
  }, []);

  if (loading) {
    return <div className={styles.noDataMessage}>Cargando textos...</div>;
  }

  if (error) {
    return <div className={styles.noDataMessage}>Error: {error}</div>;
  }

  if (!texts || texts.length === 0) {
    return <div className={styles.noDataMessage}>No hay datos disponibles.</div>;
  }

  function getCategoryFallbackImage(category: string): string {
    const fallbacks: { [key: string]: string } = {
      'nosotros': '/images/agoraLogoTras.png',
      'servicios': '/images/agoraLogo.png',
      'equipo': '/images/avatarGeneric.png',
      'neurodiversidad': '/images/agoraLogo.png',
      'cea': '/images/agoraLogo.png',
      'atencion': '/images/agoraLogo.png',
      'aprendizaje': '/images/agoraLogo.png',
      'comunicacion': '/images/agoraLogo.png',
      'desarrollo': '/images/agoraLogo.png'
    };
    return fallbacks[category] || '/images/agoraLogo.png';
  }

  return (
    <>
      {texts.map(({ text, images }, index: number) => {
        // Debug: Ver qué contienen las imágenes
        console.log(`🔍 [CardText] Text ${text.id} images:`, images);

        let primaryImage = getCategoryFallbackImage(text.category); // Default fallback

        if (images.length > 0) {
          const firstImage = images[0];
          console.log(`🔍 [CardText] First image data:`, firstImage);

          // Usar la URL si está disponible, sino construir usando el servicio
          if (firstImage.url) {
            primaryImage = firstImage.url;
          } else if (firstImage.imagePath) {
            // Usar el servicio para construir la URL correctamente
            primaryImage = textImageService.buildImageUrl(firstImage.imagePath);
          }
        }

        console.log(`🔍 [CardText] Final image URL for text ${text.id}:`, primaryImage);

        return (
          <div key={`text-${text.id}`} className={styles.cardContainer}>
            <div className={styles.cardText}>
              <Card.Img
                className={styles.cardImage}
                src={primaryImage}
                alt={text.message || "Default description"}
                onError={handleImgLoadingError}
                style={{ float: index % 2 === 0 ? "left" : "right" }}
              />
              <Card.Body>
                <Card.Title className={styles.cardTitle}>
                  {text.title}
                </Card.Title>
                <Card.Text className={styles.cardDescription}>
                  {typeof text.message === "string"
                    ? text.message.split('\n').map((line: string, i: number) => (
                      <span key={i}>{line}<br /></span>
                    ))
                    : text.message}
                </Card.Text>
                {userConfig.isAdmin && !userConfig.viewAsUser && (
                  <Button
                    variant="primary"
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
});

CardText.displayName = 'CardText';

export default CardText;