import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApiService';

const initialState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null
};

// Add logic to clear tokens on startup if not authenticated
if (!initialState.isAuthenticated) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('persist:root');
    sessionStorage.clear();
    // Also consider clearing cache here if necessary, similar to logout
    if (window.caches) {
        caches.keys().then(function(names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }
    console.log('🧹 Cleared residual tokens and auth data on startup.');
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            console.log('🔴 Logging out user...');
            // Clear Redux state
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;

            // Clear localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('persist:root');

            // Clear sessionStorage
            sessionStorage.clear();

            // Clear any cached data
            if (window.caches) {
                caches.keys().then(function(names) {
                    for (let name of names) {
                        caches.delete(name);
                    }
                });
            }

            console.log('✅ User logged out successfully');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login mutation
            .addMatcher(
                authApi.endpoints.login.matchPending,
                (state) => {
                    console.log('🔄 Login request started...');
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    console.log('✅ Login successful:', payload);
                    state.isLoading = false;
                    state.isAuthenticated = true;
                    state.user = payload.user;
                    state.accessToken = payload.accessToken;
                    state.refreshToken = payload.refreshToken;
                    localStorage.setItem('accessToken', payload.accessToken);
                    localStorage.setItem('refreshToken', payload.refreshToken);
                    console.log('🔑 Access and Refresh tokens stored in localStorage');
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchRejected,
                (state, { payload }) => {
                    console.log('❌ Login failed:', payload);
                    state.isLoading = false;
                    state.error = payload?.message || 'Đăng nhập thất bại';
                }
            )
            // Register mutation
            .addMatcher(
                authApi.endpoints.register.matchPending,
                (state) => {
                    console.log('🔄 Registration request started...');
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.register.matchFulfilled,
                (state, { payload }) => {
                    console.log('✅ Registration successful:', payload);
                    state.isLoading = false;
                    state.isAuthenticated = true;
                    state.user = payload.user;
                    state.accessToken = payload.accessToken;
                    state.refreshToken = payload.refreshToken;
                    localStorage.setItem('accessToken', payload.accessToken);
                    localStorage.setItem('refreshToken', payload.refreshToken);
                    console.log('🔑 Access and Refresh tokens stored in localStorage');
                }
            )
            .addMatcher(
                authApi.endpoints.register.matchRejected,
                (state, { payload }) => {
                    console.log('❌ Registration failed:', payload);
                    state.isLoading = false;
                    state.error = payload?.message || 'Đăng ký thất bại';
                }
            )
            // Get current user
            .addMatcher(
                authApi.endpoints.getCurrentUser.matchFulfilled,
                (state, { payload }) => {
                    console.log('✅ Current user data retrieved:', payload);
                    state.user = payload;
                }
            )
            // Update profile
            .addMatcher(
                authApi.endpoints.updateProfile.matchFulfilled,
                (state, { payload }) => {
                    console.log('✅ Profile updated successfully:', payload);
                    state.user = payload;
                }
            )
            // Upload avatar
            .addMatcher(
                authApi.endpoints.uploadAvatar.matchFulfilled,
                (state, { payload }) => {
                    console.log('✅ Avatar uploaded successfully:', payload);
                    if (state.user) {
                        state.user.avatar = payload.avatar;
                    }
                }
            );
    }
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;