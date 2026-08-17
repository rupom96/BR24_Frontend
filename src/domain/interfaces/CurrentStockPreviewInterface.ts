export interface ICurrentStockPreviewRow {
  productGroupId: number;
  productGroupName: string;
  brandId: number;
  brandName: string;
  productId: number;
  productName: string;
  measuringUnitName: string;
  modelNo: string;
  serialNo: string;
  serialAvailable: boolean | string;
  quantity: number | null;
  cost: number | null;
}

export interface IGetCurrentStockPreviewFilterDto {
  companyId: number;
  locationId: number;
  productGroupId: number | null;
  brandId: number | null;
  productId: number | null;
  date: string;
  isSerialProduct: 'N' | 'Y' | '';
}
