/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DualListSelector from '../../../../components/biz24Components/DualListSelector/DualListSelector';
import {
  IDeleteLPurchaseInDetailSerialCommand,
  ILPurchaseInDetailSerialInfo,
  ILPurchaseInDetailInfo,
} from '../../../../../domain/interfaces/LPurchaseInInterface';
import { useGetProductSerialQuery } from '../../../../../infrastructure/api/CurrentStockApiSlice';

interface LPurchaseInDetailSerialProps {
  lPurchaseInDetailGrid: ILPurchaseInDetailInfo[];
  setLPurchaseInDetailGrid: React.Dispatch<React.SetStateAction<any[]>>;
  deletedLPurchaseInDetailSerialRows: IDeleteLPurchaseInDetailSerialCommand[];
  setDeletedLPurchaseInDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  serialEditModalInfo: any;
  handleSerialEditModalClose: () => void;
}

// const LPurchaseInDetail: React.FC<LPurchaseInDetailProps> = ({
//   lPurchaseInDetailRows,
//   setLPurchaseInDetailRows,
//   deletedLPurchaseInDetailRows,
//   setDeletedLPurchaseInDetailRows,
//   deletedLPurchaseInDetailSerialRows,
//   setDeletedLPurchaseInDetailSerialRows,
//   detailEditModalInfo,
//   setDetailEditModalInfo,
// }) => {

// <LPurchaseInDetailSerial
//     serialEditModalInfo={serialEditModalInfo}
//     lPurchaseInDetailGrid={lPurchaseInDetailGrid}
//     setLPurchaseInDetailGrid={setLPurchaseInDetailGrid}
//     deletedLPurchaseInDetailSerialRows={deletedLPurchaseInDetailSerialRows}
//     setDeletedLPurchaseInDetailSerialRows={setDeletedLPurchaseInDetailSerialRows}
//   />

const LPurchaseInDetailSerial: React.FC<LPurchaseInDetailSerialProps> = ({
  serialEditModalInfo,
  lPurchaseInDetailGrid,
  setLPurchaseInDetailGrid,
  deletedLPurchaseInDetailSerialRows,
  setDeletedLPurchaseInDetailSerialRows,
  handleSerialEditModalClose,
}) => {
  //   alert('Hello');
  //   console.log('Hello');
  console.log(serialEditModalInfo);
  console.log(
    serialEditModalInfo?.lPurchaseInDetailRow?.lPurchaseInDetailSerialInfoDto
  );

  const propSerials = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.lPurchaseInDetailRow
        ?.lPurchaseInDetailSerialInfoDto || []
    )
  );
  const propSerials2 = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.lPurchaseInDetailRow
        ?.lPurchaseInDetailSerialInfoDto || []
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
    productId: serialEditModalInfo?.lPurchaseInDetailRow?.productId || 0,
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
      const selectedSerialsRAW: ILPurchaseInDetailSerialInfo[] =
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

  const saveLPurchaseInDetailSerial = () => {
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
    // stroing deletedItems in deletedLPurchaseInDetailSerial properly
    const deletedSerialsArray: IDeleteLPurchaseInDetailSerialCommand[] = [
      ...deletedLPurchaseInDetailSerialRows,
    ];
    for (let i = 0; i < deletedSerials.length; i++) {
      const temopDeltedObj: IDeleteLPurchaseInDetailSerialCommand = {
        lPurchaseInDetailSerialId: deletedSerials[i].lPurchaseInDetailSerialId,
        lPurchaseInId:
          serialEditModalInfo?.lPurchaseInDetailRow?.lPurchaseInId || null,
      };
      deletedSerialsArray.push(temopDeltedObj);
    }
    const deletedSerialsArrayUnique = [...new Set(deletedSerialsArray)];
    setDeletedLPurchaseInDetailSerialRows([...deletedSerialsArrayUnique]);

    /// /storing serials properly in lPurchaseInDetail

    const selectedSerialArray: ILPurchaseInDetailSerialInfo[] = [];

    for (let i = 0; i < selectedSerials.length; i++) {
      const tempLPurchaseInDetailSerialObj: ILPurchaseInDetailSerialInfo = {
        lPurchaseInId:
          serialEditModalInfo?.lPurchaseInDetailRow?.lPurchaseInId || null,
        lPurchaseInDetailId:
          serialEditModalInfo?.lPurchaseInDetailRow?.lPurchaseInDetailId ||
          null,
        lPurchaseInDetailSerialId:
          selectedSerials[i].lPurchaseInDetailSerialId || null,
        productId: serialEditModalInfo?.lPurchaseInDetailRow?.productId,
        productName: serialEditModalInfo?.lPurchaseInDetailRow?.productName,
        serialNo: selectedSerials[i].serialNo,
      };
      selectedSerialArray.push(tempLPurchaseInDetailSerialObj);
    }

    console.log('afterSelection, storing proper lPurchaseInDetailSerial rows');
    console.log(selectedSerialArray);

    const tempLPurchaseInDetailGrid: ILPurchaseInDetailInfo[] = JSON.parse(
      JSON.stringify([...lPurchaseInDetailGrid])
    );
    tempLPurchaseInDetailGrid[
      serialEditModalInfo?.lPurchaseInDetailIndex
    ].lPurchaseInDetailSerialInfoDto = JSON.parse(
      JSON.stringify([...selectedSerialArray])
    );
    tempLPurchaseInDetailGrid[
      serialEditModalInfo?.lPurchaseInDetailIndex
    ].quantity = selectedSerialArray.length;
    setLPurchaseInDetailGrid([...tempLPurchaseInDetailGrid]);
    console.log('lPurchaseInDetailGrid');

    console.log(lPurchaseInDetailGrid);
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
        primaryKeyToDelete="lPurchaseInDetailSerialId"
        parentPrimaryKey="lPurchaseInDetailId"
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
          saveLPurchaseInDetailSerial();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default LPurchaseInDetailSerial;
