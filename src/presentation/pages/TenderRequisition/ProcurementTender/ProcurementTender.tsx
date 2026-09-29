/* eslint-disable react/destructuring-assignment */
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
import { Controller, useForm } from 'react-hook-form';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  useGetAllTenderNoQuery,
  useGetPreviousTenderHistoryByDateRangeQuery,
  useGetProcurementTenderByTenderIdQuery,
} from '../../../../infrastructure/api/TenderApiSlice';
import { useGetBuyerByCompanyLocationIdQuery } from '../../../../infrastructure/api/BuyerApiSlice';
import { setNavbarShow } from '../../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../../application/Redux/slices/ShowPanelSlice';
import { useAppDispatch } from '../../../../application/Redux/store/store';
import { useGetSalesPersonByCompanyLocationBuyerIdQuery } from '../../../../infrastructure/api/EmployeeApiSlice';
import { IBuyer } from '../../../../domain/interfaces/BuyerInterface';
import { ISalesPersonComboBox } from '../../../../domain/interfaces/SalesPersonInterface';
import { IFormProps } from '../../../../domain/interfaces/FormPropsInterface';
import {
  IProcurementTender,
  ITenderNoComboBox,
} from '../../../../domain/interfaces/ProcurementTenderInterface';
import { IBuyerGroup } from '../../../../domain/interfaces/BuyerGroupInterface';

interface AdditionalProps {
  tenderInfo: ITenderNoComboBox | null;
  setTenderInfo: React.Dispatch<React.SetStateAction<ITenderNoComboBox | null>>;
  procurementTenderState: IProcurementTender | null;
  setProcurementTenderState: React.Dispatch<
    React.SetStateAction<IProcurementTender | null>
  >;
  procurementTenderPrevState: IProcurementTender | null;
  setProcurementTenderPrevState: React.Dispatch<
    React.SetStateAction<IProcurementTender | null>
  >;
  clickedCardInfo: any;
}

interface ProcurementTenderComponentProps extends AdditionalProps {
  formProps: IFormProps;
}

