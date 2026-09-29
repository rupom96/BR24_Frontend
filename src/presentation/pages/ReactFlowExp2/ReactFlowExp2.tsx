/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import './ReactFlowExp2.css';
import {
  BezierEdge,
  Controls,
  Handle,
  NodeProps,
  Position,
  ReactFlow,
  SmoothStepEdge,
  StepEdge,
} from '@xyflow/react';
import { toast } from 'react-toastify';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import {
  useGetPreviewPageInfoByFixedTaskTemplateIdSequenceQuery,
  useLazyGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery,
} from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import TaskReporting from '../TaskReporting/TaskReporting';
// import TenderRequisiton from '../TenderRequisition/TenderRequisiton';
import TransactionEventVoucher from '../TransactionEventVoucher/TransactionEventVoucher';
import TenderWon from '../TenderWon/TenderWon';
import PurchaseComparativeSheet from '../PurchaseComparativeSheet/PurchaseComparativeSheet';
import ComponentMissing from '../Status/ComponentMissing/ComponentMissing';
import { IUserInfo } from '../../../domain/interfaces/UserInfoInterface';
import ModalPageOpener from '../../components/biz24Components/ModalPageOpener';
import { ISANextEvent } from '../../../domain/interfaces/SANextEventInterface';
import {
  useGetAllEventNoQuery,
  useLazyGetAllEventNoQuery,
  useLazyGetAllFirstEventNoQuery,
  useLazyGetChainFlowChartQuery,
} from '../../../infrastructure/api/BiznessEventPCTrackVMForJobHistoryApiSlice';
import {
  IChain,
  IEventNo,
  IEventTask,
  IFirstEventNo,
} from '../../../domain/interfaces/ChainDataInterface';
import { IFixedTaskTemplateAutoComp } from '../../../domain/interfaces/FixedTaskTemplateInterface';
import {
  useGetFixedTaskTemplateComboOptionsQuery,
  useLazyGetFixedTaskTemplateComboOptionsQuery,
} from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
import SalesOrderAdditionalCost from '../SalesAdditionalCost/SalesOrderAdditionalCost';
import LPurchaseInAdditionalCost from '../LPurchaseInAdditionalCost/LPurchaseInAdditionalCost';
import componentMap from '../../Utils/DynamicPageDeclaration';

const BR2_URL = window.BR2_URL;
type Props = {};

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
type FormValues = {
  fixedTaskTemplate: IFixedTaskTemplateAutoComp | null;
  firstEventNo: IFirstEventNo | null;
  eventNo: IEventNo | null;
};

