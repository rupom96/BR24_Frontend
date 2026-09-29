// /* eslint-disable no-plusplus */
// /* eslint-disable react-hooks/exhaustive-deps */ // ei line ta uncomment koris
// /* eslint-disable prefer-const */
// /* eslint-disable no-param-reassign */
// /* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable react/button-has-type */
// /* eslint-disable no-nested-ternary */
// /* eslint-disable react/jsx-no-useless-fragment */
// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable react/jsx-props-no-spreading */

// import {
//   Autocomplete,
//   Box,
//   IconButton,
//   Modal,
//   Stack,
//   TextField,
// } from '@mui/material';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { Controller, useForm } from 'react-hook-form';

// // import {
// //   MaterialReactTable,
// //   useMaterialReactTable,
// //   type MRT_ColumnDef,
// // } from 'material-react-table';

// import { useEffect, useMemo, useState } from 'react';
// import CloseIcon from '@mui/icons-material/Close';
// // import { Box, Stack } from '@mui/material';
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
//   type MRT_ColumnDef,
//   MRT_TableInstance,
// } from 'material-react-table';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { PropagateLoader } from 'react-spinners';
// import { useNavigate } from 'react-router-dom';
// import avatarColored3 from '../../assets/data/AvatarColored3.png'; // eitar direct link ashbe, backend jekhane host kora shekhan theke
// import { useGetAllLCNoByCompanyIdQuery } from '../../../infrastructure/api/CostSheetLCNoApiSlice';
// import { ILCNoComboBox } from '../../../domain/interfaces/LCNoComboBoxInterface';
// import { useGetTransactionNameByBiznessEventNameLCNoQuery } from '../../../infrastructure/api/TransactionAndCostingAmountApiSlice';
// import { useGetVoucherByTransactionNameQuery } from '../../../infrastructure/api/LCVouchersForTransactionsApiSlice';
// import {
//   ITransactionInfo,
//   IVouchersOfTransactions,
// } from '../../../domain/interfaces/TransactionVouchersInterface';

// const API_BASE_URL = window.API_BASE_URL;
// const BR3_API_URL = window.BR3_API_URL;
// const BR3_FN_URL = window.BR3_FN_URL;
// import {
//   IBiznessEventPCTrackCommandsVM,
//   useProcessBiznessEventPCTrackVMForTRMutation,
// } from '../../../infrastructure/api/BiznessEventPCTrackVMForTRLogApiSlice';
// import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';

// const TransactionLCVoucher = ({
//   modalPageOpenerClose,
//   clickedCardInfo,
// }: any) => {
//   // ------------[User infos and session works]-----------------

//   const navigate = useNavigate();

//   let userInfo: any;
//   const jsonUserInfoTemp = localStorage.getItem('userInfo');
//   if (jsonUserInfoTemp) {
//     userInfo = JSON.parse(jsonUserInfoTemp);
//   }

//   if (!userInfo?.securityUserId) {
//     if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('brFeature');
//     }
//     navigate('/loginUsername');
//   }

//   const formattedSessionForBr3 = {
//     userName: userInfo.userName,
//     Password: userInfo.password,
//     companyId: userInfo.companyId,
//     companyName: userInfo.companyName,
//     locationId: userInfo.locationId,
//     locationName: userInfo.locationName,
//   };

//   const afterBr3Login = {
//     UserName: userInfo.userName,
//     SecurityUserId: userInfo.securityUserId,
//     EmployeeId: userInfo.employeeId,
//     EmailAddress: userInfo.emailAddress,
//     CompanyName: userInfo.companyName,
//     CompanyId: userInfo.companyId,
//     LocationName: userInfo.locationName,
//     LocationId: userInfo.locationId,
//     Password: userInfo.password,
//     // Ip: `${BR3_API_URL}`,
//   };

//   // -----end//-------[User infos and session works]-----------------

//   const [lcNoOutput, setLcNoOutput] = useState<ILCNoComboBox | null>(null);
//   const [transactionWithVouchers, setTransactionWithVouchers] = useState<
//     ITransactionInfo[] | null
//   >(null);
//   const [loaderSpinnerForThisPage, setLoaderSpinnerForThisPage] =
//     useState<boolean>(false);

//   const [openBr3Modal, setOpenBr3Modal] = useState(false);
//   const [srcLinkStringState, setSrcLinkStringState] = useState('');
//   const [allBalanced, setAllBalanced] = useState(false);
//   const { register, getValues, reset, control, setValue } = useForm();

//   // const lcBiznessEventId=
//   const {
//     data: LCNoOptionsComboBox,
//     isLoading: LCNoOptionsComboBoxLoading,
//     error: LCNoOptionsComboBoxError,
//     refetch: LCNoOptionsComboBoxRefetch,
//   } = useGetAllLCNoByCompanyIdQuery({
//     companyId: userInfo.companyId,
//   });

//   // TransactionName RTK Query API slice hook

//   // clickedCardInfo theke lcNo ta lcNoOptions er moddhe khuje, oi khuje paoa object lcNo field e selectedOption kortesi
//   useEffect(() => {
//     console.log('LCNoOptionsComboBoxLoading');
//     console.log(LCNoOptionsComboBoxLoading);
//     console.log('LCNoOptionsComboBoxError');
//     console.log(!!LCNoOptionsComboBoxError);
//     console.log('LCNoOptionsComboBox?.length');
//     console.log(LCNoOptionsComboBox?.length);

//     if (
//       !LCNoOptionsComboBoxLoading &&
//       !LCNoOptionsComboBoxError &&
//       LCNoOptionsComboBox?.length
//     ) {
//       // alert('dhuksi');
//       let findTheFlowedLcObj = LCNoOptionsComboBox.find(
//         (row) => row.lcNo === clickedCardInfo?.eventNo
//       );
//       if (findTheFlowedLcObj) {
//         setLcNoOutput(findTheFlowedLcObj);
//       }
//     }
//   }, [
//     LCNoOptionsComboBoxLoading,
//     LCNoOptionsComboBoxError,
//     clickedCardInfo?.eventNo,
//     LCNoOptionsComboBox,
//   ]);

