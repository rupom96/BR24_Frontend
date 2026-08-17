/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IDistrict } from '../../domain/interfaces/RegionMasterAndTarget';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `District`;

// Define a service using a base URL and expected endpoints
export const DistrictApiSlice = createApi({
  reducerPath: 'DistrictApi',
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
  tagTypes: ['districtInfo', 'districtInfoForBuyer'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getDistrictByDivisionCompanyIdMonthYear: builder.query<
      IDistrict[],
      {
        companyId: number;
        regionMasterId?: number;
        regionId?: number;
        divisionId?: number;
        areaId?: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      // query: ({
      //   companyId,
      //   divisionId,
      //   fromMonth,
      //   toMonth,
      //   fromYear,
      //   toYear,
      // }) =>
      //   `getDistrictByDivisionCompanyIdMonthYear?companyId=${companyId}&divisionId=${divisionId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      query: ({
        companyId,
        regionMasterId,
        regionId,
        divisionId,
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
        if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
        if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

        return `getDistrictByDivisionCompanyIdMonthYear?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['districtInfo'],
    }),
    getDistrictByDivisionCompanyIdMonthYearForBuyer: builder.query<
      IDistrict[],
      {
        companyId: number;
        regionMasterId?: number;
        regionId?: number;
        divisionId?: number;
        areaId?: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      // query: ({
      //   companyId,
      //   divisionId,
      //   fromMonth,
      //   toMonth,
      //   fromYear,
      //   toYear,
      // }) =>
      //   `getDistrictByDivisionCompanyIdMonthYear?companyId=${companyId}&divisionId=${divisionId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      query: ({
        companyId,
        regionMasterId,
        regionId,
        divisionId,
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
        if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
        if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

        return `getDistrictByDivisionCompanyIdMonthYearForBuyer?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['districtInfoForBuyer'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDistrictByDivisionCompanyIdMonthYearQuery,
  useLazyGetDistrictByDivisionCompanyIdMonthYearQuery,
  useGetDistrictByDivisionCompanyIdMonthYearForBuyerQuery,
  useLazyGetDistrictByDivisionCompanyIdMonthYearForBuyerQuery,
} = DistrictApiSlice;
