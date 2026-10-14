/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './ReactFlowExp2.css';
import {
  Controls,
  Handle,
  NodeProps,
  Position,
  ReactFlow,
  SmoothStepEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'react-toastify';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  Popover,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  useGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery,
  useLazyGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery,
  useLazyGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery,
  useLazyGetSequencesByFixedTaskTemplateIdQuery,
} from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import ComponentMissing from '../Status/ComponentMissing/ComponentMissing';
import { IUserInfo } from '../../../domain/interfaces/UserInfoInterface';
import ModalPageOpener from '../../components/biz24Components/ModalPageOpener';
import { ISANextEvent } from '../../../domain/interfaces/SANextEventInterface';
import {
  useClearDeniedMutation,
  useLazyGetAllEventNoQuery,
  useLazyGetAllFirstEventNoQuery,
  useLazyGetChainFlowChartQuery,
} from '../../../infrastructure/api/BiznessEventPCTrackVMForJobHistoryApiSlice';
import {
  IChain,
  IChainSequenceOption,
  IEventNo,
  IEventTask,
  IFirstEventNo,
} from '../../../domain/interfaces/ChainDataInterface';
import { IFixedTaskTemplateAutoComp } from '../../../domain/interfaces/FixedTaskTemplateInterface';
import { useLazyGetFixedTaskTemplateComboOptionsQuery } from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
import componentMap from '../../Utils/DynamicPageDeclaration';
import Swal from 'sweetalert2';
import { useAppSelector } from '../../../application/Redux/store/store';
import { hexToRgba } from '../../Utils/colorUtils';

const BR2_URL = window.BR2_URL;
type Props = {};

const normalizeFilterValue = (value?: string | null) =>
  !value || value === 'All' ? null : value;

const formatEventName = (name?: string) =>
  (name || '').replace(/([A-Z])/g, ' $1').trim();

const CHAIN_PAGE_SIZE = 10;
const FILTER_DEBOUNCE_MS = 280;
const EMPTY_TASKS: IEventTask[] = [];
const ALL_SEQUENCE_OPTION: IChainSequenceOption = {
  sequence: 0,
  eventName: 'All',
};

type DeniedFilterValue = 'all' | 'enabled' | 'denied';
type DeniedFilterOption = { value: DeniedFilterValue; label: string };

const DENIED_FILTER_OPTIONS: DeniedFilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'enabled', label: 'Only Enabled' },
  { value: 'denied', label: 'Only Denied' },
];
const ALL_DENIED_FILTER = DENIED_FILTER_OPTIONS[0];

type ChainNodeData = {
  biznessEventPCTrackId: number;
  biznessEventProcessConfigurationId: number;
  eventNo: string;
  biznessEventId: number;
  biznessEventName: string;
  performedById: number;
  performedByName: string;
  performedByImage: string;
  startDate: string;
  endDate: string;
  firstEventNo: string;
  biznessEventFrequency: number;
  note: string;
  progressPReported: number;
  originalSequence: number;
  nextSequence: number;
  attachmentList: any | null;
  extendedBiznessEventId: string | null;
  extendedBiznessEventName: string[];
  notes: string;
  fixedTaskTemplateId?: number | null;
  fixedTaskTemplateName?: string;
  denied?: boolean | null;
  onCompletedClick?: (nodeData: ChainNodeData) => void;
  onPendingClick?: (nodeData: ChainNodeData) => void;
  onEnableDenied?: (biznessEventPCTrackIds: number[]) => void;
};

// ------------NB: This code has been transfered to Utils/DynamicPageDeclaration------------

// // dynamic component rendering
// const componentMap: { [key: string]: React.ComponentType<any> } = {
//   // PurchaseOrder: TaskReporting,

//   // R: TaskReporting,
//   // CommArrangesPriceQuotation: TaskReporting,
//   // MatchPriceQuotation: TaskReporting,
//   // ProcurementTenderTaskReporting1: TaskReporting,
//   // ProcurementTenderTaskReporting2: TaskReporting,
//   // // LCVoucher: TransactionLCVoucher,
//   // ProcurementTender: TenderRequisition,
//   // LCVoucher: TransactionEventVoucher,
//   // TenderVoucher: TransactionEventVoucher,

//   TaskReporting,
//   TenderRequisition,
//   TransactionEventVoucher,
//   TenderWon,
//   PurchaseComparativeSheet,
//   SalesOrderAdditionalCost,
//   LPurchaseInAdditionalCost,
//   // Add more components as needed
// };

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
    { skip: sequence == null || !clickedCardInfo?.firstEventNo }
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
            top: '4.375rem',
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
            padding: '0.625rem',
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
          <i className="fas fa-eye text-[1.25rem] mr-2 text-white" />
          <span className="text-white text-[0.625rem]">Previewing task</span>
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
            right: '0.5rem',
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

