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
import {
  IBuyerTargetProductGroup,
  IProcessBuyerTargetProductGroup,
} from '../../domain/interfaces/BuyerAndTarget';
import { AreaApiSlice } from './AreaApiSlice';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Target_BuyerProductGroup`;

// Define a service using a base URL and expected endpoints
export const TargetBuyerProductGroupApiSlice = createApi({
  reducerPath: 'TargetBuyerProductGroupApi',
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
    'targetBuyerProductGroupByArea',
    'uniqueProductsOfACertainSomethingForBuyer',
    'prevUniqueProductsOfACertainSomethingForBuyer',
  ],
  endpoints: (builder) => ({
    getTargetBuyerProductGroupByMonthYearAreaId: builder.query<
      IBuyerTargetProductGroup[],
      {
        // teamId: number;
        areaId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        buyerId: number;
        productGroupId: number;
      }
    >({
      query: ({
        areaId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        buyerId,
        productGroupId,
      }) =>
        `getTarget_BuyerProductGroupByMonthYearAreaBuyerProductGroupId?areaId=${areaId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&buyerId=${buyerId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetBuyerProductGroupByArea'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getPrevMonthTargetBuyerProductGroupByMonthYearAreaId: builder.query<
      IBuyerTargetProductGroup[],
      {
        // teamId: number;
        areaId: number;
        fromMonth: number;
        toMonth: number;
        fromYear: number;
        toYear: number;
        buyerId: number;
        productGroupId: number;
      }
    >({
      query: ({
        areaId,
        fromMonth,
        toMonth,
        fromYear,
        toYear,
        buyerId,
        productGroupId,
      }) =>
        `getTarget_BuyerProductGroupByMonthYearAreaBuyerProductGroupId?areaId=${areaId}&fromMonth=${fromMonth}&toMonth=${toMonth}&fromYear=${fromYear}&toYear=${toYear}&buyerId=${buyerId}&productGroupId=${productGroupId}`,
      providesTags: () => ['targetBuyerProductGroupByArea'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictId:
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
          areaId: number;
          buyerId?: number | null;
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
          areaId,
          buyerId,
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
          if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

          if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
          if (productGroupId)
            params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
          return `getTarget_BuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictId?${params.toString()}`;
        },
        // providesTags: () => ['uniqueProductsOfACertainSomething'], // Disable caching by always providing an empty array of tags
        providesTags: ['uniqueProductsOfACertainSomethingForBuyer'],
      }),

    getPrevMonthTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictId:
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
          areaId: number;
          buyerId?: number | null;
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
          areaId,
          buyerId,
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
          if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero

          if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
          if (productGroupId)
            params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
          return `getTarget_BuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictId?${params.toString()}`;
        },
        // providesTags: () => ['uniqueProductsOfACertainSomething'], // Disable caching by always providing an empty array of tags
        providesTags: ['prevUniqueProductsOfACertainSomethingForBuyer'],
      }),

    processTargetBuyerProductGroup: builder.mutation<
      unknown,
      IProcessBuyerTargetProductGroup
    >({
      query: (objToProcess: IProcessBuyerTargetProductGroup) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'targetBuyerProductGroupByArea',
        'uniqueProductsOfACertainSomethingForBuyer',
        'prevUniqueProductsOfACertainSomethingForBuyer',
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // Wait for the mutation to succeed
          dispatch(
            RegionMasterApiSlice.util.invalidateTags([
              'regionMasterInfoForBuyer',
            ]) // Invalidate the tag from RegionMasterApiSlice
          );
          dispatch(
            RegionApiSlice.util.invalidateTags(['regionInfoForBuyer']) // Invalidate the tag from RegionApiSlice
          );
          dispatch(
            DivisionApiSlice.util.invalidateTags(['divisionInfoForBuyer']) // Invalidate the tag from RegionApiSlice
          );
          dispatch(
            DistrictApiSlice.util.invalidateTags(['districtInfoForBuyer']) // Invalidate the tag from RegionApiSlice
          );
          dispatch(
            AreaApiSlice.util.invalidateTags([
              'areaInfoForACertainSomethingForBuyer',
              'areaInfo',
              'areaInfoForACertainSomething',
            ]) // Invalidate the tag from RegionApiSlice
          );
        } catch (error) {
          console.error('Error processing Target_BuyerProductGroup:', error);
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTargetBuyerProductGroupByMonthYearAreaIdQuery,
  useGetPrevMonthTargetBuyerProductGroupByMonthYearAreaIdQuery,
  useGetTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
  useProcessTargetBuyerProductGroupMutation,
  useGetPrevMonthTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
} = TargetBuyerProductGroupApiSlice;
