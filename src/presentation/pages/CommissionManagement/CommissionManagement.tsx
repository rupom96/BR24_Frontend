/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/ban-types */
// import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Popper,
  Checkbox,
  FormGroup,
  TextField,
  Tooltip,
  Typography,
  Stack,
  InputAdornment,
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
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
  MRT_SortingState,
  MRT_Virtualizer,
} from 'material-react-table';
import { ExportToCsv } from 'export-to-csv';

import {
  useLazyGetCommissionGridQuery,
  useProcessBuyerWiseCommissionAchievementMutation,
} from '../../../infrastructure/api/CommissionApiSlice';
import {
  IBuyerWiseCommissionAchievement,
  ICreateBuyerWiseCommissionAchievement,
  IProcessBuyerWiseCommissionAchievement,
} from '../../../domain/interfaces/BuyerWiseCommissionAchievement';
import { useGetBuyerGradingQuery } from '../../../infrastructure/api/BuyerApiSlice';

const API_BASE_URL = window.API_BASE_URL;

// ---- Multi-select filter helper (AND logic) ----
const applyPreviewFilters = (
  raw: any[],
  opts: string[],
  commissionOnOpt?: string,
  srValue?: number,
  gradeValue?: {
    buyerGradingId?: number | null | undefined;
    buyerGradingName?: string | undefined;
  }
) => {
  if (!raw?.length) return [];
  // if (!opts?.length || opts.includes('allCustomers')) return [...raw];

  const gid = gradeValue?.buyerGradingId ?? 0;

  const satisfies = (row: any, opt: string) => {
    switch (opt) {
      case 'allCustomers':
        //  always true → include everything
        return true;
      case 'performingCustomers':
        return commissionOnOpt === 'Sales'
          ? (row.achievementSales ?? 0) >= 100 && (row.endingBalance ?? 0) <= 0
          : (row.achievementCollection ?? 0) >= 100;
      case 'nonPerformingCustomers':
        return commissionOnOpt === 'Sales'
          ? (row.achievementSales ?? 0) < 100
          : (row.achievementCollection ?? 0) < 100;
      case 'noTarget':
        return (row.target ?? 0) === 0;
      case 'buyerWithSR':
        return (row.numberOfSR ?? 0) === (srValue ?? 0);
      case 'buyerWithGrade':
        return (row.buyerGradingId ?? 0) === gid;
      case 'successfulAchievement':
        return commissionOnOpt === 'Sales'
          ? (row.totalSales ?? 0) >= (row.target ?? 0) && !!row.target
          : (row.totalCollection ?? 0) >= (row.target ?? 0) && !!row.target;
      default:
        return true;
    }
  };

  return raw.filter((row) => opts.every((opt) => satisfies(row, opt)));
};

type Props = {};

