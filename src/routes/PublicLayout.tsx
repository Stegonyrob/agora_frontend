import NavBar from "@/assets/Components/NavBar/NavBar";
import WhatsAppButton from "@/assets/Components/WhatsApp/WhatsAppButton";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const PublicLayout: React.FC = () => {
    const location = useLocation();

    // Verificar si la ruta actual es la página de inicio
    const isHomePage = location.pathname === "/";

    return (
        <>
            {/* Mostrar NavBar solo si no estamos en la página de inicio */}
            {!isHomePage && <NavBar />}

            {/* Contenido de las páginas públicas */}
            <Outlet />

            {/* Botón de WhatsApp */}
            <WhatsAppButton
                phoneNumber="34693545993"
                welcomeMessage="¡Hola! bienvenido a Agora 👋 ¿En qué podemos ayudarte?"
                initialMessage="Hola Agora. Necesito más información sobre sus servicios."
                delay={2000}
            />
        </>
    );
};

export default PublicLayout;