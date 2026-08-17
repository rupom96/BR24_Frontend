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
  ITeamTargetSPProductGroup,
  IUpdateTeamTargetSPProductGroup,
} from '../../../../../domain/interfaces/TeamAndTarget';
import {
  useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery,
  useProcessSaveSPProductGroupMutation,
} from '../../../../../infrastructure/api/TargetSPProductGroupApiSlice';

interface QuickEntryProductGroupByEmployeeProps {
  teamId: number;
  month: number;
  year: number;
  employeeId: number;
  employeeName: string;
  modalState: boolean; // Boolean state for modal visibility
  modalCloseFunct: () => void; // Function with no return value
}

const QuickEntryProductGroupByEmployee: React.FC<
  QuickEntryProductGroupByEmployeeProps
> = ({
  teamId,
  month,
  year,
  employeeId,
  employeeName,
  modalState,
  modalCloseFunct,
}) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const [selectedProductGroupState, setSelectedProductGroupState] = useState<
    ITeamTargetSPProductGroup[]
  >([]);

  const [selectedProductGroupStatePrev, setSelectedProductGroupStatePrev] =
    useState<ITeamTargetSPProductGroup[]>([]);

  const [deletedProductGroupState, setDeletedProductGroupState] = useState<
    IDeleteTeamTargetSPProductGroup[]
  >([]);
  const {
    data: targetSPRows,
    isLoading: targetSPRowsLoading,
    error: targetSPRowsError,
    isSuccess: targetSPRowsIsSuccess,
    isError: targetSPRowsIsError,
    isFetching: targetSPRowsIsFetching,
    refetch: targetSPRowsRefetch,
  } = useGetTargetSPProductGroupByTeamMonthYearSalesPersonIdQuery({
    teamId,
    month,
    year,
    salesPersonId: employeeId || 0,
    productGroupId: 0,
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
      const tempProductGroups = targetSPRows
        ? JSON.parse(JSON.stringify(targetSPRows))
        : [];
      const tempProductGroupsCopy = targetSPRows
        ? JSON.parse(JSON.stringify(targetSPRows))
        : [];
      setSelectedProductGroupState([...tempProductGroups]);
      setSelectedProductGroupStatePrev([...tempProductGroupsCopy]);
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
      const selectedItemsProductGroupRAW: ITeamTargetSPProductGroup[] =
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

  const checkedListSave = () => {
    console.log('checkList employee modal, multiple product groups target');
    console.log(selectedProductGroupState);
    console.log(
      'checkList employee modal, multiple product groups target, DELETED.....'
    );
    console.log(deletedProductGroupState);

    const spProductGroupRowsCurrent: ITeamTargetSPProductGroup[] =
      selectedProductGroupState
        ? JSON.parse(JSON.stringify(selectedProductGroupState))
        : [];
    const spProductGroupRowsPrev: ITeamTargetSPProductGroup[] =
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

    const createSPProductGroup: ICreateTeamTargetSPProductGroup[] = [];
    const updateSPProductGroup: IUpdateTeamTargetSPProductGroup[] = [];
    const deleteSPProductGroup: IDeleteTeamTargetSPProductGroup[] = [
      ...deletedProductGroupState,
    ];

    spProductGroupRowsCurrent.forEach((spProductGroupRow) => {
      if (!spProductGroupRow.targetSPProductGroupId) {
        const tempCreate: ICreateTeamTargetSPProductGroup = {
          targetSPProductGroupId: 0,
          teamId,
          employeeId,
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
          employeeId: spProductGroupRow.employeeId || employeeId,
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
    <div className="m-5">
      <div>Target By {employeeName || ''}</div>
      <DualListSelectorTarget
        items={mergedAllOptionsDuelSelectList(productGroupOptions) || []}
        selectedItems={selectedProductGroupState || []}
        setSelectedItems={setSelectedProductGroupState}
        deletedItems={deletedProductGroupState}
        setDeletedItems={setDeletedProductGroupState}
        primaryKeyToDelete="targetSPProductGroupId"
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
