/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import {
  ICostSheetDetail,
  ICostSheetDetailCommandsVM,
  ICostSheetDetailWithTotalAmountCommandsVM,
  ICreateCostSheetDetailCommand,
  IDeleteCostSheetDetailCommand,
  IUpdateCostSheetDetailCommand,
  IUpdateCostSheetOtherExpensesCommand,
} from '../../../domain/interfaces/CostSheetDetailInterface';
import { useGetAllLCNoByCompanyIdQuery } from '../../../infrastructure/api/CostSheetLCNoApiSlice';
import { ILCNoComboBox } from '../../../domain/interfaces/LCNoComboBoxInterface';
import {
  useGetCostSheetDetailByCostSheetIdQuery,
  useProcessCostSheetDetailMutation,
} from '../../../infrastructure/api/CostSheetDetailApiSlice';
import { useGetAllAccountsNameByCompanyIdQuery } from '../../../infrastructure/api/AccountsNameApiSlice';
import { IAccountsNameComboBox } from '../../../domain/interfaces/AccountsNameComboBoxInterface';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';

// const userInfo = {
//   securityUserId: 1,
//   userName: 'DATABIZ',
//   email: null,
//   password: 'DATABIZ33305',
//   rememberMe: false,
//   companyId: 1,
//   locationId: 1,
//   screenWidth: window.innerWidth,
// };

