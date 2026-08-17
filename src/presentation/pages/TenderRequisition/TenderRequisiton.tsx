/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/ban-types */
// import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import ProcurementTender from './ProcurementTender/ProcurementTender';
import ProcurementTenderAdditionalCost from './ProcurementTenderAdditionalCost/ProcurementTenderAdditionalCost';

import { IFormProps } from '../../../domain/interfaces/FormPropsInterface';
import {
  ICreateProcurementTenderCommand,
  IProcurementTender,
  IProcurementTenderProcessCommandsVM,
  ITenderNoComboBox,
  IUpdateProcurementTenderCommand,
} from '../../../domain/interfaces/ProcurementTenderInterface';
import {
  ICreateProcurementTenderAdditionalCostCommand,
  IDeleteProcurementTenderAdditionalCostCommand,
  IProcurementTenderAdditionalCost,
  IUpdateProcurementTenderAdditionalCostCommand,
} from '../../../domain/interfaces/ProcurementTenderAdditionalCost';
import {
  ICreateProcurementTenderDetailCommand,
  IDeleteProcurementTenderDetailCommand,
  IProcurementTenderDetail,
  IUpdateProcurementTenderDetailCommand,
} from '../../../domain/interfaces/ProcurementTenderDetailInterface';
import ProcurementTenderDetail from './ProcurementTenderDetail/ProcurementTenderDetail';
import {
  useGetAllTenderNoQuery,
  useGetTenderAnalysisReportQuery,
  useProcessSaveTenderMutation,
} from '../../../infrastructure/api/TenderApiSlice';
import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { checkArrayContents } from '../../Utils/Util';
import { useLazySendEmailToNextEventUserQuery } from '../../../infrastructure/api/EmailApiSlice';

type Props = {};

