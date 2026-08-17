export interface IUserInfo {
  securityUserId?: number;
  userName?: string;
  email?: string;
  password?: string;
  rememberMe?: boolean;
  companyId?: number;
  locationId?: number;
  screenWidth?: number;
}

export interface ILocationDto {
  locationId: number;
  locationName: string;
}
export interface ICompanyDto {
  companyId: number;
  companyName: string;
}
export interface IMenuDto {
  securityMenuId: number;
  biznessEventId: number;
}
export interface IBRFeatureDto {
  featureName: string;
  isAllowed: boolean;
}
export interface ISecurityUserDto {
  securityUserId: number;
  securityUserName: string;
}
export interface ILoginResultVM {
  userName: string;
  securityUserId: number;
  employeeId: number;
  emailAddress: string;
  phone: number;
  password: number;
  companyId: number;
  companyName: string;
  companyList: ICompanyDto[];
  locationId: number;
  locationName: string;
  locationList: ILocationDto[];
  menuList: IMenuDto[];
  brFeatureList: IBRFeatureDto[];
}
