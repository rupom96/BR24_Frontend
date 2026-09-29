/* eslint-disable no-param-reassign */
import { createApi } from '@reduxjs/toolkit/query/react';
import { IProductGroupComboBox } from '../../domain/interfaces/ProductInterfaces';
import {
  IBuyer,
  IBuyerGradingOptions,
  IBuyerSalesReport,
} from '../../domain/interfaces/BuyerInterface';
import { IBuyerGroup } from '../../domain/interfaces/BuyerGroupInterface';
import { createAuthenticatedBaseQuery } from './shared/createAuthenticatedBaseQuery';

// Import the JSON file directly

const controllerName: string = `Buyer`;

// Define a service using a base URL and expected endpoints
export const BuyerApiSlice = createApi({
  reducerPath: 'BuyerApi',
  baseQuery: createAuthenticatedBaseQuery(controllerName),
  tagTypes: [
    'buyerOptions, buyerGroupOptions',
    'buyerOfACertainSomething',
    'targetBuyerOfACertainSomething',
    'prevMonthTargetBuyerOfACertainSomething',
    'buyerGradingOptions',
  ],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    // getBuyerByCompanyLocationId: builder.query<
    //   IBuyer[],
    //   { companyId: number; locationId: number }
    // >({
    //   query: ({ companyId, locationId }) =>
    //     `getBuyerByCompanyLocationId?companyId=${companyId}&locationId=${locationId}`,

    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),
    getBuyerByCompanyLocationId: builder.query<
      IBuyer[],
      {
        companyId: number;
        locationId?: number | null;
        buyerGroupId?: number | null;
        salesPersonId?: number | null;
        departmentId?: number | null;
        salesOrderId?: string | null;
        lPurchaseInId?: string | null;
      }
    >({
      query: ({
        companyId,
        locationId,
        buyerGroupId,
        salesPersonId,
        departmentId,
        salesOrderId,
        lPurchaseInId,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (locationId) params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (buyerGroupId) params.append('buyerGroupId', String(buyerGroupId)); // Include only if non-null and non-zero
        if (salesPersonId)
          params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        if (salesOrderId) params.append('salesOrderId', String(salesOrderId)); // Include only if non-null and non-zero
        if (lPurchaseInId)
          params.append('lPurchaseInId', String(lPurchaseInId)); // Include only if non-null and non-zero

        return `getBuyerByCompanyLocationId?${params.toString()}`;
      },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getBuyerForComboByCompanyLocationId: builder.query<
      // same rtk as above actually, made a copy
      IBuyer[],
      {
        companyId: number;
        locationId?: number | null;
        buyerGroupId?: number | null;
        salesPersonId?: number | null;
        departmentId?: number | null;
        salesOrderId?: string | null;
        lPurchaseInId?: string | null;
      }
    >({
      query: ({
        companyId,
        locationId,
        buyerGroupId,
        salesPersonId,
        departmentId,
        salesOrderId,
        lPurchaseInId,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (locationId) params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (buyerGroupId) params.append('buyerGroupId', String(buyerGroupId)); // Include only if non-null and non-zero
        if (salesPersonId)
          params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        if (salesOrderId) params.append('salesOrderId', String(salesOrderId)); // Include only if non-null and non-zero
        if (lPurchaseInId)
          params.append('lPurchaseInId', String(lPurchaseInId)); // Include only if non-null and non-zero

        return `getBuyerByCompanyLocationId?${params.toString()}`;
      },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getBuyerGroupByCompanyBuyerSalesPersonDepartmentId: builder.query<
      IBuyerGroup[],
      {
        companyId: number;
        buyerId?: number | null;
        salesPersonId?: number | null;
        departmentId?: number | null;
      }
    >({
      // query: ({ companyId, buyerId, salesPersonId, departmentId }) =>
      //   `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId?companyId=${companyId}&buyerId=${buyerId}&salesPersonId=${salesPersonId}&departmentId=${departmentId}`,
      query: ({ companyId, buyerId, salesPersonId, departmentId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        if (salesPersonId)
          params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        return `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId?${params.toString()}`;
      },
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getBuyerSalesReport: builder.query<
      IBuyerSalesReport[],
      {
        dateFrom: string | null;
        dateTo: string | null;
        buyerGroupId?: number | null;
        buyerId?: number | null;
        salesPersonId?: number | null;
        departmentId?: number | null;
      }
    >({
      // query: ({ companyId, buyerId, salesPersonId, departmentId }) =>
      //   `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId?companyId=${companyId}&buyerId=${buyerId}&salesPersonId=${salesPersonId}&departmentId=${departmentId}`,
      query: ({
        dateFrom,
        dateTo,
        buyerGroupId,
        buyerId,
        salesPersonId,
        departmentId,
      }) => {
        const params = new URLSearchParams();
        params.append('dateFrom', String(dateFrom)); // Always include dateFrom
        params.append('dateTo', String(dateTo)); // Always include dateTo
        if (buyerGroupId) params.append('buyerGroupId', String(buyerGroupId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        if (salesPersonId)
          params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        return `getBuyerSalesReport?${params.toString()}`;
      },
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaId:
      builder.query<
        IBuyer[],
        {
          companyId: number;
          regionMasterId: number;
          regionId: number;
          divisionId: number;
          districtId: number;
          areaId: number;
        }
      >({
        // query: ({ companyId, buyerId, salesPersonId, departmentId }) =>
        //   `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId?companyId=${companyId}&buyerId=${buyerId}&salesPersonId=${salesPersonId}&departmentId=${departmentId}`,
        query: ({
          companyId,
          regionMasterId,
          regionId,
          divisionId,
          districtId,
          areaId,
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
          if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero
          return `getBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaProductGroupId?${params.toString()}`;
        },
        // providesTags: () => [], // Disable caching by always providing an empty array of tags
        providesTags: ['buyerOfACertainSomething'],
      }),

    getTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaId:
      builder.query<
        IBuyer[],
        {
          companyId: number;
          regionMasterId: number;
          regionId: number;
          divisionId: number;
          districtId: number;
          areaId: number;
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
          areaId,
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
          if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero
          if (productGroupId)
            params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
          return `getBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaProductGroupId?${params.toString()}`;
        },

        providesTags: ['targetBuyerOfACertainSomething'],
      }),

    getPrevMonthTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaId:
      builder.query<
        IBuyer[],
        {
          companyId: number;
          regionMasterId: number;
          regionId: number;
          divisionId: number;
          districtId: number;
          areaId: number;
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
          areaId,
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
          if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero
          if (productGroupId)
            params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
          return `getBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaProductGroupId?${params.toString()}`;
        },

        providesTags: ['prevMonthTargetBuyerOfACertainSomething'],
      }),

    getBuyerGrading: builder.query<
      IBuyerGradingOptions[],
      {
        companyId: number;
      }
    >({
      query: ({ companyId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        // if (fromMonth) params.append('fromMonth', String(fromMonth)); // Include only if non-null and non-zero
        // if (toMonth) params.append('toMonth', String(toMonth)); // Include only if non-null and non-zero
        // if (fromYear) params.append('fromYear', String(fromYear)); // Include only if non-null and non-zero
        // if (toYear) params.append('toYear', String(toYear)); // Include only if non-null and non-zero
        // if (regionMasterId)
        //   params.append('regionMasterId', String(regionMasterId)); // Include only if non-null and non-zero
        // if (regionId) params.append('regionId', String(regionId)); // Include only if non-null and non-zero
        // if (divisionId) params.append('divisionId', String(divisionId)); // Include only if non-null and non-zero
        // if (districtId) params.append('districtId', String(districtId)); // Include only if non-null and non-zero
        // if (areaId) params.append('areaId', String(areaId)); // Include only if non-null and non-zero
        // if (productGroupId)
        //   params.append('productGroupId', String(productGroupId)); // Include only if non-null and non-zero
        return `getBuyerGrading?${params.toString()}`;
      },

      providesTags: ['buyerGradingOptions'],
    }),

    // IF ALL PARAMETERS WERE OPTIONAL-------------------------------------
    // query: ({ companyId, buyerId, salesPersonId, departmentId }) => {
    //   const params = new URLSearchParams();

    //   if (companyId) params.append("companyId", String(companyId));
    //   if (buyerId) params.append("buyerId", String(buyerId));
    //   if (salesPersonId) params.append("salesPersonId", String(salesPersonId));
    //   if (departmentId) params.append("departmentId", String(departmentId));

    //   const queryString = params.toString();

    //   return queryString
    //     ? `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId?${queryString}`
    //     : `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId`; // No `?` if no parameters
    // },
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBuyerByCompanyLocationIdQuery,
  useLazyGetBuyerByCompanyLocationIdQuery,
  useGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery,
  useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery,
  useGetBuyerSalesReportQuery,
  useLazyGetBuyerSalesReportQuery,
  useGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery,
  useLazyGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery,
  useGetTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery,
  useLazyGetTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery,
  useGetPrevMonthTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery,
  useGetBuyerForComboByCompanyLocationIdQuery,
  useLazyGetBuyerForComboByCompanyLocationIdQuery,
  useGetBuyerGradingQuery,
  useLazyGetBuyerGradingQuery,
} = BuyerApiSlice;
