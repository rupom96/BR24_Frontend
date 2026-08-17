/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IProcessTeamTargetSPProductGroup,
  IProductGroupFromSPTarget,
  ITeamTargetSPProductGroup,
} from '../../domain/interfaces/TeamAndTarget';
import { RegionApiSlice } from './RegionApiSlice';
import { RegionMasterApiSlice } from './RegionMasterApiSlice';
import { DistrictApiSlice } from './DistrictApiSlice';
import { DivisionApiSlice } from './DivisionApiSlice';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Target_SPProductGroup`;

// Define a service using a base URL and expected endpoints
export const TargetSPProductGroupApiSlice = createApi({
  reducerPath: 'TargetSPProductGroupApi',
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
    'targetSPProductGroupByTeam',
    'targetSPProductGroupByTeamSalesPerson',
    'targetSPProductGroupByTeamProductGroup',
    'targetDistrictSPProductGroupByTeam',
    'targetDistrictSPProductGroupByTeamSalesPerson',
    'targetDistrictSPProductGroupByTeamProductGroup',
    'uniqueProductsOfACertainSomething',
  ],
  endpoints: (builder) => ({
    getTargetSPProductGroupByTeamMonthYearId: builder.query<
      ITeamTargetSPProductGroup[],
      {
        teamId: number;
        fromMonth: number;
        fromYear: number;
        toMonth: number;
        toYear: number;
        salesPersonId: number;
        productGroupId: number;
      }
    >({
      query: ({
        teamId,
        fromMonth,
        fromYear,
        toMonth,
        toYear,
        salesPersonId,
        productGroupId,
      }) =>
        `getTarget_SPProductGroupByTeamMonthYearSalesPersonProductGroupId?teamId=${teamId}&fromMonth=${fromMonth}&fromYear=${fromYear}&toMonth=${toMonth}&toYear=${toYear}&salesPersonId=${salesPersonId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetSPProductGroupByTeam'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getTargetSPProductGroupByTeamMonthYearSalesPersonId: builder.query<
      ITeamTargetSPProductGroup[],
      {
        teamId: number;
        month: number;
        year: number;
        salesPersonId: number;
        productGroupId: number;
      }
    >({
      query: ({ teamId, month, year, salesPersonId, productGroupId }) =>
        `getTarget_SPProductGroupByTeamMonthYearSalesPersonProductGroupId?teamId=${teamId}&month=${month}&year=${year}&salesPersonId=${salesPersonId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetSPProductGroupByTeamSalesPerson'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getTargetSPProductGroupByTeamMonthYearProductGroupId: builder.query<
      ITeamTargetSPProductGroup[],
      {
        teamId: number;
        month: number;
        year: number;
        salesPersonId: number;
        productGroupId: number;
      }
    >({
      query: ({ teamId, month, year, salesPersonId, productGroupId }) =>
        `getTarget_SPProductGroupByTeamMonthYearSalesPersonProductGroupId?teamId=${teamId}&month=${month}&year=${year}&salesPersonId=${salesPersonId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetSPProductGroupByTeamProductGroup'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getDistrictSPProductGroupByTeamMonthYearId: builder.query<
      ITeamTargetSPProductGroup[],
      {
        // teamId: number;
        districtId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        salesPersonId: number;
        productGroupId: number;
      }
    >({
      query: ({
        districtId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        salesPersonId,
        productGroupId,
      }) =>
        `getTarget_SPProductGroupByMonthYearDistrictSalesPersonProductGroupId?districtId=${districtId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&salesPersonId=${salesPersonId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetDistrictSPProductGroupByTeam'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getDistrictSPProductGroupByTeamMonthYearSalesPersonId: builder.query<
      ITeamTargetSPProductGroup[],
      {
        // teamId: number;
        districtId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        salesPersonId: number;
        productGroupId: number;
      }
    >({
      query: ({
        districtId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        salesPersonId,
        productGroupId,
      }) =>
        `getTarget_SPProductGroupByMonthYearDistrictSalesPersonProductGroupId?districtId=${districtId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&salesPersonId=${salesPersonId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetDistrictSPProductGroupByTeamSalesPerson'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getDistrictSPProductGroupByTeamMonthYearProductGroupId: builder.query<
      ITeamTargetSPProductGroup[],
      {
        // teamId: number;
        districtId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        salesPersonId: number;
        productGroupId: number;
      }
    >({
      query: ({
        districtId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        salesPersonId,
        productGroupId,
      }) =>
        `getTarget_SPProductGroupByMonthYearDistrictSalesPersonProductGroupId?districtId=${districtId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&salesPersonId=${salesPersonId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetDistrictSPProductGroupByTeamProductGroup'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getTargetSPProductGroupByMonthYearRegionMasterRegionDivisionDistrictId:
      builder.query<
        IProductGroupFromSPTarget[], // productGroupId,productGroupName,target
        {
          fromMonth: number;
          toMonth: number;
          fromYear: number;
          toYear: number;
          regionMasterId: number;
          regionId: number;
          divisionId: number;
          districtId: number;
          salesPersonId?: number | null;
          productGroupId?: number | null;
        }
      >({
        query: ({
          fromMonth,
          toMonth,
          fromYear,
          toYear,
          regionMasterId,
          regionId,
          divisionId,
          districtId,
          salesPersonId,
          productGroupId,
        }) => {
          const params = new URLSearchParams();
          params.append('fromMonth', String(fromMonth)); // Include only if non-null and non-zero
          params.append('toMonth', String(toMonth)); // Include only if non-null and non-zero
          params.append('fromYear', String(fromYear)); // Include only if non-null and non-zero
          params.append('toYear', String(toYear)); // Include only if non-null and non-zero
          if (regionMasterId)
            params.append('regionMasterId', String(regionMasterId)); // Include only if non-null and non-zero
          if (regionId) params.append('regionId', String(regionId)); // Include only if non-null and non-zero
          if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
          if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
          if (salesPersonId)
            params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
          if (productGroupId)
            params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
          return `getTarget_SPProductGroupByMonthYearRegionMasterRegionDivisionDistrictId?${params.toString()}`;
        },
        providesTags: () => ['uniqueProductsOfACertainSomething'], // Disable caching by always providing an empty array of tags
        // providesTags: ['chequeBook'],
      }),

    processSaveSPProductGroup: builder.mutation<
      unknown,
      IProcessTeamTargetSPProductGroup
    >({
      query: (objToProcess: IProcessTeamTargetSPProductGroup) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'targetSPProductGroupByTeam',
        'targetSPProductGroupByTeamSalesPerson',
        'targetSPProductGroupByTeamProductGroup',
        'targetDistrictSPProductGroupByTeam',
        'targetDistrictSPProductGroupByTeamSalesPerson',
        'targetDistrictSPProductGroupByTeamProductGroup',
        'uniqueProductsOfACertainSomething',
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // Wait for the mutation to succeed
          dispatch(
            RegionMasterApiSlice.util.invalidateTags(['regionMasterInfo']) // Invalidate the tag from RegionMasterApiSlice
          );
          dispatch(
            RegionApiSlice.util.invalidateTags(['regionInfo']) // Invalidate the tag from RegionApiSlice
          );
          dispatch(
            DivisionApiSlice.util.invalidateTags(['divisionInfo']) // Invalidate the tag from RegionApiSlice
          );
          dispatch(
            DistrictApiSlice.util.invalidateTags(['districtInfo']) // Invalidate the tag from RegionApiSlice
          );
        } catch (error) {
          console.error('Error processing SPProductGroup:', error);
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTargetSPProductGroupByTeamMonthYearIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useGetDistrictSPProductGroupByTeamMonthYearIdQuery,
  useGetDistrictSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetDistrictSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useGetTargetSPProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
  useProcessSaveSPProductGroupMutation,
} = TargetSPProductGroupApiSlice;
