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
// import { useLazyGetBuyerByCompanyLocationIdQuery } from '../../../infrastructure/api/BuyerApiSlice';

import {
  useGetAccountsFromChargeTypeQuery,
  useGetAllAccountsNameByCompanyIdQuery,
} from '../../../infrastructure/api/AccountsNameApiSlice';

import {
  ICreateSalesOrderAdditionalCostCommand,
  IDeleteSalesOrderAdditionalCostCommand,
  ISalesOrderAdditionalCost,
  ISalesOrderProcessCommandsVM,
  IUpdateSalesOrderAdditionalCostCommand,
} from '../../../domain/interfaces/SalesOrderInterface';
import {
  useLazyGetAllSalesOrderNoQuery,
  useLazyGetSalesOrderAdditionalCostBySalesOrderIdQuery,
  useLazyGetSalesOrderBySalesOrderIdQuery,
  useLazyGetSalesOrderNoAndBuyerQuery,
  useProcessSaveSalesOrderMutation,
} from '../../../infrastructure/api/SalesOrderApiSlice';

type Props = {};

const SalesOrderAdditionalCost = ({
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
    //   salesOrder: null,
    //   buyer: null,
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
    deletedRowSalesOrderAdditionalCost,
    setDeletedRowSalesOrderAdditionalCost,
  ] = useState<IDeleteSalesOrderAdditionalCostCommand[]>([]);

  const [salesOrderAdditionalCostState, setSalesOrderAdditionalCostState] =
    useState<ISalesOrderAdditionalCost[]>([]);
  const [
    salesOrderAdditionalCostStatePrev,
    setSalesOrderAdditionalCostStatePrev,
  ] = useState<ISalesOrderAdditionalCost[]>([]);

  // ----------------------[api hooks]---------------

  // SalesOrderNo autocomp options

  // const [
  //   triggerGetSalesOrderOptions,
  //   {
  //     data: salesOrderOptionsData,
  //     error: salesOrderOptionsError,
  //     isError: salesOrderOptionsIsError,
  //     isSuccess: salesOrderOptionsIsSuccess,
  //     isLoading: salesOrderOptionsIsLoading,
  //     isFetching: salesOrderOptionsIsFetching,
  //   },
  // ] = useLazyGetAllSalesOrderNoQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (salesOrderOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching salesOrderNo options for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching TENDER NO options for autocomplete, see console--->:'
  //     );
  //     console.log(salesOrderOptionsError);
  //   }
  // }, [
  //   salesOrderOptionsIsLoading,
  //   salesOrderOptionsIsError,
  //   salesOrderOptionsError,
  //   salesOrderOptionsIsSuccess,
  // ]);

  const [
    triggerSalesOrderAndBuyerOptions,
    {
      data: salesOrderAndBuyerOptions,
      error: salesOrderAndBuyerOptionsError,
      isError: salesOrderAndBuyerOptionsIsError,
      isSuccess: salesOrderAndBuyerOptionsIsSuccess,
      isLoading: salesOrderAndBuyerOptionsLoading,
      isFetching: salesOrderAndBuyerOptionsIsFetching,
    },
  ] = useLazyGetSalesOrderNoAndBuyerQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (salesOrderAndBuyerOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyer/salesOrder options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyer/salesOrder options for autocomplete, see console--->:'
      );
    } else if (
      !salesOrderAndBuyerOptionsLoading &&
      !salesOrderAndBuyerOptionsIsError &&
      salesOrderAndBuyerOptions &&
      salesOrderAndBuyerOptionsIsSuccess &&
      !salesOrderAndBuyerOptionsIsFetching
    ) {
      if (clickedCardInfo?.biznessEventProcessConfigurationId) {
        const matchedRow = salesOrderAndBuyerOptions.find(
          (row) => row.salesOrderNo === clickedCardInfo.eventNo
        );

        if (matchedRow) {
          const tempSalesOrder = {
            salesOrderNo: matchedRow?.salesOrderNo,
            salesOrderId: matchedRow?.salesOrderId,
          };
          const tempBuyer = {
            buyerId: matchedRow?.buyerId,
            buyerName: matchedRow?.buyerName,
          };

          if (
            watchedFields.salesOrder?.salesOrderNo !==
            tempSalesOrder.salesOrderNo
          ) {
            // console.log(tempSalesOrder);
            setValue('salesOrder', tempSalesOrder);
            setValue('buyer', tempBuyer);
          }
        }
      }
    }
  }, [
    salesOrderAndBuyerOptionsLoading,
    salesOrderAndBuyerOptionsIsError,
    salesOrderAndBuyerOptionsError,
    salesOrderAndBuyerOptions,
    salesOrderAndBuyerOptionsIsSuccess,
    salesOrderAndBuyerOptionsIsFetching,
  ]);

  const [
    triggerGetSalesOrderMasterData,
    {
      data: salesOrderData,
      error: salesOrderError,
      isError: salesOrderIsError,
      isSuccess: salesOrderIsSuccess,
      isLoading: salesOrderLoading,
      isFetching: salesOrderIsFetching,
    },
  ] = useLazyGetSalesOrderBySalesOrderIdQuery();

  useEffect(() => {
    if (salesOrderIsError) {
      setDeletedRowSalesOrderAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching salesOrderMaster table data, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesOrderMaster table data, see console--->:'
      );
      console.log(salesOrderError);
    }

    if (
      salesOrderData &&
      salesOrderIsSuccess &&
      !salesOrderLoading &&
      !salesOrderIsError &&
      !salesOrderIsFetching
    ) {
      // Only set value if it's different
      if (getValues('remarks') !== salesOrderData.remarks) {
        setValue('remarks', salesOrderData.remarks);
      }
      if (
        dayjs(getValues('salesOrderDate')).toString() !==
        dayjs(salesOrderData.salesOrderDate).toString()
      ) {
        setValue('salesOrderDate', dayjs(salesOrderData.salesOrderDate));
      }
      // setValue('remarks', salesOrderData.remarks);
      // setValue('salesOrderDate', dayjs(salesOrderData.salesOrderDate));
    }
  }, [
    salesOrderLoading,
    salesOrderIsError,
    salesOrderError,
    salesOrderIsFetching,
    salesOrderData,
    salesOrderIsSuccess,
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
  // useEffect(() => {
  //   if (AccountsComboOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching accounts from Accounts&ChargeType tables for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching accounts from Accounts&ChargeType tables for autocomplete, see console--->:'
  //     );
  //     console.log(AccountsComboOptionsError);
  //   }
  // }, [
  //   AccountsComboOptionsLoading,
  //   AccountsComboOptionsIsError,
  //   AccountsComboOptionsError,
  //   AccountsComboOptions,
  //   AccountsComboOptionIsFetching,
  // ]);

  // salesOrderAdditionalCost autocomp options
  const [
    triggerGetSalesOrderAdditionalCost,
    {
      data: salesOrderAdditionalCostData,
      error: salesOrderAdditionalCostError,
      isError: salesOrderAdditionalCostIsError,
      isSuccess: salesOrderAdditionalCostIsSuccess,
      isLoading: salesOrderAdditionalCostLoading,
      isFetching: salesOrderAdditionalCostIsFetching,
    },
  ] = useLazyGetSalesOrderAdditionalCostBySalesOrderIdQuery();

  useEffect(() => {
    if (salesOrderAdditionalCostIsError) {
      setDeletedRowSalesOrderAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching salesOrderAdditionalCost, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesOrderAdditionalCost, see console--->:'
      );
      console.log(salesOrderAdditionalCostError);
    }
    ///
    if (AccountsComboOptionsIsError) {
      setDeletedRowSalesOrderAdditionalCost([]);
      toast.error(
        'Something wrong from backend while fetching accounts from Accounts&ChargeType tables for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching accounts from Accounts&ChargeType tables for autocomplete, see console--->:'
      );
      console.log(AccountsComboOptionsError);
    }
    /// //

    let salesOrderAdditionalCostTemp: ISalesOrderAdditionalCost[] = [];
    if (
      salesOrderAdditionalCostData?.length &&
      salesOrderAdditionalCostIsSuccess &&
      !salesOrderAdditionalCostLoading &&
      !salesOrderAdditionalCostIsError &&
      !salesOrderAdditionalCostIsFetching &&
      salesOrderAdditionalCostData?.length
    ) {
      salesOrderAdditionalCostTemp = JSON.parse(
        JSON.stringify(salesOrderAdditionalCostData)
      );
    } else if (
      !salesOrderAdditionalCostData?.length &&
      AccountsComboOptions &&
      !AccountsComboOptionsLoading &&
      !AccountsComboOptionsIsError &&
      !AccountsComboOptionIsFetching
    ) {
      for (let i = 0; i < AccountsComboOptions.length || 0; i++) {
        const objTemp: ISalesOrderAdditionalCost = {
          salesOrderAdditionalCostId: null,
          name: AccountsComboOptions[i].name,
          description: '',
          percentage: null,
          amount: null,
          accountsId: AccountsComboOptions[i].accountsId,
          accountsName: AccountsComboOptions[i].accountsName,
        };
        salesOrderAdditionalCostTemp.push(objTemp);
      }
    }

    if (
      salesOrderAdditionalCostTemp &&
      salesOrderAdditionalCostIsSuccess &&
      !salesOrderAdditionalCostLoading &&
      !salesOrderAdditionalCostIsError &&
      !salesOrderAdditionalCostIsFetching &&
      AccountsComboOptions &&
      !AccountsComboOptionsLoading &&
      !AccountsComboOptionsIsError &&
      !AccountsComboOptionIsFetching &&
      ((!salesOrderAdditionalCostTemp.length &&
        !salesOrderAdditionalCostStatePrev.length &&
        !watchedFields.salesOrder) ||
        JSON.stringify(salesOrderAdditionalCostTemp) !==
          JSON.stringify(salesOrderAdditionalCostStatePrev))
    ) {
      console.log('Hello ami print hoisi 2');
      console.log(salesOrderAdditionalCostTemp);
      console.log(salesOrderAdditionalCostStatePrev);
      console.log(
        JSON.stringify(salesOrderAdditionalCostTemp) ===
          JSON.stringify(salesOrderAdditionalCostStatePrev)
      );

      setDeletedRowSalesOrderAdditionalCost([]);

      const copyOfSalesOrderAdditionalCost = JSON.parse(
        JSON.stringify(salesOrderAdditionalCostTemp)
      );
      const copyOfSalesOrderAdditionalCost2 = JSON.parse(
        JSON.stringify(salesOrderAdditionalCostTemp)
      );
      const emptySalesOrderAdditionalCostArray = [];
      if (
        copyOfSalesOrderAdditionalCost &&
        copyOfSalesOrderAdditionalCost.length < 10
      ) {
        for (let i = copyOfSalesOrderAdditionalCost.length - 1; i < 10; i++) {
          const emptySalesOrderAdditionalCostObj: ISalesOrderAdditionalCost = {
            salesOrderAdditionalCostId: null,
            name: '',
            description: '',
            percentage: null,
            amount: null,
            accountsId: null,
            accountsName: '',
          };
          emptySalesOrderAdditionalCostArray.push(
            emptySalesOrderAdditionalCostObj
          );
        }
      } else if (
        copyOfSalesOrderAdditionalCost &&
        copyOfSalesOrderAdditionalCost.length > 9
      ) {
        const emptySalesOrderAdditionalCostObj: ISalesOrderAdditionalCost = {
          salesOrderAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        emptySalesOrderAdditionalCostArray.push(
          emptySalesOrderAdditionalCostObj
        );
      }

      setSalesOrderAdditionalCostState([
        ...copyOfSalesOrderAdditionalCost,
        ...emptySalesOrderAdditionalCostArray,
      ]);
      setSalesOrderAdditionalCostStatePrev(copyOfSalesOrderAdditionalCost2);
    }
  }, [
    salesOrderAdditionalCostLoading,
    salesOrderAdditionalCostIsError,
    salesOrderAdditionalCostError,
    salesOrderAdditionalCostIsFetching,
    salesOrderAdditionalCostData,
    salesOrderAdditionalCostIsSuccess,

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
    const { salesOrder, buyer } = watchedFields;

    triggerSalesOrderAndBuyerOptions({
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
      buyerId: buyer?.buyerId,
      salesOrderId: salesOrder?.salesOrderId,
      // salesOrderId: salesOrder?.salesOrderId || 0
    });
  }, [watchedFields.buyer]);

  useEffect(() => {
    const { salesOrder, buyer } = watchedFields;

    triggerSalesOrderAndBuyerOptions({
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
      buyerId: buyer?.buyerId,
      salesOrderId: salesOrder?.salesOrderId,
      // salesOrderId: salesOrder?.salesOrderId || 0
    });

    if (salesOrder?.salesOrderId) {
      triggerGetSalesOrderMasterData({
        salesOrderId: salesOrder.salesOrderId,
      }).refetch();
      triggerGetSalesOrderAdditionalCost({
        salesOrderId: salesOrder.salesOrderId,
      }).refetch();
    }
    // // ----set 10 empty rows if no salesOrderNo
    if (!salesOrder?.salesOrderNo) {
      const emptyArray = [];
      for (let i = 0; i < 10; i++) {
        const emptySalesOrderAdditionalCostObj: ISalesOrderAdditionalCost = {
          salesOrderAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        emptyArray.push(emptySalesOrderAdditionalCostObj);
      }
      setSalesOrderAdditionalCostState([...emptyArray]);
    }
    // // -------------------------------------------------------
  }, [watchedFields.salesOrder]);

  const [
    processSaveSalesOrder,
    {
      isLoading: processSaveSalesOrderIsLoading,
      isError: processSaveSalesOrderIsError,
      error: processSaveSalesOrderError,
      isSuccess: processSaveSalesOrderIsSuccess,
      data: processSaveSalesOrderData,
    },
  ] = useProcessSaveSalesOrderMutation();

  useEffect(() => {
    // if (!processSaveSalesOrderIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveSalesOrderIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `SalesOrder has been saved successfully!`,
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
          console.log(processSaveSalesOrderData);
          setValue('salesOrder', watchedFields.salesOrder);
        }
      });
    } else if (processSaveSalesOrderIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving SalesOrder data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving SalesOrder data, see console---->'
      );
      console.log(processSaveSalesOrderError);
    }
  }, [
    processSaveSalesOrderIsLoading,
    processSaveSalesOrderIsError,
    processSaveSalesOrderData,
    processSaveSalesOrderError,
    processSaveSalesOrderIsSuccess,
  ]);

  const checkAndSetTableValues = useCallback(
    (index: number) => {
      if (index === salesOrderAdditionalCostState.length - 1) {
        const emptySalesOrderAdditionalCost: ISalesOrderAdditionalCost = {
          salesOrderAdditionalCostId: null,
          name: '',
          description: '',
          percentage: null,
          amount: null,
          accountsId: null,
          accountsName: '',
        };
        setSalesOrderAdditionalCostState([
          ...salesOrderAdditionalCostState,
          emptySalesOrderAdditionalCost,
        ]);
      } else {
        setSalesOrderAdditionalCostState([...salesOrderAdditionalCostState]);
      }
    },
    [salesOrderAdditionalCostState]
  );

  // -----------------[validation functions]-----------------------
  const validateAccounts = (
    value: any,
    allFields: ISalesOrderAdditionalCost
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
    allFields: ISalesOrderAdditionalCost
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

  const salesOrderAdditionalCostProcessing = () => {
    // -----------------[SalesOrderAdditionalCost Processing]--------------------

    const createSalesOrderAdditionalCostCommand: ICreateSalesOrderAdditionalCostCommand[] =
      [];
    const updateSalesOrderAdditionalCostCommand: IUpdateSalesOrderAdditionalCostCommand[] =
      [];
    const deleteSalesOrderAdditionalCostCommand: IDeleteSalesOrderAdditionalCostCommand[] =
      [...deletedRowSalesOrderAdditionalCost];

    const prevSalesOrderAdditionalCost: ISalesOrderAdditionalCost[] =
      JSON.parse(JSON.stringify(salesOrderAdditionalCostStatePrev));

    let currentSalesOrderAdditionalCost: ISalesOrderAdditionalCost[] =
      JSON.parse(JSON.stringify(salesOrderAdditionalCostState));

    const deletedSalesOrderAdditionalCostRows: IDeleteSalesOrderAdditionalCostCommand[] =
      JSON.parse(JSON.stringify(deletedRowSalesOrderAdditionalCost));

    // eliminating all faka dummy rows
    currentSalesOrderAdditionalCost = currentSalesOrderAdditionalCost.filter(
      (obj) => Object.values(obj).some((val) => val)
    );

    prevSalesOrderAdditionalCost.sort(
      (a, b) =>
        (a.salesOrderAdditionalCostId ?? 0) -
        (b.salesOrderAdditionalCostId ?? 0)
    );

    const rowsWithId: ISalesOrderAdditionalCost[] = [];

    console.log('currentSalesOrderAdditionalCost-------------->');
    console.log(currentSalesOrderAdditionalCost);

    for (let i = 0; i < currentSalesOrderAdditionalCost.length; i++) {
      // jegulay primaryKey id nai, oigula sure to create
      if (!currentSalesOrderAdditionalCost[i].salesOrderAdditionalCostId) {
        const tempObj: ICreateSalesOrderAdditionalCostCommand = {
          // salesOrderAdditionalCostId: 0,
          salesOrderId: watchedFields.salesOrder?.salesOrderId
            ? watchedFields.salesOrder?.salesOrderId
            : null,

          name: currentSalesOrderAdditionalCost[i].name || '',
          description: currentSalesOrderAdditionalCost[i].description,
          accountsId: currentSalesOrderAdditionalCost[i].accountsId,
          percentage: currentSalesOrderAdditionalCost[i].percentage || 0,
          amount: currentSalesOrderAdditionalCost[i].amount,
        };
        createSalesOrderAdditionalCostCommand.push(tempObj);
      } else {
        rowsWithId.push(currentSalesOrderAdditionalCost[i]);
      }
    }

    // ekhon deleted aar id wala rows ekshathe mishaya sort dibo, then compare korbo, compare e jodi equal na hoy tahole abar if diye check korbo oder primaryId baade j kono ekta mandatory field e value ase naki(jehetu delete er gulay shudhu primaryId ase), jodi thake then rowToUpdate e dhukabo

    const withIdandDeletedrows: any = [
      ...currentSalesOrderAdditionalCost,
      ...deletedSalesOrderAdditionalCostRows,
    ];
    withIdandDeletedrows.sort(
      (a: any, b: any) =>
        (a.salesOrderAdditionalCostId ?? 0) -
        (b.salesOrderAdditionalCostId ?? 0)
    );

    for (let i = 0; i < withIdandDeletedrows.length; i++) {
      const prevRow = JSON.stringify(prevSalesOrderAdditionalCost[i]);
      const gridRow = JSON.stringify(withIdandDeletedrows[i]);

      if (prevRow !== gridRow) {
        if (
          withIdandDeletedrows[i].salesOrderAdditionalCostId &&
          (withIdandDeletedrows[i].name ||
            withIdandDeletedrows[i].description ||
            withIdandDeletedrows[i].accountsId)
        ) {
          const tempObjUpdate: IUpdateSalesOrderAdditionalCostCommand = {
            salesOrderAdditionalCostId:
              withIdandDeletedrows[i].salesOrderAdditionalCostId,
            salesOrderId: watchedFields.salesOrder?.salesOrderId || 0,
            name: withIdandDeletedrows[i].name || '',
            description: withIdandDeletedrows[i].description || null,
            accountsId: withIdandDeletedrows[i].accountsId || null,
            percentage: withIdandDeletedrows[i].percentage || 0,
            amount: withIdandDeletedrows[i].amount || 0,
          };
          updateSalesOrderAdditionalCostCommand.push(tempObjUpdate);
        }
      }
    }
    return {
      createSalesOrderAdditionalCostCommand,
      updateSalesOrderAdditionalCostCommand,
      deleteSalesOrderAdditionalCostCommand,
    };
    // -----------------[----DONE----SalesOrderAdditionalCost Processing  ----DONE----]--------------------
  };

  const processAllDataAndSave = () => {
    console.log('save button clicked');

    const z = salesOrderAdditionalCostProcessing();

    console.log('SalesOrderAdditionalCostProcessing');
    console.log(z.createSalesOrderAdditionalCostCommand);
    console.log('SalesOrderAdditionalCostProcessing Create----->>>');
    console.log('SalesOrderAdditionalCostProcessing Update----->>>');
    console.log('SalesOrderAdditionalCostProcessing Delete----->>>');

    console.log(
      'rupom dekh----------------------------------------------------->'
    );
    console.log(clickedCardInfo?.biznessEventProcessConfigurationId);

    const objToSend: ISalesOrderProcessCommandsVM = {
      createSalesOrderAdditionalCostCommand:
        salesOrderAdditionalCostProcessing()
          .createSalesOrderAdditionalCostCommand,
      updateSalesOrderAdditionalCostCommand:
        salesOrderAdditionalCostProcessing()
          .updateSalesOrderAdditionalCostCommand,
      deleteSalesOrderAdditionalCostCommand:
        salesOrderAdditionalCostProcessing()
          .deleteSalesOrderAdditionalCostCommand,
      createBiznessEventPCTrackCommand: null,
      salesOrderId: null,
    };

    if (areAllPropertiesFalsy(objToSend)) {
      toast.error('No changes has been made!');
      return false;
    }

    // checking if all rows have accountsId
    const invalidIndexes = salesOrderAdditionalCostState
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

    objToSend.salesOrderId = watchedFields.salesOrder?.salesOrderId;
    // pc track e data dhukabo kina and ki dhuka
    const tempTaskDate = dayjs().format('YYYY-MM-DD');
    const tempTaskTime = dayjs().format('HH:mm');
    const taskStartDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;
    const taskEndDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;

    if (clickedCardInfo?.biznessEventProcessConfigurationId) {
      objToSend.createBiznessEventPCTrackCommand = {
        // eventNo: clickedCardInfo?.eventNo,
        eventNo: watchedFields.salesOrder?.salesOrderNo
          ? watchedFields.salesOrder.salesOrderNo
          : '',

        performedBy: userInfo.securityUserId,
        startDate: taskStartDate,
        endDate: taskEndDate,
        note: 'SalesOrder Additional Cost CRUD',
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

    processSaveSalesOrder(objToSend);
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

  const salesOrderAdditionalCostColumns = useMemo<
    MRT_ColumnDef<ISalesOrderAdditionalCost>[]
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
                  if (row.original.salesOrderAdditionalCostId) {
                    const tempDeletedObj: IDeleteSalesOrderAdditionalCostCommand =
                      {
                        salesOrderAdditionalCostId:
                          row.original.salesOrderAdditionalCostId,
                      };

                    deletedRowSalesOrderAdditionalCost?.push(tempDeletedObj);
                  }
                  salesOrderAdditionalCostState?.splice(row.index, 1);
                  if (salesOrderAdditionalCostState) {
                    setSalesOrderAdditionalCostState([
                      ...salesOrderAdditionalCostState,
                    ]);
                  } else {
                    setSalesOrderAdditionalCostState([]);
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
                salesOrderAdditionalCostState[row.index].name =
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
                salesOrderAdditionalCostState[row.index].description =
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
                    salesOrderAdditionalCostState[row.index].percentage =
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
                    salesOrderAdditionalCostState[row.index].amount =
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
              salesOrderAdditionalCostState[row.index].accountsId || null,
            accountsName:
              salesOrderAdditionalCostState[row.index].accountsName || '',
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
                    salesOrderAdditionalCostState[row.index].accountsId =
                      selectedOption?.accountsId || null;
                    salesOrderAdditionalCostState[row.index].accountsName =
                      selectedOption?.accountsName || '';
                    checkAndSetTableValues(row.index);
                    salesOrderAdditionalCostState[row.index].name =
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
      PopperMy,
      checkAndSetTableValues,
      salesOrderAdditionalCostState,
      //   chequeBookGrid,
      //   PopperMy,
    ]
  );

  const tableInitializer: MRT_TableInstance<ISalesOrderAdditionalCost> =
    useMaterialReactTable({
      columns: salesOrderAdditionalCostColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: salesOrderAdditionalCostState || [],
      state: {
        // isLoading:
        //   salesOrderDetailLoading || salesOrderDetailFetching,
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
                  salesOrderAdditionalCostState,
                  salesOrderAdditionalCostColumns
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
            SalesOrder Additional Cost
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
                  : 'SalesOrder Additional Cost'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start  mt-5">
                <div className="grid grid-cols-3 gap-3">
                  <Controller
                    name="salesOrder"
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
                        // options={salesOrderOptions || []} // Make sure salesOrderOptions is defined
                        options={
                          Array.from(
                            new Map(
                              salesOrderAndBuyerOptions
                                ?.filter(
                                  (salesOrderRow) =>
                                    salesOrderRow.salesOrderId !== 0
                                ) // Exclude buyerId = 0
                                .map((salesOrderRow) => [
                                  salesOrderRow.salesOrderNo,
                                  {
                                    salesOrderNo: salesOrderRow.salesOrderNo,
                                    salesOrderId: salesOrderRow.salesOrderId,
                                  }, // Only keep needed fields
                                ])
                            ).values()
                          ) || []
                        } // Make sure salesOrderOptions is defined
                        value={value || null}
                        onChange={
                          (event, item) => {
                            onChange(item);

                            if (item) {
                              const buyerOfThatPurchase =
                                salesOrderAndBuyerOptions?.find(
                                  (row) =>
                                    row.salesOrderId === item.salesOrderId
                                );
                              setValue('buyer', buyerOfThatPurchase);
                            } else {
                              setValue('buyer', null);
                              setSalesOrderAdditionalCostState([]);
                              setSalesOrderAdditionalCostStatePrev([]);
                              setDeletedRowSalesOrderAdditionalCost([]);
                              setValue('remarks', '');
                              setValue('salesOrderDate', dayjs());
                            }
                          }
                          // handleSalesOrderChange(item, onChange)
                        } // React-hook-form manages the state
                        onBlur={onBlur} // Trigger validation on blur
                        getOptionLabel={(option) =>
                          option ? option.salesOrderNo : ''
                        }
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.salesOrderNo === selectedValue?.salesOrderNo &&
                          option.salesOrderId === selectedValue?.salesOrderId
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="SalesOrder No"
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
                        // loading={!salesOrderAndBuyerOptionsLoading && !salesOrderAndBuyerOptionsIsFetching}
                        // options={salesOrderAndBuyerOptions || []} // Make sure customerComboOptions is defined
                        options={
                          Array.from(
                            new Map(
                              salesOrderAndBuyerOptions
                                ?.filter((buyer) => buyer.buyerId !== 0) // Exclude buyerId = 0
                                .map((buyer) => [
                                  buyer.buyerName,
                                  {
                                    buyerName: buyer.buyerName,
                                    buyerId: buyer.buyerId,
                                  }, // Only keep needed fields
                                ])
                            ).values()
                          ) || []
                        } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
                        value={value || null}
                        // PopperComponent={PopperMy}
                        onChange={(event, selectedOption) => {
                          // handleCustomerChange(selectedOption, onChange);
                          onChange(selectedOption);

                          if (selectedOption) {
                            const matches = salesOrderAndBuyerOptions?.filter(
                              (row) => row.buyerId === selectedOption.buyerId
                            );
                            if (matches?.length === 1) {
                              setValue('salesOrder', matches[0]);
                            }
                          } else {
                            // setValue('salesOrder', null);
                          }
                        }} // React-hook-form manages the state
                        onBlur={onBlur} // Trigger validation on blur
                        // getOptionLabel={(option) =>
                        //   option ? `${option.buyerName}- id:${option.buyerId}` : ''
                        // } // main problem is here
                        getOptionLabel={(option) =>
                          option ? option.buyerName : ''
                        } // main problem is here
                        // getOptionLabel={(option) => (option ? option.buyerName : '')} // main problem is here
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.buyerId === selectedValue?.buyerId &&
                          option.buyerName === selectedValue?.buyerName
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
                            }}
                            sx={{ width: '100%', marginTop: 1 }}
                            inputRef={ref}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="salesOrderDate"
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
                          InputProps={{ style: { fontSize: '0.8125rem' } }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
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
                            //   (salesOrderState ?? {}).remarks = event.target.value || '';
                            //   setSalesOrderState(salesOrderState);
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
                    //   console.log('Haha SalesOrder save submit called');
                    // }}
                  >
                    {processSaveSalesOrderIsLoading && (
                      <CircularProgress size={12} color="inherit" />
                    )}
                    {'  '}
                    {processSaveSalesOrderIsLoading ? 'Saving...' : 'Save'}
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

export default SalesOrderAdditionalCost;
