/* eslint-disable react/button-has-type */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_Row,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from 'material-react-table';
import { Delete, Edit, EditNote } from '@mui/icons-material';
import { ExportToCsv } from 'export-to-csv';
import { BsEye } from 'react-icons/bs';
import './DualListSelectorWithGrid.css';
import {
  IDeletePCUserListDtos,
  IDeletePCUserListDtosVM,
  IPCButtonListDto,
  IPCUserListDtos,
} from '../../../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';

const API_BASE_URL = window.API_BASE_URL;
// interface Item {
//   [key: string]: any;
// }

interface DualListSelectorWithGridProps {
  items: IPCUserListDtos[];
  selectedItems: IPCUserListDtos[];
  setSelectedItems: React.Dispatch<React.SetStateAction<IPCUserListDtos[]>>;
  deletedItems: IDeletePCUserListDtosVM[];
  setDeletedItems: React.Dispatch<
    React.SetStateAction<IDeletePCUserListDtosVM[]>
  >;
  selectedUsersDLTRow: MRT_RowSelectionState;
  setSelectedUsersDLTRow: React.Dispatch<
    React.SetStateAction<MRT_RowSelectionState>
  >;
  // idKey: string;
  // optionName: string;
  // caption: string;
}

// "biznessEventProcessConfigurationId": 26,
//                     "userId": 1,
//                     "userName": "DATABIZ",
//                     "mandatory": false,
//                     "crud": "CRUD",
//                     "maxActionTimeinDays": 22,
//                     "totalEventValueLimit": 22,
//                     "pcButtonListDtos": []

// ekhane just apiSlice call hobe for all buttons. Aar selected buttons gula already user er per row er shathei ashtese...

// const allButtonsByBiznessEventProcessConfig: IPCButtonListDto[] = [
//   {
//     biznessEventPCPageButtonAccessId: 1,
//     biznessEventPCPageGenActionId: 1, // buttonId
//     biznessEventPCPageGenActionName: 'A Report', // buttonName
//     biznessEventPCUserId: 1,
//   },
//   {
//     biznessEventPCPageButtonAccessId: 2,
//     biznessEventPCPageGenActionId: 2, // buttonId
//     biznessEventPCPageGenActionName: 'B Report', // buttonName
//     biznessEventPCUserId: 1,
//   },
//   {
//     biznessEventPCPageButtonAccessId: 2,
//     biznessEventPCPageGenActionId: 2, // buttonId
//     biznessEventPCPageGenActionName: 'C Report', // buttonName
//     biznessEventPCUserId: 1,
//   },
//   {
//     biznessEventPCPageButtonAccessId: 3,
//     biznessEventPCPageGenActionId: 3, // buttonId
//     biznessEventPCPageGenActionName: 'D Report', // buttonName
//     biznessEventPCUserId: 1,
//   },
// ];

