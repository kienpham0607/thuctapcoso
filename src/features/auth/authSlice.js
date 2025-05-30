import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApiService';

const initialState = {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

// Debug log initial state
console.log('Auth Initial State:', {
    hasAccessToken: !!localStorage.getItem('accessToken'),
    hasRefreshToken: !!localStorage.getItem('refreshToken'),
    isAuthenticated: false
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        updateUserProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle getCurrentUser
            .addMatcher(
                authApi.endpoints.getCurrentUser.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.getCurrentUser.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.getCurrentUser.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message;
                    if (action.error.status === 401) {
                        state.isAuthenticated = false;
                    }
                }
            )
            // Handle login
            .addMatcher(
                authApi.endpoints.login.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, action) => {
                    const { user, accessToken, refreshToken } = action.payload;
                    state.user = user;
                    state.accessToken = accessToken;
                    state.refreshToken = refreshToken;
                    state.isAuthenticated = true;
                    state.isLoading = false;
                    state.error = null;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message;
                }
            )
            // Handle logout
            .addMatcher(
                authApi.endpoints.logout.matchFulfilled,
                (state) => {
                    state.user = null;
                    state.accessToken = null;
                    state.refreshToken = null;
                    state.isAuthenticated = false;
                    state.error = null;
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            )
            // Handle update profile
            .addMatcher(
                authApi.endpoints.updateProfile.matchFulfilled,
                (state, action) => {
                    state.user = action.payload;
                }
            )
            // Handle token refresh
            .addMatcher(
                authApi.endpoints.refreshToken.matchFulfilled,
                (state, action) => {
                    const { accessToken, refreshToken } = action.payload;
                    state.accessToken = accessToken;
                    state.refreshToken = refreshToken;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                }
            );
    },
});

export const { setCredentials, logout, clearCredentials, updateUserProfile } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;