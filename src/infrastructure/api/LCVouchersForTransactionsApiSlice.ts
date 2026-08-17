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
export const LCVouchersForTransactionsApiSlice = createApi({
  reducerPath: 'LCVouchersForTransactionsApiSlice',
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
  tagTypes: ['LCVouchersForTransactions'],
  endpoints: (builder) => ({
    // biznessEventName=PreImportIn&lcNo=RashedKamal1&companyId=1&locationId=2
    getVoucherByTransactionName: builder.query<
      ITransactionInfo[],
      {
        biznessEventName: string;
        lcNo: string;
        companyId: number;
        locationId: number;
      }
    >({
      query: ({ biznessEventName, lcNo, companyId, locationId }) =>
        `getVoucherByTransactionName?biznessEventName=${biznessEventName}&lcNo=${lcNo}&companyId=${companyId}&locationId=${locationId}`,
      transformResponse: (rawData: ITransactionInfo[]) => {
        const transformedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // hour12: true,
          };

          // ----[voucher creation date]--------------------------------

          let dateFormattedVoucherDate: string | undefined = '';

          if (item.voucherDate) {
            const tempDateJs = new Date(item.voucherDate);
            dateFormattedVoucherDate = tempDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }

          item.voucherDate = dateFormattedVoucherDate;

          // ----[approved date]--------------------------------
          let dateFormattedApprovedDate: string | undefined = '';

          if (item.approvedDate) {
            const tempDateJs = new Date(item.approvedDate);
            dateFormattedApprovedDate = tempDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          item.approvedDate = dateFormattedApprovedDate;

          // ----[posted date]--------------------------------
          let dateFormattedPostedDate: string | undefined = '';

          if (item.postingDate) {
            const tempDateJs = new Date(item.postingDate);
            dateFormattedPostedDate = tempDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          item.postingDate = dateFormattedPostedDate;

          item.postedAmount =
            item.postedAmount && parseFloat(item.postedAmount.toFixed(2));

          return item;
        });
        return transformedData;
      },
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      //   providesTags: ['LCVouchersForTransactions'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVoucherByTransactionNameQuery } =
  LCVouchersForTransactionsApiSlice;
