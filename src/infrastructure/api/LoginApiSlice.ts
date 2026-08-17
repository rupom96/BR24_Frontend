/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Login`;

// Define a service using a base URL and expected endpoints
export const LoginApiSlice = createApi({
  reducerPath: 'LoginApi',
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
  tagTypes: ['securityUserOptions'],
  endpoints: (builder) => ({
    getSecurityUserByCompanyId: builder.query<
      ISecurityUser[],
      { companyId: number }
    >({
      query: ({ companyId }) =>
        `getSecurityUserByCompanyId?companyId=${companyId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['securityUserOptions'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSecurityUserByCompanyIdQuery } = LoginApiSlice;
