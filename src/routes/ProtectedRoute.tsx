import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
    element: React.ReactElement;
    path: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    element,
    ...props
}) => {
    const isAuthenticated = useSelector(
        ({ auth }: RootState) => auth.user !== null
    );

    console.log('isAuthenticated:', isAuthenticated);

    return isAuthenticated ? (
        <Route {...props} element={element} />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;