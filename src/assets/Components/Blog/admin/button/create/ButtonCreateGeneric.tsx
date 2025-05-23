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

    return (
        <div className={styles.container}>
            <button onClick={() => setShow(true)}>
                Crear Nuevo {type === "post" ? "Post" : "Evento"}
            </button>
            {type === "post" && show && (
                <PostForm onSubmit={onSubmit} onClose={() => setShow(false)} show={show} userId={userId} userName={""} />
            )}
            {type === "event" && show && (
                <EventForm onSubmit={onSubmit} onClose={() => setShow(false)} show={show} userId={userId} userName={""} />
            )}
        </div>
    );
};

export default ButtonCreateGeneric;