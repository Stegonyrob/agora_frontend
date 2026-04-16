import NavBar from "@/assets/Components/NavBar/NavBar";
import WhatsAppButton from "@/assets/Components/WhatsApp/WhatsAppButton";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";



const PublicLayout: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <>

            {!isHomePage && <NavBar />}

            <Outlet />

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