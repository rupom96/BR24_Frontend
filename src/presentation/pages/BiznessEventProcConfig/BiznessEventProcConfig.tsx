// /* eslint-disable react/no-unstable-nested-components */
// // import { React, useState, useEffect } from 'react';

// import { Delete } from '@mui/icons-material';
// import { Autocomplete, IconButton, TextField, Tooltip } from '@mui/material';
// import axios from 'axios';
// import { MaterialReactTable } from 'material-react-table';
// import { useEffect, useState, useRef } from 'react';
// import { toast } from 'react-toastify';
// import {
//   IBiznessEventProcessConfiguration,
//   IDeleteBiznessEventProcessConfiguration,
// } from '../../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';

// type BiznessEventProcConfigProps = {
//   sidebar: boolean;
//   navbar: boolean;
// };

// const BiznessEventProcConfig = (props: BiznessEventProcConfigProps) => {
//   console.log(props);
//   const [tableData, setTableData] = useState<
//     IBiznessEventProcessConfiguration[]
//   >([]);
//   const [tableDataPrev, setTableDataPrev] = useState<
//     IBiznessEventProcessConfiguration[]
//   >([]);

//   const [deletedTableData, setDeletedTableData] = useState<
//     IDeleteBiznessEventProcessConfiguration[]
//   >([]);
//   const [selectedfixedTaskTemplate, setSelectedfixedTaskTemplate] = useState({
//     fixedTaskTemplateId: 1,
//   });
//   const [fixedTaskTemplateOpts, setFixedTaskTemplateOpts] = useState([]);

//   const tableCols = [
//     {
//       accessorKey: 'biznessEventId',
//       header: 'Bizness Event Id',
//       Cell: ({ cell }) => {
//         return (
//           <TextField
//             sx={{ width: '100%' }}
//             variant="standard"
//             size="small"
//             inputRef={(node) => {
//               if (node) {
//                 node.value = cell.getValue();
//               }
//             }}
//             onBlur={(e) => {
//               const tempvar = parseInt(e.target.value);
//               if (tempvar) {
//                 tableAttrChange(cell.row.index, tempvar, 'biznessEventId');
//               }
//             }}
//             InputProps={{
//               style: { fontSize: '0.8125rem', paddingTop: '0.3125rem', paddingBottom: '0.3125rem' },
//               disableUnderline: true,
//             }}
//           />
//         );
//       },
//     },
//     {
//       accessorKey: 'controllerPath', // access nested data with dot notation
//       header: 'Controller Path',
//       Cell: ({ cell, column, table }) => (
//         <TextField
//           sx={{ width: '100%' }}
//           variant="standard"
//           size="small"
//           inputRef={(node) => {
//             if (node) {
//               node.value = cell.getValue();
//             }
//           }}
//           onBlur={(e) => {
//             tableAttrChange(cell.row.index, e.target.value, 'controllerPath');
//           }}
//           InputProps={{
//             style: { fontSize: '0.8125rem', paddingTop: '0.3125rem', paddingBottom: '0.3125rem' },
//             disableUnderline: true,
//           }}
//         />
//       ),
//     },
//     {
//       accessorKey: 'controllerParameter', // access nested data with dot notation
//       header: 'Controller Parameter',
//       Cell: ({ cell, column, table }) => (
//         <TextField
//           sx={{ width: '100%' }}
//           variant="standard"
//           size="small"
//           inputRef={(node) => {
//             if (node) {
//               node.value = cell.getValue();
//             }
//           }}
//           onBlur={(e) => {
//             tableAttrChange(
//               cell.row.index,
//               e.target.value,
//               'controllerParameter'
//             );
//           }}
//           InputProps={{
//             style: { fontSize: '0.8125rem', paddingTop: '0.3125rem', paddingBottom: '0.3125rem' },
//             disableUnderline: true,
//           }}
//         />
//       ),
//     },
//     {
//       accessorKey: 'mailTemplate', // access nested data with dot notation
//       header: 'Mail Template',
//       Cell: ({ cell, column, table }) => (
//         <TextField
//           sx={{ width: '100%' }}
//           variant="standard"
//           size="small"
//           inputRef={(node) => {
//             if (node) {
//               node.value = cell.getValue();
//             }
//           }}
//           onBlur={(e) => {
//             tableAttrChange(cell.row.index, e.target.value, 'mailTemplate');
//           }}
//           InputProps={{
//             style: { fontSize: '0.8125rem', paddingTop: '0.3125rem', paddingBottom: '0.3125rem' },
//             disableUnderline: true,
//           }}
//         />
//       ),
//     },
//     {
//       accessorKey: 'smsTemplate', // access nested data with dot notation
//       header: 'SMS Template',
//       Cell: ({ cell, column, table }) => (
//         <TextField
//           sx={{ width: '100%' }}
//           variant="standard"
//           size="small"
//           inputRef={(node) => {
//             if (node) {
//               node.value = cell.getValue();
//             }
//           }}
//           onBlur={(e) => {
//             tableAttrChange(cell.row.index, e.target.value, 'smsTemplate');
//           }}
//           InputProps={{
//             style: { fontSize: '0.8125rem', paddingTop: '0.3125rem', paddingBottom: '0.3125rem' },
//             disableUnderline: true,
//           }}
//         />
//       ),
//     },
//     {
//       accessorKey: 'isAction', // access nested data with dot notation
//       // header: 'Actions',
//       header: 'Action',
//       muiTableHeadCellProps: ({ column }) => ({
//         align: 'left',
//       }),
//       Cell: ({ cell, column, table }) => (
//         <TextField
//           sx={{ width: '100%' }}
//           variant="standard"
//           size="small"
//           inputRef={(node) => {
//             if (node) {
//               node.value = cell.getValue();
//             }
//           }}
//           onBlur={(e) => {
//             const bool_value = e.target.value == 'true';
//             tableAttrChange(cell.row.index, bool_value, 'isAction');
//           }}
//           InputProps={{
//             style: { fontSize: '0.8125rem', paddingTop: '0.3125rem', paddingBottom: '0.3125rem' },
//             disableUnderline: true,
//           }}
//         />
//       ),
//     },
//     {
//       accessorKey: 'delete', // access nested data with dot notation
//       // header: 'Actions',
//       header: '',
//       size: 60, // small column
//       enableSorting: false,
//       enableColumnActions: false,
//       // enableResizing: false,
//       enableColumnFilter: false,
//       muiTableHeadCellProps: ({ column }) => ({
//         align: 'left',
//       }),
//       Cell: ({ cell }) => (
//         <div className="flex">
//           <Tooltip className="" arrow placement="top" title="Delete">
//             <IconButton onClick={() => handleDeleteRow(cell.row.index)}>
//               <Delete />
//             </IconButton>
//           </Tooltip>
//         </div>
//       ),
//     },
//   ];

