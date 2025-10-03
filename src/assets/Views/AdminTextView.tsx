
import { IText } from "@/core/texts/IText";
import { ITextDTO } from "@/core/texts/ITextDTO";
import TextService from "@/core/texts/TextService";
import { useEffect, useState } from "react";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import styles from "../Views/scss/Views.module.scss";
const AdminTextView = ({ userId }: { userId: number }) => {
    const [fetchedTexts, setFetchedTexts] = useState<IText[]>([]);
    const [selectedText, setSelectedText] = useState<IText | null>(null);

    // 🔄 HELPER: Función para ordenar textos (más nuevo primero)
    // Si quieres ordenar por id descendente (más reciente primero):
    const sortTextsByDate = (texts: IText[]): IText[] => {
        return texts.sort((a, b) => b.id - a.id);
    };

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const textService = new TextService();
                const texts = await textService.getAllTexts();
                setFetchedTexts(sortTextsByDate(texts));
            } catch (error: any) {
                console.error("❌ Error fetching texts:", error);
                if (error.response) {
                    console.error("📋 Response status:", error.response.status);
                    console.error("📋 Response data:", error.response.data);
                }
            }
        };
        fetchTexts();
    }, []);

    const handleSelect = (item: IText) => setSelectedText(item);

    const handleUpdate = async (text: IText) => {
        try {
            // Texto actualizado recibido

            const textService = new TextService();

            // 🔄 RECARGAR IMÁGENES: Obtener las imágenes actualizadas del backend después de la edición
            let updatedTextWithImages = { ...text };
            if (text.id) {
                try {
                    // Recargando imágenes del backend
                    const textWithImages = await textService.getTextById(text.id);
                    updatedTextWithImages = {
                        ...text,
                        images: textWithImages.images || []
                    };
                    // Imágenes recargadas exitosamente
                } catch (imageError) {
                    // Error recargando imágenes
                    // Continuar sin imágenes si falla
                }
            }

            // ✅ ACTUALIZACIÓN OPTIMISTA: Actualizar la UI inmediatamente con las imágenes recargadas
            setFetchedTexts(prev => {
                const updated = prev.map(t => (t.id === text.id ? { ...t, ...updatedTextWithImages } : t));
                // 🔄 MANTENER ORDEN: Reordenar después de actualizar para mantener consistencia
                return sortTextsByDate(updated);
            });

            // Crear un DTO limpio del texto sin las tags (las tags se manejan separadamente)
            const textDTO: ITextDTO = {
                userId: userId || 0, // Usar el userId del componente
                title: text.title,
                message: text.message,
                images: [], // Las imágenes se manejan separadamente
                name_image: text.name_image,
                category: text.category,
                id: text.id,
            };
            await textService.updateText(text.id, textDTO);
        } catch (error) {
            console.error("❌ AdminTextView - Error updating text:", error);
            // En caso de error, revertir la actualización optimista y mantener orden
            const originalText = fetchedTexts.find(t => t.id === text.id);
            if (originalText) {
                setFetchedTexts(prev => {
                    const reverted = prev.map(t => (t.id === text.id ? originalText : t));
                    // 🔄 MANTENER ORDEN después de revertir
                    return sortTextsByDate(reverted);
                });
            }
        }
    };

    const handleCreate = async (newText: Partial<IText>) => {
        try {
            // Nuevo texto recibido

            // Manejar eliminación de imágenes de texto
            if ((newText as any).type === 'textDelete' && (newText as any).imageId) {
                const textImageService = new (await import('@/core/texts/images/TextImageService')).default();
                await textImageService.deleteTextImage((newText as any).imageId);
                // Imagen eliminada exitosamente
                return;
            }

            // Verificar si el texto ya existe en la lista (prevenir duplicados)
            setFetchedTexts(prev => {
                if (!newText.id) return prev;
                const exists = prev.some(t => t.id === newText.id);
                if (exists) {
                    return prev.map(t => t.id === newText.id ? { ...t, ...newText } : t);
                } else {
                    return [{ ...(newText as IText) }, ...prev];
                }
            });
        } catch (error) {
            console.error("Error adding text to list:", error);
        }
    };

    const handleDelete = async (textId: number): Promise<void> => {
        try {
            const textService = new TextService();
            await textService.deleteText(textId);
            setFetchedTexts(prev => prev.filter(text => text.id !== textId));
        } catch (error) {
            console.error("Error deleting text:", error);
        }
    };

    const handleArchive = async (textId: number): Promise<boolean> => {
        try {
            const textService = new TextService();
            await textService.archiveText(textId, true);
            // Actualizar el estado local del texto
            setFetchedTexts(prev => prev.map(text =>
                text.id === textId ? { ...text, archived: true } : text
            ));
            return true;
        } catch (error) {
            console.error("Error archiving text:", error);
            return false;
        }
    };

    const handleUnArchive = async (textId: number): Promise<boolean> => {
        try {
            const textService = new TextService();
            await textService.unArchiveText(textId);
            // Actualizar el estado local del texto
            setFetchedTexts(prev => prev.map(text =>
                text.id === textId ? { ...text, archived: false } : text
            ));
            return true;
        } catch (error) {
            console.error("Error unarchiving text:", error);
            return false;
        }
    };

    return (
        <div>     <h1 className={styles.centeredTitle}>Admin TextView</h1>

            <ListAdmin
                items={fetchedTexts}
                type="text"
                onSelect={handleSelect}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onUnArchive={handleUnArchive}
                onEdit={handleUpdate}
                onSubmit={handleUpdate}
                onCreate={handleCreate}
                userId={userId}
            />
        </div>
    );
};

export default AdminTextView;