const ReactFlowExp2 = (props: Props) => {
  const handleNodeClick = (nodeLabel: string) => {
    console.log(`Node clicked: ${nodeLabel}`);
    alert(`You clicked on: ${nodeLabel}`);
  };

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
    },
  });
  // Watch for changes in the entire form
  const watchedFields = useWatch({ control });
  const navigate = useNavigate();
  let userInfo: IUserInfo = {};
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

  const [chainDataState, setChainDataState] = useState<IChain[]>([]);
  const [previewEditModalOpen, setPreviewEditModalOpen] = useState(false);
  const [currentOperationMode, setCurrentOperationMode] = useState('preview');
  const [currentPreviewSequence, setCurrentPreviewSequence] = useState(0);

  const [clickedBoxInfo, setClickedBoxInfo] = useState<any>();

  const previewEditModalClose = () => {
    setPreviewEditModalOpen(false);
  };
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
    // reftech saiful vai er api
  };

  const CustomNode: React.FC<NodeProps> = ({ data }) => {
    const handleNodeClick = (clickedBoxInfoParam: any) => {
      console.log(`Node clicked: ${clickedBoxInfoParam.biznessEventName}`);
      // alert(`You clicked on: ${clickedBoxInfoParam.biznessEventName}`);
      setClickedBoxInfo(clickedBoxInfoParam);
      setCurrentPreviewSequence(clickedBoxInfoParam.originalSequence);

      setPreviewEditModalOpen(true);
    };
    const handleNodeClickPendingTask = (clickedBoxInfoParam: any) => {
      console.log(`Node clicked: ${clickedBoxInfoParam.biznessEventName}`);
      // alert(`You clicked on: ${clickedBoxInfoParam.biznessEventName}`);
      setClickedBoxInfo(clickedBoxInfoParam);
      // setCurrentPreviewSequence(clickedBoxInfoParam.originalSequence);

      // setPreviewEditModalOpen(true);
      setModalOpen(true);
    };

    const dataCopy: any = data ? JSON.parse(JSON.stringify(data)) : null;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredData, setHoveredData] = useState<any>(null);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      console.log('Taglifico rupom see----> event.currentTarget');
      console.log(event.currentTarget);
    };

    const handleMouseLeave = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'hover-popover' : undefined;

    const [
      triggerGetPermittedUsers,
      {
        data: permittedUsersData,
        error: permittedUsersError,
        isError: permittedUsersIsError,
        isSuccess: permittedUsersIsSuccess,
        isLoading: permittedUsersIsLoading,
        isFetching: permittedUsersIsFetching,
      },
    ] =
      useLazyGetPermittedUserAndLocationByBiznessEventProcessConfigurationIdQuery(); // RTK Query lazy fetch

    useEffect(() => {
      if (permittedUsersIsError) {
        toast.error(
          'Something wrong from backend while fetching permittedUsersData, see console!'
        );
        console.log(
          'Something wrong from backend while fetching permittedUsersData, see console--->:'
        );
        console.log(permittedUsersError);
      }
      if (permittedUsersIsSuccess) {
        console.log('permittedUsersIsSuccess');
        console.log(permittedUsersData);
      }
    }, [
      permittedUsersData,
      permittedUsersIsLoading,
      permittedUsersError,
      permittedUsersIsError,
      permittedUsersIsFetching,
      permittedUsersIsSuccess,
    ]);

    useEffect(() => {
      console.log('hovered data');
      console.log(hoveredData);

      if (hoveredData?.biznessEventProcessConfigurationId) {
        triggerGetPermittedUsers({
          biznessEventProcessConfigurationId:
            hoveredData?.biznessEventProcessConfigurationId,
        });
      }
    }, [hoveredData, triggerGetPermittedUsers]);

    return (
      <div>
        {dataCopy.biznessEventPCTrackId ? (
          <div
            className="bg-white border border-gray-300 rounded p-2 text-center shadow-md relative w-40"
            onClick={() => {
              handleNodeClick(dataCopy);
              console.log(data);
            }}
            style={{
              width: '15.625rem', // Set fixed width
              height: 'auto', // Auto height based on text
              padding: '0.625rem',
              whiteSpace: 'normal', // Allow text wrapping
              wordWrap: 'break-word', // Break long words
              overflowWrap: 'break-word', // Ensure word breaking
              textAlign: 'center',
            }}
          >
            <div className="text-[0.8125rem] font-bold text-slate-800">
              {(dataCopy.biznessEventName || '')
                .replace(/([A-Z])/g, ' $1')
                .trim()}{' '}
            </div>
            <div className="text-[0.6875rem]">
              Event:{' '}
              <span className="text-cyan-700">{dataCopy.eventNo || ''}</span>
            </div>
            <div className="text-[0.5625rem]">
              Done By: {dataCopy.performedByName || ''}
            </div>

            {/* Input Handle (LEFT side) */}
            {/* {data.next.map((row, index) => {
          return (
            <Handle
              type="source"
              position={Position.Right} // Place output on the RIGHT
              id={`output${index}`}
              // style={{ background: '#555' }}
              style={{
                background: '#555',
                top: `${index === 0 ? 1 : index + 30}%`, // Evenly distribute
                transform: 'translateY(-50%)',
              }}
            />
          );
        })} */}

            <Handle
              type="target"
              position={Position.Left} // Place input on the LEFT
              id="input1"
              style={{ background: '#555' }}
            />
            {/* <Handle
          type="target"
          position={Position.Bottom} // Place input on the LEFT
          id="input2"
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Bottom} // Place input on the LEFT
          id="input3"
          style={{ background: '#555' }}
        /> */}

            {/* Output Handle (RIGHT side) */}
            <Handle
              type="source"
              position={Position.Right} // Place output on the RIGHT
              id="output1"
              style={{ background: '#555' }}
            />
            {/* <Handle
          type="source"
          position={Position.Right} // Place output on the RIGHT
          id="output2"
          // style={{ background: '#555' }}
          style={{
            background: '#555',
            top: `5%`, // Evenly distribute
            transform: 'translateY(-50%)',
          }}
        />
        <Handle
          type="source"
          position={Position.Right} // Place output on the RIGHT
          id="output3"
          // style={{ background: '#555' }}
          style={{
            background: '#555',
            top: `25%`, // Evenly distribute
            transform: 'translateY(-50%)',
          }}
        /> */}
          </div>
        ) : (
          <div>
            <div
              aria-describedby={id}
              onMouseEnter={(e) => {
                setHoveredData(dataCopy);
                handleMouseEnter(e);
              }}
              onMouseLeave={handleMouseLeave}
              className="bg-lime-700 text-white border border-gray-300 rounded cursor-pointer p-2 text-center shadow-md relative w-40"
              onClick={() => {
                handleNodeClickPendingTask(dataCopy);
                console.log(data);
              }}
              style={{
                width: '15.625rem', // Set fixed width
                height: 'auto', // Auto height based on text
                padding: '0.625rem',
                whiteSpace: 'normal', // Allow text wrapping
                wordWrap: 'break-word', // Break long words
                overflowWrap: 'break-word', // Ensure word breaking
                textAlign: 'center',
                // backgroundColor: 'red',
              }}
            >
              <div>{dataCopy.biznessEventName || ''}</div>

              {/* Input Handle (LEFT side) */}
              {/* {data.next.map((row, index) => {
                return (
                  <Handle
                    type="source"
                    position={Position.Right} // Place output on the RIGHT
                    id={`output${index}`}
                    // style={{ background: '#555' }}
                    style={{
                      background: '#555',
                      top: `${index === 0 ? 1 : index + 30}%`, // Evenly distribute
                      transform: 'translateY(-50%)',
                    }}
                  />
                );
              })} */}

              <Handle
                type="target"
                position={Position.Left} // Place input on the LEFT
                id="input1"
                style={{ background: '#555' }}
              />
              {/* <Handle
                type="target"
                position={Position.Bottom} // Place input on the LEFT
                id="input2"
                style={{ background: '#555' }}
              />
              <Handle
                type="target"
                position={Position.Bottom} // Place input on the LEFT
                id="input3"
                style={{ background: '#555' }}
              /> */}

              {/* Output Handle (RIGHT side) */}
              <Handle
                type="source"
                position={Position.Right} // Place output on the RIGHT
                id="output1"
                style={{ background: '#555' }}
              />
              {/* <Handle
                type="source"
                position={Position.Right} // Place output on the RIGHT
                id="output2"
                // style={{ background: '#555' }}
                style={{
                  background: '#555',
                  top: `5%`, // Evenly distribute
                  transform: 'translateY(-50%)',
                }}
              />
              <Handle
                type="source"
                position={Position.Right} // Place output on the RIGHT
                id="output3"
                // style={{ background: '#555' }}
                style={{
                  background: '#555',
                  top: `25%`, // Evenly distribute
                  transform: 'translateY(-50%)',
                }}
              /> */}
            </div>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleMouseLeave}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              disableRestoreFocus
              sx={{ pointerEvents: 'none' }} // to avoid flickering
              PaperProps={{
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
              }}
            >
              <div className="p-4">
                <Typography>Permitted Users:</Typography>
                {(permittedUsersIsLoading || permittedUsersIsFetching) && (
                  <div className="br24-anim-fade-in flex justify-center py-6">
                    <div className="br24-spinner" aria-label="Loading" />
                  </div>
                )}
                {permittedUsersIsError && <div>Error while fetching data</div>}
                {permittedUsersIsSuccess &&
                  !permittedUsersIsLoading &&
                  !permittedUsersIsFetching &&
                  hoveredData?.biznessEventProcessConfigurationId &&
                  permittedUsersData?.map((perUserRow, index) => (
                    <div>
                      {perUserRow.userName} - {perUserRow.locationName}
                    </div>
                  ))}
              </div>
            </Popover>
          </div>
        )}
      </div>
    );
  };

  const nodeTypes = {
    customNode: CustomNode, // Register the custom node type
  };

  const generateNodes = (tasks: IEventTask[]) =>
    tasks.map((task, index) => ({
      id: task.originalSequence.toString(),
      type: 'customNode', // Set type to the registered custom node
      // data: { label: `${task.name} (${task.duration})` },
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
        extendedBiznessEventName: task.extendedBiznessEventName, // Adjust type if needed
        notes: task.notes,
        fixedTaskTemplateId: task.fixedTaskTemplateId,
      },
      position: { x: index * 350, y: 0 }, // Calculate positions dynamically
      onClick: handleNodeClick, // Pass the click handler
    }));

  // const generateEdges = (tasks: Task[]) =>
  //   tasks.flatMap((task) =>
  //     task.next.map((nextId) => ({
  //       id: `${task.id}-${nextId}`,
  //       source: task.id,
  //       target: nextId,
  //       type: 'smoothstep', // Use smooth arrows for loops
  //       animated: true,
  //     }))
  //   );

  const generateEdges = (tasks: IEventTask[]) =>
    tasks.flatMap((task) => {
      // task.next.map((nextId) => {
      // const isLoopback = parseInt(nextId, 10) < parseInt(task.id, 10); // Check if it's a backward loop

      return {
        id: `${task.originalSequence}-${task.nextSequence}_${
          task.firstEventNo
        }-${uuid()}`,
        source: task.originalSequence.toString(),
        sourceHandle: 'output1',
        target: task.nextSequence.toString(),
        targetHandle: 'input1',
        type: 'smoothstep', // Use `bezier` for loops, `step` for normal flow
        animated: true, // Make loopback edges animated for better visualization
        // style: isLoopback
        //   ? { stroke: 'red', strokeWidth: 2 } // Highlight loops for clarity
        //   : { stroke: 'black', strokeWidth: 1 },
      };
      // })
    });

  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetChainFlowchartData,
    {
      data: chainFlowchartData,
      error: chainFlowchartError,
      isError: chainFlowchartIsError,
      isSuccess: chainFlowchartIsSuccess,
      isLoading: chainFlowchartIsLoading,
      isFetching: chainFlowchartIsFetching,
    },
  ] = useLazyGetChainFlowChartQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (chainFlowchartIsError) {
      toast.error(
        'Something wrong from backend while fetching chainFlowchartData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching chainFlowchartData, see console--->:'
      );
      console.log(chainFlowchartError);
    } else if (
      chainFlowchartIsSuccess &&
      !chainFlowchartIsLoading &&
      !chainFlowchartIsFetching &&
      !chainFlowchartIsError &&
      chainFlowchartData
    ) {
      console.log('chainFlowchartIsSuccess');
      console.log(chainFlowchartData);
    }
  }, [
    chainFlowchartData,
    chainFlowchartIsLoading,
    chainFlowchartError,
    chainFlowchartIsError,
    chainFlowchartIsFetching,
    chainFlowchartIsSuccess,
  ]);

  useEffect(() => {
    const { fixedTaskTemplate, firstEventNo, eventNo } = watchedFields;
    triggerGetChainFlowchartData({
      fixedTaskTemplateId: fixedTaskTemplate?.fixedTaskTemplateId || null,
      firstEventNo: firstEventNo?.firstEventNo || null,
      eventNo: eventNo?.eventNo || null,
    });
  }, []);

  useEffect(() => {
    const { fixedTaskTemplate, firstEventNo, eventNo } = watchedFields;

    // Trigger your RTK Query

    const tempVar = chainFlowchartData?.filter((w) => {
      return (
        (!fixedTaskTemplate?.fixedTaskTemplateId ||
          w.fixedTaskTemplateId === fixedTaskTemplate.fixedTaskTemplateId) &&
        (!firstEventNo?.firstEventNo ||
          w.firstEventNo === firstEventNo.firstEventNo) &&
        (!eventNo?.eventNo ||
          (Array.isArray(w.tasks) &&
            w.tasks.some((task) => task.eventNo === eventNo.eventNo)))
      );
    });

    setChainDataState(JSON.parse(JSON.stringify(tempVar || [])));
  }, [
    watchedFields.fixedTaskTemplate,
    watchedFields.firstEventNo,
    watchedFields.eventNo,
    chainFlowchartData,
  ]);

  // ------------------------- API CALLS and with associated useEffects --------------------------------------

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

    // Trigger your RTK Query

    triggerGetFixedTaskTemplate({
      companyId: userInfo?.companyId || 0,
      eventNo: eventNo?.eventNo || null,
      firstEventNo: firstEventNo?.firstEventNo || null,
    });

    triggerGetEventNo({
      firstEventNo: firstEventNo?.firstEventNo,
      fixedTaskTemplateId: fixedTaskTemplate?.fixedTaskTemplateId,
    });
    triggerGetFirstEventNo({
      eventNo: eventNo?.eventNo,
      fixedTaskTemplateId: fixedTaskTemplate?.fixedTaskTemplateId,
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

  return (
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
                {/* {biznessEventName
                  ? biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
                  : 'Chain Flows'} */}
                Chain Flows
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-1  mt-5">
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <Controller
                    name="fixedTaskTemplate"
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
                        // onChange={(event, item) => {}} // React-hook-form manages the state
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem);
                        }}
                        onBlur={onBlur} // Trigger validation on blur
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
                    name="firstEventNo"
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
                        // onChange={(event, item) => {}} // React-hook-form manages the state
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem);
                        }}
                        onBlur={onBlur} // Trigger validation on blur
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
                    name="eventNo"
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
                        // onChange={(event, item) => {}} // React-hook-form manages the state
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem);
                        }}
                        onBlur={onBlur} // Trigger validation on blur
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
                <div className="h-[37.5rem] w-[100%] overflow-scroll">
                  {chainDataState?.map((event) => (
                    <div key={uuid()} className=" box-border border m-4">
                      <div className="">
                        <div className=" text-[0.8125rem]">
                          First Event No.:{' '}
                          <span className=" font-bold">
                            {event.firstEventNo}
                          </span>
                        </div>

                        <div className=" text-[0.8125rem]">
                          Chain Type: {event.fixedTaskTemplateName}
                        </div>
                      </div>

                      <div
                        key={event.fixedTaskTemplateId + event.firstEventNo}
                        className="w-[100%] h-[9.375rem] mt-4"
                      >
                        <ReactFlow
                          nodes={generateNodes(event.tasks)}
                          edges={generateEdges(event.tasks)}
                          nodeTypes={nodeTypes} // Register custom node type
                          fitView
                          edgeTypes={{
                            bezier: (props) => <BezierEdge {...props} />, // Custom edge type for loops
                            step: (props) => <StepEdge {...props} />, // Default step edge
                          }}
                          nodesConnectable={false}
                          // elementsSelectable={false}
                          nodesDraggable={false} // Disable dragging of nodes
                          // panOnDrag={false} // Prevent background drag
                          zoomOnScroll={false} // Disable zoom on scroll
                          zoomOnPinch={false} // Disable zoom on pinch gestures
                          panOnScroll={false} // scrolling e j whole page upore niche jaay oita
                          zoomOnDoubleClick={false}
                          // maxZoom={0.7}
                          fitViewOptions={{
                            padding: 0.2,
                            includeHiddenNodes: false,
                            minZoom: 0.1,
                            maxZoom: 1,
                            duration: 800,
                            nodes: [{ id: 'node-1' }, { id: 'node-2' }],
                          }}
                          // minZoom={0.7}
                        >
                          <Controls
                            position="top-right"
                            className="horizontal-controls"
                          />
                          {/* <Background /> */}
                        </ReactFlow>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  {/* <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      chainFlowchartIsLoading ||
                      chainFlowchartIsFetching ||
                      isChainFlowchartLoading ||
                      processBuyerWiseCommissionAchievementLoading ||
                      operationMode === 'preview'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (
                        chainFlowchartIsLoading ||
                        chainFlowchartIsFetching ||
                        isChainFlowchartLoading ||
                        processBuyerWiseCommissionAchievementLoading
                      ) {
                        toast.warning(
                          'Please wait until the data is fetched/saved!'
                        );
                      } else if (operationMode === 'preview') {
                        toast.warning(
                          'You are in preview mode, you cannot update the tender status'
                        );
                      } else {
                        saveBtn();
                        // testFunct();
                      }
                    }}
                  >
                    {chainFlowchartIsLoading ||
                    chainFlowchartIsFetching ||
                    isChainFlowchartLoading ||
                    processBuyerWiseCommissionAchievementLoading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {'  '}
                    {chainFlowchartIsLoading ||
                    chainFlowchartIsFetching ||
                    isChainFlowchartLoading ||
                    processBuyerWiseCommissionAchievementLoading
                      ? 'Please wait..'
                      : 'Save'}
                  </button> */}
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={(e) => {
                      // getPermittedUserInfo();
                    }}
                  >
                    Test
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
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
