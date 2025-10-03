import DOMPurify from "dompurify";
import React, { useState } from "react";
import EventForm from "../create-edit/EventForm";
import PostForm from "../create-edit/PostForm";
import TextForm from "../create-edit/TextForm";
import styles from "./ButtonCreateGeneric.module.scss";

interface ButtonCreateGenericProps {
    type: "post" | "event" | "text";
    onSubmit: (data: any) => Promise<void>;
    userId: number;
}



const ButtonCreateGeneric: React.FC<ButtonCreateGenericProps> = ({ type, onSubmit: handleSubmit, userId }) => {
    const [showForm, setShowForm] = useState(false);

    const handleOpenForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);

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
        } catch (error) {
            alert("No se pudo crear, inténtelo de nuevo más tarde.");
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
                {type === "post"
                    ? "Crear Nuevo Post"
                    : type === "event"
                        ? "Crear Nuevo Evento"
                        : "Crear Nuevo Texto"}
            </button>
            {type === "post" && (
                <PostForm
                    onSubmit={handleCreateItem}
                    onClose={handleCloseForm}
                    show={showForm}
                    userId={userId}
                    mode="create"
                />
            )}
            {type === "event" && (
                <EventForm
                    onSubmit={handleCreateItem}
                    onClose={handleCloseForm}
                    show={showForm}
                    userId={userId}
                    mode="create"
                />
            )}
            {type === "text" && (
                <TextForm
                    onSubmit={handleCreateItem}
                    onClose={handleCloseForm}
                    show={showForm}
                    userId={userId}
                    mode="create"
                />
            )}
        </div>
    );
};

export default ButtonCreateGeneric;
