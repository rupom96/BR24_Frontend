// /* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable @typescript-eslint/no-shadow */
// /* eslint-disable no-unsafe-optional-chaining */
// /* eslint-disable react/jsx-pascal-case */
// /* eslint-disable jsx-a11y/control-has-associated-label */
// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable no-param-reassign */
// /* eslint-disable no-nested-ternary */
// /* eslint-disable guard-for-in */
// /* eslint-disable no-restricted-syntax */
// /* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-plusplus */
// /* eslint-disable @typescript-eslint/ban-types */
// // import { useForm } from 'react-hook-form';
// import CloseIcon from '@mui/icons-material/Close';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import dayjs from 'dayjs';
// import { useNavigate } from 'react-router-dom';

// import {
//   Autocomplete,
//   Box,
//   CircularProgress,
//   IconButton,
//   Modal,
//   Popper,
//   TextField,
//   Tooltip,
// } from '@mui/material';
// import {
//   DatePicker,
//   DateTimePicker,
//   LocalizationProvider,
// } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import axios from 'axios';
// import {
//   MaterialReactTable,
//   MRT_ColumnDef,
//   MRT_RowSelectionState,
//   MRT_Row,
//   MRT_ShowHideColumnsButton,
//   MRT_TableInstance,
//   MRT_ToggleFiltersButton,
//   MRT_ToggleFullScreenButton,
//   MRT_ToggleGlobalFilterButton,
//   useMaterialReactTable,
// } from 'material-react-table';
// import { Delete, Edit } from '@mui/icons-material';
// import { ExportToCsv } from 'export-to-csv';
// import { BsEye } from 'react-icons/bs';
// import {
//   ILocationDto,
//   ISecurityUserDto,
//   IUserInfo,
// } from '../../../domain/interfaces/UserInfoInterface';

// import { IBiznessEventOption } from '../../../domain/interfaces/IBiznessEventInterface';
// import DualListSelector from '../../components/biz24Components/DualListSelector/DualListSelector';
// import { useGetFixedTaskTemplateComboOptionsQuery } from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
// import { useGetBiznessEventProcessConfigurationInfoByFixedTaskTemplateIdQuery } from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
// import {
//   IFixedTaskTemplateAutoComp,
//   // IPCLocationListDto,
//   // IPCProductGroupListDto,
//   // IPCUserProductGroupListDto,
// } from '../../../domain/interfaces/FixedTaskTemplateInterface';
// import {
//   IRequestPCLocationListDtos,
//   useGetLocationByCompanyQuery,
// } from '../../../infrastructure/api/LocationApiSlice';
// import {
//   useGetBrandByCompanyIdQuery,
//   useGetProductByCompanyProductGroupIdQuery,
//   useGetProductGroupByCompanyIdQuery,
// } from '../../../infrastructure/api/ProductApiSlice';
// import {
//   IBrand,
//   IProductGroupComboBox,
// } from '../../../domain/interfaces/ProductInterfaces';
// import DualListSelectorWithGrid from '../../components/biz24Components/DualListSelectorWithGrid/DualListSelectorWithGrid';
// import { useGetAllBiznessEventsQuery } from '../../../infrastructure/api/BiznessEventApiSlice';
// import DualListSelectorWithRowSelection from '../../components/biz24Components/DualListSelectorWithRowSelection/DualListSelectorWithRowSelection';
// import { useGetSecurityUserByCompanyIdQuery } from '../../../infrastructure/api/SecurityUserApiSlice';
// import {
//   IBiznessEventProcessConfigurationInfoForChainConfig,
//   IPCBrandListDto,
//   IPCButtonListDto,
//   IPCLocationListDtos,
//   IPCProductGroupListDtos,
//   IPCUserBrandListDtos,
//   IPCUserListDtos,
//   IPCUserProductGroupListDtos,
//   IPCUserProductListDto,
// } from '../../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';

// const API_BASE_URL = window.API_BASE_URL;

// // I guess most perfectly fetched data

// // interface IBiznessEventProcessConfigurationInfoForChainConfig {
// //   biznessEventProcessConfigurationId: number; //
// //   fixedTaskTemplateId: number; //
// //   biznessEventId: number; //
// //   biznessEventName: string | null;
// //   controllerPath: string | null;
// //   controllerParameter: string | null;
// //   sequence: number | null;
// //   mailTemplate: string | null;
// //   smsTemplate: string | null;
// //   dateOfEntry: string | null;
// //   enteredById: number | null;
// //   mandatoryAttachment: boolean | null;
// //   actionType: string | null;
// //   prevBiznessEventId: number | null;
// //   nextActionMethod: string | null;
// //   relationKey: string; //
// //   maxTimeInHours: number; //
// //   maxTimeInDays: number; //
// //   extendedBiznessEventId: string | null;
// //   pcLocationListDtos: IPCLocationListDtos[] | null;
// //   pcProductGroupListDtos: IPCProductGroupListDtos[] | null;
// //   pcBrandListDto: IPCBrandListDto[] | null;
// // }
// // interface IPCLocationListDtos {
// //   biznessEventPCLocationId: number;
// //   biznessEventProcessConfigurationId: number;
// //   locationId: number;
// //   locationName: string;
// //   pcUserListDtos: IPCUserListDtos[];
// // }
// // interface IPCUserListDtos {
// //   biznessEventPCLocationId?: number | null;
// //   biznessEventPCUserId?: number;
// //   biznessEventProcessConfigurationId?: number;
// //   userId: number;
// //   userName: string;
// //   mandatory?: boolean | null;
// //   crud?: string;
// //   maxActionTimeInDays?: number;
// //   totalEventValueLimit?: number;
// //   pcUserProductGroupListDtos?: IPCUserProductGroupListDtos[] | null;
// //   pcUserBrandListDtos?: IPCUserBrandListDtos[] | null;
// //   pcUserProductListDtos?: IPCUserProductListDto[] | null;
// //   pcButtonListDtos?: IPCButtonListDto[] | null;
// // }
// // interface IPCUserProductGroupListDtos {
// //   biznessEventPCUserProductGroupId: number;
// //   biznessEventPCUserId: number;
// //   productGroupId: number;
// //   productGroupName: string;
// //   productValueLimit: number;
// // }
// // interface IPCUserBrandListDtos {
// //   biznessEventPCUserBrandId?: number | null;
// //   biznessEventPCUserId?: number | null;
// //   brandId: number;
// //   brandName: string;
// //   brandValueLimit?: number | null;
// // }
// // interface IPCUserProductListDto {
// //   biznessEventPCUserId?: number | null;
// //   productId: number;
// //   productName: number;
// // }

// // interface IPCButtonListDto {
// //   biznessEventPCPageButtonAccessId: number;
// //   biznessEventPCPageGenActionId: number; // buttonId
// //   biznessEventPCPageGenActionName: string; // buttonName
// //   biznessEventPCUserId: number;
// // }
// // interface IPCProductGroupListDtos {
// //   biznessEventProcessConfigurationId: number;
// //   productGroupId: number;
// //   productGroupName: string;
// // }
// // interface IPCBrandListDto {
// //   biznessEventProcessConfigurationId: number;
// //   brandId: number;
// //   brandName: string;
// // }

