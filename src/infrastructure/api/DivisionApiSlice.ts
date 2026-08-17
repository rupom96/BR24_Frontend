/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IDivision,
  IRegion,
} from '../../domain/interfaces/RegionMasterAndTarget';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Division`;

// Define a service using a base URL and expected endpoints
export const DivisionApiSlice = createApi({
  reducerPath: 'DivisionApi',
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
  tagTypes: ['divisionInfo', 'divisionInfoForBuyer'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getDivisionByRegionCompanyIdMonthYear: builder.query<
      IDivision[],
      {
        companyId: number;
        regionMasterId?: number;
        regionId?: number;
        districtId?: number;
        areaId?: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      // query: ({ companyId, regionId, fromMonth, toMonth, fromYear, toYear }) =>
      //   `getDivisionByRegionCompanyIdMonthYear?companyId=${companyId}&regionId=${regionId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      query: ({
        companyId,
        regionMasterId,
        regionId,
        districtId,
        areaId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        if (fromMonth) params.append('fromMonth', String(fromMonth)); // Include only if non-null and non-zero
        if (toMonth) params.append('toMonth', String(toMonth)); // Include only if non-null and non-zero
        if (fromYear) params.append('fromYear', String(fromYear)); // Include only if non-null and non-zero
        if (toYear) params.append('toYear', String(toYear)); // Include only if non-null and non-zero
        if (regionMasterId)
          params.append('regionMasterId', String(regionMasterId)); // Include only if non-null and non-zero
        if (regionId) params.append('regionId', String(regionId)); // Include only if non-null and non-zero
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

        return `getDivisionByRegionCompanyIdMonthYear?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['divisionInfo'],
    }),
    getDivisionByRegionCompanyIdMonthYearForBuyer: builder.query<
      IDivision[],
      {
        companyId: number;
        regionMasterId?: number;
        regionId?: number;
        districtId?: number;
        areaId?: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      // query: ({ companyId, regionId, fromMonth, toMonth, fromYear, toYear }) =>
      //   `getDivisionByRegionCompanyIdMonthYear?companyId=${companyId}&regionId=${regionId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      query: ({
        companyId,
        regionMasterId,
        regionId,
        districtId,
        areaId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        if (fromMonth) params.append('fromMonth', String(fromMonth)); // Include only if non-null and non-zero
        if (toMonth) params.append('toMonth', String(toMonth)); // Include only if non-null and non-zero
        if (fromYear) params.append('fromYear', String(fromYear)); // Include only if non-null and non-zero
        if (toYear) params.append('toYear', String(toYear)); // Include only if non-null and non-zero
        if (regionMasterId)
          params.append('regionMasterId', String(regionMasterId)); // Include only if non-null and non-zero
        if (regionId) params.append('regionId', String(regionId)); // Include only if non-null and non-zero
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

        return `getDivisionByRegionCompanyIdMonthYearForBuyer?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['divisionInfoForBuyer'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDivisionByRegionCompanyIdMonthYearQuery,
  useLazyGetDivisionByRegionCompanyIdMonthYearQuery,
  useGetDivisionByRegionCompanyIdMonthYearForBuyerQuery,
  useLazyGetDivisionByRegionCompanyIdMonthYearForBuyerQuery,
} = DivisionApiSlice;
