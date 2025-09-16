import { useTextsWithImages } from "@/hooks/useTextsWithImages";
import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./CardText.module.scss";

interface CardTextProps {
  category?: string;
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.src = "/images/agoraLogo.png";
}

const CardText: React.FC<CardTextProps> = React.memo(({ category }) => {
  const { texts, loading, error } = useTextsWithImages(category);

  // Memoizar datos del usuario para evitar re-renders innecesarios
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

  // === DOCUMENTACIÓN DEL RENDERIZADO FINAL ===
  console.log(`🎨 === CARDTEXT RENDERIZANDO CATEGORÍA "${category}" ===`);
  console.log(`📊 Total textos a renderizar: ${texts.length}`);
  console.log(`📋 Lista de textos recibidos:`, texts);

  return (
    <>
      {texts.map(({ text, images }, index: number) => {
        console.log(`🎨 === RENDERIZANDO TEXTO ${index + 1} ===`);
        console.log(`   📌 ID: ${text.id}`);
        console.log(`   📌 Título: "${text.title}"`);
        console.log(`   📌 Categoría: "${text.category}"`);
        console.log(`   � Array de imágenes recibido:`, images);
        console.log(`   📌 Cantidad de imágenes: ${images.length}`);
        console.log(`   📌 Legacy name_image: ${text.name_image || 'undefined/null'}`);

        // Construir URL de imagen correctamente (fuera de useMemo para cada iteración)
        // Fallback específico por categoría mientras se resuelve el problema de BD
        const getCategoryFallbackImage = (category: string): string => {
          const fallbacks: { [key: string]: string } = {
            'nosotros': '/images/agoraLogoTras.png',
            'servicios': '/images/agoraLogo.png',
            'equipo': '/images/avatarGeneric.png',
            'neurodiversidad': '/images/agoraLogo.png',
            'cea': '/images/agoraLogo.png',
            'atencion': '/images/agoraLogo.png',
            'aprendizaje': '/images/agoraLogo.png',
            'desarrollo': '/images/agoraLogo.png',
            'comunicacion': '/images/agoraLogo.png'
          };
          return fallbacks[category] || '/images/agoraLogo.png';
        };

        let primaryImage = getCategoryFallbackImage(text.category);

        if (images.length > 0) {
          const img = images[0];
          console.log(`📸 === PROCESANDO PRIMERA IMAGEN PARA "${text.title}" ===`);
          console.log(`   📌 Imagen seleccionada:`, img);
          console.log(`   📌 img.id: ${img.id}`);
          console.log(`   📌 img.imageName: "${img.imageName}"`);
          console.log(`   📌 img.textId: ${img.textId}`);
          console.log(`   📌 img.isMock: ${img.isMock || 'undefined'}`);
          console.log(`   📌 img.imageData existe: ${!!img.imageData}`);
          console.log(`   📌 img.imageData length: ${img.imageData?.length || 0}`);

          // ⚠️ DIAGNÓSTICO DE TAMAÑO DE IMAGEN
          const imageDataLength = img.imageData?.length || 0;
          if (imageDataLength > 0 && imageDataLength < 5000) {
            console.warn(`⚠️ === IMAGEN SOSPECHOSAMENTE PEQUEÑA PARA "${text.title}" ===`);
            console.warn(`   📏 Tamaño: ${imageDataLength} caracteres (muy pequeño)`);
            console.warn(`   📋 Una imagen típica debería tener 10,000+ caracteres`);
            console.warn(`   🔧 Usando endpoint URL como alternativa más segura`);
          }

          // Decidir método de carga de imagen con lógica mejorada
          if (img.imageData && imageDataLength >= 5000) {
            // Solo usar imageData si es lo suficientemente grande
            primaryImage = img.imageData.startsWith('data:')
              ? img.imageData
              : `data:image/jpeg;base64,${img.imageData}`;
            console.log(`✅ === USANDO IMAGEDATA PARA "${text.title}" ===`);
            console.log(`   📌 URL construida: ${primaryImage.substring(0, 100)}...`);
          } else if (img.imageData && imageDataLength > 0) {
            // Para imágenes pequeñas, intentar ambos métodos
            console.warn(`⚠️ === IMAGEDATA PEQUEÑA - PROBANDO AMBOS MÉTODOS PARA "${text.title}" ===`);

            // Método 1: Intentar con imageData de todas formas
            const dataUrl = img.imageData.startsWith('data:')
              ? img.imageData
              : `data:image/jpeg;base64,${img.imageData}`;

            // Método 2: URL del endpoint
            const endpointUrl = `${import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES || '/api/v1/text-images'}/${img.id}/data`;

            // Usar endpoint URL para imágenes muy pequeñas (más confiable)
            primaryImage = endpointUrl;
            console.log(`🔗 === USANDO ENDPOINT URL PARA "${text.title}" (IMAGEN PEQUEÑA) ===`);
            console.log(`   📌 Endpoint URL: ${endpointUrl}`);
            console.log(`   📌 DataURL como backup: ${dataUrl.substring(0, 50)}...`);
          } else {
            // Preferir endpoint URL para imágenes faltantes
            primaryImage = `${import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES || '/api/v1/text-images'}/${img.id}/data`;
            console.log(`🔗 === USANDO ENDPOINT URL PARA "${text.title}" ===`);
            console.log(`   📌 URL construida: ${primaryImage}`);
            console.log(`   📌 Razón: ${imageDataLength === 0 ? 'No imageData' : 'ImageData muy pequeña'}`);
          }
        } else if (text.name_image) {
          primaryImage = text.name_image;
          console.log(`🏷️ === USANDO LEGACY NAME_IMAGE PARA "${text.title}" ===`);
          console.log(`   📌 URL: ${primaryImage}`);
        } else {
          console.log(`❌ === SIN IMAGEN PARA "${text.title}" - USANDO FALLBACK POR CATEGORÍA ===`);
          console.log(`   📌 Categoría: ${text.category}`);
          console.log(`   📌 Fallback específico: ${primaryImage}`);
        }

        console.log(`🎯 === URL FINAL PARA "${text.title}": ${primaryImage} ===`);

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
                  // onClick={...} // Integrar edición con TextService si lo deseas
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