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
  createFilterOptions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

import {
  ICreateTeam,
  ICreateTeamDetail,
  ICreateTeamTargetSPProductGroup,
  IDeleteTeamDetail,
  IDeleteTeamTargetSPProductGroup,
  IEmployee,
  IProcessTeamTargetSPProductGroup,
  IProcessTeamTeamDetail,
  ITeam,
  ITeamDetail,
  ITeamTargetSPProductGroup,
  IUpdateTeam,
  IUpdateTeamTargetSPProductGroup,
} from '../../../../domain/interfaces/TeamAndTarget';
import { IProductGroupComboBox } from '../../../../domain/interfaces/ProductInterfaces';
import {
  useGetTeamByCompanyIdQuery,
  useGetTeamDetailByTeamIdQuery,
  useGetTeamMemberByTeamIdQuery,
  useProcessSaveTeamTeamDetailMutation,
} from '../../../../infrastructure/api/TeamAndTeamDetailApiSlice';
import {
  useGetEmployeeByCompanyIdQuery,
  useGetSalesPersonByCompanyLocationBuyerIdQuery,
} from '../../../../infrastructure/api/EmployeeApiSlice';
import DualListSelectorTM from './DualListSelectorTM/DualListSelectorTM';
import { useGetDepartmentByCompanyIdQuery } from '../../../../infrastructure/api/DepartmentApiSlice';

const filter = createFilterOptions<ITeam>();

interface ITeamSetupModalInfo {
  teamId: number;
  // entryMode: string;
}

