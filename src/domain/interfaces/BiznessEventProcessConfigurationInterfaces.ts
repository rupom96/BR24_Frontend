// import { IPCButtonListDto } from './FixedTaskTemplateInterface';

export interface IBiznessEventProcessConfiguration {
  biznessEventProcessConfigurationId?: number;
  fixedTaskTemplateId?: number;
  biznessEventId?: number;
  biznessEventName?: string;
  controllerPath?: string;
  controllerParameter?: string;
  sequence?: number;
  isAction?: boolean;
  actionType?: string;
  mailTemplate?: string;
  smsTemplate?: string;
  dateOfEntry?: string;
  enteredBy?: number;
  virtualId?: string;
}

// export interface IPCLocationListDtos {
//   biznessEventProcessConfigurationId?: number | null;
//   locationId: number;
//   locationName: string;
// }

// export interface IPCProductGroupListDtos {}

// export interface IPCBrandListDtos {
//   brandId: number;
//   brandName: string;
// }

// export interface IPCButtonListDtos {}

// export interface IPCUserListDtos {
//   biznessEventPCUserId?: number | null;
//   biznessEventProcessConfigurationId?: number | null;
//   biznessEventPCLocationId: number | null;
//   userId: number;
//   userName: string;
//   mandatory: boolean;
//   crud: string;
//   maxActionTimeinDays: number;
//   totalEventValueLimit: number;
//   pcUserBrandListDtos?: IPCUserBrandListDtos[];
//   pcUserProductGroupListDtos?: IPCUserProductGroupListDtos[];
//   pcButtonListDtos: IPCButtonListDto[];
// }

// export interface IPCUserProductGroupListDtos {
//   biznessEventPCUserId?: number | null;
//   productGroupId: number;
//   productGroupName: string;
// }

// export interface IPCUserBrandListDtos {}

// export interface IBiznessEventProcessConfigurationForConfig {
//   biznessEventProcessConfigurationId?: number;
//   fixedTaskTemplateId?: number;
//   biznessEventId?: number;
//   biznessEventName?: string;
//   mandatoryAttachment?: boolean | null;
//   controllerPath?: string;
//   controllerParameter?: string;
//   sequence?: number;
//   isAction?: boolean;
//   actionType?: string;
//   mailTemplate?: string;
//   smsTemplate?: string;
//   dateOfEntry?: string;
//   enteredBy?: number;
//   prevBiznessEventId?: number | null;
//   nextActionMethod?: string | null;
//   relationKey?: string | null;
//   maxTimeInHours?: number | null;
//   maxTimeInDays?: number | null;
//   extendedBiznessEventId?: string | null;
//   virtualId?: string | null;
//   pcLocationListDtos?: IPCLocationListDtos[];
//   pcProductGroupListDtos?: IPCProductGroupListDtos[];
//   pcBrandListDtos?: IPCBrandListDtos[];
//   pcUserListDtos?: IPCUserListDtos[];
//   pcUserProductGroupListDtos?: IPCUserProductGroupListDtos[];
//   pcUserBrandListDtos?: IPCUserBrandListDtos[];
//   pcUserProductListDtos?: IPCUserProductListDtos[];
// }

