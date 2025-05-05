import NavBar from "@/assets/Components/NavBar/NavBar";
import { Outlet } from "react-router-dom";

interface PrivateLayoutProps {
    children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
    return (
        <div>
            {/* Layout content */}
            {/* Barra de navegación para usuarios autenticados */}
            <NavBar />

            {/* Contenido de las páginas privadas */}
            <Outlet />
            {children}
        </div>
    );
};

export default PrivateLayout;