// // const rupomData: IBiznessEventProcessConfigurationInfoForChainConfig[] = [
// //   {
// //     biznessEventProcessConfigurationId: 13,
// //     fixedTaskTemplateId: 1,
// //     biznessEventId: 1,
// //     biznessEventName: 'Sales',
// //     controllerPath: 'url#/Approval/Index?value=PRE',
// //     controllerParameter: 'string',
// //     sequence: 1,
// //     mailTemplate: 'string',
// //     smsTemplate: 'string',
// //     dateOfEntry: '2023-12-17 16:54:25.177',
// //     enteredById: 1,
// //     mandatoryAttachment: true,
// //     actionType: 'E',
// //     prevBiznessEventId: 1012,
// //     nextActionMethod: null,
// //     relationKey: 'ProcurementRequisition.RequisitionNo',
// //     maxTimeInHours: 11,
// //     maxTimeInDays: 11,
// //     extendedBiznessEventId: '81#82',
// //     pcLocationListDtos: [
// //       {
// //         biznessEventPCLocationId: 1,
// //         biznessEventProcessConfigurationId: 13,
// //         locationId: 1,
// //         locationName: 'Head office',
// //         pcUserListDtos: [
// //           {
// //             biznessEventPCLocationId: 1,
// //             biznessEventPCUserId: 1,
// //             biznessEventProcessConfigurationId: 13,
// //             userId: 20175,
// //             userName: 'ABDULLAH',
// //             mandatory: true,
// //             crud: 'CRUD',
// //             maxActionTimeInDays: 22,
// //             totalEventValueLimit: 22,
// //             pcUserProductGroupListDtos: [
// //               {
// //                 biznessEventPCUserProductGroupId: 1,
// //                 biznessEventPCUserId: 1,
// //                 productGroupId: 356,
// //                 productGroupName: 'Mobile Accessories',
// //                 productValueLimit: 5000,
// //               },
// //               {
// //                 biznessEventPCUserProductGroupId: 2,
// //                 biznessEventPCUserId: 1,
// //                 productGroupId: 357,
// //                 productGroupName: 'Laptop Accessories',
// //                 productValueLimit: 6000,
// //               },
// //             ],
// //             pcUserBrandListDtos: [
// //               {
// //                 biznessEventPCUserBrandId: 1,
// //                 biznessEventPCUserId: 1,
// //                 brandId: 1,
// //                 brandName: 'Samsung',
// //                 brandValueLimit: 1000,
// //               },
// //               {
// //                 biznessEventPCUserBrandId: 2,
// //                 biznessEventPCUserId: 1,
// //                 brandId: 2,
// //                 brandName: 'Apple',
// //                 brandValueLimit: 2000,
// //               },
// //             ],
// //             pcButtonListDtos: [
// //               {
// //                 biznessEventPCPageButtonAccessId: 3,
// //                 biznessEventPCPageGenActionId: 1,
// //                 biznessEventPCPageGenActionName: 'Download A Report',
// //                 biznessEventPCUserId: 1,
// //               },
// //               {
// //                 biznessEventPCPageButtonAccessId: 4,
// //                 biznessEventPCPageGenActionId: 9,
// //                 biznessEventPCPageGenActionName: 'Download B Report',
// //                 biznessEventPCUserId: 1,
// //               },
// //             ],
// //           },
// //           {
// //             biznessEventPCLocationId: 1,
// //             biznessEventPCUserId: 2,
// //             biznessEventProcessConfigurationId: 13,
// //             userId: 20223,
// //             userName: 'ABU ESHA',
// //             mandatory: true,
// //             crud: 'CRUD',
// //             maxActionTimeInDays: 22,
// //             totalEventValueLimit: 22,
// //             pcUserProductGroupListDtos: [],
// //             pcUserBrandListDtos: [],
// //             pcButtonListDtos: [],
// //           },
// //         ],
// //       },
// //       {
// //         biznessEventPCLocationId: 2,
// //         biznessEventProcessConfigurationId: 13,
// //         locationId: 2,
// //         locationName: 'Elephant Road',
// //         pcUserListDtos: [],
// //       },
// //     ],
// //     pcProductGroupListDtos: [
// //       {
// //         biznessEventProcessConfigurationId: 13,
// //         productGroupId: 1,
// //         productGroupName: 'Mobile Accessories',
// //       },
// //       {
// //         biznessEventProcessConfigurationId: 13,
// //         productGroupId: 2,
// //         productGroupName: 'Laptop Accessories',
// //       },
// //     ],
// //     pcBrandListDto: [
// //       {
// //         biznessEventProcessConfigurationId: 13,
// //         brandId: 1,
// //         brandName: 'Samsung',
// //       },
// //       {
// //         biznessEventProcessConfigurationId: 13,
// //         brandId: 2,
// //         brandName: 'Lenevo',
// //       },
// //     ],
// //   },
// //   {
// //     biznessEventProcessConfigurationId: 14,
// //     fixedTaskTemplateId: 1,
// //     biznessEventId: 2,
// //     biznessEventName: 'ProcurementRequisition',
// //     controllerPath: 'url#/Approval/Index?value=PRE',
// //     controllerParameter: 'string',
// //     sequence: 1,
// //     mailTemplate: 'string',
// //     smsTemplate: 'string',
// //     dateOfEntry: '2023-12-17 16:54:25.177',
// //     enteredById: 1,
// //     mandatoryAttachment: true,
// //     actionType: 'E',
// //     prevBiznessEventId: 1013,
// //     nextActionMethod: null,
// //     relationKey: 'ProcurementRequisition.RequisitionNo',
// //     maxTimeInHours: 11,
// //     maxTimeInDays: 11,
// //     extendedBiznessEventId: '81#82',
// //     pcLocationListDtos: [],
// //     pcProductGroupListDtos: [],
// //     pcBrandListDto: [],
// //   },
// // ];

// // i guess most perfectly fetched data End

// // const exampleDataSelected: IPCUserListDtos[] = [
// //   {
// //     biznessEventPCUserId: 1,
// //     biznessEventProcessConfigurationId: 1,
// //     biznessEventPCLocationId: 1,
// //     userId: 1,
// //     userName: 'rupom',
// //     mandatory: true,
// //     crud: 'CRUD',
// //     maxActionTimeinDays: 20,
// //     totalEventValueLimit: 20,
// //     pcUserBrandListDtos: [],
// //     pcUserProductGroupListDtos: [],
// //     pcButtonListDtos: [
// //       {
// //         buttonName: 'A report',
// //         buttonId: 1,
// //       },
// //       {
// //         buttonName: 'B report',
// //         buttonId: 2,
// //       },
// //       {
// //         buttonName: 'C report',
// //         buttonId: 3,
// //       },
// //     ],
// //   },
// //   {
// //     biznessEventPCUserId: 1,
// //     biznessEventProcessConfigurationId: 1,
// //     biznessEventPCLocationId: 1,
// //     userId: 2,
// //     userName: 'rupom2',
// //     mandatory: true,
// //     crud: 'CRUD',
// //     maxActionTimeinDays: 22,
// //     totalEventValueLimit: 22,
// //     pcUserBrandListDtos: [],
// //     pcUserProductGroupListDtos: [],
// //     pcButtonListDtos: [
// //       {
// //         buttonName: 'A report',
// //         buttonId: 1,
// //       },
// //       {
// //         buttonName: 'B report',
// //         buttonId: 2,
// //       },
// //       {
// //         buttonName: 'C report',
// //         buttonId: 3,
// //       },
// //     ],
// //   },
// // ];

// const ChainConfiguration = ({
//   modalPageOpenerClose,
//   clickedCardInfo,
//   operationMode,
// }: any) => {
//   console.log(
//     'See clickedCardInfo Dynamic Report Analysis---------------------------->'
//   );
//   console.log(clickedCardInfo);

//   const biznessEventName = clickedCardInfo?.biznessEventName.replace(
//     /([A-Z])(?=[A-Z][a-z])/g,
//     '$1 '
//   );

//   const {
//     register,
//     getValues,
//     reset,
//     control,
//     setValue,
//     setError,
//     clearErrors,
//     handleSubmit,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     // defaultValues: {
//     //   bank: null,
//     // },
//     mode: 'onBlur', // Validation will trigger on blur
//   });

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

//   // ----------------------USE STATES ---------------------------
//   const [selectedFixedTaskTemplate, setSelectedFixedTaskTemplate] =
//     useState<IFixedTaskTemplateAutoComp | null>(null);

//   const [bepcGridState, setBepcGridState] = useState<
//     IBiznessEventProcessConfigurationInfoForChainConfig[]
//   >([]);

//   const [columnVisibility, setColumnVisibility] = useState<any>([]);
//   // const [biznessEventOptions, setBiznessEventOptions] =
//   //   useState<IBiznessEventOption[]>();

//   const [selectedBepcRow, setSelectedBepcRow] = useState<MRT_RowSelectionState>(
//     {}
//   );

//   const [selectedLocationDLRow, setSelectedLocationDLRow] = useState<
//     number | null
//   >(null);
//   const [selectedLocationDLRowInfo, setSelectedLocationDLRowInfo] =
//     useState<IPCLocationListDtos | null>(null);
//   // const [selectedPCProductGroupDLRow, setSelectedPCProductGroupDLRow] =
//   //   useState<IPCProductGroupListDtos | null>(null);
//   // const [selectedPCProductBrandDLRow, setSelectedPCProductBrandDLRow] =
//   //   useState<IPCBrandListDto | null>(null);

//   // const [selectedPCUserProductGroupDLRow, setSelectedPCUserProductGroupDLRow] =
//   //   useState<IPCUserProductGroupListDtos | null>(null);
//   // const [selectedPCUserProductBrandDLRow, setSelectedPCUserProductBrandDLRow] =
//   //   useState<IPCUserBrandListDtos | null>(null);
//   // const [selectedPCUserButtonDLRow, setSelectedPCUserButtonDLRow] =
//   //   useState<IPCButtonListDto | null>(null);
//   const [selectedUsersDLTRow, setSelectedUsersDLTRow] =
//     useState<MRT_RowSelectionState>({});

//   // ---------------------USE STATES-----------------ENDS---

//   // modal states and functions-------------------

//   const [specModal, setSpecModal] = useState<boolean>(false);
//   const handleSpecModalClose = () => {
//     setSpecModal(false);
//   };

