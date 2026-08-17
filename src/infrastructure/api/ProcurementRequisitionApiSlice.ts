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
import { IProcurementRequisition } from '../../domain/interfaces/ProcurementRequisitionInterface';
import {
  IProcurementRequisitionCommandsVM,
  IPurchaseComparativeSheetGrid,
} from '../../domain/interfaces/PurchaseComparativeSheet';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `ProcurementRequisition`;

// Define a service using a base URL and expected endpoints
export const ProcurementRequisitionApiSlice = createApi({
  reducerPath: 'ProcurementRequisitionApi',
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
  tagTypes: ['requisitionOptions', 'procurementRequisitionComparativeInfo'],
  endpoints: (builder) => ({
    getRequisitionNoByCompanyLocationId: builder.query<
      IProcurementRequisition[],
      { companyId: number; locationId: number }
    >({
      query: ({ companyId, locationId }) =>
        `getRequisitionNoByCompanyLocationId?companyId=${companyId}&locationId=${locationId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['requisitionOptions'],
    }),
    getProcurementRequisitionComparativeInfoByRequisitionNo: builder.query<
      IPurchaseComparativeSheetGrid[],
      { requisitionNo: string }
    >({
      query: ({ requisitionNo }) =>
        `getProcurementRequisitionComparativeInfoByRequisitionNo?requisitionNo=${requisitionNo}`,
      transformResponse: (rawData: IPurchaseComparativeSheetGrid[]) => {
        rawData.forEach((element) => {
          if (element.requisitionNo && element.procurementRequisitionId) {
            const currentProcurementRequisitionNo = element.requisitionNo;
            const currentProcurementRequisitionId =
              element.procurementRequisitionId;

            const tempObj: IProcurementRequisition = {
              procurementRequisitionId: currentProcurementRequisitionId,
              requisitionNo: currentProcurementRequisitionNo,
            };
            element.mergedRequisitionNumbers = [];
            element.mergedRequisitionNumbers?.push(tempObj);
          }
        });
        return rawData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementRequisitionComparativeInfo'],
    }),

    processProcurementRequisition: builder.mutation<
      IProcurementRequisition,
      IProcurementRequisitionCommandsVM
    >({
      query: (objToProcess: IProcurementRequisitionCommandsVM) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'procurementRequisitionComparativeInfo',
        'requisitionOptions',
      ],
    }),

    // getProcurementTenderAdditionalCostByTenderId: builder.query<
    //   IProcurementTenderAdditionalCost[],
    //   { tenderId: number }
    // >({
    //   query: ({ tenderId }) =>
    //     `getProcurementTenderAdditionalCostByTenderId?tenderId=${tenderId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['procurementTenderAdditionalCost'],
    // }),

    // getPreviousTenderHistoryByDateRange: builder.query<
    //   ITenderHistory,
    //   { fromDate: string; toDate: string }
    // >({
    //   query: ({ fromDate, toDate }) =>
    //     `getPreviousTenderHistoryByDateRange?fromDate=${fromDate}&toDate=${toDate}`,

    //   transformResponse: (rawData: ITenderHistory) => {
    //     if (rawData.date) {
    //       const options: Intl.DateTimeFormatOptions = {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //         // hour: '2-digit',
    //         // minute: '2-digit',
    //         // hour12: true,
    //       };
    //       const dateJs = new Date(rawData.date);
    //       const formattedDateTime = dateJs.toLocaleDateString('en-US', options);
    //       rawData.date = formattedDateTime;
    //     }

    //     if (rawData?.averageValue) {
    //       rawData.averageValue = parseFloat(rawData.averageValue.toFixed(2));
    //     }
    //     if (rawData?.lastTenderAmount) {
    //       rawData.lastTenderAmount = parseFloat(
    //         rawData.lastTenderAmount.toFixed(2)
    //       );
    //     }

    //     return rawData;
    //   },
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['tenderHistory'],
    // }),

    // getTenderAnalysisReport: builder.query<any, { tenderNo: string }>({
    //   query: ({ tenderNo }) => `getTenderAnalysisReport?tenderNo=${tenderNo}`,
    //   providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   // providesTags: [],
    // }),

    // processSaveTender: builder.mutation<
    //   ITenderNoComboBox,
    //   IProcurementTenderProcessCommandsVM
    // >({
    //   query: (objToProcess: IProcurementTenderProcessCommandsVM) => ({
    //     url: 'process',
    //     method: 'POST',
    //     body: objToProcess,
    //   }),
    //   invalidatesTags: [
    //     'tenderOptions',
    //     'procurementTender',
    //     'procurementTenderDetail',
    //     'procurementTenderAdditionalCost',
    //     'tenderHistory',
    //   ],
    // }),
    // updateProcurementTenderOnlyTenderWonAndRemarks: builder.mutation<
    //   unknown,
    //   IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand
    // >({
    //   query: (
    //     commands: IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand
    //   ) => ({
    //     url: 'updateProcurementTenderOnlyTenderWonAndRemarks',
    //     method: 'POST',
    //     body: commands,
    //   }),
    //   invalidatesTags: [
    //     'tenderOptions',
    //     'procurementTender',
    //     'procurementTenderDetail',
    //     'procurementTenderAdditionalCost',
    //     'tenderHistory',
    //   ],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRequisitionNoByCompanyLocationIdQuery,
  useGetProcurementRequisitionComparativeInfoByRequisitionNoQuery,
  useProcessProcurementRequisitionMutation,
  //   useGetAllTenderNoQuery,
  //   useGetProcurementTenderByTenderIdQuery,
  //   useGetProcurementTenderDetailByTenderIdQuery,
  //   useGetProcurementTenderAdditionalCostByTenderIdQuery,
  //   useGetPreviousTenderHistoryByDateRangeQuery,
  //   useGetTenderAnalysisReportQuery,
  //   useProcessSaveTenderMutation,
  //   useUpdateProcurementTenderOnlyTenderWonAndRemarksMutation,
} = ProcurementRequisitionApiSlice;
