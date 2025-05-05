import AdminNavBar from "@/assets/Components/NavBar/AdminNavBar";
import NavBar from "@/assets/Components/NavBar/NavBar";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

interface PrivateLayoutProps {
    children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
    const { loggedUserRole } = useSelector((state: RootState) => state.login);

    return (
        <div>
            {/* Layout content */}
            {/* Barra de navegación para usuarios autenticados */}
            {loggedUserRole === "ROLE_ADMIN" ? <AdminNavBar /> : <NavBar />}

            {/* Contenido de las páginas privadas */}
            <Outlet />
            {children}
        </div>
    );
};

export default PrivateLayout;