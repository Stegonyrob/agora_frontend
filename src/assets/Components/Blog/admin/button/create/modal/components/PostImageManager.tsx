import React from 'react';
import { Form } from 'react-bootstrap';
import ImagePreviewGrid, { ImagePreview as IImagePreview } from '../../../../images/ImagePreviewGrid';
import ImageUploadButton from '../../../../images/ImageUploadButton';
import styles from '../EventForm.module.scss'; // Usar los mismos estilos que eventos

interface PostImageManagerProps {
    imagePreviews: IImagePreview[];
    onImagesSelected: (files: File[]) => void;
    onImageSelected: (imageSrc: string, imageTitle: string) => void; // Legacy para ButtonAddImage
    onRemoveImage: (index: number) => void;
}

const PostImageManager: React.FC<PostImageManagerProps> = ({
    imagePreviews,
    onImagesSelected,
    onImageSelected,
    onRemoveImage
}) => {
    return (
        <div className={styles.imageSection}>
            <Form.Label className={styles.imageSectionTitle}>
                <strong>🖼️ Imágenes del Post</strong>
            </Form.Label>
            <ImagePreviewGrid
                imagePreviews={imagePreviews}
                onRemoveImage={onRemoveImage}
                showExistingBadge={true}
            />
            <div className={styles.newImagesUploadSection}>
                <ImageUploadButton
                    onImagesSelected={onImagesSelected}
                    multiple={true}
                />

                <Form.Text className={styles.helpText}>
                    💡 Puedes subir múltiples imágenes para tu post
                </Form.Text>
            </div>

        </div>
    );
};

export default PostImageManager;
