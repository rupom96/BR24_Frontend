export interface IBuyer {
  buyerId: number;
  buyerName: string;
  employeeId?: number;
  buyerGroupId?: number | null;
  buyerGroupName?: string | null;
  target?: number | null;
}

export interface IBuyerSalesReport {
  buyerGroupName: string;
  buyerGroupNameId: number;
  buyerName: string;
  buyerId: number;
  salesPersonName: string;
  salesPersonId: number;
  departmentName: string;
  departmentId: number;
  monthlySales: number;
  grossProfit: number;
  grossProfitP: number;
  averageCollection: number;
  chqDishonor: number;
  currentDue: number;
  creditAging: number;
}

export interface IBuyerGradingOptions {
  buyerGradingId: number | null;
  buyerGradingName: string | null;
}