export interface IBiznessEventProcessConfigurationInfoForChainConfig {
  biznessEventProcessConfigurationId: number; //
  fixedTaskTemplateId: number; //
  biznessEventId: number; //
  biznessEventName: string | null;
  controllerPath: string | null;
  controllerParameter: string | null;
  sequence: number | null;
  mailTemplate: string | null;
  smsTemplate: string | null;
  dateOfEntry: string | null;
  enteredById: number | null;
  mandatoryAttachment: boolean | null;
  actionType: string | null;
  prevBiznessEventId: number | null;
  nextActionMethod: string | null;
  relationKey: string; //
  maxTimeInHours: number; //
  maxTimeInDays: number; //
  extendedBiznessEventId: string | null;
  pcLocationListDtos: IPCLocationListDtos[] | null;
  pcProductGroupListDtos: IPCProductGroupListDtos[] | null;
  pcBrandListDtos: IPCBrandListDto[] | null;
}
export interface IPCLocationListDtos {
  biznessEventPCLocationId?: number;
  biznessEventProcessConfigurationId?: number;
  locationId: number;
  locationName: string;
  pcUserListDtos?: IPCUserListDtos[];
}
export interface IPCUserListDtos {
  biznessEventPCLocationId?: number | null;
  biznessEventPCUserId?: number;
  biznessEventProcessConfigurationId?: number;
  userId: number;
  userName: string;
  mandatory?: boolean | null;
  crud?: string;
  maxActionTimeinDays?: number;
  totalEventValueLimit?: number;
  isAllPCUserProductGroupSelected?: boolean | null;
  isAllPCUserProductSelected?: boolean | null;
  isAllPCUserBrandSelected?: boolean | null;
  pcUserProductGroupListDtos?: IPCUserProductGroupListDtos[] | null;
  pcUserBrandListDtos?: IPCUserBrandListDtos[] | null;
  pcUserProductListDtos?: IPCUserProductListDto[] | null;
  pcButtonListDtos?: IPCButtonListDto[] | null;
}
export interface IPCUserProductGroupListDtos {
  biznessEventPCUserProductGroupId: number;
  biznessEventPCUserId: number;
  productGroupId: number;
  productGroupName: string;
  productValueLimit: number;
}
export interface IPCUserBrandListDtos {
  biznessEventPCUserBrandId: number;
  biznessEventPCUserId: number;
  brandId: number;
  brandName: string;
  brandValueLmit: number;
}
export interface IPCButtonListDto {
  biznessEventPCPageButtonAccessId: number;
  biznessEventPCPageGenActionId: number; // buttonId
  biznessEventPCPageGenActionName: string; // buttonName
  biznessEventPCUserId: number;
}
export interface IPCProductGroupListDtos {
  biznessEventProcessConfigurationId: number;
  biznessEventPCProductGroupId: number;
  productGroupId: number;
  productGroupName: string;
  productValueLimit: number;
}
export interface IPCBrandListDto {
  biznessEventProcessConfigurationId: number;
  biznessEventPCBrandId: number;
  brandId: number;
  brandName: string;
}
export interface IPCUserProductListDto {
  biznessEventPCUserProductId?: number | null;
  biznessEventPCUserId?: number | null;
  productId: number;
  productName: number;
  productValueLimit: number | null;
}

// ----------for processing in saving data for chain configuration-------------------
export interface IProcessConfigurationInfoForChainConfig {
  createBiznessEventProcessConfigurationInfoForChainConfig: ICreateBiznessEventProcessConfigurationInfoForChainConfig[];
  updateBiznessEventProcessConfigurationInfoForChainConfig: IUpdateBiznessEventProcessConfigurationInfoForChainConfig[];
  deleteBiznessEventProcessConfigurationInfoForChainConfig: IDeleteBiznessEventProcessConfigurationInfoForChainConfig[];

  createPCLocationListDtos: ICreatePCLocationListDtos[];
  deletePCLocationListDtos: IDeletePCLocationListDtos[];

  createPCProductGroupListDtos: ICreatePCProductGroupListDtos[];
  deletePCProductGroupListDtos: IDeletePCProductGroupListDtos[];

  createPCBrandListDto: ICreatePCBrandListDto[];
  deletePCBrandListDto: IDeletePCBrandListDto[];

  createPCUserListDtos: ICreatePCUserListDtos[];
  updatePCUserListDtos: IUpdatePCUserListDtos[];
  deletePCUserListDtos: IDeletePCUserListDtos[];

  createPCUserProductGroupListDtos: ICreatePCUserProductGroupListDtos[];
  updatePCUserProductGroupListDtos: IUpdatePCUserProductGroupListDtos[];
  deletePCUserProductGroupListDtos: IDeletePCUserProductGroupListDtos[];

  createPCUserBrandListDtos: ICreatePCUserBrandListDtos[];
  updatePCUserBrandListDtos: IUpdatePCUserBrandListDtos[];
  deletePCUserBrandListDtos: IDeletePCUserBrandListDtos[];

  createPCUserProductListDto: ICreatePCUserProductListDto[];
  updatePCUserProductListDto: IUpdatePCUserProductListDto[];
  deletePCUserProductListDto: IDeletePCUserProductListDto[];

  createPCButtonListDto: ICreatePCButtonListDto[];
  deletePCButtonListDto: IDeletePCButtonListDto[];
}

export interface ICreateBiznessEventProcessConfigurationInfoForChainConfig {
  // biznessEventProcessConfigurationId: number;
  fixedTaskTemplateId: number;
  biznessEventId: number;
  // biznessEventName: string | null;
  controllerPath: string | null;
  controllerParameter: string | null;
  sequence: number | null;
  mailTemplate: string | null;
  smsTemplate: string | null;
  dateOfEntry: string | null;
  enteredBy: number | null;
  mandatoryAttachment: boolean | null;
  actionType: string | null;
  prevBiznessEventId: number | null;
  nextActionMethod: string | null;
  relationKey: string;
  maxTimeInHours: number;
  maxTimeInDays: number;
  extendedBiznessEventId: string | null;

