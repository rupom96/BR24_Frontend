import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ISANextEvent } from '../../domain/interfaces/SANextEventInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `SA_NextEvent`;
// Define a service using a base URL and expected endpoints
export const SANextEventApiSlice = createApi({
  reducerPath: 'SANextEventApiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,

    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['SANextEvent'],
  endpoints: (builder) => ({
    getSANextEventByCompanyLocationUserFixedTaskTemplateId: builder.query<
      ISANextEvent[],
      {
        userId: number;
        companyId: number;
        locationId: number;
        fixedTaskTemplateId: number;
      }
    >({
      query: ({ userId, companyId, locationId, fixedTaskTemplateId }) =>
        `getByCompanyLocationUserFixedTaskTemplateId?userId=${userId}&companyId=${companyId}&locationId=${locationId}&fixedTaskTemplateId=${fixedTaskTemplateId}`,
      transformResponse: (rawData: any[]) => {
        console.log('SA_NEXT EVENT ALL DATA---------------->');
        console.log(rawData);

        // Extract only the 'roll' property from the response
        const extractedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };
          const assignedDateString = item.assignedDate;
          const dueDateString = item.dueDate;
          const assignedDateJs = new Date(assignedDateString);
          const dueDateJs = new Date(dueDateString);

          const assignedFormattedDate = assignedDateJs.toLocaleDateString(
            'en-US',
            options
          );
          const dueFormattedDate = dueDateJs.toLocaleDateString(
            'en-US',
            options
          );
          const controllerPathFormatted = item?.controllerPath
            ? item.controllerPath.split('#')[1]
            : '';
          const controllerPathTypeFormatted = item?.controllerPath
            ? item.controllerPath.split('#')[0]
            : '';
          return {
            ...item,
            controllerPathType: controllerPathTypeFormatted,
            controllerPath: controllerPathFormatted,
            assignedDate: assignedFormattedDate,
            dueDate: dueFormattedDate,
          };
        });
        return extractedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['SANextEvent'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSANextEventByCompanyLocationUserFixedTaskTemplateIdQuery,
} = SANextEventApiSlice;
