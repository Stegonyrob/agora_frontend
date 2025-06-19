import NavBar from "@/assets/Components/NavBar/NavBar";
import { selectSession } from "@/core/auth/sessionSelector";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

interface PrivateLayoutProps {
    children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
    const { role: loggedUserRole, isLoggedIn } = useSelector(selectSession);

    return (
        <div>

            <NavBar />

            <Outlet />
            {children}
        </div>
    );
};

export default PrivateLayout;