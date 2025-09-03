import DOMPurify from "dompurify";
import React, { useState } from "react";
import styles from "./ButtonCreateGeneric.module.scss";
import EventForm from "./modal/EventForm";
import PostForm from "./modal/PostForm";
import TextForm from "./modal/TextForm";

interface ButtonCreateGenericProps {
    type: "post" | "event" | "text";
    onSubmit: (data: any) => Promise<void>;
    userId: number;
}



const ButtonCreateGeneric: React.FC<ButtonCreateGenericProps> = ({ type, onSubmit, userId }) => {
    const [show, setShow] = useState(false);

    console.log("🔧 ButtonCreateGeneric - Props recibidos:", {
        type,
        userId,
        userIdType: typeof userId,
        sessionUserId: sessionStorage.getItem("userId"),
        sessionUserRole: sessionStorage.getItem("role")
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // Handler para crear post, evento o texto
    const handleCreate = async (newItem: any) => {
        if (!newItem) {
            alert("Faltan datos para crear.");
            return;
        }

        // Sanitizes fields based on type
        const sanitizeItemFields = (item: any, type: string): any => {
            const sanitizedItem = { ...item };
            if (item.title) {
                sanitizedItem.title = DOMPurify.sanitize(item.title);
            }
            if (type === "post" && item.message) {
                sanitizedItem.message = DOMPurify.sanitize(item.message);
            }
            if ((type === "event" || type === "text") && item.description) {
                sanitizedItem.description = DOMPurify.sanitize(item.description);
            }
            return sanitizedItem;
        };

        const userName = sessionStorage.getItem("userName") || "";
        const userRole = sessionStorage.getItem("role") || "";

        if (userRole !== "ROLE_ADMIN") {
            alert("Solo los administradores pueden crear.");
            return;
        }

        const item = {
            ...sanitizeItemFields(newItem, type),
            userId,
            userName,
        };

        try {
            await onSubmit(item);
            handleClose();
        } catch (error) {
            alert("No se pudo crear, inténtelo de nuevo más tarde.");
        }
    }; return (
        <div className={styles.container}>
            <button className={styles.buttonCreate} onClick={handleShow}>
                {type === "post"
                    ? "Crear Nuevo Post"
                    : type === "event"
                        ? "Crear Nuevo Evento"
                        : "Crear Nuevo Texto"}
            </button>
            {type === "post" && (
                <PostForm
                    onSubmit={handleCreate}
                    onClose={handleClose}
                    show={show}
                    userId={userId}
                    userName={sessionStorage.getItem("userName") || ""}
                />
            )}
            {type === "event" && (
                <EventForm
                    onSubmit={handleCreate}
                    onClose={handleClose}
                    show={show}
                    userId={userId}
                />
            )}
            {type === "text" && (
                <TextForm
                    onSubmit={handleCreate}
                    onClose={handleClose}
                    show={show}
                    userId={userId}
                />
            )}
        </div>
    );
};

export default ButtonCreateGeneric;
