import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    if (!isAuthenticated) {
        console.log('🔒 Access denied: User not authenticated');
        return <Navigate to="/login" replace />;
    }

    console.log('🔓 Access granted: User is authenticated');
    return children;
};

export default PrivateRoute;