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
import {
  GetTenderExpenseForSalesPersonDto,
  TenderExpenseForSalesPersonCommandsVM,
} from '../../domain/interfaces/TenderExpenseForSalesPersonInterface';
import { createAuthenticatedBaseQuery } from './shared/createAuthenticatedBaseQuery';

const controllerName: string = `ProcurementTender`;

export type TenderApprovalTopSheetDownload = {
  blob: Blob;
  fileName: string;
};

async function parseBlobErrorData(
  data: unknown
): Promise<{ title?: string; [key: string]: unknown }> {
  if (data instanceof Blob) {
    const text = await data.text();
    try {
      return JSON.parse(text);
    } catch {
      return { title: text || 'Download failed' };
    }
  }
  if (typeof data === 'object' && data !== null) {
    return data as { title?: string };
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return { title: data };
    }
  }
  return { title: 'Download failed' };
}

function fileNameFromContentDisposition(
  header: string | null | undefined,
  fallback: string
): string {
  if (!header) return fallback;
  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(header);
  if (plain?.[1]) return plain[1].trim().replace(/^"|"$/g, '');
  return fallback;
}

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
    'tenderExpenseForSalesPerson',
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

    getTenderExpenseForSalesPerson: builder.query<
      GetTenderExpenseForSalesPersonDto,
      { procurementTenderId: number }
    >({
      query: ({ procurementTenderId }) =>
        `getTenderExpenseForSalesPerson?procurementTenderId=${procurementTenderId}`,
      providesTags: ['tenderExpenseForSalesPerson'],
    }),

    processTenderExpenseForSalesPerson: builder.mutation<
      unknown,
      TenderExpenseForSalesPersonCommandsVM
    >({
      query: (objToProcess: TenderExpenseForSalesPersonCommandsVM) => ({
        url: 'ProcessTenderExpenseForSalesPerson',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: ['tenderExpenseForSalesPerson'],
    }),

    /** Binary .xlsx download — errors arrive as ProblemDetails JSON (may be Blob). */
    getTenderApprovalTopSheet: builder.query<
      TenderApprovalTopSheetDownload,
      { tenderNo: string }
    >({
      async queryFn({ tenderNo }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `getTenderApprovalTopSheet?TenderNo=${encodeURIComponent(tenderNo)}`,
          responseHandler: (response) => response.blob(),
        });

        if (result.error) {
          const parsed = await parseBlobErrorData(result.error.data);
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: String(parsed.title || 'Download failed'),
              data: parsed,
            },
          };
        }

        const blob = result.data as Blob;
        const response = (
          result.meta as { response?: Response } | undefined
        )?.response;
        const contentType = response?.headers?.get('content-type') || '';

        // Safety: some proxies return JSON with a non-error status
        if (contentType.includes('application/json')) {
          const parsed = await parseBlobErrorData(blob);
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: String(parsed.title || 'Download failed'),
              data: parsed,
            },
          };
        }

        const disposition = response?.headers?.get('content-disposition');
        const safeNo = tenderNo.replace(/[^\w.-]+/g, '_');
        const fileName = fileNameFromContentDisposition(
          disposition,
          `TenderApprovalTopSheet_${safeNo}.xlsx`
        );

        return { data: { blob, fileName } };
      },
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
  useGetTenderExpenseForSalesPersonQuery,
  useLazyGetTenderExpenseForSalesPersonQuery,
  useProcessTenderExpenseForSalesPersonMutation,
  useLazyGetTenderApprovalTopSheetQuery,
  // useGetChequeBookByBankLeafNoQuery,
  // useGetChequeBookDetailByChequeBookIdQuery,
  // useCreateChequeBookMutation,
  // useUpdateChequeBookCreateChequeBookDetailMutation,
  // useDeleteChequeBookChequeBookDetailMutation,
  // useCancelChequeBookDetailMutation,
  // useApproveChequeBookMutation,
} = TenderApiSlice;
