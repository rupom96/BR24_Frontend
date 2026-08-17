/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  IEmployee,
  IProcessTeamTeamDetail,
  ITeam,
  ITeamDetail,
} from '../../domain/interfaces/TeamAndTarget';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Team`;

// Define a service using a base URL and expected endpoints
export const TeamAndTeamDetailApiSlice = createApi({
  reducerPath: 'TeamAndTeamDetailApi',
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
  tagTypes: ['teams', 'teamDetail', 'teamMembers'],
  endpoints: (builder) => ({
    getTeamByCompanyId: builder.query<
      ITeam[],
      {
        companyId: number;
      }
    >({
      query: ({ companyId }) => `getTeamByCompanyId?companyId=${companyId}`,
      providesTags: () => ['teams'], // Disable caching by always providing an empty array of tags
    }),
    getTeamMemberByTeamId: builder.query<
      IEmployee[],
      {
        teamId: number;
      }
    >({
      query: ({ teamId }) => `getTeamMemberByTeamId?teamId=${teamId}`,
      providesTags: () => ['teamMembers'], // Disable caching by always providing an empty array of tags
    }),
    getTeamDetailByTeamId: builder.query<
      ITeamDetail[],
      {
        teamId: number;
      }
    >({
      query: ({ teamId }) => `getTeamDetailByTeamId?teamId=${teamId}`,
      providesTags: () => ['teamMembers'], // Disable caching by always providing an empty array of tags
    }),

    processSaveTeamTeamDetail: builder.mutation<any, IProcessTeamTeamDetail>({
      query: (objToProcess: IProcessTeamTeamDetail) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['teams', 'teamDetail', 'teamMembers'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTeamByCompanyIdQuery,
  useGetTeamMemberByTeamIdQuery,
  useGetTeamDetailByTeamIdQuery,
  useProcessSaveTeamTeamDetailMutation,
} = TeamAndTeamDetailApiSlice;
