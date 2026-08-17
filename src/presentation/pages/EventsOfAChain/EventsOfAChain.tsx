/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  debounce,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ModalPageOpener from '../../components/biz24Components/ModalPageOpener';
import SwitchCustom from '../../components/SwitchCustom';
import { useGetSANextEventByCompanyLocationUserFixedTaskTemplateIdQuery } from '../../../infrastructure/api/SANextEventApiSlice';
import { ISANextEvent } from '../../../domain/interfaces/SANextEventInterface';
import AttachmentLoader from '../../components/AttachmentLoader';
import { useGetFirstPageOfChainByFixedTaskTemplateIdQuery } from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import { checkArrayContents } from '../../Utils/Util';

const jsondummy = [
  {
    fixedTaskTemplateId: 1,
    fixedTaskTemplateName: 'LC',
    biznessEventId: 48,
    biznessEventName: 'LC Entry',
    sequence: 1,
    eventNo: 'PQ-DBZHO-2023-000004',
    biznessEventProcessConfigurationId: 101,
    assignedDate: '23 December, 2023',
    dueDate: '24 December, 2023',
    actionType: 'E',
  },
  // {
  //   fixedTaskTemplateId: 1,
  //   fixedTaskTemplateName: 'LC',
  //   biznessEventId: 49,
  //   biznessEventName: 'LC Approval',
  //   sequence: 2,
  //   eventNo: 'PQ-DBZHO-2023-000004',
  //   biznessEventProcessConfigurationId: 202,
  //   assignedDate: '23 December, 2023',
  //   dueDate: '28 December, 2023',
  //   actionType: 'A',
  // },
  // {
  //   fixedTaskTemplateId: 1,
  //   fixedTaskTemplateName: 'LC',
  //   biznessEventId: 50,
  //   biznessEventName: 'LC Post',
  //   sequence: 3,
  //   eventNo: 'PQ-DBZHO-2023-000004',
  //   biznessEventProcessConfigurationId: 303,
  //   assignedDate: '23 December, 2023',
  //   dueDate: '31 December, 2023',
  //   actionType: 'P',
  // },
  // {
  //   fixedTaskTemplateId: 1,
  //   fixedTaskTemplateName: 'LC',
  //   biznessEventId: 48,
  //   biznessEventName: 'LC Entry',
  //   sequence: 1,
  //   eventNo: 'PQ-DBZHO-2023-000005',
  //   biznessEventProcessConfigurationId: 101,
  //   assignedDate: '23 December, 2023',
  //   dueDate: '24 December, 2023',
  //   actionType: 'E',
  // },
  // {
  //   fixedTaskTemplateId: 1,
  //   fixedTaskTemplateName: 'LC',
  //   biznessEventId: 49,
  //   biznessEventName: 'LC Approval',
  //   sequence: 2,
  //   eventNo: 'PQ-DBZHO-2023-000005',
  //   biznessEventProcessConfigurationId: 202,
  //   assignedDate: '23 December, 2023',
  //   dueDate: '28 December, 2023',
  //   actionType: 'A',
  // },
  // {
  //   fixedTaskTemplateId: 1,
  //   fixedTaskTemplateName: 'LC',
  //   biznessEventId: 50,
  //   biznessEventName: 'LC Post',
  //   sequence: 3,
  //   eventNo: 'PQ-DBZHO-2023-000005',
  //   biznessEventProcessConfigurationId: 303,
  //   assignedDate: '23 December, 2023',
  //   dueDate: '31 December, 2023',
  //   actionType: 'P',
  // },
];

type Props = { fixedTaskTemplateId: number; fixedTaskTemplateName: string };

