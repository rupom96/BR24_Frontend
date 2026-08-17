/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  ICollectionModeComboBox,
  IPaymentModeAllLocationComboBox,
  IPaymentModeComboBox,
} from '../../domain/interfaces/PaymentModeInterface';
// import { IPaymentMode } from '../../domain/interfaces/PaymentModeInterface';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `PaymentMode`;

// Define a service using a base URL and expected endpoints
export const PaymentModeApiSlice = createApi({
  reducerPath: 'PaymentModeApi',
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
  tagTypes: ['paymentModeOptions'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getPaymentMode: builder.query<
      IPaymentModeComboBox[],
      { companyId: number; locationId: number }
    >({
      query: ({ companyId, locationId }) =>
        `getPaymentMode?companyId=${companyId}&locationId=${locationId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getCollectionMode: builder.query<
      ICollectionModeComboBox[],
      { companyId: number; locationId: number }
    >({
      query: ({ companyId, locationId }) =>
        `getPaymentMode?companyId=${companyId}&locationId=${locationId}`,

      transformResponse: (response: any[]) => {
        return response.map((item) => ({
          collectionModeId: item.paymentModeId,
          collectionModeName: item.paymentModeName,
        }));
      },

      providesTags: () => [],
    }),

    getPaymentModeOfAllLocation: builder.query<
      IPaymentModeAllLocationComboBox[],
      { companyId: number }
    >({
      query: ({ companyId }) =>
        `getPaymentModeForDataMigration?companyId=${companyId}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPaymentModeQuery,
  useLazyGetPaymentModeQuery,
  useGetCollectionModeQuery,
  useLazyGetCollectionModeQuery,
  useGetPaymentModeOfAllLocationQuery,
  useLazyGetPaymentModeOfAllLocationQuery,
} = PaymentModeApiSlice;
