import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILCNoComboBox } from '../../domain/interfaces/LCNoComboBoxInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `CostSheet`;

// Define a service using a base URL and expected endpoints
export const CostSheetLCNoApiSlice = createApi({
  reducerPath: 'CostSheetLCNoApiSlice',
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
  tagTypes: ['LCNoComboBox'],
  endpoints: (builder) => ({
    getAllLCNoByCompanyId: builder.query<
      ILCNoComboBox[],
      { companyId: number }
    >({
      query: ({ companyId }) => `getAllLCNo?companyId=${companyId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['LCNoComboBox'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllLCNoByCompanyIdQuery } = CostSheetLCNoApiSlice;
