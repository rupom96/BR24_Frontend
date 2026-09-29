/* eslint-disable no-param-reassign */
import { createApi } from '@reduxjs/toolkit/query/react';

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
import {
  GetTenderCostingDto,
  TenderCostingCommandsVM,
  // TenderCostingWithPCTrackDto,
} from '../../domain/interfaces/TenderCostingInterface';
import { createAuthenticatedBaseQuery } from './shared/createAuthenticatedBaseQuery';

const controllerName: string = `ProcurementTender`;

// Define a service using a base URL and expected endpoints
export const TenderApiSlice = createApi({
  reducerPath: 'TenderApi',
  baseQuery: createAuthenticatedBaseQuery(controllerName),
  tagTypes: [
    'tenderOptions',
    'procurementTender',
    'procurementTenderDetail',
    'procurementTenderAdditionalCost',
    'tenderHistory',
    'tenderCostingInfo',
  ],
  endpoints: (builder) => ({
    getAllTenderNo: builder.query<ITenderNoComboBox[], void>({
      query: () => `getAllTenderNo`,
      providesTags: () => ['tenderOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getProcurementTenderByTenderId: builder.query<
      IProcurementTender[],
      { tenderId: number }
    >({
      query: ({ tenderId }) =>
        `getProcurementTenderByTenderId?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementTender'],
    }),
    getProcurementTenderDetailByTenderId: builder.query<
      IProcurementTenderDetail[],
      { tenderId: number }
    >({
      query: ({ tenderId }) =>
        `getProcurementTenderDetailByTenderId?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementTenderDetail'],
    }),
    getProcurementTenderAdditionalCostByTenderId: builder.query<
      IProcurementTenderAdditionalCost[],
      { tenderId: number }
    >({
      query: ({ tenderId }) =>
        `getProcurementTenderAdditionalCostByTenderId?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementTenderAdditionalCost'],
    }),

    getPreviousTenderHistoryByDateRange: builder.query<
      ITenderHistory,
      { fromDate: string; toDate: string }
    >({
      query: ({ fromDate, toDate }) =>
        `getPreviousTenderHistoryByDateRange?fromDate=${fromDate}&toDate=${toDate}`,

      transformResponse: (rawData: ITenderHistory) => {
        if (rawData.date) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // hour12: true,
          };
          const dateJs = new Date(rawData.date);
          const formattedDateTime = dateJs.toLocaleDateString('en-US', options);
          rawData.date = formattedDateTime;
        }

        if (rawData?.averageValue) {
          rawData.averageValue = parseFloat(rawData.averageValue.toFixed(2));
        }
        if (rawData?.lastTenderAmount) {
          rawData.lastTenderAmount = parseFloat(
            rawData.lastTenderAmount.toFixed(2)
          );
        }

        return rawData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['tenderHistory'],
    }),

    getTenderAnalysisReport: builder.query<any, { tenderNo: string }>({
      query: ({ tenderNo }) => `getTenderAnalysisReport?tenderNo=${tenderNo}`,

      // transformResponse: (rawData: ITenderHistory) => {
      //   if (rawData.date) {
      //     const options: Intl.DateTimeFormatOptions = {
      //       year: 'numeric',
      //       month: 'long',
      //       day: 'numeric',
      //       // hour: '2-digit',
      //       // minute: '2-digit',
      //       // hour12: true,
      //     };
      //     const dateJs = new Date(rawData.date);
      //     const formattedDateTime = dateJs.toLocaleDateString('en-US', options);
      //     rawData.date = formattedDateTime;
      //   }

      //   if (rawData?.averageValue) {
      //     rawData.averageValue = parseFloat(rawData.averageValue.toFixed(2));
      //   }
      //   if (rawData?.lastTenderAmount) {
      //     rawData.lastTenderAmount = parseFloat(
      //       rawData.lastTenderAmount.toFixed(2)
      //     );
      //   }

      //   return rawData;
      // },
      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: [],
    }),

    getTenderCosting: builder.query<GetTenderCostingDto, { tenderId: number }>({
      query: ({ tenderId }) => `getTenderCosting?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['tenderCostingInfo'],
    }),

    processSaveTender: builder.mutation<
      ITenderNoComboBox,
      IProcurementTenderProcessCommandsVM
    >({
      query: (objToProcess: IProcurementTenderProcessCommandsVM) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'tenderOptions',
        'procurementTender',
        'procurementTenderDetail',
        'procurementTenderAdditionalCost',
        'tenderHistory',
      ],
    }),
    updateProcurementTenderOnlyTenderWonAndRemarks: builder.mutation<
      unknown,
      IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand
    >({
      query: (
        objToUpdate: IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand
      ) => ({
        url: 'updateProcurementTenderOnlyTenderWonAndRemarks',
        method: 'POST',
        body: objToUpdate,
      }),
      invalidatesTags: [
        'tenderOptions',
        'procurementTender',
        'procurementTenderDetail',
        'procurementTenderAdditionalCost',
        'tenderHistory',
      ],
    }),

    processTenderCosting: builder.mutation<unknown, TenderCostingCommandsVM>({
      query: (objToUpdate: TenderCostingCommandsVM) => ({
        url: 'processTenderCosting',
        method: 'POST',
        body: objToUpdate,
      }),
      invalidatesTags: [
        'tenderOptions',
        'procurementTender',
        'procurementTenderDetail',
        'procurementTenderAdditionalCost',
        'tenderHistory',
        'tenderCostingInfo',
      ],
    }),

    // updateChequeBookCreateChequeBookDetail: builder.mutation<
    //   unknown,
    //   IUpdateChequeBookCommandsVM
    // >({
    //   query: (objToCreate: IUpdateChequeBookCommandsVM) => ({
    //     url: 'updateChequeBookCreateChequeBookDetail',
    //     method: 'POST',
    //     body: objToCreate,
    //   }),
    //   invalidatesTags: ['chequeBookDetailGrid'],
    // }),
    // // deleteChequeBookChequeBookDetail
    // deleteChequeBookChequeBookDetail: builder.mutation<
    //   unknown,
    //   IDeleteChequeBookCommandsVM
    // >({
    //   query: (objToDelete: IDeleteChequeBookCommandsVM) => ({
    //     url: 'deleteChequeBookChequeBookDetail',
    //     method: 'POST',
    //     body: objToDelete,
    //   }),
    //   invalidatesTags: ['chequeBookGrid', 'chequeBookDetailGrid'],
    // }),
    // cancelChequeBookDetail: builder.mutation<
    //   unknown,
    //   ICancelChequeBookDetailCommand
    // >({
    //   query: (objToCancel: ICancelChequeBookDetailCommand) => ({
    //     url: 'cancelChequeBookDetail',
    //     method: 'POST',
    //     body: objToCancel,
    //   }),
    //   invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    // }),
    // approveChequeBook: builder.mutation<unknown, IApproveChequeBookCommandsVM>({
    //   query: (objToApprove: IApproveChequeBookCommandsVM) => ({
    //     url: 'approveChequeBook',
    //     method: 'POST',
    //     body: objToApprove,
    //   }),
    //   invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTenderNoQuery,
  useGetProcurementTenderByTenderIdQuery,
  useGetProcurementTenderDetailByTenderIdQuery,
  useGetProcurementTenderAdditionalCostByTenderIdQuery,
  useGetPreviousTenderHistoryByDateRangeQuery,
  useGetTenderAnalysisReportQuery,
  useProcessSaveTenderMutation,
  useUpdateProcurementTenderOnlyTenderWonAndRemarksMutation,
  useGetTenderCostingQuery,
  useLazyGetTenderCostingQuery,
  useProcessTenderCostingMutation,
  // useGetChequeBookByBankLeafNoQuery,
  // useGetChequeBookDetailByChequeBookIdQuery,
  // useCreateChequeBookMutation,
  // useUpdateChequeBookCreateChequeBookDetailMutation,
  // useDeleteChequeBookChequeBookDetailMutation,
  // useCancelChequeBookDetailMutation,
  // useApproveChequeBookMutation,
} = TenderApiSlice;
