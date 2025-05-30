import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const gpaApi = createApi({
    reducerPath: 'gpaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/gpa', // Base URL for GPA APIs
        prepareHeaders: (headers, { getState }) => {
            // Add authentication token to headers
            const accessToken = getState().auth.accessToken; // Assuming token is in auth state
            if (accessToken) {
                headers.set('authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Get all GPA entries for the current user
        getGpaEntries: builder.query({
            query: () => '/',
            providesTags: ['GpaEntries'], // Tag for caching and invalidation
        }),

        // Create a new GPA entry
        createGpaEntry: builder.mutation({
            query: (gpaEntryData) => ({
                url: '/',
                method: 'POST',
                body: gpaEntryData,
            }),
            invalidatesTags: ['GpaEntries', 'GpaPerformance'], // Invalidate relevant caches
        }),

        // Update an existing GPA entry
        updateGpaEntry: builder.mutation({
            query: ({ id, ...gpaEntryData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: gpaEntryData,
            }),
            invalidatesTags: ['GpaEntries', 'GpaPerformance'], // Invalidate relevant caches
        }),

        // Delete a GPA entry
        deleteGpaEntry: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['GpaEntries', 'GpaPerformance'], // Invalidate relevant caches
        }),

        // Get GPA performance data for the chart
        getGpaPerformance: builder.query({
            query: () => '/performance',
            providesTags: ['GpaPerformance'], // Tag for caching and invalidation
        }),

        // Create multiple GPA entries
        createBulkGpaEntries: builder.mutation({
            query: (gpaEntriesData) => ({
                url: '/bulk', // Use the new bulk endpoint
                method: 'POST',
                body: gpaEntriesData, // Send array of entries
            }),
            invalidatesTags: ['GpaEntries', 'GpaPerformance'], // Invalidate relevant caches
        }),
    }),
    tagTypes: ['GpaEntries', 'GpaPerformance'], // Define tag types
});

export const {
    useGetGpaEntriesQuery,
    useCreateGpaEntryMutation,
    useUpdateGpaEntryMutation,
    useDeleteGpaEntryMutation,
    useGetGpaPerformanceQuery,
    useCreateBulkGpaEntriesMutation, // Export the new hook
} = gpaApi; 