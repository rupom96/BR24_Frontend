/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/ban-types */
// import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_Row,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Delete,
  Edit,
  EditAttributes,
  EditAttributesRounded,
  EditNote,
} from '@mui/icons-material';
import { ExportToCsv } from 'export-to-csv';
import { BsEye } from 'react-icons/bs';
import {
  ILocationDto,
  ISecurityUserDto,
  IUserInfo,
} from '../../../domain/interfaces/UserInfoInterface';

import { IBiznessEventOption } from '../../../domain/interfaces/IBiznessEventInterface';
import DualListSelector from '../../components/biz24Components/DualListSelector/DualListSelector';
import {
  useCreateFixedTaskTemplateMutation,
  useGetFixedTaskTemplateComboOptionsQuery,
} from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
import {
  useGetAllButtonListQuery,
  useGetBiznessEventProcessConfigurationInfoByFixedTaskTemplateIdQuery,
  useProcessBiznessEventProcessConfigurationsMutation,
} from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import {
  ICreateFixedTaskTemplate,
  IFixedTaskTemplateAutoComp,
  // IPCLocationListDto,
  // IPCProductGroupListDto,
  // IPCUserProductGroupListDto,
} from '../../../domain/interfaces/FixedTaskTemplateInterface';
import {
  IRequestPCLocationListDtos,
  useGetLocationByCompanyQuery,
} from '../../../infrastructure/api/LocationApiSlice';
import {
  useGetBrandByCompanyIdQuery,
  useGetProductByCompanyProductGroupIdQuery,
  useGetProductGroupByCompanyIdQuery,
} from '../../../infrastructure/api/ProductApiSlice';
import {
  IBrand,
  IProductGroupComboBox,
} from '../../../domain/interfaces/ProductInterfaces';
import DualListSelectorWithGrid from '../../components/biz24Components/DualListSelectorWithGrid/DualListSelectorWithGrid';
import { useGetAllBiznessEventsQuery } from '../../../infrastructure/api/BiznessEventApiSlice';
import DualListSelectorWithRowSelection from '../../components/biz24Components/DualListSelectorWithRowSelection/DualListSelectorWithRowSelection';
import { useGetSecurityUserByCompanyIdQuery } from '../../../infrastructure/api/SecurityUserApiSlice';
import {
  IBiznessEventProcessConfigurationInfoForChainConfig,
  ICreateBiznessEventProcessConfigurationInfoForChainConfig,
  ICreatePCBrandListDto,
  ICreatePCButtonListDto,
  ICreatePCLocationListDtos,
  ICreatePCProductGroupListDtos,
  ICreatePCUserBrandListDtos,
  ICreatePCUserListDtos,
  ICreatePCUserProductGroupListDtos,
  ICreatePCUserProductListDto,
  IDeleteBiznessEventProcessConfigurationInfoForChainConfig,
  IDeletePCBrandListDto,
  IDeletePCBrandListDtoVM,
  IDeletePCButtonListDto,
  IDeletePCButtonListDtoVM,
  IDeletePCLocationListDtos,
  IDeletePCLocationListDtosVM,
  IDeletePCProductGroupListDtos,
  IDeletePCProductGroupListDtosVM,
  IDeletePCUserBrandListDtos,
  IDeletePCUserBrandListDtosVM,
  IDeletePCUserListDtos,
  IDeletePCUserListDtosVM,
  IDeletePCUserProductGroupListDtos,
  IDeletePCUserProductGroupListDtosVM,
  IDeletePCUserProductListDto,
  IDeletePCUserProductListDtoVM,
  IPCBrandListDto,
  IPCButtonListDto,
  IPCLocationListDtos,
  IPCProductGroupListDtos,
  IPCUserBrandListDtos,
  IPCUserListDtos,
  IPCUserProductGroupListDtos,
  IPCUserProductListDto,
  IProcessConfigurationInfoForChainConfig,
  IUpdateBiznessEventProcessConfigurationInfoForChainConfig,
  IUpdatePCUserBrandListDtos,
  IUpdatePCUserListDtos,
  IUpdatePCUserProductGroupListDtos,
  IUpdatePCUserProductListDto,
} from '../../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
import DualListSelectorWithLimit from '../../components/biz24Components/DualListSelectorWithLimit/DualListSelectorWithLimit';

const API_BASE_URL = window.API_BASE_URL;

