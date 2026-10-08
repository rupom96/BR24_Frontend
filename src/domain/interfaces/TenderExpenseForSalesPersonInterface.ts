import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

/** Response of getTenderExpenseForSalesPerson */
export interface GetTenderExpenseForSalesPersonDto {
  procurementTenderId?: number | null;
  bgAmount?: number | null;
  securityDepositP?: number | null;
  securityDepositT?: number | null;
  performanceGuaranteeP?: number | null;
  performanceGuaranteeT?: number | null;
  earnestMoney?: string | null;
  vat?: number | null;
  tax?: number | null;
  salesExpenseAdvanceA?: number | null;
  salesExpenseAdvanceP?: number | null;
  salesExpenseDueA?: number | null;
  salesExpenseDueP?: number | null;
  salesExpenseBufferA?: number | null;
  salesExpenseBufferP?: number | null;
  agExpenseA?: number | null;
  agExpenseP?: number | null;
  deliveryA?: number | null;
  deliveryP?: number | null;
  installationA?: number | null;
  installationP?: number | null;
  trainingA?: number | null;
  trainingP?: number | null;
  preShipmentInspectionA?: number | null;
  preShipmentInspectionP?: number | null;
  bufferA?: number | null;
  bufferP?: number | null;
}

/** Body.tenderExpenseForSalesPersonData for ProcessTenderExpenseForSalesPerson */
export interface ProcessTenderExpenseForSalesPersonDto
  extends GetTenderExpenseForSalesPersonDto {
  procurementTenderId: number;
  vatTaxP?: number | null;
  salesExpenseA?: number | null;
  salesExpenseP?: number | null;
}

export interface TenderExpenseForSalesPersonCommandsVM {
  tenderExpenseForSalesPersonData: ProcessTenderExpenseForSalesPersonDto;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
}