//   const {
//     data: TransactionNameData,
//     error: TransactionNameDataError,
//     isLoading: TransactionNameLoading,
//     refetch: TransactionNameRefetch,
//   } = useGetTransactionNameByBiznessEventNameLCNoQuery(
//     {
//       biznessEventName: 'PreImportIn',
//       lcNo: lcNoOutput?.lcNo ?? '',
//       companyId: userInfo.companyId,
//       locationId: userInfo.locationId,
//     },
//     { skip: !lcNoOutput?.costSheetId }
//   );

//   const {
//     data: LcVoucherData,
//     error: LcVoucherDataError,
//     isLoading: LcVoucherDataLoading,
//     refetch: LcVoucherDataRefetch,
//   } = useGetVoucherByTransactionNameQuery(
//     {
//       biznessEventName: 'PreImportIn',
//       lcNo: lcNoOutput?.lcNo ?? '',
//       companyId: userInfo.companyId,
//       locationId: userInfo.locationId,
//     },
//     { skip: !lcNoOutput?.costSheetId } // skip is a parameter, where it prevents the query to get automatically loaded on the render, it render the rtk hook conditionally
//   );

//   // jodi transactionName aar LCVoucherOftransaction shesh hoy tahole duita merge kortesi.
//   useEffect(() => {
//     if (
//       !LcVoucherDataLoading &&
//       !TransactionNameLoading &&
//       // lcNoOutput?.costSheetId &&
//       // LcVoucherData?.length
//       !LcVoucherDataError &&
//       TransactionNameData?.length
//     ) {
//       console.log('useEffect er If e dhukse!!!!!!!!!!!!!!!!!!!!');
//       const transactionNameArray: ITransactionInfo[] | null = JSON.parse(
//         JSON.stringify(TransactionNameData)
//       );

//       if (LcVoucherData?.length) {
//         // console.log(` LcVouche hellloyooyo`);
//         // console.log(LcVoucherData);
//         const lcVoucherForTransactionArray: ITransactionInfo[] | null =
//           JSON.parse(JSON.stringify(LcVoucherData));

//         transactionNameArray?.forEach((transaction) => {
//           const matchingVouchers = lcVoucherForTransactionArray?.filter(
//             (voucher) =>
//               voucher.voucherMatchingId === transaction.voucherMatchingId
//           );

//           if (matchingVouchers && matchingVouchers.length > 0) {
//             // If matching vouchers are found, add them to the subRows property
//             transaction.subRows = matchingVouchers;
//             let totalPostedAmount = 0;
//             for (let i = 0; i < matchingVouchers.length; i++) {
//               let tempPostedAmount = matchingVouchers[i].postedAmount
//                 ? matchingVouchers[i].postedAmount
//                 : 0;
//               totalPostedAmount += tempPostedAmount as number;
//             }
//             transaction.postedAmount = totalPostedAmount;
//           }
//         });
//       }
//       // console.log(
//       //   'HERE LOOK HERE--------LcVoucherDataLoading--------TransactionNameLoading------->'
//       // );
//       // console.log(`Loading: ${LcVoucherDataLoading}${TransactionNameLoading}`);
//       // console.log(transactionNameArray);
//       setTransactionWithVouchers(transactionNameArray);
//       // } else if (!!LcVoucherDataError && !TransactionNameDataError) {
//       //   setTransactionWithVouchers([]);
//     } else if (!!LcVoucherDataError && !TransactionNameDataError) {
//       const transactionNameArray: ITransactionInfo[] | null = JSON.parse(
//         JSON.stringify(TransactionNameData)
//       );
//       setTransactionWithVouchers(transactionNameArray);
//       // eslint-disable-next-line no-extra-boolean-cast
//     } else if (!!TransactionNameDataError) {
//       console.log(TransactionNameDataError);
//       toast.error('Error loading Transaction Names and costing Amount');
//       setTransactionWithVouchers([]);
//     }
//     //  else if (
//     //   (!!LcVoucherDataError && !!TransactionNameDataError) ||
//     //   !lcNoOutput?.costSheetId
//     // ) {
//     //   setTransactionWithVouchers([]);
//     // }
//   }, [
//     LcVoucherDataLoading,
//     TransactionNameLoading,
//     LcVoucherDataError,
//     TransactionNameDataError,
//     LcVoucherData,
//     TransactionNameData,
//   ]);

//   useEffect(() => {
//     if (lcNoOutput?.costSheetId) {
//       // ekhane set korbo daysRunning
//       setValue('lcBank', lcNoOutput.lcBank);
//       setValue('daysOfLc', lcNoOutput.daysRunning);

//       TransactionNameRefetch();
//       LcVoucherDataRefetch();
//     }
//   }, [lcNoOutput?.costSheetId]);

//   // just prottekbar table e dhukanor shomoy check kortesi shob balanced kina and shob balanced hoile flag kortesi just, ei flag
//   // useEffect(() => {
//   //   if (transactionWithVouchers?.length) {
//   //     console.log('if er moddhe theke bolsi.........');
//   //     let tempAllBalanced = true;
//   //     for (let i = 0; i < transactionWithVouchers.length; i++) {
//   //       console.log(`i= ${i}`);
//   //       console.log(`costingAmount`);
//   //       console.log(transactionWithVouchers[i].costingAmount);

//   //       console.log(`postedAmount`);
//   //       console.log(transactionWithVouchers[i].postedAmount);
//   //       let perRowCostingAmount = transactionWithVouchers[i].costingAmount;
//   //       let perRowPostedAmount = transactionWithVouchers[i].postedAmount
//   //         ? transactionWithVouchers[i].postedAmount
//   //         : 0;

//   //       if (perRowCostingAmount !== perRowPostedAmount) {
//   //         tempAllBalanced = false;
//   //       }
//   //     }
//   //     if (tempAllBalanced) {
//   //       console.log('Shobai Balanced.....');
//   //       alert('Shobai Balanced!!!');
//   //       // api to save pcTrack
//   //       // let dataToPass = {
//   //       //   Voucher: [{ VoucherNo: 'HAHA-DBZHO-2024-00001' }],
//   //       //   UserInfos: afterBr3Login,
//   //       // };
//   //       // axios
//   //       //   .post(`${BR3_API_URL}/API/VoucherPosting/Post_Voucher`, dataToPass)
//   //       //   .then((res) => {
//   //       //     if (res?.status === 200) {
//   //       //       console.log('api to save pcTrack');
//   //       //     }
//   //       //   });
//   //     }
//   //   }
//   // }, [transactionWithVouchers]);

