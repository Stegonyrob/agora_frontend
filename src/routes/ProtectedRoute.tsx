import { selectSession } from "@/core/auth/sessionSelector";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { role: loggedUserRole, isLoggedIn } = useSelector(selectSession);


    // Si no está autenticado, redirige a /login
    return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;