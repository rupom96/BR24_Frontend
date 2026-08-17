// /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable no-plusplus */
// /* eslint-disable no-param-reassign */
// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable react/no-unstable-nested-components */

// import CloseIcon from '@mui/icons-material/Close';
// import React, {
//   ReactElement,
//   ReactNode,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import { Box, IconButton, Modal, Tooltip } from '@mui/material';
// import { Edit } from '@mui/icons-material';
// import { toast } from 'react-toastify';

// import { useNavigate } from 'react-router-dom';

// import { useGetTeamByCompanyIdQuery } from '../../../infrastructure/api/TeamAndTeamDetailApiSlice';
// import TeamTargetGrid from './TeamTargetGrid/TeamTargetGrid';
// import TeamAndMember from './TeamAndMember/TeamAndMember';
// import {
//   useAppDispatch,
//   useAppSelector,
// } from '../../../application/Redux/store/store';
// import { changeTeamSetupModalInfo } from '../../../application/Redux/slices/TeamAndTargetSlice/TeamSetupModalInfoSlice';
// import {
//   falsifyShowTeamSetupModal,
//   truthifyShowTeamSetupModal,
// } from '../../../application/Redux/slices/TeamAndTargetSlice/ShowTeamSetupModalSlice';
// import TeamAndMemberNew from './TeamAndMember/TeamAndMemberNew';

// interface SimpleTreeViewProps {
//   defaultExpandedItems?: string[];
//   children: ReactNode; // The children can be any ReactNode
// }

// interface CustomTreeItemWithButtonProps {
//   label: string;
//   id: number;
//   children?: ReactNode;
//   expandedItems?: string[]; // This property will be passed down
//   toggleItem?: (itemId: string) => void; // This function will be passed down
//   focusedItemId?: string | null; // This property will be passed down
// }

// const SimpleTreeView: React.FC<SimpleTreeViewProps> = React.memo(
//   ({ defaultExpandedItems = [], children }) => {
//     const [expandedItems, setExpandedItems] =
//       useState<string[]>(defaultExpandedItems);
//     const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

//     const toggleItem = (itemId: string) => {
//       setExpandedItems((prev) =>
//         prev.includes(itemId)
//           ? prev.filter((id) => id !== itemId)
//           : [...prev, itemId]
//       );
//       setFocusedItemId(itemId); // Set the clicked item as focused
//     };

//     return (
//       <div className="tree-view">
//         {React.Children.map(children, (child) => {
//           if (React.isValidElement(child)) {
//             return React.cloneElement(
//               child as ReactElement<CustomTreeItemWithButtonProps>,
//               {
//                 expandedItems,
//                 toggleItem,
//                 focusedItemId: focusedItemId ?? undefined,
//               }
//             );
//           }
//           return child;
//         })}
//       </div>
//     );
//   }
// );

// const CustomTreeItemWithButton: React.FC<CustomTreeItemWithButtonProps> =
//   React.memo(
//     ({
//       label,
//       id,
//       children,
//       expandedItems = [],
//       toggleItem,
//       focusedItemId,
//     }) => {
//       const isExpanded = expandedItems.includes(id.toString());
//       const isFocused = focusedItemId === id.toString();
//       const dispatch = useAppDispatch();
//       return (
//         <div className="tree-item m-1">
//           <div
//             className={`flex items-center cursor-pointer px-2 py-1 rounded-md transition-colors duration-300
//                 hover:bg-blue-100 active:bg-blue-200 focus:outline-none ${
//                   isFocused ? 'bg-blue-200' : ''
//                 }`}
//             onClick={() => toggleItem?.(id.toString())}
//             tabIndex={0}
//           >
//             <button
//               type="button"
//               className={`mr-2 transform ${isExpanded ? 'rotate-90' : ''}`}
//             >
//               <i className="fas fa-chevron-circle-right text-[15px] text-blue-600" />
//             </button>

