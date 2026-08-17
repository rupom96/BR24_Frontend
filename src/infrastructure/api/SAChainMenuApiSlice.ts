import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ISAChainMenu } from '../../domain/interfaces/SAChainMenuInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `SA_ChainMenu`;

// Define a service using a base URL and expected endpoints
export const SAChainMenuApiSlice = createApi({
  reducerPath: 'SAChainMenuApiSlice',
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
  tagTypes: ['SAChainMenu'],
  endpoints: (builder) => ({
    getSAChainMenuByCompanyLocationUserId: builder.query<
      ISAChainMenu[],
      { userId: number; companyId: number; locationId: number }
    >({
      query: ({ userId, companyId, locationId }) =>
        `getByCompanyLocationUserId?userId=${userId}&companyId=${companyId}&locationId=${locationId}`,

      transformResponse: (rawData: any[]) => {
        // Extract only the 'roll' property from the response
        const extractedData = rawData.map((item) => ({
          fixedTaskTemplateName: item.fixedTaskTemplateName,
          fixedTaskTemplateId: item.fixedTaskTemplateId,
          // actionType: item.actionType,
          biznessEventProcessConfigurationId:
            item.biznessEventProcessConfigurationId,
          controllerPath: item.controllerPath,
        }));
        return extractedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['SAChainMenu'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSAChainMenuByCompanyLocationUserIdQuery } =
  SAChainMenuApiSlice;
