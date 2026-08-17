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
// import {
//   useLazyGetPaymentModeOfAllLocationQuery,
//   useLazyGetPaymentModeQuery,
// } from '../../../../infrastructure/api/PaymentModeApiSlice';
import { useLazyGetBuyerGroupByCompanyBuyerSalesPersonDepartmentIdQuery } from '../../../../infrastructure/api/BuyerApiSlice';

import {
  useLazyGetSDEConfigQuery,
  useProcessVoucherDataImportMutation,
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
// import {
//   IPaymentModeAllLocationComboBox,
//   IPaymentModeComboBox,
// } from '../../../../domain/interfaces/PaymentModeInterface';

import PrevVoucherImportManipulate from './PrevVoucherImportManipulate/PrevVoucherImportManipulate';
import {
  ICreateSDEAccMapping,
  IDeleteSDEAccMapping,
  ISDEAccMapping,
  IUpdateSDEAccMapping,
} from '../../../../domain/interfaces/SDEAccMappingInterface';
import { useLazyGetAllAccountsNameByCompanyIdQuery } from '../../../../infrastructure/api/AccountsNameApiSlice';

type Props = {};

const VoucherImport = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  interface IVoucherImportFormModel {
    selectedDataExportConfigurationId: number | null;
    dateFrom: any;
    dateTo: any;
    voucherValue: any;
    voucherType: any;
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
  } = useForm<IVoucherImportFormModel>({
    defaultValues: {
      selectedDataExportConfigurationId: null,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      // paymentMode: [],
      // buyerGroup: [],
      // productGroup: [],
      voucherValue: [{ voucherValueName: 'All' }],
      voucherType: [{ voucherTypeName: 'All' }],
    },
  });

  const [deletePrevImportModal, setDeletePrevImportModal] =
    useState<boolean>(false);

  const handleDeletePrevImportModalClose = () => {
    setDeletePrevImportModal(false);
  };

  const [sdeAccMappingGrid, setSdeAccMappingGrid] = useState<ISDEAccMapping[]>(
    []
  );

  const [deletedRowSdeAccMapping, setDeletedRowSdeAccMapping] = useState<
    IDeleteSDEAccMapping[]
  >([]);

  //   grid virtualization states
  const [sortingSdeAccMappingGrid, setSortingSdeAccMappingGrid] =
    useState<MRT_SortingState>([]);

  const [isSdeAccMappingGridLoading, setIsSdeAccMappingGridLoading] =
    useState<boolean>(false);
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

  // const [
  //   triggerGetPaymentModeOptions,
  //   {
  //     data: paymentModeOptionsData,
  //     error: paymentModeOptionsError,
  //     isError: paymentModeOptionsIsError,
  //     isSuccess: paymentModeOptionsIsSuccess,
  //     isLoading: paymentModeOptionsIsLoading,
  //     isFetching: paymentModeOptionsIsFetching,
  //   },
  // ] = useLazyGetPaymentModeOfAllLocationQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (paymentModeOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching paymentModeOptionsData, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching paymentModeOptionsData, see console--->:'
  //     );
  //     console.log(paymentModeOptionsError);
  //   }
  //   if (paymentModeOptionsIsSuccess) {
  //     console.log('paymentModeOptionsIsSuccess');

  //     console.log(paymentModeOptionsData);
  //   }
  // }, [
  //   paymentModeOptionsData,
  //   paymentModeOptionsIsLoading,
  //   paymentModeOptionsError,
  //   paymentModeOptionsIsError,
  //   paymentModeOptionsIsFetching,
  //   paymentModeOptionsIsSuccess,
  // ]);

  const [
    triggerGetAccountsOptions,
    {
      data: accountsOptionsData,
      error: accountsOptionsError,
      isError: accountsOptionsIsError,
      isSuccess: accountsOptionsIsSuccess,
      isLoading: accountsOptionsIsLoading,
      isFetching: accountsOptionsIsFetching,
    },
  ] = useLazyGetAllAccountsNameByCompanyIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (accountsOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching accountsOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching accountsOptionsData, see console--->:'
      );
      console.log(accountsOptionsError);
    }
    if (accountsOptionsIsSuccess) {
      console.log('accountsOptionsIsSuccess');

      console.log(accountsOptionsData);
    }
  }, [
    accountsOptionsData,
    accountsOptionsIsLoading,
    accountsOptionsError,
    accountsOptionsIsError,
    accountsOptionsIsFetching,
    accountsOptionsIsSuccess,
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

  const voucherBiznessEventId =
    biznessEventsOptionsData?.data?.find((item) => item.name === 'Voucher')
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

  const voucherRangesToLabels = (cfg: any) => {
    const labels: { voucherValueName: string }[] = [];

    const addIf = (
      min: number | null,
      max: number | null,
      label: string,
      expectMin: number | null,
      expectMax: number | null
    ) => {
      if (min === expectMin && max === expectMax)
        labels.push({ voucherValueName: label });
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
    if (labels.length === 4) return [{ voucherValueName: 'All' }];
    return labels;
  };

  type VoucherType = {
    voucherTypeName: string;
  };

  const voucherTypeToLabel = (csv?: string | null): VoucherType[] => {
    return (csv ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => ({ voucherTypeName: s }));
  };

  const optionsReady =
    // Array.isArray(paymentModeOptionsData) &&
    Array.isArray(accountsOptionsData);

  useEffect(() => {
    if (!sdeConfigSavedIsSuccess || !sdeConfigSaved || !optionsReady) return;

    if (typeof window !== 'undefined') {
      setIsSdeAccMappingGridLoading(false);
    } else {
      setIsSdeAccMappingGridLoading(true);
    }

    const selectedVoucherTypes = voucherTypeToLabel(
      sdeConfigSaved?.eventTypeId
    );

    // 2) rebuild Voucher Value from the amount ranges
    const selectedVoucherValues = voucherRangesToLabels(sdeConfigSaved);

    // 3) set values without marking dirty or re-validating
    setValue(
      'selectedDataExportConfigurationId',
      sdeConfigSaved?.selectedDataExportConfigurationId || null,
      {
        shouldDirty: false,
        shouldValidate: false,
      }
    );
    // setValue('paymentMode', selectedPaymentModes, {
    //   shouldDirty: false,
    //   shouldValidate: false,
    // });
    // setValue('buyerGroup', selectedBuyerGroups, {
    //   shouldDirty: false,
    //   shouldValidate: false,
    // });
    // setValue('accountHead', selectedAccounts, {
    //   shouldDirty: false,
    //   shouldValidate: false,
    // });
    setValue('voucherValue', selectedVoucherValues, {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('voucherType', selectedVoucherTypes, {
      shouldDirty: false,
      shouldValidate: false,
    });

    // populating the table

    const copyOfSdeAccMappingRow = sdeConfigSaved?.sdeAccMappingRows
      ? JSON.parse(JSON.stringify(sdeConfigSaved?.sdeAccMappingRows))
      : [];

    while (copyOfSdeAccMappingRow.length < 10) {
      copyOfSdeAccMappingRow.push({
        sdeAccMappingId: null,
        sourceCompanyId: null,
        sourceAccId: null,
        sourceAccName: null,
        destinationAccId: null,
        destinationAccName: null,
        selectedDataExportConfigurationId: null,
      });
    }
    setSdeAccMappingGrid([...copyOfSdeAccMappingRow]);
  }, [
    sdeConfigSavedIsSuccess,
    sdeConfigSaved,
    optionsReady,
    // paymentModeOptionsData,
    // buyerGroupOptionsData,
    // productGroupOptionsData,
    setValue,
  ]);

  // fetching SDE_Config Data Ends...

  const [
    triggerProcessDataImport,
    {
      isLoading: processDataImportIsLoading,
      isError: processDataImportIsError,
      error: processDataImportError,
      isSuccess: processDataImportIsSuccess,
      data: processDataImportData,
    },
  ] = useProcessVoucherDataImportMutation();

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
          setDeletedRowSdeAccMapping([]);
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
          setDeletedRowSdeAccMapping([]);
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

    // triggerGetBuyerGroupOptions
    // triggerGetBuyerGroupOptions({
    //   companyId: userInfo?.companyId,
    //   // locationId: userInfo?.locationId || null,
    // });

    // triggerGetBuyerGroupOptions
    triggerGetAccountsOptions({
      companyId: userInfo?.companyId,
      // locationId: userInfo?.locationId || null,
    });

    triggerGetBiznessEventsOptions();
  }, []);

  useEffect(() => {
    // Fetch the saved config for the page (no date range here)
    triggerFetchSDEConfigSaved({
      companyId: userInfo.companyId,
      biznessEventId: voucherBiznessEventId ?? 0,
    });
  }, [
    userInfo?.companyId,
    triggerFetchSDEConfigSaved,
    biznessEventsOptionsData?.data,
    biznessEventsOptionsIsSuccess,
  ]);

  // -----------------------------------API CALL (LAZY)------------------ENDSS-----------------------

  // --------FUNCTIONS-------------

  // const saveImportConfig = () => {
  //   console.log('Yo yo Lucy');
  //   console.log(watchedFields);
  //   console.log(biznessEventsOptionsData);
  //   let sendingCreateObj: ICreateSDEConfigurationCommand | null = null;
  //   let sendingUpdateObj: IUpdateSDEConfigurationCommand | null = null;

  //   // Create SDE_Config
  //   if (!watchedFields?.selectedDataExportConfigurationId) {
  //     sendingCreateObj = {
  //       companyId: userInfo?.companyId,
  //       biznessEventId: voucherBiznessEventId ?? 0,
  //       // paymentModeId:
  //       //   watchedFields.paymentMode
  //       //     ?.map((pm: any) => pm.paymentModeId)
  //       //     .join(',') ?? null,
  //       // buyerGroupId:
  //       //   watchedFields.buyerGroup
  //       //     ?.map((bg: any) => bg.buyerGroupId)
  //       //     .join(',') ?? null,
  //       // productGroupId:
  //       //   watchedFields.productGroup
  //       //     ?.map((pg: any) => pg.productGroupId)
  //       //     .join(',') ?? null,
  //       eventTypeId:
  //         watchedFields.voucherType
  //           ?.map((vt: any) => vt.voucherTypeName)
  //           .join(',') ?? null,
  //       amountRange1Min: null,
  //       amountRange1Max: null,
  //       amountRange2Min: null,
  //       amountRange2Max: null,
  //       amountRange3Min: null,
  //       amountRange3Max: null,
  //       amountRange4Min: null,
  //       amountRange4Max: null,
  //       updateBy: userInfo?.securityUserId,
  //       createSDEAccMapping: [],
  //     };

  //     for (const item of watchedFields?.voucherValue ?? []) {
  //       if (item?.voucherValueName === 'Under 10k') {
  //         sendingCreateObj.amountRange1Min = 0;
  //         sendingCreateObj.amountRange1Max = 9999;
  //       }
  //       if (item?.voucherValueName === '10k-50k') {
  //         sendingCreateObj.amountRange2Min = 10000;
  //         sendingCreateObj.amountRange2Max = 49999;
  //       }
  //       if (item?.voucherValueName === '50k-150k') {
  //         sendingCreateObj.amountRange3Min = 50000;
  //         sendingCreateObj.amountRange3Max = 149999;
  //       }
  //       if (item?.voucherValueName === 'Above 150k') {
  //         sendingCreateObj.amountRange4Min = 150000;
  //         sendingCreateObj.amountRange4Max = null;
  //       }
  //       if (item?.voucherValueName === 'All') {
  //         sendingCreateObj.amountRange1Min = 0;
  //         sendingCreateObj.amountRange1Max = 9999;
  //         sendingCreateObj.amountRange2Min = 10000;
  //         sendingCreateObj.amountRange2Max = 49999;
  //         sendingCreateObj.amountRange3Min = 50000;
  //         sendingCreateObj.amountRange3Max = 149999;
  //         sendingCreateObj.amountRange4Min = 150000;
  //         sendingCreateObj.amountRange4Max = null;
  //       }
  //     }

  //     // SDEAccMapping Table process-------START--------

  //     const sdeAccMappingValidEntries = sdeAccMappingGrid.filter(
  //       (w) => !!w.sourceAccId === true
  //     );

  //     const copyOfsdeAccMappingValidEntries: ISDEAccMapping[] =
  //       sdeAccMappingValidEntries
  //         ? JSON.parse(JSON.stringify(sdeAccMappingValidEntries))
  //         : [];

  //     for (let i = 0; i < copyOfsdeAccMappingValidEntries.length; i++) {
  //       if (!copyOfsdeAccMappingValidEntries[i]?.sdeAccMappingId) {
  //         // create
  //         const tempSDEAccMappingObj: ICreateSDEAccMapping = {
  //           sourceCompanyId: userInfo?.companyId,
  //           sourceAccId: copyOfsdeAccMappingValidEntries[i].sourceAccId || 0,
  //           destinationAccId:
  //             copyOfsdeAccMappingValidEntries[i].destinationAccId || null,
  //           selectedDataExportConfigurationId:
  //             watchedFields?.selectedDataExportConfigurationId || 0,
  //         };
  //         sendingCreateObj.createSDEAccMapping?.push(tempSDEAccMappingObj);
  //       }
  //       // SDEAccMapping Table process-------END--------
  //     }
  //   }
  //   // Update SDE_Config
  //   else if (watchedFields?.selectedDataExportConfigurationId) {
  //     sendingUpdateObj = {
  //       selectedDataExportConfigurationId:
  //         watchedFields?.selectedDataExportConfigurationId,
  //       companyId: sdeConfigSaved?.companyId || null,
  //       biznessEventId: sdeConfigSaved?.biznessEventId || null,
  //       // paymentModeId:
  //       //   watchedFields.paymentMode
  //       //     ?.map((pm: any) => pm.paymentModeId)
  //       //     .join(',') ?? null,
  //       // buyerGroupId:
  //       //   watchedFields.buyerGroup
  //       //     ?.map((bg: any) => bg.buyerGroupId)
  //       //     .join(',') ?? null,
  //       // productGroupId:
  //       //   watchedFields.productGroup
  //       //     ?.map((pg: any) => pg.productGroupId)
  //       //     .join(',') ?? null,
  //       eventTypeId:
  //         watchedFields.voucherType
  //           ?.map((vt: any) => vt.voucherTypeName)
  //           .join(',') ?? null,
  //       amountRange1Min: null,
  //       amountRange1Max: null,
  //       amountRange2Min: null,
  //       amountRange2Max: null,
  //       amountRange3Min: null,
  //       amountRange3Max: null,
  //       amountRange4Min: null,
  //       amountRange4Max: null,
  //       updateBy: userInfo?.securityUserId,
  //       createSDEAccMapping: [],
  //       updateSDEAccMapping: [],
  //       deleteSDEAccMapping: [],
  //     };

  //     for (const item of watchedFields?.voucherValue ?? []) {
  //       if (item?.voucherValueName === 'Under 10k') {
  //         sendingUpdateObj.amountRange1Min = 0;
  //         sendingUpdateObj.amountRange1Max = 9999;
  //       }
  //       if (item?.voucherValueName === '10k-50k') {
  //         sendingUpdateObj.amountRange2Min = 10000;
  //         sendingUpdateObj.amountRange2Max = 49999;
  //       }
  //       if (item?.voucherValueName === '50k-150k') {
  //         sendingUpdateObj.amountRange3Min = 50000;
  //         sendingUpdateObj.amountRange3Max = 149999;
  //       }
  //       if (item?.voucherValueName === 'Above 150k') {
  //         sendingUpdateObj.amountRange4Min = 150000;
  //         sendingUpdateObj.amountRange4Max = null;
  //       }
  //       if (item?.voucherValueName === 'All') {
  //         sendingUpdateObj.amountRange1Min = 0;
  //         sendingUpdateObj.amountRange1Max = 9999;
  //         sendingUpdateObj.amountRange2Min = 10000;
  //         sendingUpdateObj.amountRange2Max = 49999;
  //         sendingUpdateObj.amountRange3Min = 50000;
  //         sendingUpdateObj.amountRange3Max = 149999;
  //         sendingUpdateObj.amountRange4Min = 150000;
  //         sendingUpdateObj.amountRange4Max = null;
  //       }
  //     }

  //     // SDEAccMapping Table process-------START--------

  //     const sdeAccMappingValidEntries = sdeAccMappingGrid.filter(
  //       (w) => !!w.sourceAccId === true
  //     );

  //     const copyOfsdeAccMappingValidEntries: ISDEAccMapping[] =
  //       sdeAccMappingValidEntries
  //         ? JSON.parse(JSON.stringify(sdeAccMappingValidEntries))
  //         : [];

  //     for (let i = 0; i < copyOfsdeAccMappingValidEntries.length; i++) {
  //       if (!copyOfsdeAccMappingValidEntries[i]?.sdeAccMappingId) {
  //         // create
  //         const tempSDEAccMappingObj: ICreateSDEAccMapping = {
  //           sourceCompanyId: userInfo?.companyId,
  //           sourceAccId: copyOfsdeAccMappingValidEntries[i].sourceAccId || 0,
  //           destinationAccId:
  //             copyOfsdeAccMappingValidEntries[i].destinationAccId || null,
  //           selectedDataExportConfigurationId:
  //             watchedFields?.selectedDataExportConfigurationId,
  //         };
  //         sendingUpdateObj.createSDEAccMapping?.push(tempSDEAccMappingObj);
  //       } else if (copyOfsdeAccMappingValidEntries[i]?.sdeAccMappingId) {
  //         // update
  //         const tempSDEAccMappingObj: IUpdateSDEAccMapping = {
  //           sdeAccMappingId: copyOfsdeAccMappingValidEntries[i].sdeAccMappingId,
  //           sourceCompanyId: userInfo?.companyId,
  //           sourceAccId: copyOfsdeAccMappingValidEntries[i].sourceAccId || 0,
  //           destinationAccId:
  //             copyOfsdeAccMappingValidEntries[i].destinationAccId || null,
  //           // selectedDataExportConfigurationId:
  //           //   copyOfsdeAccMappingValidEntries[i]
  //           //     .selectedDataExportConfigurationId,
  //         };
  //         sendingUpdateObj.updateSDEAccMapping?.push(tempSDEAccMappingObj);
  //       }
  //       // delete
  //       if (deletedRowSdeAccMapping?.length) {
  //         const uniqueDeletedRowSdeAccMapping = deletedRowSdeAccMapping
  //           ? new Set(deletedRowSdeAccMapping)
  //           : [];
  //         sendingUpdateObj.deleteSDEAccMapping = [
  //           ...uniqueDeletedRowSdeAccMapping,
  //         ];
  //       }
  //     }
  //     // SDEAccMapping Table process-------END--------
  //   }

  //   const sendingObj: IProcessSDEConfigurationCommand = {
  //     createCommand: sendingCreateObj,
  //     updateCommand: sendingUpdateObj,
  //   };

  //   console.log('sendingObj');
  //   console.log(sendingObj);
  //   processSDEConfig(sendingObj);
  // };

  const saveImportConfig = () => {
    console.log('Yo yo Lucy');
    console.log(biznessEventsOptionsData);
    console.log(watchedFields);
    console.log(biznessEventsOptionsData);
    let sendingCreateObj: ICreateSDEConfigurationCommand | null = null;
    let sendingUpdateObj: IUpdateSDEConfigurationCommand | null = null;
    const sendingCreateSdeAccMappingArray: ICreateSDEAccMapping[] = [];
    const sendingUpdateSdeAccMappingArray: IUpdateSDEAccMapping[] = [];
    let sendingDeleteSdeAccMappingArray: IDeleteSDEAccMapping[] = [];

    // Create SDE_Config
    if (!watchedFields?.selectedDataExportConfigurationId) {
      sendingCreateObj = {
        companyId: userInfo?.companyId,
        biznessEventId: voucherBiznessEventId ?? 0,
        eventTypeId:
          watchedFields.voucherType
            ?.map((vt: any) => vt.voucherTypeName)
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
        // createSDEAccMapping: [],
      };

      for (const item of watchedFields?.voucherValue ?? []) {
        if (item?.voucherValueName === 'Under 10k') {
          sendingCreateObj.amountRange1Min = 0;
          sendingCreateObj.amountRange1Max = 9999;
        }
        if (item?.voucherValueName === '10k-50k') {
          sendingCreateObj.amountRange2Min = 10000;
          sendingCreateObj.amountRange2Max = 49999;
        }
        if (item?.voucherValueName === '50k-150k') {
          sendingCreateObj.amountRange3Min = 50000;
          sendingCreateObj.amountRange3Max = 149999;
        }
        if (item?.voucherValueName === 'Above 150k') {
          sendingCreateObj.amountRange4Min = 150000;
          sendingCreateObj.amountRange4Max = null;
        }
        if (item?.voucherValueName === 'All') {
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
        eventTypeId:
          watchedFields.voucherType
            ?.map((vt: any) => vt.voucherTypeName)
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
        // createSDEAccMapping: [],
        // updateSDEAccMapping: [],
        // deleteSDEAccMapping: [],
      };

      for (const item of watchedFields?.voucherValue ?? []) {
        if (item?.voucherValueName === 'Under 10k') {
          sendingUpdateObj.amountRange1Min = 0;
          sendingUpdateObj.amountRange1Max = 9999;
        }
        if (item?.voucherValueName === '10k-50k') {
          sendingUpdateObj.amountRange2Min = 10000;
          sendingUpdateObj.amountRange2Max = 49999;
        }
        if (item?.voucherValueName === '50k-150k') {
          sendingUpdateObj.amountRange3Min = 50000;
          sendingUpdateObj.amountRange3Max = 149999;
        }
        if (item?.voucherValueName === 'Above 150k') {
          sendingUpdateObj.amountRange4Min = 150000;
          sendingUpdateObj.amountRange4Max = null;
        }
        if (item?.voucherValueName === 'All') {
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

    // SDEAccMapping Table process-------START--------

    const sdeAccMappingValidEntries = sdeAccMappingGrid.filter(
      (w) => !!w.sourceAccId === true
    );

    const copyOfsdeAccMappingValidEntries: ISDEAccMapping[] =
      sdeAccMappingValidEntries
        ? JSON.parse(JSON.stringify(sdeAccMappingValidEntries))
        : [];

    for (let i = 0; i < copyOfsdeAccMappingValidEntries.length; i++) {
      if (!copyOfsdeAccMappingValidEntries[i]?.sdeAccMappingId) {
        // create
        const tempSDEAccMappingObj: ICreateSDEAccMapping = {
          sourceCompanyId: userInfo?.companyId,
          sourceAccId: copyOfsdeAccMappingValidEntries[i].sourceAccId || 0,
          destinationAccId:
            copyOfsdeAccMappingValidEntries[i].destinationAccId || null,
          selectedDataExportConfigurationId:
            watchedFields?.selectedDataExportConfigurationId || 0,
        };
        sendingCreateSdeAccMappingArray?.push(tempSDEAccMappingObj);
      } else if (copyOfsdeAccMappingValidEntries[i]?.sdeAccMappingId) {
        // update
        const tempSDEAccMappingObj: IUpdateSDEAccMapping = {
          sdeAccMappingId: copyOfsdeAccMappingValidEntries[i].sdeAccMappingId,
          sourceCompanyId: userInfo?.companyId,
          sourceAccId: copyOfsdeAccMappingValidEntries[i].sourceAccId || 0,
          destinationAccId:
            copyOfsdeAccMappingValidEntries[i].destinationAccId || null,
          // selectedDataExportConfigurationId:
          //   copyOfsdeAccMappingValidEntries[i]
          //     .selectedDataExportConfigurationId,
        };
        sendingUpdateSdeAccMappingArray?.push(tempSDEAccMappingObj);
      }
    }

    // delete
    if (deletedRowSdeAccMapping?.length) {
      const uniqueDeletedRowSdeAccMapping = deletedRowSdeAccMapping.length
        ? new Set(deletedRowSdeAccMapping)
        : [];
      sendingDeleteSdeAccMappingArray = [...uniqueDeletedRowSdeAccMapping];
    }

    // SDEAccMapping Table process-------END--------

    const sendingObj: IProcessSDEConfigurationCommand = {
      createCommand: sendingCreateObj,
      updateCommand: sendingUpdateObj,
      createSDEAccMapping: sendingCreateSdeAccMappingArray,
      updateSDEAccMapping: sendingUpdateSdeAccMappingArray,
      deleteSDEAccMapping: sendingDeleteSdeAccMappingArray,
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
      biznessEventId: voucherBiznessEventId ?? 0,
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

  const checkAndSetSdeAccMappingTableValues = useCallback(
    (index: number) => {
      if (index === sdeAccMappingGrid.length - 1) {
        const emptySdeAccMapping: ISDEAccMapping = {
          sdeAccMappingId: null,
          sourceCompanyId: null,
          sourceAccId: null,
          sourceAccName: null,
          destinationAccId: null,
          destinationAccName: null,
          selectedDataExportConfigurationId: null,
        };
        setSdeAccMappingGrid([...sdeAccMappingGrid, emptySdeAccMapping]);
      } else {
        setSdeAccMappingGrid([...sdeAccMappingGrid]);
      }
    },
    [sdeAccMappingGrid]
  );

  // --------FUNCTIONS--------ENDS-----

  // ----------Table things--------

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

  // optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  useEffect(() => {
    // scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortingSdeAccMappingGrid]);

  const sdeAccMappingGridColumns = useMemo<MRT_ColumnDef<ISDEAccMapping>[]>(
    () => [
      {
        id: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
        grow: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                // row.original.productGroupId ||
                row.original.sourceAccId ? 'visible' : 'invisible'
              }
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  if (row.original.sdeAccMappingId) {
                    const tempDeletedObj: IDeleteSDEAccMapping = {
                      sdeAccMappingId: row.original.sdeAccMappingId,
                    };
                    deletedRowSdeAccMapping?.push(tempDeletedObj);
                  }
                  sdeAccMappingGrid?.splice(row.index, 1);
                  if (sdeAccMappingGrid) {
                    setSdeAccMappingGrid([...sdeAccMappingGrid]);
                    setDeletedRowSdeAccMapping([...deletedRowSdeAccMapping]);
                  } else {
                    setSdeAccMappingGrid([]);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },

      // {
      //   accessorFn: (row) => row.sourceAccName ?? '',
      //   id: 'sourceAccName',
      //   header: 'Source Account',
      //   Cell: ({ cell, row }) => {
      //     const currentAccount = {
      //       accountsId: row.original.sourceAccId || null,
      //       accountsName: row.original.sourceAccName || '',
      //     };
      //     return (
      //       // <Autocomplete
      //       //   // options={
      //       //   //   Array.from(
      //       //   //     new Map(
      //       //   //       accountsOptionsData?.map((accountsOption) => [
      //       //   //         accountsOption.accountsName,
      //       //   //         accountsOption,
      //       //   //       ])
      //       //   //     ).values()
      //       //   //   ) || []
      //       //   // } // making sure that the array is unique by accountsName, else autocomplete search ultapalta behave kore

      //       //   options={(() => {
      //       //     // 1) unique options by accountsName
      //       //     const unique =
      //       //       Array.from(
      //       //         new Map(
      //       //           accountsOptionsData?.map((accountsOption) => [
      //       //             accountsOption.accountsName,
      //       //             accountsOption,
      //       //           ])
      //       //         ).values()
      //       //       ) || [];

      //       //     // 2) which source ids are used in other rows (exclude current row)
      //       //     const used = new Set(
      //       //       (sdeAccMappingGrid ?? [])
      //       //         .filter((r, i) => i !== row.index && !!r?.sourceAccId)
      //       //         .map((r) => r.sourceAccId as number)
      //       //     );

      //       //     // 3) filter: hide used ids, but keep current row’s selected option visible
      //       //     const currentId = row.original.sourceAccId ?? null;

      //       //     return unique.filter(
      //       //       (opt) =>
      //       //         !used.has(opt.accountsId || 0) ||
      //       //         opt.accountsId === currentId
      //       //     );
      //       //   })()}
      //       //   value={currentAccount}
      //       //   sx={{ width: '100%' }}
      //       //   PopperComponent={PopperMy}
      //       //   freeSolo
      //       //   onChange={(event, selectedOption: any) => {
      //       //     if (selectedOption.accountsId) {
      //       //       sdeAccMappingGrid[row.index].sourceAccId =
      //       //         selectedOption?.accountsId || null;
      //       //       sdeAccMappingGrid[row.index].sourceAccName =
      //       //         selectedOption?.accountsName || '';

      //       //       // checkAndSetSdeAccMappingTableValues(row.index);
      //       //     }
      //       //     checkAndSetSdeAccMappingTableValues(row.index);

      //       //     // sdeAccMappingGrid[row.index].sourceAccId =
      //       //     //   selectedOption?.accountsId || null;
      //       //     // sdeAccMappingGrid[row.index].sourceAccName =
      //       //     //   selectedOption?.accountsName || '';

      //       //     // checkAndSetSdeAccMappingTableValues(row.index);
      //       //   }}
      //       //   isOptionEqualToValue={(options, selectedOption) =>
      //       //     options.accountsId === selectedOption.accountsId
      //       //   }
      //       //   getOptionLabel={(option: any) =>
      //       //     option ? option.accountsName : ''
      //       //   }
      //       //   renderInput={(params) => (
      //       //     <TextField
      //       //       {...params}
      //       //       InputProps={{
      //       //         ...params.InputProps,
      //       //         style: { fontSize: 13 },
      //       //         disableUnderline: true,
      //       //       }}
      //       //       variant="standard"
      //       //       size="small"
      //       //     />
      //       //   )}
      //       // />
      //       <Autocomplete
      //         disableClearable
      //         forcePopupIcon={false}
      //         //  remove freeSolo (typing still works for filtering)
      //         // freeSolo

      //         options={(() => {
      //           const unique =
      //             Array.from(
      //               new Map(
      //                 accountsOptionsData?.map((accountsOption) => [
      //                   accountsOption.accountsName,
      //                   accountsOption,
      //                 ])
      //               ).values()
      //             ) || [];

      //           const used = new Set(
      //             (sdeAccMappingGrid ?? [])
      //               .filter((r, i) => i !== row.index && !!r?.sourceAccId)
      //               .map((r) => r.sourceAccId as number)
      //           );

      //           const currentId = row.original.sourceAccId ?? null;

      //           return unique.filter(
      //             (opt) =>
      //               !used.has(opt.accountsId || 0) ||
      //               opt.accountsId === currentId
      //           );
      //         })()}
      //         value={currentAccount}
      //         sx={{ width: '100%' }}
      //         PopperComponent={PopperMy}
      //         onChange={(event, selectedOption: any) => {
      //           //  never allow null to overwrite the existing value
      //           if (!selectedOption) return;

      //           sdeAccMappingGrid[row.index].sourceAccId =
      //             selectedOption.accountsId;
      //           sdeAccMappingGrid[row.index].sourceAccName =
      //             selectedOption.accountsName || '';

      //           checkAndSetSdeAccMappingTableValues(row.index);
      //         }}
      //         isOptionEqualToValue={(options, selectedOption) =>
      //           options.accountsId === selectedOption.accountsId
      //         }
      //         getOptionLabel={(option: any) =>
      //           option ? option.accountsName : ''
      //         }
      //         renderInput={(params) => (
      //           <TextField
      //             {...params}
      //             InputProps={{
      //               ...params.InputProps,
      //               style: { fontSize: 13 },
      //               disableUnderline: true,
      //             }}
      //             variant="standard"
      //             size="small"
      //           />
      //         )}
      //       />
      //     );
      //   },
      // },

      {
        accessorFn: (row) => row.sourceAccName ?? '',
        id: 'sourceAccName',
        header: 'Source Account',
        Cell: ({ row }) => {
          //  resolve the actual option object from options list (so it displays)
          const currentAccount =
            (accountsOptionsData ?? []).find(
              (a: any) => a?.accountsId === Number(row.original.sourceAccId)
            ) ??
            (row.original.sourceAccId != null
              ? {
                  accountsId: Number(row.original.sourceAccId),
                  accountsName: row.original.sourceAccName || '',
                }
              : null);

          return (
            <Autocomplete
              disableClearable={!!currentAccount} //  cannot clear to null once selected
              forcePopupIcon={false} //  hide dropdown arrow
              options={(() => {
                // unique by accountsId
                const unique =
                  Array.from(
                    new Map(
                      (accountsOptionsData ?? []).map((a: any) => [
                        a.accountsId,
                        a,
                      ])
                    ).values()
                  ) || [];

                // used source ids except current row
                const used = new Set<number>(
                  (sdeAccMappingGrid ?? [])
                    .filter((r, i) => i !== row.index && r?.sourceAccId != null)
                    .map((r) => Number(r.sourceAccId))
                );

                const currentId = currentAccount?.accountsId ?? null;

                //  keep current row’s selected item available
                return unique.filter(
                  (opt: any) =>
                    !used.has(opt.accountsId) || opt.accountsId === currentId
                );
              })()}
              value={currentAccount}
              sx={{ width: '100%' }}
              PopperComponent={PopperMy}
              onChange={(event, selectedOption: any) => {
                //  never let null/string overwrite the existing value
                if (!selectedOption || typeof selectedOption === 'string')
                  return;

                sdeAccMappingGrid[row.index].sourceAccId =
                  selectedOption.accountsId;
                sdeAccMappingGrid[row.index].sourceAccName =
                  selectedOption.accountsName || '';

                checkAndSetSdeAccMappingTableValues(row.index);
              }}
              isOptionEqualToValue={(opt: any, val: any) =>
                opt.accountsId === (val?.accountsId ?? -1)
              }
              getOptionLabel={(opt: any) =>
                typeof opt === 'string' ? opt : opt?.accountsName ?? ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
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
          );
        },
      },

      // {
      //   accessorFn: (row) => row.destinationAccName ?? '',
      //   id: 'destinationAccName',
      //   header: 'Destination Account',
      //   Cell: ({ cell, row }) => {
      //     // ekhane error er value and message set korbi

      //     const currentAccount = {
      //       accountsId: row.original.destinationAccId || null,
      //       accountsName: row.original.destinationAccName || '',
      //     };

      //     return (
      //       <Autocomplete
      //         options={
      //           Array.from(
      //             new Map(
      //               accountsOptionsData?.map((accountsOption) => [
      //                 accountsOption.accountsName,
      //                 accountsOption,
      //               ])
      //             ).values()
      //           ) || []
      //         } // making sure that the array is unique by productName, else autocomplete search ultapalta behave kore
      //         value={currentAccount}
      //         sx={{ width: '100%' }}
      //         PopperComponent={PopperMy}
      //         disabled={!row.original.sourceAccId}
      //         clearOnEscape
      //         // disableClearable
      //         freeSolo
      //         // loading={row.original.loading || false}
      //         onChange={(event, selectedOption: any) => {
      //           sdeAccMappingGrid[row.index].destinationAccId =
      //             selectedOption?.accountsId || null;
      //           sdeAccMappingGrid[row.index].destinationAccName =
      //             selectedOption?.accountsName || '';

      //           checkAndSetSdeAccMappingTableValues(row.index);
      //         }}
      //         // onBlur={onBlur} // Trigger validation on blur
      //         isOptionEqualToValue={(options, selectedOption) =>
      //           options.accountsId === selectedOption.accountsId
      //         }
      //         getOptionLabel={(option: any) =>
      //           option ? option.accountsName : ''
      //         }
      //         renderInput={(params) => (
      //           <TextField
      //             {...params}
      //             InputProps={{
      //               ...params.InputProps,
      //               style: { fontSize: 13 },
      //               disableUnderline: true,
      //             }}
      //             variant="standard"
      //             size="small"
      //           />
      //         )}
      //       />
      //     );
      //   },
      // },

      {
        accessorFn: (row) => row.destinationAccName ?? '',
        id: 'destinationAccName',
        header: 'Destination Account',
        Cell: ({ row }) => {
          //  resolve the real option object by id (so it shows)
          const currentAccount =
            (accountsOptionsData ?? []).find(
              (a: any) =>
                a?.accountsId === Number(row.original.destinationAccId)
            ) ??
            (row.original.destinationAccId != null
              ? {
                  accountsId: Number(row.original.destinationAccId),
                  accountsName: row.original.destinationAccName || '',
                }
              : null);

          return (
            <Autocomplete
              forcePopupIcon={false}
              options={
                Array.from(
                  new Map(
                    (accountsOptionsData ?? []).map((a: any) => [
                      a.accountsId,
                      a,
                    ])
                  ).values()
                ) || []
              }
              value={currentAccount}
              sx={{ width: '100%' }}
              PopperComponent={PopperMy}
              disabled={!row.original.sourceAccId}
              clearOnEscape
              //  remove freeSolo (typing still filters options, and avoids blur-empty issue)
              // freeSolo
              onChange={(event, selectedOption: any) => {
                // allow clear to null if it happens
                if (selectedOption === null) {
                  sdeAccMappingGrid[row.index].destinationAccId = null;
                  sdeAccMappingGrid[row.index].destinationAccName = '';
                  checkAndSetSdeAccMappingTableValues(row.index);
                  return;
                }

                // ignore typed string (if freeSolo ever re-enabled)
                if (typeof selectedOption === 'string') return;

                sdeAccMappingGrid[row.index].destinationAccId =
                  selectedOption?.accountsId || null;
                sdeAccMappingGrid[row.index].destinationAccName =
                  selectedOption?.accountsName || '';

                checkAndSetSdeAccMappingTableValues(row.index);
              }}
              isOptionEqualToValue={(opt: any, val: any) =>
                opt.accountsId === (val?.accountsId ?? -1)
              }
              getOptionLabel={(opt: any) =>
                typeof opt === 'string' ? opt : opt?.accountsName ?? ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
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
          );
        },
      },
    ],
    [
      PopperMy,
      checkAndSetSdeAccMappingTableValues,
      sdeAccMappingGrid,
      accountsOptionsData,
      deletedRowSdeAccMapping,
    ]
  );

  // ---------- material table virtualization---------

  const sdeAccMappingGridInitializer: MRT_TableInstance<ISDEAccMapping> =
    useMaterialReactTable({
      columns: sdeAccMappingGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: sdeAccMappingGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        // columnVisibility,
        isLoading: isSdeAccMappingGridLoading,
        sorting: sortingSdeAccMappingGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      // onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 30,
      },
      //   enableRowSelection: (row) => {
      //     // if (row.original.lastProcessedDate) {
      //     //   toast.warning(
      //     //     'You cannot select/calculate commission for this buyer, as this is already processed before'
      //     //   );
      //     // }
      //     return !!row.original.salesOrderId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
      //   }, // enable row selection conditionally per row
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
          {/* <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     buyerSalesRptGridState,
                //     salesOrderGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(
                  sdeAccMappingGrid,
                  sdeAccMappingGridColumns
                );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div> */}
          {/* add your own custom print button or something */}
        </>
      ),

      //   renderTopToolbarCustomActions: ({ table }) => (
      //     <div className=" w-[30%] mt-1 flex gap-3 justify-center items-center">

      //     </div>
      //   ),
      onSortingChange: setSortingSdeAccMappingGrid,
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
                  : 'Voucher Import'}
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
                  name="voucherType"
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
                        { voucherTypeName: 'All' },
                        { voucherTypeName: 'JV' },
                        { voucherTypeName: 'CV' },
                        { voucherTypeName: 'DV' },
                        { voucherTypeName: 'CN' },
                      ]} // Replace with tenderComboOptions
                      value={value || []} //  Ensure it's an array
                      onChange={(event, selectedItems) => {
                        //  If "All" is selected, keep only "All"
                        const hasAll = selectedItems.some(
                          (item) => item.voucherTypeName === 'All'
                        );

                        if (hasAll) {
                          onChange([{ voucherTypeName: 'All' }]);
                        } else {
                          onChange(selectedItems);
                        }
                      }}
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.voucherTypeName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.voucherTypeName ===
                        selectedValue?.voucherTypeName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Voucher Type"
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
                  name="voucherValue"
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
                        { voucherValueName: 'All' },
                        { voucherValueName: 'Under 10k' },
                        { voucherValueName: '10k-50k' },
                        { voucherValueName: '50k-150k' },
                        { voucherValueName: 'Above 150k' },
                      ]} // Replace with tenderComboOptions
                      value={value || []} //  Ensure it's an array
                      onChange={(event, selectedItems) => {
                        //  If "All" is selected, keep only "All"
                        const hasAll = selectedItems.some(
                          (item) => item.voucherValueName === 'All'
                        );

                        if (hasAll) {
                          onChange([{ voucherValueName: 'All' }]);
                        } else {
                          onChange(selectedItems);
                        }
                      }}
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.voucherValueName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.voucherValueName ===
                        selectedValue?.voucherValueName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Voucher Value"
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

                {/* <Controller
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
                /> */}

                <div className="w-full m-1 modifiedEditTable">
                  <MaterialReactTable table={sdeAccMappingGridInitializer} />
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

          <PrevVoucherImportManipulate biznessEventId={voucherBiznessEventId} />
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

export default VoucherImport;
