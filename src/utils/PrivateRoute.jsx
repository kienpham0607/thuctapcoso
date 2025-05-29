import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useRefreshTokenMutation } from '../features/auth/authApiService';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const accessToken = useSelector(state => state.auth.accessToken);
    const refreshToken = useSelector(state => state.auth.refreshToken);
    const [refreshTokenMutation, { isLoading: isRefreshingToken }] = useRefreshTokenMutation();

    const [loading, setLoading] = useState(true);

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            setLoading(true);
            if (!isAuthenticated) {
                 // If not authenticated, no need to check tokens, just redirect.
                 setLoading(false);
                 return;
            }

            if (isAuthenticated && isTokenExpired(accessToken) && refreshToken) {
                try {
                    console.log('🔄 Access token expired, attempting refresh...');
                    const result = await refreshTokenMutation(refreshToken).unwrap();
                    console.log('✅ Token refresh successful');

                    // Update tokens in localStorage
                    localStorage.setItem('accessToken', result.accessToken);
                    localStorage.setItem('refreshToken', result.refreshToken);

                } catch (error) {
                    console.log('❌ Token refresh failed:', error);
                    // Clear tokens and redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    dispatch({ type: 'auth/logout' });
                } finally {
                    setLoading(false);
                }
            } else {
                 // If authenticated but no refresh needed (token valid or no refresh token),
                 // we can proceed.
                 setLoading(false);
            }
        };

        checkAndRefreshToken();
    }, [accessToken, refreshToken, isAuthenticated, refreshTokenMutation, dispatch]);

    if (loading) {
        // Optionally, render a loading spinner or null while checking auth status
        return <div>Loading authentication...</div>; // Or return null, or a spinner component
    }

    if (!isAuthenticated) {
        console.log('🔒 Access denied: User not authenticated');
        return <Navigate to="/login" replace />;
    }

    console.log('🔓 Access granted: User is authenticated');
    return children;
};

export default PrivateRoute;