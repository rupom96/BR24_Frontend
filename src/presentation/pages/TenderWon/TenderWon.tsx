/* eslint-disable no-nested-ternary */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/ban-types */
// import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { IFormProps } from '../../../domain/interfaces/FormPropsInterface';

import { checkArrayContents } from '../../Utils/Util';
import { useGetDynamicReportFrontendElementsQuery } from '../../../infrastructure/api/DynamicApiSlice';
import { IBuyer } from '../../../domain/interfaces/BuyerInterface';
import {
  ITenderNoComboBox2,
  IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand,
} from '../../../domain/interfaces/ProcurementTenderInterface';
import { useUpdateProcurementTenderOnlyTenderWonAndRemarksMutation } from '../../../infrastructure/api/TenderApiSlice';
import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';

const API_BASE_URL = window.API_BASE_URL;

type Props = {};

const TenderWon = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  console.log(
    'See clickedCardInfo Dynamic Report Analysis---------------------------->'
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

  const [buyerOptionsAutoCompLoading, setBuyerOptionsAutoCompLoading] =
    useState<boolean>(false);
  const [buyerOptions, setBuyerOptions] = useState<IBuyer[]>([]);
  const [tenderOptionsAutoCompLoading, setTenderOptionsAutoCompLoading] =
    useState<boolean>(false);
  const [tenderOptions, setTenderOptions] = useState<ITenderNoComboBox2[]>([]);

  const [selectedTender, setSelectedTender] =
    useState<ITenderNoComboBox2 | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<IBuyer | null>(null);

  useEffect(() => {
    fetchBuyerOptions();
    fetchTenderOptions();
    if (!clickedCardInfo?.biznessEventProcessConfigurationId) {
      // maane jodi chain theke call hoy, tahole tenderNo ashbe aar tender ta kon date er tato janina, so kono date boshabona date filter ae, nahole boshabo
      setValue('dateFrom', dayjs());
      setValue('dateTo', dayjs());
    }
  }, []);

  const fetchBuyerOptions = async () => {
    const dateFrom = getValues('dateFrom')
      ? getValues('dateFrom').format('YYYY-MM-DD 00:00:00.000')
      : '';
    const dateTo = getValues('dateTo')
      ? getValues('dateTo').format('YYYY-MM-DD 23:59:00.000')
      : '';
    const tenderNo = selectedTender?.tenderNo ? selectedTender.tenderNo : '';
    try {
      // /api/CustomQuery/getDynamicReportFrontendOptions
      const response = await axios.get(
        `${API_BASE_URL}/ProcurementTender/getBuyersOfTenderByDateFromDateToTenderNo?dateFrom=${dateFrom}&dateTo=${dateTo}&tenderNo=${tenderNo}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );
      setSelectedBuyer(null);
      return response.data;
    } catch (error) {
      toast.error(`Error fetching Buyer/Customer Options from backend `);
      console.log(`Error fetching Buyer Options from backend`);
      console.log(error);

      return [];
    }
  };

  const fetchTenderOptions = async () => {
    const dateFrom = getValues('dateFrom')
      ? getValues('dateFrom').format('YYYY-MM-DD 00:00:00.000')
      : '';
    const dateTo = getValues('dateTo')
      ? getValues('dateTo').format('YYYY-MM-DD 23:59:00.000')
      : '';
    const buyerId = selectedBuyer?.buyerId ? selectedBuyer.buyerId : 0;
    try {
      // /api/CustomQuery/getDynamicReportFrontendOptions
      const response = await axios.get(
        `${API_BASE_URL}/ProcurementTender/getTenderInfoByTenderNoBuyerIdDateFromDateTo?dateFrom=${dateFrom}&dateTo=${dateTo}&buyerId=${buyerId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );

      console.log('tender Options fetched: ------->');
      console.log(response);

      // jodi menu theke call na hoye chain theke hoy
      console.log('Hello its rupom');
      console.log(clickedCardInfo);

      if (clickedCardInfo?.biznessEventProcessConfigurationId) {
        const flowedTender = response.data.find(
          (tender: any) => tender.tenderNo === clickedCardInfo?.eventNo
        );
        console.log(flowedTender);
        setValue('tender', flowedTender);
        setSelectedTender(flowedTender);
        setValue('remarks', flowedTender.remarks);
      } else {
        setSelectedTender(null);
      }

      return response.data;
    } catch (error) {
      toast.error(`Error fetching Tender Options from backend `);
      console.log(`Error fetching Tender Options from backend`);
      console.log(error);

      return [];
    }
  };

  const fetchTenderOptionsAfterSave = async () => {
    const tempPrevSelectedTender = JSON.parse(JSON.stringify(selectedTender));
    try {
      // /api/CustomQuery/getDynamicReportFrontendOptions
      const response = await axios.get(
        `${API_BASE_URL}/ProcurementTender/getTenderInfoByTenderNoBuyerIdDateFromDateTo?dateFrom=&dateTo=&buyerId=`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );

      console.log('tender Options fetched: ------->');
      console.log(response);
      const selectedTenderTemp = response.data.find(
        (tender: any) => tender.tenderNo === tempPrevSelectedTender?.tenderNo
      );
      if (selectedTenderTemp) {
        console.log(selectedTenderTemp);
        setValue('tender', selectedTenderTemp);
        setSelectedTender(selectedTenderTemp);
        setValue('remarks', selectedTenderTemp?.remarks);
      }
    } catch (error) {
      toast.error(`Error fetching Tender Options from backend `);
      console.log(`Error fetching Tender Options from backend`);
      console.log(error);

      return [];
    }
  };

  const handleBuyerFocus = async () => {
    setBuyerOptions([]);
    setBuyerOptionsAutoCompLoading(true);
    const buyerOptionsFetched: IBuyer[] = await fetchBuyerOptions();
    setBuyerOptions([...buyerOptionsFetched]);
    setBuyerOptionsAutoCompLoading(false);
  };
  const handleTenderFocus = async () => {
    setTenderOptions([]);
    setTenderOptionsAutoCompLoading(true);
    const tenderOptionsFetched: ITenderNoComboBox2[] =
      await fetchTenderOptions();
    setTenderOptions([...tenderOptionsFetched]);
    setTenderOptionsAutoCompLoading(false);
  };

  const [
    processUpdateTender,
    {
      isLoading: updateProcurementTenderIsLoading,
      isError: updateProcurementTenderIsError,
      error: updateProcurementTenderError,
      isSuccess: updateProcurementTenderIsSuccess,
      data: updateProcurementTenderData,
    },
  ] = useUpdateProcurementTenderOnlyTenderWonAndRemarksMutation();

  const tenderWonBtn = () => {
    let pcTrackToSave: ICreateBiznessEventPCTrackCommand | null = null;

    if (clickedCardInfo?.biznessEventProcessConfigurationId) {
      pcTrackToSave = {
        eventNo: clickedCardInfo.eventNo,
        performedBy: userInfo.securityUserId,
        startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        note: operationMode === 'edit' ? 'Edited' : 'Added',
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

    const sendingObj: IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand = {
      procurementTenderId: selectedTender?.procurementTenderId
        ? selectedTender.procurementTenderId
        : 0,
      tenderWon: true,
      remarks: getValues('remarks'),
      createBiznessEventPCTrackCommand: pcTrackToSave
        ? { ...pcTrackToSave }
        : null,
    };
    console.log('sendingObj--->');
    console.log(sendingObj);
    processUpdateTender(sendingObj);
  };

  const tenderLostBtn = () => {
    let pcTrackToSave: ICreateBiznessEventPCTrackCommand | null = null;

    if (clickedCardInfo?.biznessEventProcessConfigurationId) {
      pcTrackToSave = {
        eventNo: clickedCardInfo.eventNo,
        performedBy: userInfo.securityUserId,
        startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        note: operationMode === 'edit' ? 'Edited' : 'Added',
        progressPReported: 100,
        originalSequence: clickedCardInfo.sequence,
        nextSequence: 0,
        complete: false,
        biznessEventProcessConfigurationId:
          clickedCardInfo.biznessEventProcessConfigurationId,
        firstEventNo: clickedCardInfo.firstEventNo,
        locationId: clickedCardInfo.eventLocationId || userInfo.locationId || 0,
      };
    }

    const sendingObj: IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand = {
      procurementTenderId: selectedTender?.procurementTenderId
        ? selectedTender.procurementTenderId
        : 0,
      tenderWon: false,
      remarks: getValues('remarks'),
      createBiznessEventPCTrackCommand: pcTrackToSave,
    };
    console.log('sendingObj--->');
    console.log(sendingObj);

    processUpdateTender(sendingObj);
  };

  //   isLoading: updateProcurementTenderIsLoading,
  //       isError: updateProcurementTenderIsError,
  //       error: updateProcurementTenderError,
  //       isSuccess: updateProcurementTenderIsSuccess,
  //       data: updateProcurementTenderData,

  useEffect(() => {
    if (
      updateProcurementTenderIsSuccess &&
      !updateProcurementTenderIsLoading &&
      !updateProcurementTenderIsError
    ) {
      fetchTenderOptionsAfterSave();
      Swal.fire({
        title: `The tender has been updated successfully!`,
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

        // eikhane last tender ta abar select koraya ditesi, to refresh data
        // const prevTender = { ...selectedTender };
        // fetchTenderOptions();
        // const selectedTenderRefresh = tenderOptions.find(
        //   (tender) => tender.tenderNo === prevTender.tenderNo
        // ); // ekhane tenderOption fetch houar agei jodi tender no select kore feli, tahole won/lost er accurate data pabona... sync hoile hoito
        // if (selectedTenderRefresh) {
        //   setSelectedTender(selectedTenderRefresh);
        // }

        if (result.isConfirmed) {
          if (modalPageOpenerClose) {
            modalPageOpenerClose();
          }
        }
      });
    } else if (updateProcurementTenderIsError) {
      toast.error('Something got error while updating procurment tender');
    }
  }, [
    updateProcurementTenderIsLoading,
    updateProcurementTenderIsError,
    updateProcurementTenderError,
    updateProcurementTenderIsSuccess,
    updateProcurementTenderData,
  ]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Won':
        return { color: 'green', fontWeight: 'bold', fontSize: '13px' };
      case 'Lost':
        return { color: 'red', fontWeight: 'bold', fontSize: '13px' };
      case 'Pending':
        return { color: 'orange', fontWeight: 'bold', fontSize: '13px' };
      case 'Not Applicable':
        return { color: 'gray', fontWeight: 'bold', fontSize: '13px' };
      default:
        return {};
    }
  };
  const getChipStatus = () => {
    let chipStatus = 'Not Applicable';
    if (
      selectedTender?.procurementTenderId &&
      selectedTender.tenderWon === null
    ) {
      chipStatus = 'Pending';
    } else if (
      selectedTender?.procurementTenderId &&
      selectedTender.tenderWon === true
    ) {
      chipStatus = 'Won';
    } else if (
      selectedTender?.procurementTenderId &&
      selectedTender.tenderWon === false
    ) {
      chipStatus = 'Lost';
    } else if (!selectedTender?.procurementTenderId) {
      chipStatus = 'Not Applicable';
    }
    return chipStatus;
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
                <div className=" grid grid-cols-2 gap-x-4">
                  <Controller
                    name="dateFrom"
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date From"
                          inputFormat="DD/MM/YYYY"
                          value={
                            clickedCardInfo?.biznessEventProcessConfigurationId
                              ? null
                              : value
                          }
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
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date To"
                          inputFormat="DD/MM/YYYY"
                          value={
                            clickedCardInfo?.biznessEventProcessConfigurationId
                              ? null
                              : value
                          }
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
                      options={buyerOptions || []} // Make sure tenderComboOptions is defined
                      value={value || null}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        setSelectedBuyer(selectedItem);
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
                          onFocus={() => {
                            return handleBuyerFocus();
                          }}
                          label="Customer"
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
                            endAdornment: (
                              <>
                                {buyerOptionsAutoCompLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                          sx={{ width: '100%', marginTop: 1 }}
                          inputRef={ref}
                        />
                      )}
                    />
                  )}
                />
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-10">
                    <Controller
                      name="tender"
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
                          options={tenderOptions || []} // Make sure tenderComboOptions is defined
                          value={value || null}
                          // onChange={(event, item) => {}} // React-hook-form manages the state
                          onChange={(event, selectedItem) => {
                            setSelectedTender(selectedItem);
                            setValue('remarks', selectedItem.remarks);
                            onChange(selectedItem);
                          }}
                          onBlur={onBlur} // Trigger validation on blur
                          getOptionLabel={(option) =>
                            option ? option.tenderNo : ''
                          }
                          isOptionEqualToValue={(option, selectedValue) =>
                            option.tenderNo === selectedValue?.tenderNo &&
                            option.procurementTenderId ===
                              selectedValue?.procurementTenderId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onFocus={() => {
                                return handleTenderFocus();
                              }}
                              label="Tender No"
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
                                endAdornment: (
                                  <>
                                    {tenderOptionsAutoCompLoading ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                              sx={{ width: '100%', marginTop: 1 }}
                              inputRef={ref}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2 pt-4">
                    <Chip
                      label={
                        <>
                          Winning Status:{' '}
                          <Typography
                            component="span"
                            style={getStatusStyles(getChipStatus())}
                          >
                            {getChipStatus()}
                          </Typography>
                        </>
                      }
                      size="small"
                    />
                  </div>
                </div>

                <Controller
                  name="remarks"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      type=""
                      value={value || ''}
                      sx={{ width: '100%' }}
                      InputProps={{ style: { fontSize: 13 } }}
                      InputLabelProps={{
                        style: { fontSize: 14 },
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
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value

                        // Call the original onBlur to trigger validation
                        onBlur();
                      }}
                      onChange={onChange}
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
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out  ${
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
                        tenderLostBtn();
                      } else if (
                        !selectedTender?.tenderWon &&
                        selectedTender?.tenderNo
                      ) {
                        toast.warning('This Tender is already Lost');
                      } else if (updateProcurementTenderIsLoading) {
                        toast.warning('Please wait until the data is saved!');
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      }
                    }}
                  >
                    Lost
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

export default TenderWon;