//   const [selectedItemsLocation, setSelectedItemsLocation] = useState<
//     IPCLocationListDtos[]
//   >([]);
//   const [selectedItemsPCProductGroup, setSelectedItemsPCProductGroup] =
//     useState<IPCProductGroupListDtos[]>([]);
//   const [selectedItemsPCProductBrand, setSelectedItemsPCProductBrand] =
//     useState<IPCBrandListDto[]>([]);
//   const [selectedItemsPCUserProductGroup, setSelectedItemsPCUserProductGroup] =
//     useState<IPCUserProductGroupListDtos[]>([]);
//   const [selectedItemsPCUserProductBrand, setSelectedItemsPCUserProductBrand] =
//     useState<IPCUserBrandListDtos[]>([]);
//   const [selectedItemsPCUserProduct, setSelectedItemsPCUserProduct] = useState<
//     IPCUserProductListDto[]
//   >([]);

//   const [selectedItemsPCUserButton, setSelectedItemsPCUserButton] = useState<
//     IPCButtonListDto[]
//   >([]);

//   const [selectedItemsUsers, setSelectedItemsUsers] = useState<
//     IPCUserListDtos[]
//   >([]);

//   const [modalOpendedIndexBepcGrid, setModalOpendedIndexBepcGrid] = useState<
//     number | null
//   >(null);
//   // const [
//   //   selectedUsersDLTRow,
//   //   setSelectedUsersDLTRow,
//   // ] = useState<MRT_RowSelectionState>({});
//   // modal states and functions-------ENDS------------

//   // -----useStates----ENDS----

//   /// /-----------------auto comp list style-----------------
//   interface AutoCompResStyles {
//     popper: {
//       maxWidth: string;
//       // minWidth: string;
//       fontSize: string;
//     };
//   }
//   const autoCompResStyles: AutoCompResStyles = {
//     popper: {
//       maxWidth: 'fit-content',
//       // minWidth: 'inherit',
//       fontSize: '0.75rem',
//     },
//   };
//   const PopperMy = useCallback(
//     (propsPopper: any) => {
//       return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
//     },
//     [autoCompResStyles.popper]
//   );

//   // Function to check if an object is empty based on your criteria
//   const isEmptyObject = (obj: any) => {
//     return Object.values(obj).every(
//       (value) =>
//         value === '' ||
//         value === null ||
//         value === undefined ||
//         value === 0 ||
//         (Array.isArray(value) && value.length === 0)
//     );
//   };

//   const specsOnClickFunct = (
//     currentRow: IBiznessEventProcessConfigurationInfoForChainConfig,
//     index: number
//   ) => {
//     setValue('smsTemplate', bepcGridState[index].smsTemplate);
//     setValue('mailTemplate', bepcGridState[index].mailTemplate);
//     setValue('maxTimeInDays', bepcGridState[index].maxTimeInDays);
//     setValue('maxTimeInHours', bepcGridState[index].maxTimeInHours);
//     setValue('relationalKey', bepcGridState[index].relationKey);
//     setValue('controllerPath', bepcGridState[index].controllerPath);

//     setModalOpendedIndexBepcGrid(index);
//     setSpecModal(true);
//   };

//   // -----------------------------------------------------------------------------------------------
//   // Tables, column definition and table initializer pair------>

//   const checkAndSetBepcGridValues = useCallback(
//     (index: number) => {
//       if (index === bepcGridState.length - 1) {
//         const tempEmptyObj: IBiznessEventProcessConfigurationInfoForChainConfig =
//           {
//             biznessEventProcessConfigurationId: 0,
//             fixedTaskTemplateId: 0,
//             biznessEventId: 0,
//             biznessEventName: ``,
//             controllerPath: '',
//             controllerParameter: '',
//             sequence: 0,
//             actionType: '',
//             mailTemplate: '',
//             smsTemplate: '',
//             dateOfEntry: '',
//             enteredById: 0,
//             mandatoryAttachment: null,
//             prevBiznessEventId: null,
//             nextActionMethod: null,
//             relationKey: '',
//             maxTimeInHours: 0,
//             maxTimeInDays: 0,
//             extendedBiznessEventId: null,
//             pcLocationListDtos: null,
//             pcProductGroupListDtos: null,
//             pcBrandListDto: null,
//           };
//         setBepcGridState([...bepcGridState, tempEmptyObj]);
//       } else {
//         setBepcGridState([...bepcGridState]);
//       }
//     },
//     [bepcGridState]
//   );

//   // bepcGrid codes------>
//   const bepcGridColumns = useMemo<
//     MRT_ColumnDef<IBiznessEventProcessConfigurationInfoForChainConfig>[]
//   >(
//     () => [
//       // {
//       //   accessorFn: (row) => row.biznessEventName ?? '', // access nested data with dot notation
//       //   enableGlobalFilter: columnVisibility?.biznessEventName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//       //   id: 'biznessEventName',
//       //   // accessorKey: 'productGroup', // access nested data with dot notation
//       //   header: 'Bizness Event',
//       //   Cell: ({ renderedCellValue, row }) => {
//       //     const currentBiznessEvent = {
//       //       biznessEventId: row.original.biznessEventId || null,
//       //       biznessEventName: row.original.biznessEventName || '',
//       //     };
//       //     return (
//       //       <Autocomplete
//       //         id=""
//       //         sx={{ width: '100%' }}
//       //         PopperComponent={PopperMy}
//       //         clearOnEscape
//       //         disableClearable
//       //         freeSolo
//       //         size="small"
//       //         options={biznessEventOptions?.data ?? []}
//       //         value={currentBiznessEvent}
//       //         onChange={(e, selectedOption: any) => {
//       //           if (selectedOption) {
//       //             const selectedOpt = selectedOption;
//       //             bepcGridState[row.index].biznessEventId =
//       //               selectedOpt.biznessEventId || null;
//       //             bepcGridState[row.index].biznessEventName =
//       //               selectedOpt.name || '';

//       //             setBepcGridState([...bepcGridState]);
//       //             // setSelectedSupplier(selectedOpt);
//       //           }
//       //         }}
//       //         getOptionLabel={(option: any) => (option.name ? option.name : '')}
//       //         renderInput={(params) => (
//       //           <TextField
//       //             sx={{ width: '100%' }}
//       //             {...params}
//       //             inputRef={(node) => {
//       //               if (node) {
//       //                 // eslint-disable-next-line no-param-reassign
//       //                 node.value = renderedCellValue;
//       //               }
//       //             }}
//       //             // onBlur={() => { console.log(this) }}
//       //             InputProps={{
//       //               ...params.InputProps,
//       //               style: { fontSize: '0.8125rem' },
//       //               disableUnderline: true,
//       //             }}
//       //             variant="standard"
//       //             size="small"
//       //           />
//       //         )}
//       //       />
//       //     );
//       //   },
//       // },

//       {
//         accessorFn: (row) => row.biznessEventName ?? '', // access nested data with dot notation
//         id: 'biznessEventName',
//         // accessorKey: 'transactionName', // access nested data with dot notation
//         header: 'Bizness Event',
//         Cell: ({ renderedCellValue, row }) => {
//           const currentBiznessEvent: IBiznessEventOption = {
//             biznessEventId: row.original.biznessEventId ?? null,
//             name: row.original.biznessEventName ?? '',
//           };

//           return (
//             // <div className="">
//             <Autocomplete
//               id=""
//               sx={{ width: '100%' }}
//               PopperComponent={PopperMy}
//               clearOnEscape
//               disableClearable
//               freeSolo
//               size="small"
//               options={biznessEventOptions?.data ?? []}
//               value={currentBiznessEvent}
//               onChange={(e, selectedOption) => {
//                 if (selectedOption) {
//                   const selectedOpt = selectedOption as IBiznessEventOption;
//                   bepcGridState[row.index].biznessEventId =
//                     selectedOpt.biznessEventId ?? 0;
//                   bepcGridState[row.index].biznessEventName =
//                     selectedOpt.name ?? '';
//                   bepcGridState[row.index].sequence = row.index + 1;
//                   checkAndSetBepcGridValues(row.index);
//                 }
//               }}
//               getOptionLabel={(option: any) => (option.name ? option.name : '')}
//               renderInput={(params) => (
//                 <TextField
//                   sx={{ width: '100%' }}
//                   {...params}
//                   inputRef={(node) => {
//                     if (node) {
//                       // eslint-disable-next-line no-param-reassign
//                       node.value = renderedCellValue;
//                     }
//                   }}
//                   // onBlur={() => { console.log(this) }}
//                   InputProps={{
//                     ...params.InputProps,
//                     style: { fontSize: '0.8125rem' },
//                     disableUnderline: true,
//                   }}
//                   variant="standard"
//                   size="small"
//                 />
//               )}
//             />
//             // </div>
//           );
//         },
//       },

