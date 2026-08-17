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
  useLazyGetMonthlyIncentiveReportQueryQuery,
  useLazyGetMonthlySalesAndTargetProductWiseReportQueryQuery,
} from '../../../infrastructure/api/ReportingApiSlice';

type Props = {};
type FormValues = {
  regionMaster: IRegionMaster | null;
  region: IRegion | null;
  division: IDivision | null;
  district: IDistrict | null;
  area: IArea | null;
  fromMonth: string | null;
  toMonth: string | null;
  fromYear: string | null;
  toYear: string | null;
};

const IncentiveReport = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  // if (!userInfo?.securityUserId) {
  //     if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
  //     localStorage.removeItem('userInfo');
  //     localStorage.removeItem('brFeature');
  //     }
  //     navigate('/loginUsername');
  // }

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
      fromMonth: dayjs().format(),
      toMonth: dayjs().format(),
      fromYear: dayjs().format(),
      toYear: dayjs().format(),
    },
  });
  // Watch for changes in the entire form
  const watchedFields = useWatch({ control });

  const biznessEventName = clickedCardInfo?.biznessEventName.replace(
    /([A-Z])(?=[A-Z][a-z])/g,
    '$1 '
  );

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );

  const dispatch = useAppDispatch();
  const handleChangeFromMonthYear = (date: Dayjs) => {
    dispatch(changeFromMonthYear({ fromMonthYear: date }));
  };
  const handleChangeToMonthYear = (date: Dayjs) => {
    dispatch(changeToMonthYear({ toMonthYear: date }));
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
    triggerMonthlyIncentiveReport,
    {
      data: monthlyIncentiveRptData,
      error: monthlyIncentiveRptError,
      isError: monthlyIncentiveRptIsError,
      isSuccess: monthlyIncentiveRptIsSuccess,
      isLoading: monthlyIncentiveRptIsLoading,
      isFetching: monthlyIncentiveRptIsFetching,
    },
  ] = useLazyGetMonthlyIncentiveReportQueryQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (monthlyIncentiveRptIsError) {
      toast.error(
        'Something wrong from backend while fetching monthlyIncentiveRptData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching monthlyIncentiveRptData, see console--->:'
      );
      console.log(monthlyIncentiveRptError);
    }
    if (
      monthlyIncentiveRptIsSuccess &&
      !monthlyIncentiveRptIsError &&
      !monthlyIncentiveRptIsFetching &&
      !monthlyIncentiveRptIsLoading
    ) {
      console.log('monthlyIncentiveRptIsSuccess');
      console.log(monthlyIncentiveRptData);

      if (
        monthlyIncentiveRptData?.data &&
        monthlyIncentiveRptData?.data.length > 0
      ) {
        reportConvertToExcelAndDownload(
          monthlyIncentiveRptData?.data,
          'Monthly Incentive Report'
        );
      } else {
        toast.info(`${monthlyIncentiveRptData?.message}`);
      }
    }
  }, [
    monthlyIncentiveRptData,
    monthlyIncentiveRptIsLoading,
    monthlyIncentiveRptError,
    monthlyIncentiveRptIsError,
    monthlyIncentiveRptIsFetching,
    monthlyIncentiveRptIsSuccess,
  ]);

  const [
    triggerMonthlySalesAndTargetProductWiseReport,
    {
      data: monthlySalesAndTargetProductWiseRptData,
      error: monthlySalesAndTargetProductWiseRptError,
      isError: monthlySalesAndTargetProductWiseRptIsError,
      isSuccess: monthlySalesAndTargetProductWiseRptIsSuccess,
      isLoading: monthlySalesAndTargetProductWiseRptIsLoading,
      isFetching: monthlySalesAndTargetProductWiseRptIsFetching,
    },
  ] = useLazyGetMonthlySalesAndTargetProductWiseReportQueryQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (monthlyIncentiveRptIsError) {
      toast.error(
        'Something wrong from backend while fetching monthlySalesAndTargetProductWiseRptData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching monthlySalesAndTargetProductWiseRptData, see console--->:'
      );
      console.log(monthlySalesAndTargetProductWiseRptError);
    }
    if (
      monthlySalesAndTargetProductWiseRptIsSuccess &&
      !monthlySalesAndTargetProductWiseRptIsError &&
      !monthlySalesAndTargetProductWiseRptIsFetching &&
      !monthlySalesAndTargetProductWiseRptIsLoading
    ) {
      console.log('monthlySalesAndTargetProductWiseRptIsSuccess');
      console.log(monthlySalesAndTargetProductWiseRptData);

      if (
        monthlySalesAndTargetProductWiseRptData?.data &&
        monthlySalesAndTargetProductWiseRptData?.data.length > 0
      ) {
        reportConvertToExcelAndDownload(
          monthlySalesAndTargetProductWiseRptData?.data,
          'Monthly Sales And Target Product Wise Report'
        );
      } else {
        toast.info(`${monthlySalesAndTargetProductWiseRptData?.message}`);
      }
    }
  }, [
    monthlySalesAndTargetProductWiseRptData,
    monthlySalesAndTargetProductWiseRptIsLoading,
    monthlySalesAndTargetProductWiseRptError,
    monthlySalesAndTargetProductWiseRptIsError,
    monthlySalesAndTargetProductWiseRptIsFetching,
    monthlySalesAndTargetProductWiseRptIsSuccess,
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
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
    fromMonth: number;
    fromYear: number;
    toMonth: number;
    toYear: number;
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

  const monthlyIncentiveRptDownloadFunc = () => {
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
      reportHeaderGroupIndicatorValue = 'All Master Region';
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
      groupIndicator: tempGroupIndicator,
      groupIndicatorValue: reportHeaderGroupIndicatorValue,
    };

    triggerMonthlyIncentiveReport(dataToSend);
  };

  const monthlySalesAndTargetProductWiseRptDownloadFuncSTR = () => {
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
      reportHeaderGroupIndicatorValue = 'All Master Region';
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
      groupIndicator: tempGroupIndicator,
      groupIndicatorValue: reportHeaderGroupIndicatorValue,
      reportType: 'SalesAndTargetReport',
    };

    triggerMonthlySalesAndTargetProductWiseReport(dataToSend);
  };

  const monthlySalesAndTargetProductWiseRptDownloadFuncTAR = () => {
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
      reportHeaderGroupIndicatorValue = 'All Master Region';
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
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
      groupIndicator: tempGroupIndicator,
      groupIndicatorValue: reportHeaderGroupIndicatorValue,
      reportType: 'TargetAndAchievementReport',
    };

    triggerMonthlySalesAndTargetProductWiseReport(dataToSend);
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
                  : 'Incentive Report'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1  mt-5">
                <div className=" grid grid-cols-2 gap-x-4">
                  <div className="col-span-2">
                    <MonthYearRangePicker
                      startDate={fromMonthYearValue}
                      endDate={toMonthYearValue}
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
                      monthlyIncentiveRptIsLoading ||
                      monthlyIncentiveRptIsFetching ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        !monthlyIncentiveRptIsLoading &&
                        operationMode !== 'preview'
                      ) {
                        monthlyIncentiveRptDownloadFunc();
                      } else if (monthlyIncentiveRptIsLoading) {
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
                    {monthlyIncentiveRptIsLoading ||
                    monthlyIncentiveRptIsFetching ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {monthlyIncentiveRptIsLoading ||
                    monthlyIncentiveRptIsFetching
                      ? 'Please wait..'
                      : 'Monthly Incentive Report'}
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      monthlySalesAndTargetProductWiseRptIsLoading ||
                      monthlySalesAndTargetProductWiseRptIsFetching ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        !monthlySalesAndTargetProductWiseRptIsLoading &&
                        operationMode !== 'preview'
                      ) {
                        monthlySalesAndTargetProductWiseRptDownloadFuncSTR();
                      } else if (monthlySalesAndTargetProductWiseRptIsLoading) {
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
                    {monthlySalesAndTargetProductWiseRptIsLoading ||
                    monthlySalesAndTargetProductWiseRptIsFetching ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {monthlySalesAndTargetProductWiseRptIsLoading ||
                    monthlySalesAndTargetProductWiseRptIsFetching
                      ? 'Please wait..'
                      : 'Monthly Sales & Target (Product Group wise) Report'}
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      monthlySalesAndTargetProductWiseRptIsLoading ||
                      monthlySalesAndTargetProductWiseRptIsFetching ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        !monthlySalesAndTargetProductWiseRptIsLoading &&
                        operationMode !== 'preview'
                      ) {
                        monthlySalesAndTargetProductWiseRptDownloadFuncTAR();
                      } else if (monthlySalesAndTargetProductWiseRptIsLoading) {
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
                    {monthlySalesAndTargetProductWiseRptIsLoading ||
                    monthlySalesAndTargetProductWiseRptIsFetching ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {monthlySalesAndTargetProductWiseRptIsLoading ||
                    monthlySalesAndTargetProductWiseRptIsFetching
                      ? 'Please wait..'
                      : 'Monthly Target & Achievement (Product Group wise) Report'}
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

export default IncentiveReport;
