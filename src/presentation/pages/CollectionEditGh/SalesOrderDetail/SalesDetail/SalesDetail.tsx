/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DualListSelector from '../../../../components/biz24Components/DualListSelector/DualListSelector';
import {
  IDeleteSalesDetailCommand,
  ISalesDetailInfo,
  ISalesOrderDetailInfo,
} from '../../../../../domain/interfaces/SalesOrderInterface';
import { useGetProductSerialQuery } from '../../../../../infrastructure/api/CurrentStockApiSlice';

interface SalesDetailProps {
  salesOrderDetailGrid: ISalesOrderDetailInfo[];
  setSalesOrderDetailGrid: React.Dispatch<React.SetStateAction<any[]>>;
  deletedSalesDetailRows: IDeleteSalesDetailCommand[];
  setDeletedSalesDetailRows: React.Dispatch<React.SetStateAction<any[]>>;
  serialEditModalInfo: any;
  handleSerialEditModalClose: () => void;
}

// const SalesOrderDetail: React.FC<SalesOrderDetailProps> = ({
//   salesOrderDetailRows,
//   setSalesOrderDetailRows,
//   deletedSalesOrderDetailRows,
//   setDeletedSalesOrderDetailRows,
//   deletedSalesDetailRows,
//   setDeletedSalesDetailRows,
//   detailEditModalInfo,
//   setDetailEditModalInfo,
// }) => {

// <SalesDetail
//     serialEditModalInfo={serialEditModalInfo}
//     salesOrderDetailGrid={salesOrderDetailGrid}
//     setSalesOrderDetailGrid={setSalesOrderDetailGrid}
//     deletedSalesDetailRows={deletedSalesDetailRows}
//     setDeletedSalesDetailRows={setDeletedSalesDetailRows}
//   />

