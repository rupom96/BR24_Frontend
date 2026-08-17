export interface ISANextEvent {
  fixedTaskTemplateId: number;
  fixedTaskTemplateName: string;
  biznessEventId: number;
  biznessEventName: string;
  controllerPath: string;
  controllerPathType?: string | null;
  sequence: number;
  eventNo: string;
  firstEventNo: string;
  firstEventPerformedBy: string;
  biznessEventProcessConfigurationId: number;
  assignedDate: string;
  dueDate: string;
  actionType: string;
  biznessEventFrequency: number;
  eventLocationName: string;
  eventLocationId: number;
  extendedBiznessEventName: string[];
}

export interface IEventStatusInfoForNextEvent {
  optionNo: string; // eventNo hobe eita ekshomoy..
  optionId: number;
  optionName: string;
  type: string;
  amount: number;
  limit: number;
  isAmountWithinLimit: boolean;
  isPermitted: boolean;
  isValid: boolean;
}
