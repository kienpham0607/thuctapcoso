import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/auth/',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            console.log('Token from state:', token);
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
                console.log('Authorization header set:', headers.get('authorization'));
            }
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: ['Profile', 'User'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData,
            }),
        }),

        // Get current user profile
        getCurrentUser: builder.query({
            query: () => {
                console.log('Calling getCurrentUser endpoint');
                return 'profile';
            },
            providesTags: ['Profile'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log('getCurrentUser response:', result);
                } catch (error) {
                    console.error('getCurrentUser error:', error);
                }
            },
        }),

        // Update profile
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: 'profile',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['Profile'],
            transformResponse: (response) => {
                return response.user;
            },
            // Optimistic update
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(authApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
                        Object.assign(draft, data);
                    }));
                } catch {}
            },
        }),

        // Change password
        changePassword: builder.mutation({
            query: (passwords) => ({
                url: 'change-password',
                method: 'PUT',
                body: passwords,
            }),
        }),

        // Upload avatar (if implemented)
        uploadAvatar: builder.mutation({
            query: (formData) => ({
                url: 'upload-avatar',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: ['Profile'],
        }),

        // Refresh token
        refreshToken: builder.mutation({
            query: (refreshToken) => ({
                url: 'refresh-token',
                method: 'POST',
                body: { refreshToken },
            }),
        }),

        // Logout
        logout: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'POST',
            }),
        }),

        // User management endpoints (Admin only access)
        getUsers: builder.query({
            query: () => 'users',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'User', id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to get users');
                }
                return response.users;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || 'Failed to get users';
            }
        }),
        
        getUserById: builder.query({
            query: (id) => `users/${id}`,
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to get user');
                }
                return response.user;
            },
            providesTags: (result, error, id) => [{ type: 'User', id }]
        }),
        
        createUser: builder.mutation({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }),
            transformResponse: (response) => {
                console.log('Create user response:', response);
                return response;
            },
            transformErrorResponse: (error) => {
                console.log('Create user error:', error);
                if (error.data) {
                    return error.data;
                }
                return { message: 'Failed to create user' };
            },
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),
        
        updateUser: builder.mutation({
            query: ({ id, ...update }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: update
            }),
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to update user');
                }
                return response.user;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || 'Failed to update user';
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' }
            ]
        }),
        
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE'
            }),
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to delete user');
                }
                return response;
            },
            transformErrorResponse: (response) => {
                return response.data?.message || 'Failed to delete user';
            },
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useUploadAvatarMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    // User management hooks
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = authApi;