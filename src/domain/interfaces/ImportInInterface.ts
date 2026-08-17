/* eslint-disable prettier/prettier */
import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface IImportInNoComboBox {
  importInNo: string;
  importInId: string;
}

export interface IImportIn {
  importInId: string;
  importInNo: string;
  importInDate: string;
  lcNo: string;
  supplierId: number;
  supplierName: string;
  supplierGroupId: number;
  supplierGroupName: string;
  remarks: string;
}

export interface IImportInNoAndSupplierOptions {
  supplierId?: number | null;
  supplierName?: string | null;
  importInId?: number | null;
  importInNo?: string | null;
}

export interface IGetImportInInfoFilterDto {
  // paymentModeId: number | null;
  supplierId: number | null;
  supplierGroupId: number | null;

  fromDate: string | null;
  toDate: string | null;
  //   taxOver: number | null;
  //   taxUnder: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  bank: number | null,
  lcNo: string | null,
  lcNoLength: number | null,
  // employeeId: number | null;
  // locationId: number | null;
  // importInId: string | null;
  productGroupId: number | null;
  brandId: number | null;
  productId: number | null;
}

export interface IGetImportInLCNoOptionsFilterDto {
  companyId: number | null;
  supplierId: number | null;
  supplierGroupId: number | null;
  fromDate: string | null;
  toDate: string | null;
  bank: number | null,
  lcNoLength: number | null,
//   lcNo: string | null;
}

export interface IImportInInfo {
//   paymentModeId: any;
//   purchaseDiscount: any;
//   paymentModeName: string;
//   totalVat: string;
//   totalTax: string;
//   totalAmountWithoutPurchaseDiscount: number;
  importInId: string;
  importInNo: string;
  lcNo: string | null;
  //   referenceNo: string;
  date: string;
  supplierId: number;
  supplierName: string;
  supplierGroupId: number;
  supplierGroupName: string;
  //   paymentModeId: number;
  //   paymentModeName: string;
  //   paymentTermsId: number | null;
  //   paymentTermsName: string;
  totalAmount: number | null;
  //   totalVat: number | null;
  //   totalTax: number | null;
  //   purchaseDiscount?: number | null;
  //   locationID?: number | null;
  //   totalAmountWithoutPurchaseDiscount?: number | null;
  remarks?: string | null;
}

export interface IImportInDetailInfo {
//   discountAmount: number;
//   taxRowId: any;
//   taxAmount: number;
//   vatRowId: any;
//   vatAmount: number;
  importInId: string;
  importInDetailId: string;
  productId: number | null;
  productName: string;
  locationId: number | null;
  unitTypeId: number;
  quantity: number | null;
  maxQuantityLimit: number | null;

  cost: number | null;
  //  taxAmount?: number | null;
  //  taxRowId?: number | null;
  //  vatAmount?: number | null;
  //  vatRowId?: number | null;
  isSerialProduct?: boolean;
  importInDetailSerialInfoDto: IImportInDetailSerialInfo[];

  // discountAmount?: number | null;
}

export interface IImportInDetailSerialInfo {
  importInId?: string | null;
  importInDetailId?: string | null;
  importInDetailSerialId?: string | null;
  productId: string;
  productName: number;
  serialNo: string;
}

export interface IImportInProcessCommandsVM {
  //   createImportInCommand?: ICreateImportInCommand | null;
  // updateImportInCommand?: IUpdateImportInCommand[] | null;
  deleteImportInCommand?: IDeleteImportInCommand[] | null;
  createImportInDetailCommand?: ICreateImportInDetailCommand[] | null;
  updateImportInDetailCommand?: IUpdateImportInDetailCommand[] | null;
  deleteImportInDetailCommand?: IDeleteImportInDetailCommand[] | null;
  //   createImportInAdditionalCostCommand?:
  //     | ICreateImportInAdditionalCostCommand[]
  //     | null;
  //   updateImportInAdditionalCostCommand?:
  //     | IUpdateImportInAdditionalCostCommand[]
  //     | null;
  //   deleteImportInAdditionalCostCommand?:
  //     | IDeleteImportInAdditionalCostCommand[]
  //     | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  importInId?: string | null;
  importInNo?: string | null;

