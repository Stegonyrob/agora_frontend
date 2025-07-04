import React from 'react';
import { Form } from 'react-bootstrap';
import TagSelector from '../../../../tags/TagSelector';
import styles from '../EventForm.module.scss';

interface EventTagsFieldProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

const EventTagsField: React.FC<EventTagsFieldProps> = ({
    tags,
    setTags
}) => {
    return (
        <Form.Group className={styles.formGroup} controlId="formEventTags">
            <TagSelector
                selectedTags={tags}
                onTagsChange={setTags}
                placeholder="🏷️ Agregar etiquetas para el evento..."
            />
            <Form.Text className="text-muted">
                💡 Las etiquetas ayudan a categorizar y encontrar tu evento más fácilmente
            </Form.Text>
        </Form.Group>
    );
};

export default EventTagsField;
