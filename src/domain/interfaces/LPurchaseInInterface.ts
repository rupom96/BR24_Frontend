import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface ILPurchaseInNoComboBox {
  lPurchaseInNo: string;
  lPurchaseInId: string;
}

export interface ILPurchaseIn {
  lPurchaseInId: string;
  lPurchaseInNo: string;
  lPurchaseInDate: string;
  supplierId: number;
  supplierName: string;
  remarks: string;
}

export interface ILPurchaseInNoAndSupplierOptions {
  supplierId?: number | null;
  supplierName?: string | null;
  lPurchaseInId?: number | null;
  lPurchaseInNo?: string | null;
}

export interface IGetLPurchaseInInfoFilterDto {
  paymentModeId: number | null;
  supplierId: number | null;
  fromDate: string | null;
  toDate: string | null;
  taxOver: number | null;
  taxUnder: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  // employeeId: number | null;
  locationId: number | null;
  lPurchaseInId: string | null;
  productGroupId: number | null;
  brandId: number | null;
  productId: number | null;
}

export interface ILPurchaseInInfo {
  lPurchaseInId: string;
  lPurchaseInNo: string;
  purchaseOrderNo: string | null;
  referenceNo: string;
  date: string;
  supplierId: number;
  supplierName: string;
  // supplierGroupId: number;
  // supplierGroupName: string;
  paymentModeId: number;
  paymentModeName: string;
  paymentTermsId: number | null;
  paymentTermsName: string;
  totalAmount: number | null;
  vat: number | null;
  tax: number | null;
  purchaseDiscount?: number | null;
  locationID?: number | null;
  totalAmountWithoutPurchaseDiscount?: number | null;
  remarks?: string | null;
}

export interface ILPurchaseInDetailInfo {
  lPurchaseInId: string;
  lPurchaseInDetailId: string;
  productId: number | null;
  productName: string;
  locationId: number | null;
  cost: number | null;
  quantity: number | null;
  taxAmount?: number | null;
  taxRowId?: number | null;
  vatAmount?: number | null;
  vatRowId?: number | null;
  isSerialProduct?: boolean;
  lPurchaseInDetailSerialInfoDto: ILPurchaseInDetailSerialInfo[];
  unitTypeId: number;
  discountAmount?: number | null;
}

export interface ILPurchaseInDetailSerialInfo {
  lPurchaseInId?: string | null;
  lPurchaseInDetailId?: string | null;
  lPurchaseInDetailSerialId?: string | null;
  productId: string;
  productName: number;
  serialNo: string;
}

export interface ILPurchaseInProcessCommandsVM {
  //   createLPurchaseInCommand?: ICreateLPurchaseInCommand | null;
  updateLPurchaseInCommand?: IUpdateLPurchaseInCommand[] | null;
  deleteLPurchaseInCommand?: IDeleteLPurchaseInCommand[] | null;
  createLPurchaseInDetailCommand?: ICreateLPurchaseInDetailCommand[] | null;
  updateLPurchaseInDetailCommand?: IUpdateLPurchaseInDetailCommand[] | null;
  deleteLPurchaseInDetailCommand?: IDeleteLPurchaseInDetailCommand[] | null;
  createLPurchaseInAdditionalCostCommand?:
    | ICreateLPurchaseInAdditionalCostCommand[]
    | null;
  updateLPurchaseInAdditionalCostCommand?:
    | IUpdateLPurchaseInAdditionalCostCommand[]
    | null;
  deleteLPurchaseInAdditionalCostCommand?:
    | IDeleteLPurchaseInAdditionalCostCommand[]
    | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  lPurchaseInId?: string | null;
  lpurchaseInNo?: string | null;

  createLPurchaseInDetailSerialCommand?:
    | ICreateLPurchaseInDetailSerialCommand[]
    | null;
  deleteLPurchaseInDetailSerialCommand?:
    | IDeleteLPurchaseInDetailSerialCommand[]
    | null;
  createLPurchaseInDetail_TaxCommand?:
    | ICreateLPurchaseInDetailTaxCommand[]
    | null;
  updateLPurchaseInDetail_TaxCommand?:
    | IUpdateLPurchaseInDetailTaxCommand[]
    | null;
  deleteLPurchaseInDetail_TaxCommand?:
    | IDeleteLPurchaseInDetailTaxCommand[]
    | null;
}

export interface IDeleteLPurchaseInCommand {
  lPurchaseInId: string;
}

export interface IUpdateLPurchaseInCommand {
  lPurchaseInId: string;
  totalAmount?: number | null;
  totalAdditionalCost?: number | null;
  supplierId?: number | null;
  paymentModeId?: number | null;
  // paymentTermId?: number | null;
  purchaseDiscount?: number | null;
}

export interface ICreateLPurchaseInDetailCommand {
  // lPurchaseInDetailId: number;
  lPurchaseId: string | null;
  productId: number | null;
  quantity: number | null;
  cost: number | null;
  // taxAmount?: number | null;
  // vatAmount?: number | null; //grey area
  createLPurchaseInDetailSerialCommand?: ICreateLPurchaseInDetailSerialCommand[];
  createLPurchaseInDetail_TaxCommand?: ICreateLPurchaseInDetailTaxCommand[];
  unitTypeId: number;
  companyId: number;
  locationId: number;
  discountAmount?: number | null;
}

export interface IUpdateLPurchaseInDetailCommand {
  lPurchaseInDetailId: string;
  lPurchaseInId: string;
  productId: number | null;
  quantity: number | null;
  cost: number | null;
  unitTypeId: number;
  discountAmount?: number | null;
  locationId: number | null;
  // createLPurchaseInDetailSerialCommand?: ICreateLPurchaseInDetailSerialCommand[];
}

export interface IDeleteLPurchaseInDetailCommand {
  lPurchaseInDetailId: string;
  lPurchaseInId?: string | null;
}

export interface ICreateLPurchaseInDetailSerialCommand {
  lPurchaseInId: string;
  lPurchaseInDetailId?: string | null;
  serialNo: string;
}

export interface IDeleteLPurchaseInDetailSerialCommand {
  lPurchaseInDetailSerialId: string;
  lPurchaseInId?: string;
}

export interface ICreateLPurchaseInDetailTaxCommand {
  lPurchaseInDetailId?: string | null;
  taxId: number;
  taxAmount: number;
}

export interface IUpdateLPurchaseInDetailTaxCommand {
  lPurchaseInDetailTaxId?: number | null;
  // taxId: number;
  taxAmount: number;
}

export interface IDeleteLPurchaseInDetailTaxCommand {
  lPurchaseInDetailTaxId?: number | null;
  // taxId: number;
  // taxAmount: number;
  lPurchaseInId?: string | null;
}
/// puran gula-----------------------

export interface ILPurchaseInAdditionalCost {
  lPurchaseInAdditionalCostId: number | null;
  name: string | null;
  description: string | null;
  percentage: number | null;
  amount: number | null;
  accountsId: number | null;
  accountsName: string | null;
}

export interface ICreateLPurchaseInAdditionalCostCommand {
  // lPurchaseIn_AdditionalCostId: number;
  lPurchaseInId: number | null;
  name: string;
  description: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
}

export interface IUpdateLPurchaseInAdditionalCostCommand {
  lPurchaseInAdditionalCostId: number;
  lPurchaseInId: number;
  name: string;
  description: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
}

export interface IDeleteLPurchaseInAdditionalCostCommand {
  lPurchaseInAdditionalCostId: number;
}