//       {
//         accessorFn: (row) => row.actionType ?? '', // access nested data with dot notation
//         enableGlobalFilter: columnVisibility?.actionType, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
//         id: 'actionType',
//         // accessorKey: 'productGroup', // access nested data with dot notation
//         header: 'Action Type',
//         Cell: ({ renderedCellValue, row }) => {
//           return (
//             <TextField
//               type="text"
//               sx={{ width: '100%' }}
//               InputProps={{
//                 style: { fontSize: '0.8125rem' },
//                 disableUnderline: true,
//                 // readOnly: true,
//               }}
//               onBlur={(e) => {
//                 bepcGridState[row.index].actionType = e.target.value;
//                 setBepcGridState([...bepcGridState]);
//               }}
//               variant="standard"
//               size="small"
//               inputRef={(node) => {
//                 if (node) {
//                   node.value = renderedCellValue;
//                 }
//               }}
//             />
//           );
//         },
//       },
//       {
//         id: 'Actions', // access nested data with dot notation
//         header: 'Specs',
//         size: 1, // small column
//         grow: false,
//         // enableSorting: false,
//         // enableColumnActions: false,
//         // enableResizing: false,
//         // enableColumnFilter: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
//         Cell: ({ renderedCellValue, row }) => (
//           <div
//             className={
//               row.original.biznessEventId
//                 ? 'visible w-full flex justify-center'
//                 : 'invisible w-full flex justify-center'
//             }
//           >
//             <Tooltip arrow placement="right" title="Click here">
//               <IconButton
//                 color="error"
//                 onClick={() => {
//                   //   setProductWiseViewModal(true);

//                   specsOnClickFunct(row.original, row.index);
//                 }}
//               >
//                 <i className="fas text-sm fa-eye" />
//               </IconButton>
//             </Tooltip>
//           </div>
//         ),
//       },
//       {
//         id: 'delete', // access nested data with dot notation
//         header: '',
//         size: 1, // small column
//         grow: false,
//         // enableSorting: false,
//         // enableColumnActions: false,
//         // enableResizing: false,
//         // enableColumnFilter: false,
//         muiTableHeadCellProps: ({ column }) => ({
//           align: 'left',
//         }),
//         Cell: ({ renderedCellValue, row }) => (
//           <div className="w-full flex justify-center">
//             <Tooltip
//               className={row.original.biznessEventId ? 'visible' : 'invisible'}
//               arrow
//               placement="right"
//               title="Delete Ha"
//             >
//               <IconButton
//                 color="error"
//                 onClick={() => {
//                   // handleDeleteRow(row.index, row.original);

//                   bepcGridState?.splice(row.index, 1);
//                   if (bepcGridState) {
//                     setBepcGridState([...bepcGridState]);
//                   } else {
//                     setBepcGridState([]);
//                   }
//                   setTimeout(() => {
//                     setSelectedBepcRow({});
//                   }, 1);
//                 }}
//               >
//                 <Delete />
//               </IconButton>
//             </Tooltip>
//           </div>
//         ),
//       },
//     ],
//     [PopperMy]
//   );
//   const bepcGridInitializer: MRT_TableInstance<IBiznessEventProcessConfigurationInfoForChainConfig> =
//     useMaterialReactTable({
//       columns: bepcGridColumns,
//       //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//       data: bepcGridState || [],
//       state: {
//         // isLoading:
//         //   requisitionComparativeInfoLoading ||
//         //   requisitionComparativeInfoIsFetching,
//         columnVisibility,
//         rowSelection: selectedBepcRow,
//       },
//       enableRowOrdering: true,
//       positionToolbarAlertBanner: 'none',
//       enableSorting: false, // usually you do not want to sort when re-ordering
//       muiRowDragHandleProps: ({ table }) => ({
//         onDragEnd: () => {
//           const { draggingRow, hoveredRow } = table.getState();
//           if (hoveredRow && draggingRow) {
//             const x = // checking if the dragging row has businessEventId
//               (
//                 draggingRow as MRT_Row<IBiznessEventProcessConfigurationInfoForChainConfig>
//               ).original.biznessEventId;
//             const y =
//               // checking if the hovered row, maane jekhane dragged row ta falano hobe, has businessEventId
//               (
//                 hoveredRow as MRT_Row<IBiznessEventProcessConfigurationInfoForChainConfig>
//               ).original.biznessEventId;
//             if (x && y) {
//               bepcGridState.splice(
//                 (
//                   hoveredRow as MRT_Row<IBiznessEventProcessConfigurationInfoForChainConfig>
//                 ).index,
//                 0,
//                 bepcGridState.splice(draggingRow.index, 1)[0]
//               );
//               if (hoveredRow?.index) {
//                 bepcGridState[hoveredRow.index].sequence = hoveredRow.index + 1; // sequence kintu edit hoye gelo
//               }
//               setSelectedBepcRow({});
//               setBepcGridState([...bepcGridState]);
//             }
//           }
//         },
//       }),

//       onColumnVisibilityChange: columnVisibility,
//       muiSkeletonProps: {
//         animation: 'pulse',
//         height: '2.5rem',
//       },
//       enableBottomToolbar: false,
//       enableColumnResizing: true,
//       enableGlobalFilterModes: true,
//       enablePagination: false,
//       enableRowNumbers: false,
//       enableColumnPinning: true,
//       enableStickyHeader: true,
//       layoutMode: 'grid',
//       // getRowId: (originalRow) => originalRow.biznessEventName.toString() || '', // ekhane actually amar mot e biznessEventId hobe plus virtualId hote paare.... //vai eiday problem ache, evabe korle table er rendered autocomplete er values gaayeb thaake
//       enableMultiRowSelection: false,
//       muiTableBodyRowProps: ({ row }) => ({
//         // implement row selection click events manually
//         onClick: () => {
//           if (row.original.biznessEventId) {
//             setSelectedBepcRow((prev) => ({
//               // ...prev,
//               [row.id]: !prev[row.id], // this is a simple toggle implementation
//               // [row.original.virtualId]: !prev[row.original.virtualId],
//             }));
//           }
//         },
//         selected: selectedBepcRow[row.id],
//         sx: {
//           cursor: 'pointer',
//         },
//       }),
//       // enableRowSelection: (row) => row.original.biznessEventId,
//       onRowSelectionChange: setSelectedBepcRow,
//       // enableRowVirtualization: true,
//       // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
//       // enableEditing: true,
//       // enableDensityToggle: false,
//       initialState: {
//         density: 'compact',
//         // rowSelection: { rowSelection },
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
//           // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
//           fontSize: '0.8125rem',
//           color: '#ea1143',
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
//           backgroundColor: '#ECEFF9',
//           color: '#1c1c1c',
//           fontWeight: '800',
//         },
//       },

//       muiTableContainerProps: { sx: { maxHeight: '31.25rem' } },
//       renderToolbarInternalActions: ({ table }) => (
//         <>
//           {/* built-in buttons (must pass in table prop for them to work!) */}
//           <MRT_ToggleGlobalFilterButton table={table} />

//           <MRT_ShowHideColumnsButton table={table} />
//           <MRT_ToggleFullScreenButton table={table} />
//           <MRT_ToggleFiltersButton table={table} />
//           <div className="mx-2">
//             <button
//               type="button"
//               data-mdb-ripple="true"
//               data-mdb-ripple-color="light"
//               className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//               onClick={() => {
//                 //   handleExportData(
//                 //     purchaseComparativeSheetGridState,
//                 //     purchaseComparativeSheetGridColumns
//                 //   );
//               }}
//             >
//               <i className="fas fa-file-excel" />
//             </button>
//           </div>
//           {/* add your own custom print button or something */}
//         </>
//       ),

//       renderTopToolbarCustomActions: ({ table }) => (
//         <div className="">
//           <p className=" mt-1 font-bold text-[0.8125rem]">
//             Process Congituration Grid
//           </p>
//         </div>
//       ),

//       // onSortingChange: setSorting,
//       // state: { isLoading, sorting },
//       // rowVirtualizerInstanceRef, // optional
//       // rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer

//       // enableGrouping: true,

//       // displayColumnDefOptions: {
//       //   'mrt-row-expand': {
//       //     // enableResizing: true,
//       //     enablePinning: true,
//       //     size: 5,
//       //     // grow: false,
//       //     // enableColumnActions: true,
//       //   },
//       // },
//       // muiToolbarAlertBannerProps: { sx: { display: 'none' } }, // eita na dile upore grouped by Transaction Name ashe.. oita bondho kora
//       // state: {
//       //   showAlertBanner: false,
//       // },
//       // muiToolbarAlertBannerChipProps: { color: 'primary' },
//     });
//   // bepcGrid codes--Ends---->

//   /// //excel csv for normal frontend grids/////////////////
//   const handleExportData = (
//     gridData: any,
//     gridColumns: any,
//     columnVisibility: any
//   ) => {
//     console.log('handleExportData');

//     console.log('gridData');
//     console.log(gridData);

//     console.log('columnVisibility');
//     console.log(columnVisibility);

//     // --------[Getting the hidden columns as property names in an array]----------
//     const falsePropertiesArr = Object.keys(columnVisibility).filter(
//       (property) => columnVisibility[property] === false
//     );
//     console.log('falsePropertiesArr');
//     console.log(falsePropertiesArr);

//     console.log('gridColumns');
//     console.log(gridColumns);

