// export interface IDataMigrationSales {
//   paymentModeId?: number | null;
//   buyerGroupId?: number | null;
//   productGroupId?: string | null;
//   amountRange1Min?: number | null;
//   amountRange1Max?: number | null;
//   amountRange2Min?: number | null;
//   amountRange2Max?: number | null;
//   amountRange3Min?: number | null;
//   amountRange3Max?: number | null;
//   amountRange4Min?: number | null;
//   amountRange4Max?: number | null;
//   updateBy?: number;
//   dateOfEntry?: string | null;
//   bankId?: number | null;
//   eventTypeId?: number | null;
//   supplierGroupId?: number | null;
// }

import {
  ICreateSDEAccMapping,
  IDeleteSDEAccMapping,
  ISDEAccMapping,
  IUpdateSDEAccMapping,
} from './SDEAccMappingInterface';

export interface ISDEConfiguration {
  selectedDataExportConfigurationId?: number | null;
  companyId?: number | null;
  biznessEventId: number;
  paymentModeId?: string | null;
  buyerGroupId?: string | null;
  productGroupId?: string | null;
  amountRange1Min?: number | null;
  amountRange1Max?: number | null;
  amountRange2Min?: number | null;
  amountRange2Max?: number | null;
  amountRange3Min?: number | null;
  amountRange3Max?: number | null;
  amountRange4Min?: number | null;
  amountRange4Max?: number | null;
  // updateBy: number;
  // dateOfEntry?: string | null;
  bankId?: string | null;
  eventTypeId?: string | null;
  supplierGroupId?: string | null;
  sdeAccMappingRows?: ISDEAccMapping[];
}

export interface ICreateSDEConfigurationCommand {
  companyId: number;
  biznessEventId: number;
  paymentModeId?: string | null;
  buyerGroupId?: string | null;
  productGroupId?: string | null;
  amountRange1Min?: number | null;
  amountRange1Max?: number | null;
  amountRange2Min?: number | null;
  amountRange2Max?: number | null;
  amountRange3Min?: number | null;
  amountRange3Max?: number | null;
  amountRange4Min?: number | null;
  amountRange4Max?: number | null;
  updateBy: number;
  dateOfEntry?: string | null;
  bankId?: string | null;
  eventTypeId?: string | null;
  supplierGroupId?: string | null;
  // createSDEAccMapping?: ICreateSDEAccMapping[];
}
export interface IUpdateSDEConfigurationCommand {
  selectedDataExportConfigurationId: number;
  companyId: number | null;
  biznessEventId: number | null;
  paymentModeId?: string | null;
  buyerGroupId?: string | null;
  productGroupId?: string | null;
  amountRange1Min?: number | null;
  amountRange1Max?: number | null;
  amountRange2Min?: number | null;
  amountRange2Max?: number | null;
  amountRange3Min?: number | null;
  amountRange3Max?: number | null;
  amountRange4Min?: number | null;
  amountRange4Max?: number | null;
  updateBy: number;
  // dateOfEntry?: string | null;
  bankId?: string | null;
  eventTypeId?: string | null;
  supplierGroupId?: string | null;
  // createSDEAccMapping?: ICreateSDEAccMapping[];
  // updateSDEAccMapping?: IUpdateSDEAccMapping[];
  // deleteSDEAccMapping?: IDeleteSDEAccMapping[];
}

export interface IProcessSDEConfigurationCommand {
  createCommand?: ICreateSDEConfigurationCommand | null;
  updateCommand?: IUpdateSDEConfigurationCommand | null;
  createSDEAccMapping?: ICreateSDEAccMapping[] | null;
  updateSDEAccMapping?: IUpdateSDEAccMapping[] | null;
  deleteSDEAccMapping?: IDeleteSDEAccMapping[] | null;
}

export interface ISDElog {
  selectedDataExportLogId?: number | null;
  sdE_ConfigurationId?: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  processStartTime: string | null;
  processEndTime: string | null;
}
