/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, CircularProgress, IconButton, Modal } from '@mui/material';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import { useGetProductGroupByCompanyIdQuery } from '../../../../infrastructure/api/ProductApiSlice';
import {
  ICreateTeamTargetSPProductGroup,
  IDeleteTeamTargetSPProductGroup,
  IEmployee,
  IProcessTeamTargetSPProductGroup,
  IProductGroupFromSPTarget,
  ITeamTargetSPProductGroup,
  IUpdateTeamTargetSPProductGroup,
} from '../../../../domain/interfaces/TeamAndTarget';
import {
  useGetDistrictSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetTargetSPProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useProcessSaveSPProductGroupMutation,
} from '../../../../infrastructure/api/TargetSPProductGroupApiSlice';
import { useGetTeamMemberByTeamIdQuery } from '../../../../infrastructure/api/TeamAndTeamDetailApiSlice';
import { useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery } from '../../../../infrastructure/api/EmployeeApiSlice';
import DualListSelectorTarget from './DualListSelectorTarget/DualListSelectorTarget';
import { useGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery } from '../../../../infrastructure/api/AreaApiSlice';
import { IArea } from '../../../../domain/interfaces/RegionMasterAndTarget';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../application/Redux/store/store';
import { changeQuickEntryAnySectionModalInfo } from '../../../../application/Redux/slices/RegionMasterAndTargetSlice/QuickEntryAnySectionModalInfoSlice';

interface QuickEntryAnySectionProps {
  // fromMonth: number;
  // fromYear: number;
  // toMonth: number;
  // toYear: number;
  // employeeId: number;
  // employeeName: string;
  regionMasterId: number;
  regionMasterName: string;

  regionId: number;
  regionName: string;

  divisionId: number;
  divisionName: string;

  districtId: number;
  districtName: string;
  quickEntryAnySectionModal: boolean;
  // handleQuickEntryAnySectionModalClose: () => void;
  modalState?: boolean; // Boolean state for modal visibility
  modalCloseFunct?: () => void; // Function with no return value
}

