// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable no-plusplus */
// /* eslint-disable no-param-reassign */
// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable react/no-unstable-nested-components */

// import CloseIcon from '@mui/icons-material/Close';
// import { styled, alpha } from '@mui/material/styles';
// import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
// import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
// import {
//   MRT_ColumnDef,
//   MRT_TableInstance,
//   MaterialReactTable,
//   useMaterialReactTable,
// } from 'material-react-table';
// import React, {
//   ReactNode,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import {
//   Autocomplete,
//   Box,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   Modal,
//   Popper,
//   TextField,
//   Tooltip,
// } from '@mui/material';
// import { Delete, Edit, EditNotifications } from '@mui/icons-material';
// import { toast } from 'react-toastify';
// import { PropagateLoader } from 'react-spinners';
// import { useNavigate } from 'react-router-dom';

// import { IAccountsNameComboBox } from '../../../domain/interfaces/AccountsNameComboBoxInterface';
// import { useAppDispatch } from '../../../application/Redux/store/store';
// import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
// import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';
// import { useGetTeamByCompanyIdQuery } from '../../../infrastructure/api/TeamAndTeamDetailApiSlice';
// import TeamTargetGrid from './TeamTargetGrid/TeamTargetGrid';
// import TeamAndMember from './TeamAndMember/TeamAndMember';

// // const userInfo = {
// //   securityUserId: 1,
// //   userName: 'DATABIZ',
// //   email: null,
// //   password: 'DATABIZ33305',
// //   rememberMe: false,
// //   companyId: 1,
// //   locationId: 1,
// //   screenWidth: window.innerWidth,
// // };

// const RegionAndTarget = (props: any) => {
//   const navigate = useNavigate();

//   //   const dispatch = useAppDispatch();
//   //   dispatch(setNavbarShow(true));
//   //   dispatch(setPanelShow(true));

//   let userInfo: any;
//   const jsonUserInfo = localStorage.getItem('userInfo');
//   if (jsonUserInfo) {
//     userInfo = JSON.parse(jsonUserInfo);
//   }

//   if (!userInfo?.securityUserId) {
//     if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('brFeature');
//     }
//     navigate('/loginUsername');
//   }

//   const [teamMemberModal, setTeamMemberModal] = useState<boolean>(false);

//   const handleTeamMemberModalClose = () => {
//     // reset();
//     setTeamMemberModal(false);
//   };
//   // const [teamMemberModalEntryMode, setTeamMemberModalEntryMode] =
//   //   useState<string>('newEntry');

//   const [teamSetupModalInfo, setTeamSetupModalInfo] = useState({
//     teamId: 0,
//   });

//   // ------------------------API CALLS AND ASSOCIATED USE-EFFECTS------------------------

//   const {
//     data: teamsInfo,
//     isLoading: teamsInfoLoading,
//     error: teamsInfoError,
//     isSuccess: teamsInfoIsSuccess,
//     isError: teamsInfoIsError,
//     isFetching: teamsInfoIsFetching,
//     refetch: teamsInfoRefetch,
//   } = useGetTeamByCompanyIdQuery({
//     companyId: userInfo?.companyId,
//   });

//   useEffect(() => {
//     if (teamsInfoIsError) {
//       toast.error(
//         'Something wrong from backend while fetching teamsInfo, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching teamsInfo, see console--->:'
//       );
//       console.log(teamsInfoError);
//     }
//     if (teamsInfoIsSuccess) {
//       console.log('teamsInfoIsSuccess');
//       console.log(teamsInfo);
//     }
//   }, [
//     teamsInfoLoading,
//     teamsInfoIsFetching,
//     teamsInfoError,
//     teamsInfoIsError,
//     teamsInfo,
//     teamsInfoIsSuccess,
//   ]);

//   // ------------------------ENDING API CALLS AND ASSOCIATED USE-EFFECTS------------------------

