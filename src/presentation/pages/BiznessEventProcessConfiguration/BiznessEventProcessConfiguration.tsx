// /* eslint-disable react/jsx-props-no-spreading */
// import { useEffect, useState } from 'react';
// import { Autocomplete, TextField } from '@mui/material';
// import { useAppDispatch } from '../../../application/Redux/store/store';
// import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
// import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';
// import { useGetFixedTaskTemplateComboOptionsQuery } from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
// import { IFixedTaskTemplateAutoComp } from '../../../domain/interfaces/FixedTaskTemplateInterface';
// import AttachmentLoader from '../../components/AttachmentLoader';

// type BiznessEventProcessConfigurationPageProps = {
//   panel: boolean;
//   navbar: boolean;
// };

// // main component
// const BiznessEventProcessConfiguration = ({
//   panel,
//   navbar,
// }: BiznessEventProcessConfigurationPageProps) => {
//   const dispatch = useAppDispatch();

//   // const [selectedfixedTaskTemplate, setSelectedfixedTaskTemplate] =
//   //   useState<IFixedTaskTemplateAutoComp>({} as IFixedTaskTemplateAutoComp);

//   const [selectedfixedTaskTemplate, setSelectedfixedTaskTemplate] =
//     useState<IFixedTaskTemplateAutoComp | null>(null); // Use null as the initial state

//   const {
//     data: fixedTaskTemplateOptions,
//     isLoading: fixedTaskTemplateOptionsLoading,
//     error: fixedTaskTemplateOptionsGetError,
//   } = useGetFixedTaskTemplateComboOptionsQuery(11);

//   useEffect(() => {
//     dispatch(setNavbarShow(navbar));
//     dispatch(setPanelShow(panel));
//   });

//   const [attachments, setAttachments] = useState([]);
//   const [deletedRegedAttach, setDeletedRegedAttach] = useState([]);
//   return (
//     // return wrapper div
//     <div className="mt-16 md:mt-2">
//       <div className="m-2 flex justify-center">
//         <div className="block w-11/12 ">
//           {/* Main Card */}
//           <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//             {/* Main Card header */}
//             <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//               Bizness Event Process Configuration Cleanest
//             </div>
//             {/* Main Card header--/-- */}

//             {/* Main Card body */}
//             <div className=" px-6 text-start grid grid-cols-4 gap-4 mt-2">
//               <div className="col-span-4">
//                 <form className="">
//                   <div className="w-full grid-cols-1 grid gap-x-2 gap-y-1">
//                     <div className="mb-5 grid grid-cols-2 gap-4">
//                       <div className="">Hello</div>
//                       <div className="">
//                         <AttachmentLoader
//                           attachments={attachments}
//                           setAttachments={setAttachments}
//                           deletedRegedAttach={deletedRegedAttach}
//                           setDeletedRegedAttach={setDeletedRegedAttach}
//                           imgPerSlide={3}
//                         />
//                       </div>

//                       {/* <MaterialReactTable table={tableInitializer} /> */}
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//             {/* Main Card Body--/-- */}

//             {/* Main Card footer */}
//             <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//               <div className="flex gap-x-3">
//                 {/* <button
//                type="button"
//                data-mdb-ripple="true"
//                data-mdb-ripple-color="light"
//                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                onClick={() => {
//                  testFunc();
//                }}
//              >
//                Save
//              </button> */}
//               </div>
//             </div>
//             {/* Main Card footer--/-- */}
//           </div>
//           {/* Main Card--/-- */}
//         </div>
//       </div>

//       {/* // modals --- out of html normal body/position */}
//     </div>
//     // return wrapper div--/--
//   );
// };

// export default BiznessEventProcessConfiguration;
