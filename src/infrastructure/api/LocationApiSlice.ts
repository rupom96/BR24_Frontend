/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';

import {
  IProcurementTender,
  IProcurementTenderProcessCommandsVM,
  ITenderHistory,
  ITenderNoComboBox,
  IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand,
} from '../../domain/interfaces/ProcurementTenderInterface';
import { IProcurementTenderDetail } from '../../domain/interfaces/ProcurementTenderDetailInterface';
import { IProcurementTenderAdditionalCost } from '../../domain/interfaces/ProcurementTenderAdditionalCost';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ILocationDto } from '../../domain/interfaces/UserInfoInterface';

import { IPCLocationListDtos } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `Location`;

export interface IRequestPCLocationListDtos {
  code?: number | null;
  data?: IPCLocationListDtos[];
  exception?: any | null;
  messages?: any[] | null;
  succeeded?: boolean | null;
  validationErrors?: any | null;
}

// Define a service using a base URL and expected endpoints
export const LocationApiSlice = createApi({
  reducerPath: 'LocationApi',
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
  tagTypes: ['locationOptions'],
  endpoints: (builder) => ({
    getLocationByCompany: builder.query<
      IRequestPCLocationListDtos,
      { companyId: number }
    >({
      query: ({ companyId }) => `getLocationByCompany?companyId=${companyId}`,
      providesTags: () => ['locationOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetLocationByCompanyQuery,
  // useGetChequeBookByBankLeafNoQuery,
  // useGetChequeBookDetailByChequeBookIdQuery,
  // useCreateChequeBookMutation,
  // useUpdateChequeBookCreateChequeBookDetailMutation,
  // useDeleteChequeBookChequeBookDetailMutation,
  // useCancelChequeBookDetailMutation,
  // useApproveChequeBookMutation,
} = LocationApiSlice;
