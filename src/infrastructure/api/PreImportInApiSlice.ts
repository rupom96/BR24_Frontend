/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IGetImportInInfoFilterDto,
  IGetImportInLCNoOptionsFilterDto,
  IImportIn,
  // IImportInAdditionalCost,
  IImportInDetailInfo,
  IImportInInfo,
  IImportInNoAndSupplierOptions,
  IImportInNoComboBox,
  IImportInProcessCommandsVM,
} from '../../domain/interfaces/ImportInInterface';
import { IApiResult } from '../../domain/interfaces/GlobalInterfaces/ApiResultInterface';
import { ILCNoComboBox } from '../../domain/interfaces/LCNoComboBoxInterface';
import { IPreImportInProduct } from '../../domain/interfaces/ProductInterfaces';

// import { IImportInAdditionalCost } from '../../domain/interfaces/ImportInAdditionalCost';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `PreImportIn`;

// Define a service using a base URL and expected endpoints
export const PreImportInApiSlice = createApi({
  reducerPath: 'PreImportInApi',
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
  tagTypes: ['preImportInProductOptions'],
  endpoints: (builder) => ({
    getPreImportInProduct: builder.query<
      IPreImportInProduct[],
      { importInId: number; lcNo: string }
    >({
      query: ({ importInId, lcNo }) => {
        const params = new URLSearchParams();
        params.append('importInId', String(importInId)); // Include only if non-null and non-zero
        params.append('lcNo', String(lcNo)); // Include only if non-null and non-zero
        // if (supplierId) params.append('supplierId', String(supplierId)); // Include only if non-null and non-zero
        return `getPreImportInProduct?${params.toString()}`;
      },
      providesTags: () => ['preImportInProductOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),

    // processSaveImportIn: builder.mutation<
    //   IImportInNoComboBox, //  what the hook returns
    //   IImportInProcessCommandsVM //  what you pass in
    // >({
    //   query: (objToProcess) => ({
    //     url: 'process',
    //     method: 'POST',
    //     body: objToProcess,
    //   }),

    //   //  raw response is Result<IImportInNoComboBox>
    //   transformResponse: (response: IApiResult<IImportInNoComboBox>) => {
    //     if (!response.succeeded) {
    //       // optional: you can also attach more info, e.g. code/messages
    //       throw new Error(response.messages?.[0] ?? 'Failed to save ImportIn');
    //     }

    //     return response.data; //  hook sees only the inner data
    //   },

    //   invalidatesTags: [
    //     'importInOptions',
    //     'importIn',
    //     'importInAdditionalCost',
    //     'importInDetailInfo',
    //   ],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPreImportInProductQuery,
  useLazyGetPreImportInProductQuery,
  // useProcessSaveImportInMutation,
} = PreImportInApiSlice;
