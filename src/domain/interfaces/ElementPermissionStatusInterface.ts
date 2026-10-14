export interface IElementPermissionPerson {
  securityUserId: number;
  /** SecurityUser.Name */
  name: string;
  /** SecurityUser.UserName (login) */
  userName: string;
  locationName: string;
  biznessEventPCUserId: number;
}

export interface IElementPermissionStatus {
  elementName: string;
  elementIdentity: 'Product Group' | 'Product' | string;
  elementId: number;
  status: 'Done' | 'Pending' | string;
  authorizedTo: IElementPermissionPerson[];
  doneBy: IElementPermissionPerson[];
}

export interface IProductGroupAndBrandByProductId {
  productGroupId: number;
  productGroupName: string;
  brandId: number;
  brandName: string;
}
