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
import {
  useGetBuyerByCompanyMonthYearRegionMasterRegionDivisionDistrictAreaIdQuery,
  useGetPrevMonthTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery,
  useGetTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery,
} from '../../../../../infrastructure/api/BuyerApiSlice';
import { IBuyer } from '../../../../../domain/interfaces/BuyerInterface';
import {
  ICreateBuyerTargetProductGroup,
  IDeleteBuyerTargetProductGroup,
  IProcessBuyerTargetProductGroup,
  IUpdateBuyerTargetProductGroup,
} from '../../../../../domain/interfaces/BuyerAndTarget';
import { useProcessTargetBuyerProductGroupMutation } from '../../../../../infrastructure/api/TargetBuyerProductGroupApiSlice';

interface QuickEntryProductGroupByBuyerProps {
  areaId: number;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
  productGroupId: number;
  productGroupName: string;
  modalState: boolean; // Boolean state for modal visibility
  modalCloseFunct: () => void; // Function with no return value
}

const QuickEntryBuyerByProductGroup: React.FC<
  QuickEntryProductGroupByBuyerProps
> = ({
  areaId,
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

  const [selectedBuyerState, setSelectedBuyerState] = useState<IBuyer[]>([]);

  const [selectedBuyerStatePrev, setSelectedBuyerStatePrev] = useState<
    IBuyer[]
  >([]);

  // const [deletedEmployeeState, setDeletedEmployeeState] = useState<
  //   IDeleteTeamTargetSPProductGroup[]
  // >([]);
  // const {
  //   data: targetBuyerProductGroupRows,
  //   isLoading: targetBuyerProductGroupRowsLoading,
  //   error: targetBuyerProductGroupRowsError,
  //   isSuccess: targetBuyerProductGroupRowsIsSuccess,
  //   isError: targetBuyerProductGroupRowsIsError,
  //   isFetching: targetBuyerProductGroupRowsIsFetching,
  //   refetch: targetBuyerProductGroupRowsRefetch,
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
  //   if (targetBuyerProductGroupRowsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching targetBuyerProductGroupRows, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching targetBuyerProductGroupRows, see console--->:'
  //     );
  //     console.log(targetBuyerProductGroupRows);
  //   }
  //   if (targetBuyerProductGroupRowsIsSuccess) {
  //     console.log('targetBuyerProductGroupRowsIsSuccess');
  //     console.log(targetBuyerProductGroupRows);
  //     const tempEmployees = targetBuyerProductGroupRows
  //       ? JSON.parse(JSON.stringify(targetBuyerProductGroupRows))
  //       : [];
  //     const tempEmployeesCopy = targetBuyerProductGroupRows
  //       ? JSON.parse(JSON.stringify(targetBuyerProductGroupRows))
  //       : [];
  //     setSelectedBuyerState([...tempEmployees]);
  //     setSelectedBuyerStatePrev([...tempEmployeesCopy]);
  //   }
  // }, [
  //   targetBuyerProductGroupRows,
  //   targetBuyerProductGroupRowsLoading,
  //   targetBuyerProductGroupRowsError,
  //   targetBuyerProductGroupRowsIsSuccess,
  //   targetBuyerProductGroupRowsIsError,
  //   targetBuyerProductGroupRowsIsFetching,
  // ]);

  const {
    data: targetBuyerProductGroupRows,
    isLoading: targetBuyerProductGroupRowsLoading,
    error: targetBuyerProductGroupRowsError,
    isSuccess: targetBuyerProductGroupRowsIsSuccess,
    isError: targetBuyerProductGroupRowsIsError,
    isFetching: targetBuyerProductGroupRowsIsFetching,
    refetch: targetBuyerProductGroupRowsRefetch,
  } = useGetTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery({
    companyId: userInfo?.companyId,
    regionMasterId: 0,
    regionId: 0,
    divisionId: 0,
    districtId: 0,
    areaId,
    productGroupId,
    fromMonth: dayjs(fromMonthYearValue).month() + 1,
    toMonth: dayjs(toMonthYearValue).month() + 1,
    fromYear: dayjs(fromMonthYearValue).year(),
    toYear: dayjs(toMonthYearValue).year(),
  });

  useEffect(() => {
    if (targetBuyerProductGroupRowsError) {
      toast.error(
        'Something wrong from backend while fetching targetBuyerProductGroupRows, see console!'
      );
      console.log(
        'Something wrong from backend while fetching targetBuyerProductGroupRows, see console--->:'
      );
      console.log(targetBuyerProductGroupRows);
    }
    if (targetBuyerProductGroupRowsIsSuccess) {
      console.log('targetBuyerProductGroupRowsIsSuccess');
      console.log(targetBuyerProductGroupRows);
      const tempEmployees = targetBuyerProductGroupRows
        ? JSON.parse(JSON.stringify(targetBuyerProductGroupRows))
        : [];
      const tempEmployeesCopy = targetBuyerProductGroupRows
        ? JSON.parse(JSON.stringify(targetBuyerProductGroupRows))
        : [];
      setSelectedBuyerState([...tempEmployees]);
      setSelectedBuyerStatePrev([...tempEmployeesCopy]);
    }
  }, [
    targetBuyerProductGroupRows,
    targetBuyerProductGroupRowsLoading,
    targetBuyerProductGroupRowsError,
    targetBuyerProductGroupRowsIsSuccess,
    targetBuyerProductGroupRowsIsError,
    targetBuyerProductGroupRowsIsFetching,
  ]);

  //   ......................................................................

  // ------ Same api call in a new way to get prevMonths target-------
  const prevFromMonthYearValue = dayjs(fromMonthYearValue).subtract(1, 'month');
  const prevToMonthYearValue = dayjs(fromMonthYearValue).subtract(1, 'month');
  const {
    data: prevMonthTargetBuyerProductGroupRows,
    isLoading: prevMonthTargetBuyerProductGroupRowsLoading,
    error: prevMonthTargetBuyerProductGroupRowsError,
    isSuccess: prevMonthTargetBuyerProductGroupRowsIsSuccess,
    isError: prevMonthTargetBuyerProductGroupRowsIsError,
    isFetching: prevMonthTargetBuyerProductGroupRowsIsFetching,
    refetch: prevMonthTargetBuyerProductGroupRowsRefetch,
  } = useGetPrevMonthTargetBuyerByCompanyRegionMasterRegionDivisionDistrictAreaIdQuery(
    {
      companyId: userInfo?.companyId,
      regionMasterId: 0,
      regionId: 0,
      divisionId: 0,
      districtId: 0,
      areaId,
      productGroupId,
      fromMonth: dayjs(prevFromMonthYearValue).month() + 1,
      toMonth: dayjs(prevToMonthYearValue).month() + 1,
      fromYear: dayjs(prevFromMonthYearValue).year(),
      toYear: dayjs(prevToMonthYearValue).year(),
    }
  );

  useEffect(() => {
    if (prevMonthTargetBuyerProductGroupRowsError) {
      toast.error(
        'Something wrong from backend while fetching prevMonthTargetBuyerProductGroupRows, see console!'
      );
      console.log(
        'Something wrong from backend while fetching prevMonthTargetBuyerProductGroupRows, see console--->:'
      );
      console.log(prevMonthTargetBuyerProductGroupRows);
    }
    if (prevMonthTargetBuyerProductGroupRowsIsSuccess) {
      console.log('prevMonthTargetBuyerProductGroupRowsIsSuccess');
      console.log(prevMonthTargetBuyerProductGroupRows);
      // const tempEmployees = prevMonthTargetBuyerProductGroupRows
      //   ? JSON.parse(JSON.stringify(prevMonthTargetBuyerProductGroupRows))
      //   : [];
      // const tempEmployeesCopy = prevMonthTargetBuyerProductGroupRows
      //   ? JSON.parse(JSON.stringify(prevMonthTargetBuyerProductGroupRows))
      //   : [];
      // setSelectedBuyerState([...tempEmployees]);
      // setSelectedBuyerStatePrev([...tempEmployeesCopy]);
    }
  }, [
    prevMonthTargetBuyerProductGroupRows,
    prevMonthTargetBuyerProductGroupRowsLoading,
    prevMonthTargetBuyerProductGroupRowsError,
    prevMonthTargetBuyerProductGroupRowsIsSuccess,
    prevMonthTargetBuyerProductGroupRowsIsError,
    prevMonthTargetBuyerProductGroupRowsIsFetching,
  ]);

  // ------ Same api call in a new way to get prevMonths target----END-----

  const {
    data: buyerOptions,
    isLoading: buyerOptionsLoading,
    error: buyerOptionsError,
    isSuccess: buyerOptionsIsSuccess,
    isError: buyerOptionsIsError,
    isFetching: buyerOptionsIsFetching,
    refetch: buyerOptionsRefetch,
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
    if (buyerOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching buyerOptions, see console!'
      );
      console.log(
        'Something wrong from backend while fetching buyerOptions, see console--->:'
      );
      console.log(buyerOptionsError);
    }
    if (buyerOptionsIsSuccess) {
      console.log('buyerOptionsIsSuccess');
      console.log(buyerOptions);
    }
  }, [
    buyerOptionsLoading,
    buyerOptionsError,
    buyerOptionsIsSuccess,
    buyerOptionsIsError,
    buyerOptionsIsFetching,
    buyerOptions,
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
            'check data after successful Save targetBuyerProductGroup, see console---->'
          );
          console.log(processTargetBuyerProductGroupData);
          modalCloseFunct();
          // biznessEventProcessConfigurationInfoRefetch();
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

  const mergedAllOptionsDuelSelectList = (
    rawOptions: any[] | undefined | null
  ) => {
    let mergedOptions: any[] | undefined | null = [];

    if (rawOptions) {
      const selectedItemsEmployeesRAW: IEmployee[] = selectedBuyerStatePrev
        ? JSON.parse(JSON.stringify(selectedBuyerStatePrev))
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
  //   console.log(selectedBuyerState);
  //   console.log(
  //     'checkList productGroup modal, multiple product groups target, DELETED.....'
  //   );
  //   console.log(deletedEmployeeState);

  //   const spProductGroupRowsCurrent: ITeamTargetSPProductGroup[] =
  //     selectedBuyerState
  //       ? JSON.parse(JSON.stringify(selectedBuyerState))
  //       : [];
  //   const spProductGroupRowsPrev: ITeamTargetSPProductGroup[] =
  //     selectedBuyerStatePrev
  //       ? JSON.parse(JSON.stringify(selectedBuyerStatePrev))
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
  //   processTargetBuyerProductGroup(dataToSend);
  // };

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
    const totalRows: Record<number, number> = buyers.reduce(
      (acc: Record<number, number>, buyer) => {
        acc[buyer.buyerId] = monthYearRange.length; // Each employee gets rows for every month-year combination
        return acc;
      },
      {}
    );

    // Generate combined data
    productGroups.forEach((group) => {
      buyers.forEach((buyer) => {
        const amountPerRow = buyer.target || 0 / totalRows[buyer.buyerId];

        monthYearRange.forEach(({ month, year }) => {
          result.push({
            targetBuyerProductGroupId: 0,
            productGroupId: group.productGroupId,
            buyerId: buyer.buyerId, // Calculations based on buyerId
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
    console.log(selectedBuyerState);
    // console.log(
    //   'checkList employee modal, multiple product groups target, DELETED.....'
    // );
    // console.log(deletedProductGroupState);

    const spProductGroupRowsCurrent: IProductGroupFromSPTarget[] =
      selectedBuyerState ? JSON.parse(JSON.stringify(selectedBuyerState)) : [];
    const spProductGroupRowsPrev: IProductGroupFromSPTarget[] =
      selectedBuyerState
        ? JSON.parse(JSON.stringify(selectedBuyerStatePrev))
        : [];

    const hasFalsyTarget = spProductGroupRowsCurrent.some((row) => !row.target);

    if (hasFalsyTarget) {
      toast.info('Target of some Buyer are empty or 0, which is not allowed!');
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

    if (selectedBuyerState) {
      createSPProductGroup = generateCombinedData(
        dayjs(fromMonthYearValue).month() + 1,
        dayjs(fromMonthYearValue).year(),
        dayjs(toMonthYearValue).month() + 1,
        dayjs(toMonthYearValue).year(),
        selectedBuyerState || [],
        productGroupArr || []
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
      regionMasterId: null,
      regionId: null,
      divisionId: null,
      districtId: null,
      areaId,
      buyerId: null,
      productGroupId: productGroupId || null,
    };

    console.log('dataToSend');
    console.log(dataToSend);

    // then send for save, after successful save, close the modal
    processTargetBuyerProductGroup(dataToSend);
  };

  return (
    <div className="m-5">
      <div>Target By {productGroupName || ''}</div>
      <DualListSelectorTarget
        // items={mergedAllOptionsDuelSelectList(buyerOptions || []) || []}
        items={mergedAllOptionsDuelSelectList(buyerOptions) || []}
        selectedItems={selectedBuyerState || []}
        prevMonthItems={prevMonthTargetBuyerProductGroupRows || []}
        setSelectedItems={setSelectedBuyerState}
        // deletedItems={deletedEmployeeState}
        // setDeletedItems={setDeletedEmployeeState}
        // primaryKeyToDelete="targetSPProductGroupId"
        idKey="buyerId"
        optionName="buyerName"
        targetProperty="target"
        caption="Buyers"
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
        {processTargetBuyerProductGroupIsLoading ? ' Please Wait...' : 'Save'}
      </button>
    </div>
  );
};

export default QuickEntryBuyerByProductGroup;