// const chainDataFromBackend: IEventTask[] = [
//   {
//     id: '1',
//     fixedTaskTemplateId: 1,
//     firstEventNo: 'PQ-DBZHO-2024-000258',
//     completeChain: false, // eita frontend ei dekhte paros tasks er kono object e isComplete 1 ase kina
//     tasks: [
//       {
//         biznessEventPCTrackId: 72658,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventId: 47,
//         biznessEventName: 'ProcurementRequisitionYi',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:25:11.387',
//         endDate: '2024-11-02T12:25:15.307',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 0,
//         note: 'Test',
//         progressPReported: 100,
//         originalSequence: 1,
//         nextSequence: 2,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Test',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 72659,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventId: 48,
//         biznessEventName: 'ProcurementRequisitionApproval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:30:21.033',
//         endDate: '2024-11-02T12:30:21.617',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 1,
//         note: 'Test',
//         progressPReported: 100,
//         originalSequence: 2,
//         nextSequence: 3,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Test',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 72660,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventId: 48,
//         biznessEventName: 'ProcurementRequisitionApproval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:31:45.48',
//         endDate: '2024-11-02T12:31:45.883',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 2,
//         note: 'Test',
//         progressPReported: 100,
//         originalSequence: 3,
//         nextSequence: 4,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Test',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 72661,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventId: 71,
//         biznessEventName: 'CommRupomArrangesPriceQuotation',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:33:00',
//         endDate: '2024-11-02T12:35:00',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 4,
//         nextSequence: 5,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 72662,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventId: 72,
//         biznessEventName: 'MatchPriceQuotation',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:36:00',
//         endDate: '2024-11-02T12:37:00',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 5,
//         nextSequence: 6,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 72663,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PO-DBZHO-2024-000176',
//         biznessEventId: 36,
//         biznessEventName: 'PurchaseOrder',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:44:23.38',
//         endDate: '2024-11-02T12:44:25.04',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 0,
//         note: 'Test',
//         progressPReported: 100,
//         originalSequence: 6,
//         nextSequence: 7,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Test',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 72664,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PO-DBZHO-2024-000176',
//         biznessEventId: 49,
//         biznessEventName: 'PurchaseOrderApproval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:45:04.847',
//         endDate: '2024-11-02T12:45:05.283',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 1,
//         note: 'Test',
//         progressPReported: 100,
//         originalSequence: 7,
//         nextSequence: 8,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Test',
//         fixedTaskTemplateId: 1,
//       },
//       {
//         biznessEventPCTrackId: 0,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'PI-DBZHO-DATABIZ-2024-000105',
//         biznessEventId: 37,
//         biznessEventName: 'PInvoice',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-11-02T12:46:31.367',
//         endDate: '2024-11-02T12:46:33.26',
//         firstEventNo: 'PQ-DBZHO-2024-000258',
//         biznessEventFrequency: 0,
//         note: 'Test',
//         progressPReported: 100,
//         originalSequence: 8,
//         nextSequence: 9,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Test',
//         fixedTaskTemplateId: 1,
//       },
//     ],
//   },

