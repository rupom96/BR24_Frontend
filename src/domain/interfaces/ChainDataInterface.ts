export interface IEventTask {
  biznessEventPCTrackId: number;
  biznessEventProcessConfigurationId: number;
  eventNo: string;
  biznessEventId: number;
  biznessEventName: string;
  performedById: number;
  performedByName: string;
  performedByImage: string;
  startDate: string;
  endDate: string;
  firstEventNo: string;
  biznessEventFrequency: number;
  note: string;
  progressPReported: number;
  originalSequence: number;
  nextSequence: number;
  attachmentList: any | null;
  extendedBiznessEventId: string | null;
  extendedBiznessEventName: string[]; // Adjust type if needed
  notes: string;
  fixedTaskTemplateId?: null | number;
}

export interface IChain {
  id: string;
  fixedTaskTemplateId: number;
  fixedTaskTemplateName: string;
  firstEventNo: string;
  completeChain: boolean;
  tasks: IEventTask[];
}

export interface IFirstEventNo {
  biznessEvent_PCTrackId: number;
  firstEventNo: string;
}
export interface IEventNo {
  biznessEvent_PCTrackId: number;
  eventNo: string;
}
