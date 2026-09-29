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
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import dayjs from 'dayjs';
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ExportToCsv } from 'export-to-csv';
import { IAccountsNameComboBox } from '../../../../domain/interfaces/AccountsNameComboBoxInterface';
import { useAppDispatch } from '../../../../application/Redux/store/store';
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

interface TeamTargetGridSelectorProps {
  teamId: number;
}

const TeamTargetGrid: React.FC<TeamTargetGridSelectorProps> = ({ teamId }) => {
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

  const [teamTargetGridState, setTeamTargetGridState] = useState<
    ITeamTargetSPProductGroup[]
  >([]);

  const [teamTargetGridStatePrev, setTeamTargetGridStatePrev] = useState<
    ITeamTargetSPProductGroup[]
  >([]);

  const [teamTargetGridStateDeleted, setTeamTargetGridStateDeleted] = useState<
    IDeleteTeamTargetSPProductGroup[]
  >([]);

  const [month, setMonth] = useState(dayjs().month() + 1);

  const [year, setYear] = useState(dayjs().year());

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

  // -------------------------------------API CALLS AND ASSOCIATED USE-EFFECTS------------------------------------

  const {
    data: teamTargetGridInfo,
    isLoading: teamTargetGridInfoLoading,
    error: teamTargetGridInfoError,
    isSuccess: teamTargetGridInfoIsSuccess,
    isError: teamTargetGridInfoIsError,
    isFetching: teamTargetGridInfoIsFetching,
    refetch: teamTargetGridInfoRefetch,
  } = useGetTargetSPProductGroupByTeamMonthYearIdQuery({
    teamId,
    fromMonth: month,
    fromYear: year,
    toMonth: month,
    toYear: year,
    salesPersonId: 0,
    productGroupId: 0,
  });

  useEffect(() => {
    if (teamTargetGridInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching teamTargetGridInfo, see console!'
      );
      console.log(
        'Something wrong from backend while fetching teamTargetGridInfo, see console--->:'
      );
      console.log(teamTargetGridInfoError);
    }
    if (teamTargetGridInfoIsSuccess) {
      console.log('teamTargetGridInfoIsSuccess');
      console.log(teamTargetGridInfo);
      const tempArrayVar: ITeamTargetSPProductGroup[] = teamTargetGridInfo
        ? JSON.parse(JSON.stringify(teamTargetGridInfo))
        : [];
      setTeamTargetGridStatePrev([...tempArrayVar]);
      addEmptyRowsAndGridInfo();
    }
  }, [
    teamTargetGridInfoLoading,
    teamTargetGridInfoIsFetching,
    teamTargetGridInfoError,
    teamTargetGridInfoIsError,
    teamTargetGridInfo,
    teamTargetGridInfoIsSuccess,
  ]);

  const {
    data: teamMembers,
    isLoading: teamMembersLoading,
    error: teamMembersError,
    isSuccess: teamMembersIsSuccess,
    isError: teamMembersIsError,
    isFetching: teamMembersIsFetching,
    refetch: teamMembersRefetch,
  } = useGetTeamMemberByTeamIdQuery({
    teamId,
  });

  useEffect(() => {
    if (teamMembersIsError) {
      toast.error(
        'Something wrong from backend while fetching teamMembers, see console!'
      );
      console.log(
        'Something wrong from backend while fetching teamMembers, see console--->:'
      );
      console.log(teamMembersIsError);
    }
    if (teamMembersIsSuccess) {
      console.log('teamMembersIsSuccess');
      console.log(teamMembers);
    }
  }, [
    teamMembers,
    teamMembersLoading,
    teamMembersError,
    teamMembersIsError,
    teamMembersIsSuccess,
    teamMembersIsFetching,
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
    const lengthOfData = teamTargetGridInfo?.length || 0;
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
        teamId: null,
        teamName: null,
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
      };
      emptyRows.push(tempEmptyRow);
    }
    if (teamTargetGridInfo) {
      const tempArrayVar: ITeamTargetSPProductGroup[] = teamTargetGridInfo
        ? JSON.parse(JSON.stringify(teamTargetGridInfo))
        : [];
      setTeamTargetGridState([...tempArrayVar, ...emptyRows]);
    } else {
      setTeamTargetGridState([...emptyRows]);
    }
  };

  const getEmptyRow = () => {
    const tempEmptyRow: ITeamTargetSPProductGroup = {
      targetSPProductGroupId: null,
      teamId: null,
      teamName: null,
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
    };

    return tempEmptyRow;
  };

  const handleProductGroupChange = (
    selectedOption: IProductGroupComboBox,
    index: number
  ) => {
    const copyTeamTargetGridState = JSON.parse(
      JSON.stringify(teamTargetGridState)
    );
    console.log('copyTeamTargetGridState');
    console.log(copyTeamTargetGridState);
    console.log('teamTargetGridState');
    console.log(teamTargetGridState);

    if (selectedOption) {
      const selectedOpt = selectedOption as IProductGroupComboBox;
      teamTargetGridState[index].productGroupId =
        selectedOpt.productGroupId ?? 0;
      teamTargetGridState[index].productGroupName =
        selectedOpt.productGroupName ?? '';
    } else {
      teamTargetGridState[index].productGroupId = null;
      teamTargetGridState[index].productGroupName = null;
    }

    if (index === teamTargetGridState.length - 1) {
      setTeamTargetGridState([...teamTargetGridState, getEmptyRow()]);
    } else {
      setTeamTargetGridState([...teamTargetGridState]);
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
          // biznessEventProcessConfigurationInfoRefetch();
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
        accessorFn: (row) => row.employeeName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.employeeName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'employeeName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Member',
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
                // options={teamMembers || []}
                options={
                  Array.from(
                    new Map(
                      teamMembers?.map((member) => [
                        member.employeeName,
                        member,
                      ])
                    ).values()
                  ) || []
                }
                value={currentEmployee}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    const selectedOpt = selectedOption as IEmployee;
                    teamTargetGridState[row.index].employeeId =
                      selectedOpt.employeeId ?? 0;
                    teamTargetGridState[row.index].employeeName =
                      selectedOpt.employeeName ?? '';
                    teamTargetGridState[row.index].month = month;
                    teamTargetGridState[row.index].year = year;
                  } else {
                    teamTargetGridState[row.index].employeeId = null;
                    teamTargetGridState[row.index].employeeName = null;
                    teamTargetGridState[row.index].month = null;
                    teamTargetGridState[row.index].year = null;
                  }
                  if (row.index === teamTargetGridState.length - 1) {
                    setTeamTargetGridState([
                      ...teamTargetGridState,
                      getEmptyRow(),
                    ]);
                  } else {
                    setTeamTargetGridState([...teamTargetGridState]);
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
        accessorFn: (row) => row.year ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.year, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'year',
        header: 'Year',
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
                // options={productGroupOptions || []}
                options={
                  Array.from(
                    new Map(
                      productGroupOptions?.map((productGroupOption) => [
                        productGroupOption.productGroupName,
                        productGroupOption,
                      ])
                    ).values()
                  ) || []
                }
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
        accessorFn: (row) => row.target ?? '', // access nested data with dot notation
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
                teamTargetGridState[row.index].target = parseFloat(
                  e.target.value
                );

                if (row.index === teamTargetGridState.length - 1) {
                  setTeamTargetGridState([
                    ...teamTargetGridState,
                    getEmptyRow(),
                  ]);
                } else {
                  setTeamTargetGridState([...teamTargetGridState]);
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
        header: 'Achievement',
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
        header: 'Final Achievement',
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
                  if (teamTargetGridState[row.index]?.targetSPProductGroupId) {
                    const deletedteamGroupRow: IDeleteTeamTargetSPProductGroup =
                      {
                        targetSPProductGroupId:
                          teamTargetGridState[row.index]
                            .targetSPProductGroupId ?? 0,
                      };
                    setTeamTargetGridStateDeleted([
                      ...teamTargetGridStateDeleted,
                      deletedteamGroupRow,
                    ]);
                  }
                  teamTargetGridState?.splice(row.index, 1);
                  setTeamTargetGridState([...teamTargetGridState]);
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
      month,
      teamTargetGridState,
      teamTargetGridStateDeleted,
      year,
      handleProductGroupChange,
    ]
  );
  /// /-----------------auto comp list style--------END---------

  // --------------------------------------------excel csv-----------------------------------

  const handleExportData = (gridData: any, gridColumns: any) => {
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

    // let totalQuantity = 0;
    let totalTarget = 0;

    for (let i = 0; i < gridDataTbXCELSorted.length; i++) {
      // totalQuantity += gridDataTbXCELSorted[i].quantity || 0;
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
    // if (!falsePropertiesArr.includes('quantity')) {
    //   lastSummationRow.quantity = totalQuantity;
    // }

    if (
      !falsePropertiesArr.includes('target')
      //  ||
      // !falsePropertiesArr.includes('quantity')
    ) {
      gridDataTbXCELSorted.push(lastSummationRow);
    }

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

  const teamTargetGridStateInitializer: MRT_TableInstance<ITeamTargetSPProductGroup> =
    useMaterialReactTable({
      columns: teamTargetGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: teamTargetGridState || [],
      state: {
        isLoading: teamTargetGridInfoIsFetching || teamTargetGridInfoLoading,
        columnVisibility,
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

      muiTableContainerProps: { sx: { maxHeight: '31.25rem' } },
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
                // const teamTargetGridStateWithoutEmpty =
                //   teamTargetGridState.filter(
                //     (row) => row.employeeId && row.productGroupId
                //   );

                const teamTargetGridStateWithoutEmpty =
                  teamTargetGridStateInitializer
                    .getFilteredRowModel()
                    .rows.map((row) => row.original)
                    .filter((row) => row.employeeId && row.productGroupId);

                handleExportData(
                  teamTargetGridStateWithoutEmpty,
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

          <div className="">
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
          </div>
        </div>
      ),
    });

  const saveTeamTargetGridFunct = () => {
    console.log('in save function from Team Target');
    console.log(teamTargetGridState);

    console.log('checkList productGroup modal, multiple product groups target');
    console.log(teamTargetGridState);
    console.log('DELETED teamTargetGridState.....');
    console.log(teamTargetGridStateDeleted);

    const teamTargetGridStateWithoutEmpty = teamTargetGridState.filter(
      (item) => item.productGroupId && item.employeeId
    );

    const spProductGroupRowsCurrent: ITeamTargetSPProductGroup[] =
      teamTargetGridStateWithoutEmpty
        ? JSON.parse(JSON.stringify(teamTargetGridStateWithoutEmpty))
        : [];
    const spProductGroupRowsPrev: ITeamTargetSPProductGroup[] =
      teamTargetGridStatePrev
        ? JSON.parse(JSON.stringify(teamTargetGridStatePrev))
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
      ...teamTargetGridStateDeleted,
    ];

    spProductGroupRowsCurrent.forEach((spProductGroupRow) => {
      if (!spProductGroupRow.targetSPProductGroupId) {
        const tempCreate: ICreateTeamTargetSPProductGroup = {
          targetSPProductGroupId: 0,
          teamId,
          employeeId: spProductGroupRow.employeeId || 0,
          productGroupId: spProductGroupRow.productGroupId || 0,
          month,
          year,
          amount: spProductGroupRow.target || 0,
          dateOfEntry: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
          companyId: userInfo?.companyId,
          entryBy: userInfo?.securityUserId,
        };
        createSPProductGroup.push(tempCreate);
      } else {
        const tempUpdate: IUpdateTeamTargetSPProductGroup = {
          targetSPProductGroupId: spProductGroupRow.targetSPProductGroupId,
          teamId: spProductGroupRow.teamId || teamId,
          employeeId: spProductGroupRow.employeeId || 0,
          productGroupId: spProductGroupRow.productGroupId || 0,
          month: spProductGroupRow.month || month,
          year: spProductGroupRow.year || year,
          amount: spProductGroupRow.target || 0,
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
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processSaveSPProductGroup(dataToSend);
  };

  return (
    // return wrapper div
    <div className="w-full mt-4 mb-5 modifiedEditTable">
      <MaterialReactTable table={teamTargetGridStateInitializer} />
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
              teamId={teamId}
              month={month}
              year={year}
              employeeId={currentEmployeeModalRow?.employeeId || 0}
              employeeName={currentEmployeeModalRow?.employeeName || ''}
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
              teamId={teamId}
              month={month}
              year={year}
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

export default TeamTargetGrid;
