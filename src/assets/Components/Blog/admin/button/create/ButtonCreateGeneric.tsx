import DOMPurify from "dompurify";
import React, { Suspense, lazy, useState } from "react";
import styles from "./ButtonCreateGeneric.module.scss";

const EventForm = lazy(() => import("../create-edit/EventForm"));
const PostForm = lazy(() => import("../create-edit/PostForm"));
const TextForm = lazy(() => import("../create-edit/TextForm"));

interface ButtonCreateGenericProps {
    type: "post" | "event" | "text";
    onSubmit: (data: any) => Promise<void>;
    userId: number;
}



const ButtonCreateGeneric: React.FC<ButtonCreateGenericProps> = ({ type, onSubmit: handleSubmit, userId }) => {
    const [showForm, setShowForm] = useState(false);

    const handleOpenForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);

    const getCreateLabel = () => {
        if (type === "post") {
            return "Crear Nuevo Post";
        }
        if (type === "event") {
            return "Crear Nuevo Evento";
        }
        return "Crear Nuevo Texto";
    };

    const handleCreateItem = async (newItem: any) => {
        if (!newItem) {
            alert("Faltan datos para crear.");
            return;
        }

        const sanitizedItem = sanitizeItemFields(newItem, type);

        const userRole = sessionStorage.getItem("role") || "";

        if (userRole !== "ROLE_ADMIN") {
            alert("Solo los administradores pueden crear.");
            return;
        }

        const itemWithUserId = {
            ...sanitizedItem,
            userId: userId,
            userName: sessionStorage.getItem("userName") || "",
        };

        try {
            await handleSubmit(itemWithUserId);
            handleCloseForm();
        } catch (error: any) {
            const errorMessage = error?.message || "No se pudo crear, inténtelo de nuevo más tarde.";
            alert(errorMessage);
        }
    };

    const sanitizeItemFields = (item: any, type: string): any => {
        const sanitizedItem = { ...item };
        if (type === "post" && item.message) {
            sanitizedItem.message = DOMPurify.sanitize(item.message);
        } else if (type === "event" || type === "text") {
            sanitizedItem.description = DOMPurify.sanitize(item.description);
        }
        return sanitizedItem;
    };

    return (
        <div className={styles.container}>
            <button className={styles.buttonCreate} onClick={handleOpenForm}>
                {getCreateLabel()}
            </button>
            {type === "post" && (
                <Suspense fallback={null}>
                    <PostForm
                        onSubmit={handleCreateItem}
                        onClose={handleCloseForm}
                        show={showForm}
                        userId={userId}
                        mode="create"
                    />
                </Suspense>
            )}
            {type === "event" && (
                <Suspense fallback={null}>
                    <EventForm
                        onSubmit={handleCreateItem}
                        onClose={handleCloseForm}
                        show={showForm}
                        userId={userId}
                        mode="create"
                    />
                </Suspense>
            )}
            {type === "text" && (
                <Suspense fallback={null}>
                    <TextForm
                        onSubmit={handleCreateItem}
                        onClose={handleCloseForm}
                        show={showForm}
                        userId={userId}
                        mode="create"
                    />
                </Suspense>
            )}
        </div>
    );
};

export default ButtonCreateGeneric;
