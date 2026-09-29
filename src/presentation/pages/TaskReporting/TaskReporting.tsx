/* eslint-disable react/jsx-pascal-case */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable operator-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
// import { ExportToCsv } from 'export-to-csv';
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  InputAdornment,
  LinearProgress,
  LinearProgressProps,
  Slider,
  TextField,
  TextareaAutosize,
  Typography,
  linearProgressClasses,
  styled,
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// type Props = {}
import { useForm, Controller } from 'react-hook-form';
import { VolumeUp } from '@mui/icons-material';
import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { ClimbingBoxLoader, PropagateLoader } from 'react-spinners';
import { ExportToCsv } from 'export-to-csv';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import avatarColored3 from '../../assets/data/AvatarColored3.png'; // eitar direct link ashbe, backend jekhane host kora shekhan theke
import AttachmentLoader from '../../components/AttachmentLoader';
import DoughnutChart from '../../components/DoughnutChart';
import { IBiznessEventProcessConfiguration } from '../../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
import { ISANextEvent } from '../../../domain/interfaces/SANextEventInterface';
import {
  IBiznessEventPCTrackVM,
  IBiznessEventPCTrackVMForTaskReporting,
  ICreateBiznessEventPCTrackCommand,
} from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { IUserInfo } from '../../../domain/interfaces/UserInfoInterface';
import {
  IBiznessEventPCTrackCommandsVM,
  useGetBiznessEventPCTrackVMForTRLogByFirstEventNoQuery,
  useProcessBiznessEventPCTrackVMForTRMutation,
} from '../../../infrastructure/api/BiznessEventPCTrackVMForTRLogApiSlice';
import {
  ICreateBiznessEventPCTrackAttachmentCommand,
  IDeleteBiznessEventPCTrackAttachmentCommand,
} from '../../../domain/interfaces/BiznessEventPCTrackAttachmentInterfaces';

import AttachmentLoaderForReporting from '../../components/biz24Components/AttachmentLoaderForReporting';
import { useLazySendEmailToNextEventUserQuery } from '../../../infrastructure/api/EmailApiSlice';

const API_BASE_URL = window.API_BASE_URL;

const override: CSSProperties = {
  display: 'block',
  margin: '10px auto',
  borderColor: 'red',
};

ChartJS.register(ArcElement, Tooltip, Legend);

function getRandomColorString(alpha: number) {
  // Generate random values for red, green, and blue components
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  // Construct the RGBA string
  const colorString = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  return colorString;
}

function getNumberOrdinal(number: number) {
  // Special case for numbers ending in 11, 12, and 13
  if (number % 100 >= 11 && number % 100 <= 13) {
    return `${number}th`;
  }

  // Regular cases
  switch (number % 10) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
}

