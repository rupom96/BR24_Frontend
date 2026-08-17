import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ICostSheetDetail,
  ICostSheetDetailCommandsVM,
  ICostSheetDetailWithTotalAmountCommandsVM,
} from '../../domain/interfaces/CostSheetDetailInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `CostSheetDetail`;

// Define a service using a base URL and expected endpoints
export const CostSheetDetailApiSlice = createApi({
  reducerPath: 'CostSheetDetailApiSlice',
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
  tagTypes: ['CostSheetDetail'],
  endpoints: (builder) => ({
    getCostSheetDetailByCostSheetId: builder.query<
      ICostSheetDetail[],
      { costSheetId: number }
    >({
      query: ({ costSheetId }) =>
        `getCostSheetDetailByCostSheetId?costSheetId=${costSheetId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['CostSheetDetail'],
    }),
    processCostSheetDetail: builder.mutation<
      unknown,
      ICostSheetDetailWithTotalAmountCommandsVM
    >({
      query: (objToSave) => ({
        url: 'process', // `${API_BASE_URL}/costSheetDetail/process`,
        method: 'POST',
        body: objToSave,
      }),
      invalidatesTags: ['CostSheetDetail'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCostSheetDetailByCostSheetIdQuery,
  useProcessCostSheetDetailMutation,
} = CostSheetDetailApiSlice;
