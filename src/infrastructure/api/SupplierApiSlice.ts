/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  ISupplier,
  ISupplierGroup,
} from '../../domain/interfaces/SupplierInterface';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Supplier`;

// Define a service using a base URL and expected endpoints
export const SupplierApiSlice = createApi({
  reducerPath: 'SupplierApi',
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
  tagTypes: ['supplierOptions'],
  endpoints: (builder) => ({
    // getSupplierByCompanyLocationId
    getSupplierByCompanyLocationId: builder.query<
      ISupplier[],
      {
        companyId: number;
        locationId?: number;
        lPurchaseInId?: number;
        supplierGroupId?: number;
      }
    >({
      query: ({ companyId, locationId, lPurchaseInId, supplierGroupId }) =>
        // `getSupplierByCompanyLocationId?companyId=${companyId}&locationId=${locationId}`,

        {
          const params = new URLSearchParams();
          params.append('companyId', String(companyId)); // Always include companyId
          if (locationId) params.append('locationId', String(locationId)); // Include only if non-null and non-zero
          if (supplierGroupId)
            params.append('supplierGroupId', String(supplierGroupId)); // Include only if non-null and non-zero
          // if (salesPersonId)
          //   params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
          // if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
          // if (salesOrderId) params.append('salesOrderId', String(salesOrderId)); // Include only if non-null and non-zero
          if (lPurchaseInId)
            params.append('lPurchaseInId', String(lPurchaseInId)); // Include only if non-null and non-zero

          return `getSupplierByCompanyLocationId?${params.toString()}`;
        },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getSupplierForComboByCompanyLocationId: builder.query<
      // same rtk as above actually, made a copy
      ISupplier[],
      {
        companyId: number;
        locationId?: number | null;
        supplierGroupId?: number | null;
        // salesPersonId?: number | null;
        // departmentId?: number | null;
        // salesOrderId?: string | null;
        lPurchaseInId?: string | null;
      }
    >({
      query: ({
        companyId,
        locationId,
        supplierGroupId,
        // salesPersonId,
        // departmentId,
        // salesOrderId,
        lPurchaseInId,
      }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (locationId) params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (supplierGroupId)
          params.append('supplierGroupId', String(supplierGroupId)); // Include only if non-null and non-zero
        // if (salesPersonId)
        //   params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        // if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        // if (salesOrderId) params.append('salesOrderId', String(salesOrderId)); // Include only if non-null and non-zero
        if (lPurchaseInId)
          params.append('lPurchaseInId', String(lPurchaseInId)); // Include only if non-null and non-zero

        return `getSupplierByCompanyLocationId?${params.toString()}`;
      },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getSupplierGroupByCompanySupplierId: builder.query<
      ISupplierGroup[],
      {
        companyId: number;
        supplierId?: number | null;
        // salesPersonId?: number | null;
        // departmentId?: number | null;
      }
    >({
      // query: ({ companyId, buyerId, salesPersonId, departmentId }) =>
      //   `getBuyerGroupByCompanyBuyerSalesPersonDepartmentId?companyId=${companyId}&buyerId=${buyerId}&salesPersonId=${salesPersonId}&departmentId=${departmentId}`,
      query: ({ companyId, supplierId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Always include companyId
        if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        // if (salesPersonId)
        //   params.append('salesPersonId', String(salesPersonId)); // Include only if non-null and non-zero
        // if (departmentId) params.append('departmentId', String(departmentId)); // Include only if non-null and non-zero
        return `getSupplierGroupByCompanySupplierId?${params.toString()}`;
      },
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSupplierByCompanyLocationIdQuery,
  useLazyGetSupplierByCompanyLocationIdQuery,
  useGetSupplierForComboByCompanyLocationIdQuery,
  useLazyGetSupplierForComboByCompanyLocationIdQuery,
  useGetSupplierGroupByCompanySupplierIdQuery,
  useLazyGetSupplierGroupByCompanySupplierIdQuery,
} = SupplierApiSlice;
