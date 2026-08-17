export interface ICostSheetDetail {
  costSheetDetailId: number | null;
  costSheetId: number;
  name: string | null;
  accountsId: number | null;
  accountsName: string | null;
  percentage: number | null;
  amount: number | null;
  groupName: string;
}

export interface ICreateCostSheetDetailCommand {
  costSheetId: number;
  name: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
  groupName: string | null;
}

export interface IUpdateCostSheetDetailCommand {
  costSheetDetailId: number;
  costSheetId: number;
  name: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
  groupName: string | null;
}

export interface IDeleteCostSheetDetailCommand {
  costSheetDetailId: number;
}

export interface ICostSheetDetailCommandsVM {
  createCommand: ICreateCostSheetDetailCommand[];
  updateCommand: IUpdateCostSheetDetailCommand[];
  deleteCommand: IDeleteCostSheetDetailCommand[];
}

export interface IUpdateCostSheetOtherExpensesCommand {
  costSheetId: number;
  otherExpenses: number;
}

export interface ICostSheetDetailWithTotalAmountCommandsVM {
  createCommand: ICreateCostSheetDetailCommand[];
  updateCommand: IUpdateCostSheetDetailCommand[];
  deleteCommand: IDeleteCostSheetDetailCommand[];
  updateCostSheetCommand: IUpdateCostSheetOtherExpensesCommand;
}
