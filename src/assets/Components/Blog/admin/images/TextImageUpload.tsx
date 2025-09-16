import React, { useCallback, useState } from 'react';
import styles from './TextImageUpload.module.scss';

interface TextImageUploadProps {
    textId: number;
    onUploadComplete?: (uploadedImages: any[]) => void;
    multiple?: boolean;
    className?: string;
    disabled?: boolean;
}

/**
 * Componente específico para subir imágenes a textos
 * Implementa exactamente la documentación del backend proporcionada
 */
const TextImageUpload: React.FC<TextImageUploadProps> = ({
    textId,
    onUploadComplete,
    multiple = true,
    className = '',
    disabled = false
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const getToken = useCallback(() => {
        return sessionStorage.getItem('token') || localStorage.getItem('token');
    }, []);

    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) {
            console.log('❌ TextImageUpload - No files selected');
            return;
        }

        console.log(`📤 TextImageUpload - Iniciando upload para textId: ${textId}`);
        console.log(`📋 TextImageUpload - Archivos seleccionados:`, Array.from(files).map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
        })));

        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();

        // Implementación exacta según documentación del backend
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });
        formData.append('textId', textId.toString());

        try {
            const response = await fetch('/api/v1/text-images/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                    // No incluir Content-Type para FormData, el browser lo hace automáticamente
                },
                body: formData
            });

            console.log(`📡 TextImageUpload - Response status: ${response.status}`);

            if (response.ok) {
                const uploadedImages = await response.json();
                console.log(`✅ TextImageUpload - Upload exitoso:`, uploadedImages);

                if (onUploadComplete) {
                    onUploadComplete(uploadedImages);
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }
        } catch (error: any) {
            console.error('❌ TextImageUpload - Error uploading images:', error);
            setUploadError(error.message || 'Error al subir las imágenes');
        } finally {
            setIsUploading(false);
        }
    }, [textId, onUploadComplete, getToken]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e.target.files);
    }, [handleFileUpload]);

    return (
        <div className={`${styles.textImageUpload} ${className}`}>
            <input
                type="file"
                multiple={multiple}
                accept="image/*"
                onChange={handleInputChange}
                disabled={disabled || isUploading}
                className={styles.fileInput}
            />

            {isUploading && (
                <div className={styles.uploadingMessage}>
                    📤 Subiendo imágenes...
                </div>
            )}

            {uploadError && (
                <div className={styles.errorMessage}>
                    ❌ {uploadError}
                </div>
            )}
        </div>
    );
};

export default TextImageUpload;