//   const handleOpen = () => setOpenBr3Modal(true);
//   const handleClose = () => {
//     setOpenBr3Modal(false);
//     setSrcLinkStringState('');
//     // TransactionNameRefetch();
//     LcVoucherDataRefetch();
//   };

//   const btnClickCreateVoucherCallBr3 = (row: any) => {
//     console.log('Rupom dekho dekho................>>>>>>>>>>>>>>>');
//     console.log(row);
//     const jsonUserInfo = JSON.stringify(formattedSessionForBr3);

//     let srcLinkString = `${BR3_FN_URL}/lcVoucher?session=${jsonUserInfo}&voucherMatchingid=${
//       row.voucherMatchingId
//     }&postedAmount=${row.postedAmount ? row.postedAmount : 0}&costingAmount=${
//       row.costingAmount ? row.costingAmount : 0
//     }&lcNo=${lcNoOutput?.lcNo}`;

//     // let srcLinkExp = `${BR3_FN_URL}/lcVoucher?session=${jsonUserInfo}&voucherMatchingid=${row.voucherMatchingId}&postedAmount=${row.postedAmount}&lcNo=${lcNoOutput?.lcNo}`;

//     console.log(srcLinkString);
//     setSrcLinkStringState(srcLinkString);
//     setOpenBr3Modal(true);
//   };
//   const btnClickVoucherApprovalBr3 = (row: any) => {
//     let dataToPass = {
//       Voucher: [{ VoucherNo: row.voucherNo, VoucherId: row.voucherId }],
//       UserInfos: afterBr3Login,
//     };

//     setLoaderSpinnerForThisPage(true);
//     axios
//       .post(`${BR3_API_URL}/API/VoucherApproval/Approve_Voucher`, dataToPass, {
//         headers: {
//           Authorization: `Bearer ${userInfo?.userToken || ''}`,
//         },
//       })
//       .then((res) => {
//         if (res?.status === 200) {
//           console.log(`res`);
//           console.log(res);
//           // TransactionNameRefetch();
//           LcVoucherDataRefetch();
//           setLoaderSpinnerForThisPage(false);
//           toast.success(
//             `Voucher '${row.voucherNo}' has been successfully approved!`
//           );
//         }
//       });
//   };

//   const btnClickVoucherViewCallBr3 = (row: any) => {
//     const jsonUserInfo = JSON.stringify(formattedSessionForBr3);
//     let srcLinkString = `${BR3_FN_URL}/voucherPreview?session=${jsonUserInfo}&voucherId=${row.voucherId}&voucherNo=${row.voucherNo}`;
//     setSrcLinkStringState(srcLinkString);

//     console.log(srcLinkString);
//     setOpenBr3Modal(true);
//   };

//   const [
//     processBiznessEventPCTrackForTRSave,
//     {
//       isLoading: processBiznessEventPCTrackForTRSaveLoading,
//       isError: processBiznessEventPCTrackForTRSaveError,
//       isSuccess: processBiznessEventPCTrackForTRSaveIsSuccess,
//     },
//   ] = useProcessBiznessEventPCTrackVMForTRMutation();

//   useEffect(() => {
//     // if (!processBiznessEventPCTrackForTRSaveLoading) {
//     //   // loading kisu dekha
//     //   setLoaderSpinner(true);
//     // } else {
//     //   setLoaderSpinner(false);
//     // }

//     if (processBiznessEventPCTrackForTRSaveIsSuccess) {
//       TransactionNameRefetch();
//       LcVoucherDataRefetch();
//       setLoaderSpinnerForThisPage(false);
//       Swal.fire({
//         title: `All's been Balanced Successfully!`,
//         text: '',
//         showDenyButton: false,
//         allowOutsideClick: false,
//         // target: 'body',
//         icon: 'success',
//         showCancelButton: false,
//         confirmButtonText: 'OK!',
//         // denyButtonText: `No, I will set it manually!`,
//       }).then((result) => {
//         /* Read more about isConfirmed, isDenied below */
//         if (result.isConfirmed) {
//           // modalPageOpenerClose();
//         }
//       });
//     } else if (processBiznessEventPCTrackForTRSaveError) {
//       setLoaderSpinnerForThisPage(false);
//       toast.error('Something is wrong in saving PC track data');
//     }
//   }, [processBiznessEventPCTrackForTRSaveLoading]);

//   const btnClickVoucherPostBr3 = (row: any) => {
//     let dataToPass = {
//       Voucher: [{ VoucherNo: row.voucherNo, VoucherId: row.voucherId }],
//       UserInfos: afterBr3Login,
//     };

//     setLoaderSpinnerForThisPage(true);
//     axios
//       .post(`${BR3_API_URL}/API/VoucherPosting/Post_Voucher`, dataToPass, {
//         headers: {
//           Authorization: `Bearer ${userInfo?.userToken || ''}`,
//         },
//       })
//       .then((res) => {
//         if (res?.status === 200) {
//           console.log(`res.........---->>>`);
//           console.log(res);

//           // TransactionNameRefetch();
//           // LcVoucherDataRefetch();

//           let rupomString = `${API_BASE_URL}/BiznessEvent_PCTrack/getVoucherByTransactionName?biznessEventName=PreImportIn&lcNo=${lcNoOutput?.lcNo}&companyId=${userInfo.companyId}&locationId=${userInfo.locationId}`;

//           console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
//           console.log(rupomString);

//           fetch(
//             `${API_BASE_URL}/BiznessEvent_PCTrack/getVoucherByTransactionName?biznessEventName=PreImportIn&lcNo=${lcNoOutput?.lcNo}&companyId=${userInfo.companyId}&locationId=${userInfo.locationId}`
//           )
//             .then(
//               (res2) => res2.json()
//               // console.log(res);
//             )
//             .then((data) => {
//               console.log('Data ansi of vouchers....--->>>>>>>>');
//               console.log(data);

//               const tempTransactionNameArray: ITransactionInfo[] | null =
//                 TransactionNameData
//                   ? JSON.parse(JSON.stringify(TransactionNameData))
//                   : null;

//               tempTransactionNameArray?.forEach((transaction) => {
//                 const matchingVouchers = data?.filter(
//                   (voucher: any) =>
//                     voucher.voucherMatchingId === transaction.voucherMatchingId
//                 );

