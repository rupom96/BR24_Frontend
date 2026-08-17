import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface ISalesReturnNoComboBox {
  salesReturnNo: string;
  salesReturnId: string;
}

export interface ISalesReturn {
  salesReturnId: string;
  salesReturnNo: string;
  salesReturnDate: string;
  buyerId: number;
  buyerName: string;
  remarks: string;
}

export interface ISalesReturnNoAndBuyerOptions {
  buyerId?: number | null;
  buyerName?: string | null;
  salesReturnId?: number | null;
  salesReturnNo?: string | null;
}

export interface IGetSalesReturnInfoFilterDto {
  // paymentModeId: number | null;
  buyerId: number | null;
  fromDate: string | null;
  toDate: string | null;
  taxOver: number | null;
  taxUnder: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  locationId: number | null;
  salesReturnId: string | null;
}

export interface ISalesReturnInfo {
  salesReturnId: string;
  salesReturnNo: string;
  dateOfEntry: string;
  buyerId: number;
  buyerName: string;
  totalAmount: number | null;
  vat: number | null;
  tax: number | null;
  locationId?: number | null;
  remarks?: string | null;
  voucherId?: string | null;
}

export interface ISalesReturnDetailInfo {
  salesReturnId: string;
  salesReturnDetailId: string;
  salesOrderId: string | null;
  // LSalesNo?: string | null;
  productId: number | null;
  productName: string;
  // locationId: number | null;
  price: number | null;
  quantity: number | null;
  taxAmount?: number | null;
  taxRowId?: number | null;
  vatAmount?: number | null;
  vatRowId?: number | null;
  isSerialProduct?: boolean;
  salesReturnDetailSerialInfoDto: ISalesReturnDetailSerialInfo[];
  unitTypeId: number;
}

export interface ISalesReturnDetailSerialInfo {
  salesReturnId?: string | null;
  salesReturnDetailId?: string | null;
  salesReturnDetailSerialId?: string | null;
  productId: string;
  productName: number;
  serialNo: string;
}

export interface ISalesReturnProcessCommandsVM {
  //   createSalesReturnCommand?: ICreateSalesReturnCommand | null;
  updateSalesReturnCommand?: IUpdateSalesReturnCommand[] | null;
  deleteSalesReturnCommand?: IDeleteSalesReturnCommand[] | null;
  createSalesReturnDetailCommand?: ICreateSalesReturnDetailCommand[] | null;
  updateSalesReturnDetailCommand?: IUpdateSalesReturnDetailCommand[] | null;
  deleteSalesReturnDetailCommand?: IDeleteSalesReturnDetailCommand[] | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  salesReturnId?: string | null;
  salesOrderNo?: string | null;

  createSalesReturnDetailSerialCommand?:
    | ICreateSalesReturnDetailSerialCommand[]
    | null;
  deleteSalesReturnDetailSerialCommand?:
    | IDeleteSalesReturnDetailSerialCommand[]
    | null;
  createSalesReturnDetail_TaxCommand?:
    | ICreateSalesReturnDetailTaxCommand[]
    | null;
  updateSalesReturnDetail_TaxCommand?:
    | IUpdateSalesReturnDetailTaxCommand[]
    | null;
  deleteSalesReturnDetail_TaxCommand?:
    | IDeleteSalesReturnDetailTaxCommand[]
    | null;
}

export interface IDeleteSalesReturnCommand {
  salesReturnId: string;
}

export interface IUpdateSalesReturnCommand {
  salesReturnId: string;
  totalAmount?: number | null;
  // totalAdditionalCost?: number | null;
  buyerId?: number | null;
  voucherId?: string | null;
  // remarks?: string | null;
}

export interface ICreateSalesReturnDetailCommand {
  // salesReturnDetailId: number;
  salesReturnId: string | null;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  salesOrderId: string | null;
  // taxAmount?: number | null;
  // vatAmount?: number | null; //grey area
  createSalesReturnDetailSerialCommand?: ICreateSalesReturnDetailSerialCommand[];
  createSalesReturnDetail_TaxCommand?: ICreateSalesReturnDetailTaxCommand[];
  unitTypeId: number;
  // companyId: number;
  locationId: number;
  // discount?: number | null;
}

export interface IUpdateSalesReturnDetailCommand {
  salesReturnDetailId: string;
  // salesReturnId: string;
  // salesOrderId: string | null;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  unitTypeId: number;
  // discount?: number | null;
  // locationId: number | null;
  // createSalesReturnDetailSerialCommand?: ICreateSalesReturnDetailSerialCommand[];
}

export interface IDeleteSalesReturnDetailCommand {
  salesReturnDetailId: string;
  salesReturnId?: string | null;
}

export interface ICreateSalesReturnDetailSerialCommand {
  salesReturnId: string;
  salesReturnDetailId?: string | null;
  serialNo: string;
}

export interface IDeleteSalesReturnDetailSerialCommand {
  salesReturnDetailSerialId: string;
  salesReturnId?: string;
}

export interface ICreateSalesReturnDetailTaxCommand {
  salesReturnDetailId?: string | null;
  taxId: number;
  taxAmount: number;
}

export interface IUpdateSalesReturnDetailTaxCommand {
  salesReturnDetail_TaxId?: number | null;
  // taxId: number;
  taxAmount: number;
}

export interface IDeleteSalesReturnDetailTaxCommand {
  salesReturnDetail_TaxId?: number | null;
  // taxId: number;
  // taxAmount: number;
  salesReturnId?: string | null;
}
/// puran gula-----------------------

// export interface ISalesReturnAdditionalCost {
//   salesReturnAdditionalCostId: number | null;
//   name: string | null;
//   description: string | null;
//   percentage: number | null;
//   amount: number | null;
//   accountsId: number | null;
//   accountsName: string | null;
// }

// export interface ICreateSalesReturnAdditionalCostCommand {
//   // salesReturn_AdditionalCostId: number;
//   salesReturnId: number | null;
//   name: string;
//   description: string | null;
//   accountsId: number | null;
//   percentage: number | null;
//   amount: number | null;
// }

// export interface IUpdateSalesReturnAdditionalCostCommand {
//   salesReturnAdditionalCostId: number;
//   salesReturnId: number;
//   name: string;
//   description: string | null;
//   accountsId: number | null;
//   percentage: number | null;
//   amount: number | null;
// }

// export interface IDeleteSalesReturnAdditionalCostCommand {
//   salesReturnAdditionalCostId: number;
// }
