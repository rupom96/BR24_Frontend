// import { useAppSelector } from '../../application/Redux/store/store';
// import Navbar from '../components/Navbar';
// import ThemeSettings from '../components/ThemeSettings';

// const Routes = () => {
//   const activeMenu = useAppSelector((state) => state.activeMenu.active);
//   const showPanel = useAppSelector((state) => state.showPanel.bool);

//   const showNavbar: boolean = true;
//   const themeSettings: boolean = false;
//   return (
//     <div // main background
//       className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full
//     ${activeMenu && showPanel ? 'md:ml-72' : 'flex-2'}`}
//     >
//       <div
//         className={`fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ${
//           showNavbar ? '' : 'invisible'
//         }`}
//       >
//         <Navbar />
//       </div>

//       <div>
//         {themeSettings && <ThemeSettings />}
//         {/* --declaring routes of components/pages--  */}
//         <div onClick={() => hideAllOpened()}>
//           <Routes>
//             {/* Dahsboard */}
//             <Route
//               path="/"
//               element={<Login_BR panelShow={false} navbarShow={false} />}
//             />

//             {/* databiz Bizness Roots Pages */}
//             <Route
//               path="/journalVoucher"
//               element={<JournalVoucher panelShow navbarShow />}
//             />
//             {/* <Route path="/nameAgtAccSetup" element={<NameAgtAccSetup panelShow={true} navbarShow={true} />} /> */}

//             {/* <Route path="/journalVoucherEdit" element={<JournalVoucherEdit panelShow={true} navbarShow={true} />} /> */}
//             {/* <Route path="/journalVoucherSaveEdit" element={<JournalVoucherSaveEdit panelShow={true} navbarShow={true} />} /> */}

//             {/* <Route path="/newJournalVoucher" element={<NewJournalVoucher panelShow={true} navbarShow={true} />} /> */}

//             <Route path="/fileloader" element={<FileLoader />} />
//             <Route
//               path="/loginbr"
//               element={<Login_BR panelShow navbarShow />}
//             />

//             {/* dashboard hidden options */}
//             <Route
//               path="/journalVoucherIfrm"
//               element={<JournalVoucher panelShow={false} navbarShow />}
//             />
//             <Route
//               path="/testpage"
//               element={<TestPage panelShow={false} navbarShow={false} />}
//             />

//             {/* <Route path="/journalVoucherTest" element={<JournalVoucherCopy panelShow={true} navbarShow={true} />} /> */}

//             <Route
//               path="/voucherEdit"
//               element={<VoucherEdit panelShow navbarShow />}
//             />
//             {/* <Route path="/voucherApproval" element={<VoucherApproval panelShow={true} navbarShow={true} />} /> */}
//             <Route
//               path="/voucherPosting"
//               element={<VoucherPosting panelShow navbarShow />}
//             />
//             <Route
//               path="/voucherApproval"
//               element={<VoucherApproval panelShow navbarShow />}
//             />

//             <Route
//               path="/debitVoucher"
//               element={<DebitVoucher panelShow navbarShow />}
//             />
//             <Route
//               path="/creditVoucher"
//               element={<CreditVoucher panelShow navbarShow />}
//             />
//             <Route
//               path="/contraVoucher"
//               element={<ContraVoucher panelShow navbarShow />}
//             />
//             <Route
//               path="/vouchAgtVouch"
//               element={<VoucherAgainstVoucher panelShow navbarShow />}
//             />
//             <Route
//               path="/multiVouchAgtVouch"
//               element={<MultiVouchAgtVouch panelShow navbarShow />}
//             />

//             <Route
//               path="/nameAgtAccSetup"
//               element={<NameAgtAccSetup panelShow navbarShow />}
//             />
//             <Route
//               path="/analysisHeadAndGroup"
//               element={<AnalysisHeadAndGroup panelShow navbarShow />}
//             />

//             <Route
//               path="/prodPlantAndGroup"
//               element={<ProductionPlantAndGroup panelShow navbarShow />}
//             />

//             <Route
//               path="/paymentSetup"
//               element={<PaymentSetup panelShow navbarShow />}
//             />

//             {/* <Route path="/journalVoucherIfrm" element={<JournalVoucher panelShow={false} navbarShow={true} />} /> */}
//             <Route
//               path="/loginbrmain"
//               element={<Login_BR panelShow={false} navbarShow={false} />}
//             />
//             {/* <Route path="/voucherEdit" element={<VoucherEdit panelShow={false} navbarShow={false} />} /> */}
//             {/* <Route path="/jv" element={<JournalVoucher panelShow={false} navbarShow={false} />} /> */}

//             {/* <Route path="/test" element={<TestMRT />} /> */}
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Routes;
