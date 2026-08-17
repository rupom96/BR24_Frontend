/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import {
  IArea,
  IDistrict,
  IDivision,
  IRegion,
  IRegionMaster,
} from '../../../domain/interfaces/RegionMasterAndTarget';
import MonthYearRangePicker from '../../components/biz24Components/MonthYearRangePicker/MonthYearRangePicker';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/Redux/store/store';
import { changeFromMonthYear } from '../../../application/Redux/slices/RegionMasterAndTargetSlice/FromMonthYearSlice';
import { changeToMonthYear } from '../../../application/Redux/slices/RegionMasterAndTargetSlice/ToMonthYearSlice';
import { useLazyGetRegionMasterByCompanyIdMonthYearQuery } from '../../../infrastructure/api/RegionMasterApiSlice';
import { useLazyGetRegionByRegionMasterCompanyIdMonthYearQuery } from '../../../infrastructure/api/RegionApiSlice';
import { useLazyGetDivisionByRegionCompanyIdMonthYearQuery } from '../../../infrastructure/api/DivisionApiSlice';
import { useLazyGetDistrictByDivisionCompanyIdMonthYearQuery } from '../../../infrastructure/api/DistrictApiSlice';
import { useLazyGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery } from '../../../infrastructure/api/AreaApiSlice';
import {
  useLazyGetProductGroupWiseDailySalesReportQueryQuery,
  useLazyGetProductGroupMpoWiseDailySalesReportQueryQuery,
} from '../../../infrastructure/api/ReportingApiSlice';
import { changeFromDate } from '../../../application/Redux/slices/DateRangePickerSlice/FromDateSlice';
import { changeToDate } from '../../../application/Redux/slices/DateRangePickerSlice/ToDateSlice';
import DateRangePicker from '../../components/biz24Components/DateRangePicker/DateRangePicker';

type Props = {};
type FormValues = {
  regionMaster: IRegionMaster | null;
  region: IRegion | null;
  division: IDivision | null;
  district: IDistrict | null;
  area: IArea | null;
  fromDate: string | null;
  toDate: string | null;
};

