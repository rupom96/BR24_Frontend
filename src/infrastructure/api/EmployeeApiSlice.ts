/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ISalesPersonComboBox } from '../../domain/interfaces/SalesPersonInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IEmployee } from '../../domain/interfaces/TeamAndTarget';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Employee`;

// Define a service using a base URL and expected endpoints
export const EmployeeApiSlice = createApi({
  reducerPath: 'EmployeeApi',
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
    'salesPersonOptions',
    'employeeOptions',
    'employeeOfACertainSomething',
    'targetSPemployeeOfACertainSomething',
  ],
  endpoints: (builder) => ({
    getSalesPersonByCompanyLocationBuyerId: builder.query<
      ISalesPersonComboBox[],
      {
        companyId: number;
        locationId?: number | null;
        buyerId?: number | null;
        buyerGroupId?: number | null;
        departmentId?: number | null;
      }
    >({
      query: ({
        companyId,
        locationId,
        buyerId,
        buyerGroupId,
        departmentId,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (locationId) params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        if (buyerGroupId) params.append('buyerGroupId', String(buyerGroupId)); // Include only if non-null and non-zero
        if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        return `getSalesPersonByCompanyLocationBuyerId?${params.toString()}`;
      },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getEmployeeByCompanyId: builder.query<IEmployee[], { companyId: number }>({
      query: ({ companyId }) => `getEmployeeByCompanyId?companyId=${companyId}`,
      providesTags: () => ['employeeOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getEmployeeByCompanyRegionMasterRegionDivisionDistrictId: builder.query<
      IEmployee[],
      {
        companyId: number;
        regionMasterId: number;
        regionId: number;
        divisionId: number;
        districtId: number;
        // productGroupId?: number;
        // fromMonth?: number;
        // toMonth?: number;
        // fromYear?: number;
        // toYear?: number;
      }
    >({
      query: ({
        companyId,
        regionMasterId,
        regionId,
        divisionId,
        districtId,
        // productGroupId,
        // fromMonth,
        // toMonth,
        // fromYear,
        // toYear,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        // if (fromMonth) params.append('fromMonth', String(fromMonth)); // Include only if non-null and non-zero
        // if (toMonth) params.append('toMonth', String(toMonth)); // Include only if non-null and non-zero
        // if (fromYear) params.append('fromYear', String(fromYear)); // Include only if non-null and non-zero
        // if (toYear) params.append('toYear', String(toYear)); // Include only if non-null and non-zero
        if (regionMasterId)
          params.append('regionMasterId', String(regionMasterId)); // Include only if non-null and non-zero
        if (regionId) params.append('regionId', String(regionId)); // Include only if non-null and non-zero
        if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
        if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        // if (productGroupId)
        //   params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
        return `getEmployeeByCompanyRegionMasterRegionDivisionDistrictId?${params.toString()}`;

        // `getEmployeeByCompanyRegionMasterRegionDivisionDistrictId?companyId=${companyId}&regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}`;
      },
      transformResponse: (rawData: any[]) => {
        const transformedData = rawData.map((item) => {
          return {
            employeeId: item.inchargeId as number,
            employeeName: item.inchargeName as string,
            target: item.target,
          };
        });
        return transformedData;
      },
      providesTags: () => ['employeeOfACertainSomething'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getTargetSPEmployeeByCompanyRegionMasterRegionDivisionDistrictId:
      builder.query<
        IEmployee[],
        {
          companyId: number;
          regionMasterId: number;
          regionId: number;
          divisionId: number;
          districtId: number;
          productGroupId?: number;
          fromMonth?: number;
          toMonth?: number;
          fromYear?: number;
          toYear?: number;
        }
      >({
        query: ({
          companyId,
          regionMasterId,
          regionId,
          divisionId,
          districtId,
          productGroupId,
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
          if (productGroupId)
            params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
          return `getEmployeeByCompanyRegionMasterRegionDivisionDistrictId?${params.toString()}`;

          // `getEmployeeByCompanyRegionMasterRegionDivisionDistrictId?companyId=${companyId}&regionMasterId=${regionMasterId}&regionId=${regionId}&divisionId=${divisionId}&districtId=${districtId}`;
        },
        transformResponse: (rawData: any[]) => {
          const transformedData = rawData.map((item) => {
            return {
              employeeId: item.inchargeId as number,
              employeeName: item.inchargeName as string,
              areaId: item.areaId,
              areaName: item.areaName,
              target: item.target,
            };
          });
          return transformedData;
        },
        providesTags: () => ['targetSPemployeeOfACertainSomething'], // Disable caching by always providing an empty array of tags
        // providesTags: ['chequeBook'],
      }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSalesPersonByCompanyLocationBuyerIdQuery,
  useLazyGetSalesPersonByCompanyLocationBuyerIdQuery,
  useGetEmployeeByCompanyIdQuery,
  useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery,
  useLazyGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery,
  useGetTargetSPEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery,
  useLazyGetTargetSPEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery,
} = EmployeeApiSlice;
