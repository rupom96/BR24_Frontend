import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILCNoComboBox } from '../../domain/interfaces/LCNoComboBoxInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IEventNoComboBox } from '../../domain/interfaces/EventNoComboBoxInterface';
import {
  IUserBrand,
  IUserProduct,
  IUserProductGroup,
} from '../../domain/interfaces/ProductInterfaces';
import {
  ICurrentStockPreviewRow,
  IGetCurrentStockPreviewFilterDto,
} from '../../domain/interfaces/CurrentStockPreviewInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Reporting`;

// Define a service using a base URL and expected endpoints
export const ReportingApiSlice = createApi({
  reducerPath: 'ReportingApiSlice',
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
  tagTypes: ['monthlyIncentiveReportData'],
  endpoints: (builder) => ({
    getMonthlyIncentiveReportQuery: builder.query<
      any,
      {
        regionMasterId: number;
        regionId: number;
        divisionId: number;
        districtId: number;
        areaId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        groupIndicator: string;
        groupIndicatorValue: string;
      }
    >({
      query: ({
        regionMasterId,
        regionId,
        divisionId,
        districtId,
        areaId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        groupIndicator,
        groupIndicatorValue,
      }) =>
        `getMonthlyIncentiveReportQuery?regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}&areaId=${areaId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&groupIndicator=${groupIndicator}&groupIndicatorValue=${groupIndicatorValue}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['monthlyIncentiveReportData'],
    }),

    getMonthlySalesAndTargetProductWiseReportQuery: builder.query<
      any,
      {
        regionMasterId: number;
        regionId: number;
        divisionId: number;
        districtId: number;
        areaId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        groupIndicator: string;
        groupIndicatorValue: string;
        reportType?: string;
      }
    >({
      query: ({
        regionMasterId,
        regionId,
        divisionId,
        districtId,
        areaId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        groupIndicator,
        groupIndicatorValue,
        reportType,
      }) =>
        `getProductGroupWiseMonthlySalesAndTargetReportQuery?regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}&areaId=${areaId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&groupIndicator=${groupIndicator}&groupIndicatorValue=${groupIndicatorValue}&reportType=${reportType}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['monthlyIncentiveReportData'],
    }),

    getProductGroupWiseDailySalesReportQuery: builder.query<
      any,
      {
        regionMasterId: number;
        regionId: number;
        divisionId: number;
        districtId: number;
        areaId: number;
        fromDate: string;
        toDate: string;
        groupIndicator: string;
        groupIndicatorValue: string;
      }
    >({
      query: ({
        regionMasterId,
        regionId,
        divisionId,
        districtId,
        areaId,
        fromDate,
        toDate,
        groupIndicator,
        groupIndicatorValue,
      }) =>
        `getProductGroupWiseDailySalesReportQuery?regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}&areaId=${areaId}&fromDate=${fromDate}&toDate=${toDate}&groupIndicator=${groupIndicator}&groupIndicatorValue=${groupIndicatorValue}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['monthlyIncentiveReportData'],
    }),

    getProductGroupMpoWiseDailySalesReportQuery: builder.query<
      any,
      {
        regionMasterId: number;
        regionId: number;
        divisionId: number;
        districtId: number;
        areaId: number;
        fromDate: string;
        toDate: string;
        groupIndicator: string;
        groupIndicatorValue: string;
      }
    >({
      query: ({
        regionMasterId,
        regionId,
        divisionId,
        districtId,
        areaId,
        fromDate,
        toDate,
        groupIndicator,
        groupIndicatorValue,
      }) =>
        `getProductGroupMpoWiseDailySalesReportQuery?regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}&areaId=${areaId}&fromDate=${fromDate}&toDate=${toDate}&groupIndicator=${groupIndicator}&groupIndicatorValue=${groupIndicatorValue}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['monthlyIncentiveReportData'],
    }),

    // /api/CustomQuery/getDynamicReportFrontendElements
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMonthlyIncentiveReportQueryQuery,
  useLazyGetMonthlyIncentiveReportQueryQuery,
  useGetMonthlySalesAndTargetProductWiseReportQueryQuery,
  useLazyGetMonthlySalesAndTargetProductWiseReportQueryQuery,
  useGetProductGroupWiseDailySalesReportQueryQuery,
  useLazyGetProductGroupWiseDailySalesReportQueryQuery,
  useGetProductGroupMpoWiseDailySalesReportQueryQuery,
  useLazyGetProductGroupMpoWiseDailySalesReportQueryQuery,
} = ReportingApiSlice;
