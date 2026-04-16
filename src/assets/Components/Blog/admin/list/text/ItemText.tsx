import type { IText } from '@/core/texts/IText';
import { ITextImage } from '@/core/texts/images/ITextImage';
import TextImageService from '@/core/texts/images/TextImageService';
import React, { useEffect, useMemo, useState } from 'react';
import ItemGeneric from '../generic/ItemGeneric';

interface ItemTextProps {
    id: number;
    title: string;
    text: IText;
    onEdit: (text: IText) => void;
    onDelete: (textId: number) => Promise<void>;
    onSelect: (text: IText) => void;
    onSubmit: (text: IText) => void;
    onArchive?: (textId: number) => Promise<boolean>;
    onUnArchive?: (textId: number) => Promise<boolean>;

    userId: number;
    onCreate: (newText: IText) => Promise<void>;
}

const ItemText: React.FC<ItemTextProps> = ({
    text,
    onEdit,
    onDelete,
    onArchive,
    onUnArchive,
    onCreate,
    onSelect,
    onSubmit,
    userId,
}) => {
    const [textImages, setTextImages] = useState<ITextImage[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    // Memoizar el servicio
    const textImageService = useMemo(() => new TextImageService(), []);

    if (!text) return null;

    // Si el objeto viene anidado bajo 'item', usar ese objeto
    const data = (text && (text as any).item) ? (text as any).item : text;

    // Cargar imágenes del texto
    useEffect(() => {
        const loadTextImages = async () => {
            if (!data.id) return;

            try {
                setLoadingImages(true);
                const images = await textImageService.getImagesByTextId(data.id);
                setTextImages(images);
            } catch (error) {

                setTextImages([]);
            } finally {
                setLoadingImages(false);
            }
        };

        loadTextImages();
    }, [data.id, textImageService, refreshKey]);

    // Escuchar eventos de actualización de textos
    useEffect(() => {
        const handleTextUpdate = (event: CustomEvent) => {
            const { textId, action } = event.detail;

            if (textId === data.id) {
                handleRefreshImages();
            }
        };

        // Agregar listener para eventos de actualización
        window.addEventListener('textUpdated', handleTextUpdate as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('textUpdated', handleTextUpdate as EventListener);
        };
    }, [data.id]);

    // Convertir imágenes de texto a formato string para ItemGeneric
    const processedImages = useMemo(() => {
        return textImages.map(img => {
            // Si hay URL disponible, usarla directamente
            if (img.url) {
                return img.url;
            }
            // Si no hay URL pero hay imagePath, usar el servicio para construir la URL
            if (img.imagePath) {
                return textImageService.buildImageUrl(img.imagePath);
            }
            // Fallback al endpoint de la API
            return `${import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES || '/api/v1/text-images'}/${img.id}/data`;
        });
    }, [textImages, textImageService]);

    // Función para forzar recarga de imágenes
    const handleRefreshImages = React.useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, [data.id]);

    // Handler mejorado para onCreate que incluye recarga
    const handleOnCreate = async (newText: IText) => {
        try {
            await onCreate(newText);
            // Después de cualquier operación de creación/edición, refrescar imágenes
            setTimeout(() => {
                handleRefreshImages();
            }, 500); // Pequeño delay para permitir que el backend procese
        } catch (error) {
            // Handle error appropriately"
            throw error; // Re-lanzar para que el componente padre maneje el error
        }
    };

    return (
        <ItemGeneric
            item={data}
            id={data.id}
            title={data.title}
            message={data.message}
            type="text"
            images={processedImages}
            textImages={textImages}
            loadingImages={loadingImages}
            onSelect={onSelect}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onArchive={onArchive}
            onUnArchive={onUnArchive}
            userId={userId}
            onCreate={handleOnCreate}
        />
    );
};



export default ItemText;