//   const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
//     color: theme.palette.grey[200],
//     [`& .${treeItemClasses.content}`]: {
//       borderRadius: theme.spacing(0.5),
//       padding: theme.spacing(0.5, 1),
//       margin: theme.spacing(0.2, 0),
//       [`& .${treeItemClasses.label}`]: {
//         fontSize: '1rem',
//         fontWeight: 500,
//       },
//     },
//     [`& .${treeItemClasses.iconContainer}`]: {
//       borderRadius: '50%',
//       backgroundColor: theme.palette.primary.dark,
//       padding: theme.spacing(0, 1.2),
//       ...theme.applyStyles('light', {
//         backgroundColor: alpha(theme.palette.primary.main, 0.25),
//       }),
//       ...theme.applyStyles('dark', {
//         color: theme.palette.primary.contrastText,
//       }),
//     },
//     [`& .${treeItemClasses.groupTransition}`]: {
//       marginLeft: 15,
//       paddingLeft: 18,
//       borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
//     },
//     ...theme.applyStyles('light', {
//       color: theme.palette.grey[800],
//     }),
//   }));

//   const CustomTreeItemWithButton: React.FC<{
//     label: string;
//     teamId: number;
//     children: ReactNode;
//   }> = ({ label, teamId, children }) => (
//     <CustomTreeItem
//       key={teamId}
//       itemId={teamId.toString()}
//       label={
//         <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
//           <span className="mr-3"> {label}</span>{' '}
//           {/* Label takes the remaining space */}
//           <Tooltip
//             className=""
//             arrow
//             placement="right"
//             title="Edit Team and Member"
//           >
//             <button
//               type="button"
//               data-mdb-ripple="true"
//               data-mdb-ripple-color="light"
//               className="ml-[1px] inline-block px-[4px] py-[1px] bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//               onClick={(event) => {
//                 event.stopPropagation(); // Prevent TreeItem toggle
//                 setTeamSetupModalInfo({
//                   teamId,
//                 });
//                 setTeamMemberModal(true);
//               }}
//             >
//               <Edit sx={{ fontSize: '10px' }} />
//               {/* <i className="fas fa-edit text-[10px]" /> */}
//             </button>
//           </Tooltip>
//         </div>
//       }
//     >
//       {children}
//     </CustomTreeItem>
//   );

//   return (
//     // return wrapper div
//     <div className="mt-16 md:mt-2">
//       <div className="flex justify-center">
//         <div className="block w-[98%]">
//           {/* Main Card */}
//           {/* <form onSubmit={handleSubmit(downloadReport)}> */}
//           <form>
//             <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//               {/* Main Card header */}
//               <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//                 {/* -----[TransactionEventVoucher experimental place starts here]----- */}
//                 Region And Target
//                 {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
//               </div>
//               {/* Main Card header--/-- */}

//               {/* Main Card body */}
//               <div className="px-6 pb-4 w-full text-start  mt-5">
//                 <div>
//                   <span> Regions</span>
//                   <Tooltip
//                     className=""
//                     arrow
//                     placement="right"
//                     title="Create team"
//                   >
//                     <button
//                       type="button"
//                       data-mdb-ripple="true"
//                       data-mdb-ripple-color="light"
//                       className="ml-2 inline-block px-[4px] py-0 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                       onClick={() => {
//                         setTeamSetupModalInfo({
//                           teamId: 0,
//                         });
//                         setTeamMemberModal(true);
//                       }}
//                     >
//                       +
//                     </button>
//                   </Tooltip>
//                   <div className="ml-2 flex items-center">
//                     {/* Dashed Vertical Line */}
//                     <div className="w-0.5 h-5 border-l-2 border-dashed border-gray-400 mx-2" />
//                     {/* Text */}{' '}
//                   </div>
//                   {/* <Tooltip
//                     className=""
//                     arrow
//                     placement="right"
//                     title="Create team"
//                   >
//                     <button
//                       type="button"
//                       data-mdb-ripple="true"
//                       data-mdb-ripple-color="light"
//                       className="ml-2 inline-block px-[4px] py-0 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                       onClick={() => {
//                         setTeamSetupModalInfo({
//                           entryMode: 'newEntry',
//                           teamId: 0,
//                         });
//                         setTeamMemberModal(true);
//                       }}
//                     >
//                       +
//                     </button>
//                   </Tooltip> */}
//                 </div>

