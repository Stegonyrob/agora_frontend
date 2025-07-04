import React from 'react';
import TagSelector from '../../../tags/TagSelector';
import styles from '../EditModalForm.module.scss';

interface EditEventTagsFieldProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

const EditEventTagsField: React.FC<EditEventTagsFieldProps> = ({
    tags,
    setTags
}) => {
    console.log('🏷️ EditEventTagsField renderizado con tags:', tags);

    return (
        <div className={styles.formGroup}>
            <label className="form-label">
                🏷️ Tags
            </label>
            <TagSelector
                selectedTags={tags}
                onTagsChange={setTags}
                placeholder="🏷️ Agregar etiquetas para el evento..."
            />
            <small className="text-muted">
                💡 Las etiquetas ayudan a categorizar y encontrar tu evento más fácilmente
            </small>
        </div>
    );
};

export default EditEventTagsField;