//     // Filtering out empty objects
//     gridData = gridData.filter((obj: any) => !isEmptyObject(obj));
//     // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
//     const visibleGridDataTbColXcel = gridColumns
//       .filter(
//         (column: any) =>
//           column?.id &&
//           column?.id !== 'Actions' &&
//           column?.id !== 'delete' &&
//           !falsePropertiesArr.includes(column.id)
//       )
//       .map(({ id, header }: any) => ({ id, header }));

//     console.log('visibleGridDataTbColXcel');
//     console.log(visibleGridDataTbColXcel);

//     // --------[Getting the data of excel without those columns which are hidden ]----------
//     const gridDataTbXCEL = gridData.map((item: any) => {
//       return Object.keys(item).reduce((acc: any, key: any) => {
//         if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
//           acc[key] = item[key];
//         }
//         return acc;
//       }, {});
//     });

//     console.log('gridDataTbXCEL');
//     console.log(gridDataTbXCEL);

//     // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

//     const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
//       const sortedItem: any = {};
//       visibleGridDataTbColXcel.forEach((column: any) => {
//         sortedItem[column.id] = item[column.id];
//       });
//       return sortedItem;
//     });

//     console.log('gridDataTbXCELSorted');
//     console.log(gridDataTbXCELSorted);

//     // ---[csv er settings]---
//     const csvOptions = {
//       fieldSeparator: ',',
//       quoteStrings: '"',
//       decimalSeparator: '.',
//       showLabels: true,
//       useBom: true,
//       useKeysAsHeaders: false,
//       headers: visibleGridDataTbColXcel.map((c: any) => c.header),
//     };
//     const csvExporter = new ExportToCsv(csvOptions);
//     csvExporter.generateCsv(gridDataTbXCELSorted);
//   };

//   // -----------------------NORMAL USE EFFECTS-----------------------

//   useEffect(() => {
//     const emptyArray: IBiznessEventProcessConfigurationInfoForChainConfig[] =
//       [];
//     for (let i = 0; i < 10; i++) {
//       const tempObj: IBiznessEventProcessConfigurationInfoForChainConfig = {
//         biznessEventProcessConfigurationId: 0,
//         fixedTaskTemplateId: 0,
//         biznessEventId: 0,
//         biznessEventName: ``,
//         controllerPath: '',
//         controllerParameter: '',
//         sequence: 0,
//         actionType: '',
//         mailTemplate: '',
//         smsTemplate: '',
//         dateOfEntry: '',
//         enteredById: 0,
//         mandatoryAttachment: null,
//         prevBiznessEventId: null,
//         nextActionMethod: null,
//         relationKey: '',
//         maxTimeInHours: 0,
//         maxTimeInDays: 0,
//         extendedBiznessEventId: null,
//         pcLocationListDtos: null,
//         pcProductGroupListDtos: null,
//         pcBrandListDto: null,
//       };
//       emptyArray.push(tempObj);
//     }
//     setBepcGridState(emptyArray);
//   }, []);

//   // on changing the selection of rows in bepcGrid
//   useEffect(() => {
//     const indexNoObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNo = parseInt(indexNoObjKey, 10);
//     if (selectedBepcRow[indexNoObjKey]) {
//       setSelectedItemsLocation(
//         bepcGridState[indexNo]?.pcLocationListDtos || []
//       );
//       setSelectedItemsPCProductGroup(
//         bepcGridState[indexNo]?.pcProductGroupListDtos || []
//       );
//       setSelectedItemsPCProductBrand(
//         bepcGridState[indexNo]?.pcBrandListDto || []
//       );
//     }

//     // baaki gula khaali hobe
//     setSelectedLocationDLRow(null);
//     setSelectedUsersDLTRow({});
//   }, [selectedBepcRow]);

//   // on changing the selection of rows in Locations
//   useEffect(() => {
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
//     const indexNoLocation = selectedLocationDLRow;
//     if (selectedBepcRow[indexNoBepc] && indexNoLocation !== null) {
//       const tempPcUserList = bepcGridState[indexNoBepc]
//         ? bepcGridState[indexNoBepc]?.pcLocationListDtos
//           ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//             ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                 ?.pcUserListDtos
//             : []
//           : []
//         : [];

//       const tempSelectedLocationRowInfo = bepcGridState[indexNoBepc]
//         ? bepcGridState[indexNoBepc]?.pcLocationListDtos
//           ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//           : null
//         : null;

//       setSelectedItemsUsers(tempPcUserList || []);
//       setSelectedLocationDLRowInfo(tempSelectedLocationRowInfo);
//     } else {
//       setSelectedItemsUsers([]);
//       setSelectedLocationDLRowInfo(null);
//     }
//   }, [selectedLocationDLRow]);

//   // on changing the selection of rows in User from duelListSelectorGrid
//   useEffect(() => {
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
//     const indexNoLocation = selectedLocationDLRow;
//     const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
//     const indexNoUser = parseInt(indexNoUserObjKey, 10);
//     if (
//       selectedBepcRow[indexNoBepc] &&
//       indexNoLocation !== null &&
//       selectedItemsUsers[indexNoUser]
//     ) {
//       const tempPcUserProductGroupList = bepcGridState[indexNoBepc]
//         ? bepcGridState[indexNoBepc]?.pcLocationListDtos
//           ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//             ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                 ?.pcUserListDtos
//               ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                   ?.pcUserListDtos[indexNoUser].pcUserProductGroupListDtos
//               : []
//             : []
//           : []
//         : [];

//       const tempPcUserBrandList = bepcGridState[indexNoBepc]
//         ? bepcGridState[indexNoBepc]?.pcLocationListDtos
//           ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//             ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                 ?.pcUserListDtos
//               ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                   ?.pcUserListDtos[indexNoUser].pcUserBrandListDtos
//               : []
//             : []
//           : []
//         : [];

//       const tempPcUserProductList = bepcGridState[indexNoBepc]
//         ? bepcGridState[indexNoBepc]?.pcLocationListDtos
//           ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//             ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                 ?.pcUserListDtos
//               ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                   ?.pcUserListDtos[indexNoUser].pcUserProductListDtos
//               : []
//             : []
//           : []
//         : [];

//       const tempPcUserButtonList = bepcGridState[indexNoBepc]
//         ? bepcGridState[indexNoBepc]?.pcLocationListDtos
//           ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//             ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                 ?.pcUserListDtos
//               ? bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//                   ?.pcUserListDtos[indexNoUser].pcButtonListDtos
//               : []
//             : []
//           : []
//         : [];
//       console.log('On Select A User');
//       console.log('tempPcUserProductGroupList');
//       console.log(tempPcUserProductGroupList);

//       console.log('tempPcUserBrandList');
//       console.log(tempPcUserBrandList);

//       console.log('tempPcUserButtonList');
//       console.log(tempPcUserButtonList);

//       setSelectedItemsPCUserProductGroup(tempPcUserProductGroupList || []);
//       setSelectedItemsPCUserProductBrand(tempPcUserBrandList || []);
//       setSelectedItemsPCUserProduct(tempPcUserProductList || []);
//       setSelectedItemsPCUserButton(tempPcUserButtonList || []);
//     } else {
//       setSelectedItemsPCUserProductGroup([]);
//       setSelectedItemsPCUserProductBrand([]);
//       setSelectedItemsPCUserProduct([]);
//       setSelectedItemsPCUserButton([]);
//     }
//   }, [selectedUsersDLTRow]);

//   // // on selecting a user from duelListSelectorGrid
//   // useEffect(() => {
//   //   if (selectedUsersDLTRow) {
//   //     const key = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
//   //     console.log(key); // Outputs: e67e35fd-2bcd-4e66-968e-ee1f29947dac

//   //     // if (selectedUsersDLTRow[key]) {
//   //     //   const selectedRow = selectedItemsUsers.find(
//   //     //     (item: IPCUserListDtos) => item.userId.toString() === key
//   //     //   );
//   //     //   setSelectedItemsPCUserProductBrand(
//   //     //     selectedRow?.pcUserBrandListDtos || []
//   //     //   );
//   //     //   setSelectedItemsPCUserProductGroup(
//   //     //     selectedRow?.pcUserProductGroupListDtos || []
//   //     //   );
//   //     // }

//   //     console.log('selectedUsersDLTRow');
//   //     console.log(key);
//   //   }
//   // }, [selectedUsersDLTRow]);

//   useEffect(() => {
//     console.log('selectedBepcRow----->');
//     console.log(selectedBepcRow);
//   }, [selectedBepcRow]);

//   // -----------------------NORMAL USE EFFECTS---------ENDSS--------------

//   // ------------------------- API CALLS and with associated useEffects --------------------------------------
//   const {
//     data: fixedTaskTemplateOptions,
//     isLoading: fixedTaskTemplateOptionsLoading,
//     error: fixedTaskTemplateOptionsError,
//     isSuccess: fixedTaskTemplateOptionsIsSuccess,
//     isError: fixedTaskTemplateOptionsIsError,
//     isFetching: fixedTaskTemplateOptionsIsFetching,
//     refetch: fixedTaskTemplateOptionsRefetch,
//   } = useGetFixedTaskTemplateComboOptionsQuery(userInfo?.locationId);

