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
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete,
  Chip,
  CircularProgress,
  IconButton,
  Popper,
  TextField,
  Tooltip,
  Typography,
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
import { Delete } from '@mui/icons-material';
import { IFormProps } from '../../../domain/interfaces/FormPropsInterface';

import { checkArrayContents } from '../../Utils/Util';
import { useGetDynamicReportFrontendElementsQuery } from '../../../infrastructure/api/DynamicApiSlice';
import {
  IBuyer,
  IBuyerSalesReport,
} from '../../../domain/interfaces/BuyerInterface';
import {
  ITenderNoComboBox2,
  IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand,
} from '../../../domain/interfaces/ProcurementTenderInterface';
import { useUpdateProcurementTenderOnlyTenderWonAndRemarksMutation } from '../../../infrastructure/api/TenderApiSlice';
import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { IDepartment } from '../../../domain/interfaces/DepartmentInterface';
import { ISalesPersonComboBox } from '../../../domain/interfaces/SalesPersonInterface';
import { IBuyerGroup } from '../../../domain/interfaces/BuyerGroupInterface';
import {
  useLazyGetBuyerByCompanyLocationIdQuery,
  useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery,
  useLazyGetBuyerSalesReportQuery,
} from '../../../infrastructure/api/BuyerApiSlice';
import { useLazyGetSalesPersonByCompanyLocationBuyerIdQuery } from '../../../infrastructure/api/EmployeeApiSlice';
import { useLazyGetDepartmentByCompanyIdQuery } from '../../../infrastructure/api/DepartmentApiSlice';

const API_BASE_URL = window.API_BASE_URL;

type Props = {};