  createPCLocationListDtos: ICreatePCLocationListDtos[];
  // deletePCLocationListDtos: IDeletePCLocationListDtos[];

  createPCProductGroupListDtos: ICreatePCProductGroupListDtos[];
  // deletePCProductGroupListDtos: IDeletePCProductGroupListDtos[];

  createPCBrandListDto: ICreatePCBrandListDto[];
  // deletePCBrandListDto: IDeletePCBrandListDto[];
}

export interface IUpdateBiznessEventProcessConfigurationInfoForChainConfig {
  biznessEventProcessConfigurationId: number;
  // fixedTaskTemplateId: number;
  biznessEventId: number;
  // biznessEventName: string | null;
  controllerPath: string | null;
  controllerParameter: string | null;
  sequence: number | null;
  mailTemplate: string | null;
  smsTemplate: string | null;
  dateOfEntry: string | null;
  enteredBy: number | null;
  mandatoryAttachment: boolean | null;
  actionType: string | null;
  // prevBiznessEventId: number | null;
  // nextActionMethod: string | null;
  relationKey: string;
  maxTimeInHours: number;
  maxTimeInDays: number;
  extendedBiznessEventId: string | null;
}

export interface IDeleteBiznessEventProcessConfigurationInfoForChainConfig {
  biznessEventProcessConfigurationId: number;
}

export interface ICreatePCLocationListDtos {
  // biznessEventPCLocationId: number;
  biznessEventProcessConfigurationId: number | null;
  locationId: number;
  // locationName: string;
  createPCUserListDtos: ICreatePCUserListDtos[];
}

export interface IDeletePCLocationListDtos {
  biznessEventPCLocationId: number;
  // biznessEventProcessConfigurationId: number | null;
  // locationId: number;
  // locationName: string;
  // createPCUserListDtos: ICreatePCUserListDtos[];
}
export interface IDeletePCLocationListDtosVM {
  biznessEventPCLocationId: number;
  biznessEventProcessConfigurationId: number | null;
}

export interface ICreatePCUserListDtos {
  biznessEventPCLocationId?: number | null;
  // biznessEventPCUserId?: number;
  biznessEventProcessConfigurationId?: number | null;
  userId: number;
  // userName: string;
  mandatory?: boolean | null;
  crud?: string;
  maxActionTimeinDays?: number;
  totalEventValueLimit?: number;
  createPCUserProductGroupListDtos?: ICreatePCUserProductGroupListDtos[] | null;
  createPCUserBrandListDtos?: ICreatePCUserBrandListDtos[] | null;
  createPCUserProductListDtos?: ICreatePCUserProductListDto[] | null;
  createPCButtonListDtos?: ICreatePCButtonListDto[] | null;
}
export interface IUpdatePCUserListDtos {
  // biznessEventPCLocationId?: number | null;
  biznessEventPCUserId?: number;
  // biznessEventProcessConfigurationId?: number | null;
  // userId: number;
  // userName: string;
  mandatory?: boolean | null;
  crud?: string;
  maxActionTimeinDays?: number;
  totalEventValueLimit?: number;
  // createPCUserProductGroupListDtos?: ICreatePCUserProductGroupListDtos[] | null;
  // createPCUserBrandListDtos?: ICreatePCUserBrandListDtos[] | null;
  // createPCUserProductListDtos?: ICreatePCUserProductListDto[] | null;
  // createPCButtonListDtos?: IPCButtonListDto[] | null;
}

export interface IDeletePCUserListDtos {
  biznessEventPCUserId?: number;
}
export interface IDeletePCUserListDtosVM {
  biznessEventPCUserId: number;
  biznessEventPCLocationId: number;
}

export interface ICreatePCUserProductGroupListDtos {
  // biznessEventPCUserProductGroupId: number;
  biznessEventPCUserId?: number | null;
  productGroupId: number;
  // productGroupName: string;
  productValueLimit: number;
}

export interface IUpdatePCUserProductGroupListDtos {
  biznessEventPCUserProductGroupId: number;
  // biznessEventPCUserId?: number | null;
  // productGroupId: number;
  // productGroupName: string;
  productValueLimit: number | null;
}

export interface IDeletePCUserProductGroupListDtos {
  biznessEventPCUserProductGroupId: number;
  // biznessEventPCUserId?: number | null;
  // productGroupId: number;
  // productGroupName: string;
  // productValueLimit: number;
}
export interface IDeletePCUserProductGroupListDtosVM {
  biznessEventPCUserProductGroupId: number;
  biznessEventPCUserId: number;
}

export interface ICreatePCUserBrandListDtos {
  // biznessEventPCUserBrandId: number;
  biznessEventPCUserId?: number | null;
  brandId: number;
  // brandName: string;
  brandValueLmit: number | null;
}

