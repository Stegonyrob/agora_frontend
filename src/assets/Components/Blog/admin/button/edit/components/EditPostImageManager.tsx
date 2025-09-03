import React from 'react';
import ImagePreviewGrid, { ImagePreview } from '../../../images/ImagePreviewGrid';
import ImageUploadButton from '../../../images/ImageUploadButton';
import styles from '../EditModalForm.module.scss';

interface EditPostImageManagerProps {
    imagePreviews: ImagePreview[];
    onImagesSelected: (files: File[]) => void;
    onRemoveImage: (identifier: number | string) => void;
}

const EditPostImageManager: React.FC<EditPostImageManagerProps> = ({
    imagePreviews,
    onImagesSelected,
    onRemoveImage
}) => {
    return (
        <div className={styles.imageSection}>
            <label className={styles.imageSectionTitle}>🖼️ Gestión de Imágenes</label>

            {/* Subir nuevas imágenes */}
            <div className={styles.newImagesUploadSection}>
                <h4 className={styles.subsectionTitle}>➕ Seleccionar imágenes:</h4>
                <ImageUploadButton onImagesSelected={onImagesSelected} />
                <small className={styles.helpText}>
                    💡 Las imágenes existentes se muestran con el badge "Existente". Puedes eliminar cualquier imagen antes de guardar.
                </small>
            </div>

            {/* Grid unificado de previews de imágenes */}
            <ImagePreviewGrid
                imagePreviews={imagePreviews}
                onRemoveImage={onRemoveImage}
                showExistingBadge={true}
            />
        </div>
    );
};

export default EditPostImageManager;