const BuyerSalesReport = ({
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
      buyer: null,
      salesPerson: null,
      buyerGroup: null,
      department: null,
      dateFrom: dayjs().format(),
      dateTo: dayjs().format(),
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

  //   const [selectedBuyer, setSelectedBuyer] = useState();
  //   const [selectedBuyerGroup, setSelectedBuyerGroup] = useState();
  //   const [selectedDepartment, setSelectedDepartment] = useState();
  //   const [selectedSalesPerson, setSelectedSalesPerson] = useState();
  //   const [dateFrom, setDateFrom] = useState();
  //   const [dateTo, setDateTo] = useState();

  const [buyerSalesRptGridState, setBuyerSalesRptGridState] = useState<
    IBuyerSalesReport[]
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  type FormValues = {
    buyerGroup: IBuyerGroup | null;
    buyer: IBuyer | null;
    salesPerson: ISalesPersonComboBox | null;
    department: IDepartment | null;
    dateFrom: string | null;
    dateTo: string | null;
  };

  //   grid virtualization states
  const [isBuyerSalesReportGridLoading, setIsBuyerSalesReportGridLoading] =
    useState(true);
  const [sortingBuyerSalesReportGrid, setSortingBuyerSalesReportGrid] =
    useState<MRT_SortingState>([]);

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetBuyer,
    {
      data: buyerOptionsData,
      error: buyerOptionsError,
      isError: buyerOptionsIsError,
      isSuccess: buyerOptionsIsSuccess,
      isLoading: buyerOptionsIsLoading,
      isFetching: buyerOptionsIsFetching,
    },
  ] = useLazyGetBuyerByCompanyLocationIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (buyerOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerOptionsData, see console--->:'
      );
      console.log(buyerOptionsError);
    }
    if (buyerOptionsIsSuccess) {
      console.log('buyerOptionsIsSuccess');

      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { buyer } = watchedFields;
      // if (buyer?.buyerId) {
      //   const exists = buyerOptionsData?.some(
      //     (buyerRow) => buyerRow.buyerId === buyer.buyerId
      //   );
      //   if (!exists && buyer != null && buyer.buyerId !== 0) {
      //     setValue('buyer', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...

      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   buyerOptionsData &&
      //   buyerOptionsData?.length === 1 &&
      //   buyerOptionsData?.[0].buyerId !== buyer?.buyerId &&
      //   // buyer != null &&
      //   buyer?.buyerId !== 0
      // ) {
      //   setValue('buyer', buyerOptionsData[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...

      console.log(buyerOptionsData);
    }
  }, [
    buyerOptionsData,
    buyerOptionsIsLoading,
    buyerOptionsError,
    buyerOptionsIsError,
    buyerOptionsIsFetching,
    buyerOptionsIsSuccess,
  ]);

  const [
    triggerGetBuyerGroup,
    {
      data: buyerGroupOptionsData,
      error: buyerGroupOptionsError,
      isError: buyerGroupOptionsIsError,
      isSuccess: buyerGroupOptionsIsSuccess,
      isLoading: buyerGroupOptionsIsLoading,
      isFetching: buyerGroupOptionsIsFetching,
    },
  ] = useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (buyerGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerGroupOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerGroupOptionsData, see console--->:'
      );
      console.log(buyerGroupOptionsError);
    }
    if (buyerGroupOptionsIsSuccess) {
      console.log('buyerGroupOptionsIsSuccess');
      console.log(buyerGroupOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { buyerGroup } = watchedFields;
      // if (buyerGroupOptionsData && buyerGroup?.buyerGroupId) {
      //   const exists = buyerGroupOptionsData?.some(
      //     (buyerGroupRow) =>
      //       buyerGroupRow.buyerGroupId === buyerGroup.buyerGroupId
      //   );
      //   if (!exists && buyerGroup != null && buyerGroup.buyerGroupId !== 0) {
      //     setValue('buyerGroup', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   buyerGroupOptionsData &&
      //   buyerGroupOptionsData.length === 1 &&
      //   buyerGroupOptionsData?.[0].buyerGroupId !== buyerGroup?.buyerGroupId &&
      //   // buyerGroup != null &&
      //   buyerGroup?.buyerGroupId !== 0
      // ) {
      //   setValue('buyerGroup', buyerGroupOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    buyerGroupOptionsData,
    buyerGroupOptionsIsLoading,
    buyerGroupOptionsError,
    buyerGroupOptionsIsError,
    buyerGroupOptionsIsFetching,
    buyerGroupOptionsIsSuccess,
  ]);

  const [
    triggerGetSalesPerson,
    {
      data: salesPersonOptionsData,
      error: salesPersonOptionsError,
      isError: salesPersonOptionsIsError,
      isSuccess: salesPersonOptionsIsSuccess,
      isLoading: salesPersonOptionsIsLoading,
      isFetching: salesPersonOptionsIsFetching,
    },
  ] = useLazyGetSalesPersonByCompanyLocationBuyerIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (salesPersonOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching salesPersonOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesPersonOptionsData, see console--->:'
      );
      console.log(salesPersonOptionsError);
    }
    if (salesPersonOptionsIsSuccess) {
      console.log('salesPersonOptionsIsSuccess');
      console.log(salesPersonOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { salesPerson } = watchedFields;
      // if (salesPersonOptionsData && salesPerson?.employeeId) {
      //   const exists = salesPersonOptionsData?.some(
      //     (salesPersonRow) =>
      //       salesPersonRow.employeeId === salesPerson.employeeId
      //   );
      //   if (!exists && salesPerson != null && salesPerson.employeeId !== 0) {
      //     setValue('salesPerson', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   salesPersonOptionsData &&
      //   salesPersonOptionsData?.length === 1 &&
      //   salesPersonOptionsData?.[0].employeeId !== salesPerson?.employeeId &&
      //   // salesPerson != null &&
      //   salesPerson?.employeeId !== 0
      // ) {
      //   setValue('salesPerson', salesPersonOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    salesPersonOptionsData,
    salesPersonOptionsIsLoading,
    salesPersonOptionsError,
    salesPersonOptionsIsError,
    salesPersonOptionsIsFetching,
    salesPersonOptionsIsSuccess,
  ]);

  const [
    triggerGetDepartment,
    {
      data: departmentOptionsData,
      error: departmentOptionsError,
      isError: departmentOptionsIsError,
      isSuccess: departmentOptionsIsSuccess,
      isLoading: departmentOptionsIsLoading,
      isFetching: departmentOptionsIsFetching,
    },
  ] = useLazyGetDepartmentByCompanyIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (departmentOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching departmentOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching departmentOptionsData, see console--->:'
      );
      console.log(departmentOptionsError);
    }
    if (departmentOptionsIsSuccess) {
      console.log('departmentOptionsIsSuccess');
      console.log(departmentOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { department } = watchedFields;
      // if (departmentOptionsData && department?.departmentId) {
      //   const exists = departmentOptionsData?.some(
      //     (departmentRow) =>
      //       departmentRow.departmentId === department.departmentId
      //   );
      //   if (!exists && department.departmentId !== 0) {
      //     setValue('department', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   departmentOptionsData &&
      //   departmentOptionsData.length === 1 &&
      //   departmentOptionsData?.[0].departmentId !== department?.departmentId &&
      //   // department != null &&
      //   department?.departmentId !== 0
      // ) {
      //   setValue('department', departmentOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    departmentOptionsData,
    departmentOptionsIsLoading,
    departmentOptionsError,
    departmentOptionsIsError,
    departmentOptionsIsFetching,
    departmentOptionsIsSuccess,
  ]);

  const [
    triggerGetBuyerSalesReport,
    {
      data: buyerSalesReportData,
      error: buyerSalesReportError,
      isError: buyerSalesReportIsError,
      isSuccess: buyerSalesReportIsSuccess,
      isLoading: buyerSalesReportIsLoading,
      isFetching: buyerSalesReportIsFetching,
    },
  ] = useLazyGetBuyerSalesReportQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (buyerSalesReportIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerSalesReportData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerSalesReportData, see console--->:'
      );
      console.log(buyerSalesReportError);
      setBuyerSalesRptGridState([]);
      setIsBuyerSalesReportGridLoading(false);
    } else if (
      buyerSalesReportIsSuccess &&
      typeof window !== 'undefined' &&
      !buyerSalesReportIsLoading &&
      !buyerSalesReportIsFetching &&
      !buyerSalesReportIsError &&
      buyerSalesReportData
    ) {
      console.log('buyerSalesReportIsSuccess');
      console.log(buyerSalesReportData);
      setBuyerSalesRptGridState(buyerSalesReportData || []);

      setIsBuyerSalesReportGridLoading(false);
    } else {
      setIsBuyerSalesReportGridLoading(true);
    }
  }, [
    buyerSalesReportData,
    buyerSalesReportIsLoading,
    buyerSalesReportError,
    buyerSalesReportIsError,
    buyerSalesReportIsFetching,
    buyerSalesReportIsSuccess,
  ]);

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  // Trigger GetBuyerGroup RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, department, dateFrom, dateTo } =
      watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyerGroup({
      companyId: userInfo?.companyId,
      buyerId: buyer?.buyerId || null,
      salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyer,
    watchedFields.salesPerson,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyerGroup,
  ]);

  // Trigger GetBuyer RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, department, dateFrom, dateTo } =
      watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyer({
      companyId: userInfo?.companyId,
      buyerGroupId: buyerGroup?.buyerGroupId || null,
      salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyerGroup,
    watchedFields.salesPerson,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

  // Trigger GetSalesPerson RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, department, dateFrom, dateTo } =
      watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetSalesPerson({
      companyId: userInfo?.companyId,
      buyerGroupId: buyerGroup?.buyerGroupId || null,
      buyerId: buyer?.buyerId || null,
      departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyerGroup,
    watchedFields.buyer,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

  // Trigger GetDepartment RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, department, dateFrom, dateTo } =
      watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetDepartment({
      companyId: userInfo?.companyId,
      buyerGroupId: buyerGroup?.buyerGroupId || null,
      buyerId: buyer?.buyerId || null,
      salesPersonId: salesPerson?.employeeId || null,
    });
  }, [
    watchedFields.buyerGroup,
    watchedFields.buyer,
    watchedFields.salesPerson,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, department, dateFrom, dateTo } =
      watchedFields;

    if (!dateFrom) {
      toast.error('Date From cannot be empty');
    }
    if (!dateTo) {
      toast.error('Date To cannot be empty');
    }
    if (dateFrom && dateTo && dayjs(dateFrom) > dayjs(dateTo)) {
      toast.error('Date From cannot be greater than Date To');
    }

    // Trigger your RTK Query
    if (dateFrom && dateTo && dayjs(dateFrom) <= dayjs(dateTo)) {
      triggerGetBuyerSalesReport({
        dateFrom: dayjs(dateFrom).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        dateTo: dayjs(dateTo).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        buyerGroupId: buyerGroup?.buyerGroupId || null,
        buyerId: buyer?.buyerId || null,
        salesPersonId: salesPerson?.employeeId || null,
        departmentId: department?.departmentId || null,
      });
    } else {
      setBuyerSalesRptGridState([]);
    }
  }, [
    watchedFields.dateFrom,
    watchedFields.dateTo,
    watchedFields.buyerGroup,
    watchedFields.buyer,
    watchedFields.salesPerson,
    watchedFields.department,
    triggerGetBuyerSalesReport,
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

  // ------------------------------------excel csv-----------------END------------------

  const buyerSalesRptGridColumns = useMemo<MRT_ColumnDef<IBuyerSalesReport>[]>(
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
        header: 'Buyer',
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
        accessorFn: (row) => row.buyerGroupName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.buyerGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'buyerGroupName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Buyer Group',
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
        accessorFn: (row) => row.departmentName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.departmentName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'departmentName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Department',
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
        accessorFn: (row) => row.monthlySales ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.monthlySales, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'monthlySales',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Monthly Sales',
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
        accessorFn: (row) => row.grossProfit ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.grossProfit, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'grossProfit',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Gross Profit',
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
        accessorFn: (row) => row.grossProfitP ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.grossProfitP, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'grossProfitP',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Gross Percentage',
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
        accessorFn: (row) => row.averageCollection ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.averageCollection, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'averageCollection',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Average Collection',
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
        accessorFn: (row) => row.chqDishonor ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.chqDishonor, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'chqDishonor',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Cheque Dishonor Numbers',
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
        accessorFn: (row) => row.currentDue ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.currentDue, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'currentDue',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Current Due',
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
        accessorFn: (row) => row.creditAging ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.creditAging, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'creditAging',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Credit Aging',
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
  }, [sortingBuyerSalesReportGrid]);

  // ---------- material table virtualization---------

  const buyerSalesRptGridStateInitializer: MRT_TableInstance<IBuyerSalesReport> =
    useMaterialReactTable({
      columns: buyerSalesRptGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: buyerSalesRptGridState || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading: isBuyerSalesReportGridLoading,
        sorting: sortingBuyerSalesReportGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '1.875rem',
      },
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
                handleExportData(
                  buyerSalesRptGridState,
                  buyerSalesRptGridColumns
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
      onSortingChange: setSortingBuyerSalesReportGrid,
      rowVirtualizerInstanceRef, // optional
      rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
    });

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
                  : 'Buyer Sales Report'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1  mt-5">
                <div className=" grid grid-cols-2 gap-x-4">
                  <Controller
                    name="dateFrom"
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
                          label="Date From"
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
                    name="dateTo"
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
                          label="Date To"
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
                </div>

                <Controller
                  name="buyerGroup"
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
                        { buyerGroupId: 0, buyerGroupName: 'All' },
                        ...(Array.from(
                          new Map(
                            buyerGroupOptionsData?.map((buyerGroupOption) => [
                              buyerGroupOption.buyerGroupName,
                              buyerGroupOption,
                            ])
                          ).values()
                        ) || []),
                      ]}
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.buyerGroupName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.buyerGroupName ===
                          selectedValue?.buyerGroupName &&
                        option.buyerGroupId === selectedValue?.buyerGroupId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buyer Group"
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
                  name="buyer"
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
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                      options={[
                        { buyerId: 0, buyerName: 'All' },
                        ...(Array.from(
                          new Map(
                            buyerOptionsData?.map((buyerOption) => [
                              buyerOption.buyerName,
                              buyerOption,
                            ])
                          ).values()
                        ) || []),
                      ]} // Make sure tenderComboOptions is defined
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.buyerName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.buyerName === selectedValue?.buyerName &&
                        option.buyerId === selectedValue?.buyerId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buyer"
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
                  name="salesPerson"
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
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                      options={[
                        { employeeId: 0, employeeName: 'All' },
                        ...(Array.from(
                          new Map(
                            salesPersonOptionsData?.map((salesPerson) => [
                              salesPerson.employeeName,
                              salesPerson,
                            ])
                          ).values()
                        ) || []),
                      ]} // Make sure it is unique
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.employeeName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.employeeName === selectedValue?.employeeName &&
                        option.employeeId === selectedValue?.employeeId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Person"
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
                  name="department"
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
                      // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                      options={[
                        { departmentId: 0, departmentName: 'All' },
                        ...(Array.from(
                          new Map(
                            departmentOptionsData?.map((departmentOption) => [
                              departmentOption.departmentName,
                              departmentOption,
                            ])
                          ).values()
                        ) ||
                          [] ||
                          []),
                      ]} // Make sure tenderComboOptions is defined
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        onChange(selectedItem);
                      }}
                      onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.departmentName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.departmentName ===
                          selectedValue?.departmentName &&
                        option.departmentId === selectedValue?.departmentId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Department"
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

                <div className="w-full mt-4 mb-5 modifiedEditTable">
                  <MaterialReactTable
                    table={buyerSalesRptGridStateInitializer}
                  />
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  {/* <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      updateProcurementTenderIsLoading ||
                      selectedTender?.tenderWon ||
                      !selectedTender?.tenderNo ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        selectedTender?.tenderWon === null &&
                        selectedTender?.tenderNo &&
                        operationMode !== 'preview'
                      ) {
                        tenderWonBtn();
                      } else if (
                        selectedTender?.tenderWon &&
                        selectedTender?.tenderNo
                      ) {
                        toast.warning('This Tender is already Won');
                      } else if (updateProcurementTenderIsLoading) {
                        toast.warning('Please wait until the data is saved!');
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      }
                    }}
                  >
                    Won
                  </button>
                   */}
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

export default BuyerSalesReport;
