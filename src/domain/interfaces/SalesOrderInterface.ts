import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface ISalesOrderNoComboBox {
  salesOrderNo: string;
  salesOrderId: string;
}

export interface ISalesOrder {
  salesOrderId: string;
  salesOrderNo: string;
  salesOrderDate: string;
  buyerId: number;
  buyerName: string;
  remarks: string;
}

export interface ISalesOrderAndBuyerOptions {
  salesOrderId?: number | null;
  salesOrderNo?: string | null;
  buyerId?: number | null;
  buyerName?: string | null;
}

export interface ICreateSalesOrderDeliveryCommand {
  salesOrderId?: string | null;
  deliveryType: string | null;
}
export interface IUpdateSalesOrderDeliveryCommand {
  salesOrderDeliveryId: string;
  deliveryType: string | null;
}

export interface ICreateSalesOrderCommand {
  buyerId: number;
  date: string | null;
  createSalesOrder_DeliveryCommand: ICreateSalesOrderDeliveryCommand | null;
}

export interface ISalesOrderProcessCommandsVM {
  // createSalesOrderCommand?: ICreateSalesOrderCommand | null;
  updateSalesOrderCommand?: IUpdateSalesOrderCommand[] | null;
  deleteSalesOrderCommand?: IDeleteSalesOrderCommand[] | null;
  createSalesOrderDetailCommand?: ICreateSalesOrderDetailCommand[] | null;
  updateSalesOrderDetailCommand?: IUpdateSalesOrderDetailCommand[] | null;
  deleteSalesOrderDetailCommand?: IDeleteSalesOrderDetailCommand[] | null;
  createSalesOrderAdditionalCostCommand?:
    | ICreateSalesOrderAdditionalCostCommand[]
    | null;
  updateSalesOrderAdditionalCostCommand?:
    | IUpdateSalesOrderAdditionalCostCommand[]
    | null;
  deleteSalesOrderAdditionalCostCommand?:
    | IDeleteSalesOrderAdditionalCostCommand[]
    | null;

  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  salesOrderId?: string | null;
  createSalesDetailCommand?: ICreateSalesDetailCommand[] | null;
  deleteSalesDetailCommand?: IDeleteSalesDetailCommand[] | null;
  createSalesOrderDetail_TaxCommand?:
    | ICreateSalesOrderDetailTaxCommand[]
    | null;
  updateSalesOrderDetail_TaxCommand?:
    | IUpdateSalesOrderDetailTaxCommand[]
    | null;
  deleteSalesOrderDetail_TaxCommand?:
    | IDeleteSalesOrderDetailTaxCommand[]
    | null;
}

export interface ISalesOrderTrackingProcessCommandsVM {
  createSalesOrderCommand?: ICreateSalesOrderCommand | null;
  updateSalesOrderCommand?: IUpdateSalesOrderCommand | null;
  createSalesOrder_DeliveryCommand?: ICreateSalesOrderDeliveryCommand | null;
  createSalesOrderDetailCommand?: ICreateSalesOrderDetailCommand[] | null;
  updateSalesOrderDetailCommand?: IUpdateSalesOrderDetailCommand[] | null;
  deleteSalesOrderDetailCommand?: IDeleteSalesOrderDetailCommand[] | null;
  updateSalesOrderDetail_TaxCommand?:
    | IUpdateSalesOrderDetailTaxCommand[]
    | null;
  createSalesOrderDetail_TaxCommand?:
    | ICreateSalesOrderDetailTaxCommand[]
    | null;
}

export interface IDeleteSalesOrderCommand {
  salesOrderId: string;
}

export interface IUpdateSalesOrderCommand {
  salesOrderId: string;
  totalAmount?: number | null;
  totalAdditionalCost?: number | null;
  buyerId?: number | null;
  paymentModeId?: number | null;
  invoiceDiscount?: number | null;
  date?: string | null;
  updateSalesOrder_DeliveryCommand?: IUpdateSalesOrderDeliveryCommand | null;
}

export interface ISalesOrderDetail {
  salesOrderDetailId: string | null;
  productId: number | null;
  productName: string | null;
  quantity: number | null;
  price: number | null;
  unitTypeId: number | null;
}

export interface ICreateSalesOrderDetailCommand {
  // salesOrderDetailId: number;
  salesOrderId: string | null;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  // taxAmount?: number | null;
  // vatAmount?: number | null; //grey area
  createSalesDetailCommand?: ICreateSalesDetailCommand[];
  createSalesOrderDetail_TaxCommand?: ICreateSalesOrderDetailTaxCommand[];
  unitTypeId: number;
  companyId: number;
  locationId?: number | null;
  discount?: number | null;
  specificationValue?: string | null;
}

