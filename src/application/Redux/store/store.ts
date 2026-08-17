import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { PersonSlice } from '../slices/PersonSlice';
import { ActiveMenuSlice } from '../slices/ActiveMenuSlice';
import { CurrentColorSlice } from '../slices/CurrentColorSlice';
import { ScreenSizeSlice } from '../slices/ScreenSizeSlice';
import { ShowPanelSlice } from '../slices/ShowPanelSlice';
import { ThemeSettingsSlice } from '../slices/ThemeSettingsSlice';
import { CurrentModeSlice } from '../slices/CurrentModeSlice';
import { ShowNavbarSlice } from '../slices/ShowNavbarSlice';
import { IsClickedSlice } from '../slices/IsClickedSlice';
import { LastRouteSlice } from '../slices/LastRouteSlice';

import { fixedTaskTemplateApi } from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
import { BiznessEventProcessConfigurationApiSlice } from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import { SAChainMenuApiSlice } from '../../../infrastructure/api/SAChainMenuApiSlice';
import { SANextEventApiSlice } from '../../../infrastructure/api/SANextEventApiSlice';
import {
  // BiznessEventPCTrackVMApiSlice,
  BiznessEventPCTrackVMForJobHistoryApiSlice,
} from '../../../infrastructure/api/BiznessEventPCTrackVMForJobHistoryApiSlice';
import { BiznessEventPCTrackVMForTRLogApiSlice } from '../../../infrastructure/api/BiznessEventPCTrackVMForTRLogApiSlice';
import { CostSheetLCNoApiSlice } from '../../../infrastructure/api/CostSheetLCNoApiSlice';
import { TransactionAndCostingAmountApiSlice } from '../../../infrastructure/api/TransactionAndCostingAmountApiSlice';
import { EventVouchersForTransactionsApiSlice } from '../../../infrastructure/api/EventVouchersForTransactionsApiSlice';
import { CostSheetDetailApiSlice } from '../../../infrastructure/api/CostSheetDetailApiSlice';
import { AccountsNameApiSlice } from '../../../infrastructure/api/AccountsNameApiSlice';
import { GetBanksForChequeBookApi } from '../../../infrastructure/api/GetBanksForChequeBookApiSlice';
import { ChequeBookApiSlice } from '../../../infrastructure/api/ChequeBookApiSlice';
import { TenderApiSlice } from '../../../infrastructure/api/TenderApiSlice';
import { ProductApiSlice } from '../../../infrastructure/api/ProductApiSlice';
import { EmployeeApiSlice } from '../../../infrastructure/api/EmployeeApiSlice';
import { BuyerApiSlice } from '../../../infrastructure/api/BuyerApiSlice';
import { DynamicApiSlice } from '../../../infrastructure/api/DynamicApiSlice';
import { ProcurementRequisitionApiSlice } from '../../../infrastructure/api/ProcurementRequisitionApiSlice';
import { SupplierApiSlice } from '../../../infrastructure/api/SupplierApiSlice';
import { LocationApiSlice } from '../../../infrastructure/api/LocationApiSlice';
import { SecurityUserApiSlice } from '../../../infrastructure/api/SecurityUserApiSlice';
import { BiznessEventApiSlice } from '../../../infrastructure/api/BiznessEventApiSlice';
import { LoginApiSlice } from '../../../infrastructure/api/LoginApiSlice';
import { TargetSPProductGroupApiSlice } from '../../../infrastructure/api/TargetSPProductGroupApiSlice';
import { TeamAndTeamDetailApiSlice } from '../../../infrastructure/api/TeamAndTeamDetailApiSlice';
import { DepartmentApiSlice } from '../../../infrastructure/api/DepartmentApiSlice';
import { TeamSetupModalInfoSlice } from '../slices/TeamAndTargetSlice/TeamSetupModalInfoSlice';
import { ShowTeamSetupModalSlice } from '../slices/TeamAndTargetSlice/ShowTeamSetupModalSlice';
import { FromMonthYearSlice } from '../slices/RegionMasterAndTargetSlice/FromMonthYearSlice';
import { ToMonthYearSlice } from '../slices/RegionMasterAndTargetSlice/ToMonthYearSlice';
import { RegionMasterApiSlice } from '../../../infrastructure/api/RegionMasterApiSlice';
import { RegionApiSlice } from '../../../infrastructure/api/RegionApiSlice';
import { DivisionApiSlice } from '../../../infrastructure/api/DivisionApiSlice';
import { DistrictApiSlice } from '../../../infrastructure/api/DistrictApiSlice';
import { AreaApiSlice } from '../../../infrastructure/api/AreaApiSlice';
import { QuickEntryAnySectionModalInfoSlice } from '../slices/RegionMasterAndTargetSlice/QuickEntryAnySectionModalInfoSlice';
import { ReportingApiSlice } from '../../../infrastructure/api/ReportingApiSlice';
import { QuickEntryAnySectionModalInfoForBuyerSlice } from '../slices/RegionMasterAndTargetForBuyerSlice/QuickEntryAnySectionModalInfoForBuyerSlice';
import { TargetBuyerProductGroupApiSlice } from '../../../infrastructure/api/TargetBuyerProductGroupApiSlice';
import { CommissionApiSlice } from '../../../infrastructure/api/CommissionApiSlice';
import { FromDateSlice } from '../slices/DateRangePickerSlice/FromDateSlice';
import { ToDateSlice } from '../slices/DateRangePickerSlice/ToDateSlice';
import { SalesOrderApiSlice } from '../../../infrastructure/api/SalesOrderApiSlice';
import { LPurchaseInApiSlice } from '../../../infrastructure/api/LPurchaseInApiSlice';
import { PaymentModeApiSlice } from '../../../infrastructure/api/PaymentModeApiSlice';
import { CurrentStockApiSlice } from '../../../infrastructure/api/CurrentStockApiSlice';
import { PurchaseReturnApiSlice } from '../../../infrastructure/api/PurchaseReturnApiSlice';
import { DataMigrationApiSlice } from '../../../infrastructure/api/DataMigrationApiSlice';
import { EmailApiSlice } from '../../../infrastructure/api/EmailApiSlice';
import { CollectionApiSlice } from '../../../infrastructure/api/CollectionApiSlice';
import { SalesReturnApiSlice } from '../../../infrastructure/api/SalesReturnApiSlice';
import { PaymentApiSlice } from '../../../infrastructure/api/PaymentApiSlice';
import { salesOrderTrackingApi } from '../../../infrastructure/api/SalesOrderTrackingApiSlice';
import { ImportInApiSlice } from '../../../infrastructure/api/ImportInApiSlice';
import { PreImportInApiSlice } from '../../../infrastructure/api/PreImportInApiSlice';