const ProcurementTender: React.FC<ProcurementTenderComponentProps> = ({
  formProps,
  tenderInfo,
  setTenderInfo,
  procurementTenderState,
  setProcurementTenderState,
  procurementTenderPrevState,
  setProcurementTenderPrevState,
  clickedCardInfo,
}) => {
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
  const [customerOutput, setCustomerOutput] = useState<IBuyer | null>(null);
  const [customerGroupOutput, setCustomerGroupOutput] =
    useState<IBuyerGroup | null>(null);

  const [durationOutput, setDurationOutput] = useState<{ duration: string }>({
    duration: 'Today',
  });
  const [convertedDurationOutput, setConvertedDurationOutput] = useState<{
    fromDate: string;
    toDate: string;
  }>({
    fromDate: '',
    toDate: '',
  });

  // ----------------------[api hooks]---------------

  // tender autocomp options
  const {
    data: tenderComboOptions,
    isLoading: tenderComboOptionsLoading,
    isSuccess: tenderComboOptionsIsSuccess,
    error: tenderComboOptionsError,
    isError: tenderComboOptionsIsError,
    isFetching: tenderComboOptionIsFetching,
    refetch: tenderComboOptionsRefetch,
  } = useGetAllTenderNoQuery();

  useEffect(() => {
    if (tenderComboOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching tenderNo options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching TENDER NO options for autocomplete, see console--->:'
      );
      console.log(tenderComboOptionsError);
    }
    // else if (
    //   tenderComboOptionsIsSuccess &&
    //   !tenderComboOptionsIsError &&
    //   !tenderComboOptionsLoading &&
    //   !tenderComboOptionIsFetching &&
    //   tenderComboOptions
    // ) {
    //   if (tenderInfo?.tenderNo && !tenderInfo?.procurementTenderId) {
    //     const tenderObj = tenderComboOptions.find(
    //       (row) => row.tenderNo === tenderInfo?.tenderNo
    //     );
    //     const tenderObjTemp = tenderObj || null;
    //     setTenderInfo(tenderObjTemp);
    //   }
    // }
  }, [
    tenderComboOptionsLoading,
    tenderComboOptionsIsError,
    tenderComboOptionsError,
    tenderComboOptionsIsSuccess,
  ]);

  // customer autocomp options
  const {
    data: buyerComboOptions,
    isLoading: buyerComboOptionsLoading,
    error: buyerComboOptionsError,
    isError: buyerComboOptionsIsError,
    isFetching: buyerComboOptionIsFetching,
    refetch: buyerComboOptionsRefetch,
  } = useGetBuyerByCompanyLocationIdQuery({
    companyId: userInfo?.companyId || 0,
    // locationId: userInfo?.locationId || 0,
  });
  useEffect(() => {
    if (buyerComboOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyer/customer options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyer/customer options for autocomplete, see console--->:'
      );
      console.log(buyerComboOptionsError);
    }
  }, [
    buyerComboOptionsLoading,
    buyerComboOptionsIsError,
    buyerComboOptionsError,
  ]);

  // customerGroup autocomp options
  // const {
  //   data: buyerGroupComboOptions,
  //   isLoading: buyerGroupComboOptionsLoading,
  //   error: buyerGroupComboOptionsError,
  //   isError: buyerGroupComboOptionsIsError,
  //   isFetching: buyerGroupComboOptionIsFetching,
  //   refetch: buyerGroupComboOptionsRefetch,
  // } = useGetBuyerByCompanyLocationIdQuery({
  //   companyId: userInfo?.companyId || 0,
  //   locationId: userInfo?.locationId || 0,
  // });
  // useEffect(() => {
  //   if (buyerGroupComboOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching buyer/customer options for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching buyer/customer options for autocomplete, see console--->:'
  //     );
  //     console.log(buyerGroupComboOptionsError);
  //   }
  // }, [
  //   buyerComboOptionsLoading,
  //   buyerGroupComboOptionsIsError,
  //   buyerGroupComboOptionsError,
  // ]);

  // salesPerson autocomp options
  const {
    data: salesPersonOptions,
    isLoading: salesPersonOptionsLoading,
    error: salesPersonOptionsError,
    isError: salesPersonOptionsIsError,
    isFetching: salesPersonOptionsIsFetching,
    refetch: salesPersonOptionsRefetch,
  } = useGetSalesPersonByCompanyLocationBuyerIdQuery(
    {
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
      buyerId: customerOutput?.buyerId || 0,
    },
    { skip: !customerOutput?.buyerId }
  );

  useEffect(() => {
    if (salesPersonOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching salesPerson options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching SalesPerson options for autocomplete, see console--->:'
      );
      console.log(salesPersonOptionsError);
    }
  }, [
    salesPersonOptionsLoading,
    salesPersonOptionsIsError,
    salesPersonOptionsError,
  ]);

  // duration autocomp onSelectFetchData
  const {
    data: durationHistoryData,
    isLoading: durationHistoryLoading,
    error: durationHistoryError,
    isError: durationHistoryIsError,
    isFetching: durationHistoryIsFetching,
    refetch: durationHistoryRefetch,
  } = useGetPreviousTenderHistoryByDateRangeQuery(
    {
      fromDate: convertedDurationOutput?.fromDate || '',
      toDate: convertedDurationOutput?.toDate || '',
    },
    { skip: !convertedDurationOutput?.fromDate }
  );

  useEffect(() => {
    if (durationHistoryIsError) {
      toast.error(
        'Something wrong from backend while fetching salesPerson options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching SalesPerson options for autocomplete, see console--->:'
      );
      console.log(durationHistoryError);
    }
  }, [durationHistoryLoading, durationHistoryIsError, durationHistoryError]);
  // page on load e
  useEffect(() => {
    const today = dayjs();
    let fromDate;
    let toDate;
    fromDate = today.startOf('day');
    toDate = today.endOf('day');
    const fromDateTemp = fromDate.format('YYYY-MM-DD');
    const fromTimeTemp = fromDate.format('HH:mm');
    const toDateTemp = toDate.format('YYYY-MM-DD');
    const toTimeTemp = toDate.format('HH:mm');
    fromDate = `${fromDateTemp}T${fromTimeTemp}:00.000Z`;
    toDate = `${toDateTemp}T${toTimeTemp}:00.000Z`;
    setConvertedDurationOutput({ fromDate, toDate });
  }, []);

  useEffect(() => {
    if (!tenderInfo?.procurementTenderId) {
      setValue('tenderSubmissionDate', dayjs());
      setValue('tenderEntryDate', dayjs());
      setValue('bgExpiryDate', dayjs());
    }
  }, [tenderInfo?.procurementTenderId]);

  // procurementTender table data
  const {
    data: procurementTenderData,
    isLoading: procurementTenderLoading,
    error: procurementTenderError,
    isSuccess: procurementTenderIsSuccess,
    isError: procurementTenderIsError,
    isFetching: procurementTenderIsFetching,
    refetch: procurementTenderRefetch,
  } = useGetProcurementTenderByTenderIdQuery(
    {
      tenderId: tenderInfo?.procurementTenderId || 0,
    },
    { skip: !tenderInfo?.procurementTenderId }
  );

  useEffect(() => {
    if (procurementTenderIsError) {
      toast.error(
        'Something wrong from backend while fetching procurementTender options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching procurementTender options for autocomplete, see console--->:'
      );
      console.log(procurementTenderError);
    }

    if (
      procurementTenderIsSuccess &&
      !procurementTenderIsError &&
      !procurementTenderIsFetching &&
      !procurementTenderLoading &&
      procurementTenderData
    ) {
      console.log(
        '....ekhane procurementTender component e maal paati boshanor code hobe....'
      );
      console.log(procurementTenderData);

      const copyOfprocurementTenderData: IProcurementTender = JSON.parse(
        JSON.stringify(procurementTenderData)
      );
      const copyOfprocurementTenderData2: IProcurementTender = JSON.parse(
        JSON.stringify(procurementTenderData)
      );

      setProcurementTenderState(copyOfprocurementTenderData);
      setProcurementTenderPrevState(copyOfprocurementTenderData2);

      assignDataInFieldsProcurementTender(copyOfprocurementTenderData);

      // const specificDateTime = dayjs('2024-05-02T10:30'); // Set to June 2, 2024, 10:30 AM
      // setValue('droppingTime', specificDateTime);
    }
  }, [
    procurementTenderLoading,
    procurementTenderIsError,
    procurementTenderError,
    procurementTenderData,
    procurementTenderIsSuccess,
    procurementTenderIsFetching,
  ]);

  // -----------------[functions]--------------------------
  const handleCustomerChange = (selectedItem: IBuyer, onChange: any) => {
    // alert('called hoise');
    onChange(selectedItem); // for form
    console.log('dekhe ne customer/buyer selected option ta');
    console.log(selectedItem);

    (procurementTenderState ?? {}).buyerId = selectedItem.buyerId;
    (procurementTenderState ?? {}).buyerName = selectedItem.buyerName;
    (procurementTenderState ?? {}).buyerGroupId = selectedItem.buyerGroupId;
    (procurementTenderState ?? {}).buyerGroupName = selectedItem.buyerGroupName;
    setValue('buyerGroupName', selectedItem.buyerGroupName);
    setProcurementTenderState({ ...procurementTenderState });
    setCustomerOutput(selectedItem);
  };

  const handleTenderChange = (
    selectedItem: ITenderNoComboBox | null,
    onChange: any
  ) => {
    onChange(selectedItem);
    setTenderInfo(selectedItem);
    // procurementTenderState= procurementTenderState?
    (procurementTenderState ?? {}).procurementTenderId =
      selectedItem?.procurementTenderId || 0;
    (procurementTenderState ?? {}).tenderNo = selectedItem?.tenderNo || '';
    setProcurementTenderState({ ...procurementTenderState });
  };

  const handleEmployeeChange = (
    selectedItem: ISalesPersonComboBox,
    onChange: any
  ) => {
    onChange(selectedItem);

    (procurementTenderState ?? {}).salesPersonId = selectedItem.employeeId;
    (procurementTenderState ?? {}).salesPersonName = selectedItem.employeeName;
    (procurementTenderState ?? {}).teamId = selectedItem.teamId;
    (procurementTenderState ?? {}).teamName = selectedItem.teamName;
    (procurementTenderState ?? {}).teamLeaderId = selectedItem.teamLeaderId;
    (procurementTenderState ?? {}).teamLeaderName = selectedItem.teamLeaderName;
    setValue('teamName', selectedItem.teamName);
    setValue('teamLeaderName', selectedItem.teamLeaderName);
    setProcurementTenderState({ ...procurementTenderState });
  };

  const handleDroppingDateTimeChange = (newValue: any, onChange: any) => {
    onChange(newValue);
    console.log('OnChange Time ta ektu dekh');
    console.log(newValue);
    if (!newValue) {
      (procurementTenderState ?? {}).tenderSubmissionDate = null;
      setProcurementTenderState({ ...procurementTenderState });
      return;
    }
    const tempDroppingDate = dayjs(newValue).format('YYYY-MM-DD');
    const tempDroppingTime = dayjs(newValue).format('HH:mm');
    const droppingDateTime = `${tempDroppingDate}T${tempDroppingTime}:00.000Z`;
    (procurementTenderState ?? {}).tenderSubmissionDate = droppingDateTime;
    setProcurementTenderState({ ...procurementTenderState });
  };

  const handleTenderEntryDateChange = (newValue: any, onChange: any) => {
    onChange(newValue);

    if (!newValue) {
      (procurementTenderState ?? {}).tenderEntryDate = null;
      setProcurementTenderState({ ...procurementTenderState });
      return;
    }

    console.log('OnChange EntryDate ta ektu dekh');
    console.log(newValue);
    const tempEntryDate = dayjs(newValue).format('YYYY-MM-DD');
    const tempEntryTime = dayjs(newValue).format('HH:mm');
    const entryDateTime = `${tempEntryDate}T${tempEntryTime}:00.000Z`;
    (procurementTenderState ?? {}).tenderEntryDate = entryDateTime;
    setProcurementTenderState({ ...procurementTenderState });
  };
  const handleBgExpiryDateChange = (newValue: any, onChange: any) => {
    onChange(newValue);
    console.log('OnChange BgExpiryDate ta ektu dekh');
    console.log(newValue);
    if (!newValue) {
      (procurementTenderState ?? {}).bgExpiryDate = null;
      setProcurementTenderState({ ...procurementTenderState });
      return;
    }
    const tempBgExpiryDate = dayjs(newValue).format('YYYY-MM-DD');
    const tempBgExpiryTime = dayjs(newValue).format('HH:mm');
    const bgExpiryDateTime = `${tempBgExpiryDate}T${tempBgExpiryTime}:00.000Z`;
    (procurementTenderState ?? {}).bgExpiryDate = bgExpiryDateTime;
    setProcurementTenderState({ ...procurementTenderState });
  };

  const assignDataInFieldsProcurementTender = (
    recievedData: IProcurementTender
  ) => {
    setValue('tenderNo', tenderInfo);
    const buyerInfo: IBuyer = {
      buyerId: recievedData.buyerId as number,
      buyerName: recievedData.buyerName as string,
    };
    setValue('buyer', buyerInfo);
    const salesPersonInfo = {
      employeeId: recievedData.salesPersonId as number,
      employeeName: recievedData.salesPersonName as string,
    };
    setValue('salesPerson', salesPersonInfo);
    setValue('tenderSubmissionDate', recievedData.tenderSubmissionDate);
    setValue('tenderEntryDate', recievedData.tenderEntryDate);
    setValue('bgExpiryDate', recievedData.bgExpiryDate);
    setValue('bgAmount', recievedData.bgAmount);
    setValue('schedulePrice', recievedData.schedulePrice);
    setValue('earnestMoney', { optionName: recievedData.earnestMoney });
    setValue('earnestMoneyAmount', recievedData.earnestMoneyAmount);
    setValue('buyerGroupName', recievedData.buyerGroupName);
    setValue('teamName', recievedData.teamName);
    setValue('teamLeaderName', recievedData.teamLeaderName);
    setValue('remarks', recievedData.remarks);
  };

  function calculateDateRange(duration: string) {
    const today = dayjs();
    let fromDate;
    let toDate;

    switch (duration) {
      case 'Today':
        fromDate = today.startOf('day');
        toDate = today.endOf('day');
        break;

      case 'This Month to Today':
        fromDate = today.startOf('month');
        toDate = today.endOf('day');
        break;

      case 'Last Month to Today':
        fromDate = today.subtract(1, 'month').startOf('month');
        toDate = today.endOf('day');
        break;

      case 'Last Month':
        fromDate = today.subtract(1, 'month').startOf('month');
        toDate = today.subtract(1, 'month').endOf('month');
        break;

      case 'Current Period':
        fromDate = today.startOf('month');
        toDate = today.endOf('day');
        break;

      case 'Last Financial Period':
        fromDate = today.subtract(1, 'month').startOf('month');
        toDate = today.subtract(1, 'month').endOf('month');

        break;

      default:
        throw new Error('Invalid duration');
    }
    const fromDateTemp = fromDate.format('YYYY-MM-DD');
    const fromTimeTemp = fromDate.format('HH:mm');
    const toDateTemp = toDate.format('YYYY-MM-DD');
    const toTimeTemp = toDate.format('HH:mm');
    fromDate = `${fromDateTemp}T${fromTimeTemp}:00.000Z`;
    toDate = `${toDateTemp}T${toTimeTemp}:00.000Z`;

    return {
      fromDate,
      toDate,
    };
  }

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

  return (
    // return wrapper div
    <div className="grid grid-cols-3 gap-1">
      <div className="grid grid-cols-1 gap-1">
        <Controller
          name="tenderNo"
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
              readOnly={!!clickedCardInfo?.biznessEventProcessConfigurationId}
              // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
              options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
              value={value || null}
              onChange={(event, item) => handleTenderChange(item, onChange)} // React-hook-form manages the state
              onBlur={onBlur} // Trigger validation on blur
              getOptionLabel={(option) => (option ? option.tenderNo : '')}
              isOptionEqualToValue={(option, selectedValue) =>
                option.tenderNo === selectedValue?.tenderNo &&
                option.procurementTenderId ===
                  selectedValue?.procurementTenderId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tender No"
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
          rules={{
            required: '*Required',
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <Autocomplete
              id=""
              size="small"
              // loading={!buyerComboOptionsLoading && !buyerComboOptionIsFetching}
              // options={buyerComboOptions || []} // Make sure customerComboOptions is defined
              options={
                Array.from(
                  new Map(
                    buyerComboOptions?.map((buyer) => [buyer.buyerName, buyer])
                  ).values()
                ) || []
              } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
              value={value || null}
              // PopperComponent={PopperMy}
              onChange={(event, selectedOption) =>
                handleCustomerChange(selectedOption, onChange)
              } // React-hook-form manages the state
              onBlur={onBlur} // Trigger validation on blur
              // getOptionLabel={(option) =>
              //   option ? `${option.buyerName}- id:${option.buyerId}` : ''
              // } // main problem is here
              getOptionLabel={(option) => (option ? option.buyerName : '')} // main problem is here
              // getOptionLabel={(option) => (option ? option.buyerName : '')} // main problem is here
              isOptionEqualToValue={(option, selectedValue) =>
                option.buyerId === selectedValue?.buyerId &&
                option.buyerName === selectedValue?.buyerName
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer*"
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
          name="earnestMoney"
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
              // loading={!buyerComboOptionsLoading && !buyerComboOptionIsFetching}
              // options={buyerComboOptions || []} // Make sure customerComboOptions is defined
              options={[
                { optionName: 'BG' },
                { optionName: 'PAY ORDER' },
                // { optionName: 'Performance Security' },
                { optionName: 'OTHER' },
                { optionName: 'N/A' },
              ]} // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
              value={value || ''}
              // PopperComponent={PopperMy}
              onChange={(event, selectedOption) => {
                (procurementTenderState ?? {}).earnestMoney =
                  selectedOption?.optionName || '';
                setProcurementTenderState({ ...procurementTenderState });
                onChange(selectedOption);
              }} // React-hook-form manages the state
              onBlur={onBlur} // Trigger validation on blur
              // getOptionLabel={(option) =>
              //   option ? `${option.buyerName}- id:${option.buyerId}` : ''
              // } // main problem is here
              getOptionLabel={(option) => (option ? option.optionName : '')} // main problem is here
              // getOptionLabel={(option) => (option ? option.buyerName : '')} // main problem is here
              isOptionEqualToValue={(option, selectedValue) =>
                option.optionName === selectedValue?.optionName
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tender Security Type"
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
          name="salesPerson"
          control={control}
          rules={{
            required: '*Required',
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <Autocomplete
              id=""
              size="small"
              // options={salesPersonComboOptions || []} // Make sure salesPersonComboOptions is defined
              // options={salesPersonOptions || []} // Make sure salesPersonComboOptions is defined
              options={
                Array.from(
                  new Map(
                    salesPersonOptions?.map((salesPerson) => [
                      salesPerson.employeeName,
                      salesPerson,
                    ])
                  ).values()
                ) || []
              } // making sure that the array is unique by employeeName, else autocomplete search ultapalta behave kore
              value={value || null}
              onChange={(event, selectedItem) =>
                handleEmployeeChange(selectedItem, onChange)
              } // React-hook-form manages the state
              onBlur={onBlur} // Trigger validation on blur
              getOptionLabel={(option) => (option ? option.employeeName : '')}
              isOptionEqualToValue={(option, selectedValue) =>
                option.employeeId === selectedValue?.employeeId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sales Person*"
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
          name="teamName"
          control={control}
          // rules={{
          //   required: '*Required',
          // }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              type="text"
              value={value || ''}
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' }, readOnly: true }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: value,
              }}
              // onBlur={onBlur} // Trigger validation on blur
              error={!!error}
              helperText={error ? error.message : null}
              // inputRef={ref}
              id=""
              label="Sales Team"
              variant="standard"
              size="small"
              // onBlur={onBlur} // Trigger validation on blur
            />
          )}
        />
        <Controller
          name="teamLeaderName"
          control={control}
          // rules={{
          //   required: '*Required',
          // }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              type="text"
              value={value || ''}
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' }, readOnly: true }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: value,
              }}
              // onBlur={onBlur} // Trigger validation on blur
              error={!!error}
              helperText={error ? error.message : null}
              // inputRef={ref}
              id=""
              label="Team Leader"
              variant="standard"
              size="small"
              // onBlur={onBlur} // Trigger validation on blur
            />
          )}
        />
        <Controller
          name="tenderSubmissionDate"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Dropping Date Time"
                inputFormat="DD/MM/YYYY hh:mm A"
                value={value}
                onChange={(newValue) => {
                  handleDroppingDateTimeChange(newValue, onChange);
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

      <div className=" grid grid-cols-1 gap-1">
        <Controller
          name="tenderEntryDate"
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
                  handleTenderEntryDateChange(newValue, onChange);
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
        {/* <Controller
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
              // loading={!buyerComboOptionsLoading && !buyerComboOptionIsFetching}
              // options={buyerComboOptions || []} // Make sure customerComboOptions is defined
              // options={
              //   Array.from(
              //     new Map(
              //       buyerComboOptions?.map((buyer) => [buyer.buyerName, buyer])
              //     ).values()
              //   ) || []
              // } // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
              options={[]} // making sure that the array is unique by buyerName, else autocomplete search ultapalta behave kore
              value={value || null}
              // PopperComponent={PopperMy}
              onChange={(event, selectedOption) =>
                handleCustomerGroupChange(selectedOption, onChange)
              } // React-hook-form manages the state
              onBlur={onBlur} // Trigger validation on blur
              // getOptionLabel={(option) =>
              //   option ? `${option.buyerName}- id:${option.buyerId}` : ''
              // } // main problem is here
              getOptionLabel={(option) => (option ? option.buyerGroupName : '')} // main problem is here
              // getOptionLabel={(option) => (option ? option.buyerName : '')} // main problem is here
              isOptionEqualToValue={(option, selectedValue) =>
                option.buyerGroupId === selectedValue?.buyerGroupId &&
                option.buyerGroupName === selectedValue?.buyerGroupName
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer Group"
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
        /> */}
        <Controller
          name="buyerGroupName"
          control={control}
          // rules={{
          //   required: '*Required',
          // }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              type="text"
              value={value || ''}
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' }, readOnly: true }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: value,
              }}
              // onBlur={onBlur} // Trigger validation on blur
              error={!!error}
              helperText={error ? error.message : null}
              // inputRef={ref}
              id=""
              label="Customer Group"
              variant="standard"
              size="small"
              // onBlur={onBlur} // Trigger validation on blur
              // onBlur={(event) => {
              //   // Update the state with the current value
              //   (procurementTenderState ?? {}).buyerGroupName =
              //     event.target.value; // math.abs means value has to be non-negetaive
              //   setProcurementTenderState(procurementTenderState);
              //   // Call the original onBlur to trigger validation
              //   onBlur();
              // }}
              // onChange={onChange}
            />
          )}
        />
        <Controller
          name="earnestMoneyAmount"
          control={control}
          // rules={{
          //   required: '*Required',
          // }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              type="number"
              value={value || ''}
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: value,
              }}
              // onBlur={onBlur} // Trigger validation on blur
              error={!!error}
              helperText={error ? error.message : null}
              // inputRef={ref}
              id=""
              label="Earnest Money Amount"
              variant="standard"
              size="small"
              // onBlur={onBlur} // Trigger validation on blur
              onBlur={(event) => {
                // Update the state with the current value
                (procurementTenderState ?? {}).earnestMoneyAmount = Math.abs(
                  parseFloat(event.target.value) || 0
                ); // math.abs means value has to be non-negetaive
                setProcurementTenderState(procurementTenderState);
                // Call the original onBlur to trigger validation
                onBlur();
              }}
              // onChange={onChange}
              onChange={(event) => {
                // Ensure the value is positive before passing to the controller
                const positiveValue = Math.abs(
                  parseFloat(event.target.value) || 0
                );
                onChange(positiveValue);
              }}
            />
          )}
        />
        <Controller
          name="bgAmount"
          control={control}
          // rules={{
          //   required: '*Required',
          // }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              type="number"
              value={value || ''}
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: value,
              }}
              // onBlur={onBlur} // Trigger validation on blur
              error={!!error}
              helperText={error ? error.message : null}
              // inputRef={ref}
              id=""
              label="BG Amount"
              variant="standard"
              size="small"
              // onBlur={onBlur} // Trigger validation on blur
              onBlur={(event) => {
                // Update the state with the current value
                (procurementTenderState ?? {}).bgAmount = Math.abs(
                  parseFloat(event.target.value) || 0
                ); // math.abs means value has to be non-negetaive
                setProcurementTenderState(procurementTenderState);
                // Call the original onBlur to trigger validation
                onBlur();
              }}
              // onChange={onChange}
              onChange={(event) => {
                // Ensure the value is positive before passing to the controller
                const positiveValue = Math.abs(
                  parseFloat(event.target.value) || 0
                );
                onChange(positiveValue);
              }}
            />
          )}
        />
        <Controller
          name="bgExpiryDate"
          control={control}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="BG Expiry Date"
                inputFormat="DD/MM/YYYY"
                value={value}
                onChange={(newValue) => {
                  handleBgExpiryDateChange(newValue, onChange);
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
                shrink: value,
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
                // Update the state with the current value
                (procurementTenderState ?? {}).remarks =
                  event.target.value || '';
                setProcurementTenderState(procurementTenderState);
                // Call the original onBlur to trigger validation
                onBlur();
              }} // Trigger validation on blur
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="schedulePrice"
          control={control}
          rules={{
            required: '*Required',
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              value={value || ''}
              type="number"
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: value,
              }}
              // onBlur={onBlur} // Trigger validation on blur
              error={!!error}
              helperText={error ? error.message : null}
              // inputRef={ref}
              id=""
              label="Purchase Price*"
              variant="standard"
              size="small"
              onBlur={(event) => {
                // Update the state with the current value
                (procurementTenderState ?? {}).bgAmount = Math.abs(
                  parseFloat(event.target.value) || 0
                );
                setProcurementTenderState(procurementTenderState);
                // Call the original onBlur to trigger validation
                onBlur();
              }} // Trigger validation on blur
              // onChange={onChange}
              onChange={(event) => {
                // Ensure the value is positive before passing to the controller
                const positiveValue = Math.abs(
                  parseFloat(event.target.value) || 0
                );
                onChange(positiveValue);
              }}
            />
          )}
        />
      </div>
      <div className=" rounded p-2">
        <div className="">
          <div className="">
            <Controller
              name="duration"
              control={control}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id="duration"
                  size="small"
                  options={[
                    { duration: 'Today' },
                    { duration: 'This Month to Today' },
                    { duration: 'Last Month to Today' },
                    { duration: 'Last Month' },
                    { duration: 'Current Period' },
                    { duration: 'Last Financial Period' },
                  ]} // Make sure customerComboOptions is defined
                  value={durationOutput}
                  onChange={(event, selectedOption) => {
                    if (selectedOption) {
                      const { fromDate, toDate } = calculateDateRange(
                        selectedOption.duration
                      );
                      setDurationOutput(selectedOption);
                      setConvertedDurationOutput({ fromDate, toDate });
                      onChange(selectedOption);
                    }
                  }}
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option) => (option ? option.duration : '')}
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.duration === selectedValue?.duration
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Duration"
                      variant="standard"
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
          <div className="px-2 mt-0">
            <div className="grid grid-cols-12">
              <div className="grid grid-cols-12 gap-0 col-span-7">
                <p className="text-left col-span-5 text-sm">No of Tender</p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6">{durationHistoryData?.noOfTender}</p>

                <p className="text-left col-span-5 text-sm">No of Tender Win</p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6 text-sm">
                  {durationHistoryData?.noOfTenderWin}
                </p>

                <p className="text-left col-span-5 text-sm">Average Value:</p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6 text-sm">
                  {durationHistoryData?.averageValue}
                </p>

                <p className="text-left col-span-5 text-sm">Last Tender No</p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6 text-sm">
                  {durationHistoryData?.lastTenderNo}
                </p>
              </div>
              <div className="grid grid-cols-12 col-span-5">
                <p className="text-left col-span-5 text-sm">Date</p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6 text-sm">
                  {durationHistoryData?.date}
                </p>

                <p className="text-left col-span-5 text-sm">Sales Person</p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6 text-sm">
                  {durationHistoryData?.salesPerson}
                </p>

                <p className="text-left col-span-5 text-sm">
                  Last Tender Amount
                </p>
                <p className="text-left col-span-1 text-sm">:</p>
                <p className="col-span-6 text-sm">
                  {durationHistoryData?.lastTenderAmount}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="col-span-2">
            <Controller
              name="duration"
              control={control}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id="duration"
                  size="small"
                  options={[]} // Make sure customerComboOptions is defined
                  value={value || null}
                  onChange={(event, item) => onChange(item)}
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option) =>
                    option ? option.customerName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.value === selectedValue?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Duration"
                      variant="standard"
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
          </div> */}
        </div>
      </div>
    </div>

    // return wrapper div--/--
  );
};

export default ProcurementTender;
