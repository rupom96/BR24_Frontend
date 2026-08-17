/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IGetPurchaseReturnInfoFilterDto,
  IPurchaseReturn,
  IPurchaseReturnDetailInfo,
  IPurchaseReturnInfo,
  IPurchaseReturnNoAndSupplierOptions,
  IPurchaseReturnNoComboBox,
  IPurchaseReturnProcessCommandsVM,
} from '../../domain/interfaces/PurchaseReturnInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `PurchaseReturn`;

// Define a service using a base URL and expected endpoints
export const PurchaseReturnApiSlice = createApi({
  reducerPath: 'PurchaseReturnApi',
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
    'purchaseReturnOptions',
    'purchaseReturn',
    'purchaseReturnAndSupplierOptions',
    'purchaseReturnAdditionalCostPreference',
    'purchaseReturnInfos',
    'purchaseReturnDetailInfo',
  ],
  endpoints: (builder) => ({
    getAllPurchaseReturnNo: builder.query<
      IPurchaseReturnNoComboBox[],
      { companyId: number; locationId: number; supplierId: number | null }
    >({
      query: ({ companyId, locationId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getAllPurchaseReturnNo?${params.toString()}`;
      },
      providesTags: () => ['purchaseReturnOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getPurchaseReturnNoAndSupplier: builder.query<
      IPurchaseReturnNoAndSupplierOptions[],
      {
        companyId: number;
        locationId: number;
        purchaseReturnId: string | null;
        supplierId: number | null;
      }
    >({
      query: ({ companyId, locationId, purchaseReturnId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (purchaseReturnId)
          params.append('purchaseReturnId', String(purchaseReturnId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getPurchaseReturnNoAndSupplier?${params.toString()}`;
      },
      providesTags: () => ['purchaseReturnAndSupplierOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getPurchaseReturnByPurchaseReturnId: builder.query<
      IPurchaseReturn,
      { purchaseReturnId: string; _ts?: number | null }
    >({
      query: ({ purchaseReturnId, _ts }) =>
        `getPurchaseReturnByPurchaseReturnId?PurchaseReturnId=${purchaseReturnId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['purchaseReturn'],
    }),

    getPurchaseReturnInfo: builder.query<
      IPurchaseReturnInfo[], // what the hook returns
      { filter: IGetPurchaseReturnInfoFilterDto | null }
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

        return `getPurchaseReturnInfo${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },

      //  unwrap Result<IPurchaseReturnInfo[]>
      transformResponse: (response: IApiResult<IPurchaseReturnInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load purchase return info'
          );
        }

        return response.data ?? [];
      },

      providesTags: () => ['purchaseReturnInfos'],
    }),

    getPurchaseReturnDetailByPurchaseReturnIdCopy: builder.query<
      IPurchaseReturnDetailInfo[], //  what the hook returns
      { purchaseReturnId: string }
    >({
      query: ({ purchaseReturnId }) =>
        `getPurchaseReturnDetailInfo?PurchaseReturnId=${purchaseReturnId}`,

      //  unwrap Result<IPurchaseReturnDetailInfo[]>
      transformResponse: (
        response: IApiResult<IPurchaseReturnDetailInfo[]>
      ) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ??
              'Failed to load purchase return detail info'
          );
        }

        return response.data ?? [];
      },

      providesTags: ['purchaseReturnDetailInfo'],
    }),

    processSavePurchaseReturn: builder.mutation<
      IPurchaseReturnNoComboBox,
      IPurchaseReturnProcessCommandsVM
    >({
      query: (objToProcess: IPurchaseReturnProcessCommandsVM) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'purchaseReturnOptions',
        'purchaseReturn',
        'purchaseReturnDetailInfo',
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllPurchaseReturnNoQuery,
  useLazyGetAllPurchaseReturnNoQuery,
  useGetPurchaseReturnNoAndSupplierQuery,
  useLazyGetPurchaseReturnNoAndSupplierQuery,
  useGetPurchaseReturnByPurchaseReturnIdQuery,
  useLazyGetPurchaseReturnByPurchaseReturnIdQuery,
  useGetPurchaseReturnInfoQuery,
  useLazyGetPurchaseReturnInfoQuery,
  useGetPurchaseReturnDetailByPurchaseReturnIdCopyQuery,
  useLazyGetPurchaseReturnDetailByPurchaseReturnIdCopyQuery,
  useProcessSavePurchaseReturnMutation,
} = PurchaseReturnApiSlice;
