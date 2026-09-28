import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
// import Sample from '../pages/Sample/Sample';
import './App.css';

import { FiSettings } from 'react-icons/fi';
import {
  Box,
  Fade,
  Modal,
  ThemeProvider,
  Tooltip,
  createTheme,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense } from 'react';
import Sidebar from '../components/Sidebar';
import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store';
import {
  IIsClicked,
  setAllFeatureIsClicked,
} from '../../application/Redux/slices/IsClickedSlice';
import {
  falsifyThemeSettings,
  truthifyThemeSettings,
} from '../../application/Redux/slices/ThemeSettingsSlice';
import { falsifyActiveMenu } from '../../application/Redux/slices/ActiveMenuSlice';

import ThemeSettings from '../components/ThemeSettings';
// import BiznessEventProcConfig from '../pages/BiznessEventProcConfig/BiznessEventProcConfig';
import Navbar from '../components/Navbar';
import EventsOfAChain from '../pages/EventsOfAChain/EventsOfAChain';
import { useGetSAChainMenuByCompanyLocationUserIdQuery } from '../../infrastructure/api/SAChainMenuApiSlice';
// import Laboratory from '../pages/Laboratory/Laboratory';
import CostSheetDetail from '../pages/CostSheetDetail/CostSheetDetail';
// import Login from '../pages/Login/LoginUsernameLayer';
import PrivateRoute from './PrivateRoute';
import LoginPasswordLayer from '../pages/Login/LoginPasswordLayer';
import LoginUsernameLayer from '../pages/Login/LoginUsernameLayer';
import Dashboard from '../pages/DashBoard/Dashboard';
// import ForgotPassword from '../pages/Login/ForgotPasswordCompanyLocationSelect';
import ForgotPasswordCompanyLocationSelect from '../pages/Login/ForgotPasswordCompanyLocationSelect';
import SecretQuestion from '../pages/Login/SecretQuestion';
import ResetPassword from '../pages/Login/ResetPassword';
import ChequeBookRegistration from '../pages/ChequeBookRegistration/ChequeBookRegistration';
import ProcurementTender from '../pages/TenderRequisition/ProcurementTender/ProcurementTender';
import TenderRequisiton from '../pages/TenderRequisition/TenderRequisiton';
// import TransactionLCVoucher from '../pages/TransactionLCVoucher/TransactionLCVoucher';
// import TransactionLCVoucherPage from '../pages/TransactionalLCVoucherPage/TransactionalLCVoucherPage';
import TransactionEventVoucher from '../pages/TransactionEventVoucher/TransactionEventVoucher';
import DynamicReportAnalysis from '../pages/DynamicReportAnalysis/DynamicReportAnalysis';
import CacheBuster from '../components/cacheBusterFunct/cacheBuster';
import TenderWon from '../pages/TenderWon/TenderWon';
import PurchaseComparativeSheet from '../pages/PurchaseComparativeSheet/PurchaseComparativeSheet';
import ChainConfiguration from '../pages/ChainConfiguration/ChainConfiguration';
import TeamAndTarget from '../pages/TeamAndTarget/TeamAndTarget';
import TeamAndTargetTestTree from '../pages/TeamAndTarget/TeamAndTargetTestTree';
import TeamAndTargetNew from '../pages/TeamAndTarget/TeamAndTargetNew';
import BuyerSalesReport from '../pages/BuyerSalesReport/BuyerSalesReport';
import Sample from '../pages/Sample/Sample';
import RegionMasterAndTarget from '../pages/RegionAndTarget/RegionMasterAndTarget';
import IncentiveReport from '../pages/IncentiveReport/IncentiveReport';
import RegionMasterAndBuyerTarget from '../pages/BuyerAndTarget/RegionMasterAndBuyerTarget';
import CommissionManagement from '../pages/CommissionManagement/CommissionManagement';
import ReactFlowExp from '../pages/ReactFlowExp/ReactFlowExp';
import ReactFlowExp2 from '../pages/ReactFlowExp2/ReactFlowExp2';
import DailySalesReport from '../pages/DailySalesReport/DailySalesReport';
import LPurchaseInAdditionalCost from '../pages/LPurchaseInAdditionalCost/LPurchaseInAdditionalCost';
import SalesOrderAdditionalCost from '../pages/SalesAdditionalCost/SalesOrderAdditionalCost';
import SalesOrderEdit from '../pages/SalesOrderEdit/SalesOrderEdit';
import PointOfSales from '../pages/PointOfSales/PointOfSales';
import LPurchaseInEdit from '../pages/LPurchaseInEdit/LPurchaseInEdit';
import PurchaseReturnEdit from '../pages/PurchaseReturnEdit/PurchaseReturnEdit';
import SalesImport from '../pages/DataImportPages/SalesImport/SalesImport';
import TenderCosting from '../pages/TenderCosting/TenderCosting';
import { CostingForm } from '../pages/TenderCosting/CostingFormTabular';
import PaymentEditGh from '../pages/PaymentEditGh/PaymentEditGh';
import CollectionEditGh from '../pages/CollectionEditGh/CollectionEditGh';
// import SalesReturnEdit from '../pages/SalesReturnEditGh/SalesReturnEditGh';
import CollectionImport from '../pages/DataImportPages/CollectionImport/CollectionImport';

