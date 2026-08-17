/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  IBrand,
  IProductComboBox,
  IProductGroupComboBox,
} from '../../domain/interfaces/ProductInterfaces';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ISecurityUserDto } from '../../domain/interfaces/UserInfoInterface';
import { IPCUserListDtos } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';

// Import the JSON file directly

export interface IRequestISecurityUserDto {
  code?: number | null;
  data?: IPCUserListDtos[];
  exception?: any | null;
  messages?: any[] | null;
  succeeded?: boolean | null;
  validationErrors?: any | null;
}

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Login`;

// Define a service using a base URL and expected endpoints
export const SecurityUserApiSlice = createApi({
  reducerPath: 'SecurityUserApi',
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
  tagTypes: ['securityUserOptions'],
  endpoints: (builder) => ({
    getSecurityUserByCompanyId: builder.query<
      IRequestISecurityUserDto,
      { companyId: number; locationId: number }
    >({
      query: ({ companyId, locationId }) =>
        `getSecurityUserByCompanyId?companyId=${companyId}&locationId=${locationId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSecurityUserByCompanyIdQuery } = SecurityUserApiSlice;