//   const tableDataTemp = [
//     {
//       biznessEventId: '',
//       controllerPath: '',
//       controllerParameter: '',
//       mailTemplate: '',
//       smsTemplate: '',
//       isAction: '',
//     },
//     {
//       biznessEventId: '',
//       controllerPath: '',
//       controllerParameter: '',
//       mailTemplate: '',
//       smsTemplate: '',
//       isAction: '',
//     },
//     {
//       biznessEventId: '',
//       controllerPath: '',
//       controllerParameter: '',
//       mailTemplate: '',
//       smsTemplate: '',
//       isAction: '',
//     },
//     {
//       biznessEventId: '',
//       controllerPath: '',
//       controllerParameter: '',
//       mailTemplate: '',
//       smsTemplate: '',
//       isAction: '',
//     },
//   ];

//   /// /////////////--------------[Functions]-------------------///////////////

//   const tableAttrChange = (
//     index: number,
//     value: string | number | boolean,
//     propertyName: string
//   ): void => {
//     tableData[index][propertyName] = value;

//     // jodi last row hoy
//     if (index === tableData.length - 1) {
//       const emptyRow = {
//         fixedTaskTemplateId: selectedfixedTaskTemplate.fixedTaskTemplateId,
//         biznessEventId: undefined,
//         controllerPath: '',
//         controllerParameter: '',
//         mailTemplate: '',
//         smsTemplate: '',
//         isAction: undefined,
//       };

//       tableData.push(emptyRow);
//     }

//     setTableData([...tableData]);
//   };
//   const handleDeleteRow = (index: number) => {
//     console.log(`delete e chaap disi from ${index} no row`);
//     if (tableData[index].biznessEventProcessConfigurationId) {
//       console.log(`delete er if er moddhe dhuksi`);
//       const tempObj = {
//         biznessEventProcessConfigurationId:
//           tableData[index].biznessEventProcessConfigurationId,
//       };
//       console.log(`deleted object:`);
//       console.log(tempObj);
//       deletedTableData.push(tempObj as IDeleteBiznessEventProcessConfiguration);
//     }
//     tableData.splice(index, 1);
//     setTableData([...tableData]);
//   };