//   {
//     id: '2',
//     fixedTaskTemplateId: 2,
//     firstEventNo: 'Tender-00000591',
//     completeChain: false, // eita frontend ei dekhte paros tasks er kono object e isComplete 1 ase kina
//     tasks: [
//       {
//         biznessEventPCTrackId: 83012,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 80,
//         biznessEventName: 'ProcurementTender',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:00:00',
//         endDate: '2024-12-10T19:00:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: 'Added',
//         progressPReported: 100,
//         originalSequence: 1,
//         nextSequence: 2,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: 'Added',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83013,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 93,
//         biznessEventName: 'Tender Requisition Approval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:01:00',
//         endDate: '2024-12-10T19:01:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 2,
//         nextSequence: 3,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83014,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 79,
//         biznessEventName: 'TenderVoucher',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:02:00',
//         endDate: '2024-12-10T19:02:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 3,
//         nextSequence: 4,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83015,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 80,
//         biznessEventName: 'ProcurementTender',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:05:00',
//         endDate: '2024-12-10T19:05:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: 'Edited',
//         progressPReported: 100,
//         originalSequence: 4,
//         nextSequence: 5,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: ['ProcurementTenderDetail'],
//         notes: 'Edited',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83016,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 80,
//         biznessEventName: 'ProcurementTender',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:06:00',
//         endDate: '2024-12-10T19:06:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: 'Edited',
//         progressPReported: 100,
//         originalSequence: 5,
//         nextSequence: 6,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: ['ProcurementTenderAdditionalCost'],
//         notes: 'Edited',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83017,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 80,
//         biznessEventName: 'ProcurementTender',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:08:00',
//         endDate: '2024-12-10T19:08:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: 'Edited',
//         progressPReported: 100,
//         originalSequence: 6,
//         nextSequence: 7,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [
//           'ProcurementTenderDetail',
//           'ProcurementTenderAdditionalCost',
//         ],
//         notes: 'Edited',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83018,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 94,
//         biznessEventName: 'Admin Approval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:10:00',
//         endDate: '2024-12-10T19:10:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 7,
//         nextSequence: 8,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83019,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 96,
//         biznessEventName: 'CSO Approval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:10:00',
//         endDate: '2024-12-10T19:11:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 8,
//         nextSequence: 9,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83020,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 97,
//         biznessEventName: 'MD Approval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:11:00',
//         endDate: '2024-12-10T19:11:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 9,
//         nextSequence: 10,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 2,
//       },
//       {
//         biznessEventPCTrackId: 83021,
//         biznessEventProcessConfigurationId: 0,
//         eventNo: 'Tender-00000591',
//         biznessEventId: 98,
//         biznessEventName: 'Accounts Approval',
//         performedById: 1,
//         performedByName: 'DATABIZ',
//         performedByImage: '',
//         startDate: '2024-12-10T19:11:00',
//         endDate: '2024-12-10T19:11:00',
//         firstEventNo: 'Tender-00000591',
//         biznessEventFrequency: 0,
//         note: '',
//         progressPReported: 100,
//         originalSequence: 10,
//         nextSequence: 11,
//         attachmentList: null,
//         extendedBiznessEventId: null,
//         extendedBiznessEventName: [],
//         notes: '',
//         fixedTaskTemplateId: 2,
//       },
//     ],
//   },
// ];

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = (data || null) as ChainNodeData | null;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredData, setHoveredData] = useState<ChainNodeData | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'chain-hover-popover' : undefined;
  const isDone = Boolean(nodeData?.biznessEventPCTrackId);

  const [
    triggerGetPermittedUsers,
    {
      data: permittedUsersData,
      error: permittedUsersError,
      isError: permittedUsersIsError,
      isSuccess: permittedUsersIsSuccess,
      isLoading: permittedUsersIsLoading,
      isFetching: permittedUsersIsFetching,
      originalArgs: permittedUsersOriginalArgs,
    },
  ] = useLazyGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery();

  useEffect(() => {
    if (permittedUsersIsError) {
      toast.error('Could not load permitted users.');
      console.log(permittedUsersError);
    }
  }, [permittedUsersIsError, permittedUsersError]);

  useEffect(() => {
    if (hoveredData?.biznessEventProcessConfigurationId) {
      triggerGetPermittedUsers({
        biznessEventProcessConfigurationId:
          hoveredData.biznessEventProcessConfigurationId,
      });
    }
  }, [hoveredData, triggerGetPermittedUsers]);

  if (!nodeData) {
    return null;
  }

  const handleNode = (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        style={{ width: 8, height: 8, background: '#64748b', border: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output1"
        style={{ width: 8, height: 8, background: '#64748b', border: 'none' }}
      />
    </>
  );

  if (isDone) {
    const isDenied = Boolean(nodeData.denied);
    return (
      <div
        className={`chain-node chain-node--done nodrag nopan${
          isDenied ? ' chain-node--denied' : ''
        }`}
      >
        <div className="chain-node-name">
          {formatEventName(nodeData.biznessEventName)}
        </div>
        <div className="chain-node-meta">
          Event <span>{nodeData.eventNo || '—'}</span>
        </div>
        <div className="chain-node-meta">
          Done by {nodeData.performedByName || '—'}
        </div>
        {isDenied ? (
          <div className="chain-node-denied-row">
            <span className="chain-node-status chain-node-status--denied">
              Denied
            </span>
            <button
              type="button"
              className="chain-enable-btn nodrag nopan"
              onClick={(e) => {
                e.stopPropagation();
                if (nodeData.biznessEventPCTrackId) {
                  nodeData.onEnableDenied?.([nodeData.biznessEventPCTrackId]);
                }
              }}
            >
              Enable
            </button>
          </div>
        ) : (
          <div className="chain-node-status">Completed</div>
        )}
        {handleNode}
      </div>
    );
  }

  return (
    <div>
      <div
        aria-describedby={popoverId}
        className="chain-node chain-node--pending nodrag nopan"
        onMouseEnter={(e) => {
          setHoveredData(nodeData);
          setAnchorEl(e.currentTarget);
        }}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <div className="chain-node-name">
          {formatEventName(nodeData.biznessEventName)}
        </div>
        <div className="chain-node-meta">Awaiting action</div>
        <div className="chain-node-status">Pending</div>
        {handleNode}
      </div>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        disableRestoreFocus
        sx={{ pointerEvents: 'none' }}
        PaperProps={{
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
            setAnchorEl(e.currentTarget),
          onMouseLeave: () => setAnchorEl(null),
          sx: {
            pointerEvents: 'auto',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgb(15 23 42 / 12%)',
          },
        }}
      >
        <div className="chain-popover">
          <div className="chain-popover-title">Permitted users</div>
          {(permittedUsersIsLoading || permittedUsersIsFetching) && (
            <div className="br24-anim-fade-in flex justify-center py-3">
              <div className="br24-spinner" aria-label="Loading" />
            </div>
          )}
          {permittedUsersIsError && (
            <div className="chain-popover-row">Could not load users</div>
          )}
          {permittedUsersIsSuccess &&
            !permittedUsersIsLoading &&
            !permittedUsersIsFetching &&
            hoveredData?.biznessEventProcessConfigurationId &&
            permittedUsersOriginalArgs?.biznessEventProcessConfigurationId ===
              hoveredData.biznessEventProcessConfigurationId &&
            (permittedUsersData?.length ? (
              permittedUsersData.map((perUserRow) => (
                <div
                  className="chain-popover-row"
                  key={`${perUserRow.userName}-${perUserRow.locationName}`}
                >
                  {perUserRow.userName} · {perUserRow.locationName}
                </div>
              ))
            ) : (
              <div className="chain-popover-row">No users listed</div>
            ))}
        </div>
      </Popover>
    </div>
  );
};

const nodeTypes = { customNode: CustomNode };
const edgeTypes = { smoothstep: SmoothStepEdge };

const generateEdges = (tasks: IEventTask[]) => {
  const taskIds = new Set(
    tasks.map((task) => task.originalSequence.toString())
  );
  return tasks.flatMap((task) => {
    const targetId = task.nextSequence?.toString();
    if (!targetId || !taskIds.has(targetId)) {
      return [];
    }
    return [
      {
        id: `${task.originalSequence}-${task.nextSequence}-${task.firstEventNo}`,
        source: task.originalSequence.toString(),
        sourceHandle: 'output1',
        target: targetId,
        targetHandle: 'input1',
        type: 'smoothstep',
        animated: true,
        className: 'chain-flow-edge',
        style: {
          stroke: 'var(--br24-accent, #0d9488)',
          strokeWidth: 2,
        },
      },
    ];
  });
};

const generateNodes = (
  tasks: IEventTask[],
  chainMeta: { fixedTaskTemplateId: number; fixedTaskTemplateName: string },
  onCompletedClick: (nodeData: ChainNodeData) => void,
  onPendingClick: (nodeData: ChainNodeData) => void,
  onEnableDenied: (biznessEventPCTrackIds: number[]) => void
) =>
  tasks.map((task, index) => ({
    id: task.originalSequence.toString(),
    type: 'customNode',
    data: {
      biznessEventPCTrackId: task.biznessEventPCTrackId,
      biznessEventProcessConfigurationId:
        task.biznessEventProcessConfigurationId,
      eventNo: task.eventNo,
      biznessEventId: task.biznessEventId,
      biznessEventName: task.biznessEventName,
      performedById: task.performedById,
      performedByName: task.performedByName,
      performedByImage: task.performedByImage,
      startDate: task.startDate,
      endDate: task.endDate,
      firstEventNo: task.firstEventNo,
      biznessEventFrequency: task.biznessEventFrequency,
      note: task.note,
      progressPReported: task.progressPReported,
      originalSequence: task.originalSequence,
      nextSequence: task.nextSequence,
      attachmentList: task.attachmentList,
      extendedBiznessEventId: task.extendedBiznessEventId,
      extendedBiznessEventName: task.extendedBiznessEventName,
      notes: task.notes,
      fixedTaskTemplateId:
        task.fixedTaskTemplateId ?? chainMeta.fixedTaskTemplateId,
      fixedTaskTemplateName: chainMeta.fixedTaskTemplateName,
      denied: task.denied ?? null,
      onCompletedClick,
      onPendingClick,
      onEnableDenied,
    } satisfies ChainNodeData,
    position: { x: index * 250, y: 12 },
  }));

const ChainListSkeleton = memo(function ChainListSkeleton({
  count = 3,
  label = 'Loading chains',
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div
      className="chain-list-skeleton br24-anim-fade-in"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {Array.from({ length: count }, (_, i) => (
        <article
          key={i}
          className="chain-flow-card chain-flow-card--skeleton"
          aria-hidden
        >
          <div className="chain-flow-card-head">
            <div className="chain-skel-head-text">
              <div className="chain-skel-line chain-skel-line--xs" />
              <div className="chain-skel-line chain-skel-line--md" />
              <div className="chain-skel-line chain-skel-line--sm" />
            </div>
          </div>
          <div className="chain-flow-canvas chain-flow-canvas--skeleton">
            <div className="chain-skel-nodes">
              <div className="chain-skel-node" />
              <div className="chain-skel-edge" />
              <div className="chain-skel-node" />
              <div className="chain-skel-edge" />
              <div className="chain-skel-node" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
});

type ChainFlowCardProps = {
  event: IChain;
  onCompletedClick: (nodeData: ChainNodeData) => void;
  onPendingClick: (nodeData: ChainNodeData) => void;
  onEnableDenied: (biznessEventPCTrackIds: number[]) => void;
};

const ChainFlowCard = memo(function ChainFlowCard({
  event,
  onCompletedClick,
  onPendingClick,
  onEnableDenied,
}: ChainFlowCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivated(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '220px 0px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tasks = event.tasks ?? EMPTY_TASKS;

  const deniedTrackIds = useMemo(
    () =>
      tasks
        .filter((t) => t.denied && t.biznessEventPCTrackId > 0)
        .map((t) => t.biznessEventPCTrackId),
    [tasks]
  );

  const nodes = useMemo(
    () =>
      activated
        ? generateNodes(
            tasks,
            {
              fixedTaskTemplateId: event.fixedTaskTemplateId,
              fixedTaskTemplateName: event.fixedTaskTemplateName,
            },
            onCompletedClick,
            onPendingClick,
            onEnableDenied
          )
        : [],
    [
      activated,
      tasks,
      event.fixedTaskTemplateId,
      event.fixedTaskTemplateName,
      onCompletedClick,
      onPendingClick,
      onEnableDenied,
    ]
  );

  const edges = useMemo(
    () => (activated ? generateEdges(tasks) : []),
    [activated, tasks]
  );

  return (
    <article
      ref={rootRef}
      className="chain-flow-card"
      aria-label={`Chain ${event.firstEventNo}`}
    >
      <div className="chain-flow-card-head">
        <div>
          <div className="chain-flow-card-label">First event</div>
          <div className="chain-flow-card-title">{event.firstEventNo}</div>
          <div className="chain-flow-card-type">
            {event.fixedTaskTemplateName || 'Chain'}
          </div>
        </div>
        {deniedTrackIds.length > 0 && (
          <div className="chain-flow-card-denied-actions">
            <span className="chain-denied-indicator">
              Denied
              {deniedTrackIds.length > 1 ? ` · ${deniedTrackIds.length}` : ''}
            </span>
            <button
              type="button"
              className="chain-enable-btn"
              onClick={() => onEnableDenied(deniedTrackIds)}
            >
              Enable
            </button>
          </div>
        )}
      </div>
      <div className="chain-flow-canvas">
        {activated ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{
              padding: 0.18,
              includeHiddenNodes: false,
              minZoom: 0.35,
              maxZoom: 1,
              duration: 0,
            }}
            nodesConnectable={false}
            nodesDraggable={false}
            elementsSelectable
            nodesFocusable
            panOnDrag
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            onlyRenderVisibleElements
            minZoom={0.25}
            maxZoom={1.2}
            onNodeClick={(_event, node) => {
              const data = node.data as ChainNodeData;
              if (!data) return;
              if (data.biznessEventPCTrackId) {
                data.onCompletedClick?.(data);
              } else {
                data.onPendingClick?.(data);
              }
            }}
          >
            <Controls
              position="top-right"
              showInteractive={false}
              className="horizontal-controls"
            />
          </ReactFlow>
        ) : (
          <div className="chain-flow-canvas-placeholder">
            <div className="chain-flow-skeleton" style={{ width: '100%' }} />
          </div>
        )}
      </div>
    </article>
  );
});

type FormValues = {
  fixedTaskTemplate: IFixedTaskTemplateAutoComp | null;
  firstEventNo: IFirstEventNo | null;
  eventNo: IEventNo | null;
  sequence: IChainSequenceOption | null;
  deniedFilter: DeniedFilterOption | null;
};

const ReactFlowExp2 = (props: Props) => {
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
      fixedTaskTemplate: null,
      firstEventNo: null,
      eventNo: null,
      sequence: ALL_SEQUENCE_OPTION,
      deniedFilter: ALL_DENIED_FILTER,
    },
  });
  // Watch for changes in the entire form
  const watchedFields = useWatch({ control });
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const accentSoft = hexToRgba(currentColor, 0.06);
  const navigate = useNavigate();
  let userInfo: IUserInfo = {};
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  useEffect(() => {
    if (!userInfo?.securityUserId) {
      if (
        localStorage.getItem('userInfo') ||
        localStorage.getItem('brFeature')
      ) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('brFeature');
      }
      navigate('/loginUsername');
    }
  }, [navigate, userInfo?.securityUserId]);

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

  const [chainDataState, setChainDataState] = useState<IChain[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const chainPageRef = useRef(1);
  const hasNextPageRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [previewEditModalOpen, setPreviewEditModalOpen] = useState(false);
  const [currentOperationMode, setCurrentOperationMode] = useState('preview');
  const [currentPreviewSequence, setCurrentPreviewSequence] = useState(0);

  const [clickedBoxInfo, setClickedBoxInfo] = useState<any>();

  const previewEditModalClose = () => {
    setPreviewEditModalOpen(false);
  };
  const [modalOpen, setModalOpen] = useState(false);

  const [triggerGetPreviewPageInfo] =
    useLazyGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery();

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetChainFlowchartData,
    {
      error: chainFlowchartError,
      isError: chainFlowchartIsError,
      isLoading: chainFlowchartIsLoading,
      isFetching: chainFlowchartIsFetching,
    },
  ] = useLazyGetChainFlowChartQuery(); // RTK Query lazy fetch

  const [clearDenied] = useClearDeniedMutation();

  const fetchChainPage = useCallback(
    async (pageNumber: number, append: boolean) => {
      const { fixedTaskTemplate, firstEventNo, eventNo, sequence, deniedFilter } =
        getValues();
      if (append) {
        setIsLoadingMore(true);
        loadingMoreRef.current = true;
      }

      try {
        const result = await triggerGetChainFlowchartData({
          fixedTaskTemplateId: fixedTaskTemplate?.fixedTaskTemplateId || null,
          firstEventNo: normalizeFilterValue(firstEventNo?.firstEventNo),
          eventNo: normalizeFilterValue(eventNo?.eventNo),
          sequenceNo: sequence?.sequence || null,
          deniedFilter: deniedFilter?.value || 'all',
          pageNumber,
          pageSize: CHAIN_PAGE_SIZE,
        }).unwrap();

        const pageData = result?.data || [];
        const current = result?.currentPage || pageNumber;
        const totalPages = result?.totalPages || 0;
        const nextHasNext =
          typeof result?.hasNextPage === 'boolean'
            ? result.hasNextPage
            : current < totalPages;

        chainPageRef.current = current;
        hasNextPageRef.current = nextHasNext;
        setHasNextPage(nextHasNext);
        setChainDataState((prev) =>
          append ? [...prev, ...pageData] : pageData
        );
      } catch (error) {
        console.log(error);
        toast.error(
          'Something wrong from backend while fetching chain flowchart!'
        );
      } finally {
        setIsLoadingMore(false);
        loadingMoreRef.current = false;
      }
    },
    [getValues, triggerGetChainFlowchartData]
  );

  const refetchChainFlowchart = useCallback(() => {
    chainPageRef.current = 1;
    hasNextPageRef.current = false;
    setHasNextPage(false);
    setChainDataState([]);
    fetchChainPage(1, false);
  }, [fetchChainPage]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    refetchChainFlowchart();
  }, [refetchChainFlowchart]);

  const handleChainListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 160;
      if (
        nearBottom &&
        hasNextPageRef.current &&
        !chainFlowchartIsFetching &&
        !loadingMoreRef.current
      ) {
        fetchChainPage(chainPageRef.current + 1, true);
      }
    },
    [chainFlowchartIsFetching, fetchChainPage]
  );

  const handleCompletedNodeClick = useCallback((nodeData: ChainNodeData) => {
    setClickedBoxInfo(nodeData);
    setCurrentPreviewSequence(nodeData.originalSequence);
    setPreviewEditModalOpen(true);
  }, []);

  const handlePendingNodeClick = useCallback(
    async (nodeData: ChainNodeData) => {
      if (!nodeData.fixedTaskTemplateId || !nodeData.firstEventNo) {
        toast.error('Missing chain info for this pending task.');
        return;
      }

      try {
        const pageInfo = await triggerGetPreviewPageInfo({
          fixedTaskTemplateId: nodeData.fixedTaskTemplateId,
          sequence: nodeData.originalSequence,
          firstEventNo: nodeData.firstEventNo,
        }).unwrap();

        const nextEvent: ISANextEvent = {
          fixedTaskTemplateId:
            pageInfo.fixedTaskTemplateId || nodeData.fixedTaskTemplateId,
          fixedTaskTemplateName:
            pageInfo.fixedTaskTemplateName ||
            nodeData.fixedTaskTemplateName ||
            '',
          biznessEventId:
            pageInfo.biznessEventId || nodeData.biznessEventId || 0,
          biznessEventName:
            pageInfo.biznessEventName || nodeData.biznessEventName || '',
          controllerPath: pageInfo.controllerPath || '',
          controllerPathType: pageInfo.controllerPathType || '',
          sequence: pageInfo.sequence || nodeData.originalSequence,
          eventNo: pageInfo.eventNo || nodeData.eventNo || '',
          firstEventNo: pageInfo.firstEventNo || nodeData.firstEventNo || '',
          firstEventPerformedBy: pageInfo.firstEventPerformedBy || '',
          biznessEventProcessConfigurationId:
            pageInfo.biznessEventProcessConfigurationId ||
            nodeData.biznessEventProcessConfigurationId ||
            0,
          assignedDate: pageInfo.assignedDate || '',
          dueDate: pageInfo.dueDate || '',
          actionType: pageInfo.actionType || '',
          biznessEventFrequency:
            pageInfo.biznessEventFrequency ||
            nodeData.biznessEventFrequency ||
            0,
          eventLocationName: pageInfo.eventLocationName || '',
          eventLocationId: pageInfo.eventLocationId || 0,
          extendedBiznessEventName:
            pageInfo.extendedBiznessEventName ||
            nodeData.extendedBiznessEventName ||
            [],
        };

        setClickedBoxInfo(nextEvent);
        setModalOpen(true);
      } catch (error) {
        console.log(error);
        toast.error('Could not open pending task page.');
      }
    },
    [triggerGetPreviewPageInfo]
  );

  const handleEnableDenied = useCallback(
    async (biznessEventPCTrackIds: number[]) => {
      const ids = (biznessEventPCTrackIds || []).filter((id) => id > 0);
      if (ids.length === 0) {
        toast.error('No denied track id to enable.');
        return;
      }

      const result = await Swal.fire({
        title: 'Enable denied step?',
        text:
          ids.length === 1
            ? 'This step was denied. Are you sure you want to enable it?'
            : `${ids.length} steps were denied. Are you sure you want to enable them all?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, enable',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;

      try {
        const response = await clearDenied({
          biznessEventPCTrackIds: ids,
        }).unwrap();
        if (response?.succeeded === false) {
          toast.error(
            response?.messages?.[0] || 'Could not enable denied step(s).'
          );
          return;
        }
        toast.success(
          ids.length === 1
            ? 'Denied step enabled.'
            : `${ids.length} denied steps enabled.`
        );
        refetchChainFlowchart();
      } catch (error) {
        console.log(error);
        toast.error('Could not enable denied step(s).');
      }
    },
    [clearDenied, refetchChainFlowchart]
  );

  useEffect(() => {
    if (chainFlowchartIsError) {
      toast.error(
        'Something wrong from backend while fetching chainFlowchartData, see console!'
      );
      console.log(chainFlowchartError);
    }
  }, [chainFlowchartIsError, chainFlowchartError]);

  // Debounced filter → page 1 (avoids rapid refetch while typing/selecting)
  useEffect(() => {
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }
    filterDebounceRef.current = setTimeout(() => {
      refetchChainFlowchart();
    }, FILTER_DEBOUNCE_MS);
    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchedFields.fixedTaskTemplate?.fixedTaskTemplateId,
    watchedFields.firstEventNo?.firstEventNo,
    watchedFields.eventNo?.eventNo,
    watchedFields.sequence?.sequence,
    watchedFields.deniedFilter?.value,
  ]);

  // ------------------------- API CALLS and with associated useEffects --------------------------------------

  const [
    triggerGetSequences,
    {
      data: sequenceOptionsData,
      isLoading: sequenceOptionsIsLoading,
      isFetching: sequenceOptionsIsFetching,
      isError: sequenceOptionsIsError,
      error: sequenceOptionsError,
    },
  ] = useLazyGetSequencesByFixedTaskTemplateIdQuery();

  useEffect(() => {
    if (sequenceOptionsIsError) {
      toast.error('Could not load Step/Sequence options.');
      console.log(sequenceOptionsError);
    }
  }, [sequenceOptionsIsError, sequenceOptionsError]);

  // Chain Type change → reset Step/Sequence to All + load options (or clear)
  useEffect(() => {
    const templateId =
      watchedFields.fixedTaskTemplate?.fixedTaskTemplateId || 0;
    setValue('sequence', ALL_SEQUENCE_OPTION);
    if (templateId > 0) {
      triggerGetSequences({ fixedTaskTemplateId: templateId });
    }
  }, [
    watchedFields.fixedTaskTemplate?.fixedTaskTemplateId,
    setValue,
    triggerGetSequences,
  ]);

  const [
    triggerGetFixedTaskTemplate,
    {
      data: fixedTaskTemplateOptions,
      error: fixedTaskTemplateOptionsError,
      isError: fixedTaskTemplateOptionsIsError,
      isSuccess: fixedTaskTemplateOptionsIsSuccess,
      isLoading: fixedTaskTemplateOptionsLoading,
      isFetching: fixedTaskTemplateOptionsIsFetching,
    },
  ] = useLazyGetFixedTaskTemplateComboOptionsQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (fixedTaskTemplateOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching fixedTaskTemplateOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching fixedTaskTemplateOptions for autocomplete, see console--->:'
      );
      console.log(fixedTaskTemplateOptionsError);
    }
    if (fixedTaskTemplateOptionsIsSuccess) {
      console.log('fixedTaskTemplateOptions');
      console.log(fixedTaskTemplateOptions);
    }
  }, [
    fixedTaskTemplateOptionsLoading,
    fixedTaskTemplateOptionsIsFetching,
    fixedTaskTemplateOptionsError,
    fixedTaskTemplateOptionsIsError,
    fixedTaskTemplateOptions,
    fixedTaskTemplateOptionsIsSuccess,
  ]);

  const [
    triggerGetEventNo,
    {
      data: eventNoOptionsData,
      error: eventNoOptionsError,
      isError: eventNoOptionsIsError,
      isSuccess: eventNoOptionsIsSuccess,
      isLoading: eventNoOptionsIsLoading,
      isFetching: eventNoOptionsIsFetching,
    },
  ] = useLazyGetAllEventNoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (eventNoOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching eventNoOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching eventNoOptionsData, see console--->:'
      );
      console.log(eventNoOptionsError);
    }
    if (eventNoOptionsIsSuccess) {
      console.log('eventNoOptionsIsSuccess');
      console.log(eventNoOptionsData);
    }
  }, [
    eventNoOptionsData,
    eventNoOptionsIsLoading,
    eventNoOptionsError,
    eventNoOptionsIsError,
    eventNoOptionsIsFetching,
    eventNoOptionsIsSuccess,
  ]);

  const [
    triggerGetFirstEventNo,
    {
      data: firstEventNoOptionsData,
      error: firstEventNoOptionsError,
      isError: firstEventNoOptionsIsError,
      isSuccess: firstEventNoOptionsIsSuccess,
      isLoading: firstEventNoOptionsIsLoading,
      isFetching: firstEventNoOptionsIsFetching,
    },
  ] = useLazyGetAllFirstEventNoQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (firstEventNoOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching firstEventNoOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching firstEventNoOptionsData, see console--->:'
      );
      console.log(firstEventNoOptionsError);
    }
    if (firstEventNoOptionsIsSuccess) {
      console.log('firstEventNoOptionsIsSuccess');
      console.log(firstEventNoOptionsData);
    }
  }, [
    firstEventNoOptionsData,
    firstEventNoOptionsIsLoading,
    firstEventNoOptionsError,
    firstEventNoOptionsIsError,
    firstEventNoOptionsIsFetching,
    firstEventNoOptionsIsSuccess,
  ]);

  useEffect(() => {
    const { fixedTaskTemplate, firstEventNo, eventNo } = watchedFields;
    const selectedFirstEventNo = normalizeFilterValue(
      firstEventNo?.firstEventNo
    );
    const selectedEventNo = normalizeFilterValue(eventNo?.eventNo);

    triggerGetFixedTaskTemplate({
      companyId: userInfo?.companyId || 0,
      eventNo: selectedEventNo,
      firstEventNo: selectedFirstEventNo,
    });

    triggerGetEventNo({
      firstEventNo: selectedFirstEventNo,
      fixedTaskTemplateId: fixedTaskTemplate?.fixedTaskTemplateId || null,
    });
    triggerGetFirstEventNo({
      eventNo: selectedEventNo,
      fixedTaskTemplateId: fixedTaskTemplate?.fixedTaskTemplateId || null,
    });
  }, [
    watchedFields.fixedTaskTemplate?.fixedTaskTemplateId,
    watchedFields.firstEventNo?.firstEventNo,
    watchedFields.eventNo?.eventNo,
  ]);

  // const [
  //   triggerGetPermittedUsersAndLocations,
  //   {
  //     data: permittedUsersAndLocationsData,
  //     error: permittedUsersAndLocationsError,
  //     isError: permittedUsersAndLocationsIsError,
  //     isSuccess: permittedUsersAndLocationsIsSuccess,
  //     isLoading: permittedUsersAndLocationsIsLoading,
  //     isFetching: permittedUsersAndLocationsIsFetching,
  //   },
  // ] =
  //   useLazyGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery(); // RTK Query lazy fetch

  // useEffect(() => {
  //   if (permittedUsersAndLocationsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching permittedUsersAndLocationsData, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching permittedUsersAndLocationsData, see console--->:'
  //     );
  //     console.log(permittedUsersAndLocationsError);
  //   }
  //   if (permittedUsersAndLocationsIsSuccess) {
  //     console.log('permittedUsersAndLocationsIsSuccess');
  //     console.log(permittedUsersAndLocationsData);
  //   }
  // }, [
  //   permittedUsersAndLocationsData,
  //   permittedUsersAndLocationsIsLoading,
  //   permittedUsersAndLocationsError,
  //   permittedUsersAndLocationsIsError,
  //   permittedUsersAndLocationsIsFetching,
  //   permittedUsersAndLocationsIsSuccess,
  // ]);

  // const getPermittedUserInfo = () => {
  //   triggerGetPermittedUsersAndLocations({
  //     biznessEventProcessConfigurationId: 26,
  //   });
  // };

  const filterFieldSx = {
    width: '100%',
    '& .MuiInputLabel-root': { fontSize: '0.8rem' },
    '& .MuiInputBase-root': { fontSize: '0.8125rem' },
  };

  return (
    <div
      className="chain-status-page mt-16 md:mt-2"
      style={
        {
          '--cs-page-accent': currentColor,
          '--cs-page-accent-soft': accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <form>
            <div className="chain-status-shell block rounded-lg shadow-md bg-white dark:bg-secondary-dark-bg text-start overflow-hidden border border-gray-100 dark:border-gray-700">
              <header className="chain-status-header">
                <div className="chain-status-header-left">
                  <div
                    className="chain-status-accent-bar"
                    style={{ background: currentColor }}
                    aria-hidden
                  />
                  <h1 className="chain-status-title">Available Chain Status</h1>
                </div>
              </header>

              <div className="chain-status-filters">
                <Controller
                  name="fixedTaskTemplate"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      loading={
                        fixedTaskTemplateOptionsLoading ||
                        fixedTaskTemplateOptionsIsFetching
                      }
                      options={[
                        { fixedTaskTemplateId: 0, name: 'All' },
                        ...(Array.from(
                          new Map(
                            fixedTaskTemplateOptions?.map(
                              (fixedTaskTemplateOption) => [
                                fixedTaskTemplateOption.name,
                                fixedTaskTemplateOption,
                              ]
                            )
                          ).values()
                        ) || []),
                      ]}
                      value={value || null}
                      onChange={(_event, selectedItem) =>
                        onChange(selectedItem)
                      }
                      onBlur={onBlur}
                      getOptionLabel={(option) => (option ? option.name : '')}
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.name === selectedValue?.name &&
                        option.fixedTaskTemplateId ===
                          selectedValue?.fixedTaskTemplateId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chain Type"
                          variant="outlined"
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                          sx={filterFieldSx}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="firstEventNo"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      loading={
                        firstEventNoOptionsIsLoading ||
                        firstEventNoOptionsIsFetching
                      }
                      options={[
                        { biznessEvent_PCTrackId: 0, firstEventNo: 'All' },
                        ...(Array.from(
                          new Map(
                            firstEventNoOptionsData?.map(
                              (firstEventNoOption) => [
                                firstEventNoOption.firstEventNo,
                                firstEventNoOption,
                              ]
                            )
                          ).values()
                        ) || []),
                      ]}
                      value={value || null}
                      onChange={(_event, selectedItem) =>
                        onChange(selectedItem)
                      }
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.firstEventNo : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.firstEventNo === selectedValue?.firstEventNo &&
                        option.biznessEvent_PCTrackId ===
                          selectedValue?.biznessEvent_PCTrackId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="First Event No."
                          variant="outlined"
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                          sx={filterFieldSx}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="eventNo"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      loading={
                        eventNoOptionsIsLoading || eventNoOptionsIsFetching
                      }
                      options={[
                        { biznessEvent_PCTrackId: 0, eventNo: 'All' },
                        ...(Array.from(
                          new Map(
                            eventNoOptionsData?.map((eventNoOption) => [
                              eventNoOption.eventNo,
                              eventNoOption,
                            ])
                          ).values()
                        ) || []),
                      ]}
                      value={value || null}
                      onChange={(_event, selectedItem) =>
                        onChange(selectedItem)
                      }
                      onBlur={onBlur}
                      getOptionLabel={(option) =>
                        option ? option.eventNo : ''
                      }
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.eventNo === selectedValue?.eventNo &&
                        option.biznessEvent_PCTrackId ===
                          selectedValue?.biznessEvent_PCTrackId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Event No."
                          variant="outlined"
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                          sx={filterFieldSx}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="sequence"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => {
                    const templateId =
                      watchedFields.fixedTaskTemplate?.fixedTaskTemplateId ||
                      0;
                    const stepOptions: IChainSequenceOption[] =
                      templateId > 0
                        ? [
                            ALL_SEQUENCE_OPTION,
                            ...(sequenceOptionsData || []),
                          ]
                        : [ALL_SEQUENCE_OPTION];
                    return (
                      <Autocomplete
                        size="small"
                        loading={
                          templateId > 0 &&
                          (sequenceOptionsIsLoading ||
                            sequenceOptionsIsFetching)
                        }
                        options={stepOptions}
                        value={value || ALL_SEQUENCE_OPTION}
                        onChange={(_event, selectedItem) =>
                          onChange(selectedItem || ALL_SEQUENCE_OPTION)
                        }
                        onBlur={onBlur}
                        getOptionLabel={(option) =>
                          !option || option.sequence === 0
                            ? 'All'
                            : `${option.sequence} — ${formatEventName(option.eventName)}`
                        }
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.sequence === selectedValue?.sequence
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Step / Sequence"
                            variant="outlined"
                            error={!!error}
                            helperText={error ? error.message : null}
                            inputRef={ref}
                            sx={filterFieldSx}
                          />
                        )}
                      />
                    );
                  }}
                />
                <Controller
                  name="deniedFilter"
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      size="small"
                      options={DENIED_FILTER_OPTIONS}
                      value={value || ALL_DENIED_FILTER}
                      onChange={(_event, selectedItem) =>
                        onChange(selectedItem || ALL_DENIED_FILTER)
                      }
                      onBlur={onBlur}
                      getOptionLabel={(option) => option?.label || 'All'}
                      isOptionEqualToValue={(option, selectedValue) =>
                        option.value === selectedValue?.value
                      }
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Denied status"
                          variant="outlined"
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                          sx={filterFieldSx}
                        />
                      )}
                    />
                  )}
                />
              </div>

              <div
                className="chain-status-list"
                onScroll={handleChainListScroll}
              >
                {(chainFlowchartIsLoading || chainFlowchartIsFetching) &&
                  chainDataState.length === 0 && (
                    <ChainListSkeleton count={3} label="Loading chains" />
                  )}
                {!chainFlowchartIsLoading &&
                  !chainFlowchartIsFetching &&
                  chainDataState.length === 0 && (
                    <div className="chain-status-empty">
                      No chains match these filters. Try widening Chain Type or
                      clearing Event No.
                    </div>
                  )}
                {chainDataState.map((event) => (
                  <ChainFlowCard
                    key={`${event.fixedTaskTemplateId}-${event.firstEventNo}`}
                    event={event}
                    onCompletedClick={handleCompletedNodeClick}
                    onPendingClick={handlePendingNodeClick}
                    onEnableDenied={handleEnableDenied}
                  />
                ))}
                {(isLoadingMore ||
                  (chainFlowchartIsFetching &&
                    chainDataState.length > 0)) && (
                  <ChainListSkeleton count={1} label="Loading more chains" />
                )}
                {!hasNextPage &&
                  chainDataState.length > 0 &&
                  !isLoadingMore &&
                  !chainFlowchartIsFetching && (
                    <div className="chain-status-footer-note">
                      End of results
                    </div>
                  )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <PreviewEditModal
        previewEditModalOpen={previewEditModalOpen}
        setPreviewEditModalOpen={setPreviewEditModalOpen}
        onClose={previewEditModalClose}
        sequence={currentPreviewSequence}
        clickedCardInfo={clickedBoxInfo}
        userInfo={userInfo}
        userInfoBr2={userInfoBr2}
        operationMode={currentOperationMode}
      />
      <ModalPageOpener
        open={modalOpen}
        onClose={handleCloseModal}
        clickedCardInfo={clickedBoxInfo as ISANextEvent}
      />
    </div>
  );
};

export default ReactFlowExp2;