//                 if (matchingVouchers && matchingVouchers.length > 0) {
//                   let totalPostedAmount = 0;
//                   for (let i = 0; i < matchingVouchers.length; i++) {
//                     let tempPostedAmount = matchingVouchers[i].postedAmount
//                       ? matchingVouchers[i].postedAmount
//                       : 0;
//                     totalPostedAmount += tempPostedAmount as number;
//                   }
//                   transaction.postedAmount = totalPostedAmount;
//                 } else {
//                   transaction.postedAmount = 0;
//                 }
//               });

//               let tempAllBalanced = true;
//               for (
//                 let i = 0;
//                 i <
//                 (tempTransactionNameArray
//                   ? tempTransactionNameArray.length
//                   : 0);
//                 i++
//               ) {
//                 if (
//                   tempTransactionNameArray &&
//                   tempTransactionNameArray[i].postedAmount !==
//                     tempTransactionNameArray[i].costingAmount
//                 ) {
//                   tempAllBalanced = false;
//                 }
//               }
//               if (
//                 // maane check kortesi shob balanced naki, and page ta chain er list theke daka hoise naaki
//                 tempAllBalanced &&
//                 clickedCardInfo &&
//                 clickedCardInfo?.biznessEventProcessConfigurationId
//               ) {
//                 // alert('haha shobai balanced');

//                 const tempTaskDate = dayjs().format('YYYY-MM-DD');
//                 const tempTaskTime = dayjs().format('HH:mm');

//                 const taskStartDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;
//                 const taskEndDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;
//                 const objToSave: ICreateBiznessEventPCTrackCommand = {
//                   eventNo: clickedCardInfo.eventNo,
//                   performedBy: userInfo.securityUserId,
//                   startDate: taskStartDate,
//                   endDate: taskEndDate,
//                   note: '',
//                   progressPReported: 100,
//                   originalSequence: clickedCardInfo.sequence,
//                   nextSequence: 0,
//                   complete: false,
//                   biznessEventProcessConfigurationId:
//                     clickedCardInfo.biznessEventProcessConfigurationId,
//                   firstEventNo: clickedCardInfo.firstEventNo,
//                   locationId: clickedCardInfo.eventLocationId,
//                 };
//                 const processedData: IBiznessEventPCTrackCommandsVM = {
//                   createPCTrackCommand: objToSave,
//                   createPCTrackAttachmentCommand: [],
//                   deletePCTrackAttachmentCommand: [],
//                 };
//                 setLoaderSpinnerForThisPage(true);
//                 toast.success('Voucher posted successfully!');
//                 processBiznessEventPCTrackForTRSave(processedData);
//               } else if (
//                 // maane check kortesi shob balanced naki, and page ta chain list er theke na, bairer menu theke called naki
//                 tempAllBalanced &&
//                 !clickedCardInfo &&
//                 !clickedCardInfo?.biznessEventProcessConfigurationId
//               ) {
//                 console.log('Chain er baire, normal menu theke called');
//                 setLoaderSpinnerForThisPage(false);
//                 Swal.fire({
//                   title: `All's been Balanced Successfully!`,
//                   text: '',
//                   showDenyButton: false,
//                   allowOutsideClick: false,
//                   // target: 'body',
//                   icon: 'success',
//                   showCancelButton: false,
//                   confirmButtonText: 'OK!',
//                   // denyButtonText: `No!`,
//                 }).then((result) => {
//                   /* Read more about isConfirmed, isDenied below */
//                   if (result.isConfirmed) {
//                     // modalPageOpenerClose();
//                   }
//                 });
//               } else {
//                 TransactionNameRefetch();
//                 LcVoucherDataRefetch();
//                 setLoaderSpinnerForThisPage(false);
//                 toast.success('Voucher posted successfully!');
//               }
//             });
//         }
//       });
//   };

//   // useEffect(() => {
//   //   return () => {
//   //     console.log(
//   //       'TransactionLCVoucher close korlam..........>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
//   //     );

//   //     console.log('Close korar por, closed page theke clickedCardInfo:---');
//   //     console.log(clickedCardInfo);
//   //     // axios diye PC track e data dhukar api call dibo
//   //   };
//   // }, []);

//   const transactionLCColumns = useMemo<MRT_ColumnDef<ITransactionInfo>[]>(
//     () => [
//       {
//         accessorFn: (row) => row.transactionName ?? '', // access nested data with dot notation
//         id: 'transactionName',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Transaction Name',
//         // AggregatedCell: ({ cell, table }) => (
//         //   <>
//         //     <div>Hello</div>
//         //   </>
//         // ),
//       },
//       {
//         accessorFn: (row) => row.voucherNo ?? '',
//         id: 'voucherNo',
//         // accessorKey: 'voucherNo', // access nested data with dot notation
//         header: 'Voucher No',
//         // AggregatedCell: ({ cell, table }) => <>Total numbers of Voucher: 3</>,
//         Cell: ({ renderedCellValue, row }) => {
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake tahole branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row
//             branchRow = false;
//           }
//           return (
//             <div>
//               {branchRow ? (
//                 <div>{renderedCellValue}</div>
//               ) : (
//                 <div>{row.subRows?.length} Vouchers</div>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.voucherDate ?? '',
//         id: 'date',
//         // accessorKey: 'date',
//         header: 'Date',
//         // size: 150,
//       },
//       // className={`bg-white w-full h-full
//       //                   ${clickedCardInfo?.sequence === 1 ? '' : 'md:w-[75%]'}`}
//       {
//         accessorFn: (row) => row.preparedByName ?? '',
//         id: 'preparedBy',
//         // accessorKey: 'preparedByName', // access nested data with dot notation
//         header: 'Generated By',
//         // size: 150,
//         // Cell: ({ renderedCellValue, row }) => {
//         //   return <div className="w-full">Hello</div>;
//         // },
//         Cell: ({ renderedCellValue, row }) => {
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake tahole branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row
//             branchRow = false;
//           }
//           return (
//             <div>
//               {branchRow ? (
//                 <div>
//                   {(renderedCellValue as string) ? (
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.625rem',
//                       }}
//                     >
//                       <img
//                         className="rounded-full h-8 w-13 bg-gray-500"
//                         alt="avatar"
//                         // src={row.performedByImage? avatarColored3}
//                         src={
//                           row.original?.preparedByImage
//                             ? row.original.preparedByImage
//                             : avatarColored3
//                         }
//                       />
//                       <span>{renderedCellValue}</span>
//                     </Box>
//                   ) : (
//                     ''
//                   )}
//                 </div>
//               ) : (
//                 ''
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.approved ?? '',
//         id: 'approved',
//         // accessorKey: 'posted', // access nested data with dot notation
//         minSize: 50,
//         header: 'Approved',
//         Cell: ({ renderedCellValue, row }) => {
//           let totalVouchers = 0;
//           let totalApproved = 0;
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake, branchRow, na thakle eta parent row
//             branchRow = true;
//           } else if (row.originalSubRows?.length) {
//             // maane parent row(maane voucherNo nai) and just null check j ei parent er subRows ase kina
//             branchRow = false;
//             for (let i = 0; i < row.originalSubRows.length; i++) {
//               totalApproved += row.originalSubRows[i].approved ? 1 : 0;
//             }
//             totalVouchers = row.originalSubRows.length;
//           } else {
//             // maane voucherNo o nai, maane sure parent row, abar subRows o nai
//             branchRow = false;
//             totalVouchers = 0;
//             totalApproved = 0;
//           }
//           const totalUnApproved = totalVouchers - totalApproved;