const DailySalesReport = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
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
  } = useForm<FormValues>({
    mode: 'onChange', // Validation will trigger on blur
    defaultValues: {
      regionMaster: null,
      region: null,
      division: null,
      district: null,
      area: null,
      fromDate: dayjs().format(),
      toDate: dayjs().format(),
    },
  });
  // Watch for changes in the entire form
  const watchedFields = useWatch({ control });

  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  const fromDateValue = useAppSelector((state) => state.fromDate.fromDate);
  const toDateValue = useAppSelector((state) => state.toDate.toDate);

  const dispatch = useAppDispatch();
  const handleChangeFromMonthYear = (date: Dayjs) => {
    dispatch(changeFromDate({ fromDate: date }));
  };
  const handleChangeToMonthYear = (date: Dayjs) => {
    dispatch(changeToDate({ toDate: date }));
  };

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetRegionMaster,
    {
      data: regionMasterOptionsData,
      error: regionMasterOptionsError,
      isError: regionMasterOptionsIsError,
      isSuccess: regionMasterOptionsIsSuccess,
      isLoading: regionMasterOptionsIsLoading,
      isFetching: regionMasterOptionsIsFetching,
    },
  ] = useLazyGetRegionMasterByCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (regionMasterOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching regionMasterOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching regionMasterOptionsData, see console--->:'
      );
      console.log(regionMasterOptionsError);
    }
    if (regionMasterOptionsIsSuccess) {
      console.log('regionMasterOptionsIsSuccess');
      console.log(regionMasterOptionsData);
    }
  }, [
    regionMasterOptionsData,
    regionMasterOptionsIsLoading,
    regionMasterOptionsError,
    regionMasterOptionsIsError,
    regionMasterOptionsIsFetching,
    regionMasterOptionsIsSuccess,
  ]);

  const [
    triggerGetRegion,
    {
      data: regionOptionsData,
      error: regionOptionsError,
      isError: regionOptionsIsError,
      isSuccess: regionOptionsIsSuccess,
      isLoading: regionOptionsIsLoading,
      isFetching: regionOptionsIsFetching,
    },
  ] = useLazyGetRegionByRegionMasterCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (regionOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching regionOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching regionOptionsData, see console--->:'
      );
      console.log(regionOptionsError);
    }
    if (regionOptionsIsSuccess) {
      console.log('regionOptionsIsSuccess');
      console.log(regionOptionsData);
    }
  }, [
    regionOptionsData,
    regionOptionsIsLoading,
    regionOptionsError,
    regionOptionsIsError,
    regionOptionsIsFetching,
    regionOptionsIsSuccess,
  ]);

  const [
    triggerGetDivision,
    {
      data: divisionOptionsData,
      error: divisionOptionsError,
      isError: divisionOptionsIsError,
      isSuccess: divisionOptionsIsSuccess,
      isLoading: divisionOptionsIsLoading,
      isFetching: divisionOptionsIsFetching,
    },
  ] = useLazyGetDivisionByRegionCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (divisionOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching divisionOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching divisionOptionsData, see console--->:'
      );
      console.log(divisionOptionsError);
    }
    if (divisionOptionsIsSuccess) {
      console.log('divisionOptionsIsSuccess');
      console.log(divisionOptionsData);
    }
  }, [
    divisionOptionsData,
    divisionOptionsIsLoading,
    divisionOptionsError,
    divisionOptionsIsError,
    divisionOptionsIsFetching,
    divisionOptionsIsSuccess,
  ]);

  const [
    triggerGetDistrict,
    {
      data: districtOptionsData,
      error: districtOptionsError,
      isError: districtOptionsIsError,
      isSuccess: districtOptionsIsSuccess,
      isLoading: districtOptionsIsLoading,
      isFetching: districtOptionsIsFetching,
    },
  ] = useLazyGetDistrictByDivisionCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (districtOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching districtOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching districtOptionsData, see console--->:'
      );
      console.log(districtOptionsError);
    }
    if (districtOptionsIsSuccess) {
      console.log('districtOptionsIsSuccess');
      console.log(districtOptionsData);
    }
  }, [
    districtOptionsData,
    districtOptionsIsLoading,
    districtOptionsError,
    districtOptionsIsError,
    districtOptionsIsFetching,
    districtOptionsIsSuccess,
  ]);

  const [
    triggerGetArea,
    {
      data: areaOptionsData,
      error: areaOptionsError,
      isError: areaOptionsIsError,
      isSuccess: areaOptionsIsSuccess,
      isLoading: areaOptionsIsLoading,
      isFetching: areaOptionsIsFetching,
    },
  ] = useLazyGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (areaOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching areaOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching areaOptionsData, see console--->:'
      );
      console.log(areaOptionsError);
    }
    if (areaOptionsIsSuccess) {
      console.log('areaOptionsIsSuccess');
      console.log(areaOptionsData);
    }
  }, [
    areaOptionsData,
    areaOptionsIsLoading,
    areaOptionsError,
    areaOptionsIsError,
    areaOptionsIsFetching,
    areaOptionsIsSuccess,
  ]);

  const [
    triggerDailySalesReport,
    {
      data: dailySalesRptData,
      error: dailySalesRptError,
      isError: dailySalesRptIsError,
      isSuccess: dailySalesRptIsSuccess,
      isLoading: dailySalesRptIsLoading,
      isFetching: dailySalesRptIsFetching,
    },
  ] = useLazyGetProductGroupWiseDailySalesReportQueryQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (dailySalesRptIsError) {
      toast.error(
        'Something wrong from backend while fetching dailySalesRptData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching dailySalesRptData, see console--->:'
      );
      console.log(dailySalesRptError);
    }
    if (
      dailySalesRptIsSuccess &&
      !dailySalesRptIsError &&
      !dailySalesRptIsFetching &&
      !dailySalesRptIsLoading
    ) {
      console.log('dailySalesRptIsSuccess');
      console.log(dailySalesRptData);

      if (dailySalesRptData?.data && dailySalesRptData?.data.length > 0) {
        reportConvertToExcelAndDownload(
          dailySalesRptData?.data,
          'Daily Sales Report'
        );
      } else {
        toast.info(`${dailySalesRptData?.message}`);
      }
    }
  }, [
    dailySalesRptData,
    dailySalesRptIsLoading,
    dailySalesRptError,
    dailySalesRptIsError,
    dailySalesRptIsFetching,
    dailySalesRptIsSuccess,
  ]);

  const [
    triggerMpoWiseDailySalesReport,
    {
      data: mpoWiseDailySalesRptData,
      error: mpoWiseDailySalesRptError,
      isError: mpoWiseDailySalesRptIsError,
      isSuccess: mpoWiseDailySalesRptIsSuccess,
      isLoading: mpoWiseDailySalesRptIsLoading,
      isFetching: mpoWiseDailySalesIsFetching,
    },
  ] = useLazyGetProductGroupMpoWiseDailySalesReportQueryQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (mpoWiseDailySalesRptIsError) {
      toast.error(
        'Something wrong from backend while fetching mpoWiseDailySalesRptData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching mpoWiseDailySalesRptData, see console--->:'
      );
      console.log(mpoWiseDailySalesRptError);
    }
    if (
      mpoWiseDailySalesRptIsSuccess &&
      !mpoWiseDailySalesRptIsError &&
      !mpoWiseDailySalesIsFetching &&
      !mpoWiseDailySalesRptIsLoading
    ) {
      console.log('mpoWiseDailySalesRptIsSuccess');
      console.log(mpoWiseDailySalesRptData);

      if (
        mpoWiseDailySalesRptData?.data &&
        mpoWiseDailySalesRptData?.data.length > 0
      ) {
        reportConvertToExcelAndDownload(
          mpoWiseDailySalesRptData?.data,
          'MPO Wise Daily Sales Report'
        );
      } else {
        toast.info(`${mpoWiseDailySalesRptData?.message}`);
      }
    }
  }, [
    mpoWiseDailySalesRptData,
    mpoWiseDailySalesRptIsLoading,
    mpoWiseDailySalesRptError,
    mpoWiseDailySalesRptIsError,
    mpoWiseDailySalesIsFetching,
    mpoWiseDailySalesRptIsSuccess,
  ]);

  // -----------------------------------API HOOK INIT-------------------ENDS----------------------

  // -----------------------------------API CALL (LAZY)-----------------------------------------

  // triggerGetRegionMaster RTK Query whenever a form field changes
  useEffect(() => {
    const { regionMaster, region, division, district, area } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetRegionMaster({
      companyId: userInfo?.companyId,
      regionId: region?.regionId || 0,
      divisionId: division?.divisionId || 0,
      districtId: district?.districtId || 0,
      areaId: area?.areaId || 0,
      fromMonth: dayjs(fromDateValue).month() + 1,
      fromYear: dayjs(fromDateValue).year(),
      toMonth: dayjs(toDateValue).month() + 1,
      toYear: dayjs(toDateValue).year(),
    });
  }, [
    watchedFields.region,
    watchedFields.division,
    watchedFields.district,
    watchedFields.area,
    userInfo?.companyId,
    triggerGetRegionMaster,
  ]);

  // triggerGetRegion RTK Query whenever a form field changes
  useEffect(() => {
    const { regionMaster, region, division, district, area } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetRegion({
      companyId: userInfo?.companyId,
      regionMasterId: regionMaster?.regionMasterId || 0,
      divisionId: division?.divisionId || 0,
      districtId: district?.districtId || 0,
      areaId: area?.areaId || 0,
      fromMonth: dayjs(fromDateValue).month() + 1,
      fromYear: dayjs(fromDateValue).year(),
      toMonth: dayjs(toDateValue).month() + 1,
      toYear: dayjs(toDateValue).year(),
    });
  }, [
    watchedFields.regionMaster,
    watchedFields.division,
    watchedFields.district,
    watchedFields.area,
    userInfo?.companyId,
    triggerGetRegion,
  ]);

  // triggerGetDivision RTK Query whenever a form field changes
  useEffect(() => {
    const { regionMaster, region, division, district, area } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetDivision({
      companyId: userInfo?.companyId,
      regionMasterId: regionMaster?.regionMasterId || 0,
      regionId: region?.regionId || 0,
      districtId: district?.districtId || 0,
      areaId: area?.areaId || 0,
      fromMonth: dayjs(fromDateValue).month() + 1,
      fromYear: dayjs(fromDateValue).year(),
      toMonth: dayjs(toDateValue).month() + 1,
      toYear: dayjs(toDateValue).year(),
    });
  }, [
    watchedFields.regionMaster,
    watchedFields.region,
    watchedFields.district,
    watchedFields.area,
    userInfo?.companyId,
    triggerGetDivision,
  ]);

  // triggerGetDistrict RTK Query whenever a form field changes
  useEffect(() => {
    const { regionMaster, region, division, district, area } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetDistrict({
      companyId: userInfo?.companyId,
      regionMasterId: regionMaster?.regionMasterId || 0,
      regionId: region?.regionId || 0,
      divisionId: division?.divisionId || 0,
      areaId: area?.areaId || 0,
      fromMonth: dayjs(fromDateValue).month() + 1,
      fromYear: dayjs(fromDateValue).year(),
      toMonth: dayjs(toDateValue).month() + 1,
      toYear: dayjs(toDateValue).year(),
    });
  }, [
    watchedFields.regionMaster,
    watchedFields.region,
    watchedFields.division,
    watchedFields.area,
    userInfo?.companyId,
    triggerGetDistrict,
  ]);

  // triggerGetArea RTK Query whenever a form field changes
  useEffect(() => {
    const { regionMaster, region, division, district, area } = watchedFields;

    console.log('watchedFields');
    console.log(watchedFields);

    // Trigger your RTK Query
    triggerGetArea({
      companyId: userInfo?.companyId,
      regionMasterId: regionMaster?.regionMasterId || 0,
      regionId: region?.regionId || 0,
      divisionId: division?.divisionId || 0,
      districtId: district?.districtId || 0,
      fromMonth: dayjs(fromDateValue).month() + 1,
      fromYear: dayjs(fromDateValue).year(),
      toMonth: dayjs(toDateValue).month() + 1,
      toYear: dayjs(toDateValue).year(),
    });
  }, [
    watchedFields.regionMaster,
    watchedFields.region,
    watchedFields.division,
    watchedFields.district,
    userInfo?.companyId,
    triggerGetArea,
  ]);

  // -----------------------------------API CALL (LAZY)-------------ENDS----------------------------

  // -------------------------------------FUNCTIONS--------------------------------------

  function getLowestLevel(
    regionMasterId?: number | null,
    regionId?: number | null,
    divisionId?: number | null,
    districtId?: number | null,
    areaId?: number | null
  ): string {
    if (areaId) return 'Area';
    if (districtId) return 'District';
    if (divisionId) return 'Division';
    if (regionId) return 'Region';
    if (regionMasterId) return 'RegionMaster';
    return 'None'; // Return "none" if all are null, 0, or undefined
  }

  interface ISendingObj {
    regionMasterId: number;
    regionId: number;
    divisionId: number;
    districtId: number;
    areaId: number;
    fromDate: string;
    toDate: string;
    groupIndicator: string;
    groupIndicatorValue: string;
    reportType?: string;
  }

  const reportConvertToExcelAndDownload = (
    rptDataB64: string,
    rptFileName: string
  ) => {
    if (rptDataB64) {
      const byteCharacters = atob(rptDataB64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create an object URL from the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger a download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${rptFileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optionally, revoke the object URL to free up memory
      URL.revokeObjectURL(blobUrl);
    }
  };

  const dailySalesRptDownloadFunc = () => {
    const { regionMaster, region, division, district, area } = watchedFields;

    const tempGroupIndicator: string = getLowestLevel(
      regionMaster?.regionMasterId,
      region?.regionId,
      division?.divisionId,
      district?.districtId,
      area?.areaId
    );

    let reportHeaderGroupIndicatorValue = '';
    if (tempGroupIndicator === 'None') {
      reportHeaderGroupIndicatorValue = 'All Available Area';
    } else if (tempGroupIndicator === 'RegionMaster') {
      reportHeaderGroupIndicatorValue = `Master Region: ${
        regionMaster?.regionMasterName || ''
      }`;
    } else if (tempGroupIndicator === 'Region') {
      reportHeaderGroupIndicatorValue = `Region: ${region?.regionName || ''}`;
    } else if (tempGroupIndicator === 'Division') {
      reportHeaderGroupIndicatorValue = `Division: ${
        division?.divisionName || ''
      }`;
    } else if (tempGroupIndicator === 'District') {
      reportHeaderGroupIndicatorValue = `District: ${
        district?.districtName || ''
      }`;
    } else if (tempGroupIndicator === 'Area') {
      reportHeaderGroupIndicatorValue = `Area: ${area?.areaName || ''}`;
    }

    const dataToSend: ISendingObj = {
      regionMasterId: regionMaster?.regionMasterId || 0,
      regionId: region?.regionId || 0,
      divisionId: division?.divisionId || 0,
      districtId: district?.districtId || 0,
      areaId: area?.areaId || 0,
      fromDate: dayjs(fromDateValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
      toDate: dayjs(toDateValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
      groupIndicator: 'Area',
      groupIndicatorValue: reportHeaderGroupIndicatorValue,
    };

    triggerDailySalesReport(dataToSend);
  };

  const mpoWiseDailySalesRptDownloadFunc = () => {
    const { regionMaster, region, division, district, area } = watchedFields;

    const tempGroupIndicator: string = getLowestLevel(
      regionMaster?.regionMasterId,
      region?.regionId,
      division?.divisionId,
      district?.districtId,
      area?.areaId
    );
    let reportHeaderGroupIndicatorValue = '';
    if (tempGroupIndicator === 'None') {
      reportHeaderGroupIndicatorValue = 'All Available Area';
    } else if (tempGroupIndicator === 'RegionMaster') {
      reportHeaderGroupIndicatorValue = `Master Region: ${
        regionMaster?.regionMasterName || ''
      }`;
    } else if (tempGroupIndicator === 'Region') {
      reportHeaderGroupIndicatorValue = `Region: ${region?.regionName || ''}`;
    } else if (tempGroupIndicator === 'Division') {
      reportHeaderGroupIndicatorValue = `Division: ${
        division?.divisionName || ''
      }`;
    } else if (tempGroupIndicator === 'District') {
      reportHeaderGroupIndicatorValue = `District: ${
        district?.districtName || ''
      }`;
    } else if (tempGroupIndicator === 'Area') {
      reportHeaderGroupIndicatorValue = `Area: ${area?.areaName || ''}`;
    }
    const dataToSend: ISendingObj = {
      regionMasterId: regionMaster?.regionMasterId || 0,
      regionId: region?.regionId || 0,
      divisionId: division?.divisionId || 0,
      districtId: district?.districtId || 0,
      areaId: area?.areaId || 0,
      fromDate: dayjs(fromDateValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
      toDate: dayjs(toDateValue).format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
      groupIndicator: 'Area',
      groupIndicatorValue: reportHeaderGroupIndicatorValue,
    };

    triggerMpoWiseDailySalesReport(dataToSend);
  };

  // ----------------------------------FUNCTIONS ENDS----------------------------------

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
                  : 'Daily Sales Report'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1  mt-5">
                <div className=" grid grid-cols-2 gap-x-4">
                  <div className="col-span-2">
                    <DateRangePicker
                      startDate={fromDateValue}
                      endDate={toDateValue}
                      setStartDate={handleChangeFromMonthYear}
                      setEndDate={handleChangeToMonthYear}
                    />
                  </div>
                </div>

                <Controller
                  name="regionMaster"
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
                      // options={[
                      //   { regionMasterId: 0, regionMasterName: 'All' },
                      //   ...(Array.from(
                      //     new Map(
                      //       regionMasterOptionsData?.map(
                      //         (regionMasterOption) => [
                      //           regionMasterOption.regionMasterName,
                      //           regionMasterOption,
                      //         ]
                      //       )
                      //     ).values()
                      //   ) || []),
                      // ]}
                      options={[
                        { regionMasterId: 0, regionMasterName: 'All' },
                        ...(Array.from(
                          new Map(
                            regionMasterOptionsData?.map(
                              (regionMasterOption) => [
                                regionMasterOption.regionMasterName,
                                {
                                  regionMasterId:
                                    regionMasterOption.regionMasterId,
                                  regionMasterName:
                                    regionMasterOption.regionMasterName,
                                },
                              ]
                            )
                          ).values()
                        ) || []),
                      ]}
                      value={value}
                      // onChange={(event, item) => {}} // React-hook-form manages the state
                      onChange={(event, selectedItem) => {
                        console.log('selectedItem Master Region');
                        console.log(selectedItem);

                        onChange(selectedItem);
                      }}
                      // onBlur={onBlur} // Trigger validation on blur
                      getOptionLabel={(option) =>
                        option ? option.regionMasterName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.regionMasterName ===
                          selectedValue?.regionMasterName &&
                        option.regionMasterId === selectedValue?.regionMasterId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Region Master"
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
                  name="region"
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
                        { regionId: 0, regionName: 'All' },
                        ...(Array.from(
                          new Map(
                            regionOptionsData?.map((regionOption) => [
                              regionOption.regionName,
                              {
                                regionName: regionOption.regionName,
                                regionId: regionOption.regionId,
                              },
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
                        option ? option.regionName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.regionName === selectedValue?.regionName &&
                        option.regionId === selectedValue?.regionId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Region"
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
                  name="division"
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
                        { divisionId: 0, divisionName: 'All' },
                        ...(Array.from(
                          new Map(
                            divisionOptionsData?.map((divisionOption) => [
                              divisionOption.divisionName,
                              {
                                divisionName: divisionOption.divisionName,
                                divisionId: divisionOption.divisionId,
                              },
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
                        option ? option.divisionName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.divisionName === selectedValue?.divisionName &&
                        option.divisionId === selectedValue?.divisionId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Division"
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
                  name="district"
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
                        { districtId: 0, districtName: 'All' },
                        ...(Array.from(
                          new Map(
                            districtOptionsData?.map((districtOption) => [
                              districtOption.districtName,
                              {
                                districtName: districtOption.districtName,
                                districtId: districtOption.districtId,
                              },
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
                        option ? option.districtName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.districtName === selectedValue?.districtName &&
                        option.districtId === selectedValue?.districtId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="District"
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
                  name="area"
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
                        { areaId: 0, areaName: 'All' },
                        ...(Array.from(
                          new Map(
                            areaOptionsData?.map((areaOption) => [
                              areaOption.areaName,
                              {
                                areaName: areaOption.areaName,
                                areaId: areaOption.areaId,
                              },
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
                        option ? option.areaName : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.areaName === selectedValue?.areaName &&
                        option.areaId === selectedValue?.areaId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Area"
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
                      dailySalesRptIsLoading ||
                      dailySalesRptIsFetching ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        !dailySalesRptIsLoading &&
                        operationMode !== 'preview'
                      ) {
                        dailySalesRptDownloadFunc();
                      } else if (dailySalesRptIsLoading) {
                        toast.warning(
                          'Please wait until the data gets fetched!'
                        );
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      }
                    }}
                  >
                    {dailySalesRptIsLoading || dailySalesRptIsFetching ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {dailySalesRptIsLoading || dailySalesRptIsFetching
                      ? 'Please wait..'
                      : 'Daily Sales Report'}
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      mpoWiseDailySalesRptIsLoading ||
                      mpoWiseDailySalesIsFetching ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        !mpoWiseDailySalesRptIsLoading &&
                        operationMode !== 'preview'
                      ) {
                        mpoWiseDailySalesRptDownloadFunc();
                      } else if (mpoWiseDailySalesRptIsLoading) {
                        toast.warning(
                          'Please wait until the data gets fetched!'
                        );
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      }
                    }}
                  >
                    {mpoWiseDailySalesRptIsLoading ||
                    mpoWiseDailySalesIsFetching ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {mpoWiseDailySalesRptIsLoading ||
                    mpoWiseDailySalesIsFetching
                      ? 'Please wait..'
                      : 'MPO Wise Daily Sales Report'}
                  </button>

                  {/* <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      mpoWiseDailySalesRptIsLoading ||
                      mpoWiseDailySalesIsFetching ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        !mpoWiseDailySalesRptIsLoading &&
                        operationMode !== 'preview'
                      ) {
                        monthlySalesAndTargetProductWiseRptDownloadFuncTAR();
                      } else if (mpoWiseDailySalesRptIsLoading) {
                        toast.warning(
                          'Please wait until the data gets fetched!'
                        );
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      }
                    }}
                  >
                    {mpoWiseDailySalesRptIsLoading ||
                    mpoWiseDailySalesIsFetching ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {mpoWiseDailySalesRptIsLoading ||
                    mpoWiseDailySalesIsFetching
                      ? 'Please wait..'
                      : 'Monthly Target & Achievement (Product Group wise) Report'}
                  </button> */}
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

export default DailySalesReport;
