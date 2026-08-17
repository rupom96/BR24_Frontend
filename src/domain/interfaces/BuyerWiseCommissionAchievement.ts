export interface IBuyerWiseCommissionAchievement {
  buyerWiseCommissionAchievementId?: number | null;
  buyerName?: string | null;
  buyerId?: number | null;
  numberOfSR?: number | null;
  buyerGradingId?: number | null;
  salesPersonId?: number | null;
  salesPersonName?: string | null;
  openingBalance?: number | null;
  target?: number | null;
  totalSales?: number | null;
  extraSales?: number | null;
  cpSales?: number | null; // commissionableProduct Sales
  cpSalesReturn?: number | null;
  cpCreditNote?: number | null;
  cpNetSales?: number | null;
  collection?: number | null;
  extraCollection?: number | null;
  totalCollection?: number | null;
  achievementSales?: number | null;
  achievementCollection?: number | null;
  endingBalance?: number | null;
  aging?: number | null;
  commissionAmount?: number | null;
  commissionPercentage?: number | null;
  commissionOn: string | null;
  commissionMonthYear: string | null;
  extendedCommissionDate: string | null;
  lastProcessedDate?: string | null;
  entryBy: number | null;
  dateOfEntry: string | null;
}

export interface ICreateBuyerWiseCommissionAchievement {
  // buyerWiseCommissionAchievementId?: number | null;
  buyerId: number;
  openingBalance: number;
  target: number;
  totalSales?: number | null;
  extraSales?: number | null;
  cpSales?: number | null; // commissionableProduct Sales
  cpSalesReturn?: number | null;
  cpCreditNote?: number | null;
  cpNetSales?: number | null;
  collection?: number | null;
  extraCollection?: number | null;
  totalCollection?: number | null;
  achievementSales?: number | null;
  achievementCollection?: number | null;
  endingBalance: number;
  aging?: number | null;
  commissionAmount: number;
  commissionPercentage: number;
  commissionOn: string;
  commissionMonthYear: string;
  extendedCommissionDate?: string | null;
  lastProcessedDate: string;
  entryBy: number;
  dateOfEntry: string;
}

export interface IUpdateBuyerWiseCommissionAchievement {
  buyerwisecommissionAchievementId: number;
  buyerId: number;
  openingBalance: number;
  target: number;
  totalSales?: number | null;
  extraSales?: number | null;
  cpSales?: number | null; // commissionableProduct Sales
  cpSalesReturn?: number | null;
  cpCreditNote?: number | null;
  cpNetSales?: number | null;
  collection?: number | null;
  extraCollection?: number | null;
  totalCollection?: number | null;
  achievementSales?: number | null;
  achievementCollection?: number | null;
  endingBalance: number;
  aging?: number | null;
  commissionAmount: number;
  commissionPercentage: number;
  commissionOn: string;
  commissionMonthYear: string;
  extendedCommissionDate?: string | null;
  lastProcessedDate: string;
  entryBy: number;
  dateOfEntry: string;
}

export interface IDeleteBuyerWiseCommissionAchievement {
  buyerwisecommissionAchievementId: number;
}

export interface IBulkCreateBuyerWiseCommissionAchievementCommand {
  buyerWiseCommissionAchievements: ICreateBuyerWiseCommissionAchievement[];
}
export interface IBulkDeleteBuyerWiseCommissionAchievementCommand {
  bulkDeleteBuyerWiseCommissionAchievementCommand:
    | IDeleteBuyerWiseCommissionAchievement[]
    | null;
}
export interface IProcessBuyerWiseCommissionAchievement {
  bulkCreateBuyerWiseCommissionAchievementCommand: IBulkCreateBuyerWiseCommissionAchievementCommand;
  bulkDeleteBuyerWiseCommissionAchievementCommand: IBulkDeleteBuyerWiseCommissionAchievementCommand | null;
}
