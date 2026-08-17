/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IChequeLeafComboBox } from '../../domain/interfaces/ChequeLeafOptionsComboBox';
import {
  IApproveChequeBookCommandsVM,
  ICancelChequeBookDetailCommand,
  IChequeBook,
  IChequeBookCommandsVM,
  IDeleteChequeBookCommandsVM,
  IUpdateChequeBookCommandsVM,
} from '../../domain/interfaces/ChequeBookInterface';
import { IChequeBookDetail } from '../../domain/interfaces/ChequeBookDetailInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

// Import the JSON file directly

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `ChequeBook`;

// Define a service using a base URL and expected endpoints
export const ChequeBookApiSlice = createApi({
  reducerPath: 'ChequeBookApi',
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
  tagTypes: ['chequeBookOptions', 'chequeBookGrid', 'chequeBookDetailGrid'],
  endpoints: (builder) => ({
    getChequeLeafNoByBankId: builder.query<
      IChequeLeafComboBox[],
      { bankId: number }
    >({
      query: ({ bankId }) => `getChequeLeafNoByBankId?bankId=${bankId}`,
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getChequeBookByBankLeafNo: builder.query<
      IChequeBook[],
      {
        bankId: number | null;
        leafNoFrom: string;
        leafNoTo: string;
      }
    >({
      query: ({ bankId, leafNoFrom, leafNoTo }) =>
        `getChequeBookByBankLeafNo?bankId=${bankId}&leafFrom=${leafNoFrom}&leafTo=${leafNoTo}`,
      transformResponse: (rawData: IChequeBook[]) => {
        const transformedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // hour12: true,
          };

          let dateFormattedEntryDate: string | undefined = '';
          let dateFormattedApprovalDate: string | undefined = '';
          if (item.entryDate) {
            const tempDateJs = new Date(item.entryDate);
            dateFormattedEntryDate = tempDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          item.entryDate = dateFormattedEntryDate;
          if (item.approvalDate) {
            const tempDateJs = new Date(item.entryDate);
            dateFormattedApprovalDate = tempDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          item.approvalDate = dateFormattedApprovalDate;

          return item;
        });
        return transformedData;
      },
      //   providesTags: () => [], // Disable caching by always providing an empty array of tags
      //   providesTags: () => ['chequeBookGrid'],
      providesTags: () => ['chequeBookGrid'],
    }),
    getChequeBookDetailByChequeBookId: builder.query<
      IChequeBookDetail[],
      {
        chequeBookId: number;
      }
    >({
      query: ({ chequeBookId }) =>
        `getChequeBookDetailByChequeBookId?chequeBookId=${chequeBookId}`,
      transformResponse: (rawData: IChequeBookDetail[]) => {
        const transformedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // hour12: true,
          };

          let dateFormattedPaymentDate: string | undefined = '';

          if (item.paymentDate) {
            const tempDateJs = new Date(item.paymentDate);
            dateFormattedPaymentDate = tempDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          item.paymentDate = dateFormattedPaymentDate;

          return item;
        });
        return transformedData;
      },
      //   providesTags: () => [], // Disable caching by always providing an empty array of tags
      //   providesTags: () => ['chequeBookGrid'],
      providesTags: () => ['chequeBookDetailGrid'],
    }),
    createChequeBook: builder.mutation<unknown, IChequeBookCommandsVM>({
      query: (objToCreate: IChequeBookCommandsVM) => ({
        url: 'createChequeBookChequeBookDetail',
        method: 'POST',
        body: objToCreate,
      }),
      invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    }),
    updateChequeBookCreateChequeBookDetail: builder.mutation<
      unknown,
      IUpdateChequeBookCommandsVM
    >({
      query: (objToCreate: IUpdateChequeBookCommandsVM) => ({
        url: 'updateChequeBookCreateChequeBookDetail',
        method: 'POST',
        body: objToCreate,
      }),
      invalidatesTags: ['chequeBookDetailGrid'],
    }),
    // deleteChequeBookChequeBookDetail
    deleteChequeBookChequeBookDetail: builder.mutation<
      unknown,
      IDeleteChequeBookCommandsVM
    >({
      query: (objToDelete: IDeleteChequeBookCommandsVM) => ({
        url: 'deleteChequeBookChequeBookDetail',
        method: 'POST',
        body: objToDelete,
      }),
      invalidatesTags: ['chequeBookGrid', 'chequeBookDetailGrid'],
    }),
    cancelChequeBookDetail: builder.mutation<
      unknown,
      ICancelChequeBookDetailCommand
    >({
      query: (objToCancel: ICancelChequeBookDetailCommand) => ({
        url: 'cancelChequeBookDetail',
        method: 'POST',
        body: objToCancel,
      }),
      invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    }),
    approveChequeBook: builder.mutation<unknown, IApproveChequeBookCommandsVM>({
      query: (objToApprove: IApproveChequeBookCommandsVM) => ({
        url: 'approveChequeBook',
        method: 'POST',
        body: objToApprove,
      }),
      invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetChequeLeafNoByBankIdQuery,
  useGetChequeBookByBankLeafNoQuery,
  useGetChequeBookDetailByChequeBookIdQuery,
  useCreateChequeBookMutation,
  useUpdateChequeBookCreateChequeBookDetailMutation,
  useDeleteChequeBookChequeBookDetailMutation,
  useCancelChequeBookDetailMutation,
  useApproveChequeBookMutation,
} = ChequeBookApiSlice;
