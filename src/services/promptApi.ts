// src/services/promptApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const promptApi = createApi({
  reducerPath: 'promptApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }),
  endpoints: (builder) => ({
    getPrompt: builder.query<{
      id: string;
      title: string;
      description: string;
      image_url: string | null;
      created_at: string;
      updated_at: string;
    }, string>({
      query: (id) => `/api/prompts/${id}`,
      async onQueryStarted(id, { queryFulfilled }) {
        try {
          await queryFulfilled;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error?.error?.status === 404) {
            console.error('Prompt not found');
          }
        }
      },
    }),
  }),
});

// Export the hooks for components
export const { 
  useGetPromptQuery,
} = promptApi;

// Export the endpoint for server-side usage
export const { getPrompt } = promptApi.endpoints;