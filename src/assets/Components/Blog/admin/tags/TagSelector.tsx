import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import TagService, { Tag } from '../../../../../core/tags/TagService';
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
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar tags disponibles del backend
    useEffect(() => {
        loadAvailableTags();
    }, []);

    // Filtrar tags basado en el input del usuario
    useEffect(() => {
        if (inputTag.trim()) {
            const filtered = availableTags.filter(tag =>
                tag.name.toLowerCase().includes(inputTag.toLowerCase()) &&
                !selectedTags.includes(tag.name)
            );
            setFilteredTags(filtered);
        } else {
            setFilteredTags([]);
        }
    }, [inputTag, availableTags, selectedTags]);

    const loadAvailableTags = async () => {
        try {
            setLoading(true);
            const tagService = new TagService();
            // Usar getPopularTags() en lugar de getActiveTags() para mostrar las más importantes
            const tags = await tagService.getPopularTags();
            setAvailableTags(tags);
            console.log('🏷️ TagSelector - Tags populares cargadas:', tags);
        } catch (error) {
            console.error('❌ TagSelector - Error cargando tags:', error);
            // Fallback: usar tags predefinidas localmente si falla la conexión
            const fallbackTags = [
                { id: -1, name: 'Taller', archived: false },
                { id: -2, name: 'Escuela de padres', archived: false },
                { id: -3, name: 'Neurodiversidad', archived: false },
                { id: -4, name: 'Educación', archived: false },
                { id: -5, name: 'Recomendado', archived: false },
                { id: -6, name: 'Conferencia', archived: false },
                { id: -7, name: 'TEA', archived: false },
                { id: -8, name: 'Inclusión', archived: false }
            ];
            setAvailableTags(fallbackTags);
            console.log('⚠️ TagSelector - Usando tags fallback:', fallbackTags);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = async () => {
        const trimmedTag = inputTag.trim();
        if (!trimmedTag || selectedTags.includes(trimmedTag)) {
            return;
        }

        try {
            // Intentar crear o obtener la tag
            const tagService = new TagService();
            const tag = await tagService.getOrCreateTag(trimmedTag);

            // Añadir a la lista de seleccionadas
            const newTags = [...selectedTags, tag.name];
            onTagsChange(newTags);
            setInputTag('');

            // Actualizar lista de tags disponibles si es nueva
            if (!availableTags.find(t => t.id === tag.id)) {
                setAvailableTags(prev => [...prev, tag]);
            }

            console.log('✅ TagSelector - Tag añadida:', tag);
        } catch (error) {
            console.error('❌ TagSelector - Error añadiendo tag:', error);
            alert('Error al crear/añadir la tag. Por favor, inténtalo de nuevo.');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = selectedTags.filter(tag => tag !== tagToRemove);
        onTagsChange(newTags);
    };

    const handlePredefinedTagClick = (tag: Tag) => {
        if (!selectedTags.includes(tag.name)) {
            const newTags = [...selectedTags, tag.name];
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
                Tags {loading && <span className={styles.loadingText}>(Cargando...)</span>}
            </label>

            {/* Input para agregar tags personalizados */}
            <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                    <Form.Control
                        type="text"
                        value={inputTag}
                        onChange={(e) => setInputTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        className={styles.tagInput}
                        autoComplete="off"
                    />

                    {/* Mostrar sugerencias filtradas */}
                    {filteredTags.length > 0 && (
                        <div className={styles.suggestions}>
                            {filteredTags.slice(0, 8).map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handlePredefinedTagClick(tag)}
                                    className={styles.suggestionItem}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    variant="outline-primary"
                    onClick={handleAddTag}
                    disabled={!inputTag.trim() || loading}
                    className={styles.addButton}
                >
                    <i className="bi bi-plus-lg"></i>
                </Button>
            </div>

            {/* Tags populares/frecuentes */}
            {!loading && availableTags.length > 0 && (
                <div className={styles.predefinedSection}>
                    <small className={styles.predefinedLabel}>
                        <i className="bi bi-star-fill me-1"></i>
                        Tags sugeridas:
                    </small>
                    <div className={styles.predefinedTags}>
                        {availableTags
                            .filter(tag => !selectedTags.includes(tag.name))
                            .slice(0, 15) // Mostrar más tags sugeridas
                            .map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handlePredefinedTagClick(tag)}
                                    className={styles.predefinedTag}
                                    title={`Añadir tag: ${tag.name}`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                    </div>
                    {availableTags.filter(tag => !selectedTags.includes(tag.name)).length > 15 && (
                        <small className={styles.moreTagsHint}>
                            <i className="bi bi-info-circle me-1"></i>
                            Escribe para ver más opciones...
                        </small>
                    )}
                </div>
            )}

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
