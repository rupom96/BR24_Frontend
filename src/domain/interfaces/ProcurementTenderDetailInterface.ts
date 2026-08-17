export interface IProcurementTenderDetail {
  procurementTenderDetailId: number | null;
  productGroupName: string | null;
  productGroupId: number | null;
  quantity: number | null;
  productName: string | null;
  productId: number | null;
  brandId: number | null;
  brandName: number | null;
  price: number | null;
  initialFactor: number | null;
  loading?: boolean | null;
  productSource?: string | null;
  prework?: string | null;
  shareOfLoad?: number | null;
  deliveryTimeline?: number | null;
  remarks?: string | null;
}

export interface ICreateProcurementTenderDetailCommand {
  // procurementTenderDetailId: number;
  procurementTenderId: number | null;
  productGroupId: number;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  initialFactor: number | null;
  productSource?: string | null;
  prework?: string | null;
  shareOfLoad?: number | null;
  deliveryTimeline?: number | null;
  remarks?: string | null;
}

export interface IUpdateProcurementTenderDetailCommand {
  procurementTenderDetailId: number;
  procurementTenderId: number | null;
  productGroupId: number;
  productId: number | null;
  quantity: number | null;
  price: number | null;
  initialFactor: number | null;
  productSource?: string | null;
  prework?: string | null;
  shareOfLoad?: number | null;
  deliveryTimeline?: number | null;
  remarks?: string | null;
}

export interface IDeleteProcurementTenderDetailCommand {
  procurementTenderDetailId: number;
}
