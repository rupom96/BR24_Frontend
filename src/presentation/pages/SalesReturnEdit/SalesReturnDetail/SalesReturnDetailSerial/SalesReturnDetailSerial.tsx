/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DualListSelector from '../../../../components/biz24Components/DualListSelector/DualListSelector';
import {
  IDeleteSalesReturnDetailSerialCommand,
  ISalesReturnDetailSerialInfo,
  ISalesReturnDetailInfo,
} from '../../../../../domain/interfaces/SalesReturnInterface';
import { useGetProductSerialQuery } from '../../../../../infrastructure/api/CurrentStockApiSlice';

interface SalesReturnDetailSerialProps {
  salesReturnDetailGrid: ISalesReturnDetailInfo[];
  setSalesReturnDetailGrid: React.Dispatch<React.SetStateAction<any[]>>;
  deletedSalesReturnDetailSerialRows: IDeleteSalesReturnDetailSerialCommand[];
  setDeletedSalesReturnDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  serialEditModalInfo: any;
  handleSerialEditModalClose: () => void;
}

// const SalesReturnDetail: React.FC<SalesReturnDetailProps> = ({
//   salesReturnDetailRows,
//   setSalesReturnDetailRows,
//   deletedSalesReturnDetailRows,
//   setDeletedSalesReturnDetailRows,
//   deletedSalesReturnDetailSerialRows,
//   setDeletedSalesReturnDetailSerialRows,
//   detailEditModalInfo,
//   setDetailEditModalInfo,
// }) => {

// <SalesReturnDetailSerial
//     serialEditModalInfo={serialEditModalInfo}
//     salesReturnDetailGrid={salesReturnDetailGrid}
//     setSalesReturnDetailGrid={setSalesReturnDetailGrid}
//     deletedSalesReturnDetailSerialRows={deletedSalesReturnDetailSerialRows}
//     setDeletedSalesReturnDetailSerialRows={setDeletedSalesReturnDetailSerialRows}
//   />

const SalesReturnDetailSerial: React.FC<SalesReturnDetailSerialProps> = ({
  serialEditModalInfo,
  salesReturnDetailGrid,
  setSalesReturnDetailGrid,
  deletedSalesReturnDetailSerialRows,
  setDeletedSalesReturnDetailSerialRows,
  handleSerialEditModalClose,
}) => {
  //   alert('Hello');
  //   console.log('Hello');
  console.log(serialEditModalInfo);
  console.log(
    serialEditModalInfo?.salesReturnDetailRow?.salesReturnDetailSerialInfoDto
  );

  const propSerials = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.salesReturnDetailRow
        ?.salesReturnDetailSerialInfoDto || []
    )
  );
  const propSerials2 = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.salesReturnDetailRow
        ?.salesReturnDetailSerialInfoDto || []
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
    productId: serialEditModalInfo?.salesReturnDetailRow?.productId || 0,
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
      const selectedSerialsRAW: ISalesReturnDetailSerialInfo[] =
        selectedSerialsPrev
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

  const saveSalesReturnDetailSerial = () => {
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
    // stroing deletedItems in deletedSalesReturnDetailSerial properly
    const deletedSerialsArray: IDeleteSalesReturnDetailSerialCommand[] = [
      ...deletedSalesReturnDetailSerialRows,
    ];
    for (let i = 0; i < deletedSerials.length; i++) {
      const temopDeltedObj: IDeleteSalesReturnDetailSerialCommand = {
        salesReturnDetailSerialId: deletedSerials[i].salesReturnDetailSerialId,
        salesReturnId:
          serialEditModalInfo?.salesReturnDetailRow?.salesReturnId || null,
      };
      deletedSerialsArray.push(temopDeltedObj);
    }
    const deletedSerialsArrayUnique = [...new Set(deletedSerialsArray)];
    setDeletedSalesReturnDetailSerialRows([...deletedSerialsArrayUnique]);

    /// /storing serials properly in salesReturnDetail

    const selectedSerialArray: ISalesReturnDetailSerialInfo[] = [];

    for (let i = 0; i < selectedSerials.length; i++) {
      const tempSalesReturnDetailSerialObj: ISalesReturnDetailSerialInfo = {
        salesReturnId:
          serialEditModalInfo?.salesReturnDetailRow?.salesReturnId || null,
        salesReturnDetailId:
          serialEditModalInfo?.salesReturnDetailRow?.salesReturnDetailId ||
          null,
        salesReturnDetailSerialId:
          selectedSerials[i].salesReturnDetailSerialId || null,
        productId: serialEditModalInfo?.salesReturnDetailRow?.productId,
        productName: serialEditModalInfo?.salesReturnDetailRow?.productName,
        serialNo: selectedSerials[i].serialNo,
      };
      selectedSerialArray.push(tempSalesReturnDetailSerialObj);
    }

    console.log('afterSelection, storing proper salesReturnDetailSerial rows');
    console.log(selectedSerialArray);

    const tempSalesReturnDetailGrid: ISalesReturnDetailInfo[] = JSON.parse(
      JSON.stringify([...salesReturnDetailGrid])
    );
    tempSalesReturnDetailGrid[
      serialEditModalInfo?.salesReturnDetailIndex
    ].salesReturnDetailSerialInfoDto = JSON.parse(
      JSON.stringify([...selectedSerialArray])
    );
    tempSalesReturnDetailGrid[
      serialEditModalInfo?.salesReturnDetailIndex
    ].quantity = selectedSerialArray.length;
    setSalesReturnDetailGrid([...tempSalesReturnDetailGrid]);
    console.log('salesReturnDetailGrid');

    console.log(salesReturnDetailGrid);
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
        primaryKeyToDelete="salesReturnDetailSerialId"
        parentPrimaryKey="salesReturnDetailId"
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
          saveSalesReturnDetailSerial();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default SalesReturnDetailSerial;
