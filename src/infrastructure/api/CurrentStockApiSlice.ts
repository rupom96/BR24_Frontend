/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IProductSerialCombo } from '../../domain/interfaces/CurrentStockInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';
import {
  ICurrentStockPreviewRow,
  IGetCurrentStockPreviewFilterDto,
} from '../../domain/interfaces/CurrentStockPreviewInterface';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `CurrentStock`;

// Define a service using a base URL and expected endpoints
export const CurrentStockApiSlice = createApi({
  reducerPath: 'CurrentStockApi',
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
  tagTypes: ['productSerialOptions'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getProductSerial: builder.query<
      IProductSerialCombo[],
      { companyId: number; locationId: number; productId: number }
    >({
      query: ({ companyId, locationId, productId }) =>
        `getProductSerial?companyId=${companyId}&locationId=${locationId}&productId=${productId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getCurrentStockPreviewInfo: builder.query<
      ICurrentStockPreviewRow[], // what the hook returns
      { filter: IGetCurrentStockPreviewFilterDto | null }
    >({
      query: ({ filter }) => {
        const params = new URLSearchParams();

        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              params.append(key, value.toString());
            }
          });
        }

        return `getCurrentStockPreview${
          params.toString() ? `?${params.toString()}` : ''
        }`;
      },

      //  unwrap Result<IPurchaseReturnInfo[]>
      transformResponse: (response: IApiResult<ICurrentStockPreviewRow[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ??
              'Failed to load CurrentStockPreview return info'
          );
        }

        return response.data ?? [];
      },

      providesTags: () => [],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProductSerialQuery,
  useLazyGetProductSerialQuery,
  useGetCurrentStockPreviewInfoQuery,
  useLazyGetCurrentStockPreviewInfoQuery,
} = CurrentStockApiSlice;
