/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IGetImportInInfoFilterDto,
  IGetImportInLCNoOptionsFilterDto,
  IImportIn,
  // IImportInAdditionalCost,
  IImportInDetailInfo,
  IImportInInfo,
  IImportInNoAndSupplierOptions,
  IImportInNoComboBox,
  IImportInProcessCommandsVM,
} from '../../domain/interfaces/ImportInInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';
import { ILCNoComboBox } from '../../domain/interfaces/LCNoComboBoxInterface';
import { IPreImportInProduct } from '../../domain/interfaces/ProductInterfaces';

// import { IImportInAdditionalCost } from '../../domain/interfaces/ImportInAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `ImportIn`;

// Define a service using a base URL and expected endpoints
export const ImportInApiSlice = createApi({
  reducerPath: 'ImportInApi',
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
    'importInOptions',
    'importIn',
    'importInAdditionalCost',
    'importInAndSupplierOptions',
    'importInAdditionalCostPreference',
    'importInInfos',
    'importInDetailInfo',
    'importInLCNoOptions',
    'preImportInProductOptions',
  ],
  endpoints: (builder) => ({
    getAllImportInNo: builder.query<
      IImportInNoComboBox[],
      { companyId: number; locationId: number; supplierId: number | null }
    >({
      query: ({ companyId, locationId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getAllImportInNo?${params.toString()}`;
      },
      providesTags: () => ['importInOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getImportInNoAndSupplier: builder.query<
      IImportInNoAndSupplierOptions[],
      {
        companyId: number;
        locationId: number;
        importInId: string | null;
        supplierId: number | null;
      }
    >({
      query: ({ companyId, locationId, importInId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (importInId) params.append('importInId', String(importInId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getImportInNoAndSupplier?${params.toString()}`;
      },
      providesTags: () => ['importInAndSupplierOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getImportInByImportInId: builder.query<
      IImportIn,
      { importInId: string; _ts?: number | null }
    >({
      query: ({ importInId, _ts }) =>
        `getImportInByImportInId?ImportInId=${importInId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['importIn'],
    }),

    // getImportInAdditionalCostByImportInId: builder.query<
    //   IImportInAdditionalCost[],
    //   { importInId: string; _ts?: number | null }
    // >({
    //   query: ({ importInId, _ts }) =>
    //     `getImportInAdditionalCostByImportInId?ImportInId=${importInId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['importInAdditionalCost'],
    // }),

    // getSalesOrderAdditionalCostForImportIn: builder.query<
    //   IImportInAdditionalCost[],
    //   { firstEventNo: string; _ts?: number | null }
    // >({
    //   query: ({ firstEventNo, _ts }) =>
    //     `getSalesOrderAdditionalCostForImportIn?firstEventNo=${firstEventNo}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['importInAdditionalCostPreference'],
    // }),

    getImportInInfo: builder.query<
      IImportInInfo[], //  what the hook returns
      { filter: IGetImportInInfoFilterDto | null }
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

        return `getImportInInfo${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },

      //  raw response is your C# Result<List<GetImportInInfoDto>>
      transformResponse: (response: IApiResult<IImportInInfo[]>) => {
        if (!response.succeeded) {
          // optional: treat as error instead of returning []
          throw new Error(
            response.messages?.[0] ?? 'Failed to load import in info'
          );
        }

        const items = response.data ?? [];

        return items;

        // return items.map((item) => ({
        //   ...item,
        //   totalAmountWithoutPurchaseDiscount:
        //     (item.totalAmount || 0) + (item.purchaseDiscount || 0),
        // }));
      },

      providesTags: () => ['importInInfos'],
    }),

    // getImportInDetailByImportInIdCopy: builder.query<
    //   IImportInDetailInfo[],
    //   { importInId: string }
    // >({
    //   query: ({ importInId }) =>
    //     `getImportInDetailInfo?ImportInId=${importInId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['importInDetailInfo'],
    // }),

    getImportInDetailByImportInIdCopy: builder.query<
      IImportInDetailInfo[], //  what the hook returns
      { importInId: string; lcNo: string }
    >({
      query: ({ importInId, lcNo }) =>
        `getImportInDetailInfo?importInId=${importInId}&lcNo=${lcNo}`,

      //  raw response is your C# Result<List<GetImportInInfoDto>>
      transformResponse: (response: IApiResult<IImportInDetailInfo[]>) => {
        if (!response.succeeded) {
          // optional: treat as error instead of returning []
          throw new Error(
            response.messages?.[0] ?? 'Failed to load Import In Detail info'
          );
        }

        const items = response.data ?? [];

        return items.map((item) => ({
          ...item,
        }));
      },

      providesTags: () => ['importInDetailInfo'],
    }),

    getImportInLCNo: builder.query<
      ILCNoComboBox[], //  what the hook returns
      { filter: IGetImportInLCNoOptionsFilterDto | null }
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

        return `getImportInLCNo${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },
      //  raw response is your C# Result<List<GetImportInInfoDto>>
      transformResponse: (response: IApiResult<ILCNoComboBox[]>) => {
        if (!response.succeeded) {
          // optional: treat as error instead of returning []
          throw new Error(
            response.messages?.[0] ?? 'Failed to load LC No options'
          );
        }

        const items = response.data ?? [];

        return items;

        // return items.map((item) => ({
        //   ...item,
        //   totalAmountWithoutPurchaseDiscount:
        //     (item.totalAmount || 0) + (item.purchaseDiscount || 0),
        // }));
      },

      providesTags: () => ['importInLCNoOptions'],
    }),

    getPreImportInProduct: builder.query<
      IPreImportInProduct[],
      { importInId: number; lcNo: string }
    >({
      query: ({ importInId, lcNo }) => {
        const params = new URLSearchParams();
        params.append('importInId', String(importInId)); // Include only if non-null and non-zero
        params.append('lcNo', String(lcNo)); // Include only if non-null and non-zero
        // if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getPreImportInProduct?${params.toString()}`;
      },
      providesTags: () => ['preImportInProductOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    processSaveImportIn: builder.mutation<
      IImportInNoComboBox, //  what the hook returns
      IImportInProcessCommandsVM //  what you pass in
    >({
      query: (objToProcess) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),

      //  raw response is Result<IImportInNoComboBox>
      transformResponse: (response: IApiResult<IImportInNoComboBox>) => {
        if (!response.succeeded) {
          // optional: you can also attach more info, e.g. code/messages
          throw new Error(response.messages?.[0] ?? 'Failed to save ImportIn');
        }

        return response.data; //  hook sees only the inner data
      },

      invalidatesTags: [
        'importInOptions',
        'importIn',
        'importInAdditionalCost',
        'importInDetailInfo',
        'importInInfos',
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllImportInNoQuery,
  useLazyGetAllImportInNoQuery,
  useGetImportInNoAndSupplierQuery,
  useLazyGetImportInNoAndSupplierQuery,
  useGetImportInByImportInIdQuery,
  useLazyGetImportInByImportInIdQuery,
  // useGetImportInAdditionalCostByImportInIdQuery,
  // useGetSalesOrderAdditionalCostForImportInQuery,
  // useLazyGetSalesOrderAdditionalCostForImportInQuery,
  // useLazyGetImportInAdditionalCostByImportInIdQuery,
  useGetImportInInfoQuery,
  useLazyGetImportInInfoQuery,
  useGetImportInDetailByImportInIdCopyQuery,
  useLazyGetImportInDetailByImportInIdCopyQuery,
  useGetImportInLCNoQuery,
  useLazyGetImportInLCNoQuery,
  useGetPreImportInProductQuery,
  useLazyGetPreImportInProductQuery,
  useProcessSaveImportInMutation,
} = ImportInApiSlice;
