/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IRegion } from '../../domain/interfaces/RegionMasterAndTarget';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Region`;

// Define a service using a base URL and expected endpoints
export const RegionApiSlice = createApi({
  reducerPath: 'RegionApi',
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
  tagTypes: ['regionInfo', 'regionInfoForBuyer'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getRegionByRegionMasterCompanyIdMonthYear: builder.query<
      IRegion[],
      {
        companyId: number;
        regionMasterId?: number;
        divisionId?: number;
        districtId?: number;
        areaId?: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      // query: ({
      //   companyId,
      //   regionMasterId,
      //   divisionId,
      //   districtId,
      //   areaId,
      //   fromMonth,
      //   toMonth,
      //   fromYear,
      //   toYear,
      // }) =>
      //   `getRegionByRegionMasterCompanyIdMonthYear?companyId=${companyId}&regionMasterId=${regionMasterId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      query: ({
        companyId,
        regionMasterId,
        divisionId,
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
        if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

        return `getRegionByRegionMasterCompanyIdMonthYear?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['regionInfo'],
    }),
    getRegionByRegionMasterCompanyIdMonthYearForBuyer: builder.query<
      IRegion[],
      {
        companyId: number;
        regionMasterId?: number;
        divisionId?: number;
        districtId?: number;
        areaId?: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      // query: ({
      //   companyId,
      //   regionMasterId,
      //   divisionId,
      //   districtId,
      //   areaId,
      //   fromMonth,
      //   toMonth,
      //   fromYear,
      //   toYear,
      // }) =>
      //   `getRegionByRegionMasterCompanyIdMonthYear?companyId=${companyId}&regionMasterId=${regionMasterId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      query: ({
        companyId,
        regionMasterId,
        divisionId,
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
        if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

        return `getRegionByRegionMasterCompanyIdMonthYearForBuyer?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['regionInfoForBuyer'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRegionByRegionMasterCompanyIdMonthYearQuery,
  useLazyGetRegionByRegionMasterCompanyIdMonthYearQuery,
  useGetRegionByRegionMasterCompanyIdMonthYearForBuyerQuery,
  useLazyGetRegionByRegionMasterCompanyIdMonthYearForBuyerQuery,
} = RegionApiSlice;
