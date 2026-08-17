/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IChequeDetailInfo,
  ICollectionInfo,
  ICollectionModeAllLocationComboBox,
  ICollectionModeComboBox,
  ICollectionNoComboBox,
  ICollectionProcessCommandsVM,
  IGetCollectionInfoFilterDto,
} from '../../domain/interfaces/CollectionInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';

// import { ISalesOrderAdditionalCost } from '../../domain/interfaces/SalesOrderAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Collection`;

// Define a service using a base URL and expected endpoints
export const CollectionApiSlice = createApi({
  reducerPath: 'CollectionApi',
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
    'collectionOptions',
    'chequeDetail',
    'collectionInfos',
    'chequeDetailInfos',
  ],
  endpoints: (builder) => ({
    getAllCollectionNo: builder.query<
      ICollectionNoComboBox[],
      { companyId: number; locationId: number; buyerId: number | null }
    >({
      query: ({ companyId, locationId, buyerId }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        params.append('locationId', String(locationId)); // Include only if non-null and non-zero
        if (buyerId) params.append('buyerId', String(buyerId)); // Include only if non-null and non-zero
        return `getAllCollectionNo?${params.toString()}`;
      },
      providesTags: () => ['collectionOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    getCollectionInfo: builder.query<
      ICollectionInfo[],
      {
        filter: IGetCollectionInfoFilterDto | null;
        biznessEventId: number;
        companyId: number;
        userId: number;
      }
    >({
      query: ({ filter, biznessEventId, companyId, userId }) => {
        const params = new URLSearchParams();

        // Add filter values
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              params.append(key, value.toString());
            }
          });
        }

        // Add required params
        params.append('biznessEventId', biznessEventId.toString());
        params.append('companyId', companyId.toString());
        params.append('userId', userId.toString());

        return `getCollectionInfo?${params.toString()}`;
      },

      //  unwrap Result<ICollectionInfo[]>
      transformResponse: (response: IApiResult<ICollectionInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load collection info'
          );
        }

        return response.data ?? [];
      },

      providesTags: () => ['collectionInfos'],
    }),

    getChequeDetailByCollectionId: builder.query<
      IChequeDetailInfo[],
      {
        collectionId: string;
        biznessEventId: number;
        companyId: number;
        userId: number;
      }
    >({
      query: ({ collectionId, biznessEventId, companyId, userId }) => {
        const params = new URLSearchParams();

        params.append('collectionId', collectionId);
        params.append('biznessEventId', biznessEventId.toString());
        params.append('companyId', companyId.toString());
        params.append('userId', userId.toString());

        return `getChequeDetailInfo?${params.toString()}`;
      },

      transformResponse: (response: IApiResult<IChequeDetailInfo[]>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to load cheque details'
          );
        }

        const data = response.data ?? [];

        //  Apply transformation: convert null → 'F'
        return data.map((item) => ({
          ...item,
          cqdCollected: item.cqdCollected ?? 'F',
        }));
      },

      providesTags: () => ['chequeDetailInfos'],
    }),

    // getCollectionMode: builder.query<
    //   ICollectionModeComboBox[],
    //   { companyId: number; locationId: number }
    // >({
    //   query: ({ companyId, locationId }) =>
    //     `getPaymentMode?companyId=${companyId}&locationId=${locationId}`,

    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),

    // getCollectionModeOfAllLocation: builder.query<
    //   ICollectionModeAllLocationComboBox[],
    //   { companyId: number }
    // >({
    //   query: ({ companyId }) =>
    //     `getCollectionModeForAllLocation?companyId=${companyId}`,
    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: ['chequeBook'],
    // }),

    processSaveCollection: builder.mutation<
      ICollectionNoComboBox, // what the hook returns
      ICollectionProcessCommandsVM // what you pass in
    >({
      query: (objToProcess) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),

      //  API returns IApiResult<ICollectionNoComboBox>
      transformResponse: (response: IApiResult<ICollectionNoComboBox>) => {
        if (!response.succeeded) {
          throw new Error(
            response.messages?.[0] ?? 'Failed to save collection'
          );
        }

        return response.data; //  hook only sees ICollectionNoComboBox
      },

      invalidatesTags: [
        'collectionOptions',
        'collectionInfos',
        'chequeDetailInfos',
        'chequeDetail',
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useProcessSaveCollectionMutation,
  useGetCollectionInfoQuery,
  useLazyGetCollectionInfoQuery,
  useGetChequeDetailByCollectionIdQuery,
  useLazyGetChequeDetailByCollectionIdQuery,
  useGetAllCollectionNoQuery,
  // useGetCollectionModeOfAllLocationQuery,
  // useGetCollectionModeQuery,
  useLazyGetAllCollectionNoQuery,
  // useLazyGetCollectionModeOfAllLocationQuery,
  // useLazyGetCollectionModeQuery,
} = CollectionApiSlice;
