import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApiService';

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            console.log('🔴 Logging out user...');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
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
                    state.token = payload.token;
                    localStorage.setItem('token', payload.token);
                    console.log('🔑 Token stored in localStorage');
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
                    state.token = payload.token;
                    localStorage.setItem('token', payload.token);
                    console.log('🔑 Token stored in localStorage');
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