//                 {/* <Box sx={{ minHeight: 352, minWidth: 250, maxWidth: '100vw' }}> */}
//                 {/* <div className="w-[80vw]">
//                   <TeamTargetGrid teamId={1} month={1} year={2024} />
//                 </div> */}
//                 <div className="grid grid-cols-1 ">
//                   {/* <TeamTargetGridTest teamId={1} month={2} year={2024} />
//                   <TeamTargetGrid teamId={1} month={2} year={2024} /> */}
//                   <SimpleTreeView defaultExpandedItems={['grid']}>
//                     {teamsInfo?.map((teamRow) => {
//                       return (
//                         <CustomTreeItemWithButton
//                           key={teamRow.teamId}
//                           label={teamRow.teamName}
//                           teamId={teamRow.teamId}
//                         >
//                           <TeamTargetGrid teamId={teamRow.teamId} />
//                         </CustomTreeItemWithButton>
//                       );
//                     })}
//                   </SimpleTreeView>
//                 </div>
//                 {/* </Box> */}
//               </div>
//               {/* Main Card Body--/-- */}

//               {/* Main Card footer */}
//               <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//                 <div className="flex gap-x-1">
//                   <button
//                     type="button"
//                     data-mdb-ripple="true"
//                     data-mdb-ripple-color="light"
//                     className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                     onClick={() => {
//                       // setTeamMemberModalEntryMode('newEntry');
//                       setTeamSetupModalInfo({
//                         teamId: 0,
//                       });
//                       setTeamMemberModal(true);
//                       // setSelectedBepcRow({});
//                     }}
//                   >
//                     Create A Team
//                   </button>
//                   <button
//                     type="button"
//                     data-mdb-ripple="true"
//                     data-mdb-ripple-color="light"
//                     className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                     onClick={() => {
//                       // setTeamIdModal(1);
//                       // setTeamMemberModalEntryMode('allEdit');
//                       setTeamSetupModalInfo({
//                         teamId: 0,
//                       });
//                       setTeamMemberModal(true);
//                       // setSelectedBepcRow({});
//                     }}
//                   >
//                     Edit A Team
//                   </button>
//                   {/* <button
//                     type="button"
//                     data-mdb-ripple="true"
//                     data-mdb-ripple-color="light"
//                     className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                     onClick={() => {
//                       setTeamSetupModalInfo({
//                         entryMode: 'singleEdit',
//                         teamId: 1,
//                       });
//                       setTeamMemberModal(true);
//                       // setSelectedBepcRow({});
//                     }}
//                   >
//                     Edit Certain Team
//                   </button> */}
//                 </div>
//               </div>
//               {/* Main Card footer--/-- */}
//             </div>
//           </form>
//           {/* Main Card--/-- */}
//         </div>
//       </div>

//       {/* Modal for fixedTaskTemplate create---- */}
//       <Modal
//         open={teamMemberModal} // create leaf modal
//         onClose={handleTeamMemberModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         style={{
//           display: 'flex',
//           margin: 0,
//           padding: 0,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'relative',
//             width: { xs: '60vw', md: '60vw' }, // Set the width of the modal to full screen
//             // height: '95vh', // Set the height of the modal to full screen
//             backgroundColor: 'white',

//             // overflow: 'hidden',
//             borderRadius: '20px 20px 20px 20px',
//             // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
//             // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
//           }}
//         >
//           <TeamAndMember
//             teamSetupModalInfo={teamSetupModalInfo}
//             setTeamSetupModalInfo={setTeamSetupModalInfo}
//           />

//           <IconButton
//             aria-label="close"
//             onClick={handleTeamMemberModalClose}
//             sx={{
//               position: 'absolute',
//               // top: { xs: '25%', sm: '25%', md: '4%' },
//               // right: { xs: '4%', sm: '10%', md: '2%' },
//               top: '4%',
//               right: '4%',
//               color: 'red',
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Modal>
//       {/* // modals --- out of html normal body/position */}
//     </div>
//     // return wrapper div--/--
//   );
// };

// export default RegionAndTarget;
