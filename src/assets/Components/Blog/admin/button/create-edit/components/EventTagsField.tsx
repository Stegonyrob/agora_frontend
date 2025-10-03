import { IEventTag } from '@/core/events/IEvent';
import React from 'react';
import { Form } from 'react-bootstrap';
import TagSelector from '../../../tags/TagSelector';
import styles from '../ModalForm.module.scss';

interface EventTagsFieldProps {
    tags: IEventTag[];
    setTags: (tags: IEventTag[]) => void;
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
            <Form.Text className={styles.helpText}>
                💡 Las etiquetas ayudan a categorizar y encontrar tu evento más fácilmente
            </Form.Text>
        </Form.Group>
    );
};

export default EventTagsField;
