import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBankComboBox } from '../../domain/interfaces/BankComboBoxInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const API_BASE_URL = window.API_BASE_URL;
// Define a service using a base URL and expected endpoints

const controllerName: string = `Bank`;

export const GetBanksForChequeBookApi = createApi({
  reducerPath: 'GetBanksForChequeBookApi',
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
  tagTypes: ['bankOptions'],
  endpoints: (builder) => ({
    getBanksComboOptions: builder.query<IBankComboBox[], { companyId: number }>(
      {
        query: ({ companyId }) => `getBankByCompanyId?companyId=${companyId}`,
        providesTags: () => ['bankOptions'],
      }
    ),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBanksComboOptionsQuery,
  useLazyGetBanksComboOptionsQuery,
} = GetBanksForChequeBookApi;