const QuickEntryAnySection: React.FC<QuickEntryAnySectionProps> = ({
  // fromMonth,
  // fromYear,
  // toMonth,
  // toYear,
  // employeeId,
  // employeeName,
  regionMasterId,
  regionMasterName,
  regionId,
  regionName,
  divisionId,
  divisionName,
  districtId,
  districtName,
  quickEntryAnySectionModal,
  // handleQuickEntryAnySectionModalClose,
  modalState,
  modalCloseFunct,
}) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const [selectedProductGroupState, setSelectedProductGroupState] = useState<
    IProductGroupFromSPTarget[]
  >([]);

  const [selectedProductGroupStatePrev, setSelectedProductGroupStatePrev] =
    useState<IProductGroupFromSPTarget[]>([]);

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );
  const dispatch = useAppDispatch();
  // const [deletedProductGroupState, setDeletedProductGroupState] = useState<
  //   IDeleteTeamTargetSPProductGroup[]
  // >([]);

  const {
    data: uniqueProductGroups,
    isLoading: uniqueProductGroupsLoading,
    error: uniqueProductGroupsError,
    isSuccess: uniqueProductGroupsIsSuccess,
    isError: uniqueProductGroupsIsError,
    isFetching: uniqueProductGroupsIsFetching,
    refetch: uniqueProductGroupsRefetch,
  } = useGetTargetSPProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery(
    {
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      toMonth: dayjs(toMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toYear: dayjs(toMonthYearValue).year(),
      regionMasterId,
      regionId,
      divisionId,
      districtId,
    }
  );

  useEffect(() => {
    if (uniqueProductGroupsError) {
      toast.error(
        'Something wrong from backend while fetching uniqueProductGroups, see console!'
      );
      console.log(
        'Something wrong from backend while fetching uniqueProductGroups, see console--->:'
      );
      console.log(uniqueProductGroups);
    }
    if (uniqueProductGroupsIsSuccess) {
      console.log('uniqueProductGroupsIsSuccess');
      console.log(uniqueProductGroups);
      const tempProductGroups = uniqueProductGroups
        ? JSON.parse(JSON.stringify(uniqueProductGroups))
        : [];
      const tempProductGroupsCopy = uniqueProductGroups
        ? JSON.parse(JSON.stringify(uniqueProductGroups))
        : [];
      setSelectedProductGroupState([...tempProductGroups]);
      setSelectedProductGroupStatePrev([...tempProductGroupsCopy]);
    }
  }, [
    uniqueProductGroups,
    uniqueProductGroupsLoading,
    uniqueProductGroupsError,
    uniqueProductGroupsIsSuccess,
    uniqueProductGroupsIsError,
    uniqueProductGroupsIsFetching,
  ]);

  // const {
  //   data: uniqueEmployees,
  //   isLoading: uniqueEmployeesLoading,
  //   error: uniqueEmployeesError,
  //   isSuccess: uniqueEmployeesIsSuccess,
  //   isError: uniqueEmployeesIsError,
  //   isFetching: uniqueEmployeesIsFetching,
  //   refetch: uniqueEmployeesRefetch,
  // } = useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery({
  //   companyId: userInfo?.companyId,
  //   regionMasterId,
  //   regionId,
  //   divisionId,
  //   districtId,
  // });

  // useEffect(() => {
  //   if (uniqueEmployeesError) {
  //     toast.error(
  //       'Something wrong from backend while fetching uniqueEmployees, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching uniqueEmployees, see console--->:'
  //     );
  //     console.log(uniqueEmployees);
  //   }
  //   if (uniqueEmployeesIsSuccess) {
  //     console.log('uniqueEmployeesIsSuccess');
  //     console.log(uniqueEmployees);
  //   }
  // }, [
  //   uniqueEmployees,
  //   uniqueEmployeesLoading,
  //   uniqueEmployeesError,
  //   uniqueEmployeesIsSuccess,
  //   uniqueEmployeesIsError,
  //   uniqueEmployeesIsFetching,
  // ]);

  const {
    data: uniqueAreas,
    isLoading: uniqueAreasLoading,
    error: uniqueAreasError,
    isSuccess: uniqueAreasIsSuccess,
    isError: uniqueAreasIsError,
    isFetching: uniqueAreasIsFetching,
    refetch: uniqueAreasRefetch,
  } = useGetAreaByCompanyRegionMasterRegionDivisionDistrictIdQuery({
    companyId: userInfo?.companyId,
    regionMasterId,
    regionId,
    divisionId,
    districtId,
  });

  useEffect(() => {
    if (uniqueAreasError) {
      toast.error(
        'Something wrong from backend while fetching uniqueAreas, see console!'
      );
      console.log(
        'Something wrong from backend while fetching uniqueAreas, see console--->:'
      );
      console.log(uniqueAreas);
    }
    if (uniqueAreasIsSuccess) {
      console.log('uniqueAreasIsSuccess');
      console.log(uniqueAreas);
    }
  }, [
    uniqueAreas,
    uniqueAreasLoading,
    uniqueAreasError,
    uniqueAreasIsSuccess,
    uniqueAreasIsError,
    uniqueAreasIsFetching,
  ]);

  //   ......................................................................

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
          dispatch(
            changeQuickEntryAnySectionModalInfo({
              regionMasterId: 0,
              regionMasterName: '',
              regionId: 0,
              regionName: '',
              divisionId: 0,
              divisionName: '',
              districtId: 0,
              districtName: '',
              quickEntryAnySectionModal: false,
            })
          );
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

  const mergedAllOptionsDuelSelectList = (
    rawOptions: any[] | undefined | null
  ) => {
    let mergedOptions: any[] | undefined | null = [];

    if (rawOptions) {
      const selectedItemsProductGroupRAW: IProductGroupFromSPTarget[] =
        selectedProductGroupStatePrev
          ? JSON.parse(JSON.stringify(selectedProductGroupStatePrev))
          : [];
      // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
      mergedOptions = rawOptions.map((rawOptionRow) => {
        const match = selectedItemsProductGroupRAW.find(
          (selectedItemsProductGroupRAWRow) =>
            selectedItemsProductGroupRAWRow.productGroupId ===
            rawOptionRow.productGroupId
        );
        return match || rawOptionRow;
      });
    } else {
      mergedOptions = rawOptions || [];
    }
    return JSON.parse(JSON.stringify(mergedOptions));
  };

  function generateCombinedData(
    fromMonthValue: number,
    fromYearValue: number,
    toMonthValue: number,
    toYearValue: number,
    areas: IArea[],
    productGroups: IProductGroupFromSPTarget[]
  ) {
    const result: ICreateTeamTargetSPProductGroup[] = [];

    // Helper function to generate a range of months and years
    function generateMonthYearRange(
      fromMonthVal: number,
      fromYearVal: number,
      toMonthVal: number,
      toYearVal: number
    ) {
      const range = [];
      let currentMonth = fromMonthVal;
      let currentYear = fromYearVal;

      while (
        currentYear < toYearVal ||
        (currentYear === toYearVal && currentMonth <= toMonthVal)
      ) {
        range.push({ month: currentMonth, year: currentYear });
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }
      return range;
    }

    // Generate month-year range
    const monthYearRange = generateMonthYearRange(
      fromMonthValue,
      fromYearValue,
      toMonthValue,
      toYearValue
    );

    // Calculate the total rows for each product group
    const totalRows = productGroups.reduce(
      (acc: Record<number, number>, group) => {
        acc[group.productGroupId] = areas.length * monthYearRange.length;
        return acc;
      },
      {}
    );

    // Generate combined data
    productGroups.forEach((group) => {
      const amountPerRow = group.target / totalRows[group.productGroupId];

      areas.forEach((area) => {
        monthYearRange.forEach(({ month, year }) => {
          result.push({
            targetSPProductGroupId: 0,
            productGroupId: group.productGroupId,
            areaId: area.areaId,
            employeeId: area.inchargeId || 0, // Projected as employeeId
            amount: amountPerRow,
            month,
            year,
            dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
            companyId: userInfo?.companyId,
            entryBy: userInfo?.securityUserId,
          });
        });
      });
    });

    return result;
  }

  const checkedListSave = () => {
    console.log('checkList employee modal, multiple product groups target');
    console.log(selectedProductGroupState);
    // console.log(
    //   'checkList employee modal, multiple product groups target, DELETED.....'
    // );
    // console.log(deletedProductGroupState);

    const spProductGroupRowsCurrent: IProductGroupFromSPTarget[] =
      selectedProductGroupState
        ? JSON.parse(JSON.stringify(selectedProductGroupState))
        : [];
    const spProductGroupRowsPrev: IProductGroupFromSPTarget[] =
      selectedProductGroupStatePrev
        ? JSON.parse(JSON.stringify(selectedProductGroupStatePrev))
        : [];

    if (
      JSON.stringify(spProductGroupRowsCurrent) ===
      JSON.stringify(spProductGroupRowsPrev)
    ) {
      toast.info('Nothing to save!');
      return false;
    }

    let createSPProductGroup: ICreateTeamTargetSPProductGroup[] = [];
    const updateSPProductGroup: IUpdateTeamTargetSPProductGroup[] = [];
    const deleteSPProductGroup: IDeleteTeamTargetSPProductGroup[] = [];

    // ekhane combined data bananor function call hobe...

    if (!uniqueAreas) {
      toast.info('You cannot save because, no area found for this section!');
      return false;
    }

    if (selectedProductGroupState) {
      createSPProductGroup = generateCombinedData(
        dayjs(fromMonthYearValue).month() + 1,
        dayjs(fromMonthYearValue).year(),
        dayjs(toMonthYearValue).month() + 1,
        dayjs(toMonthYearValue).year(),
        uniqueAreas || [],
        selectedProductGroupState
      );
    } else {
      createSPProductGroup = [];
    }

    const dataToSend: IProcessTeamTargetSPProductGroup = {
      createTarget_SPProductGroupCommand: createSPProductGroup,
      updateTarget_SPProductGroupCommand: updateSPProductGroup,
      deleteTarget_SPProductGroupCommand: deleteSPProductGroup,
      operationName: 'Area',
      fromMonth: dayjs(fromMonthYearValue).month() + 1 || null,
      toMonth: dayjs(toMonthYearValue).month() + 1 || null,
      fromYear: dayjs(fromMonthYearValue).year() || null,
      toYear: dayjs(toMonthYearValue).year() || null,
      regionMasterId: regionMasterId || null,
      regionId: regionId || null,
      divisionId: divisionId || null,
      districtId: districtId || null,
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processSaveSPProductGroup(dataToSend);
  };
  const handleQuickEntryAnySectionModalClose = () => {
    dispatch(
      changeQuickEntryAnySectionModalInfo({
        regionMasterId: 0,
        regionMasterName: '',
        regionId: 0,
        regionName: '',
        divisionId: 0,
        divisionName: '',
        districtId: 0,
        districtName: '',
        quickEntryAnySectionModal: false,
      })
    );
  };
  return (
    <Modal
      open={quickEntryAnySectionModal} // create leaf modal
      onClose={handleQuickEntryAnySectionModalClose}
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
          <div className="m-5">
            <div>
              Target set for{' '}
              {regionMasterName ||
                regionName ||
                divisionName ||
                districtName ||
                ''}
            </div>
            <DualListSelectorTarget
              items={mergedAllOptionsDuelSelectList(productGroupOptions) || []}
              selectedItems={selectedProductGroupState || []}
              setSelectedItems={setSelectedProductGroupState}
              // deletedItems={deletedProductGroupState}
              // setDeletedItems={setDeletedProductGroupState}
              // primaryKeyToDelete="productGroupId"
              // parentPrimaryKey="biznessEventProcessConfigurationId"
              idKey="productGroupId"
              optionName="productGroupName"
              targetProperty="target"
              caption="Product Group"
            />
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className={`inline-block mt-5 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out ${
                processSaveSPProductGroupIsLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => {
                if (!processSaveSPProductGroupIsLoading) {
                  checkedListSave();
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
          </div>
        </div>
        <IconButton
          aria-label="close"
          onClick={handleQuickEntryAnySectionModalClose}
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
  );
};

export default QuickEntryAnySection;
