
import { ITextItem } from "@/core/texts/IText";
import { ITextItemDTO } from "@/core/texts/ITextDTO";
import TextService from "@/core/texts/TextService";
import { useEffect, useState } from "react";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import styles from "../Views/scss/Views.module.scss";
const AdminTextView = ({ userId }: { userId: number }) => {
    const [fetchedTexts, setFetchedTexts] = useState<ITextItem[]>([]);
    const [selectedText, setSelectedText] = useState<ITextItem | null>(null);

    // 🔄 HELPER: Función para ordenar textos (más nuevo primero)
    // Si quieres ordenar por id descendente (más reciente primero):
    const sortTextsByDate = (texts: ITextItem[]): ITextItem[] => {
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

    const handleSelect = (item: ITextItem) => setSelectedText(item);

    const handleUpdate = async (text: ITextItem) => {
        try {
            console.log("🔄 [AdminTextView] Recibiendo texto actualizado:", text);

            const textService = new TextService();

            // 🔄 RECARGAR IMÁGENES: Obtener las imágenes actualizadas del backend después de la edición
            let updatedTextWithImages = { ...text };
            if (text.id) {
                try {
                    console.log("🖼️ [AdminTextView] Recargando imágenes del backend para texto:", text.id);
                    const textWithImages = await textService.getTextById(text.id);
                    updatedTextWithImages = {
                        ...text,
                        images: textWithImages.images || []
                    };
                    console.log("✅ [AdminTextView] Imágenes recargadas:", updatedTextWithImages.images.length);
                } catch (imageError) {
                    console.warn("⚠️ [AdminTextView] Error recargando imágenes:", imageError);
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
            const textDTO: ITextItemDTO = {
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

    const handleCreate = async (newText: Partial<ITextItem>) => {
        try {
            console.log("📝 AdminTextView - Nuevo texto recibido:", newText);

            // Manejar eliminación de imágenes de texto
            if ((newText as any).type === 'textDelete' && (newText as any).imageId) {
                const textImageService = new (await import('@/core/texts/images/TextImageService')).default();
                await textImageService.deleteTextImage((newText as any).imageId);
                console.log(`✅ Imagen de texto ${(newText as any).imageId} eliminada`);
                return;
            }

            // Verificar si el texto ya existe en la lista (prevenir duplicados)
            setFetchedTexts(prev => {
                if (!newText.id) return prev;
                const exists = prev.some(t => t.id === newText.id);
                if (exists) {
                    return prev.map(t => t.id === newText.id ? { ...t, ...newText } : t);
                } else {
                    return [{ ...(newText as ITextItem) }, ...prev];
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

    return (
        <div>     <h1 className={styles.centeredTitle}>Admin TextView</h1>

            <ListAdmin
                items={fetchedTexts}
                type="text"
                onSelect={handleSelect}
                onDelete={handleDelete}
                onEdit={handleUpdate}
                onSubmit={handleUpdate}
                onCreate={handleCreate}
                userId={userId}
            />
        </div>
    );
};

export default AdminTextView;