//   useEffect(() => {
//     if (fixedTaskTemplateOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching fixedTaskTemplateOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching fixedTaskTemplateOptions for autocomplete, see console--->:'
//       );
//       console.log(fixedTaskTemplateOptionsError);
//     }
//     if (fixedTaskTemplateOptionsIsSuccess) {
//       console.log('fixedTaskTemplateOptions');
//       console.log(fixedTaskTemplateOptions);
//     }
//   }, [
//     fixedTaskTemplateOptionsLoading,
//     fixedTaskTemplateOptionsIsFetching,
//     fixedTaskTemplateOptionsError,
//     fixedTaskTemplateOptionsIsError,
//     fixedTaskTemplateOptions,
//     fixedTaskTemplateOptionsIsSuccess,
//   ]);

//   const {
//     data: biznessEventProcessConfigurationInfo,
//     isLoading: biznessEventProcessConfigurationInfoLoading,
//     error: biznessEventProcessConfigurationInfoError,
//     isSuccess: biznessEventProcessConfigurationInfoIsSuccess,
//     isError: biznessEventProcessConfigurationInfoIsError,
//     isFetching: biznessEventProcessConfigurationInfoIsFetching,
//     refetch: biznessEventProcessConfigurationInfoRefetch,
//   } = useGetBiznessEventProcessConfigurationInfoByFixedTaskTemplateIdQuery(
//     {
//       fixedTaskTemplateId: selectedFixedTaskTemplate?.fixedTaskTemplateId || 0,
//     }
//     // { skip: !selectedFixedTaskTemplate?.fixedTaskTemplateId }
//   );

//   function setFetchedBepcInfo() {
//     console.log('biznessEventProcessConfigurationInfo');
//     console.log(biznessEventProcessConfigurationInfo?.data);
//     const emptyArray: IBiznessEventProcessConfigurationInfoForChainConfig[] =
//       [];
//     const loopLength = biznessEventProcessConfigurationInfo?.data
//       ? (biznessEventProcessConfigurationInfo?.data?.length || 0) > 10
//         ? 10
//         : biznessEventProcessConfigurationInfo?.data.length || 0
//       : 0; // rupomData change hoye biznessEventProcessConfigurationInfo?.data hobe pore
//     for (let i = 0; i < 10 - loopLength; i++) {
//       const tempObj: IBiznessEventProcessConfigurationInfoForChainConfig = {
//         biznessEventProcessConfigurationId: 0,
//         fixedTaskTemplateId: 0,
//         biznessEventId: 0,
//         biznessEventName: '',
//         controllerPath: '',
//         controllerParameter: '',
//         sequence: 0,
//         mailTemplate: '',
//         smsTemplate: '',
//         dateOfEntry: '',
//         enteredById: 0,
//         mandatoryAttachment: false,
//         actionType: '',
//         prevBiznessEventId: 0,
//         nextActionMethod: null,
//         relationKey: '',
//         maxTimeInHours: 0,
//         maxTimeInDays: 0,
//         extendedBiznessEventId: '',
//         pcLocationListDtos: [],
//         pcProductGroupListDtos: [],
//         pcBrandListDto: [],
//       };
//       emptyArray.push(tempObj);
//     }
//     const tempArrayVar = biznessEventProcessConfigurationInfo?.data || [];

//     // setBepcGridState([...tempArrayVar, ...emptyArray]);
//     if (biznessEventProcessConfigurationInfo?.data) {
//       setBepcGridState([...tempArrayVar, ...emptyArray]);
//     } else {
//       setBepcGridState([...emptyArray]);
//     }
//   }

//   useEffect(() => {
//     if (biznessEventProcessConfigurationInfoIsError) {
//       toast.error(
//         'Something wrong from backend while fetching biznessEventProcessConfigurationInfo options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching biznessEventProcessConfigurationInfo for autocomplete, see console--->:'
//       );
//       console.log(biznessEventProcessConfigurationInfoError);
//     }
//     if (biznessEventProcessConfigurationInfoIsSuccess) {
//       console.log('biznessEventProcessConfigurationInfo');
//       console.log(biznessEventProcessConfigurationInfo);
//       // if (biznessEventProcessConfigurationInfo.succeeded) {

//       // }
//     }
//     setFetchedBepcInfo();
//   }, [
//     biznessEventProcessConfigurationInfoLoading,
//     biznessEventProcessConfigurationInfoIsFetching,
//     biznessEventProcessConfigurationInfoError,
//     biznessEventProcessConfigurationInfoIsError,
//     biznessEventProcessConfigurationInfo,
//     biznessEventProcessConfigurationInfoIsSuccess,
//   ]);

//   const {
//     data: locationOptions,
//     isLoading: locationOptionsLoading,
//     error: locationOptionsError,
//     isSuccess: locationOptionsIsSuccess,
//     isError: locationOptionsIsError,
//     isFetching: locationOptionsIsFetching,
//     refetch: locationOptionsRefetch,
//   } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

//   useEffect(() => {
//     if (locationOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching locationOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching locationOptions for autocomplete, see console--->:'
//       );
//       console.log(locationOptionsError);
//     }
//     if (locationOptionsIsSuccess) {
//       console.log('locationOptions');
//       console.log(locationOptions);
//     }
//   }, [
//     locationOptionsLoading,
//     locationOptionsIsFetching,
//     locationOptionsError,
//     fixedTaskTemplateOptionsIsError,
//     locationOptions,
//     locationOptionsIsSuccess,
//   ]);

//   const {
//     data: brandOptions,
//     isLoading: brandOptionsLoading,
//     error: brandOptionsError,
//     isSuccess: brandOptionsIsSuccess,
//     isError: brandOptionsIsError,
//     isFetching: brandOptionsIsFetching,
//     refetch: brandOptionsRefetch,
//   } = useGetBrandByCompanyIdQuery({
//     companyId: userInfo?.companyId,
//   });

//   useEffect(() => {
//     if (brandOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching brandOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching brandOptions for autocomplete, see console--->:'
//       );
//       console.log(brandOptionsError);
//     }
//     if (brandOptionsIsSuccess) {
//       console.log('brandOptions');
//       console.log(brandOptions);
//     }
//   }, [
//     brandOptionsLoading,
//     brandOptionsIsFetching,
//     brandOptionsError,
//     brandOptionsIsError,
//     brandOptions,
//     brandOptionsIsSuccess,
//   ]);

//   const {
//     data: productGroupOptions,
//     isLoading: productGroupOptionsLoading,
//     error: productGroupOptionsError,
//     isSuccess: productGroupOptionsIsSuccess,
//     isError: productGroupOptionsIsError,
//     isFetching: productGroupOptionsIsFetching,
//     refetch: productGroupOptionsRefetch,
//   } = useGetProductGroupByCompanyIdQuery({
//     companyId: userInfo?.companyId,
//   });

//   useEffect(() => {
//     if (productGroupOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching productGroupOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching productGroupOptions for autocomplete, see console--->:'
//       );
//       console.log(productGroupOptionsError);
//     }
//     if (productGroupOptionsIsSuccess) {
//       console.log('productGroupOptions');
//       console.log(productGroupOptions);
//     }
//   }, [
//     productGroupOptionsLoading,
//     productGroupOptionsIsFetching,
//     productGroupOptionsError,
//     productGroupOptionsIsError,
//     productGroupOptions,
//     productGroupOptionsIsSuccess,
//   ]);

//   const {
//     data: productOptions,
//     isLoading: productOptionsLoading,
//     error: productOptionsError,
//     isSuccess: productOptionsIsSuccess,
//     isError: productOptionsIsError,
//     isFetching: productOptionsIsFetching,
//     refetch: productOptionsRefetch,
//   } = useGetProductByCompanyProductGroupIdQuery({
//     companyId: userInfo?.companyId,
//     productGroupId: 356,
//   });

//   useEffect(() => {
//     if (productOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching productOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching productOptions for autocomplete, see console--->:'
//       );
//       console.log(productOptionsError);
//     }
//     if (productOptionsIsSuccess) {
//       console.log('productOptions');
//       console.log(productOptions);
//     }
//   }, [
//     productOptionsLoading,
//     productOptionsIsFetching,
//     productOptionsError,
//     productOptionsIsError,
//     productOptions,
//     productOptionsIsSuccess,
//   ]);

//   const {
//     data: biznessEventOptions,
//     isLoading: biznessEventOptionsLoading,
//     error: biznessEventOptionsError,
//     isSuccess: biznessEventOptionsIsSuccess,
//     isError: biznessEventOptionsIsError,
//     isFetching: biznessEventOptionsIsFetching,
//     refetch: biznessEventOptionsRefetch,
//   } = useGetAllBiznessEventsQuery();

