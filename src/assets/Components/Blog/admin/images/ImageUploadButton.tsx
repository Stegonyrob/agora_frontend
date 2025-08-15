import React, { useCallback, useRef, useState } from "react";
import styles from "./ImageUploadButton.module.scss";

// Se eliminan las props relacionadas con la subida. El componente solo notifica la selección de archivos.
interface ImageUploadButtonProps {
    onImagesSelected: (files: File[]) => void;
    multiple?: boolean;
    className?: string;
    disabled?: boolean;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
    onImagesSelected,
    multiple = true,
    className = "",
    disabled = false
}) => {
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log('❌ ImageUploadButton - No files selected');
            return;
        }

        const filesArray = Array.from(files);
        setUploadError(null);

        const validation = validateFiles(filesArray);
        if (!validation.isValid) {
            console.error('❌ ImageUploadButton - Validación fallida:', validation.error);
            setUploadError(validation.error!);
            return;
        }

        // Aquí solo se llama al callback para pasar los archivos.
        // La subida real se manejará fuera de este componente.
        if (onImagesSelected) {
            console.log('📤 ImageUploadButton - Llamando onImagesSelected...');
            onImagesSelected(filesArray);
        }

        // Se limpia el valor del input para poder subir el mismo archivo de nuevo.
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [onImagesSelected]);

    const handleClick = useCallback(() => {
        if (disabled) return;
        fileInputRef.current?.click();
    }, [disabled]);

    return (
        <div className={`${styles.imageUploadButton} ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                multiple={multiple}
                style={{ display: 'none' }}
                disabled={disabled}
            />
            <button
                type="button"
                className={`${styles.uploadButton} ${uploadError ? styles['uploadButton--error'] : ''}`}
                onClick={handleClick}
                disabled={disabled}
                aria-label={multiple ? "Seleccionar imágenes" : "Seleccionar imagen"}
            >
                <div className={styles.buttonContent}>
                    <>
                        <i className={styles.icon}>📷</i>
                        <span className={styles.text}>
                            {multiple ? "Seleccionar Imágenes" : "Seleccionar Imagen"}
                        </span>
                        <small className={styles.subtext}>
                            JPG, PNG, GIF hasta 5MB
                        </small>
                    </>
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