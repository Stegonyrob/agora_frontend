import React from 'react';
import { Form } from 'react-bootstrap';
import TagSelector from '../../../tags/TagSelector';
import styles from '../ModalForm.module.scss';

import { IEventTag } from '@/core/events/IEvent';

interface PostTagsFieldProps {
    tags: IEventTag[];
    setTags: (tags: IEventTag[]) => void;
}

const PostTagsField: React.FC<PostTagsFieldProps> = ({
    tags,
    setTags
}) => {
    return (
        <Form.Group className={styles.formGroup} controlId="formPostTags">
            <TagSelector
                selectedTags={tags}
                onTagsChange={setTags}
                placeholder="🏷️ Agregar etiquetas para el post..."
            />
            <Form.Text className={styles.helpText}>
                💡 Las etiquetas ayudan a categorizar y encontrar tu post más fácilmente
            </Form.Text>
        </Form.Group>
    );
};

export default PostTagsField;