const CostSheetDetail = (props: any) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  if (!userInfo?.securityUserId) {
    if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('brFeature');
    }
    navigate('/loginUsername');
  }

  const [lcNoOutput, setLcNoOutput] = useState<ILCNoComboBox | null>(null);
  const [costSheetDetailGrid, setCostSheetDetailGrid] = useState<
    ICostSheetDetail[]
  >([]);
  const [deletedCostSheetDetailRow, setDeletedCostSheetDetailRow] = useState<
    IDeleteCostSheetDetailCommand[]
  >([]);
  const [costSheetDetailGridPrev, setCostSheetDetailGridPrev] = useState<
    ICostSheetDetail[]
  >([]);
  const [loaderSpinnerForThisPage, setLoaderSpinnerForThisPage] =
    useState<boolean>(false);

  const {
    data: LCNoOptionsComboBox,
    isLoading: LCNoOptionsComboBoxLoading,
    error: LCNoOptionsComboBoxError,
    refetch: LCNoOptionsComboBoxRefetch,
  } = useGetAllLCNoByCompanyIdQuery({
    companyId: userInfo.companyId,
  });

  const {
    data: AccountsNameComboBox,
    isLoading: AccountsNameComboBoxLoading,
    error: AccountsNameComboBoxError,
    refetch: AccountsNameComboBoxRefetch,
  } = useGetAllAccountsNameByCompanyIdQuery({
    companyId: userInfo.companyId,
  });

  const {
    data: CostSheetDetailData,
    error: CostSheetDetailDataError,
    isLoading: CostSheetDetailDataLoading,
    refetch: CostSheetDetailDataRefetch,
  } = useGetCostSheetDetailByCostSheetIdQuery(
    {
      costSheetId: lcNoOutput?.costSheetId ?? 0,
    },
    { skip: !lcNoOutput?.costSheetId } // skip is a parameter, where it prevents the query to get automatically loaded on the render, it render the rtk hook conditionally
  );

  const [
    processCostSheetDetail,
    {
      isLoading: processCostSheetDetailLoading,
      isError: processCostSheetDetailError,
      isSuccess: processCostSheetDetailIsSuccess,
    },
  ] = useProcessCostSheetDetailMutation();

  // ------[error na success while fetching LCNo Options]------
  useEffect(() => {
    if (!LCNoOptionsComboBoxLoading && !LCNoOptionsComboBoxError) {
      setLoaderSpinnerForThisPage(false);
    } else if (LCNoOptionsComboBoxLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [LCNoOptionsComboBoxLoading, LCNoOptionsComboBoxError]);

  // ------[error na success while fetching Accounts Name Options]------
  useEffect(() => {
    if (!AccountsNameComboBoxLoading && !AccountsNameComboBoxError) {
      setLoaderSpinnerForThisPage(false);
    } else if (AccountsNameComboBoxLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [AccountsNameComboBoxLoading, AccountsNameComboBoxError]);

  // ------[error na success while fetching Cost sheet grid data]------
  useEffect(() => {
    if (
      !CostSheetDetailDataError &&
      !CostSheetDetailDataLoading &&
      lcNoOutput?.costSheetId
    ) {
      const tempCopyData: ICostSheetDetail[] = JSON.parse(
        JSON.stringify(CostSheetDetailData)
      );
      const tempCopyDataPrev: ICostSheetDetail[] = JSON.parse(
        JSON.stringify(CostSheetDetailData)
      );

      const emptyCostSheetDetailArray = [];
      if (tempCopyData && tempCopyData.length < 10) {
        for (let i = tempCopyData.length - 1; i < 10; i++) {
          const emptyCostSheetDetailObj = {
            costSheetDetailId: null,
            costSheetId: lcNoOutput?.costSheetId,
            name: '',
            accountsId: null,
            accountsName: '',
            percentage: null,
            amount: null,
            groupName: '',
          };
          emptyCostSheetDetailArray.push(emptyCostSheetDetailObj);
        }
      } else if (tempCopyData && tempCopyData.length > 9) {
        const emptyCostSheetDetailObj = {
          costSheetDetailId: null,
          costSheetId: lcNoOutput?.costSheetId,
          name: '',
          accountsId: null,
          accountsName: '',
          percentage: null,
          amount: null,
          groupName: '',
        };
        emptyCostSheetDetailArray.push(emptyCostSheetDetailObj);
      }

      setCostSheetDetailGrid([...tempCopyData, ...emptyCostSheetDetailArray]);
      setCostSheetDetailGridPrev([...tempCopyDataPrev]);
      setLoaderSpinnerForThisPage(false);
    } else if (!!CostSheetDetailDataError && !CostSheetDetailDataLoading) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something went wrong while fetching cost sheet detail grid data'
      );
      setCostSheetDetailGrid([]);
      setCostSheetDetailGridPrev([]);
    } else if (CostSheetDetailDataLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    CostSheetDetailData,
    CostSheetDetailDataLoading,
    CostSheetDetailDataError,
    lcNoOutput?.costSheetId,
  ]);

  // ------[error na success while Saving(mutation) Cost sheet grid data]------
  useEffect(() => {
    if (!processCostSheetDetailLoading && !!processCostSheetDetailError) {
      setLoaderSpinnerForThisPage(false);
      toast.error('Error while saving data');
      console.log('Error while saving data');
      console.log(processCostSheetDetailError);
    } else if (
      !processCostSheetDetailLoading &&
      processCostSheetDetailIsSuccess
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.success('Saved data successfully!');
      setDeletedCostSheetDetailRow([]);
    } else if (processCostSheetDetailLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    processCostSheetDetailLoading,
    processCostSheetDetailError,
    processCostSheetDetailIsSuccess,
  ]);

  /// /-----------------auto comp list style-----------------
  interface AutoCompResStyles {
    popper: {
      maxWidth: string;
      fontSize: string;
    };
  }

  const autoCompResStyles: AutoCompResStyles = {
    popper: {
      maxWidth: 'fit-content',
      fontSize: '12px',
    },
  };

  // const PopperMy: React.FC<any> = (propsPopper) => {
  //   return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
  // };

  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  ); // Empty dependency array as PopperMy doesn't depend on any external variables

  // ei function chatgpt diye banano
  const checkIfGroupHasRedundantAccountHead = (
    data: ICostSheetDetail[]
  ): boolean => {
    const groupMap: { [key: string]: number[] } = {}; // Map to store accountId for each group
    const problematicGroups: string[] = []; // Array to store names of groups with different account IDs

    // Group objects by their groupName
    data.forEach((item) => {
      groupMap[item.groupName] = groupMap[item.groupName] || [];
      if (item.accountsId) {
        // just null check dilam naile error ashe
        groupMap[item.groupName].push(item.accountsId);
      }
    });

    // Check if each group has different accountIds
    const groupNames = Object.keys(groupMap);
    groupNames.forEach((groupName) => {
      const accountIds = groupMap[groupName];
      const hasDifferentAccountIds = accountIds.some(
        (id, index) => index !== 0 && id !== accountIds[index - 1]
      );
      if (hasDifferentAccountIds) {
        problematicGroups.push(groupName);
      }
    });

    // Generate alert message if there are problematic groups
    if (problematicGroups.length > 0) {
      const alertMessage = `A certain group cannot have different accounts head. This problem found in Group Name: ${problematicGroups.join(
        ','
      )}`;
      toast.error(alertMessage);
    }

    return problematicGroups.length > 0;
  };

  const saveTableData = () => {
    console.log('save button clicked');

    const dataB4Edit: ICostSheetDetail[] = JSON.parse(
      JSON.stringify(costSheetDetailGridPrev)
    );
    dataB4Edit.sort(
      (a, b) => (a.costSheetDetailId ?? 0) - (b.costSheetDetailId ?? 0)
    );

    const gridDataCopy = JSON.parse(JSON.stringify(costSheetDetailGrid));
    const rowNoThoseDonotHaveMandatoryFields = [];
    const validGridWithId = [];
    const validGridWithoutId: ICreateCostSheetDetailCommand[] = [];

    let totalAmountOfThisCostSheetId: number = 0;
    for (let i = 0; i < gridDataCopy.length; i++) {
      if (
        !gridDataCopy[i].accountsId &&
        !gridDataCopy[i].amount &&
        !gridDataCopy[i].name &&
        !gridDataCopy[i].groupName
      ) {
        // do nothing, skip the for loop, means i am excluding empty rows
      } else if (
        !gridDataCopy[i].accountsId ||
        !gridDataCopy[i].amount ||
        !gridDataCopy[i].name ||
        !gridDataCopy[i].groupName
      ) {
        rowNoThoseDonotHaveMandatoryFields.push(i + 1); // rowNo ta dhukaya ditesi
      } else if (
        gridDataCopy[i].accountsId &&
        gridDataCopy[i].amount &&
        gridDataCopy[i].name &&
        gridDataCopy[i].groupName &&
        gridDataCopy[i].costSheetDetailId
      ) {
        validGridWithId.push(gridDataCopy[i]);
      } else if (
        gridDataCopy[i].accountsId &&
        gridDataCopy[i].amount &&
        gridDataCopy[i].name &&
        gridDataCopy[i].groupName &&
        !gridDataCopy[i].costSheetDetailId
      ) {
        validGridWithoutId.push(gridDataCopy[i]);
      }

      // total amount ta costsheet table e giye oi lc no er ekta field update hobe. oi total amount ta ber kore rakhtesi, jodi shob flag ok/valid hoy, then ei totalAmount backend e pathay dibo...
      totalAmountOfThisCostSheetId += gridDataCopy[i]?.amount
        ? (gridDataCopy[i].amount as number)
        : 0;
    }

    if (rowNoThoseDonotHaveMandatoryFields.length > 0) {
      const concatedArray = rowNoThoseDonotHaveMandatoryFields.join(', ');
      toast.error(
        `Fill all the required fields(Name, Account Head, Amount, Group Name) of row no.: ${concatedArray}`
      );
      return;
    }

    // je group name gula ase, oi group er ekadhik row thakle, prottek row te must same aacounts id hobe

    const updatedAndCreatedRows: any[] = [
      ...validGridWithId,
      ...validGridWithoutId,
    ];
    if (checkIfGroupHasRedundantAccountHead(updatedAndCreatedRows)) {
      toast.warning('if e dhuke return koresi');
      return;
    }

    const validGridWithIdWithDeleted = [
      ...validGridWithId,
      ...deletedCostSheetDetailRow,
    ];
    validGridWithIdWithDeleted.sort(
      (a, b) => (a.costSheetDetailId ?? 0) - (b.costSheetDetailId ?? 0)
    );

    const gridRowsToUpdate: IUpdateCostSheetDetailCommand[] = [];

    for (let i = 0; i < validGridWithIdWithDeleted.length; i++) {
      const prevRow = JSON.stringify(dataB4Edit[i]);
      const gridRow = JSON.stringify(validGridWithIdWithDeleted[i]);

      if (prevRow !== gridRow) {
        if (
          validGridWithIdWithDeleted[i].costSheetDetailId &&
          (validGridWithIdWithDeleted[i].name ||
            validGridWithIdWithDeleted[i].amount ||
            validGridWithIdWithDeleted[i].accountsId ||
            validGridWithIdWithDeleted[i].groupName)
        ) {
          gridRowsToUpdate.push(validGridWithIdWithDeleted[i]);
        }
      }
    }

    if (
      gridRowsToUpdate.length === 0 &&
      validGridWithoutId.length === 0 &&
      deletedCostSheetDetailRow.length === 0
    ) {
      console.log('no changes');
      toast.error('No changes has been made!!');
      return;
    }

    const costSheetUpdateVar: IUpdateCostSheetOtherExpensesCommand = {
      costSheetId: lcNoOutput?.costSheetId ? lcNoOutput?.costSheetId : 0,
      otherExpenses: totalAmountOfThisCostSheetId,
    };

    const sendingObj: ICostSheetDetailWithTotalAmountCommandsVM = {
      createCommand: validGridWithoutId,
      updateCommand: gridRowsToUpdate,
      deleteCommand: deletedCostSheetDetailRow,
      updateCostSheetCommand: costSheetUpdateVar,
    };

    // const sendingObj: ICostSheetDetailCommandsVM = {
    //   createCommand: validGridWithoutId,
    //   updateCommand: gridRowsToUpdate,
    //   deleteCommand: deletedCostSheetDetailRow,
    // };

    console.log('sending obj');
    console.log(sendingObj);

    // calling RTK query to save
    processCostSheetDetail(sendingObj);
  };

  const checkAndSetTableValues = useCallback(
    (index: number) => {
      if (index === costSheetDetailGrid.length - 1) {
        const emptyCostSheetDetailObj: ICostSheetDetail = {
          costSheetDetailId: null,
          costSheetId: lcNoOutput?.costSheetId ? lcNoOutput?.costSheetId : 0,
          name: '',
          accountsId: null,
          accountsName: '',
          percentage: null,
          amount: null,
          groupName: '',
        };
        setCostSheetDetailGrid([
          ...costSheetDetailGrid,
          emptyCostSheetDetailObj,
        ]);
      } else {
        setCostSheetDetailGrid([...costSheetDetailGrid]);
      }
    },
    [costSheetDetailGrid, lcNoOutput]
  );

  const costSheetDetailColumns = useMemo<MRT_ColumnDef<ICostSheetDetail>[]>(
    () => [
      {
        accessorKey: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
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
              className={
                row.original.accountsId ||
                row.original.amount ||
                row.original.groupName ||
                row.original.name
                  ? 'visible'
                  : 'invisible'
              }
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (row.original.costSheetDetailId) {
                    const tempDeletedObj: IDeleteCostSheetDetailCommand = {
                      costSheetDetailId: row.original.costSheetDetailId,
                    };
                    deletedCostSheetDetailRow?.push(tempDeletedObj);
                    // setDeletedCostSheetDetailRow([...deletedCostSheetDetailRow]);
                  }
                  costSheetDetailGrid?.splice(row.index, 1);
                  if (costSheetDetailGrid) {
                    setCostSheetDetailGrid([...costSheetDetailGrid]);
                  } else {
                    setCostSheetDetailGrid([]);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.name ?? '', // access nested data with dot notation
        id: 'name',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Name',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                // row.original.name = e.target.value;
                if (costSheetDetailGrid) {
                  costSheetDetailGrid[row.index].name = e.target.value;
                  checkAndSetTableValues(row.index);
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.accountsName ?? '', // access nested data with dot notation
        id: 'accountsName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Accounts Head',
        Cell: ({ renderedCellValue, row }) => {
          const currentAccountHead: IAccountsNameComboBox = {
            accountsId: row.original.accountsId ?? null,
            accountsName: row.original.accountsName ?? '',
          };

          return (
            // <div className="">
            <Autocomplete
              id=""
              sx={{ width: '100%' }}
              PopperComponent={PopperMy}
              clearOnEscape
              disableClearable
              freeSolo
              size="small"
              options={AccountsNameComboBox ?? []}
              value={currentAccountHead}
              onChange={(e, selectedOption) => {
                if (selectedOption && costSheetDetailGrid) {
                  const selectedOpt = selectedOption as IAccountsNameComboBox;
                  costSheetDetailGrid[row.index].accountsId =
                    selectedOpt.accountsId ?? null;
                  costSheetDetailGrid[row.index].accountsName =
                    selectedOpt.accountsName ?? '';
                  checkAndSetTableValues(row.index);
                }
              }}
              getOptionLabel={(option: any) =>
                option.accountsName ? option.accountsName : ''
              }
              renderInput={(params) => (
                <TextField
                  sx={{ width: '100%' }}
                  {...params}
                  inputRef={(node) => {
                    if (node) {
                      // eslint-disable-next-line no-param-reassign
                      node.value = renderedCellValue;
                    }
                  }}
                  // onBlur={() => { console.log(this) }}
                  InputProps={{
                    ...params.InputProps,
                    style: { fontSize: 13 },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  size="small"
                />
              )}
            />
            // </div>
          );
        },
      },

      {
        accessorFn: (row) => row.amount ?? '', // access nested data with dot notation
        id: 'amount',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Amount',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                row.original.amount = parseFloat(e.target.value);
                if (costSheetDetailGrid) {
                  // eslint-disable-next-line no-restricted-globals
                  costSheetDetailGrid[row.index].amount = isNaN(
                    parseFloat(e.target.value)
                  )
                    ? null
                    : parseFloat(e.target.value);
                  checkAndSetTableValues(row.index);
                }
                // setVoucherTableData([...voucherTableData]);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.groupName ?? '', // access nested data with dot notation
        id: 'groupName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Group Name',
        grow: true,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                if (costSheetDetailGrid) {
                  costSheetDetailGrid[row.index].groupName = e.target.value;
                  checkAndSetTableValues(row.index);
                }
              }}
            />
          );
        },
      },
    ],
    [
      costSheetDetailGrid,
      PopperMy,
      deletedCostSheetDetailRow,
      checkAndSetTableValues,
      AccountsNameComboBox,
    ]
  );

  const tableInitializer: MRT_TableInstance<ICostSheetDetail> =
    useMaterialReactTable({
      columns: costSheetDetailColumns,
      data: costSheetDetailGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      // enableRowVirtualization: true,
      // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
      // enableEditing: true,
      // enableDensityToggle: false,
      initialState: {
        density: 'compact',
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
          borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora cz raw css diye
          // borderLeft: '1px solid #e0e0e0',
          // borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '13px',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '520px' } },
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

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-11/12 ">
          {/* Main Card */}
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
            {/* Main Card header */}
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              {/* -----[Laboratory experimental place starts here]----- */}
              Cost Sheet Detail
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="grid grid-cols-4 gap-x-4 mx-1">
                <div className="mt-2">
                  <Autocomplete
                    id="lcNo"
                    clearOnEscape
                    size="small"
                    options={LCNoOptionsComboBox ?? []}
                    value={lcNoOutput || null}
                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                    getOptionLabel={(option) =>
                      option?.lcNo ? option.lcNo : ''
                    }
                    onChange={(e, selectedOption) => {
                      if (selectedOption) {
                        setLcNoOutput(selectedOption);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ width: '100%', marginTop: 1 }}
                        {...params}
                        // {...register('location')}
                        InputProps={{
                          ...params.InputProps,
                          style: { fontSize: 13 },
                        }}
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: 14 },
                        }}
                        label="L/C No."
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="w-full m-1 modifiedEditTable">
                <MaterialReactTable table={tableInitializer} />
              </div>
            </div>
            {/* Main Card Body--/-- */}

            {/* Main Card footer */}
            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    saveTableData();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
            {/* Main Card footer--/-- */}
          </div>
          {/* Main Card--/-- */}
        </div>
      </div>

      {/* // modals --- out of html normal body/position */}

      {/* --------------------------[Making a loader modal]--------------------------------------- */}
      <Modal
        open={loaderSpinnerForThisPage}
        // onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000000000,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100vw', // Set the width of the modal to full screen
            height: '100vh', // Set the height of the modal to full screen
            backgroundColor: 'rgba(251, 255, 255, 0)',
            overflow: 'hidden',
          }}
          // className="voucherGenModal"
        >
          <div className="flex justify-center bg-transparent ">
            <div className="mt-[350px] bg-transparent">
              <PropagateLoader
                color="#36d7b7"
                loading
                // cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <div className="mt-10 ml-[-50px] px-3 text-left text-white bg-slate-700 rounded-full">
                Please Wait a bit...
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default CostSheetDetail;
