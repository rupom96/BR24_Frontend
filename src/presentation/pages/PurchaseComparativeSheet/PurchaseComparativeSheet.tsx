/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/ban-types */
// import { useForm } from 'react-hook-form';
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
  CircularProgress,
  IconButton,
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
import {
  IProcurementRequisitionCommandsVM,
  IPurchaseComparativeSheetGrid,
  IRequisitionWiseViewGrid,
  ISupplierPurchaseGrid,
} from '../../../domain/interfaces/PurchaseComparativeSheet';
import { ISupplier } from '../../../domain/interfaces/SupplierInterface';
import {
  useGetProcurementRequisitionComparativeInfoByRequisitionNoQuery,
  useGetRequisitionNoByCompanyLocationIdQuery,
  useProcessProcurementRequisitionMutation,
} from '../../../infrastructure/api/ProcurementRequisitionApiSlice';
import { IProcurementRequisition } from '../../../domain/interfaces/ProcurementRequisitionInterface';
import { useGetSupplierByCompanyLocationIdQuery } from '../../../infrastructure/api/SupplierApiSlice';
import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { IUserInfo } from '../../../domain/interfaces/UserInfoInterface';
import { useLazySendEmailToNextEventUserQuery } from '../../../infrastructure/api/EmailApiSlice';

const API_BASE_URL = window.API_BASE_URL;

type Props = {};

