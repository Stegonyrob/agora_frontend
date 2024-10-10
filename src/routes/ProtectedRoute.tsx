
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { user } = useSelector((state: RootState) => state.login);

    const isAuthenticated = user !== null;
    console.log('isAuthenticated:', isAuthenticated);

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};




export default ProtectedRoute;