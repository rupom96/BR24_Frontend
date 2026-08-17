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
  IEmployee,
  IProcessTeamTargetSPProductGroup,
  IProductGroupFromSPTarget,
  ITeamTargetSPProductGroup,
  IUpdateTeamTargetSPProductGroup,
} from '../../../../../domain/interfaces/TeamAndTarget';
import {
  useGetDistrictSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearProductGroupIdQuery,
  useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useProcessSaveSPProductGroupMutation,
} from '../../../../../infrastructure/api/TargetSPProductGroupApiSlice';
import { useGetTeamMemberByTeamIdQuery } from '../../../../../infrastructure/api/TeamAndTeamDetailApiSlice';
import {
  useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery,
  useGetTargetSPEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery,
} from '../../../../../infrastructure/api/EmployeeApiSlice';
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
  productGroupId: number;
  productGroupName: string;
  modalState: boolean; // Boolean state for modal visibility
  modalCloseFunct: () => void; // Function with no return value
}

const QuickEntryEmployeeByProductGroup: React.FC<
  QuickEntryProductGroupByEmployeeProps
> = ({
  districtId,
  fromMonth,
  fromYear,
  toMonth,
  toYear,
  productGroupId,
  productGroupName,
  modalState,
  modalCloseFunct,
}) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );
  const dispatch = useAppDispatch();

  const [selectedEmployeeState, setSelectedEmployeeState] = useState<
    IEmployee[]
  >([]);

  const [selectedEmployeeStatePrev, setSelectedEmployeeStatePrev] = useState<
    IEmployee[]
  >([]);

  // const [deletedEmployeeState, setDeletedEmployeeState] = useState<
  //   IDeleteTeamTargetSPProductGroup[]
  // >([]);
  // const {
  //   data: targetSPRows,
  //   isLoading: targetSPRowsLoading,
  //   error: targetSPRowsError,
  //   isSuccess: targetSPRowsIsSuccess,
  //   isError: targetSPRowsIsError,
  //   isFetching: targetSPRowsIsFetching,
  //   refetch: targetSPRowsRefetch,
  // } = useGetDistrictSPProductGroupByTeamMonthYearProductGroupIdQuery({
  //   districtId,
  //   fromMonth,
  //   fromYear,
  //   toMonth,
  //   toYear,
  //   salesPersonId: 0,
  //   productGroupId: productGroupId || 0,
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
  //     const tempEmployees = targetSPRows
  //       ? JSON.parse(JSON.stringify(targetSPRows))
  //       : [];
  //     const tempEmployeesCopy = targetSPRows
  //       ? JSON.parse(JSON.stringify(targetSPRows))
  //       : [];
  //     setSelectedEmployeeState([...tempEmployees]);
  //     setSelectedEmployeeStatePrev([...tempEmployeesCopy]);
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
    data: targetSPRows,
    isLoading: targetSPRowsLoading,
    error: targetSPRowsError,
    isSuccess: targetSPRowsIsSuccess,
    isError: targetSPRowsIsError,
    isFetching: targetSPRowsIsFetching,
    refetch: targetSPRowsRefetch,
  } = useGetTargetSPEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery({
    companyId: userInfo?.companyId,
    regionMasterId: 0,
    regionId: 0,
    divisionId: 0,
    districtId,
    productGroupId,
    fromMonth: dayjs(fromMonthYearValue).month() + 1,
    toMonth: dayjs(toMonthYearValue).month() + 1,
    fromYear: dayjs(fromMonthYearValue).year(),
    toYear: dayjs(toMonthYearValue).year(),
  });

  useEffect(() => {
    if (targetSPRowsError) {
      toast.error(
        'Something wrong from backend while fetching targetSPRows, see console!'
      );
      console.log(
        'Something wrong from backend while fetching targetSPRows, see console--->:'
      );
      console.log(targetSPRows);
    }
    if (targetSPRowsIsSuccess) {
      console.log('targetSPRowsIsSuccess');
      console.log(targetSPRows);
      const tempEmployees = targetSPRows
        ? JSON.parse(JSON.stringify(targetSPRows))
        : [];
      const tempEmployeesCopy = targetSPRows
        ? JSON.parse(JSON.stringify(targetSPRows))
        : [];
      setSelectedEmployeeState([...tempEmployees]);
      setSelectedEmployeeStatePrev([...tempEmployeesCopy]);
    }
  }, [
    targetSPRows,
    targetSPRowsLoading,
    targetSPRowsError,
    targetSPRowsIsSuccess,
    targetSPRowsIsError,
    targetSPRowsIsFetching,
  ]);

  //   ......................................................................

  const {
    data: employeeOptions,
    isLoading: employeeOptionsLoading,
    error: employeeOptionsError,
    isSuccess: employeeOptionsIsSuccess,
    isError: employeeOptionsIsError,
    isFetching: employeeOptionsIsFetching,
    refetch: employeeOptionsRefetch,
  } = useGetEmployeeByCompanyRegionMasterRegionDivisionDistrictIdQuery({
    companyId: userInfo?.companyId,
    regionMasterId: 0,
    regionId: 0,
    divisionId: 0,
    districtId,
  });

  useEffect(() => {
    if (employeeOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching employeeOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching employeeOptions, see console--->:'
      );
      console.log(employeeOptionsError);
    }
    if (employeeOptionsIsSuccess) {
      console.log('employeeOptionsIsSuccess');
      console.log(employeeOptions);
    }
  }, [
    employeeOptionsLoading,
    employeeOptionsError,
    employeeOptionsIsSuccess,
    employeeOptionsIsError,
    employeeOptionsIsFetching,
    employeeOptions,
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
      const selectedItemsEmployeesRAW: IEmployee[] = selectedEmployeeStatePrev
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

  // function generateCombinedData(
  //   fromMonthValue: number,
  //   fromYearValue: number,
  //   toMonthValue: number,
  //   toYearValue: number,
  //   areas: IEmployee[],
  //   productGroups: IProductGroupFromSPTarget[]
  // ) {
  //   const result: ICreateTeamTargetSPProductGroup[] = [];

  //   // Helper function to generate a range of months and years
  //   function generateMonthYearRange(
  //     fromMonthVal: number,
  //     fromYearVal: number,
  //     toMonthVal: number,
  //     toYearVal: number
  //   ) {
  //     const range = [];
  //     let currentMonth = fromMonthVal;
  //     let currentYear = fromYearVal;

  //     while (
  //       currentYear < toYearVal ||
  //       (currentYear === toYearVal && currentMonth <= toMonthVal)
  //     ) {
  //       range.push({ month: currentMonth, year: currentYear });
  //       currentMonth++;
  //       if (currentMonth > 12) {
  //         currentMonth = 1;
  //         currentYear++;
  //       }
  //     }
  //     return range;
  //   }

  //   // Generate month-year range
  //   const monthYearRange = generateMonthYearRange(
  //     fromMonthValue,
  //     fromYearValue,
  //     toMonthValue,
  //     toYearValue
  //   );

  //   // Calculate the total rows for each product group
  //   const totalRows = productGroups.reduce(
  //     (acc: Record<number, number>, group) => {
  //       acc[group.productGroupId] = areas.length * monthYearRange.length;
  //       return acc;
  //     },
  //     {}
  //   );

  //   // Generate combined data
  //   productGroups.forEach((group) => {
  //     const amountPerRow = group.target / totalRows[group.productGroupId];

  //     areas.forEach((area) => {
  //       monthYearRange.forEach(({ month, year }) => {
  //         result.push({
  //           targetSPProductGroupId: 0,
  //           productGroupId: group.productGroupId,
  //           areaId: area.areaId,
  //           employeeId: area.employeeId || 0, // Projected as employeeId
  //           amount: amountPerRow,
  //           month,
  //           year,
  //           dateOfEntry: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
  //           companyId: userInfo?.companyId,
  //           entryBy: userInfo?.securityUserId,
  //         });
  //       });
  //     });
  //   });

  //   return result;
  // }

  // const checkedListSave = () => {
  //   console.log('checkList productGroup modal, multiple product groups target');
  //   console.log(selectedEmployeeState);
  //   console.log(
  //     'checkList productGroup modal, multiple product groups target, DELETED.....'
  //   );
  //   console.log(deletedEmployeeState);

  //   const spProductGroupRowsCurrent: ITeamTargetSPProductGroup[] =
  //     selectedEmployeeState
  //       ? JSON.parse(JSON.stringify(selectedEmployeeState))
  //       : [];
  //   const spProductGroupRowsPrev: ITeamTargetSPProductGroup[] =
  //     selectedEmployeeStatePrev
  //       ? JSON.parse(JSON.stringify(selectedEmployeeStatePrev))
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
  //   const deleteSPProductGroup: IDeleteTeamTargetSPProductGroup[] = [];

  //   spProductGroupRowsCurrent.forEach((spProductGroupRow) => {
  //     if (!spProductGroupRow.targetSPProductGroupId) {
  //       const tempCreate: ICreateTeamTargetSPProductGroup = {
  //         targetSPProductGroupId: 0,
  //         areaId: spProductGroupRow.areaId || null,
  //         employeeId: spProductGroupRow.employeeId || 0,
  //         productGroupId,
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
  //         employeeId: spProductGroupRow.employeeId || 0,
  //         productGroupId: spProductGroupRow.productGroupId || productGroupId,
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

  function generateCombinedData(
    fromMonthValue: number,
    fromYearValue: number,
    toMonthValue: number,
    toYearValue: number,
    areas: IEmployee[],
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
      const range: { month: number; year: number }[] = [];
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

    // Define the type for `totalRows` explicitly
    const totalRows: Record<number, number> = areas.reduce(
      (acc: Record<number, number>, area) => {
        acc[area.employeeId] = monthYearRange.length; // Each employee gets rows for every month-year combination
        return acc;
      },
      {}
    );

    // Generate combined data
    productGroups.forEach((group) => {
      areas.forEach((area) => {
        const amountPerRow = area.target || 0 / totalRows[area.employeeId];

        monthYearRange.forEach(({ month, year }) => {
          result.push({
            targetSPProductGroupId: 0,
            productGroupId: group.productGroupId,
            areaId: area.areaId || 0,
            employeeId: area.employeeId, // Calculations based on employeeId
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

  const checkedListSave = () => {
    console.log('checkList employee modal, multiple product groups target');
    console.log(selectedEmployeeState);
    // console.log(
    //   'checkList employee modal, multiple product groups target, DELETED.....'
    // );
    // console.log(deletedProductGroupState);

    const spProductGroupRowsCurrent: IProductGroupFromSPTarget[] =
      selectedEmployeeState
        ? JSON.parse(JSON.stringify(selectedEmployeeState))
        : [];
    const spProductGroupRowsPrev: IProductGroupFromSPTarget[] =
      selectedEmployeeState
        ? JSON.parse(JSON.stringify(selectedEmployeeStatePrev))
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

    const productGroupArr: IProductGroupFromSPTarget[] = [
      {
        productGroupId,
        productGroupName,
        target: 0,
      },
    ];

    if (selectedEmployeeState) {
      createSPProductGroup = generateCombinedData(
        dayjs(fromMonthYearValue).month() + 1,
        dayjs(fromMonthYearValue).year(),
        dayjs(toMonthYearValue).month() + 1,
        dayjs(toMonthYearValue).year(),
        selectedEmployeeState || [],
        productGroupArr || []
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
      salesPersonId: null,
      productGroupId: productGroupId || null,
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processSaveSPProductGroup(dataToSend);
  };

  return (
    <div className="m-5">
      <div>Target By {productGroupName || ''}</div>
      <DualListSelectorTarget
        // items={mergedAllOptionsDuelSelectList(employeeOptions || []) || []}
        items={mergedAllOptionsDuelSelectList(employeeOptions) || []}
        selectedItems={selectedEmployeeState || []}
        setSelectedItems={setSelectedEmployeeState}
        // deletedItems={deletedEmployeeState}
        // setDeletedItems={setDeletedEmployeeState}
        // primaryKeyToDelete="targetSPProductGroupId"
        idKey="employeeId"
        optionName="employeeName"
        targetProperty="target"
        caption="Members"
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

export default QuickEntryEmployeeByProductGroup;
