/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */

import {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_Virtualizer,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import dayjs, { Dayjs } from 'dayjs';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ExportToCsv } from 'export-to-csv';
import { IAccountsNameComboBox } from '../../../../domain/interfaces/AccountsNameComboBoxInterface';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../application/Redux/store/store';
import { setNavbarShow } from '../../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../../application/Redux/slices/ShowPanelSlice';
import {
  ICreateTeamTargetSPProductGroup,
  IDeleteTeamTargetSPProductGroup,
  IEmployee,
  IProcessTeamTargetSPProductGroup,
  ITeamTargetSPProductGroup,
  IUpdateTeamTargetSPProductGroup,
} from '../../../../domain/interfaces/TeamAndTarget';
import { IProductGroupComboBox } from '../../../../domain/interfaces/ProductInterfaces';
import {
  useGetDistrictSPProductGroupByTeamMonthYearIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useProcessSaveSPProductGroupMutation,
} from '../../../../infrastructure/api/TargetSPProductGroupApiSlice';
import { useGetProductGroupByCompanyIdQuery } from '../../../../infrastructure/api/ProductApiSlice';
import { useGetTeamMemberByTeamIdQuery } from '../../../../infrastructure/api/TeamAndTeamDetailApiSlice';
import DualListSelectorTarget from './DualListSelectorTarget/DualListSelectorTarget';
import QuickEntryEmployeeByProductGroup from './QuickEntryEmployeeByProductGroup/QuickEntryEmployeeByProductGroup';
import QuickEntryProductGroupByEmployee from './QuickEntryProductGroupByEmployee/QuickEntryProductGroupByEmployee';
import { IArea } from '../../../../domain/interfaces/RegionMasterAndTarget';
import MonthYearRangePicker from '../../../components/biz24Components/MonthYearRangePicker/MonthYearRangePicker';
import { changeFromMonthYear } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/FromMonthYearSlice';
import { changeToMonthYear } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/ToMonthYearSlice';
import { useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery } from '../../../../infrastructure/api/EmployeeApiSlice';
import { useGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery } from '../../../../infrastructure/api/AreaApiSlice';
import { changeQuickEntryAnySectionModalInfo } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/QuickEntryAnySectionModalInfoSlice';

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
    fontSize: '0.75rem',
  },
};
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

interface DistrictTargetGridSelectorProps {
  districtId: number;
}