//           // Cell: ({ renderedCellValue, row }) => {
//           //   const progressStyle = {
//           //     width: `${renderedCellValue}%`,
//           //   };
//           //   return (
//           //     <div className="w-full">
//           //       <div className="flex justify-center -mb-[1.3125rem]">
//           //         <span className="text-sm text-[0.8125rem] text-white dark:text-white">
//           //           {renderedCellValue} %
//           //         </span>
//           //       </div>
//           //       <div className="w-full bg-gray-500 rounded-full dark:bg-gray-700 text-center">
//           //         <div
//           //           className="bg-green-600 h-5  text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
//           //           style={progressStyle}
//           //         />
//           //       </div>
//           //     </div>
//           //   );
//           // },

//           return (
//             <div className="w-full">
//               {branchRow ? (
//                 <div className="flex items-center justify-center">
//                   {renderedCellValue ? (
//                     // <div className=" bg-green-700 rounded-full ">
//                     <div className="rounded-full">
//                       <i className="fas fa-check-circle text-blue-700 fa-lg text-xl" />
//                     </div>
//                   ) : (
//                     // </div>
//                     // <div className=" bg-red-800 rounded-full ">
//                     <div className="rounded-full">
//                       <i className="fas fa-times-circle text-red-700 fa-lg text-xl" />
//                     </div>
//                     // </div>
//                   )}
//                 </div>
//               ) : (
//                 <div>
//                   {totalVouchers > 0 && totalUnApproved === 0 ? (
//                     <div className="bg-blue-500 rounded-full p-2 h-7 text-white flex items-center gap-x-1">
//                       <div>
//                         <i className="fas fa-check-circle  text-slate-900 fa-lg" />{' '}
//                         All Approved
//                       </div>
//                     </div>
//                   ) : totalVouchers === 0 ? (
//                     <div className="bg-slate-500 rounded-full p-2 h-7 text-white flex items-center gap-x-1">
//                       <div>
//                         <i className="fas fa-info-circle  text-slate-900 fa-lg" />{' '}
//                         Nothing to approve
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-red-500 rounded-full p-2 h-7 text-white flex items-center gap-x-1">
//                       <div>
//                         <i className="fas fa-info-circle  text-slate-900 fa-lg" />{' '}
//                         Remaining {totalUnApproved} out of {totalVouchers}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.approvedDate ?? '',
//         id: 'approvedDate',
//         // accessorKey: 'postingDate', // access nested data with dot notation
//         header: 'Approved Date',
//         // size: 300,
//       },
//       {
//         accessorFn: (row) => row.approvedByName ?? '',
//         // accessorKey: 'approvedByName', // access nested data with dot notation
//         id: 'approvedByName',
//         // header: 'Actions',
//         header: 'Approved By',
//         Cell: ({ renderedCellValue, row }) => {
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake tahole branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row
//             branchRow = false;
//           }
//           return (
//             <div>
//               {branchRow ? (
//                 <div>
//                   {(renderedCellValue as string) ? (
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.625rem',
//                       }}
//                     >
//                       <img
//                         className="rounded-full h-8 w-13 bg-gray-500"
//                         alt="avatar"
//                         // src={row.performedByImage? avatarColored3}
//                         src={
//                           row.original?.approvedByImage
//                             ? row.original.approvedByImage
//                             : avatarColored3
//                         }
//                       />
//                       <span>{renderedCellValue}</span>
//                     </Box>
//                   ) : (
//                     ''
//                   )}
//                 </div>
//               ) : (
//                 ''
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.posted ?? '',
//         minSize: 50,
//         id: 'posted',
//         // accessorKey: 'posted', // access nested data with dot notation
//         header: 'Posted',
//         Cell: ({ renderedCellValue, row }) => {
//           let totalVouchers = 0;
//           let totalPosted = 0;
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake, branchRow, na thakle eta parent row
//             branchRow = true;
//           } else if (row.originalSubRows?.length) {
//             // maane parent row(maane voucherNo nai) and just null check j ei parent er subRows ase kina
//             branchRow = false;
//             for (let i = 0; i < row.originalSubRows.length; i++) {
//               totalPosted += row.originalSubRows[i].posted ? 1 : 0;
//             }
//             totalVouchers = row.originalSubRows.length;
//           } else {
//             // maane voucherNo o nai, maane sure parent row, abar subRows o nai
//             branchRow = false;
//             totalVouchers = 0;
//             totalPosted = 0;
//           }
//           const totalUnPosted = totalVouchers - totalPosted;

//           // Cell: ({ renderedCellValue, row }) => {
//           //   const progressStyle = {
//           //     width: `${renderedCellValue}%`,
//           //   };
//           //   return (
//           //     <div className="w-full">
//           //       <div className="flex justify-center -mb-[1.3125rem]">
//           //         <span className="text-sm text-[0.8125rem] text-white dark:text-white">
//           //           {renderedCellValue} %
//           //         </span>
//           //       </div>
//           //       <div className="w-full bg-gray-500 rounded-full dark:bg-gray-700 text-center">
//           //         <div
//           //           className="bg-green-600 h-5  text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
//           //           style={progressStyle}
//           //         />
//           //       </div>
//           //     </div>
//           //   );
//           // },