const ChainConfiguration = ({
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

  // ----------------------USE STATES ---------------------------
  const [selectedFixedTaskTemplate, setSelectedFixedTaskTemplate] =
    useState<IFixedTaskTemplateAutoComp | null>(null);

  const [bepcGridState, setBepcGridState] = useState<
    IBiznessEventProcessConfigurationInfoForChainConfig[]
  >([]);

  const [bepcGridStateNotDirty, setBepcGridStateNotDirty] = useState<
    IBiznessEventProcessConfigurationInfoForChainConfig[]
  >([]);

  const [bepcGridStateDeletedRow, setBepcGridStateDeletedRow] = useState<
    IDeleteBiznessEventProcessConfigurationInfoForChainConfig[]
  >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  const [selectedBepcRow, setSelectedBepcRow] = useState<MRT_RowSelectionState>(
    {}
  );

  const [selectedLocationDLRow, setSelectedLocationDLRow] =
    useState<ILocationDto | null>(null);
  const [selectedLocationDLWholeRowInfo, setSelectedLocationDLWholeRowInfo] =
    useState<IPCLocationListDtos | null>(null);
  const [selectedUsersDLTRow, setSelectedUsersDLTRow] =
    useState<MRT_RowSelectionState>({});

  const [isAllSelectedPCUserProductGroup, setIsAllSelectedPCUserProductGroup] =
    useState(false);
  const [isAllSelectedPCUserProduct, setIsAllSelectedPCUserProduct] =
    useState(false);
  const [isAllSelectedPCUserBrand, setIsAllSelectedPCUserBrand] =
    useState(false);

  // ---------------------USE STATES-----------------ENDS---

  // modal states and functions-------------------

  const [specModal, setSpecModal] = useState<boolean>(false);
  const handleSpecModalClose = () => {
    setSpecModal(false);
    reset();
  };

  const [fixedTaskTemplateCreateModal, setFixedTaskTemplateCreateModal] =
    useState<boolean>(false);
  const handleFixedTaskTemplateCreateModalClose = () => {
    reset();
    setFixedTaskTemplateCreateModal(false);
  };

  const [selectedItemsLocation, setSelectedItemsLocation] = useState<
    IPCLocationListDtos[]
  >([]);
  const [deletedItemsLocation, setDeletedItemsLocation] = useState<
    IDeletePCLocationListDtosVM[]
  >([]);

  const [selectedItemsPCProductGroup, setSelectedItemsPCProductGroup] =
    useState<IPCProductGroupListDtos[]>([]);
  const [deletedItemsPCProductGroup, setDeletedItemsPCProductGroup] = useState<
    IDeletePCProductGroupListDtosVM[]
  >([]);

  const [selectedItemsPCProductBrand, setSelectedItemsPCProductBrand] =
    useState<IPCBrandListDto[]>([]);
  const [deletedItemsPCProductBrand, setDeletedItemsPCProductBrand] = useState<
    IDeletePCBrandListDtoVM[]
  >([]);

  const [selectedItemsPCUserProductGroup, setSelectedItemsPCUserProductGroup] =
    useState<IPCUserProductGroupListDtos[]>([]);
  const [deletedItemsPCUserProductGroup, setDeletedItemsPCUserProductGroup] =
    useState<IDeletePCUserProductGroupListDtosVM[]>([]);

  const [selectedItemsPCUserProductBrand, setSelectedItemsPCUserProductBrand] =
    useState<IPCUserBrandListDtos[]>([]);
  const [deletedItemsPCUserProductBrand, setDeletedItemsPCUserProductBrand] =
    useState<IDeletePCUserBrandListDtosVM[]>([]);

  const [selectedItemsPCUserProduct, setSelectedItemsPCUserProduct] = useState<
    IPCUserProductListDto[]
  >([]);
  const [deletedItemsPCUserProduct, setDeletedItemsPCUserProduct] = useState<
    IDeletePCUserProductListDtoVM[]
  >([]);

  const [selectedItemsPCUserButton, setSelectedItemsPCUserButton] = useState<
    IPCButtonListDto[]
  >([]);
  const [deletedItemsPCUserButton, setDeletedItemsPCUserButton] = useState<
    IDeletePCButtonListDtoVM[]
  >([]);

  const [selectedItemsUsers, setSelectedItemsUsers] = useState<
    IPCUserListDtos[]
  >([]);
  const [deletedItemsUsers, setDeletedItemsUsers] = useState<
    IDeletePCUserListDtosVM[]
  >([]);

  const [modalOpendedIndexBepcGrid, setModalOpendedIndexBepcGrid] = useState<
    number | null
  >(null);

  // modal states and functions-------ENDS------------

  // -----useStates----ENDS----

  // ------------------------- API CALLS and with associated useEffects --------------------------------------
  const {
    data: fixedTaskTemplateOptions,
    isLoading: fixedTaskTemplateOptionsLoading,
    error: fixedTaskTemplateOptionsError,
    isSuccess: fixedTaskTemplateOptionsIsSuccess,
    isError: fixedTaskTemplateOptionsIsError,
    isFetching: fixedTaskTemplateOptionsIsFetching,
    refetch: fixedTaskTemplateOptionsRefetch,
  } = useGetFixedTaskTemplateComboOptionsQuery({
    companyId: userInfo?.companyId,
  });

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

  const {
    data: biznessEventProcessConfigurationInfo,
    isLoading: biznessEventProcessConfigurationInfoLoading,
    error: biznessEventProcessConfigurationInfoError,
    isSuccess: biznessEventProcessConfigurationInfoIsSuccess,
    isError: biznessEventProcessConfigurationInfoIsError,
    isFetching: biznessEventProcessConfigurationInfoIsFetching,
    refetch: biznessEventProcessConfigurationInfoRefetch,
  } = useGetBiznessEventProcessConfigurationInfoByFixedTaskTemplateIdQuery(
    {
      fixedTaskTemplateId: selectedFixedTaskTemplate?.fixedTaskTemplateId || 0,
    }
    // { skip: !selectedFixedTaskTemplate?.fixedTaskTemplateId }
  );

  function setFetchedBepcInfo() {
    console.log('biznessEventProcessConfigurationInfo');
    console.log(biznessEventProcessConfigurationInfo?.data);
    const emptyArray: IBiznessEventProcessConfigurationInfoForChainConfig[] =
      [];
    let loopLength = biznessEventProcessConfigurationInfo?.data
      ? (biznessEventProcessConfigurationInfo?.data?.length || 0) > 10
        ? 10
        : biznessEventProcessConfigurationInfo?.data.length || 0
      : 0; // rupomData change hoye biznessEventProcessConfigurationInfo?.data hobe pore
    loopLength = loopLength === 10 ? 9 : loopLength;
    for (let i = 0; i < 10 - loopLength; i++) {
      const tempObj: IBiznessEventProcessConfigurationInfoForChainConfig = {
        biznessEventProcessConfigurationId: 0,
        fixedTaskTemplateId: 0,
        biznessEventId: 0,
        biznessEventName: '',
        controllerPath: '',
        controllerParameter: '',
        sequence: 0,
        mailTemplate: '',
        smsTemplate: '',
        dateOfEntry: '',
        enteredById: 0,
        mandatoryAttachment: false,
        actionType: '',
        prevBiznessEventId: 0,
        nextActionMethod: null,
        relationKey: '',
        maxTimeInHours: 0,
        maxTimeInDays: 0,
        extendedBiznessEventId: '',
        pcLocationListDtos: [],
        pcProductGroupListDtos: [],
        pcBrandListDtos: [],
      };
      emptyArray.push(tempObj);
    }

    const tempArrayVar: IBiznessEventProcessConfigurationInfoForChainConfig[] =
      biznessEventProcessConfigurationInfo?.data
        ? JSON.parse(JSON.stringify(biznessEventProcessConfigurationInfo?.data))
        : [];

    // setBepcGridState([...tempArrayVar, ...emptyArray]);
    if (
      biznessEventProcessConfigurationInfo?.data &&
      !biznessEventProcessConfigurationInfoIsError &&
      biznessEventProcessConfigurationInfoIsSuccess
    ) {
      setBepcGridState([...tempArrayVar, ...emptyArray]);

      const tempArrayVarCopy = JSON.parse(JSON.stringify(tempArrayVar));
      const emptyArrayCopy = JSON.parse(JSON.stringify(emptyArray));
      setBepcGridStateNotDirty([...tempArrayVarCopy, ...emptyArrayCopy]);

      setSelectedBepcRow({});
      setSelectedLocationDLWholeRowInfo(null);
      setSelectedUsersDLTRow({});
    } else {
      setBepcGridState([...emptyArray]);
      const emptyArrayCopy = JSON.parse(JSON.stringify(emptyArray));
      setBepcGridStateNotDirty([...emptyArrayCopy]);

      setSelectedBepcRow({});
      setSelectedLocationDLWholeRowInfo(null);
      setSelectedUsersDLTRow({});
    }
  }

  useEffect(() => {
    // emptying the deleted row of master grid while fetching masterGrid info on changing fixedTaskTemplate
    setBepcGridStateDeletedRow([]);
    setSelectedBepcRow({});
    // setSelectedLocationDLRow(null);
    // setSelectedUsersDLTRow({});
    // setBepcGridState([]);
    if (biznessEventProcessConfigurationInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching biznessEventProcessConfigurationInfo options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching biznessEventProcessConfigurationInfo for autocomplete, see console--->:'
      );
      console.log(biznessEventProcessConfigurationInfoError);
    }
    if (biznessEventProcessConfigurationInfoIsSuccess) {
      console.log('biznessEventProcessConfigurationInfo');
      console.log(biznessEventProcessConfigurationInfo);
      // if (biznessEventProcessConfigurationInfo.succeeded) {

      // }
    }
    setFetchedBepcInfo();
  }, [
    biznessEventProcessConfigurationInfoLoading,
    biznessEventProcessConfigurationInfoIsFetching,
    biznessEventProcessConfigurationInfoError,
    biznessEventProcessConfigurationInfoIsError,
    biznessEventProcessConfigurationInfo,
    biznessEventProcessConfigurationInfoIsSuccess,
    selectedFixedTaskTemplate?.fixedTaskTemplateId,
  ]);

  const {
    data: locationOptions,
    isLoading: locationOptionsLoading,
    error: locationOptionsError,
    isSuccess: locationOptionsIsSuccess,
    isError: locationOptionsIsError,
    isFetching: locationOptionsIsFetching,
    refetch: locationOptionsRefetch,
  } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

  useEffect(() => {
    if (locationOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching locationOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching locationOptions for autocomplete, see console--->:'
      );
      console.log(locationOptionsError);
    }
    if (locationOptionsIsSuccess) {
      console.log('locationOptions');
      console.log(locationOptions);
    }
  }, [
    locationOptionsLoading,
    locationOptionsIsFetching,
    locationOptionsError,
    locationOptionsIsError,
    locationOptions,
    locationOptionsIsSuccess,
  ]);

  const {
    data: brandOptions,
    isLoading: brandOptionsLoading,
    error: brandOptionsError,
    isSuccess: brandOptionsIsSuccess,
    isError: brandOptionsIsError,
    isFetching: brandOptionsIsFetching,
    refetch: brandOptionsRefetch,
  } = useGetBrandByCompanyIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (brandOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching brandOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching brandOptions for autocomplete, see console--->:'
      );
      console.log(brandOptionsError);
    }
    if (brandOptionsIsSuccess) {
      console.log('brandOptions');
      console.log(brandOptions);
    }
  }, [
    brandOptionsLoading,
    brandOptionsIsFetching,
    brandOptionsError,
    brandOptionsIsError,
    brandOptions,
    brandOptionsIsSuccess,
  ]);

  const {
    data: productGroupOptions,
    isLoading: productGroupOptionsLoading,
    error: productGroupOptionsError,
    isSuccess: productGroupOptionsIsSuccess,
    isError: productGroupOptionsIsError,
    isFetching: productGroupOptionsIsFetching,
    refetch: productGroupOptionsRefetch,
  } = useGetProductGroupByCompanyIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (productGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productGroupOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productGroupOptions for autocomplete, see console--->:'
      );
      console.log(productGroupOptionsError);
    }
    if (productGroupOptionsIsSuccess) {
      console.log('productGroupOptions');
      console.log(productGroupOptions);
    }
  }, [
    productGroupOptionsLoading,
    productGroupOptionsIsFetching,
    productGroupOptionsError,
    productGroupOptionsIsError,
    productGroupOptions,
    productGroupOptionsIsSuccess,
  ]);

  const {
    data: productOptions,
    isLoading: productOptionsLoading,
    error: productOptionsError,
    isSuccess: productOptionsIsSuccess,
    isError: productOptionsIsError,
    isFetching: productOptionsIsFetching,
    refetch: productOptionsRefetch,
  } = useGetProductByCompanyProductGroupIdQuery({
    companyId: userInfo?.companyId,
    productGroupId: 0,
  });

  useEffect(() => {
    if (productOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productOptions for autocomplete, see console--->:'
      );
      console.log(productOptionsError);
    }
    if (productOptionsIsSuccess) {
      console.log('productOptions');
      console.log(productOptions);
    }
  }, [
    productOptionsLoading,
    productOptionsIsFetching,
    productOptionsError,
    productOptionsIsError,
    productOptions,
    productOptionsIsSuccess,
  ]);

  const {
    data: biznessEventOptions,
    isLoading: biznessEventOptionsLoading,
    error: biznessEventOptionsError,
    isSuccess: biznessEventOptionsIsSuccess,
    isError: biznessEventOptionsIsError,
    isFetching: biznessEventOptionsIsFetching,
    refetch: biznessEventOptionsRefetch,
  } = useGetAllBiznessEventsQuery();

  useEffect(() => {
    if (biznessEventOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching biznessEventOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching biznessEventOptions for autocomplete, see console--->:'
      );
      console.log(biznessEventOptionsError);
    }
    if (biznessEventOptionsIsSuccess) {
      console.log('biznessEventOptions');
      console.log(biznessEventOptions);
    }
  }, [
    biznessEventOptionsLoading,
    biznessEventOptionsIsFetching,
    biznessEventOptionsError,
    biznessEventOptionsIsError,
    biznessEventOptions,
    biznessEventOptionsIsSuccess,
  ]);

  const {
    data: securityUserOptions,
    isLoading: securityUserOptionsLoading,
    error: securityUserOptionsError,
    isSuccess: securityUserOptionsIsSuccess,
    isError: securityUserOptionsIsError,
    isFetching: securityUserOptionsIsFetching,
    refetch: securityUserOptionsRefetch,
  } = useGetSecurityUserByCompanyIdQuery({
    companyId: userInfo?.companyId,
    locationId: selectedLocationDLWholeRowInfo?.locationId || 0,
  });

  useEffect(() => {
    if (securityUserOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching securityUserOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching securityUserOptions, see console--->:'
      );
      console.log(securityUserOptionsError);
    }
    if (securityUserOptionsIsSuccess) {
      console.log('securityUserOptions');
      console.log(securityUserOptions?.data);
    }
  }, [
    securityUserOptionsLoading,
    securityUserOptionsIsFetching,
    securityUserOptionsError,
    securityUserOptionsIsError,
    securityUserOptions,
    securityUserOptionsIsSuccess,
  ]);

  const getCurrentlySelectedBepcId = useCallback(() => {
    // Function logic here
    let bepcId = 0;
    const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
    const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
    if (selectedBepcRow[indexNoBepc]) {
      bepcId = bepcGridState[indexNoBepc].biznessEventProcessConfigurationId;
    } else {
      bepcId = 0;
    }
    return bepcId;
  }, [selectedBepcRow, bepcGridState]);
  const {
    data: buttonOptions,
    isLoading: buttonOptionsLoading,
    error: buttonOptionsError,
    isSuccess: buttonOptionsIsSuccess,
    isError: buttonOptionsIsError,
    isFetching: buttonOptionsIsFetching,
    refetch: buttonOptionsRefetch,
  } = useGetAllButtonListQuery({
    biznessEventProcessConfigurationId: getCurrentlySelectedBepcId(),
  });
  // re-rendering rtkQuery buttonOption fetch on bepcGridSelection Change
  useEffect(() => {
    if (selectedBepcRow) {
      // Adjust this condition based on your requirements
      buttonOptionsRefetch();
    }
  }, [selectedBepcRow, buttonOptionsRefetch]);
  useEffect(() => {
    if (buttonOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buttonOptions options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buttonOptions for autocomplete, see console--->:'
      );
      console.log(buttonOptionsError);
    }
    if (buttonOptionsIsSuccess) {
      console.log('buttonOptions');
      console.log(buttonOptions);
    }
  }, [
    buttonOptionsLoading,
    buttonOptionsIsFetching,
    buttonOptionsError,
    buttonOptionsIsError,
    buttonOptions,
    buttonOptionsIsSuccess,
  ]);

  const [
    processSaveChainConfig,
    {
      isLoading: processSaveChainConfigIsLoading,
      isError: processSaveChainConfigIsError,
      error: processSaveChainConfigError,
      isSuccess: processSaveChainConfigIsSuccess,
      data: processSaveChainConfigData,
    },
  ] = useProcessBiznessEventProcessConfigurationsMutation();

  useEffect(() => {
    if (processSaveChainConfigIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Chain Configuration has been saved successfully!`,
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
          console.log(
            'check data after successful Save BEPC CHAIN, see console---->'
          );
          console.log(processSaveChainConfigData);
          // biznessEventProcessConfigurationInfoRefetch();
        }
      });
    } else if (processSaveChainConfigIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving Chain Config, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving Chain Config data, see console---->'
      );
      console.log(processSaveChainConfigError);
    }
  }, [
    processSaveChainConfigIsLoading,
    processSaveChainConfigIsError,
    processSaveChainConfigData,
    processSaveChainConfigError,
    processSaveChainConfigIsSuccess,
  ]);

  const [
    createChainName,
    {
      isLoading: createChainNameIsLoading,
      isError: createChainNameIsError,
      error: createChainNameError,
      isSuccess: createChainNameIsSuccess,
      data: createChainNameData,
    },
  ] = useCreateFixedTaskTemplateMutation();

  useEffect(() => {
    if (createChainNameIsSuccess) {
      handleFixedTaskTemplateCreateModalClose();
      fixedTaskTemplateOptionsRefetch();
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Chain Name has been created successfully!`,
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
          console.log(
            'check data after successful Chain name creation, see console---->'
          );
          console.log(createChainNameData);
          // biznessEventProcessConfigurationInfoRefetch();
        }
      });
    } else if (createChainNameIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while creating Chain Name, see console---->'
      );
      console.log(
        'Something is wrong in backend while creating Chain Name, see console---->'
      );
      console.log(createChainNameError);
    }
  }, [
    createChainNameData,
    createChainNameIsLoading,
    createChainNameIsError,
    createChainNameError,
    createChainNameIsSuccess,
  ]);

  // ------------------------- API CALLS and with associated useEffects ----------------ENDS----------------------

  /// /-----------------auto comp list style-----------------
  interface AutoCompResStyles {
    popper: {
      maxWidth: string;
      // minWidth: string;
      fontSize: string;
    };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: {
      maxWidth: 'fit-content',
      // minWidth: 'inherit',
      fontSize: '12px',
    },
  };
  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );

  // Function to check if an object is empty based on your criteria
  const isEmptyObject = (obj: any) => {
    return Object.values(obj).every(
      (value) =>
        value === '' ||
        value === null ||
        value === undefined ||
        value === 0 ||
        (Array.isArray(value) && value.length === 0)
    );
  };

  const specsOnClickFunct = (
    currentRow: IBiznessEventProcessConfigurationInfoForChainConfig,
    index: number
  ) => {
    reset();

    setValue('smsTemplate', bepcGridState[index].smsTemplate);
    setValue('mailTemplate', bepcGridState[index].mailTemplate);
    setValue('maxTimeInDays', bepcGridState[index].maxTimeInDays);
    setValue('maxTimeInHours', bepcGridState[index].maxTimeInHours);
    setValue('relationalKey', bepcGridState[index].relationKey);
    setValue('controllerPath', bepcGridState[index].controllerPath);

    setModalOpendedIndexBepcGrid(index);
    setSpecModal(true);
  };

  const saveSpecBtn = () => {
    if (modalOpendedIndexBepcGrid != null) {
      bepcGridState[modalOpendedIndexBepcGrid].smsTemplate =
        getValues('smsTemplate');
      bepcGridState[modalOpendedIndexBepcGrid].mailTemplate =
        getValues('mailTemplate');
      bepcGridState[modalOpendedIndexBepcGrid].maxTimeInDays =
        getValues('maxTimeInDays');
      bepcGridState[modalOpendedIndexBepcGrid].maxTimeInHours =
        getValues('maxTimeInHours');
      bepcGridState[modalOpendedIndexBepcGrid].relationKey =
        getValues('relationalKey');
      bepcGridState[modalOpendedIndexBepcGrid].controllerPath =
        getValues('controllerPath');

      setBepcGridState([...bepcGridState]);
    }
    setSpecModal(false);
  };

  const addFixedTaskTemplateBtn = () => {
    const objToSave: ICreateFixedTaskTemplate = {
      name: getValues('chainName') || '',
      companyId: userInfo?.companyId || 0,
      dateOfEntry: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
    };
    console.log('fixedTaskTemplate save obj');
    console.log(objToSave);

    if (!objToSave.name) {
      toast.error('You have to entry a chain name to add');
    } else {
      createChainName(objToSave);
      // handleFixedTaskTemplateCreateModalClose();
    }
  };

  // -----------------------------------------------------------------------------------------------
  // Tables, column definition and table initializer pair------>

  const checkAndSetBepcGridValues = useCallback(
    (index: number) => {
      if (index === bepcGridState.length - 1) {
        const tempEmptyObj: IBiznessEventProcessConfigurationInfoForChainConfig =
          {
            biznessEventProcessConfigurationId: 0,
            fixedTaskTemplateId: 0,
            biznessEventId: 0,
            biznessEventName: ``,
            controllerPath: '',
            controllerParameter: '',
            sequence: 0,
            actionType: '',
            mailTemplate: '',
            smsTemplate: '',
            dateOfEntry: '',
            enteredById: 0,
            mandatoryAttachment: null,
            prevBiznessEventId: null,
            nextActionMethod: null,
            relationKey: '',
            maxTimeInHours: 0,
            maxTimeInDays: 0,
            extendedBiznessEventId: null,
            pcLocationListDtos: null,
            pcProductGroupListDtos: null,
            pcBrandListDtos: null,
          };
        setBepcGridState([...bepcGridState, tempEmptyObj]);
      } else {
        setBepcGridState([...bepcGridState]);
      }
    },
    [bepcGridState]
  );

  // bepcGrid codes------>
  const bepcGridColumns = useMemo<
    MRT_ColumnDef<IBiznessEventProcessConfigurationInfoForChainConfig>[]
  >(
    () => [
      {
        id: 'select', // access nested data with dot notation
        header: 'Select',
        size: 1, // small column
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={row.original.biznessEventId ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Select This Row"
            >
              <IconButton
                color="info"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (row.original.biznessEventId) {
                    setSelectedBepcRow((prev) => ({
                      // ...prev,
                      [row.id]: !prev[row.id], // this is a simple toggle implementation
                      // [row.original.virtualId]: !prev[row.original.virtualId],
                    }));
                  }
                }}
              >
                <EditNote />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },

      {
        accessorFn: (row) => row.biznessEventName ?? '', // access nested data with dot notation
        id: 'biznessEventName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Bizness Event',
        Cell: ({ renderedCellValue, row }) => {
          const currentBiznessEvent: IBiznessEventOption = {
            biznessEventId: row.original.biznessEventId ?? null,
            name: row.original.biznessEventName ?? '',
          };

          return (
            // <div className="">
            <Autocomplete
              id=""
              sx={{ width: '100%' }}
              PopperComponent={PopperMy}
              clearOnEscape
              disableClearable
              freeSolo
              size="small"
              options={biznessEventOptions?.data ?? []}
              value={currentBiznessEvent}
              onChange={(e, selectedOption) => {
                if (selectedOption) {
                  const selectedOpt = selectedOption as IBiznessEventOption;
                  bepcGridState[row.index].biznessEventId =
                    selectedOpt.biznessEventId ?? 0;
                  bepcGridState[row.index].biznessEventName =
                    selectedOpt.name ?? '';
                  bepcGridState[row.index].sequence = row.index + 1;
                  checkAndSetBepcGridValues(row.index);
                }
              }}
              getOptionLabel={(option: any) => (option.name ? option.name : '')}
              renderInput={(params) => (
                <TextField
                  sx={{ width: '100%' }}
                  {...params}
                  inputRef={(node) => {
                    if (node) {
                      // eslint-disable-next-line no-param-reassign
                      node.value = renderedCellValue;
                    }
                  }}
                  // onBlur={() => { console.log(this) }}
                  InputProps={{
                    ...params.InputProps,
                    style: { fontSize: 13 },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  size="small"
                />
              )}
            />
            // </div>
          );
        },
      },

      {
        accessorFn: (row) => row.actionType ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.actionType, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'actionType',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Action Type',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                bepcGridState[row.index].actionType = e.target.value;
                setBepcGridState([...bepcGridState]);
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },
      {
        id: 'Actions', // access nested data with dot notation
        header: 'Specs',
        size: 1, // small column
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div
            className={
              row.original.biznessEventId
                ? 'visible w-full flex justify-center'
                : 'invisible w-full flex justify-center'
            }
          >
            <Tooltip arrow placement="right" title="Click here">
              <IconButton
                color="error"
                onClick={() => {
                  //   setProductWiseViewModal(true);

                  specsOnClickFunct(row.original, row.index);
                }}
              >
                <i className="fas text-sm fa-eye" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        id: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={row.original.biznessEventId ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Delete Ha"
            >
              <IconButton
                color="error"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (
                    bepcGridState[row.index].biznessEventProcessConfigurationId
                  ) {
                    const deletedBepcRow = {
                      biznessEventProcessConfigurationId:
                        bepcGridState[row.index]
                          ?.biznessEventProcessConfigurationId,
                    };
                    setBepcGridStateDeletedRow([
                      ...bepcGridStateDeletedRow,
                      deletedBepcRow,
                    ]);
                  }
                  bepcGridState?.splice(row.index, 1);
                  if (bepcGridState) {
                    setBepcGridState([...bepcGridState]);
                  } else {
                    setBepcGridState([]);
                  }
                  setTimeout(() => {
                    setSelectedBepcRow({});
                  }, 1);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [PopperMy]
  );
  const bepcGridInitializer: MRT_TableInstance<IBiznessEventProcessConfigurationInfoForChainConfig> =
    useMaterialReactTable({
      columns: bepcGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: bepcGridState || [],
      state: {
        isLoading:
          biznessEventProcessConfigurationInfoIsFetching ||
          biznessEventProcessConfigurationInfoLoading,
        columnVisibility,
        rowSelection: selectedBepcRow,
      },
      enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      enableSorting: false, // usually you do not want to sort when re-ordering
      muiRowDragHandleProps: ({ table }) => ({
        onDragEnd: () => {
          const { draggingRow, hoveredRow } = table.getState();
          if (hoveredRow && draggingRow) {
            const x = // checking if the dragging row has businessEventId
              (
                draggingRow as MRT_Row<IBiznessEventProcessConfigurationInfoForChainConfig>
              ).original.biznessEventId;
            const y =
              // checking if the hovered row, maane jekhane dragged row ta falano hobe, has businessEventId
              (
                hoveredRow as MRT_Row<IBiznessEventProcessConfigurationInfoForChainConfig>
              ).original.biznessEventId;
            if (x && y) {
              bepcGridState.splice(
                (
                  hoveredRow as MRT_Row<IBiznessEventProcessConfigurationInfoForChainConfig>
                ).index,
                0,
                bepcGridState.splice(draggingRow.index, 1)[0]
              );
              setBepcGridState([...bepcGridState]);
              // if (hoveredRow?.index) {
              for (let i = 0; i < bepcGridState.length; i++) {
                if (bepcGridState[i].biznessEventId) {
                  // maane if e likhsi jeno faka row er jonno sequence calculate na kore
                  bepcGridState[i].sequence = i + 1;
                }
              }
              // // bepcGridState[hoveredRow.index].sequence = hoveredRow.index + 1; // sequence kintu edit hoye gelo
              // }
              setSelectedBepcRow({});
              setBepcGridState([...bepcGridState]);
            }
          }
        },
      }),

      onColumnVisibilityChange: columnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 40,
      },
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      // getRowId: (originalRow) => originalRow.biznessEventName.toString() || '', // ekhane actually amar mot e biznessEventId hobe plus virtualId hote paare.... //vai eiday problem ache, evabe korle table er rendered autocomplete er values gaayeb thaake
      enableMultiRowSelection: false,
      muiTableBodyRowProps: ({ row }) => ({
        // implement row selection click events manually
        // onClick: () => {
        //   if (row.original.biznessEventId) {
        //     setSelectedBepcRow((prev) => ({
        //       // ...prev,
        //       [row.id]: !prev[row.id], // this is a simple toggle implementation
        //       // [row.original.virtualId]: !prev[row.original.virtualId],
        //     }));
        //   }
        // },
        selected: selectedBepcRow[row.id],
        // sx: {
        //   cursor: 'pointer',
        // },
      }),
      // enableRowSelection: (row) => row.original.biznessEventId,
      onRowSelectionChange: setSelectedBepcRow,
      initialState: {
        density: 'compact',
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
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '13px',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '500px' } },
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />

          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     purchaseComparativeSheetGridState,
                //     purchaseComparativeSheetGridColumns
                //   );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      renderTopToolbarCustomActions: ({ table }) => (
        <div className="">
          <p className=" mt-1 font-bold text-[13px]">
            Process Congituration Grid
          </p>
        </div>
      ),
    });
  // bepcGrid codes--Ends---->

  /// //excel csv for normal frontend grids/////////////////
  const handleExportData = (
    gridData: any,
    gridColumns: any,
    columnVisibility: any
  ) => {
    console.log('handleExportData');

    console.log('gridData');
    console.log(gridData);

    console.log('columnVisibility');
    console.log(columnVisibility);

    // --------[Getting the hidden columns as property names in an array]----------
    const falsePropertiesArr = Object.keys(columnVisibility).filter(
      (property) => columnVisibility[property] === false
    );
    console.log('falsePropertiesArr');
    console.log(falsePropertiesArr);

    console.log('gridColumns');
    console.log(gridColumns);

    // Filtering out empty objects
    gridData = gridData.filter((obj: any) => !isEmptyObject(obj));
    // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
    const visibleGridDataTbColXcel = gridColumns
      .filter(
        (column: any) =>
          column?.id &&
          column?.id !== 'Actions' &&
          column?.id !== 'delete' &&
          !falsePropertiesArr.includes(column.id)
      )
      .map(({ id, header }: any) => ({ id, header }));

    console.log('visibleGridDataTbColXcel');
    console.log(visibleGridDataTbColXcel);

    // --------[Getting the data of excel without those columns which are hidden ]----------
    const gridDataTbXCEL = gridData.map((item: any) => {
      return Object.keys(item).reduce((acc: any, key: any) => {
        if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });

    console.log('gridDataTbXCEL');
    console.log(gridDataTbXCEL);

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

    const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
      const sortedItem: any = {};
      visibleGridDataTbColXcel.forEach((column: any) => {
        sortedItem[column.id] = item[column.id];
      });
      return sortedItem;
    });

    console.log('gridDataTbXCELSorted');
    console.log(gridDataTbXCELSorted);

    // ---[csv er settings]---
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: visibleGridDataTbColXcel.map((c: any) => c.header),
    };
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(gridDataTbXCELSorted);
  };

  // -----------------------NORMAL USE EFFECTS-----------------------

  useEffect(() => {
    const emptyArray: IBiznessEventProcessConfigurationInfoForChainConfig[] =
      [];
    for (let i = 0; i < 10; i++) {
      const tempObj: IBiznessEventProcessConfigurationInfoForChainConfig = {
        biznessEventProcessConfigurationId: 0,
        fixedTaskTemplateId: 0,
        biznessEventId: 0,
        biznessEventName: ``,
        controllerPath: '',
        controllerParameter: '',
        sequence: 0,
        actionType: '',
        mailTemplate: '',
        smsTemplate: '',
        dateOfEntry: '',
        enteredById: 0,
        mandatoryAttachment: null,
        prevBiznessEventId: null,
        nextActionMethod: null,
        relationKey: '',
        maxTimeInHours: 0,
        maxTimeInDays: 0,
        extendedBiznessEventId: null,
        pcLocationListDtos: null,
        pcProductGroupListDtos: null,
        pcBrandListDtos: null,
      };
      emptyArray.push(tempObj);
    }
    setBepcGridState(emptyArray);
  }, []);

  // // on changing the selection of rows in bepcGrid
  // useEffect(() => {
  //   // baaki gula khaali hobe
  //   setSelectedLocationDLRow(null);
  //   setSelectedUsersDLTRow({});

  //   const bepcGridStateTemp = JSON.parse(JSON.stringify(bepcGridState));
  //   const bepcGridStateCopy = [...bepcGridStateTemp];

  //   const indexNoObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNo = parseInt(indexNoObjKey, 10);
  //   if (selectedBepcRow[indexNoObjKey]) {
  //     setSelectedItemsLocation(
  //       bepcGridStateCopy[indexNo]?.pcLocationListDtos || []
  //     );
  //     setSelectedItemsPCProductGroup(
  //       bepcGridStateCopy[indexNo]?.pcProductGroupListDtos || []
  //     );
  //     setSelectedItemsPCProductBrand(
  //       bepcGridStateCopy[indexNo]?.pcBrandListDtos || []
  //     );
  //   }
  //   console.log('selectedBepcRow onChange, showing bepcGridState---');
  //   console.log(bepcGridState);
  // }, [selectedBepcRow]);

  // // on changing the selection of rows in Locations
  // useEffect(() => {
  //   const bepcGridStateTemp = JSON.parse(JSON.stringify(bepcGridState));
  //   const bepcGridStateCopy = [...bepcGridStateTemp];
  //   console.log('location row changed er shathe shathe bepcGridStateCopy--->');
  //   console.log(bepcGridStateCopy);

  //   // baaki gula khaali hobe
  //   setSelectedUsersDLTRow({});

  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
  //   const indexNoLocation = selectedLocationDLRow;
  //   if (selectedBepcRow[indexNoBepc] && indexNoLocation !== null) {
  //     const tempPcUserList =
  //       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
  //         ?.pcUserListDtos || [];

  //     const tempSelectedLocationRowInfo =
  //       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation] ||
  //       null;

  //     setSelectedItemsUsers(tempPcUserList || []);
  //     setSelectedLocationDLWholeRowInfo(tempSelectedLocationRowInfo);
  //   } else {
  //     setSelectedItemsUsers([]);
  //     setSelectedLocationDLWholeRowInfo(null);
  //   }
  //   console.log('selectedLocationDLRow onChange, showing bepcGridState---');
  //   console.log(bepcGridState);
  // }, [selectedLocationDLRow]);

  // // on changing the selection of rows in User from duelListSelectorGrid
  // useEffect(() => {
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
  //   const indexNoLocation = selectedLocationDLRow;
  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);

  //   const bepcGridStateTemp = JSON.parse(JSON.stringify(bepcGridState));
  //   const bepcGridStateCopy = [...bepcGridStateTemp];

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     selectedItemsUsers[indexNoUser]
  //   ) {
  //     const tempPcUserProductGroupList =
  //       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
  //         ?.pcUserListDtos?.[indexNoUser]?.pcUserProductGroupListDtos || [];

  //     const tempPcUserBrandList =
  //       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
  //         ?.pcUserListDtos?.[indexNoUser]?.pcUserBrandListDtos || [];

  //     const tempPcUserProductList =
  //       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
  //         ?.pcUserListDtos?.[indexNoUser]?.pcUserProductListDtos || [];

  //     const tempPcUserButtonList =
  //       bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
  //         ?.pcUserListDtos?.[indexNoUser]?.pcButtonListDtos || [];
  //     console.log('On Select A User');
  //     console.log('tempPcUserProductGroupList');
  //     console.log(tempPcUserProductGroupList);

  //     console.log('tempPcUserBrandList');
  //     console.log(tempPcUserBrandList);

  //     console.log('tempPcUserButtonList');
  //     console.log(tempPcUserButtonList);

  //     setSelectedItemsPCUserProductGroup(tempPcUserProductGroupList || []);
  //     setSelectedItemsPCUserProductBrand(tempPcUserBrandList || []);
  //     setSelectedItemsPCUserProduct(tempPcUserProductList || []);
  //     setSelectedItemsPCUserButton(tempPcUserButtonList || []);
  //   } else {
  //     setSelectedItemsPCUserProductGroup([]);
  //     setSelectedItemsPCUserProductBrand([]);
  //     setSelectedItemsPCUserProduct([]);
  //     setSelectedItemsPCUserButton([]);
  //   }
  // }, [selectedUsersDLTRow]);

  // My new onChangeHighLights all in one useEffect.......
  useEffect(() => {
    // baaki gula khaali hobe
    setSelectedLocationDLRow(null);
    setSelectedUsersDLTRow({});
  }, [selectedBepcRow]);
  useEffect(() => {
    // baaki gula khaali hobe
    setSelectedUsersDLTRow({});
  }, [selectedLocationDLRow]);
  useEffect(() => {
    const bepcGridStateTemp = JSON.parse(JSON.stringify(bepcGridState));
    const bepcGridStateCopy = [...bepcGridStateTemp];
    console.log('location row changed er shathe shathe bepcGridStateCopy--->');
    console.log(bepcGridStateCopy);
    const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
    const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
    const tempIndexNoLocation = bepcGridStateCopy[
      indexNoBepc
    ]?.pcLocationListDtos?.findIndex(
      (element: IPCLocationListDtos) =>
        element.locationId === selectedLocationDLRow?.locationId
    );
    const indexNoLocation =
      tempIndexNoLocation !== undefined &&
      tempIndexNoLocation !== null &&
      tempIndexNoLocation !== -1
        ? tempIndexNoLocation
        : null;
    const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
    const indexNoUser = parseInt(indexNoUserObjKey, 10);

    // baaki gula khaali hobe
    // setSelectedLocationDLRow(null);
    // setSelectedUsersDLTRow({});
    if (selectedBepcRow[indexNoBepcObjKey]) {
      setSelectedItemsLocation(
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos || []
      );
      setSelectedItemsPCProductGroup(
        bepcGridStateCopy[indexNoBepc]?.pcProductGroupListDtos || []
      );
      setSelectedItemsPCProductBrand(
        bepcGridStateCopy[indexNoBepc]?.pcBrandListDtos || []
      );
    }

    // baaki gula khaali hobe
    // setSelectedUsersDLTRow({});
    if (selectedBepcRow[indexNoBepc] && indexNoLocation !== null) {
      const tempPcUserList =
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
          ?.pcUserListDtos || [];

      const tempSelectedLocationRowInfo =
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation] ||
        null;

      setSelectedItemsUsers(tempPcUserList || []);
      setSelectedLocationDLWholeRowInfo(tempSelectedLocationRowInfo);
    } else {
      setSelectedItemsUsers([]);
      setSelectedLocationDLWholeRowInfo(null);
    }
    console.log('My new onChangeHighLights---');
    console.log(bepcGridState);

    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      selectedItemsUsers[indexNoUser]
    ) {
      const tempPcUserProductGroupList =
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
          ?.pcUserListDtos?.[indexNoUser]?.pcUserProductGroupListDtos || [];

      const tempPcUserBrandList =
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
          ?.pcUserListDtos?.[indexNoUser]?.pcUserBrandListDtos || [];

      const tempPcUserProductList =
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
          ?.pcUserListDtos?.[indexNoUser]?.pcUserProductListDtos || [];

      const tempPcUserButtonList =
        bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos?.[indexNoLocation]
          ?.pcUserListDtos?.[indexNoUser]?.pcButtonListDtos || [];
      console.log('On Select A User');
      console.log('tempPcUserProductGroupList');
      console.log(tempPcUserProductGroupList);

      console.log('tempPcUserBrandList');
      console.log(tempPcUserBrandList);

      console.log('tempPcUserButtonList');
      console.log(tempPcUserButtonList);

      setSelectedItemsPCUserProductGroup(tempPcUserProductGroupList || []);
      setSelectedItemsPCUserProductBrand(tempPcUserBrandList || []);
      setSelectedItemsPCUserProduct(tempPcUserProductList || []);
      setSelectedItemsPCUserButton(tempPcUserButtonList || []);
    } else {
      setSelectedItemsPCUserProductGroup([]);
      setSelectedItemsPCUserProductBrand([]);
      setSelectedItemsPCUserProduct([]);
      setSelectedItemsPCUserButton([]);
    }
  }, [
    selectedBepcRow,
    selectedLocationDLRow,
    selectedUsersDLTRow,
    bepcGridState,
  ]);

  // My new onChangeHighLights all in one useEffect.......End

  // -----------------------NORMAL USE EFFECTS---------ENDSS--------------

  /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // ------------ niche jaa useEffect ase, shob bepcState e update kore dite hobe

  useEffect(() => {
    console.log('bepcGridState CHANGED------------- Value Of BepcGridState');
    console.log(bepcGridState);
  }, [bepcGridState]);

  // useEffect(() => {
  //   // selectedBepcRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
  //   // console.log(
  //   //   'selectedItemsLocation changed, maane PcLocation e kisu dhukse OR ber hoise... tokhon bepcGridState before dhukano location bepcState e add korar aag porjonto... maane notun location er moddhe ekhono dhukenai'
  //   // );
  //   // console.log(bepcGridState);

  //   // console.log(
  //   //   'selectedItemsLocation changed, location gula jeita ektu por BepcState e set hobe---'
  //   // );
  //   // console.log(selectedItemsLocation);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (selectedBepcRow[indexNoBepc]) {
  //     /// //
  //     const prevPCLocation = JSON.stringify(
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos
  //     );
  //     const currentPCLocation = JSON.stringify(selectedItemsLocation);
  //     if (prevPCLocation !== currentPCLocation) {
  //       console.log('selectedItemsLocation CHANGED.......');

  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsLocation)
  //       );
  //       setBepcGridState([...bepcGridStateCopy]);
  //     }
  //   }
  // }, [selectedItemsLocation]);

  // useEffect(() => {
  //   // selectedBepcRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));
  //   if (selectedBepcRow[indexNoBepc]) {
  //     //-----
  //     const currentPCProductGroup = JSON.stringify(
  //       bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos
  //     );
  //     const prevPCProductGroup = JSON.stringify(selectedItemsPCProductGroup);
  //     if (currentPCProductGroup !== prevPCProductGroup) {
  //       console.log('selectedItemsPCProductGroup CHANGED.......');

  //       bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCProductGroup)
  //       );
  //       setBepcGridState([...bepcGridStateCopy]);
  //     }
  //   }
  // }, [selectedItemsPCProductGroup]);

  // useEffect(() => {
  //   // selectedBepcRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));
  //   if (selectedBepcRow[indexNoBepc]) {
  //     const prevPCBrand = JSON.stringify(
  //       bepcGridState[indexNoBepc].pcBrandListDtos
  //     );
  //     const currentPCBrand = JSON.stringify(selectedItemsPCProductBrand);
  //     if (prevPCBrand !== currentPCBrand) {
  //       console.log('selectedItemsPCProductBrand CHANGED.......');
  //       console.log('prevPCBrand');
  //       console.log(prevPCBrand);

  //       console.log('currentPCBrand');
  //       console.log(currentPCBrand);
  //       bepcGridStateCopy[indexNoBepc].pcBrandListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCProductBrand)
  //       );
  //       setBepcGridState([...bepcGridStateCopy]);
  //     }
  //   }
  // }, [selectedItemsPCProductBrand]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index

  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
  //   const indexNoLocation = selectedLocationDLRow;
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //   ) {
  //     //----
  //     const prevPCUser = JSON.stringify(
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //         .pcUserListDtos
  //     );
  //     const currentPCUser = JSON.stringify(selectedItemsUsers);
  //     if (prevPCUser !== currentPCUser) {
  //       console.log('selectedItemsUsers CHANGED.......');
  //       console.log('prevPCUser');
  //       console.log(prevPCUser);

  //       console.log('currentPCUser');
  //       console.log(currentPCUser);

  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //         indexNoLocation
  //       ].pcUserListDtos = JSON.parse(JSON.stringify(selectedItemsUsers));
  //       setBepcGridState([...bepcGridStateCopy]);
  //     }
  //   }
  //   // if (
  //   //   indexNoLocation !== null &&
  //   //   indexNoBepc !== null &&
  //   //   bepcGridState[indexNoBepc] &&
  //   //   bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
  //   // ) {
  //   //   bepcGridState[indexNoBepc]?.pcLocationListDtos[indexNoLocation]
  //   //     ?.pcUserListDtos = JSON.parse(JSON.stringify(selectedItemsUsers));
  //   //   setBepcGridState([...bepcGridState]);
  //   // }
  // }, [selectedItemsUsers, bepcGridState]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   const indexNoLocation = selectedLocationDLRow;

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].pcUserProductGroupListDtos = JSON.parse(
  //       JSON.stringify(selectedItemsPCUserProductGroup)
  //     );
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  //   // setBepcGridState([...bepcGridState]);
  // }, [selectedItemsPCUserProductGroup]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   const indexNoLocation = selectedLocationDLRow;

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].pcUserBrandListDtos = JSON.parse(
  //       JSON.stringify(selectedItemsPCUserProductBrand)
  //     );
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  // }, [selectedItemsPCUserProductBrand]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index

  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   const indexNoLocation = selectedLocationDLRow;

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].pcUserProductListDtos = JSON.parse(
  //       JSON.stringify(selectedItemsPCUserProduct)
  //     );
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  // }, [selectedItemsPCUserProduct]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   const indexNoLocation = selectedLocationDLRow;

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].pcButtonListDtos = JSON.parse(
  //       JSON.stringify(selectedItemsPCUserButton)
  //     );
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  // }, [selectedItemsPCUserButton]);

  // -----------------------------my new useEffect-----------------------
  // useEffect(() => {
  //   /// global vars----///
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   const indexNoLocation = selectedLocationDLRow;

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateTemp = JSON.parse(JSON.stringify(bepcGridState));
  //   const bepcGridStateCopy = [...bepcGridStateTemp];

  //   // -------button-------------
  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     if (
  //       JSON.stringify(
  //         bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //           .pcUserListDtos[indexNoUser].pcButtonListDtos
  //       ) !== JSON.stringify(selectedItemsPCUserButton)
  //     ) {
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //         indexNoLocation
  //       ].pcUserListDtos[indexNoUser].pcButtonListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCUserButton)
  //       );
  //     }
  //   }
  //   //---------------------------------------------------

  //   // --------------pcUserProduct-------------
  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     if (
  //       JSON.stringify(
  //         bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //           .pcUserListDtos[indexNoUser].pcUserProductListDto
  //       ) !== JSON.stringify(selectedItemsPCUserProduct)
  //     ) {
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //         indexNoLocation
  //       ].pcUserListDtos[indexNoUser].pcUserProductListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCUserProduct)
  //       );
  //     }
  //   }
  //   // ---------------------------

  //   // ----------------PcUserProductBrand------------------------
  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     if (
  //       JSON.stringify(
  //         bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //           .pcUserListDtos[indexNoUser].pcUserBrandListDtos
  //       ) !== JSON.stringify(selectedItemsPCUserProductBrand)
  //     ) {
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //         indexNoLocation
  //       ].pcUserListDtos[indexNoUser].pcUserBrandListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCUserProductBrand)
  //       );
  //     }
  //   }
  //   //-------------------------

  //   // ---------------------------PcUserProductGroup----------------------------------
  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     if (
  //       JSON.stringify(
  //         bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //           .pcUserListDtos[indexNoUser].pcUserProductGroupListDtos
  //       ) !== JSON.stringify(selectedItemsPCUserProductGroup)
  //     ) {
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //         indexNoLocation
  //       ].pcUserListDtos[indexNoUser].pcUserProductGroupListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCUserProductGroup)
  //       );
  //     }
  //   }
  //   //-------------------------------------------------

  //   // ---------------------------pcUser----------------------------------
  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //   ) {
  //     //----
  //     const prevPCUser = JSON.stringify(
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //         .pcUserListDtos
  //     );
  //     const currentPCUser = JSON.stringify(selectedItemsUsers);
  //     if (prevPCUser !== currentPCUser) {
  //       console.log('selectedItemsUsers CHANGED.......');
  //       console.log('prevPCUser');
  //       console.log(prevPCUser);

  //       console.log('currentPCUser');
  //       console.log(currentPCUser);

  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //         indexNoLocation
  //       ].pcUserListDtos = [];
  //       console.log('bepcGridStateCopy after setting users');
  //       console.log(
  //         bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //           .pcUserListDtos
  //       );
  //     }
  //   }
  //   //-------------------------------------------------

  //   // --------------------brand-----------------------------
  //   if (selectedBepcRow[indexNoBepc]) {
  //     const prevPCBrand = JSON.stringify(
  //       bepcGridState[indexNoBepc].pcBrandListDtos
  //     );
  //     const currentPCBrand = JSON.stringify(selectedItemsPCProductBrand);
  //     if (prevPCBrand !== currentPCBrand) {
  //       console.log('selectedItemsPCProductBrand CHANGED.......');
  //       console.log('prevPCBrand');
  //       console.log(prevPCBrand);

  //       console.log('currentPCBrand');
  //       console.log(currentPCBrand);
  //       bepcGridStateCopy[indexNoBepc].pcBrandListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCProductBrand)
  //       );
  //     }
  //   }
  //   // -------------------------------------------------
  //   // ---------------------ProductGroup----------------------------
  //   if (selectedBepcRow[indexNoBepc]) {
  //     //-----
  //     const currentPCProductGroup = JSON.stringify(
  //       bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos
  //     );
  //     const prevPCProductGroup = JSON.stringify(selectedItemsPCProductGroup);
  //     if (currentPCProductGroup !== prevPCProductGroup) {
  //       console.log('selectedItemsPCProductGroup CHANGED.......');

  //       bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsPCProductGroup)
  //       );
  //     }
  //   }
  //   // -------------------------------------------------

  //   // ---------------------Location----------------------------
  //   if (selectedBepcRow[indexNoBepc]) {
  //     /// //

  //     console.log('bepcGridStateCopy from location---------->');
  //     console.log(bepcGridStateCopy);

  //     const prevPCLocation = JSON.stringify(
  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos
  //     );
  //     const currentPCLocation = JSON.stringify(selectedItemsLocation);
  //     if (prevPCLocation !== currentPCLocation) {
  //       console.log('selectedItemsLocation CHANGED.......');

  //       bepcGridStateCopy[indexNoBepc].pcLocationListDtos = JSON.parse(
  //         JSON.stringify(selectedItemsLocation)
  //       );
  //     }
  //   }

  //   console.log('bepcGridStateCopy');
  //   console.log(bepcGridStateCopy);

  //   console.log('bepcGridState');
  //   console.log(bepcGridState);

  //   if (JSON.stringify(bepcGridStateCopy) !== JSON.stringify(bepcGridState)) {
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  //   // -------------------------------------------------
  // }, [
  //   selectedItemsPCUserButton,
  //   selectedItemsPCUserProduct,
  //   selectedItemsPCUserProductBrand,
  //   selectedItemsPCUserProductGroup,
  //   selectedItemsUsers,
  //   selectedItemsPCProductBrand,
  //   selectedItemsPCProductGroup,
  //   selectedItemsLocation,
  //   selectedBepcRow,
  //   selectedLocationDLRow,
  //   selectedUsersDLTRow,
  //   bepcGridState,
  // ]);

  // -----------------------------my new useEffect 2-----------------------
  useEffect(() => {
    /// global vars----///
    // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
    const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
    const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

    // getting index of highlighted Location
    const tempIndexNoLocation = bepcGridState[
      indexNoBepc
    ]?.pcLocationListDtos?.findIndex(
      (element) => element.locationId === selectedLocationDLRow?.locationId
    );
    const indexNoLocation =
      tempIndexNoLocation !== undefined &&
      tempIndexNoLocation !== null &&
      tempIndexNoLocation !== -1
        ? tempIndexNoLocation
        : null;
    /// ///////////////////////////////////

    const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
    const indexNoUser = parseInt(indexNoUserObjKey, 10);
    const bepcGridStateTemp = JSON.parse(JSON.stringify(bepcGridState));
    const bepcGridStateCopy = [...bepcGridStateTemp];

    // --------------------brand-----------------------------
    if (selectedBepcRow[indexNoBepc]) {
      const prevPCBrand = JSON.stringify(
        bepcGridState[indexNoBepc].pcBrandListDtos
      );
      const currentPCBrand = JSON.stringify(selectedItemsPCProductBrand);
      if (prevPCBrand !== currentPCBrand) {
        console.log('selectedItemsPCProductBrand CHANGED.......');
        console.log('prevPCBrand');
        console.log(prevPCBrand);

        console.log('currentPCBrand');
        console.log(currentPCBrand);
        bepcGridStateCopy[indexNoBepc].pcBrandListDtos = JSON.parse(
          JSON.stringify(selectedItemsPCProductBrand)
        );
      }
    }
    // -------------------------------------------------
    // ---------------------ProductGroup----------------------------
    if (selectedBepcRow[indexNoBepc]) {
      //-----
      const currentPCProductGroup = JSON.stringify(
        bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos
      );
      const prevPCProductGroup = JSON.stringify(selectedItemsPCProductGroup);
      if (currentPCProductGroup !== prevPCProductGroup) {
        console.log('selectedItemsPCProductGroup CHANGED.......');

        bepcGridStateCopy[indexNoBepc].pcProductGroupListDtos = JSON.parse(
          JSON.stringify(selectedItemsPCProductGroup)
        );
      }
    }
    // -------------------------------------------------

    // ---------------------Location----------------------------
    if (selectedBepcRow[indexNoBepc]) {
      /// //

      console.log('bepcGridStateCopy from location---------->');
      console.log(bepcGridStateCopy);

      const prevPCLocation = JSON.stringify(
        bepcGridStateCopy[indexNoBepc].pcLocationListDtos
      );
      const currentPCLocation = JSON.stringify(selectedItemsLocation);
      if (prevPCLocation !== currentPCLocation) {
        console.log('selectedItemsLocation CHANGED.......');

        bepcGridStateCopy[indexNoBepc].pcLocationListDtos = JSON.parse(
          JSON.stringify(selectedItemsLocation)
        );
      }
    }

    // ---------------------------pcUser----------------------------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
    ) {
      //----
      const prevPCUser = JSON.stringify(
        bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
          .pcUserListDtos
      );
      const currentPCUser = JSON.stringify(selectedItemsUsers);
      if (prevPCUser !== currentPCUser) {
        console.log('selectedItemsUsers CHANGED.......');
        console.log('prevPCUser');
        console.log(prevPCUser);

        console.log('currentPCUser');
        console.log(currentPCUser);

        bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
          indexNoLocation
        ].pcUserListDtos = JSON.parse(currentPCUser);
        console.log('bepcGridStateCopy after setting users');
        console.log(
          bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
            .pcUserListDtos
        );
      }
    }
    //-------------------------------------------------

    // -------button-------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      if (
        JSON.stringify(
          bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
            .pcUserListDtos[indexNoUser].pcButtonListDtos
        ) !== JSON.stringify(selectedItemsPCUserButton)
      ) {
        bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
          indexNoLocation
        ].pcUserListDtos[indexNoUser].pcButtonListDtos = JSON.parse(
          JSON.stringify(selectedItemsPCUserButton)
        );
      }
    }
    //---------------------------------------------------

    // --------------pcUserProduct-------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      if (
        JSON.stringify(
          bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
            .pcUserListDtos[indexNoUser].pcUserProductListDto
        ) !== JSON.stringify(selectedItemsPCUserProduct)
      ) {
        bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
          indexNoLocation
        ].pcUserListDtos[indexNoUser].pcUserProductListDtos = JSON.parse(
          JSON.stringify(selectedItemsPCUserProduct)
        );
      }
    }
    // ---------------------------

    // ----------------PcUserProductBrand------------------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      if (
        JSON.stringify(
          bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
            .pcUserListDtos[indexNoUser].pcUserBrandListDtos
        ) !== JSON.stringify(selectedItemsPCUserProductBrand)
      ) {
        bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
          indexNoLocation
        ].pcUserListDtos[indexNoUser].pcUserBrandListDtos = JSON.parse(
          JSON.stringify(selectedItemsPCUserProductBrand)
        );
      }
    }
    //-------------------------

    // ---------------------------PcUserProductGroup----------------------------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      if (
        JSON.stringify(
          bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
            .pcUserListDtos[indexNoUser].pcUserProductGroupListDtos
        ) !== JSON.stringify(selectedItemsPCUserProductGroup)
      ) {
        bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
          indexNoLocation
        ].pcUserListDtos[indexNoUser].pcUserProductGroupListDtos = JSON.parse(
          JSON.stringify(selectedItemsPCUserProductGroup)
        );
      }
    }
    //-------------------------------------------------

    // ---------------------------AllSelected? pcUserProductGroup----------------------------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
        indexNoLocation
      ].pcUserListDtos[indexNoUser].isAllPCUserProductGroupSelected =
        isAllSelectedPCUserProductGroup || false;
    }
    //--------------------------------------------------------

    // ---------------------------AllSelected? PcUser----------------------------------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
        indexNoLocation
      ].pcUserListDtos[indexNoUser].isAllPCUserProductSelected =
        isAllSelectedPCUserProduct || false;
    }
    //-----------------------------------------------------

    // ------------------------------AllSelected? PcUserBrand--------------------
    if (
      selectedBepcRow[indexNoBepc] &&
      indexNoLocation !== null &&
      bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
        .pcUserListDtos[indexNoUser]
    ) {
      bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
        indexNoLocation
      ].pcUserListDtos[indexNoUser].isAllPCUserBrandSelected =
        isAllSelectedPCUserBrand || false;
    }
    //-------------------------------------------------------------

    // here;

    console.log('bepcGridStateCopy');
    console.log(bepcGridStateCopy);

    console.log('bepcGridState');
    console.log(bepcGridState);

    if (JSON.stringify(bepcGridStateCopy) !== JSON.stringify(bepcGridState)) {
      setBepcGridState([...bepcGridStateCopy]);
    }
    // -------------------------------------------------
  }, [
    selectedItemsPCUserButton,
    selectedItemsPCUserProduct,
    selectedItemsPCUserProductBrand,
    selectedItemsPCUserProductGroup,
    selectedItemsUsers,
    selectedItemsPCProductBrand,
    selectedItemsPCProductGroup,
    selectedItemsLocation,
    isAllSelectedPCUserProductGroup,
    isAllSelectedPCUserProduct,
    isAllSelectedPCUserProduct,
    // selectedBepcRow,
    // selectedLocationDLRow,
    // selectedUsersDLTRow,
    bepcGridState,
  ]);

  /// ///////////////////////////////////////////////////////PORE DEKHTESI NICHER GULAA ////////////////////////////////////////
  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   // getting index of highlighted Location
  //   const tempIndexNoLocation = bepcGridState[
  //     indexNoBepc
  //   ]?.pcLocationListDtos?.findIndex(
  //     (element) => element.locationId === selectedLocationDLRow?.locationId
  //   );
  //   const indexNoLocation =
  //     tempIndexNoLocation !== undefined &&
  //     tempIndexNoLocation !== null &&
  //     tempIndexNoLocation !== -1
  //       ? tempIndexNoLocation
  //       : null;
  //   /// ///////////////////////////////////

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].isAllPCUserProductGroupSelected =
  //       isAllSelectedPCUserProductGroup || false;
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  //   // setBepcGridState([...bepcGridState]);
  // }, [isAllSelectedPCUserProductGroup]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   // getting index of highlighted Location
  //   const tempIndexNoLocation = bepcGridState[
  //     indexNoBepc
  //   ]?.pcLocationListDtos?.findIndex(
  //     (element) => element.locationId === selectedLocationDLRow?.locationId
  //   );
  //   const indexNoLocation =
  //     tempIndexNoLocation !== undefined &&
  //     tempIndexNoLocation !== null &&
  //     tempIndexNoLocation !== -1
  //       ? tempIndexNoLocation
  //       : null;
  //   /// ///////////////////////////////////

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].isAllPCUserProductSelected =
  //       isAllSelectedPCUserProduct || false;
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  // }, [isAllSelectedPCUserProduct]);

  // useEffect(() => {
  //   // selectedBepcRow er index and //selectedLocationDLRow er index and //selectedUsersDLTRow er index
  //   const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
  //   const indexNoBepc = parseInt(indexNoBepcObjKey, 10);

  //   // getting index of highlighted Location
  //   const tempIndexNoLocation = bepcGridState[
  //     indexNoBepc
  //   ]?.pcLocationListDtos?.findIndex(
  //     (element) => element.locationId === selectedLocationDLRow?.locationId
  //   );
  //   const indexNoLocation =
  //     tempIndexNoLocation !== undefined &&
  //     tempIndexNoLocation !== null &&
  //     tempIndexNoLocation !== -1
  //       ? tempIndexNoLocation
  //       : null;
  //   /// ///////////////////////////////////

  //   const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
  //   const indexNoUser = parseInt(indexNoUserObjKey, 10);
  //   const bepcGridStateCopy = JSON.parse(JSON.stringify(bepcGridState));

  //   if (
  //     selectedBepcRow[indexNoBepc] &&
  //     indexNoLocation !== null &&
  //     bepcGridStateCopy[indexNoBepc]?.pcLocationListDtos &&
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[indexNoLocation]
  //       .pcUserListDtos[indexNoUser]
  //   ) {
  //     bepcGridStateCopy[indexNoBepc].pcLocationListDtos[
  //       indexNoLocation
  //     ].pcUserListDtos[indexNoUser].isAllPCUserBrandSelected =
  //       isAllSelectedPCUserBrand || false;
  //     setBepcGridState([...bepcGridStateCopy]);
  //   }
  // }, [isAllSelectedPCUserBrand]);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  useEffect(() => {
    if (isSaveClicked) {
      saveFunction();
      setIsSaveClicked(false);
    }
  }, [isSaveClicked, bepcGridState]);
  /// evabe save na korle, onBlur e state set houar agei api Call chole jaay

  const saveFunction = () => {
    console.log('Pressing The Greatest Save Button');
    console.log('Allaaah data dekh uff------------------>');
    console.log(bepcGridState);
    console.log(bepcGridStateDeletedRow);

    console.log('deletedItemsLocation');
    console.log(deletedItemsLocation);
    console.log('deletedItemsUsers');
    console.log(deletedItemsUsers);

    console.log('deletedItemsPCUserProductGroup');
    console.log(deletedItemsPCUserProductGroup);

    /// save processing starts

    const bepcGridStateCurrent = JSON.parse(JSON.stringify(bepcGridState));
    const bepcGridCurrentWithoutEmpty: IBiznessEventProcessConfigurationInfoForChainConfig[] =
      bepcGridStateCurrent.filter(
        (item: IBiznessEventProcessConfigurationInfoForChainConfig) =>
          item.biznessEventId
      );

    // sequence getting recalculated
    for (let i = 0; i < bepcGridCurrentWithoutEmpty.length; i++) {
      if (bepcGridCurrentWithoutEmpty[i].biznessEventId) {
        // maane if e likhsi jeno faka row er jonno sequence calculate na kore
        bepcGridCurrentWithoutEmpty[i].sequence = i + 1;
      }
    }
    const bepcGridStateNotDirtyWithoutEmpty: IBiznessEventProcessConfigurationInfoForChainConfig[] =
      bepcGridStateNotDirty.filter(
        (item: IBiznessEventProcessConfigurationInfoForChainConfig) =>
          item.biznessEventId
      );

    if (
      JSON.stringify(bepcGridCurrentWithoutEmpty) ===
      JSON.stringify(bepcGridStateNotDirtyWithoutEmpty)
    ) {
      alert('Same');
      // return;
    }
    if (!selectedFixedTaskTemplate?.fixedTaskTemplateId) {
      alert('You have to select a chain first!');
      return;
    }
    // alert('Not Same');
    console.log('bepcGridCurrentWithoutEmpty');
    console.log(bepcGridCurrentWithoutEmpty);

    console.log('bepcGridStateNotDirtyWithoutEmpty');
    console.log(bepcGridStateNotDirtyWithoutEmpty);

    const dataToGetSaved: IProcessConfigurationInfoForChainConfig = {
      createBiznessEventProcessConfigurationInfoForChainConfig: [],
      updateBiznessEventProcessConfigurationInfoForChainConfig: [],
      deleteBiznessEventProcessConfigurationInfoForChainConfig: [],
      createPCLocationListDtos: [],
      deletePCLocationListDtos: [],
      createPCProductGroupListDtos: [],
      deletePCProductGroupListDtos: [],
      createPCBrandListDto: [],
      deletePCBrandListDto: [],
      createPCUserListDtos: [],
      updatePCUserListDtos: [],
      deletePCUserListDtos: [],
      createPCUserProductGroupListDtos: [],
      updatePCUserProductGroupListDtos: [],
      deletePCUserProductGroupListDtos: [],
      createPCUserBrandListDtos: [],
      updatePCUserBrandListDtos: [],
      deletePCUserBrandListDtos: [],
      createPCUserProductListDto: [],
      updatePCUserProductListDto: [],
      deletePCUserProductListDto: [],
      createPCButtonListDto: [],
      deletePCButtonListDto: [],
    };

    /// ///////------------------------ALL ASSIGINING FUNCTIONS FOR SAVE -----------------------------
    const assignForCreateBepc = (
      bepcRow: IBiznessEventProcessConfigurationInfoForChainConfig
    ) => {
      const createBepc: ICreateBiznessEventProcessConfigurationInfoForChainConfig =
        {
          fixedTaskTemplateId:
            selectedFixedTaskTemplate?.fixedTaskTemplateId || 0,
          biznessEventId: bepcRow.biznessEventId,
          // biznessEventName: bepcRow.biznessEventName,
          controllerPath: bepcRow.controllerPath,
          controllerParameter: bepcRow.controllerParameter,
          sequence: bepcRow.sequence,
          mailTemplate: bepcRow.mailTemplate,
          smsTemplate: bepcRow.smsTemplate,
          dateOfEntry: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
          enteredBy: userInfo?.securityUserId || 0,
          mandatoryAttachment: bepcRow.mandatoryAttachment || false,
          actionType: bepcRow.actionType,
          prevBiznessEventId: bepcRow.prevBiznessEventId || null,
          nextActionMethod: bepcRow.nextActionMethod,
          relationKey: bepcRow.relationKey,
          maxTimeInHours: bepcRow.maxTimeInHours,
          maxTimeInDays: bepcRow.maxTimeInDays,
          extendedBiznessEventId: bepcRow.extendedBiznessEventId,
          createPCLocationListDtos: [],
          createPCProductGroupListDtos: [],
          createPCBrandListDto: [],
        };

      for (let i = 0; i < (bepcRow.pcBrandListDtos?.length || 0); i++) {
        // fresh Brand create1
        if (
          bepcRow.pcBrandListDtos &&
          !bepcRow.pcBrandListDtos[i]?.biznessEventPCBrandId &&
          !bepcRow.biznessEventProcessConfigurationId
        ) {
          createBepc.createPCBrandListDto.push(
            assignForCreateBepcBrand(bepcRow.pcBrandListDtos[i], 0)
          );
        }
      }

      for (let i = 0; i < (bepcRow.pcProductGroupListDtos?.length || 0); i++) {
        // fresh productGroup create1
        if (
          bepcRow.pcProductGroupListDtos &&
          !bepcRow.pcProductGroupListDtos[i]?.biznessEventPCProductGroupId &&
          !bepcRow.biznessEventProcessConfigurationId
        ) {
          createBepc.createPCProductGroupListDtos.push(
            assignForCreateBepcProductGroup(
              bepcRow.pcProductGroupListDtos[i],
              0
            )
          );
        }
      }

      for (let i = 0; i < (bepcRow.pcLocationListDtos?.length || 0); i++) {
        // fresh location create1
        if (
          bepcRow.pcLocationListDtos &&
          !bepcRow.pcLocationListDtos[i]?.biznessEventPCLocationId &&
          !bepcRow.biznessEventProcessConfigurationId
        ) {
          createBepc.createPCLocationListDtos.push(
            assignForCreateBepcLocation(bepcRow.pcLocationListDtos[i], 0)
          );
        }
      }

      return createBepc;
    };

    const assignForUpdateBepc = (
      bepcRow: IBiznessEventProcessConfigurationInfoForChainConfig
    ) => {
      const updateBepc: IUpdateBiznessEventProcessConfigurationInfoForChainConfig =
        {
          biznessEventProcessConfigurationId:
            bepcRow.biznessEventProcessConfigurationId,
          biznessEventId: bepcRow.biznessEventId,
          // biznessEventName: bepcRow.biznessEventName,
          controllerPath: bepcRow.controllerPath,
          controllerParameter: bepcRow.controllerParameter,
          sequence: bepcRow.sequence,
          mailTemplate: bepcRow.mailTemplate,
          smsTemplate: bepcRow.smsTemplate,
          dateOfEntry: bepcRow.dateOfEntry,
          enteredBy: bepcRow.enteredById,
          mandatoryAttachment: bepcRow.mandatoryAttachment || false,
          actionType: bepcRow.actionType,
          // prevBiznessEventId: bepcRow.prevBiznessEventId,
          // nextActionMethod: bepcRow.nextActionMethod,
          relationKey: bepcRow.relationKey,
          maxTimeInHours: bepcRow.maxTimeInHours,
          maxTimeInDays: bepcRow.maxTimeInDays,
          extendedBiznessEventId: bepcRow.extendedBiznessEventId,
        };

      for (let i = 0; i < (bepcRow.pcBrandListDtos?.length || 0); i++) {
        // biznessEventProcessConfigurationId wala Brand create2, bairer ta
        if (
          bepcRow.pcBrandListDtos &&
          bepcRow.pcBrandListDtos.length &&
          !bepcRow.pcBrandListDtos[i]?.biznessEventPCBrandId &&
          bepcRow.biznessEventProcessConfigurationId
        ) {
          dataToGetSaved.createPCBrandListDto.push(
            assignForCreateBepcBrand(
              bepcRow.pcBrandListDtos[i],
              bepcRow.biznessEventProcessConfigurationId
            )
          );
        }
        //  Brand update, update nai
      }

      for (let i = 0; i < (bepcRow.pcProductGroupListDtos?.length || 0); i++) {
        // biznessEventProcessConfigurationId wala productGroup create2, bairer ta
        if (
          bepcRow.pcProductGroupListDtos &&
          !bepcRow.pcProductGroupListDtos[i]?.biznessEventPCProductGroupId &&
          bepcRow.biznessEventProcessConfigurationId
        ) {
          dataToGetSaved.createPCProductGroupListDtos.push(
            assignForCreateBepcProductGroup(
              bepcRow.pcProductGroupListDtos[i],
              bepcRow.biznessEventProcessConfigurationId
            )
          );
        }
        // update productGroup nai
      }

      for (let i = 0; i < (bepcRow.pcLocationListDtos?.length || 0); i++) {
        // biznessEventProcessConfigurationId wala location create2, bairer ta
        if (
          bepcRow.pcLocationListDtos &&
          !bepcRow.pcLocationListDtos[i]?.biznessEventPCLocationId &&
          bepcRow.biznessEventProcessConfigurationId
        ) {
          dataToGetSaved.createPCLocationListDtos.push(
            assignForCreateBepcLocation(
              bepcRow.pcLocationListDtos[i],
              bepcRow.biznessEventProcessConfigurationId
            )
          );
        }
        // location update main table e nai but child e ase
        else if (
          bepcRow.pcLocationListDtos &&
          bepcRow.pcLocationListDtos[i]?.biznessEventPCLocationId
        ) {
          console.log('line 1733');
          console.log(`Location loop ${i}:`);
          console.log(
            `bepcRow.pcLocationListDtos[i]?.biznessEventPCLocationId`
          );
          console.log(bepcRow.pcLocationListDtos[i]?.biznessEventPCLocationId);
          console.log(`bepcRow.pcLocationListDtos[i]`);
          console.log(bepcRow.pcLocationListDtos[i]);

          assignForUpdateBepcLocation(bepcRow.pcLocationListDtos[i]);
        }
      }
      return updateBepc;
    };

    const assignForCreateBepcBrand = (
      bepcBrandRow: IPCBrandListDto,
      parentBiznessEventProcessConfigurationId: number
    ) => {
      const createBepcBrand: ICreatePCBrandListDto = {
        biznessEventProcessConfigurationId:
          parentBiznessEventProcessConfigurationId,
        brandId: bepcBrandRow.brandId,
      };
      return createBepcBrand;
    };

    const assignForCreateBepcProductGroup = (
      bepcProductGroupRow: IPCProductGroupListDtos,
      parentBiznessEventProcessConfigurationId: number
    ) => {
      const createBepcProductGroup: ICreatePCProductGroupListDtos = {
        biznessEventProcessConfigurationId:
          parentBiznessEventProcessConfigurationId,
        productGroupId: bepcProductGroupRow.productGroupId,
      };
      return createBepcProductGroup;
    };

    const assignForCreateBepcLocation = (
      bepcLocationRow: IPCLocationListDtos,
      parentBiznessEventProcessConfigurationId: number
    ) => {
      const createBepcLocation: ICreatePCLocationListDtos = {
        biznessEventProcessConfigurationId:
          parentBiznessEventProcessConfigurationId,
        locationId: bepcLocationRow.locationId,
        // createPCUserListDtos: ICreatePCUserListDtos[];
        createPCUserListDtos: [],
      };

      for (let i = 0; i < (bepcLocationRow.pcUserListDtos?.length || 0); i++) {
        // fresh create1 of bepcUser
        if (
          bepcLocationRow.pcUserListDtos &&
          !bepcLocationRow.pcUserListDtos[i].biznessEventPCUserId &&
          !bepcLocationRow.biznessEventPCLocationId
        ) {
          createBepcLocation.createPCUserListDtos.push(
            assignForCreateBepcUser(
              bepcLocationRow.pcUserListDtos[i],
              0,
              parentBiznessEventProcessConfigurationId
            )
          );
        }
      }

      return createBepcLocation;
    };

    const assignForUpdateBepcLocation = (
      bepcLocationRow: IPCLocationListDtos
      // parentBiznessEventPCLocationId: number
    ) => {
      // bepcLocation table er kono update nei,,, but child er notFresh create/update thaktei paare

      for (let i = 0; i < (bepcLocationRow.pcUserListDtos?.length || 0); i++) {
        // biznessEventPCLocationId ase emon wala pcUser create, maane bairer createUser
        if (
          bepcLocationRow.pcUserListDtos &&
          !bepcLocationRow.pcUserListDtos[i].biznessEventPCUserId &&
          bepcLocationRow.biznessEventPCLocationId
        ) {
          dataToGetSaved.createPCUserListDtos.push(
            assignForCreateBepcUser(
              bepcLocationRow.pcUserListDtos[i],
              bepcLocationRow.biznessEventPCLocationId,
              bepcLocationRow.biznessEventProcessConfigurationId
            )
          );
        }
        // biznessEventPCUser ase, Maane update hobe pcUser, update to emeno shob baire
        else if (
          bepcLocationRow.pcUserListDtos &&
          bepcLocationRow.pcUserListDtos[i].biznessEventPCUserId
        ) {
          dataToGetSaved.updatePCUserListDtos.push(
            assignForUpdateBepcUser(bepcLocationRow.pcUserListDtos[i])
          );
        }
      }
    };

    const assignForCreateBepcUser = (
      bepcUserRow: IPCUserListDtos,
      parentBiznessEventPCLocationId: number,
      parentBiznessEventProcessConfigurationId?: number | null
    ) => {
      const createBepcUser: ICreatePCUserListDtos = {
        biznessEventPCLocationId: parentBiznessEventPCLocationId,
        // biznessEventPCUserId?: number,
        biznessEventProcessConfigurationId:
          parentBiznessEventProcessConfigurationId || 0,
        userId: bepcUserRow.userId,
        // userName: bepcUserRow.userName,
        mandatory: bepcUserRow.mandatory || false,
        crud: bepcUserRow.crud || 'CRUD',
        maxActionTimeinDays: bepcUserRow.maxActionTimeinDays || 0,
        totalEventValueLimit: bepcUserRow.totalEventValueLimit || 0,
        createPCUserProductGroupListDtos: [],
        createPCUserBrandListDtos: [],
        createPCUserProductListDtos: [],
        createPCButtonListDtos: [],
      };

      // ---------------------fresh createPCUserBrand--------------------------------------------

      for (
        let i = 0;
        i <
        (bepcUserRow.pcUserBrandListDtos?.length &&
        !bepcUserRow.isAllPCUserBrandSelected
          ? bepcUserRow.pcUserBrandListDtos?.length
          : 0);
        i++
      ) {
        // fresh create1 userBrand
        if (
          bepcUserRow.pcUserBrandListDtos &&
          !bepcUserRow.pcUserBrandListDtos[i].biznessEventPCUserBrandId &&
          !bepcUserRow.biznessEventPCUserId
        ) {
          if (
            createBepcUser.createPCUserBrandListDtos === null ||
            createBepcUser.createPCUserBrandListDtos === undefined
          ) {
            createBepcUser.createPCUserBrandListDtos = [];
          }
          createBepcUser.createPCUserBrandListDtos.push(
            assignForCreateUserBrand(bepcUserRow.pcUserBrandListDtos[i], 0)
          );
        }
      }

      // ---------------------fresh createPCUserProductGroup--------------------------------------------

      for (
        let i = 0;
        i <
        (bepcUserRow.pcUserProductGroupListDtos?.length &&
        !bepcUserRow.isAllPCUserProductGroupSelected
          ? bepcUserRow.pcUserProductGroupListDtos?.length
          : 0);
        i++
      ) {
        // fresh create1 createUserProductGroup
        if (
          bepcUserRow.pcUserProductGroupListDtos &&
          !bepcUserRow.pcUserProductGroupListDtos[i]
            .biznessEventPCUserProductGroupId &&
          !bepcUserRow.biznessEventPCUserId
        ) {
          if (
            createBepcUser.createPCUserProductGroupListDtos === null ||
            createBepcUser.createPCUserProductGroupListDtos === undefined
          ) {
            createBepcUser.createPCUserProductGroupListDtos = [];
          }
          createBepcUser.createPCUserProductGroupListDtos.push(
            assignForCreateUserProductGroup(
              bepcUserRow.pcUserProductGroupListDtos[i],
              0
            )
          );
        }
      }

      // --------------------- fresh createPCUserProduct--------------------------------------------

      for (
        let i = 0;
        i <
        (bepcUserRow.pcUserProductListDtos?.length &&
        !bepcUserRow.isAllPCUserProductSelected
          ? bepcUserRow.pcUserProductListDtos?.length
          : 0);
        i++
      ) {
        // fresh create1 createUserProduct
        if (
          bepcUserRow.pcUserProductListDtos &&
          !bepcUserRow.pcUserProductListDtos[i].biznessEventPCUserProductId &&
          !bepcUserRow.biznessEventPCUserId
        ) {
          if (
            createBepcUser.createPCUserProductListDtos === null ||
            createBepcUser.createPCUserProductListDtos === undefined
          ) {
            createBepcUser.createPCUserProductListDtos = [];
          }
          createBepcUser.createPCUserProductListDtos.push(
            assignForCreateUserProduct(bepcUserRow.pcUserProductListDtos[i], 0)
          );
        }
      }

      // --------------------- create,updatePCButtonListDtos--------------------------------------------

      for (let i = 0; i < (bepcUserRow.pcButtonListDtos?.length || 0); i++) {
        // fresh create1 createUserButtonList
        if (
          bepcUserRow.pcButtonListDtos &&
          !bepcUserRow.pcButtonListDtos[i].biznessEventPCPageButtonAccessId &&
          !bepcUserRow.biznessEventPCUserId
        ) {
          if (
            createBepcUser.createPCButtonListDtos === null ||
            createBepcUser.createPCButtonListDtos === undefined
          ) {
            createBepcUser.createPCButtonListDtos = [];
          }
          createBepcUser.createPCButtonListDtos.push(
            assignForCreateUserButton(bepcUserRow.pcButtonListDtos[i], 0)
          );
        }
      }

      return createBepcUser;
    };

    const assignForUpdateBepcUser = (bepcUserRow: IPCUserListDtos) => {
      const updateBepcUser: IUpdatePCUserListDtos = {
        biznessEventPCUserId: bepcUserRow.biznessEventPCUserId,
        mandatory: bepcUserRow.mandatory || false,
        crud: bepcUserRow.crud || 'CRUD',
        maxActionTimeinDays: bepcUserRow.maxActionTimeinDays || 0,
        totalEventValueLimit: bepcUserRow.totalEventValueLimit || 0,
      };

      // --------------------- updatePCUserBrand, notFreshCreatePCUserBrand--------------------------------------------

      for (
        let i = 0;
        i <
        (bepcUserRow.pcUserBrandListDtos?.length &&
        !bepcUserRow.isAllPCUserBrandSelected
          ? bepcUserRow.pcUserBrandListDtos?.length
          : 0);
        i++
      ) {
        // notFresh create, create2, bairer createUserBrand
        if (
          bepcUserRow.pcUserBrandListDtos &&
          !bepcUserRow.pcUserBrandListDtos[i].biznessEventPCUserBrandId &&
          bepcUserRow.biznessEventPCUserId
        ) {
          dataToGetSaved.createPCUserBrandListDtos.push(
            assignForCreateUserBrand(
              bepcUserRow.pcUserBrandListDtos[i],
              bepcUserRow.biznessEventPCUserId
            )
          );
        }
        // update userBrand, update emneo baire
        else if (
          bepcUserRow.pcUserBrandListDtos &&
          bepcUserRow.pcUserBrandListDtos[i].biznessEventPCUserBrandId
        ) {
          dataToGetSaved.updatePCUserBrandListDtos.push(
            assignForUpdateUserBrand(bepcUserRow.pcUserBrandListDtos[i])
          );
        }
      }

      // --------------------- updatePCUserProductGroup, notFrshUpdatePCUserProductGroup--------------------------------------------

      for (
        let i = 0;
        i <
        (bepcUserRow.pcUserProductGroupListDtos?.length &&
        !bepcUserRow.isAllPCUserProductGroupSelected
          ? bepcUserRow.pcUserProductGroupListDtos?.length
          : 0);
        i++
      ) {
        // notFresh create, create2, bairer createUserProductGroup
        if (
          bepcUserRow.pcUserProductGroupListDtos &&
          !bepcUserRow.pcUserProductGroupListDtos[i]
            .biznessEventPCUserProductGroupId &&
          bepcUserRow.biznessEventPCUserId
        ) {
          dataToGetSaved.createPCUserProductGroupListDtos.push(
            assignForCreateUserProductGroup(
              bepcUserRow.pcUserProductGroupListDtos[i],
              bepcUserRow.biznessEventPCUserId
            )
          );
        }
        // update userProductGroup, update emneo baire
        else if (
          bepcUserRow.pcUserProductGroupListDtos &&
          bepcUserRow.pcUserProductGroupListDtos[i]
            .biznessEventPCUserProductGroupId
        ) {
          dataToGetSaved.updatePCUserProductGroupListDtos.push(
            assignForUpdateUserProductGroup(
              bepcUserRow.pcUserProductGroupListDtos[i]
            )
          );
        }
      }

      // --------------------- updatePCUserProduct, notFreshcreatePCUserProduct--------------------------------------------
      for (
        let i = 0;
        i <
        (bepcUserRow.pcUserProductListDtos?.length &&
        !bepcUserRow.isAllPCUserProductSelected
          ? bepcUserRow.pcUserProductListDtos?.length
          : 0);
        i++
      ) {
        // notFresh create2, bairer createUserProduct
        if (
          bepcUserRow.pcUserProductListDtos &&
          !bepcUserRow.pcUserProductListDtos[i].biznessEventPCUserProductId &&
          bepcUserRow.biznessEventPCUserId
        ) {
          dataToGetSaved.createPCUserProductListDto.push(
            assignForCreateUserProduct(
              bepcUserRow.pcUserProductListDtos[i],
              bepcUserRow.biznessEventPCUserId
            )
          );
        }
        // update userProduct, update emneo baire
        else if (
          bepcUserRow.pcUserProductListDtos &&
          bepcUserRow.pcUserProductListDtos[i].biznessEventPCUserProductId
        ) {
          dataToGetSaved.updatePCUserProductListDto.push(
            assignForUpdateUserProduct(bepcUserRow.pcUserProductListDtos[i])
          );
        }
      }

      // --------------------- updatePCButtonListDtos, notFreshCreatePCButtonListDtos--------------------------------------------

      for (let i = 0; i < (bepcUserRow.pcButtonListDtos?.length || 0); i++) {
        // notFresh create, create2, bairer createUserButtonList
        if (
          bepcUserRow.pcButtonListDtos &&
          !bepcUserRow.pcButtonListDtos[i].biznessEventPCPageButtonAccessId &&
          bepcUserRow.biznessEventPCUserId
        ) {
          dataToGetSaved.createPCButtonListDto.push(
            assignForCreateUserButton(
              bepcUserRow.pcButtonListDtos[i],
              bepcUserRow.biznessEventPCUserId
            )
          );
        }
        // update UserButtonList, update nai
        // if (
        //   bepcUserRow.pcButtonListDtos &&
        //   bepcUserRow.pcButtonListDtos[i].biznessEventPCPageButtonAccessId
        // ) {
        // }
      }

      return updateBepcUser;
    };

    const assignForCreateUserProductGroup = (
      bepcUserProductGroupRow: IPCUserProductGroupListDtos,
      parentBiznessEventPCUserId: number
    ) => {
      const createUserProductGroup: ICreatePCUserProductGroupListDtos = {
        biznessEventPCUserId: parentBiznessEventPCUserId,
        productGroupId: bepcUserProductGroupRow.productGroupId,
        productValueLimit: bepcUserProductGroupRow.productValueLimit || 0,
      };
      return createUserProductGroup;
    };
    const assignForUpdateUserProductGroup = (
      bepcUserProductGroupRow: IPCUserProductGroupListDtos
    ) => {
      const updateUserProductGroup: IUpdatePCUserProductGroupListDtos = {
        biznessEventPCUserProductGroupId:
          bepcUserProductGroupRow.biznessEventPCUserProductGroupId,
        productValueLimit: bepcUserProductGroupRow.productValueLimit || 0,
      };
      return updateUserProductGroup;
    };

    const assignForCreateUserBrand = (
      bepcUserBrandRow: IPCUserBrandListDtos,
      parentBiznessEventPCUserId: number
    ) => {
      const createUserBrand: ICreatePCUserBrandListDtos = {
        biznessEventPCUserId: parentBiznessEventPCUserId,
        brandId: bepcUserBrandRow.brandId,
        brandValueLmit: bepcUserBrandRow.brandValueLmit || 0,
      };
      return createUserBrand;
    };
    const assignForUpdateUserBrand = (
      bepcUserBrandRow: IPCUserBrandListDtos
    ) => {
      const updateUserBrand: IUpdatePCUserBrandListDtos = {
        biznessEventPCUserBrandId: bepcUserBrandRow.biznessEventPCUserBrandId,
        brandValueLmit: bepcUserBrandRow.brandValueLmit || 0,
      };
      return updateUserBrand;
    };

    const assignForCreateUserProduct = (
      bepcUserProductRow: IPCUserProductListDto,
      parentBiznessEventPCUserId: number
    ) => {
      const createUserProduct: ICreatePCUserProductListDto = {
        biznessEventPCUserId: parentBiznessEventPCUserId,
        productId: bepcUserProductRow.productId,
        productValueLimit: bepcUserProductRow.productValueLimit || 0,
      };
      return createUserProduct;
    };
    const assignForUpdateUserProduct = (
      bepcUserProductRow: IPCUserProductListDto
    ) => {
      const updateUserProduct: IUpdatePCUserProductListDto = {
        biznessEventPCUserProductId:
          bepcUserProductRow.biznessEventPCUserProductId || 0,
        productValueLimit: bepcUserProductRow.productValueLimit || 0,
      };
      return updateUserProduct;
    };

    const assignForCreateUserButton = (
      bepcUserButtonRow: IPCButtonListDto,
      parentBiznessEventPCUserId: number
    ) => {
      const createUserButton: ICreatePCButtonListDto = {
        biznessEventPCUserId: parentBiznessEventPCUserId,
        biznessEventPCPageGenActionId:
          bepcUserButtonRow.biznessEventPCPageGenActionId,
      };
      return createUserButton;
    };

    // -----------------------------delete handling functions starts-------------------------
    // --------------------2nd layer--------no need of 1st layer----------------

    const checkIfInvalidDeleteLocation = (
      locationRow: IDeletePCLocationListDtosVM
    ) => {
      // if the row exist in bepcGridStateDeletedRow, if exist true else false
      const isInvalidLocationRow = bepcGridStateDeletedRow.some(
        (item) =>
          item.biznessEventProcessConfigurationId ===
          locationRow.biznessEventProcessConfigurationId
      );
      return isInvalidLocationRow;
    };

    const checkIfInvalidDeleteBrand = (brandRow: IDeletePCBrandListDtoVM) => {
      // if the row exist in bepcGridStateDeletedRow, if exist true else false
      const isInvalidBrandRow = bepcGridStateDeletedRow.some(
        (item) =>
          item.biznessEventProcessConfigurationId ===
          brandRow.biznessEventProcessConfigurationId
      );
      return isInvalidBrandRow;
    };

    const checkIfInvalidDeleteProductGroup = (
      productGroupRow: IDeletePCProductGroupListDtosVM
    ) => {
      // if the row exist in bepcGridStateDeletedRow, if exist true else false
      const isInvalidProductGroupRow = bepcGridStateDeletedRow.some(
        (item) =>
          item.biznessEventProcessConfigurationId ===
          productGroupRow.biznessEventProcessConfigurationId
      );
      return isInvalidProductGroupRow;
    };
    // --------------------3rd layer------------------------
    // getting locationRow from allDataBepc grid, as it doesn't exist in deletedLocation array
    const allLocationsFromBepc = bepcGridStateNotDirtyWithoutEmpty.flatMap(
      (item) =>
        item.pcLocationListDtos
          ? item.pcLocationListDtos
              .filter((location) => location.biznessEventPCLocationId !== null)
              .map((location) => ({
                biznessEventPCLocationId: location.biznessEventPCLocationId,
                biznessEventProcessConfigurationId:
                  location.biznessEventProcessConfigurationId,
              }))
          : []
    );
    const allUsersFromBepc = bepcGridStateNotDirtyWithoutEmpty.flatMap(
      (item) =>
        item.pcLocationListDtos
          ? item.pcLocationListDtos.flatMap((location) =>
              location.pcUserListDtos
                ? location.pcUserListDtos
                    .filter((user) => user.biznessEventPCUserId !== null)
                    .map((user) => ({
                      biznessEventPCUserId: user.biznessEventPCUserId || 0,
                      biznessEventPCLocationId:
                        user.biznessEventPCLocationId || 0,
                    }))
                : []
            )
          : []
    );
    const checkIfInvalidDeleteUser = (userRow: IDeletePCUserListDtosVM) => {
      // if the row exist in deletedLocation, if exist false else true
      let isInvalidUserRow = false;
      isInvalidUserRow = deletedItemsLocation.some(
        (item) =>
          item.biznessEventPCLocationId === userRow.biznessEventPCLocationId
      );
      if (!isInvalidUserRow) {
        const locationRow = allLocationsFromBepc.find(
          (item) =>
            item.biznessEventPCLocationId === userRow.biznessEventPCLocationId
        );
        isInvalidUserRow = locationRow
          ? checkIfInvalidDeleteLocation(
              locationRow as IDeletePCLocationListDtosVM
            )
          : false;
      }
      return isInvalidUserRow;
    };
    // getting userRows from allDataBepc grid, as it doesn't exist in deletedUsers array

    // --------------------4th layer------------------------
    const checkIfInvalidDeleteUserBrand = (
      userBrandRow: IDeletePCUserBrandListDtosVM
    ) => {
      // if the row exist in deletedUsers, if exist false else true
      let isInvalidUserBrandRow = false;
      isInvalidUserBrandRow = deletedItemsUsers.some(
        (item) =>
          item.biznessEventPCUserId === userBrandRow.biznessEventPCUserId
      );
      if (!isInvalidUserBrandRow) {
        const userRow = allUsersFromBepc.find(
          (item) =>
            item.biznessEventPCUserId === userBrandRow.biznessEventPCUserId
        );
        isInvalidUserBrandRow = userRow
          ? checkIfInvalidDeleteUser(userRow)
          : false;
      }
      return isInvalidUserBrandRow;
    };

    const checkIfInvalidDeleteUserProductGroup = (
      userProductGroupRow: IDeletePCUserProductGroupListDtosVM
    ) => {
      // if the row exist in deletedUsers, if exist false else true
      let isInvalidUserProductGroupRow = false;
      isInvalidUserProductGroupRow = deletedItemsUsers.some(
        (item) =>
          item.biznessEventPCUserId === userProductGroupRow.biznessEventPCUserId
      );
      if (!isInvalidUserProductGroupRow) {
        const userRow = allUsersFromBepc.find(
          (item) =>
            item.biznessEventPCUserId ===
            userProductGroupRow.biznessEventPCUserId
        );
        isInvalidUserProductGroupRow = userRow
          ? checkIfInvalidDeleteUser(userRow)
          : false;
      }
      return isInvalidUserProductGroupRow;
    };

    const checkIfInvalidDeleteUserProduct = (
      userProductRow: IDeletePCUserProductListDtoVM
    ) => {
      // if the row exist in deletedUsers, if exist false else true
      let isInvalidUserProductRow = false;
      isInvalidUserProductRow = deletedItemsUsers.some(
        (item) =>
          item.biznessEventPCUserId === userProductRow.biznessEventPCUserId
      );
      if (!isInvalidUserProductRow) {
        const userRow = allUsersFromBepc.find(
          (item) =>
            item.biznessEventPCUserId === userProductRow.biznessEventPCUserId
        );
        isInvalidUserProductRow = userRow
          ? checkIfInvalidDeleteUser(userRow)
          : false;
      }
      return isInvalidUserProductRow;
    };

    const checkIfInvalidDeleteUserButton = (
      userButtonRow: IDeletePCButtonListDtoVM
    ) => {
      // if the row exist in deletedUsers, if exist false else true
      let isInvalidUserButtonRow = false;
      isInvalidUserButtonRow = deletedItemsUsers.some(
        (item) =>
          item.biznessEventPCUserId === userButtonRow.biznessEventPCUserId
      );
      if (!isInvalidUserButtonRow) {
        const userRow = allUsersFromBepc.find(
          (item) =>
            item.biznessEventPCUserId === userButtonRow.biznessEventPCUserId
        );
        isInvalidUserButtonRow = userRow
          ? checkIfInvalidDeleteUser(userRow)
          : false;
      }
      return isInvalidUserButtonRow;
    };
    // -----------------------------delete handling functions ends-------------------------

    // ------------/-------------ALL READY PROCESSED DATA FOR SAVING FUNCTIONS ENDS------------/---------

    for (let i = 0; i < bepcGridCurrentWithoutEmpty.length; i++) {
      if (!bepcGridCurrentWithoutEmpty[i].biznessEventProcessConfigurationId) {
        console.log('dhuksi');
        dataToGetSaved.createBiznessEventProcessConfigurationInfoForChainConfig.push(
          assignForCreateBepc(bepcGridCurrentWithoutEmpty[i])
        );
      } else {
        const tempUpdateBepcRow = assignForUpdateBepc(
          bepcGridCurrentWithoutEmpty[i]
        );
        dataToGetSaved.updateBiznessEventProcessConfigurationInfoForChainConfig.push(
          tempUpdateBepcRow
        );
      }
    }
    // delete assigns--------------
    dataToGetSaved.deleteBiznessEventProcessConfigurationInfoForChainConfig =
      bepcGridStateDeletedRow;

    dataToGetSaved.deletePCLocationListDtos =
      deletedItemsLocation
        .filter((location) => !checkIfInvalidDeleteLocation(location))
        .map((location) => ({
          biznessEventPCLocationId: location.biznessEventPCLocationId,
        })) || [];

    dataToGetSaved.deletePCProductGroupListDtos =
      deletedItemsPCProductGroup
        .filter(
          (productGroup) => !checkIfInvalidDeleteProductGroup(productGroup)
        )
        .map((productGroup) => ({
          biznessEventPCProductGroupId:
            productGroup.biznessEventPCProductGroupId,
        })) || [];

    dataToGetSaved.deletePCBrandListDto =
      deletedItemsPCProductBrand
        .filter((productBrand) => !checkIfInvalidDeleteBrand(productBrand))
        .map((productBrand) => ({
          biznessEventPCBrandId: productBrand.biznessEventPCBrandId,
        })) || [];

    dataToGetSaved.deletePCUserListDtos =
      deletedItemsUsers
        .filter((user) => !checkIfInvalidDeleteUser(user))
        .map((user) => ({
          biznessEventPCUserId: user.biznessEventPCUserId,
        })) || [];

    dataToGetSaved.deletePCUserProductGroupListDtos =
      deletedItemsPCUserProductGroup
        .filter(
          (userProductGroup) =>
            !checkIfInvalidDeleteUserProductGroup(userProductGroup)
        )
        .map((userProductGroup) => ({
          biznessEventPCUserProductGroupId:
            userProductGroup.biznessEventPCUserProductGroupId,
        })) || [];

    dataToGetSaved.deletePCUserBrandListDtos =
      deletedItemsPCUserProductBrand
        .filter(
          (userProductBrand) => !checkIfInvalidDeleteUserBrand(userProductBrand)
        )
        .map((userProductBrand) => ({
          biznessEventPCUserBrandId: userProductBrand.biznessEventPCUserBrandId,
        })) || [];

    dataToGetSaved.deletePCUserProductListDto =
      deletedItemsPCUserProduct
        .filter((userProduct) => !checkIfInvalidDeleteUserProduct(userProduct))
        .map((userProduct) => ({
          biznessEventPCUserProductId: userProduct.biznessEventPCUserProductId,
        })) || [];

    dataToGetSaved.deletePCButtonListDto =
      deletedItemsPCUserButton
        .filter((userButton) => !checkIfInvalidDeleteUserButton(userButton))
        .map((userButton) => ({
          biznessEventPCPageButtonAccessId:
            userButton.biznessEventPCPageButtonAccessId,
        })) || [];
    // delete assigns-------ENDS-------
    console.log(
      '-------------------------READY PROCESSED DATA FOR SAVE---------------------'
    );
    console.log(dataToGetSaved);
    processSaveChainConfig(dataToGetSaved);
  };
  const rupom = () => {
    console.log('Bepc Current State-----------HELLO FROM RUPOM FUNCT----');
    console.log(bepcGridState);
  };

  const shouldShowDiv = (obj: any) => {
    return obj && Object.values(obj).some((value) => value === true);
  };

  const mergedAllOptionsDuelSelectList = (
    rawOptions: any[] | undefined | null,
    type: string
  ) => {
    const indexNoBepcObjKey = Object.keys(selectedBepcRow)[0]; // Extract the first (and only) key
    const indexNoBepc = parseInt(indexNoBepcObjKey, 10);
    // getting index of highlighted Location
    const tempIndexNoLocation = bepcGridState[
      indexNoBepc
    ]?.pcLocationListDtos?.findIndex(
      (element) => element.locationId === selectedLocationDLRow?.locationId
    );
    const indexNoLocation =
      tempIndexNoLocation !== undefined &&
      tempIndexNoLocation !== null &&
      tempIndexNoLocation !== -1
        ? tempIndexNoLocation
        : null;
    /// ///////////////////////////////////
    const indexNoUserObjKey = Object.keys(selectedUsersDLTRow)[0]; // Extract the first (and only) key
    const indexNoUser = parseInt(indexNoUserObjKey, 10);

    let mergedOptions: any[] | undefined | null = [];
    switch (type) {
      case 'PCLocation':
        if (selectedBepcRow[indexNoBepcObjKey] && rawOptions) {
          const selectedItemsLocationRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcLocationListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsLocationRAW.find(
              (selectedItemsLocationRAWRow) =>
                selectedItemsLocationRAWRow.locationId ===
                rawOptionRow.locationId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      case 'PCProductGroup':
        if (selectedBepcRow[indexNoBepcObjKey] && rawOptions) {
          const selectedItemsPCProductGroupRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcProductGroupListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsPCProductGroupRAW.find(
              (selectedItemsPCProductGroupRAWRow) =>
                selectedItemsPCProductGroupRAWRow.productGroupId ===
                rawOptionRow.productGroupId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      case 'PCProductBrand':
        if (selectedBepcRow[indexNoBepcObjKey] && rawOptions) {
          const selectedItemsPCProductBrandRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcBrandListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsPCProductBrandRAW.find(
              (selectedItemsPCProductBrandRAWRow) =>
                selectedItemsPCProductBrandRAWRow.brandId ===
                rawOptionRow.brandId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      case 'PCUser':
        if (
          selectedBepcRow[indexNoBepc] &&
          indexNoLocation !== null &&
          rawOptions
        ) {
          console.log('-----if----UserRawOptions------------');
          console.log(rawOptions);

          const selectedItemsUsersRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcLocationListDtos?.[
              indexNoLocation
            ]?.pcUserListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsUsersRAW.find(
              (selectedItemsUsersRAWRow) =>
                selectedItemsUsersRAWRow.userId === rawOptionRow.userId
            );
            return match || rawOptionRow;
          });
          console.log('---------user mergedOptions------------');
          console.log(mergedOptions);
        } else {
          mergedOptions = rawOptions;
          console.log(
            '---------Else User mergedOptions/RawOptions------------'
          );
          console.log(mergedOptions);
        }
        break;
      case 'PCUserProductGroup':
        if (
          selectedBepcRow[indexNoBepc] &&
          indexNoLocation !== null &&
          selectedItemsUsers[indexNoUser] &&
          rawOptions
        ) {
          const selectedItemsPCUserProductGroupRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcLocationListDtos?.[
              indexNoLocation
            ]?.pcUserListDtos?.[indexNoUser]?.pcUserProductGroupListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsPCUserProductGroupRAW.find(
              (selectedItemsPCUserProductGroupRAWRow) =>
                selectedItemsPCUserProductGroupRAWRow.productGroupId ===
                rawOptionRow.productGroupId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      case 'PCUserProductBrand':
        if (
          selectedBepcRow[indexNoBepc] &&
          indexNoLocation !== null &&
          selectedItemsUsers[indexNoUser] &&
          rawOptions
        ) {
          const selectedItemsPCUserProductBrandRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcLocationListDtos?.[
              indexNoLocation
            ]?.pcUserListDtos?.[indexNoUser]?.pcUserBrandListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsPCUserProductBrandRAW.find(
              (selectedItemsPCUserProductBrandRAWRow) =>
                selectedItemsPCUserProductBrandRAWRow.brandId ===
                rawOptionRow.brandId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      case 'PCUserProduct':
        if (
          selectedBepcRow[indexNoBepc] &&
          indexNoLocation !== null &&
          selectedItemsUsers[indexNoUser] &&
          rawOptions
        ) {
          const selectedItemsPCUserProductRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcLocationListDtos?.[
              indexNoLocation
            ]?.pcUserListDtos?.[indexNoUser]?.pcUserProductListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsPCUserProductRAW.find(
              (selectedItemsPCUserProductRAWRow) =>
                selectedItemsPCUserProductRAWRow.productId ===
                rawOptionRow.productId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      case 'PCUserButton':
        if (
          selectedBepcRow[indexNoBepc] &&
          indexNoLocation !== null &&
          selectedItemsUsers[indexNoUser] &&
          rawOptions
        ) {
          const selectedItemsPCUserButtonRAW =
            bepcGridStateNotDirty[indexNoBepc]?.pcLocationListDtos?.[
              indexNoLocation
            ]?.pcUserListDtos?.[indexNoUser]?.pcButtonListDtos || [];
          // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
          mergedOptions = rawOptions.map((rawOptionRow) => {
            const match = selectedItemsPCUserButtonRAW.find(
              (selectedItemsPCUserButtonRAWRow) =>
                selectedItemsPCUserButtonRAWRow.biznessEventPCPageGenActionId ===
                rawOptionRow.biznessEventPCPageGenActionId
            );
            return match || rawOptionRow;
          });
        } else {
          mergedOptions = rawOptions;
        }
        break;
      default:
        mergedOptions = rawOptions;
        break;
    }
    return JSON.parse(JSON.stringify(mergedOptions));
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
                {biznessEventName
                  ? biznessEventName.replace(/([A-Z])(?=[A-Z][a-z])/g, '$1 ')
                  : 'Chain Configuration'}
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 text-start  mt-5">
                <div className=" flex">
                  <div className="w-full">
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
                          //   loading={
                          //     requisitionNoOptionsLoading ||
                          //     requisitionNoOptionsIsFetching
                          //   }
                          options={fixedTaskTemplateOptions || []}
                          value={selectedFixedTaskTemplate || null}
                          // onChange={(event, item) => {}} // React-hook-form manages the state
                          onChange={(event, selectedItem) => {
                            setSelectedFixedTaskTemplate(selectedItem);
                            onChange(selectedItem);
                          }}
                          onBlur={onBlur} // Trigger validation on blur
                          getOptionLabel={(option) =>
                            option ? option.name : ''
                          }
                          isOptionEqualToValue={(option, selectedValue) =>
                            option.name === selectedValue?.name &&
                            option.fixedTaskTemplateId ===
                              selectedValue?.fixedTaskTemplateId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Chain Name"
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
                              }}
                              sx={{ width: '100%', marginTop: 1 }}
                              inputRef={ref}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="mx-2 pt-1">
                    <button
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                      onClick={() => {
                        setFixedTaskTemplateCreateModal(true);
                      }}
                    >
                      Add+
                    </button>
                  </div>
                </div>

                <div className="w-full mt-4 modifiedEditTable">
                  <MaterialReactTable table={bepcGridInitializer} />
                </div>
                {shouldShowDiv(selectedBepcRow) ? (
                  <div className="w-full grid grid-cols-3 gap-5">
                    <DualListSelectorWithRowSelection
                      items={
                        mergedAllOptionsDuelSelectList(
                          locationOptions?.data,
                          'PCLocation'
                        ) || []
                      }
                      selectedItems={selectedItemsLocation}
                      setSelectedItems={setSelectedItemsLocation}
                      deletedItems={deletedItemsLocation}
                      setDeletedItems={setDeletedItemsLocation}
                      highlightedRow={selectedLocationDLRow}
                      setHighlightedRow={setSelectedLocationDLRow}
                      primaryKeyToDelete="biznessEventPCLocationId"
                      parentPrimaryKey="biznessEventProcessConfigurationId"
                      idKey="locationId"
                      optionName="locationName"
                      caption="Locations"
                    />
                    <DualListSelector
                      items={
                        mergedAllOptionsDuelSelectList(
                          productGroupOptions,
                          'PCProductGroup'
                        ) || []
                      }
                      selectedItems={selectedItemsPCProductGroup}
                      setSelectedItems={setSelectedItemsPCProductGroup}
                      deletedItems={deletedItemsPCProductGroup}
                      setDeletedItems={setDeletedItemsPCProductGroup}
                      primaryKeyToDelete="biznessEventPCProductGroupId"
                      parentPrimaryKey="biznessEventProcessConfigurationId"
                      idKey="productGroupId"
                      optionName="productGroupName"
                      caption="Product Group"
                    />
                    <DualListSelector
                      items={
                        mergedAllOptionsDuelSelectList(
                          brandOptions?.data,
                          'PCProductBrand'
                        ) || []
                      }
                      selectedItems={selectedItemsPCProductBrand || []}
                      setSelectedItems={setSelectedItemsPCProductBrand}
                      deletedItems={deletedItemsPCProductBrand}
                      setDeletedItems={setDeletedItemsPCProductBrand}
                      primaryKeyToDelete="biznessEventPCBrandId"
                      parentPrimaryKey="biznessEventProcessConfigurationId"
                      idKey="brandId"
                      optionName="brandName"
                      caption="Product Brand"
                    />
                  </div>
                ) : (
                  ''
                )}

                <div className="w-full grid grid-cols-4 gap-5">
                  {shouldShowDiv(selectedBepcRow) &&
                  selectedLocationDLRow?.locationId ? (
                    <div className="col-span-4">
                      <DualListSelectorWithGrid
                        // items={
                        //   mergedAllOptionsDuelSelectList(
                        //     securityUserOptions?.data,
                        //     'PCUser'
                        //   ) || []
                        // }
                        items={
                          mergedAllOptionsDuelSelectList(
                            securityUserOptions?.data,
                            'PCUser'
                          ) || []
                        }
                        selectedItems={selectedItemsUsers} // selected Row Of Location from duelSelectList
                        setSelectedItems={setSelectedItemsUsers}
                        deletedItems={deletedItemsUsers}
                        setDeletedItems={setDeletedItemsUsers}
                        selectedUsersDLTRow={selectedUsersDLTRow}
                        setSelectedUsersDLTRow={setSelectedUsersDLTRow}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  {shouldShowDiv(selectedBepcRow) &&
                  selectedLocationDLRow?.locationId &&
                  shouldShowDiv(selectedUsersDLTRow) ? (
                    <div className="col-span-4 grid grid-cols-2 gap-3">
                      <div>
                        <DualListSelector
                          items={
                            mergedAllOptionsDuelSelectList(
                              buttonOptions?.data,
                              'PCUserButton'
                            ) || []
                          }
                          selectedItems={selectedItemsPCUserButton || []}
                          setSelectedItems={setSelectedItemsPCUserButton}
                          deletedItems={deletedItemsPCUserButton}
                          setDeletedItems={setDeletedItemsPCUserButton}
                          primaryKeyToDelete="biznessEventPCPageButtonAccessId"
                          parentPrimaryKey="biznessEventPCUserId"
                          idKey="biznessEventPCPageGenActionId"
                          optionName="biznessEventPCPageGenActionName"
                          caption="PC User Button"
                        />
                      </div>
                      <div className="">
                        <DualListSelectorWithLimit
                          items={
                            mergedAllOptionsDuelSelectList(
                              productGroupOptions,
                              'PCUserProductGroup'
                            ) || []
                          }
                          selectedItems={selectedItemsPCUserProductGroup}
                          setSelectedItems={setSelectedItemsPCUserProductGroup}
                          deletedItems={deletedItemsPCUserProductGroup}
                          setDeletedItems={setDeletedItemsPCUserProductGroup}
                          isAllItemsChecked={isAllSelectedPCUserProductGroup}
                          setIsAllItemsChecked={
                            setIsAllSelectedPCUserProductGroup
                          }
                          primaryKeyToDelete="biznessEventPCUserProductGroupId"
                          parentPrimaryKey="biznessEventPCUserId"
                          idKey="productGroupId"
                          optionName="productGroupName"
                          limitProperty="productValueLimit"
                          caption="PC User Product Group"
                        />
                      </div>
                      <div>
                        <DualListSelectorWithLimit
                          items={
                            mergedAllOptionsDuelSelectList(
                              brandOptions?.data,
                              'PCUserProductBrand'
                            ) || []
                          }
                          selectedItems={selectedItemsPCUserProductBrand || []}
                          setSelectedItems={setSelectedItemsPCUserProductBrand}
                          deletedItems={deletedItemsPCUserProductBrand}
                          setDeletedItems={setDeletedItemsPCUserProductBrand}
                          isAllItemsChecked={isAllSelectedPCUserBrand}
                          setIsAllItemsChecked={setIsAllSelectedPCUserBrand}
                          primaryKeyToDelete="biznessEventPCUserBrandId"
                          parentPrimaryKey="biznessEventPCUserId"
                          idKey="brandId"
                          optionName="brandName"
                          limitProperty="brandValueLmit"
                          caption="PC User Product Brand"
                        />
                      </div>
                      <div>
                        <DualListSelectorWithLimit
                          items={
                            mergedAllOptionsDuelSelectList(
                              productOptions,
                              'PCUserProduct'
                            ) || []
                          }
                          selectedItems={selectedItemsPCUserProduct || []}
                          setSelectedItems={setSelectedItemsPCUserProduct}
                          deletedItems={deletedItemsPCUserProduct}
                          setDeletedItems={setDeletedItemsPCUserProduct}
                          isAllItemsChecked={isAllSelectedPCUserProduct}
                          setIsAllItemsChecked={setIsAllSelectedPCUserProduct}
                          primaryKeyToDelete="biznessEventPCUserProductId"
                          parentPrimaryKey="biznessEventPCUserId"
                          idKey="productId"
                          optionName="productName"
                          limitProperty="productValueLimit"
                          caption="PC User Product"
                        />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    // className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    className={`inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      processSaveChainConfigIsLoading || isSaveClicked
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => {
                      // saveFunction();
                      if (!processSaveChainConfigIsLoading && !isSaveClicked) {
                        setTimeout(() => {
                          setIsSaveClicked(true);
                        }, 1);
                      }

                      // setSelectedBepcRow({});
                    }}
                  >
                    {processSaveChainConfigIsLoading || isSaveClicked ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {processSaveChainConfigIsLoading || isSaveClicked
                      ? ' Please Wait...'
                      : 'Save Ultimate'}
                  </button>

                  {/* <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      // setTimeout(() => {
                      //   setIsSaveClicked(true);
                      // }, 100);
                    }}
                  >
                    rupom
                  </button> */}
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>
      {/* // modals --- out of html normal body/position */}

      {/* --------------------------[ modals]--------------------------------------- */}
      <Modal
        open={specModal} // create leaf modal
        onClose={handleSpecModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '60vw', md: '60vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',

            // overflow: 'hidden',
            borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <form>
            <div className="mx-2">
              <div className="w-full font-bold mt-5 ">
                Enter Fields for Sequence task row{' '}
                {bepcGridState[modalOpendedIndexBepcGrid ?? 0]?.sequence}
              </div>
            </div>
            <div className="m-3">
              <div className="my-2">
                <Controller
                  name="controllerPath"
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
                      label="Controller Path"
                      variant="standard"
                      size="small"
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value
                        onBlur();
                        // Call the original onBlur to trigger validation
                      }}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              {/* <div className="my-2">
                <Controller
                  name="table"
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
                      label="Table"
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
              </div> */}

              <Controller
                name="relationalKey"
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
                    label="Relational Key"
                    variant="standard"
                    size="small"
                    // onBlur={onBlur} // Trigger validation on blur
                    onBlur={(event) => {
                      // Update the state with the current value
                      onBlur();
                      // Call the original onBlur to trigger validation
                      // onBlur();
                    }}
                    onChange={onChange}
                  />
                )}
              />
              <div className="my-2">
                <Controller
                  name="maxTimeInHours"
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
                      label="Max Time In Hour"
                      variant="standard"
                      size="small"
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value
                        onBlur();
                        // Call the original onBlur to trigger validation
                      }}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="my-2">
                <Controller
                  name="maxTimeInDays"
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
                      label="Max Time In Days"
                      variant="standard"
                      size="small"
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value
                        onBlur();
                        // Call the original onBlur to trigger validation
                      }}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="my-2">
                <Controller
                  name="mailTemplate"
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
                      label="Mail Template"
                      variant="standard"
                      size="small"
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value
                        onBlur();
                        // Call the original onBlur to trigger validation
                      }}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="smsTemplate"
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
                      label="SMS Template"
                      variant="standard"
                      size="small"
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value
                        onBlur();
                        // Call the original onBlur to trigger validation
                      }}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    saveSpecBtn();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
          <IconButton
            aria-label="close"
            onClick={handleSpecModalClose}
            sx={{
              position: 'absolute',
              // top: { xs: '25%', sm: '25%', md: '4%' },
              // right: { xs: '4%', sm: '10%', md: '2%' },
              top: '4%',
              right: '4%',
              color: 'red',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>

      {/* Modal for fixedTaskTemplate create---- */}
      <Modal
        open={fixedTaskTemplateCreateModal} // create leaf modal
        onClose={handleFixedTaskTemplateCreateModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '60vw', md: '60vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',

            // overflow: 'hidden',
            borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <form>
            <div className="mx-2">
              <div className="w-full font-bold mt-5 ">Create a new chain</div>
            </div>
            <div className="m-3">
              <div className="my-2">
                <Controller
                  name="chainName"
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
                      label="Chain Name"
                      variant="standard"
                      size="small"
                      // onBlur={onBlur} // Trigger validation on blur
                      onBlur={(event) => {
                        // Update the state with the current value
                        onBlur();
                        // Call the original onBlur to trigger validation
                      }}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    addFixedTaskTemplateBtn();
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </form>
          <IconButton
            aria-label="close"
            onClick={handleFixedTaskTemplateCreateModalClose}
            sx={{
              position: 'absolute',
              // top: { xs: '25%', sm: '25%', md: '4%' },
              // right: { xs: '4%', sm: '10%', md: '2%' },
              top: '4%',
              right: '4%',
              color: 'red',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default ChainConfiguration;