//   useEffect(() => {
//     if (biznessEventOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching biznessEventOptions options for autocomplete, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching biznessEventOptions for autocomplete, see console--->:'
//       );
//       console.log(biznessEventOptionsError);
//     }
//     if (biznessEventOptionsIsSuccess) {
//       console.log('biznessEventOptions');
//       console.log(biznessEventOptions);
//     }
//   }, [
//     biznessEventOptionsLoading,
//     biznessEventOptionsIsFetching,
//     biznessEventOptionsError,
//     biznessEventOptionsIsError,
//     biznessEventOptions,
//     biznessEventOptionsIsSuccess,
//   ]);

//   const {
//     data: securityUserOptions,
//     isLoading: securityUserOptionsLoading,
//     error: securityUserOptionsError,
//     isSuccess: securityUserOptionsIsSuccess,
//     isError: securityUserOptionsIsError,
//     isFetching: securityUserOptionsIsFetching,
//     refetch: securityUserOptionsRefetch,
//   } = useGetSecurityUserByCompanyIdQuery({
//     companyId: userInfo?.companyId,
//     locationId: selectedLocationDLRowInfo?.locationId || 0,
//   });

//   useEffect(() => {
//     if (securityUserOptionsIsError) {
//       toast.error(
//         'Something wrong from backend while fetching securityUserOptions, see console!'
//       );
//       console.log(
//         'Something wrong from backend while fetching securityUserOptions, see console--->:'
//       );
//       console.log(securityUserOptionsError);
//     }
//     if (securityUserOptionsIsSuccess) {
//       console.log('securityUserOptions');
//       console.log(securityUserOptions?.data);
//     }
//   }, [
//     securityUserOptionsLoading,
//     securityUserOptionsIsFetching,
//     securityUserOptionsError,
//     securityUserOptionsIsError,
//     securityUserOptions,
//     securityUserOptionsIsSuccess,
//   ]);

//   // ------------------------- API CALLS and with associated useEffects ----------------ENDS----------------------

//   // ---------experimental things before api calls----------
//   // useEffect(() => {
//   //   // const uncommonObjects = findUncommonObjects(
//   //   //   exampleDataAll,
//   //   //   exampleDataSelected
//   //   // );
//   //   setSelectedItemsUsers(exampleDataSelected);
//   // }, []);

//   /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   // ------------ niche jaa useEffect ase, shob bepcState e update kore dite hobe

//   useEffect(() => {
//     // selectedBepcRow er index
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

//     if (selectedBepcRow[indexNoBepc]) {
//       bepcGridStateCopy[indexNoBepc].pcLocationListDtos = JSON.parse(
//         JSON.stringify(selectedItemsLocation)
//       );
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//   }, [selectedItemsLocation]);

//   useEffect(() => {
//     // selectedBepcRow er index
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));
//     if (selectedBepcRow[indexNoBepc]) {
//       bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos = JSON.parse(
//         JSON.stringify(selectedItemsPCProductGroup)
//       );
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//   }, [selectedItemsPCProductGroup]);

//   useEffect(() => {
//     // selectedBepcRow er index
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

//     if (selectedBepcRow[indexNoBepc]) {
//       bepcGridStateCopy[indexNoBepc].pcBrandListDto = JSON.parse(
//         JSON.stringify(selectedItemsPCProductBrand)
//       );
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//   }, [selectedItemsPCProductBrand]);

//   useEffect(() => {
//     // selectedBepcRow er index and //selectedLocationDLRow er index

//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
//     const indexNoLocation = selectedLocationDLRow;
//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

//     if (
//       selectedBepcRow[indexNoBepc] &&
//       indexNoLocation !== null &&
//       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos
//     ) {
//       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
//         indexNoLocation
//       ].pcUserListDtos = JSON.parse(JSON.stringify(selectedItemsUsers));
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//     // if (
//     //   indexNoLocation !== null &&
//     //   indexNoBepc !== null &&
//     //   bepcGridState[indexNoBepc] &&
//     //   bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//     // ) {
//     //   bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
//     //     ?.pcUserListDtos = JSON.parse(JSON.stringify(selectedItemsUsers));
//     //   setBepcGridState([...bepcGridState]);
//     // }
//   }, [selectedItemsUsers]);

//   useEffect(() => {
//     // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

//     const indexNoLocation = selectedLocationDLRow;

//     const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
//     const indexNoUser = parseInt(indexNoUserObjKey, 10);
//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

//     if (
//       selectedBepcRow[indexNoBepc] &&
//       indexNoLocation !== null &&
//       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos
//     ) {
//       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
//         indexNoLocation
//       ].pcUserListDtos[indexNoUser].pcUserProductGroupListDtos = JSON.parse(
//         JSON.stringify(selectedItemsPCUserProductGroup)
//       );
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//     // setBepcGridState([...bepcGridState]);
//   }, [selectedItemsPCUserProductGroup]);

//   useEffect(() => {
//     // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

//     const indexNoLocation = selectedLocationDLRow;

//     const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
//     const indexNoUser = parseInt(indexNoUserObjKey, 10);
//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

//     if (
//       selectedBepcRow[indexNoBepc] &&
//       indexNoLocation !== null &&
//       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos
//     ) {
//       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
//         indexNoLocation
//       ].pcUserListDtos[indexNoUser].pcUserBrandListDtos = JSON.parse(
//         JSON.stringify(selectedItemsPCUserProductBrand)
//       );
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//   }, [selectedItemsPCUserProductBrand]);

//   useEffect(() => {
//     // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index

//     const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
//     const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

//     const indexNoLocation = selectedLocationDLRow;

//     const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
//     const indexNoUser = parseInt(indexNoUserObjKey, 10);
//     const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

//     if (
//       selectedBepcRow[indexNoBepc] &&
//       indexNoLocation !== null &&
//       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos
//     ) {
//       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
//         indexNoLocation
//       ].pcUserListDtos[indexNoUser].pcUserProductListDtos = JSON.parse(
//         JSON.stringify(selectedItemsPCUserProduct)
//       );
//       setBepcGridState([...bepcGridStateCopy]);
//     }
//   }, [selectedItemsPCUserProduct]);

//   const saveFunction = () => {
//     console.log('Pressing The Greatest Save Button');
//     console.log('Allaaah data dekh uff------------------>');
//     console.log(bepcGridState);
//   };

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
//                 {biznessEventName
//                   ? biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
//                   : 'Chain Configuration'}
//                 {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
//               </div>
//               {/* Main Card header--/-- */}

//               {/* Main Card body */}
//               <div className="px-6 pb-4 text-start  mt-5">
//                 <div className=" flex">
//                   <div className="w-full">
//                     <Controller
//                       name="fixedTaskTemplate"
//                       control={control}
//                       // rules={{
//                       //   required: '*Required',
//                       // }}
//                       render={({
//                         field: { onChange, onBlur, value, ref },
//                         fieldState: { error },
//                       }) => (
//                         <Autocomplete
//                           id=""
//                           size="small"
//                           //   loading={
//                           //     requisitionNoOptionsLoading ||
//                           //     requisitionNoOptionsIsFetching
//                           //   }
//                           options={fixedTaskTemplateOptions || []}
//                           value={value || null}
//                           // onChange={(event, item) => {}} // React-hook-form manages the state
//                           onChange={(event, selectedItem) => {
//                             setSelectedFixedTaskTemplate(selectedItem);
//                             onChange(selectedItem);
//                           }}
//                           onBlur={onBlur} // Trigger validation on blur
//                           getOptionLabel={(option) =>
//                             option ? option.name : ''
//                           }
//                           isOptionEqualToValue={(option, selectedValue) =>
//                             option.name === selectedValue?.name &&
//                             option.fixedTaskTemplateId ===
//                               selectedValue?.fixedTaskTemplateId
//                           }
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               label="Chain Name"
//                               variant="standard"
//                               error={!!error}
//                               helperText={error ? error.message : null}
//                               InputLabelProps={{
//                                 ...params.InputLabelProps,
//                                 style: { fontSize: '0.875rem' },
//                               }}
//                               InputProps={{
//                                 ...params.InputProps,
//                                 style: { fontSize: '0.8125rem' },
//                               }}
//                               sx={{ width: '100%', marginTop: 1 }}
//                               inputRef={ref}
//                             />
//                           )}
//                         />
//                       )}
//                     />
//                   </div>
//                   <div className="mx-2 pt-1">
//                     <button
//                       type="button"
//                       data-mdb-ripple="true"
//                       data-mdb-ripple-color="light"
//                       className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                       onClick={() => {}}
//                     >
//                       Add+
//                     </button>
//                   </div>
//                 </div>

//                 <div className="w-full mt-4 modifiedEditTable">
//                   <MaterialReactTable table={bepcGridInitializer} />
//                 </div>

