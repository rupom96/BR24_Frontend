/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable operator-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
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
import dayjs, { Dayjs } from 'dayjs';
import { ExportToCsv } from 'export-to-csv';

import { Delete, Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import {
  useLazyGetPaymentModeOfAllLocationQuery,
  useLazyGetPaymentModeQuery,
} from '../../../../infrastructure/api/PaymentModeApiSlice';
import { useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery } from '../../../../infrastructure/api/BuyerApiSlice';
import {
  useLazyGetProductGroupByCompanyIdQuery,
  useLazyGetProductGroupQuery,
} from '../../../../infrastructure/api/ProductApiSlice';
import {
  useLazyGetSDEConfigQuery,
  useProcessDataImportMutation,
  useProcessSDEConfigurationMutation,
} from '../../../../infrastructure/api/DataMigrationApiSlice';
import {
  ICreateSDEConfigurationCommand,
  IProcessSDEConfigurationCommand,
  IUpdateSDEConfigurationCommand,
} from '../../../../domain/interfaces/SDEConfigurationInterface';
import {
  useGetAllBiznessEventsQuery,
  useLazyGetAllBiznessEventsQuery,
} from '../../../../infrastructure/api/BiznessEventApiSlice';
import {
  IPaymentModeAllLocationComboBox,
  IPaymentModeComboBox,
} from '../../../../domain/interfaces/PaymentModeInterface';
import { IBuyerGroup } from '../../../../domain/interfaces/BuyerGroupInterface';
import { IProductGroupComboBox } from '../../../../domain/interfaces/ProductInterfaces';
import PrevSalesImportManipulate from './PrevSalesImportManipulate/PrevSalesImportManipulate';

type Props = {};

const SalesImport = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  interface ISalesImportFormModel {
    selectedDataExportConfigurationId: number | null;
    dateFrom: any;
    dateTo: any;
    paymentMode: IPaymentModeAllLocationComboBox[] | [] | null;
    buyerGroup: IBuyerGroup[] | [] | null;
    productGroup: IProductGroupComboBox[] | [] | null;
    salesValue: any;
  }

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
  } = useForm<ISalesImportFormModel>({
    defaultValues: {
      selectedDataExportConfigurationId: null,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      paymentMode: [],
      buyerGroup: [],
      productGroup: [],
      salesValue: [{ salesValueName: 'All' }],
    },
  });

  const [deletePrevImportModal, setDeletePrevImportModal] =
    useState<boolean>(false);

  const handleDeletePrevImportModalClose = () => {
    setDeletePrevImportModal(false);
  };

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

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetPaymentModeOptions,
    {
      data: paymentModeOptionsData,
      error: paymentModeOptionsError,
      isError: paymentModeOptionsIsError,
      isSuccess: paymentModeOptionsIsSuccess,
      isLoading: paymentModeOptionsIsLoading,
      isFetching: paymentModeOptionsIsFetching,
    },
  ] = useLazyGetPaymentModeOfAllLocationQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (paymentModeOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching paymentModeOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching paymentModeOptionsData, see console--->:'
      );
      console.log(paymentModeOptionsError);
    }
    if (paymentModeOptionsIsSuccess) {
      console.log('paymentModeOptionsIsSuccess');

      console.log(paymentModeOptionsData);
    }
  }, [
    paymentModeOptionsData,
    paymentModeOptionsIsLoading,
    paymentModeOptionsError,
    paymentModeOptionsIsError,
    paymentModeOptionsIsFetching,
    paymentModeOptionsIsSuccess,
  ]);

  const [
    triggerGetBuyerGroupOptions,
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
    triggerGetProductGroupOptions,
    {
      data: productGroupOptionsData,
      error: productGroupOptionsError,
      isError: productGroupOptionsIsError,
      isSuccess: productGroupOptionsIsSuccess,
      isLoading: productGroupOptionsIsLoading,
      isFetching: productGroupOptionsIsFetching,
    },
  ] = useLazyGetProductGroupQuery(); // RTK Query lazy fetch

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
    triggerGetBiznessEventsOptions,
    {
      data: biznessEventsOptionsData,
      error: biznessEventsOptionsError,
      isError: biznessEventsOptionsIsError,
      isSuccess: biznessEventsOptionsIsSuccess,
      isLoading: biznessEventsOptionsIsLoading,
      isFetching: biznessEventsOptionsIsFetching,
    },
  ] = useLazyGetAllBiznessEventsQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (biznessEventsOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching biznessEventsOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching biznessEventsOptionsData, see console--->:'
      );
      console.log(biznessEventsOptionsError);
    }
    if (biznessEventsOptionsIsSuccess) {
      console.log('biznessEventsOptionsIsSuccess');

      console.log(biznessEventsOptionsData);
    }
  }, [
    biznessEventsOptionsData,
    biznessEventsOptionsIsLoading,
    biznessEventsOptionsError,
    biznessEventsOptionsIsError,
    biznessEventsOptionsIsFetching,
    biznessEventsOptionsIsSuccess,
  ]);

  const salesBiznessEventId =
    biznessEventsOptionsData?.data?.find((item) => item.name === 'Sales')
      ?.biznessEventId ?? 0;

  // fetching SDE_Config Data
  const [
    triggerFetchSDEConfigSaved,
    {
      data: sdeConfigSaved,
      error: sdeConfigSavedError,
      isError: sdeConfigSavedIsError,
      isSuccess: sdeConfigSavedIsSuccess,
      isLoading: sdeConfigSavedIsLoading,
      isFetching: sdeConfigSavedIsFetching,
    },
  ] = useLazyGetSDEConfigQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (sdeConfigSavedIsError) {
      toast.error(
        'Something wrong from backend while fetching sdeConfigSavedData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching sdeConfigSavedData, see console--->:'
      );
      console.log(sdeConfigSavedError);
    }
    if (sdeConfigSavedIsSuccess) {
      console.log('sdeConfigSavedIsSuccess');

      console.log(sdeConfigSaved);
    }
  }, [
    sdeConfigSaved,
    sdeConfigSavedIsLoading,
    sdeConfigSavedError,
    sdeConfigSavedIsError,
    sdeConfigSavedIsFetching,
    sdeConfigSavedIsSuccess,
  ]);

  // --- helpers ---
  const csvToIdSet = (csv?: string | null) => {
    const s = new Set<number>();
    if (!csv) return s;
    for (const part of csv.split(',')) {
      const n = Number(String(part).trim());
      if (Number.isFinite(n)) s.add(n);
    }
    return s;
  };

  const intersects = (a: Set<number>, b: Set<number>) => {
    for (const v of a) if (b.has(v)) return true;
    return false;
  };

  // If you also need to produce a union CSV when saving:
  const unionIdsToCsv = (ids: Iterable<number>) =>
    Array.from(new Set(ids))
      .sort((x, y) => x - y)
      .join(',');

  const csvToIds = (csv?: string | null) =>
    (csv ?? '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));

  const salesRangesToLabels = (cfg: any) => {
    const labels: { salesValueName: string }[] = [];

    const addIf = (
      min: number | null,
      max: number | null,
      label: string,
      expectMin: number | null,
      expectMax: number | null
    ) => {
      if (min === expectMin && max === expectMax)
        labels.push({ salesValueName: label });
    };

    // match the same ranges you used when saving:
    addIf(cfg?.amountRange1Min, cfg?.amountRange1Max, 'Under 10k', 0, 9999);
    addIf(cfg?.amountRange2Min, cfg?.amountRange2Max, '10k-50k', 10000, 49999);
    addIf(
      cfg?.amountRange3Min,
      cfg?.amountRange3Max,
      '50k-150k',
      50000,
      149999
    );
    addIf(
      cfg?.amountRange4Min,
      cfg?.amountRange4Max,
      'Above 150k',
      150000,
      null
    );

    // If all 4 are present, collapse to just “All”
    if (labels.length === 4) return [{ salesValueName: 'All' }];
    return labels;
  };

  const optionsReady =
    Array.isArray(paymentModeOptionsData) &&
    Array.isArray(buyerGroupOptionsData) &&
    Array.isArray(productGroupOptionsData);

  useEffect(() => {
    if (!sdeConfigSavedIsSuccess || !sdeConfigSaved || !optionsReady) return;

    // 1) map CSV ids to actual option objects
    // const pmIds = csvToIds(sdeConfigSaved.paymentModeId);
    const savedPmIdSet = csvToIdSet(sdeConfigSaved.paymentModeId);
    const bgIds = csvToIds(sdeConfigSaved.buyerGroupId);
    const pgIds = csvToIds(sdeConfigSaved.productGroupId);

    // const selectedPaymentModes = (paymentModeOptionsData ?? []).filter(
    //   (o: any) => pmIds.includes(o.paymentModeId)
    // );

    // 2) map options
    const selectedPaymentModes = (paymentModeOptionsData ?? []).filter(
      (o: any) => {
        // o.paymentModeId is now a CSV string like "1,5,8,4,10,20"
        const optionIdSet = csvToIdSet(o.paymentModeId);
        return intersects(optionIdSet, savedPmIdSet);
      }
    );

    const selectedBuyerGroups = (buyerGroupOptionsData ?? []).filter((o: any) =>
      bgIds.includes(o.buyerGroupId)
    );
    const selectedProductGroups = (productGroupOptionsData ?? []).filter(
      (o: any) => pgIds.includes(o.productGroupId)
    );

    // 2) rebuild Sales Value from the amount ranges
    const selectedSalesValues = salesRangesToLabels(sdeConfigSaved);

    // 3) set values without marking dirty or re-validating
    setValue(
      'selectedDataExportConfigurationId',
      sdeConfigSaved?.selectedDataExportConfigurationId || null,
      {
        shouldDirty: false,
        shouldValidate: false,
      }
    );
    setValue('paymentMode', selectedPaymentModes, {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue('buyerGroup', selectedBuyerGroups, {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue('productGroup', selectedProductGroups, {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue('salesValue', selectedSalesValues, {
      shouldDirty: false,
      shouldValidate: false,
    });

    // (Optional) If your saved config also stores dates:
    // setValue('dateFrom', sdeConfigSaved.dateFrom ? dayjs(sdeConfigSaved.dateFrom) : null, { shouldDirty: false, shouldValidate: false });
    // setValue('dateTo',   sdeConfigSaved.dateTo   ? dayjs(sdeConfigSaved.dateTo)   : null, { shouldDirty: false, shouldValidate: false });
  }, [
    sdeConfigSavedIsSuccess,
    sdeConfigSaved,
    optionsReady,
    paymentModeOptionsData,
    buyerGroupOptionsData,
    productGroupOptionsData,
    setValue,
  ]);

  // fetching SDE_Config Data Ends...

  // eitar naam processDataImport hoileo, eita ashole dataImport
  // const [
  //   triggerProcessDataImport,
  //   {
  //     data: processDataImportData,
  //     error: processDataImportError,
  //     isError: processDataImportIsError,
  //     isSuccess: processDataImportIsSuccess,
  //     isLoading: processDataImportIsLoading,
  //     isFetching: processDataImportIsFetching,
  //   },
  // ] = useLazyProcessDataImportQuery(); // RTK Query lazy fetch

  const [
    triggerProcessDataImport,
    {
      isLoading: processDataImportIsLoading,
      isError: processDataImportIsError,
      error: processDataImportError,
      isSuccess: processDataImportIsSuccess,
      data: processDataImportData,
    },
  ] = useProcessDataImportMutation();

  useEffect(() => {
    if (processDataImportIsError) {
      toast.error(
        'Something wrong from backend while fetching processDataImportData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching processDataImportData, see console--->:'
      );
      console.log(processDataImportError);
    }
    if (
      processDataImportIsSuccess &&
      !processDataImportIsLoading &&
      !processDataImportIsError
    ) {
      console.log('processDataImportIsSuccess');
      Swal.fire({
        title: `Data Imported successfully accroding to SDE Config!`,
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
          console.log(processDataImportData);
        }
      });
    }
  }, [
    processDataImportData,
    processDataImportIsLoading,
    processDataImportError,
    processDataImportIsError,
    processDataImportIsSuccess,
  ]);

  // const [
  //   processDataImport,
  //   {
  //     isLoading: processDataImportIsLoading,
  //     isError: processDataImportIsError,
  //     error: processDataImportError,
  //     isSuccess: processDataImportIsSuccess,
  //     data: processDataImportData,
  //   },
  // ] = useProcessDataImportMutation();

  // useEffect(() => {
  //   // if (!processDataImportIsLoading) {
  //   //   // loading kisu dekha
  //   //   setLoaderSpinner(true);
  //   // } else {
  //   //   setLoaderSpinner(false);
  //   // }

  //   if (processDataImportIsSuccess) {
  //     // setLoaderSpinnerForThisPage(false);
  //     Swal.fire({
  //       title: `Data Imported successfully accroding to SDE Config!`,
  //       text: '',
  //       showDenyButton: false,
  //       allowOutsideClick: false,
  //       // target: 'body',
  //       icon: 'success',
  //       showCancelButton: false,
  //       confirmButtonText: 'OK!',
  //       // denyButtonText: `No, I will set it manually!`,
  //     }).then((result) => {
  //       /* Read more about isConfirmed, isDenied below */
  //       if (result.isConfirmed) {
  //         // modalPageOpenerClose();
  //         console.log(
  //           'check data after Data Imported success, see console---->'
  //         );
  //         console.log(processDataImportData);
  //       }
  //     });
  //   } else if (processDataImportIsError) {
  //     // setLoaderSpinnerForThisPage(false);
  //     toast.error(
  //       'Something is wrong in backend while saving processDataImport , see console---->'
  //     );
  //     console.log(
  //       'Something is wrong in backend while saving processDataImport , see console---->'
  //     );
  //     console.log(processDataImportError);
  //   }
  // }, [
  //   processDataImportIsLoading,
  //   processDataImportIsError,
  //   processDataImportData,
  //   processDataImportError,
  //   processDataImportIsSuccess,
  // ]);

  const [
    processSDEConfig,
    {
      isLoading: processSDEConfigIsLoading,
      isError: processSDEConfigIsError,
      error: processSDEConfigError,
      isSuccess: processSDEConfigIsSuccess,
      data: processSDEConfigData,
    },
  ] = useProcessSDEConfigurationMutation();

  useEffect(() => {
    if (processSDEConfigIsSuccess) {
      Swal.fire({
        title: `SDE Config have been saved successfully!`,
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
          console.log(processSDEConfigData);
        }
      });
    } else if (processSDEConfigIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving processSDEConfig data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving processSDEConfig data, see console---->'
      );
      console.log(processSDEConfigError);
    }
  }, [
    processSDEConfigIsLoading,
    processSDEConfigIsError,
    processSDEConfigData,
    processSDEConfigError,
    processSDEConfigIsSuccess,
  ]);

  // Loading states
  const isSaving = processSDEConfigIsLoading; // from useProcessSDEConfigurationMutation
  const isImporting = processDataImportIsLoading; // from useLazyProcessDataImportQuery
  const isHydrating =
    sdeConfigSavedIsFetching || !sdeConfigSavedIsSuccess || !optionsReady;

  // Then include isHydrating in your Backdrop `open={isBusy || isHydrating}`
  // and message like: isHydrating ? 'Loading saved configuration…' : (isSaving ? 'Saving…' : 'Importing…')

  const isBusy = isSaving || isImporting || isHydrating;

  // -----------------------------------API HOOK INIT------------------ENDSS-----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  useEffect(() => {
    // Trigger your RTK Query

    // triggerGetPaymentModeOptions
    triggerGetPaymentModeOptions({
      companyId: userInfo?.companyId,
    });

    // triggerGetBuyerGroupOptions
    triggerGetBuyerGroupOptions({
      companyId: userInfo?.companyId,
      // locationId: userInfo?.locationId || null,
    });

    // triggerGetBuyerGroupOptions
    triggerGetProductGroupOptions({
      companyId: userInfo?.companyId,
      // locationId: userInfo?.locationId || null,
    });

    triggerGetBiznessEventsOptions();
  }, []);

  useEffect(() => {
    // Fetch the saved config for the page (no date range here)
    triggerFetchSDEConfigSaved({
      companyId: userInfo.companyId,
      biznessEventId: salesBiznessEventId ?? 0,
    });
  }, [
    userInfo?.companyId,
    triggerFetchSDEConfigSaved,
    biznessEventsOptionsData?.data,
    biznessEventsOptionsIsSuccess,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  const saveImportConfig = () => {
    console.log('Yo yo Lucy');
    console.log(watchedFields);
    console.log(biznessEventsOptionsData);
    let sendingCreateObj: ICreateSDEConfigurationCommand | null = null;
    let sendingUpdateObj: IUpdateSDEConfigurationCommand | null = null;

    // Create SDE_Config
    if (!watchedFields?.selectedDataExportConfigurationId) {
      sendingCreateObj = {
        companyId: userInfo?.companyId,
        biznessEventId: salesBiznessEventId ?? 0,
        paymentModeId:
          watchedFields.paymentMode
            ?.map((pm: any) => pm.paymentModeId)
            .join(',') ?? null,
        buyerGroupId:
          watchedFields.buyerGroup
            ?.map((bg: any) => bg.buyerGroupId)
            .join(',') ?? null,
        productGroupId:
          watchedFields.productGroup
            ?.map((pg: any) => pg.productGroupId)
            .join(',') ?? null,
        amountRange1Min: null,
        amountRange1Max: null,
        amountRange2Min: null,
        amountRange2Max: null,
        amountRange3Min: null,
        amountRange3Max: null,
        amountRange4Min: null,
        amountRange4Max: null,
        updateBy: userInfo?.securityUserId,
      };

      for (const item of watchedFields?.salesValue ?? []) {
        if (item?.salesValueName === 'Under 10k') {
          sendingCreateObj.amountRange1Min = 0;
          sendingCreateObj.amountRange1Max = 9999;
        }
        if (item?.salesValueName === '10k-50k') {
          sendingCreateObj.amountRange2Min = 10000;
          sendingCreateObj.amountRange2Max = 49999;
        }
        if (item?.salesValueName === '50k-150k') {
          sendingCreateObj.amountRange3Min = 50000;
          sendingCreateObj.amountRange3Max = 149999;
        }
        if (item?.salesValueName === 'Above 150k') {
          sendingCreateObj.amountRange4Min = 150000;
          sendingCreateObj.amountRange4Max = null;
        }
        if (item?.salesValueName === 'All') {
          sendingCreateObj.amountRange1Min = 0;
          sendingCreateObj.amountRange1Max = 9999;
          sendingCreateObj.amountRange2Min = 10000;
          sendingCreateObj.amountRange2Max = 49999;
          sendingCreateObj.amountRange3Min = 50000;
          sendingCreateObj.amountRange3Max = 149999;
          sendingCreateObj.amountRange4Min = 150000;
          sendingCreateObj.amountRange4Max = null;
        }
      }
    }
    // Update SDE_Config
    else if (watchedFields?.selectedDataExportConfigurationId) {
      sendingUpdateObj = {
        selectedDataExportConfigurationId:
          watchedFields?.selectedDataExportConfigurationId,
        companyId: sdeConfigSaved?.companyId || null,
        biznessEventId: sdeConfigSaved?.biznessEventId || null,
        paymentModeId:
          watchedFields.paymentMode
            ?.map((pm: any) => pm.paymentModeId)
            .join(',') ?? null,
        buyerGroupId:
          watchedFields.buyerGroup
            ?.map((bg: any) => bg.buyerGroupId)
            .join(',') ?? null,
        productGroupId:
          watchedFields.productGroup
            ?.map((pg: any) => pg.productGroupId)
            .join(',') ?? null,
        amountRange1Min: null,
        amountRange1Max: null,
        amountRange2Min: null,
        amountRange2Max: null,
        amountRange3Min: null,
        amountRange3Max: null,
        amountRange4Min: null,
        amountRange4Max: null,
        updateBy: userInfo?.securityUserId,
      };

      for (const item of watchedFields?.salesValue ?? []) {
        if (item?.salesValueName === 'Under 10k') {
          sendingUpdateObj.amountRange1Min = 0;
          sendingUpdateObj.amountRange1Max = 9999;
        }
        if (item?.salesValueName === '10k-50k') {
          sendingUpdateObj.amountRange2Min = 10000;
          sendingUpdateObj.amountRange2Max = 49999;
        }
        if (item?.salesValueName === '50k-150k') {
          sendingUpdateObj.amountRange3Min = 50000;
          sendingUpdateObj.amountRange3Max = 149999;
        }
        if (item?.salesValueName === 'Above 150k') {
          sendingUpdateObj.amountRange4Min = 150000;
          sendingUpdateObj.amountRange4Max = null;
        }
        if (item?.salesValueName === 'All') {
          sendingUpdateObj.amountRange1Min = 0;
          sendingUpdateObj.amountRange1Max = 9999;
          sendingUpdateObj.amountRange2Min = 10000;
          sendingUpdateObj.amountRange2Max = 49999;
          sendingUpdateObj.amountRange3Min = 50000;
          sendingUpdateObj.amountRange3Max = 149999;
          sendingUpdateObj.amountRange4Min = 150000;
          sendingUpdateObj.amountRange4Max = null;
        }
      }
    }

    const sendingObj: IProcessSDEConfigurationCommand = {
      createCommand: sendingCreateObj,
      updateCommand: sendingUpdateObj,
    };

    console.log('sendingObj');
    console.log(sendingObj);
    processSDEConfig(sendingObj);
  };

  const dataImportButton = () => {
    console.log('watchFields');
    console.log(watchedFields);

    const fromDate = watchedFields?.dateFrom
      ? dayjs(watchedFields.dateFrom)
      : dayjs();
    const toDate = watchedFields?.dateTo
      ? dayjs(watchedFields.dateTo)
      : dayjs();

    //  Validation using toast
    if (fromDate.isAfter(toDate)) {
      toast.warning('From date must be earlier than To date.');
      return;
    }

    triggerProcessDataImport({
      companyId: userInfo?.companyId,
      biznessEventId: salesBiznessEventId ?? 0,
      toDate: watchedFields?.dateTo
        ? dayjs(watchedFields?.dateTo)
            .endOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSS')
        : dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      fromDate: watchedFields?.dateFrom
        ? dayjs(watchedFields?.dateFrom)
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSS')
        : dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS'),
    });
  };

  // --------FUNCTIONS--------ENDS-----

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
                  : 'Sales Import'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1 gap-x-6 mt-5">
                <div className="grid grid-cols-2 gap-x-4">
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
                  name="paymentMode"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      multiple //  Enable multi select
                      size="small"
                      loading={false}
                      // options={[
                      //   { paymentModeId: 1, paymentModeName: 'RupomBuyer' },
                      //   { paymentModeId: 2, paymentModeName: 'Rupom1Buyer' },
                      //   { paymentModeId: 3, paymentModeName: 'Rupom2Buyer' },
                      // ]} // Replace with tenderComboOptions
                      options={paymentModeOptionsData || []}
                      value={value || []} //  Ensure it's an array
                      onChange={(event, selectedItems) => {
                        onChange(selectedItems); //  Pass whole array to RHF
                      }}
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.paymentModeName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.paymentModeId === selectedValue?.paymentModeId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Mode"
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
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="buyerGroup"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      multiple //  Enable multi select
                      size="small"
                      loading={false}
                      options={buyerGroupOptionsData || []} // Replace with tenderComboOptions
                      value={value || []} //  Ensure it's an array
                      onChange={(event, selectedItems) => {
                        onChange(selectedItems); //  Pass whole array to RHF
                      }}
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.buyerGroupName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
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
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="salesValue"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      multiple //  Enable multi select
                      size="small"
                      loading={false}
                      options={[
                        { salesValueName: 'All' },
                        { salesValueName: 'Under 10k' },
                        { salesValueName: '10k-50k' },
                        { salesValueName: '50k-150k' },
                        { salesValueName: 'Above 150k' },
                      ]} // Replace with tenderComboOptions
                      value={value || []} //  Ensure it's an array
                      onChange={(event, selectedItems) => {
                        //  If "All" is selected, keep only "All"
                        const hasAll = selectedItems.some(
                          (item) => item.salesValueName === 'All'
                        );

                        if (hasAll) {
                          onChange([{ salesValueName: 'All' }]);
                        } else {
                          onChange(selectedItems);
                        }
                      }}
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.salesValueName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.salesValueName === selectedValue?.salesValueName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Value"
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
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="productGroup"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      multiple //  Enable multi select
                      size="small"
                      loading={false}
                      options={productGroupOptionsData || []} // Replace with tenderComboOptions
                      value={value || []} //  Ensure it's an array
                      onChange={(event, selectedItems) => {
                        onChange(selectedItems); //  Pass whole array to RHF
                      }}
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.productGroupName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.productGroupId === selectedValue?.productGroupId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product Group"
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
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={saveImportConfig}
                    disabled={isBusy}
                  >
                    {isSaving && <CircularProgress size={16} thickness={5} />}
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={dataImportButton}
                    disabled={isBusy}
                  >
                    {isImporting && (
                      <CircularProgress size={16} thickness={5} />
                    )}
                    {isImporting ? 'Importing…' : 'Data Import'}
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => {
                      setDeletePrevImportModal(true);
                    }}
                    disabled={isBusy}
                  >
                    {/* {isImporting && (
                      <CircularProgress size={16} thickness={5} />
                    )}
                    {isImporting ? 'Importing…' : 'Data Import'} */}
                    Delete Prev Imports
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
        open={deletePrevImportModal} // delete Prev import modal
        onClose={handleDeletePrevImportModalClose}
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
            width: '50vw', // Set the width of the modal to full screen
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
            onClick={handleDeletePrevImportModalClose}
            sx={{
              position: 'absolute',
              top: { xs: '10%', md: '2%' },
              right: { xs: '4%', md: '1%' },
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>

          <PrevSalesImportManipulate biznessEventId={salesBiznessEventId} />
        </Box>
      </Modal>

      <Backdrop
        open={isBusy}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <CircularProgress color="inherit" />
        <Box sx={{ ml: 2 }}>
          {isHydrating
            ? 'Loading saved configuration…'
            : isSaving
              ? 'Saving configuration…'
              : isImporting
                ? 'Importing data…'
                : ''}
        </Box>
      </Backdrop>
    </div>

    // return wrapper div--/--
  );
};

export default SalesImport;
