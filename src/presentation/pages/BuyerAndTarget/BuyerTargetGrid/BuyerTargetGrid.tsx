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
  Menu,
  MenuItem,
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
import { useGetProductGroupByCompanyIdQuery } from '../../../../infrastructure/api/ProductApiSlice';
import { useGetTeamMemberByTeamIdQuery } from '../../../../infrastructure/api/TeamAndTeamDetailApiSlice';
import DualListSelectorTarget from './DualListSelectorTarget/DualListSelectorTarget';

import { IArea } from '../../../../domain/interfaces/RegionMasterAndTarget';
import MonthYearRangePicker from '../../../components/biz24Components/MonthYearRangePicker/MonthYearRangePicker';
import { changeFromMonthYear } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/FromMonthYearSlice';
import { changeToMonthYear } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/ToMonthYearSlice';

import { changeQuickEntryAnySectionModalInfo } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/QuickEntryAnySectionModalInfoSlice';
import QuickEntryProductGroupByBuyer from './QuickEntryProductGroupByBuyer/QuickEntryProductGroupByBuyer';
import {
  IBuyerTargetProductGroup,
  ICreateBuyerTargetProductGroup,
  IDeleteBuyerTargetProductGroup,
  IProcessBuyerTargetProductGroup,
  IUpdateBuyerTargetProductGroup,
} from '../../../../domain/interfaces/BuyerAndTarget';
import { IBuyer } from '../../../../domain/interfaces/BuyerInterface';
import {
  useGetPrevMonthTargetBuyerProductGroupByMonthYearAreaIdQuery,
  useGetTargetBuyerProductGroupByMonthYearAreaIdQuery,
  useProcessTargetBuyerProductGroupMutation,
} from '../../../../infrastructure/api/TargetBuyerProductGroupApiSlice';
import { useGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery } from '../../../../infrastructure/api/BuyerApiSlice';
import QuickEntryBuyerByProductGroup from './QuickEntryBuyerByProductGroup/QuickEntryBuyerByProductGroup';

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

interface BuyerTargetGridSelectorProps {
  areaId: number;
}

