/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IBuyerWiseCommissionAchievement,
  IProcessBuyerWiseCommissionAchievement,
} from '../../domain/interfaces/BuyerWiseCommissionAchievement';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `BuyerWiseCommissionAchievement`;

// Define a service using a base URL and expected endpoints
export const CommissionApiSlice = createApi({
  reducerPath: 'CommissionApi',
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
  tagTypes: ['commissionGridInfo'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getCommissionGrid: builder.query<
      IBuyerWiseCommissionAchievement[],
      {
        companyId: number;
        commissionMonthYear: string;
        extendedDate?: string | null;
        commissionOn: string;
        previewOption: string;
      }
    >({
      query: ({
        companyId,
        commissionMonthYear,
        extendedDate,
        commissionOn,
        previewOption,
      }) => {
        const params = new URLSearchParams();
        params.append('commissionMonthYear', String(commissionMonthYear)); // Include only if non-null and non-zero
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('commissionOn', String(commissionOn)); // Include only if non-null and non-zero
        params.append('previewOption', String(previewOption)); // Include only if non-null and non-zero
        if (extendedDate)
          params.append('extendedCommissionDate', String(extendedDate)); // Include only if non-null and non-zero
        return `getBuyerWiseCommissionAchievement?${params.toString()}`;
      },

      transformResponse: (rawData: IBuyerWiseCommissionAchievement[]) => {
        const transformedData = rawData.map((item) => {
          return {
            ...item,
            lastProcessedDate: item?.lastProcessedDate
              ? dayjs(item.lastProcessedDate).format('DD MMMM, YYYY')
              : '',
          };
        });
        return transformedData;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['commissionGridInfo'],
    }),

    processBuyerWiseCommissionAchievement: builder.mutation<
      unknown,
      IProcessBuyerWiseCommissionAchievement
    >({
      query: (objToSave) => ({
        url: 'process', // `${API_BASE_URL}/costSheetDetail/process`,
        method: 'POST',
        body: objToSave,
      }),
      invalidatesTags: ['commissionGridInfo'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCommissionGridQuery,
  useLazyGetCommissionGridQuery,
  useProcessBuyerWiseCommissionAchievementMutation,
} = CommissionApiSlice;
