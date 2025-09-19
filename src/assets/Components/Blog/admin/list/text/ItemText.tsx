import type { ITextItem } from '@/core/texts/ITextItem';
import { ITextImage } from '@/core/texts/images/ITextImage';
import TextImageService from '@/core/texts/images/TextImageService';
import React, { useEffect, useMemo, useState } from 'react';
import ItemGeneric from '../generic/ItemGeneric';

interface ItemTextProps {
    id: number;
    title: string;
    text: ITextItem;
    onEdit: (text: ITextItem) => void;
    onDelete: (textId: number) => Promise<void>;
    onSelect: (text: ITextItem) => void;
    onSubmit: (text: ITextItem) => void;
    userId: number;
    onCreate: (newText: ITextItem) => Promise<void>;
}

const ItemText: React.FC<ItemTextProps> = ({
    text,
    onEdit,
    onDelete,
    onCreate,
    onSelect,
    onSubmit,
    userId,
}) => {
    const [textImages, setTextImages] = useState<ITextImage[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

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
                console.warn(`⚠️ Could not load images for text ${data.id}:`, error);
                setTextImages([]);
            } finally {
                setLoadingImages(false);
            }
        };

        loadTextImages();
    }, [data.id, textImageService]);

    // Convertir imágenes de texto a formato string para ItemGeneric
    const processedImages = useMemo(() => {
        return textImages.map(img => {
            // Si hay URL disponible, usarla directamente
            if (img.url) {
                return img.url;
            }
            // Si no hay URL pero hay imagePath, construir la URL
            if (img.imagePath) {
                return img.imagePath.startsWith('http')
                    ? img.imagePath
                    : `http://localhost:8080${img.imagePath}`;
            }
            // Fallback al endpoint de la API
            return `${import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES || '/api/v1/text-images'}/${img.id}/data`;
        });
    }, [textImages]);

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
            userId={userId}
            onCreate={onCreate}
        />
    );
};



export default ItemText;
