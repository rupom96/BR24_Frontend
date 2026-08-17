/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Email`;

// Define a service using a base URL and expected endpoints
export const EmailApiSlice = createApi({
  reducerPath: 'EmailApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    // token er kaaj shuru
    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    // token er kaaj shesh
  }),
  tagTypes: ['email'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    sendEmailToNextEventUser: builder.query<
      unknown,
      { companyId: number; fixedTaskTemplateId: number; firstEventNo: string }
    >({
      query: ({ companyId, fixedTaskTemplateId, firstEventNo }) =>
        `sendEmailToNextEventUser?companyId=${companyId}&fixedTaskTemplateId=${fixedTaskTemplateId}&firstEventNo=${firstEventNo}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSendEmailToNextEventUserQuery,
  useLazySendEmailToNextEventUserQuery,
} = EmailApiSlice;
