import styles from "@/assets/Components/Generals/Card/CardGeneral.module.css";
import CardGeneralContainer from "@/assets/Components/Generals/Card/CardGeneralContainer";
import React from "react";
const CardGeneralTest: React.FC = () => {
    const mockPosts = [
        {
            id: 1,
            title: "Post 1",
            userName: "Usuario 1",
            message: "Este es el contenido del primer post. Es un texto de prueba.",
            image: "https://via.placeholder.com/150",
            comments: [
                { id: 1, text: "Comentario 1" },
                { id: 2, text: "Comentario 2" },
            ],
            userId: 1,
        },
        {
            id: 2,
            title: "Post 2",
            userName: "Usuario 2",
            message: "Este es el contenido del segundo post. Es otro texto de prueba.",
            image: "https://via.placeholder.com/150",
            comments: [],
            userId: 2,
        },
    ];

    const mockEvents = [
        {
            id: 1,
            title: "Evento 1",
            description: "Este es el contenido del primer evento.",
            image: "https://via.placeholder.com/150",
            date: "2025-05-11",
        },
        {
            id: 2,
            title: "Evento 2",
            description: "Este es el contenido del segundo evento.",
            image: "https://via.placeholder.com/150",
            date: "2025-05-12",
        },
    ];

    const handleSelectPost = (post: any) => {
        alert(`Post seleccionado: ${post.title}`);
    };

    const handleSelectEvent = (event: any) => {
        alert(`Evento seleccionado: ${event.title}`);
    };

    return (
        <div style={{ padding: "2rem", backgroundColor: "#121212" }}>
            <h2 style={{ color: "#f5f5f5" }}>Prueba de CardGeneralContainer</h2>

            {/* Renderizar posts */}
            <CardGeneralContainer
                type="post"
                items={mockPosts}
                onSelect={handleSelectPost}
                isLoggedIn={true}
                className={styles.button}
            />

            {/* Renderizar eventos */}
            <CardGeneralContainer
                type="event"
                items={mockEvents}
                onSelect={handleSelectEvent}
            />
        </div>
    );
};

export default CardGeneralTest;