//             <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
//               <span className=" mr-3 text-slate-800 text-[14px]">{label}</span>

//               <Tooltip arrow placement="right" title="Edit Team and Member">
//                 <button
//                   type="button"
//                   className="ml-[1px] inline-block px-[4px] py-[1px] bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg"
//                   onClick={(event) => {
//                     event.stopPropagation();
//                     // setTeamSetupModalInfo({ teamId: id });
//                     dispatch(changeTeamSetupModalInfo({ teamId: id }));
//                     dispatch(truthifyShowTeamSetupModal());

//                     // setTeamMemberModal(true);
//                   }}
//                 >
//                   <Edit sx={{ fontSize: '9px' }} />
//                 </button>
//               </Tooltip>
//             </div>
//           </div>

//           <div
//             className={`overflow-hidden transition-all duration-500 ease-in-out ${
//               isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
//             }`}
//           >
//             <div className="relative">
//               <div
//                 className={`border-l-2 border-dashed border-gray-400 ml-[14px] transition-all duration-500 ease-in-out ${
//                   isExpanded ? 'max-h-screen' : 'h-0'
//                 }`}
//               >
//                 <div className="ml-3 text-sm text-gray-700">{children}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//   );

// const TeamSetupModal = React.memo(() => {
//   const teamMemberModal = useAppSelector(
//     (state) => state.showTeamSetupModal.bool
//   );

//   const dispatch = useAppDispatch();
//   const handleTeamMemberModalClose = () => {
//     // reset();
//     dispatch(changeTeamSetupModalInfo({ teamId: 0 }));
//     dispatch(falsifyShowTeamSetupModal());
//   };

//   return (
//     <Modal
//       open={teamMemberModal} // create leaf modal
//       onClose={handleTeamMemberModalClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//       style={{
//         display: 'flex',
//         margin: 0,
//         padding: 0,
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Box
//         sx={{
//           position: 'relative',
//           width: { xs: '60vw', md: '60vw' }, // Set the width of the modal to full screen

//           backgroundColor: 'white',

//           borderRadius: '20px 20px 20px 20px',
//         }}
//       >
//         <TeamAndMemberNew />

//         <IconButton
//           aria-label="close"
//           onClick={handleTeamMemberModalClose}
//           sx={{
//             position: 'absolute',
//             top: '4%',
//             right: '4%',
//             color: 'red',
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
//     </Modal>
//   );
// });

// const TeamAndTargetNew = React.memo((props: any) => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

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
//                 Team And Target
//                 {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
//               </div>
//               {/* Main Card header--/-- */}

//               {/* Main Card body */}
//               <div className="px-6 pb-4 w-full text-start  mt-5">
//                 <div>
//                   <span> Teams</span>
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
//                         dispatch(changeTeamSetupModalInfo({ teamId: 0 }));
//                         dispatch(truthifyShowTeamSetupModal());
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
//                 </div>

//                 <div className="grid grid-cols-1 ">
//                   <SimpleTreeView defaultExpandedItems={['0']}>
//                     {teamsInfo?.map((teamRow) => {
//                       return (
//                         <CustomTreeItemWithButton
//                           key={teamRow.teamId}
//                           label={teamRow.teamName}
//                           id={teamRow.teamId}
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
//                       dispatch(changeTeamSetupModalInfo({ teamId: 0 }));
//                       dispatch(truthifyShowTeamSetupModal());
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
//                       dispatch(changeTeamSetupModalInfo({ teamId: 0 }));
//                       dispatch(truthifyShowTeamSetupModal());
//                     }}
//                   >
//                     Edit A Team
//                   </button>
//                 </div>
//               </div>
//               {/* Main Card footer--/-- */}
//             </div>
//           </form>
//           {/* Main Card--/-- */}
//         </div>
//       </div>
//       <TeamSetupModal />
//     </div>
//     // return wrapper div--/--
//   );
// });

// export default TeamAndTargetNew;
