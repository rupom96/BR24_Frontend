/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import DualListSelectorTarget from '../DualListSelectorTarget/DualListSelectorTarget';
import { useGetProductGroupByCompanyIdQuery } from '../../../../../infrastructure/api/ProductApiSlice';
import {
  ICreateTeamTargetSPProductGroup,
  IDeleteTeamTargetSPProductGroup,
  IProcessTeamTargetSPProductGroup,
  IProductGroupFromSPTarget,
  ITeamTargetSPProductGroup,
  IUpdateTeamTargetSPProductGroup,
} from '../../../../../domain/interfaces/TeamAndTarget';
import {
  useGetDistrictSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useGetTargetSPProductGroupByMonthYearRegionMasterRegionDivisionDistrictIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useProcessSaveSPProductGroupMutation,
} from '../../../../../infrastructure/api/TargetSPProductGroupApiSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../application/Redux/store/store';
import { IArea } from '../../../../../domain/interfaces/RegionMasterAndTarget';

interface QuickEntryProductGroupByEmployeeProps {
  districtId: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
  employeeId: number;
  areaId: number;
  areaName: string;
  employeeName: string;
  modalState: boolean; // Boolean state for modal visibility
  modalCloseFunct: () => void; // Function with no return value
}

const QuickEntryProductGroupByEmployee: React.FC<
  QuickEntryProductGroupByEmployeeProps
