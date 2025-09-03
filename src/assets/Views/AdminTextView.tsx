
import { ITextItem } from "@/core/texts/ITextItem";
import { ITextItemDTO } from "@/core/texts/ITextItemDTO";
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

            // ✅ ACTUALIZACIÓN OPTIMISTA: Actualizar la UI inmediatamente
            setFetchedTexts(prev => {
                const updated = prev.map(t => (t.id === text.id ? { ...t, ...text } : t));
                // 🔄 MANTENER ORDEN: Reordenar después de actualizar para mantener consistencia
                return sortTextsByDate(updated);
            });

            const textService = new TextService();
            // Crear un DTO limpio del texto sin las tags (las tags se manejan separadamente)
            const textDTO: ITextItemDTO = {
                id: text.id,
                title: text.title,
                description: text.description,
                image: text.image,
                name_image: text.name_image,
                category: text.category,
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
