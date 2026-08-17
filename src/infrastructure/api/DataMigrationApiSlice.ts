/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

import {
  ICreateSDEConfigurationCommand,
  IProcessSDEConfigurationCommand,
  ISDEConfiguration,
  ISDElog,
} from '../../domain/interfaces/SDEConfigurationInterface';
// import { IDataMigrationAdditionalCost } from '../../domain/interfaces/DataMigrationAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `DataMigration`;

// Define a service using a base URL and expected endpoints
export const DataMigrationApiSlice = createApi({
  reducerPath: 'DataMigrationApi',
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
  tagTypes: ['dataMigrationInfo', 'currentSDEConfig', 'SDELogAutocomp'],
  endpoints: (builder) => ({
    getSDEConfig: builder.query<
      ISDEConfiguration,
      {
        companyId: number;
        biznessEventId: number;
      }
    >({
      query: ({ companyId, biznessEventId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('biznessEventId', String(biznessEventId)); // Include only if non-null and non-zero

        // if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        return `getSDE_Configuration?${params.toString()}`;
      },
      providesTags: () => ['currentSDEConfig'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getSdeLog: builder.query<
      ISDElog[],
      {
        companyId: number;
        biznessEventId?: number;
        userId: number;
      }
    >({
      query: ({ companyId, biznessEventId, userId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        if (biznessEventId)
          params.append('biznessEventId', String(biznessEventId)); // Include only if non-null and non-zero
        params.append('userId', String(userId)); // Include only if non-null and non-zero

        return `getSDE_Log?${params.toString()}`;
      },
      providesTags: () => ['SDELogAutocomp'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    // processDataImport: builder.query<
    //   unknown,
    //   {
    //     companyId: number;
    //     biznessEventId: number;
    //     toDate: string;
    //     fromDate: string;
    //   }
    // >({
    //   query: ({ companyId, biznessEventId, toDate, fromDate }) => {
    //     const params = new URLSearchParams();
    //     params.append('companyId', String(companyId)); // Include only if non-null and non-zero
    //     params.append('biznessEventId', String(biznessEventId)); // Include only if non-null and non-zero
    //     params.append('toDate', toDate); // Include only if non-null and non-zero
    //     params.append('fromDate', fromDate); // Include only if non-null and non-zero

    //     console.log('Hello from API SLice');
    //     console.log(toDate);
    //     console.log(fromDate);

    //     // if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
    //     return `processDataImport?${params.toString()}`;
    //   },
    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),

    processDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processPurchaseDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processLPurchaseInDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processSalesReturnDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processSalesReturnDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processPurchaseReturnDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processPurchaseReturnDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processCollectionDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processCollectionDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processPaymentDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processPaymentDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processVoucherDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processVoucherDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processImportLCDataImport: builder.mutation<
      // special kind of rtk xD, karon saiful vai banaisen get query, ami treat kortesi POST query hishebe
      unknown,
      {
        companyId: number;
        biznessEventId: number;
        toDate: string;
        fromDate: string;
      }
    >({
      query: ({ companyId, biznessEventId, toDate, fromDate }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId));
        params.append('biznessEventId', String(biznessEventId));
        params.append('toDate', toDate);
        params.append('fromDate', fromDate);

        return {
          url: `processImportInDataImport?${params.toString()}`,
          method: 'GET', // yes,though, it is a mutation kind of RTK, but in backend, it is a GET query
        };
      },
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processSDEConfiguration: builder.mutation<
      unknown,
      IProcessSDEConfigurationCommand
    >({
      query: (objToProcess) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['dataMigrationInfo', 'currentSDEConfig'],
    }),
    processSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedSalesOrders',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processPurchaseSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedLPurchaseIns',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),
    processSalesReturnSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedSalesReturns',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),
    processPurchaseReturnSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedPurchaseReturns',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),
    processCollectionSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedCollections',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),
    processPaymentSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedPayments',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),
    processVoucherSDELogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedVouchers',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),

    processImportLCLogRevert: builder.mutation<unknown, ISDElog>({
      query: (objToProcess) => ({
        url: 'deletePreviousImportedImportIns',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['SDELogAutocomp'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useProcessSDEConfigurationMutation,
  // useProcessDataImportQuery,
  // useLazyProcessDataImportQuery,
  useProcessDataImportMutation,
  useProcessPurchaseDataImportMutation,
  useProcessPurchaseReturnDataImportMutation,
  useProcessSalesReturnDataImportMutation,
  useProcessCollectionDataImportMutation,
  useProcessPaymentDataImportMutation,
  useProcessVoucherDataImportMutation,
  useProcessImportLCDataImportMutation,
  useProcessSDELogRevertMutation,
  useProcessSalesReturnSDELogRevertMutation,
  useProcessPurchaseSDELogRevertMutation,
  useProcessPurchaseReturnSDELogRevertMutation,
  useProcessCollectionSDELogRevertMutation,
  useProcessPaymentSDELogRevertMutation,
  useProcessVoucherSDELogRevertMutation,
  useProcessImportLCLogRevertMutation,
  useGetSDEConfigQuery,
  useLazyGetSDEConfigQuery,
  useGetSdeLogQuery,
  useLazyGetSdeLogQuery,
} = DataMigrationApiSlice;
