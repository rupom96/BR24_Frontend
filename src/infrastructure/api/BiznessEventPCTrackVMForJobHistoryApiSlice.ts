import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBiznessEventPCTrackVM } from '../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IChain,
  IEventNo,
  IFirstEventNo,
  IPaginatedChainFlowChart,
} from '../../domain/interfaces/ChainDataInterface';
import {
  IElementPermissionStatus,
  IProductGroupAndBrandByProductId,
} from '../../domain/interfaces/ElementPermissionStatusInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';

const controllerName: string = `BiznessEvent_PCTrack`;
const API_BASE_URL = window.API_BASE_URL;
// Define a service using a base URL and expected endpoints
export const BiznessEventPCTrackVMForJobHistoryApiSlice = createApi({
  reducerPath: 'BiznessEventPCTrackVMApi',
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
    'BiznessEventPCTrackVMForJobHistory',
    'ChainFlowChartData',
    'FirstEventNoData',
    'EventNoData',
    'ElementPermissionStatus',
    'ProductGroupAndBrand',
  ],
  endpoints: (builder) => ({
    getBiznessEventPCTrackVMForJobHistoryByFirstEventNo: builder.query<
      IBiznessEventPCTrackVM[],
      { firstEventNo: string }
    >({
      query: ({ firstEventNo }) =>
        `getByFirstEventNo?firstEventNo=${firstEventNo}&type=JobHistory`,

      transformResponse: (rawData: IBiznessEventPCTrackVM[]) => {
        console.log('Job History---> Business Event PC Track VM');
        console.log(rawData);

        const transformedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          };
          const startDateTimeString = item.startDate;
          const endDateTimeString = item.endDate;
          let startFormattedDateTime;
          let endFormattedDateTime;
          if (endDateTimeString) {
            const endDateJs = new Date(endDateTimeString);
            endFormattedDateTime = endDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          if (startDateTimeString) {
            const endDateJs = new Date(startDateTimeString);
            startFormattedDateTime = endDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          return {
            ...item,
            endDate: endDateTimeString
              ? endFormattedDateTime
              : endDateTimeString,
          };
        });
        return transformedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventPCTrackVMForJobHistory'],
    }),
    getChainFlowChart: builder.query<
      IPaginatedChainFlowChart,
      {
        firstEventNo?: string | null;
        eventNo?: string | null;
        fixedTaskTemplateId?: number | null;
        sequenceNo?: number | null;
        deniedFilter?: 'all' | 'enabled' | 'denied' | null;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: ({
        firstEventNo,
        eventNo,
        fixedTaskTemplateId,
        sequenceNo,
        deniedFilter,
        pageNumber = 1,
        pageSize = 10,
      }) => {
        const params = new URLSearchParams();
        params.append('fixedTaskTemplateId', String(fixedTaskTemplateId || 0));
        params.append('pageNumber', String(pageNumber));
        params.append('pageSize', String(pageSize));
        if (firstEventNo) params.append('firstEventNo', String(firstEventNo));
        if (eventNo) params.append('eventNo', String(eventNo));
        if (sequenceNo) params.append('sequenceNo', String(sequenceNo));
        if (deniedFilter && deniedFilter !== 'all') {
          params.append('deniedFilter', deniedFilter);
        }
        return `getChainFlowChart?${params.toString()}`;
      },
      providesTags: ['ChainFlowChartData'],
    }),
    getAllFirstEventNo: builder.query<
      IFirstEventNo[],
      { eventNo?: string | null; fixedTaskTemplateId?: number | null }
    >({
      query: ({ fixedTaskTemplateId, eventNo }) => {
        const params = new URLSearchParams();
        params.append('fixedTaskTemplateId', String(fixedTaskTemplateId || 0)); // Include only if non-null and non-zero
        if (eventNo) params.append('eventNo', String(eventNo)); // Include only if non-null and non-zero
        return `getAllFirstEventNo?${params.toString()}`;
      },
      providesTags: ['FirstEventNoData'],
    }),
    getAllEventNo: builder.query<
      IEventNo[],
      { firstEventNo?: string | null; fixedTaskTemplateId?: number | null }
    >({
      query: ({ fixedTaskTemplateId, firstEventNo }) => {
        const params = new URLSearchParams();
        params.append('fixedTaskTemplateId', String(fixedTaskTemplateId || 0)); // Include only if non-null and non-zero
        if (firstEventNo) params.append('firstEventNo', String(firstEventNo));
        return `getAllEventNo?${params.toString()}`;
      },
      providesTags: ['EventNoData'],
    }),
    getElementPermissionStatusByEvent: builder.query<
      IElementPermissionStatus[],
      {
        eventNo: string;
        firstEventNo: string;
        sequence: number;
        biznessEventProcessConfigurationId: number;
        companyId: number;
      }
    >({
      query: ({
        eventNo,
        firstEventNo,
        sequence,
        biznessEventProcessConfigurationId,
        companyId,
      }) => {
        const params = new URLSearchParams();
        params.append('eventNo', eventNo);
        params.append('firstEventNo', firstEventNo);
        params.append('sequence', String(sequence));
        params.append(
          'biznessEventProcessConfigurationId',
          String(biznessEventProcessConfigurationId)
        );
        params.append('companyId', String(companyId));
        return `getElementPermissionStatusByEvent?${params.toString()}`;
      },
      providesTags: ['ElementPermissionStatus'],
    }),
    getProductGroupAndBrandByProductId: builder.query<
      IProductGroupAndBrandByProductId,
      { productId: number }
    >({
      query: ({ productId }) =>
        `getProductGroupAndBrandByProductId?productId=${productId}`,
      providesTags: ['ProductGroupAndBrand'],
    }),
    clearDenied: builder.mutation<
      IApiResult<string>,
      { biznessEventPCTrackIds: number[] }
    >({
      query: (body) => ({
        url: 'clearDenied',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ChainFlowChartData'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBiznessEventPCTrackVMForJobHistoryByFirstEventNoQuery,
  useLazyGetBiznessEventPCTrackVMForJobHistoryByFirstEventNoQuery,
  useGetChainFlowChartQuery,
  useLazyGetChainFlowChartQuery,
  useGetAllEventNoQuery,
  useGetAllFirstEventNoQuery,
  useLazyGetAllEventNoQuery,
  useLazyGetAllFirstEventNoQuery,
  useLazyGetElementPermissionStatusByEventQuery,
  useLazyGetProductGroupAndBrandByProductIdQuery,
  useClearDeniedMutation,
} = BiznessEventPCTrackVMForJobHistoryApiSlice;
