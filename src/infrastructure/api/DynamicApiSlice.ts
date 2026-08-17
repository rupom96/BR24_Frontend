import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILCNoComboBox } from '../../domain/interfaces/LCNoComboBoxInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IEventNoComboBox } from '../../domain/interfaces/EventNoComboBoxInterface';
import {
  IUserBrand,
  IUserProduct,
  IUserProductGroup,
} from '../../domain/interfaces/ProductInterfaces';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `CustomQuery`;

// Define a service using a base URL and expected endpoints
export const DynamicApiSlice = createApi({
  reducerPath: 'DynamicApiSlice',
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
    'EventNoComboBox',
    'DynamicReportFrontendElements',
    'UserProductGroups',
    'UserProducts',
    'UserBrands',
  ],
  endpoints: (builder) => ({
    getDynamicEventNo: builder.query<
      any[],
      { biznessEventName: string; companyId: number }
    >({
      query: ({ biznessEventName, companyId }) =>
        `getDynamicEventNo?biznessEventName=${biznessEventName}&companyId=${companyId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['EventNoComboBox'],
    }),
    // /api/CustomQuery/getDynamicReportFrontendElements
    getDynamicReportFrontendElements: builder.query<
      IDynamicReportFrontendElements,
      {
        biznessEventProcessConfigurationId: number;
        companyId: number;
        locationId: number;
      }
    >({
      query: ({ biznessEventProcessConfigurationId, companyId, locationId }) =>
        `getDynamicReportFrontendElements?biznessEventProcessConfigurationId=${biznessEventProcessConfigurationId}&companyId=${companyId}&locationId=${locationId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['DynamicReportFrontendElements'],
    }),
    getPermissionWiseUserProductGroup: builder.query<
      IUserProductGroup[],
      {
        companyId: number;
        biznessEventProcessConfigurationId: number;
        locationId: number;
        userId: number;
        // type: string;
      }
    >({
      query: ({
        companyId,
        biznessEventProcessConfigurationId,
        locationId,
        userId,
        // type,
      }) =>
        `getPermissionWiseUserProductGroupBrandAndProduct?biznessEventProcessConfigurationId=${biznessEventProcessConfigurationId}&companyId=${companyId}&locationId=${locationId}&userId=${userId}&type=${'PCUserProductGroup'}`,
      transformResponse: (rawData: any[]) => {
        const transformedData: IUserProductGroup[] = rawData.map((item) => {
          return {
            productGroupId: item.optionId as number,
            productGroupName: item.optionName as string,
            limit: item.optionLimit as number,
          };
        });
        return transformedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['UserProductGroups'],
    }),

    getPermissionWiseUserProduct: builder.query<
      IUserProduct[],
      {
        companyId: number;
        biznessEventProcessConfigurationId: number;
        locationId: number;
        userId: number;
        // type: string;
      }
    >({
      query: ({
        companyId,
        biznessEventProcessConfigurationId,
        locationId,
        userId,
        // type,
      }) =>
        `getPermissionWiseUserProductGroupBrandAndProduct?biznessEventProcessConfigurationId=${biznessEventProcessConfigurationId}&companyId=${companyId}&locationId=${locationId}&userId=${userId}&type=${'PCUserProduct'}`,
      transformResponse: (rawData: any[]) => {
        const transformedData: IUserProduct[] = rawData.map((item) => {
          return {
            productId: item.optionId as number,
            productName: item.optionName as string,
            limit: item.optionLimit as number,
          };
        });
        return transformedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['UserProducts'],
    }),

    getPermissionWiseUserBrand: builder.query<
      IUserBrand[],
      {
        companyId: number;
        biznessEventProcessConfigurationId: number;
        locationId: number;
        userId: number;
        // type: string;
      }
    >({
      query: ({
        companyId,
        biznessEventProcessConfigurationId,
        locationId,
        userId,
        // type,
      }) =>
        `getPermissionWiseUserProductGroupBrandAndProduct?biznessEventProcessConfigurationId=${biznessEventProcessConfigurationId}&companyId=${companyId}&locationId=${locationId}&userId=${userId}$type=${'PCUserBrand'}`,
      transformResponse: (rawData: any[]) => {
        const transformedData: IUserBrand[] = rawData.map((item) => {
          return {
            brandId: item.optionId as number,
            brandName: item.optionName as string,
            limit: item.optionLimit as number,
          };
        });
        return transformedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['UserBrands'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDynamicEventNoQuery,
  useGetDynamicReportFrontendElementsQuery,
  useGetPermissionWiseUserProductGroupQuery,
  useGetPermissionWiseUserProductQuery,
  useGetPermissionWiseUserBrandQuery,
} = DynamicApiSlice;
