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

import { Autocomplete, CircularProgress, TextField } from '@mui/material';
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

const API_BASE_URL = window.API_BASE_URL;

type Props = {};

// Main interface representing the overall structure
interface IElementOptionState {
  [key: number]: {
    loading: boolean;
    options: IDynamicReportFrontendElementOption[];
  };
}

const DynamicReportAnalysis = ({
  modalPageOpenerClose,
  clickedCardInfo,
}: any) => {
  console.log(
    'See clickedCardInfo Dynamic Report Analysis---------------------------->'
  );
  console.log(clickedCardInfo);

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

  const formProps: IFormProps = {
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
  };

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

  const [elementsOptionState, setElementsOptionState] = useState<any>({});
  const [reportDownloadLoading, setReportDownloadLoading] =
    useState<boolean>(false);

  const {
    data: dynamicReportFrontendElementsData,
    isLoading: dynamicReportFrontendElementsLoading,
    error: dynamicReportFrontendElementsError,
    isError: dynamicReportFrontendElementsIsError,
    isFetching: dynamicReportFrontendElementsIsFetching,
    refetch: dynamicReportFrontendElementsRefetch,
  } = useGetDynamicReportFrontendElementsQuery(
    {
      biznessEventProcessConfigurationId:
        clickedCardInfo?.biznessEventProcessConfigurationId,
      companyId: userInfo?.companyId,
      locationId: userInfo?.locationId,
    }
    // { skip: !convertedDurationOutput?.fromDate }
  );

  useEffect(() => {
    if (dynamicReportFrontendElementsIsError) {
      toast.error(
        'Something wrong from backend while fetching dynamicReportFrontendElements , see console!'
      );
      console.log(
        'Something wrong from backend while fetching dynamicReportFrontendElements , see console!--->:'
      );
      console.log(dynamicReportFrontendElementsError);
    } else if (
      !dynamicReportFrontendElementsIsError &&
      !dynamicReportFrontendElementsLoading &&
      !dynamicReportFrontendElementsIsFetching &&
      dynamicReportFrontendElementsData
    ) {
      const tempFrontendInputElements =
        dynamicReportFrontendElementsData.frontendInputElements;
      for (let i = 0; i < tempFrontendInputElements.length; i++) {
        if (
          elementsOptionState &&
          elementsOptionState[tempFrontendInputElements[i].reportGenerationId]
        ) {
          elementsOptionState[
            tempFrontendInputElements[i].reportGenerationId
          ].loading = false; // Update loading state
          elementsOptionState[
            tempFrontendInputElements[i].reportGenerationId
          ].options = []; // Add new option
        } else {
          elementsOptionState[tempFrontendInputElements[i].reportGenerationId] =
            {
              loading: false,
              options: [],
            };
        }

        // setting default values for datePickers
        if (tempFrontendInputElements[i].dataType === 'Datetime Picker') {
          setValue(
            `${tempFrontendInputElements[i].reportGenerationId}`,
            dayjs()
          );
        }
        if (tempFrontendInputElements[i].dataType === 'Date Picker') {
          setValue(
            `${tempFrontendInputElements[i].reportGenerationId}`,
            dayjs()
          );
        }
        if (tempFrontendInputElements[i].dataType === 'MonthYear Picker') {
          setValue(
            `${tempFrontendInputElements[i].reportGenerationId}`,
            dayjs()
              .endOf('month') // gets last day of the month
              .format('YYYY-MM-DD')
          );
        }
      }
      setElementsOptionState({ ...elementsOptionState }); // updating state

      console.log('seeing the elementOptionsState on page load');
      console.log(elementsOptionState);
    }
  }, [
    dynamicReportFrontendElementsLoading,
    dynamicReportFrontendElementsIsError,
    dynamicReportFrontendElementsError,
    dynamicReportFrontendElementsIsFetching,
  ]);

  const fetchOptions = async (reportGenerationId: number) => {
    const dependencyQuery = getDependencyQuery(reportGenerationId);
    console.log('dependencyQuery---->>>');
    console.log(dependencyQuery);
    try {
      // /api/CustomQuery/getDynamicReportFrontendOptions
      const response = await axios.get(
        `${API_BASE_URL}/CustomQuery/getDynamicReportFrontendOptions?reportGenerationId=${reportGenerationId}&companyId=${userInfo?.companyId}&locationId=${userInfo?.locationId}&whereQuery=${dependencyQuery}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );
      if (response?.data?.length) {
        const allOptionObj = { optionId: '', optionName: 'ALL OF THEM' };
        response?.data.unshift(allOptionObj);
      }
      return response.data;
    } catch (error) {
      toast.error(
        `Error fetching Element Options from backend, for this reportGenerationId :${reportGenerationId}`
      );
      console.log(
        `Error fetching Element Options from backend, for this reportGenerationId :${reportGenerationId}`
      );
      console.log(error);

      return [];
    }
  };

  const handleAutoCompFocus = async (reportGenerationId: number) => {
    elementsOptionState[reportGenerationId].options = [];
    elementsOptionState[reportGenerationId].loading = true;
    setElementsOptionState({ ...elementsOptionState });
    const elementOptionsFetched: IDynamicReportFrontendElementOption[] =
      await fetchOptions(reportGenerationId);
    elementsOptionState[reportGenerationId].options = [
      ...elementOptionsFetched,
    ];
    elementsOptionState[reportGenerationId].loading = false;
    setElementsOptionState({ ...elementsOptionState });
  };

  const renderElement = (
    dynamicReportfrontendElementObj: IDynamicReportInputElement
  ) => {
    switch (dynamicReportfrontendElementObj.dataType) {
      case 'textfield':
        return (
          <Controller
            name={dynamicReportfrontendElementObj.reportGenerationId.toString()}
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
                label={dynamicReportfrontendElementObj.caption}
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
        );
      case 'Number':
        return (
          <Controller
            name={dynamicReportfrontendElementObj.reportGenerationId.toString()}
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                type="number"
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
                label={dynamicReportfrontendElementObj.caption}
                variant="standard"
                size="small"
                // onBlur={onBlur} // Trigger validation on blur
                onBlur={(event) => {
                  // Update the state with the current value
                  onBlur();
                  setValue(
                    dynamicReportfrontendElementObj.reportGenerationId.toString(),
                    parseFloat(event.target.value)
                  );
                  // Call the original onBlur to trigger validation
                }}
                onChange={onChange}
              />
            )}
          />
        );
      case 'Autocomplete':
        return (
          <Controller
            name={dynamicReportfrontendElementObj.reportGenerationId.toString()}
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
                  elementsOptionState[
                    dynamicReportfrontendElementObj.reportGenerationId
                  ]?.loading || false
                }
                // options={tenderComboOptions || []} // Make sure tenderComboOptions is defined
                options={
                  elementsOptionState[
                    dynamicReportfrontendElementObj?.reportGenerationId
                  ]?.options || []
                } // Make sure tenderComboOptions is defined
                value={value || null}
                // onChange={(event, item) => {}} // React-hook-form manages the state
                onChange={(event, selectedItem) => {
                  onChange(selectedItem);
                }}
                onBlur={onBlur} // Trigger validation on blur
                getOptionLabel={(option) => (option ? option.optionName : '')}
                isOptionEqualToValue={(option, selectedValue) =>
                  option.optionName === selectedValue?.optionName &&
                  option.optionId === selectedValue?.optionId
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onFocus={() => {
                      return handleAutoCompFocus(
                        dynamicReportfrontendElementObj.reportGenerationId
                      );
                    }}
                    label={dynamicReportfrontendElementObj.caption}
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
                          {elementsOptionState[
                            dynamicReportfrontendElementObj.reportGenerationId
                          ]?.loading ? (
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
        );
      case 'Datetime Picker':
        return (
          <Controller
            name={dynamicReportfrontendElementObj.reportGenerationId.toString()}
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label={dynamicReportfrontendElementObj.caption}
                  inputFormat="DD/MM/YYYY hh:mm A"
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
        );
      case 'Date Picker':
        return (
          <Controller
            name={dynamicReportfrontendElementObj.reportGenerationId.toString()}
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={dynamicReportfrontendElementObj.caption}
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
        );
      case 'MonthYear Picker':
        return (
          <Controller
            name={dynamicReportfrontendElementObj.reportGenerationId.toString()}
            control={control}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={dynamicReportfrontendElementObj.caption}
                  views={['year', 'month']} //  restrict to year and month
                  openTo="month" //  opens month view first
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
        );
      default:
        return null;
    }
  };

  function downloadReport(element: IDynamicReportButtonElement) {
    const buttonId = element.buttonId;
    const reportName = element.buttonName;

    if (reportDownloadLoading) {
      return;
    }
    console.log('Hello download Report getValues');

    console.log(getValues());

    const formData = getValues();

    console.log('...formdata.....');
    console.log(formData);

    let whereClause = '';
    for (const key in formData) {
      const tempReportGenerationId = parseInt(key, 10);
      const tempFrontendElementObj =
        dynamicReportFrontendElementsData?.frontendInputElements.find(
          (item) => item.reportGenerationId === tempReportGenerationId
        );
      console.log('tempFrontendElementObj');
      console.log(tempFrontendElementObj);

      // autocomplete er jonno data formatting
      if (
        tempFrontendElementObj?.dataType === 'Autocomplete' &&
        formData[key]
      ) {
        formData[key] = formData[key].optionId;
      }
      // datePicker er jonno data formatting
      if (
        formData[key] &&
        formData[key].$d instanceof Date &&
        tempFrontendElementObj?.dataType === 'Date Picker'
      ) {
        console.log(
          `I am in if loop where only dhukas when Date Picker, : ${formData[key].$d}`
        );
        const endsWithFrom = tempFrontendElementObj?.caption
          .toLowerCase()
          .endsWith('from');
        const endsWithTo = tempFrontendElementObj?.caption
          .toLowerCase()
          .endsWith('to');
        let formattedDateTemp1 = '';
        if (endsWithFrom) {
          formattedDateTemp1 = dayjs(formData[key].$d).format(
            'YYYY-MM-DD 00:00:00.000'
          );
        } else if (endsWithTo) {
          formattedDateTemp1 = dayjs(formData[key].$d).format(
            'YYYY-MM-DD 23:59:00.000'
          );
        } else {
          formattedDateTemp1 = dayjs(formData[key].$d).format('YYYY-MM-DD');
        }
        formData[key] = formattedDateTemp1;
      }
      // MonthYear Picker er jonno data formatting
      if (
        formData[key] &&
        formData[key].$d instanceof Date &&
        tempFrontendElementObj?.dataType === 'MonthYear Picker'
      ) {
        console.log(
          `I am in if loop where only dhukas when MonthYear Picker, : ${formData[key].$d}`
        );
        let formattedDateTemp1 = '';
        formattedDateTemp1 = dayjs(formData[key].$d)
          .endOf('month')
          .format('YYYY-MM-DD');
        formData[key] = formattedDateTemp1;
      }

      // dateTimePicker er jonno data formatting
      if (
        formData[key] &&
        formData[key].$d instanceof Date &&
        tempFrontendElementObj?.dataType === 'Datetime Picker'
      ) {
        // const formattedDate = dayjs(formData[key].$d).format(
        //   'YYYY-MM-DDTHH:mm:00.000[Z]'
        // );
        const formattedDateTemp2 = dayjs(formData[key].$d).format(
          'YYYY-MM-DD HH:mm:00.000'
        );
        formData[key] = formattedDateTemp2;
      }

      if (tempFrontendElementObj && formData[key]) {
        if (tempFrontendElementObj?.dataType === 'MonthYear Picker') {
          // whereClause = `${
          //   (whereClause ? `${whereClause} AND ` : whereClause) +
          //   tempFrontendElementObj.columnName
          // }'${formData[key]}'`;

          const startDate = dayjs(formData[key])
            .startOf('month')
            .format('YYYY-MM-DD 00:00:00.000');
          const endDate = dayjs(formData[key])
            .endOf('month')
            .format('YYYY-MM-DD 23:59:59.999');

          whereClause = `${whereClause ? `${whereClause} AND ` : ''}${
            tempFrontendElementObj.columnName
          } >= '${startDate}' AND ${
            tempFrontendElementObj.columnName
          } <= '${endDate}'`;
        } else {
          whereClause = `${
            (whereClause ? `${whereClause} AND ` : whereClause) +
            tempFrontendElementObj.columnName
          }'${formData[key]}'`;
        }
      }
    }
    whereClause = whereClause ? `WHERE ${whereClause}` : '';
    console.log('whereClause-------->');
    console.log(whereClause);
    dynamicReportAnalysisDownload(whereClause, buttonId, reportName);
    // const tempEntryDate = dayjs(newValue).format('YYYY-MM-DD');
    // const tempEntryTime = dayjs(newValue).format('HH:mm');
    // const entryDateTime = `${tempEntryDate}T${tempEntryTime}:00.000Z`;
  }

  const getDependencyQuery = (reportGenerationId: number) => {
    const formData = getValues();
    const currentElementObj =
      dynamicReportFrontendElementsData?.frontendInputElements.find(
        (item) => item.reportGenerationId === reportGenerationId
      );
    const currentDependenciesSplitted = currentElementObj?.dependencies
      ? currentElementObj?.dependencies?.split('^')
      : '';
    console.log('---currentElementObj----');
    console.log(currentElementObj);

    console.log('...formdata.....');
    console.log(formData);

    let dependencyQuery = '';
    for (const key in formData) {
      const tempReportGenerationId = parseInt(key, 10);
      const tempFrontendElementObj =
        dynamicReportFrontendElementsData?.frontendInputElements.find(
          (item) => item.reportGenerationId === tempReportGenerationId
        );
      console.log('tempFrontendElementObj');
      console.log(tempFrontendElementObj);

      // autocomplete er jonno data formatting
      if (
        tempFrontendElementObj?.dataType === 'Autocomplete' &&
        formData[key]
      ) {
        formData[key] = formData[key].optionId;
      }
      // datePicker er jonno data formatting
      if (
        formData[key] &&
        formData[key].$d instanceof Date &&
        tempFrontendElementObj?.dataType === 'Date Picker'
      ) {
        console.log(
          `I am in if loop where only dhukas when Date Picker, : ${formData[key].$d}`
        );
        const endsWithFrom = tempFrontendElementObj?.caption
          .toLowerCase()
          .endsWith('from');
        const endsWithTo = tempFrontendElementObj?.caption
          .toLowerCase()
          .endsWith('to');
        let formattedDateTemp1 = '';
        if (endsWithFrom) {
          formattedDateTemp1 = dayjs(formData[key].$d).format(
            'YYYY-MM-DD 00:00:00.000'
          );
        } else if (endsWithTo) {
          formattedDateTemp1 = dayjs(formData[key].$d).format(
            'YYYY-MM-DD 23:59:00.000'
          );
        } else {
          formattedDateTemp1 = dayjs(formData[key].$d).format('YYYY-MM-DD');
        }
        formData[key] = formattedDateTemp1;
      }
      // MonthYear Picker er jonno data formatting
      if (
        formData[key] &&
        formData[key].$d instanceof Date &&
        tempFrontendElementObj?.dataType === 'MonthYear Picker'
      ) {
        console.log(
          `I am in if loop where only dhukas when Date Picker, : ${formData[key].$d}`
        );

        let formattedDateTemp1 = '';
        // formattedDateTemp1 = dayjs(formData[key].$d).format('YYYY-MM');
        formattedDateTemp1 = dayjs(formData[key].$d)
          .endOf('month') // gets last day of the month
          .format('YYYY-MM-DD');
        formData[key] = formattedDateTemp1;
      }
      // dateTimePicker er jonno data formatting
      if (
        formData[key] &&
        formData[key].$d instanceof Date &&
        tempFrontendElementObj?.dataType === 'Datetime Picker'
      ) {
        // const formattedDate = dayjs(formData[key].$d).format(
        //   'YYYY-MM-DDTHH:mm:00.000[Z]'
        // );
        const formattedDateTemp2 = dayjs(formData[key].$d).format(
          'YYYY-MM-DD HH:mm:00.000'
        );
        formData[key] = formattedDateTemp2;
      }

      console.log('---- formdata from getDependencyQuery-----');
      console.log(formData);

      console.log('Dependency Query');
      const x =
        // tempFrontendElementObj &&
        formData[key] &&
        currentDependenciesSplitted.includes(
          tempFrontendElementObj?.columnName
            ? tempFrontendElementObj?.columnName
            : 'nothing'
        ) &&
        currentElementObj?.reportGenerationId !==
          tempFrontendElementObj?.reportGenerationId;
      console.log(x);

      if (
        tempFrontendElementObj &&
        formData[key] &&
        currentDependenciesSplitted.includes(
          tempFrontendElementObj?.columnName
        ) &&
        currentElementObj?.reportGenerationId !==
          tempFrontendElementObj?.reportGenerationId
      ) {
        if (tempFrontendElementObj.dataType === 'MonthYear Picker') {
          const startDate = dayjs(formData[key])
            .startOf('month')
            .format('YYYY-MM-DD 00:00:00.000');
          const endDate = dayjs(formData[key])
            .endOf('month')
            .format('YYYY-MM-DD 23:59:59.999');
          dependencyQuery = `${
            dependencyQuery ? `${dependencyQuery} ^ ` : dependencyQuery
          }${tempFrontendElementObj.columnName} >= '${startDate}' AND ${
            tempFrontendElementObj.columnName
          } <= '${endDate}'`;
        } else {
          dependencyQuery = `${
            (dependencyQuery ? `${dependencyQuery} ^ ` : dependencyQuery) +
            tempFrontendElementObj.columnName
          }'${formData[key]}'`;
        }
        console.log('dependencyQuery PER ROW-->');
        console.log(dependencyQuery);
      }
    }
    // console.log('Dependency Query');
    // console.log(
    //   currentDependenciesSplitted.includes(tempFrontendElementObj?.columnName)
    // );

    return dependencyQuery;
  };

  const dynamicReportAnalysisDownload = (
    whereClause: string,
    buttonId: number,
    reportName: string
  ) => {
    console.log('dynamic analysis report download axios function called');

    const tempDynamicReportInputElements =
      dynamicReportFrontendElementsData?.frontendInputElements;

    // const tempUserInfo = {
    //   userName: userInfo?.userName || '',
    //   securityUserId: userInfo?.securityUserId || 0,
    //   employeeId: userInfo?.employeeId || 0,
    //   emailAddress: userInfo?.emailAddress || '',
    //   phone: userInfo?.phone || '',
    //   password: userInfo?.password || '',
    //   companyId: userInfo?.companyId || 0,
    //   companyName: userInfo?.companyName || '',
    //   companyAddress: userInfo?.companyAddress || '',
    //   companyPhone: userInfo?.companyPhone || '',
    //   locationId: userInfo?.locationId || 0,
    //   locationName: userInfo?.locationName || '',
    // };
    const sendingObj = {
      // biznessEventId: clickedCardInfo?.biznessEventId,
      biznessEventProcessConfigurationId:
        clickedCardInfo?.biznessEventProcessConfigurationId,
      reportName: reportName || 'Report',
      buttonId,
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
      companyName: userInfo?.companyName || '',
      companyAddress: userInfo?.companyAddress || '',
      companyPhone: userInfo?.companyPhone || '',
      whereQuery: `${whereClause}`,
    };

    // console.log('CHECK hahahaha---------------->');
    // console.log(tempUserInfo);

    console.log(sendingObj);

    setReportDownloadLoading(true);
    axios
      .get(`${API_BASE_URL}/ProcurementTender/getDynamicReportDownload`, {
        params: sendingObj,
        headers: {
          Authorization: `Bearer ${userInfo?.userToken || ''}`, // Replace `token` with your actual bearer token variable
        },
      })
      .then((res) => {
        console.log('axios res scope!!');
        if (res.data) {
          console.log(' report downloading res.data');
          console.log(res.data);

          if (res.data.message !== 'Success') {
            toast.error(`${res.data.message}`);
          } else {
            const base64 = res.data.data;
            const byteCharacters = atob(base64);
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
            link.download = `${res.data.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Optionally, revoke the object URL to free up memory
            URL.revokeObjectURL(blobUrl);
          }
        }
      })
      .catch((error) => {
        // Handle error
        toast.error(
          `something wrong in backend while downloading dynamic report: ${error}`
        );
        console.log(
          `something wrong in backend while downloading dynamic report: ${error}`
        );
        console.log(error);
      })
      .finally(() => {
        setReportDownloadLoading(false); // Set loading state to false when axios finishes
      });
  };

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          {/* Main Card */}
          {/* <form onSubmit={handleSubmit(downloadReport)}> */}
          <form>
            {dynamicReportFrontendElementsLoading ||
            dynamicReportFrontendElementsIsFetching ? (
              <div className="block rounded-lg shadow-lg h-[90vh] bg-white dark:bg-secondary-dark-bg  text-center">
                <p className=" text-xl mb-40 pt-20">
                  Frontend elements are loading. Please Wait....
                </p>
                <CircularProgress size={80} />
              </div>
            ) : (
              <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                {/* Main Card header */}
                <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                  {/* -----[TransactionEventVoucher experimental place starts here]----- */}

                  {clickedCardInfo?.biznessEventName
                    ? clickedCardInfo?.biznessEventName.replace(
                        /([A-Z])(?=[A-Z][a-z])/g,
                        '$1 '
                      )
                    : 'Dynamic Report Analysis'}
                  {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
                </div>
                {/* Main Card header--/-- */}

                {/* Main Card body */}
                <div className="px-6 pb-4 text-start  mt-5">
                  {/* {dynamicReportFrontendElementsData &&
                  dynamicReportFrontendElementsData.map((element, index) => (
                    <div key={element.reportGenerationId} className="my-4">
                      {renderElement(element)}
                    </div>
                  ))} */}
                  {dynamicReportFrontendElementsData &&
                    dynamicReportFrontendElementsData.frontendInputElements &&
                    dynamicReportFrontendElementsData.frontendInputElements.map(
                      (element, index) => (
                        <div key={element.reportGenerationId} className="my-4">
                          {/* {console.log(hello);} */}
                          {renderElement(element)}
                        </div>
                      )
                    )}
                </div>
                {/* Main Card Body--/-- */}

                {/* Main Card footer */}
                <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                  <div className="flex gap-x-3">
                    {dynamicReportFrontendElementsData &&
                      dynamicReportFrontendElementsData.frontendButtonElements &&
                      dynamicReportFrontendElementsData.frontendButtonElements.map(
                        (element, index) => (
                          <button
                            type="submit"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                              reportDownloadLoading ||
                              dynamicReportFrontendElementsLoading ||
                              dynamicReportFrontendElementsIsFetching
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              downloadReport(element);
                            }}
                          >
                            {(reportDownloadLoading ||
                              dynamicReportFrontendElementsLoading ||
                              dynamicReportFrontendElementsIsFetching) &&
                            dynamicReportFrontendElementsData ? (
                              <CircularProgress size={12} color="inherit" />
                            ) : (
                              ''
                            )}
                            {'  '}
                            {(reportDownloadLoading ||
                              dynamicReportFrontendElementsLoading ||
                              dynamicReportFrontendElementsIsFetching) &&
                            dynamicReportFrontendElementsData
                              ? 'Please wait...'
                              : dynamicReportFrontendElementsData
                                    ?.frontendInputElements?.length
                                ? `${element.buttonName.replace(
                                    /([A-Z])(?=[A-Z][a-z])/g,
                                    '$1 '
                                  )} Download`
                                : ''}
                          </button>
                        )
                      )}
                  </div>
                </div>
                {/* Main Card footer--/-- */}
              </div>
            )}
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>
    </div>
    // return wrapper div--/--
  );
};

export default DynamicReportAnalysis;
