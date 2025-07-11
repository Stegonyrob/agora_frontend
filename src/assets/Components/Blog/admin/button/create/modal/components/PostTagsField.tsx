import React from 'react';
import { Form } from 'react-bootstrap';
import TagSelector from '../../../../tags/TagSelector';
import styles from '../EventForm.module.scss'; // Usar los mismos estilos que eventos

import { IPostTagDTO } from '@/core/posts/IPostDTO';

interface PostTagsFieldProps {
    tags: IPostTagDTO[];
    setTags: (tags: IPostTagDTO[]) => void;
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
                objectMode={true}
            />
            <Form.Text className="text-muted">
                💡 Las etiquetas ayudan a categorizar y encontrar tu post más fácilmente
            </Form.Text>
        </Form.Group>
    );
};

export default PostTagsField;
