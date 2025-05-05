import NavBar from "@/assets/Components/NavBar/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

const PrivateLayout: React.FC = () => {
    return (
        <>
            {/* Barra de navegación para usuarios autenticados */}
            <NavBar />

            {/* Contenido de las páginas privadas */}
            <Outlet />
        </>
    );
};

export default PrivateLayout;