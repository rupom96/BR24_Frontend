import { IDeleteBiznessEventPCTrackAttachmentCommand } from './BiznessEventPCTrackAttachmentInterfaces';

export interface IBiznessEventPCTrackVM {
  biznessEventPCTrackId: number;
  biznessEventProcessConfigurationId: number;
  firstEventNo?: string;
  eventNo?: string;
  biznessEventId?: number;
  biznessEventName?: string;
  performedById?: number;
  performedByName?: string;
  performedByImage?: string;
  startDate?: string;
  endDate?: string;
  note: string;
  progressPReported: number;
  originalSequence: number;
  nextSequence: number;
  biznessEventFrequency: number;
  attachmentList: IDeleteBiznessEventPCTrackAttachmentCommand[];
  extendedBiznessEventName?: string[];
  notes?: string | null;
}

export interface IBiznessEventPCTrackVMForTaskReporting {
  biznessEventPCTrackId: number;
  biznessEventProcessConfigurationId: number;
  firstEventNo?: string;
  eventNo?: string;
  biznessEventId?: number;
  biznessEventName?: string;
  performedById?: number;
  performedByName?: string;
  performedByImage?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  note: string;
  progressPReported: number;
  originalSequence: number;
  nextSequence: number;
  biznessEventFrequency: number;
  attachmentList: IDeleteBiznessEventPCTrackAttachmentCommand[];
}

export interface ICreateBiznessEventPCTrackCommand {
  biznessEventProcessConfigurationId: number;
  firstEventNo?: string;
  eventNo?: string;
  performedBy?: number;
  startDate?: string;
  endDate?: string;
  note: string;
  progressPReported: number;
  originalSequence: number;
  nextSequence: number;
  complete: boolean;
  locationId: number;
}
