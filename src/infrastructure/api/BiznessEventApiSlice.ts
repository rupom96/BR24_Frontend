/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProductGroupComboBox } from '../../domain/interfaces/ProductInterfaces';
import { IBuyer } from '../../domain/interfaces/BuyerInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { IBiznessEventOption } from '../../domain/interfaces/IBiznessEventInterface';

// Import the JSON file directly

export interface IRequestBiznessEventOption {
  code?: number | null;
  data?: IBiznessEventOption[];
  exception?: any | null;
  messages?: any[] | null;
  succeeded?: boolean | null;
  validationErrors?: any | null;
}

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `BiznessEvent`;

// Define a service using a base URL and expected endpoints
export const BiznessEventApiSlice = createApi({
  reducerPath: 'BiznessEventApi',
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
  tagTypes: ['biznessEventOptions'],
  endpoints: (builder) => ({
    // getAllBiznessEvents
    getAllBiznessEvents: builder.query<IRequestBiznessEventOption, void>({
      query: () => `getAllBiznessEvents`,
      //   transformResponse: (rawData: IRequestBiznessEventOption) => {
      //     if(rawData?.data){
      //         rawData?.data.map((item) => {
      //           item.biznessEventName
      //         }
      //     }
      //     return transformedData;
      //   },
      providesTags: () => ['biznessEventOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllBiznessEventsQuery, useLazyGetAllBiznessEventsQuery } =
  BiznessEventApiSlice;
