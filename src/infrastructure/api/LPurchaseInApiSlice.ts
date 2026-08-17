/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IGetLPurchaseInInfoFilterDto,
  ILPurchaseIn,
  ILPurchaseInAdditionalCost,
  ILPurchaseInDetailInfo,
  ILPurchaseInInfo,
  ILPurchaseInNoAndSupplierOptions,
  ILPurchaseInNoComboBox,
  ILPurchaseInProcessCommandsVM,
} from '../../domain/interfaces/LPurchaseInInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';

// import { ILPurchaseInAdditionalCost } from '../../domain/interfaces/LPurchaseInAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `LPurchaseIn`;

// Define a service using a base URL and expected endpoints
export const LPurchaseInApiSlice = createApi({
  reducerPath: 'LPurchaseInApi',
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
    'lPurchaseInOptions',
    'lPurchaseIn',
    'lPurchaseInAdditionalCost',
    'lPurchaseInAndSupplierOptions',
    'lPurchaseInAdditionalCostPreference',
    'lPurchaseInInfos',
    'lPurchaseInDetailInfo',
  ],
  endpoints: (builder) => ({
    getAllLPurchaseInNo: builder.query<
      ILPurchaseInNoComboBox[],
      { companyId: number; locationId: number; supplierId: number | null }
    >({
      query: ({ companyId, locationId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getAllLPurchaseInNo?${params.toString()}`;
      },
      providesTags: () => ['lPurchaseInOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getLPurchaseInNoAndSupplier: builder.query<
      ILPurchaseInNoAndSupplierOptions[],
      {
        companyId: number;
        locationId: number;
        lPurchaseInId: string | null;
        supplierId: number | null;
      }
    >({
      query: ({ companyId, locationId, lPurchaseInId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (lPurchaseInId)
          params.append('lPurchaseInId', String(lPurchaseInId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getLPurchaseInNoAndSupplier?${params.toString()}`;
      },
      providesTags: () => ['lPurchaseInAndSupplierOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getLPurchaseInByLPurchaseInId: builder.query<
      ILPurchaseIn,
      { lPurchaseInId: string; _ts?: number | null }
    >({
      query: ({ lPurchaseInId, _ts }) =>
        `getLPurchaseInByLPurchaseInId?LPurchaseInId=${lPurchaseInId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['lPurchaseIn'],
    }),

    getLPurchaseInAdditionalCostByLPurchaseInId: builder.query<
      ILPurchaseInAdditionalCost[],
      { lPurchaseInId: string; _ts?: number | null }
    >({
      query: ({ lPurchaseInId, _ts }) =>
        `getLPurchaseInAdditionalCostByLPurchaseInId?LPurchaseInId=${lPurchaseInId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['lPurchaseInAdditionalCost'],
    }),

    getSalesOrderAdditionalCostForLPurchaseIn: builder.query<
      ILPurchaseInAdditionalCost[],
      { firstEventNo: string; _ts?: number | null }
    >({
      query: ({ firstEventNo, _ts }) =>
        `getSalesOrderAdditionalCostForLPurchaseIn?firstEventNo=${firstEventNo}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['lPurchaseInAdditionalCostPreference'],
    }),

    getLPurchaseInInfo: builder.query<
      ILPurchaseInInfo[], //  what the hook returns
      { filter: IGetLPurchaseInInfoFilterDto | null }
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

        return `getLPurchaseInInfo${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },

      //  raw response is your C# Result<List<GetLPurchaseInInfoDto>>
      transformResponse: (response: IApiResult<ILPurchaseInInfo[]>) => {
        if (!response.succeeded) {
          // optional: treat as error instead of returning []
          throw new Error(
            response.messages?.[0] ?? 'Failed to load purchase info'
          );
        }

        const items = response.data ?? [];

        return items.map((item) => ({
          ...item,
          totalAmountWithoutPurchaseDiscount:
            (item.totalAmount || 0) + (item.purchaseDiscount || 0),
        }));
      },

      providesTags: () => ['lPurchaseInInfos'],
    }),

    // getLPurchaseInDetailByLPurchaseInIdCopy: builder.query<
    //   ILPurchaseInDetailInfo[],
    //   { lPurchaseInId: string }
    // >({
    //   query: ({ lPurchaseInId }) =>
    //     `getLPurchaseInDetailInfo?LPurchaseInId=${lPurchaseInId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['lPurchaseInDetailInfo'],
    // }),

    getLPurchaseInDetailByLPurchaseInIdCopy: builder.query<
      ILPurchaseInDetailInfo[], //  what the hook returns
      { lPurchaseInId: string }
    >({
      query: ({ lPurchaseInId }) =>
        `getLPurchaseInDetailInfo?LPurchaseInId=${lPurchaseInId}`,

      //  raw response is your C# Result<List<GetLPurchaseInInfoDto>>
      transformResponse: (response: IApiResult<ILPurchaseInDetailInfo[]>) => {
        if (!response.succeeded) {
          // optional: treat as error instead of returning []
          throw new Error(
            response.messages?.[0] ?? 'Failed to load purchaseInDetail info'
          );
        }

        const items = response.data ?? [];

        return items.map((item) => ({
          ...item,
        }));
      },

      providesTags: () => ['lPurchaseInDetailInfo'],
    }),

    processSaveLPurchaseIn: builder.mutation<
      ILPurchaseInNoComboBox, //  what the hook returns
      ILPurchaseInProcessCommandsVM //  what you pass in
    >({
      query: (objToProcess) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),

      //  raw response is Result<ILPurchaseInNoComboBox>
      transformResponse: (response: IApiResult<ILPurchaseInNoComboBox>) => {
        if (!response.succeeded) {
          // optional: you can also attach more info, e.g. code/messages
          throw new Error(
            response.messages?.[0] ?? 'Failed to save LPurchaseIn'
          );
        }

        return response.data; //  hook sees only the inner data
      },

      invalidatesTags: [
        'lPurchaseInOptions',
        'lPurchaseIn',
        'lPurchaseInAdditionalCost',
        'lPurchaseInDetailInfo',
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllLPurchaseInNoQuery,
  useLazyGetAllLPurchaseInNoQuery,
  useGetLPurchaseInNoAndSupplierQuery,
  useLazyGetLPurchaseInNoAndSupplierQuery,
  useGetLPurchaseInByLPurchaseInIdQuery,
  useLazyGetLPurchaseInByLPurchaseInIdQuery,
  useGetLPurchaseInAdditionalCostByLPurchaseInIdQuery,
  useGetSalesOrderAdditionalCostForLPurchaseInQuery,
  useLazyGetSalesOrderAdditionalCostForLPurchaseInQuery,
  useLazyGetLPurchaseInAdditionalCostByLPurchaseInIdQuery,
  useGetLPurchaseInInfoQuery,
  useLazyGetLPurchaseInInfoQuery,
  useGetLPurchaseInDetailByLPurchaseInIdCopyQuery,
  useLazyGetLPurchaseInDetailByLPurchaseInIdCopyQuery,
  useProcessSaveLPurchaseInMutation,
} = LPurchaseInApiSlice;