interface TeamAndMemberSelectorProps {
  // teamIdProps: number | null;
  // entryModeProps: string;
  teamSetupModalInfo: ITeamSetupModalInfo;
  setTeamSetupModalInfo: React.Dispatch<
    React.SetStateAction<ITeamSetupModalInfo>
  >;
}
// selectedItems: IPCUserListDtos[];
//   setSelectedItems: React.Dispatch<React.SetStateAction<IPCUserListDtos[]>>;
const TeamAndMember: React.FC<TeamAndMemberSelectorProps> = ({
  // teamIdProps,
  // entryModeProps,
  teamSetupModalInfo,
  setTeamSetupModalInfo,
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

  // const [teamRow, setTeamRow] = useState<ITeam>({
  //   teamId: 0,
  //   teamName: '',
  //   departmentId: 0,
  //   departmentName: '',
  //   teamLeaderId: 0,
  //   teamLeaderName: '',
  //   teamTarget: 0,
  // });
  // const [teamRowNoDirty, setTeamRowNoDirty] = useState<ITeam | null>(null);
  const [teamInfo, setTeamInfo] = useState<ITeam | null>(null);

  const [selectedEmployeeState, setSelectedEmployeeState] = useState<
    ITeamDetail[]
  >([]);

  const [selectedEmployeeStatePrev, setSelectedEmployeeStatePrev] = useState<
    ITeamDetail[]
  >([]);

  const [deletedEmployeeState, setDeletedEmployeeState] = useState<
    ITeamDetail[]
  >([]);

  // const [teamId, setTeamId] = useState<number | null>(null);
  // const [entryMode, setEntryMode] = useState<string | null>(null);

  // -----------Modal States-------------
  const [editTeamNameModal, setEditTeamNameModal] = useState<boolean>(false);
  const handleEditTeamNameModalClose = () => {
    // reset();
    setEditTeamNameModal(false);
  };
  // -----------Modal States------End-------

  // -------------------------------------API CALLS AND ASSOCIATED USE-EFFECTS------------------------------------
  // -------------all team option fetch from team table----------------

  const {
    data: teamsOptions,
    isLoading: teamsOptionsLoading,
    error: teamsOptionsError,
    isSuccess: teamsOptionsIsSuccess,
    isError: teamsOptionsIsError,
    isFetching: teamsOptionsIsFetching,
    refetch: teamsOptionsRefetch,
  } = useGetTeamByCompanyIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (teamsOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching teamsOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching teamsOptions, see console--->:'
      );
      console.log(teamsOptionsError);
    }
    if (teamsOptionsIsSuccess) {
      console.log('teamsOptionsIsSuccess');
      console.log(teamsOptions);
      if (teamSetupModalInfo?.teamId) {
        const currentTeam =
          teamsOptions.find(
            (item) => item.teamId === teamSetupModalInfo?.teamId
          ) || null;
        setTeamInfo(currentTeam);
      }
    }
  }, [
    teamSetupModalInfo?.teamId,
    teamsOptionsLoading,
    teamsOptionsIsFetching,
    teamsOptionsError,
    teamsOptionsIsError,
    teamsOptions,
    teamsOptionsIsSuccess,
  ]);

  useEffect(() => {
    if (teamInfo?.teamId) {
      setValue('teamInfoAutoComp', teamInfo);
      // setValue('teamName', teamInfo?.teamName);
      setValue('department', {
        departmentId: teamInfo?.departmentId,
        departmentName: teamInfo?.departmentName,
      });
      setValue('teamLeader', {
        employeeId: teamInfo?.teamLeaderId,
        employeeName: teamInfo?.teamLeaderName,
      });
      setValue('teamTarget', teamInfo?.teamTarget);
    }
  }, [teamInfo]);

  // -------------team detail fetch----------------
  const {
    data: teamsDetailInfo,
    isLoading: teamsDetailInfoLoading,
    error: teamsDetailInfoError,
    isSuccess: teamsDetailInfoIsSuccess,
    isError: teamsDetailInfoIsError,
    isFetching: teamsDetailInfoIsFetching,
    refetch: teamsDetailInfoRefetch,
  } = useGetTeamDetailByTeamIdQuery({
    teamId: teamInfo?.teamId || 0,
  });

  useEffect(() => {
    if (teamsDetailInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching teamsDetailInfo, see console!'
      );
      console.log(
        'Something wrong from backend while fetching teamsDetailInfo, see console--->:'
      );
      console.log(teamsDetailInfoError);
    }
    if (teamsDetailInfoIsSuccess) {
      console.log('teamsDetailInfoIsSuccess');
      console.log(teamsDetailInfo);
      const tempTeamDetail = JSON.parse(JSON.stringify(teamsDetailInfo));
      setSelectedEmployeeState([...tempTeamDetail]);
      setDeletedEmployeeState([]);
    }
  }, [
    teamInfo?.teamId,
    teamsDetailInfoIsError,
    teamsDetailInfoLoading,
    teamsDetailInfoIsFetching,
    teamsDetailInfoIsSuccess,
    teamsDetailInfoError,
    teamsDetailInfo,
  ]);

  // -------------all employees fetch for selecting teamMembers
  const {
    data: employeeOptions,
    isLoading: employeeOptionsLoading,
    error: employeeOptionsError,
    isError: employeeOptionsIsError,
    isFetching: employeeOptionsIsFetching,
    refetch: employeeOptionsRefetch,
  } = useGetEmployeeByCompanyIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (employeeOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching employeeOptions for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching employeeOptions for autocomplete, see console--->:'
      );
      console.log(employeeOptionsError);
    }
  }, [
    employeeOptionsLoading,
    employeeOptionsIsError,
    employeeOptionsError,
    employeeOptions,
    employeeOptionsIsFetching,
  ]);

  // -------------department fetch for dropdown
  const {
    data: departmentOptions,
    isLoading: departmentOptionsLoading,
    error: departmentOptionsError,
    isError: departmentOptionsIsError,
    isFetching: departmentOptionsIsFetching,
    refetch: departmentOptionsRefetch,
  } = useGetDepartmentByCompanyIdQuery({
    companyId: userInfo?.companyId,
  });

  useEffect(() => {
    if (departmentOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching departmentOptions for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching departmentOptions for autocomplete, see console--->:'
      );
      console.log(departmentOptionsError);
    }
  }, [
    departmentOptionsLoading,
    departmentOptionsIsError,
    departmentOptionsError,
    departmentOptions,
    departmentOptionsIsFetching,
  ]);

  /// ----------------------------------------------------------------------

  // .........................process Save api call.....................
  const [
    processSaveTeamTeamDetail,
    {
      isLoading: processSaveTeamTeamDetailIsLoading,
      isError: processSaveTeamTeamDetailIsError,
      error: processSaveTeamTeamDetailError,
      isSuccess: processSaveTeamTeamDetailIsSuccess,
      data: processSaveTeamTeamDetailData,
    },
  ] = useProcessSaveTeamTeamDetailMutation();

  useEffect(() => {
    if (processSaveTeamTeamDetailIsSuccess) {
      // Swal.fire({
      //   title: `Team has been saved successfully!`,
      //   text: '',
      //   showDenyButton: false,
      //   allowOutsideClick: false,
      //   // target: 'body',
      //   icon: 'success',
      //   showCancelButton: false,
      //   confirmButtonText: 'OK!',
      //   // denyButtonText: `No, I will set it manually!`,
      // }).then((result) => {
      //   /* Read more about isConfirmed, isDenied below */
      //   if (result.isConfirmed) {
      //     // modalPageOpenerClose();
      //     console.log(
      //       'check data after successful Save useProcessSaveTeamTeamDetailMutation, see console---->'
      //     );
      //     console.log(processSaveTeamTeamDetailData);

      //     // biznessEventProcessConfigurationInfoRefetch();
      //   }
      // });

      toast.success('Team has been saved successfully!');

      console.log('returned data after saving');

      console.log(processSaveTeamTeamDetailData);

      if (!teamInfo?.teamId) {
        const tempObj: ITeamSetupModalInfo = {
          teamId: processSaveTeamTeamDetailData?.teamId || 0,
          // entryMode: 'singleEdit',
        };
        setTeamSetupModalInfo(tempObj);
      } else {
        // setTeamInfo({ ...teamInfo });
        const tempObj: ITeamSetupModalInfo = {
          teamId: teamInfo?.teamId || 0,
          // entryMode: 'singleEdit',
        };
        setTeamSetupModalInfo(tempObj);
      }

      // update teamInfo with returned teamid, and if necessary teamName
    } else if (processSaveTeamTeamDetailIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving teamSPProductGroup, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving teamSPProductGroup data, see console---->'
      );
      console.log(processSaveTeamTeamDetailError);
    }
  }, [
    // teamInfo?.teamId,
    processSaveTeamTeamDetailIsLoading,
    processSaveTeamTeamDetailIsError,
    processSaveTeamTeamDetailData,
    processSaveTeamTeamDetailError,
    processSaveTeamTeamDetailIsSuccess,
  ]);
  // ------------------------------------ ENDING API CALLS AND USE-EFFECTS---------------------------------------

  const mergedAllOptionsDuelSelectList = (
    rawOptions: any[] | undefined | null
  ) => {
    let mergedOptions: any[] | undefined | null = [];

    if (rawOptions) {
      const selectedItemsEmployeesRAW: ITeamDetail[] = selectedEmployeeStatePrev
        ? JSON.parse(JSON.stringify(selectedEmployeeStatePrev))
        : [];
      // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
      mergedOptions = rawOptions.map((rawOptionRow) => {
        const match = selectedItemsEmployeesRAW.find(
          (selectedItemsEmployeesRAWRow) =>
            selectedItemsEmployeesRAWRow.employeeId === rawOptionRow.employeeId
        );
        return match || rawOptionRow;
      });
    } else {
      mergedOptions = rawOptions || [];
    }
    return JSON.parse(JSON.stringify(mergedOptions));
  };

  const onSaveBtn = () => {
    console.log('form Datas');
    console.log(getValues());
    console.log('passed teamInfo');

    if (processSaveTeamTeamDetailIsLoading) {
      toast.warning('Please wait for saving last data');
      return false;
    }

    const createTeam: ICreateTeam[] = [];
    // const deleteTeam = [];
    const updateTeam: IUpdateTeam[] = [];

    const createTeamDetail: ICreateTeamDetail[] = [];
    const createTeamDetailOutside: ICreateTeamDetail[] = [];
    const deleteTeamDetail: IDeleteTeamDetail[] = [...deletedEmployeeState];
    // const updateTeamDetail = [];

    selectedEmployeeState.forEach((element) => {
      if (!element.teamDetailId && !teamInfo?.teamId) {
        const tempCreate: ICreateTeamDetail = {
          teamDetailId: 0,
          teamId: 0,
          employeeId: element.employeeId || 0,
          employeeName: element.employeeName,
          entryBy: userInfo?.securityUserId,
          entryDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        };
        createTeamDetail.push(tempCreate);
      } else if (!element.teamDetailId && teamInfo?.teamId) {
        const tempCreate: ICreateTeamDetail = {
          teamDetailId: 0,
          teamId: teamInfo?.teamId,
          employeeId: element.employeeId || 0,
          employeeName: element.employeeName,
          entryBy: userInfo?.securityUserId,
          entryDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        };
        createTeamDetailOutside.push(tempCreate);
      }
    });

    const team: ITeam = {
      teamId: teamInfo?.teamId || 0,
      teamName: getValues('teamInfoAutoComp')?.teamName || '',
      departmentId: getValues('department')?.departmentId || null,
      departmentName: getValues('department')?.departmentName || '',
      teamLeaderId: getValues('teamLeader')?.employeeId || null,
      teamLeaderName: getValues('teamLeader')?.employeeName || '',
      teamTarget: getValues('teamTarget')
        ? parseFloat(getValues('teamTarget'))
        : 0,
    };

    if (team.teamId) {
      const updateTeamTemp: IUpdateTeam = {
        teamId: team.teamId,
        teamName: team.teamName,
        departmentId: team.departmentId,
        teamLeaderId: team.teamLeaderId,
        teamTarget: team.teamTarget,
      };
      updateTeam.push(updateTeamTemp);
    } else {
      const createTeamTemp: ICreateTeam = {
        teamId: 0,
        teamName: team.teamName,
        departmentId: team.departmentId,
        teamLeaderId: team.teamLeaderId,
        teamTarget: team.teamTarget,
        entryBy: userInfo?.securityUserId,
        entryDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        companyId: userInfo?.companyId,
        createTeamDetailListDtos: [...createTeamDetail],
      };
      createTeam.push(createTeamTemp);
    }

    const objToSend: IProcessTeamTeamDetail = {
      createTeamCommand: [...createTeam],
      updateTeamCommand: [...updateTeam],
      deleteTeamCommand: [],

      createTeamDetailCommand: [...createTeamDetailOutside],
      deleteTeamDetailCommand: [...deleteTeamDetail],
      updateTeamDetailCommand: [],
    };

    console.log('DATA TO SAVE TEAM/TeamDetail');
    console.log(objToSend);

    // call procesRTK
    processSaveTeamTeamDetail(objToSend);
  };

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <form onSubmit={handleSubmit(onSaveBtn)}>
        <div className="flex justify-center">
          <div className="block w-[98%]">
            {/* Main Card */}

            {/* <form> */}
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[TransactionEventVoucher experimental place starts here]----- */}
                Team Setup
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 w-full text-start  mt-5">
                <div className="w-full grid grid-cols-4 gap-4">
                  {/* entryMode === 'allEdit' || entryMode === 'singleEdit' */}
                  {/* {teamSetupModalInfo?.entryMode === 'allEdit' ||
                  teamSetupModalInfo?.entryMode === 'singleEdit' ? ( */}

                  <div className="flex justify-between gap-x-2">
                    <div className="w-full">
                      <Controller
                        name="teamInfoAutoComp"
                        control={control}
                        rules={{
                          required: '*Required',
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                          fieldState: { error },
                        }) => (
                          <Autocomplete
                            id=""
                            size="small"
                            options={teamsOptions || []}
                            // disabled={
                            //   teamSetupModalInfo?.entryMode === 'singleEdit'
                            // }
                            // disabled={false}
                            value={teamInfo || null}
                            onChange={(event, selectedItem) => {
                              if (!selectedItem?.teamId && selectedItem) {
                                const tempTeamInfoObj: ITeam = {
                                  teamId: 0,
                                  teamName:
                                    selectedItem.teamName.match(
                                      /Add\s+"([^"]+)"/
                                    )?.[1] || '', // ekhon eida kintu object na, just a typed string, string theke, like for example- Add "something" theke, something extract kortesi
                                  teamLeaderId: teamInfo?.teamLeaderId || 0,
                                  teamLeaderName:
                                    teamInfo?.teamLeaderName || '',
                                  teamTarget: teamInfo?.teamTarget || 0,
                                  departmentId: teamInfo?.departmentId || 0,
                                  departmentName:
                                    teamInfo?.departmentName || '',
                                };
                                console.log('tempTeamInfoObj');
                                console.log(tempTeamInfoObj);

                                // setTimeout(() => {
                                setTeamInfo(tempTeamInfoObj);
                                onChange(tempTeamInfoObj);
                                // });
                              } else {
                                console.log('tempTeamInfoObj');
                                // console.log(tempTeamInfoObj);
                                setTeamInfo(selectedItem);
                                onChange(selectedItem);
                              }

                              // if (selectedItem) {
                              //   setTeamInfo(selectedItem);
                              //   onChange(selectedItem);
                              // }
                            }} // React-hook-form manages the state
                            filterOptions={(options, params) => {
                              const filtered = filter(options, params);
                              const searchParamExists = filtered.some(
                                (obj) => obj.teamName === params.inputValue
                              );
                              if (
                                !searchParamExists &&
                                params.inputValue !== ''
                              ) {
                                filtered.push({
                                  teamId: 0,
                                  teamName: `Add "${params.inputValue}"`,
                                  teamLeaderId: teamInfo?.teamLeaderId || 0,
                                  teamLeaderName:
                                    teamInfo?.teamLeaderName || '',
                                  teamTarget: teamInfo?.teamTarget || 0,
                                  departmentId: teamInfo?.departmentId || 0,
                                  departmentName:
                                    teamInfo?.departmentName || '',
                                });
                              }
                              return filtered;
                            }}
                            getOptionLabel={(option) =>
                              option ? option.teamName : ''
                            }
                            onBlur={onBlur} // Trigger validation on blur
                            isOptionEqualToValue={(option, selectedValue) =>
                              option.teamId === selectedValue?.teamId
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Team"
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
                                }}
                                sx={{ width: '100%', marginTop: 1 }}
                                inputRef={ref}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    {teamInfo?.teamId ? (
                      <Tooltip
                        className=""
                        arrow
                        placement="top"
                        title="Change Team Name"
                      >
                        <button
                          type="button"
                          data-mdb-ripple="true"
                          data-mdb-ripple-color="light"
                          className=" inline-block  text-black cursor-pointer hover:text-blue-700 hover:scale-110   active:-translate-y-1 transform-all duration-150 ease-in-out"
                          onClick={(e) => {
                            e.preventDefault();
                            setValue('oldTeamName', teamInfo?.teamName || '');
                            setValue('newTeamName', teamInfo?.teamName || '');
                            setEditTeamNameModal(true);
                          }}
                        >
                          <Edit
                            sx={{
                              fontSize: '1.25rem',
                              padding: '0',
                              margin: '0',
                            }}
                          />{' '}
                          {/* <i className="fas fa-edit text-[0.625rem]" /> */}
                        </button>
                      </Tooltip>
                    ) : (
                      ''
                    )}
                  </div>

                  <Controller
                    name="department"
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
                        // options={departmentOptions || []}
                        options={departmentOptions || []}
                        value={value || null}
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem);
                        }} // React-hook-form manages the state
                        onBlur={onBlur} // Trigger validation on blur
                        getOptionLabel={(option) =>
                          option ? option.departmentName : ''
                        }
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.departmentId === selectedValue?.departmentId
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
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
                            }}
                            sx={{ width: '100%', marginTop: 1 }}
                            inputRef={ref}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="teamLeader"
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
                        // options={employeeOptions || []}
                        // options={employeeOptions || []}
                        options={
                          Array.from(
                            new Map(
                              employeeOptions?.map((employeeOption) => [
                                employeeOption.employeeName,
                                employeeOption,
                              ])
                            ).values()
                          ) || []
                        }
                        value={value || null}
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem);
                        }} // React-hook-form manages the state
                        onBlur={onBlur} // Trigger validation on blur
                        getOptionLabel={(option) =>
                          option ? option.employeeName : ''
                        }
                        isOptionEqualToValue={(option, selectedValue) =>
                          option.employeeId === selectedValue?.employeeId
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Team Lead"
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
                            }}
                            sx={{ width: '100%', marginTop: 1 }}
                            inputRef={ref}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="teamTarget"
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
                        InputProps={{ style: { fontSize: '0.8125rem' } }}
                        InputLabelProps={{
                          style: { fontSize: '0.875rem' },
                          shrink: value,
                        }}
                        // onBlur={onBlur} // Trigger validation on blur
                        error={!!error}
                        helperText={error ? error.message : null}
                        // inputRef={ref}
                        id=""
                        label="Team Target"
                        variant="standard"
                        size="small"
                        onBlur={(event) => {
                          // Call the original onBlur to trigger validation
                          onBlur();
                        }} // Trigger validation on blur
                        onChange={onChange}
                      />
                    )}
                  />

                  <div className="col-span-4">
                    <DualListSelectorTM
                      items={mergedAllOptionsDuelSelectList(
                        employeeOptions || []
                      )}
                      selectedItems={selectedEmployeeState}
                      setSelectedItems={setSelectedEmployeeState}
                      deletedItems={deletedEmployeeState}
                      setDeletedItems={setDeletedEmployeeState}
                      primaryKeyToDelete="teamDetailId"
                      idKey="employeeId"
                      optionName="employeeName"
                      caption="Team Members"
                    />
                  </div>
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-2">
                  <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                      processSaveTeamTeamDetailIsLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {processSaveTeamTeamDetailIsLoading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : (
                      ''
                    )}
                    {processSaveTeamTeamDetailIsLoading
                      ? ' Please Wait...'
                      : 'Save'}
                  </button>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      const tempObj: ITeamSetupModalInfo = {
                        teamId: 0,
                      };
                      reset();
                      setDeletedEmployeeState([]);
                      setTeamSetupModalInfo(tempObj);
                      setTeamInfo(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>

            {/* Main Card--/-- */}
          </div>
        </div>

        {/* Modal for fixedTaskTemplate create---- */}
        <Modal
          open={editTeamNameModal} // create leaf modal
          onClose={handleEditTeamNameModalClose}
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
              width: { xs: '40vw', md: '40vw' }, // Set the width of the modal to full screen
              // height: '95vh', // Set the height of the modal to full screen
              backgroundColor: 'white',

              // overflow: 'hidden',
              borderRadius: '20px 20px 20px 20px',
              // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
              // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
            }}
          >
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-2 m-4">
                <Controller
                  name="oldTeamName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      sx={{ width: '100%' }}
                      InputProps={{ style: { fontSize: '0.8125rem' }, readOnly: true }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: field.value,
                      }}
                      id=""
                      label="Team Name(Old)"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                <Controller
                  name="newTeamName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      sx={{ width: '100%' }}
                      InputProps={{ style: { fontSize: '0.8125rem' } }}
                      InputLabelProps={{
                        style: { fontSize: '0.875rem' },
                        shrink: field.value,
                      }}
                      id=""
                      label="Team Name(New)"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </div>

              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => {
                  if (getValues().newTeamName && teamInfo && teamInfo.teamId) {
                    const newName = getValues().newTeamName;
                    const teamInfoCopy = JSON.parse(JSON.stringify(teamInfo));
                    teamInfoCopy.teamName = newName;
                    setTeamInfo(teamInfoCopy);
                    setValue('teamInfoAutoComp', teamInfoCopy);
                    handleEditTeamNameModalClose();
                  } else if (!getValues().newTeamName) {
                    toast.error('Please enter new team name');
                  }
                  console.log('button clicked');
                  console.log(getValues().newTeamName);
                  console.log(teamInfo);
                }}
              >
                Set
              </button>
            </div>
            <IconButton
              aria-label="close"
              onClick={handleEditTeamNameModalClose}
              sx={{
                position: 'absolute',
                // top: { xs: '25%', sm: '25%', md: '4%' },
                // right: { xs: '4%', sm: '10%', md: '2%' },
                top: '1%',
                right: '1%',
                color: 'red',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
        {/* // modals --- out of html normal body/position */}
      </form>
    </div>
    // return wrapper div--/--
  );
};

export default TeamAndMember;
