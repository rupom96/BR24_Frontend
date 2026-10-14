/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/button-has-type */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
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
import { Controller, useForm } from 'react-hook-form';
import { ExportToCsv } from 'export-to-csv';
import {
  IDeleteProcurementTenderAdditionalCostCommand,
  IProcurementTenderAdditionalCost,
} from '../../../../domain/interfaces/ProcurementTenderAdditionalCost';
import { IFormProps } from '../../../../domain/interfaces/FormPropsInterface';
import { ITenderNoComboBox } from '../../../../domain/interfaces/ProcurementTenderInterface';
import { IAccountsNameComboBox } from '../../../../domain/interfaces/AccountsNameComboBoxInterface';
import { useGetProcurementTenderAdditionalCostByTenderIdQuery } from '../../../../infrastructure/api/TenderApiSlice';
import { useGetAllAccountsNameByCompanyIdQuery } from '../../../../infrastructure/api/AccountsNameApiSlice';

interface AdditionalProps {
  tenderInfo: ITenderNoComboBox | null;
  setTenderInfo: React.Dispatch<React.SetStateAction<ITenderNoComboBox | null>>;
  procurementTenderAdditionalCostState: IProcurementTenderAdditionalCost[];
  setProcurementTenderAdditionalCostState: React.Dispatch<
    React.SetStateAction<IProcurementTenderAdditionalCost[]>
  >;
  procurementTenderAdditionalCostStatePrev: IProcurementTenderAdditionalCost[];
  setProcurementTenderAdditionalCostStatePrev: React.Dispatch<
    React.SetStateAction<IProcurementTenderAdditionalCost[]>
  >;
  deletedRowProcurementTenderAdditionalCost: IDeleteProcurementTenderAdditionalCostCommand[];
  setDeletedRowProcurementTenderAdditionalCost: React.Dispatch<
    React.SetStateAction<IDeleteProcurementTenderAdditionalCostCommand[]>
  >;
}

interface ProcurementTenderAdditionalCostComponentProps
  extends AdditionalProps {
  formProps: IFormProps;
}

const ProcurementTenderAdditionalCost: React.FC<
  ProcurementTenderAdditionalCostComponentProps
