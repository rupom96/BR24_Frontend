/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IDepartment } from '../../domain/interfaces/DepartmentInterface';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Department`;

// Define a service using a base URL and expected endpoints
export const DepartmentApiSlice = createApi({
  reducerPath: 'DepartmentApi',
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
  tagTypes: ['departmentOptions'],
  endpoints: (builder) => ({
    getDepartmentByCompanyId: builder.query<
      IDepartment[],
      {
        companyId: number;
        buyerGroupId?: number | null;
        buyerId?: number | null;
        salesPersonId?: number | null;
      }
    >({
      query: ({ companyId, buyerGroupId, buyerId, salesPersonId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (buyerGroupId) params.append('buyerGroupId', String(buyerGroupId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        if (salesPersonId)
          params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        return `getDepartmentByCompanyId?${params.toString()}`;
      },
      providesTags: () => ['departmentOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDepartmentByCompanyIdQuery,
  useLazyGetDepartmentByCompanyIdQuery,
} = DepartmentApiSlice;
