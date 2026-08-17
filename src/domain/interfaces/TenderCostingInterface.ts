import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';

export interface GetTenderCostingDetailDto {
  procurementTenderDetailId: number;
  productId?: number | null;
  productName?: string | null;
  quantity?: number | null; // Unit
  price?: number | null; // FOB
  initialFactor?: number | null; // Factor

  distMarginPerProduct?: number | null;
  lpPerProduct?: number | null;
  profitPerProduct?: number | null;
  dpPerProduct?: number | null;
  deliveryPerProduct?: number | null;
  installationPerProduct?: number | null;
  preShipmentInspectionPerProduct?: number | null;
  trainingPerProduct?: number | null;
  softwareOSOfficePerProduct?: number | null;
  hardwareAccessoriesPerProduct?: number | null;
  bufferWarrantyPerProduct?: number | null;

  //   new Start
  taxAndVATOnePerProduct?: number | null; // value of taxAndVATOnePerProduct per row
  salesExpensePerProduct?: number | null; // value of salesExpensePerProduct per row
  agExpensePerProduct?: number | null; // value of agExpensePerProduct per row
  taxAndVATTwoPerProduct?: number | null; // value of taxAndVATTwoPerProduct per row
  taxAndVATThreePerProduct?: number | null; // value of taxAndVATThreePerProduct per row

  calculatedPrice?: number | null;
  calculatedProfit?: number | null;
  calculatedTAXVATAmount?: number | null;
  //   new END
}

export interface GetTenderCostingDto {
  buyerId: number;
  buyerName: string;
  procurementTenderId: number;
  tenderNo?: string | null;
  salesPersonId: number;
  salesPersonName: string;
  tenderEntryDate?: string | null;

  distMarginP: number;
  distMarginT: number;

  lpp: number;
  lpt: number;

  profitP: number;
  profitT: number;

  dpp: number;
  dpt: number;
  deliveryP: number;
  deliveryT: number;
  installationP: number;
  installationT: number;
  preShipmentInspectionP: number;
  preShipmentInspectionT: number;
  trainingP: number;
  trainingT: number;
  softwareOSOfficeP: number;
  softwareOSOfficeT: number;
  hardwareAccessoriesP: number;
  hardwareAccessoriesT: number;
  bufferWarrantyP: number;
  bufferWarrantyT: number;

  // new
  taxAndVATOneP: number; // TaxAndVATOne Percentage
  taxAndVATOneT: number; // TaxAndVATOne Total
  salesExpenseP: number; // SalesExpense Percentage
  salesExpenseT: number; // SalesExpense Total
  agExpenseP: number; // AgExpense Percentage
  agExpenseT: number; // AgExpense Total
  taxAndVATTwoP: number; // TaxAndVATTwo Percentage
  taxAndVATTwoT: number; // TaxAndVATTwo Total
  taxAndVATThreeP: number; // TaxAndVATThree
  taxAndVATThreeT: number; // TaxAndVATThree Total
  // new end

  bgAmount?: number | null;

  performanceGuaranteeP?: number | null;
  performanceGuaranteeA?: number | null;
  pgMarginP?: number | null;
  pgMarginAmount?: number | null;
  pgBankFinanceChargeP?: number | null;
  pgTotalYears?: number | null;
  pgPerQtChargeP?: number | null;
  pgTotalQuarter?: number | null;
  pgFixedExpense?: number | null;

  securityDepositP?: number | null;
  securityDeposit?: number | null;
  sdBankFinanceChargeP?: number | null;
  sdTotalYears?: number | null;

  getTenderCostingDetailDtos: GetTenderCostingDetailDto[];
}

export interface TenderCostingCommandsVM {
  tenderCostingData: GetTenderCostingDto;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
}
