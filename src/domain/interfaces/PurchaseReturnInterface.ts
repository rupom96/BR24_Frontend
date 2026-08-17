import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface IPurchaseReturnNoComboBox {
  purchaseReturnNo: string;
  purchaseReturnId: string;
}

export interface IPurchaseReturn {
  purchaseReturnId: string;
  purchaseReturnNo: string;
  purchaseReturnDate: string;
  supplierId: number;
  supplierName: string;
  remarks: string;
}

export interface IPurchaseReturnNoAndSupplierOptions {
  supplierId?: number | null;
  supplierName?: string | null;
  purchaseReturnId?: number | null;
  purchaseReturnNo?: string | null;
}

export interface IGetPurchaseReturnInfoFilterDto {
  // paymentModeId: number | null;
  supplierId: number | null;
  fromDate: string | null;
  toDate: string | null;
  taxOver: number | null;
  taxUnder: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  // employeeId: number | null;
  locationId: number | null;
  purchaseReturnId: string | null;
}

export interface IPurchaseReturnInfo {
  purchaseReturnId: string;
  purchaseReturnNo: string;
  dateOfEntry: string;
  supplierId: number;
  supplierName: string;
  total: number | null;
  vat: number | null;
  tax: number | null;
  locationId?: number | null;
  remarks?: string | null;
  voucherId: string | null;
}

export interface IPurchaseReturnDetailInfo {
  purchaseReturnId: string;
  purchaseReturnDetailId: string;
  lPurchaseId: string | null;
  // LPurchaseNo?: string | null;
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
  purchaseReturnDetailSerialInfoDto: IPurchaseReturnDetailSerialInfo[];
  unitTypeId: number;
}

export interface IPurchaseReturnDetailSerialInfo {
  purchaseReturnId?: string | null;
  purchaseReturnDetailId?: string | null;
  purchaseReturnDetailSerialId?: string | null;
  productId: string;
  productName: number;
  serialNo: string;
}

export interface IPurchaseReturnProcessCommandsVM {
  //   createPurchaseReturnCommand?: ICreatePurchaseReturnCommand | null;
  updatePurchaseReturnCommand?: IUpdatePurchaseReturnCommand[] | null;
  deletePurchaseReturnCommand?: IDeletePurchaseReturnCommand[] | null;
  createPurchaseReturnDetailCommand?:
    | ICreatePurchaseReturnDetailCommand[]
    | null;
  updatePurchaseReturnDetailCommand?:
    | IUpdatePurchaseReturnDetailCommand[]
    | null;
  deletePurchaseReturnDetailCommand?:
    | IDeletePurchaseReturnDetailCommand[]
    | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  purchaseReturnId?: string | null;
  lpurchaseInNo?: string | null;

  createPurchaseReturnDetailSerialCommand?:
    | ICreatePurchaseReturnDetailSerialCommand[]
    | null;
  deletePurchaseReturnDetailSerialCommand?:
    | IDeletePurchaseReturnDetailSerialCommand[]
    | null;
  createPurchaseReturnDetail_TaxCommand?:
    | ICreatePurchaseReturnDetailTaxCommand[]
    | null;
  updatePurchaseReturnDetail_TaxCommand?:
    | IUpdatePurchaseReturnDetailTaxCommand[]
    | null;
  deletePurchaseReturnDetail_TaxCommand?:
    | IDeletePurchaseReturnDetailTaxCommand[]
    | null;
}

export interface IDeletePurchaseReturnCommand {
  purchaseReturnId: string;
}

export interface IUpdatePurchaseReturnCommand {
  purchaseReturnId: string;
  total?: number | null;

  supplierId?: number | null;
  voucherId: string | null;
}

export interface ICreatePurchaseReturnDetailCommand {
  // purchaseReturnDetailId: number;
  purchaseReturnId: string | null;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  lPurchaseId: string | null;
  // taxAmount?: number | null;
  // vatAmount?: number | null; //grey area
  createPurchaseReturnDetailSerialCommand?: ICreatePurchaseReturnDetailSerialCommand[];
  createPurchaseReturnDetail_TaxCommand?: ICreatePurchaseReturnDetailTaxCommand[];
  unitTypeId: number;
  // companyId: number;
  locationId: number;
  // discount?: number | null;
}

export interface IUpdatePurchaseReturnDetailCommand {
  purchaseReturnDetailId: string;
  // purchaseReturnId: string;
  // lPurchaseId: string | null;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  unitTypeId: number;
  // discount?: number | null;
  // locationId: number | null;
  // createPurchaseReturnDetailSerialCommand?: ICreatePurchaseReturnDetailSerialCommand[];
}

export interface IDeletePurchaseReturnDetailCommand {
  purchaseReturnDetailId: string;
  purchaseReturnId?: string | null;
}

export interface ICreatePurchaseReturnDetailSerialCommand {
  purchaseReturnId: string;
  purchaseReturnDetailId?: string | null;
  serialNo: string;
}

export interface IDeletePurchaseReturnDetailSerialCommand {
  purchaseReturnDetailSerialId: string;
  purchaseReturnId?: string;
}

export interface ICreatePurchaseReturnDetailTaxCommand {
  purchaseReturnDetailId?: string | null;
  taxId: number;
  taxAmount: number;
}

export interface IUpdatePurchaseReturnDetailTaxCommand {
  purchaseReturnDetail_TaxId?: number | null;
  // taxId: number;
  taxAmount: number;
}

export interface IDeletePurchaseReturnDetailTaxCommand {
  purchaseReturnDetail_TaxId?: number | null;
  // taxId: number;
  // taxAmount: number;
  purchaseReturnId?: string | null;
}
/// puran gula-----------------------

// export interface IPurchaseReturnAdditionalCost {
//   purchaseReturnAdditionalCostId: number | null;
//   name: string | null;
//   description: string | null;
//   percentage: number | null;
//   amount: number | null;
//   accountsId: number | null;
//   accountsName: string | null;
// }

// export interface ICreatePurchaseReturnAdditionalCostCommand {
//   // purchaseReturn_AdditionalCostId: number;
//   purchaseReturnId: number | null;
//   name: string;
//   description: string | null;
//   accountsId: number | null;
//   percentage: number | null;
//   amount: number | null;
// }

// export interface IUpdatePurchaseReturnAdditionalCostCommand {
//   purchaseReturnAdditionalCostId: number;
//   purchaseReturnId: number;
//   name: string;
//   description: string | null;
//   accountsId: number | null;
//   percentage: number | null;
//   amount: number | null;
// }

// export interface IDeletePurchaseReturnAdditionalCostCommand {
//   purchaseReturnAdditionalCostId: number;
// }
