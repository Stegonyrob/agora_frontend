import React from 'react';
import { Form } from 'react-bootstrap';
import ImagePreviewGrid, { ImagePreview as IImagePreview } from '../../../../images/ImagePreviewGrid';
import ImageUploadButton from '../../../../images/ImageUploadButton';
import styles from '../ModalForm.module.scss';

interface EventImageManagerProps {
    imagePreviews: IImagePreview[];
    onImagesSelected: (files: File[]) => void;
    onRemoveImage: (identifier: number | string) => void;
}

const EventImageManager: React.FC<EventImageManagerProps> = ({
    imagePreviews,
    onImagesSelected,
    onRemoveImage
}) => {
    return (
        <div className={styles.imageSection}>
            <Form.Label className={styles.imageSectionTitle}>
                <strong>🖼️ Imágenes del Evento</strong>
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
                    💡 Puedes subir múltiples imágenes. Se mostrarán miniaturas de 80x80px
                </Form.Text>
            </div>

        </div>
    );
};

export default EventImageManager;