const EventsOfAChain = ({
  fixedTaskTemplateId,
  fixedTaskTemplateName,
}: Props) => {
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

  // ekhane ajax/rtkquery call hobe, props theke kono id ashbe, then oi id dhore oitar events ante hobe, oi events gula mapped hoye card card hobe

  // then ei page e modal thakbe full screen,,,, then oi modal e if else diye(ternary operator) diye condition wise page-component load hobe....

  const [modalOpen, setModalOpen] = useState(false);
  const [clickedCardInfo, setClickedCardInfo] = useState<ISANextEvent>();
  // const userInfo = {
  //   securityUserId: 1,
  //   userName: 'DATABIZ',
  //   email: null,
  //   password: 'DATABIZ33305',
  //   rememberMe: false,
  //   companyId: 1,
  //   locationId: 1,
  //   screenWidth: window.innerWidth,
  // };

  // productGroup autocomp options
  const {
    data: firstPageOfChainData,
    isLoading: firstPageOfChainLoading,
    error: firstPageOfChainError,
    isSuccess: firstPageOfChainIsSuccess,
    isError: firstPageOfChainIsError,
    isFetching: firstPageOfChainIsFetching,
    refetch: firstPageOfChainRefetch,
  } = useGetFirstPageOfChainByFixedTaskTemplateIdQuery({
    fixedTaskTemplateId,
  });

  useEffect(() => {
    if (firstPageOfChainIsError) {
      toast.error(
        'Something wrong from backend while fetching firstPageOfChainData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching firstPageOfChainData, see console--->:'
      );
      console.log(firstPageOfChainError);
    }
  }, [firstPageOfChainLoading, firstPageOfChainIsError, firstPageOfChainError]);

  useEffect(() => {
    firstPageOfChainRefetch();
  }, [fixedTaskTemplateId]);

  const [saNextEventDataCopy, setSaNextEventDataCopy] = useState<
    ISANextEvent[] | null
  >(null);
  const {
    data: SANextEventData, // jsondummy
    isLoading: SANextEventLoading,
    error: SANextEventGetError,
    isFetching: SANextEventIsFetching,
    refetch: SANextEventRefetch,
  } = useGetSANextEventByCompanyLocationUserFixedTaskTemplateIdQuery({
    userId: userInfo.securityUserId,
    companyId: userInfo.companyId,
    locationId: userInfo.locationId,
    fixedTaskTemplateId,
  });
  console.log('FixedtaskTemplateId');
  console.log(fixedTaskTemplateId);
  console.log('SANextEventData yeaah I overcame !!!!!!!!!!!');
  console.log(SANextEventData);
  console.log('SANextEventLoading');
  console.log(SANextEventLoading);
  console.log('SANextEventGetError');
  console.log(SANextEventGetError);

  useEffect(() => {
    if (!SANextEventLoading && !SANextEventGetError) {
      const tempNextEventData = JSON.parse(JSON.stringify(SANextEventData));
      setSaNextEventDataCopy(tempNextEventData);
    } else if (SANextEventGetError) {
      setSaNextEventDataCopy([]);
    }
  }, [SANextEventLoading, SANextEventGetError, SANextEventData]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    SANextEventRefetch();
  };

  const rupom = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('Switch changed:', event.target.checked);
  };

  // useEffect(() => {
  //   const data2 = {
  //     UserName: 'DATABIZ',
  //     Email: null,
  //     Password: 'DATABIZ33305',
  //     RememberMe: false,
  //     CompanyId: 1,
  //     LocationId: 1,
  //     ScreenWidth: 1707,
  //   };
  //   axios
  //     .post(`${BR2_URL}/Account/LogOnRupom`, data2)
  //     .then((res) => {
  //       if (res) {
  //         console.log(res);
  //       }
  //     });
  // }, []);

  const handleClickCard = (item: ISANextEvent) => {
    setClickedCardInfo(item);
    setModalOpen(true);
  };
  const openChainFirstEvent = () => {
    const firstSequenceObj: ISANextEvent = {
      fixedTaskTemplateId,
      fixedTaskTemplateName,
      biznessEventId: firstPageOfChainData?.biznessEventId || 0,
      biznessEventName: firstPageOfChainData?.biznessEventName || '',
      controllerPath: firstPageOfChainData?.controllerPath
        ? firstPageOfChainData?.controllerPath.split('#')[1]
        : '',
      controllerPathType: firstPageOfChainData?.controllerPath
        ? firstPageOfChainData?.controllerPath.split('#')[0]
        : '',
      sequence: 1,
      eventNo: '',
      biznessEventProcessConfigurationId:
        firstPageOfChainData?.biznessEventProcessConfigurationId || 0,
      assignedDate: '',
      dueDate: '',
      actionType: firstPageOfChainData?.actionType || '',
      firstEventNo: '',
      firstEventPerformedBy: '',
      biznessEventFrequency: 0,
      eventLocationName: '',
      eventLocationId: 0,
      extendedBiznessEventName:
        firstPageOfChainData?.extendedBiznessEventName || [],
    };

    setClickedCardInfo(firstSequenceObj);
    setModalOpen(true);
  };

  // ---- searching functionality for all cards------
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const actionTypeLabel = (t?: string) =>
    t === 'A'
      ? 'Approval'
      : t === 'E'
        ? 'Entry'
        : t === 'P'
          ? 'Posting'
          : t === 'R'
            ? 'Report'
            : '';

  /** Build searchable text exactly from what your card shows */
  const buildSearchableText = (item: ISANextEvent) => {
    const extended = (item.extendedBiznessEventName || []).join(' ');
    return [
      // header row bits
      actionTypeLabel(item.actionType),
      item.firstEventNo,
      item.firstEventPerformedBy,

      // title line
      extended || item.biznessEventName,

      // small details
      item.eventNo,
      item.eventLocationName,
      item.fixedTaskTemplateName,
      String(item.sequence),

      // dates (as shown strings)
      item.assignedDate,
      item.dueDate,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  };

  /** Split on spaces; require all tokens to be present */
  const filteredItems = React.useMemo(() => {
    const src = saNextEventDataCopy ?? [];
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return src;
    return src.filter((it) => {
      const hay = buildSearchableText(it);
      return tokens.every((tok) => hay.includes(tok));
    });
  }, [saNextEventDataCopy, search]);

  // autoFilter if any value is present in "?searchQuery"
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('searchQuery');
    if (query) {
      setSearch(query);
    }
  }, [location.search]);

  // ---- searching functionality for all cards---ENDS---

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-11/12 ">
          {/* Main Card */}
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
            {/* Main Card header */}
            <div className="py-3 bg-white dark:bg-secondary-dark-bg   px-6 border-b border-gray-300 flex justify-between">
              <p className="text-xl dark:text-gray-200 text-start">
                Events Of {fixedTaskTemplateName} Chain
              </p>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block px-4 py-1.5 bg-half-transparent text-white font-medium text-xs leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-700 ease-in-out"
                onClick={() => {
                  openChainFirstEvent();
                }}
              >
                <i className="fas fa-plus-circle" /> Entry New{' '}
                {checkArrayContents(
                  firstPageOfChainData?.extendedBiznessEventName,
                  firstPageOfChainData?.biznessEventName
                )}{' '}
                {/* {firstPageOfChainData?.biznessEventName || ''} */}
              </button>
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start grid grid-cols-4 gap-4 mt-2">
              <div className="col-span-4">
                <form className="">
                  <div className="w-full grid-cols-1 grid gap-x-2 gap-y-1">
                    {!SANextEventLoading && !SANextEventIsFetching ? (
                      <div className="mb-5 mt-5 flex justify-center">
                        <div className="w-[97%] min-h-[70vh]">
                          <SwitchCustom onChange={rupom} className="mb-5" />

                          {/* card of task starts----- */}
                          {/* {jsondummy.map((item) => ( */}

                          {/* 🔍 Search Input */}
                          <div className="mb-5 ">
                            <TextField
                              label="Search"
                              variant="outlined"
                              size="small"
                              value={search}
                              onChange={handleSearchChange}
                              fullWidth
                              className="mb-4"
                            />
                          </div>

                          {/* CARD VIEW */}
                          {filteredItems?.length ? (
                            filteredItems.map((item) => {
                              let dueMessage = '';
                              let dueIconColorClass = '';

                              const tempDueDate = new Date(item.dueDate);
                              const todaysDate = new Date();
                              let tempDiffDays =
                                (tempDueDate.getTime() - todaysDate.getTime()) /
                                (1000 * 60 * 60 * 24);
                              tempDiffDays =
                                tempDiffDays > 0
                                  ? Math.floor(tempDiffDays)
                                  : Math.ceil(tempDiffDays);

                              if (tempDiffDays === 0) {
                                dueMessage = 'Due Today';
                                dueIconColorClass = 'text-orange-300';
                              } else if (tempDiffDays < 0) {
                                dueMessage = `Overdue for ${Math.abs(
                                  tempDiffDays
                                )}days`;
                                dueIconColorClass = 'text-red-500';
                              } else if (tempDiffDays > 0) {
                                dueMessage = `Due in ${Math.abs(
                                  tempDiffDays
                                )}days`;
                                dueIconColorClass = 'text-green-500';
                              }

                              return (
                                <div
                                  onKeyDown={() => handleClickCard(item)}
                                  key={uuid()}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => {
                                    handleClickCard(item);
                                  }}
                                  className="w-full p-[15px] mb-[20px] bg-gray-100 border border-zinc-200 rounded-xl transform-all duration-700 hover:scale-105 dark:bg-gray-900 dark:border-zinc-900 dark:hover:text-black  hover:ring-1 hover:ring-slate-300 "
                                >
                                  <div className="h-[50%]">
                                    <div className="flex justify-between items-center text-xs text-stone-400 mb-3">
                                      <p>
                                        <i
                                          style={{
                                            paddingRight: '5px',
                                          }}
                                          className="fas fa-check-circle text-green-700"
                                        />{' '}
                                        {item.actionType === 'A'
                                          ? 'Approval'
                                          : item.actionType === 'E'
                                            ? 'Entry'
                                            : item.actionType === 'P'
                                              ? 'Posting'
                                              : item.actionType === 'R'
                                                ? 'Report'
                                                : ''}
                                      </p>
                                      <p className=" text-[12px] text-gray-600">
                                        Ref No.:{' '}
                                        <span className=" text-gray-700 font-bold">
                                          {`${item.firstEventNo}`}
                                        </span>
                                        {'  ('}
                                        By:{' '}
                                        <span className=" text-gray-700 font-bold">
                                          {`${
                                            item.firstEventPerformedBy ||
                                            'unknown'
                                          })`}
                                        </span>
                                      </p>
                                      <p>
                                        <i
                                          className={`fas fa-circle ${dueIconColorClass}`}
                                          style={{
                                            paddingRight: '5px',
                                          }}
                                        />{' '}
                                        {dueMessage}
                                      </p>
                                    </div>
                                    <div className="mb-4">
                                      <p className=" dark:text-white text-[18px]">
                                        Complete the{' '}
                                        {checkArrayContents(
                                          item.extendedBiznessEventName,
                                          item.biznessEventName
                                        )}
                                        {item.biznessEventFrequency
                                          ? ` (${item.biznessEventFrequency}) `
                                          : ''}
                                        {/* ? item.biznessEventFrequency
                                        : ''} */}
                                        !
                                      </p>
                                      <p className=" text-[12px] text-gray-600">
                                        Event No.:{' '}
                                        <span className=" text-blue-700 font-bold">
                                          {`${item.eventNo}(${item.eventLocationName})`}
                                        </span>
                                      </p>
                                      {/* <p className=" text-[12px] text-gray-600">
                                      Ref No.:{' '}
                                      <span className=" text-gray-700 font-bold">
                                        {`${item.firstEventNo}`}
                                      </span>
                                    </p> */}
                                    </div>
                                    <div className="">
                                      <span className="bg-slate-500 border border-slate-700 mr-2 text-white text-xs px-1 rounded-[5px] w-fit">
                                        {item.fixedTaskTemplateName}
                                      </span>
                                      <span className="bg-slate-500 border border-slate-700 text-white text-xs px-1 rounded-[5px] w-fit">
                                        Sequence: {item.sequence}
                                      </span>
                                    </div>
                                    <div className="md:flex block items-center justify-between text-xs text-gray-500 mt-4">
                                      <p className="">
                                        <span className="w-[5px]">
                                          Assigned:
                                        </span>{' '}
                                        <i className="fas fa-calendar-alt" />{' '}
                                        {item.assignedDate}
                                      </p>
                                      <div className="">
                                        <div className="w-[20px] inline">
                                          Due:
                                        </div>{' '}
                                        <i className="fas fa-calendar-alt" />{' '}
                                        {item.dueDate}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center text-sm text-gray-500 mt-6">
                              No matching events found.
                            </div>
                          )}
                        </div>

                        <div>
                          {/* <Button variant="contained" onClick={handleOpenModal}>
                          Open Modal
                        </Button> */}
                          <ModalPageOpener
                            open={modalOpen}
                            onClose={handleCloseModal}
                            clickedCardInfo={clickedCardInfo as ISANextEvent}
                          />
                        </div>

                        {/* <div className="m-3 mb-3 mt-1">
                          <AttachmentLoader
                            attachments={attachments}
                            setAttachments={setAttachments}
                            deletedRegedAttach={deletedRegedAttach}
                            setDeletedRegedAttach={setDeletedRegedAttach}
                            imgPerSlide={3}
                          />
                        </div> */}

                        {/* <MaterialReactTable table={tableInitializer} /> */}
                      </div>
                    ) : (
                      <div>LOADING........</div>
                    )}
                  </div>
                </form>
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

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default EventsOfAChain;
