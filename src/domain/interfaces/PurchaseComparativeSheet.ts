import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';
import { IProcurementRequisition } from './ProcurementRequisitionInterface';

export interface IPurchaseComparativeSheetGrid {
  procurementRequisitionId?: number;
  requisitionNo?: string;
  procurementRequisitionDetailId?: number | null;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  quantity: number;
  supplierName: string;
  supplierId: number;
  purchasePrice: number;
  approxSalesPrice: number;
  salesForecastDays: number;
  suppliers: ISupplierPurchaseGrid[];
  mergedRequisitionNumbers?: IProcurementRequisition[];
}

export interface ISupplierPurchaseGrid {
  supplierId?: number | null;
  supplierName?: string | null;
  purchasePrice?: number | null;
  remarks?: string | null;
}

export interface IRequisitionWiseViewGrid {
  requisitionNo: string;
  quantity: number;
  price: number;
  salesForcastDays: number;
}

export interface IProcurementRequisitionCommandsVM {
  createRequisition?: IPurchaseComparativeSheetGrid[] | null;
  updateRequisition?: IPurchaseComparativeSheetGrid[] | null;
  previousRequisitionNo?: IProcurementRequisition[] | null;
  userInfo?: any | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  cancelPrevRequisitions?: boolean;
}