const PurchaseComparativeSheet = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  console.log(
    'See clickedCardInfo PurchaseComparativeSheet---------------------------->'
  );
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
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   bank: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });

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

  const [
    purchaseComparativeSheetGridState,
    setPurchaseComparativeSheetGridState,
  ] = useState<IPurchaseComparativeSheetGrid[]>([]);

  const [supplierPurchaseGridState, setSupplierPurchaseGridState] = useState<
    ISupplierPurchaseGrid[]
  >([]);
  const [
    supplierPurchaseGridRowSelection,
    setSupplierPurchaseGridRowSelection,
  ] = useState<MRT_RowSelectionState>({});

  const [requisitionWiseViewGridState, setRequisitionWiseViewGridState] =
    useState<IRequisitionWiseViewGrid[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);
  const [columnVisibility2, setColumnVisibility2] = useState<any>([]);
  const [columnVisibility3, setColumnVisibility3] = useState<any>([]);

  // const [selectedSupplier, setSelectedSupplier] = useState<ISupplier>();
  const [supplierNameOptions, setSupplierNameOptions] = useState<ISupplier[]>();
  const [selectedRequisiton, setSelectedRequisiton] =
    useState<IProcurementRequisition>();
  const [
    selectedRequisitonComparativeInfo,
    setSelectedRequisitonComparativeInfo,
  ] = useState<IPurchaseComparativeSheetGrid[]>();

  const [purchasePriceEditModal, setPurchasePriceEditModal] =
    useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [productWiseViewModal, setProductWiseViewModal] =
    useState<boolean>(false);
  const [requisitionWiseViewModal, setRequisitionWiseViewModal] =
    useState<boolean>(false);

  const [emailInfoState, setEmailInfoState] = useState<any>();

  const handlePurchasePriceEditModalClose = () => {
    setPurchasePriceEditModal(false);
    setSupplierPurchaseGridState([]);
    setSupplierPurchaseGridRowSelection({});
  };

  const handleProductWiseViewModalClose = () => setProductWiseViewModal(false);
  const handleRequisitionWiseViewGridClose = () => {
    setRequisitionWiseViewGridState([]);
    setRequisitionWiseViewModal(false);
  };

  useEffect(() => {
    // 1st grid
    const copyComparativeState = JSON.parse(
      JSON.stringify(purchaseComparativeSheetGridState)
    );
    const mergedArray = [];
    for (let index = 0; index < 10; index++) {
      const emptyObj: any = {
        requisitionNo: '',
        productId: null,
        productName: '',
        customerId: null,
        customerName: '',
        approxSalesPrice: null,
        quantity: null,
        salesForecastDays: null,
        purchasePrice: null,
        supplierId: null,
        supplierName: '',
        suppliers: [],
        mergedRequisitionNumbers: [],
      };
      mergedArray.push(emptyObj);
    }
    setPurchaseComparativeSheetGridState(mergedArray);
  }, []);

  // --------------------------- API HOOKS STARTS -------------------------

  // ------------emailRtkQuery---------------------

  const [
    triggerSendEmailToNextEventUser,
    {
      data: sendEmailToNextEventUserData,
      error: sendEmailToNextEventUserError,
      isError: sendEmailToNextEventUserIsError,
      isSuccess: sendEmailToNextEventUserIsSuccess,
      isLoading: sendEmailToNextEventUserIsLoading,
      isFetching: sendEmailToNextEventUserIsFetching,
    },
  ] = useLazySendEmailToNextEventUserQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (sendEmailToNextEventUserIsError) {
      toast.error(
        'Something wrong from backend while fetching sendEmailToNextEventUserData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching sendEmailToNextEventUserData, see console--->:'
      );
      console.log(sendEmailToNextEventUserError);
    }
    if (sendEmailToNextEventUserIsSuccess) {
      console.log('sendEmailToNextEventUserIsSuccess');

      console.log(sendEmailToNextEventUserData);
    }
  }, [
    sendEmailToNextEventUserData,
    sendEmailToNextEventUserIsLoading,
    sendEmailToNextEventUserError,
    sendEmailToNextEventUserIsError,
    sendEmailToNextEventUserIsFetching,
    sendEmailToNextEventUserIsSuccess,
  ]);

  const {
    data: supplierOptions,
    isLoading: supplierOptionsLoading,
    error: supplierOptionsError,
    isSuccess: supplierOptionsIsSuccess,
    isError: supplierOptionsIsError,
    isFetching: supplierOptionsIsFetching,
    refetch: supplierOptionsRefetch,
  } = useGetSupplierByCompanyLocationIdQuery({
    companyId: userInfo?.companyId,
    locationId: userInfo?.locationId,
  });

  useEffect(() => {
    if (supplierOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching supplierOptions for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching supplierOptions for autocomplete, see console--->:'
      );
      console.log(supplierOptionsError);
      setSupplierNameOptions([]);
    }
    if (supplierOptionsIsSuccess) {
      console.log('supplierOptionsIsSuccess');
      console.log(supplierOptions);
      setSupplierNameOptions(supplierOptions);
    }
  }, [
    supplierOptionsLoading,
    supplierOptionsIsError,
    supplierOptionsError,
    supplierOptionsIsFetching,
  ]);

  const {
    data: requisitionComparativeInfo,
    isLoading: requisitionComparativeInfoLoading,
    error: requisitionComparativeInfoError,
    isSuccess: requisitionComparativeInfoIsSuccess,
    isError: requisitionComparativeInfoIsError,
    isFetching: requisitionComparativeInfoIsFetching,
    refetch: requisitionComparativeInfoRefetch,
  } = useGetProcurementRequisitionComparativeInfoByRequisitionNoQuery(
    {
      requisitionNo: selectedRequisiton?.requisitionNo || '',
    },
    { skip: !selectedRequisiton?.procurementRequisitionId }
  );

  useEffect(() => {
    if (requisitionComparativeInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching requisitionComparativeInfoOptions , see console!'
      );
      console.log(
        'Something wrong from backend while fetching requisitionComparativeInfoOptions, see console--->:'
      );
      console.log(requisitionComparativeInfoIsError);
      setSelectedRequisitonComparativeInfo([]);
    }
    if (requisitionComparativeInfoIsSuccess) {
      console.log('requisitionComparativeInfo');
      console.log(requisitionComparativeInfo);
      setSelectedRequisitonComparativeInfo(requisitionComparativeInfo);
    }
  }, [
    requisitionComparativeInfoLoading,
    requisitionComparativeInfoIsFetching,
    requisitionComparativeInfoError,
    requisitionComparativeInfo,
    requisitionComparativeInfoIsSuccess,
    requisitionComparativeInfoIsError,
    selectedRequisiton,
  ]);

  // requisitionNo options
  const {
    data: requisitionNoOptions,
    isLoading: requisitionNoOptionsLoading,
    error: requisitionNoOptionsError,
    isSuccess: requisitionNoOptionsIsSuccess,
    isError: requisitionNoOptionsIsError,
    isFetching: requisitionNoOptionsIsFetching,
    refetch: requisitionNoOptionsRefetch,
  } = useGetRequisitionNoByCompanyLocationIdQuery({
    companyId: userInfo?.companyId,
    locationId: userInfo?.locationId,
  });

  useEffect(() => {
    if (requisitionNoOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching requisitionNoOptions for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching requisitionNoOptions for autocomplete, see console--->:'
      );
      console.log(requisitionNoOptionsError);
      setSelectedRequisitonComparativeInfo([]);
    }
    if (requisitionNoOptionsIsSuccess) {
      console.log('requisitionNoOptionsIsSuccess');
      console.log(requisitionNoOptions);
      console.log('clickedCardInfo?.eventNo');
      console.log(clickedCardInfo?.eventNo);

      if (clickedCardInfo?.biznessEventProcessConfigurationId) {
        const selectedOption = requisitionNoOptions.find(
          (item) => item.requisitionNo === clickedCardInfo?.eventNo
        );
        console.log('selectedOption--------->');
        console.log(selectedOption);
        setSelectedRequisiton(selectedOption);
        setValue('requisitionNo', selectedOption);
        // requisitionComparativeInfoRefetch();
      }
    }
  }, [
    requisitionNoOptionsLoading,
    requisitionNoOptionsIsError,
    requisitionNoOptionsError,
  ]);

  const [
    processSaveRequisition,
    {
      isLoading: processSaveRequisitionIsLoading,
      isError: processSaveRequisitionIsError,
      error: processSaveRequisitionError,
      isSuccess: processSaveRequisitionIsSuccess,
      data: processSaveRequisitionData,
    },
  ] = useProcessProcurementRequisitionMutation();

  useEffect(() => {
    if (processSaveRequisitionIsSuccess) {
      if (emailInfoState?.progressPReported === 100) {
        triggerSendEmailToNextEventUser({
          companyId: emailInfoState?.companyId || 0,
          fixedTaskTemplateId: emailInfoState?.fixedTaskTemplateId || 0,
          firstEventNo: emailInfoState?.firstEventNo || '',
        });
      }

      console.log('processSaveRequisitionData----------------->>>>>');
      console.log(processSaveRequisitionData);
      requisitionNoOptionsRefetch();
      Swal.fire({
        title: `RequisitionNo: ${processSaveRequisitionData?.requisitionNo} has been saved successfully!`,
        text: '',
        showDenyButton: false,
        allowOutsideClick: false,
        // target: 'body',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK!',
        // denyButtonText: `No, I will set it manually!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */

        if (result.isConfirmed) {
          if (
            clickedCardInfo?.biznessEventProcessConfigurationId &&
            modalPageOpenerClose
          ) {
            modalPageOpenerClose();
          }
        }
      });
    }
    if (processSaveRequisitionIsError || processSaveRequisitionIsError) {
      toast.error(
        'Something got error while saving the Requisition, see console-->'
      );
      console.log(
        'Something got error while saving the Requisition, see console-->'
      );
      // toast.success(
      //   `RequisitionNo: ${processSaveRequisitionError} has been saved successfully!`
      // );
      console.log(processSaveRequisitionError);
    }
  }, [
    processSaveRequisitionIsLoading,
    processSaveRequisitionIsError,
    processSaveRequisitionIsSuccess,
    processSaveRequisitionData,
  ]);
  // --------------ENDS------------- API HOOKS STARTS -------------------------

  //   const [
  //     processUpdateTender,
  //     {
  //       isLoading: updateProcurementTenderIsLoading,
  //       isError: updateProcurementTenderIsError,
  //       error: updateProcurementTenderError,
  //       isSuccess: updateProcurementTenderIsSuccess,
  //       data: updateProcurementTenderData,
  //     },
  //   ] = useUpdateProcurementTenderOnlyTenderWonAndRemarksMutation();

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

    // Filtering out empty objects
    gridData = gridData.filter((obj: any) => !isEmptyObject(obj));
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

  const purchaseComparativeSheetGridColumns = useMemo<
    MRT_ColumnDef<IPurchaseComparativeSheetGrid>[]
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
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                row.original.customerName || row.original.productName
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

                  purchaseComparativeSheetGridState?.splice(row.index, 1);
                  if (purchaseComparativeSheetGridState) {
                    setPurchaseComparativeSheetGridState([
                      ...purchaseComparativeSheetGridState,
                    ]);
                  } else {
                    setPurchaseComparativeSheetGridState([]);
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
        accessorFn: (row) => row.customerName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.customerName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'customerName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Customer Name',
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
        accessorFn: (row) => row.productName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.productName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'productName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Product Name',
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
        accessorFn: (row) => row.quantity ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.quantity, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'quantity',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Quantity',
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
        accessorFn: (row) => row.approxSalesPrice ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.approxSalesPrice, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'approxSalesPrice',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Approx Sales Price',
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
      {
        accessorFn: (row) => row.salesForecastDays ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.salesForcastDays, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'salesForcastDays',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Sales Forcast Days',
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
        accessorFn: (row) => row.supplierName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.supplierName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'supplierName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Supplier Name',
        Cell: ({ renderedCellValue, row }) => {
          //   const tempSupplierName =
          //     purchaseComparativeSheetGridState[row.index]?.suppliers[0]
          //       ?.supplierName;
          //   const tempSupplierId =
          //     purchaseComparativeSheetGridState[row.index]?.suppliers[0]
          //       ?.supplierId;
          //   const tempPurchasePrice =
          //     purchaseComparativeSheetGridState[row.index]?.suppliers[0]
          //       ?.purchasePrice;
          const tempSupplierName =
            purchaseComparativeSheetGridState[row.index]?.supplierName;
          const tempSupplierId =
            purchaseComparativeSheetGridState[row.index]?.supplierId;
          // const tempPurchasePrice =
          //   purchaseComparativeSheetGridState[row.index]?.purchasePrice;
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              value={tempSupplierName || ''}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = tempSupplierName || '';
                }
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.purchasePrice ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.purchasePrice, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'purchasePrice',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Purchase Price',
        Cell: ({ renderedCellValue, row }) => {
          const tempPurchasePrice =
            purchaseComparativeSheetGridState[row.index]?.purchasePrice;

          return (
            <div
              className={
                row.original.customerId || row.original.productId
                  ? 'visible flex justify-center'
                  : 'invisible flex justify-center'
              }
            >
              <div className="mt-2">
                <TextField
                  type="text"
                  sx={{ width: '100%' }}
                  value={tempPurchasePrice || ''}
                  InputProps={{
                    style: { fontSize: '0.8125rem' },
                    disableUnderline: true,
                    readOnly: true,
                  }}
                  variant="standard"
                  size="small"
                  inputRef={(node) => {
                    if (node) {
                      node.value = tempPurchasePrice || '';
                    }
                  }}
                />
              </div>

              <div className="w-full flex justify-center">
                <Tooltip arrow placement="right" title="Edit Price">
                  <IconButton
                    color="error"
                    onClick={() => {
                      const purchaseComparativeSuppliersCopy = JSON.parse(
                        JSON.stringify(
                          purchaseComparativeSheetGridState[row.index]
                            ?.suppliers
                        )
                      );

                      // 10ta dummy row dekhanor kaaj starts
                      const tempSupplierEmptyArr = [];
                      const emptyObjAmount =
                        purchaseComparativeSuppliersCopy.length;
                      if (emptyObjAmount < 10) {
                        for (
                          let index = 0;
                          index < 10 - emptyObjAmount;
                          index++
                        ) {
                          const tempSupplierEmptyObj: ISupplierPurchaseGrid = {
                            supplierId: null,
                            supplierName: '',
                            purchasePrice: null,
                            remarks: '',
                          };
                          tempSupplierEmptyArr.push(tempSupplierEmptyObj);
                        }
                      }
                      // 10ta dummy row dekhanor kaaj ends

                      const tempSupplierGridWithEmptyObj = [
                        ...purchaseComparativeSuppliersCopy,
                        ...tempSupplierEmptyArr,
                      ];
                      setSupplierPurchaseGridState(
                        tempSupplierGridWithEmptyObj
                      );

                      const getIndexOfWhichRowToShowSelected =
                        tempSupplierGridWithEmptyObj.findIndex(
                          (supplierGridRow) =>
                            supplierGridRow.supplierId ===
                              row.original.supplierId &&
                            supplierGridRow.supplierName ===
                              row.original.supplierName &&
                            supplierGridRow.purchasePrice ===
                              row.original.purchasePrice
                        );

                      console.log(
                        purchaseComparativeSheetGridState[row.index]?.suppliers
                      );
                      setCurrentIndex(row.index);
                      if (getIndexOfWhichRowToShowSelected > -1) {
                        setSupplierPurchaseGridRowSelection({
                          [`${getIndexOfWhichRowToShowSelected}`]: true,
                        });
                      }
                      setPurchasePriceEditModal(true);
                    }}
                  >
                    <i className="fas text-sm fa-edit" />
                  </IconButton>
                </Tooltip>
              </div>
              {/* <div>
                <Tooltip
                  className={
                    row.original.customerName || row.original.productName
                      ? 'visible'
                      : 'invisible'
                  }
                  arrow
                  placement="right"
                  title="Edit Price"
                >
                  <i className="fas fa-edit" />
                </Tooltip>
              </div> */}
            </div>
          );
        },
      },
      {
        id: 'Actions', // access nested data with dot notation
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
          <div
            className={
              row.original.customerId || row.original.productId
                ? 'visible w-full flex justify-center'
                : 'invisible w-full flex justify-center'
            }
          >
            {/* <Tooltip
              className={
                row.original.customerName || row.original.productName
                  ? 'visible'
                  : 'invisible'
              }
              arrow
              placement="right"
              title="Preview"
            >
              <i className="fas fa-eye" />
            </Tooltip> */}

            <Tooltip arrow placement="right" title="Preview">
              <IconButton
                color="error"
                onClick={() => {
                  //   setProductWiseViewModal(true);
                  previewRequisitionWiseFunct(row.original);
                }}
              >
                <i className="fas text-sm fa-eye" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [PopperMy]
  );

  const supplierPurchaseGridColumns = useMemo<
    MRT_ColumnDef<ISupplierPurchaseGrid>[]
  >(
    () => [
      {
        id: 'select', // access nested data with dot notation
        header: 'Select',
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
                row.original.supplierId || row.original.purchasePrice
                  ? 'visible'
                  : 'invisible'
              }
              arrow
              placement="right"
              title="Select This Row"
            >
              <IconButton
                color="info"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (row.original.supplierId) {
                    setSupplierPurchaseGridRowSelection((prev) => ({
                      [row.id]: !prev[row.id], // this is a simple toggle implementation
                    }));
                  }
                }}
              >
                <EditNote />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
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
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                row.original.supplierId || row.original.purchasePrice
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

                  // const supplierPurchaseGridStateCopy = JSON.parse(
                  //   JSON.stringify(supplierPurchaseGridState)
                  // );
                  // const indexNoSupplierPurchaseGridObjKey = Object.keys(
                  //   supplierPurchaseGridStateCopy
                  // )[0]; // Extract the first (and only) key
                  // const indexNoSupplierPurchaseGrid = parseInt(
                  //   indexNoSupplierPurchaseGridObjKey,
                  //   10
                  // );
                  // const selectedSupplierPurchaseGridObj =
                  //   supplierPurchaseGridStateCopy[indexNoSupplierPurchaseGrid];

                  supplierPurchaseGridState?.splice(row.index, 1);
                  if (supplierPurchaseGridState) {
                    setSupplierPurchaseGridState([
                      ...supplierPurchaseGridState,
                    ]);
                    // --- jodi jeita selected oita delete kore tahole, selection object e faka, else jeita aage selected chilo, oi object er index(delete er por jehetu index no change hobe) khuija oita select koira dibo---
                    // if (
                    //   row.index === indexNoSupplierPurchaseGrid &&
                    //   supplierPurchaseGridRowSelection[
                    //     indexNoSupplierPurchaseGrid
                    //   ]
                    // ) {
                    //   setSupplierPurchaseGridRowSelection({});
                    // } else if (
                    //   row.index !== indexNoSupplierPurchaseGrid &&
                    //   supplierPurchaseGridRowSelection[
                    //     indexNoSupplierPurchaseGrid
                    //   ]
                    // ) {
                    //   const index = supplierPurchaseGridState.findIndex(
                    //     (supplierGridRow) =>
                    //       supplierGridRow.supplierId ===
                    //         selectedSupplierPurchaseGridObj.supplierId &&
                    //       supplierGridRow.supplierName ===
                    //         selectedSupplierPurchaseGridObj.supplierName &&
                    //       supplierGridRow.purchasePrice ===
                    //         selectedSupplierPurchaseGridObj.purchasePrice
                    //   );
                    //   setSupplierPurchaseGridRowSelection({
                    //     [`${index}`]: true,
                    //   });
                    // }
                    // --ENDDDD----- jodi jeita selected oita delete kore tahole, selection object e faka, else jeita aage selected chilo, oi object er index(delete er por jehetu index no change hobe) khuija oita select koira dibo---
                    setSupplierPurchaseGridRowSelection({});
                  } else {
                    setSupplierPurchaseGridState([]);
                    setSupplierPurchaseGridRowSelection({});
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
        accessorFn: (row) => row.supplierName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility2?.supplierName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'supplierName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Supplier Name',
        Cell: ({ renderedCellValue, row }) => {
          const currentSupplier = {
            supplierId: row.original.supplierId || null,
            supplierName: row.original.supplierName || '',
          };
          return (
            <Autocomplete
              id=""
              sx={{ width: '100%' }}
              PopperComponent={PopperMy}
              clearOnEscape
              disableClearable
              freeSolo
              size="small"
              options={supplierNameOptions ?? []}
              value={currentSupplier}
              onChange={(e, selectedOption) => {
                if (selectedOption) {
                  const selectedOpt = selectedOption as ISupplier;
                  supplierPurchaseGridState[row.index].supplierId =
                    selectedOpt.supplierId || null;
                  supplierPurchaseGridState[row.index].supplierName =
                    selectedOpt.supplierName || '';
                  if (row.index === supplierPurchaseGridState.length - 1) {
                    const tempEmptyObj: ISupplierPurchaseGrid = {
                      supplierId: null,
                      supplierName: '',
                      purchasePrice: null,
                      remarks: '',
                    };
                    supplierPurchaseGridState.push(tempEmptyObj);
                  }
                  setSupplierPurchaseGridState([...supplierPurchaseGridState]);
                  // setSelectedSupplier(selectedOpt);
                }
              }}
              getOptionLabel={(option: any) =>
                option.supplierName ? option.supplierName : ''
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
                    style: { fontSize: '0.8125rem' },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  size="small"
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.purchasePrice ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility2?.purchasePrice, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'purchasePrice',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Purchase Price',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="flex justify-center">
              <TextField
                type="number"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  //   readOnly: true,
                }}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
                onBlur={(e) => {
                  // row.original.name = e.target.value;

                  supplierPurchaseGridState[row.index].purchasePrice =
                    parseFloat(e.target.value) || 0;
                  setSupplierPurchaseGridState([...supplierPurchaseGridState]);
                }}
              />
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.remarks ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility2?.remarks, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'remarks',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Remarks',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="flex justify-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  //   readOnly: true,
                }}
                variant="standard"
                size="small"
                inputRef={(node) => {
                  if (node) {
                    node.value = renderedCellValue;
                  }
                }}
                onBlur={(e) => {
                  // row.original.name = e.target.value;

                  supplierPurchaseGridState[row.index].remarks =
                    e.target.value || null;
                  setSupplierPurchaseGridState([...supplierPurchaseGridState]);
                }}
              />
            </div>
          );
        },
      },
    ],
    [PopperMy]
  );

  const requisitionWiseViewGridColumns = useMemo<
    MRT_ColumnDef<IRequisitionWiseViewGrid>[]
  >(
    () => [
      {
        accessorFn: (row) => row.requisitionNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility3?.requisitionNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'requisitionNo',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Requisition No',
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
        accessorFn: (row) => row.quantity ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility2?.quantity, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'quantity',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Quantity',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="flex py-2 justify-center">
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
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.price ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility2?.price, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'price',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Price',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="flex justify-center">
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
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.salesForcastDays ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility2?.salesForceDays, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'salesForceDays',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Sales Force Days',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="flex justify-center">
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
            </div>
          );
        },
      },
    ],
    [PopperMy]
  );

  const tablePurchaseComparativeInitializer: MRT_TableInstance<IPurchaseComparativeSheetGrid> =
    useMaterialReactTable({
      columns: purchaseComparativeSheetGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: purchaseComparativeSheetGridState || [],
      state: {
        // isLoading:
        //   requisitionComparativeInfoLoading ||
        //   requisitionComparativeInfoIsFetching,
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
                handleExportData(
                  purchaseComparativeSheetGridState,
                  purchaseComparativeSheetGridColumns
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
          <p className=" mt-1 font-bold text-[0.8125rem]">Purchase Summary Grid</p>
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

  const tableSupplierPurchaseInitializer: MRT_TableInstance<ISupplierPurchaseGrid> =
    useMaterialReactTable({
      columns: supplierPurchaseGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: supplierPurchaseGridState || [],
      state: {
        // isLoading:
        //   procurementTenderDetailLoading || procurementTenderDetailIsFetching,
        columnVisibility,
        rowSelection: supplierPurchaseGridRowSelection,
      },
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '2.5rem',
      },
      positionToolbarAlertBanner: 'none',
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      // enableRowSelection: true,
      // enableMultiRowSelection: false, // use radio buttons instead of checkboxes
      onRowSelectionChange: setSupplierPurchaseGridRowSelection,
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
          color: '#ea1143',
        },
      },
      muiTableBodyRowProps: ({ row }) => ({
        selected: supplierPurchaseGridRowSelection[row.id],
      }),
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
                handleExportData(
                  supplierPurchaseGridState,
                  supplierPurchaseGridColumns
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
            Purchase Price Edit Grid
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

  const tableRequisitionWiseViewGridInitializer: MRT_TableInstance<IRequisitionWiseViewGrid> =
    useMaterialReactTable({
      columns: requisitionWiseViewGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: requisitionWiseViewGridState || [],
      state: {
        // isLoading:
        //   procurementTenderDetailLoading || procurementTenderDetailIsFetching,
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
                handleExportData(
                  requisitionWiseViewGridState,
                  requisitionWiseViewGridColumns
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
            Requisition Wise View Grid
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

  // --------------- functions ---------------------------
  const addRequisitionInGridBtn = () => {
    console.log('addRequisitionInGridBtn clicked');
    console.log(operationMode);
    let copyComparativeState = JSON.parse(
      JSON.stringify(purchaseComparativeSheetGridState)
    );

    // jodi full array emptyObject diye vora hoy, the array khali kortesi
    const areAllObjectsEmpty = copyComparativeState.every(isEmptyObject);
    if (areAllObjectsEmpty) {
      copyComparativeState = [];
    }

    let copyComparativeInfo: any = [];
    if (
      selectedRequisitonComparativeInfo &&
      selectedRequisitonComparativeInfo.length
    ) {
      copyComparativeInfo = JSON.parse(
        JSON.stringify(selectedRequisitonComparativeInfo)
      );
    } else {
      toast.error('No rows to add in this requisition No!');
      // copyComparativeInfo = [];
      return false;
    }

    // jodi customerId or productId na thaake tahole oi requisition add korte dibona with warning
    const hasMissingCustomerIdOrProductId = copyComparativeInfo.some(
      (obj: any) => !obj.customerId || !obj.productId
    );
    if (hasMissingCustomerIdOrProductId) {
      toast.warning(
        'You cannot add this requisition becasue it has rows that do not have product or customer!'
      );
      return false;
    }

    // Merge array a and b
    const mergedArray = copyComparativeState.map(
      (itemA: IPurchaseComparativeSheetGrid) => {
        const matchingB = copyComparativeInfo?.filter(
          (itemB: IPurchaseComparativeSheetGrid) =>
            itemB.productId === itemA.productId
        );
        if (matchingB.length > 0) {
          // Sum quantities
          const totalQuantity =
            itemA.quantity +
            matchingB.reduce(
              (acc: any, item: IPurchaseComparativeSheetGrid) =>
                acc + item.quantity,
              0
            );

          // Calculate approxSalesPrice using the formula
          const totalSalesPrice =
            itemA.approxSalesPrice * itemA.quantity +
            matchingB.reduce(
              (acc: any, item: IPurchaseComparativeSheetGrid) =>
                acc + item.approxSalesPrice * item.quantity,
              0
            );
          console.log('totalSalesPrice');
          console.log(totalSalesPrice / totalQuantity);

          const mergedSalesPrice = totalSalesPrice / totalQuantity;

          // Merge suppliers
          let mergedSuppliers = matchingB.reduce(
            (acc: any, item: IPurchaseComparativeSheetGrid) =>
              mergeSuppliers(acc, item.suppliers),
            itemA.suppliers
          );

          // Use a Map to filter out duplicates based on a combination of the object's properties
          mergedSuppliers = [
            ...new Map(
              mergedSuppliers.map((item: any) => [
                `${item.supplierId}-${item.supplierName}`,
                item,
              ])
            ).values(),
          ];

          console.log('Item A---->');

          console.log(itemA);
          const tempArray = JSON.parse(
            JSON.stringify(itemA.mergedRequisitionNumbers)
          );

          for (let i = 0; i < matchingB.length; i++) {
            const tempObj: IProcurementRequisition = {
              procurementRequisitionId: matchingB[i].procurementRequisitionId,
              requisitionNo: matchingB[i].requisitionNo,
            };
            tempArray.push(tempObj);
          }
          // Use a Map to filter out duplicates based on a combination of the object's properties
          const uniqueArray = [
            ...new Map(
              tempArray.map((item: IProcurementRequisition) => [
                `${item.procurementRequisitionId}-${item.requisitionNo}`,
                item,
              ])
            ).values(),
          ];
          const finalArray = JSON.parse(JSON.stringify(uniqueArray));

          let totalSalesForecastDays =
            itemA.salesForecastDays +
            matchingB.reduce(
              (acc: any, item: IPurchaseComparativeSheetGrid) =>
                acc + item.salesForecastDays,
              0
            );
          console.log('hellloooo................');
          console.log(totalSalesForecastDays);

          totalSalesForecastDays /= finalArray.length;
          console.log(totalSalesForecastDays);

          //       procurementRequisitionDetailId?: number | null;
          // customerId: number;
          // customerName: string;
          // productId: number;
          // productName: string;
          // quantity: number;
          // purchasePrice: number;
          // approxSalesPrice: number;
          // salesForecastDays: number;
          // suppliers: ISupplierPurchaseGrid[];

          return {
            // procurementRequisitionDetailId: itemA.procurementRequisitionDetailId
            requisitionNo: matchingB[0].requisitionNo || '',
            productId: itemA.productId,
            productName: itemA.productName,
            customerId: itemA.customerId,
            customerName: itemA.customerName,
            approxSalesPrice: mergedSalesPrice,
            quantity: totalQuantity,
            salesForecastDays: totalSalesForecastDays,
            suppliers: mergedSuppliers,
            mergedRequisitionNumbers: [...finalArray],
          };
        }
        // If no match found in b, return item from a
        return itemA;
      }
    );

    // Add items from b that don't exist in a
    copyComparativeInfo.forEach((itemB: IPurchaseComparativeSheetGrid) => {
      const existsInA = copyComparativeState.some(
        (itemA: IPurchaseComparativeSheetGrid) =>
          itemA.productId === itemB.productId
      );
      if (!existsInA) {
        mergedArray.push(itemB);
      }
    });

    console.log('Please seee hahaha merged');
    console.log(mergedArray);

    const mergedArrayFresh = mergedArray.filter(
      (obj: any) => !isEmptyObject(obj)
    );
    const emptyObjectAmount = mergedArrayFresh.length;
    if (emptyObjectAmount < 10) {
      for (let index = 0; index < 10 - emptyObjectAmount; index++) {
        const emptyObj = {
          requisitionNo: '',
          productId: null,
          productName: '',
          customerId: null,
          customerName: '',
          approxSalesPrice: null,
          quantity: null,
          salesForecastDays: null,
          purchasePrice: null,
          supplierName: '',
          supplierId: null,
          suppliers: [],
          mergedRequisitionNumbers: [],
        };
        mergedArrayFresh.push(emptyObj);
      }
    }
    setPurchaseComparativeSheetGridState(mergedArrayFresh);
  };

  // Helper function to merge suppliers by supplierId
  function mergeSuppliers(suppliersA: any, suppliersB: any) {
    const merged = [...suppliersA];
    suppliersB.forEach((supplierB: any) => {
      const existingSupplier = merged.find(
        (s) => s.supplierId === supplierB.supplierId
      );
      if (!existingSupplier) {
        merged.push(supplierB);
      }
    });
    return merged;
  }

  const previewRequisitionWiseFunct = async (
    row: IPurchaseComparativeSheetGrid
  ) => {
    console.log('Dekh Baba--->');
    console.log(row);

    const productId = row.productId;
    let requisitionNumbers = '';
    if (row.mergedRequisitionNumbers) {
      requisitionNumbers = row.mergedRequisitionNumbers
        .map((item) => item.requisitionNo)
        .join('%23');
    }
    console.log(requisitionNumbers);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ProcurementRequisition/getProductInfoByRequisitionNoProductId?productId=${productId}&requisitionNos=${requisitionNumbers}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );

      console.log(
        'Dekhe ne product wise requisition ae ki ki dekhaitese from backend--->>>'
      );
      console.log(response.data);
      const requisitionGridFetchedData: IRequisitionWiseViewGrid[] =
        response.data;

      // emptyRow 10ta dhukanor kaaj STARTS
      const emptyObjAmount = requisitionGridFetchedData.length;
      if (emptyObjAmount < 10) {
        for (let index = 0; index < 10 - emptyObjAmount; index++) {
          const emptyObj: any = {
            requisitionNo: '',
            quantity: null,
            price: null,
            salesForcastDays: null,
          };
          requisitionGridFetchedData.push(emptyObj);
        }
      }
      // emptyRow 10ta dhukanor kaaj ENDS
      setRequisitionWiseViewGridState(requisitionGridFetchedData);
      setRequisitionWiseViewModal(true);
    } catch (error) {
      toast.error(`Error fetching Requisition wise Product Info from backend `);
      console.log(`Error fetching Requisition wise Product Info from backend`);
      console.log(error);
    }
  };

  // Function to check if an object is empty based on your criteria
  const isEmptyObject = (obj: any) => {
    return Object.values(obj).every(
      (value) =>
        value === '' ||
        value === null ||
        value === undefined ||
        value === 0 ||
        (Array.isArray(value) && value.length === 0)
    );
  };

  const createNewRequisition = (
    copyGridState: any[],
    uniqueMergedRequisitionNo: any[]
  ) => {
    // const copyGridStateWithEmptyObj = JSON.parse(
    //   JSON.stringify(purchaseComparativeSheetGridState)
    // );

    // // Filtering out empty objects
    // const copyGridState = copyGridStateWithEmptyObj.filter(
    //   (obj: any) => !isEmptyObject(obj)
    // );

    // // if (!clickedCardInfo?.biznessEventId && copyGridState.length === 1) {
    // //   toast.error('You have to add multiple different requisition no!');
    // //   return false;
    // // }
    // if (copyGridState.length === 0) {
    //   toast.error('Nothing to Save!');
    //   return false;
    // }

    // const allMergedRequisitions: IProcurementRequisition[] = [];
    // for (let i = 0; i < copyGridState.length; i++) {
    //   const perRowMergedRequisitionArray =
    //     copyGridState[i].mergedRequisitionNumbers;
    //   if (perRowMergedRequisitionArray) {
    //     for (let j = 0; j < perRowMergedRequisitionArray.length; j++) {
    //       allMergedRequisitions.push(perRowMergedRequisitionArray[j]);
    //     }
    //   }
    //   delete copyGridState[i].mergedRequisitionNumbers;
    // }

    // const uniqueMergedRequisitionNo = [
    //   ...new Map(
    //     allMergedRequisitions.map((item: IProcurementRequisition) => [
    //       `${item.procurementRequisitionId}-${item.requisitionNo}`,
    //       item,
    //     ])
    //   ).values(),
    // ];

    let createBiznessEventPCTrackCommand: ICreateBiznessEventPCTrackCommand | null =
      null;
    const createRequisition: IPurchaseComparativeSheetGrid[] | null =
      copyGridState;

    // jodi chain theke execute hoy page ta
    if (clickedCardInfo?.biznessEventId) {
      // jodi requisition No ektai thaake, tahole new requisition create hobena, just pcTrack ae data porbe.
      // if (uniqueMergedRequisitionNo.length === 1) {
      //   createBiznessEventPCTrackCommand = {
      //     biznessEventProcessConfigurationId:
      //       clickedCardInfo?.biznessEventProcessConfigurationId,
      //     firstEventNo: clickedCardInfo?.firstEventNo,
      //     eventNo: clickedCardInfo?.eventNo,
      //     performedBy: userInfo.securityUserId,
      //     startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
      //     endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
      //     note: 'added',
      //     progressPReported: 100,
      //     originalSequence: clickedCardInfo.sequence,
      //     nextSequence: clickedCardInfo.sequence + 1,
      //     complete: false,
      //     locationId:
      //       clickedCardInfo.eventLocationId || userInfo.locationId || 0,
      //   };
      //   createRequisition = null;
      //   uniqueMergedRequisitionNo = [];
      // }
      // else if (uniqueMergedRequisitionNo.length > 1) {
      createBiznessEventPCTrackCommand = {
        biznessEventProcessConfigurationId:
          clickedCardInfo?.biznessEventProcessConfigurationId,
        firstEventNo: clickedCardInfo?.firstEventNo,
        eventNo: clickedCardInfo?.eventNo,
        performedBy: userInfo.securityUserId,
        startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        note: operationMode === 'edit' ? 'Edited' : 'added',
        progressPReported: 100,
        originalSequence: clickedCardInfo.sequence,
        nextSequence:
          operationMode === 'edit'
            ? clickedCardInfo.sequence
            : clickedCardInfo.sequence + 1,
        complete: false,
        locationId: clickedCardInfo.eventLocationId || userInfo.locationId || 0,
      };
      // }
    }

    const userInfoSend = {
      userName: userInfo?.userName,
      securityUserId: userInfo?.securityUserId,
      employeeId: userInfo?.employeeId,
      emailAddress: userInfo?.emailAddress,
      phone: userInfo?.phone,
      password: userInfo?.password,
      companyId: userInfo?.companyId,
      companyName: userInfo?.companyName,
      companyAddress: userInfo?.companyAddress,
      companyPhone: userInfo?.companyPhone,
      locationId: userInfo?.locationId,
      locationName: userInfo?.locationName,
    };

    const sendingObj: IProcurementRequisitionCommandsVM = {
      createRequisition,
      updateRequisition: [],
      previousRequisitionNo: uniqueMergedRequisitionNo,
      userInfo: userInfoSend,
      createBiznessEventPCTrackCommand,
      cancelPrevRequisitions: false,
    };

    Swal.fire({
      title: `Do you want to cancel the merged requisitions?`,
      text: '',
      showDenyButton: true,
      allowOutsideClick: false,
      // target: 'body',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Yes!',
      denyButtonText: `No!`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // modalPageOpenerClose();
        sendingObj.cancelPrevRequisitions = true;

        // ----on processPCTrack, save email state---------
        const emailInfo = {
          fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
          firstEventNo:
            sendingObj.createBiznessEventPCTrackCommand?.firstEventNo,
          companyId: userInfo?.companyId,
          progressPReported:
            sendingObj.createBiznessEventPCTrackCommand?.progressPReported,
        };
        setEmailInfoState(emailInfo);

        processSaveRequisition(sendingObj);
      } else {
        sendingObj.cancelPrevRequisitions = false;

        // ----on processPCTrack, save email state---------
        const emailInfo = {
          fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
          firstEventNo:
            sendingObj.createBiznessEventPCTrackCommand?.firstEventNo,
          companyId: userInfo?.companyId,
          progressPReported:
            sendingObj.createBiznessEventPCTrackCommand?.progressPReported,
        };
        setEmailInfoState(emailInfo);

        processSaveRequisition(sendingObj);
      }
    });

    // call saving apiSlice
  };

  const updateCurrentRequisition = (copyGridState: any[]) => {
    // const copyGridStateWithEmptyObj = JSON.parse(
    //   JSON.stringify(purchaseComparativeSheetGridState)
    // );

    // // Filtering out empty objects
    // const copyGridState = copyGridStateWithEmptyObj.filter(
    //   (obj: any) => !isEmptyObject(obj)
    // );

    // // if (!clickedCardInfo?.biznessEventId && copyGridState.length === 1) {
    // //   toast.error('You have to add multiple different requisition no!');
    // //   return false;
    // // }
    // if (copyGridState.length === 0) {
    //   toast.error('Nothing to Save!');
    //   return false;
    // }

    // const allMergedRequisitions: IProcurementRequisition[] = [];
    // for (let i = 0; i < copyGridState.length; i++) {
    //   const perRowMergedRequisitionArray =
    //     copyGridState[i].mergedRequisitionNumbers;
    //   if (perRowMergedRequisitionArray) {
    //     for (let j = 0; j < perRowMergedRequisitionArray.length; j++) {
    //       allMergedRequisitions.push(perRowMergedRequisitionArray[j]);
    //     }
    //   }
    //   delete copyGridState[i].mergedRequisitionNumbers;
    // }

    // const uniqueMergedRequisitionNo = [
    //   ...new Map(
    //     allMergedRequisitions.map((item: IProcurementRequisition) => [
    //       `${item.procurementRequisitionId}-${item.requisitionNo}`,
    //       item,
    //     ])
    //   ).values(),
    // ];

    let createBiznessEventPCTrackCommand: ICreateBiznessEventPCTrackCommand | null =
      null;
    const updateRequisition: IPurchaseComparativeSheetGrid[] | null =
      copyGridState;

    // jodi chain theke execute hoy page ta
    if (clickedCardInfo?.biznessEventId) {
      createBiznessEventPCTrackCommand = {
        biznessEventProcessConfigurationId:
          clickedCardInfo?.biznessEventProcessConfigurationId,
        firstEventNo: clickedCardInfo?.firstEventNo,
        eventNo: clickedCardInfo?.eventNo,
        performedBy: userInfo.securityUserId,
        startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        note: operationMode === 'edit' ? 'Edited' : 'added',
        progressPReported: 100,
        originalSequence: clickedCardInfo.sequence,
        nextSequence:
          operationMode === 'edit'
            ? clickedCardInfo.sequence
            : clickedCardInfo.sequence + 1,
        complete: false,
        locationId: clickedCardInfo.eventLocationId || userInfo.locationId || 0,
      };
      // }
    }

    const userInfoSend = {
      userName: userInfo?.userName,
      securityUserId: userInfo?.securityUserId,
      employeeId: userInfo?.employeeId,
      emailAddress: userInfo?.emailAddress,
      phone: userInfo?.phone,
      password: userInfo?.password,
      companyId: userInfo?.companyId,
      companyName: userInfo?.companyName,
      companyAddress: userInfo?.companyAddress,
      companyPhone: userInfo?.companyPhone,
      locationId: userInfo?.locationId,
      locationName: userInfo?.locationName,
    };

    const sendingObj: IProcurementRequisitionCommandsVM = {
      createRequisition: [],
      updateRequisition,
      previousRequisitionNo: [],
      userInfo: userInfoSend,
      createBiznessEventPCTrackCommand,
      cancelPrevRequisitions: false,
    };

    // Swal.fire({
    //   title: `Do you want to cancel the merged requisitions?`,
    //   text: '',
    //   showDenyButton: true,
    //   allowOutsideClick: false,
    //   // target: 'body',
    //   icon: 'success',
    //   showCancelButton: false,
    //   confirmButtonText: 'Yes!',
    //   denyButtonText: `No!`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     // modalPageOpenerClose();
    //     sendingObj.cancelPrevRequisitions = true;
    //     processSaveRequisition(sendingObj);
    //   } else {
    //     sendingObj.cancelPrevRequisitions = false;
    //     processSaveRequisition(sendingObj);
    //   }
    // });

    // ----on processPCTrack, save email state---------
    const emailInfo = {
      fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
      firstEventNo: sendingObj.createBiznessEventPCTrackCommand?.firstEventNo,
      companyId: userInfo?.companyId,
      progressPReported:
        sendingObj.createBiznessEventPCTrackCommand?.progressPReported,
    };
    setEmailInfoState(emailInfo);

    processSaveRequisition(sendingObj);

    // call saving apiSlice
  };

  const onSavePressBtn = () => {
    const copyGridStateWithEmptyObj = JSON.parse(
      JSON.stringify(purchaseComparativeSheetGridState)
    );

    // Filtering out empty objects
    const copyGridState = copyGridStateWithEmptyObj.filter(
      (obj: any) => !isEmptyObject(obj)
    );

    if (copyGridState.length === 0) {
      toast.error('Nothing to Save!');
      return false;
    }

    const allMergedRequisitions: IProcurementRequisition[] = [];
    for (let i = 0; i < copyGridState.length; i++) {
      const perRowMergedRequisitionArray =
        copyGridState[i].mergedRequisitionNumbers;
      if (perRowMergedRequisitionArray) {
        for (let j = 0; j < perRowMergedRequisitionArray.length; j++) {
          allMergedRequisitions.push(perRowMergedRequisitionArray[j]);
        }
      }
      delete copyGridState[i].mergedRequisitionNumbers;
    }

    const uniqueMergedRequisitionNo = [
      ...new Map(
        allMergedRequisitions.map((item: IProcurementRequisition) => [
          `${item.procurementRequisitionId}-${item.requisitionNo}`,
          item,
        ])
      ).values(),
    ];

    if (
      uniqueMergedRequisitionNo.length &&
      uniqueMergedRequisitionNo.length === 1
    ) {
      Swal.fire({
        title: `Do you want to update the selected requisition or to create a new one?`,
        text: 'You can create a new requisition from the selected requisition, or you can update the selected requisition!',
        showDenyButton: true,
        allowOutsideClick: true,
        // target: 'body',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Update this requisition!',
        denyButtonText: `Create new requisition!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // Update the requisition
          updateCurrentRequisition(copyGridState);
        } else if (result.isDenied) {
          // create new requisition
          createNewRequisition(copyGridState, uniqueMergedRequisitionNo);
        }
      });
    } else if (
      uniqueMergedRequisitionNo.length &&
      uniqueMergedRequisitionNo.length > 1
    ) {
      // multiple requisition no paoa gelei actually create e hobe, update er khela nai
      createNewRequisition(copyGridState, uniqueMergedRequisitionNo);
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
                {biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start  mt-5">
                <div className="">
                  <div className="flex gap-x-2">
                    <div className="w-full">
                      <Controller
                        name="requisitionNo"
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
                            loading={
                              requisitionNoOptionsLoading ||
                              requisitionNoOptionsIsFetching
                            }
                            options={requisitionNoOptions || []}
                            value={value || null}
                            // onChange={(event, item) => {}} // React-hook-form manages the state
                            onChange={(event, selectedItem) => {
                              console.log(selectedItem);
                              setSelectedRequisiton(selectedItem);
                              console.log(selectedRequisiton);
                              // requisitionComparativeInfoRefetch();
                              onChange(selectedItem);
                              if (!selectedItem) {
                                setSelectedRequisitonComparativeInfo([]);
                              }
                            }}
                            onBlur={onBlur} // Trigger validation on blur
                            getOptionLabel={(option) =>
                              option ? option.requisitionNo : ''
                            }
                            isOptionEqualToValue={(option, selectedValue) =>
                              option.requisitionNo ===
                                selectedValue?.requisitionNo &&
                              option.procurementRequisitionId ===
                                selectedValue?.procurementRequisitionId
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Requisition No"
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
                                }}
                                sx={{ width: '100%', marginTop: 1 }}
                                inputRef={ref}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className={`inline-block py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                        requisitionComparativeInfoLoading ||
                        requisitionComparativeInfoIsFetching
                          ? 'opacity-50 cursor-not-allowed '
                          : 'px-4'
                      }`}
                      onClick={() => {
                        if (
                          requisitionComparativeInfoLoading ||
                          requisitionComparativeInfoIsFetching
                        ) {
                          // do nothing
                        } else {
                          addRequisitionInGridBtn();
                        }
                      }}
                    >
                      {requisitionComparativeInfoLoading ||
                      requisitionComparativeInfoIsFetching ? (
                        <CircularProgress
                          className=" inline"
                          size={11}
                          color="inherit"
                        />
                      ) : (
                        ''
                      )}{' '}
                      {requisitionComparativeInfoLoading ||
                      requisitionComparativeInfoIsFetching
                        ? 'Wait...'
                        : 'Add'}
                    </button>
                    <button
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className="inline-block px-6 py-0 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                      onClick={() => {}}
                    >
                      <i className="fas fa-eye" />
                    </button>
                  </div>
                  <div className="w-full mt-4 modifiedEditTable">
                    <MaterialReactTable
                      table={tablePurchaseComparativeInitializer}
                    />
                  </div>
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
                    className={`inline-block py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      processSaveRequisitionIsLoading ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed px-2'
                        : 'px-4'
                    }`}
                    // onClick={() => {
                    //   onSaveBtn();
                    // }}

                    onClick={() => {
                      if (
                        processSaveRequisitionIsLoading ||
                        operationMode === 'preview'
                      ) {
                        // do nothing
                      } else {
                        // onSaveBtn();
                        onSavePressBtn();
                      }
                    }}
                  >
                    {processSaveRequisitionIsLoading ? (
                      <CircularProgress
                        className=" inline"
                        size={11}
                        color="inherit"
                      />
                    ) : (
                      ''
                    )}{' '}
                    {processSaveRequisitionIsLoading
                      ? 'Please Wait...'
                      : 'Save'}
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {}}
                  >
                    Report View
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {}}
                  >
                    Forecast Report
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-4 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      const mergedArray = [];
                      for (let index = 0; index < 10; index++) {
                        const emptyObj: any = {
                          requisitionNo: '',
                          productId: null,
                          productName: '',
                          customerId: null,
                          customerName: '',
                          approxSalesPrice: null,
                          quantity: null,
                          salesForecastDays: null,
                          suppliers: [],
                          mergedRequisitionNumbers: [],
                        };
                        mergedArray.push(emptyObj);
                      }
                      setPurchaseComparativeSheetGridState(mergedArray);
                      // setPurchaseComparativeSheetGridState([]);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>
      {/* // modals --- out of html normal body/position */}

      {/* --------------------------[Making a loader modal]--------------------------------------- */}
      <Modal
        open={purchasePriceEditModal} // create leaf modal
        onClose={handlePurchasePriceEditModalClose}
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
          <div className="mx-2">
            <div className="w-full mt-20 modifiedEditTable">
              <MaterialReactTable table={tableSupplierPurchaseInitializer} />
            </div>
          </div>

          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
            onClick={() => {
              console.log('clicked');
              console.log(currentIndex);

              const currentSupplierPurchaseGrid = JSON.parse(
                JSON.stringify(supplierPurchaseGridState)
              );
              if (currentIndex !== null || currentIndex !== undefined) {
                const currentSupplierPurchaseGridWithoutEmpty =
                  currentSupplierPurchaseGrid.filter(
                    (item: any) => item.supplierId || item.supplierName
                  );

                const indexNoSupplierPurchaseGridObjKey = Object.keys(
                  supplierPurchaseGridRowSelection
                )[0]; // Extract the first (and only) key
                const selectedIndexNoSupplierPurchaseGrid = parseInt(
                  indexNoSupplierPurchaseGridObjKey,
                  10
                );
                const ifAnySupplierPurchaseSelected: boolean =
                  supplierPurchaseGridRowSelection[
                    selectedIndexNoSupplierPurchaseGrid
                  ] || false;

                /// /---- if kono row selected in supplierPuchase grid, tahole selected er price nibe, else lowest price nibe
                if (ifAnySupplierPurchaseSelected) {
                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].suppliers = currentSupplierPurchaseGridWithoutEmpty;

                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].purchasePrice = currentSupplierPurchaseGrid[
                    selectedIndexNoSupplierPurchaseGrid
                  ]?.purchasePrice
                    ? currentSupplierPurchaseGrid[
                        selectedIndexNoSupplierPurchaseGrid
                      ]?.purchasePrice
                    : 0;

                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].supplierId = currentSupplierPurchaseGrid[
                    selectedIndexNoSupplierPurchaseGrid
                  ]?.supplierId
                    ? currentSupplierPurchaseGrid[
                        selectedIndexNoSupplierPurchaseGrid
                      ]?.supplierId
                    : 0;

                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].supplierName = currentSupplierPurchaseGrid[
                    selectedIndexNoSupplierPurchaseGrid
                  ]?.supplierName
                    ? currentSupplierPurchaseGrid[
                        selectedIndexNoSupplierPurchaseGrid
                      ]?.supplierName
                    : '';
                } else {
                  currentSupplierPurchaseGridWithoutEmpty.sort(
                    (a: any, b: any) => a.purchasePrice - b.purchasePrice
                  );
                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].suppliers = currentSupplierPurchaseGridWithoutEmpty;

                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].purchasePrice = currentSupplierPurchaseGridWithoutEmpty[0]
                    ?.purchasePrice
                    ? currentSupplierPurchaseGridWithoutEmpty[0]?.purchasePrice
                    : 0;

                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].supplierId = currentSupplierPurchaseGridWithoutEmpty[0]
                    ?.supplierId
                    ? currentSupplierPurchaseGridWithoutEmpty[0]?.supplierId
                    : 0;

                  purchaseComparativeSheetGridState[
                    currentIndex as number
                  ].supplierName = currentSupplierPurchaseGridWithoutEmpty[0]
                    ?.supplierName
                    ? currentSupplierPurchaseGridWithoutEmpty[0]?.supplierName
                    : '';
                }

                setPurchaseComparativeSheetGridState([
                  ...purchaseComparativeSheetGridState,
                ]);
              }
              setPurchasePriceEditModal(false);
            }}
          >
            Save
          </button>
          <IconButton
            aria-label="close"
            onClick={handlePurchasePriceEditModalClose}
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
      </Modal>

      {/* <Modal
        open={productWiseViewModal} // create leaf modal
        onClose={handleProductWiseViewModalClose}
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
            // width: { xs: '80vw', md: '80vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <div className="w-full mt-4 modifiedEditTable">
            <MaterialReactTable table={tablePurchaseComparativeInitializer} />
          </div>
          <IconButton
            aria-label="close"
            onClick={handlePurchasePriceEditModalClose}
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

      <Modal
        open={requisitionWiseViewModal} // create leaf modal
        onClose={handleRequisitionWiseViewGridClose}
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
          <div className="mx-2">
            <div className="w-full mt-20 mb-4 modifiedEditTable">
              <MaterialReactTable
                table={tableRequisitionWiseViewGridInitializer}
              />
            </div>
          </div>

          <IconButton
            aria-label="close"
            onClick={handleRequisitionWiseViewGridClose}
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
      </Modal>

      {/* //////////////////////////////////////////////////////////////////////////// */}
      {/* 
      <Modal
        open={requisitionWiseViewModal} // create leaf modal
        onClose={handleRequisitionWiseViewGridClose}
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
            // width: { xs: '80vw', md: '80vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <div className="w-full mt-4 modifiedEditTable">
            <MaterialReactTable
              table={tableRequisitionWiseViewGridInitializer}
            />
          </div>
          <IconButton
            aria-label="close"
            onClick={handleRequisitionWiseViewGridClose}
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
    // return wrapper div--/--
  );
};

export default PurchaseComparativeSheet;
