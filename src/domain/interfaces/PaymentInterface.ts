import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface IPaymentNoComboBox {
  paymentId: number;
  paymentNo: string;
}

export interface IPaymentModeComboBox {
  paymentModeId: number;
  paymentModeName: string;
}

export interface IPaymentModeAllLocationComboBox {
  paymentModeId: string;
  paymentModeName: string;
}

export interface IGetPaymentInfoFilterDto {
  fromDate: string | null;
  toDate: string | null;
  supplierId: number | null;
  supplierGroupId: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  locationId: number | null;
  paymentModeId: number | null;
}

export interface IPaymentInfo {
  paymentId: number;
  supplierId: number;
  supplierName: string;
  supplierGroupId: number;
  supplierGroupName: string;
  paymentNo: string;
  paymentAgainst: string | null;
  paymentDate: string;
  paidAmount: number | null;
  paymentModeId: number;
  paymentModeName: string;
  voucherId?: string | null;
}

export interface IChequeDetailPaymentInfo {
  chequeDetailPaymentId: string;
  paymentId: number;
  chequeNo: string;
  bankId: number | null;
  bankName: string;
  chequeDate: string;
  chequeAmount: number | null;
  cqdCollected?: string | null;
  sendDate?: string | null;
  honorDate?: string | null;
  date?: string | null;
  dateOfEntry: string;
  sendBankId?: number | null;
  sendBankName?: string | null;
  disreason?: string | null;
  remarks?: string | null;

  chequeHistories?: IChequeHistory[] | null;
  chequeAWBPayments?: IChequeAWBPayment[] | null;
}

export interface IChequeAWBPayment {
  chequeAWBPaymentId: number;
  paymentId: number;
  chequeNo: string;
  chequeAmount: number;
  chequeDate: string;
  bankId: number;
  adjustmentDate: string;
  supplierId: number;
  enteredBy: number;
  dateOfEntry: string;
  companyId: number;
  locationId: number;
}

export interface IChequeHistory {
  chequeHistoryId: number;
  chequeType: string;
  paymentId?: number | null;
  // paymentId?: number | null;
  chequeNo: string;
  chequeDate: string;
  bankId: number;
  bankName?: string | null;
  treatment: string;
  treatmentDate: string;
  sendBankId?: number | null;
  sendBankName?: string | null;
  date: string;
  enteredBy: number;
  dateOfEntry: string;
  voucherId?: string | null;
}

export interface IPaymentProcessCommandsVM {
  //   createSalesOrderCommand?: ICreateSalesOrderCommand | null;
  updatePaymentCommand?: IUpdatePaymentCommand[] | null;
  deletePaymentCommand?: IDeletePaymentCommand[] | null;
  createChequeDetailPaymentCommand?: ICreateChequeDetailPaymentCommand[] | null;
  updateChequeDetailPaymentCommand?: IUpdateChequeDetailPaymentCommand[] | null;
  deleteChequeDetailPaymentCommand?: IDeleteChequeDetailPaymentCommand[] | null;

  // createChequeHistoryCommand?: ICreateChequeHistoryCommand[] | null;
  deleteChequeHistoryPaymentCommand?:
    | IDeleteChequeHistoryPaymentCommand[]
    | null;
  // createChequeAWBPaymentCommand?: ICreateChequeAWBPaymentCommand[] | null;
  deleteChequeAWBPaymentCommand?: IDeleteChequeAWBPaymentCommand[] | null;

  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  paymentId?: number | null;
}

export interface IDeletePaymentCommand {
  paymentId: number;
  supplierId: number;
}

export interface IUpdatePaymentCommand {
  paymentId: number;
  supplierId: number;
  date: string;
  paymentModeId: number;
  paidAmount: number;
  voucherId: string | null;
}

export interface ICreateChequeDetailPaymentCommand {
  // ChequeNo, BankId, ChequeDate, ChequeAmount, CqdCollected(eita holo status, Null,S,H,D,B,,,, eitar upre ei table er baaki field er value chnge hobe)

  // chequeDetailPaymentId: number;
  paymentId: number;
  chequeNo: string;
  bankId: number;
  chequeDate: string;
  chequeAmount: number | null;
  cqdCollected: string | null;
  sendDate: string | null;
  honorDate: string | null;
  date: string | null;
  sendBankId: number | null;
  dateofentry: string;
  disreason: string | null;
  remarks: string | null;
  // createChequeHistoryCommand?: ICreateChequeHistoryCommand | null;
  // createChequeAWBPaymentCommand?: ICreateChequeAWBPaymentCommand | null;
}

export interface IUpdateChequeDetailPaymentCommand {
  chequeDetailPaymentId: string;
  // paymentId: number;
  chequeNo: string;
  bankId: number;
  chequeDate: string;
  chequeAmount: number | null;
  cqdCollected: string | null;
  sendDate: string | null;
  honorDate: string | null;
  date: string | null;
  sendBankId: number | null;
  // dateofentry: string;
  disreason: string | null;
  remarks: string | null;
}

export interface IDeleteChequeDetailPaymentCommand {
  chequeDetailPaymentId: string | null;
  paymentId: number | null; // ei duita rakha hoise to delete chequeHistory and chequeAWBPayment too...
  chequeNo: string | null;
}

// export interface ICreateChequeHistoryCommand {
//   // chequeHistoryId: number;
//   chequeType: string;
//   paymentId: number;
//   chequeNo: string;
//   chequeDate: string;
//   bankId: number;
//   treatment: string;
//   treatmentDate: string;
//   sendBankId?: number | null;
//   date: string;
//   enteredBy: number;
//   dateOfEntry: string;
//   voucherId?: string | null;
// }

export interface IDeleteChequeHistoryPaymentCommand {
  chequeHistoryId: number;
  paymentId?: number | null;
  chequeNo: string;
  supplierId: number;
  treatment: string;
  bankId: number;
  sendBankId: number | null;
  //   public Guid ChequeHistoryId { get; set; }
  // public Guid PaymentId { get; set; }
  // public string ChequeNo { get; set; }
  // public long SupplierId { get; set; }
  // public string Treatment { get; set; }
  // public long BankId { get; set; }
  // public long SendBankId { get; set; }
}

// export interface ICreateChequeAWBPaymentCommand {
//   // chequeAWBPaymentId: number;
//   paymentId: number;
//   chequeNo: string;
//   chequeAmount: number;
//   chequeDate: string;
//   bankId: number;
//   adjustmentDate: string;
//   supplierId: number;
//   enteredBy: number;
//   dateOfEntry: string;
//   companyId: number;
//   locationId: number;
// }

export interface IDeleteChequeAWBPaymentCommand {
  chequeAWBPaymentId: number;
  paymentId?: number | null;
}
