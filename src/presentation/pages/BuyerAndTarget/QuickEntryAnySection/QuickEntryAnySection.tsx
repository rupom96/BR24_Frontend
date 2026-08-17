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
  IEmployee,
  IProductGroupFromSPTarget,
} from '../../../../domain/interfaces/TeamAndTarget';

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
import { changeQuickEntryAnySectionModalInfoForBuyer } from '../../../../application/Redux/slices/RegionMasterAndTargetForBuyerSlice/QuickEntryAnySectionModalInfoForBuyerSlice';
import {
  useGetPrevMonthTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
  useGetTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
  useProcessTargetBuyerProductGroupMutation,
} from '../../../../infrastructure/api/TargetBuyerProductGroupApiSlice';
import { useGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery } from '../../../../infrastructure/api/BuyerApiSlice';
import { IBuyer } from '../../../../domain/interfaces/BuyerInterface';
import {
  ICreateBuyerTargetProductGroup,
  IDeleteBuyerTargetProductGroup,
  IProcessBuyerTargetProductGroup,
  IUpdateBuyerTargetProductGroup,
} from '../../../../domain/interfaces/BuyerAndTarget';

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
  areaId: number;
  areaName: string;

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
  areaId,
  areaName,
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
  } = useGetTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery(
    {
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      toMonth: dayjs(toMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toYear: dayjs(toMonthYearValue).year(),
      regionMasterId,
      regionId,
      divisionId,
      districtId,
      areaId,
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

  // ----- same api call in a new way, in order to get previousMonths targets------

  const prevFromMonthYearValue = dayjs(fromMonthYearValue).subtract(1, 'month');
  const prevToMonthYearValue = dayjs(fromMonthYearValue).subtract(1, 'month');
  const {
    data: prevMonthUniqueProductGroups,
    isLoading: prevMonthUniqueProductGroupsLoading,
    error: prevMonthUniqueProductGroupsError,
    isSuccess: prevMonthUniqueProductGroupsIsSuccess,
    isError: prevMonthUniqueProductGroupsIsError,
    isFetching: prevMonthUniqueProductGroupsIsFetching,
    refetch: prevMonthUniqueProductGroupsRefetch,
  } = useGetPrevMonthTargetBuyerProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery(
    {
      fromMonth: dayjs(prevFromMonthYearValue).month() + 1,
      toMonth: dayjs(prevToMonthYearValue).month() + 1,
      fromYear: dayjs(prevFromMonthYearValue).year(),
      toYear: dayjs(prevToMonthYearValue).year(),
      regionMasterId,
      regionId,
      divisionId,
      districtId,
      areaId,
    }
  );

  useEffect(() => {
    if (prevMonthUniqueProductGroupsError) {
      toast.error(
        'Something wrong from backend while fetching prevMonthUniqueProductGroups, see console!'
      );
      console.log(
        'Something wrong from backend while fetching prevMonthUniqueProductGroups, see console--->:'
      );
      console.log(prevMonthUniqueProductGroups);
    }
    if (prevMonthUniqueProductGroupsIsSuccess) {
      console.log('prevMonthUniqueProductGroupsIsSuccess');
      console.log(prevMonthUniqueProductGroups);
      const tempProductGroups = prevMonthUniqueProductGroups
        ? JSON.parse(JSON.stringify(prevMonthUniqueProductGroups))
        : [];
      const tempProductGroupsCopy = prevMonthUniqueProductGroups
        ? JSON.parse(JSON.stringify(prevMonthUniqueProductGroups))
        : [];
      setSelectedProductGroupState([...tempProductGroups]);
      setSelectedProductGroupStatePrev([...tempProductGroupsCopy]);
    }
  }, [
    prevMonthUniqueProductGroups,
    prevMonthUniqueProductGroupsLoading,
    prevMonthUniqueProductGroupsError,
    prevMonthUniqueProductGroupsIsSuccess,
    prevMonthUniqueProductGroupsIsError,
    prevMonthUniqueProductGroupsIsFetching,
  ]);

  // ----- same api call in a new way, in order to get previousMonths targets------END-------

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
    data: uniqueBuyers,
    isLoading: uniqueBuyersLoading,
    error: uniqueBuyersError,
    isSuccess: uniqueBuyersIsSuccess,
    isError: uniqueBuyersIsError,
    isFetching: uniqueBuyersIsFetching,
    refetch: uniqueBuyersRefetch,
  } = useGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery(
    {
      companyId: userInfo?.companyId,
      regionMasterId,
      regionId,
      divisionId,
      districtId,
      areaId,
    }
  );

  useEffect(() => {
    if (uniqueBuyersError) {
      toast.error(
        'Something wrong from backend while fetching uniqueBuyers, see console!'
      );
      console.log(
        'Something wrong from backend while fetching uniqueBuyers, see console--->:'
      );
      console.log(uniqueBuyers);
    }
    if (uniqueBuyersIsSuccess) {
      console.log('uniqueBuyersIsSuccess');
      console.log(uniqueBuyers);
    }
  }, [
    uniqueBuyers,
    uniqueBuyersLoading,
    uniqueBuyersError,
    uniqueBuyersIsSuccess,
    uniqueBuyersIsError,
    uniqueBuyersIsFetching,
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
            'check data after successful Save TargetBuyerProductGroup, see console---->'
          );
          console.log(processTargetBuyerProductGroupData);
          dispatch(
            changeQuickEntryAnySectionModalInfoForBuyer({
              regionMasterId: 0,
              regionMasterName: '',
              regionId: 0,
              regionName: '',
              divisionId: 0,
              divisionName: '',
              districtId: 0,
              districtName: '',
              areaId: 0,
              areaName: '',
              quickEntryAnySectionModal: false,
            })
          );
          // biznessEventProcessConfigurationInfoRefetch();
        }
      });
    } else if (processTargetBuyerProductGroupIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving TargetBuyerProductGroup, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving TargetBuyerProductGroup data, see console---->'
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
    buyers: IBuyer[],
    productGroups: IProductGroupFromSPTarget[]
  ) {
    const result: ICreateBuyerTargetProductGroup[] = [];

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
        acc[group.productGroupId] = buyers.length * monthYearRange.length;
        return acc;
      },
      {}
    );

    // Generate combined data
    productGroups.forEach((group) => {
      const amountPerRow = group.target / totalRows[group.productGroupId];

      buyers.forEach((buyer) => {
        monthYearRange.forEach(({ month, year }) => {
          result.push({
            targetBuyerProductGroupId: 0,
            productGroupId: group.productGroupId,
            buyerId: buyer.buyerId || 0, // Projected as employeeId
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

    const hasFalsyTarget = spProductGroupRowsCurrent.some((row) => !row.target);

    if (hasFalsyTarget) {
      toast.info(
        'Target of some product group are empty or 0, which is not allowed!'
      );
      return false;
    }
    if (
      JSON.stringify(spProductGroupRowsCurrent) ===
      JSON.stringify(spProductGroupRowsPrev)
    ) {
      toast.info('Nothing to save!');
      return false;
    }

    let createSPProductGroup: ICreateBuyerTargetProductGroup[] = [];
    const updateSPProductGroup: IUpdateBuyerTargetProductGroup[] = [];
    const deleteSPProductGroup: IDeleteBuyerTargetProductGroup[] = [];

    // ekhane combined data bananor function call hobe...

    if (!uniqueBuyers) {
      toast.info('You cannot save because, no area found for this section!');
      return false;
    }

    if (selectedProductGroupState) {
      createSPProductGroup = generateCombinedData(
        dayjs(fromMonthYearValue).month() + 1,
        dayjs(fromMonthYearValue).year(),
        dayjs(toMonthYearValue).month() + 1,
        dayjs(toMonthYearValue).year(),
        uniqueBuyers || [],
        selectedProductGroupState
      );
    } else {
      createSPProductGroup = [];
    }

    const dataToSend: IProcessBuyerTargetProductGroup = {
      createTarget_BuyerProductGroupCommand: createSPProductGroup,
      updateTarget_BuyerProductGroupCommand: updateSPProductGroup,
      deleteTarget_BuyerProductGroupCommand: deleteSPProductGroup,
      operationName: 'Area',
      fromMonth: dayjs(fromMonthYearValue).month() + 1 || null,
      toMonth: dayjs(toMonthYearValue).month() + 1 || null,
      fromYear: dayjs(fromMonthYearValue).year() || null,
      toYear: dayjs(toMonthYearValue).year() || null,
      regionMasterId: regionMasterId || null,
      regionId: regionId || null,
      divisionId: divisionId || null,
      districtId: districtId || null,
      areaId: areaId || null,
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processTargetBuyerProductGroup(dataToSend);
  };
  const handleQuickEntryAnySectionModalClose = () => {
    dispatch(
      changeQuickEntryAnySectionModalInfoForBuyer({
        regionMasterId: 0,
        regionMasterName: '',
        regionId: 0,
        regionName: '',
        divisionId: 0,
        divisionName: '',
        districtId: 0,
        districtName: '',
        areaId: 0,
        areaName: '',
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
              {regionMasterId ? `Region Master: ${regionMasterName}` : ``}
              {regionId ? `Region: ${regionName}` : ``}
              {divisionId ? `Division: ${divisionName}` : ``}
              {districtId ? `District: ${districtName}` : ``}
              {areaId ? `Area: ${areaName}` : ``}
            </div>
            <DualListSelectorTarget
              items={mergedAllOptionsDuelSelectList(productGroupOptions) || []}
              selectedItems={selectedProductGroupState || []}
              setSelectedItems={setSelectedProductGroupState}
              prevMonthItems={prevMonthUniqueProductGroups || []}
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
                processTargetBuyerProductGroupIsLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => {
                if (!processTargetBuyerProductGroupIsLoading) {
                  checkedListSave();
                }
              }}
            >
              {processTargetBuyerProductGroupIsLoading ? (
                <CircularProgress size={12} color="inherit" />
              ) : (
                ''
              )}
              {processTargetBuyerProductGroupIsLoading
                ? ' Please Wait...'
                : 'Save'}
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
