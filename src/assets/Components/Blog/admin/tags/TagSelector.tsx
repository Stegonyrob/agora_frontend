import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from './TagSelector.module.scss';

interface TagSelectorProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
    selectedTags = [],
    onTagsChange,
    placeholder = "Agregar tags..."
}) => {
    const [inputTag, setInputTag] = useState('');

    // Tags predefinidos comunes para posts y eventos
    const predefinedTags = [
        'Educación',
        'Neurodiversidad',
        'Taller',
        'Conferencia',
        'Recursos',
        'Apoyo',
        'Aprendizaje',
        'TEA',
        'TDAH',
        'Dislexia',
        'Inclusión',
        'Psicología',
        'Pedagogía',
        'Tecnología',
        'Noticias',
        'Eventos',
        'Actividades'
    ];

    const handleAddTag = () => {
        const trimmedTag = inputTag.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            const newTags = [...selectedTags, trimmedTag];
            onTagsChange(newTags);
            setInputTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = selectedTags.filter(tag => tag !== tagToRemove);
        onTagsChange(newTags);
    };

    const handlePredefinedTagClick = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            const newTags = [...selectedTags, tag];
            onTagsChange(newTags);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className={styles.tagSelector}>
            <label className={styles.label}>
                <i className="bi bi-tags-fill me-2"></i>
                Tags
            </label>

            {/* Input para agregar tags personalizados */}
            <div className={styles.inputContainer}>
                <Form.Control
                    type="text"
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className={styles.tagInput}
                />
                <Button
                    variant="outline-primary"
                    onClick={handleAddTag}
                    disabled={!inputTag.trim()}
                    className={styles.addButton}
                >
                    <i className="bi bi-plus-lg"></i>
                </Button>
            </div>

            {/* Tags predefinidos */}
            <div className={styles.predefinedSection}>
                <small className={styles.predefinedLabel}>Tags sugeridos:</small>
                <div className={styles.predefinedTags}>
                    {predefinedTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handlePredefinedTagClick(tag)}
                            disabled={selectedTags.includes(tag)}
                            className={`${styles.predefinedTag} ${selectedTags.includes(tag) ? styles.disabled : ''
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags seleccionados */}
            {selectedTags.length > 0 && (
                <div className={styles.selectedSection}>
                    <small className={styles.selectedLabel}>
                        Tags seleccionados ({selectedTags.length}):
                    </small>
                    <div className={styles.selectedTags}>
                        {selectedTags.map((tag) => (
                            <span key={tag} className={styles.selectedTag}>
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className={styles.removeButton}
                                    title={`Eliminar tag: ${tag}`}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagSelector;