const BuyerTargetGrid: React.FC<BuyerTargetGridSelectorProps> = ({
  areaId,
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

  const [buyerTargetGridState, setBuyerTargetGridState] = useState<
    IBuyerTargetProductGroup[]
  >([]);

  const [buyerTargetGridStatePrev, setBuyerTargetGridStatePrev] = useState<
    IBuyerTargetProductGroup[]
  >([]);

  const [buyerTargetGridStateDeleted, setBuyerTargetGridStateDeleted] =
    useState<IDeleteBuyerTargetProductGroup[]>([]);

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

  // ------buyer modal initializations--------
  const [quickEntryBuyerModal, setQuickEntryBuyerModal] =
    useState<boolean>(false);
  const handleQuickEntryBuyerModalClose = () => {
    // reset();
    setQuickEntryBuyerModal(false);
  };
  const [currentBuyerModalRow, setCurrentBuyerModalRow] = useState<any>(null);

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
  const [isBuyerTargetGridLoading, setIsBuyerTargetGridLoading] =
    useState(true);
  const [sortingBuyerTargetGrid, setSortingBuyerTargetGrid] =
    useState<MRT_SortingState>([]);

  // -------------------------------------API CALLS AND ASSOCIATED USE-EFFECTS------------------------------------

  const {
    data: buyerTargetGridInfo,
    isLoading: buyerTargetGridInfoLoading,
    error: buyerTargetGridInfoError,
    isSuccess: buyerTargetGridInfoIsSuccess,
    isError: buyerTargetGridInfoIsError,
    isFetching: buyerTargetGridInfoIsFetching,
    refetch: buyerTargetGridInfoRefetch,
  } = useGetTargetBuyerProductGroupByMonthYearAreaIdQuery({
    areaId,
    fromMonth: dayjs(fromMonthYearValue).month() + 1,
    toMonth: dayjs(toMonthYearValue).month() + 1,
    fromYear: dayjs(fromMonthYearValue).year(),
    toYear: dayjs(toMonthYearValue).year(),
    buyerId: 0,
    productGroupId: 0,
  });

  useEffect(() => {
    if (buyerTargetGridInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerTargetGridInfo, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerTargetGridInfo, see console--->:'
      );
      console.log(buyerTargetGridInfoError);
      setBuyerTargetGridStatePrev([]);
      setBuyerTargetGridState([]);
      setIsBuyerTargetGridLoading(false);
    }
    // if (buyerTargetGridInfoIsSuccess) {
    //   console.log('buyerTargetGridInfoIsSuccess');
    //   console.log(buyerTargetGridInfo);
    //   const tempArrayVar: ITeamTargetSPProductGroup[] = buyerTargetGridInfo
    //     ? JSON.parse(JSON.stringify(buyerTargetGridInfo))
    //     : [];
    //   setBuyerTargetGridStatePrev([...tempArrayVar]);
    //   addEmptyRowsAndGridInfo();
    // }
    else if (
      buyerTargetGridInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !buyerTargetGridInfoLoading &&
      !buyerTargetGridInfoIsFetching &&
      !buyerTargetGridInfoIsError
    ) {
      console.log('buyerTargetGridInfoIsSuccess');
      console.log(buyerTargetGridInfo);
      const tempArrayVar: IBuyerTargetProductGroup[] = buyerTargetGridInfo
        ? JSON.parse(JSON.stringify(buyerTargetGridInfo))
        : [];
      setBuyerTargetGridStatePrev([...tempArrayVar]);
      addEmptyRowsAndGridInfo();
      setIsBuyerTargetGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsBuyerTargetGridLoading(true);
    }
  }, [
    buyerTargetGridInfoLoading,
    buyerTargetGridInfoIsFetching,
    buyerTargetGridInfoError,
    buyerTargetGridInfoIsError,
    buyerTargetGridInfo,
    buyerTargetGridInfoIsSuccess,
  ]);

  // --------------------Same targetBuyerProductGroup API call in a new way, to get prevMonths target--------

  const prevFromMonthYearValue = dayjs(fromMonthYearValue).subtract(1, 'month');
  const {
    data: prevMonthBuyerTargetGridInfo,
    isLoading: prevMonthBuyerTargetGridInfoLoading,
    error: prevMonthBuyerTargetGridInfoError,
    isSuccess: prevMonthBuyerTargetGridInfoIsSuccess,
    isError: prevMonthBuyerTargetGridInfoIsError,
    isFetching: prevMonthBuyerTargetGridInfoIsFetching,
    refetch: prevMonthBuyerTargetGridInfoRefetch,
  } = useGetPrevMonthTargetBuyerProductGroupByMonthYearAreaIdQuery({
    areaId,
    fromMonth: dayjs(prevFromMonthYearValue).month() + 1,
    toMonth: dayjs(prevFromMonthYearValue).month() + 1,
    fromYear: dayjs(prevFromMonthYearValue).year(),
    toYear: dayjs(prevFromMonthYearValue).year(),
    buyerId: 0,
    productGroupId: 0,
  });

  useEffect(() => {
    if (prevMonthBuyerTargetGridInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching prevMonthBuyerTargetGridInfo, see console!'
      );
      console.log(
        'Something wrong from backend while fetching prevMonthBuyerTargetGridInfo, see console--->:'
      );
      console.log(prevMonthBuyerTargetGridInfoError);
    } else if (
      prevMonthBuyerTargetGridInfoIsSuccess &&
      !prevMonthBuyerTargetGridInfoLoading &&
      !prevMonthBuyerTargetGridInfoIsFetching &&
      !prevMonthBuyerTargetGridInfoIsError
    ) {
      console.log('prevMonthBuyerTargetGridInfoIsSuccess');
      console.log(prevMonthBuyerTargetGridInfo);
    }
  }, [
    prevMonthBuyerTargetGridInfoLoading,
    prevMonthBuyerTargetGridInfoIsFetching,
    prevMonthBuyerTargetGridInfoError,
    prevMonthBuyerTargetGridInfoIsError,
    prevMonthBuyerTargetGridInfo,
    prevMonthBuyerTargetGridInfoIsSuccess,
  ]);

  // --------------------Same targetBuyerProductGroup API call in a new way, to get prevMonths target------ENDS------

  const {
    data: buyerOfAreaOptions,
    isLoading: buyerOfAreaOptionsLoading,
    error: buyerOfAreaOptionsError,
    isSuccess: buyerOfAreaOptionsIsSuccess,
    isError: buyerOfAreaOptionsIsError,
    isFetching: buyerOfAreaOptionsIsFetching,
    refetch: buyerOfAreaOptionsRefetch,
  } = useGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery(
    {
      companyId: userInfo?.companyId,
      regionMasterId: 0,
      regionId: 0,
      divisionId: 0,
      districtId: 0,
      areaId,
    }
  );

  useEffect(() => {
    if (buyerOfAreaOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerOfAreaOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerOfAreaOptions, see console--->:'
      );
      console.log(buyerOfAreaOptionsIsError);
    }
    if (buyerOfAreaOptionsIsSuccess) {
      console.log('buyerOfAreaOptionsIsSuccess');
      console.log(buyerOfAreaOptions);
    }
  }, [
    buyerOfAreaOptions,
    buyerOfAreaOptionsLoading,
    buyerOfAreaOptionsError,
    buyerOfAreaOptionsIsError,
    buyerOfAreaOptionsIsSuccess,
    buyerOfAreaOptionsIsFetching,
  ]);

  // const {
  //   data: areaOptions,
  //   isLoading: areaOptionsLoading,
  //   error: areaOptionsError,
  //   isSuccess: areaOptionsIsSuccess,
  //   isError: areaOptionsIsError,
  //   isFetching: areaOptionsIsFetching,
  //   refetch: areaOptionsRefetch,
  // } = useGetAreaByCompanyRegionMasterRegionDivisionBuyerIdQuery({
  //   companyId: userInfo?.companyId,
  //   regionMasterId: 0,
  //   regionId: 0,
  //   divisionId: 0,
  //   areaId,
  // });

  // useEffect(() => {
  //   if (areaOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching areaOptions, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching areaOptions, see console--->:'
  //     );
  //     console.log(areaOptionsIsError);
  //   }
  //   if (areaOptionsIsSuccess) {
  //     console.log('areaOptionsIsSuccess');
  //     console.log(areaOptions);
  //   }
  // }, [
  //   areaOptions,
  //   areaOptionsLoading,
  //   areaOptionsError,
  //   areaOptionsIsSuccess,
  //   areaOptionsIsError,
  //   areaOptionsIsFetching,
  // ]);

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
    const lengthOfData = buyerTargetGridInfo?.length || 0;
    let iterationOfForLoop = 0;
    if (lengthOfData < 10) {
      iterationOfForLoop = 10 - lengthOfData;
    } else {
      iterationOfForLoop = 1;
    }

    const emptyRows = [];
    for (let i = 0; i < iterationOfForLoop; i++) {
      const tempEmptyRow = {
        targetBuyerProductGroupId: null,
        buyerId: null,
        buyerName: null,
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
    if (buyerTargetGridInfo) {
      const tempArrayVar: IBuyerTargetProductGroup[] = buyerTargetGridInfo
        ? JSON.parse(JSON.stringify(buyerTargetGridInfo))
        : [];
      setBuyerTargetGridState([...tempArrayVar, ...emptyRows]);
    } else {
      setBuyerTargetGridState([...emptyRows]);
    }
  };

  const getEmptyRow = () => {
    const tempEmptyRow: IBuyerTargetProductGroup = {
      // targetSPProductGroupId: null,
      // areaId: null,
      // areaName: null,
      // buyerId: null,
      // buyerName: null,
      // productGroupId: null,
      // productGroupName: null,
      // month: null,
      // year: null,
      // target: null,
      // sold: null,
      // achievement: null,
      // so: null,
      // finalAchievement: null,
      // quantity: null,

      targetBuyerProductGroupId: null,
      buyerId: null,
      buyerName: null,
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
      JSON.stringify(buyerTargetGridState)
    );
    console.log('copyTeamTargetGridState');
    console.log(copyTeamTargetGridState);
    console.log('buyerTargetGridState');
    console.log(buyerTargetGridState);

    if (selectedOption) {
      const selectedOpt = selectedOption as IProductGroupComboBox;
      buyerTargetGridState[index].productGroupId =
        selectedOpt.productGroupId ?? 0;
      buyerTargetGridState[index].productGroupName =
        selectedOpt.productGroupName ?? '';
    } else {
      buyerTargetGridState[index].productGroupId = null;
      buyerTargetGridState[index].productGroupName = null;
    }

    if (index === buyerTargetGridState.length - 1) {
      setBuyerTargetGridState([...buyerTargetGridState, getEmptyRow()]);
    } else {
      setBuyerTargetGridState([...buyerTargetGridState]);
    }
  };

  const setPreviousTargetToAllSelected = () => {
    console.log('setPreviousMonthTargetToAllSelected');

    const updatedBuyerTargetGridState = buyerTargetGridState.map((item) => {
      const { productGroupId, buyerId } = item;

      if (productGroupId && buyerId && prevMonthBuyerTargetGridInfo) {
        const match = prevMonthBuyerTargetGridInfo.find(
          (p: IBuyerTargetProductGroup) =>
            p.productGroupId === productGroupId && p.buyerId === buyerId
        );

        if (match) {
          return { ...item, target: match.target };
        }
      }

      return item;
    });

    // selectedItems.splice(1, 1);
    setBuyerTargetGridState([...updatedBuyerTargetGridState]);
    console.log(updatedBuyerTargetGridState);
  };

  // .........................process Save api call.....................

  const [
    processTargetBuyerProductGroup,
    {
      isLoading: processTargetBuyerProductGroupIsLoading,
      isError: processTargetBuyerProductGroupIsError,
      error: processTargetBuyerProductGroupError,
      isSuccess: processTargetBuyerProductGroupIsSuccess,
      data: processTargetBuyerProductGroupData,
    },
  ] = useProcessTargetBuyerProductGroupMutation();

  useEffect(() => {
    if (processTargetBuyerProductGroupIsSuccess) {
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
            'check data after successful Save targetBuyerProductGroup, see console---->'
          );
          console.log(processTargetBuyerProductGroupData);
          // dispatch(
          //   changeQuickEntryAnySectionModalInfo({
          //     regionMasterId: 0,
          //     regionMasterName: 'aboltabol',
          //     regionId: 0,
          //     regionName: '',
          //     divisionId: 0,
          //     divisionName: '',
          //     buyerId: 0,
          //     buyerName: '',
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
          //     buyerId: 0,
          //     buyerName: '',
          //     quickEntryAnySectionModal: false,
          //   })
          // );
        }
      });
    } else if (processTargetBuyerProductGroupIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving targetBuyerProductGroup, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving targetBuyerProductGroup data, see console---->'
      );
      console.log(processTargetBuyerProductGroupError);
    }
  }, [
    processTargetBuyerProductGroupIsLoading,
    processTargetBuyerProductGroupIsError,
    processTargetBuyerProductGroupData,
    processTargetBuyerProductGroupError,
    processTargetBuyerProductGroupIsSuccess,
  ]);

  // ------------------------------------ ENDING API CALLS AND USE-EFFECTS---------------------------------------

  // mouse right click handle on target column cell------
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    rowIndex: number;
  } | null>(null);

  const handleCopyPreviousTarget = (index: number) => {
    setPreviousTargetToAllSelected();
    setContextMenu(null);
  };

  /// /-----------------auto comp list style-----------------

  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );

  const buyerTargetGridColumns = useMemo<
    MRT_ColumnDef<IBuyerTargetProductGroup>[]
  >(
    () => [
      {
        accessorFn: (row) => row.buyerName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.buyerName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'buyerName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Buyer',
        Cell: ({ renderedCellValue, row }) => {
          const currentBuyer: IBuyer = {
            buyerId: row.original.buyerId ?? 0,
            buyerName: row.original.buyerName ?? '',
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
                options={buyerOfAreaOptions || []}
                value={currentBuyer}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    const selectedOpt = selectedOption as IBuyer;
                    buyerTargetGridState[row.index].buyerId =
                      selectedOpt.buyerId ?? 0;
                    buyerTargetGridState[row.index].buyerName =
                      selectedOpt.buyerName ?? '';

                    if (
                      fromMonthYearValue.year() === toMonthYearValue.year() &&
                      fromMonthYearValue.month() === toMonthYearValue.month()
                    ) {
                      // same month + same year
                      buyerTargetGridState[row.index].month =
                        fromMonthYearValue.month() + 1;

                      buyerTargetGridState[row.index].year =
                        fromMonthYearValue.year();
                    }

                    console.log('fromMonthYearValue');
                    console.log(fromMonthYearValue);

                    console.log('toMonthYearValue');
                    console.log(toMonthYearValue);

                    // buyerTargetGridState[row.index].month = month;
                    // buyerTargetGridState[row.index].year = year;
                  } else {
                    buyerTargetGridState[row.index].buyerId = null;
                    buyerTargetGridState[row.index].buyerName = null;
                    // buyerTargetGridState[row.index].month = null;
                    // buyerTargetGridState[row.index].year = null;
                  }
                  if (row.index === buyerTargetGridState.length - 1) {
                    setBuyerTargetGridState([
                      ...buyerTargetGridState,
                      getEmptyRow(),
                    ]);
                  } else {
                    setBuyerTargetGridState([...buyerTargetGridState]);
                  }
                }}
                getOptionLabel={(option: any) =>
                  option.buyerName ? option.buyerName : ''
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
                className={row.original.buyerId ? 'visible' : 'invisible'}
                arrow
                placement="right"
                title="Quick Entry"
              >
                <IconButton
                  color="info"
                  onClick={() => {
                    setQuickEntryBuyerModal(true);
                    const tempRowBuyer = {
                      buyerId: row.original.buyerId,
                      buyerName: row.original.buyerName,
                      month: row.original.month,
                      year: row.original.year,
                    };
                    setCurrentBuyerModalRow(tempRowBuyer);
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
                buyerTargetGridState[row.index].month = parseInt(
                  e.target.value,
                  10
                );
                setBuyerTargetGridState([...buyerTargetGridState]);
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
                buyerTargetGridState[row.index].year = parseInt(
                  e.target.value,
                  10
                );
                setBuyerTargetGridState([...buyerTargetGridState]);
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
          row.target ? (Math.ceil(row.target * 100) / 100).toFixed(2) : '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.target, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'target',
        header: 'Target',
        Cell: ({ renderedCellValue, row }) => {
          const handleContextMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            setContextMenu({
              mouseX: e.clientX + 2,
              mouseY: e.clientY - 6,
              rowIndex: row.index,
            });
          };

          return (
            <div onContextMenu={handleContextMenu}>
              <TextField
                type="number"
                sx={{ width: '100%' }}
                InputProps={{
                  style: { fontSize: '0.8125rem' },
                  disableUnderline: true,
                  // readOnly: true,
                }}
                onBlur={(e) => {
                  buyerTargetGridState[row.index].target = parseFloat(
                    e.target.value
                  );

                  if (row.index === buyerTargetGridState.length - 1) {
                    setBuyerTargetGridState([
                      ...buyerTargetGridState,
                      getEmptyRow(),
                    ]);
                  } else {
                    setBuyerTargetGridState([...buyerTargetGridState]);
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
                buyerTargetGridState[row.index].quantity = parseFloat(
                  e.target.value
                );

                if (row.index === buyerTargetGridState.length - 1) {
                  setBuyerTargetGridState([
                    ...buyerTargetGridState,
                    getEmptyRow(),
                  ]);
                } else {
                  setBuyerTargetGridState([...buyerTargetGridState]);
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
                row.original.buyerId || row.original.productGroupId
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
                    buyerTargetGridState[row.index]?.targetBuyerProductGroupId
                  ) {
                    const deletedBuyerGroupRow: IDeleteBuyerTargetProductGroup =
                      {
                        targetBuyerProductGroupId:
                          buyerTargetGridState[row.index]
                            .targetBuyerProductGroupId ?? 0,
                      };
                    setBuyerTargetGridStateDeleted([
                      ...buyerTargetGridStateDeleted,
                      deletedBuyerGroupRow,
                    ]);
                  }
                  buyerTargetGridState?.splice(row.index, 1);
                  setBuyerTargetGridState([...buyerTargetGridState]);
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
      columnVisibility?.buyerName,
      columnVisibility?.finalAchievement,
      columnVisibility?.month,
      columnVisibility?.so,
      columnVisibility?.sold,
      columnVisibility?.target,
      columnVisibility?.year,
      getEmptyRow,
      fromMonthYearValue,
      toMonthYearValue,
      buyerTargetGridState,
      buyerTargetGridStateDeleted,
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
  }, [sortingBuyerTargetGrid]);

  // ---------- material table virtualization---------

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

  const buyerTargetGridStateInitializer: MRT_TableInstance<IBuyerTargetProductGroup> =
    useMaterialReactTable({
      columns: buyerTargetGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: buyerTargetGridState || [],
      state: {
        columnVisibility,
        isLoading:
          isBuyerTargetGridLoading ||
          buyerTargetGridInfoIsFetching ||
          buyerTargetGridInfoLoading,
        sorting: sortingBuyerTargetGrid,
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
                //   handleExportData(
                //     purchaseComparativeSheetGridState,
                //     purchaseComparativeSheetGridColumns
                //   );
                const buyerTargetGridStateWithoutEmpty =
                  buyerTargetGridState.filter(
                    (row) => row.buyerId && row.productGroupId
                  );
                handleExportData(
                  buyerTargetGridStateWithoutEmpty,
                  buyerTargetGridColumns
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
      onSortingChange: setSortingBuyerTargetGrid,
      rowVirtualizerInstanceRef, // optional
      rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
    });

  const saveBuyerTargetGridFunct = () => {
    console.log('in save function from Team Target');
    console.log(buyerTargetGridState);

    console.log('checkList productGroup modal, multiple product groups target');
    console.log(buyerTargetGridState);
    console.log('DELETED buyerTargetGridState.....');
    console.log(buyerTargetGridStateDeleted);

    const buyerTargetGridStateWithoutEmpty = buyerTargetGridState.filter(
      (item) => item.productGroupId && item.buyerId
    );

    const spProductGroupRowsCurrent: IBuyerTargetProductGroup[] =
      buyerTargetGridStateWithoutEmpty
        ? JSON.parse(JSON.stringify(buyerTargetGridStateWithoutEmpty))
        : [];
    const spProductGroupRowsPrev: IBuyerTargetProductGroup[] =
      buyerTargetGridStatePrev
        ? JSON.parse(JSON.stringify(buyerTargetGridStatePrev))
        : [];

    if (
      JSON.stringify(spProductGroupRowsCurrent) ===
      JSON.stringify(spProductGroupRowsPrev)
    ) {
      toast.info('Nothing to save!');
      return false;
    }

    const createTargetBuyerProductGroup: ICreateBuyerTargetProductGroup[] = [];
    const updateTargetBuyerProductGroup: IUpdateBuyerTargetProductGroup[] = [];
    const deleteTargetBuyerProductGroup: IDeleteBuyerTargetProductGroup[] = [
      ...buyerTargetGridStateDeleted,
    ];

    spProductGroupRowsCurrent.forEach((spProductGroupRow) => {
      if (!spProductGroupRow.targetBuyerProductGroupId) {
        const tempCreate: ICreateBuyerTargetProductGroup = {
          targetBuyerProductGroupId: 0,
          buyerId: spProductGroupRow.buyerId || 0,
          productGroupId: spProductGroupRow.productGroupId || 0,
          month: spProductGroupRow.month || 0,
          year: spProductGroupRow.year || 0,
          amount: spProductGroupRow.target || 0,
          dateOfEntry: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
          companyId: userInfo?.companyId,
          entryBy: userInfo?.securityUserId,
          quantity: spProductGroupRow.quantity || 0,
        };
        createTargetBuyerProductGroup.push(tempCreate);
      } else {
        const tempUpdate: IUpdateBuyerTargetProductGroup = {
          targetBuyerProductGroupId:
            spProductGroupRow.targetBuyerProductGroupId,
          buyerId: spProductGroupRow.buyerId || 0,
          productGroupId: spProductGroupRow.productGroupId || 0,
          month: spProductGroupRow.month || 0,
          year: spProductGroupRow.year || 0,
          amount: spProductGroupRow.target || 0,
          quantity: spProductGroupRow.quantity || 0,
          //   dateOfEntry: spProductGroupRow.date,
          //   companyId: userInfo?.companyId,
          //   entryBy: userInfo?.securityUserId,
        };
        updateTargetBuyerProductGroup.push(tempUpdate);
      }
    });

    const dataToSend: IProcessBuyerTargetProductGroup = {
      createTarget_BuyerProductGroupCommand: createTargetBuyerProductGroup,
      updateTarget_BuyerProductGroupCommand: updateTargetBuyerProductGroup,
      deleteTarget_BuyerProductGroupCommand: deleteTargetBuyerProductGroup,
      operationName: 'Area',
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processTargetBuyerProductGroup(dataToSend);
  };

  return (
    // return wrapper div
    <div className="w-full mt-4 mb-5 modifiedEditTable">
      <MaterialReactTable table={buyerTargetGridStateInitializer} />
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={`inline-block mt-2 px-3 py-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
          processTargetBuyerProductGroupIsLoading
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={() => {
          if (!processTargetBuyerProductGroupIsLoading) {
            saveBuyerTargetGridFunct();
          }
        }}
      >
        {processTargetBuyerProductGroupIsLoading ? (
          <CircularProgress size={12} color="inherit" />
        ) : (
          ''
        )}
        {processTargetBuyerProductGroupIsLoading ? ' Please Wait...' : 'Save'}
      </button>

      {/* <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={`inline-block mt-2 px-3 py-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
          processTargetBuyerProductGroupIsLoading
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={() => {
          setPreviousTargetToAllSelected();
        }}
      >
        {' '}
        Prev month target
      </button> */}

      {/* Context Menu Component */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() =>
            contextMenu && handleCopyPreviousTarget(contextMenu.rowIndex)
          }
        >
          Copy previous month target for all
        </MenuItem>
      </Menu>

      {/* Modal for buyerQuickButton create---- */}
      <Modal
        open={quickEntryBuyerModal} // create leaf modal
        onClose={handleQuickEntryBuyerModalClose}
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
            <QuickEntryProductGroupByBuyer
              areaId={areaId}
              fromMonth={dayjs(fromMonthYearValue).month() + 1}
              fromYear={dayjs(fromMonthYearValue).year()}
              toMonth={dayjs(toMonthYearValue).month() + 1}
              toYear={dayjs(toMonthYearValue).year()}
              buyerId={currentBuyerModalRow?.buyerId || 0}
              buyerName={currentBuyerModalRow?.buyerId || ''}
              modalState={quickEntryBuyerModal}
              modalCloseFunct={handleQuickEntryBuyerModalClose}
            />
          </div>

          <IconButton
            aria-label="close"
            onClick={handleQuickEntryBuyerModalClose}
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
            <QuickEntryBuyerByProductGroup
              areaId={areaId}
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

export default BuyerTargetGrid;