// import PurchaseImport from '../pages/DataImportPages/PurchaseImport/PurchaseImport';
// import PurchaseReturnImport from '../pages/DataImportPages/PurchaseReturnImport/PurchaseReturnImport';
// import SalesReturnImport from '../pages/DataImportPages/SalesReturnImport/SalesReturnImport';
import CollectionEdit from '../pages/CollectionEdit/CollectionEdit';
import CurrentStockPreview from '../pages/CurrentStockPreview/CurrentStockPreview';
import SalesReturnEdit from '../pages/SalesReturnEdit/SalesReturnEdit';
import PaymentEdit from '../pages/PaymentEdit/PaymentEdit';
import PurchaseImport from '../pages/DataImportPages/PurchaseImport/PurchaseImport';
import PurchaseReturnImport from '../pages/DataImportPages/PurchaseReturnImport/PurchaseReturnImport';
import SalesReturnImport from '../pages/DataImportPages/SalesReturnImport/SalesReturnImport';
import PaymentImport from '../pages/DataImportPages/PaymentImport/PaymentImport';
import VoucherImport from '../pages/DataImportPages/VoucherImport/VoucherImport';
import SalesOrderTracking from '../pages/SalesOrderTracking/SalesOrderTracking';
import SalesOrderSummary from '../pages/SalesOrderSummary/SalesOrderSummary';
import LoginPhoneLayer from '../pages/Login/LoginPhoneLayer';
import LoginOtpLayer from '../pages/Login/LoginOtpLayer';
import ImportLCImport from '../pages/DataImportPages/ImportLCImport/ImportLCImport';
import ImportInEdit from '../pages/ImportInEdit/ImportInEdit';
// import ChainConfigurationTest from '../pages/ChainConfiguration/ChainConfigurationTest';

// const Navbar = lazy(() => import('../components/Navbar'));
// const ThemeSettings = lazy(() => import('../components/ThemeSettings'));

// import StructuredPageTSSample from '../pages/StructuredPageTSSample/StructuredPageTSSample';

// const LazyBiznessEventProcConfigPrev = lazy(
//   () => import('../pages/BiznessEventProcConfig/BiznessEventProcConfig')
// );

// const LazyBiznessEventProcConfig = lazy(
//   () =>
//     import(
//       '../pages/BiznessEventProcessConfiguration/BiznessEventProcessConfiguration'
//     )
// );

// const LazyStructuredPageTSSample = lazy(
//   () => import('../pages/StructuredPageTSSample/StructuredPageTSSample')
// );