//           return (
//             <div className="w-full">
//               {branchRow ? (
//                 <div className="flex items-center justify-center">
//                   {renderedCellValue ? (
//                     // <div className=" bg-green-700 rounded-full ">
//                     <div className="rounded-full">
//                       <i className="fas fa-check-circle text-blue-700 fa-lg text-xl" />
//                     </div>
//                   ) : (
//                     // </div>
//                     // <div className=" bg-red-800 rounded-full ">
//                     <div className="rounded-full">
//                       <i className="fas fa-times-circle text-red-700 fa-lg text-xl" />
//                     </div>
//                     // </div>
//                   )}
//                 </div>
//               ) : (
//                 <div>
//                   {totalVouchers > 0 && totalUnPosted === 0 ? (
//                     <div className="bg-blue-500 rounded-full p-2 h-7 text-white flex items-center gap-x-1">
//                       <div>
//                         <i className="fas fa-check-circle  text-slate-900 fa-lg" />{' '}
//                         All Posted
//                       </div>
//                     </div>
//                   ) : totalVouchers === 0 ? (
//                     <div className="bg-slate-500 rounded-full p-2 h-7 text-white flex items-center gap-x-1">
//                       <div>
//                         <i className="fas fa-info-circle  text-slate-900 fa-lg" />{' '}
//                         Nothing to post
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-red-500 rounded-full p-2 h-7 text-white flex items-center gap-x-1">
//                       <div>
//                         <i className="fas fa-info-circle  text-slate-900 fa-lg" />{' '}
//                         Remaining {totalUnPosted} out of {totalVouchers}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.postingDate ?? '',
//         id: 'postingDate',
//         // accessorKey: 'postingDate', // access nested data with dot notation
//         header: 'Posting Date',
//         // size: 300,
//       },
//       {
//         accessorFn: (row) => row.postedByName ?? '',
//         // accessorKey: 'postedByName', // access nested data with dot notation
//         id: 'postedByName',
//         // header: 'Actions',
//         header: 'Posted By',
//         Cell: ({ renderedCellValue, row }) => {
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake tahole branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row
//             branchRow = false;
//           }
//           return (
//             <div>
//               {branchRow ? (
//                 <div>
//                   {(renderedCellValue as string) ? (
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.625rem',
//                       }}
//                     >
//                       <img
//                         className="rounded-full h-8 w-13 bg-gray-500"
//                         alt="avatar"
//                         // src={row.performedByImage? avatarColored3}
//                         src={
//                           row.original?.postedByImage
//                             ? row.original.postedByImage
//                             : avatarColored3
//                         }
//                       />
//                       <span>{renderedCellValue}</span>
//                     </Box>
//                   ) : (
//                     ''
//                   )}
//                 </div>
//               ) : (
//                 ''
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.costingAmount ?? '',
//         // accessorKey: 'costingAmount', // access nested data with dot notation
//         // header: 'Actions',
//         id: 'costingAmount',
//         header: 'Costing Amount',
//         Cell: ({ renderedCellValue, row }) => {
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake tahole branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row
//             branchRow = false;
//           }
//           return (
//             <div>
//               {branchRow ? (
//                 ''
//               ) : (
//                 <span className=" font-bold">{renderedCellValue}</span>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.postedAmount ?? '',
//         id: 'postedAmount',
//         // accessorKey: 'postedAmount', // access nested data with dot notation
//         // header: 'Actions',
//         header: 'Posted Amount',
//         Cell: ({ renderedCellValue, row }) => {
//           let postedAmountTemp = renderedCellValue
//             ? (renderedCellValue as number)
//             : 0;
//           let branchRow = true;

//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake, branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row, abar subRows o nai
//             branchRow = false;
//           }

//           return (
//             <div>
//               {!branchRow ? (
//                 <div className=" font-bold">{`${postedAmountTemp}`}</div>
//               ) : (
//                 <div>{postedAmountTemp}</div>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         // accessorFn: (row) => row.SubPaymentModeName ?? '',
//         // accessorKey: 'action', // access nested data with dot notation
//         accessorFn: (row) => '',
//         id: 'action',
//         // header: 'Actions',
//         header: 'Action',
//         size: 80,
//         Cell: ({ renderedCellValue, row }) => {
//           let branchRow = true;
//           if (row.original.voucherNo) {
//             // dekhtesi j row.original hishebe jeita ase oitar voucherNo ase kina, jodi thake tahole branchRow, na thakle eta parent row
//             branchRow = true;
//           } else {
//             // maane voucherNo o nai, maane sure parent row
//             branchRow = false;
//           }

//           const currentRowPostedAmount = row.original.postedAmount
//             ? row.original.postedAmount
//             : 0;
//           const currentRowCostingAmount = row.original.costingAmount
//             ? row.original.costingAmount
//             : 0;
//           let IsRowBalanced: boolean =
//             currentRowPostedAmount === currentRowCostingAmount; // both of these var(below one to) are used when branchRow= false
//           let IsRemainToPost: boolean = row.original.subRows
//             ? row.original.subRows.some((obj) => obj.posted === false)
//             : false;
//           // let shouldVoucherCreateBtnDisable: boolean =
//           //   IsRowBalanced || IsRemainToPost;
//           return (
//             // w-full dile shob majhe ashbe
//             <div className="flex justify-center">
//               {branchRow ? (
//                 <div className="flex gap-1">
//                   {!row.original.approved ? (
//                     <button
//                       className=" transform-all duration-300 ease-in-out border border-blue-700 text-blue-700 hover:bg-blue-700  active:bg-blue-900 hover:text-white font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden"
//                       onClick={() => {
//                         console.log('approve Button pressed!');
//                         console.log('J row te click disi');
//                         console.log(row.original);
//                         btnClickVoucherApprovalBr3(row.original);
//                       }}
//                     >
//                       <span className="text-[0.8125rem] font-bold leading-none">
//                         A
//                       </span>
//                     </button>
//                   ) : (
//                     ''
//                   )}

