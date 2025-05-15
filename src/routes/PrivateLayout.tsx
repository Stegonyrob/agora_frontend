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

            <NavBar />

            <Outlet />
            {children}
        </div>
    );
};

export default PrivateLayout;