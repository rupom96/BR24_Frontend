/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v4 as uuid } from 'uuid';
import {
  IBiznessEventProcessConfiguration,
  IBiznessEventProcessConfigurationFirstPage,
  IBiznessEventProcessConfigurationInfoForChainConfig,
  IPCButtonListDto,
  IPermittedUsersAndLocation,
  IProcessBiznessEventProcessConfiguration,
  IProcessConfigurationInfoForChainConfig,
} from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ISANextEvent } from '../../domain/interfaces/SANextEventInterface';
// import { IBiznessEventProcessConfigurationInfo } from '../../domain/interfaces/FixedTaskTemplateInterface';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `BiznessEventProcessConfiguration`;

interface IRequestBiznessEventProcessConfigurationInfo {
  code?: number | null;
  data?: IBiznessEventProcessConfigurationInfoForChainConfig[];
  exception?: any | null;
  messages?: any[] | null;
  succeeded?: boolean | null;
  validationErrors?: any | null;
}

interface IRequestPCButtonListDto {
  code?: number | null;
  data?: IPCButtonListDto[];
  exception?: any | null;
  messages?: any[] | null;
  succeeded?: boolean | null;
  validationErrors?: any | null;
}

// Define a service using a base URL and expected endpoints
export const BiznessEventProcessConfigurationApiSlice = createApi({
  reducerPath: 'BiznessEventProcessConfigurationApiSlice',
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
    'BiznessEventProcessConfiguration',
    'BiznessEventProcessConfigurationFirstPage',
    'BiznessEventProcessConfigurationPreviewPage',
    'BiznessEventProcessConfigurationInfo',
    'BiznessEventProcessConfigurationButtons',
  ],
  endpoints: (builder) => ({
    getBiznessEventProcessConfigurationsByFixedTaskTemplateId: builder.query<
      IBiznessEventProcessConfiguration[],
      number
    >({
      query: (fixedTaskTemplateId) =>
        `getByFixedTaskTemplateId?fixedTaskTemplateId=${fixedTaskTemplateId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventProcessConfiguration'],
    }),

    getFirstPageOfChainByFixedTaskTemplateId: builder.query<
      IBiznessEventProcessConfigurationFirstPage,
      { fixedTaskTemplateId: number }
    >({
      query: ({ fixedTaskTemplateId }) =>
        `getFirstPageOfChainByFixedTaskTemplateId?fixedTaskTemplateId=${fixedTaskTemplateId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventProcessConfigurationFirstPage'],
    }),

    getPreviewPageInfoByFixedTaskTemplateIdSequence: builder.query<
      ISANextEvent,
      {
        fixedTaskTemplateId: number;
        sequence: number;
        firstEventNo: string;
      }
    >({
      query: ({ fixedTaskTemplateId, sequence, firstEventNo }) =>
        `getPreviewPageInfoByFixedTaskTemplateIdSequence?fixedTaskTemplateId=${fixedTaskTemplateId}&sequence=${sequence}&firstEventNo=${firstEventNo}`,
      transformResponse: (rawData: ISANextEvent) => {
        // Extract only the 'roll' property from the response

        const rawDataCopy = { ...rawData };

        rawDataCopy.controllerPathType = rawData?.controllerPath
          ? rawData?.controllerPath.split('#')[0]
          : '';
        rawDataCopy.controllerPath = rawData?.controllerPath
          ? rawData?.controllerPath.split('#')[1]
          : '';

        return rawDataCopy;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventProcessConfigurationPreviewPage'],
    }),

    getBiznessEventProcessConfigurationInfoByFixedTaskTemplateId: builder.query<
      IRequestBiznessEventProcessConfigurationInfo,
      { fixedTaskTemplateId: number }
    >({
      query: ({ fixedTaskTemplateId }) =>
        `getBiznessEventProcessConfigurationInfoByFixedTaskTemplateId?fixedTaskTemplateId=${fixedTaskTemplateId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      // transformResponse: (
      //   rawData: IRequestBiznessEventProcessConfigurationInfo
      // ) => {
      //   // Extract only the 'roll' property from the response

      //   const rawDataCopy = rawData?.data || [];
      //   rawDataCopy.forEach((element) => {
      //     element.virtualId = uuid();
      //   });

      //   return rawData;
      // },
      providesTags: ['BiznessEventProcessConfigurationInfo'],
    }),

    // getAllButtonList: builder.query<
    //   IRequestPCButtonListDto,
    //   { biznessEventConfigurationId: number }
    // >({
    getAllButtonList: builder.query<
      IRequestPCButtonListDto,
      { biznessEventProcessConfigurationId: number }
    >({
      query: ({ biznessEventProcessConfigurationId }) =>
        // query: () =>
        `getAllButtonList?biznessEventProcessConfigurationId=${biznessEventProcessConfigurationId}`,
      // `getAllButtonList`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      // transformResponse: (
      //   rawData: IRequestBiznessEventProcessConfigurationInfo
      // ) => {
      //   // Extract only the 'roll' property from the response

      //   const rawDataCopy = rawData?.data || [];
      //   rawDataCopy.forEach((element) => {
      //     element.virtualId = uuid();
      //   });

      //   return rawData;
      // },
      providesTags: ['BiznessEventProcessConfigurationButtons'],
    }),

    getPermittedUserAndLocationByBiznessEventProcessConfigurationId:
      builder.query<
        IPermittedUsersAndLocation[],
        { biznessEventProcessConfigurationId: number }
      >({
        query: ({ biznessEventProcessConfigurationId }) =>
          // query: () =>
          `getPermittedUserAndLocationByBiznessEventProcessConfigurationId?biznessEventProcessConfigurationId=${biznessEventProcessConfigurationId}`,

        providesTags: ['BiznessEventProcessConfigurationButtons'],
      }),

    processBiznessEventProcessConfigurations: builder.mutation<
      unknown,
      IProcessConfigurationInfoForChainConfig
    >({
      query: (objToSave) => ({
        url: 'process', // `${API_BASE_URL}/BiznessEventProcessConfiguration/process`,
        method: 'POST',
        body: objToSave,
      }),
      invalidatesTags: ['BiznessEventProcessConfigurationInfo'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBiznessEventProcessConfigurationsByFixedTaskTemplateIdQuery,
  useGetFirstPageOfChainByFixedTaskTemplateIdQuery,
  useGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery,
  useProcessBiznessEventProcessConfigurationsMutation,
  useGetBiznessEventProcessConfigurationInfoByFixedTaskTemplateIdQuery,
  useGetAllButtonListQuery,
  useGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery,
  useLazyGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery,
} = BiznessEventProcessConfigurationApiSlice;
