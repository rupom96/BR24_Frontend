/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DualListSelector from '../../../../components/biz24Components/DualListSelector/DualListSelector';
import {
  IDeletePurchaseReturnDetailSerialCommand,
  IPurchaseReturnDetailSerialInfo,
  IPurchaseReturnDetailInfo,
} from '../../../../../domain/interfaces/PurchaseReturnInterface';
import { useGetProductSerialQuery } from '../../../../../infrastructure/api/CurrentStockApiSlice';

interface PurchaseReturnDetailSerialProps {
  purchaseReturnDetailGrid: IPurchaseReturnDetailInfo[];
  setPurchaseReturnDetailGrid: React.Dispatch<React.SetStateAction<any[]>>;
  deletedPurchaseReturnDetailSerialRows: IDeletePurchaseReturnDetailSerialCommand[];
  setDeletedPurchaseReturnDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  serialEditModalInfo: any;
  handleSerialEditModalClose: () => void;
}

// const PurchaseReturnDetail: React.FC<PurchaseReturnDetailProps> = ({
//   purchaseReturnDetailRows,
//   setPurchaseReturnDetailRows,
//   deletedPurchaseReturnDetailRows,
//   setDeletedPurchaseReturnDetailRows,
//   deletedPurchaseReturnDetailSerialRows,
//   setDeletedPurchaseReturnDetailSerialRows,
//   detailEditModalInfo,
//   setDetailEditModalInfo,
// }) => {

// <PurchaseReturnDetailSerial
//     serialEditModalInfo={serialEditModalInfo}
//     purchaseReturnDetailGrid={purchaseReturnDetailGrid}
//     setPurchaseReturnDetailGrid={setPurchaseReturnDetailGrid}
//     deletedPurchaseReturnDetailSerialRows={deletedPurchaseReturnDetailSerialRows}
//     setDeletedPurchaseReturnDetailSerialRows={setDeletedPurchaseReturnDetailSerialRows}
//   />

const PurchaseReturnDetailSerial: React.FC<PurchaseReturnDetailSerialProps> = ({
  serialEditModalInfo,
  purchaseReturnDetailGrid,
  setPurchaseReturnDetailGrid,
  deletedPurchaseReturnDetailSerialRows,
  setDeletedPurchaseReturnDetailSerialRows,
  handleSerialEditModalClose,
}) => {
  //   alert('Hello');
  //   console.log('Hello');
  console.log(serialEditModalInfo);
  console.log(
    serialEditModalInfo?.purchaseReturnDetailRow
      ?.purchaseReturnDetailSerialInfoDto
  );

  const propSerials = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.purchaseReturnDetailRow
        ?.purchaseReturnDetailSerialInfoDto || []
    )
  );
  const propSerials2 = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.purchaseReturnDetailRow
        ?.purchaseReturnDetailSerialInfoDto || []
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
    productId: serialEditModalInfo?.purchaseReturnDetailRow?.productId || 0,
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
      const selectedSerialsRAW: IPurchaseReturnDetailSerialInfo[] =
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

  const savePurchaseReturnDetailSerial = () => {
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
    // stroing deletedItems in deletedPurchaseReturnDetailSerial properly
    const deletedSerialsArray: IDeletePurchaseReturnDetailSerialCommand[] = [
      ...deletedPurchaseReturnDetailSerialRows,
    ];
    for (let i = 0; i < deletedSerials.length; i++) {
      const temopDeltedObj: IDeletePurchaseReturnDetailSerialCommand = {
        purchaseReturnDetailSerialId:
          deletedSerials[i].purchaseReturnDetailSerialId,
        purchaseReturnId:
          serialEditModalInfo?.purchaseReturnDetailRow?.purchaseReturnId ||
          null,
      };
      deletedSerialsArray.push(temopDeltedObj);
    }
    const deletedSerialsArrayUnique = [...new Set(deletedSerialsArray)];
    setDeletedPurchaseReturnDetailSerialRows([...deletedSerialsArrayUnique]);

    /// /storing serials properly in purchaseReturnDetail

    const selectedSerialArray: IPurchaseReturnDetailSerialInfo[] = [];

    for (let i = 0; i < selectedSerials.length; i++) {
      const tempPurchaseReturnDetailSerialObj: IPurchaseReturnDetailSerialInfo =
        {
          purchaseReturnId:
            serialEditModalInfo?.purchaseReturnDetailRow?.purchaseReturnId ||
            null,
          purchaseReturnDetailId:
            serialEditModalInfo?.purchaseReturnDetailRow
              ?.purchaseReturnDetailId || null,
          purchaseReturnDetailSerialId:
            selectedSerials[i].purchaseReturnDetailSerialId || null,
          productId: serialEditModalInfo?.purchaseReturnDetailRow?.productId,
          productName:
            serialEditModalInfo?.purchaseReturnDetailRow?.productName,
          serialNo: selectedSerials[i].serialNo,
        };
      selectedSerialArray.push(tempPurchaseReturnDetailSerialObj);
    }

    console.log(
      'afterSelection, storing proper purchaseReturnDetailSerial rows'
    );
    console.log(selectedSerialArray);

    const tempPurchaseReturnDetailGrid: IPurchaseReturnDetailInfo[] =
      JSON.parse(JSON.stringify([...purchaseReturnDetailGrid]));
    tempPurchaseReturnDetailGrid[
      serialEditModalInfo?.purchaseReturnDetailIndex
    ].purchaseReturnDetailSerialInfoDto = JSON.parse(
      JSON.stringify([...selectedSerialArray])
    );
    tempPurchaseReturnDetailGrid[
      serialEditModalInfo?.purchaseReturnDetailIndex
    ].quantity = selectedSerialArray.length;
    setPurchaseReturnDetailGrid([...tempPurchaseReturnDetailGrid]);
    console.log('purchaseReturnDetailGrid');

    console.log(purchaseReturnDetailGrid);
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
        primaryKeyToDelete="purchaseReturnDetailSerialId"
        parentPrimaryKey="purchaseReturnDetailId"
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
          savePurchaseReturnDetailSerial();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default PurchaseReturnDetailSerial;