export interface IUpdatePCUserBrandListDtos {
  biznessEventPCUserBrandId: number;
  // biznessEventPCUserId: number;
  // brandId: number;
  // brandName: string;
  brandValueLmit: number | null;
}

export interface IDeletePCUserBrandListDtos {
  biznessEventPCUserBrandId: number;
}
export interface IDeletePCUserBrandListDtosVM {
  biznessEventPCUserBrandId: number;
  biznessEventPCUserId: number;
}

export interface ICreatePCUserProductListDto {
  // biznessEventPCUserProdcutId?: number | null;
  biznessEventPCUserId?: number | null;
  productId: number;
  productValueLimit: number | null;
  // productName: number;
}

export interface IUpdatePCUserProductListDto {
  biznessEventPCUserProductId: number;
  // biznessEventPCUserId?: number | null;
  // productId: number;
  productValueLimit: number | null;
  // productName: number;
}

export interface IDeletePCUserProductListDto {
  biznessEventPCUserProductId?: number | null;
  // biznessEventPCUserId?: number | null;
  // productId: number;
  // productName: number;
}

export interface IDeletePCUserProductListDtoVM {
  biznessEventPCUserProductId: number;
  biznessEventPCUserId: number;
}

export interface ICreatePCButtonListDto {
  // biznessEventPCPageButtonAccessId: number;
  biznessEventPCUserId?: number | null;
  biznessEventPCPageGenActionId: number; // buttonId
  // biznessEventPCPageGenActionName: string; // buttonName
}

export interface IDeletePCButtonListDto {
  biznessEventPCPageButtonAccessId: number;
  //   biznessEventPCUserId?: number | null;
  //   biznessEventPCPageGenActionId: number; // buttonId
  //   biznessEventPCPageGenActionName: string; // buttonName
}
export interface IDeletePCButtonListDtoVM {
  biznessEventPCPageButtonAccessId: number;
  biznessEventPCUserId: number;
}

// export interface IUpdatePCLocationListDtos{

// }

export interface ICreatePCProductGroupListDtos {
  biznessEventProcessConfigurationId?: number | null;
  productGroupId: number;
  // productGroupName: string;
}
export interface IDeletePCProductGroupListDtos {
  biznessEventPCProductGroupId: number;
}
export interface IDeletePCProductGroupListDtosVM {
  biznessEventPCProductGroupId: number;
  biznessEventProcessConfigurationId: number;
}
// export interface IUpdatePCProductGroupListDtos{

// }

export interface ICreatePCBrandListDto {
  biznessEventProcessConfigurationId?: number | null;
  // biznessEventPCBrandId: number;
  brandId: number;
  // brandName: string;
}

export interface IDeletePCBrandListDto {
  biznessEventPCBrandId: number;
}
export interface IDeletePCBrandListDtoVM {
  biznessEventPCBrandId: number;
  biznessEventProcessConfigurationId: number;
}

// export interface IUpdatePCBrandListDto{
// }

// ----------for processing in saving data for chain configuration--------ENDS-----------

export interface IBiznessEventProcessConfigurationFirstPage {
  biznessEventProcessConfigurationId?: number;
  biznessEventId?: number;
  biznessEventName?: string;
  controllerPath?: string;
  actionType?: string;
  extendedBiznessEventName?: string[];
}

export interface ICreateBiznessEventProcessConfiguration {
  fixedTaskTemplateId: number;
  biznessEventId: number;
  controllerPath: string;
  controllerParameter: string;
  sequence: number;
  isAction: boolean;
  mailTemplate: string;
  smsTemplate: string;
  dateOfEntry: string;
  enteredBy: number;
}

export interface IUpdateBiznessEventProcessConfiguration {
  biznessEventProcessConfigurationId: number;
  fixedTaskTemplateId: number;
  biznessEventId: number;
  controllerPath: string;
  controllerParameter: string;
  sequence: number;
  isAction: boolean;
  mailTemplate: string;
  smsTemplate: string;
  dateOfEntry: string;
  enteredBy: number;
}
export interface IDeleteBiznessEventProcessConfiguration {
  biznessEventProcessConfigurationId: number;
}

export interface IProcessBiznessEventProcessConfiguration {
  createCommand: ICreateBiznessEventProcessConfiguration[];
  updateCommand: IUpdateBiznessEventProcessConfiguration[];
  deleteCommand: IDeleteBiznessEventProcessConfiguration[];
}

export interface IPermittedUsersAndLocation {
  locationId: number;
  locationName: string;
  userId: number;
  userName: string;
}