const SalesDetail: React.FC<SalesDetailProps> = ({
  serialEditModalInfo,
  salesOrderDetailGrid,
  setSalesOrderDetailGrid,
  deletedSalesDetailRows,
  setDeletedSalesDetailRows,
  handleSerialEditModalClose,
}) => {
  //   alert('Hello');
  //   console.log('Hello');
  console.log(serialEditModalInfo);
  console.log(serialEditModalInfo?.salesOrderDetailRow?.salesDetailInfoDto);

  const propSerials = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.salesOrderDetailRow?.salesDetailInfoDto || []
    )
  );
  const propSerials2 = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.salesOrderDetailRow?.salesDetailInfoDto || []
    )
  );

  const [selectedSerials, setSelectedSerials] = useState([...propSerials]);
  const [selectedSerialsPrev, setSelectedSerialsPrev] = useState([
    ...propSerials2,
  ]);

  const [deletedSerials, setDeletedSerials] = useState<any>([]);

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const {
    data: serialComboOptions,
    isLoading: serialComboOptionsLoading,
    error: serialComboOptionsError,
    isError: serialComboOptionsIsError,
    isFetching: serialComboOptionsIsFetching,
    refetch: serialComboOptionsRefetch,
  } = useGetProductSerialQuery({
    companyId: userInfo?.companyId || 0,
    locationId: userInfo?.locationId || 0,
    productId: serialEditModalInfo?.salesOrderDetailRow?.productId || 0,
  });
  useEffect(() => {
    if (serialComboOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching serialComboOptions for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching serialComboOptions for autocomplete, see console--->:'
      );
      console.log(serialComboOptionsError);
    }
  }, [
    serialComboOptionsLoading,
    serialComboOptionsIsError,
    serialComboOptionsError,
    serialComboOptions,
    serialComboOptionsIsFetching,
  ]);

  // --------------------------------FUNCTIONS---------------------
  const mergedAllOptionsDuelSelectList = (
    rawOptions: any[] | undefined | null
  ) => {
    let mergedOptions: any[] | undefined | null = [];

    if (rawOptions) {
      const selectedSerialsRAW: ISalesDetailInfo[] = selectedSerialsPrev
        ? JSON.parse(JSON.stringify(selectedSerialsPrev))
        : [];
      // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
      mergedOptions = rawOptions.map((rawOptionRow) => {
        const match = selectedSerialsRAW.find(
          (selectedSerialsRAWRow) =>
            selectedSerialsRAWRow.serialNo === rawOptionRow.serialNo
        );
        return match || rawOptionRow;
      });
    } else {
      mergedOptions = rawOptions || [];
    }
    return JSON.parse(JSON.stringify(mergedOptions));
  };

  const saveSalesDetail = () => {
    console.log('selectedSerials');
    console.log(selectedSerials);

    console.log('selectedSerialsPrev');
    console.log(selectedSerialsPrev);

    console.log('deletedSerials');
    console.log(deletedSerials);

    // validation

    if (
      JSON.stringify(selectedSerials) === JSON.stringify(selectedSerialsPrev)
    ) {
      toast.info('No changes to save!');
      return;
    }

    /// //////////////////////////////////////////////////////////////////
    // stroing deletedItems in deletedSalesDetail properly
    const deletedSerialsArray: IDeleteSalesDetailCommand[] = [
      ...deletedSalesDetailRows,
    ];
    for (let i = 0; i < deletedSerials.length; i++) {
      const temopDeltedObj: IDeleteSalesDetailCommand = {
        salesDetailId: deletedSerials[i].salesDetailId,
        salesOrderId:
          serialEditModalInfo?.salesOrderDetailRow?.salesOrderId || null,
      };
      deletedSerialsArray.push(temopDeltedObj);
    }
    const deletedSerialsArrayUnique = [...new Set(deletedSerialsArray)];
    setDeletedSalesDetailRows([...deletedSerialsArrayUnique]);

    /// /storing serials properly in salesOrderDetail

    const selectedSerialArray: ISalesDetailInfo[] = [];

    for (let i = 0; i < selectedSerials.length; i++) {
      const tempSalesDetailObj: ISalesDetailInfo = {
        salesOrderId:
          serialEditModalInfo?.salesOrderDetailRow?.salesOrderId || null,
        salesOrderDetailId:
          serialEditModalInfo?.salesOrderDetailRow?.salesOrderDetailId || null,
        salesDetailId: selectedSerials[i].salesDetailId || null,
        productId: serialEditModalInfo?.salesOrderDetailRow?.productId,
        productName: serialEditModalInfo?.salesOrderDetailRow?.productName,
        serialNo: selectedSerials[i].serialNo,
      };
      selectedSerialArray.push(tempSalesDetailObj);
    }

    console.log('afterSelection, storing proper salesDetail rows');
    console.log(selectedSerialArray);

    const tempSalesOrderDetailGrid: ISalesOrderDetailInfo[] = JSON.parse(
      JSON.stringify([...salesOrderDetailGrid])
    );
    tempSalesOrderDetailGrid[
      serialEditModalInfo?.salesOrderDetailIndex
    ].salesDetailInfoDto = JSON.parse(JSON.stringify([...selectedSerialArray]));
    tempSalesOrderDetailGrid[
      serialEditModalInfo?.salesOrderDetailIndex
    ].quantity = selectedSerialArray.length;
    setSalesOrderDetailGrid([...tempSalesOrderDetailGrid]);
    console.log('salesOrderDetailGrid');

    console.log(salesOrderDetailGrid);
    handleSerialEditModalClose();
  };

  return (
    <div className="m-5">
      <div>
        Select Serials From Product {serialEditModalInfo?.productName || ''}
      </div>
      <DualListSelector
        items={mergedAllOptionsDuelSelectList(serialComboOptions) || []}
        selectedItems={selectedSerials}
        setSelectedItems={setSelectedSerials}
        deletedItems={deletedSerials}
        setDeletedItems={setDeletedSerials}
        primaryKeyToDelete="salesDetailId"
        parentPrimaryKey="salesOrderDetailId"
        idKey="serialNo"
        optionName="serialNo"
        caption="Serial"
      />

      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
        onClick={() => {
          saveSalesDetail();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default SalesDetail;
