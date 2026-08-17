/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  IBrand,
  IProductComboBox,
  IProductGroupComboBox,
} from '../../domain/interfaces/ProductInterfaces';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IPCUserBrandListDtos } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// import { IPCBrandListDto } from '../../domain/interfaces/FixedTaskTemplateInterface';
// import { IPCUserBrandListDtos } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';

// Import the JSON file directly

export interface IRequestPCBrandListDtos {
  code?: number | null;
  data?: IPCUserBrandListDtos[];
  exception?: any | null;
  messages?: any[] | null;
  succeeded?: boolean | null;
  validationErrors?: any | null;
}

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Product`;

// Define a service using a base URL and expected endpoints
export const ProductApiSlice = createApi({
  reducerPath: 'ProductApi',
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
  tagTypes: ['productGroupOptions', 'productOptions', 'brandOptions'],
  endpoints: (builder) => ({
    getProductGroupByCompanyId: builder.query<
      IProductGroupComboBox[],
      { companyId: number; brandId?: number | null; productId?: number | null }
    >({
      query: ({ companyId, brandId, productId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        if (brandId) params.append('brandId', String(brandId)); // Include only if non-null and non-zero
        if (productId) params.append('productId', String(productId)); // Include only if non-null and non-zero
        return `getProductGroupByCompanyId?${params.toString()}`;
      },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getProductGroupByCompanyIdInventoryType: builder.query<
      IProductGroupComboBox[],
      { companyId: number }
    >({
      query: ({ companyId }) =>
        `getProductGroupByCompanyIdInventoryType?companyId=${companyId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    // /api/Product/getProductByCompanyProductGroupId
    getProductByCompanyProductGroupId: builder.query<
      IProductComboBox[],
      {
        companyId: number;
        productGroupId?: number | null;
        brandId?: number | null;
      }
    >({
      query: ({ companyId, productGroupId, brandId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        if (productGroupId) params.append('groupId', String(productGroupId)); // Include only if non-null and non-zero
        if (brandId) params.append('brandId', String(brandId)); // Include only if non-null and non-zero
        return `getProductByCompanyProductGroupId?${params.toString()}`;
      },

      // `getProductByCompanyProductGroupId?companyId=${companyId}&groupId=${productGroupId}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getBrandByCompanyId: builder.query<
      IRequestPCBrandListDtos,
      {
        companyId: number;
        productGroupId?: number | null;
        productId?: number | null;
      }
    >({
      query: ({ companyId, productGroupId, productId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        if (productGroupId) params.append('groupId', String(productGroupId)); // Include only if non-null and non-zero
        if (productId) params.append('productId', String(productId)); // Include only if non-null and non-zero
        return `getBrandByCompanyId?${params.toString()}`;
      },

      // `getBrandByCompanyId?companyId=${companyId}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getProductGroup: builder.query<
      IProductGroupComboBox[],
      { companyId: number; brandId?: number | null; productId?: number | null }
    >({
      query: ({ companyId, brandId, productId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero

        if (brandId) params.append('brandId', String(brandId)); // Include only if non-null and non-zero
        if (productId) params.append('productId', String(productId)); // Include only if non-null and non-zero
        return `getProductGroup?${params.toString()}`;
      },

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProductGroupByCompanyIdQuery,
  useLazyGetProductGroupByCompanyIdQuery,
  useGetProductGroupByCompanyIdInventoryTypeQuery,
  useGetProductByCompanyProductGroupIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,
  useGetBrandByCompanyIdQuery,
  useLazyGetBrandByCompanyIdQuery,
  useGetProductGroupQuery,
  useLazyGetProductGroupQuery,
} = ProductApiSlice;