  createImportInDetailSerialCommand?:
    | ICreateImportInDetailSerialCommand[]
    | null;
  deleteImportInDetailSerialCommand?:
    | IDeleteImportInDetailSerialCommand[]
    | null;
  //   createImportInDetail_TaxCommand?: ICreateImportInDetailTaxCommand[] | null;
  //   updateImportInDetail_TaxCommand?: IUpdateImportInDetailTaxCommand[] | null;
  //   deleteImportInDetail_TaxCommand?: IDeleteImportInDetailTaxCommand[] | null;
}

export interface IDeleteImportInCommand {
  importInId: string;
}

export interface IUpdateImportInCommand {
  importInId: string;
  totalAmount?: number | null;
  //   totalAdditionalCost?: number | null;
  supplierId?: number | null;
  // paymentModeId?: number | null;
  // paymentTermId?: number | null;
  // purchaseDiscount?: number | null;
}

export interface ICreateImportInDetailCommand {
  // createImportInDetail_TaxCommand: any;
  // importInDetailId: number;
  importInId: string | null;
  productId: number | null;
  quantity: number | null;
  cost: number | null;
  // taxAmount?: number | null;
  // vatAmount?: number | null; //grey area
  createImportInDetailSerialCommand?: ICreateImportInDetailSerialCommand[];
  //   createImportInDetail_TaxCommand?: ICreateImportInDetailTaxCommand[];
  unitTypeId: number;
  companyId: number;
  locationId: number;
//   discountAmount?: number | null;
}

export interface IUpdateImportInDetailCommand {
  importInDetailId: string;
  importInId: string;
  productId: number | null;
  quantity: number | null;
  cost: number | null;
  unitTypeId: number;
//   discountAmount?: number | null;
  locationId: number | null;
  // createImportInDetailSerialCommand?: ICreateImportInDetailSerialCommand[];
}

export interface IDeleteImportInDetailCommand {
  importInDetailId: string;
  importInId?: string | null;
}

export interface ICreateImportInDetailSerialCommand {
  importInId: string;
  importInDetailId?: string | null;
  serialNo: string;
}

export interface IDeleteImportInDetailSerialCommand {
  importInDetailSerialId: string;
  importInId?: string;
}

// export interface ICreateImportInDetailTaxCommand {
//   importInDetailId?: string | null;
//   taxId: number;
//   taxAmount: number;
// }

// export interface IUpdateImportInDetailTaxCommand {
//   importInDetailTaxId?: number | null;
//   // taxId: number;
//   taxAmount: number;
// }

// export interface IDeleteImportInDetailTaxCommand {
//   importInDetailTaxId?: number | null;
//   // taxId: number;
//   // taxAmount: number;
//   importInId?: string | null;
// }
/// puran gula-----------------------

// export interface IImportInAdditionalCost {
//   importInAdditionalCostId: number | null;
//   name: string | null;
//   description: string | null;
//   percentage: number | null;
//   amount: number | null;
//   accountsId: number | null;
//   accountsName: string | null;
// }

// export interface ICreateImportInAdditionalCostCommand {
//   // importIn_AdditionalCostId: number;
//   importInId: number | null;
//   name: string;
//   description: string | null;
//   accountsId: number | null;
//   percentage: number | null;
//   amount: number | null;
// }

// export interface IUpdateImportInAdditionalCostCommand {
//   importInAdditionalCostId: number;
//   importInId: number;
//   name: string;
//   description: string | null;
//   accountsId: number | null;
//   percentage: number | null;
//   amount: number | null;
// }

// export interface IDeleteImportInAdditionalCostCommand {
//   importInAdditionalCostId: number;
// }
