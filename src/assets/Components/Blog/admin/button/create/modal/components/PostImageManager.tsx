import React from 'react';
import { Form } from 'react-bootstrap';
import ImagePreviewGrid, { ImagePreview as IImagePreview } from '../../../../images/ImagePreviewGrid';
import ImageUploadButton from '../../../../images/ImageUploadButton';
import ButtonAddImage from '../../../image/ButtonAddImage';
import styles from '../PostForm.module.scss';

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
            <div className={styles.newImagesUploadSection}>
                <ImageUploadButton
                    onImagesSelected={onImagesSelected}
                    multiple={true}
                />
                <ButtonAddImage onImageSelected={onImageSelected} />
                <Form.Text className={styles.helpText}>
                    💡 Puedes subir múltiples imágenes para tu post
                </Form.Text>
            </div>
            <ImagePreviewGrid
                imagePreviews={imagePreviews}
                onRemoveImage={onRemoveImage}
                showExistingBadge={true}
            />
        </div>
    );
};

export default PostImageManager;
