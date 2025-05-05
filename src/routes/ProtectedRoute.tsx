import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.login);

    console.log("isLoggedIn:", isLoggedIn);

    // Si no está autenticado, redirige a /login
    return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;