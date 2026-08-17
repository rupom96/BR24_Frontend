/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IGetSalesOrderInfoFilterDto,
  ISalesOrder,
  ISalesOrderAdditionalCost,
  ISalesOrderAndBuyerOptions,
  ISalesOrderDetail,
  ISalesOrderDetailInfo,
  ISalesOrderInfo,
  ISalesOrderNoComboBox,
  ISalesOrderProcessCommandsVM,
} from '../../domain/interfaces/SalesOrderInterface';
// import { ISalesOrderAdditionalCost } from '../../domain/interfaces/SalesOrderAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `SalesOrder`;

// Define a service using a base URL and expected endpoints
export const SalesOrderApiSlice = createApi({
  reducerPath: 'SalesOrderApi',
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
    'salesOrderOptions',
    'salesOrder',
    'salesOrderDetail',
    'salesOrderAdditionalCost',
    'salesOrderAndBuyerOptions',
    'salesOrderInfos',
    'salesOrderDetailInfo',
  ],
  endpoints: (builder) => ({
    getAllSalesOrderNo: builder.query<
      ISalesOrderNoComboBox[],
      { companyId: number; locationId: number; buyerId: number | null }
    >({
      query: ({ companyId, locationId, buyerId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        return `getAllSalesOrderNo?${params.toString()}`;
      },
      providesTags: () => ['salesOrderOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    // getSalesOrderInfo: builder.query<
    //   ISalesOrderInfo[],
    //   { filter: IGetSalesOrderInfoFilterDto | null }
    // >({
    //   query: ({ filter }) => {
    //     const params = new URLSearchParams();

    //     if (filter && Object.keys(filter).length > 0)
    //       params.append('filter', JSON.stringify(filter)); // Include only if non-null and non-zero
    //     return `getSalesOrderInfo${
    //       params.toString() ? `?${params.toString()}` : ''
    //     }`;
    //   },
    //   providesTags: () => ['salesOrderInfos'], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),
    getSalesOrderInfo: builder.query<
      ISalesOrderInfo[],
      { filter: IGetSalesOrderInfoFilterDto | null }
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

        return `getSalesOrderInfo${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },
      transformResponse: (response: ISalesOrderInfo[]) => {
        return response.map((item) => ({
          ...item,
          totalAmountWithoutInvoiceDiscount:
            (item.totalAmount || 0) + (item.invoiceDiscount || 0),
        }));
      },
      providesTags: () => ['salesOrderInfos'],
    }),

    getSalesOrderNoAndBuyer: builder.query<
      ISalesOrderAndBuyerOptions[],
      {
        companyId: number;
        locationId: number;
        salesOrderId: string | null;
        buyerId: number | null;
      }
    >({
      query: ({ companyId, locationId, salesOrderId, buyerId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (salesOrderId) params.append('salesOrderId', String(salesOrderId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        return `getSalesOrderNoAndBuyer?${params.toString()}`;
      },
      providesTags: () => ['salesOrderAndBuyerOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getSalesOrderBySalesOrderId: builder.query<
      ISalesOrder,
      { salesOrderId: string }
    >({
      query: ({ salesOrderId }) =>
        `getSalesOrderBySalesOrderId?SalesOrderId=${salesOrderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['salesOrder'],
    }),

    getSalesOrderDetailBySalesOrderId: builder.query<
      ISalesOrderDetail[],
      { salesOrderId: string }
    >({
      query: ({ salesOrderId }) =>
        `getSalesOrderDetailBySalesOrderId?SalesOrderId=${salesOrderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['salesOrderDetail'],
    }),

    getSalesOrderDetailBySalesOrderIdCopy: builder.query<
      ISalesOrderDetailInfo[],
      { salesOrderId: string }
    >({
      query: ({ salesOrderId }) =>
        `getSalesOrderDetailInfo?SalesOrderId=${salesOrderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['salesOrderDetailInfo'],
    }),

    getSalesOrderAdditionalCostBySalesOrderId: builder.query<
      ISalesOrderAdditionalCost[],
      { salesOrderId: string }
    >({
      query: ({ salesOrderId }) =>
        `getSalesOrderAdditionalCostBySalesOrderId?SalesOrderId=${salesOrderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['salesOrderAdditionalCost'],
    }),

    processSaveSalesOrder: builder.mutation<
      ISalesOrderNoComboBox,
      ISalesOrderProcessCommandsVM
    >({
      query: (objToProcess: ISalesOrderProcessCommandsVM) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'salesOrderOptions',
        'salesOrder',
        'salesOrderInfos',
        'salesOrderDetailInfo',
        'salesOrderDetail',
        'salesOrderAdditionalCost',
      ],
    }),

    // getSalesOrderInfo: builder.query<
    //   ISalesOrderInfo[],
    //   { filter: IGetSalesOrderInfoFilterDto | null }
    // >({
    //   query: ({ filter }) => {
    //     const params = new URLSearchParams();

    //     if (filter && Object.keys(filter).length > 0)
    //       params.append('filter', JSON.stringify(filter)); // Include only if non-null and non-zero
    //     return `getSalesOrderInfo${
    //       params.toString() ? `?${params.toString()}` : ''
    //     }`;
    //   },
    //   providesTags: () => ['salesOrderInfos'], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllSalesOrderNoQuery,
  useGetSalesOrderNoAndBuyerQuery,
  useLazyGetSalesOrderNoAndBuyerQuery,
  useLazyGetAllSalesOrderNoQuery,
  useGetSalesOrderBySalesOrderIdQuery,
  useLazyGetSalesOrderBySalesOrderIdQuery,
  useGetSalesOrderDetailBySalesOrderIdQuery,
  useLazyGetSalesOrderDetailBySalesOrderIdQuery,
  useGetSalesOrderAdditionalCostBySalesOrderIdQuery,
  useLazyGetSalesOrderAdditionalCostBySalesOrderIdQuery,
  useProcessSaveSalesOrderMutation,
  useGetSalesOrderInfoQuery,
  useLazyGetSalesOrderInfoQuery,
  useGetSalesOrderDetailBySalesOrderIdCopyQuery,
  useLazyGetSalesOrderDetailBySalesOrderIdCopyQuery,
} = SalesOrderApiSlice;
