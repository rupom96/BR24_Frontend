import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ICreateFixedTaskTemplate,
  IFixedTaskTemplateAutoComp,
} from '../../domain/interfaces/FixedTaskTemplateInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const API_BASE_URL = window.API_BASE_URL;
// Define a service using a base URL and expected endpoints
export const fixedTaskTemplateApi = createApi({
  reducerPath: 'fixedTaskTemplateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/FixedTaskTemplate/`,
    // token er kaaj shuru
    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    // token er kaaj shesh
  }),
  tagTypes: ['FixedTaskTemplateOptions'],
  endpoints: (builder) => ({
    getFixedTaskTemplateComboOptions: builder.query<
      IFixedTaskTemplateAutoComp[],
      {
        companyId: number;
        firstEventNo?: string | null;
        eventNo?: string | null;
      }
    >({
      query: ({ companyId, firstEventNo, eventNo }) => {
        const params = new URLSearchParams();
        params.append('companyId', String(companyId)); // Include only if non-null and non-zero
        if (firstEventNo) params.append('firstEventNo', String(firstEventNo)); // Include only if non-null and non-zero
        if (eventNo) params.append('eventNo', String(eventNo)); // Include only if non-null and non-zero

        return `getAll?${params.toString()}`;
      },

      //   `getAll?companyId=${companyId}&firstEventNo=${firstEventNo}&eventNo=${eventNo}`, //
      // providesTags: ['FixedTaskTemplateOptions'],
    }),
    createFixedTaskTemplate: builder.mutation<
      unknown,
      ICreateFixedTaskTemplate
    >({
      query: (objToSave) => ({
        url: 'createFixedTaskTemplate', // `${API_BASE_URL}/BiznessEventProcessConfiguration/process`,
        method: 'POST',
        body: objToSave,
      }),
      invalidatesTags: ['FixedTaskTemplateOptions'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFixedTaskTemplateComboOptionsQuery,
  useLazyGetFixedTaskTemplateComboOptionsQuery,
  useCreateFixedTaskTemplateMutation,
} = fixedTaskTemplateApi;
