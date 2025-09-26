import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ITag } from '../../../../../core/tags/ITag';
import TagService from '../../../../../core/tags/TagService';
import styles from './TagSelector.module.scss';


import { IEventTag } from '@/core/events/IEvent';
interface TagSelectorProps {
    selectedTags: IEventTag[];
    onTagsChange: (tags: IEventTag[]) => void;
    placeholder?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
    selectedTags = [],
    onTagsChange,
    placeholder = "Agregar tags..."
}) => {
    // Log destacado solo cuando cambian las tags y no está vacío
    React.useEffect(() => {
        if (selectedTags && selectedTags.length > 0) {
            // eslint-disable-next-line no-console
            console.log("%cTAGS RECIBIDAS EN TAGSELECTOR:", "color: #00bcd4; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;", JSON.stringify(selectedTags, null, 2));
        }
    }, [selectedTags]);

    // Cargar tags disponibles del backend SOLO una vez al montar
    useEffect(() => {
        loadAvailableTags();
    }, []);

    // Normaliza las tags: si existe en availableTags, devuelve {id, name}, si es nueva solo {name}
    const normalizeTagsToObjects = (tags: any[]): IEventTag[] => {
        return tags.map(tag => {
            if (typeof tag === 'object' && typeof tag.id === 'number' && tag.name) {
                return { id: tag.id, name: tag.name, archived: tag.archived ?? false };
            }
            const found = availableTags.find(t => t.name === (typeof tag === 'string' ? tag : tag.name));
            if (found) return { id: found.id, name: found.name, archived: found.archived };
            return { id: -1, name: typeof tag === 'string' ? tag : tag.name, archived: false };
        });
    };
    const [inputTag, setInputTag] = useState('');
    const [availableTags, setAvailableTags] = useState<ITag[]>([]);
    const [filteredTags, setFilteredTags] = useState<ITag[]>([]);
    const [loading, setLoading] = useState(false);



    // Filtrar tags basado en el input del usuario
    useEffect(() => {
        if (inputTag.trim()) {
            const filtered = availableTags.filter(tag =>
                tag.name.toLowerCase().includes(inputTag.toLowerCase()) &&
                !selectedTags.some(t => typeof t === "string" ? t === tag.name : t.name === tag.name)
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
            const tags = await tagService.getPopularTags();
            setAvailableTags(tags);

        } catch (error) {
            console.error('Error cargando tags:', error);
            // Si hay error, usar tags básicas
            const basicTags = [
                { id: -1, name: 'Taller', archived: false },
                { id: -2, name: 'Escuela de padres', archived: false },
                { id: -3, name: 'Neurodiversidad', archived: false },
                { id: -4, name: 'Educación', archived: false },
                { id: -5, name: 'Recomendado', archived: false },
                { id: -6, name: 'Conferencia', archived: false },
                { id: -7, name: 'TEA', archived: false },
                { id: -8, name: 'Inclusión', archived: false }
            ];
            setAvailableTags(basicTags);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = async () => {
        const trimmedTag = inputTag.trim();
        if (!trimmedTag || selectedTags.some((t: any) => (typeof t === 'string' ? t === trimmedTag : t.name === trimmedTag))) {
            return;
        }

        try {
            const tagService = new TagService();
            const tag = await tagService.getOrCreateTag(trimmedTag);
            const newTagObj = { id: tag.id, name: tag.name, archived: tag.archived };
            const newTags = [...selectedTags, newTagObj];
            onTagsChange(normalizeTagsToObjects(newTags));
            setInputTag('');

            if (!availableTags.find(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
                setAvailableTags(prev => [...prev, tag]);
            }
        } catch (error) {
            console.error('Error añadiendo tag:', error);

            // Si hay error, crear tag local
            const localTag = {
                id: -Math.floor(Math.random() * 10000),
                name: trimmedTag,
                archived: false
            };

            const newTags = [...selectedTags, localTag];
            onTagsChange(normalizeTagsToObjects(newTags));
            setInputTag('');
            setAvailableTags(prev => [...prev, localTag]);
        }
    };

    const handleRemoveTag = (tagToRemove: any) => {
        const newTags = selectedTags.filter((tag: any) => (typeof tag === 'string' ? tag !== tagToRemove : tag.name !== (tagToRemove.name || tagToRemove)));
        onTagsChange(normalizeTagsToObjects(newTags));
    };

    const handlePredefinedTagClick = (tag: ITag) => {
        if (!selectedTags.some((t: any) => (typeof t === 'string' ? t === tag.name : t.name === tag.name))) {
            const newTagObj = { id: tag.id, name: tag.name, archived: tag.archived };
            const newTags = [...selectedTags, newTagObj];
            onTagsChange(normalizeTagsToObjects(newTags));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation(); // Evita submit global
            // NO llamamos a handleAddTag aquí para evitar asincronía de estado
            // El usuario debe usar el botón "+" para agregar la tag
        }
    };

    return (
        <div className={styles.tagSelector}>
            <label className={styles.label}>
                <i className="bi bi-tags-fill me-2"></i>
                Tags
                {loading && <span className={styles.loadingText}>(Cargando...)</span>}
            </label>

            {/* Input para agregar tags personalizados */}
            <div className={styles.inputTagsContainer}>
                <div className={styles.inputWrapper}>
                    <Form.Control
                        type="text"
                        value={inputTag}
                        onChange={(e) => setInputTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className={styles.tagInput}
                        autoComplete="off"
                        // Evita submit global en móviles
                        onSubmit={e => e.preventDefault()}
                    />

                    {/* Mostrar sugerencias filtradas */}
                    {filteredTags.length > 0 && (
                        <div className={styles.suggestions}>
                            {filteredTags.slice(0, 8).map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={e => { e.stopPropagation(); handlePredefinedTagClick(tag); }}
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
                    type="button"
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
                            .filter(tag => !selectedTags.some(t => typeof t === "string" ? t === tag.name : t.name === tag.name))
                            .slice(0, 15) // Mostrar más tags sugeridas
                            .map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={e => { e.stopPropagation(); handlePredefinedTagClick(tag); }}
                                    className={styles.predefinedTag}
                                    title={`Añadir tag: ${tag.name}`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                    </div>
                    {availableTags.filter(tag => !selectedTags.some(t => typeof t === "string" ? t === tag.name : t.name === tag.name)).length > 15 && (
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
                        {selectedTags.map((tag) => {
                            const tagKey = typeof tag === 'string' ? tag : tag.id;
                            const tagLabel = typeof tag === 'string' ? tag : tag.name;
                            return (
                                <span key={tagKey} className={styles.selectedTag}>
                                    {tagLabel}
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); handleRemoveTag(tag); }}
                                        className={styles.removeButton}
                                        title={`Eliminar tag: ${tagLabel}`}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
};

export default TagSelector;
