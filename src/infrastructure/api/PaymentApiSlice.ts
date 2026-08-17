/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IChequeDetailPaymentInfo,
  IPaymentInfo,
  IPaymentModeAllLocationComboBox,
  IPaymentModeComboBox,
  IPaymentNoComboBox,
  IPaymentProcessCommandsVM,
  IGetPaymentInfoFilterDto,
} from '../../domain/interfaces/PaymentInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';

// import { ISalesOrderAdditionalCost } from '../../domain/interfaces/SalesOrderAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Payment`;

// Define a service using a base URL and expected endpoints
export const PaymentApiSlice = createApi({
  reducerPath: 'PaymentApi',
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
    'paymentOptions',
    'chequeDetailPayment',
    'paymentInfos',
    'chequeDetailPaymentInfos',
  ],
  endpoints: (builder) => ({
    getAllPaymentNo: builder.query<
      IPaymentNoComboBox[],
      { companyId: number; locationId: number; supplierId: number | null }
    >({
      query: ({ companyId, locationId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getAllPaymentNo?${params.toString()}`;
      },
      providesTags: () => ['paymentOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getPaymentInfo: builder.query<
      IPaymentInfo[],
      {
        filter: IGetPaymentInfoFilterDto | null;
        biznessEventId: number;
        companyId: number;
        userId: number;
      }
    >({
      query: ({ filter, biznessEventId, companyId, userId }) => {
        const params = new URLSearchParams();

        // Add filter values
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              params.append(key, value.toString());
            }
          });
        }

        // Add required params
        params.append('biznessEventId', biznessEventId.toString());
        params.append('companyId', companyId.toString());
        params.append('userId', userId.toString());

        return `getPaymentInfo?${params.toString()}`;
      },

      //  unwrap Result<IPaymentInfo[]>
      transformResponse: (response: IApiResult<IPaymentInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load payment info'
          );
        }

        return response.data ?? [];
      },

      providesTags: () => ['paymentInfos'],
    }),

    getChequeDetailPaymentByPaymentId: builder.query<
      IChequeDetailPaymentInfo[],
      {
        paymentId: string;
        biznessEventId: number;
        companyId: number;
        userId: number;
      }
    >({
      query: ({ paymentId, biznessEventId, companyId, userId }) => {
        const params = new URLSearchParams();

        params.append('paymentId', paymentId);
        params.append('biznessEventId', biznessEventId.toString());
        params.append('companyId', companyId.toString());
        params.append('userId', userId.toString());

        return `getChequeDetailPaymentInfo?${params.toString()}`;
      },

      transformResponse: (response: IApiResult<IChequeDetailPaymentInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load cheque details'
          );
        }

        const data = response.data ?? [];

        //  Apply transformation: convert null → 'F'
        return data.map((item) => ({
          ...item,
          cqdCollected: item.cqdCollected ?? 'F',
        }));
      },

      providesTags: () => ['chequeDetailPaymentInfos'],
    }),

    // getPaymentMode: builder.query<
    //   IPaymentModeComboBox[],
    //   { companyId: number; locationId: number }
    // >({
    //   query: ({ companyId, locationId }) =>
    //     `getPaymentMode?companyId=${companyId}&locationId=${locationId}`,

    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),

    // getPaymentModeOfAllLocation: builder.query<
    //   IPaymentModeAllLocationComboBox[],
    //   { companyId: number }
    // >({
    //   query: ({ companyId }) =>
    //     `getPaymentModeForAllLocation?companyId=${companyId}`,
    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),

    processSavePayment: builder.mutation<
      IPaymentNoComboBox, // what the hook returns
      IPaymentProcessCommandsVM // what you pass in
    >({
      query: (objToProcess) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),

      //  API returns IApiResult<IPaymentNoComboBox>
      transformResponse: (response: IApiResult<IPaymentNoComboBox>) => {
        if (!response.succeeded) {
          throw new Error(response.messages?.[0] ?? 'Failed to save payment');
        }

        return response.data; //  hook only sees IPaymentNoComboBox
      },

      invalidatesTags: [
        'paymentOptions',
        'paymentInfos',
        'chequeDetailPaymentInfos',
        'chequeDetailPayment',
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useProcessSavePaymentMutation,
  useGetPaymentInfoQuery,
  useLazyGetPaymentInfoQuery,
  useGetChequeDetailPaymentByPaymentIdQuery,
  useLazyGetChequeDetailPaymentByPaymentIdQuery,
  useGetAllPaymentNoQuery,
  // useGetPaymentModeOfAllLocationQuery,
  // useGetPaymentModeQuery,
  useLazyGetAllPaymentNoQuery,
  // useLazyGetPaymentModeOfAllLocationQuery,
  // useLazyGetPaymentModeQuery,
} = PaymentApiSlice;
