/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
// src/components/ModalPageOpener.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Box, IconButton, Button, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Search } from '@mui/icons-material';

//
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import avatar from '../../../../public/images/avatar.jpg';
import avatar2 from '../../../../public/images/avatar2.jpg';
import avatar3 from '../../../../public/images/avatar3.png';
import avatar4 from '../../../../public/images/avatar4.jpg';
import avatarColored3 from '../../assets/data/AvatarColored3.png';
import avatarColored2 from '../../assets/data/AvatarColored2.png';

import { ISANextEvent } from '../../../domain/interfaces/SANextEventInterface';
import { IUserInfo } from '../../../domain/interfaces/UserInfoInterface';

import TaskReporting from '../../pages/TaskReporting/TaskReporting';
import ComponentMissing from '../../pages/Status/ComponentMissing/ComponentMissing';
import { useGetBiznessEventPCTrackVMForJobHistoryByFirstEventNoQuery } from '../../../infrastructure/api/BiznessEventPCTrackVMForJobHistoryApiSlice';
import TransactionEventVoucher from '../../pages/TransactionEventVoucher/TransactionEventVoucher';
// import TenderRequisiton from '../../pages/TenderRequisition/TenderRequisiton';
import { checkArrayContents } from '../../Utils/Util';
import { useGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery } from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import TenderWon from '../../pages/TenderWon/TenderWon';
import PurchaseComparativeSheet from '../../pages/PurchaseComparativeSheet/PurchaseComparativeSheet';
import LPurchaseInAdditionalCost from '../../pages/LPurchaseInAdditionalCost/LPurchaseInAdditionalCost';
import SalesOrderAdditionalCost from '../../pages/SalesAdditionalCost/SalesOrderAdditionalCost';
import componentMap from '../../Utils/DynamicPageDeclaration';

// import TransactionLCVoucher from '../../pages/TransactionLCVoucher/TransactionLCVoucher';
const BR2_URL = window.BR2_URL;
const API_BASE_URL = window.API_BASE_URL;

interface ModalPageOpenerProps {
  open: boolean;
  onClose: () => void;
  clickedCardInfo: ISANextEvent;
}

interface HistoryComponentProps {
  clickedCardInfo: ISANextEvent;
  setPreviewEditModalOpen: any;
  setCurrentPreviewSequence: any;
  currentOperationMode: any;
  setCurrentOperationMode: any;
}

// ------------NB: This code has been transfered to Utils/DynamicPageDeclaration------------

// dynamic component rendering
// const componentMap: { [key: string]: React.ComponentType<any> } = {
//   // PurchaseOrder: TaskReporting,

//   // R: TaskReporting,
//   // CommArrangesPriceQuotation: TaskReporting,
//   // MatchPriceQuotation: TaskReporting,
//   // ProcurementTenderTaskReporting1: TaskReporting,
//   // ProcurementTenderTaskReporting2: TaskReporting,
//   // // LCVoucher: TransactionLCVoucher,
//   // ProcurementTender: TenderRequisiton,
//   // LCVoucher: TransactionEventVoucher,
//   // TenderVoucher: TransactionEventVoucher,

//   TaskReporting,
//   TenderRequisiton,
//   TransactionEventVoucher,
//   TenderWon,
//   PurchaseComparativeSheet,
//   SalesOrderAdditionalCost,
//   LPurchaseInAdditionalCost,
//   // Add more components as needed
// };

