import React, { useRef, useState } from "react";
import EventImageService, { EventImageResponse } from "../../../../../core/events/EventImageService";
import styles from "./ImageUploadButton.module.scss";

interface ImageUploadButtonProps {
    eventId?: number;
    onImagesUploaded?: (images: EventImageResponse[]) => void;
    onImagesSelected?: (images: File[]) => void;
    multiple?: boolean;
    className?: string;
    disabled?: boolean;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
    eventId,
    onImagesUploaded,
    onImagesSelected,
    multiple = true,
    className = "",
    disabled = false
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const eventImageService = new EventImageService();

    const validateFiles = (files: File[]): { isValid: boolean; error?: string } => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                return {
                    isValid: false,
                    error: `Tipo de archivo no válido: ${file.name}. Solo se permiten JPG, PNG y GIF.`
                };
            }
            if (file.size > maxSize) {
                return {
                    isValid: false,
                    error: `Archivo demasiado grande: ${file.name}. El tamaño máximo es 5MB.`
                };
            }
        }

        return { isValid: true };
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log('❌ ImageUploadButton - No files selected');
            return;
        }

        const filesArray = Array.from(files);
        console.log('📤 ImageUploadButton - handleFileChange iniciado:', {
            cantidadArchivos: filesArray.length,
            eventId,
            archivos: filesArray.map(f => ({ name: f.name, size: f.size, type: f.type }))
        });

        // Limpiar errores previos
        setUploadError(null);

        // Validar archivos
        const validation = validateFiles(filesArray);
        if (!validation.isValid) {
            console.error('❌ ImageUploadButton - Validación fallida:', validation.error);
            setUploadError(validation.error!);
            return;
        }

        // Si hay onImagesSelected, llamarlo (para compatibilidad)
        if (onImagesSelected) {
            console.log('📤 ImageUploadButton - Llamando onImagesSelected...');
            onImagesSelected(filesArray);
        }

        // Si hay eventId y onImagesUploaded, subir directamente
        if (eventId && onImagesUploaded) {
            try {
                setIsUploading(true);
                console.log('📤 ImageUploadButton - Subiendo imágenes al evento:', eventId);

                const uploadedImages = await eventImageService.uploadEventImages(eventId, filesArray);
                console.log('✅ ImageUploadButton - Imágenes subidas exitosamente:', uploadedImages);

                onImagesUploaded(uploadedImages);
            } catch (error) {
                console.error('❌ ImageUploadButton - Error uploading images:', error);
                setUploadError(error instanceof Error ? error.message : 'Error uploading images');
            } finally {
                setIsUploading(false);
            }
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        if (disabled || isUploading) return;
        fileInputRef.current?.click();
    };

    const isDisabled = disabled || isUploading;
    const shouldShowUploadingState = isUploading && eventId;

    return (
        <div className={`${styles.imageUploadButton} ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                multiple={multiple}
                style={{ display: 'none' }}
                disabled={isDisabled}
            />
            <button
                type="button"
                className={`${styles.uploadButton} ${uploadError ? styles['uploadButton--error'] : ''}`}
                onClick={handleClick}
                disabled={isDisabled}
                aria-label={multiple ? "Subir imágenes" : "Subir imagen"}
            >
                <div className={styles.buttonContent}>
                    {shouldShowUploadingState ? (
                        <>
                            <div className={styles.loadingSpinner} />
                            <span className={styles.text}>Subiendo...</span>
                        </>
                    ) : (
                        <>
                            <i className={styles.icon}>📷</i>
                            <span className={styles.text}>
                                {eventId
                                    ? (multiple ? "Subir Imágenes" : "Subir Imagen")
                                    : (multiple ? "Seleccionar Imágenes" : "Seleccionar Imagen")
                                }
                            </span>
                            <small className={styles.subtext}>
                                JPG, PNG, GIF hasta 5MB
                            </small>
                        </>
                    )}
                </div>
            </button>

            {uploadError && (
                <div className={styles.errorMessage}>
                    {uploadError}
                </div>
            )}
        </div>
    );
};

export default ImageUploadButton;
