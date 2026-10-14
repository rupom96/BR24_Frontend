import LPurchaseInAdditionalCost from '../pages/LPurchaseInAdditionalCost/LPurchaseInAdditionalCost';
import PurchaseComparativeSheet from '../pages/PurchaseComparativeSheet/PurchaseComparativeSheet';
import SalesOrderAdditionalCost from '../pages/SalesAdditionalCost/SalesOrderAdditionalCost';
import TaskReporting from '../pages/TaskReporting/TaskReporting';
import TenderCosting from '../pages/TenderCosting/TenderCosting';
import TenderExpenseForSalesPerson from '../pages/TenderExpenseForSalesPerson/TenderExpenseForSalesPerson';
import TenderApprovalTopSheetRpt from '../pages/TenderApprovalTopSheetRpt/TenderApprovalTopSheetRpt';
import TenderRequisition from '../pages/TenderRequisition/TenderRequisition';
import TenderWon from '../pages/TenderWon/TenderWon';
import TransactionEventVoucher from '../pages/TransactionEventVoucher/TransactionEventVoucher';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  // PurchaseOrder: TaskReporting,

  // R: TaskReporting,
  // CommArrangesPriceQuotation: TaskReporting,
  // MatchPriceQuotation: TaskReporting,
  // ProcurementTenderTaskReporting1: TaskReporting,
  // ProcurementTenderTaskReporting2: TaskReporting,
  // // LCVoucher: TransactionLCVoucher,
  // ProcurementTender: TenderRequisition,
  // LCVoucher: TransactionEventVoucher,
  // TenderVoucher: TransactionEventVoucher,

  TaskReporting,
  TenderRequisition,
  TransactionEventVoucher,
  TenderWon,
  PurchaseComparativeSheet,
  SalesOrderAdditionalCost,
  LPurchaseInAdditionalCost,
  TenderCosting,
  TenderExpenseForSalesPerson,
  TenderApprovalTopSheetRpt,
  // Add more components as needed
};

export default componentMap;
