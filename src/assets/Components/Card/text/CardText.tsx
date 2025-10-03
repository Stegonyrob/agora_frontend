
import TextImageService from "@/core/texts/images/TextImageService";
import { useTextsWithImages } from "@/hooks/useTextsWithImages";
import React, { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./CardText.module.scss";

interface CardTextProps {
  category?: string;
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const failedSrc = e.currentTarget.src;
  e.currentTarget.src = "/images/agoraLogo.png";
  e.currentTarget.dataset.editable = "false";
}

const CardText: React.FC<CardTextProps> = React.memo(({ category }) => {
  const { texts, loading, error } = useTextsWithImages(category);
  const textImageService = new TextImageService();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState<any | null>(null);

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

  // Función para detectar si debe mostrar mapa en lugar de imagen
  function shouldShowMap(text: any): boolean {
    const category = text.category?.toLowerCase() || '';
    const title = text.title?.toLowerCase() || '';

    // Detectar categorías o títulos relacionados con ubicación
    const locationKeywords = ['ubicacion', 'donde', 'estamos', 'direccion', 'location', 'address', 'mapa', 'maps'];

    return locationKeywords.some(keyword =>
      category.includes(keyword) || title.includes(keyword)
    );
  }

  // Componente del mapa de Google Maps
  function GoogleMapEmbed({ text }: { text: any }) {
    return (
      <div className={styles.mapContainer}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d180.7620199594445!2d-5.698995039773088!3d43.540032821640956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd367da5f2d4ba1d%3A0x2eadf97478c9b2b8!2sC.%20Nicaragua%2C%2016%2C%20Gijon-Oeste%2C%2033213%20Gij%C3%B3n%2C%20Asturias!5e0!3m2!1ses-419!2ses!4v1759485754376!5m2!1ses-419!2ses"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${text.title || 'ubicación'}`}
        />
      </div>
    );
  }

  return (
    <>
      {texts.map(({ text, images }, index: number) => {


        let primaryImage = getCategoryFallbackImage(text.category); // Default fallback

        if (images.length > 0) {
          const firstImage = images[0];


          // Usar la URL si está disponible, sino construir usando el servicio
          if (firstImage.url) {
            primaryImage = firstImage.url;
          } else if (firstImage.imagePath) {
            // Usar el servicio para construir la URL correctamente
            primaryImage = textImageService.buildImageUrl(firstImage.imagePath);
          }
        }

        return (
          <div key={`text-${text.id}`} className={styles.cardContainer}>
            <div className={shouldShowMap(text) ? styles.cardWithMap : styles.cardText}>
              {shouldShowMap(text) ? (
                <>
                  <div className={styles.textContent}>
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
                        <>
                          <Button
                            variant="outline-secondary"
                            onClick={() => {
                              window.location.href = '/admin/texts';
                            }}
                          >
                            Ir a edición
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </div>
                  <div className={styles.mapContent}>
                    <GoogleMapEmbed text={text} />
                  </div>
                </>
              ) : (
                <>
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
                      <>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            window.location.href = '/admin/texts';
                          }}
                        >
                          Ir a edición
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </>
              )}
            </div>
          </div>
        );
      })}

    </>
  );
});

CardText.displayName = 'CardText';

export default CardText;