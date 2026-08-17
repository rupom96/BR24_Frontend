/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ITransactionInfo,
  IVouchersOfTransactions,
} from '../../domain/interfaces/TransactionVouchersInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `BiznessEvent_PCTrack`;

// Define a service using a base URL and expected endpoints
export const TransactionAndCostingAmountApiSlice = createApi({
  reducerPath: 'TransactionAndCostingAmountApiSlice',
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
  tagTypes: ['TransactionAndCostingAmount'],
  endpoints: (builder) => ({
    // biznessEventName=PreImportIn&lcNo=RashedKamal1&companyId=1&locationId=2
    getTransactionNameByBiznessEventNameLCNo: builder.query<
      ITransactionInfo[],
      {
        biznessEventName: string;
        lcNo: string;
        companyId: number;
        locationId: number;
      }
    >({
      query: ({ biznessEventName, lcNo, companyId, locationId }) =>
        `getTransactionNameByBiznessEventNameLCNo?biznessEventName=${biznessEventName}&lcNo=${lcNo}&companyId=${companyId}&locationId=${locationId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['TransactionAndCostingAmount'],
      transformResponse: (rawData: ITransactionInfo[]) => {
        const transformedData = rawData.map((item) => {
          item.costingAmount =
            item.costingAmount && parseFloat(item.costingAmount.toFixed(2));
          return item;
        });
        return transformedData;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTransactionNameByBiznessEventNameLCNoQuery } =
  TransactionAndCostingAmountApiSlice;