//                   {!row.original.posted && row.original.approved ? (
//                     <button
//                       className=" transform-all duration-300 ease-in-out border border-blue-700 text-blue-700 hover:bg-blue-700  active:bg-blue-900 hover:text-white font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden"
//                       onClick={() => {
//                         console.log('post Button pressed!');
//                         console.log('J row te click disi');
//                         console.log(row.original);
//                         btnClickVoucherPostBr3(row.original);
//                       }}
//                     >
//                       <span className="text-[0.8125rem] font-bold leading-none">
//                         P
//                       </span>
//                     </button>
//                   ) : (
//                     ''
//                   )}
//                   <button
//                     className=" transform-all duration-300 ease-in-out border border-blue-700 text-blue-700 hover:bg-blue-700  active:bg-blue-900 hover:text-white font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden"
//                     onClick={() => {
//                       console.log('PREVIEW Button pressed!');
//                       console.log('J row te click disi');
//                       console.log(row.original);
//                       btnClickVoucherViewCallBr3(row.original);
//                     }}
//                   >
//                     <span className=" font-bold text-[0.8125rem] leading-none">
//                       <i className="fas fa-search text-[0.8125rem]" />
//                     </span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex gap-1">
//                   <button
//                     // disabled={shouldVoucherCreateBtnDisable}
//                     className={`transform-all duration-700 ease-in-out border ${
//                       IsRowBalanced
//                         ? 'border-gray-400 text-gray-400 cursor-not-allowed'
//                         : IsRemainToPost
//                           ? 'border-red-700 text-red-700 hover:bg-red-700 hover:text-white'
//                           : 'border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white'
//                     } font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden`}
//                     onClick={() => {
//                       if (!IsRowBalanced && !IsRemainToPost) {
//                         console.log('create Button pressed!');
//                         console.log('J row te click disi');
//                         console.log(row.original);
//                         // handleOpen();
//                         console.log(lcNoOutput);
//                         btnClickCreateVoucherCallBr3(row.original);
//                       } else if (IsRemainToPost) {
//                         console.log(IsRemainToPost);
//                         toast.error(
//                           'Approve and Post all remaining vouchers to create another one!'
//                         );
//                       } else if (IsRowBalanced) {
//                         toast.info(
//                           'The transaction is balanced! No need to create more vouchers!'
//                         );
//                       }
//                     }}
//                   >
//                     <span className=" font-bold text-[0.8125rem] leading-none">
//                       V+
//                     </span>
//                   </button>
//                   {/* <button
//                     className=" transform-all duration-300 ease-in-out border border-blue-700 text-blue-700 hover:bg-blue-700  active:bg-blue-900 hover:text-white font-bold py-2 px-4 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden"
//                     onClick={() => {
//                       console.log('create Button pressed!');
//                       console.log('J row te click disi');
//                       console.log(row.original);
//                     }}
//                   >
//                     <span className="text-lg font-bold leading-none">
//                       P <i className="fas fa-check-double" />
//                     </span>
//                   </button> */}
//                 </div>
//               )}
//             </div>
//           );
//         },
//       },
//     ],
//     // lcNoOutput, btnClickCreateVoucherCallBr3, btnClickVoucherApprovalBr3
//     [
//       lcNoOutput,
//       btnClickCreateVoucherCallBr3,
//       btnClickVoucherApprovalBr3,
//       btnClickVoucherPostBr3,
//       btnClickVoucherViewCallBr3,
//     ]
//   );

//   const tableInitializer: MRT_TableInstance<ITransactionInfo> =
//     useMaterialReactTable({
//       columns: transactionLCColumns,
//       data: transactionWithVouchers || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//       enableBottomToolbar: false,
//       enableColumnResizing: true,
//       enableGlobalFilterModes: true,
//       enablePagination: false,
//       enableRowNumbers: false,
//       enableColumnPinning: true,
//       enableStickyHeader: true,
//       enableExpanding: true,
//       filterFromLeafRows: true, // apply filtering to all rows instead of just parent rows
//       getSubRows: (row) => (row.subRows ? row.subRows : []), // transactionName er model aar subRows(voucher) er model same kora lagbe, ami ghapla kore rakhsi pore thik korbo

//       // enableRowVirtualization: true,
//       // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
//       // enableEditing: true,
//       // enableDensityToggle: false,
//       initialState: {
//         density: 'compact',
//         columnPinning: {
//           left: ['transactionName', 'mrt-row-expand', 'voucherNo'],
//           right: ['action'],
//         },
//         // expanded: true, //expand all groups by default
//         // grouping: ['transactionName'], // an array of columns to group by by default (can be multiple)
//       },
//       muiTablePaperProps: {
//         elevation: 0, // change the mui box shadow
//         // customize paper styles
//         sx: {
//           borderRadius: '0',
//           border: '1px dashed #e0e0e0',
//         },
//       },
//       muiTableBodyCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora cz raw css diye
//           // borderLeft: '1px solid #e0e0e0',
//           // borderTop: '1px solid #e0e0e0',
//           // borderBottom: '1px solid #e0e0e0',
//           fontSize: '0.8125rem',
//         },
//       },
//       muiTableHeadCellProps: {
//         sx: {
//           borderRight: '1px solid #e0e0e0', // add a border between columns
//           // borderLeft: '1px solid #e0e0e0',
//           borderTop: '1px solid #e0e0e0',
//           // borderBottom: '1px solid #e0e0e0',
//           fontSize: '0.8125rem',
//           whiteSpace: 'nowrap',
//         },
//       },

//       muiTableContainerProps: { sx: { maxHeight: '32.5rem' } },
//       // onSortingChange: setSorting,
//       // state: { isLoading, sorting },
//       // rowVirtualizerInstanceRef, // optional
//       // rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer

//       // enableGrouping: true,

//       displayColumnDefOptions: {
//         'mrt-row-expand': {
//           // enableResizing: true,
//           enablePinning: true,
//           size: 5,
//           // grow: false,
//           // enableColumnActions: true,
//         },
//       },
//       // muiToolbarAlertBannerProps: { sx: { display: 'none' } }, // eita na dile upore grouped by Transaction Name ashe.. oita bondho kora
//       // state: {
//       //   showAlertBanner: false,
//       // },
//       // muiToolbarAlertBannerChipProps: { color: 'primary' },
//     });

//   return (
//     // return wrapper div
//     <div className="mt-16 md:mt-2">
//       <div className="flex justify-center">
//         <div className="block w-[98%]">
//           {/* Main Card */}
//           <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//             {/* Main Card header */}
//             <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//               {/* -----[TransactionLCVoucher experimental place starts here]----- */}
//               TransactionLCVoucher
//               {/* ---//--[TransactionLCVoucher experimental place ENDS here]----- */}
//             </div>
//             {/* Main Card header--/-- */}

