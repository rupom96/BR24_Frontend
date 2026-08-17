export interface IBuyerTargetProductGroup {
  targetBuyerProductGroupId: number | null;
  buyerId: number | null;
  buyerName: string | null;
  productGroupId: number | null;
  productGroupName: string | null;
  month: number | null;
  year: number | null;
  target: number | null;
  sold: number | null;
  achievement: number | null;
  so: number | null;
  finalAchievement: number | null;
  quantity?: number | null;
}

export interface IProcessBuyerTargetProductGroup {
  createTarget_BuyerProductGroupCommand: ICreateBuyerTargetProductGroup[];
  updateTarget_BuyerProductGroupCommand: IUpdateBuyerTargetProductGroup[];
  deleteTarget_BuyerProductGroupCommand: IDeleteBuyerTargetProductGroup[];
  operationName?: string | null;
  fromMonth?: number | null;
  toMonth?: number | null;
  fromYear?: number | null;
  toYear?: number | null;
  regionMasterId?: number | null;
  regionId?: number | null;
  divisionId?: number | null;
  districtId?: number | null;
  areaId?: number | null;
  buyerId?: number | null;
  productGroupId?: number | null;
}

export interface ICreateBuyerTargetProductGroup {
  targetBuyerProductGroupId: number;
  buyerId: number;
  productGroupId: number;
  month: number;
  year: number;
  amount: number;
  dateOfEntry: string;
  companyId: number;
  entryBy: number;
  quantity?: number | null;
}

export interface IUpdateBuyerTargetProductGroup {
  targetBuyerProductGroupId: number;
  buyerId: number;
  productGroupId: number;
  month: number;
  year: number;
  amount: number;
  quantity?: number | null;
  //   dateOfEntry: string;
  //   companyId: number;
  //   entryBy: number;
}

export interface IDeleteBuyerTargetProductGroup {
  targetBuyerProductGroupId: number;
}
