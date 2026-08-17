/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from 'material-react-table';
import { ExportToCsv } from 'export-to-csv';
import { Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { useAppDispatch } from '../../../application/Redux/store/store';
// import { useLazyGetSupplierByCompanyLocationIdQuery } from '../../../infrastructure/api/SupplierApiSlice';

import {
  useGetAccountsFromChargeTypeQuery,
  useGetAllAccountsNameByCompanyIdQuery,
} from '../../../infrastructure/api/AccountsNameApiSlice';

import {
  ICreateLPurchaseInAdditionalCostCommand,
  IDeleteLPurchaseInAdditionalCostCommand,
  ILPurchaseInAdditionalCost,
  ILPurchaseInProcessCommandsVM,
  IUpdateLPurchaseInAdditionalCostCommand,
} from '../../../domain/interfaces/LPurchaseInInterface';
import {
  useLazyGetAllLPurchaseInNoQuery,
  useLazyGetLPurchaseInAdditionalCostByLPurchaseInIdQuery,
  useLazyGetLPurchaseInByLPurchaseInIdQuery,
  useLazyGetLPurchaseInNoAndSupplierQuery,
  useLazyGetSalesOrderAdditionalCostForLPurchaseInQuery,
  useProcessSaveLPurchaseInMutation,
} from '../../../infrastructure/api/LPurchaseInApiSlice';

type Props = {};

const LPurchaseInAdditionalCost = ({
  modalPageOpenerClose,
  clickedCardInfo,
}: any) => {
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
    //   lPurchaseIn: null,
    //   supplier: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });
  const watchedFields = useWatch({ control });
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
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

  // -------------------[useStates]------------------

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [
    deletedRowLPurchaseInAdditionalCost,
    setDeletedRowLPurchaseInAdditionalCost,
  ] = useState<IDeleteLPurchaseInAdditionalCostCommand[]>([]);

  const [lPurchaseInAdditionalCostState, setLPurchaseInAdditionalCostState] =
    useState<ILPurchaseInAdditionalCost[]>([]);
  const [
    lPurchaseInAdditionalCostStatePrev,
    setLPurchaseInAdditionalCostStatePrev,
  ] = useState<ILPurchaseInAdditionalCost[]>([]);

  // ----------------------[api hooks]---------------

  // LPurchaseInNo autocomp options

  // const [
  //   triggerGetLPurchaseInOptions,
  //   {
  //     data: lPurchaseInOptionsData,
  //     error: lPurchaseInOptionsError,
  //     isError: lPurchaseInOptionsIsError,
  //     isSuccess: lPurchaseInOptionsIsSuccess,
  //     isLoading: lPurchaseInOptionsIsLoading,
  //     isFetching: lPurchaseInOptionsIsFetching,
  //   },
  // ] = useLazyGetAllLPurchaseInNoQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (lPurchaseInOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching lPurchaseInNo options for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching TENDER NO options for autocomplete, see console--->:'
  //     );
  //     console.log(lPurchaseInOptionsError);
  //   }
  // }, [
  //   lPurchaseInOptionsIsLoading,
  //   lPurchaseInOptionsIsError,
  //   lPurchaseInOptionsError,
  //   lPurchaseInOptionsIsSuccess,
  // ]);

  const [
    triggerLPurchaseInAndSupplierOptions,
    {
      data: lPurchaseInAndSupplierOptions,
      error: lPurchaseInAndSupplierOptionsError,
      isError: lPurchaseInAndSupplierOptionsIsError,
      isSuccess: lPurchaseInAndSupplierOptionsIsSuccess,
      isLoading: lPurchaseInAndSupplierOptionsLoading,
      isFetching: lPurchaseInAndSupplierOptionsIsFetching,
    },
  ] = useLazyGetLPurchaseInNoAndSupplierQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (lPurchaseInAndSupplierOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching supplier/lPurchaseIn options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching supplier/lPurchaseIn options for autocomplete, see console--->:'
      );
    } else if (
      !lPurchaseInAndSupplierOptionsLoading &&
      !lPurchaseInAndSupplierOptionsIsError &&
      lPurchaseInAndSupplierOptions &&
      lPurchaseInAndSupplierOptionsIsSuccess &&
      !lPurchaseInAndSupplierOptionsIsFetching
    ) {
      if (clickedCardInfo?.biznessEventProcessConfigurationId) {
        const matchedRow = lPurchaseInAndSupplierOptions.find(
          (row) => row.lPurchaseInNo === clickedCardInfo.eventNo
        );
        if (matchedRow) {
          const tempLPurchaseIn = {
            lPurchaseInNo: matchedRow?.lPurchaseInNo,
            lPurchaseInId: matchedRow?.lPurchaseInId,
          };
          const tempSupplier = {
            supplierId: matchedRow?.supplierId,
            supplierName: matchedRow?.supplierName,
          };

          if (
            watchedFields.lPurchaseIn?.lPurchaseInNo !==
            tempLPurchaseIn.lPurchaseInNo
          ) {
            // console.log(tempLPurchaseIn);
            setValue('lPurchaseIn', tempLPurchaseIn);
            setValue('supplier', tempSupplier);
          }
        }
      }
    }
  }, [
    lPurchaseInAndSupplierOptionsLoading,
    lPurchaseInAndSupplierOptionsIsError,
    lPurchaseInAndSupplierOptionsError,
    lPurchaseInAndSupplierOptions,
    lPurchaseInAndSupplierOptionsIsFetching,
    lPurchaseInAndSupplierOptionsIsSuccess,
  ]);

  const [
    triggerGetLPurchaseInMasterData,
    {
      data: lPurchaseInData,
      error: lPurchaseInError,
      isError: lPurchaseInIsError,
      isSuccess: lPurchaseInIsSuccess,
      isLoading: lPurchaseInLoading,
      isFetching: lPurchaseInIsFetching,
    },
  ] = useLazyGetLPurchaseInByLPurchaseInIdQuery();

  useEffect(() => {
    if (lPurchaseInIsError) {
      setDeletedRowLPurchaseInAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching lPurchaseInMaster table data, see console!'
      );
      console.log(
        'Something wrong from backend while fetching lPurchaseInMaster table data, see console--->:'
      );
      console.log(lPurchaseInError);
    }

    if (
      lPurchaseInData &&
      lPurchaseInIsSuccess &&
      !lPurchaseInLoading &&
      !lPurchaseInIsError &&
      !lPurchaseInIsFetching
    ) {
      // Only set value if it's different
      if (getValues('remarks') !== lPurchaseInData.remarks) {
        setValue('remarks', lPurchaseInData.remarks);
      }
      if (
        dayjs(getValues('lPurchaseInDate')).toString() !==
        dayjs(lPurchaseInData.lPurchaseInDate).toString()
      ) {
        setValue('lPurchaseInDate', dayjs(lPurchaseInData.lPurchaseInDate));
      }
      // setValue('remarks', lPurchaseInData.remarks);
      // setValue('lPurchaseInDate', dayjs(lPurchaseInData.lPurchaseInDate));
    }
  }, [
    lPurchaseInLoading,
    lPurchaseInIsError,
    lPurchaseInError,
    lPurchaseInIsFetching,
    lPurchaseInData,
    lPurchaseInIsSuccess,
  ]);

  const {
    data: AccountsComboOptions,
    isLoading: AccountsComboOptionsLoading,
    error: AccountsComboOptionsError,
    isError: AccountsComboOptionsIsError,
    isFetching: AccountsComboOptionIsFetching,
    refetch: AccountsComboOptionsRefetch,
  } = useGetAccountsFromChargeTypeQuery({
    companyId: userInfo?.companyId || 0,
  });

  // lPurchaseInAdditionalCost autocomp options
  const [
    triggerGetLPurchaseInAdditionalCostPreference,
    {
      data: lPurchaseInAdditionalCostPreferenceData,
      error: lPurchaseInAdditionalCostPreferenceError,
      isError: lPurchaseInAdditionalCostPreferenceIsError,
      isSuccess: lPurchaseInAdditionalCostPreferenceIsSuccess,
      isLoading: lPurchaseInAdditionalCostPreferenceLoading,
      isFetching: lPurchaseInAdditionalCostPreferenceIsFetching,
    },
  ] = useLazyGetSalesOrderAdditionalCostForLPurchaseInQuery();

  useEffect(() => {
    if (lPurchaseInAdditionalCostPreferenceIsError) {
      setDeletedRowLPurchaseInAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching lPurchaseInAdditionalCost, see console!'
      );
      console.log(
        'Something wrong from backend while fetching lPurchaseInAdditionalCost, see console--->:'
      );
      console.log(lPurchaseInAdditionalCostPreferenceError);
    }

    ///
    if (AccountsComboOptionsIsError) {
      setDeletedRowLPurchaseInAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching accounts from Accounts&ChargeType tables for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching accounts from Accounts&ChargeType tables for autocomplete, see console--->:'
      );
      console.log(AccountsComboOptionsError);
    }
    /// //

    let lPurchaseInAdditionalCostTemp: ILPurchaseInAdditionalCost[] = [];
    if (
      lPurchaseInAdditionalCostPreferenceData?.length &&
      lPurchaseInAdditionalCostPreferenceIsSuccess &&
      !lPurchaseInAdditionalCostPreferenceLoading &&
      !lPurchaseInAdditionalCostPreferenceIsError &&
      !lPurchaseInAdditionalCostPreferenceIsFetching
    ) {
      lPurchaseInAdditionalCostTemp = JSON.parse(
        JSON.stringify(lPurchaseInAdditionalCostPreferenceData)
      );
    } else if (
      !lPurchaseInAdditionalCostPreferenceData?.length &&
      AccountsComboOptions &&
      !AccountsComboOptionsLoading &&
      !AccountsComboOptionsIsError &&
      !AccountsComboOptionIsFetching
    ) {
      for (let i = 0; i < AccountsComboOptions.length || 0; i++) {
        const objTemp: ILPurchaseInAdditionalCost = {
          lPurchaseInAdditionalCostId: null,
          name: AccountsComboOptions[i].name,
          description: '',
          percentage: null,
          amount: null,
          accountsId: AccountsComboOptions[i].accountsId,
          accountsName: AccountsComboOptions[i].accountsName,
        };
        lPurchaseInAdditionalCostTemp.push(objTemp);
      }
    }

    if (
      lPurchaseInAdditionalCostTemp &&
      lPurchaseInAdditionalCostPreferenceIsSuccess &&
      !lPurchaseInAdditionalCostPreferenceLoading &&
      !lPurchaseInAdditionalCostPreferenceIsError &&
      !lPurchaseInAdditionalCostPreferenceIsFetching &&
      AccountsComboOptions &&
      !AccountsComboOptionsLoading &&
      !AccountsComboOptionsIsError &&
      !AccountsComboOptionIsFetching &&
      ((!lPurchaseInAdditionalCostTemp.length &&
        !lPurchaseInAdditionalCostStatePrev.length &&
        !watchedFields.lPurchaseIn) ||
        JSON.stringify(lPurchaseInAdditionalCostTemp) !==
          JSON.stringify(lPurchaseInAdditionalCostStatePrev))
    ) {
      setDeletedRowLPurchaseInAdditionalCost([]);

      const copyOfLPurchaseInAdditionalCost = JSON.parse(
        JSON.stringify(lPurchaseInAdditionalCostTemp)
      );
      const copyOfLPurchaseInAdditionalCost2 = JSON.parse(
        JSON.stringify(lPurchaseInAdditionalCostTemp)
      );
      const emptyLPurchaseInAdditionalCostArray = [];
      if (
        copyOfLPurchaseInAdditionalCost &&
        copyOfLPurchaseInAdditionalCost.length < 10
      ) {
        for (let i = copyOfLPurchaseInAdditionalCost.length - 1; i < 10; i++) {
          const emptyLPurchaseInAdditionalCostObj: ILPurchaseInAdditionalCost =
            {
              lPurchaseInAdditionalCostId: null,
              name: '',
              description: '',
              percentage: null,
              amount: null,
              accountsId: null,
              accountsName: '',
            };
          emptyLPurchaseInAdditionalCostArray.push(
            emptyLPurchaseInAdditionalCostObj
          );
        }
      } else if (
        copyOfLPurchaseInAdditionalCost &&
        copyOfLPurchaseInAdditionalCost.length > 9
      ) {
        const emptyLPurchaseInAdditionalCostObj: ILPurchaseInAdditionalCost = {
          lPurchaseInAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        emptyLPurchaseInAdditionalCostArray.push(
          emptyLPurchaseInAdditionalCostObj
        );
      }

      setLPurchaseInAdditionalCostState([
        ...copyOfLPurchaseInAdditionalCost,
        ...emptyLPurchaseInAdditionalCostArray,
      ]);
      setLPurchaseInAdditionalCostStatePrev(copyOfLPurchaseInAdditionalCost2);
    }
  }, [
    lPurchaseInAdditionalCostPreferenceLoading,
    lPurchaseInAdditionalCostPreferenceIsError,
    lPurchaseInAdditionalCostPreferenceError,
    lPurchaseInAdditionalCostPreferenceIsFetching,
    lPurchaseInAdditionalCostPreferenceData,
    lPurchaseInAdditionalCostPreferenceIsSuccess,
  ]);

  // lPurchaseInAdditionalCost autocomp options
  const [
    triggerGetLPurchaseInAdditionalCost,
    {
      data: lPurchaseInAdditionalCostData,
      error: lPurchaseInAdditionalCostError,
      isError: lPurchaseInAdditionalCostIsError,
      isSuccess: lPurchaseInAdditionalCostIsSuccess,
      isLoading: lPurchaseInAdditionalCostLoading,
      isFetching: lPurchaseInAdditionalCostIsFetching,
    },
  ] = useLazyGetLPurchaseInAdditionalCostByLPurchaseInIdQuery();

  useEffect(() => {
    if (lPurchaseInAdditionalCostIsError) {
      setDeletedRowLPurchaseInAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching lPurchaseInAdditionalCost, see console!'
      );
      console.log(
        'Something wrong from backend while fetching lPurchaseInAdditionalCost, see console--->:'
      );
      console.log(lPurchaseInAdditionalCostError);
    }

    let lPurchaseInAdditionalCostTemp: ILPurchaseInAdditionalCost[] = [];
    if (
      lPurchaseInAdditionalCostData?.length &&
      lPurchaseInAdditionalCostIsSuccess &&
      !lPurchaseInAdditionalCostLoading &&
      !lPurchaseInAdditionalCostIsError &&
      !lPurchaseInAdditionalCostIsFetching &&
      lPurchaseInAdditionalCostData?.length
    ) {
      lPurchaseInAdditionalCostTemp = JSON.parse(
        JSON.stringify(lPurchaseInAdditionalCostData)
      );
    } else if (
      !lPurchaseInAdditionalCostData?.length &&
      !clickedCardInfo?.firstEventNo &&
      AccountsComboOptions &&
      !AccountsComboOptionsLoading &&
      !AccountsComboOptionsIsError &&
      !AccountsComboOptionIsFetching
    ) {
      for (let i = 0; i < AccountsComboOptions.length || 0; i++) {
        const objTemp: ILPurchaseInAdditionalCost = {
          lPurchaseInAdditionalCostId: null,
          name: AccountsComboOptions[i].name,
          description: '',
          percentage: null,
          amount: null,
          accountsId: AccountsComboOptions[i].accountsId,
          accountsName: AccountsComboOptions[i].accountsName,
        };
        lPurchaseInAdditionalCostTemp.push(objTemp);
      }
    }

    // alert('yo yo');
    if (
      lPurchaseInAdditionalCostTemp &&
      lPurchaseInAdditionalCostTemp.length > 0 &&
      lPurchaseInAdditionalCostIsSuccess &&
      !lPurchaseInAdditionalCostLoading &&
      !lPurchaseInAdditionalCostIsError &&
      !lPurchaseInAdditionalCostIsFetching &&
      ((!lPurchaseInAdditionalCostTemp.length &&
        !lPurchaseInAdditionalCostStatePrev.length &&
        !watchedFields.lPurchaseIn) ||
        JSON.stringify(lPurchaseInAdditionalCostTemp) !==
          JSON.stringify(lPurchaseInAdditionalCostStatePrev))
    ) {
      // alert('Hello ami print hoisi 2');
      console.log(lPurchaseInAdditionalCostTemp);
      console.log(lPurchaseInAdditionalCostStatePrev);
      console.log(
        JSON.stringify(lPurchaseInAdditionalCostTemp) ===
          JSON.stringify(lPurchaseInAdditionalCostStatePrev)
      );

      setDeletedRowLPurchaseInAdditionalCost([]);

      const copyOfLPurchaseInAdditionalCost = JSON.parse(
        JSON.stringify(lPurchaseInAdditionalCostTemp)
      );
      const copyOfLPurchaseInAdditionalCost2 = JSON.parse(
        JSON.stringify(lPurchaseInAdditionalCostTemp)
      );
      const emptyLPurchaseInAdditionalCostArray = [];
      if (
        copyOfLPurchaseInAdditionalCost &&
        copyOfLPurchaseInAdditionalCost.length < 10
      ) {
        for (let i = copyOfLPurchaseInAdditionalCost.length - 1; i < 10; i++) {
          const emptyLPurchaseInAdditionalCostObj: ILPurchaseInAdditionalCost =
            {
              lPurchaseInAdditionalCostId: null,
              name: '',
              description: '',
              percentage: null,
              amount: null,
              accountsId: null,
              accountsName: '',
            };
          emptyLPurchaseInAdditionalCostArray.push(
            emptyLPurchaseInAdditionalCostObj
          );
        }
      } else if (
        copyOfLPurchaseInAdditionalCost &&
        copyOfLPurchaseInAdditionalCost.length > 9
      ) {
        const emptyLPurchaseInAdditionalCostObj: ILPurchaseInAdditionalCost = {
          lPurchaseInAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        emptyLPurchaseInAdditionalCostArray.push(
          emptyLPurchaseInAdditionalCostObj
        );
      }

      setLPurchaseInAdditionalCostState([
        ...copyOfLPurchaseInAdditionalCost,
        ...emptyLPurchaseInAdditionalCostArray,
      ]);
      setLPurchaseInAdditionalCostStatePrev(copyOfLPurchaseInAdditionalCost2);
    } else if (
      clickedCardInfo?.firstEventNo &&
      (!lPurchaseInAdditionalCostTemp ||
        lPurchaseInAdditionalCostTemp.length === 0)
    ) {
      // alert('yelo yelo called');
      triggerGetLPurchaseInAdditionalCostPreference({
        firstEventNo: clickedCardInfo?.firstEventNo || 0,
      });
    }
  }, [
    lPurchaseInAdditionalCostLoading,
    lPurchaseInAdditionalCostIsError,
    lPurchaseInAdditionalCostError,
    lPurchaseInAdditionalCostIsFetching,
    lPurchaseInAdditionalCostData,
    lPurchaseInAdditionalCostIsSuccess,

    AccountsComboOptions,
    AccountsComboOptionsLoading,
    AccountsComboOptionsIsError,
    AccountsComboOptionIsFetching,
  ]);

  // productGroup autocomp options
  // const {
  //   data: accountsOptionsData,
  //   isLoading: accountsOptionsLoading,
  //   error: accountsOptionsError,
  //   isSuccess: accountsOptionsIsSuccess,
  //   isError: accountsOptionsIsError,
  //   isFetching: accountsOptionsIsFetching,
  //   refetch: accountsOptionsRefetch,
  // } = useGetAllAccountsNameByCompanyIdQuery({
  //   companyId: userInfo?.companyId,
  // });

  // useEffect(() => {
  //   if (accountsOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching accounts Options for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching accounts Options for autocomplete, see console--->:'
  //     );
  //     console.log(accountsOptionsError);
  //   }
  // }, [accountsOptionsLoading, accountsOptionsIsError, accountsOptionsError]);

  // useEffect for lazy api calls
  useEffect(() => {
    const { lPurchaseIn, supplier } = watchedFields;

    triggerLPurchaseInAndSupplierOptions({
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
      supplierId: supplier?.supplierId,
      lPurchaseInId: lPurchaseIn?.lPurchaseInId,
      // lPurchaseInId: lPurchaseIn?.lPurchaseInId || 0
    });
  }, [watchedFields.supplier]);

  useEffect(() => {
    const { lPurchaseIn, supplier } = watchedFields;

    triggerLPurchaseInAndSupplierOptions({
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
      supplierId: supplier?.supplierId,
      lPurchaseInId: lPurchaseIn?.lPurchaseInId,
      // lPurchaseInId: lPurchaseIn?.lPurchaseInId || 0
    });

    if (lPurchaseIn?.lPurchaseInId) {
      triggerGetLPurchaseInMasterData({
        lPurchaseInId: lPurchaseIn.lPurchaseInId,
      }).refetch();
      triggerGetLPurchaseInAdditionalCost({
        lPurchaseInId: lPurchaseIn.lPurchaseInId,
      }).refetch();
    }
    // // ----set 10 empty rows if no lPurchaseInNo
    if (!lPurchaseIn?.lPurchaseInNo) {
      const emptyArray = [];
      for (let i = 0; i < 10; i++) {
        const emptyLPurchaseInAdditionalCostObj: ILPurchaseInAdditionalCost = {
          lPurchaseInAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        emptyArray.push(emptyLPurchaseInAdditionalCostObj);
      }
      setLPurchaseInAdditionalCostState([...emptyArray]);
    }
    // // -------------------------------------------------------
  }, [watchedFields.lPurchaseIn]);

  const [
    processSaveLPurchaseIn,
    {
      isLoading: processSaveLPurchaseInIsLoading,
      isError: processSaveLPurchaseInIsError,
      error: processSaveLPurchaseInError,
      isSuccess: processSaveLPurchaseInIsSuccess,
      data: processSaveLPurchaseInData,
    },
  ] = useProcessSaveLPurchaseInMutation();

  useEffect(() => {
    // if (!processSaveLPurchaseInIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveLPurchaseInIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `LPurchaseIn has been saved successfully!`,
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
          console.log(processSaveLPurchaseInData);
          setValue('lPurchaseIn', watchedFields.lPurchaseIn);
        }
      });
    } else if (processSaveLPurchaseInIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving LPurchaseIn data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving LPurchaseIn data, see console---->'
      );
      console.log(processSaveLPurchaseInError);
    }
  }, [
    processSaveLPurchaseInIsLoading,
    processSaveLPurchaseInIsError,
    processSaveLPurchaseInData,
    processSaveLPurchaseInError,
    processSaveLPurchaseInIsSuccess,
  ]);

  const checkAndSetTableValues = useCallback(
    (index: number) => {
      if (index === lPurchaseInAdditionalCostState.length - 1) {
        const emptyLPurchaseInAdditionalCost: ILPurchaseInAdditionalCost = {
          lPurchaseInAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        setLPurchaseInAdditionalCostState([
          ...lPurchaseInAdditionalCostState,
          emptyLPurchaseInAdditionalCost,
        ]);
      } else {
        setLPurchaseInAdditionalCostState([...lPurchaseInAdditionalCostState]);
      }
    },
    [lPurchaseInAdditionalCostState]
  );

  // -----------------[validation functions]-----------------------
  const validateAccounts = (
    value: any,
    allFields: ILPurchaseInAdditionalCost
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
    allFields: ILPurchaseInAdditionalCost
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
  // -----Other Functions-----

  function isEmpty(value: any) {
    if (value === null || value === undefined) {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  }
  function areAllPropertiesFalsy(obj: any) {
    return Object.values(obj).every(isEmpty);
  }

  const lPurchaseInAdditionalCostProcessing = () => {
    // -----------------[LPurchaseInAdditionalCost Processing]--------------------

    const createLPurchaseInAdditionalCostCommand: ICreateLPurchaseInAdditionalCostCommand[] =
      [];
    const updateLPurchaseInAdditionalCostCommand: IUpdateLPurchaseInAdditionalCostCommand[] =
      [];
    const deleteLPurchaseInAdditionalCostCommand: IDeleteLPurchaseInAdditionalCostCommand[] =
      [...deletedRowLPurchaseInAdditionalCost];

    const prevLPurchaseInAdditionalCost: ILPurchaseInAdditionalCost[] =
      JSON.parse(JSON.stringify(lPurchaseInAdditionalCostStatePrev));

    let currentLPurchaseInAdditionalCost: ILPurchaseInAdditionalCost[] =
      JSON.parse(JSON.stringify(lPurchaseInAdditionalCostState));

    const deletedLPurchaseInAdditionalCostRows: IDeleteLPurchaseInAdditionalCostCommand[] =
      JSON.parse(JSON.stringify(deletedRowLPurchaseInAdditionalCost));

    // eliminating all faka dummy rows
    currentLPurchaseInAdditionalCost = currentLPurchaseInAdditionalCost.filter(
      (obj) => Object.values(obj).some((val) => val)
    );

    prevLPurchaseInAdditionalCost.sort(
      (a, b) =>
        (a.lPurchaseInAdditionalCostId ?? 0) -
        (b.lPurchaseInAdditionalCostId ?? 0)
    );

    const rowsWithId: ILPurchaseInAdditionalCost[] = [];

    console.log('currentLPurchaseInAdditionalCost-------------->');
    console.log(currentLPurchaseInAdditionalCost);

    for (let i = 0; i < currentLPurchaseInAdditionalCost.length; i++) {
      // jegulay primaryKey id nai, oigula sure to create
      if (!currentLPurchaseInAdditionalCost[i].lPurchaseInAdditionalCostId) {
        const tempObj: ICreateLPurchaseInAdditionalCostCommand = {
          // lPurchaseInAdditionalCostId: 0,
          lPurchaseInId: watchedFields.lPurchaseIn?.lPurchaseInId
            ? watchedFields.lPurchaseIn?.lPurchaseInId
            : null,

          name: currentLPurchaseInAdditionalCost[i].name || '',
          description: currentLPurchaseInAdditionalCost[i].description,
          accountsId: currentLPurchaseInAdditionalCost[i].accountsId,
          percentage: currentLPurchaseInAdditionalCost[i].percentage || 0,
          amount: currentLPurchaseInAdditionalCost[i].amount,
        };
        createLPurchaseInAdditionalCostCommand.push(tempObj);
      } else {
        rowsWithId.push(currentLPurchaseInAdditionalCost[i]);
      }
    }

    // ekhon deleted aar id wala rows ekshathe mishaya sort dibo, then compare korbo, compare e jodi equal na hoy tahole abar if diye check korbo oder primaryId baade j kono ekta mandatory field e value ase naki(jehetu delete er gulay shudhu primaryId ase), jodi thake then rowToUpdate e dhukabo

    const withIdandDeletedrows: any = [
      ...currentLPurchaseInAdditionalCost,
      ...deletedLPurchaseInAdditionalCostRows,
    ];
    withIdandDeletedrows.sort(
      (a: any, b: any) =>
        (a.lPurchaseInAdditionalCostId ?? 0) -
        (b.lPurchaseInAdditionalCostId ?? 0)
    );

    for (let i = 0; i < withIdandDeletedrows.length; i++) {
      const prevRow = JSON.stringify(prevLPurchaseInAdditionalCost[i]);
      const gridRow = JSON.stringify(withIdandDeletedrows[i]);

      if (prevRow !== gridRow) {
        if (
          withIdandDeletedrows[i].lPurchaseInAdditionalCostId &&
          (withIdandDeletedrows[i].name ||
            withIdandDeletedrows[i].description ||
            withIdandDeletedrows[i].accountsId)
        ) {
          const tempObjUpdate: IUpdateLPurchaseInAdditionalCostCommand = {
            lPurchaseInAdditionalCostId:
              withIdandDeletedrows[i].lPurchaseInAdditionalCostId,
            lPurchaseInId: watchedFields.lPurchaseIn?.lPurchaseInId || 0,
            name: withIdandDeletedrows[i].name || '',
            description: withIdandDeletedrows[i].description || null,
            accountsId: withIdandDeletedrows[i].accountsId || null,
            percentage: withIdandDeletedrows[i].percentage || 0,
            amount: withIdandDeletedrows[i].amount || 0,
          };
          updateLPurchaseInAdditionalCostCommand.push(tempObjUpdate);
        }
      }
    }
    return {
      createLPurchaseInAdditionalCostCommand,
      updateLPurchaseInAdditionalCostCommand,
      deleteLPurchaseInAdditionalCostCommand,
    };
    // -----------------[----DONE----LPurchaseInAdditionalCost Processing  ----DONE----]--------------------
  };

  const processAllDataAndSave = () => {
    console.log('save button clicked');

    const z = lPurchaseInAdditionalCostProcessing();

    console.log('LPurchaseInAdditionalCostProcessing');
    console.log(z.createLPurchaseInAdditionalCostCommand);
    console.log('LPurchaseInAdditionalCostProcessing Create----->>>');
    console.log('LPurchaseInAdditionalCostProcessing Update----->>>');
    console.log('LPurchaseInAdditionalCostProcessing Delete----->>>');

    console.log(
      'rupom dekh----------------------------------------------------->'
    );
    console.log(clickedCardInfo?.biznessEventProcessConfigurationId);

    const objToSend: ILPurchaseInProcessCommandsVM = {
      createLPurchaseInAdditionalCostCommand:
        lPurchaseInAdditionalCostProcessing()
          .createLPurchaseInAdditionalCostCommand,
      updateLPurchaseInAdditionalCostCommand:
        lPurchaseInAdditionalCostProcessing()
          .updateLPurchaseInAdditionalCostCommand,
      deleteLPurchaseInAdditionalCostCommand:
        lPurchaseInAdditionalCostProcessing()
          .deleteLPurchaseInAdditionalCostCommand,
      createBiznessEventPCTrackCommand: null,
      lPurchaseInId: null,
    };

    if (areAllPropertiesFalsy(objToSend)) {
      toast.error('No changes has been made!');
      return false;
    }

    // checking if all rows have accountsId
    const invalidIndexes = lPurchaseInAdditionalCostState
      .filter(
        (row) =>
          row.accountsId ||
          row.amount ||
          row.description ||
          row.name ||
          row.percentage
      )
      .reduce<number[]>((acc, item, index) => {
        if (!item.accountsId) {
          acc.push(index);
        }
        return acc;
      }, []);

    if (invalidIndexes.length) {
      toast.error(
        `Please enter Accounts Name in row: ${invalidIndexes.join(',')}`
      );
      return false;
    }

    objToSend.lPurchaseInId = watchedFields.lPurchaseIn?.lPurchaseInId;
    // pc track e data dhukabo kina and ki dhuka
    const tempTaskDate = dayjs().format('YYYY-MM-DD');
    const tempTaskTime = dayjs().format('HH:mm');
    const taskStartDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;
    const taskEndDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;

    if (clickedCardInfo?.biznessEventProcessConfigurationId) {
      objToSend.createBiznessEventPCTrackCommand = {
        // eventNo: clickedCardInfo?.eventNo,
        eventNo: watchedFields.lPurchaseIn?.lPurchaseInNo
          ? watchedFields.lPurchaseIn.lPurchaseInNo
          : '',

        performedBy: userInfo.securityUserId,
        startDate: taskStartDate,
        endDate: taskEndDate,
        note: 'LPurchaseIn Additional Cost CRUD',
        progressPReported: 100,
        originalSequence: clickedCardInfo.sequence,
        nextSequence: clickedCardInfo.sequence + 1,
        complete: false,
        biznessEventProcessConfigurationId:
          clickedCardInfo.biznessEventProcessConfigurationId,
        firstEventNo: clickedCardInfo.firstEventNo,
        locationId: clickedCardInfo.eventLocationId || userInfo.locationId || 0,
      };
    }

    console.log('Obj to send Finally haha see--------->>');
    console.log(objToSend);

    processSaveLPurchaseIn(objToSend);
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
      fontSize: '12px',
    },
  };
  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  ); // Empty dependency array as PopperMy doesn't depend on any external variables

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

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Supplier Number', id: 'SupplierNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, SupplierNumber: 49 },{VoucherNo: 456, SupplierNumber: 60 }]. Unfortunately jodi [{SupplierNumber: 49, VoucherNo: 123,  },{SupplierNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

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

  const lPurchaseInAdditionalCostColumns = useMemo<
    MRT_ColumnDef<ILPurchaseInAdditionalCost>[]
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
                  if (row.original.lPurchaseInAdditionalCostId) {
                    const tempDeletedObj: IDeleteLPurchaseInAdditionalCostCommand =
                      {
                        lPurchaseInAdditionalCostId:
                          row.original.lPurchaseInAdditionalCostId,
                      };

                    deletedRowLPurchaseInAdditionalCost?.push(tempDeletedObj);
                  }
                  lPurchaseInAdditionalCostState?.splice(row.index, 1);
                  if (lPurchaseInAdditionalCostState) {
                    setLPurchaseInAdditionalCostState([
                      ...lPurchaseInAdditionalCostState,
                    ]);
                  } else {
                    setLPurchaseInAdditionalCostState([]);
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
              InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                lPurchaseInAdditionalCostState[row.index].name =
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
              InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                lPurchaseInAdditionalCostState[row.index].description =
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
                      fontSize: 10, // Set the font size
                      marginTop: 0, // Set the margin
                      color: 'red', // Set the color (example)
                    },
                  }}
                  InputProps={{
                    style: { fontSize: 13 },
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
                    lPurchaseInAdditionalCostState[row.index].percentage =
                      Number.isNaN(parseFloat(e.target.value))
                        ? null
                        : parseFloat(e.target.value);
                    checkAndSetTableValues(row.index);
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
                      fontSize: 10, // Set the font size
                      marginTop: 0, // Set the margin
                      color: 'red', // Set the color (example)
                    },
                  }}
                  InputProps={{
                    style: { fontSize: 13 },
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
                    lPurchaseInAdditionalCostState[row.index].amount =
                      Number.isNaN(parseFloat(e.target.value))
                        ? null
                        : Math.abs(parseFloat(e.target.value));
                    checkAndSetTableValues(row.index);
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
              lPurchaseInAdditionalCostState[row.index].accountsId || null,
            accountsName:
              lPurchaseInAdditionalCostState[row.index].accountsName || '',
          };

          return (
            <Controller
              name={`accountsName_row${row.index}`}
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
                  freeSolo
                  // options={accountsOptionsData || []} // Make sure bankComboOptions is defined
                  options={
                    Array.from(
                      new Map(
                        AccountsComboOptions?.map((accountsOptionsDataRow) => [
                          accountsOptionsDataRow.accountsName,
                          accountsOptionsDataRow,
                        ])
                      ).values()
                    ) || []
                  } // making sure that the array is unique by accountsName, else autocomplete search ultapalta behave kore
                  value={currentAccounts}
                  onChange={(event, selectedOption: any) => {
                    lPurchaseInAdditionalCostState[row.index].accountsId =
                      selectedOption?.accountsId || null;
                    lPurchaseInAdditionalCostState[row.index].accountsName =
                      selectedOption?.accountsName || '';
                    checkAndSetTableValues(row.index);
                    lPurchaseInAdditionalCostState[row.index].name =
                      selectedOption?.name || '';
                    checkAndSetTableValues(row.index);

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
    ],
    [
      PopperMy,
      checkAndSetTableValues,
      lPurchaseInAdditionalCostState,
      //   chequeBookGrid,
      //   PopperMy,
    ]
  );

  const tableInitializer: MRT_TableInstance<ILPurchaseInAdditionalCost> =
    useMaterialReactTable({
      columns: lPurchaseInAdditionalCostColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: lPurchaseInAdditionalCostState || [],
      state: {
        // isLoading:
        //   lPurchaseInDetailLoading || lPurchaseInDetailFetching,
        columnVisibility,
      },
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 40,
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
          fontSize: '13px',
          color: '#303030',
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

      muiTableContainerProps: { sx: { maxHeight: '500px' } },
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
                handleExportData(
                  lPurchaseInAdditionalCostState,
                  lPurchaseInAdditionalCostColumns
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
          <p className=" mt-1 font-bold text-[13px]">
            LPurchaseIn Additional Cost
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
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          {/* Main Card */}
          {/* <form onSubmit={handleSubmit(downloadReport)}> */}
          <form onSubmit={handleSubmit(processAllDataAndSave)}>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[TransactionEventVoucher experimental place starts here]----- */}
                {/* -----[Laboratory experimental place starts here]----- */}
                {clickedCardInfo
                  ? clickedCardInfo?.biznessEventName.replace(
                      /([A-Z])(?=[A-Z][a-z])/g,
                      '$1 '
                    )
                  : 'LPurchaseIn Additional Cost'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start  mt-5">
                <div className="grid grid-cols-3 gap-3">
                  <Controller
                    name="lPurchaseIn"
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
                        // disabled={}
                        readOnly={
                          !!clickedCardInfo?.biznessEventProcessConfigurationId
                        }
                        // options={lPurchaseInOptions || []} // Make sure lPurchaseInOptions is defined
                        options={
                          Array.from(
                            new Map(
                              lPurchaseInAndSupplierOptions
                                ?.filter(
                                  (lPurchaseInRow) =>
                                    lPurchaseInRow.lPurchaseInId !== 0
                                ) // Exclude supplierId = 0
                                .map((lPurchaseInRow) => [
                                  lPurchaseInRow.lPurchaseInNo,
                                  {
                                    lPurchaseInNo: lPurchaseInRow.lPurchaseInNo,
                                    lPurchaseInId: lPurchaseInRow.lPurchaseInId,
                                  }, // Only keep needed fields
                                ])
                            ).values()
                          ) || []
                        } // Make sure lPurchaseInOptions is defined
                        value={value || null}
                        onChange={
                          (event, item) => {
                            onChange(item);

                            if (item) {
                              const supplierOfThatPurchase =
                                lPurchaseInAndSupplierOptions?.find(
                                  (row) =>
                                    row.lPurchaseInId === item.lPurchaseInId
                                );
                              setValue('supplier', supplierOfThatPurchase);
                            } else {
                              setValue('supplier', null);
                              setLPurchaseInAdditionalCostState([]);
                              setLPurchaseInAdditionalCostStatePrev([]);
                              setDeletedRowLPurchaseInAdditionalCost([]);
                              setValue('remarks', '');
                              setValue('lPurchaseInDate', dayjs());
                            }
                          }
                          // handleLPurchaseInChange(item, onChange)
                        } // React-hook-form manages the state
                        onBlur={onBlur} // Trigger validation on blur
                        getOptionLabel={(option) =>
                          option ? option.lPurchaseInNo : ''
                        }
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.lPurchaseInNo ===
                            selectedValue?.lPurchaseInNo &&
                          option.lPurchaseInId === selectedValue?.lPurchaseInId
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="LPurchaseIn No"
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
                    name="supplier"
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
                        // loading={!lPurchaseInAndSupplierOptionsLoading && !lPurchaseInAndSupplierOptionsIsFetching}
                        // options={lPurchaseInAndSupplierOptions || []} // Make sure customerComboOptions is defined
                        options={
                          Array.from(
                            new Map(
                              lPurchaseInAndSupplierOptions
                                ?.filter(
                                  (supplier) => supplier.supplierId !== 0
                                ) // Exclude supplierId = 0
                                .map((supplier) => [
                                  supplier.supplierName,
                                  {
                                    supplierName: supplier.supplierName,
                                    supplierId: supplier.supplierId,
                                  }, // Only keep needed fields
                                ])
                            ).values()
                          ) || []
                        } // making sure that the array is unique by supplierName, else autocomplete search ultapalta behave kore
                        value={value || null}
                        // PopperComponent={PopperMy}
                        onChange={(event, selectedOption) => {
                          // handleCustomerChange(selectedOption, onChange);
                          onChange(selectedOption);

                          if (selectedOption) {
                            const matches =
                              lPurchaseInAndSupplierOptions?.filter(
                                (row) =>
                                  row.supplierId === selectedOption.supplierId
                              );
                            if (matches?.length === 1) {
                              setValue('lPurchaseIn', matches[0]);
                            }
                          } else {
                            // setValue('lPurchaseIn', null);
                          }
                        }} // React-hook-form manages the state
                        onBlur={onBlur} // Trigger validation on blur
                        // getOptionLabel={(option) =>
                        //   option ? `${option.supplierName}- id:${option.supplierId}` : ''
                        // } // main problem is here
                        getOptionLabel={(option) =>
                          option ? option.supplierName : ''
                        } // main problem is here
                        // getOptionLabel={(option) => (option ? option.supplierName : '')} // main problem is here
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.supplierId === selectedValue?.supplierId &&
                          option.supplierName === selectedValue?.supplierName
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Supplier"
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
                    name="lPurchaseInDate"
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={(newValue) => {
                            //   handleTenderEntryDateChange(newValue, onChange);
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
                  <div className="col-span-3">
                    <Controller
                      name="remarks"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          value={value || ''}
                          sx={{ width: '100%' }}
                          InputProps={{ style: { fontSize: 13 } }}
                          InputLabelProps={{
                            style: { fontSize: 14 },
                            shrink: !!value,
                          }}
                          // onBlur={onBlur} // Trigger validation on blur
                          error={!!error}
                          helperText={error ? error.message : null}
                          // inputRef={ref}
                          id=""
                          label="Remarks"
                          variant="standard"
                          size="small"
                          onBlur={(event) => {
                            //   // Update the state with the current value
                            //   (lPurchaseInState ?? {}).remarks = event.target.value || '';
                            //   setLPurchaseInState(lPurchaseInState);
                            //   // Call the original onBlur to trigger validation
                            //   onBlur();
                          }} // Trigger validation on blur
                          // onChange={onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-3 w-full m-1 modifiedEditTable">
                    <MaterialReactTable table={tableInitializer} />
                  </div>
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    // onClick={() => {
                    //   // processAllDataAndSave();
                    //   console.log('Haha LPurchaseIn save submit called');
                    // }}
                  >
                    {processSaveLPurchaseInIsLoading && (
                      <CircularProgress size={12} color="inherit" />
                    )}
                    {'  '}
                    {processSaveLPurchaseInIsLoading ? 'Saving...' : 'Save'}
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

export default LPurchaseInAdditionalCost;