//                 <div className="w-full grid grid-cols-3 gap-5">
//                   <DualListSelectorWithRowSelection
//                     items={locationOptions?.data || []}
//                     selectedItems={selectedItemsLocation}
//                     setSelectedItems={setSelectedItemsLocation}
//                     selectedRowIndex={selectedLocationDLRow}
//                     setSelectedRowIndex={setSelectedLocationDLRow}
//                     idKey="locationId"
//                     optionName="locationName"
//                     caption="Locations"
//                   />
//                   <DualListSelector
//                     items={productGroupOptions || []}
//                     selectedItems={selectedItemsPCProductGroup}
//                     setSelectedItems={setSelectedItemsPCProductGroup}
//                     idKey="productGroupId"
//                     optionName="productGroupName"
//                     caption="Product Group"
//                   />
//                   <DualListSelector
//                     items={brandOptions?.data || []}
//                     selectedItems={selectedItemsPCProductBrand || []}
//                     setSelectedItems={setSelectedItemsPCProductBrand}
//                     idKey="brandId"
//                     optionName="brandName"
//                     caption="Product Brand"
//                   />
//                 </div>
//                 <div className="w-full grid grid-cols-3 gap-5">
//                   <div className="col-span-2">
//                     <DualListSelectorWithGrid
//                       items={securityUserOptions?.data || []}
//                       selectedItems={selectedItemsUsers} // selected Row Of Location from duelSelectList
//                       setSelectedItems={setSelectedItemsUsers}
//                       selectedUsersDLTRow={selectedUsersDLTRow}
//                       setSelectedUsersDLTRow={setSelectedUsersDLTRow}
//                     />
//                   </div>
//                   <DualListSelector
//                     items={productGroupOptions || []}
//                     selectedItems={selectedItemsPCUserProductGroup}
//                     setSelectedItems={setSelectedItemsPCUserProductGroup}
//                     idKey="productGroupId"
//                     optionName="productGroupName"
//                     caption="PC User Product Group"
//                   />
//                   <DualListSelector
//                     items={brandOptions?.data || []}
//                     selectedItems={selectedItemsPCUserProductBrand || []}
//                     setSelectedItems={setSelectedItemsPCUserProductBrand}
//                     idKey="brandId"
//                     optionName="brandName"
//                     caption="PC User Product Brand"
//                   />
//                   <DualListSelector
//                     items={[]}
//                     selectedItems={selectedItemsPCUserProduct || []}
//                     setSelectedItems={setSelectedItemsPCUserProduct}
//                     idKey="productId"
//                     optionName="productName"
//                     caption="PC User Product"
//                   />
//                 </div>
//               </div>
//               {/* Main Card Body--/-- */}

//               {/* Main Card footer */}
//               <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//                 <div className="flex gap-x-3">
//                   <div>Footer card</div>
//                   <button
//                     type="button"
//                     data-mdb-ripple="true"
//                     data-mdb-ripple-color="light"
//                     className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                     onClick={() => {
//                       console.log('Row selected er ki obostha?????');
//                       // console.log(rowSelection);
//                       console.log('bepc grid state---->');
//                       console.log(bepcGridState);
//                       saveFunction();
//                       setSelectedBepcRow({});
//                     }}
//                   >
//                     Save Ultimate
//                   </button>
//                 </div>
//               </div>
//               {/* Main Card footer--/-- */}
//             </div>
//           </form>
//           {/* Main Card--/-- */}
//         </div>
//       </div>
//       {/* // modals --- out of html normal body/position */}

//       {/* --------------------------[ modals]--------------------------------------- */}
//       <Modal
//         open={specModal} // create leaf modal
//         onClose={handleSpecModalClose}
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
//           <form>
//             <div className="mx-2">
//               <div className="w-full mt-20 ">Haha Spec fields</div>
//             </div>
//             <div className="m-3">
//               <div className="my-2">
//                 <Controller
//                   name="relatedEvent"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="Related Event"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value

//                         // Call the original onBlur to trigger validation
//                         onBlur();
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>

//               <div className="my-2">
//                 <Controller
//                   name="controllerPath"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="Controller Path"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value
//                         if (modalOpendedIndexBepcGrid !== null) {
//                           bepcGridState[
//                             modalOpendedIndexBepcGrid
//                           ].controllerPath = event.target.value;
//                           setBepcGridState([...bepcGridState]);
//                           onBlur();
//                         }
//                         // Call the original onBlur to trigger validation
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>

//               <div className="my-2">
//                 <Controller
//                   name="table"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="Table"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value

//                         // Call the original onBlur to trigger validation
//                         onBlur();
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>

//               <Controller
//                 name="relationalKey"
//                 control={control}
//                 render={({
//                   field: { onChange, onBlur, value, ref },
//                   fieldState: { error },
//                 }) => (
//                   <TextField
//                     // eslint-disable-next-line react/jsx-props-no-spreading
//                     type=""
//                     value={value || ''}
//                     sx={{ width: '100%' }}
//                     InputProps={{ style: { fontSize: '0.8125rem' } }}
//                     InputLabelProps={{
//                       style: { fontSize: '0.875rem' },
//                       shrink: value,
//                     }}
//                     // onBlur={onBlur} // Trigger validation on blur
//                     error={!!error}
//                     helperText={error ? error.message : null}
//                     // inputRef={ref}
//                     id=""
//                     label="Relational Key"
//                     variant="standard"
//                     size="small"
//                     // onBlur={onBlur} // Trigger validation on blur
//                     onBlur={(event) => {
//                       // Update the state with the current value
//                       if (modalOpendedIndexBepcGrid !== null) {
//                         bepcGridState[modalOpendedIndexBepcGrid].relationKey =
//                           event.target.value;
//                         setBepcGridState([...bepcGridState]);
//                         onBlur();
//                       }
//                       // Call the original onBlur to trigger validation
//                       // onBlur();
//                     }}
//                     onChange={onChange}
//                   />
//                 )}
//               />
//               <div className="my-2">
//                 <Controller
//                   name="maxTimeInHour"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="Max Time In Hour"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value
//                         if (modalOpendedIndexBepcGrid !== null) {
//                           bepcGridState[
//                             modalOpendedIndexBepcGrid
//                           ].maxTimeInHours = parseInt(event.target.value, 10);
//                           setBepcGridState([...bepcGridState]);
//                           onBlur();
//                         }
//                         // Call the original onBlur to trigger validation
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>

//               <div className="my-2">
//                 <Controller
//                   name="maxTimeInDays"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="Max Time In Days"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value
//                         if (modalOpendedIndexBepcGrid !== null) {
//                           bepcGridState[
//                             modalOpendedIndexBepcGrid
//                           ].maxTimeInDays = parseInt(event.target.value, 10);
//                           setBepcGridState([...bepcGridState]);
//                           onBlur();
//                         }
//                         // Call the original onBlur to trigger validation
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>

//               <div className="my-2">
//                 <Controller
//                   name="mailTemplate"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="Mail Template"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value
//                         if (modalOpendedIndexBepcGrid !== null) {
//                           bepcGridState[
//                             modalOpendedIndexBepcGrid
//                           ].mailTemplate = event.target.value;
//                           setBepcGridState([...bepcGridState]);
//                           onBlur();
//                         }
//                         // Call the original onBlur to trigger validation
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>

//               <div>
//                 <Controller
//                   name="smsTemplate"
//                   control={control}
//                   render={({
//                     field: { onChange, onBlur, value, ref },
//                     fieldState: { error },
//                   }) => (
//                     <TextField
//                       // eslint-disable-next-line react/jsx-props-no-spreading
//                       type=""
//                       value={value || ''}
//                       sx={{ width: '100%' }}
//                       InputProps={{ style: { fontSize: '0.8125rem' } }}
//                       InputLabelProps={{
//                         style: { fontSize: '0.875rem' },
//                         shrink: value,
//                       }}
//                       // onBlur={onBlur} // Trigger validation on blur
//                       error={!!error}
//                       helperText={error ? error.message : null}
//                       // inputRef={ref}
//                       id=""
//                       label="SMS Template"
//                       variant="standard"
//                       size="small"
//                       // onBlur={onBlur} // Trigger validation on blur
//                       onBlur={(event) => {
//                         // Update the state with the current value
//                         if (modalOpendedIndexBepcGrid !== null) {
//                           bepcGridState[modalOpendedIndexBepcGrid].smsTemplate =
//                             event.target.value;
//                           setBepcGridState([...bepcGridState]);
//                           onBlur();
//                         }
//                         // Call the original onBlur to trigger validation
//                       }}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               </div>
//               <div className="mt-8">
//                 {/* <button
//                   type="button"
//                   data-mdb-ripple="true"
//                   data-mdb-ripple-color="light"
//                   className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                   onClick={() => {
//                     console.log('Clicked spec save btn');
//                   }}
//                 >
//                   Save
//                 </button> */}
//               </div>
//             </div>
//           </form>
//           <IconButton
//             aria-label="close"
//             onClick={handleSpecModalClose}
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

// export default ChainConfiguration;
