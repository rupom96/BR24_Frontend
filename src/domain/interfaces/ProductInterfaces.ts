export interface IProductGroupComboBox {
  productGroupId: number;
  productGroupName: string;
  productPrice?: number | null;
  limit?: number | null;
}

export interface IUserProductGroup {
  productGroupId: number;
  productGroupName: string;
  limit: number;
}

export interface IProductComboBox {
  productId: number;
  productName: string;
  groupId: number;
  modelNo: string;
  limit?: number | null;
  isSerialProduct?: boolean;
}
export interface IUserProduct {
  productId: number;
  productName: string;
  limit: number;
}

export interface IBrand {
  brandId: number;
  brandName: string;
  limit?: number | null;
}

export interface IUserBrand {
  brandId: number;
  brandName: string;
  limit: number;
}

export interface IPreImportInProduct {
  productId: number;
  productName: string;
  maxQuantityLimit: number;
  isSerialProduct?: boolean;
  unitTypeId: number;
  cost: number;
}
