import { IChequeBookDetail } from './ChequeBookDetailInterface';

export interface IChequeBook {
  chequeBookId: number;
  bankId: number;
  bankName: string;
  leafSerialFrom: string;
  leafSerialTo: string;
  totalLeafCount: number;
  enteredById: number;
  enteredByName: string;
  enteredByImage: string | null;
  entryDate: string;
  approved: string | null;
  approvedById: number | null;
  approvedByName: string | null;
  approvedByImage: string | null;
  approvalDate: string | null;
  status: string;
}

export interface ICreateChequeBook {
  chequeBookId: number | null;
  bankId: number;
  leafSerialFrom: string;
  leafSerialTo: string;
  totalLeafCount: number;
  enterdBy: number;
  entryDate: string;
  approved: string | null;
  approvedBy: number | null;
  approvalDate: number | null;
}

export interface ICreateChequeBookDetail {
  chequeBookDetailId: number | null;
  chequeBookId: number | null;
  chequeLeafNo: string;
  used: string | null;
  vendorId: number | null;
}

export interface IChequeBookCommandsVM {
  createChequeBookCommand: ICreateChequeBook;
  createChequeBookDetailCommand: ICreateChequeBookDetail[];
}

export interface IUpdateChequeBookCommand {
  chequeBookId: number;
  leafSerialTo: string;
  totalLeafCount: number;
  enterdBy: number;
  entryDate: string | null;
}

export interface IUpdateChequeBookCommandsVM {
  updateChequeBookCommand: IUpdateChequeBookCommand;
  createChequeBookDetailCommand: ICreateChequeBookDetail[];
}

export interface IDeleteChequeBookCommand {
  chequeBookId: number;
}
export interface IDeleteChequeBookDetailByChequeBookIdCommand {
  chequeBookId: number;
}
export interface IDeleteChequeBookCommandsVM {
  deleteChequeBookCommand: IDeleteChequeBookCommand;
  deleteChequeBookDetailCommand: IDeleteChequeBookDetailByChequeBookIdCommand[];
}

export interface ICancelChequeBookDetailCommand {
  chequeBookDetailId: number;
}

export interface IApproveChequeBookCommand {
  chequeBookId: number;
  approvedBy: number;
}
export interface IApproveChequeBookCommandsVM {
  approveChequeBookCommand: IApproveChequeBookCommand;
  // createChequeInventoryCommand: any[];
}
