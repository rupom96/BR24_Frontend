export interface IProcurementTenderAdditionalCost {
  procurementTenderAdditionalCostId: number | null;
  name: string | null;
  description: string | null;
  percentage: number | null;
  amount: number | null;
  accountsId: number | null;
  accountsName: string | null;
}

export interface ICreateProcurementTenderAdditionalCostCommand {
  // procurementTender_AdditionalCostId: number;
  procurementTenderId: number | null;
  name: string;
  description: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
}

export interface IUpdateProcurementTenderAdditionalCostCommand {
  procurementTenderAdditionalCostId: number;
  procurementTenderId: number;
  name: string;
  description: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
}

export interface IDeleteProcurementTenderAdditionalCostCommand {
  procurementTenderAdditionalCostId: number;
}
