/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable operator-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  Box,
  IconButton,
  Input,
  InputAdornment,
  Modal,
  Popper,
  Slider,
  TextField,
  Tooltip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_Virtualizer,
  useMaterialReactTable,
} from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ExportToCsv } from 'export-to-csv';

import { Delete, Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import {
  useGetBuyerForComboByCompanyLocationIdQuery,
  useLazyGetBuyerByCompanyLocationIdQuery,
  useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery,
} from '../../../infrastructure/api/BuyerApiSlice';

import { useLazyGetSalesPersonByCompanyLocationBuyerIdQuery } from '../../../infrastructure/api/EmployeeApiSlice';
import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';

import {
  useLazyGetCollectionInfoQuery,
  useProcessSaveCollectionMutation,
} from '../../../infrastructure/api/CollectionApiSlice';

import {
  useLazyGetBrandByCompanyIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,
  useLazyGetProductGroupByCompanyIdQuery,
} from '../../../infrastructure/api/ProductApiSlice';

import {
  IChequeDetailInfo,
  ICollectionInfo,
  ICollectionProcessCommandsVM,
  ICreateChequeDetailCommand,
  IDeleteChequeAWBCommand,
  IDeleteChequeDetailCommand,
  IDeleteChequeHistoryCommand,
  IDeleteCollectionCommand,
  IGetCollectionInfoFilterDto,
  IUpdateChequeDetailCommand,
  IUpdateCollectionCommand,
} from '../../../domain/interfaces/CollectionInterface';
import ChequeDetail from './ChequeDetail/ChequeDetail';
import { useLazyGetCollectionModeQuery } from '../../../infrastructure/api/PaymentModeApiSlice';

type Props = {};

const CollectionEdit = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
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
  } = useForm();

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

  const [collectionGrid, setCollectionGrid] = useState<ICollectionInfo[]>([]);
  const [collectionGridPrev, setCollectionGridPrev] = useState<
    ICollectionInfo[]
  >([]);
  // const [deletedCollectionRows, setDeletedCollectionRows] = useState<
  //   IDeleteCollectionCommand[]
  // >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [chequeDetailRows, setChequeDetailRows] = useState<IChequeDetailInfo[]>(
    []
  );
  const [deletedChequeDetailRows, setDeletedChequeDetailRows] = useState<
    IDeleteChequeDetailCommand[]
  >([]);

  const [deletedChequeHistoryRows, setDeletedChequeHistoryRows] = useState<
    IDeleteChequeHistoryCommand[]
  >([]);

  const [deletedChequeAWBRows, setDeletedChequeAWBRows] = useState<
    IDeleteChequeAWBCommand[]
  >([]);

  // type FormValues = {
  //   buyerGroup: IBuyerGroup | null;
  //   buyer: IBuyer | null;
  //   salesPerson: ISalesPersonComboBox | null;
  //   department: IDepartment | null;
  //   dateFrom: string | null;
  //   dateTo: string | null;
  // };

  //   grid virtualization states
  const [isCollectionGridLoading, setIsCollectionGridLoading] = useState(true);
  const [sortingCollectionGrid, setSortingCollectionGrid] =
    useState<MRT_SortingState>([]);

  const [detailEditModalInfo, setDetailEditModalInfo] = useState<any>();

  // const [deletedSerials, setDeletedSerials] = useState<
  //   IDeleteChequeHistoryCommand[]
  // >([]);

  const amountOverTemp = useWatch({ control, name: 'amountOver' });
  const amountUnderTemp = useWatch({ control, name: 'amountUnder' });

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
    triggerGetCollectionModeOptions,
    {
      data: collectionModeOptionsData,
      error: collectionModeOptionsError,
      isError: collectionModeOptionsIsError,
      isSuccess: collectionModeOptionsIsSuccess,
      isLoading: collectionModeOptionsIsLoading,
      isFetching: collectionModeOptionsIsFetching,
    },
  ] = useLazyGetCollectionModeQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (collectionModeOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching collectionModeOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching collectionModeOptionsData, see console--->:'
      );
      console.log(collectionModeOptionsError);
    }
    if (collectionModeOptionsIsSuccess) {
      console.log('collectionModeOptionsIsSuccess');
      console.log(collectionModeOptionsData);
      // // ---- here if the selected autocomp options isn't available in the options, then set null.......
      // const { collectionMode } = watchedFields;
      // if (collectionModeOptionsData && collectionMode?.employeeId) {
      //   const exists = collectionModeOptionsData?.some(
      //     (collectionModeRow) =>
      //       collectionModeRow.employeeId === collectionMode.employeeId
      //   );
      //   if (!exists && collectionMode != null && collectionMode.employeeId !== 0) {
      //     setValue('collectionMode', null);
      //   }
      // }
      // // ---- here if the selected autocomp options isn't available in the options, then set null----- ENDS...
      // // ---- here if the result only contains one result, autoSet.......
      // if (
      //   collectionModeOptionsData &&
      //   collectionModeOptionsData?.length === 1 &&
      //   collectionModeOptionsData?.[0].employeeId !== collectionMode?.employeeId &&
      //   // collectionMode != null &&
      //   collectionMode?.employeeId !== 0
      // ) {
      //   setValue('collectionMode', collectionModeOptionsData?.[0]);
      // }
      // // ---- here if the result only contains one result, autoSet----- ENDS...
    }
  }, [
    collectionModeOptionsData,
    collectionModeOptionsIsLoading,
    collectionModeOptionsError,
    collectionModeOptionsIsError,
    collectionModeOptionsIsFetching,
    collectionModeOptionsIsSuccess,
  ]);

  const [
    triggerGetCollectionInfo,
    {
      data: collectionInfoData,
      error: collectionInfoError,
      isError: collectionInfoIsError,
      isSuccess: collectionInfoIsSuccess,
      isLoading: collectionInfoIsLoading,
      isFetching: collectionInfoIsFetching,
    },
  ] = useLazyGetCollectionInfoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (collectionInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching collectionInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching collectionInfoData, see console--->:'
      );
      console.log(collectionInfoError);

      const data: ICollectionInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          collectionId: '',
          buyerId: 0,
          buyerName: '',
          buyerGroupId: 0,
          buyerGroupName: '',
          collectionNo: '',
          collectionAgainst: '',
          collectionDate: '',
          collectedAmount: null,
          collectionModeId: 0,
          collectionModeName: '',
          voucherId: null,
        });
      }
      setCollectionGrid([...data]);
      setCollectionGridPrev([]);

      setIsCollectionGridLoading(false);
    }
    if (
      collectionInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !collectionInfoIsLoading &&
      !collectionInfoIsError &&
      !collectionInfoIsFetching
    ) {
      console.log('collectionInfoIsSuccess');
      console.log(collectionInfoData);

      const data: ICollectionInfo[] = JSON.parse(
        JSON.stringify([...(collectionInfoData || [])])
      );
      const data2: ICollectionInfo[] = JSON.parse(
        JSON.stringify([...(collectionInfoData || [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          collectionId: '',
          buyerId: 0,
          buyerName: '',
          buyerGroupId: 0,
          buyerGroupName: '',
          collectionNo: '',
          collectionAgainst: '',
          collectionDate: '',
          collectedAmount: null,
          collectionModeId: 0,
          collectionModeName: '',
          voucherId: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setCollectionGrid([...dataCopy]);
      setCollectionGridPrev([...dataCopy2]);
      setIsCollectionGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsCollectionGridLoading(true);
    }
  }, [
    collectionInfoData,
    collectionInfoIsLoading,
    collectionInfoError,
    collectionInfoIsError,
    collectionInfoIsFetching,
    collectionInfoIsSuccess,
  ]);

  const {
    data: locationOptions,
    isLoading: locationOptionsLoading,
    error: locationOptionsError,
    isSuccess: locationOptionsIsSuccess,
    isError: locationOptionsIsError,
    isFetching: locationOptionsIsFetching,
    refetch: locationOptionsRefetch,
  } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

  useEffect(() => {
    if (locationOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching locationOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching locationOptions for autocomplete, see console--->:'
      );
      console.log(locationOptionsError);
    }
    if (locationOptionsIsSuccess) {
      console.log('locationOptions');
      console.log(locationOptions);
    }
  }, [
    locationOptionsLoading,
    locationOptionsIsFetching,
    locationOptionsError,
    locationOptionsIsError,
    locationOptions,
    locationOptionsIsSuccess,
  ]);

  const {
    data: buyerComboForGridOptions,
    isLoading: buyerComboForGridOptionsLoading,
    error: buyerComboForGridOptionsError,
    isSuccess: buyerComboForGridOptionsIsSuccess,
    isError: buyerComboForGridOptionsIsError,
    isFetching: buyerComboForGridOptionsIsFetching,
    refetch: buyerComboForGridOptionsRefetch,
  } = useGetBuyerForComboByCompanyLocationIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (buyerComboForGridOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerComboForGridOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerComboForGridOptions for autocomplete, see console--->:'
      );
      console.log(buyerComboForGridOptionsError);
    }
    if (buyerComboForGridOptionsIsSuccess) {
      console.log('buyerComboForGridOptions');
      console.log(buyerComboForGridOptions);
    }
  }, [
    buyerComboForGridOptionsLoading,
    buyerComboForGridOptionsIsFetching,
    buyerComboForGridOptionsError,
    buyerComboForGridOptionsIsError,
    buyerComboForGridOptions,
    buyerComboForGridOptionsIsSuccess,
  ]);

  const [
    processSaveCollection,
    {
      isLoading: processSaveCollectionIsLoading,
      isError: processSaveCollectionIsError,
      error: processSaveCollectionError,
      isSuccess: processSaveCollectionIsSuccess,
      data: processSaveCollectionData,
    },
  ] = useProcessSaveCollectionMutation();

  useEffect(() => {
    // if (!processSaveCollectionIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveCollectionIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Collections have been saved successfully!`,
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
          // modalPageOpenerClose();
          console.log('check data after success, see console---->');
          collectionGridInitializer.resetRowSelection();
          console.log(processSaveCollectionData);
          setDeletedChequeDetailRows([]);
          setDeletedChequeHistoryRows([]);
          setDeletedChequeAWBRows([]);
          setChequeDetailRows([]);
        }
      });
    } else if (processSaveCollectionIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving Collection data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving Collection data, see console---->'
      );
      console.log(processSaveCollectionError);
      collectionGridInitializer.resetRowSelection();
    }
  }, [
    processSaveCollectionIsLoading,
    processSaveCollectionIsError,
    processSaveCollectionData,
    processSaveCollectionError,
    processSaveCollectionIsSuccess,
  ]);

  /// ///////////----New filter API Hook Init Starts-----/////////////////////////

  const [
    triggerGetProductGroup,
    {
      data: productGroupOptionsData,
      error: productGroupOptionsError,
      isError: productGroupOptionsIsError,
      isSuccess: productGroupOptionsIsSuccess,
      isLoading: productGroupOptionsIsLoading,
      isFetching: productGroupOptionsIsFetching,
    },
  ] = useLazyGetProductGroupByCompanyIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (productGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productGroupOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productGroupOptionsData, see console--->:'
      );
      console.log(productGroupOptionsError);
    }
    if (productGroupOptionsIsSuccess) {
      console.log('productGroupOptionsIsSuccess');

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

      console.log(productGroupOptionsData);
    }
  }, [
    productGroupOptionsData,
    productGroupOptionsIsLoading,
    productGroupOptionsError,
    productGroupOptionsIsError,
    productGroupOptionsIsFetching,
    productGroupOptionsIsSuccess,
  ]);

  const [
    triggerGetBrand,
    {
      data: brandOptionsData,
      error: brandOptionsError,
      isError: brandOptionsIsError,
      isSuccess: brandOptionsIsSuccess,
      isLoading: brandOptionsIsLoading,
      isFetching: brandOptionsIsFetching,
    },
  ] = useLazyGetBrandByCompanyIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (brandOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching brandOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching brandOptionsData, see console--->:'
      );
      console.log(brandOptionsError);
    }
    if (brandOptionsIsSuccess) {
      console.log('brandOptionsIsSuccess');

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

      console.log(brandOptionsData);
    }
  }, [
    brandOptionsData,
    brandOptionsIsLoading,
    brandOptionsError,
    brandOptionsIsError,
    brandOptionsIsFetching,
    brandOptionsIsSuccess,
  ]);

  const [
    triggerGetProduct,
    {
      data: productOptionsData,
      error: productOptionsError,
      isError: productOptionsIsError,
      isSuccess: productOptionsIsSuccess,
      isLoading: productOptionsIsLoading,
      isFetching: productOptionsIsFetching,
    },
  ] = useLazyGetProductByCompanyProductGroupIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (productOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productOptionsData, see console--->:'
      );
      console.log(productOptionsError);
    }
    if (productOptionsIsSuccess) {
      console.log('productOptionsIsSuccess');

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

      console.log(productOptionsData);
    }
  }, [
    productOptionsData,
    productOptionsIsLoading,
    productOptionsError,
    productOptionsIsError,
    productOptionsIsFetching,
    productOptionsIsSuccess,
  ]);

  /// ///////////----New filter API Hook Init ENDS-----/////////////////////////

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  // Trigger GetBuyerGroup RTK Query whenever a form field changes
  useEffect(() => {
    const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyerGroup({
      companyId: userInfo?.companyId,
      buyerId: buyer?.buyerId || null,
      salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
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
    const { buyer, salesPerson, buyerGroup, dateFrom, dateTo } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetBuyer({
      companyId: userInfo?.companyId,
      buyerGroupId: buyerGroup?.buyerGroupId || null,
      salesPersonId: salesPerson?.employeeId || null,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [
    watchedFields.buyerGroup,
    watchedFields.salesPerson,
    watchedFields.department,
    userInfo?.companyId,
    triggerGetBuyer,
  ]);

  // Trigger GetCollectionModeOptions RTK Query whenever a form field changes
  useEffect(() => {
    const { location, collectionMode } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetCollectionModeOptions({
      companyId: userInfo?.companyId,
      locationId: location?.locationId || userInfo?.locationId,
    });
  }, [watchedFields.location, userInfo?.locationId]);

  // Trigger GetCollectionInfo RTK Query whenever a form field changes
  useEffect(() => {
    const {
      buyer,
      buyerGroup,
      dateFrom,
      dateTo,
      amountOver,
      amountUnder,
      location,
      collectionMode,
    } = watchedFields;

    // if (!dateFrom) {
    //   toast.error('Date From cannot be empty');
    // }
    // if (!dateTo) {
    //   toast.error('Date To cannot be empty');
    // }
    // if (dateFrom && dateTo && dayjs(dateFrom) > dayjs(dateTo)) {
    //   toast.error('Date From cannot be greater than Date To');
    // }

    // checking if any error exist in useForm errors
    // if (Object.keys(errors).length > 0) {
    //   // console.log('Validation errors exist:', errors);
    //   return;
    // }

    // Trigger your RTK Query
    if (
      // dateFrom &&
      // dateTo &&
      // dayjs(dateFrom) <= dayjs(dateTo) &&
      // !(Object.keys(errors).length > 0)
      true
    ) {
      const getParams: IGetCollectionInfoFilterDto = {
        collectionModeId: collectionMode?.collectionModeId || null,
        buyerId: buyer?.buyerId || null,
        buyerGroupId: buyerGroup?.buyerGroupId || null,
        fromDate: dayjs(dateFrom)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss.SSS'),
        toDate: dayjs(dateTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
        amountOver: amountOver || null,
        amountUnder: amountUnder || null,
        locationId: location?.locationId || 0,
      };

      triggerGetCollectionInfo({
        filter: getParams,
        biznessEventId: 1,
        companyId: userInfo?.companyId,
        userId: userInfo?.securityUserId,
      });
    } else {
      const data: ICollectionInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          collectionId: '',
          buyerId: 0,
          buyerName: '',
          buyerGroupId: 0,
          buyerGroupName: '',
          collectionNo: '',
          collectionAgainst: '',
          collectionDate: '',
          collectedAmount: null,
          collectionModeId: 0,
          collectionModeName: '',
          voucherId: null,
        });
      }
      setCollectionGrid([...data]);
    }
  }, [
    watchedFields.dateFrom,
    watchedFields.dateTo,
    watchedFields.buyerGroup,
    watchedFields.buyer,
    watchedFields.amountOver,
    watchedFields.amountUnder,
    watchedFields.location,
    watchedFields.collectionMode,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  const handleEditDetail = (index: number, row: ICollectionInfo) => {
    const objTemp = {
      collectionInfoGridIndex: index,
      collectionInfoGridRow: row,
      collectionId: row.collectionId,
      editModalOpen: true,
    };

    setDetailEditModalInfo(objTemp);
  };

  const handleDetailEditModalClose = () => {
    const objTemp = {
      collectionInfoGridIndex: null,
      collectionInfoGridRow: null,
      collectionId: null,
      editModalOpen: false,
    };

    setDetailEditModalInfo(objTemp);
  };

  // const saveCollectionFollowed = () => {
  //   console.log(collectionGrid); // eita abar purata ashbena, shudhu selected gula ashbe
  //   console.log(deletedChequeDetailRows);

  //   console.log(chequeDetailRows);

  //   /// ----Selected Collections--------

  //   const selectedRows = collectionGridInitializer.getSelectedRowModel().rows;
  //   const selectedCollectionRows = selectedRows.map((row) => row.original);
  //   // console.log(selectedData);

  //   if (selectedCollectionRows.length === 0) {
  //     toast.warning('Select rows to save!');
  //     return;
  //   }

  //   /// /////////--------Collection Save ---------
  //   const updateCollection: IUpdateCollectionCommand[] = [];

  //   const createChequeDetail: ICreateChequeDetailCommand[] = [];
  //   const updateChequeDetail: IUpdateChequeDetailCommand[] = [];
  //   const deleteChequeDetail: IDeleteChequeDetailCommand[] = [];

  //   const createChequeHistory: ICreateChequeHistoryCommand[] = [];

  //   const createChequeAWB: ICreateChequeAWBCommand[] = [];

  //   const processChequeDetail = (collectionId: string) => {
  //     /// /////////--------ChequeDetail Save(Also chequeHistory save cz nested) ---------

  //     const selectedCDRows = chequeDetailRows.filter(
  //       (w) => w.collectionId === collectionId
  //     );

  //     // alert('selectedCDRows');
  //     // console.log('selectedCDRows');
  //     // console.log(selectedCDRows);
  //     // console.log(chequeDetailRows);

  //     const chequeDetailRowsSelected: IChequeDetailInfo[] = Array.isArray(
  //       selectedCDRows
  //     )
  //       ? selectedCDRows
  //       : [];

  //     for (let i = 0; i < chequeDetailRowsSelected.length; i++) {
  //       // update chequeDetail
  //       if (chequeDetailRowsSelected[i].chequeDetailId) {
  //         const obj: IUpdateChequeDetailCommand = {
  //           chequeDetailId: chequeDetailRowsSelected[i].chequeDetailId,
  //           chequeNo: chequeDetailRowsSelected[i].chequeNo,
  //           bankId: chequeDetailRowsSelected[i].bankId,
  //           chequeDate: chequeDetailRowsSelected[i].chequeDate,
  //           chequeAmount: chequeDetailRowsSelected[i].chequeAmount,
  //           cqdCollected: chequeDetailRowsSelected[i].cqdCollected || null,
  //           sendDate: chequeDetailRowsSelected[i].sendDate || null,
  //           honorDate: chequeDetailRowsSelected[i].honorDate || null,
  //           date: chequeDetailRowsSelected[i].date || null,
  //           sendBankId: chequeDetailRowsSelected[i].sendBankId || null,
  //           dateofentry: chequeDetailRowsSelected[i].dateOfEntry || '',
  //           disreason: chequeDetailRowsSelected[i].disreason || '',
  //           remarks: chequeDetailRowsSelected[i].remarks || '',
  //         };

  //         // create chequeHistory-Bairerta(serial)
  //         for (
  //           let j = 0;
  //           j < chequeDetailRowsSelected[i].chequeHistories.length;
  //           j++
  //         ) {
  //           if (
  //             !chequeDetailRowsSelected[i].chequeHistories[j].chequeHistoryId
  //           ) {
  //             const tempObj: ICreateChequeHistoryCommand = {
  //               chequeDetailId: chequeDetailRowsSelected[i].chequeDetailId,
  //               collectionId:
  //                 chequeDetailRowsSelected[i]
  //                   .collectionId || '',
  //               chequeType: 'C',
  //               collectionId: chequeDetailRowsSelected[i].collectionId,
  //               chequeNo: chequeDetailRowsSelected[i].chequeNo,
  //               chequeDate: chequeDetailRowsSelected[i].chequeDate,
  //               bankId: chequeDetailRowsSelected[i].bankId,
  //               treatment: chequeDetailRowsSelected[i].cqdCollected,
  //               treatmentDate: string;
  //               sendBankId?: number | null;
  //               date: string;
  //               enteredBy: number;
  //               dateOfEntry: string;
  //               voucherId?: string | null;

  //             };
  //             createChequeHistory.push(tempObj);
  //           }
  //         }

  //         // create chequeAWB-Process Model moddhei jeita open, Bairerta
  //         if (!chequeDetailRowsSelected[i].taxRowId) {
  //           const tempObj: ICreateChequeAWBCommand = {
  //             chequeDetailId: chequeDetailRowsSelected[i].chequeDetailId,
  //             taxId: 1,
  //             taxAmount: chequeDetailRowsSelected[i].taxAmount || 0,
  //           };
  //           createChequeAWB.push(tempObj);
  //         }

  //         if (!chequeDetailRowsSelected[i].vatRowId) {
  //           const tempObj: ICreateChequeAWBCommand = {
  //             chequeDetailId: chequeDetailRowsSelected[i].chequeDetailId,
  //             taxId: 2,
  //             taxAmount: chequeDetailRowsSelected[i].vatAmount || 0,
  //           };
  //           createChequeAWB.push(tempObj);
  //         }
  //         // create chequeAWB-Process Model moddhei jeita open, Bairerta---ENDS---

  //         // update chequeAWB-Process Model moddhei jeita open, Bairerta
  //         if (chequeDetailRowsSelected[i].taxRowId) {
  //           const tempObj: IUpdateChequeAWBCommand = {
  //             chequeAWBId: chequeDetailRowsSelected[i].taxRowId,
  //             taxAmount: chequeDetailRowsSelected[i].taxAmount || 0,
  //           };
  //           updateChequeAWB.push(tempObj);
  //         }

  //         if (chequeDetailRowsSelected[i].vatRowId) {
  //           const tempObj: IUpdateChequeAWBCommand = {
  //             chequeAWBId: chequeDetailRowsSelected[i].vatRowId,
  //             taxAmount: chequeDetailRowsSelected[i].vatAmount || 0,
  //           };
  //           updateChequeAWB.push(tempObj);
  //         }
  //         // update chequeAWB-Process Model moddhei jeita open, Bairerta----ENDS---

  //         updateChequeDetail.push(obj);
  //       }

  //       // create ChequeDetail
  //       if (!chequeDetailRowsSelected[i].chequeDetailId) {
  //         const obj: ICreateChequeDetailCommand = {
  //           collectionId: chequeDetailRowsSelected[i].collectionId,
  //           productId: chequeDetailRowsSelected[i].productId,
  //           quantity: chequeDetailRowsSelected[i].quantity,
  //           price: chequeDetailRowsSelected[i].price,
  //           createChequeHistoryCommand: [],
  //           createChequeDetail_TaxCommand: [],
  //           unitTypeId: chequeDetailRowsSelected[i].unitTypeId,
  //           companyId: userInfo?.companyId,
  //           locationId: userInfo?.locationId,
  //           discount: chequeDetailRowsSelected[i].discount || 0,
  //         };

  //         // create chequeHistory(serial) vitorer ta, chequeDetailCreate er moddhe
  //         for (
  //           let j = 0;
  //           j < chequeDetailRowsSelected[i].chequeHistoryInfoDto.length;
  //           j++
  //         ) {
  //           const tempObj: ICreateChequeHistoryCommand = {
  //             chequeDetailId: null,
  //             collectionId:
  //               chequeDetailRowsSelected[i].chequeHistoryInfoDto[j]
  //                 .collectionId || '',
  //             serialNo:
  //               chequeDetailRowsSelected[i].chequeHistoryInfoDto[j].serialNo,
  //           };
  //           obj.createChequeHistoryCommand?.push(tempObj);
  //         }

  //         // create chequeAWB-Process Model er chequeDetail er moddhe jeita, peter vetorerta
  //         if (
  //           !chequeDetailRowsSelected[i].taxRowId &&
  //           !chequeDetailRowsSelected[i].chequeDetailId
  //         ) {
  //           const tempObj: ICreateChequeAWBCommand = {
  //             chequeDetailId: null,
  //             taxId: 1,
  //             taxAmount: chequeDetailRowsSelected[i].taxAmount || 0,
  //           };
  //           obj.createChequeDetail_TaxCommand?.push(tempObj);
  //         }

  //         if (
  //           !chequeDetailRowsSelected[i].vatRowId &&
  //           !chequeDetailRowsSelected[i].chequeDetailId
  //         ) {
  //           const tempObj: ICreateChequeAWBCommand = {
  //             chequeDetailId: null,
  //             taxId: 2,
  //             taxAmount: chequeDetailRowsSelected[i].vatAmount || 0,
  //           };
  //           obj.createChequeDetail_TaxCommand?.push(tempObj);
  //         }
  //         // create chequeAWB-Process Model er chequeDetail er moddhe jeita, peter vetorerta---ENDS---

  //         createChequeDetail.push(obj);
  //       }
  //     }

  //     // delete chequeDetail, selected ones
  //     if (deletedChequeDetailRows.length) {
  //       const deletedChequeDetailRowsSelected: IDeleteChequeDetailCommand[] =
  //         deletedChequeDetailRows.filter(
  //           (w) => w.collectionId === collectionId
  //         );

  //       for (let i = 0; i < deletedChequeDetailRowsSelected.length; i++) {
  //         const obj: IDeleteChequeDetailCommand = {
  //           chequeDetailId: deletedChequeDetailRowsSelected[i].chequeDetailId,
  //         };
  //         deleteChequeDetail.push(obj);
  //       }
  //     }
  //     // delete chequeHistory, selected ones
  //     if (deletedChequeHistoryRows.length) {
  //       const deletedChequeHistoryRowsSelected: IDeleteChequeHistoryCommand[] =
  //         deletedChequeHistoryRows.filter(
  //           (w) => w.collectionId === collectionId
  //         );

  //       for (let i = 0; i < deletedChequeHistoryRowsSelected.length; i++) {
  //         const obj: IDeleteChequeHistoryCommand = {
  //           chequeHistoryId:
  //             deletedChequeHistoryRowsSelected[i].chequeHistoryId,
  //         };
  //         deleteChequeHistory.push(obj);
  //       }
  //     }

  //     // delete chequeAWB, selected ones
  //     if (deletedChequeAWBRows.length) {
  //       const deletedChequeAWBRowsSelected: IDeleteChequeAWBCommand[] =
  //         deletedChequeAWBRows.filter((w) => w.collectionId === collectionId);

  //       for (let i = 0; i < deletedChequeAWBRowsSelected.length; i++) {
  //         const obj: IDeleteChequeAWBCommand = {
  //           chequeAWBId: deletedChequeAWBRowsSelected[i].chequeAWBId,
  //         };
  //         deleteChequeAWB.push(obj);
  //       }
  //     }
  //   };

  //   // Update collection

  //   for (let i = 0; i < selectedCollectionRows.length; i++) {
  //     const prevRecordCollectionRow = collectionGridPrev.find(
  //       (w) => w.collectionId === selectedCollectionRows[i].collectionId
  //     );

  //     if (prevRecordCollectionRow !== selectedCollectionRows[i]) {
  //       const tempUpdateSO: IUpdateCollectionCommand = {
  //         collectionId: selectedCollectionRows[i].collectionId,
  //         collectedAmount: selectedCollectionRows[i].collectedAmount,
  //         buyerId: selectedCollectionRows[i].buyerId,
  //         collectionModeId: selectedCollectionRows[i].collectionModeId,
  //         invoiceDiscount: selectedCollectionRows[i].invoiceDiscount,
  //       };
  //       updateCollection.push(tempUpdateSO);
  //     }
  //     processChequeDetail(selectedCollectionRows[i].collectionId);
  //   }

  //   // --------------- The sending Obj to api----------------
  //   const sendingObj: ICollectionProcessCommandsVM = {
  //     updateCollectionCommand: [...updateCollection],
  //     deleteCollectionCommand: [],
  //     createChequeDetailCommand: [...createChequeDetail],
  //     updateChequeDetailCommand: [...updateChequeDetail],
  //     deleteChequeDetailCommand: [...deleteChequeDetail],
  //     createCollectionAdditionalCostCommand: [],

  //     updateCollectionAdditionalCostCommand: [],

  //     deleteCollectionAdditionalCostCommand: [],
  //     createBiznessEventPCTrackCommand: null,
  //     collectionId: null,
  //     createChequeHistoryCommand: [...createChequeHistory],
  //     deleteChequeHistoryCommand: [...deleteChequeHistory],
  //     createChequeDetail_TaxCommand: [...createChequeAWB],
  //     updateChequeDetail_TaxCommand: [...updateChequeAWB],
  //     deleteChequeDetail_TaxCommand: [],
  //     // deleteChequeAWBCommand: [...deleteChequeAWB], // eita lagbena, cz individually tax/vat delete korar option nei, chequeDetail delete hoilei ekmatro tax delete hobe, cascading delete ei ekmatro delete hobe. So ami alada kore pathale error khabi, j jinish suppose cascading e delete hoye gese, oita abar delete korte gele error dibe
  //   };

  //   console.log('------The ultimate Object to send------');
  //   console.log(sendingObj);

  //   if (
  //     !sendingObj.updateCollectionCommand?.length &&
  //     !sendingObj.createChequeDetailCommand?.length &&
  //     !sendingObj.updateChequeDetailCommand?.length &&
  //     !sendingObj.deleteChequeDetailCommand?.length &&
  //     !sendingObj.createChequeHistoryCommand?.length &&
  //     !sendingObj.deleteChequeHistoryCommand?.length
  //   ) {
  //     toast.info('No changes to save');
  //   } else {
  //     // API CALL HOBE
  //     processSaveCollection(sendingObj);
  //   }
  // };

  // const saveCollection = () => {
  //   console.log('collectionGrid');
  //   console.log(collectionGrid);

  //   console.log('chequeDetailRows');
  //   console.log(chequeDetailRows);

  //   console.log('deletedChequeDetailRows');
  //   console.log(deletedChequeDetailRows);
  // };

  const saveCollection = () => {
    console.log(collectionGrid); // eita abar purata ashbena, shudhu selected gula ashbe

    console.log(chequeDetailRows);
    // console.log(deletedChequeHistoryRows);

    // console.log(deletedChequeHistoryRows);

    /// ----Selected collections--------

    const selectedRows = collectionGridInitializer.getSelectedRowModel().rows;
    const selectedCollectionRows = selectedRows.map((row) => row.original);
    // console.log(selectedData);

    if (selectedCollectionRows.length === 0) {
      toast.warning('Select rows to save!');
      return;
    }

    /// /////////--------Collection Save ---------
    const updateCollection: IUpdateCollectionCommand[] = [];

    const createChequeDetail: ICreateChequeDetailCommand[] = [];
    const updateChequeDetail: IUpdateChequeDetailCommand[] = [];
    const deleteChequeDetail: IDeleteChequeDetailCommand[] = [];

    const deleteChequeHistory: IDeleteChequeHistoryCommand[] = [];
    const deleteChequeAWB: IDeleteChequeAWBCommand[] = [];

    const processChequeDetail = (collectionId: string) => {
      /// /////////--------ChequeDetail Save(Also chequeHistory save cz nested) ---------

      const selectedCDRows = chequeDetailRows.filter(
        (w) => w.collectionId === collectionId
      );

      // alert('selectedCDRows');
      // console.log('selectedCDRows');
      // console.log(selectedCDRows);
      // console.log(chequeDetailRows);

      const chequeDetailRowsSelected: IChequeDetailInfo[] = Array.isArray(
        selectedCDRows
      )
        ? selectedCDRows
        : [];

      for (let i = 0; i < chequeDetailRowsSelected.length; i++) {
        // update chequeDetail
        if (chequeDetailRowsSelected[i].chequeDetailId) {
          const obj: IUpdateChequeDetailCommand = {
            chequeDetailId: chequeDetailRowsSelected[i].chequeDetailId,
            // collectionId: chequeDetailRowsSelected[i].collectionId,

            chequeNo: chequeDetailRowsSelected[i].chequeNo,
            bankId: chequeDetailRowsSelected[i].bankId || 0,
            chequeDate: chequeDetailRowsSelected[i].chequeDate,
            chequeAmount: chequeDetailRowsSelected[i].chequeAmount,
            cqdCollected:
              chequeDetailRowsSelected[i].cqdCollected &&
              chequeDetailRowsSelected[i].cqdCollected !== 'F'
                ? chequeDetailRowsSelected[i].cqdCollected || null
                : null,
            sendDate: chequeDetailRowsSelected[i].sendDate || null,
            honorDate: chequeDetailRowsSelected[i].honorDate || null,
            date: chequeDetailRowsSelected[i].date || null,
            sendBankId: chequeDetailRowsSelected[i].sendBankId || null,
            // dateofentry: chequeDetailRowsSelected[i].dateOfEntry;
            disreason: chequeDetailRowsSelected[i].disreason || null,
            remarks: chequeDetailRowsSelected[i].remarks || null,
          };

          // // create chequeHistory-Bairerta(serial)
          // for (
          //   let j = 0;
          //   j < (chequeDetailRowsSelected[i].chequeHistories?.length || 0);
          //   j++
          // ) {
          //   if (
          //     !chequeDetailRowsSelected[i].chequeHistories?.[j]?.chequeHistoryId
          //   ) {
          //     const tempObj: ICreateChequeHistoryCommand = {
          //       chequeType:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]
          //           ?.chequeType || 'C',
          //       collectionId:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]
          //           ?.collectionId || '',
          //       chequeNo:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]?.chequeNo ||
          //         '',
          //       chequeDate:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]
          //           ?.chequeDate || '',
          //       bankId:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]?.bankId || 0,
          //       treatment:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]?.treatment ||
          //         '',
          //       treatmentDate:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]
          //           ?.treatmentDate || '',
          //       sendBankId:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]?.sendBankId,
          //       date:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]?.date || '',
          //       enteredBy: userInfo?.securityUserId,
          //       dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //       voucherId:
          //         chequeDetailRowsSelected[i].chequeHistories?.[j]?.voucherId ||
          //         null,
          //     };
          //     createChequeHistory.push(tempObj);
          //   }
          // }

          // for (
          //   let j = 0;
          //   j < (chequeDetailRowsSelected[i].chequeAWBs?.length ?? 0);
          //   j++
          // ) {
          //   if (!chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeAWBId) {
          //     const tempObj: ICreateChequeAWBCommand = {
          //       collectionId:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.collectionId ||
          //         '',
          //       chequeNo:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeNo || '',
          //       chequeAmount:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeAmount ||
          //         0,
          //       chequeDate:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeDate || '',
          //       bankId:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.bankId || 0,
          //       adjustmentDate:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.adjustmentDate ||
          //         '',
          //       buyerId:
          //         chequeDetailRowsSelected[i].chequeAWBs?.[j]?.buyerId || 0,
          //       enteredBy: userInfo?.securityUserId,
          //       dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //       companyId: userInfo?.companyId,
          //       locationId: userInfo?.locationId,
          //     };
          //     createChequeAWB.push(tempObj);
          //   }
          // }

          updateChequeDetail.push(obj);
        }

        // create ChequeDetail
        if (!chequeDetailRowsSelected[i].chequeDetailId) {
          const obj: ICreateChequeDetailCommand = {
            collectionId: chequeDetailRowsSelected[i].collectionId,
            chequeNo: chequeDetailRowsSelected[i].chequeNo,
            bankId: chequeDetailRowsSelected[i].bankId || 0,
            chequeDate: chequeDetailRowsSelected[i].chequeDate,
            chequeAmount: chequeDetailRowsSelected[i].chequeAmount,
            cqdCollected:
              chequeDetailRowsSelected[i].cqdCollected &&
              chequeDetailRowsSelected[i].cqdCollected !== 'F'
                ? chequeDetailRowsSelected[i].cqdCollected || null
                : null,
            sendDate: chequeDetailRowsSelected[i].sendDate || null,
            honorDate: chequeDetailRowsSelected[i].honorDate || null,
            date: chequeDetailRowsSelected[i].date || null,
            sendBankId: chequeDetailRowsSelected[i].sendBankId || null,
            dateofentry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
            disreason: chequeDetailRowsSelected[i].disreason || null,
            remarks: chequeDetailRowsSelected[i].remarks || null,
          };

          // // create chequeHistory(serial) vitorer ta, chequeDetailCreate er moddhe
          // for (
          //   let j = 0;
          //   j < (chequeDetailRowsSelected[i].chequeHistories?.length || 0);
          //   j++
          // ) {
          //   // if (
          //   //   !chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeAWBId
          //   // ) { //if ta bondho kora, new chequeDetail row er moddhe obosshoi history er kono id nei
          //   const tempObj: ICreateChequeHistoryCommand = {
          //     chequeType:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.chequeType ||
          //       'C',
          //     collectionId:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]
          //         ?.collectionId || '',
          //     chequeNo:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.chequeNo ||
          //       '',
          //     chequeDate:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.chequeDate ||
          //       '',
          //     bankId:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.bankId || 0,
          //     treatment:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.treatment ||
          //       '',
          //     treatmentDate:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]
          //         ?.treatmentDate || '',
          //     sendBankId:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.sendBankId,
          //     date:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.date || '',
          //     enteredBy: userInfo?.securityUserId,
          //     dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //     voucherId:
          //       chequeDetailRowsSelected[i].chequeHistories?.[j]?.voucherId ||
          //       null,
          //   };
          //   // obj.createChequeDetail_TaxCommand?.push(tempObj);
          //   createChequeHistory.push(tempObj); // kintu vitore likhini, cz dorkar nai, chequeDetailId lagena save e, cz chequeHistory table ei nei chequeDetailId
          //   // }
          // }

          // for (
          //   let j = 0;
          //   j < (chequeDetailRowsSelected[i].chequeAWBs?.length || 0);
          //   j++
          // ) {
          //   // if (
          //   //   !chequeDetailRowsSelected[i].chequeHistories?.[j]?.chequeHistoryId
          //   // ) { //if ta bondho kora, new chequeDetail row er moddhe obosshoi history er kono id nei
          //   const tempObj: ICreateChequeAWBCommand = {
          //     collectionId:
          //       chequeDetailRowsSelected[i].chequeAWBs?.[j]?.collectionId || '',
          //     chequeNo:
          //       chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeNo || '',
          //     chequeAmount:
          //       chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeAmount || 0,
          //     chequeDate:
          //       chequeDetailRowsSelected[i].chequeAWBs?.[j]?.chequeDate || '',
          //     bankId: chequeDetailRowsSelected[i].chequeAWBs?.[j]?.bankId || 0,
          //     adjustmentDate:
          //       chequeDetailRowsSelected[i].chequeAWBs?.[j]?.adjustmentDate ||
          //       '',
          //     buyerId:
          //       chequeDetailRowsSelected[i].chequeAWBs?.[j]?.buyerId || 0,
          //     enteredBy: userInfo?.securityUserId,
          //     dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
          //     companyId: userInfo?.companyId,
          //     locationId: userInfo?.locationId,
          //   };
          //   // obj.createChequeDetail_TaxCommand?.push(tempObj);
          //   createChequeAWB.push(tempObj); // kintu vitore likhini, cz dorkar nai, chequeDetailId lagena save e, cz chequeHistory table ei nei chequeDetailId
          //   // }
          // }

          createChequeDetail.push(obj);
        }
      }

      // delete chequeDetail, selected ones
      if (deletedChequeDetailRows.length) {
        const deletedChequeDetailRowsSelected: IDeleteChequeDetailCommand[] =
          deletedChequeDetailRows.filter(
            (w) => w.collectionId === collectionId
          );

        for (let i = 0; i < deletedChequeDetailRowsSelected.length; i++) {
          const obj: IDeleteChequeDetailCommand = {
            chequeDetailId: deletedChequeDetailRowsSelected[i].chequeDetailId,
            collectionId: deletedChequeDetailRowsSelected[i].collectionId,
            chequeNo: deletedChequeDetailRowsSelected[i].chequeNo,
          };
          deleteChequeDetail.push(obj);
        }
      }

      // delete chequeHistory, selected ones
      if (deletedChequeHistoryRows.length) {
        const deletedChequeHistoryRowsSelected: IDeleteChequeHistoryCommand[] =
          deletedChequeHistoryRows.filter(
            (w) => w.collectionId === collectionId
          );

        for (let i = 0; i < deletedChequeHistoryRowsSelected.length; i++) {
          const obj: IDeleteChequeHistoryCommand = {
            chequeHistoryId:
              deletedChequeHistoryRowsSelected[i].chequeHistoryId,
            collectionId: deletedChequeHistoryRowsSelected[i].collectionId,
            chequeNo: deletedChequeHistoryRowsSelected[i].chequeNo,
            buyerId: deletedChequeHistoryRowsSelected[i].buyerId,
            treatment: deletedChequeHistoryRowsSelected[i].treatment,
            bankId: deletedChequeHistoryRowsSelected[i].bankId,
            sendBankId: deletedChequeHistoryRowsSelected[i].sendBankId || null,
          };
          deleteChequeHistory.push(obj);
        }
      }

      // delete chequeAWB, selected ones
      if (deletedChequeAWBRows.length) {
        const deletedChequeAWBRowsSelected: IDeleteChequeAWBCommand[] =
          deletedChequeAWBRows.filter((w) => w.collectionId === collectionId);

        for (let i = 0; i < deletedChequeAWBRowsSelected.length; i++) {
          const obj: IDeleteChequeAWBCommand = {
            chequeAWBId: deletedChequeAWBRowsSelected[i].chequeAWBId,
          };
          deleteChequeAWB.push(obj);
        }
      }
    };

    // Update collection

    for (let i = 0; i < selectedCollectionRows.length; i++) {
      const prevRecordCollectionRow = collectionInfoData?.find(
        (w) => w.collectionId === selectedCollectionRows[i].collectionId
      );

      if (
        JSON.stringify(prevRecordCollectionRow) !==
        JSON.stringify(selectedCollectionRows[i])
      ) {
        const tempUpdateSO: IUpdateCollectionCommand = {
          collectionId: selectedCollectionRows[i].collectionId,
          buyerId: selectedCollectionRows[i].buyerId,
          date: selectedCollectionRows[i].collectionDate,
          collectionModeId: selectedCollectionRows[i].collectionModeId,
          collectedAmount: selectedCollectionRows[i].collectedAmount || 0,
          voucherId: selectedCollectionRows[i].voucherId || null,
        };
        updateCollection.push(tempUpdateSO);
      }
      processChequeDetail(selectedCollectionRows[i].collectionId);
    }

    // --------------- The sending Obj to api----------------
    const sendingObj: ICollectionProcessCommandsVM = {
      updateCollectionCommand: [...updateCollection],
      deleteCollectionCommand: [],
      createChequeDetailCommand: [...createChequeDetail],
      updateChequeDetailCommand: [...updateChequeDetail],
      deleteChequeDetailCommand: [...deleteChequeDetail],
      deleteChequeHistoryCommand: [...deleteChequeHistory],
      deleteChequeAWBCommand: [...deleteChequeAWB],
      collectionId: null,

      // createChequeHistoryCommand: [...createChequeHistory],

      // createChequeAWBCommand: [...createChequeAWB],
    };

    console.log('------The ultimate Object to send------');
    console.log(sendingObj);

    if (
      !sendingObj.updateCollectionCommand?.length &&
      !sendingObj.createChequeDetailCommand?.length &&
      !sendingObj.updateChequeDetailCommand?.length &&
      !sendingObj.deleteChequeDetailCommand?.length &&
      !sendingObj.deleteChequeHistoryCommand?.length &&
      !sendingObj.deleteChequeAWBCommand?.length
    ) {
      toast.info('No changes to save');
    } else {
      // API CALL HOBE
      processSaveCollection(sendingObj);
    }
  };

  const deleteCollection = () => {
    const selectedRows = collectionGridInitializer.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);
    console.log(selectedData);

    const deletedCollections: IDeleteCollectionCommand[] = [];
    for (let i = 0; i < selectedData.length; i++) {
      const obj: IDeleteCollectionCommand = {
        collectionId: selectedData[i].collectionId,
        buyerId: selectedData[i].buyerId,
      };
      deletedCollections.push(obj);
    }

    const sendingObj: ICollectionProcessCommandsVM = {
      updateCollectionCommand: [],
      deleteCollectionCommand: deletedCollections,
      createChequeDetailCommand: [],
      updateChequeDetailCommand: [],
      deleteChequeDetailCommand: [],
      createBiznessEventPCTrackCommand: null,
      collectionId: null,
      deleteChequeHistoryCommand: [],
      deleteChequeAWBCommand: [],
    };

    if (deletedCollections.length > 0) {
      processSaveCollection(sendingObj);
    }
  };

  const selectCollectionRowByCollectionId = (collectionId: string) => {
    if (!collectionId) return;

    const rows = collectionGridInitializer.getRowModel().rows;
    const target = rows.find((r) => r.original.collectionId === collectionId);
    if (!target) return;

    //  already selected? do nothing
    if (collectionGridInitializer.getState().rowSelection?.[target.id]) return;

    //  not selected -> add it without clearing others
    collectionGridInitializer.setRowSelection((prev) => ({
      ...(prev ?? {}),
      [target.id]: true,
    }));
  };

  // --------FUNCTIONS--------ENDS-----

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
      fontSize: '12px',
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

  const collectionGridColumns = useMemo<MRT_ColumnDef<ICollectionInfo>[]>(
    () => [
      {
        id: 'editDetail', // access nested data with dot notation
        header: 'Edit Detail',
        size: 50, // small column
        grow: false,
        enableSorting: false,
        enableColumnActions: false,
        // enableResizing: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => {
          const isCash =
            collectionGrid?.[row.index]?.collectionModeName === 'Cash';
          return (
            <div className="w-full flex justify-center">
              <Tooltip
                className={
                  row.original.collectionId && !isCash ? 'visible' : 'invisible'
                }
                arrow
                placement="right"
                title="Edit Detail"
              >
                <IconButton
                  color="error"
                  onClick={() => {
                    handleEditDetail(row.index, row.original);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.collectionNo ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.collectionNo, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'collectionNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Collection No',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="text"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: 13 },
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
        accessorFn: (row) => row.collectionModeName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.collectionModeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'collectionModeName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Collection Mode',
        Cell: ({ renderedCellValue, row }) => {
          const currentCollectionMode = {
            collectionModeId:
              collectionGrid[row.index].collectionModeId || null,
            collectionModeName:
              collectionGrid[row.index].collectionModeName || '',
          };
          const isDisabled = !collectionGrid[row.index].collectionId;
          return (
            <Controller
              name={`collectionMode_row${row.index}`}
              control={control}
              // rules={{
              //   // required: '*Required',
              //   validate: (value) => validateAccounts(value, row.original),
              // }}
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
                  disabled={isDisabled}
                  freeSolo
                  // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
                  options={
                    Array.from(
                      new Map(
                        collectionModeOptionsData?.map(
                          (collectionModeOptionRow) => [
                            collectionModeOptionRow.collectionModeId,
                            collectionModeOptionRow,
                          ]
                        )
                      ).values()
                    ) || []
                  } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
                  value={currentCollectionMode}
                  onChange={(event, selectedOption: any) => {
                    collectionGrid[row.index].collectionModeId =
                      selectedOption?.collectionModeId || null;
                    collectionGrid[row.index].collectionModeName =
                      selectedOption?.collectionModeName || '';
                    setCollectionGrid([...collectionGrid]);
                    onChange(selectedOption);
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.collectionModeName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.collectionModeId === selectedValue?.collectionModeId
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
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
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

      {
        accessorFn: (row) => row.buyerName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.buyerName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'buyerName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Buyer',
        Cell: ({ renderedCellValue, row }) => {
          const currentBuyer = {
            buyerId: collectionGrid[row.index].buyerId || null,
            buyerName: collectionGrid[row.index].buyerName || '',
          };
          const isDisabled = !collectionGrid[row.index].collectionId;
          return (
            <Controller
              name={`buyerName_row${row.index}`}
              control={control}
              // rules={{
              //   // required: '*Required',
              //   validate: (value) => validateAccounts(value, row.original),
              // }}
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
                  disabled={isDisabled}
                  // disableClearable
                  freeSolo
                  // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
                  options={
                    Array.from(
                      new Map(
                        buyerComboForGridOptions?.map(
                          (buyerComboForGridOptionRow) => [
                            buyerComboForGridOptionRow.buyerId,
                            buyerComboForGridOptionRow,
                          ]
                        )
                      ).values()
                    ) || []
                  } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
                  value={currentBuyer}
                  onChange={(event, selectedOption: any) => {
                    if (selectedOption) {
                      collectionGrid[row.index].buyerId =
                        selectedOption?.buyerId || null;
                      collectionGrid[row.index].buyerName =
                        selectedOption?.buyerName || '';
                      // -----------------setting groupName&Id------------
                      collectionGrid[row.index].buyerGroupName =
                        selectedOption?.buyerGroupName || '';
                      collectionGrid[row.index].buyerGroupId =
                        selectedOption?.buyerGroupId || '';

                      setCollectionGrid([...collectionGrid]);

                      onChange(selectedOption);
                    }
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.buyerName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.buyerId === selectedValue?.buyerId
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
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
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

      // {
      //   accessorFn: (row) => row.buyerGroupName ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.buyerGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'buyerGroupName',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Buyer Group',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },

      // {
      //   accessorFn: (row) => row.collectionAgainst ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.collectionAgainst, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'collectionAgainst',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Collection Against',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },

      {
        accessorFn: (row) => row.collectionDate ?? '',
        enableGlobalFilter: columnVisibility?.collectionDate,
        id: 'collectionDate',
        header: 'Collection Date',
        Cell: ({ row }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label=""
                inputFormat="DD/MM/YYYY"
                value={
                  row.original.collectionDate
                    ? dayjs(row.original.collectionDate)
                    : null
                }
                onChange={(newValue) => {
                  collectionGrid[row.index].collectionDate = newValue
                    ? dayjs(newValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]')
                    : '';
                  setCollectionGrid([...collectionGrid]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    sx={{
                      width: '100%',
                      mt: 1,

                      // Remove underline
                      '& .MuiInputBase-root:before, & .MuiInputBase-root:after':
                        {
                          borderBottom: 'none',
                        },

                      // Hide placeholder by default
                      '& .MuiInputBase-input::placeholder': {
                        opacity: 0,
                        color: '#bdbdbd', // light grey placeholder
                        transition: 'opacity .2s ease',
                      },

                      // Show placeholder only on hover
                      '&:hover .MuiInputBase-input::placeholder': {
                        opacity: 1,
                      },

                      // Hide icon by default
                      '& .MuiIconButton-root': {
                        opacity: 0,
                        transition: 'opacity .2s ease',
                      },

                      // Show icon on hover
                      '&:hover .MuiIconButton-root': {
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'dd/mm/yyyy', // we override it manually
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          );
        },
      },

      {
        accessorFn: (row) => row.collectedAmount ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.collectedAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'collectedAmount',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Collected Amount',
        // Cell: ({ renderedCellValue, row }) => {
        //   return (
        //     <div className="w-full flex justify-between items-center">
        //       <TextField
        //         type="text"
        //         sx={{ width: '100%' }}
        //         InputProps={{
        //           style: { fontSize: 13 },
        //           disableUnderline: true,
        //           readOnly: true,
        //         }}
        //         onBlur={(newValue) => {
        //            collectionGrid[row.index].collectedAmount =  : '';
        //           setCollectionGrid([...collectionGrid]);
        //         }}
        //         variant="standard"
        //         size="small"
        //         inputRef={(node) => {
        //           if (node) {
        //             node.value = renderedCellValue;
        //           }
        //         }}
        //       />
        //     </div>
        //   );
        // },
        Cell: ({ row }) => {
          const isCash =
            collectionGrid?.[row.index]?.collectionModeName === 'Cash';

          const setRowCollectedAmount = (next: number | 0) => {
            setCollectionGrid((prev) =>
              prev.map((r, i) =>
                i === row.index ? { ...r, collectedAmount: next } : r
              )
            );
          };

          return (
            <div className="w-full flex justify-between items-center">
              <TextField
                type="number"
                sx={{ width: '100%' }}
                variant="standard"
                size="small"
                value={collectionGrid?.[row.index]?.collectedAmount ?? ''}
                inputProps={{
                  min: 0, // helps block negative in many browsers
                  step: 0.001, // 3 decimals
                  inputMode: 'decimal',
                }}
                InputProps={{
                  style: { fontSize: 13 },
                  disableUnderline: true,
                  readOnly: !isCash,
                }}
                onChange={(e) => {
                  if (!isCash) return;

                  const v = e.target.value;

                  // block typing negative
                  if (v.startsWith('-')) return;

                  // allow empty while editing
                  if (v === '') return setRowCollectedAmount(0);

                  // allow only up to 3 decimals while typing
                  if (!/^\d*(\.\d{0,3})?$/.test(v)) return;

                  const num = Number(v);
                  if (!Number.isFinite(num) || num < 0) return;

                  setRowCollectedAmount(num);
                }}
                onBlur={(e) => {
                  if (!isCash) return;

                  const raw = (e.target.value ?? '').trim();
                  if (raw === '') return setRowCollectedAmount(0);

                  let num = Number(raw);
                  if (!Number.isFinite(num) || num < 0)
                    return setRowCollectedAmount(0);

                  // round to 3 decimals
                  num = Math.round(num * 1000) / 1000;

                  setRowCollectedAmount(num);
                }}
              />
            </div>
          );
        },
      },

      // {
      //   accessorFn: (row) => row.invoiceDiscount ?? '', // access nested data with dot notation
      //   enableGlobalFilter: columnVisibility?.invoiceDiscount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   id: 'invoiceDiscount',
      //   // accessorKey: 'transactionName', // access nested data with dot notation
      //   header: 'Invoice Discount',
      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <div className="w-full flex justify-between items-center">
      //         <TextField
      //           type="text"
      //           sx={{ width: '100%' }}
      //           InputProps={{
      //             style: { fontSize: 13 },
      //             disableUnderline: true,
      //             // readOnly: true,
      //           }}
      //           //   onBlur={(e) => {}}
      //           onBlur={(e) => {
      //             const discountTemp = Number.isNaN(parseFloat(e.target.value))
      //               ? null
      //               : Math.abs(parseFloat(e.target.value));
      //             // const collectedAmountTemp = Number.isNaN(
      //             //   parseFloat(collectionGrid[row.index]?.collectedAmount || 0)
      //             // )
      //             //   ? null
      //             //   : Math.abs(parseFloat(e.target.value));

      //             collectionGrid[row.index].collectedAmount =
      //               (collectionGrid[row.index]
      //                 .collectedAmountWithoutInvoiceDiscount || 0) -
      //               (discountTemp || 0);
      //             // (collectionGrid[row.index]?.collectedAmount || 0) -
      //             // (discountTemp || 0);

      //             setCollectionGrid([...collectionGrid]);
      //           }}
      //           variant="standard"
      //           size="small"
      //           inputRef={(node) => {
      //             if (node) {
      //               node.value = renderedCellValue;
      //             }
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },
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
  }, [sortingCollectionGrid]);

  // ---------- material table virtualization---------

  const collectionGridInitializer: MRT_TableInstance<ICollectionInfo> =
    useMaterialReactTable({
      columns: collectionGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: collectionGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading:
          isCollectionGridLoading ||
          collectionInfoIsLoading ||
          collectionInfoIsFetching,
        sorting: sortingCollectionGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 30,
      },
      enableRowSelection: (row) => {
        // if (row.original.lastProcessedDate) {
        //   toast.warning(
        //     'You cannot select/calculate commission for this buyer, as this is already processed before'
        //   );
        // }
        return !!row.original.collectionId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
      }, // enable row selection conditionally per row
      // enableRowSelection: true,
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
          fontSize: '13px',
          color: '#ea1143',
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
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '400px' } },
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
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     buyerSalesRptGridState,
                //     collectionGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(collectionGrid, collectionGridColumns);
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
      onSortingChange: setSortingCollectionGrid,
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
                  : 'Collection Edit'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-2 gap-y-1 gap-x-6 mt-5">
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
                                style: { fontSize: 13 },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: 14 },
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
                                style: { fontSize: 13 },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: 14 },
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
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
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
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
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

                {/* <Controller
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
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
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
                /> */}

                <Controller
                  name="location"
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
                      // options={[
                      //   { locationId: 0, locationName: 'Logged in Location' },
                      //   ...(Array.from(
                      //     new Map(
                      //       locationOptions?.data?.map((locationRow) => [
                      //         locationRow.locationId,
                      //         locationRow,
                      //       ])
                      //     ).values()
                      //   ) || []),
                      // ]} // Make sure it is unique
                      options={[
                        // { locationId: -1, locationName: 'All Location' },
                        { locationId: 0, locationName: 'All Location' },
                        ...(Array.from(
                          new Map(
                            locationOptions?.data
                              ?.map(({ locationId, locationName }) => ({
                                locationId,
                                locationName,
                              }))
                              .map((location) => [
                                location.locationId,
                                location,
                              ]) // ensures uniqueness
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
                        option ? option.locationName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.locationName === selectedValue?.locationName &&
                        option.locationId === selectedValue?.locationId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="standard"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
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
                  name="collectionMode"
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
                        { collectionModeId: 0, collectionModeName: 'All' },
                        ...(Array.from(
                          new Map(
                            collectionModeOptionsData?.map(
                              (collectionModeOptionRow) => [
                                collectionModeOptionRow.collectionModeName,
                                collectionModeOptionRow,
                              ]
                            )
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
                        option ? option.collectionModeName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.collectionModeName ===
                          selectedValue?.collectionModeName &&
                        option.collectionModeId ===
                          selectedValue?.collectionModeId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Collection Mode"
                          variant="standard"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
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

                <div className="grid grid-cols-2 gap-x-4">
                  {/* Amount Under */}
                  <Controller
                    name="amountOver"
                    control={control}
                    rules={{
                      // required: 'Amount Under is required',
                      validate: (value) =>
                        amountUnderTemp === undefined ||
                        value <= amountUnderTemp ||
                        'Amount Over must be less than or equal to Amount Under',
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Amount Over"
                        type="number"
                        value={value || ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          trigger(['amountUnder', 'amountOver']); // validate both
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        variant="standard"
                        size="small"
                        InputProps={{ style: { fontSize: 13 } }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />

                  {/* Amount Over */}
                  <Controller
                    name="amountUnder"
                    control={control}
                    rules={{
                      // required: 'Amount Over is required',
                      validate: (value) =>
                        amountOverTemp === undefined ||
                        value >= amountOverTemp ||
                        'Amount Under must be greater than or equal to Amount Over',
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Amount Under"
                        type="number"
                        value={value || ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          trigger(['amountUnder', 'amountOver']); // validate both
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        variant="standard"
                        size="small"
                        InputProps={{ style: { fontSize: 13 } }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
                          shrink: !!value,
                        }}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                <div className="w-full mt-4 mb-5 col-span-2 modifiedEditTable">
                  <MaterialReactTable table={collectionGridInitializer} />
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
                    disabled={processSaveCollectionIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSaveCollectionIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg active:bg-blue-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSaveCollectionIsLoading) saveCollection();
                    }}
                  >
                    {processSaveCollectionIsLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Please wait...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    disabled={processSaveCollectionIsLoading}
                    className={`inline-flex items-center justify-center px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md transform-all duration-150 ease-in-out
                    ${
                      processSaveCollectionIsLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-110 focus:bg-red-700 focus:shadow-lg active:bg-red-900 active:-translate-y-1 active:shadow-lg'
                    }`}
                    onClick={() => {
                      if (!processSaveCollectionIsLoading) deleteCollection();
                    }}
                  >
                    {processSaveCollectionIsLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Please wait...
                      </>
                    ) : (
                      'Delete'
                    )}
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

      <Modal
        open={detailEditModalInfo?.editModalOpen} // leaf view modal
        onClose={handleDetailEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',

          // transition: 'transform 0.9s ease-in',
          // transform: PreviewModalOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '95vw', // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            // backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          {/* <div className="bg-red-500">RUPOM</div> */}
          <IconButton
            aria-label="close"
            onClick={handleDetailEditModalClose}
            sx={{
              position: 'absolute',
              top: { xs: '10%', md: '2%' },
              right: { xs: '4%', md: '1%' },
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* <ChequeBookLeaf
            chequeBookInfo={currentChequeBookRow}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
          /> */}

          <ChequeDetail
            collectionGrid={collectionGrid}
            setCollectionGrid={setCollectionGrid}
            chequeDetailRows={chequeDetailRows}
            setChequeDetailRows={setChequeDetailRows}
            deletedChequeDetailRows={deletedChequeDetailRows}
            setDeletedChequeDetailRows={setDeletedChequeDetailRows}
            deletedChequeHistoryRows={deletedChequeHistoryRows}
            setDeletedChequeHistoryRows={setDeletedChequeHistoryRows}
            deletedChequeAWBRows={deletedChequeAWBRows}
            setDeletedChequeAWBRows={setDeletedChequeAWBRows}
            detailEditModalInfo={detailEditModalInfo}
            setDetailEditModalInfo={setDetailEditModalInfo}
            selectCollectionRowByCollectionId={
              selectCollectionRowByCollectionId
            }
            handleDetailEditModalClose={handleDetailEditModalClose}
          />
        </Box>
      </Modal>
    </div>

    // return wrapper div--/--
  );
};

export default CollectionEdit;