const DistrictTargetGrid: React.FC<DistrictTargetGridSelectorProps> = ({
  districtId,
}) => {
  const navigate = useNavigate();

  //   const dispatch = useAppDispatch();
  //   dispatch(setNavbarShow(true));
  //   dispatch(setPanelShow(true));

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

  const [districtTargetGridState, setDistrictTargetGridState] = useState<
    ITeamTargetSPProductGroup[]
  >([]);

  const [districtTargetGridStatePrev, setDistrictTargetGridStatePrev] =
    useState<ITeamTargetSPProductGroup[]>([]);

  const [districtTargetGridStateDeleted, setDistrictTargetGridStateDeleted] =
    useState<IDeleteTeamTargetSPProductGroup[]>([]);

  // const [month, setMonth] = useState(dayjs().month() + 1);

  // const [year, setYear] = useState(dayjs().year());

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

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  // ------employee modal initializations--------
  const [quickEntryEmployeeModal, setQuickEntryEmployeeModal] =
    useState<boolean>(false);
  const handleQuickEntryEmployeeModalClose = () => {
    // reset();
    setQuickEntryEmployeeModal(false);
  };
  const [currentEmployeeModalRow, setCurrentEmployeeModalRow] =
    useState<any>(null);

  // ------product group modal initializations--------
  const [quickEntryProductGroupModal, setQuickEntryProductGroupModal] =
    useState<boolean>(false);
  const handleQuickEntryProductGroupModalClose = () => {
    // reset();
    setQuickEntryProductGroupModal(false);
  };
  const [currentProductGroupModalRow, setCurrentProductGroupModalRow] =
    useState<any>(null);

  //   grid virtualization states
  const [isDistrictTargetGridLoading, setIsDistrictTargetGridLoading] =
    useState(true);
  const [sortingDistrictTargetGrid, setSortingDistrictTargetGrid] =
    useState<MRT_SortingState>([]);

  // -------------------------------------API CALLS AND ASSOCIATED USE-EFFECTS------------------------------------

  const {
    data: districtTargetGridInfo,
    isLoading: districtTargetGridInfoLoading,
    error: districtTargetGridInfoError,
    isSuccess: districtTargetGridInfoIsSuccess,
    isError: districtTargetGridInfoIsError,
    isFetching: districtTargetGridInfoIsFetching,
    refetch: districtTargetGridInfoRefetch,
  } = useGetDistrictSPProductGroupByTeamMonthYearIdQuery({
    districtId,
    fromMonth: dayjs(fromMonthYearValue).month() + 1,
    toMonth: dayjs(toMonthYearValue).month() + 1,
    fromYear: dayjs(fromMonthYearValue).year(),
    toYear: dayjs(toMonthYearValue).year(),
    salesPersonId: 0,
    productGroupId: 0,
  });

  useEffect(() => {
    if (districtTargetGridInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching districtTargetGridInfo, see console!'
      );
      console.log(
        'Something wrong from backend while fetching districtTargetGridInfo, see console--->:'
      );
      console.log(districtTargetGridInfoError);
      setDistrictTargetGridStatePrev([]);
      setDistrictTargetGridState([]);
      setIsDistrictTargetGridLoading(false);
    }
    // if (districtTargetGridInfoIsSuccess) {
    //   console.log('districtTargetGridInfoIsSuccess');
    //   console.log(districtTargetGridInfo);
    //   const tempArrayVar: ITeamTargetSPProductGroup[] = districtTargetGridInfo
    //     ? JSON.parse(JSON.stringify(districtTargetGridInfo))
    //     : [];
    //   setDistrictTargetGridStatePrev([...tempArrayVar]);
    //   addEmptyRowsAndGridInfo();
    // }
    else if (
      districtTargetGridInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !districtTargetGridInfoLoading &&
      !districtTargetGridInfoIsFetching &&
      !districtTargetGridInfoIsError
    ) {
      console.log('districtTargetGridInfoIsSuccess');
      console.log(districtTargetGridInfo);
      const tempArrayVar: ITeamTargetSPProductGroup[] = districtTargetGridInfo
        ? JSON.parse(JSON.stringify(districtTargetGridInfo))
        : [];
      setDistrictTargetGridStatePrev([...tempArrayVar]);
      addEmptyRowsAndGridInfo();
      setIsDistrictTargetGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsDistrictTargetGridLoading(true);
    }
  }, [
    districtTargetGridInfoLoading,
    districtTargetGridInfoIsFetching,
    districtTargetGridInfoError,
    districtTargetGridInfoIsError,
    districtTargetGridInfo,
    districtTargetGridInfoIsSuccess,
  ]);

  const {
    data: inchargeMembers,
    isLoading: inchargeMembersLoading,
    error: inchargeMembersError,
    isSuccess: inchargeMembersIsSuccess,
    isError: inchargeMembersIsError,
    isFetching: inchargeMembersIsFetching,
    refetch: inchargeMembersRefetch,
  } = useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery({
    companyId: userInfo?.companyId,
    regionMasterId: 0,
    regionId: 0,
    divisionId: 0,
    districtId,
  });

  useEffect(() => {
    if (inchargeMembersIsError) {
      toast.error(
        'Something wrong from backend while fetching inchargeMembers, see console!'
      );
      console.log(
        'Something wrong from backend while fetching inchargeMembers, see console--->:'
      );
      console.log(inchargeMembersIsError);
    }
    if (inchargeMembersIsSuccess) {
      console.log('inchargeMembersIsSuccess');
      console.log(inchargeMembers);
    }
  }, [
    inchargeMembers,
    inchargeMembersLoading,
    inchargeMembersError,
    inchargeMembersIsError,
    inchargeMembersIsSuccess,
    inchargeMembersIsFetching,
  ]);

  const {
    data: areaOptions,
    isLoading: areaOptionsLoading,
    error: areaOptionsError,
    isSuccess: areaOptionsIsSuccess,
    isError: areaOptionsIsError,
    isFetching: areaOptionsIsFetching,
    refetch: areaOptionsRefetch,
  } = useGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery({
    companyId: userInfo?.companyId,
    regionMasterId: 0,
    regionId: 0,
    divisionId: 0,
    districtId,
  });

  useEffect(() => {
    if (areaOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching areaOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching areaOptions, see console--->:'
      );
      console.log(areaOptionsIsError);
    }
    if (areaOptionsIsSuccess) {
      console.log('areaOptionsIsSuccess');
      console.log(areaOptions);
    }
  }, [
    areaOptions,
    areaOptionsLoading,
    areaOptionsError,
    areaOptionsIsSuccess,
    areaOptionsIsError,
    areaOptionsIsFetching,
  ]);

  /// ----------------------------------------------------------------------?

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
        'Something wrong from backend while fetching productGroupOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productGroupOptions, see console--->:'
      );
      console.log(productGroupOptionsError);
    }
    if (productGroupOptionsIsSuccess) {
      console.log('productGroupOptionsIsSuccess');
      console.log(productGroupOptions);
    }
  }, [
    productGroupOptionsLoading,
    productGroupOptionsError,
    productGroupOptionsIsSuccess,
    productGroupOptionsIsError,
    productGroupOptionsIsFetching,
    productGroupOptions,
  ]);

  const addEmptyRowsAndGridInfo = () => {
    const lengthOfData = districtTargetGridInfo?.length || 0;
    let iterationOfForLoop = 0;
    if (lengthOfData < 10) {
      iterationOfForLoop = 10 - lengthOfData;
    } else {
      iterationOfForLoop = 1;
    }

    const emptyRows = [];
    for (let i = 0; i < iterationOfForLoop; i++) {
      const tempEmptyRow = {
        targetSPProductGroupId: null,
        areaId: null,
        areaName: null,
        employeeId: null,
        employeeName: null,
        productGroupId: null,
        productGroupName: null,
        month: null,
        year: null,
        target: null,
        sold: null,
        achievement: null,
        so: null,
        finalAchievement: null,
        quantity: null,
      };
      emptyRows.push(tempEmptyRow);
    }
    if (districtTargetGridInfo) {
      const tempArrayVar: ITeamTargetSPProductGroup[] = districtTargetGridInfo
        ? JSON.parse(JSON.stringify(districtTargetGridInfo))
        : [];
      setDistrictTargetGridState([...tempArrayVar, ...emptyRows]);
    } else {
      setDistrictTargetGridState([...emptyRows]);
    }
  };

  const getEmptyRow = () => {
    const tempEmptyRow: ITeamTargetSPProductGroup = {
      targetSPProductGroupId: null,
      areaId: null,
      areaName: null,
      employeeId: null,
      employeeName: null,
      productGroupId: null,
      productGroupName: null,
      month: null,
      year: null,
      target: null,
      sold: null,
      achievement: null,
      so: null,
      finalAchievement: null,
      quantity: null,
    };

    return tempEmptyRow;
  };

  const handleProductGroupChange = (
    selectedOption: IProductGroupComboBox,
    index: number
  ) => {
    const copyTeamTargetGridState = JSON.parse(
      JSON.stringify(districtTargetGridState)
    );
    console.log('copyTeamTargetGridState');
    console.log(copyTeamTargetGridState);
    console.log('districtTargetGridState');
    console.log(districtTargetGridState);

    if (selectedOption) {
      const selectedOpt = selectedOption as IProductGroupComboBox;
      districtTargetGridState[index].productGroupId =
        selectedOpt.productGroupId ?? 0;
      districtTargetGridState[index].productGroupName =
        selectedOpt.productGroupName ?? '';
      districtTargetGridState[index].productPrice =
        selectedOpt.productPrice || 0;
    } else {
      districtTargetGridState[index].productGroupId = null;
      districtTargetGridState[index].productGroupName = null;
      districtTargetGridState[index].productPrice = 0;
    }

    if (index === districtTargetGridState.length - 1) {
      setDistrictTargetGridState([...districtTargetGridState, getEmptyRow()]);
    } else {
      setDistrictTargetGridState([...districtTargetGridState]);
    }
  };

  // .........................process Save api call.....................

  const [
    processSaveSPProductGroup,
    {
      isLoading: processSaveSPProductGroupIsLoading,
      isError: processSaveSPProductGroupIsError,
      error: processSaveSPProductGroupError,
      isSuccess: processSaveSPProductGroupIsSuccess,
      data: processSaveSPProductGroupData,
    },
  ] = useProcessSaveSPProductGroupMutation();

  useEffect(() => {
    if (processSaveSPProductGroupIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Targets have been saved successfully!`,
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
            'check data after successful Save teamSPProductGroup, see console---->'
          );
          console.log(processSaveSPProductGroupData);
          // dispatch(
          //   changeQuickEntryAnySectionModalInfo({
          //     regionMasterId: 0,
          //     regionMasterName: 'aboltabol',
          //     regionId: 0,
          //     regionName: '',
          //     divisionId: 0,
          //     divisionName: '',
          //     districtId: 0,
          //     districtName: '',
          //     quickEntryAnySectionModal: true,
          //   })
          // );
          // dispatch(
          //   changeQuickEntryAnySectionModalInfo({
          //     regionMasterId: 0,
          //     regionMasterName: 'aboltabol',
          //     regionId: 0,
          //     regionName: '',
          //     divisionId: 0,
          //     divisionName: '',
          //     districtId: 0,
          //     districtName: '',
          //     quickEntryAnySectionModal: false,
          //   })
          // );
        }
      });
    } else if (processSaveSPProductGroupIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving teamSPProductGroup, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving teamSPProductGroup data, see console---->'
      );
      console.log(processSaveSPProductGroupError);
    }
  }, [
    processSaveSPProductGroupIsLoading,
    processSaveSPProductGroupIsError,
    processSaveSPProductGroupData,
    processSaveSPProductGroupError,
    processSaveSPProductGroupIsSuccess,
  ]);

  // ------------------------------------ ENDING API CALLS AND USE-EFFECTS---------------------------------------

  /// /-----------------auto comp list style-----------------

  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );

  const teamTargetGridColumns = useMemo<
    MRT_ColumnDef<ITeamTargetSPProductGroup>[]
  >(
    () => [
      {
        accessorFn: (row) => row.areaName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.areaName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'areaName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Area',
        Cell: ({ renderedCellValue, row }) => {
          const currentArea: IArea = {
            areaId: row.original.areaId ?? 0,
            areaName: row.original.areaName ?? '',
          };

          return (
            <div className="w-full flex justify-between items-center">
              <Autocomplete
                id=""
                sx={{ width: '100%' }}
                PopperComponent={PopperMy}
                clearOnEscape
                disableClearable
                freeSolo
                size="small"
                options={areaOptions || []} // area options boshbe
                value={currentArea}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    const selectedOpt = selectedOption as IArea;
                    districtTargetGridState[row.index].areaId =
                      selectedOpt.areaId ?? 0;
                    districtTargetGridState[row.index].areaName =
                      selectedOpt.areaName ?? '';
                    districtTargetGridState[row.index].employeeId =
                      selectedOpt.inchargeId || 0;
                    districtTargetGridState[row.index].employeeName =
                      selectedOpt.inchargeName || '';
                  } else {
                    districtTargetGridState[row.index].areaId = null;
                    districtTargetGridState[row.index].areaName = null;
                    districtTargetGridState[row.index].employeeId = null;
                    districtTargetGridState[row.index].employeeName = null;
                  }
                  if (row.index === districtTargetGridState.length - 1) {
                    setDistrictTargetGridState([
                      ...districtTargetGridState,
                      getEmptyRow(),
                    ]);
                  } else {
                    setDistrictTargetGridState([...districtTargetGridState]);
                  }
                }}
                getOptionLabel={(option: any) =>
                  option.areaName ? option.areaName : ''
                }
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
                      style: { fontSize: '0.8125rem' },
                      disableUnderline: true,
                    }}
                    variant="standard"
                    size="small"
                    onKeyDown={(event) => {
                      // Prevent the Space key from toggling the tree node
                      event.stopPropagation();
                    }}
                  />
                )}
              />
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.employeeName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.employeeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'employeeName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Incharge',
        Cell: ({ renderedCellValue, row }) => {
          const currentEmployee: IEmployee = {
            employeeId: row.original.employeeId ?? 0,
            employeeName: row.original.employeeName ?? '',
          };

          return (
            <div className="w-full flex justify-between items-center">
              <Autocomplete
                id=""
                sx={{ width: '100%' }}
                PopperComponent={PopperMy}
                clearOnEscape
                disableClearable
                freeSolo
                size="small"
                options={inchargeMembers || []}
                value={currentEmployee}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    const selectedOpt = selectedOption as IEmployee;
                    districtTargetGridState[row.index].employeeId =
                      selectedOpt.employeeId ?? 0;
                    districtTargetGridState[row.index].employeeName =
                      selectedOpt.employeeName ?? '';
                    // districtTargetGridState[row.index].month = month;
                    // districtTargetGridState[row.index].year = year;
                  } else {
                    districtTargetGridState[row.index].employeeId = null;
                    districtTargetGridState[row.index].employeeName = null;
                    // districtTargetGridState[row.index].month = null;
                    // districtTargetGridState[row.index].year = null;
                  }
                  if (row.index === districtTargetGridState.length - 1) {
                    setDistrictTargetGridState([
                      ...districtTargetGridState,
                      getEmptyRow(),
                    ]);
                  } else {
                    setDistrictTargetGridState([...districtTargetGridState]);
                  }
                }}
                getOptionLabel={(option: any) =>
                  option.employeeName ? option.employeeName : ''
                }
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
                      style: { fontSize: '0.8125rem' },
                      disableUnderline: true,
                    }}
                    variant="standard"
                    size="small"
                    onKeyDown={(event) => {
                      // Prevent the Space key from toggling the tree node
                      event.stopPropagation();
                    }}
                  />
                )}
              />
              <Tooltip
                className={row.original.employeeId ? 'visible' : 'invisible'}
                arrow
                placement="right"
                title="Quick Entry"
              >
                <IconButton
                  color="info"
                  onClick={() => {
                    setQuickEntryEmployeeModal(true);
                    const tempRowEmployee = {
                      employeeId: row.original.employeeId,
                      employeeName: row.original.employeeName,
                      areaId: row.original.areaId,
                      areaName: row.original.areaName,
                      month: row.original.month,
                      year: row.original.year,
                    };
                    setCurrentEmployeeModalRow(tempRowEmployee);
                  }}
                >
                  <i className="fas text-[1.125rem] fa-bolt" />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },

      {
        accessorFn: (row) => row.month ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.month, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'month',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Month',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                districtTargetGridState[row.index].month = parseInt(
                  e.target.value,
                  10
                );
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.year ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.year, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'year',
        header: 'Year',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                districtTargetGridState[row.index].year = parseInt(
                  e.target.value,
                  10
                );
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.productGroupName ?? '', // access nested data with dot notation
        // enableGlobalFilter: columnVisibility?.productGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'productGroupName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Product Group',
        Cell: ({ renderedCellValue, row }) => {
          const currentProductGroup: IProductGroupComboBox = {
            productGroupId: row.original.productGroupId || 0,
            productGroupName: row.original.productGroupName || '',
          };

          return (
            <div className="w-full flex justify-between items-center">
              <Autocomplete
                id=""
                sx={{ width: '100%' }}
                PopperComponent={PopperMy}
                clearOnEscape
                disableClearable
                freeSolo
                size="small"
                options={productGroupOptions || []}
                value={currentProductGroup}
                onChange={(e, selectedOption) => {
                  handleProductGroupChange(
                    selectedOption as IProductGroupComboBox,
                    row.index
                  );
                }}
                getOptionLabel={(option: any) =>
                  option.productGroupName ? option.productGroupName : ''
                }
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
                      style: { fontSize: '0.8125rem' },
                      disableUnderline: true,
                    }}
                    variant="standard"
                    size="small"
                    onKeyDown={(event) => {
                      // Prevent the Space key from toggling the tree node
                      event.stopPropagation();
                    }}
                  />
                )}
              />
              <Tooltip
                className={
                  row.original.productGroupId ? 'visible' : 'invisible'
                }
                arrow
                placement="right"
                title="Quick Entry"
              >
                <IconButton
                  color="info"
                  onClick={() => {
                    setQuickEntryProductGroupModal(true);
                    const tempRowProductGroup = {
                      productGroupId: row.original.productGroupId,
                      productGroupName: row.original.productGroupName,
                      month: row.original.month,
                      year: row.original.year,
                    };
                    setCurrentProductGroupModalRow(tempRowProductGroup);
                  }}
                >
                  <i className="fas text-[1.125rem] fa-bolt" />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
      {
        accessorFn: (row) =>
          row.quantity ? (Math.ceil(row.quantity * 100) / 100).toFixed(2) : '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.quantity, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'quantity',
        header: 'Quantity',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                districtTargetGridState[row.index].quantity = parseFloat(
                  e.target.value
                );
                districtTargetGridState[row.index].target =
                  parseFloat(e.target.value) *
                  (districtTargetGridState[row.index].productPrice || 0);

                if (row.index === districtTargetGridState.length - 1) {
                  setDistrictTargetGridState([
                    ...districtTargetGridState,
                    getEmptyRow(),
                  ]);
                } else {
                  setDistrictTargetGridState([...districtTargetGridState]);
                }
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) =>
          row.target ? (Math.ceil(row.target * 100) / 100).toFixed(2) : '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.target, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'target',
        header: 'Target',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: true,
              }}
              onBlur={(e) => {
                districtTargetGridState[row.index].target = parseFloat(
                  e.target.value
                );

                if (row.index === districtTargetGridState.length - 1) {
                  setDistrictTargetGridState([
                    ...districtTargetGridState,
                    getEmptyRow(),
                  ]);
                } else {
                  setDistrictTargetGridState([...districtTargetGridState]);
                }
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.sold ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.sold, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'sold',
        header: 'Sold',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              //   onBlur={(e) => {}}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.achievement ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.achievement, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'achievement',
        header: 'Achievement(%)',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              //   onBlur={(e) => {}}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.so ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.so, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'so',
        header: 'Pending Invoice',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              //   onBlur={(e) => {}}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.finalAchievement ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.finalAchievement, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'finalAchievement',
        header: 'Final Achievement(%)',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: true,
              }}
              //   onBlur={(e) => {}}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onKeyDown={(event) => {
                // Prevent the Space key from toggling the tree node
                event.stopPropagation();
              }}
            />
          );
        },
      },

      {
        id: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
        grow: false,
        enableSorting: false,
        enableColumnActions: false,
        // enableResizing: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                row.original.employeeId || row.original.productGroupId
                  ? 'visible'
                  : 'invisible'
              }
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (
                    districtTargetGridState[row.index]?.targetSPProductGroupId
                  ) {
                    const deletedteamGroupRow: IDeleteTeamTargetSPProductGroup =
                      {
                        targetSPProductGroupId:
                          districtTargetGridState[row.index]
                            .targetSPProductGroupId ?? 0,
                      };
                    setDistrictTargetGridStateDeleted([
                      ...districtTargetGridStateDeleted,
                      deletedteamGroupRow,
                    ]);
                  }
                  districtTargetGridState?.splice(row.index, 1);
                  setDistrictTargetGridState([...districtTargetGridState]);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [
      PopperMy,
      columnVisibility?.achievement,
      columnVisibility?.employeeName,
      columnVisibility?.finalAchievement,
      columnVisibility?.month,
      columnVisibility?.so,
      columnVisibility?.sold,
      columnVisibility?.target,
      columnVisibility?.year,
      getEmptyRow,
      fromMonthYearValue,
      toMonthYearValue,
      districtTargetGridState,
      districtTargetGridStateDeleted,
      handleProductGroupChange,
    ]
  );
  /// /-----------------auto comp list style--------END---------

  // ---------- material table virtualization---------

  // optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && tableDataLoading === false) {
  //     // setData(makeData(10_000));
  //     setIsLoading(false);
  //   }
  // }, [tableDataLoading]);   //--------ei code ta getGridData anar j api, oitay ei if er condition ta add koira dite hobe
  useEffect(() => {
    // scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortingDistrictTargetGrid]);

  // ---------- material table virtualization---------

  // --------------------------------------------excel csv-----------------------------------

  const handleExportData = (
    gridData: any,
    gridColumns: any
    // filteredRows: any
  ) => {
    console.log('handleExportData-----------------');

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

    // ----- sir bolse total of Target and Quantity ber korte

    let totalQuantity = 0;
    let totalTarget = 0;

    for (let i = 0; i < gridDataTbXCELSorted.length; i++) {
      totalQuantity += gridDataTbXCELSorted[i].quantity || 0;
      totalTarget += gridDataTbXCELSorted[i].target || 0;
    }

    const lastSummationRow: any = {
      areaName: '',
      employeeName: '',
      month: '',
      year: '',
      productGroupName: 'TOTAL: ',
      // quantity: 0,
      // target: 200,
      sold: '',
      achievement: '',
      so: '',
      finalAchievement: '',
    };

    if (!falsePropertiesArr.includes('target')) {
      lastSummationRow.target = totalTarget;
    }
    if (!falsePropertiesArr.includes('quantity')) {
      lastSummationRow.quantity = totalQuantity;
    }

    if (
      !falsePropertiesArr.includes('target') ||
      !falsePropertiesArr.includes('quantity')
    ) {
      gridDataTbXCELSorted.push(lastSummationRow);
    }
    // ----END---- sir bolse total of Target and Quantity ber korte

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

  // ------------------------------------excel csv-----------------END------------------

  const districtTargetGridStateInitializer: MRT_TableInstance<ITeamTargetSPProductGroup> =
    useMaterialReactTable({
      columns: teamTargetGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: districtTargetGridState || [],
      state: {
        columnVisibility,
        isLoading:
          isDistrictTargetGridLoading ||
          districtTargetGridInfoIsFetching ||
          districtTargetGridInfoLoading,
        sorting: sortingDistrictTargetGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '2.5rem',
      },
      enableRowVirtualization: true,
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enableFilterMatchHighlighting: false, // disable filter match highlighting
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
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
          fontSize: '0.8125rem',
          color: '#ea1143',
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
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '25rem' } },
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
              className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                // const districtTargetGridStateWithoutEmpty =
                //   districtTargetGridState.filter(
                //     (row) => row.employeeId && row.productGroupId
                //   );

                const districtTargetGridStateWithoutEmpty =
                  districtTargetGridStateInitializer
                    .getFilteredRowModel()
                    .rows.map((row) => row.original)
                    .filter((row) => row.employeeId && row.productGroupId);

                handleExportData(
                  districtTargetGridStateWithoutEmpty,
                  teamTargetGridColumns
                );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      renderTopToolbarCustomActions: ({ table }) => (
        <div className=" w-[30%] mt-1 flex gap-3 justify-center items-center">
          <span className=" mt-1 font-bold text-[0.8125rem] w-[20%]">
            {/* TITLE OF THE GRID */}
            Filter By:
          </span>

          {/* <div className="">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Month"
                views={['month']}
                inputFormat="MMMM"
                value={dayjs().month(month - 1)}
                onChange={(newValue) => {
                  // handleDroppingDateTimeChange(newValue, onChange);
                  if (newValue) {
                    setMonth(newValue.month() + 1);
                    //   console.log('MOOOONTHHHHHH!!!!!!!!');
                    //   console.log(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ width: '100%', marginTop: 1 }}
                    InputProps={{
                      ...params.InputProps,
                      style: { fontSize: '0.8125rem' },
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      style: { fontSize: '0.875rem' },
                    }}
                    variant="standard"
                    size="small"
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Year"
                views={['year']}
                inputFormat="YYYY"
                value={dayjs(`${year}-01-01`)}
                onChange={(newValue) => {
                  if (newValue) {
                    console.log('YEAAAAARRRRR!!!!!!!!');
                    console.log(newValue);
                    setYear(newValue.year());
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ width: '100%', marginTop: 1 }}
                    InputProps={{
                      ...params.InputProps,
                      style: { fontSize: '0.8125rem' },
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      style: { fontSize: '0.875rem' },
                    }}
                    variant="standard"
                    size="small"
                  />
                )}
              />
            </LocalizationProvider>
          </div> */}

          <MonthYearRangePicker
            startDate={fromMonthYearValue}
            endDate={toMonthYearValue}
            setStartDate={handleChangeFromMonthYear}
            setEndDate={handleChangeToMonthYear}
          />
        </div>
      ),
      onSortingChange: setSortingDistrictTargetGrid,
      rowVirtualizerInstanceRef, // optional
      rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
    });

  const saveTeamTargetGridFunct = () => {
    console.log('in save function from Team Target');
    console.log(districtTargetGridState);

    console.log('checkList productGroup modal, multiple product groups target');
    console.log(districtTargetGridState);
    console.log('DELETED districtTargetGridState.....');
    console.log(districtTargetGridStateDeleted);

    const districtTargetGridStateWithoutEmpty = districtTargetGridState.filter(
      (item) => item.productGroupId && item.employeeId
    );

    const spProductGroupRowsCurrent: ITeamTargetSPProductGroup[] =
      districtTargetGridStateWithoutEmpty
        ? JSON.parse(JSON.stringify(districtTargetGridStateWithoutEmpty))
        : [];
    const spProductGroupRowsPrev: ITeamTargetSPProductGroup[] =
      districtTargetGridStatePrev
        ? JSON.parse(JSON.stringify(districtTargetGridStatePrev))
        : [];

    if (
      JSON.stringify(spProductGroupRowsCurrent) ===
      JSON.stringify(spProductGroupRowsPrev)
    ) {
      toast.info('Nothing to save!');
      return false;
    }

    const createSPProductGroup: ICreateTeamTargetSPProductGroup[] = [];
    const updateSPProductGroup: IUpdateTeamTargetSPProductGroup[] = [];
    const deleteSPProductGroup: IDeleteTeamTargetSPProductGroup[] = [
      ...districtTargetGridStateDeleted,
    ];

    spProductGroupRowsCurrent.forEach((spProductGroupRow) => {
      if (!spProductGroupRow.targetSPProductGroupId) {
        const tempCreate: ICreateTeamTargetSPProductGroup = {
          targetSPProductGroupId: 0,
          areaId: spProductGroupRow.areaId || null,
          employeeId: spProductGroupRow.employeeId || 0,
          productGroupId: spProductGroupRow.productGroupId || 0,
          month: spProductGroupRow.month || 0,
          year: spProductGroupRow.year || 0,
          amount: spProductGroupRow.target || 0,
          dateOfEntry: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
          companyId: userInfo?.companyId,
          entryBy: userInfo?.securityUserId,
          quantity: spProductGroupRow.quantity || 0,
        };
        createSPProductGroup.push(tempCreate);
      } else {
        const tempUpdate: IUpdateTeamTargetSPProductGroup = {
          targetSPProductGroupId: spProductGroupRow.targetSPProductGroupId,
          areaId: spProductGroupRow.areaId || null,
          employeeId: spProductGroupRow.employeeId || 0,
          productGroupId: spProductGroupRow.productGroupId || 0,
          month: spProductGroupRow.month || 0,
          year: spProductGroupRow.year || 0,
          amount: spProductGroupRow.target || 0,
          quantity: spProductGroupRow.quantity || 0,
          //   dateOfEntry: spProductGroupRow.date,
          //   companyId: userInfo?.companyId,
          //   entryBy: userInfo?.securityUserId,
        };
        updateSPProductGroup.push(tempUpdate);
      }
    });

    const dataToSend: IProcessTeamTargetSPProductGroup = {
      createTarget_SPProductGroupCommand: createSPProductGroup,
      updateTarget_SPProductGroupCommand: updateSPProductGroup,
      deleteTarget_SPProductGroupCommand: deleteSPProductGroup,
      operationName: 'Area',
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processSaveSPProductGroup(dataToSend);
  };

  return (
    // return wrapper div
    <div className="w-full mt-4 mb-5 modifiedEditTable">
      <MaterialReactTable table={districtTargetGridStateInitializer} />
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={`inline-block mt-2 px-3 py-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
          processSaveSPProductGroupIsLoading
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={() => {
          if (!processSaveSPProductGroupIsLoading) {
            saveTeamTargetGridFunct();
          }
        }}
      >
        {processSaveSPProductGroupIsLoading ? (
          <CircularProgress size={12} color="inherit" />
        ) : (
          ''
        )}
        {processSaveSPProductGroupIsLoading ? ' Please Wait...' : 'Save'}
      </button>

      {/* Modal for employeeQuickButton create---- */}
      <Modal
        open={quickEntryEmployeeModal} // create leaf modal
        onClose={handleQuickEntryEmployeeModalClose}
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
          <div className="mt-10">
            <QuickEntryProductGroupByEmployee
              districtId={districtId}
              fromMonth={dayjs(fromMonthYearValue).month() + 1}
              fromYear={dayjs(fromMonthYearValue).year()}
              toMonth={dayjs(toMonthYearValue).month() + 1}
              toYear={dayjs(toMonthYearValue).year()}
              employeeId={currentEmployeeModalRow?.employeeId || 0}
              employeeName={currentEmployeeModalRow?.employeeName || ''}
              areaId={currentEmployeeModalRow?.areaId || 0}
              areaName={currentEmployeeModalRow?.areaName || ''}
              modalState={quickEntryEmployeeModal}
              modalCloseFunct={handleQuickEntryEmployeeModalClose}
            />
          </div>

          <IconButton
            aria-label="close"
            onClick={handleQuickEntryEmployeeModalClose}
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

      {/* //----------------------------------- */}
      <Modal
        open={quickEntryProductGroupModal} // create leaf modal
        onClose={handleQuickEntryProductGroupModalClose}
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
          <div className="mt-10">
            <QuickEntryEmployeeByProductGroup
              districtId={districtId}
              fromMonth={dayjs(fromMonthYearValue).month() + 1}
              fromYear={dayjs(fromMonthYearValue).year()}
              toMonth={dayjs(toMonthYearValue).month() + 1}
              toYear={dayjs(toMonthYearValue).year()}
              productGroupId={currentProductGroupModalRow?.productGroupId || 0}
              productGroupName={
                currentProductGroupModalRow?.productGroupName || ''
              }
              modalState={quickEntryProductGroupModal}
              modalCloseFunct={handleQuickEntryProductGroupModalClose}
            />
          </div>
          <IconButton
            aria-label="close"
            onClick={handleQuickEntryProductGroupModalClose}
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

export default DistrictTargetGrid;