const DualListSelectorWithGrid: React.FC<DualListSelectorWithGridProps> = ({
  items,
  selectedItems,
  setSelectedItems,
  deletedItems,
  setDeletedItems,
  selectedUsersDLTRow,
  setSelectedUsersDLTRow,
  // idKey,
  // optionName,
  // caption,
}) => {
  // const [selectedItems, setSelectedItems] = useState<
  //   IPCUserListDtos[]
  // >([]);
  const [unselectedItems, setUnselectedItems] = useState<IPCUserListDtos[]>([]);
  // const [buttonConfigModal, setButtonConfigModal] = useState<boolean>(false);
  // const handleButtonConfigModalClose = () => {
  //   setButtonConfigModal(false);
  //   setCurrentButtonData([]);
  //   setCurrentUserListIndex(null);
  //   setCalledFrom('');
  // };

  // const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  // const [currentButtonData, setCurrentButtonData] = useState<
  //   IPCButtonListDto[]
  // >([]);
  // const [currentUserListIndex, setCurrentUserListIndex] = useState<
  //   number | null
  // >();
  // const [calledFrom, setCalledFrom] = useState<string>('');

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  // const buttonConfigCurrentRowFunct = (
  //   row: IPCUserListDtos,
  //   index: number,
  //   calledFromTemp: string
  // ) => {
  //   setCurrentButtonData(row.pcButtonListDtos || []);
  //   setCurrentUserListIndex(index);
  //   setCalledFrom(calledFromTemp);

  //   setButtonConfigModal(true);
  // };

  const [rowSelectionUnselected, setRowSelectionUnselected] =
    useState<MRT_RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  /// /-----------------auto comp list style-----------------
  interface AutoCompResStyles {
    popper: {
      maxWidth: string;
      // minWidth: string;
      fontSize: string;
    };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: {
      maxWidth: 'fit-content',
      // minWidth: 'inherit',
      fontSize: '0.75rem',
    },
  };
  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );

  // userListGrid codes------>
  const userListGridColumnsSelected = useMemo<MRT_ColumnDef<IPCUserListDtos>[]>(
    () => [
      {
        accessorFn: (row) => '', // access nested data with dot notation
        enableGlobalFilter: false, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'select',
        size: 70,
        grow: false,
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: '',
        Header: ({ column, table }) => (
          <div
            onClick={() => {
              const filteredSelected = table
                .getFilteredRowModel()
                .rows.map((row) => row.original);
              if (filteredSelected.length) {
                /// ////////////////////////////////////////////
                const deletedRows = [];
                for (let i = 0; i < filteredSelected.length; i++) {
                  if (filteredSelected[i].biznessEventPCUserId) {
                    const rowToBeDeleted: IDeletePCUserListDtosVM = {
                      biznessEventPCUserId:
                        filteredSelected[i].biznessEventPCUserId || 0,
                      biznessEventPCLocationId:
                        filteredSelected[i].biznessEventPCLocationId || 0,
                    };
                    deletedRows.push(rowToBeDeleted);
                  }
                }
                setDeletedItems([...deletedItems, ...deletedRows]);
                /// ////////////////////////////////////////////

                // setUnselectedItems([...selectedItems, ...unselectedItems]);

                // all unselect(delete) kortesi, jodi highlighted thaake then highlight uthe jaabe, na hole hudahudi state change korumna
                const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
                const indexNoUser = parseInt(indexNoUserObjKey, 10);
                // const ifHighlightExistsInSelectedFilter = filteredSelected.some(
                //   (filteredSelectedRow) =>
                //     filteredSelectedRow.userId ===
                //     selectedItems[indexNoUser].userId
                // );
                if (selectedUsersDLTRow[indexNoUser]) {
                  // const ifHighlightExistsInSelectedFilter =
                  //   filteredSelected.some(
                  //     (filteredSelectedRow) =>
                  //       filteredSelectedRow.userId ===
                  //       selectedItems[indexNoUser].userId
                  //   );
                  // if (ifHighlightExistsInSelectedFilter) {
                  setSelectedUsersDLTRow({});
                  // }
                }

                // setSelectedUsersDLTRow({});
                setTimeout(() => {
                  const tempSelectedItems = selectedItems.filter(
                    (selectedItemRow) =>
                      !filteredSelected.some(
                        (filteredSelectedRow) =>
                          filteredSelectedRow.userId === selectedItemRow.userId
                      )
                  );
                  setSelectedItems([...tempSelectedItems]);
                });
              }
            }}
          >
            <Checkbox
              sx={{ '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
              checked={false}
            />
            <span className=" text-[0.8125rem]">Unselect All</span>
          </div>
        ), // custom header markup
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div
              onClick={() => {
                if (row.original.biznessEventPCUserId) {
                  const rowToBeDeleted: IDeletePCUserListDtosVM = {
                    biznessEventPCUserId: row.original.biznessEventPCUserId,
                    biznessEventPCLocationId:
                      row.original.biznessEventPCLocationId || 0,
                  };
                  setDeletedItems([...deletedItems, rowToBeDeleted]);
                }

                // jodi jeita unselect(delete) kortesi, oita already highlighted thaake then highlight uthe jaabe
                const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
                const indexNoUser = parseInt(indexNoUserObjKey, 10);
                if (
                  selectedUsersDLTRow[indexNoUser] &&
                  row.index === indexNoUser
                ) {
                  setSelectedUsersDLTRow({});
                }

                // unselectedItems.unshift(row.original);
                setTimeout(() => {
                  selectedItems.splice(row.index, 1);
                  setSelectedItems([...selectedItems]);
                });

                // setUnselectedItems([...unselectedItems]);
              }}
            >
              <Checkbox
                sx={{ '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
                checked
              />
            </div>
          );
        },
      },
      {
        id: 'highlight', // access nested data with dot notation
        header: '',
        size: 55, // small column
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              // className={row.original.biznessEventId ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Select This Row"
            >
              <IconButton
                color="info"
                onClick={() => {
                  setSelectedUsersDLTRow((prev) => ({
                    // ...prev,
                    [row.id]: !prev[row.id], // this is a simple toggle implementation
                    // [row.original.virtualId]: !prev[row.original.virtualId],
                  }));
                }}
              >
                <EditNote />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorFn: (row) => `${row.userName}`, // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.userName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'userName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'User Name',
        Cell: ({ renderedCellValue, row, cell }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
            // <p>{renderedCellValue}</p>
          );
        },
      },
      {
        // accessorFn: (row) => (row.limit ? `${row.limit}` : ''), // access nested data with dot notation
        accessorFn: (row) => `${row.totalEventValueLimit}`, // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.totalEventValueLimit, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'totalEventValueLimit',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Total Event Value Limit',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                selectedItems[row.index].totalEventValueLimit = parseFloat(
                  e.target.value
                );
                setSelectedItems([...selectedItems]);
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.mandatory ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.mandatory, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'mandatory',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Mandatory',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                selectedItems[row.index].mandatory = e.target.value === 'true';
                setSelectedItems([...selectedItems]);
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => (row.crud ? `${row.crud}` : ''), // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.crud, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'action',
        header: 'Action',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                selectedItems[row.index].crud = e.target.value;
                setSelectedItems([...selectedItems]);
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.maxActionTimeinDays ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.maxActionTimeinDays, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'maxActionTimeinDays',
        header: 'Max Action Time(in Days)',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                selectedItems[row.index].maxActionTimeinDays = parseInt(
                  e.target.value,
                  10
                );
                setSelectedItems([...selectedItems]);
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },

      // {
      //   id: 'ButtonConfig', // access nested data with dot notation
      //   header: 'Button Permission Config',
      //   size: 1, // small column
      //   grow: false,
      //   // enableSorting: false,
      //   // enableColumnActions: false,
      //   // enableResizing: false,
      //   // enableColumnFilter: false,
      //   muiTableHeadCellProps: ({ column }) => ({
      //     align: 'left',
      //   }),
      //   Cell: ({ renderedCellValue, row }) => (
      //     <div
      //       className={
      //         row.original.userId
      //           ? 'visible w-full flex justify-center'
      //           : 'invisible w-full flex justify-center'
      //       }
      //     >
      //       <Tooltip arrow placement="right" title="Click here">
      //         <IconButton
      //           color="error"
      //           onClick={() => {
      //             //   setProductWiseViewModal(true);

      //             buttonConfigCurrentRowFunct(
      //               row.original,
      //               row.index,
      //               'selected'
      //             );
      //           }}
      //         >
      //           <i className="fas text-sm fa-eye" />
      //         </IconButton>
      //       </Tooltip>
      //     </div>
      //   ),
      // },
    ],
    [PopperMy]
  );
  const userListGridColumnsUnselected = useMemo<
    MRT_ColumnDef<IPCUserListDtos>[]
  >(
    () => [
      {
        accessorFn: (row) => '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.userName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        Header: ({ column, table }) => (
          <div
            onClick={() => {
              const filteredUnselected = table
                .getFilteredRowModel()
                .rows.map((row) => row.original);

              if (filteredUnselected.length) {
                /// //////////////
                // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
                // Filter deletedItems to exclude items with matching biznessEventId in newItems
                const deletedRowsRevised = deletedItems.filter(
                  (deletedItemRow) =>
                    !filteredUnselected.some(
                      (unselectedItemRow) =>
                        unselectedItemRow.biznessEventPCUserId ===
                        deletedItemRow.biznessEventPCUserId
                    )
                );
                setDeletedItems(deletedRowsRevised);
                /// ///////////////////
                setTimeout(() => {
                  setSelectedItems([...selectedItems, ...filteredUnselected]);
                });

                // setUnselectedItems([]);
                // setSelectedUsersDLTRow({});
              }
            }}
          >
            <Checkbox
              sx={{ '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
              checked={false}
            />
            <span className=" text-[0.8125rem]">Select All</span>
          </div>
        ), // custom header markup
        id: 'unselect',
        size: 70,
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: '',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div
              onClick={() => {
                /// ////////////
                // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
                if (row.original.biznessEventPCUserId) {
                  setDeletedItems(
                    deletedItems.filter(
                      (deletedItemRow) =>
                        deletedItemRow.biznessEventPCUserId !==
                        row.original.biznessEventPCUserId
                    )
                  );
                }
                /// ///////////

                unselectedItems.splice(row.index, 1);
                selectedItems.push(row.original);

                setSelectedItems([...selectedItems]);
                setUnselectedItems([...unselectedItems]);
                // setSelectedUsersDLTRow({});
              }}
            >
              <Checkbox
                sx={{ '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
                checked={false}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.userName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.userName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'userName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'User Name',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.totalEventValueLimit ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.totalEventValueLimit, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'totalEventValueLimit',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Total Event Value Limit',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.mandatory ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.mandatory, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'mandatory',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Mandatory',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.crud ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.crud, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'crud',
        header: 'CRUD',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.maxActionTimeinDays ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.maxActionTimeinDays, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'maxActionTimeinDays',
        header: 'Max Action Time(in Days)',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },

      // {
      //   id: 'ButtonConfig', // access nested data with dot notation
      //   header: 'Button Permission Config',
      //   size: 1, // small column
      //   grow: false,
      //   // enableSorting: false,
      //   // enableColumnActions: false,
      //   // enableResizing: false,
      //   // enableColumnFilter: false,
      //   muiTableHeadCellProps: ({ column }) => ({
      //     align: 'left',
      //   }),
      //   Cell: ({ renderedCellValue, row }) => (
      //     <div
      //       className={
      //         row.original.userId
      //           ? 'visible w-full flex justify-center'
      //           : 'invisible w-full flex justify-center'
      //       }
      //     >
      //       <Tooltip arrow placement="right" title="Click here">
      //         <IconButton
      //           color="error"
      //           onClick={() => {
      //             //   setProductWiseViewModal(true);
      //             setButtonConfigModal(true);
      //             buttonConfigCurrentRowFunct(
      //               row.original,
      //               row.index,
      //               'unselected'
      //             );
      //           }}
      //         >
      //           <i className="fas text-sm fa-eye" />
      //         </IconButton>
      //       </Tooltip>
      //     </div>
      //   ),
      // },
    ],
    [PopperMy]
  );
  const userListGridInitializerSelected: MRT_TableInstance<IPCUserListDtos> =
    useMaterialReactTable({
      columns: userListGridColumnsSelected,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: selectedItems || [],
      state: {
        // isLoading:
        //   requisitionComparativeInfoLoading ||
        //   requisitionComparativeInfoIsFetching,
        columnVisibility,
        rowSelection: selectedUsersDLTRow,
      },
      // enableRowOrdering: true,
      enableSorting: false, // usually you do not want to sort when re-ordering
      enableFilterMatchHighlighting: false,
      // enableRowSelection: true,
      positionToolbarAlertBanner: 'none',
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '2.5rem',
      },
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      // getRowId: (originalRow) => originalRow.userId.toString(),
      // enableMultiRowSelection: false,
      onRowSelectionChange: setSelectedUsersDLTRow,
      // enableRowVirtualization: true,
      // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
      // enableEditing: true,
      // enableDensityToggle: false,

      muiTableBodyRowProps: ({ row }) => ({
        // implement row selection click events manually
        // onClick: () =>
        //   setSelectedUsersDLTRow((prev) => ({
        //     // ...prev,
        //     [row.id]: !prev[row.id], // this is a simple toggle implementation
        //     // [row.original.virtualId]: !prev[row.original.virtualId],
        //   })),
        selected: selectedUsersDLTRow[row.id],
        // sx: {
        //   cursor: 'pointer',
        // },
      }),
      initialState: {
        density: 'compact',
        // rowSelection: { rowSelection },
        // expanded: true, //expand all groups by default
        // grouping: ['transactionName'], // an array of columns to group by by default (can be multiple)
      },
      muiTablePaperProps: {
        elevation: 0, // change the mui box shadow
        // customize paper styles
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '0.8125rem',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '31.25rem' } },
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />

          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     purchaseComparativeSheetGridState,
                //     purchaseComparativeSheetGridColumns
                //   );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      renderTopToolbarCustomActions: ({ table }) => (
        <div className="">
          <p className=" mt-1 font-bold text-[0.8125rem]">Selected</p>
        </div>
      ),

      // onSortingChange: setSorting,
      // state: { isLoading, sorting },
      // rowVirtualizerInstanceRef, // optional
      // rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer

      // enableGrouping: true,

      // displayColumnDefOptions: {
      //   'mrt-row-expand': {
      //     // enableResizing: true,
      //     enablePinning: true,
      //     size: 5,
      //     // grow: false,
      //     // enableColumnActions: true,
      //   },
      // },
      // muiToolbarAlertBannerProps: { sx: { display: 'none' } }, // eita na dile upore grouped by Transaction Name ashe.. oita bondho kora
      // state: {
      //   showAlertBanner: false,
      // },
      // muiToolbarAlertBannerChipProps: { color: 'primary' },
    });
  const userListGridInitializerUnSelected: MRT_TableInstance<IPCUserListDtos> =
    useMaterialReactTable({
      columns: userListGridColumnsUnselected,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: unselectedItems || [],
      state: {
        // isLoading:
        //   requisitionComparativeInfoLoading ||
        //   requisitionComparativeInfoIsFetching,
        // globalFilter,
        columnVisibility,
        // rowSelection: rowSelectionUnselected,
      },
      // enableRowOrdering: true,
      enableSorting: false, // usually you do not want to sort when re-ordering
      enableFilterMatchHighlighting: false,
      // enableRowSelection: true,
      positionToolbarAlertBanner: 'none',
      onColumnVisibilityChange: columnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '2.5rem',
      },
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      getRowId: (originalRow) => originalRow.userId.toString(),
      // enableMultiRowSelection: false,

      onRowSelectionChange: setRowSelectionUnselected,
      // enableRowVirtualization: true,
      // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
      // enableEditing: true,
      // enableDensityToggle: false,
      initialState: {
        density: 'compact',
        // globalFilter: globalFilter || '',
        // rowSelection: { rowSelection },
        // expanded: true, //expand all groups by default
        // grouping: ['transactionName'], // an array of columns to group by by default (can be multiple)
      },
      muiTablePaperProps: {
        elevation: 0, // change the mui box shadow
        // customize paper styles
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '0.8125rem',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },
      // onGlobalFilterChange: setGlobalFilter, // Update global filter value
      muiTableContainerProps: { sx: { maxHeight: '31.25rem' } },
      renderToolbarInternalActions: ({ table }) => {
        return (
          <>
            {/* built-in buttons (must pass in table prop for them to work!) */}
            {/* <MRT_ToggleGlobalFilterButton table={table} /> */}

            <div>
              <MRT_ToggleGlobalFilterButton table={table} />
              {/* <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{ style: { fontSize: '0.8125rem' } }}
                InputLabelProps={{
                  style: { fontSize: '0.875rem' },
                  shrink: !!globalFilter,
                }}
                onChange={(e) => setGlobalFilter(e.target.value || '')}
                id=""
                label="Target"
                variant="outlined"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = globalFilter || '';
                  }
                }}
              /> */}
            </div>

            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <div className="mx-2">
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => {
                  //   handleExportData(
                  //     purchaseComparativeSheetGridState,
                  //     purchaseComparativeSheetGridColumns
                  //   );
                }}
              >
                <i className="fas fa-file-excel" />
              </button>
            </div>
            {/* add your own custom print button or something */}
          </>
        );
      },

      renderTopToolbarCustomActions: ({ table }) => (
        <div className="">
          <p className=" mt-1 font-bold text-[0.8125rem]">UnSelected</p>
        </div>
      ),

      // onSortingChange: setSorting,
      // state: { isLoading, sorting },
      // rowVirtualizerInstanceRef, // optional
      // rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer

      // enableGrouping: true,

      // displayColumnDefOptions: {
      //   'mrt-row-expand': {
      //     // enableResizing: true,
      //     enablePinning: true,
      //     size: 5,
      //     // grow: false,
      //     // enableColumnActions: true,
      //   },
      // },
      // muiToolbarAlertBannerProps: { sx: { display: 'none' } }, // eita na dile upore grouped by Transaction Name ashe.. oita bondho kora
      // state: {
      //   showAlertBanner: false,
      // },
      // muiToolbarAlertBannerChipProps: { color: 'primary' },
    });
  // bepcGrid codes--Ends---->

  // -----Functions-------------

  const findUncommonObjects = (
    array1: IPCUserListDtos[],
    array2: IPCUserListDtos[]
  ) => {
    if (array1.length === 0) {
      return [];
    }
    // Create a Set of userIds from array2 for fast lookup
    const userIdSet2 = new Set(array2.map((item) => item.userId));

    // Find items in array1 that are not in array2
    const notInSecondArray = array1.filter(
      (item) => !userIdSet2.has(item.userId)
    );

    // Create a Set of userIds from array1 for fast lookup
    const userIdSet1 = new Set(array1.map((item) => item.userId));

    // Find items in array2 that are not in array1
    const notInFirstArray = array2.filter(
      (item) => !userIdSet1.has(item.userId)
    );

    // Combine the two arrays
    return [...notInSecondArray, ...notInFirstArray];
  };

  // ------Functions----------END----

  // --------USE EFFECT----------

  useEffect(() => {
    // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
    // const mergedItems = items.map((itemRow) => {
    //   const match = selectedItems.find(
    //     (selectedItemRow) => selectedItemRow.userId === itemRow.userId
    //   );
    //   return match || itemRow;
    // });
    /// //////////////////////////

    const uncommonObjects = findUncommonObjects(
      JSON.parse(JSON.stringify(items)),
      JSON.parse(JSON.stringify(selectedItems))
    );
    setUnselectedItems(uncommonObjects);
    // setSelectedItems(selectedItems);
  }, [items, selectedItems]);

  // --------USE EFFECT-----END-----

  return (
    <div className="duelListSelectorGridCustom">
      <div
        className={`w-full mt-4 modifiedEditTable ${
          unselectedItems.length ? '' : 'hidden'
        } `}
      >
        <MaterialReactTable table={userListGridInitializerUnSelected} />
      </div>
      <div
        className={`w-full mt-4 modifiedEditTable ${
          selectedItems.length ? '' : 'hidden'
        } `}
      >
        <MaterialReactTable table={userListGridInitializerSelected} />
      </div>

      {/* --------------------------[ modals]--------------------------------------- */}
      {/* <Modal
        open={buttonConfigModal} // create leaf modal
        onClose={handleButtonConfigModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '60vw', md: '60vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',

            // overflow: 'hidden',
            borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <div className="flex gap-2">
            <List style={{ overflowY: 'auto', maxHeight: '15.4375rem' }}>
              {allButtonsByBiznessEventProcessConfig.map(
                (row: IPCButtonListDto, index: number) => {
                  const existsInArray = currentButtonData.some(
                    (button) =>
                      button.biznessEventPCPageGenActionId ===
                        row.biznessEventPCPageGenActionId &&
                      button.biznessEventPCPageGenActionName ===
                        row.biznessEventPCPageGenActionName
                  );

                  return (
                    <ListItem
                      key={row.biznessEventPCPageGenActionId}
                      button
                      onClick={() => {
                        if (
                          calledFrom === 'selected' &&
                          currentUserListIndex != null
                        ) {
                          // selectedItems[
                          //   currentUserListIndex
                          // ].pcButtonListDtos[index].permission =
                          //   !selectedItems[currentUserListIndex]
                          //     .buttons[index].permission;
                          // setSelectedItems([
                          //   ...selectedItems,
                          // ]);
                        } else if (calledFrom === 'unselected') {
                          // do nothing
                        }
                      }}
                      sx={{ paddingY: 0 }}
                    >
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                        checked={existsInArray}
                        disabled={calledFrom === 'unselected'}
                      />
                      <ListItemText
                        primary={row.biznessEventPCPageGenActionName}
                        sx={{ '& .MuiTypography-root': { fontSize: '0.8125rem' } }}
                      />
                    </ListItem>
                  );
                }
              )}
            </List>
          </div>

          <IconButton
            aria-label="close"
            onClick={handleButtonConfigModalClose}
            sx={{
              position: 'absolute',
              // top: { xs: '25%', sm: '25%', md: '4%' },
              // right: { xs: '4%', sm: '10%', md: '2%' },
              top: '4%',
              right: '4%',
              color: 'red',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal> */}

      {/* // modals --- out of html normal body/position */}
    </div>
  );
};

export default DualListSelectorWithGrid;