//   const saveTableData = () => {
//     console.log('save button clicked');

//     const dataB4Edit = JSON.parse(JSON.stringify(tableDataPrev));
//     dataB4Edit.sort(
//       (a, b) =>
//         a.biznessEventProcessConfigurationId -
//         b.biznessEventProcessConfigurationId
//     );

//     const gridDataCopy = JSON.parse(JSON.stringify(tableData));
//     const rowNoThoseDonotHaveBizEventId = [];
//     const validGridWithId = [];
//     const validGridWithoutId = [];

//     for (let i = 0; i < gridDataCopy.length; i = +1) {
//       if (
//         (gridDataCopy[i].controllerPath ||
//           gridDataCopy[i].controllerParameter ||
//           gridDataCopy[i].mailTemplate ||
//           gridDataCopy[i].sMSTemplate ||
//           gridDataCopy[i].isAction) &&
//         !gridDataCopy[i].biznessEventId
//       ) {
//         rowNoThoseDonotHaveBizEventId.push(i + 1); // rowNo ta dhukaya ditesi
//       } else if (
//         gridDataCopy[i].biznessEventProcessConfigurationId &&
//         gridDataCopy[i].biznessEventId
//       ) {
//         validGridWithId.push(gridDataCopy[i]);
//       } else if (
//         !gridDataCopy[i].biznessEventProcessConfigurationId &&
//         gridDataCopy[i].biznessEventId
//       ) {
//         validGridWithoutId.push(gridDataCopy[i]);
//       }
//     }

//     if (rowNoThoseDonotHaveBizEventId.length > 0) {
//       const concatedArray = rowNoThoseDonotHaveBizEventId.join(', ');
//       toast.error(
//         `Value of Bizness Event Id must be non-empty or greater than zero, in row no.: ${concatedArray}`
//       );
//       return;
//     }

//     const validGridWithIdWithDeleted = [
//       ...validGridWithId,
//       ...deletedTableData,
//     ];
//     validGridWithIdWithDeleted.sort(
//       (a, b) =>
//         a.biznessEventProcessConfigurationId -
//         b.biznessEventProcessConfigurationId
//     );

//     const gridRowsToUpdate = [];

//     for (let i = 0; i < validGridWithIdWithDeleted.length; i = +1) {
//       const prevRow = JSON.stringify(dataB4Edit[i]);
//       const gridRow = JSON.stringify(validGridWithIdWithDeleted[i]);

//       if (prevRow !== gridRow) {
//         if (
//           validGridWithIdWithDeleted[i].biznessEventProcessConfigurationId &&
//           validGridWithIdWithDeleted[i].biznessEventId
//         ) {
//           gridRowsToUpdate.push(validGridWithIdWithDeleted[i]);
//         }
//       }
//     }

//     if (
//       gridRowsToUpdate.length === 0 &&
//       validGridWithoutId.length === 0 &&
//       deletedTableData.length === 0
//     ) {
//       console.log('no changes');
//       toast.error('No changes has been made!!');
//       return;
//     }

//     const sendingObj = {
//       createCommand: validGridWithoutId,
//       updateCommand: gridRowsToUpdate,
//       deleteCommand: deletedTableData,
//     };

//     console.log('sending obj');
//     console.log(sendingObj);

//     axios
//       .post(
//         `${API_BASE_URL/BiznessEventProcessConfiguration/process`,
//         sendingObj
//       )
//       .then((res) => {
//         // console.log("insert er axios!!");
//         if (res?.data) {
//           toast.success(`All data saved successfully!`);
//           getTableData();
//           setDeletedTableData([]);
//         } else {
//           toast.error('Error!!');
//           toast.error(
//             `Something Wrong while saving in backend!! Error: ${res?.data}, StatusCode: ${res?.statusText}`
//           );
//         }
//       });
//   };

//   const getFixedTaskOpts = () => {
//     fetch(`${API_BASE_URL}/FixedTaskTemplate/getAll`)
//       .then((res) => res.json())
//       .then((data) => {
//         setFixedTaskTemplateOpts([...data]);
//       });
//   };

