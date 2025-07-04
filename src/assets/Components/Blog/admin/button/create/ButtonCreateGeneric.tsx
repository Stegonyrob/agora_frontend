import DOMPurify from "dompurify";
import React, { useState } from "react";
import styles from "./ButtonCreateGeneric.module.scss";
import EventForm from "./modal/EventForm";
import PostForm from "./modal/PostForm";

interface ButtonCreateGenericProps {
    type: "post" | "event";
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

    // Handler para crear post o evento
    const handleCreate = async (newItem: any) => {
        if (!newItem) {
            alert("Faltan datos para crear.");
            return;
        }

        // Sanitiza campos comunes
        if (newItem.title) newItem.title = DOMPurify.sanitize(newItem.title);
        if (type === "post" && newItem.message) newItem.message = DOMPurify.sanitize(newItem.message);
        if (type === "event" && newItem.description) newItem.description = DOMPurify.sanitize(newItem.description);

        const userName = sessionStorage.getItem("userName") || "";
        const userRole = sessionStorage.getItem("role") || "";

        if (userRole !== "ROLE_ADMIN") {
            alert("Solo los administradores pueden crear.");
            return;
        }

        const item = {
            ...newItem,
            userId,
            userName,
        };

        try {
            await onSubmit(item);
            handleClose();
        } catch (error) {
            alert("No se pudo crear, inténtelo de nuevo más tarde.");
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.buttonCreate} onClick={handleShow}>
                {type === "post" ? "Crear Nuevo Post" : "Crear Nuevo Evento"}
            </button>
            {type === "post" ? (
                <PostForm
                    onSubmit={handleCreate}
                    onClose={handleClose}
                    show={show}
                    userId={userId}
                    userName={sessionStorage.getItem("userName") || ""}
                />
            ) : (
                <EventForm
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