> = ({
  districtId,
  fromMonth,
  fromYear,
  toMonth,
  toYear,
  employeeId,
  employeeName,
  areaId,
  areaName,
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

  const [deletedProductGroupState, setDeletedProductGroupState] = useState<
    IProductGroupFromSPTarget[]
  >([]);

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );
  const dispatch = useAppDispatch();

  // const {
  //   data: targetSPRows,
  //   isLoading: targetSPRowsLoading,
  //   error: targetSPRowsError,
  //   isSuccess: targetSPRowsIsSuccess,
  //   isError: targetSPRowsIsError,
  //   isFetching: targetSPRowsIsFetching,
  //   refetch: targetSPRowsRefetch,
  // } = useGetDistrictSPProductGroupByTeamMonthYearSalesPersonIdQuery({
  //   districtId,
  //   fromMonth,
  //   fromYear,
  //   toMonth,
  //   toYear,
  //   salesPersonId: employeeId || 0,
  //   productGroupId: 0,
  // });

  // useEffect(() => {
  //   if (targetSPRowsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching targetSPRows, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching targetSPRows, see console--->:'
  //     );
  //     console.log(targetSPRows);
  //   }
  //   if (targetSPRowsIsSuccess) {
  //     console.log('targetSPRowsIsSuccess');
  //     console.log(targetSPRows);
  //     const tempProductGroups = targetSPRows
  //       ? JSON.parse(JSON.stringify(targetSPRows))
  //       : [];
  //     const tempProductGroupsCopy = targetSPRows
  //       ? JSON.parse(JSON.stringify(targetSPRows))
  //       : [];
  //     setSelectedProductGroupState([...tempProductGroups]);
  //     setSelectedProductGroupStatePrev([...tempProductGroupsCopy]);
  //   }
  // }, [
  //   targetSPRows,
  //   targetSPRowsLoading,
  //   targetSPRowsError,
  //   targetSPRowsIsSuccess,
  //   targetSPRowsIsError,
  //   targetSPRowsIsFetching,
  // ]);

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
      regionMasterId: 0,
      regionId: 0,
      divisionId: 0,
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
          modalCloseFunct();
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
            quantity: 0,
          });
        });
      });
    });

    return result;
  }

  // const checkedListSave = () => {
  //   console.log('checkList employee modal, multiple product groups target');
  //   console.log(selectedProductGroupState);
  //   console.log(
  //     'checkList employee modal, multiple product groups target, DELETED.....'
  //   );
  //   console.log(deletedProductGroupState);

  //   const spProductGroupRowsCurrent: ITeamTargetSPProductGroup[] =
  //     selectedProductGroupState
  //       ? JSON.parse(JSON.stringify(selectedProductGroupState))
  //       : [];
  //   const spProductGroupRowsPrev: ITeamTargetSPProductGroup[] =
  //     selectedProductGroupStatePrev
  //       ? JSON.parse(JSON.stringify(selectedProductGroupStatePrev))
  //       : [];

  //   if (
  //     JSON.stringify(spProductGroupRowsCurrent) ===
  //     JSON.stringify(spProductGroupRowsPrev)
  //   ) {
  //     toast.info('Nothing to save!');
  //     return false;
  //   }

  //   const createSPProductGroup: ICreateTeamTargetSPProductGroup[] = [];
  //   const updateSPProductGroup: IUpdateTeamTargetSPProductGroup[] = [];
  //   const deleteSPProductGroup: IDeleteTeamTargetSPProductGroup[] = [
  //     ...deletedProductGroupState,
  //   ];

  //   spProductGroupRowsCurrent.forEach((spProductGroupRow) => {
  //     if (!spProductGroupRow.targetSPProductGroupId) {
  //       const tempCreate: ICreateTeamTargetSPProductGroup = {
  //         targetSPProductGroupId: 0,
  //         areaId: spProductGroupRow.areaId || null,
  //         employeeId,
  //         productGroupId: spProductGroupRow.productGroupId || 0,
  //         month: spProductGroupRow.month || 0,
  //         year: spProductGroupRow.year || 0,
  //         amount: spProductGroupRow.target || 0,
  //         dateOfEntry: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
  //         companyId: userInfo?.companyId,
  //         entryBy: userInfo?.securityUserId,
  //       };
  //       createSPProductGroup.push(tempCreate);
  //     } else {
  //       const tempUpdate: IUpdateTeamTargetSPProductGroup = {
  //         targetSPProductGroupId: spProductGroupRow.targetSPProductGroupId,
  //         areaId: spProductGroupRow.areaId || null,
  //         employeeId: spProductGroupRow.employeeId || employeeId,
  //         productGroupId: spProductGroupRow.productGroupId || 0,
  //         month: spProductGroupRow.month || 0,
  //         year: spProductGroupRow.year || 0,
  //         amount: spProductGroupRow.target || 0,
  //         //   dateOfEntry: spProductGroupRow.date,
  //         //   companyId: userInfo?.companyId,
  //         //   entryBy: userInfo?.securityUserId,
  //       };
  //       updateSPProductGroup.push(tempUpdate);
  //     }
  //   });

  //   const dataToSend: IProcessTeamTargetSPProductGroup = {
  //     createTarget_SPProductGroupCommand: createSPProductGroup,
  //     updateTarget_SPProductGroupCommand: updateSPProductGroup,
  //     deleteTarget_SPProductGroupCommand: deleteSPProductGroup,
  //   };

  //   console.log('dataToSend');
  //   console.log(dataToSend);

  //   // then send for save, after successful save, close the modal
  //   processSaveSPProductGroup(dataToSend);
  // };

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

    // if (!uniqueAreas) {
    //   toast.info('You cannot save because, no area found for this section!');
    //   return false;
    // }

    const employeeAndArea: IArea[] = [
      {
        areaId,
        areaName,
        inchargeId: employeeId,
        inchargeName: employeeName,
      },
    ];

    if (selectedProductGroupState) {
      createSPProductGroup = generateCombinedData(
        dayjs(fromMonthYearValue).month() + 1,
        dayjs(fromMonthYearValue).year(),
        dayjs(toMonthYearValue).month() + 1,
        dayjs(toMonthYearValue).year(),
        employeeAndArea || [],
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
      regionMasterId: null,
      regionId: null,
      divisionId: null,
      districtId: districtId || null,
      salesPersonId: employeeId || null,
      productGroupId: null,
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processSaveSPProductGroup(dataToSend);
  };

  return (
    <div className="m-5">
      <div>Target By {employeeName || ''}</div>
      <DualListSelectorTarget
        items={mergedAllOptionsDuelSelectList(productGroupOptions) || []}
        selectedItems={selectedProductGroupState || []}
        setSelectedItems={setSelectedProductGroupState}
        // deletedItems={deletedProductGroupState}
        // setDeletedItems={setDeletedProductGroupState}
        // primaryKeyToDelete="targetSPProductGroupId"
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
  );
};

export default QuickEntryProductGroupByEmployee;