const App = () => {
  const activeMenu = useAppSelector((state) => state.activeMenu.active);
  const showPanel = useAppSelector((state) => state.showPanel.bool);
  const showNavbar = useAppSelector((state) => state.showNavbar.bool);
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const themeSettings = useAppSelector((state) => state.themeSettings.bool);
  const screenSize = useAppSelector((state) => state.screenSize.size);
  // const userInfo = {
  //   securityUserId: 1,
  //   userName: 'DATABIZ',
  //   email: null,
  //   password: 'DATABIZ33305',
  //   rememberMe: false,
  //   companyId: 1,
  //   locationId: 1,
  //   screenWidth: 1707,
  // };

  // const navigate = useNavigate();

  let userInfo;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  // if (!userInfo?.securityUserId) {
  //   if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
  //     localStorage.removeItem('userInfo');
  //     localStorage.removeItem('brFeature');
  //   }
  //   navigate('/loginUsername');
  // }

  const {
    data: SAChainMenuData,
    isLoading: SAChainMenuLoading,
    error: SAChainMenuGetError,
    isFetching: SAChainMenuIsFetching,
  } = useGetSAChainMenuByCompanyLocationUserIdQuery(
    {
      userId: userInfo?.securityUserId || 0,
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
    },
    { refetchOnMountOrArgChange: true }
  );
  // console.log('SAChainMenuData');
  // console.log(SAChainMenuData);
  // console.log('SAChainMenuLoading---->');
  // console.log(SAChainMenuLoading);
  // console.log('SAChainMenuGetError---->');
  // console.log(SAChainMenuGetError);
  // console.log('SAChainMenuIsFetching---->');
  // console.log(SAChainMenuIsFetching);

  // const chainMenuDemo = [
  //   { fixedTaskTemplateId: 1, fixedTaskTemplateName: 'AllTemplate' },
  //   { fixedTaskTemplateId: 1, fixedTaskTemplateName: 'LC' },
  //   { fixedTaskTemplateId: 2, fixedTaskTemplateName: 'Tender' },
  //   { fixedTaskTemplateId: 3, fixedTaskTemplateName: 'Sales' },
  // ];

  const dispatch = useAppDispatch();

  const hideAllOpened = () => {
    const initialState: IIsClicked = {
      chat: false,
      cart: false,
      userProfile: false,
      notification: false,
    };

    // setThemeSettings(false);
    dispatch(falsifyThemeSettings());
    // setIsClicked(initialState);
    dispatch(setAllFeatureIsClicked({ obj: initialState }));
    // // console.log("function e dhukse");
    if (activeMenu && screenSize && screenSize <= 900) {
      //  setActiveMenu(false);
      dispatch(falsifyActiveMenu());
    }
  };

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: currentMode === 'Dark' ? 'dark' : 'light',
          },
        })}
      >
        {/* SAChainMenuLoading */}
        {!SAChainMenuLoading || SAChainMenuGetError ? (
          <BrowserRouter>
            {/* --the most super background DIV on which everything is situated---STARTS- */}
            <div className="flex  relative dark:bg-main-dark-bg">
              {/* --Settings Icon & button-- STARTS--- */}
              <div
                className="fixed right-4 bottom-4"
                style={{ zIndex: '1000' }}
              >
                <Tooltip
                  title="Settings"
                  placement="top-start"
                  style={{ zIndex: 9999 }}
                  arrow
                >
                  <button
                    type="button"
                    aria-label="Settings"
                    onClick={() => {
                      // setThemeSettings(true)
                      dispatch(truthifyThemeSettings());
                    }}
                    className="text-2xl p-3 hover:drop-shadow-2xl hover:scale-110 transform-all duration-300 hover:transform-all hover:bg-light-gray text-white"
                    style={{ background: 'blue', borderRadius: '50%' }}
                  >
                    <FiSettings />
                  </button>
                </Tooltip>
              </div>
              {/* --Settings Icon & button--ENDS--- */}

              {/* --Sidebar depending on 'activeMenu' var--  */}
              {activeMenu ? (
                <div
                  className={`w-72 fixed sidebar drop-shadow-lg bg-white dark:bg-secondary-dark-bg transition-all duration-300 ${
                    showPanel ? '' : 'hidden'
                  }`}
                  id="sidebarDiv"
                >
                  <Sidebar />
                </div>
              ) : (
                <div
                  className={`transition-all duration-300 w-0 drop-shadow-2xl  bg-white dark:bg-secondary-dark-bg ${
                    showPanel ? '' : 'hidden'
                  }`}
                >
                  <Sidebar />
                </div>
              )}
              {/* --Sidebar depending on 'activeMenu' var--ENDS----  */}

              {/* --All Routes declaration and main background starts--STARTS----  */}
              <div
                className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full
                        ${activeMenu && showPanel ? 'md:ml-72' : 'flex-2'}`}
              >
                <div
                  className={`fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ${
                    showNavbar ? '' : 'hidden'
                  }`}
                >
                  <Navbar />
                </div>

                <div>
                  {themeSettings && <ThemeSettings />}
                  {/* --declaring routes of components/pages--  */}
                  <div
                    onClick={() => hideAllOpened()}
                    onKeyDown={() => hideAllOpened()}
                    role="button"
                    tabIndex={0}
                  >
                    <Suspense fallback={<h1>LOADING............HAHA</h1>}>
                      <Routes>
                        <Route
                          path="/"
                          element={<PrivateRoute element={<Dashboard />} />}
                        />

                        <Route
                          path="loginUsername"
                          element={<LoginUsernameLayer />}
                        />
                        <Route
                          path="loginPassword"
                          element={<LoginPasswordLayer />}
                        />

                        <Route
                          path="loginPhoneLayer"
                          element={<LoginPhoneLayer />}
                        />
                        <Route
                          path="loginOtpLayer"
                          element={<LoginOtpLayer />}
                        />

                        <Route
                          path="forgotPasswordCompanyLocationSelect"
                          element={<ForgotPasswordCompanyLocationSelect />}
                        />
                        <Route
                          path="secretQuestion"
                          element={<SecretQuestion />}
                        />
                        <Route
                          path="resetPassword"
                          element={<ResetPassword />}
                        />
                        <Route
                          path="dashboard"
                          element={<PrivateRoute element={<Dashboard />} />}
                        />

                        {/* Dahsboard */}
                        {/* <Route
                      path="/"
                      element={
                        <Login_BR panelShow={false} navbarShow={false} />
                      }
                    /> */}

                        {/* <Route
                          path="/"
                          element={<LazyBiznessEventProcConfig panel navbar />}
                        />
                        <Route
                          path="bizEventProcConfig"
                          element={<LazyBiznessEventProcConfig panel navbar />}
                        /> */}
                        {/* <Route
                          path="structuredPage"
                          element={<LazyStructuredPageTSSample />}
                        /> */}
                        {/* <Route path="laboratory" element={<Laboratory />} /> */}
                        <Route
                          path="costSheetDetail"
                          // element={<CostSheetDetail />}
                          element={
                            <PrivateRoute element={<CostSheetDetail />} />
                          }
                        />
                        <Route
                          path="chequeBookManagement"
                          // element={<ChequeBookRegistration />}
                          element={
                            <PrivateRoute
                              element={<ChequeBookRegistration />}
                            />
                          }
                        />

                        <Route
                          path="transactionalLcVoucher"
                          element={
                            <PrivateRoute
                              element={
                                <TransactionEventVoucher
                                  clickedCardInfo={{
                                    biznessEventName: 'LCVoucher',
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="transactionalTenderVoucher"
                          element={
                            <PrivateRoute
                              element={
                                <TransactionEventVoucher
                                  clickedCardInfo={{
                                    biznessEventName: 'TenderVoucher',
                                  }}
                                />
                              }
                            />
                          }
                        />

                        <Route
                          path="teamAndTarget"
                          element={<PrivateRoute element={<TeamAndTarget />} />}
                        />

                        {/* <Route
                          path="cutomerWiseBgRpt"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 87,
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="bgDetailDateWiseExp"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 100,
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="tenderSummaryReport"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 101,
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="tenderAdditionalCostReport"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 103,
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="purchaseSummaryReport"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 102,
                                  }}
                                />
                              }
                            />
                          }
                        />

                        <Route
                          path="analysisHeadWiseTransactionReport"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 104,
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="chainConfigListReport"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 105,
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="runningChainsAndNextTaskReport"
                          element={
                            <PrivateRoute
                              element={
                                <DynamicReportAnalysis
                                  clickedCardInfo={{
                                    biznessEventId: 106,
                                  }}
                                />
                              }
                            />
                          }
                        /> */}
                        {/* <Route
                          path="/tenderWon"
                          element={<PrivateRoute element={<TenderWon />} />}
                        /> */}

                        <Route
                          path="tenderWonStatic"
                          element={
                            <PrivateRoute
                              element={
                                <TenderWon
                                  clickedCardInfo={{
                                    biznessEventName: 'TenderWon',
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="purchaseComparartiveSheetStatic"
                          element={
                            <PrivateRoute
                              element={
                                <PurchaseComparativeSheet
                                  clickedCardInfo={{
                                    biznessEventName:
                                      'PurchaseComparativeSheet',
                                  }}
                                />
                              }
                            />
                          }
                        />

                        <Route
                          path="transactionalTenderVoucher"
                          element={
                            <PrivateRoute
                              element={
                                <TransactionEventVoucher
                                  clickedCardInfo={{
                                    biznessEventName: 'TenderVoucher',
                                  }}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="transactionalEventVoucher"
                          element={
                            <PrivateRoute
                              element={<TransactionEventVoucher />}
                            />
                          }
                        />
                        <Route
                          path="chainConfiguration"
                          element={
                            <PrivateRoute element={<ChainConfiguration />} />
                          }
                        />
                        {/* <Route
                          path="chainConfigurationTest"
                          element={
                            <PrivateRoute
                              element={<ChainConfigurationTest />}
                            />
                          }
                        /> */}
                        <Route
                          path="teamTreeTest"
                          element={
                            <PrivateRoute element={<TeamAndTargetTestTree />} />
                          }
                        />
                        <Route
                          path="teamTreeNew"
                          element={
                            <PrivateRoute element={<TeamAndTargetNew />} />
                          }
                        />
                        <Route
                          path="regionTree"
                          element={
                            <PrivateRoute element={<RegionMasterAndTarget />} />
                          }
                        />
                        <Route
                          path="regionBuyerTree"
                          element={
                            <PrivateRoute
                              element={<RegionMasterAndBuyerTarget />}
                            />
                          }
                        />
                        <Route
                          path="buyerSalesReport"
                          element={
                            <PrivateRoute element={<BuyerSalesReport />} />
                          }
                        />
                        <Route
                          path="incentiveReport"
                          element={
                            <PrivateRoute element={<IncentiveReport />} />
                          }
                        />
                        <Route
                          path="dailySalesReport"
                          element={
                            <PrivateRoute element={<DailySalesReport />} />
                          }
                        />

                        <Route
                          path="commissionManagement"
                          element={
                            <PrivateRoute element={<CommissionManagement />} />
                          }
                        />
                        <Route
                          path="reactFlowExp"
                          element={<PrivateRoute element={<ReactFlowExp />} />}
                        />
                        <Route
                          path="reactFlowExp2"
                          element={<PrivateRoute element={<ReactFlowExp2 />} />}
                        />

                        {/* <Route
                          path="tenderRequisition"
                          // element={<ChequeBookRegistration />}
                          element={
                            <PrivateRoute element={<TenderRequisiton />} />
                          }
                        /> */}
                        <Route
                          path="tenderRequisition"
                          element={
                            <TenderRequisiton
                              clickedCardInfo={{
                                biznessEventName: 'ProcurementTender',
                                extendedBiznessEventName: [
                                  'ProcurementTenderDetail',
                                  'ProcurementTenderAdditionalCost',
                                ],
                              }}
                            />
                          }
                        />
                        <Route
                          path="salesOrderAdditionalCost"
                          // element={<ChequeBookRegistration />}
                          element={<SalesOrderAdditionalCost />}
                        />
                        <Route
                          path="lPurchaseInAdditionalCost"
                          // element={<ChequeBookRegistration />}
                          element={<LPurchaseInAdditionalCost />}
                        />
                        <Route
                          path="sample"
                          // element={<ChequeBookRegistration />}
                          element={<Sample />}
                        />

                        <Route
                          path="pointOfSales"
                          // element={<ChequeBookRegistration />}
                          element={<PointOfSales />}
                        />

                        <Route
                          path="tenderCosting"
                          // element={<ChequeBookRegistration />}
                          element={<TenderCosting />}
                        />
                        {/* //--------------------------------------------------------// */}
                        <Route
                          path="salesOrderEdit"
                          // element={<ChequeBookRegistration />}
                          element={<SalesOrderEdit />}
                        />
                        <Route
                          path="lPurchaseInEdit"
                          // element={<ChequeBookRegistration />}
                          element={<LPurchaseInEdit />}
                        />
                        <Route
                          path="purchaseReturnEdit"
                          // element={<ChequeBookRegistration />}
                          element={<PurchaseReturnEdit />}
                        />

                        <Route
                          path="paymentEdit"
                          // element={<ChequeBookRegistration />}
                          element={<PaymentEdit />}
                        />

                        <Route
                          path="collectionEditGh"
                          // element={<ChequeBookRegistration />}
                          element={<CollectionEditGh />}
                        />

                        <Route
                          path="collectionEdit"
                          // element={<ChequeBookRegistration />}
                          element={<CollectionEdit />}
                        />

                        {/* <Route
                          path="salesReturnEditGh"
                          // element={<ChequeBookRegistration />}
                          element={<SalesReturnEdit />}
                        /> */}
                        <Route
                          path="salesReturnEdit"
                          // element={<ChequeBookRegistration />}
                          element={<SalesReturnEdit />}
                        />

                        <Route
                          path="importInEdit"
                          // element={<ChequeBookRegistration />}
                          element={<ImportInEdit />}
                        />

                        {/* //--------------------------------------------------------// */}
                        <Route
                          path="salesImport"
                          // element={<ChequeBookRegistration />}
                          element={<SalesImport />}
                        />
                        <Route
                          path="collectionImport"
                          // element={<ChequeBookRegistration />}
                          element={<CollectionImport />}
                        />
                        <Route
                          path="purchaseImport"
                          element={<PurchaseImport />}
                        />
                        <Route
                          path="purchaseReturnImport"
                          element={<PurchaseReturnImport />}
                        />
                        <Route
                          path="salesReturnImport"
                          // element={<ChequeBookRegistration />}
                          element={<SalesReturnImport />}
                        />
                        <Route
                          path="paymentImport"
                          // element={<ChequeBookRegistration />}
                          element={<PaymentImport />}
                        />

                        <Route
                          path="voucherImport"
                          // element={<ChequeBookRegistration />}
                          element={<VoucherImport />}
                        />

                        <Route
                          path="importLCImport"
                          // element={<ChequeBookRegistration />}
                          element={<ImportLCImport />}
                        />

                        {/* <Route
                          path="salesOrderTracking"
                          // element={<ChequeBookRegistration />}
                          element={<SalesOrderTracking />}
                        /> */}

                        {/* <Route
                          path="jvImport"
                          // element={<ChequeBookRegistration />}
                          element={<JVImport />}
                        />
                        <Route
                          path="purchaseImport"
                          element={<PurchaseImport />}
                        />
                        <Route
                          path="purchaseReturnImport"
                          // element={<ChequeBookRegistration />}
                          element={<PurchaseReturnImport />}
                        />
                        <Route
                          path="salesReturnImport"
                          // element={<ChequeBookRegistration />}
                          element={<SalesReturnImport />}
                        /> */}

                        <Route
                          path="currentStockPreview"
                          // element={<ChequeBookRegistration />}
                          element={<CurrentStockPreview />}
                        />

                        {/* <Route
                          path="salesOrderSummary"
                          // element={<ChequeBookRegistration />}
                          element={<SalesOrderSummary />}
                        /> */}

                        {/* //--------------------------------------------------------// */}
                        {/* <Route path="login" element={<Login />} /> */}

                        {/* <Route
                        path="eventsOfchain"
                        element={
                          <EventsOfAChain biznessEventConfigurationId={11} />
                        }
                      /> */}
                        {/* {SAChainMenuData?.length ? (
                          <Route
                            key={0}
                            path="AllTemplate"
                            element={
                              <EventsOfAChain
                                fixedTaskTemplateId={0}
                                fixedTaskTemplateName="All"
                              />
                            }
                          />
                        ) : (
                          ''
                        )} */}

                        {SAChainMenuData?.map((item) => {
                          if (item.biznessEventProcessConfigurationId === 0) {
                            return (
                              <Route
                                key={item.fixedTaskTemplateId}
                                path={item.fixedTaskTemplateName.replace(
                                  /\s+/g,
                                  ''
                                )}
                                // element={
                                //   <EventsOfAChain
                                //     fixedTaskTemplateId={item.fixedTaskTemplateId}
                                //     fixedTaskTemplateName={
                                //       item.fixedTaskTemplateName
                                //     }
                                //   />
                                // }
                                element={
                                  <PrivateRoute
                                    element={
                                      <EventsOfAChain
                                        fixedTaskTemplateId={
                                          item.fixedTaskTemplateId
                                        }
                                        fixedTaskTemplateName={
                                          item.fixedTaskTemplateName
                                        }
                                      />
                                    }
                                  />
                                }
                              />
                            );
                          }
                          if (item.biznessEventProcessConfigurationId === -1) {
                            <Route
                              key={item.fixedTaskTemplateId}
                              path={item.fixedTaskTemplateName.replace(
                                /\s+/g,
                                ''
                              )}
                              // element={
                              //   <EventsOfAChain
                              //     fixedTaskTemplateId={item.fixedTaskTemplateId}
                              //     fixedTaskTemplateName={
                              //       item.fixedTaskTemplateName
                              //     }
                              //   />
                              // }
                              element={
                                <PrivateRoute
                                  element={
                                    <EventsOfAChain
                                      fixedTaskTemplateId={
                                        item.fixedTaskTemplateId
                                      }
                                      fixedTaskTemplateName={
                                        item.fixedTaskTemplateName
                                      }
                                    />
                                  }
                                />
                              }
                            />;
                          }
                          return null;
                        })}

                        {/* {SAChainMenuData?.map((item) => {
                          if (item.biznessEventProcessConfigurationId) {
                            return (
                              <Route
                                key={item.fixedTaskTemplateId}
                                path={item.fixedTaskTemplateName}
                                
                                element={
                                  <PrivateRoute
                                    element={
                                      <DynamicReportAnalysis
                                        fixedTaskTemplateId={
                                          item.fixedTaskTemplateId
                                        }
                                        fixedTaskTemplateName={
                                          item.fixedTaskTemplateName
                                        }
                                      />
                                    }
                                  />
                                }
                              />
                            );
                          }
                        })} */}

                        {SAChainMenuData?.map((item) => {
                          const tempBiznessEventProcessConfigurationIdObj = {
                            biznessEventProcessConfigurationId:
                              item.biznessEventProcessConfigurationId,
                            biznessEventName: item.fixedTaskTemplateName,
                          };

                          if (
                            item.biznessEventProcessConfigurationId !== 0 &&
                            item.biznessEventProcessConfigurationId !== -1
                          ) {
                            return (
                              <Route
                                key={item.fixedTaskTemplateId}
                                path={item.fixedTaskTemplateName.replace(
                                  /\s+/g,
                                  ''
                                )}
                                element={
                                  <PrivateRoute
                                    element={
                                      <DynamicReportAnalysis
                                        clickedCardInfo={
                                          tempBiznessEventProcessConfigurationIdObj
                                        }
                                      />
                                    }
                                  />
                                }
                              />
                            );
                          }
                          return null; // Ensure a return value for all iterations
                        })}

                        {/* <Route
                          path="/rupom"
                          element={
                            <PrivateRoute element={<CostSheetDetail />} />
                          }
                        />

                        <Route
                          path="/costSheetDetail"
                          element={
                            <PrivateRoute element={<CostSheetDetail />} />
                          }
                        />
                        <Route
                          path="/chequeBookManagement"
                          element={
                            <PrivateRoute element={<CostSheetDetail />} />
                          }
                        /> */}

                        {/* <Route
                          path="LC"
                          element={
                            <EventsOfAChain
                              fixedTaskTemplateId={1}
                              fixedTaskTemplateName="LC"
                            />
                          }
                        /> */}
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </div>
              {/* --All Routes declaration and main background starts--ENDS----  */}
            </div>
            {/* --the most super background DIV on which everything is situated---ENDS- */}
          </BrowserRouter>
        ) : (
          <div>LOADING...</div>
        )}

        <ToastContainer
          theme="colored"
          position="bottom-right"
          autoClose={3000}
          pauseOnHover
          draggable
          closeOnClick
          hideProgressBar={false}
          newestOnTop={false}
          pauseOnFocusLoss
          style={{ zIndex: 999999999999 }}
        />
      </ThemeProvider>
      <CacheBuster />
    </div>
  );
};

export default App;
