export interface ITransactionInfo {
  voucherMatchingId: number;
  transactionName: string;
  costingAmount: number | null;
  subRows?: ITransactionInfo[];
  // for material ui's table's sake
  voucherNo?: string;
  voucherId?: string;
  voucherDate?: string;
  preparedById?: number | null;
  preparedByName?: string;
  preparedByImage?: string | null;
  approved?: boolean;
  approvedDate?: string;
  approvedById?: number | null;
  approvedByName?: string;
  approvedByImage?: string | null;
  posted?: boolean | null;
  postingDate?: string;
  postedById?: number | null;
  postedByName?: string;
  postedByImage?: string | null;
  postedAmount?: number | null;
}
export interface IVouchersOfTransactions {
  voucherMatchingId: number;
  voucherId: string;
  voucherNo: string;
  voucherDate: string;
  preparedById: number | null;
  preparedByName: string;
  preparedByImage: string | null;
  approved: boolean;
  approvedDate: string;
  approvedById: number | null;
  approvedByName: string;
  approvedByImage: string | null;
  posted: boolean | null;
  postingDate: string;
  postedById: number | null;
  postedByName: string;
  postedByImage: string | null;
  postedAmount: number | null;
  // duita model re same banaisi, actually ek korte hobe fro mui table's sake, pore korbo
  costingAmount?: number | null;
}