//   const getTableData = () => {
//     fetch(`${API_BASE_URL}/BiznessEventProcessConfiguration/getAll`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log('call disi api re');
//         console.log(data);
//         const data1 = data.slice(0, 20);
//         const tempdata1 = JSON.parse(JSON.stringify(data1));
//         const tempdata2 = JSON.parse(JSON.stringify(data1));

//         const emptyObj = {
//           fixedTaskTemplateId: selectedfixedTaskTemplate.fixedTaskTemplateId,
//           biznessEventId: '',
//           controllerPath: '',
//           controllerParameter: '',
//           mailTemplate: '',
//           smsTemplate: '',
//           isAction: '',
//         };
//         setTableData([...tempdata1, emptyObj]);
//         setTableDataPrev([...tempdata2]);
//       });
//   };

//   // virtualization
//   // virtualization
//   const [isLoading, setIsLoading] = useState(true);
//   const [sorting, setSorting] = useState([]);
//   const rowVirtualizerInstanceRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     // scroll to the top of the table when the sorting changes
//     try {
//       rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [sorting]);

//   /// /////////////--------------[UseEffects]-------------------///////////////

//   useEffect(() => {
//     // get fetch api
//     getTableData();
//   }, []);

//   return (
//     // return wrapper div
//     <div className="mt-16 md:mt-2">
//       <div className="m-2 flex justify-center">
//         <div className="block w-11/12 ">
//           {/* Main Card */}
//           <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
//             {/* Main Card header */}
//             <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
//               Bizness Event Process Configuration
//             </div>
//             {/* Main Card header--/-- */}

//             {/* Main Card body */}
//             <div className=" px-6 text-start grid grid-cols-4 gap-4 mt-2">
//               <div className="col-span-4">
//                 <form className="">
//                   <div className="w-full grid-cols-1 grid gap-x-2 gap-y-1">
//                     <Autocomplete
//                       id=""
//                       clearOnEscape
//                       size="small"
//                       sx={{ width: '100%', marginTop: 1, marginBottom: 1 }}
//                       options={fixedTaskTemplateOpts}
//                       // value={{}}
//                       defaultValue={selectedfixedTaskTemplate}
//                       getOptionLabel={(option) =>
//                         option.name ? option.name : ''
//                       }
//                       onChange={(e, selectedOption) => {
//                         setSelectedfixedTaskTemplate(selectedOption);
//                       }}
//                       renderInput={(params) => (
//                         <TextField
//                           sx={{ width: '100%', marginTop: 1 }}
//                           {...params}
//                           InputProps={{
//                             ...params.InputProps,
//                             style: { fontSize: '0.8125rem' },
//                           }}
//                           InputLabelProps={{
//                             ...params.InputLabelProps,
//                             style: { fontSize: '0.875rem' },
//                           }}
//                           label="Template"
//                           variant="outlined"
//                         />
//                       )}
//                     />

//                     <div className="modifiedEditTable mb-5">
//                       <MaterialReactTable
//                         columns={tableCols}
//                         data={tableData}
//                         // editingMode="table"
//                         // enableEditing
//                         enablePagination={false}
//                         enableColumnOrdering
//                         // enableGlobalFilter={false}
//                         // enableColumnFilters={false}
//                         enableDensityToggle={false}
//                         initialState={{ density: 'compact' }}
//                         enableStickyHeader
//                         enableStickyFooter
//                         enableTopToolbar={false}
//                         enableColumnResizing
//                         muiTableContainerProps={{ sx: { maxHeight: '23.75rem' } }} // ekhane table er data height
//                         muiTableHeadCellProps={{
//                           // simple styling with the `sx` prop, works just like a style prop in this example
//                           sx: {
//                             fontWeight: 'Bold',
//                             fontSize: '0.8125rem',
//                           },
//                           // align: 'left',
//                         }}
//                         enableRowVirtualization
//                         state={{ isLoading, sorting }}
//                         rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} // optional
//                         rowVirtualizerProps={{ overscan: 5 }} // optionally customize the row virtualizer
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//             {/* Main Card Body--/-- */}

//             {/* Main Card footer */}
//             <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
//               <div className="flex gap-x-3">
//                 <button
//                   type="button"
//                   data-mdb-ripple="true"
//                   data-mdb-ripple-color="light"
//                   className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
//                   onClick={() => {
//                     saveTableData();
//                   }}
//                 >
//                   Save
//                 </button>
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

// export default BiznessEventProcConfig;