const HistoryComponent = ({
  clickedCardInfo,
  setPreviewEditModalOpen,
  setCurrentPreviewSequence,
  currentOperationMode,
  setCurrentOperationMode,
}: HistoryComponentProps) => {
  const {
    data: eventHistoryData, // jsondummy
    isLoading: eventHistoryLoading,
    error: eventHistoryGetError,
    refetch: eventHistoryRefetch,
  } = useGetBiznessEventPCTrackVMForJobHistoryByFirstEventNoQuery(
    {
      firstEventNo: clickedCardInfo.firstEventNo,
    }, // this overrules the api definition setting,
    // forcing the query to always fetch when this component is mounted
    { refetchOnMountOrArgChange: true }
  );

  const previewThePage = (previewSequence: number) => {
    setCurrentOperationMode('preview');
    setPreviewEditModalOpen(true);
    setCurrentPreviewSequence(previewSequence);
  };

  const editThePage = (editSequence: number) => {
    setCurrentOperationMode('edit');
    setPreviewEditModalOpen(true);
    setCurrentPreviewSequence(editSequence);
  };

  return (
    <div className="px-3 mt-5">
      <p className="mb-3">Job History</p>
      {eventHistoryData?.map((item) => (
        <div
          key={uuid()}
          className="grid grid-cols-9 transform-all duration-700 gap-3 border-b-1 border-color p-3 leading-8 cursor-pointer"
          // onClick={() => {
          //   previewThePage(item.originalSequence);
          // }}
        >
          <div className=" mt-1 h-full col-span-1">
            <img
              className="rounded-full h-[35px] bg-gray-500"
              src={
                item.performedByImage ? item.performedByImage : avatarColored3
              }
              alt={item.performedByName}
            />
            <span
              // style={{ background: item.dotColor }}
              className="absolute inline-flex rounded-full h-2 w-2 right-0 -top-1"
            />
          </div>
          <div className="col-span-7">
            <p className="font-semibold dark:text-gray-200 text-sm">
              {checkArrayContents(
                item.extendedBiznessEventName,
                item.biznessEventName
              )}{' '}
              {item.biznessEventFrequency
                ? `(${item.biznessEventFrequency})`
                : ''}{' '}
              of the event no.:{' '}
              <span className=" text-blue-900 text-sm text-opacity-80">
                {item.eventNo}
              </span>{' '}
              {item.note === 'Edited' || item.note === 'edited'
                ? '(Edited)'
                : '(Completed)'}{' '}
            </p>

            <p className="bg-slate-300 border text-gray-500 text-xs py-[2px] px-[4px] rounded-[5px] w-fit">
              Sequence: <b>{item.originalSequence}</b>
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Done by <b>{item.performedByName}</b>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {item.endDate}
            </p>
            {/* <div
              className="text-gray-500 dark:text-gray-400 text-xs"
              onClick={() => {
                previewThePage(item.originalSequence);
              }}
            >
              Preview
            </div>
            <div
              className="text-gray-500 dark:text-gray-400 text-xs"
              onClick={() => {
                editThePage(item.originalSequence);
              }}
            >
              Edit
            </div> */}
          </div>
          <div className="col-span-1 flex">
            <div
              className="text-gray-500 dark:text-gray-400 text-sm px-2 "
              onClick={() => {
                previewThePage(item.originalSequence);
              }}
            >
              <i className="fas fa-eye duration-700 hover:scale-110 hover:text-blue-600" />
            </div>
            <div
              className="text-gray-500 dark:text-gray-400 text-sm px-1"
              onClick={() => {
                editThePage(item.originalSequence);
              }}
            >
              <i className="fas fa-edit duration-700 hover:scale-110 hover:text-blue-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface HistoryModalProps {
  historyModalOpen: boolean;
  setHistoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clickedCardInfo: ISANextEvent;
  setPreviewEditModalOpen: any;
  setCurrentPreviewSequence: any;
  currentOperationMode: any;
  setCurrentOperationMode: any;
}
const HistoryModal = ({
  historyModalOpen,
  setHistoryModalOpen,
  clickedCardInfo,
  setPreviewEditModalOpen,
  setCurrentPreviewSequence,
  currentOperationMode,
  setCurrentOperationMode,
}: HistoryModalProps) => {
  const handleHistoryModalOpen = () => {
    setHistoryModalOpen(true);
  };
  const handleHistoryModalClose = () => {
    setHistoryModalOpen(false);
  };

  return (
    <Modal
      open={historyModalOpen}
      onClose={handleHistoryModalClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
        // transition: 'transform 0.9s ease-in',
        // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw', // Set the width of the modal to full screen
          height: '80vh', // Set the height of the modal to full screen
          marginTop: '20vh',
          backgroundColor: 'white',
          overflow: 'scroll',
          borderRadius: '20px 20px 0 0',
          // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
          // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
        }}
      >
        <HistoryComponent
          clickedCardInfo={clickedCardInfo}
          // previewEditModalOpen={previewEditModalOpen}
          setPreviewEditModalOpen={setPreviewEditModalOpen}
          setCurrentPreviewSequence={setCurrentPreviewSequence}
          currentOperationMode={currentOperationMode}
          setCurrentOperationMode={setCurrentOperationMode}
        />

        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={handleHistoryModalClose}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: 'gray',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

const PreviewEditModal = ({
  previewEditModalOpen,
  setPreviewEditModalOpen,
  onClose,
  clickedCardInfo,
  sequence,
  userInfo,
  userInfoBr2,
  operationMode,
}: any) => {
  console.log('Preview modal theke clickedCardInfo te ki ki ashe check!!');
  console.log(clickedCardInfo);

  // toast.info(`Sequence: ${sequence}`);

  const {
    data: previewPageData, // jsondummy
    isLoading: previewPageDataLoading,
    error: previewPageError,
    isError: previewPageIsError,
    isFetching: previewPageIsFetching,
    isSuccess: previewPageIsSuccess,
    refetch: previewPageRefetch,
  } = useGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery(
    {
      fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
      sequence,
      firstEventNo: clickedCardInfo?.firstEventNo,
    }, // this overrules the api definition setting,
    // forcing the query to always fetch when this component is mounted
    { skip: !sequence || !clickedCardInfo?.firstEventNo }
  );

  useEffect(() => {
    if (previewPageIsError) {
      toast.error(
        'Something wrong from backend while fetching previewPageData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching previewPageData, see console--->:'
      );
      console.log(previewPageError);
    }

    if (
      previewPageIsSuccess &&
      !previewPageIsError &&
      !previewPageIsFetching &&
      !previewPageDataLoading &&
      previewPageData
    ) {
      console.log('....ekhane previewPageData ta dekho....');
      console.log(previewPageData);
    }
  }, [
    previewPageDataLoading,
    previewPageIsError,
    previewPageError,
    previewPageData,
    previewPageIsSuccess,
    previewPageIsFetching,
  ]);

  const handlePreviewModalOpen = () => {
    setPreviewEditModalOpen(true);
  };
  const handlePreviewModalClose = () => {
    setPreviewEditModalOpen(false);
  };
  let controllerPath;
  // console.log('Hey rupom, on click card, Here is the info of the card!!!!!!!!');
  // console.log(clickedCardInfo);

  // Check if the inputString contains "?"
  if (
    previewPageData?.controllerPathType === 'url' &&
    previewPageData?.controllerPath?.includes('?')
  ) {
    // If it contains "?", split the string into controllerPath and param
    const parts = previewPageData?.controllerPath?.split('?');
    controllerPath = `${BR2_URL}${parts[0]}?${parts[1]}&eventno=${previewPageData.eventNo}&userName=${userInfoBr2.userName}&password=${userInfoBr2.password}&loginCompanyId=${userInfoBr2.companyId}&loginLocationId=${userInfoBr2.locationId}&biznessEventName=${previewPageData.biznessEventName}&fixedTaskTemplateName=${clickedCardInfo?.fixedTaskTemplateName}&sequence=${previewPageData.sequence}&firstEventNo=${previewPageData?.firstEventNo}&operationMode=${operationMode}`;
  } else if (
    previewPageData?.controllerPathType === 'url' &&
    !previewPageData?.controllerPath?.includes('?')
  ) {
    // If it does not contain "?", set controllerPath and param accordingly
    controllerPath = `${BR2_URL}${previewPageData?.controllerPath}?eventno=${previewPageData?.eventNo}&userName=${userInfoBr2.userName}&password=${userInfoBr2.password}&loginCompanyId=${userInfoBr2.companyId}&loginLocationId=${userInfoBr2.locationId}&biznessEventName=${previewPageData?.biznessEventName}&fixedTaskTemplateName=${clickedCardInfo?.fixedTaskTemplateName}&sequence=${previewPageData?.sequence}&firstEventNo=${previewPageData?.firstEventNo}&operationMode=${operationMode}`;
  }

  console.log('Page Preview biznessEventName');
  console.log(previewPageData?.biznessEventName);
  // const DynamicComponent = componentMap[previewPageData?.biznessEventName || '']
  //   ? componentMap[previewPageData?.biznessEventName || '']
  //   : ComponentMissing;
  const DynamicComponent =
    previewPageData?.controllerPathType === 'component' &&
    componentMap[previewPageData?.controllerPath || '']
      ? componentMap[previewPageData?.controllerPath || '']
      : ComponentMissing;
  return (
    <Modal
      open={previewEditModalOpen}
      onClose={handlePreviewModalClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // zIndex: 10001,
        // transition: 'transform 0.9s ease-in',
        // transform: PreviewModalOpen ? 'translateY(0)' : 'translateY(100%)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '95vw', // Set the width of the modal to full screen
          height: '95vh', // Set the height of the modal to full screen
          backgroundColor: 'white',
          overflow: 'hidden',
          '@media (max-width:600px)': {
            top: '70px',
          },
          // borderRadius: '20px 20px 20px 20px',
          // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
          // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
        }}
      >
        {/* Preview Last Action */}
        <Button
          className=""
          sx={{
            width: '100%', // Adjust the width as needed
            backgroundColor: '#383838',
            padding: '10px',
            transition: 'background-color 700ms ease', // Transition for background color
            '&:hover': {
              backgroundColor: '#383838', // Background color on hover
            },
          }}
          variant="text"
          onClick={() => {
            // setPreviewEditModalOpen(true);
          }}
          // style={{ borderRight: '1px solid white' }}
        >
          <i className="fas fa-eye text-[20px] mr-2 text-white" />
          <span className="text-white text-[10px]">Previewing task</span>
        </Button>
        {previewPageData?.controllerPathType === 'url' ? (
          <iframe
            title="My iframe"
            // src="https://br3-retails-startech.netlify.app/"
            // src="http://103.147.56.140:11117/ProcurementRequisition/Index"
            src={controllerPath}
            width="100%"
            height="100%"
            frameBorder="0"
          />
        ) : (
          <div className="h-full overflow-scroll m-0 p-0">
            <DynamicComponent
              modalPageOpenerClose={onClose}
              clickedCardInfo={previewPageData}
              operationMode={operationMode}
            />
          </div>
        )}
        <IconButton
          aria-label="close"
          onClick={handlePreviewModalClose}
          sx={{
            position: 'absolute',
            top: '1px',
            right: '8px',
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

const ModalPageOpener: React.FC<ModalPageOpenerProps> = ({
  open,
  onClose,
  clickedCardInfo,
}) => {
  const navigate = useNavigate();
  let userInfo;
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

  const userInfoBr2: IUserInfo = {
    securityUserId: userInfo?.securityUserId || 0,
    userName: userInfo?.userName || '',
    email: userInfo?.email || '',
    password: userInfo?.password,
    rememberMe: false,
    companyId: userInfo?.companyId || 0,
    locationId: userInfo?.locationId || 0,
    screenWidth: window.innerWidth,
  };

  const isMobile = window.innerWidth < 768;

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [previewEditModalOpen, setPreviewEditModalOpen] = useState(false);
  const [currentOperationMode, setCurrentOperationMode] = useState('preview');
  const [historyPanelOpen, setHistoryPanelOpen] = useState(true);
  const [currentPreviewSequence, setCurrentPreviewSequence] = useState(
    clickedCardInfo?.sequence || 0
  );

  let controllerPath;
  console.log('Hey rupom, on click card, Here is the info of the card!!!!!!!!');
  console.log(clickedCardInfo);

  // Check if the inputString contains "?"
  if (
    clickedCardInfo?.controllerPathType === 'url' &&
    clickedCardInfo?.controllerPath?.includes('?')
  ) {
    // If it contains "?", split the string into controllerPath and param
    const parts = clickedCardInfo?.controllerPath?.split('?');
    controllerPath = `${BR2_URL}${parts[0]}?${parts[1]}&eventno=${clickedCardInfo.eventNo}&userName=${userInfoBr2.userName}&password=${userInfoBr2.password}&loginCompanyId=${userInfoBr2.companyId}&loginLocationId=${userInfoBr2.locationId}&biznessEventName=${clickedCardInfo.biznessEventName}&fixedTaskTemplateName=${clickedCardInfo.fixedTaskTemplateName}&sequence=${clickedCardInfo.sequence}&firstEventNo=${clickedCardInfo?.firstEventNo}&apiBaseUrl=${API_BASE_URL}&br24FnBaseUrl=${window.location.origin}`;
  } else if (
    clickedCardInfo?.controllerPathType === 'url' &&
    !clickedCardInfo?.controllerPath?.includes('?')
  ) {
    // If it does not contain "?", set controllerPath and param accordingly
    controllerPath = `${BR2_URL}${clickedCardInfo?.controllerPath}?eventno=${clickedCardInfo?.eventNo}&userName=${userInfoBr2.userName}&password=${userInfoBr2.password}&loginCompanyId=${userInfoBr2.companyId}&loginLocationId=${userInfoBr2.locationId}&biznessEventName=${clickedCardInfo?.biznessEventName}&fixedTaskTemplateName=${clickedCardInfo?.fixedTaskTemplateName}&sequence=${clickedCardInfo?.sequence}&firstEventNo=${clickedCardInfo?.firstEventNo}&apiBaseUrl=${API_BASE_URL}&br24FnBaseUrl=${window.location.origin}`;
  }

  const iframeLinkSq1Static = `${BR2_URL}/ProcurementRequisition/index?eventno=${clickedCardInfo?.eventNo}&userName=${userInfoBr2.userName}&password=${userInfoBr2.password}&loginCompanyId=${userInfoBr2.companyId}&loginLocationId=${userInfoBr2.locationId}&biznessEventName=${clickedCardInfo?.biznessEventName}&fixedTaskTemplateName=${clickedCardInfo?.fixedTaskTemplateName}&sequence=${clickedCardInfo?.sequence}`;

  console.log('controllerPath');
  console.log(controllerPath);

  // const DynamicComponent = componentMap[clickedCardInfo?.biznessEventName]
  //   ? componentMap[clickedCardInfo?.biznessEventName]
  //   : ComponentMissing;

  const DynamicComponent =
    clickedCardInfo?.controllerPathType === 'component' &&
    componentMap[clickedCardInfo?.controllerPath || '']
      ? componentMap[clickedCardInfo?.controllerPath || '']
      : ComponentMissing;
  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // zIndex: 10000, //z-index commented by rupom karon transaction LC voucher page e table er column action button er popup menu ashtesilona
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw', // Set the width of the modal to full screen
          height: '100vh', // Set the height of the modal to full screen
          backgroundColor: 'red',
          overflow: 'hidden',
          '@media (max-width:600px)': {
            top: '70px',
          },
        }}
        className="modalPageOpener"
      >
        <div className="m-0 md:flex bg-slate-600 h-full">
          {/* <div className=`bg-gray-800 h-[95%] w-full md:h-full {} md:w-[75%]`> */}
          <div
            className={`bg-white w-full h-full transition-all duration-200 ease-out
                        ${
                          clickedCardInfo?.sequence === 1
                            ? ''
                            : historyPanelOpen
                              ? 'md:w-[75%]'
                              : 'md:w-[99.5%]'
                        }`}
          >
            {/* Content for the 80% height div */}
            {/* width 75% or mobile90% */}
            {clickedCardInfo?.controllerPathType === 'url' ? (
              <iframe
                title="My iframe"
                // src="https://br3-retails-startech.netlify.app/"
                // src="http://103.147.56.140:11117/ProcurementRequisition/Index"
                src={controllerPath}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            ) : (
              <div className="h-full overflow-scroll m-0 p-0">
                <DynamicComponent
                  modalPageOpenerClose={onClose}
                  clickedCardInfo={clickedCardInfo}
                />
              </div>
            )}
          </div>
          {/* {clickedCardInfo.sequence!==1?():("")} */}

          {/* button to hide/show  */}

          {!isMobile && clickedCardInfo?.sequence !== 1 ? (
            <button
              type="button"
              aria-label="hide"
              className="md:w-[12px] bg-gray-200 hover:shadow-2xl shadow-blue-800 transition-all transform-all duration-700 ease-in-out"
              onClick={() => {
                setHistoryPanelOpen((prev) => !prev);
              }}
            >
              {historyPanelOpen ? (
                <i className="fas fa-caret-right fa-lg" />
              ) : (
                <i className="fas fa-caret-left fa-lg" />
              )}

              {/* <i class="far fa-caret-right"></i> */}
            </button>
          ) : (
            ''
          )}

          {!isMobile && clickedCardInfo?.sequence !== 1 ? (
            <div
              className={`bg-gray-200 md:h-full overflow-scroll ${
                historyPanelOpen ? 'md:w-[25%]' : 'hidden'
              }`}
            >
              {/* Content for the 20% height div */}
              <HistoryComponent
                clickedCardInfo={clickedCardInfo}
                setPreviewEditModalOpen={setPreviewEditModalOpen}
                setCurrentPreviewSequence={setCurrentPreviewSequence}
                currentOperationMode={currentOperationMode}
                setCurrentOperationMode={setCurrentOperationMode}
              />
            </div>
          ) : isMobile && clickedCardInfo?.sequence !== 1 ? (
            <div className="fixed border-t-1 bottom-0 left-0 w-full bg-half-transparent backdrop-blur h-[5%] flex">
              {/* Content for the 20% height div */}
              <Button
                className=" w-1/2"
                sx={{
                  width: '50%', // Adjust the width as needed
                  transition: 'background-color 700ms ease', // Transition for background color
                  '&:hover': {
                    backgroundColor: 'black', // Background color on hover
                  },
                }}
                variant="text"
                onClick={() => {
                  setPreviewEditModalOpen(true);
                }}
                // style={{ borderRight: '1px solid white' }}
              >
                <i className="fas fa-eye text-[20px] mr-2 text-white" />
                <span className="text-white text-[10px]">Preview</span>
              </Button>
              <Button
                className=" w-1/2"
                sx={{
                  width: '50%', // Adjust the width as needed
                  transition: 'background-color 700ms ease', // Transition for background color
                  '&:hover, &:focus': {
                    backgroundColor: 'black', // Background color on hover
                  },
                }}
                variant="text"
                onClick={() => {
                  setHistoryModalOpen(true);
                }}
              >
                <i className="fas fa-history text-[20px] mr-2 text-white" />
                <span className="text-white text-[10px]">History</span>
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>

        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={() => onClose()}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            // color: 'gray',
            // backgroundColor: 'rgba(255, 255, 255, 0.8)',

            color: 'white', // Adjust text color as needed
            backgroundColor: 'rgba(30, 30, 30, 0.6)', // Dark color with transparency
            '&:hover': {
              backgroundColor: 'rgba(30, 30, 30, 0.8)',
            },

            backdropFilter: 'blur(8px) brightness(1.2)',
            // '@media (max-width:600px)': {
            //   top: '70px',
            //   right: '10px',
            // },
          }}
        >
          <CloseIcon />
        </IconButton>
        {clickedCardInfo?.sequence !== 1 ? (
          <Button
            aria-label="close"
            onClick={() => {
              setCurrentOperationMode('preview');
              setCurrentPreviewSequence(
                clickedCardInfo?.sequence ? clickedCardInfo.sequence - 1 : 1
              );
              setPreviewEditModalOpen(true);
            }}
            sx={{
              position: 'absolute',
              top: '1px',
              left: '40%',
              transform: 'translateX(-40%)',
              color: 'gray',
              fontSize: '13px',
              '@media (max-width: 767px)': {
                display: 'none',
              },
              transition: 'background-color 700ms ease', // Transition for background color
              backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background color
              backdropFilter: 'blur(2px)', // Backdrop blur effect
              border: '1px solid gray', // Border
              borderRadius: '0 0 15px 15px', // Border radius excluding the top portion
              '&:hover, &:focus': {
                backgroundColor: 'rgba(128, 128, 128, 0.2)', // Semi-transparent background color on hover/focus
              },
            }}
          >
            <i className="fas fa-eye text-[20px] mr-2 text-slate-950 dark:text-black" />
            <span className=" text-[10px] text-slate-950 dark:text-black">
              Preview
            </span>
          </Button>
        ) : (
          ''
        )}

        <HistoryModal
          historyModalOpen={historyModalOpen}
          setHistoryModalOpen={setHistoryModalOpen}
          clickedCardInfo={clickedCardInfo}
          setPreviewEditModalOpen={setPreviewEditModalOpen}
          setCurrentPreviewSequence={setCurrentPreviewSequence}
          currentOperationMode={currentOperationMode}
          setCurrentOperationMode={setCurrentOperationMode}
        />
        <PreviewEditModal
          previewEditModalOpen={previewEditModalOpen}
          setPreviewEditModalOpen={setPreviewEditModalOpen}
          onClose={onClose}
          sequence={currentPreviewSequence}
          clickedCardInfo={clickedCardInfo}
          userInfo={userInfo}
          userInfoBr2={userInfoBr2}
          operationMode={currentOperationMode}
        />
      </Box>
    </Modal>
  );
};

export default ModalPageOpener;