const CommissionManagement = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  console.log('See clickedCardInfo ---------------------------->');
  console.log(clickedCardInfo);

  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  const {
    register,
    getValues,
    reset,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange', // Validation will trigger on blur
    defaultValues: {
      commissionMonthYear: dayjs().format('YYYY-MM'),
      commissionOn: { optionName: 'Sales' },
      gradeValue: { buyerGradingId: 0, buyerGradingName: 'No Grade' },
      commissionPercentage: 0,
      commissionAmount: 0,
      extendedDate: null,
      previewOptions: ['allCustomers'],
      srValue: 0,
      currentDate: dayjs().format(),
    },
  });
  // Watch for changes in the entire form
  const watchedFields = useWatch({ control });
  const navigate = useNavigate();
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

  const [commissionGridState, setCommissionGridState] = useState<
    IBuyerWiseCommissionAchievement[]
  >([]);

  const [commissionGridStatePrev, setCommissionGridStatePrev] = useState<
    IBuyerWiseCommissionAchievement[]
  >([]);

  const [selectedCommissionRow, setSelectedCommissionRow] = useState<any>({});

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  type FormValues = {
    commissionMonthYear: string;
    extendedDate: string | null;
    commissionOn: { optionName: string };
    gradeValue: { buyerGradingId: number | null; buyerGradingName: string };
    commissionPercentage: number;
    commissionAmount: number;
    currentDate: string;
    previewOptions: string[];
    srValue: number;
  };

  //   grid virtualization states
  const [isCommissionGridLoading, setIsCommissionGridLoading] = useState(true);
  const [sortingCommissionGrid, setSortingCommissionGrid] =
    useState<MRT_SortingState>([]);

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetCommissionGrid,
    {
      data: commissionGridData,
      error: commissionGridError,
      isError: commissionGridIsError,
      isSuccess: commissionGridIsSuccess,
      isLoading: commissionGridIsLoading,
      isFetching: commissionGridIsFetching,
    },
  ] = useLazyGetCommissionGridQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (commissionGridIsError) {
      toast.error(
        'Something wrong from backend while fetching commissionGridData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching commissionGridData, see console--->:'
      );
      console.log(commissionGridError);
      setCommissionGridState([]);
      setCommissionGridStatePrev([]);
      setIsCommissionGridLoading(false);
    } else if (
      commissionGridIsSuccess &&
      typeof window !== 'undefined' &&
      !commissionGridIsLoading &&
      !commissionGridIsFetching &&
      !commissionGridIsError &&
      commissionGridData
    ) {
      console.log('commissionGridIsSuccess');
      console.log(commissionGridData);

      const {
        commissionMonthYear,
        commissionOn,
        extendedDate,
        commissionPercentage,
        commissionAmount,
        previewOptions,
        srValue,
        gradeValue,
      } = watchedFields;

      // let tempCommissionData = commissionGridData
      //   ? JSON.parse(JSON.stringify(commissionGridData))
      //   : [];
      // let tempCommissionDataPrev = commissionGridData
      //   ? JSON.parse(JSON.stringify(commissionGridData))
      //   : [];
      let tempCommissionData = [];
      let tempCommissionDataPrev = [];

      // ANDed filters
      const filtered = applyPreviewFilters(
        commissionGridData || [],
        previewOptions || [],
        commissionOn?.optionName,
        srValue,
        gradeValue
      );
      tempCommissionData = JSON.parse(JSON.stringify(filtered));
      tempCommissionDataPrev = JSON.parse(JSON.stringify(filtered));

      setCommissionGridState([...tempCommissionData]);
      setCommissionGridStatePrev([...tempCommissionDataPrev]);

      setIsCommissionGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsCommissionGridLoading(true);
    }
  }, [
    commissionGridData,
    commissionGridIsLoading,
    commissionGridError,
    commissionGridIsError,
    commissionGridIsFetching,
    commissionGridIsSuccess,
  ]);

  const {
    data: buyerGradingComboOptions,
    isLoading: buyerGradingComboOptionsLoading,
    error: buyerGradingComboOptionsError,
    isSuccess: buyerGradingComboOptionsIsSuccess,
    isError: buyerGradingComboOptionsIsError,
    isFetching: buyerGradingComboOptionsIsFetching,
    refetch: buyerGradingComboOptionsRefetch,
  } = useGetBuyerGradingQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (buyerGradingComboOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerGradingComboOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerGradingComboOptions for autocomplete, see console--->:'
      );
      console.log(buyerGradingComboOptionsError);
    }
    if (buyerGradingComboOptionsIsSuccess) {
      console.log('buyerGradingComboOptions');
      console.log(buyerGradingComboOptions);
    }
  }, [
    buyerGradingComboOptionsLoading,
    buyerGradingComboOptionsIsFetching,
    buyerGradingComboOptionsError,
    buyerGradingComboOptionsIsError,
    buyerGradingComboOptions,
    buyerGradingComboOptionsIsSuccess,
  ]);

  // process/save commission api
  const [
    processBuyerWiseCommissionAchievement,
    {
      isLoading: processBuyerWiseCommissionAchievementLoading,
      isError: processBuyerWiseCommissionAchievementIsError,
      error: processBuyerWiseCommissionAchievementError,
      isSuccess: processBuyerWiseCommissionAchievementIsSuccess,
      data: processBuyerWiseCommissionAchievementData,
    },
  ] = useProcessBuyerWiseCommissionAchievementMutation();

  useEffect(() => {
    if (processBuyerWiseCommissionAchievementIsSuccess) {
      toast.success('Commission has been saved successfully!');
      console.log(processBuyerWiseCommissionAchievementData);
      setSelectedCommissionRow({}); // last publish er por added
    } else if (processBuyerWiseCommissionAchievementIsError) {
      toast.error(
        'Something is wrong in backend while saving processBuyerWiseCommissionAchievement, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving processBuyerWiseCommissionAchievement data, see console---->'
      );
      console.log(processBuyerWiseCommissionAchievementError);
    }
  }, [
    processBuyerWiseCommissionAchievementLoading,
    processBuyerWiseCommissionAchievementIsError,
    processBuyerWiseCommissionAchievementData,
    processBuyerWiseCommissionAchievementError,
    processBuyerWiseCommissionAchievementIsSuccess,
  ]);

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  useEffect(() => {
    const {
      commissionMonthYear,
      commissionOn,
      extendedDate,
      commissionPercentage,
      commissionAmount,
      previewOptions,
    } = watchedFields;

    if (watchedFields.commissionOn?.optionName === 'Sales') {
      columnVisibility.achievementSales = true;
      columnVisibility.achievementCollection = false;
    } else if (watchedFields.commissionOn?.optionName === 'Collection') {
      columnVisibility.achievementSales = false;
      columnVisibility.achievementCollection = true;
    }

    // Trigger your RTK Query
    if (commissionMonthYear && commissionOn) {
      triggerGetCommissionGrid({
        companyId: userInfo?.companyId || 0,
        commissionMonthYear: commissionMonthYear
          ? `${dayjs(commissionMonthYear).year()}-${
              dayjs(commissionMonthYear).month() + 1
            }`
          : `${dayjs().year()}-${dayjs().month() + 1}`,
        extendedDate: extendedDate
          ? dayjs(extendedDate).format('YYYY-MM-DD[T]HH:mm:00.000[Z]')
          : null,
        commissionOn: commissionOn.optionName || '',
        previewOption: 'All',
      });
    } else {
      setIsCommissionGridLoading(false);
      setCommissionGridState([]);
    }
  }, [
    watchedFields.commissionMonthYear,
    watchedFields.commissionOn?.optionName,
    watchedFields.extendedDate,
    // watchedFields.previewOptions,
    triggerGetCommissionGrid,
  ]);

  useEffect(() => {
    const {
      commissionMonthYear,
      commissionOn,
      extendedDate,
      commissionPercentage,
      commissionAmount,
      previewOptions,
      srValue,
      gradeValue,
    } = watchedFields;

    let tempCommissionData = [];
    let tempCommissionDataPrev = [];

    // ANDed filters
    const filtered2 = applyPreviewFilters(
      commissionGridData || [],
      previewOptions || [],
      commissionOn?.optionName,
      srValue,
      gradeValue
    );
    tempCommissionData = JSON.parse(JSON.stringify(filtered2));
    tempCommissionDataPrev = JSON.parse(JSON.stringify(filtered2));
    setCommissionGridState([...tempCommissionData]);
    setCommissionGridStatePrev([...tempCommissionDataPrev]);
  }, [
    watchedFields.previewOptions,
    watchedFields.srValue,
    watchedFields.gradeValue,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // ---------------------AUTOCOMPLETE POPPER INITIALIZATION-------------------------------

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
  // ---------------------AUTOCOMPLETE POPPER INITIALIZATION--------------ENDSS-----------------

  // --------------------------------------------excel csv-----------------------------------

  const handleExportData = (gridData: any[], gridColumns: any) => {
    if (!gridData.length) {
      toast.info('No data to download');
      return;
    }

    console.log('handleExportData');

    console.log('gridData');
    console.log(gridData);

    const gridDataReassigned = gridData
      ? JSON.parse(JSON.stringify(gridData))
      : [];

    // putting percentage sign after each value of achievementSales and achievementCollection in excel report
    for (let i = 0; i < gridDataReassigned.length; i++) {
      gridDataReassigned[i].achievementSales =
        `${gridDataReassigned[i].achievementSales} %`;
      gridDataReassigned[i].achievementCollection =
        `${gridDataReassigned[i].achievementCollection} %`;
    }

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
    const gridDataTbXCEL = gridDataReassigned.map((item: any) => {
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

  // ------------------------------------excel csv-----------------END------------------

  const commissionGridColumns = useMemo<
    MRT_ColumnDef<IBuyerWiseCommissionAchievement>[]
  >(
    () => [
      // {
      //   id: 'delete', // access nested data with dot notation
      //   header: '',
      //   size: 1, // small column
      //   grow: false,
      //   enableSorting: false,
      //   enableColumnActions: false,
      //   // enableResizing: false,
      //   enableColumnFilter: false,
      //   muiTableHeadCellProps: ({ column }) => ({
      //     align: 'left',
      //   }),
      //   Cell: ({ renderedCellValue, row }) => (
      //     <div className="w-full flex justify-center">
      //       <Tooltip
      //         className={false ? 'visible' : 'invisible'}
      //         arrow
      //         placement="right"
      //         title="Delete"
      //       >
      //         <IconButton
      //           color="error"
      //           onClick={() => {
      //             // handleDeleteRow(row.index, row.original);
      //           }}
      //         >
      //           <Delete />
      //         </IconButton>
      //       </Tooltip>
      //     </div>
      //   ),
      // },
      {
        accessorFn: (row) => row.buyerName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.buyerName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'buyerName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Customer',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full py-1 flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.salesPersonName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.salesPersonName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'salesPersonName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Sales Person',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.openingBalance ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.openingBalance, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'openingBalance',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Opening Balance',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.target ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.target, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'target',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Target',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.totalSales ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.totalSales, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'totalSales',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Total Sales',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.extraSales ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.extraSales, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'extraSales',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Extra Sales',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.cpSales ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.grossProfitP, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'cpSales',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'C.P Sales',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.cpSalesReturn ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.cpSalesReturn, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'cpSalesReturn',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'C.P Sales Return',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.cpCreditNote ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.cpCreditNote, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'cpCreditNote',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'C.P Credit Note',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.cpNetSales ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.cpNetSales, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'cpNetSales',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'C.P Net Sales',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.collection ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.collection, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'collection',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Collection',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.extraCollection ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.extraCollection, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'extraCollection',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Extra Collection',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.totalCollection ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.totalCollection, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'totalCollection',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Total Collection',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.achievementSales ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.achievementSales, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'achievementSales',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Achievement Sales(%)',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.achievementCollection ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.achievementCollection, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'achievementCollection',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Achievement Collection(%)',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.endingBalance ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.endingBalance, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'endingBalance',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Closing Balance',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.aging ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.aging, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'aging',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Aging',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.commissionAmount ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.commissionAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'commissionAmount',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Total Commission',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.lastProcessedDate ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.lastProcessedDate, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'lastProcessedDate',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Last Processed',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  readOnly: true,
                }}
                //   onBlur={(e) => {}}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
              />
            </div>
          );
        },
      },
    ],
    [PopperMy]
  );

  // ---------- material table virtualization---------

  // optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && tableDataLoading === false) {
  //     // setData(makeData(10_000));
  //     setIsLoading(false);
  //   }
  // }, [tableDataLoading]);   //--------ei code ta getGridData anar j api, oitay ei if er condition ta add koira dite hobe
  useEffect(() => {
    // scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortingCommissionGrid]);

  // ---------- material table virtualization---------

  const commissionGridStateInitializer: MRT_TableInstance<IBuyerWiseCommissionAchievement> =
    useMaterialReactTable({
      columns: commissionGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: commissionGridState || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading:
          isCommissionGridLoading ||
          commissionGridIsLoading ||
          commissionGridIsFetching,
        sorting: sortingCommissionGrid,
        rowSelection: selectedCommissionRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '1.875rem',
      },
      enableRowSelection: (row) => {
        // if (row.original.lastProcessedDate) {
        //   toast.warning(
        //     'You cannot select/calculate commission for this buyer, as this is already processed before'
        //   );
        // }
        return (
          !row.original.lastProcessedDate &&
          (row.original.endingBalance || 0) <= 0
        ); // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
      }, // enable row selection conditionally per row

      muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
        sx: {
          cursor: 'pointer',
          backgroundColor: row.original.lastProcessedDate ? '#e3e4e6' : 'white',
          '&:hover': {
            backgroundColor: row.original.lastProcessedDate
              ? '#e3e4e6'
              : '#f9f9f9',
          },
        },
        onClick: (event) => {
          console.log(row.original.lastProcessedDate); // Log the row object

          if (row.original.lastProcessedDate) {
            Swal.fire({
              title: `Why you cannot calculate commission for this buyer!`,
              text: `You cannot calculate or process commission for this buyer: ${
                row.original.buyerName
              }. Because, you are calculating commission for ${dayjs(
                watchedFields.commissionMonthYear
              ).format(
                'MMMM, YYYY'
              )}, but this buyer's commission has already been calculated for ${dayjs(
                row.original.commissionMonthYear
              ).format('MMMM, YYYY')}${
                row.original.extendedCommissionDate
                  ? ` with date extended up to ${dayjs(
                      row.original.extendedCommissionDate
                    ).format('DD MMMM, YYYY')}`
                  : ''
              }`,
              showDenyButton: false,
              allowOutsideClick: true,
              // target: 'body',
              icon: 'info',
              showCancelButton: false,
              confirmButtonText: 'OK!',
              // denyButtonText: `No, I will set it manually!`,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                // do nothing
              }
            });
          } else if ((row.original.endingBalance || 0) > 0) {
            Swal.fire({
              title: `Why you cannot calculate and save commission for this buyer!`,
              text: `A positive closing balance exists for this buyer: ${row.original.buyerName}, closing balance has to be negetive or zero in order to calculate commission`,
              showDenyButton: false,
              allowOutsideClick: true,
              // target: 'body',
              icon: 'info',
              showCancelButton: false,
              confirmButtonText: 'OK!',
              // denyButtonText: `No, I will set it manually!`,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                // do nothing
              }
            });
          }
        },
        // sx: { cursor: 'pointer' },
      }),

      // enableRowSelection: true,
      // getRowId: (row) => row.buyerId, // give each row a more useful id
      onRowSelectionChange: setSelectedCommissionRow,
      enableRowVirtualization: true,
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enableFilterMatchHighlighting: false, // disable filter match highlighting
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      initialState: {
        density: 'compact',
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

      muiTableContainerProps: { sx: { maxHeight: '25rem' } },
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
                //     buyerSalesRptGridState,
                //     buyerSalesRptGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );

                const commissionGridGlobalFiltered =
                  commissionGridStateInitializer
                    .getFilteredRowModel()
                    .rows.map((row) => row.original);

                handleExportData(
                  commissionGridGlobalFiltered,
                  commissionGridColumns
                );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      //   renderTopToolbarCustomActions: ({ table }) => (
      //     <div className=" w-[30%] mt-1 flex gap-3 justify-center items-center">

      //     </div>
      //   ),
      onSortingChange: setSortingCommissionGrid,
      rowVirtualizerInstanceRef, // optional
      rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
    });

  const assignCalculatedCommissionOnEachRow = (
    commissionCaluculationType: string
  ) => {
    const {
      commissionMonthYear,
      commissionOn,
      extendedDate,
      commissionPercentage,
      commissionAmount,
      previewOptions,
      srValue,
    } = watchedFields;

    if (!commissionOn) {
      toast.info('You have to select Commission On first!');
      return false;
    }

    if (!commissionPercentage && commissionCaluculationType === 'Percentage') {
      toast.info('Set a commission percentage!');
      return false;
    }
    if (!commissionAmount && commissionCaluculationType === 'Amount') {
      toast.info('Set a commission amount!');
      return false;
    }
    console.log('typeof commissionPercentage');
    console.log(typeof commissionPercentage);
    const commissionPercentageTemp = commissionPercentage
      ? parseFloat(commissionPercentage.toString())
      : 0;

    const commissionAmountTemp = commissionAmount
      ? parseFloat(commissionAmount.toString())
      : 0;

    const commissionGridGlobalFiltered = commissionGridStateInitializer
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    console.log('commissionGridGlobalFiltered ---- >');
    console.log(commissionGridGlobalFiltered);

    if (commissionGridGlobalFiltered) {
      if (commissionCaluculationType === 'Percentage') {
        setIsCommissionGridLoading(true);
        for (let i = 0; i < commissionGridGlobalFiltered.length; i++) {
          const indexInState = commissionGridState.findIndex(
            (row) => row.buyerId === commissionGridGlobalFiltered[i].buyerId
          );
          if (commissionOn?.optionName === 'Sales') {
            commissionGridState[indexInState].commissionAmount =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? ((previewOptions?.includes('buyerWithSR') && srValue === 0
                    ? commissionGridState[indexInState]?.totalSales || 0
                    : commissionGridState[indexInState]?.cpNetSales || 0) *
                    (commissionPercentageTemp || 0)) /
                  100
                : commissionGridState[indexInState].commissionAmount;

            commissionGridState[indexInState].commissionPercentage =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? commissionPercentageTemp || 0
                : commissionGridState[indexInState].commissionPercentage;
          } else if (commissionOn?.optionName === 'Collection') {
            commissionGridState[indexInState].commissionAmount =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? ((commissionGridState[indexInState]?.totalCollection || 0) *
                    (commissionPercentageTemp || 0)) /
                  100
                : commissionGridState[indexInState].commissionAmount;

            commissionGridState[indexInState].commissionPercentage =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? commissionPercentageTemp
                : commissionGridState[indexInState].commissionPercentage;
          }
        }
      } else if (commissionCaluculationType === 'Amount') {
        setIsCommissionGridLoading(true);
        for (let i = 0; i < commissionGridGlobalFiltered.length; i++) {
          const indexInState = commissionGridState.findIndex(
            (row) => row.buyerId === commissionGridGlobalFiltered[i].buyerId
          );
          if (commissionOn?.optionName === 'Sales') {
            commissionGridState[indexInState].commissionAmount =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? commissionAmountTemp
                : commissionGridState[indexInState].commissionAmount;

            commissionGridState[indexInState].commissionPercentage =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? ((commissionAmountTemp || 0) * 100) /
                  (previewOptions?.includes('buyerWithSR') && srValue === 0
                    ? commissionGridState[indexInState]?.totalSales || 0
                    : commissionGridState[indexInState]?.cpNetSales || 0)
                : commissionGridState[indexInState].commissionAmount;
          } else if (commissionOn?.optionName === 'Collection') {
            commissionGridState[indexInState].commissionAmount =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? commissionAmountTemp
                : commissionGridState[indexInState].commissionAmount;

            commissionGridState[indexInState].commissionPercentage =
              !commissionGridState[indexInState].lastProcessedDate &&
              (commissionGridState[indexInState].endingBalance || 0) <= 0
                ? ((commissionAmountTemp || 0) * 100) /
                  (commissionGridState[indexInState]?.totalCollection || 0)
                : commissionGridState[indexInState].commissionPercentage;
          }
        }
      }
      setCommissionGridState([...commissionGridState]);
      setIsCommissionGridLoading(false);
    }
  };

  const testFunct = () => {
    console.log(columnVisibility);
  };

  const saveBtn = () => {
    const {
      commissionMonthYear,
      commissionOn,
      extendedDate,
      commissionPercentage,
      previewOptions,
      currentDate,
    } = watchedFields;

    console.log(commissionMonthYear);
    console.log(selectedCommissionRow);

    // Get rows based on index numbers in the object
    const currentCommissionGrid = Object.keys(selectedCommissionRow)
      .filter((key) => selectedCommissionRow[key]) // Only include keys with a true value
      .map((key) => commissionGridState[Number(key)]); // Get the corresponding array values

    const prevCommissionGrid = Object.keys(selectedCommissionRow)
      .filter((key) => selectedCommissionRow[key]) // Only include keys with a true value
      .map((key) => commissionGridStatePrev[Number(key)]); // Get the corresponding array values

    if (currentCommissionGrid.length === 0) {
      toast.info('Select atleast one row to save!');
    }
    if (
      JSON.stringify(currentCommissionGrid) ===
      JSON.stringify(prevCommissionGrid)
    ) {
      toast.info('No changes to save!');
      console.log('currentCommissionGrid');
      console.log(currentCommissionGrid);
      console.log('prevCommissionGrid');
      console.log(prevCommissionGrid);
    }

    if (
      JSON.stringify(currentCommissionGrid) !==
        JSON.stringify(prevCommissionGrid) &&
      currentCommissionGrid.length > 0
    ) {
      // eikhane save er kaaj hobe

      // const sendingObj: IProcessBuyerWiseCommissionAchievement = {
      //   createBuyerWiseCommissionAchievement: [],
      //   updateBuyerWiseCommissionAchievement: [],
      //   deleteBuyerWiseCommissionAchievement: [],
      // };

      const createBuyerWiseCommissionAchievementTemp = [];

      for (let i = 0; i < currentCommissionGrid.length; i++) {
        const tempCreateBuyerWise: ICreateBuyerWiseCommissionAchievement = {
          buyerId: currentCommissionGrid[i].buyerId || 0,
          openingBalance: currentCommissionGrid[i].openingBalance || 0,
          target: currentCommissionGrid[i].target || 0,
          totalSales: currentCommissionGrid[i].totalSales,
          extraSales: currentCommissionGrid[i].extraSales,
          cpSales: currentCommissionGrid[i].cpSales,
          cpSalesReturn: currentCommissionGrid[i].cpSalesReturn,
          cpCreditNote: currentCommissionGrid[i].cpCreditNote,
          cpNetSales: currentCommissionGrid[i].cpNetSales,
          collection: currentCommissionGrid[i].collection,
          extraCollection: currentCommissionGrid[i].extraCollection,
          totalCollection: currentCommissionGrid[i].totalCollection,
          achievementSales: currentCommissionGrid[i].achievementSales,
          achievementCollection: currentCommissionGrid[i].achievementCollection,
          endingBalance: currentCommissionGrid[i].endingBalance || 0,
          aging: currentCommissionGrid[i].aging,
          commissionAmount: currentCommissionGrid[i].commissionAmount || 0,
          commissionPercentage:
            currentCommissionGrid[i].commissionPercentage || 0,
          commissionOn: currentCommissionGrid[i].commissionOn || '',
          commissionMonthYear: `${dayjs(commissionMonthYear).year()}-${
            dayjs(commissionMonthYear).month() + 1
          }`,
          extendedCommissionDate: extendedDate
            ? dayjs(extendedDate).format('YYYY-MM-DD[T]HH:mm:00.000[Z]')
            : null,
          lastProcessedDate: extendedDate
            ? dayjs(extendedDate).format('YYYY-MM-DD[T]HH:mm:00.000[Z]')
            : dayjs(commissionMonthYear, 'YYYY-MM')
                .endOf('month')
                .format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          entryBy: userInfo?.securityUserId || 0,
          dateOfEntry: dayjs(currentDate).format(
            'YYYY-MM-DD[T]HH:mm:00.000[Z]'
          ),
        };
        createBuyerWiseCommissionAchievementTemp.push(tempCreateBuyerWise);
      }

      const sendingObj: IProcessBuyerWiseCommissionAchievement = {
        bulkCreateBuyerWiseCommissionAchievementCommand: {
          buyerWiseCommissionAchievements:
            createBuyerWiseCommissionAchievementTemp,
        },
        bulkDeleteBuyerWiseCommissionAchievementCommand: null,
      };
      console.log('sendingObj');
      console.log(sendingObj);

      // call api
      processBuyerWiseCommissionAchievement(sendingObj);
    }
  };

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          {/* Main Card */}
          {/* <form onSubmit={handleSubmit(downloadReport)}> */}
          <form>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[TransactionEventVoucher experimental place starts here]----- */}
                {biznessEventName
                  ? biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
                  : 'Commission Management'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1  mt-5">
                <div className=" grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-1">
                  <Controller
                    name="commissionMonthYear"
                    control={control}
                    rules={{
                      required: '*Required',
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Commission Month"
                          views={['year', 'month']}
                          // inputFormat="DD/MM/YYYY"
                          value={dayjs(value)}
                          onChange={(newValue) => {
                            console.log('Hello rupom yooo');

                            console.log(newValue);
                            setValue('extendedDate', null);
                            onChange(dayjs(newValue).format('YYYY-MM'));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: '100%', marginTop: 1 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="standard"
                              size="small"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <Controller
                    name="currentDate"
                    rules={{
                      required: '*Required',
                    }}
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Current Date"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={(newValue) => {
                            console.log(newValue);
                            onChange(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: '100%', marginTop: 1 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="standard"
                              size="small"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  <Controller
                    name="commissionOn"
                    control={control}
                    // rules={{
                    //   required: '*Required',
                    // }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        id=""
                        size="small"
                        loading={false}
                        options={[
                          { optionName: 'Sales' },
                          { optionName: 'Collection' },
                        ]}
                        value={value || null}
                        // onChange={(event, item) => {}} // React-hook-form manages the state
                        onChange={(event, selectedItem) => {
                          if (selectedItem) {
                            onChange(selectedItem);
                          }
                        }}
                        onBlur={onBlur} // Trigger validation on blur
                        getOptionLabel={(option) =>
                          option ? option.optionName : ''
                        }
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.optionName === selectedValue?.optionName
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Commission On"
                            variant="standard"
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputLabelProps={{
                              ...params.InputLabelProps,
                              style: { fontSize: '0.875rem' },
                            }}
                            InputProps={{
                              ...params.InputProps,
                              style: { fontSize: '0.8125rem' },
                              // endAdornment: (
                              //   <>
                              //     {buyerOptionsAutoCompLoading ? (
                              //       <CircularProgress color="inherit" size={20} />
                              //     ) : null}
                              //     {params.InputProps.endAdornment}
                              //   </>
                              // ),
                            }}
                            sx={{ width: '100%', marginTop: 1 }}
                            inputRef={ref}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="extendedDate"
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Extended Date"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={(newValue) => {
                            console.log(newValue);
                            onChange(newValue);
                          }}
                          minDate={dayjs(watchedFields?.commissionMonthYear)
                            ?.endOf('month')
                            .add(1, 'day') // Adds one day
                            .format('YYYY-MM-DD')} // Set the minimum selectable date
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: '100%', marginTop: 1 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="standard"
                              size="small"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  <div className="flex">
                    <Controller
                      name="commissionPercentage"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          type="number"
                          value={value || ''}
                          sx={{ width: '100%' }}
                          InputProps={{
                            style: { fontSize: '0.8125rem' },
                            endAdornment: (
                              <div className="flex justify-center items-center">
                                <span className="ml-1 mr-5">%</span>
                                <button
                                  type="button"
                                  data-mdb-ripple="true"
                                  data-mdb-ripple-color="light"
                                  className={`mx-2 my-1 px-1 py-[0.125rem] bg-transparent border-1 border-blue-800 text-blue-800 font-medium text-xs leading-tight rounded shadow-md hover:scale-110 hover:bg-blue-700 hover:shadow-lg hover:text-white focus:bg-blue-700 focus:text-white focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:text-white  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out `}
                                  onClick={(e) => {
                                    assignCalculatedCommissionOnEachRow(
                                      'Percentage'
                                    );
                                  }}
                                >
                                  <div className="flex justify-center items-center gap-x-1">
                                    <span>Calculate</span>
                                    <i className="fas fa-calculator" />
                                  </div>
                                </button>
                              </div>
                            ),
                          }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: !!value,
                          }}
                          // onBlur={onBlur} // Trigger validation on blur
                          error={!!error}
                          helperText={error ? error.message : null}
                          // inputRef={ref}
                          id=""
                          label="Commission Percentage"
                          variant="standard"
                          size="small"
                          // onBlur={onBlur} // Trigger validation on blur
                          onBlur={(event) => {
                            // Update the state with the current value

                            // Call the original onBlur to trigger validation
                            setValue('commissionAmount', 0);
                            onBlur();
                          }}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex">
                    <Controller
                      name="commissionAmount"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          type="number"
                          value={value || ''}
                          sx={{ width: '100%' }}
                          InputProps={{
                            style: { fontSize: '0.8125rem' },
                            endAdornment: (
                              <div className="flex justify-center items-center">
                                <span className="ml-1 mr-5">%</span>
                                <button
                                  type="button"
                                  data-mdb-ripple="true"
                                  data-mdb-ripple-color="light"
                                  className={`mx-2 my-1 px-1 py-[0.125rem] bg-transparent border-1 border-blue-800 text-blue-800 font-medium text-xs leading-tight rounded shadow-md hover:scale-110 hover:bg-blue-700 hover:shadow-lg hover:text-white focus:bg-blue-700 focus:text-white focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:text-white  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out `}
                                  onClick={(e) => {
                                    assignCalculatedCommissionOnEachRow(
                                      'Amount'
                                    );
                                  }}
                                >
                                  <div className="flex justify-center items-center gap-x-1">
                                    <span>Calculate</span>
                                    <i className="fas fa-calculator" />
                                  </div>
                                </button>
                              </div>
                            ),
                          }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: !!value,
                          }}
                          // onBlur={onBlur} // Trigger validation on blur
                          error={!!error}
                          helperText={error ? error.message : null}
                          // inputRef={ref}
                          id=""
                          label="Commission Amount"
                          variant="standard"
                          size="small"
                          // onBlur={onBlur} // Trigger validation on blur
                          onBlur={(event) => {
                            // Update the state with the current value

                            // Call the original onBlur to trigger validation
                            setValue('commissionPercentage', 0);
                            onBlur();
                          }}
                          // onChange={(event) => {
                          //   setValue('commissionPercentage', 0);
                          //   onChange();
                          // }}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="mt-2 col-span-2">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormLabel
                        id="radio-group-label"
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: 'bold',
                          marginRight: '0.5rem',
                        }} // Label styling
                      >
                        Preview:
                      </FormLabel>
                      <Controller
                        name="previewOptions"
                        control={control}
                        render={({ field }) => (
                          <FormGroup row aria-labelledby="radio-group-label">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={field.value?.includes(
                                    'allCustomers'
                                  )}
                                  onChange={() =>
                                    field.onChange(
                                      field.value?.includes('allCustomers')
                                        ? field.value.filter(
                                            (v: any) => v !== 'allCustomers'
                                          )
                                        : [
                                            ...(field.value || []),
                                            'allCustomers',
                                          ]
                                    )
                                  }
                                />
                              }
                              label="All"
                              sx={{
                                '.MuiTypography-root': { fontSize: '0.8125rem' },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={field.value?.includes(
                                    'performingCustomers'
                                  )}
                                  onChange={() =>
                                    field.onChange(
                                      field.value?.includes(
                                        'performingCustomers'
                                      )
                                        ? field.value.filter(
                                            (v: any) =>
                                              v !== 'performingCustomers'
                                          )
                                        : [
                                            ...(field.value || []),
                                            'performingCustomers',
                                          ]
                                    )
                                  }
                                />
                              }
                              label="Performing Customers"
                              sx={{
                                '.MuiTypography-root': { fontSize: '0.8125rem' },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={field.value?.includes(
                                    'nonPerformingCustomers'
                                  )}
                                  onChange={() =>
                                    field.onChange(
                                      field.value?.includes(
                                        'nonPerformingCustomers'
                                      )
                                        ? field.value.filter(
                                            (v: any) =>
                                              v !== 'nonPerformingCustomers'
                                          )
                                        : [
                                            ...(field.value || []),
                                            'nonPerformingCustomers',
                                          ]
                                    )
                                  }
                                />
                              }
                              label="Non-Performing Customers"
                              sx={{
                                '.MuiTypography-root': { fontSize: '0.8125rem' },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={field.value?.includes('noTarget')}
                                  onChange={() =>
                                    field.onChange(
                                      field.value?.includes('noTarget')
                                        ? field.value.filter(
                                            (v: any) => v !== 'noTarget'
                                          )
                                        : [...(field.value || []), 'noTarget']
                                    )
                                  }
                                />
                              }
                              label="No Target"
                              sx={{
                                '.MuiTypography-root': { fontSize: '0.8125rem' },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={field.value?.includes(
                                    'successfulAchievement'
                                  )}
                                  onChange={() =>
                                    field.onChange(
                                      field.value?.includes(
                                        'successfulAchievement'
                                      )
                                        ? field.value.filter(
                                            (v: any) =>
                                              v !== 'successfulAchievement'
                                          )
                                        : [
                                            ...(field.value || []),
                                            'successfulAchievement',
                                          ]
                                    )
                                  }
                                />
                              }
                              label="100% Achievement Customers"
                              sx={{
                                '.MuiTypography-root': { fontSize: '0.8125rem' },
                              }}
                            />
                            <div className="flex items-center w-[25%]">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={field.value?.includes(
                                      'buyerWithSR'
                                    )}
                                    onChange={() =>
                                      field.onChange(
                                        field.value?.includes('buyerWithSR')
                                          ? field.value.filter(
                                              (v: any) => v !== 'buyerWithSR'
                                            )
                                          : [
                                              ...(field.value || []),
                                              'buyerWithSR',
                                            ]
                                      )
                                    }
                                  />
                                }
                                label="Buyer with Numbers of Sales Representative:"
                                sx={{
                                  '.MuiTypography-root': { fontSize: '0.8125rem' },
                                }}
                              />
                              <div className="w-[10%] mt-[0.625rem]">
                                <Controller
                                  name="srValue"
                                  control={control}
                                  render={({ field: srField }) => (
                                    <TextField
                                      type="number"
                                      sx={{ width: '100%' }}
                                      InputProps={{ style: { fontSize: '0.8125rem' } }}
                                      value={srField.value ?? 0}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        srField.onChange(
                                          v === ''
                                            ? 0
                                            : Math.max(0, parseInt(v, 10) || 0)
                                        );
                                      }}
                                      variant="standard"
                                      size="small"
                                      disabled={
                                        !field.value?.includes('buyerWithSR')
                                      }
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={field.value?.includes(
                                      'buyerWithGrade'
                                    )}
                                    onChange={() =>
                                      field.onChange(
                                        field.value?.includes('buyerWithGrade')
                                          ? field.value.filter(
                                              (v: any) => v !== 'buyerWithGrade'
                                            )
                                          : [
                                              ...(field.value || []),
                                              'buyerWithGrade',
                                            ]
                                      )
                                    }
                                  />
                                }
                                label="Buyer with Grade:"
                                sx={{
                                  '.MuiTypography-root': { fontSize: '0.8125rem' },
                                }}
                              />
                              <Controller
                                name="gradeValue"
                                control={control}
                                render={({
                                  field: gradeField,
                                  fieldState: { error },
                                }) => (
                                  <Autocomplete
                                    size="small"
                                    options={[
                                      {
                                        buyerGradingId: 0,
                                        buyerGradingName: 'No Grade',
                                      },
                                      ...(Array.from(
                                        new Map(
                                          (buyerGradingComboOptions || []).map(
                                            (o: any) => [o.buyerGradingName, o]
                                          )
                                        ).values()
                                      ) || []),
                                    ]}
                                    value={gradeField.value || null}
                                    onChange={(_, selected: any) => {
                                      gradeField.onChange(
                                        selected || {
                                          buyerGradingName: 'No Grade',
                                          buyerGradingId: 0,
                                        }
                                      );
                                    }}
                                    getOptionLabel={(o: any) =>
                                      o?.buyerGradingName || ''
                                    }
                                    isOptionEqualToValue={(
                                      opt: any,
                                      sel: any
                                    ) =>
                                      opt.buyerGradingId === sel?.buyerGradingId
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        error={!!error}
                                        helperText={
                                          error ? error.message : null
                                        }
                                        InputProps={{
                                          ...params.InputProps,
                                          style: { fontSize: '0.8125rem' },
                                        }}
                                        sx={{ minWidth: '10rem', marginTop: 0 }}
                                        disabled={
                                          !field.value?.includes(
                                            'buyerWithGrade'
                                          )
                                        }
                                      />
                                    )}
                                  />
                                )}
                              />
                            </div>
                          </FormGroup>
                        )}
                      />
                    </Stack>
                  </div>
                </div>

                <div className="w-full mt-4 mb-5 modifiedEditTable">
                  <MaterialReactTable table={commissionGridStateInitializer} />
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
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      commissionGridIsLoading ||
                      commissionGridIsFetching ||
                      isCommissionGridLoading ||
                      processBuyerWiseCommissionAchievementLoading ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        commissionGridIsLoading ||
                        commissionGridIsFetching ||
                        isCommissionGridLoading ||
                        processBuyerWiseCommissionAchievementLoading
                      ) {
                        toast.warning(
                          'Please wait until the data is fetched/saved!'
                        );
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      } else {
                        saveBtn();
                        // testFunct();
                      }
                    }}
                  >
                    {commissionGridIsLoading ||
                    commissionGridIsFetching ||
                    isCommissionGridLoading ||
                    processBuyerWiseCommissionAchievementLoading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {commissionGridIsLoading ||
                    commissionGridIsFetching ||
                    isCommissionGridLoading ||
                    processBuyerWiseCommissionAchievementLoading
                      ? 'Please wait..'
                      : 'Save'}
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>
    </div>
    // return wrapper div--/--
  );
};

export default CommissionManagement;
