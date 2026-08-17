/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IArea,
  IAreaTargetSPProductGroup,
  IDistrict,
} from '../../domain/interfaces/RegionMasterAndTarget';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Area`;

// Define a service using a base URL and expected endpoints
export const AreaApiSlice = createApi({
  reducerPath: 'AreaApi',
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
    'areaSPTargetInfo',
    'areaInfo',
    'areaInfoForACertainSomething',
    'areaInfoForACertainSomethingForBuyer',
  ],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getAreaSPTargetByDivisionCompanyIdMonthYear: builder.query<
      IAreaTargetSPProductGroup[],
      {
        companyId: number;
        districtId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
      }
    >({
      query: ({
        companyId,
        districtId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
      }) =>
        `getAreaSPTargetByDivisionCompanyIdMonthYear?companyId=${companyId}&districtId=${districtId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}`,

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['areaSPTargetInfo'],
    }),
    getAreaByCompanyRegionMasterRegionDivisionDistrictId: builder.query<
      IArea[],
      {
        companyId: number;
        regionMasterId?: number;
        regionId?: number;
        divisionId?: number;
        districtId?: number;
        fromMonth?: number;
        toMonth?: number;
        fromYear?: number;
        toYear?: number;
      }
    >({
      // query: ({
      //   companyId,
      //   regionMasterId,
      //   regionId,
      //   divisionId,
      //   districtId,
      // }) =>
      //   `getAreaByCompanyRegionMasterRegionDivisionDistrictId?companyId=${companyId}&regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}`,

      query: ({
        companyId,
        regionMasterId,
        regionId,
        divisionId,
        districtId,
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
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        return `getAreaByCompanyRegionMasterRegionDivisionDistrictId?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['areaInfoForACertainSomething'],
    }),
    getAreaByCompanyRegionMasterRegionDivisionDistrictIdForBuyer: builder.query<
      IArea[],
      {
        companyId: number;
        regionMasterId?: number;
        regionId?: number;
        divisionId?: number;
        districtId?: number;
        fromMonth?: number;
        toMonth?: number;
        fromYear?: number;
        toYear?: number;
      }
    >({
      // query: ({
      //   companyId,
      //   regionMasterId,
      //   regionId,
      //   divisionId,
      //   districtId,
      // }) =>
      //   `getAreaByCompanyRegionMasterRegionDivisionDistrictId?companyId=${companyId}&regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}`,

      query: ({
        companyId,
        regionMasterId,
        regionId,
        divisionId,
        districtId,
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
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        return `getAreaByCompanyRegionMasterRegionDivisionDistrictIdForBuyer?${params.toString()}`;
      },

      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['areaInfoForACertainSomethingForBuyer'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAreaSPTargetByDivisionCompanyIdMonthYearQuery,
  useLazyGetAreaSPTargetByDivisionCompanyIdMonthYearQuery,
  useGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery,
  useLazyGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery,
  useGetAreaByCompanyRegionMasterRegionDivisionDistrictIdForBuyerQuery,
  useLazyGetAreaByCompanyRegionMasterRegionDivisionDistrictIdForBuyerQuery,
} = AreaApiSlice;