const TenderRequisiton = ({ modalPageOpenerClose, clickedCardInfo }: any) => {
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

  const [tenderInfo, setTenderInfo] = useState<ITenderNoComboBox | null>(null);

  const [emailInfoState, setEmailInfoState] = useState<any>();

  // useEffect(() => {
  //   console.log(`rupom flowed evet/tender no dekh : ----> `);
  //   if (clickedCardInfo?.eventNo) {
  //     const tempTenderInfo: ITenderNoComboBox = {
  //       procurementTenderId: 0,
  //       tenderNo: clickedCardInfo?.eventNo,
  //     };
  //     setTenderInfo(tempTenderInfo);
  //   }
  // }, [tenderInfo?.tenderNo]);

  // tender autocomp options

  // ------------emailRtkQuery---------------------

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

  // ei api ta ekhaneo call disi, karon aage theke tenderInfo set na kore vitore set korle kaaj hoitesena, apatoto korlam
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
    } else if (
      tenderComboOptionsIsSuccess &&
      !tenderComboOptionsIsError &&
      !tenderComboOptionsLoading &&
      !tenderComboOptionIsFetching &&
      tenderComboOptions
    ) {
      if (clickedCardInfo?.eventNo) {
        const tenderObj = tenderComboOptions.find(
          (row) => row.tenderNo === clickedCardInfo?.eventNo
        );
        const tenderObjTemp = tenderObj || null;
        setTenderInfo(tenderObjTemp);
      }
    }
  }, [
    tenderComboOptionsLoading,
    tenderComboOptionsIsError,
    tenderComboOptionsError,
    tenderComboOptionsIsSuccess,
  ]);

  const {
    data: tenderAnalysisReportData,
    isLoading: tenderAnalysisReportLoading,
    isSuccess: tenderAnalysisReportIsSuccess,
    error: tenderAnalysisReportError,
    isError: tenderAnalysisReportIsError,
    isFetching: tenderAnalysisReportIsFetching,
    refetch: tenderAnalysisReportRefetch,
  } = useGetTenderAnalysisReportQuery(
    {
      tenderNo: tenderInfo?.tenderNo || '',
    },
    { skip: !tenderInfo?.procurementTenderId }
  );

  useEffect(() => {
    if (tenderAnalysisReportIsError) {
      toast.error(
        'Something wrong from backend while fetching tenderAnalysisReportData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching tenderAnalysisReportData, see console--->:'
      );
      console.log(tenderAnalysisReportError);
    } else if (
      tenderAnalysisReportIsSuccess &&
      !tenderAnalysisReportIsError &&
      !tenderAnalysisReportLoading &&
      !tenderAnalysisReportIsFetching &&
      tenderAnalysisReportData
    ) {
      // do nothing
    }
  }, [
    tenderAnalysisReportLoading,
    tenderAnalysisReportIsError,
    tenderAnalysisReportError,
    tenderAnalysisReportIsSuccess,
    tenderAnalysisReportIsFetching,
  ]);

  // -------------------[procurement tender states]-------------------
  const [procurementTenderState, setProcurementTenderState] =
    useState<IProcurementTender | null>(null);
  const [procurementTenderPrevState, setProcurementTenderPrevState] =
    useState<IProcurementTender | null>(null);

  // -------------------[procurement detail states]-------------------

  const [procurementTenderDetailState, setProcurementTenderDetailState] =
    useState<IProcurementTenderDetail[]>([]);
  const [
    procurementTenderDetailStatePrev,
    setProcurementTenderDetailStatePrev,
  ] = useState<IProcurementTenderDetail[]>([]);
  const [
    deletedRowProcurementTenderDetail,
    setDeletedRowProcurementTenderDetail,
  ] = useState<IDeleteProcurementTenderDetailCommand[]>([]);

  // -------------------[procurement Additional cost states]-------------------
  const [
    procurementTenderAdditionalCostState,
    setProcurementTenderAdditionalCostState,
  ] = useState<IProcurementTenderAdditionalCost[]>([]);
  const [
    procurementTenderAdditionalCostStatePrev,
    setProcurementTenderAdditionalCostStatePrev,
  ] = useState<IProcurementTenderAdditionalCost[]>([]);
  const [
    deletedRowProcurementTenderAdditionalCost,
    setDeletedRowProcurementTenderAdditionalCost,
  ] = useState<IDeleteProcurementTenderAdditionalCostCommand[]>([]);

  // ------------------------------[API hooks]-----------------------------------

  const [
    processSaveTender,
    {
      isLoading: processSaveTenderIsLoading,
      isError: processSaveTenderIsError,
      error: processSaveTenderError,
      isSuccess: processSaveTenderIsSuccess,
      data: processSaveTenderData,
    },
  ] = useProcessSaveTenderMutation();

  useEffect(() => {
    // if (!processSaveTenderIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveTenderIsSuccess) {
      if (emailInfoState?.progressPReported === 100) {
        triggerSendEmailToNextEventUser({
          companyId: emailInfoState?.companyId || 0,
          fixedTaskTemplateId: emailInfoState?.fixedTaskTemplateId || 0,
          firstEventNo:
            clickedCardInfo.sequence === 1
              ? processSaveTenderData?.tenderNo
              : emailInfoState?.firstEventNo,
        });
      }

      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Tender has been saved successfully!`,
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
        if (result.isConfirmed) {
          // modalPageOpenerClose();
          console.log('check data after success, see console---->');
          console.log(processSaveTenderData);
          if (tenderInfo?.procurementTenderId) {
            setTenderInfo({ ...tenderInfo });
          } else {
            setTenderInfo({
              procurementTenderId:
                processSaveTenderData?.procurementTenderId || 0,
              tenderNo: processSaveTenderData?.tenderNo || '',
            });
          }
          tenderAnalysisReportRefetch();
        }
      });
    } else if (processSaveTenderIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving Tender data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving Tender data, see console---->'
      );
      console.log(processSaveTenderError);
    }
  }, [
    processSaveTenderIsLoading,
    processSaveTenderIsError,
    processSaveTenderData,
    processSaveTenderError,
    processSaveTenderIsSuccess,
  ]);

  // ------------------------------[functions]------------------------------

  const procurementTenderProcessing = () => {
    // -----------------[ProcurementTender Processing]--------------------

    let createProcurementTenderCommand: ICreateProcurementTenderCommand | null =
      null;
    let updateProcurementTenderCommand: IUpdateProcurementTenderCommand | null =
      null;

    const prevProcurementTender: IProcurementTender | null =
      procurementTenderPrevState
        ? JSON.parse(JSON.stringify(procurementTenderPrevState))
        : null;

    const currentProcurementTender: IProcurementTender | null = {
      procurementTenderId: procurementTenderState?.procurementTenderId || 0,
      tenderNo: procurementTenderState?.tenderNo || null,
      tenderEntryDate: procurementTenderState?.tenderEntryDate
        ? `${dayjs(getValues('tenderEntryDate')).format('YYYY-MM-DD')}T${dayjs(
            getValues('tenderEntryDate')
          ).format('HH:mm')}:00`
        : `${dayjs().format('YYYY-MM-DD')}T${dayjs().format('HH:mm')}:00`,
      bgExpiryDate: procurementTenderState?.bgExpiryDate
        ? `${dayjs(getValues('bgExpiryDate')).format('YYYY-MM-DD')}T${dayjs(
            getValues('bgExpiryDate')
          ).format('HH:mm')}:00`
        : `${dayjs().format('YYYY-MM-DD')}T${dayjs().format('HH:mm')}:00`,
      buyerId: getValues('buyer')?.buyerId || null,
      buyerName: getValues('buyer')?.buyerName || null,
      bgAmount: parseFloat(getValues('bgAmount')) || null,
      // salesPersonId: getValues('salesPerson').salesPersonId,
      // salesPersonName: getValues('salesPerson').salesPersonName,
      salesPersonId: procurementTenderState?.salesPersonId || null,
      salesPersonName: procurementTenderState?.salesPersonName || null,
      remarks: getValues('remarks'),
      tenderSubmissionDate: procurementTenderState?.tenderSubmissionDate
        ? `${dayjs(getValues('tenderSubmissionDate')).format(
            'YYYY-MM-DD'
          )}T${dayjs(getValues('tenderSubmissionDate')).format('HH:mm')}:00`
        : `${dayjs().format('YYYY-MM-DD')}T${dayjs().format('HH:mm')}:00`,
      schedulePrice: parseFloat(getValues('schedulePrice')),
      earnestMoney: getValues('earnestMoney').optionName,
      earnestMoneyAmount: parseFloat(getValues('earnestMoneyAmount')),
    };

    // const currentProcurementTender: IProcurementTender | null =
    //   procurementTenderState
    //     ? JSON.parse(JSON.stringify(procurementTenderState))
    //     : null;

    console.log('maal gula dekhe ne---->');
    console.log('prevProcurementTender---->');
    console.log(prevProcurementTender);
    console.log(JSON.stringify(prevProcurementTender));

    console.log('currentProcurementTender---->');
    console.log(currentProcurementTender);
    console.log(JSON.stringify(currentProcurementTender));

    console.log('boolean---->');
    console.log(
      JSON.stringify(prevProcurementTender) ===
        JSON.stringify(currentProcurementTender)
    );

    const noChangeInProcurementTender =
      JSON.stringify(prevProcurementTender) ===
      JSON.stringify(currentProcurementTender);

    if (
      !tenderInfo?.procurementTenderId &&
      !noChangeInProcurementTender &&
      currentProcurementTender &&
      currentProcurementTender?.buyerId
    ) {
      createProcurementTenderCommand = {
        procurementTenderId: 0,
        tenderNo: null,
        tenderEntryDate: currentProcurementTender.tenderEntryDate
          ? (currentProcurementTender.tenderEntryDate as string)
          : null,
        bgExpiryDate: currentProcurementTender.bgExpiryDate
          ? (currentProcurementTender.bgExpiryDate as string)
          : null,
        buyerId: currentProcurementTender.buyerId,
        bgAmount: currentProcurementTender.bgAmount
          ? currentProcurementTender.bgAmount
          : null,
        salesPersonId: currentProcurementTender.salesPersonId
          ? currentProcurementTender.salesPersonId
          : null,
        remarks: currentProcurementTender.remarks
          ? currentProcurementTender.remarks
          : null,
        tenderSubmissionDate: currentProcurementTender.tenderSubmissionDate
          ? currentProcurementTender.tenderSubmissionDate
          : null,
        schedulePrice: currentProcurementTender.schedulePrice
          ? currentProcurementTender.schedulePrice
          : null,
        earnestMoney: currentProcurementTender.earnestMoney
          ? currentProcurementTender.earnestMoney
          : '',
        earnestMoneyAmount: currentProcurementTender.earnestMoneyAmount
          ? currentProcurementTender.earnestMoneyAmount
          : 0,
        companyId: userInfo?.companyId || 0,
      };
    } else if (
      tenderInfo?.procurementTenderId &&
      !noChangeInProcurementTender &&
      currentProcurementTender &&
      currentProcurementTender?.buyerId
    ) {
      updateProcurementTenderCommand = {
        procurementTenderId: tenderInfo.procurementTenderId,
        tenderNo: tenderInfo.tenderNo,
        tenderEntryDate: currentProcurementTender.tenderEntryDate
          ? (currentProcurementTender.tenderEntryDate as string)
          : null,
        bgExpiryDate: currentProcurementTender.bgExpiryDate
          ? (currentProcurementTender.bgExpiryDate as string)
          : null,
        buyerId: currentProcurementTender.buyerId,
        bgAmount: currentProcurementTender.bgAmount
          ? currentProcurementTender.bgAmount
          : null,
        salesPersonId: currentProcurementTender.salesPersonId
          ? currentProcurementTender.salesPersonId
          : null,
        remarks: currentProcurementTender.remarks
          ? currentProcurementTender.remarks
          : null,
        tenderSubmissionDate: currentProcurementTender.tenderSubmissionDate
          ? currentProcurementTender.tenderSubmissionDate
          : null,
        schedulePrice: currentProcurementTender.schedulePrice
          ? currentProcurementTender.schedulePrice
          : null,
        earnestMoney: currentProcurementTender.earnestMoney
          ? currentProcurementTender.earnestMoney
          : '',
        earnestMoneyAmount: currentProcurementTender.earnestMoneyAmount
          ? currentProcurementTender.earnestMoneyAmount
          : 0,
      };
      console.log('yoooo rupommmmmm dekh!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(updateProcurementTenderCommand);
    }

    return {
      createProcurementTenderCommand,
      updateProcurementTenderCommand,
    };
    // -----------------[----DONE----  ProcurementTender Processing ----DONE----]--------------------
  };
  const procurementTenderDetailProcessing = () => {
    // -----------------[ProcurementTenderDetail Processing]--------------------

    const createProcurementTenderDetailCommand: ICreateProcurementTenderDetailCommand[] =
      [];
    const updateProcurementTenderDetailCommand: IUpdateProcurementTenderDetailCommand[] =
      [];
    const deleteProcurementTenderDetailCommand: IDeleteProcurementTenderDetailCommand[] =
      [...deletedRowProcurementTenderDetail];

    const prevProcurementTenderDetail: IProcurementTenderDetail[] = JSON.parse(
      JSON.stringify(procurementTenderDetailStatePrev)
    );
    let currentProcurementTenderDetail: IProcurementTenderDetail[] = JSON.parse(
      JSON.stringify(procurementTenderDetailState)
    );
    const deletedProcurementDetailRows: IDeleteProcurementTenderDetailCommand[] =
      JSON.parse(JSON.stringify(deletedRowProcurementTenderDetail));
    // loading naame ekta property add korsilam, oita muisa ditesi
    currentProcurementTenderDetail = currentProcurementTenderDetail.map(
      (obj) => {
        // eslint-disable-next-line no-param-reassign
        delete obj.loading;
        return obj;
      }
    );

    // eliminating all faka dummy rows
    currentProcurementTenderDetail = currentProcurementTenderDetail.filter(
      (obj) => Object.values(obj).some((val) => val)
    );

    prevProcurementTenderDetail.sort(
      (a, b) =>
        (a.procurementTenderDetailId ?? 0) - (b.procurementTenderDetailId ?? 0)
    );

    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Current Procurement Tender detail!!!!!!!!!!!!!!!!!!!!!!!!'
    );
    console.log(currentProcurementTenderDetail);

    const rowsWithId: IProcurementTenderDetail[] = [];

    for (let i = 0; i < currentProcurementTenderDetail.length; i++) {
      // jegulay primaryKey id nai, oigula sure to create
      if (!currentProcurementTenderDetail[i].procurementTenderDetailId) {
        const tempObj: ICreateProcurementTenderDetailCommand = {
          // procurementTenderDetailId: 0,
          procurementTenderId: tenderInfo?.procurementTenderId
            ? tenderInfo?.procurementTenderId
            : null,
          productGroupId: currentProcurementTenderDetail[i].productGroupId || 0,
          productId: currentProcurementTenderDetail[i].productId || null,
          quantity: currentProcurementTenderDetail[i].quantity || null,
          price: currentProcurementTenderDetail[i].price || null,
          initialFactor:
            currentProcurementTenderDetail[i].initialFactor || null,
          productSource:
            currentProcurementTenderDetail[i].productSource || null,
          prework: currentProcurementTenderDetail[i].prework || null,
          shareOfLoad: currentProcurementTenderDetail[i].shareOfLoad || null,
          deliveryTimeline:
            currentProcurementTenderDetail[i].deliveryTimeline || null,
          remarks: currentProcurementTenderDetail[i].remarks || null,
        };
        createProcurementTenderDetailCommand.push(tempObj);
      } else {
        rowsWithId.push(currentProcurementTenderDetail[i]);
      }
    }

    // ekhon deleted aar id wala rows ekshathe mishaya sort dibo, then compare korbo, compare e jodi equal na hoy tahole abar if diye check korbo oder primaryId baade j kono ekta mandatory field e value ase naki(jehetu delete er gulay shudhu primaryId ase), jodi thake then rowToUpdate e dhukabo

    const withIdandDeletedrows: any = [
      ...rowsWithId,
      ...deletedProcurementDetailRows,
    ];
    withIdandDeletedrows.sort(
      (a: any, b: any) =>
        (a.procurementTenderDetailId ?? 0) - (b.procurementTenderDetailId ?? 0)
    );

    console.log('prevProcurementTenderDetail-->');
    console.log(prevProcurementTenderDetail);
    console.log('withIdandDeletedrows-->');
    console.log(withIdandDeletedrows);

    // alert('haha');

    for (let i = 0; i < withIdandDeletedrows.length; i++) {
      const prevRow = JSON.stringify(prevProcurementTenderDetail[i]);
      const gridRow = JSON.stringify(withIdandDeletedrows[i]);

      if (prevRow !== gridRow) {
        if (
          withIdandDeletedrows[i].procurementTenderDetailId &&
          (withIdandDeletedrows[i].productGroupId ||
            withIdandDeletedrows[i].productId ||
            withIdandDeletedrows[i].quantity)
        ) {
          const tempObjUpdate: IUpdateProcurementTenderDetailCommand = {
            procurementTenderDetailId:
              withIdandDeletedrows[i].procurementTenderDetailId || 0,
            procurementTenderId: tenderInfo?.procurementTenderId || 0,
            productGroupId: withIdandDeletedrows[i].productGroupId || 0,
            productId: withIdandDeletedrows[i].productId || null,
            quantity: withIdandDeletedrows[i].quantity || null,
            price: withIdandDeletedrows[i].price || null,
            initialFactor: withIdandDeletedrows[i].initialFactor || null,
            productSource: withIdandDeletedrows[i].productSource || null,
            prework: withIdandDeletedrows[i].prework || null,
            shareOfLoad: withIdandDeletedrows[i].shareOfLoad || null,
            deliveryTimeline: withIdandDeletedrows[i].deliveryTimeline || null,
            remarks: withIdandDeletedrows[i].remarks || null,
          };
          updateProcurementTenderDetailCommand.push(tempObjUpdate);
        }
      }
    }
    return {
      createProcurementTenderDetailCommand,
      updateProcurementTenderDetailCommand,
      deleteProcurementTenderDetailCommand,
    };
    // -----------------[----DONE----ProcurementTenderDetail Processing  ----DONE----]--------------------
  };
  const procurementTenderAdditionalCostProcessing = () => {
    // -----------------[ProcurementTenderAdditionalCost Processing]--------------------

    const createProcurementTenderAdditionalCostCommand: ICreateProcurementTenderAdditionalCostCommand[] =
      [];
    const updateProcurementTenderAdditionalCostCommand: IUpdateProcurementTenderAdditionalCostCommand[] =
      [];
    const deleteProcurementTenderAdditionalCostCommand: IDeleteProcurementTenderAdditionalCostCommand[] =
      [...deletedRowProcurementTenderAdditionalCost];

    const prevProcurementTenderAdditionalCost: IProcurementTenderAdditionalCost[] =
      JSON.parse(JSON.stringify(procurementTenderAdditionalCostStatePrev));

    let currentProcurementTenderAdditionalCost: IProcurementTenderAdditionalCost[] =
      JSON.parse(JSON.stringify(procurementTenderAdditionalCostState));

    const deletedProcurementAdditionalCostRows: IDeleteProcurementTenderAdditionalCostCommand[] =
      JSON.parse(JSON.stringify(deletedRowProcurementTenderAdditionalCost));

    // eliminating all faka dummy rows
    currentProcurementTenderAdditionalCost =
      currentProcurementTenderAdditionalCost.filter((obj) =>
        Object.values(obj).some((val) => val)
      );

    prevProcurementTenderAdditionalCost.sort(
      (a, b) =>
        (a.procurementTenderAdditionalCostId ?? 0) -
        (b.procurementTenderAdditionalCostId ?? 0)
    );

    const rowsWithId: IProcurementTenderAdditionalCost[] = [];

    console.log('currentProcurementTenderAdditionalCost-------------->');
    console.log(currentProcurementTenderAdditionalCost);

    for (let i = 0; i < currentProcurementTenderAdditionalCost.length; i++) {
      // jegulay primaryKey id nai, oigula sure to create
      if (
        !currentProcurementTenderAdditionalCost[i]
          .procurementTenderAdditionalCostId
      ) {
        const tempObj: ICreateProcurementTenderAdditionalCostCommand = {
          // procurementTenderAdditionalCostId: 0,
          procurementTenderId: tenderInfo?.procurementTenderId
            ? tenderInfo?.procurementTenderId
            : null,

          name: currentProcurementTenderAdditionalCost[i].name || '',
          description: currentProcurementTenderAdditionalCost[i].description,
          accountsId: currentProcurementTenderAdditionalCost[i].accountsId,
          percentage: currentProcurementTenderAdditionalCost[i].percentage || 0,
          amount: currentProcurementTenderAdditionalCost[i].amount,
        };
        createProcurementTenderAdditionalCostCommand.push(tempObj);
      } else {
        rowsWithId.push(currentProcurementTenderAdditionalCost[i]);
      }
    }

    // ekhon deleted aar id wala rows ekshathe mishaya sort dibo, then compare korbo, compare e jodi equal na hoy tahole abar if diye check korbo oder primaryId baade j kono ekta mandatory field e value ase naki(jehetu delete er gulay shudhu primaryId ase), jodi thake then rowToUpdate e dhukabo

    const withIdandDeletedrows: any = [
      ...currentProcurementTenderAdditionalCost,
      ...deletedProcurementAdditionalCostRows,
    ];
    withIdandDeletedrows.sort(
      (a: any, b: any) =>
        (a.procurementTenderAdditionalCostId ?? 0) -
        (b.procurementTenderAdditionalCostId ?? 0)
    );

    for (let i = 0; i < withIdandDeletedrows.length; i++) {
      const prevRow = JSON.stringify(prevProcurementTenderAdditionalCost[i]);
      const gridRow = JSON.stringify(withIdandDeletedrows[i]);

      if (prevRow !== gridRow) {
        if (
          withIdandDeletedrows[i].procurementTenderAdditionalCostId &&
          (withIdandDeletedrows[i].name ||
            withIdandDeletedrows[i].description ||
            withIdandDeletedrows[i].accountsId)
        ) {
          const tempObjUpdate: IUpdateProcurementTenderAdditionalCostCommand = {
            procurementTenderAdditionalCostId:
              withIdandDeletedrows[i].procurementTenderAdditionalCostId,
            procurementTenderId: tenderInfo?.procurementTenderId || 0,
            name: withIdandDeletedrows[i].name || '',
            description: withIdandDeletedrows[i].description || null,
            accountsId: withIdandDeletedrows[i].accountsId || null,
            percentage: withIdandDeletedrows[i].percentage || 0,
            amount: withIdandDeletedrows[i].amount || 0,
          };
          updateProcurementTenderAdditionalCostCommand.push(tempObjUpdate);
        }
      }
    }
    return {
      createProcurementTenderAdditionalCostCommand,
      updateProcurementTenderAdditionalCostCommand,
      deleteProcurementTenderAdditionalCostCommand,
    };
    // -----------------[----DONE----ProcurementTenderAdditionalCost Processing  ----DONE----]--------------------
  };
  const processAllDataAndSave = () => {
    console.log('save button clicked');

    const x = procurementTenderProcessing();
    const y = procurementTenderDetailProcessing();
    const z = procurementTenderAdditionalCostProcessing();

    console.log('ProcurementTenderProcessing');
    console.log(x);
    console.log('ProcurementTenderProcessing Create----->>>');
    console.log('ProcurementTenderProcessing Update----->>>');

    console.log('procurementTenderDetailProcessing');
    console.log(y);
    console.log('procurementTenderDetailProcessing Create----->>>');
    console.log('procurementTenderDetailProcessing Update----->>>');
    console.log('procurementTenderDetailProcessing delete----->>>');

    console.log('procurementTenderAdditionalCostProcessing');
    console.log(z.createProcurementTenderAdditionalCostCommand);
    console.log('procurementTenderAdditionalCostProcessing Create----->>>');
    console.log('procurementTenderAdditionalCostProcessing Update----->>>');
    console.log('procurementTenderAdditionalCostProcessing Delete----->>>');

    console.log(
      'rupom dekh----------------------------------------------------->'
    );
    console.log(clickedCardInfo?.biznessEventProcessConfigurationId);

    const objToSend: IProcurementTenderProcessCommandsVM = {
      createProcurementTenderCommand:
        procurementTenderProcessing().createProcurementTenderCommand,
      updateProcurementTenderCommand:
        procurementTenderProcessing().updateProcurementTenderCommand,
      deleteProcurementTenderCommand: null,
      createProcurementTenderDetailCommand:
        procurementTenderDetailProcessing()
          .createProcurementTenderDetailCommand,
      updateProcurementTenderDetailCommand:
        procurementTenderDetailProcessing()
          .updateProcurementTenderDetailCommand,
      deleteProcurementTenderDetailCommand:
        procurementTenderDetailProcessing()
          .deleteProcurementTenderDetailCommand,
      createProcurementTenderAdditionalCostCommand:
        procurementTenderAdditionalCostProcessing()
          .createProcurementTenderAdditionalCostCommand,
      updateProcurementTenderAdditionalCostCommand:
        procurementTenderAdditionalCostProcessing()
          .updateProcurementTenderAdditionalCostCommand,
      deleteProcurementTenderAdditionalCostCommand:
        procurementTenderAdditionalCostProcessing()
          .deleteProcurementTenderAdditionalCostCommand,
      createBiznessEventPCTrackCommand: null,
      tenderNo: tenderInfo?.tenderNo || null,
    };

    if (areAllPropertiesFalsy(objToSend)) {
      toast.error('No changes has been made!');
      return false;
    }

    // pc track e data dhukabo kina and ki dhuka
    const tempTaskDate = dayjs().format('YYYY-MM-DD');
    const tempTaskTime = dayjs().format('HH:mm');
    const taskStartDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;
    const taskEndDate = `${tempTaskDate}T${tempTaskTime}:00.000Z`;

    const booleanVar =
      !!// clickedCardInfo?.biznessEventProcessConfigurationId &&
      // !!objToSend.createProcurementTenderCommand ||
      // !!objToSend.createProcurementTenderDetailCommand ||
      // objToSend.createProcurementTenderAdditionalCostCommand
      clickedCardInfo?.biznessEventProcessConfigurationId && false;

    // console.log('boolean var--->');
    // console.log(booleanVar);

    // if (
    //   clickedCardInfo?.biznessEventProcessConfigurationId &&
    //   (objToSend.createProcurementTenderCommand ||
    //     objToSend.createProcurementTenderDetailCommand ||
    //     objToSend.createProcurementTenderAdditionalCostCommand)
    // ) {
    objToSend.createBiznessEventPCTrackCommand = {
      // eventNo: clickedCardInfo?.eventNo,
      eventNo: tenderInfo?.tenderNo ? tenderInfo?.tenderNo : '',

      performedBy: userInfo.securityUserId,
      startDate: taskStartDate,
      endDate: taskEndDate,
      note: tenderInfo?.tenderNo ? 'Edited' : 'Added',
      progressPReported: 100,
      originalSequence: clickedCardInfo.sequence,
      nextSequence: 0,
      complete: false,
      biznessEventProcessConfigurationId:
        clickedCardInfo.biznessEventProcessConfigurationId,
      firstEventNo: clickedCardInfo.firstEventNo,
      locationId: clickedCardInfo.eventLocationId || userInfo.locationId || 0,
    };
    // } else {
    //   objToSend.createBiznessEventPCTrackCommand = null;
    // }

    console.log('Obj to send Finally haha see--------->>');
    console.log(objToSend);

    // ----on processPCTrack, save email state---------
    const emailInfo = {
      fixedTaskTemplateId: clickedCardInfo?.fixedTaskTemplateId,
      firstEventNo: objToSend.createBiznessEventPCTrackCommand.firstEventNo,
      companyId: userInfo?.companyId,
      progressPReported:
        objToSend.createBiznessEventPCTrackCommand.progressPReported,
    };
    setEmailInfoState(emailInfo);

    processSaveTender(objToSend);
  };

  const tenderAnalysisReportDownload = () => {
    console.log('tender analysis report has been downloaded');
    console.log(tenderAnalysisReportData);
    // tenderAnalysisReportRefetch();
    console.log('tenderAnalysisReportIsFetching boolean------------....');
    console.log(tenderAnalysisReportIsFetching);
    console.log(tenderAnalysisReportLoading);

    if (
      tenderAnalysisReportData &&
      !tenderAnalysisReportIsError &&
      tenderAnalysisReportIsSuccess &&
      !tenderAnalysisReportIsFetching &&
      tenderInfo?.procurementTenderId
    ) {
      const byteCharacters = atob(tenderAnalysisReportData?.data);
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
      link.download = `TenderAnalysisReport_For_${tenderInfo?.tenderNo}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optionally, revoke the object URL to free up memory
      URL.revokeObjectURL(blobUrl);
    }
  };

  function isEmpty(value: any) {
    if (value === null || value === undefined) {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  }

  function areAllPropertiesFalsy(obj: any) {
    return Object.values(obj).every(isEmpty);
  }

  console.log('clickedCardInfo?.extendedBiznessEventName------------>');
  console.log(clickedCardInfo?.extendedBiznessEventName);
  console.log(clickedCardInfo);

  // function checkArrayContents(array: string[]): string {
  //   // const sortedArray = array.sort();
  //   const arrayKey = array.join(',');

  //   switch (arrayKey) {
  //     case 'ProcurementTenderDetail':
  //       return 'Tender Product';
  //     case 'ProcurementTenderAdditionalCost':
  //       return 'Tender Additional';
  //     case 'ProcurementTenderDetail,ProcurementTenderAdditionalCost':
  //       return 'Tender Product Additional';
  //     case 'ProcurementTenderAdditionalCost,ProcurementTenderDetail':
  //       return 'Tender Product Additional';
  //     // Add more cases as needed
  //     default:
  //       return 'Tender';
  //   }
  // }

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block ">
          {/* Main Card */}
          <form onSubmit={handleSubmit(processAllDataAndSave)}>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
              {/* Main Card header */}
              <div className="py-3 bg-gray-100 text-slate-800 text-[14px] font-bold dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[Laboratory experimental place starts here]----- */}
                {checkArrayContents(
                  clickedCardInfo?.extendedBiznessEventName,
                  clickedCardInfo?.biznessEventName
                )}
                {/* ---//--[Laboratory experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className=" px-6 text-start  mt-2">
                <div className="mx-1 mt-1">
                  <ProcurementTender
                    procurementTenderState={procurementTenderState}
                    setProcurementTenderState={setProcurementTenderState}
                    procurementTenderPrevState={procurementTenderPrevState}
                    setProcurementTenderPrevState={
                      setProcurementTenderPrevState
                    }
                    tenderInfo={tenderInfo}
                    setTenderInfo={setTenderInfo}
                    formProps={formProps}
                    clickedCardInfo={clickedCardInfo}
                  />
                </div>
                {clickedCardInfo?.extendedBiznessEventName?.includes(
                  'ProcurementTenderDetail'
                ) ? (
                  <div className="mx-1 mt-1">
                    <ProcurementTenderDetail
                      tenderInfo={tenderInfo}
                      setTenderInfo={setTenderInfo}
                      clickedCardInfo={clickedCardInfo}
                      procurementTenderDetailState={
                        procurementTenderDetailState
                      }
                      setProcurementTenderDetailState={
                        setProcurementTenderDetailState
                      }
                      procurementTenderDetailStatePrev={
                        procurementTenderDetailStatePrev
                      }
                      setProcurementTenderDetailStatePrev={
                        setProcurementTenderDetailStatePrev
                      }
                      deletedRowProcurementTenderDetail={
                        deletedRowProcurementTenderDetail
                      }
                      setDeletedRowProcurementTenderDetail={
                        setDeletedRowProcurementTenderDetail
                      }
                      formProps={formProps}
                    />
                  </div>
                ) : (
                  ''
                )}

                {clickedCardInfo?.extendedBiznessEventName?.includes(
                  'ProcurementTenderAdditionalCost'
                ) ? (
                  <div className="mx-1 mt-1">
                    <ProcurementTenderAdditionalCost
                      tenderInfo={tenderInfo}
                      setTenderInfo={setTenderInfo}
                      procurementTenderAdditionalCostState={
                        procurementTenderAdditionalCostState
                      }
                      setProcurementTenderAdditionalCostState={
                        setProcurementTenderAdditionalCostState
                      }
                      procurementTenderAdditionalCostStatePrev={
                        procurementTenderAdditionalCostStatePrev
                      }
                      setProcurementTenderAdditionalCostStatePrev={
                        setProcurementTenderAdditionalCostStatePrev
                      }
                      deletedRowProcurementTenderAdditionalCost={
                        deletedRowProcurementTenderAdditionalCost
                      }
                      setDeletedRowProcurementTenderAdditionalCost={
                        setDeletedRowProcurementTenderAdditionalCost
                      }
                      formProps={formProps}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      // processAllDataAndSave();
                      console.log('Haha tender save submit called');
                    }}
                  >
                    {processSaveTenderIsLoading &&
                      tenderAnalysisReportIsFetching &&
                      tenderAnalysisReportLoading && (
                        <CircularProgress size={12} color="inherit" />
                      )}
                    {'  '}
                    {processSaveTenderIsLoading &&
                    tenderAnalysisReportIsFetching &&
                    tenderAnalysisReportLoading
                      ? 'Saving...'
                      : 'Save'}
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      tenderAnalysisReportIsFetching &&
                      tenderAnalysisReportLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => {
                      // processAllDataAndSave();
                      tenderAnalysisReportDownload();
                      console.log('report button called');
                    }}
                  >
                    {tenderAnalysisReportIsFetching &&
                      tenderAnalysisReportLoading && (
                        <CircularProgress size={12} color="inherit" />
                      )}
                    {'  '}
                    {tenderAnalysisReportIsFetching &&
                    tenderAnalysisReportLoading
                      ? 'Please wait...'
                      : 'Tender Analysis Report'}
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>

          {/* Main Card--/-- */}
        </div>
      </div>

      {/* // modals --- out of html normal body/position */}

      {/* --------------------------[Making a loader modal]--------------------------------------- */}

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default TenderRequisiton;
