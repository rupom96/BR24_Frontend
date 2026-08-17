/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IGetSalesReturnInfoFilterDto,
  ISalesReturn,
  ISalesReturnDetailInfo,
  ISalesReturnInfo,
  ISalesReturnNoAndBuyerOptions,
  ISalesReturnNoComboBox,
  ISalesReturnProcessCommandsVM,
} from '../../domain/interfaces/SalesReturnInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `SalesReturn`;

// Define a service using a base URL and expected endpoints
export const SalesReturnApiSlice = createApi({
  reducerPath: 'SalesReturnApi',
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
  tagTypes: [
    'salesReturnOptions',
    'salesReturn',
    'salesReturnAndBuyerOptions',
    'salesReturnAdditionalCostPreference',
    'salesReturnInfos',
    'salesReturnDetailInfo',
  ],
  endpoints: (builder) => ({
    getAllSalesReturnNo: builder.query<
      ISalesReturnNoComboBox[],
      { companyId: number; locationId: number; buyerId: number | null }
    >({
      query: ({ companyId, locationId, buyerId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        return `getAllSalesReturnNo?${params.toString()}`;
      },
      providesTags: () => ['salesReturnOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getSalesReturnNoAndBuyer: builder.query<
      ISalesReturnNoAndBuyerOptions[],
      {
        companyId: number;
        locationId: number;
        salesReturnId: string | null;
        buyerId: number | null;
      }
    >({
      query: ({ companyId, locationId, salesReturnId, buyerId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (salesReturnId)
          params.append('salesReturnId', String(salesReturnId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        return `getSalesReturnNoAndBuyer?${params.toString()}`;
      },
      providesTags: () => ['salesReturnAndBuyerOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getSalesReturnBySalesReturnId: builder.query<
      ISalesReturn,
      { salesReturnId: string; _ts?: number | null }
    >({
      query: ({ salesReturnId, _ts }) =>
        `getSalesReturnBySalesReturnId?SalesReturnId=${salesReturnId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['salesReturn'],
    }),

    getSalesReturnInfo: builder.query<
      ISalesReturnInfo[], // what the hook returns
      { filter: IGetSalesReturnInfoFilterDto | null }
    >({
      query: ({ filter }) => {
        const params = new URLSearchParams();

        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              params.append(key, value.toString());
            }
          });
        }

        return `getSalesReturnInfo${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },

      //  unwrap Result<ISalesReturnInfo[]>
      transformResponse: (response: IApiResult<ISalesReturnInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load sales return info'
          );
        }

        return response.data ?? [];
      },

      providesTags: () => ['salesReturnInfos'],
    }),

    getSalesReturnDetailBySalesReturnIdCopy: builder.query<
      ISalesReturnDetailInfo[], //  what the hook returns
      { salesReturnId: string }
    >({
      query: ({ salesReturnId }) =>
        `getSalesReturnDetailInfo?SalesReturnId=${salesReturnId}`,

      //  unwrap Result<ISalesReturnDetailInfo[]>
      transformResponse: (response: IApiResult<ISalesReturnDetailInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load sales return detail info'
          );
        }

        return response.data ?? [];
      },

      providesTags: ['salesReturnDetailInfo'],
    }),

    processSaveSalesReturn: builder.mutation<
      ISalesReturnNoComboBox,
      ISalesReturnProcessCommandsVM
    >({
      query: (objToProcess: ISalesReturnProcessCommandsVM) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'salesReturnOptions',
        'salesReturn',
        'salesReturnDetailInfo',
        'salesReturnInfos',
        'salesReturnAdditionalCostPreference'
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllSalesReturnNoQuery,
  useLazyGetAllSalesReturnNoQuery,
  useGetSalesReturnNoAndBuyerQuery,
  useLazyGetSalesReturnNoAndBuyerQuery,
  useGetSalesReturnBySalesReturnIdQuery,
  useLazyGetSalesReturnBySalesReturnIdQuery,
  useGetSalesReturnInfoQuery,
  useLazyGetSalesReturnInfoQuery,
  useGetSalesReturnDetailBySalesReturnIdCopyQuery,
  useLazyGetSalesReturnDetailBySalesReturnIdCopyQuery,
  useProcessSaveSalesReturnMutation,
} = SalesReturnApiSlice;
