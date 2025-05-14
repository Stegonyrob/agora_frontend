import DOMPurify from "dompurify";
import React, { useState } from "react";
import { IEvent } from "../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../core/events/IEventDTO";
import styles from "./ButtonCreateEvent.module.scss";
import EventForm from "./modal/EventForm";

interface ButtonCreateEventProps {
    onSubmit: (event: IEvent) => Promise<void>;
    userId: number;
    userName: string;
    userRole: string;
}

const ButtonCreateEvent: React.FC<ButtonCreateEventProps> = ({ onSubmit, userId }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        console.log("Showing Create Event modal");
        setShow(true);
    };

    const handleClose = () => {
        if (show === null) {
            console.error("show is null, cannot close modal");
            return;
        }
        console.log("Closing Create Event modal");
        setShow(false);
    };

    const handleCreate = async (newEvent: IEventDTO | null | undefined) => {
        if (newEvent == null) {
            console.error("Error creating event: newEvent is null or undefined");
            return;
        }

        // Sanitize inputs
        newEvent.title = DOMPurify.sanitize(newEvent.title) || "";
        newEvent.description = DOMPurify.sanitize(newEvent.description) || "";

        const userName = sessionStorage.getItem("userName");
        console.log("userName:", userName);
        const userRole = sessionStorage.getItem("userRole");
        if (userRole !== "admin") {
            console.error("Only administrators can create events.");
            alert("Only administrators can create events.");
            return;
        }

        const event: IEvent = {
            ...newEvent,
            userId,
            userName: userName || "",
        };

        try {
            await onSubmit(event);
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error creating event: ", error);
                alert(`No se pudo crear el evento: ${error.message}. Inténtelo de nuevo más tarde.`);
            } else {
                console.error("Error creating event: unknown error");
                alert("No se pudo crear el evento, por favor intentenlo más tarde.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.buttonCreate} onClick={handleShow}>
                Crear Nuevo Evento
            </button>
            <EventForm
                onSubmit={handleCreate}
                onClose={handleClose}
                show={show}
                userId={userId}
                userName={""}
            />
        </div>
    );
};

export default ButtonCreateEvent;