//             {/* Main Card body */}
//             <div className="px-6 pb-4 text-start md:min-h-[80vh] mt-5">
//               <div className="grid grid-cols-4 gap-x-4 mx-1">
//                 <div>
//                   <Autocomplete
//                     id="lcNo"
//                     clearOnEscape
//                     size="small"
//                     options={LCNoOptionsComboBox ?? []}
//                     value={lcNoOutput || null}
//                     // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
//                     getOptionLabel={(option) =>
//                       option?.lcNo ? option.lcNo : ''
//                     }
//                     onChange={(e, selectedOption) => {
//                       if (selectedOption) {
//                         setLcNoOutput(selectedOption);
//                       }
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         sx={{ width: '100%', marginTop: 1 }}
//                         {...params}
//                         // {...register('location')}
//                         InputProps={{
//                           ...params.InputProps,
//                           readOnly: true,
//                           style: { fontSize: '0.8125rem' },
//                         }}
//                         InputLabelProps={{
//                           ...params.InputLabelProps,
//                           style: { fontSize: '0.875rem' },
//                         }}
//                         label="L/C No."
//                         variant="outlined"
//                       />
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       label="LC Date"
//                       // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
//                       // visit https://day.js.org/docs/en/parse/string-format for datetime formats
//                       inputFormat="DD/MM/YYYY"
//                       renderInput={(params) => (
//                         <TextField
//                           sx={{ width: '100%', marginTop: 1 }}
//                           {...params}
//                           // {...register('taskDate')}
//                           // defaultValue={voucherDateState}
//                           InputProps={{
//                             ...params.InputProps,
//                             readOnly: true,
//                             style: { fontSize: '0.8125rem' },
//                           }}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: '0.875rem' },
//                           }}
//                           variant="outlined"
//                           size="small"
//                         />
//                       )}
//                       value={
//                         lcNoOutput?.lcDate ? dayjs(lcNoOutput?.lcDate) : null
//                       }
//                       onChange={(newValue) => {
//                         if (newValue) {
//                           // setTaskDate(newValue);
//                         }
//                       }}
//                     />
//                   </LocalizationProvider>
//                 </div>
//                 <div>
//                   <Controller
//                     name="daysOfLc"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         // eslint-disable-next-line react/jsx-props-no-spreading
//                         {...field}
//                         sx={{ width: '100%', borderRadius: '3.125rem' }}
//                         InputProps={{
//                           readOnly: true,
//                           style: { fontSize: '0.8125rem' },
//                         }}
//                         InputLabelProps={{
//                           style: { fontSize: '0.875rem' },
//                           shrink: field.value,
//                           // shrink: (field.value ? true : false)
//                         }}
//                         id=""
//                         label="Days Running"
//                         variant="outlined"
//                         size="small"
//                       />
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <Controller
//                     name="lcBank"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         // eslint-disable-next-line react/jsx-props-no-spreading
//                         {...field}
//                         sx={{ width: '100%', borderRadius: '3.125rem' }}
//                         InputProps={{
//                           readOnly: true,
//                           style: { fontSize: '0.8125rem' },
//                         }}
//                         InputLabelProps={{
//                           style: { fontSize: '0.875rem' },
//                           shrink: field.value,
//                           // shrink: (field.value ? true : false)
//                         }}
//                         id=""
//                         label="LC Bank"
//                         variant="outlined"
//                         size="small"
//                       />
//                     )}
//                   />
//                 </div>
//                 <div className=" col-span-4 m-1">
//                   <MaterialReactTable table={tableInitializer} />
//                 </div>
//               </div>
//             </div>
//             {/* Main Card Body--/-- */}

//             {/* Main Card footer */}
//             <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//               <div className="flex gap-x-3">
//                 {/* <button
//                    type="button"
//                    data-mdb-ripple="true"
//                    data-mdb-ripple-color="light"
//                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                    onClick={() => {
//                      testFunc();
//                    }}
//                  >
//                    Save
//                  </button> */}
//               </div>
//             </div>
//             {/* Main Card footer--/-- */}
//           </div>
//           {/* Main Card--/-- */}
//         </div>
//       </div>

//       <Modal
//         open={openBr3Modal}
//         onClose={handleClose}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 10000,
//         }}
//       >
//         <Box
//           sx={{
//             position: 'relative',
//             width: '95vw', // Set the width of the modal to full screen
//             height: '95vh', // Set the height of the modal to full screen
//             backgroundColor: 'white',
//             overflow: 'hidden',
//           }}
//           className="voucherGenModal"
//         >
//           <iframe
//             title="My iframe"
//             // src="https://br3-retails-startech.netlify.app/"
//             // src="http://103.147.56.140:11117/ProcurementRequisition/Index"
//             src={srcLinkStringState}
//             width="100%"
//             height="100%"
//             frameBorder="0"
//           />
//           {/* Close button */}
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             sx={{
//               position: 'absolute',
//               top: '0.5rem',
//               right: '0.5rem',
//               color: 'gray',
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Modal>

//       {/* Making a loader modal */}
//       <Modal
//         open={loaderSpinnerForThisPage}
//         // onClose={handleClose}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 10000000000,
//         }}
//       >
//         <Box
//           sx={{
//             position: 'relative',
//             width: '95vw', // Set the width of the modal to full screen
//             height: '95vh', // Set the height of the modal to full screen
//             backgroundColor: 'rgba(251, 255, 255, 0)',
//             overflow: 'hidden',
//           }}
//           className="voucherGenModal"
//         >
//           <div className="flex justify-center bg-transparent ">
//             <div className="mt-[21.875rem] bg-transparent">
//               <PropagateLoader
//                 color="#36d7b7"
//                 loading
//                 // cssOverride={override}
//                 size={30}
//                 aria-label="Loading Spinner"
//                 data-testid="loader"
//               />
//               <div className="mt-10 ml-[-50px] px-3 text-left text-white bg-slate-700 rounded-full">
//                 Please Wait a bit...
//               </div>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//       {/* // modals --- out of html normal body/position */}
//     </div>
//     // return wrapper div--/--
//   );
// };

// export default TransactionLCVoucher;
