import { IEventTag } from '@/core/events/IEvent';
import React from 'react';
import { Form } from 'react-bootstrap';
import TagSelector from '../../../tags/TagSelector';
import styles from '../EditModalForm.module.scss';

interface EditPostTagsFieldProps {
    tags: IEventTag[];
    setTags: (tags: IEventTag[]) => void;
}

const EditPostTagsField: React.FC<EditPostTagsFieldProps> = ({
    tags,
    setTags
}) => {
    return (
        <Form.Group className={styles.formGroup} controlId="formEditPostTags">
            <label className={styles.titleLabel}>
                🏷️ Etiquetas del Post:
            </label>
            <TagSelector
                selectedTags={tags}
                onTagsChange={setTags}
                placeholder="🏷️ Agregar o modificar etiquetas..."
            />
            <Form.Text className="text-muted">
                💡 Las etiquetas ayudan a categorizar y encontrar tu post más fácilmente
            </Form.Text>
        </Form.Group>
    );
};

export default EditPostTagsField;