export interface IUpdateSalesOrderDetailCommand {
  salesOrderDetailId: string;
  salesOrderId: string;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  unitTypeId: number;
  discount?: number | null;
  specificationValue?: string | null;
  // createSalesDetailCommand?: ICreateSalesDetailCommand[];
}

export interface IDeleteSalesOrderDetailCommand {
  salesOrderDetailId: string;
  salesOrderId?: string | null;
}

export interface ICreateSalesDetailCommand {
  salesOrderId: string;
  salesOrderDetailId?: string | null;
  serialNo: string;
}
export interface IDeleteSalesDetailCommand {
  salesDetailId: string;
  salesOrderId?: string;
}

/// /////

export interface ISalesOrderAdditionalCost {
  salesOrderAdditionalCostId: number | null;
  name: string | null;
  description: string | null;
  percentage: number | null;
  amount: number | null;
  accountsId: number | null;
  accountsName: string | null;
}

export interface ICreateSalesOrderAdditionalCostCommand {
  // salesOrder_AdditionalCostId: number;
  salesOrderId: number | null;
  name: string;
  description: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
}

export interface IUpdateSalesOrderAdditionalCostCommand {
  salesOrderAdditionalCostId: number;
  salesOrderId: number;
  name: string;
  description: string | null;
  accountsId: number | null;
  percentage: number | null;
  amount: number | null;
}

export interface IDeleteSalesOrderAdditionalCostCommand {
  salesOrderAdditionalCostId: number;
}

export interface IGetSalesOrderInfoFilterDto {
  paymentModeId: number | null;
  buyerId: number | null;
  buyerGroupId: number | null;
  fromDate: string | null;
  toDate: string | null;
  taxOver: number | null;
  taxUnder: number | null;
  amountOver: number | null;
  amountUnder: number | null;
  employeeId: number | null;
  locationId: number | null;
  salesOrderId: string | null;
  productGroupId: number | null;
  brandId: number | null;
  productId: number | null;
}

export interface ISalesOrderInfo {
  salesOrderId: string;
  salesOrderNo: string;
  invoiceNo: string;
  dateOfEntry: string;
  buyerId: number;
  buyerName: string;
  buyerGroupId: number;
  buyerGroupName: string;
  paymentModeId: number;
  paymentModeName: string;
  totalAmount: number | null;
  vat: number | null;
  tax: number | null;
  invoiceDiscount?: number | null;
  totalAmountWithoutInvoiceDiscount?: number | null;
  remarks?: string | null;
}

export interface ISalesOrderDetailInfo {
  salesOrderId: string;
  salesOrderDetailId: string;
  productId: number | null;
  productName: string;
  price: number | null;
  quantity: number | null;
  taxAmount?: number | null;
  taxRowId?: number | null;
  vatAmount?: number | null;
  vatRowId?: number | null;
  isSerialProduct?: boolean;
  salesDetailInfoDto: ISalesDetailInfo[];
  unitTypeId: number;
  discount?: number | null;
}

export interface ISalesDetailInfo {
  salesOrderId?: string | null;
  salesOrderDetailId?: string | null;
  salesDetailId?: string | null;
  productId: string;
  productName: number;
  serialNo: string;
}

export interface ICreateSalesOrderDetailTaxCommand {
  // salesOrderDetailTaxId?: number | null;
  salesOrderDetailId?: string | null;
  taxId: number;
  taxAmount: number;
}
export interface IUpdateSalesOrderDetailTaxCommand {
  salesOrderDetailTaxId?: number | null;
  // taxId: number;
  taxAmount: number;
}
export interface IDeleteSalesOrderDetailTaxCommand {
  salesOrderDetailTaxId?: number | null;
  // taxId: number;
  // taxAmount: number;
  salesOrderId?: string | null;
}

// export interface IUpdateSalesOrder {
//   salesOrderId: string;
//   salesOrderNo: string;
//   invoiceNo: string;
//   dateOfEntry: string;
//   buyerId: number;
//   buyerName: string;
//   buyerGroupId: number;
//   buyerGroupName: string;
//   paymentModeId: number;
//   paymentModeName: string;
//   totalAmount: number | null;
//   vat: number | null;
//   tax: number | null;
//   remarks: string;
// }
