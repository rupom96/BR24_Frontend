export interface ISDEAccMapping {
  sdeAccMappingId: number | null;
  sourceCompanyId: number | null;
  sourceAccId: number | null;
  sourceAccName: string | null;
  destinationAccId: number | null;
  destinationAccName: string | null;
  selectedDataExportConfigurationId: number | null;
}

export interface ICreateSDEAccMapping {
  // sdeAccMappingId: number | null;
  sourceCompanyId: number;
  sourceAccId: number;
  destinationAccId: number | null;
  selectedDataExportConfigurationId: number | null;
}

export interface IUpdateSDEAccMapping {
  sdeAccMappingId: number | null;
  sourceCompanyId: number;
  sourceAccId: number;
  destinationAccId: number | null;
  // selectedDataExportConfigurationId: number | null;
}

export interface IDeleteSDEAccMapping {
  sdeAccMappingId: number;
}
