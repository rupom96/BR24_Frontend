export interface IRegionMaster {
  regionMasterId: number;
  regionMasterName: string;
  inchargeId?: number;
  inchargeName?: string;
  target?: number;
}

export interface IRegion {
  regionMasterId?: number;
  regionId: number;
  regionName: string;
  inchargeId?: number;
  inchargeName?: string;
  target?: number;
}

export interface IDivision {
  regionId?: number;
  divisionId: number;
  divisionName: string;
  inchargeId?: number;
  inchargeName?: string;
  target?: number;
}

export interface IDistrict {
  divisionId?: number;
  districtId: number;
  districtName: string;
  inchargeId?: number;
  inchargeName?: string;
  target?: number;
}

export interface IArea {
  areaId: number;
  areaName: string;
  inchargeId?: number | null;
  inchargeName?: string | null;
  target?: number | null;
}

export interface IAreaTargetSPProductGroup {
  targetSPProductGroupId: number | null;
  areaId: number | null;
  areaName: string;
  teamName: string | null;
  employeeId: number | null;
  employeeName: string | null;
  productGroupId: number | null;
  productGroupName: string | null;
  month: number | null;
  year: number | null;
  target: number | null;
  sold: number | null;
  achievement: number | null;
  so: number | null;
  finalAchievement: number | null;
}
