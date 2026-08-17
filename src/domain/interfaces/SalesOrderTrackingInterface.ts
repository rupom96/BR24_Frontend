import { Dayjs } from 'dayjs';

// ---- Option models (for Autocomplete) ----
export interface IBuyerOption {
  buyerId: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  restLimit?: number | null;
}

export interface IProductOption {
  productId: number;
  name: string;
  unitTypeId: number;
  productSpecification?: string | null;
}

// ---- Product Info API ----
export interface IProductInfoDto {
  productId: number;
  productName: string;
  price: number;
  productVat: number;
  productTax: number;
  vatIsPercentage: boolean;
  taxIsPercentage: boolean;
  productSpecification?: string | null;
  vatRowId: number;
  taxRowId: number;
  unitTypeId?: number | null;
}

// ---- Sales Order Detail Tracking API ----
export interface IGetSalesOrderHeaderTrackingDto {
  salesOrderId: string;
  salesOrderNo: string;
  date: string;
  deliveryType?: string | null;

  // safe optional fallbacks in case backend sends these too
  buyerId?: number | null;
  buyerName?: string | null;
  buyerAddress?: string | null;
  buyerPhone?: string | null;
}

export interface IGetSalesOrderDetailInfoDto {
  salesOrderId: string;
  salesOrderDetailId: string;
  productId: number;
  productName: string;
  price: number;
  discount?: number | null;
  quantity: number;
  taxAmount: number;
  vatAmount: number;
  taxRowId: number;
  vatRowId: number;
  isSerialProduct: boolean;
  unitTypeId: number;
  specificationValue: string | null;
  salesDetailInfoDto: any[];
}

export interface IGetSalesOrderDetailTrackingDto {
  salesOrderHeader: IGetSalesOrderHeaderTrackingDto;
  salesOrderDetails: IGetSalesOrderDetailInfoDto[];
}

// ---- Detail grid row ----
export interface ISalesOrderDetailRow {
  salesOrderDetailId: string | null;
  salesOrderId: string | null;
  productId: number | null;
  productName: string | null;
  unitTypeId: number | null;
  quantity: number | null;
  price: number | null;
  specificationValue?: string | null;

  productVat?: number | null;
  productTax?: number | null;
  vatRowId?: number | null;
  taxRowId?: number | null;
}

// ---- Existing VM if needed elsewhere ----
export interface ISalesOrderTrackingVM {
  salesOrderId: string;
  salesOrderNo: string;
  date: string;
  buyerId: number;
  buyerName: string;
  buyerAddress?: string | null;
  buyerPhone?: string | null;
  details: ISalesOrderDetailRow[];
}

// ---- Save payload ----
export interface ISaveSalesOrderCommand {
  salesOrderId?: string | null;
  salesOrderNo?: string | null;
  date: string;
  buyerId: number;
  companyId?: number | null;
  locationId?: number | null;
  deliveryType?: string | null;

  details: Array<{
    salesOrderDetailId?: string | null;
    productId: number;
    unitTypeId: number;
    quantity: number;
    price: number;
    specificationValue?: string | null;
  }>;

  deletedDetails?: Array<{ salesOrderDetailId: string }>;
}

// ---- RHF form model ----
export interface ISalesOrderTrackingFormModel {
  salesOrderNo: string;
  date: Dayjs;
  buyer: IBuyerOption | null;
  buyerAddress: string;
  buyerPhone: string;
  restLimit: number | null;
  deliveryType: string;
}