> = ({
  formProps,
  tenderInfo,
  setTenderInfo,
  procurementTenderAdditionalCostState,
  setProcurementTenderAdditionalCostState,
  procurementTenderAdditionalCostStatePrev,
  setProcurementTenderAdditionalCostStatePrev,
  deletedRowProcurementTenderAdditionalCost,
  setDeletedRowProcurementTenderAdditionalCost,
}) => {
  const navigate = useNavigate();

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  // const dispatch = useAppDispatch();
  // dispatch(setNavbarShow(true));
  // dispatch(setPanelShow(true));

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

  // destructuring nested formProps
  const {
    register,
    getValues,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    errors,
  } = formProps;

  // ----------------------[api hooks]---------------

  // procurementTenderAdditionalCost autocomp options
  const {
    data: procurementTenderAdditionalCostData,
    isLoading: procurementTenderAdditionalCostLoading,
    error: procurementTenderAdditionalCostError,
    isSuccess: procurementTenderAdditionalCostIsSuccess,
    isError: procurementTenderAdditionalCostIsError,
    isFetching: procurementTenderAdditionalCostIsFetching,
    refetch: procurementTenderAdditionalCostRefetch,
  } = useGetProcurementTenderAdditionalCostByTenderIdQuery(
    {
      tenderId: tenderInfo?.procurementTenderId || 0,
    },
    { skip: !tenderInfo?.procurementTenderId }
  );

  useEffect(() => {
    if (procurementTenderAdditionalCostIsError) {
      setDeletedRowProcurementTenderAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching procurementTenderAdditionalCost, see console!'
      );
      console.log(
        'Something wrong from backend while fetching procurementTenderAdditionalCost, see console--->:'
      );
      console.log(procurementTenderAdditionalCostError);
    }

    if (
      procurementTenderAdditionalCostData &&
      procurementTenderAdditionalCostIsSuccess &&
      !procurementTenderAdditionalCostLoading &&
      !procurementTenderAdditionalCostIsError &&
      !procurementTenderAdditionalCostIsFetching
    ) {
      setDeletedRowProcurementTenderAdditionalCost([]);

      const copyOfProcurementTenderAdditionalCost = JSON.parse(
        JSON.stringify(procurementTenderAdditionalCostData)
      );
      const copyOfProcurementTenderAdditionalCost2 = JSON.parse(
        JSON.stringify(procurementTenderAdditionalCostData)
      );
      const emptyProcurementTenderAdditionalCostArray = [];
      if (
        copyOfProcurementTenderAdditionalCost &&
        copyOfProcurementTenderAdditionalCost.length < 10
      ) {
        for (
          let i = copyOfProcurementTenderAdditionalCost.length - 1;
          i < 10;
          i++
        ) {
          const emptyProcurementTenderAdditionalCostObj: IProcurementTenderAdditionalCost =
            {
              procurementTenderAdditionalCostId: null,
              name: '',
              description: '',
              percentage: null,
              amount: null,
              accountsId: null,
              accountsName: '',
            };
          emptyProcurementTenderAdditionalCostArray.push(
            emptyProcurementTenderAdditionalCostObj
          );
        }
      } else if (
        copyOfProcurementTenderAdditionalCost &&
        copyOfProcurementTenderAdditionalCost.length > 9
      ) {
        const emptyProcurementTenderAdditionalCostObj: IProcurementTenderAdditionalCost =
          {
            procurementTenderAdditionalCostId: null,
            name: '',
            description: '',
            percentage: null,
            amount: null,
            accountsId: null,
            accountsName: '',
          };
        emptyProcurementTenderAdditionalCostArray.push(
          emptyProcurementTenderAdditionalCostObj
        );
      }

      setProcurementTenderAdditionalCostState([
        ...copyOfProcurementTenderAdditionalCost,
        ...emptyProcurementTenderAdditionalCostArray,
      ]);
      setProcurementTenderAdditionalCostStatePrev(
        copyOfProcurementTenderAdditionalCost2
      );
    }
  }, [
    procurementTenderAdditionalCostLoading,
    procurementTenderAdditionalCostIsError,
    procurementTenderAdditionalCostError,
    procurementTenderAdditionalCostIsFetching,
    procurementTenderAdditionalCostData,
    procurementTenderAdditionalCostIsSuccess,
  ]);

  // productGroup autocomp options
  const {
    data: accountsOptionsData,
    isLoading: accountsOptionsLoading,
    error: accountsOptionsError,
    isSuccess: accountsOptionsIsSuccess,
    isError: accountsOptionsIsError,
    isFetching: accountsOptionsIsFetching,
    refetch: accountsOptionsRefetch,
  } = useGetAllAccountsNameByCompanyIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (accountsOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching accounts Options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching accounts Options for autocomplete, see console--->:'
      );
      console.log(accountsOptionsError);
    }
  }, [accountsOptionsLoading, accountsOptionsIsError, accountsOptionsError]);

  // ----set 10 empty rows if no tenderNo
  useEffect(() => {
    if (!tenderInfo?.procurementTenderId) {
      const emptyArray = [];
      for (let i = 0; i < 10; i++) {
        const emptyProcurementTenderAdditionalCostObj: IProcurementTenderAdditionalCost =
          {
            procurementTenderAdditionalCostId: null,
            name: '',
            description: '',
            percentage: null,
            amount: null,
            accountsId: null,
            accountsName: '',
          };
        emptyArray.push(emptyProcurementTenderAdditionalCostObj);
      }
      setProcurementTenderAdditionalCostState([...emptyArray]);
    }
  }, [tenderInfo?.procurementTenderId, tenderInfo]);

  /// //excel csv/////////////////

  const handleExportData = (gridData: any, gridColumns: any) => {
    console.log('handleExportData');

    console.log('gridData');
    console.log(gridData);

    console.log('columnVisibility');
    console.log(columnVisibility);

    // --------[Getting the hidden columns as property names in an array]----------
    const falsePropertiesArr = Object.keys(columnVisibility).filter(
      (property) => columnVisibility[property] === false
    );
    console.log('falsePropertiesArr');
    console.log(falsePropertiesArr);

    console.log('gridColumns');
    console.log(gridColumns);

    // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
    const visibleGridDataTbColXcel = gridColumns
      .filter(
        (column: any) =>
          column?.id &&
          column?.id !== 'Actions' &&
          column?.id !== 'delete' &&
          !falsePropertiesArr.includes(column.id)
      )
      .map(({ id, header }: any) => ({ id, header }));

    console.log('visibleGridDataTbColXcel');
    console.log(visibleGridDataTbColXcel);

    // --------[Getting the data of excel without those columns which are hidden ]----------
    const gridDataTbXCEL = gridData.map((item: any) => {
      return Object.keys(item).reduce((acc: any, key: any) => {
        if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });

    console.log('gridDataTbXCEL');
    console.log(gridDataTbXCEL);

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

    const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
      const sortedItem: any = {};
      visibleGridDataTbColXcel.forEach((column: any) => {
        sortedItem[column.id] = item[column.id];
      });
      return sortedItem;
    });

    console.log('gridDataTbXCELSorted');
    console.log(gridDataTbXCELSorted);

    // ---[csv er settings]---
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: visibleGridDataTbColXcel.map((c: any) => c.header),
    };
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(gridDataTbXCELSorted);
  };

  // ------------[normal functions]---------------------
  const handleRemoveProcurementTenderAdditionalCost = (currentRow: any) => {
    console.log('delete');
    console.log(currentRow);
  };
  const checkAndSetTableValues = useCallback(
    (index: number) => {
      if (index === procurementTenderAdditionalCostState.length - 1) {
        const emptyProcurementTenderAdditionalCost: IProcurementTenderAdditionalCost =
          {
            procurementTenderAdditionalCostId: null,
            name: '',
            description: '',
            percentage: null,
            amount: null,
            accountsId: null,
            accountsName: '',
          };
        setProcurementTenderAdditionalCostState([
          ...procurementTenderAdditionalCostState,
          emptyProcurementTenderAdditionalCost,
        ]);
      } else {
        setProcurementTenderAdditionalCostState([
          ...procurementTenderAdditionalCostState,
        ]);
      }
    },
    [procurementTenderAdditionalCostState]
  );

  // -----------------[validation functions]-----------------------
  const validateAccounts = (
    value: any,
    allFields: IProcurementTenderAdditionalCost
  ) => {
    // console.log('Validation function, VALUE:--->');
    console.log(value);
    // console.log('Validation function, ROW:--->');
    // console.log(allFields);
    // Check if all other attributes of the row are empty
    const allFieldsAsAny = allFields as {
      [key: string]: any;
    };
    const otherAttributesAreEmpty = Object.keys(allFieldsAsAny).every((key) => {
      return !allFieldsAsAny[key];
    });
    // If other attributes are not empty, account head is required
    if (!otherAttributesAreEmpty && !value?.accountsId) {
      return '*Required';
    }
    return true;
  };
  const validatePercentageOrAmount = (
    value: any,
    allFields: IProcurementTenderAdditionalCost
  ) => {
    // console.log('Validation function, VALUE:--->');
    // console.log(value);
    // console.log('Validation function, ROW:--->');
    // console.log(allFields);
    // Check if all other attributes of the row are empty
    const allFieldsAsAny = allFields as {
      [key: string]: any;
    };
    const otherAttributesAreEmpty = Object.keys(allFieldsAsAny).every((key) => {
      return !allFieldsAsAny[key];
    });
    // If other attributes are not empty, and amount and percentage both are already empty, then value(amount or percentage) is required
    console.log(allFieldsAsAny);
    console.log('otherAttributesAreEmpty');
    console.log(otherAttributesAreEmpty);

    console.log(
      !otherAttributesAreEmpty &&
        !value &&
        !allFields.percentage &&
        !allFields.amount
    );
    if (
      !otherAttributesAreEmpty &&
      !value &&
      !allFields.percentage &&
      !allFields.amount
    ) {
      return '*Percentage or Amount is required';
    }
    return true;
  };

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
  ); // Empty dependency array as PopperMy doesn't depend on any external variables

  // -----------[Grid variables declaration]-------------

  const procurementTenderAdditionalCostColumns = useMemo<
    MRT_ColumnDef<IProcurementTenderAdditionalCost>[]
  >(
    () => [
      {
        id: 'delete', // access nested data with dot notation
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
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (row.original.status === 'Used') {
        //     bgCellColor = '#f0f0f0';
        //   } else if (row.original.status === 'Unused') {
        //     bgCellColor = '#effced';
        //   } else if (row.original.status === 'Cancelled') {
        //     bgCellColor = '#fceded';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                row.original.name ||
                row.original.amount ||
                row.original.percentage ||
                row.original.accountsId ||
                row.original.description
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
                  if (row.original.procurementTenderAdditionalCostId) {
                    const tempDeletedObj: IDeleteProcurementTenderAdditionalCostCommand =
                      {
                        procurementTenderAdditionalCostId:
                          row.original.procurementTenderAdditionalCostId,
                      };

                    deletedRowProcurementTenderAdditionalCost?.push(
                      tempDeletedObj
                    );
                  }
                  procurementTenderAdditionalCostState?.splice(row.index, 1);
                  if (procurementTenderAdditionalCostState) {
                    setProcurementTenderAdditionalCostState([
                      ...procurementTenderAdditionalCostState,
                    ]);
                  } else {
                    setProcurementTenderAdditionalCostState([]);
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
        enableGlobalFilter: columnVisibility?.name, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'name',
        // accessorKey: 'name', // access nested data with dot notation
        header: 'Name',

        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                procurementTenderAdditionalCostState[row.index].name =
                  e.target.value || '';
                checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.description ?? '', // access nested data with dot notation
        id: 'description',
        enableGlobalFilter: columnVisibility?.description, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        size: 200,
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Description',
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (row.original.status === 'Used') {
        //     bgCellColor = '#f0f0f0';
        //   } else if (row.original.status === 'Unused') {
        //     bgCellColor = '#effced';
        //   } else if (row.original.status === 'Cancelled') {
        //     bgCellColor = '#fceded';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                procurementTenderAdditionalCostState[row.index].description =
                  e.target.value || '';
                checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.percentage ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'percentage',
        enableGlobalFilter: columnVisibility?.percentage, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Percentage',
        // size: 1, // small column
        size: 120,

        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          setValue(`percentage_row${row.index}`, renderedCellValue);
          return (
            <Controller
              name={`percentage_row${row.index}`}
              control={control}
              rules={{
                // required: '*Required',
                validate: (value) =>
                  validatePercentageOrAmount(value, row.original),
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <TextField
                  type="number"
                  sx={{ width: '100%' }}
                  error={!!error}
                  helperText={error ? error.message : null}
                  FormHelperTextProps={{
                    sx: {
                      fontSize: '0.625rem', // Set the font size
                      marginTop: 0, // Set the margin
                      color: 'red', // Set the color (example)
                    },
                  }}
                  InputProps={{
                    style: { fontSize: '0.8125rem' },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  size="small"
                  inputRef={(node) => {
                    if (node) {
                      node.value = renderedCellValue;
                    }
                  }}
                  onBlur={(e) => {
                    procurementTenderAdditionalCostState[row.index].percentage =
                      Number.isNaN(parseFloat(e.target.value))
                        ? null
                        : parseFloat(e.target.value);
                    checkAndSetTableValues(row.index);
                    // setValue(
                    //   `percentage_row${row.index}`,
                    //   Number.isNaN(parseFloat(e.target.value))
                    //     ? null
                    //     : parseFloat(e.target.value)
                    // );
                    onBlur();
                    // trigger(`amount_row${row.index}`);
                  }}
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.amount ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'amount',
        enableGlobalFilter: columnVisibility?.amount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Amount',
        // size: 1, // small column
        size: 120,

        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          setValue(`amount_row${row.index}`, renderedCellValue);
          return (
            <Controller
              name={`amount_row${row.index}`}
              control={control}
              rules={{
                // required: '*Required',
                validate: (value) =>
                  validatePercentageOrAmount(value, row.original),
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <TextField
                  type="number"
                  sx={{ width: '100%' }}
                  error={!!error}
                  helperText={error ? error.message : null}
                  FormHelperTextProps={{
                    sx: {
                      fontSize: '0.625rem', // Set the font size
                      marginTop: 0, // Set the margin
                      color: 'red', // Set the color (example)
                    },
                  }}
                  InputProps={{
                    style: { fontSize: '0.8125rem' },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  size="small"
                  inputRef={(node) => {
                    if (node) {
                      node.value = renderedCellValue;
                    }
                  }}
                  // onChange={onChange}

                  onBlur={(e) => {
                    procurementTenderAdditionalCostState[row.index].amount =
                      Number.isNaN(parseFloat(e.target.value))
                        ? null
                        : Math.abs(parseFloat(e.target.value));
                    checkAndSetTableValues(row.index);
                    // setValue(
                    //   `amount_row${row.index}`,
                    //   Number.isNaN(parseFloat(e.target.value))
                    //     ? null
                    //     : parseFloat(e.target.value)
                    // );
                    onBlur();
                    // trigger(`percentage_row${row.index}`);
                    // checkAndSetTableValues(row.index);
                  }}
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.accountsName ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'accountsName',
        enableGlobalFilter: columnVisibility?.accountsName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Accounts',
        // size: 1, // small column
        size: 120,

        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          const currentAccounts = {
            accountsId:
              procurementTenderAdditionalCostState[row.index].accountsId ||
              null,
            accountsName:
              procurementTenderAdditionalCostState[row.index].accountsName ||
              '',
          };
          setValue(`accountsName_row${row.index}`, currentAccounts);

          return (
            <Controller
              name={`accountsName_row${row.index}`}
              control={control}
              rules={{
                // required: '*Required',
                validate: (value) => validateAccounts(value, row.original),
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
                  options={
                    Array.from(
                      new Map(
                        accountsOptionsData?.map((accountsOptionsDataRow) => [
                          accountsOptionsDataRow.accountsName,
                          accountsOptionsDataRow,
                        ])
                      ).values()
                    ) || []
                  } // making sure that the array is unique by accountsName, else autocomplete search ultapalta behave kore
                  value={currentAccounts}
                  onChange={(event, selectedOption: any) => {
                    procurementTenderAdditionalCostState[row.index].accountsId =
                      selectedOption?.accountsId || null;
                    procurementTenderAdditionalCostState[
                      row.index
                    ].accountsName = selectedOption?.accountsName || '';
                    checkAndSetTableValues(row.index);
                    setValue(`accountsName_row${row.index}`, selectedOption);
                    onChange(selectedOption);
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.accountsName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.accountsId === selectedValue?.accountsId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: '0.625rem', // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: '0.8125rem' },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },
    ],
    [
      handleRemoveProcurementTenderAdditionalCost,
      PopperMy,
      checkAndSetTableValues,
      procurementTenderAdditionalCostState,
      //   chequeBookGrid,
      //   PopperMy,
    ]
  );

  const tableInitializer: MRT_TableInstance<IProcurementTenderAdditionalCost> =
    useMaterialReactTable({
      columns: procurementTenderAdditionalCostColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: procurementTenderAdditionalCostState || [],
      state: {
        // isLoading:
        //   procurementTenderDetailLoading || procurementTenderDetailFetching,
        columnVisibility,
      },
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
      enableFilterMatchHighlighting: false, // disable filter match highlighting
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
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '0.8125rem',
          color: '#303030',
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

      muiTableContainerProps: { sx: { maxHeight: '12.5rem' } },
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
                handleExportData(
                  procurementTenderAdditionalCostState,
                  procurementTenderAdditionalCostColumns
                );
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
          <p className=" mt-1 font-bold text-[0.8125rem]">
            Procurment Tender Additional Cost
          </p>
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

  return (
    // return wrapper div

    <div className="mt-0">
      {/* <p>Procurement Tender Additional Cost</p> */}
      <div className="w-full m-1 modifiedEditTable">
        <MaterialReactTable table={tableInitializer} />
      </div>
    </div>

    // return wrapper div--/--
  );
};

export default ProcurementTenderAdditionalCost;