export const store = configureStore({
  reducer: {
    person: PersonSlice.reducer,
    activeMenu: ActiveMenuSlice.reducer,
    screenSize: ScreenSizeSlice.reducer,
    currentColor: CurrentColorSlice.reducer,
    currentMode: CurrentModeSlice.reducer,
    showPanel: ShowPanelSlice.reducer,
    showNavbar: ShowNavbarSlice.reducer,
    themeSettings: ThemeSettingsSlice.reducer,
    isClicked: IsClickedSlice.reducer,
    lastRoute: LastRouteSlice.reducer,
    showTeamSetupModal: ShowTeamSetupModalSlice.reducer,
    teamSetupModalInfo: TeamSetupModalInfoSlice.reducer,
    fromMonthYear: FromMonthYearSlice.reducer,
    toMonthYear: ToMonthYearSlice.reducer,
    fromDate: FromDateSlice.reducer,
    toDate: ToDateSlice.reducer,
    quickEntryAnySectionModalInfo: QuickEntryAnySectionModalInfoSlice.reducer,
    quickEntryAnySectionModalInfoForBuyer:
      QuickEntryAnySectionModalInfoForBuyerSlice.reducer,
    [fixedTaskTemplateApi.reducerPath]: fixedTaskTemplateApi.reducer,
    [BiznessEventProcessConfigurationApiSlice.reducerPath]:
      BiznessEventProcessConfigurationApiSlice.reducer,
    [SAChainMenuApiSlice.reducerPath]: SAChainMenuApiSlice.reducer,
    [SANextEventApiSlice.reducerPath]: SANextEventApiSlice.reducer,
    [BiznessEventPCTrackVMForJobHistoryApiSlice.reducerPath]:
      BiznessEventPCTrackVMForJobHistoryApiSlice.reducer,
    [BiznessEventPCTrackVMForTRLogApiSlice.reducerPath]:
      BiznessEventPCTrackVMForTRLogApiSlice.reducer,
    [CostSheetLCNoApiSlice.reducerPath]: CostSheetLCNoApiSlice.reducer,
    [TransactionAndCostingAmountApiSlice.reducerPath]:
      TransactionAndCostingAmountApiSlice.reducer,
    [EventVouchersForTransactionsApiSlice.reducerPath]:
      EventVouchersForTransactionsApiSlice.reducer,
    [CostSheetDetailApiSlice.reducerPath]: CostSheetDetailApiSlice.reducer,
    [AccountsNameApiSlice.reducerPath]: AccountsNameApiSlice.reducer,
    [GetBanksForChequeBookApi.reducerPath]: GetBanksForChequeBookApi.reducer,
    [ChequeBookApiSlice.reducerPath]: ChequeBookApiSlice.reducer,
    [TenderApiSlice.reducerPath]: TenderApiSlice.reducer,
    [ProductApiSlice.reducerPath]: ProductApiSlice.reducer,
    [EmployeeApiSlice.reducerPath]: EmployeeApiSlice.reducer,
    [BuyerApiSlice.reducerPath]: BuyerApiSlice.reducer,
    [DynamicApiSlice.reducerPath]: DynamicApiSlice.reducer,
    [ProcurementRequisitionApiSlice.reducerPath]:
      ProcurementRequisitionApiSlice.reducer,
    [SupplierApiSlice.reducerPath]: SupplierApiSlice.reducer,
    [LocationApiSlice.reducerPath]: LocationApiSlice.reducer,
    [SecurityUserApiSlice.reducerPath]: SecurityUserApiSlice.reducer,
    [BiznessEventApiSlice.reducerPath]: BiznessEventApiSlice.reducer,
    [LoginApiSlice.reducerPath]: LoginApiSlice.reducer,
    [TargetSPProductGroupApiSlice.reducerPath]:
      TargetSPProductGroupApiSlice.reducer,
    [TargetBuyerProductGroupApiSlice.reducerPath]:
      TargetBuyerProductGroupApiSlice.reducer,
    [TeamAndTeamDetailApiSlice.reducerPath]: TeamAndTeamDetailApiSlice.reducer,
    [DepartmentApiSlice.reducerPath]: DepartmentApiSlice.reducer,
    [RegionMasterApiSlice.reducerPath]: RegionMasterApiSlice.reducer,
    [RegionApiSlice.reducerPath]: RegionApiSlice.reducer,
    [DivisionApiSlice.reducerPath]: DivisionApiSlice.reducer,
    [DistrictApiSlice.reducerPath]: DistrictApiSlice.reducer,
    [AreaApiSlice.reducerPath]: AreaApiSlice.reducer,
    [ReportingApiSlice.reducerPath]: ReportingApiSlice.reducer,
    [CommissionApiSlice.reducerPath]: CommissionApiSlice.reducer,
    [SalesOrderApiSlice.reducerPath]: SalesOrderApiSlice.reducer,
    [LPurchaseInApiSlice.reducerPath]: LPurchaseInApiSlice.reducer,
    [PaymentModeApiSlice.reducerPath]: PaymentModeApiSlice.reducer,
    [CurrentStockApiSlice.reducerPath]: CurrentStockApiSlice.reducer,
    [PurchaseReturnApiSlice.reducerPath]: PurchaseReturnApiSlice.reducer,
    [DataMigrationApiSlice.reducerPath]: DataMigrationApiSlice.reducer,
    [EmailApiSlice.reducerPath]: EmailApiSlice.reducer,
    [CollectionApiSlice.reducerPath]: CollectionApiSlice.reducer,
    [PaymentApiSlice.reducerPath]: PaymentApiSlice.reducer,
    [SalesReturnApiSlice.reducerPath]: SalesReturnApiSlice.reducer,
    [salesOrderTrackingApi.reducerPath]: salesOrderTrackingApi.reducer,
    [ImportInApiSlice.reducerPath]: ImportInApiSlice.reducer,
    [PreImportInApiSlice.reducerPath]: PreImportInApiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      fixedTaskTemplateApi.middleware,
      BiznessEventProcessConfigurationApiSlice.middleware,
      SAChainMenuApiSlice.middleware,
      SANextEventApiSlice.middleware,
      BiznessEventPCTrackVMForJobHistoryApiSlice.middleware,
      BiznessEventPCTrackVMForTRLogApiSlice.middleware,
      CostSheetLCNoApiSlice.middleware,
      TransactionAndCostingAmountApiSlice.middleware,
      EventVouchersForTransactionsApiSlice.middleware,
      CostSheetDetailApiSlice.middleware,
      AccountsNameApiSlice.middleware,
      GetBanksForChequeBookApi.middleware,
      ChequeBookApiSlice.middleware,
      TenderApiSlice.middleware,
      ProductApiSlice.middleware,
      EmployeeApiSlice.middleware,
      BuyerApiSlice.middleware,
      DynamicApiSlice.middleware,
      ProcurementRequisitionApiSlice.middleware,
      SupplierApiSlice.middleware,
      LocationApiSlice.middleware,
      SecurityUserApiSlice.middleware,
      BiznessEventApiSlice.middleware,
      LoginApiSlice.middleware,
      TargetSPProductGroupApiSlice.middleware,
      TargetBuyerProductGroupApiSlice.middleware,
      TeamAndTeamDetailApiSlice.middleware,
      DepartmentApiSlice.middleware,
      RegionMasterApiSlice.middleware,
      RegionApiSlice.middleware,
      DivisionApiSlice.middleware,
      DistrictApiSlice.middleware,
      AreaApiSlice.middleware,
      ReportingApiSlice.middleware,
      CommissionApiSlice.middleware,
      SalesOrderApiSlice.middleware,
      LPurchaseInApiSlice.middleware,
      PurchaseReturnApiSlice.middleware,
      PaymentModeApiSlice.middleware,
      CurrentStockApiSlice.middleware,
      DataMigrationApiSlice.middleware,
      EmailApiSlice.middleware,
      CollectionApiSlice.middleware,
      SalesReturnApiSlice.middleware,
      PaymentApiSlice.middleware,
      salesOrderTrackingApi.middleware,
      ImportInApiSlice.middleware,
      PreImportInApiSlice.middleware
    ),
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