const TaskReporting = ({
  modalPageOpenerClose,
  clickedCardInfo,
  operationMode,
}: any) => {
  // ------------[User infos and session works]-----------------

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

  // -----end//-------[User infos and session works]-----------------

  console.log('Hey---> from Task Reporting showing clickedCardInfo');
  console.log(clickedCardInfo);

  const [taskDate, setTaskDate] = useState(dayjs());
  const [taskStartTime, setTaskStartTime] = useState(dayjs());
  const [taskMinStartTime, setTaskMinStartTime] = useState<dayjs.Dayjs | null>(
    dayjs()
  );
  const [taskMinimumStartDate, setTaskMinimumStartDate] =
    useState<dayjs.Dayjs | null>(dayjs());

  const [taskEndTime, setTaskEndTime] = useState<dayjs.Dayjs | null>(null);
  // ekhane apiSlice Call hobe of task Report
  // console.log(jsonForTaskReporting);
  const [graphInfos, setGraphInfos] = useState<any>({});

  const [attachments, setAttachments] = useState<any[]>([]);
  const [deletedRegedAttach, setDeletedRegedAttach] = useState<any[]>([]);
  const [taskCompleteCheckBox, setTaskCompleteCheckBox] = useState(false);
  const { register, getValues, reset, control, setValue } = useForm();

  const [emailInfoState, setEmailInfoState] = useState<any>();

  // slider for progress voulume
  const [progressSliderVal, setProgressSliderVal] = useState<string | number>(
    0
  );
  const [loaderSpinner, setLoaderSpinner] = useState(true);
  const {
    data: jsonForTaskReporting, // jsondummy
    isLoading: taskReportingDataLoading,
    error: taskReportingDataError,
    isError: taskReportingDataIsError,

    refetch: taskReportingDataRefetch,
  } = useGetBiznessEventPCTrackVMForTRLogByFirstEventNoQuery(
    {
      firstEventNo: clickedCardInfo.firstEventNo,
      eventNo: clickedCardInfo.eventNo,
      biznessEventId: clickedCardInfo.biznessEventId,
      operationMode,
    }, // this overrules the api definition setting,
    // forcing the query to always fetch when this component is mounted
    { refetchOnMountOrArgChange: true }
  );

  const [
    processBiznessEventPCTrackForTRSave,
    {
      isLoading: processBiznessEventPCTrackForTRSaveLoading,
      isError: processBiznessEventPCTrackForTRSaveError,
      error: processBiznessEventPCTrackForTRSaveErrorObj,
      isSuccess: processBiznessEventPCTrackForTRSaveIsSuccess,
    },
  ] = useProcessBiznessEventPCTrackVMForTRMutation();

  useEffect(() => {
    if (!taskReportingDataLoading && jsonForTaskReporting) {
      // setting minimum date, minimum time

      const minimumStartDate = jsonForTaskReporting.length
        ? dayjs(jsonForTaskReporting[jsonForTaskReporting.length - 1].date)
        : dayjs();
      const minimumStartTime = jsonForTaskReporting.length
        ? dayjs(
            jsonForTaskReporting[jsonForTaskReporting.length - 1].endTime,
            'hh:mm A'
          )
        : dayjs();

      setTaskMinimumStartDate(minimumStartDate);
      // alert(jsonForTaskReporting[jsonForTaskReporting.length - 1].endTime);

      // alert(minimumStartTime);
      setTaskMinStartTime(minimumStartTime);

      initiateChartDataAndSlider();
      initiateTextfields();
      // --------[attachment retrieve codes]--------

      // let tempAttachmentArr: any[] = [];
      // for (let i = 0; i < jsonForTaskReporting.length; i++) {
      //   tempAttachmentArr = [
      //     ...jsonForTaskReporting[i].attachmentList,
      //     ...tempAttachmentArr,
      //   ];
      // }

      // const tempAttachmentsFormatted = [];
      // for (let i = 0; i < tempAttachmentArr.length; i++) {
      //   const perAttachObj = checkAndSetAttachObjFomrat(tempAttachmentArr[i]);
      //   tempAttachmentsFormatted.push(perAttachObj);
      // }
      // setAttachments(tempAttachmentsFormatted);

      // --------[attachment retrieve codes]----//----
    } else if (taskReportingDataLoading) {
      setLoaderSpinner(true);
    }
    if (taskReportingDataError) {
      setLoaderSpinner(false);
    }
  }, [taskReportingDataLoading, jsonForTaskReporting]);

  const [
    triggerSendEmailToNextEventUser,
    {
      data: sendEmailToNextEventUserData,
      error: sendEmailToNextEventUserError,
      isError: sendEmailToNextEventUserIsError,
      isSuccess: sendEmailToNextEventUserIsSuccess,
      isLoading: sendEmailToNextEventUserIsLoading,
      isFetching: sendEmailToNextEventUserIsFetching,
    },
  ] = useLazySendEmailToNextEventUserQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (sendEmailToNextEventUserIsError) {
      toast.error(
        'Something wrong from backend while fetching sendEmailToNextEventUserData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching sendEmailToNextEventUserData, see console--->:'
      );
      console.log(sendEmailToNextEventUserError);
    }
    if (sendEmailToNextEventUserIsSuccess) {
      console.log('sendEmailToNextEventUserIsSuccess');

      console.log(sendEmailToNextEventUserData);
    }
  }, [
    sendEmailToNextEventUserData,
    sendEmailToNextEventUserIsLoading,
    sendEmailToNextEventUserError,
    sendEmailToNextEventUserIsError,
    sendEmailToNextEventUserIsFetching,
    sendEmailToNextEventUserIsSuccess,
  ]);

  // attachments antesi of a chain by firsteventNo, axios diye antesi, maybe ghetis
  useEffect(() => {
    const sendingObj = {
      firstEventNo: clickedCardInfo.firstEventNo,
      fixedTaskTemplateId: clickedCardInfo.fixedTaskTemplateId,
    };
    // setLoaderSpinner(true);
    axios
      .get(
        `${API_BASE_URL}/BiznessEvent_PCTrack/GetAllAttachmentByFirstEventNo`,
        {
          params: sendingObj,
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          console.log('new attachments all:---->');
          console.log(res.data);
          const allAttachmentsFetched = res.data;

          const tempAttachmentArr: any[] = [];
          for (let i = allAttachmentsFetched.length - 1; i >= 0; i--) {
            tempAttachmentArr.push(allAttachmentsFetched[i]);
          }

          const tempAttachmentsFormatted = [];
          for (let i = 0; i < tempAttachmentArr.length; i++) {
            const perAttachObj = checkAndSetAttachObjFomrat(
              tempAttachmentArr[i]
            );
            tempAttachmentsFormatted.push(perAttachObj);
          }
          setAttachments(tempAttachmentsFormatted);
          // setLoaderSpinner(false);
        } else {
          toast.error('Something error on fetching attachments!');
          // setLoaderSpinner(false);
        }
      });
  }, []);

  useEffect(() => {
    if (
      taskDate &&
      jsonForTaskReporting &&
      jsonForTaskReporting.length &&
      !taskReportingDataIsError &&
      dayjs(taskDate).format('YYYY-MM-DD') ===
        dayjs(
          jsonForTaskReporting[jsonForTaskReporting.length - 1].date
        ).format('YYYY-MM-DD')
    ) {
      const minimumStartTime = dayjs(
        jsonForTaskReporting[jsonForTaskReporting.length - 1].endTime,
        'hh:mm A'
      );
      setTaskMinStartTime(minimumStartTime);
    } else {
      setTaskMinStartTime(null);
    }
  }, [taskDate, jsonForTaskReporting, taskReportingDataIsError]);

  useEffect(() => {
    if (processBiznessEventPCTrackForTRSaveLoading) {
      // loading kisu dekha
      setLoaderSpinner(true);
    } else {
      setLoaderSpinner(false);
    }

    if (processBiznessEventPCTrackForTRSaveIsSuccess) {
      // loader bondho kor
      setLoaderSpinner(false);

      if (emailInfoState?.progressPReported === 100) {
        triggerSendEmailToNextEventUser({
          companyId: emailInfoState?.companyId || 0,
          fixedTaskTemplateId: emailInfoState?.fixedTaskTemplateId || 0,
          firstEventNo: emailInfoState?.firstEventNo || '',
        });
      }

      console.log('successfully saved');
      Swal.fire({
        title: `Saved Successfully!`,
        text: 'Report Progress Entry Saved Successfully.',
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
          modalPageOpenerClose();
        }
      });
      // modal bondho kor
    } else if (
      processBiznessEventPCTrackForTRSaveError &&
      processBiznessEventPCTrackForTRSaveErrorObj
    ) {
      if (
        'status' in processBiznessEventPCTrackForTRSaveErrorObj &&
        'data' in processBiznessEventPCTrackForTRSaveErrorObj
      ) {
        const errorObj: any = processBiznessEventPCTrackForTRSaveErrorObj.data;
        toast.error(
          `${errorObj.type} ${processBiznessEventPCTrackForTRSaveErrorObj.status}: ${errorObj.title}`
        );
        console.log('Error while saving data in PC track:------->');
        console.log(errorObj);
      }
    }
  }, [
    processBiznessEventPCTrackForTRSaveLoading,
    processBiznessEventPCTrackForTRSaveIsSuccess,
    processBiznessEventPCTrackForTRSaveError,
    modalPageOpenerClose,
    processBiznessEventPCTrackForTRSaveErrorObj,
  ]);

  // useEffect(() => {
  //   // alert('attachment deleted');
  //   console.log('attachment deleted');

  //   console.log(deletedRegedAttach);
  // }, [deletedRegedAttach]);

  const checkAndSetAttachObjFomrat = (perAttachment: any) => {
    // const fileExtension = perAttachment.AttachmentType;

    const fileExtension = perAttachment.fileName
      .substr(perAttachment.fileName.lastIndexOf('.') + 1)
      .toLowerCase();
    // let fileExtension = name.split('.').pop()
    let fileThumbnail = '';
    let downloadable = true;

    if (
      fileExtension === 'jpg' ||
      fileExtension === 'jpeg' ||
      fileExtension === 'png' ||
      fileExtension === 'gif'
    ) {
      downloadable = false;
    } else if (
      fileExtension === 'mp4' ||
      fileExtension === 'webm' ||
      fileExtension === 'mkv' ||
      fileExtension === 'wmv'
    ) {
      fileThumbnail = 'https://i.ibb.co/cNLBwjY/Video-File-Icon.png';
      downloadable = true;
    } else if (
      fileExtension === 'xlsx' ||
      fileExtension === 'xls' ||
      fileExtension === 'csv'
    ) {
      fileThumbnail = 'https://i.ibb.co/5THHDGH/Excel-File-Icon-svg.png';
      downloadable = true;
    } else if (
      fileExtension === 'doc' ||
      fileExtension === 'docx' ||
      fileExtension === 'dot' ||
      fileExtension === 'dotx'
    ) {
      fileThumbnail = 'https://i.ibb.co/Z219ZB3/Word-File-Icon.png';
      downloadable = true;
    } else if (fileExtension === 'pdf') {
      fileThumbnail = 'https://i.ibb.co/b5Dq1Q3/Pdf-File-Icon-svg.png';
      downloadable = true;
    } else {
      fileThumbnail = 'https://i.ibb.co/hsnss8w/general-File-Icon.png';
      downloadable = true;
    }
    const attachmentObjFormat = {
      primaryKey: perAttachment.attachmentId,
      fileB64format: perAttachment.attachmentURL,
      fileName: perAttachment.fileName,
      fileExtension,
      fileThumbnail,
      downloadable,
      biznessEventId: perAttachment.biznessEventId,
    };
    return attachmentObjFormat;
  };

  function initiateChartDataAndSlider() {
    // ----------[chartData and slider initiation after api call]----------------
    const sectionLables = [];
    const graphData = [];
    const tooltipGraphLabel = 'Percentage Of';
    const sectionColor = [];
    const graphBorderWidth = 2;
    const lastReportsProgress = jsonForTaskReporting?.length
      ? jsonForTaskReporting[jsonForTaskReporting.length - 1].progressPReported
      : 0;
    setProgressSliderVal(lastReportsProgress); // prothomei slider er default value set kore nilam
    if (jsonForTaskReporting?.length) {
      for (let i = 0; i < jsonForTaskReporting.length; i++) {
        const reportFrequency = jsonForTaskReporting[i].biznessEventFrequency;
        const frequencyOrdinal = getNumberOrdinal(reportFrequency);
        const date = jsonForTaskReporting[i].date;
        const endTime = jsonForTaskReporting[i].endTime;
        const progress =
          i === 0
            ? jsonForTaskReporting[i].progressPReported
            : jsonForTaskReporting[i].progressPReported -
              jsonForTaskReporting[i - 1].progressPReported; // maane always kono index er individual progress paoa jaabe agerta minus ekhonkarta

        const bgColor = getRandomColorString(0.6);
        sectionLables.push(
          `${frequencyOrdinal} TR Progress (${endTime}; ${date}) `
        );
        graphData.push(progress);
        sectionColor.push(bgColor);
      }
    }

    // current task progress dummy infos and organizing for graph data
    const currentTaskReportingLabel = `Current TR Progress(Today)`;
    const currentData = 0;
    const currentBgColor = getRandomColorString(0.6);

    sectionLables.push(currentTaskReportingLabel);
    graphData.push(currentData);
    sectionColor.push(currentBgColor);

    // remaining percentage calculation infos and organizing for graph data
    const lastJsonForTaskReportingIndex = jsonForTaskReporting?.length
      ? jsonForTaskReporting.length - 1
      : 0;
    const remainingTaskReportingLabel = `Remaining Progress`;
    const remainingData = jsonForTaskReporting?.length
      ? 100 -
        jsonForTaskReporting[lastJsonForTaskReportingIndex].progressPReported
      : 100;

    const remainingBgColor = 'rgba(212, 212, 212, 0.2)';

    sectionLables.push(remainingTaskReportingLabel);
    graphData.push(remainingData);
    sectionColor.push(remainingBgColor);

    const graphObj = {
      sectionLables,
      graphData,
      tooltipGraphLabel,
      sectionColor,
      graphBorderWidth,
    };
    setGraphInfos(graphObj);
    console.log('graphObj------------------->....>>>.....>>>');
    console.log(graphObj);

    // ----------[textfield initiation after api call]----------------
  }

  function initiateTextfields() {
    const taskName = clickedCardInfo.biznessEventName.replace(
      /([A-Z])/g,
      ' $1'
    );
    setValue('task', taskName);
  }

  console.log('taskReportingDataLoading');
  console.log(taskReportingDataLoading);

  // if (!taskReportingDataLoading) {
  //   console.log('taskReportingDataLoading');
  //   console.log(taskReportingDataLoading);

  //   initiateChartDataAndSlider();
  //   initiateTextfields();
  // }

  /// ///////////////////////////////////////////

  function modifyGraphInfo(changedValue: number) {
    const changedValidValue = changedValue > 100 ? 100 : changedValue;

    const lastJsonForTaskReportingIndex = jsonForTaskReporting
      ? jsonForTaskReporting.length - 1
      : 0;
    const progressDoneBefore =
      jsonForTaskReporting &&
      jsonForTaskReporting[lastJsonForTaskReportingIndex]?.progressPReported
        ? jsonForTaskReporting[lastJsonForTaskReportingIndex].progressPReported
        : 0;

    const lastIndex = graphInfos.graphData.length - 1;
    const last2ndIndex = graphInfos.graphData.length - 2;
    if (!(changedValidValue < progressDoneBefore)) {
      setProgressSliderVal(changedValidValue as number);

      const currentlyDonePercentage = changedValidValue - progressDoneBefore;

      graphInfos.graphData[last2ndIndex] = currentlyDonePercentage;
      graphInfos.graphData[lastIndex] = 100 - changedValidValue;
      setGraphInfos({ ...graphInfos });
      // console.log('After slider changes, graphInfos: ------------------');
      // console.log(graphInfos);
    } else {
      setProgressSliderVal(progressDoneBefore);
      graphInfos.graphData[last2ndIndex] = 0;
      graphInfos.graphData[lastIndex] = 100 - progressDoneBefore;
      // toast.warning(`You cannot set the value below the done percentage!`);
    }
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (taskCompleteCheckBox) {
      return;
    }

    modifyGraphInfo(newValue as number);
  };

  const handleSliderFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (taskCompleteCheckBox) {
      return;
    }
    const valueOfInputSlider = parseInt(event.target.value, 10); // ts e radixNumber deya lage, maane base, base10 means decimal, base16 means hexadecimal
    if (!Number.isNaN(valueOfInputSlider)) {
      setProgressSliderVal(valueOfInputSlider);
      // modifyGraphInfo(valueOfInputSlider);
    } else {
      setProgressSliderVal('');
    }
  };
  const handleSliderFieldOnBlur = () => {
    if (Number.isNaN(progressSliderVal)) {
      setProgressSliderVal(0);
    }
    modifyGraphInfo(progressSliderVal as number);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setTaskCompleteCheckBox(true);
      setProgressSliderVal(100);
      modifyGraphInfo(100);
    } else {
      setTaskCompleteCheckBox(false);
      setProgressSliderVal(0);
      modifyGraphInfo(0);
    }
  };

  const processDataToSave = (taskEndTimePassed: dayjs.Dayjs) => {
    const tempTaskDate = dayjs(taskDate).format('YYYY-MM-DD');
    const tempTaskStartTime = dayjs(taskStartTime).format('HH:mm');
    const tempTaskEndTime = dayjs(taskEndTimePassed).format('HH:mm');

    const taskStartDate = `${tempTaskDate}T${tempTaskStartTime}:00.000Z`;
    const taskEndDate = `${tempTaskDate}T${tempTaskEndTime}:00.000Z`;
    // modalPageOpenerClose(); //closes the modalPageOpener

    const attachmentCreatedForBackend: ICreateBiznessEventPCTrackAttachmentCommand[] =
      [];
    if (attachments.length) {
      for (let i = 0; i < attachments.length; i++) {
        if (!attachments[i].primaryKey) {
          // jodi j attachment nitesi oitar primary key na thake, primary key wala ta nibona
          const tempAttachmentObj: ICreateBiznessEventPCTrackAttachmentCommand =
            {
              biznessEventPCTrackId: 0, // eita backend e 1st e biznessEvent_PCTrack table e row dhuke, shei row er primary key hoilo eita, so eita backend theke assigned hobe
              fileB64Format: attachments[i].fileB64format.substr(
                attachments[i].fileB64format.lastIndexOf(',') + 1
              ),
              // fileB64Format: attachments[i].fileB64format,
              fileExtension: attachments[i].fileExtension,
              fileName: attachments[i].fileName,
              attachmentURL: '',
              entryBy: userInfo.securityUserId,
              dateOfEntry: taskEndDate,
              companyId: userInfo.companyId,
              locationId: userInfo.locationId,
            };
          attachmentCreatedForBackend.push(tempAttachmentObj);
        }
      }
    }

    // -----------------[when api get modified for attachment delete, uncomment below commented lines]-----------------

    const attachmentDeletedForBackend: IDeleteBiznessEventPCTrackAttachmentCommand[] =
      [];
    if (deletedRegedAttach.length) {
      for (let i = 0; i < deletedRegedAttach.length; i++) {
        const tempDeletedAttachmentObj: IDeleteBiznessEventPCTrackAttachmentCommand =
          {
            attachmentId: deletedRegedAttach[i].primaryKey,
            fileName: deletedRegedAttach[i].fileName,
            attachmentURL: '',
          };
        attachmentDeletedForBackend.push(tempDeletedAttachmentObj);
      }
    }

    const objToSave: ICreateBiznessEventPCTrackCommand = {
      eventNo: clickedCardInfo.eventNo,
      performedBy: userInfo.securityUserId,
      startDate: taskStartDate,
      endDate: taskEndDate,
      note: getValues().note ? getValues().note : '',
      progressPReported: progressSliderVal as number,
      originalSequence: clickedCardInfo.sequence,
      nextSequence: clickedCardInfo.sequence + 1,
      complete: false, // equals to 100 hole true else false
      biznessEventProcessConfigurationId:
        clickedCardInfo.biznessEventProcessConfigurationId,
      firstEventNo: clickedCardInfo.firstEventNo,
      locationId: clickedCardInfo.eventLocationId,
    };

    // const processedData: IBiznessEventPCTrackCommandsVM = {
    //   createPCTrackCommand: objToSave,
    //   createPCTrackAttachmentCommand: attachmentCreatedForBackend,
    // };

    // -------------------------------[when api get modified for attachment delete, send this]------------------------

    const processedData: IBiznessEventPCTrackCommandsVM = {
      createPCTrackCommand: objToSave,
      createPCTrackAttachmentCommand: attachmentCreatedForBackend,
      deletePCTrackAttachmentCommand: attachmentDeletedForBackend,
    };
    console.log('data thats been sent to backend-------->');
    console.log(processedData);

    return processedData;
  };

  const saveTaskProgress = () => {
    console.log('Save button clicked!!!!!!!!!');

    if (!taskEndTime) {
      Swal.fire({
        title: `End Time field is empty!`,
        text: 'Do you want to set "End Time" automatically with the latest time?',
        showDenyButton: true,
        allowOutsideClick: true,
        // target: 'body',
        icon: 'question',
        showCancelButton: false,
        confirmButtonText: 'Yes!',
        denyButtonText: `No, I will set it manually!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const timeNow = dayjs();
          setTaskEndTime(timeNow);
          const objForSending = processDataToSave(timeNow);

          const emailInfo = {
            fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
            firstEventNo: objForSending.createPCTrackCommand.firstEventNo,
            companyId: userInfo?.companyId,
            progressPReported:
              objForSending.createPCTrackCommand.progressPReported,
          };

          setEmailInfoState(emailInfo);

          processBiznessEventPCTrackForTRSave(objForSending);
          console.log('emailInfo set--->');
          console.log(emailInfoState);
          console.log('objForSending');
          console.log(objForSending);
          // ekhane ajax call fobe for sending....
        }
      });
    } else {
      const objForSending = processDataToSave(taskEndTime);
      console.log('objForSending');
      console.log(objForSending);

      console.log('clickedCardInfo------->');
      console.log(clickedCardInfo);
      console.log(clickedCardInfo);

      const emailInfo = {
        fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
        firstEventNo: objForSending.createPCTrackCommand.firstEventNo,
        companyId: userInfo?.companyId,
        progressPReported: objForSending.createPCTrackCommand.progressPReported,
      };

      setEmailInfoState(emailInfo);

      processBiznessEventPCTrackForTRSave(objForSending);
      console.log('emailInfo set--->');
      console.log(emailInfoState);
      // ekhane ajax call fobe for sending....
    }
  };

  // -----------[MRT Table]--------------
  const taskLogColumns = useMemo<
    MRT_ColumnDef<IBiznessEventPCTrackVMForTaskReporting>[]
  >(
    () => [
      {
        accessorKey: 'performedByName', // access nested data with dot notation
        header: 'Entry By',
        Cell: ({ renderedCellValue, row }) => {
          const currentRow: IBiznessEventPCTrackVMForTaskReporting | null =
            jsonForTaskReporting ? jsonForTaskReporting[row.index] : null;
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <img
                className="rounded-full h-10 w-15 bg-gray-500"
                alt="avatar"
                // src={row.performedByImage? avatarColored3}
                src={
                  currentRow?.performedByImage
                    ? currentRow.performedByImage
                    : avatarColored3
                }
              />
              <span>{renderedCellValue}</span>
            </Box>
          );
        },
      },
      {
        accessorKey: 'biznessEventFrequency', // access nested data with dot notation
        header: 'Reporting Frequency',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        // size: 150,
      },
      {
        accessorKey: 'progressPReported', // access nested data with dot notation
        header: 'Progress%',
        // size: 150,
        Cell: ({ renderedCellValue, row }) => {
          const progressStyle = {
            width: `${renderedCellValue}%`,
          };
          return (
            <div className="w-full">
              <div className="flex justify-center -mb-[1.3125rem]">
                <span className="text-sm text-[0.8125rem] text-white dark:text-white">
                  {renderedCellValue} %
                </span>
              </div>
              <div className="w-full bg-gray-500 rounded-full dark:bg-gray-700 text-center">
                <div
                  className="bg-green-600 h-5  text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={progressStyle}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'startTime', // access nested data with dot notation
        header: 'Start Time',
        // size: 150,
      },
      {
        accessorKey: 'endTime', // access nested data with dot notation
        header: 'End Time',
        // size: 300,
      },
      {
        accessorKey: 'note', // access nested data with dot notation
        // header: 'Actions',
        header: 'Note',
      },
    ],
    [jsonForTaskReporting]
  );

  /// //////////////EXCEL CSV/////////////////////////////

  const taskReportGridHeaderXcel = [
    {
      accessorKey: 'performedByName',
      header: 'Entry By',
    },
    // {
    //   accessorKey: 'biznessEventFrequency',
    //   header: 'Reporting Frequency',
    // },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'progressPReported',
      header: 'Progress%',
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
    },
    {
      accessorKey: 'note',
      header: 'Note',
    },
  ];

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: taskReportGridHeaderXcel.map((c) => c.header),
  };
  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    const taskReportGridXCEL = [];
    if (jsonForTaskReporting) {
      // eslint-disable-next-line for-direction
      for (let i = jsonForTaskReporting.length - 1; i >= 0; i--) {
        // ulta kore array loop chalaitesi, cz i need descending order
        const tempObj = {
          performedByName: jsonForTaskReporting[i].performedByName,
          date: jsonForTaskReporting[i].date,
          progressPReported: jsonForTaskReporting[i].progressPReported,
          startTime: jsonForTaskReporting[i].startTime,
          endTime: jsonForTaskReporting[i].endTime,
          note: jsonForTaskReporting[i].note,
        };
        taskReportGridXCEL.push(tempObj);
      }
    }
    csvExporter.generateCsv(taskReportGridXCEL);
  };

  const tableInitializer: MRT_TableInstance<IBiznessEventPCTrackVMForTaskReporting> =
    useMaterialReactTable({
      columns: taskLogColumns,
      data: jsonForTaskReporting || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      enableStickyHeader: true,
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: true,
      layoutMode: 'grid',
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          {/* add your own custom print button or something */}
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={handleExportData}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
        </>
      ),
      // enableRowVirtualization: true,
      // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
      // enableEditing: true,
      // enableDensityToggle: false,
      initialState: {
        density: 'compact',
        columnVisibility: { biznessEventFrequency: false },
        sorting: [
          {
            id: 'biznessEventFrequency', // sort by age by default on page load
            desc: true,
          },
        ],
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
          borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora cz raw css diye
          // borderLeft: '1px solid #e0e0e0',
          // borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '0.8125rem',
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
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '23.75rem' } },
      // onSortingChange: setSorting,
      // state: { isLoading, sorting },
      // rowVirtualizerInstanceRef, // optional
      // rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer
    });

  return (
    // return wrapper div
    <div className="mt-0 p-0 md:mt-0">
      {!loaderSpinner ? (
        <div className="m-0 p-0 flex justify-center">
          <div className="block m-0 p-0 w-screen ">
            {/* Main Card */}
            <div className="block m-0 p-0 rounded-lg shadow-lg pb-5 min-h-[62.5rem] bg-gray-100 dark:bg-secondary-dark-bg text-center">
              {/* Main Card header */}
              <div className="py-2 bg-gray-100 dark:bg-secondary-dark-bg px-6  flex justify-between">
                <p className="mt-2 text-2xl font-extrabold dark:text-gray-200 text-start">
                  {clickedCardInfo.biznessEventName.replace(/([A-Z])/g, ' $1')}{' '}
                  Reporting
                </p>
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="mt-3 mx-5 grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="block px-3 rounded shadow bg-white dark:bg-secondary-dark-bg text-center">
                  <p className="mt-2 ml-4 text-start font-bold">
                    Progress Entry
                  </p>
                  <div className="ml-4 bg-blue-300 h-[0.3125rem] w-10 " />
                  <div className="mt-6 grid md:grid-cols-3 grid-cols-12 gap-3 m-3">
                    <div className="md:col-span-3 col-span-12">
                      <Controller
                        name="task"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...field}
                            sx={{ width: '100%', borderRadius: '3.125rem' }}
                            InputProps={{ style: { fontSize: '0.8125rem' } }}
                            InputLabelProps={{
                              style: { fontSize: '0.875rem' },
                              shrink: field.value,
                              // shrink: (field.value ? true : false)
                            }}
                            id=""
                            label="Task"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </div>
                    <div className="md:col-span-1 col-span-12">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date"
                          // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                          // visit https://day.js.org/docs/en/parse/string-format for datetime formats
                          inputFormat="DD/MM/YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: '100%', marginTop: 1 }}
                              {...params}
                              // {...register('taskDate')}
                              // defaultValue={voucherDateState}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          value={taskDate}
                          minDate={taskMinimumStartDate}
                          onChange={(newValue) => {
                            if (newValue) {
                              setTaskDate(newValue);
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="md:col-span-1 col-span-12">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          label="Start Time"
                          // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                          // visit https://day.js.org/docs/en/parse/string-format for datetime formats
                          inputFormat="hh:mm A"
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: '100%', marginTop: 1 }}
                              {...params}
                              {...register('startTime')}
                              // defaultValue={voucherDateState}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          value={taskStartTime}
                          // minTime={taskMinStartTime}
                          onChange={(newValue) => {
                            if (newValue) {
                              setTaskStartTime(newValue);
                              console.log('setTaskStartTime');
                              console.log(newValue);
                            }
                          }}
                          // minTime={
                          //   jsonForTaskReporting &&
                          //   jsonForTaskReporting[
                          //     jsonForTaskReporting.length - 1
                          //   ]?.endTime
                          //     ? dayjs(
                          //         jsonForTaskReporting[
                          //           jsonForTaskReporting.length - 1
                          //         ].endTime
                          //       )
                          //     : null
                          // }

                          // minTime={dayjs(
                          //   jsonForTaskReporting[
                          //     jsonForTaskReporting.length - 1
                          //   ].endTime
                          // )}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="md:col-span-1 col-span-12">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          label="End Time"
                          // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                          // visit https://day.js.org/docs/en/parse/string-format for datetime formats
                          inputFormat="hh:mm A"
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: '100%', marginTop: 1 }}
                              {...params}
                              {...register('endTime')}
                              // defaultValue={voucherDateState}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          value={taskEndTime}
                          // minTime={taskStartTime}
                          onChange={(newValue) => {
                            // if (newValue) {
                            setTaskEndTime(newValue);
                            // }
                          }}
                        />
                      </LocalizationProvider>
                    </div>

                    <div className="md:col-span-3 col-span-12">
                      <Controller
                        name="note"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            multiline
                            rows={4} // Adjust the number of minRows as needed
                            sx={{ width: '100%' }}
                            InputProps={{ style: { fontSize: '0.8125rem' } }}
                            InputLabelProps={{
                              style: { fontSize: '0.875rem' },
                              shrink: field.value,
                            }}
                            id=""
                            label="Note"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </div>
                    <div className="md:col-span-3 col-span-12">
                      <AttachmentLoaderForReporting
                        attachments={attachments}
                        setAttachments={setAttachments}
                        deletedRegedAttach={deletedRegedAttach}
                        setDeletedRegedAttach={setDeletedRegedAttach}
                        imgPerSlide={4}
                        currentBiznessEventId={clickedCardInfo.biznessEventId}
                      />
                    </div>
                    <div className="md:col-span-3 col-span-12">
                      <div className="w-full mt-1 grid grid-cols-12 gap-x-3 gap-y-0 ">
                        <div className="col-span-12 text-start">
                          <p className=" text-[0.8125rem]">Progress % :</p>
                        </div>

                        <div className="md:col-span-10 col-span-9">
                          <Slider
                            value={progressSliderVal as number}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                          />
                        </div>

                        <div className="md:col-span-2 col-span-3">
                          <Input
                            endAdornment={
                              <InputAdornment position="end">
                                <span className=" font-extrabold">%</span>
                              </InputAdornment>
                            }
                            value={progressSliderVal}
                            size="small"
                            onChange={handleSliderFieldChange} // onChange, On blur duitai mara, karon ami something er niche value dite parbena ei dhoroner condition gula onChange e dile calo moto value edit kora jayna, like jodi boli 30 er niche lekha jabena, so 31 type korte gele, 3 chaap dilei 30 hoye jay, then 1 chaap dile hoy 301, fole 100 hoye jay. Abar pura jinish ta onBlur eo deya jaito, but onblur e dile number er shathe slider er position change hoyna. Tai slider er postion change disi onChange e, aar condition for blocking invalid value gula disi onBlur e, which makes perfect ux
                            onBlur={handleSliderFieldOnBlur}
                            // onBlur={handleBlur}
                            inputProps={{
                              step: 10,
                              min: 0,
                              max: 100,
                              type: 'number',
                              'aria-labelledby': 'input-slider',
                              style: { fontSize: '0.8125rem', fontWeight: 'bold' },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 col-span-12">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="success"
                              onChange={handleCheckboxChange}
                              sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                            />
                          }
                          label="Task Completed"
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '0.8125rem', // Font size for the label
                              fontWeight: 'bold',
                            },
                          }}
                        />
                      </FormGroup>
                    </div>
                  </div>
                  {/*  Card footer */}
                  <div className="flex-grow" />
                  {/* upper/left side dummy div to keep the footer at the most bottom always */}
                  <div className="py-3 border-t text-start border-gray-300 text-gray-600">
                    <div className="flex gap-x-3">
                      <button
                        type="button"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        className="inline-block px-6 py-2.5 bg-half-transparent text-white font-medium text-xs leading-tight rounded  hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 w-full active:-translate-y-1 active:shadow-lg transform-all duration-700 ease-in-out"
                        onClick={() => {
                          if (
                            operationMode === 'preview' ||
                            operationMode === 'edit'
                          ) {
                            // do nothing
                          } else {
                            saveTaskProgress();
                          }
                        }}
                      >
                        Save Task Progress
                      </button>
                    </div>
                  </div>
                  {/*  Card footer--/-- */}
                </div>

                <div className="block px-3 rounded shadow bg-white dark:bg-secondary-dark-bg text-center">
                  <p className="mt-2 ml-4 text-start font-bold">
                    Individual Report Progress %
                  </p>
                  <div className="ml-4 bg-blue-300 h-[0.3125rem] w-10 " />
                  {/* <div className="flex p-0 m-0 justify-center"> */}
                  {/* <div className="w-[90%] p-0 m-0 flex justify-center "> */}
                  <div className="mt-2 flex justify-center">
                    <div className="md:w-[80%] md:mb-1 w-[88%] mb-6 ">
                      <DoughnutChart
                        sectionLables={
                          graphInfos?.sectionLables
                            ? graphInfos.sectionLables
                            : []
                        }
                        graphData={
                          graphInfos.graphData ? graphInfos.graphData : [0]
                        }
                        tooltipGraphLabel={
                          graphInfos.tooltipGraphLabel
                            ? graphInfos.tooltipGraphLabel
                            : ''
                        }
                        sectionColor={
                          graphInfos.sectionColor
                            ? graphInfos.sectionColor
                            : 'rgba(212, 212, 212, 1)'
                        }
                        graphBorderWidth={
                          graphInfos.graphBorderWidth
                            ? graphInfos.graphBorderWidth
                            : 0
                        }
                      />
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                {/* </div> */}
                <div className="block md:col-span-2 p-0 rounded shadow bg-white dark:bg-secondary-dark-bg text-center">
                  <p className="mt-2 ml-4 text-start font-bold">
                    Progress Report Log
                  </p>
                  <div className="ml-4 bg-blue-300 h-[0.3125rem] w-10 " />

                  <div className=" m-4">
                    <MaterialReactTable table={tableInitializer} />
                  </div>
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              {/* <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {}}
                >
                  Save
                </button>
              </div>
            </div> */}
              {/* Main Card footer--/-- */}
            </div>
            {/* Main Card--/-- */}
          </div>
        </div>
      ) : (
        <div className=" z-[1000000000001] h-[100vh] w-full bg-gray-800 flex justify-center align-middle">
          <div className=" mt-[21.875rem]">
            <PropagateLoader
              color="#36d7b7"
              loading={loaderSpinner}
              // cssOverride={override}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <div className="mt-10 text-left text-white">
              Please Wait a bit...
            </div>
          </div>
        </div>
      )}

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default TaskReporting;
