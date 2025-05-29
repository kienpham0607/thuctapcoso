import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/auth/',
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getState().auth.accessToken;
            if (accessToken) {
                headers.set('authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response) => {
                return {
                    user: response.user,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                };
            },
            transformErrorResponse: (response) => {
                return {
                    message: response.data?.message || 'Đăng nhập thất bại'
                };
            }
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData,
            }),
            transformResponse: (response) => {
                return {
                    user: response.user,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                };
            },
            transformErrorResponse: (response) => {
                return {
                    message: response.data?.message || 'Đăng ký thất bại'
                };
            }
        }),
        getCurrentUser: builder.query({
            query: () => 'me',
            providesTags: ['User']
        }),
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: 'update-profile',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['User']
        }),
        uploadAvatar: builder.mutation({
            query: (formData) => ({
                url: 'upload-avatar',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: ['User']
        }),
        refreshToken: builder.mutation({
            query: (refreshToken) => ({
                url: 'refresh-token',
                method: 'POST',
                body: { refreshToken },
            }),
            transformResponse: (response) => {
                return {
                    user: response.user,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                };
            },
            transformErrorResponse: (response) => {
                return {
                    message: response.data?.message || 'Token refresh failed'
                };
            }
        }),
    }),
    tagTypes: ['User'],
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useUploadAvatarMutation,
    useRefreshTokenMutation,
} = authApi;