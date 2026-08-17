import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface ICollectionNoComboBox {
  collectionId: string;
  collectionNo: string;
}

export interface ICollectionModeComboBox {
  collectionModeId: number;
  collectionModeName: string;
}

export interface ICollectionModeAllLocationComboBox {
  collectionModeId: string;
  collectionModeName: string;
}

export interface IGetCollectionInfoFilterDto {
  fromDate: string | null;
  toDate: string | null;
  buyerId: number | null;
  buyerGroupId: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  locationId: number | null;
  collectionModeId: number | null;
}

export interface ICollectionInfo {
  collectionId: string;
  buyerId: number;
  buyerName: string;
  buyerGroupId: number;
  buyerGroupName: string;
  collectionNo: string;
  collectionAgainst: string | null;
  collectionDate: string;
  collectedAmount: number | null;
  collectionModeId: number;
  collectionModeName: string;
  voucherId?: string | null;
}

export interface IChequeDetailInfo {
  chequeDetailId: string;
  collectionId: string;
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
  chequeAWBs?: IChequeAWB[] | null;
}

export interface IChequeAWB {
  chequeAWBId: number;
  collectionId: string;
  chequeNo: string;
  chequeAmount: number;
  chequeDate: string;
  bankId: number;
  adjustmentDate: string;
  buyerId: number;
  enteredBy: number;
  dateOfEntry: string;
  companyId: number;
  locationId: number;
}

export interface IChequeHistory {
  chequeHistoryId: number;
  chequeType: string;
  collectionId?: string | null;
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

export interface ICollectionProcessCommandsVM {
  //   createSalesOrderCommand?: ICreateSalesOrderCommand | null;
  updateCollectionCommand?: IUpdateCollectionCommand[] | null;
  deleteCollectionCommand?: IDeleteCollectionCommand[] | null;
  createChequeDetailCommand?: ICreateChequeDetailCommand[] | null;
  updateChequeDetailCommand?: IUpdateChequeDetailCommand[] | null;
  deleteChequeDetailCommand?: IDeleteChequeDetailCommand[] | null;

  // createChequeHistoryCommand?: ICreateChequeHistoryCommand[] | null;
  deleteChequeHistoryCommand?: IDeleteChequeHistoryCommand[] | null;
  // createChequeAWBCommand?: ICreateChequeAWBCommand[] | null;
  deleteChequeAWBCommand?: IDeleteChequeAWBCommand[] | null;

  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  collectionId?: string | null;
}

export interface IDeleteCollectionCommand {
  collectionId: string;
  buyerId: number;
}

export interface IUpdateCollectionCommand {
  collectionId: string;
  buyerId: number;
  date: string;
  collectionModeId: number;
  collectedAmount: number;
  voucherId: string | null;
}

export interface ICreateChequeDetailCommand {
  // ChequeNo, BankId, ChequeDate, ChequeAmount, CqdCollected(eita holo status, Null,S,H,D,B,,,, eitar upre ei table er baaki field er value chnge hobe)

  // chequeDetailId: number;
  collectionId: string;
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
  // createChequeAWBCommand?: ICreateChequeAWBCommand | null;
}

export interface IUpdateChequeDetailCommand {
  chequeDetailId: string;
  // collectionId: string;
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

export interface IDeleteChequeDetailCommand {
  chequeDetailId: string | null;
  collectionId: string | null; // ei duita rakha hoise to delete chequeHistory and chequeAWB too...
  chequeNo: string | null;
}

// export interface ICreateChequeHistoryCommand {
//   // chequeHistoryId: number;
//   chequeType: string;
//   collectionId: string;
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

export interface IDeleteChequeHistoryCommand {
  chequeHistoryId: number;
  collectionId?: string | null;
  chequeNo: string;
  buyerId: number;
  treatment: string;
  bankId: number;
  sendBankId: number | null;
  //   public Guid ChequeHistoryId { get; set; }
  // public Guid CollectionId { get; set; }
  // public string ChequeNo { get; set; }
  // public long BuyerId { get; set; }
  // public string Treatment { get; set; }
  // public long BankId { get; set; }
  // public long SendBankId { get; set; }
}

// export interface ICreateChequeAWBCommand {
//   // chequeAWBId: number;
//   collectionId: string;
//   chequeNo: string;
//   chequeAmount: number;
//   chequeDate: string;
//   bankId: number;
//   adjustmentDate: string;
//   buyerId: number;
//   enteredBy: number;
//   dateOfEntry: string;
//   companyId: number;
//   locationId: number;
// }

export interface IDeleteChequeAWBCommand {
  chequeAWBId: number;
  collectionId?: string | null;
}
