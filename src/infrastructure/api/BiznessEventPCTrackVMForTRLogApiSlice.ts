import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import dayjs from 'dayjs';
import {
  IBiznessEventPCTrackVM,
  IBiznessEventPCTrackVMForTaskReporting,
  ICreateBiznessEventPCTrackCommand,
} from '../../domain/interfaces/BiznessEventPCTrackVMInterface';
import {
  ICreateBiznessEventPCTrackAttachmentCommand,
  IDeleteBiznessEventPCTrackAttachmentCommand,
} from '../../domain/interfaces/BiznessEventPCTrackAttachmentInterfaces';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const API_BASE_URL = window.API_BASE_URL;

const controllerName: string = `BiznessEvent_PCTrack`;

export interface IBiznessEventPCTrackCommandsVM {
  createPCTrackCommand: ICreateBiznessEventPCTrackCommand;
  createPCTrackAttachmentCommand?: ICreateBiznessEventPCTrackAttachmentCommand[];
  deletePCTrackAttachmentCommand?: IDeleteBiznessEventPCTrackAttachmentCommand[];
}

// Define a service using a base URL and expected endpoints
export const BiznessEventPCTrackVMForTRLogApiSlice = createApi({
  reducerPath: 'BiznessEventPCTrackVMForTRLogApi',
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
  tagTypes: ['BiznessEventPCTrackVMForTRLog'],
  endpoints: (builder) => ({
    getBiznessEventPCTrackVMForTRLogByFirstEventNo: builder.query<
      IBiznessEventPCTrackVMForTaskReporting[],
      {
        firstEventNo: string;
        eventNo: string;
        biznessEventId: number;
        operationMode: string;
      }
    >({
      query: ({ firstEventNo, eventNo, biznessEventId, operationMode }) =>
        `getByFirstEventNo?firstEventNo=${firstEventNo}&type=${
          operationMode === 'preview'
            ? 'TaskReportingHistoryForPreview'
            : 'TaskReportingHistory'
        }&eventNo=${eventNo}&biznessEventId=${biznessEventId}`,

      // TaskReportingHistoryForPreview

      transformResponse: (rawData: IBiznessEventPCTrackVM[]) => {
        console.log('Task Report History---> Business Event PC Track VM');
        console.log(rawData);

        const transformedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };

          let dateFormatted;
          let startTimeFormatted;
          let endTimeFormatted;

          if (item.startDate) {
            const tempDateJs = new Date(item.startDate);
            dateFormatted = tempDateJs.toLocaleDateString('en-US', options);
            startTimeFormatted = dayjs(item.startDate).format('hh:mm A');
          }
          if (item.endDate) {
            endTimeFormatted = dayjs(item.endDate).format('hh:mm A');
          }

          return {
            biznessEventPCTrackId: item.biznessEventPCTrackId,
            biznessEventProcessConfigurationId:
              item.biznessEventProcessConfigurationId,
            firstEventNo: item.firstEventNo,
            eventNo: item.eventNo,
            biznessEventId: item.biznessEventId,
            biznessEventName: item.biznessEventName,
            performedById: item.performedById,
            performedByName: item.performedByName,
            performedByImage: item.performedByImage,
            date: dateFormatted,
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            note: item.note,
            progressPReported: item.progressPReported,
            originalSequence: item.originalSequence,
            nextSequence: item.nextSequence,
            biznessEventFrequency: item.biznessEventFrequency,
            attachmentList: item.attachmentList,
          };
        });
        return transformedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventPCTrackVMForTRLog'],
    }),
    processBiznessEventPCTrackVMForTR: builder.mutation<
      unknown,
      IBiznessEventPCTrackCommandsVM
    >({
      query: (objToSave: IBiznessEventPCTrackCommandsVM) => {
        console.log('API slice e gese----------------->>>>>>');
        console.log(objToSave);
        // console.log('Perfect Object structure to save');
        // console.log(objToSaveNew);

        return {
          url: 'process',
          method: 'Post',
          body: objToSave,
        };
      },
      invalidatesTags: ['BiznessEventPCTrackVMForTRLog'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBiznessEventPCTrackVMForTRLogByFirstEventNoQuery,
  useLazyGetBiznessEventPCTrackVMForTRLogByFirstEventNoQuery,
  useProcessBiznessEventPCTrackVMForTRMutation,
} = BiznessEventPCTrackVMForTRLogApiSlice;
