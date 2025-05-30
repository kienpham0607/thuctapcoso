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

        // Add user management endpoints (Admin only access handled by backend routes)
        getUsers: builder.query({
            query: () => {
                console.log('Calling getUsers endpoint');
                return 'users'; // GET /api/auth/users
            },
            providesTags: (result) =>
                // Assuming the API returns an array of users
                result
                ? [
                    ...result.users.map(({ id }) => ({ type: 'User', id })),
                    { type: 'User', id: 'LIST' },
                    ]
                : [{ type: 'User', id: 'LIST' }],
        }),
        getUserById: builder.query({
            query: (id) => {
                 console.log('Calling getUserById endpoint for id:', id);
                return `users/${id}`;
            }, // GET /api/auth/users/:id
             providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        createUser: builder.mutation({
            query: (userData) => ({
                url: 'register', // Using the existing register API for simplicity, but note backend authorization may be needed
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }], // Invalidate list after creating
        }),
        updateUser: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `users/${id}`, // PUT /api/auth/users/:id
                method: 'PUT',
                body: patch,
            }),
             invalidatesTags: (result, error, { id }) => [{
                type: 'User',
                id
            }, { type: 'User', id: 'LIST' }], // Invalidate specific user and list
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`, // DELETE /api/auth/users/:id
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{
                type: 'User',
                id: 'LIST'
            }, {
                type: 'User',
                id
            }], // Invalidate list and specific user
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
    // Export new user management hooks
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = authApi;