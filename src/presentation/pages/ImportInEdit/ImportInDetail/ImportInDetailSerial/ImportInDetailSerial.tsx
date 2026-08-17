/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DualListSelector from '../../../../components/biz24Components/DualListSelector/DualListSelector';
import {
  IDeleteImportInDetailSerialCommand,
  IImportInDetailSerialInfo,
  IImportInDetailInfo,
} from '../../../../../domain/interfaces/ImportInInterface';
import { useGetProductSerialQuery } from '../../../../../infrastructure/api/CurrentStockApiSlice';

interface ImportInDetailSerialProps {
  importInDetailGrid: IImportInDetailInfo[];
  setImportInDetailGrid: React.Dispatch<React.SetStateAction<any[]>>;
  deletedImportInDetailSerialRows: IDeleteImportInDetailSerialCommand[];
  setDeletedImportInDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  serialEditModalInfo: any;
  handleSerialEditModalClose: () => void;
}

// const ImportInDetail: React.FC<ImportInDetailProps> = ({
//   importInDetailRows,
//   setImportInDetailRows,
//   deletedImportInDetailRows,
//   setDeletedImportInDetailRows,
//   deletedImportInDetailSerialRows,
//   setDeletedImportInDetailSerialRows,
//   detailEditModalInfo,
//   setDetailEditModalInfo,
// }) => {

// <ImportInDetailSerial
//     serialEditModalInfo={serialEditModalInfo}
//     importInDetailGrid={importInDetailGrid}
//     setImportInDetailGrid={setImportInDetailGrid}
//     deletedImportInDetailSerialRows={deletedImportInDetailSerialRows}
//     setDeletedImportInDetailSerialRows={setDeletedImportInDetailSerialRows}
//   />

const ImportInDetailSerial: React.FC<ImportInDetailSerialProps> = ({
  serialEditModalInfo,
  importInDetailGrid,
  setImportInDetailGrid,
  deletedImportInDetailSerialRows,
  setDeletedImportInDetailSerialRows,
  handleSerialEditModalClose,
}) => {
  //   alert('Hello');
  //   console.log('Hello');
  console.log(serialEditModalInfo);
  console.log(
    serialEditModalInfo?.importInDetailRow?.importInDetailSerialInfoDto
  );

  const propSerials = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.importInDetailRow?.importInDetailSerialInfoDto || []
    )
  );
  const propSerials2 = JSON.parse(
    JSON.stringify(
      serialEditModalInfo?.importInDetailRow?.importInDetailSerialInfoDto || []
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
    productId: serialEditModalInfo?.importInDetailRow?.productId || 0,
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
      const selectedSerialsRAW: IImportInDetailSerialInfo[] =
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

  const saveImportInDetailSerial = () => {
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

    if (selectedSerials.length > serialEditModalInfo?.maxQuantityLimit || 0) {
      toast.info(
        `You cannot select more than ${serialEditModalInfo?.maxQuantityLimit || 0} serials!`
      );
      return;
    }

    /// //////////////////////////////////////////////////////////////////
    // stroing deletedItems in deletedImportInDetailSerial properly
    const deletedSerialsArray: IDeleteImportInDetailSerialCommand[] = [
      ...deletedImportInDetailSerialRows,
    ];
    for (let i = 0; i < deletedSerials.length; i++) {
      const temopDeltedObj: IDeleteImportInDetailSerialCommand = {
        importInDetailSerialId: deletedSerials[i].importInDetailSerialId,
        importInId: serialEditModalInfo?.importInDetailRow?.importInId || null,
      };
      deletedSerialsArray.push(temopDeltedObj);
    }
    const deletedSerialsArrayUnique = [...new Set(deletedSerialsArray)];
    setDeletedImportInDetailSerialRows([...deletedSerialsArrayUnique]);

    /// /storing serials properly in importInDetail

    const selectedSerialArray: IImportInDetailSerialInfo[] = [];

    for (let i = 0; i < selectedSerials.length; i++) {
      const tempImportInDetailSerialObj: IImportInDetailSerialInfo = {
        importInId: serialEditModalInfo?.importInDetailRow?.importInId || null,
        importInDetailId:
          serialEditModalInfo?.importInDetailRow?.importInDetailId || null,
        importInDetailSerialId:
          selectedSerials[i].importInDetailSerialId || null,
        productId: serialEditModalInfo?.importInDetailRow?.productId,
        productName: serialEditModalInfo?.importInDetailRow?.productName,
        serialNo: selectedSerials[i].serialNo,
      };
      selectedSerialArray.push(tempImportInDetailSerialObj);
    }

    console.log('afterSelection, storing proper importInDetailSerial rows');
    console.log(selectedSerialArray);

    const tempImportInDetailGrid: IImportInDetailInfo[] = JSON.parse(
      JSON.stringify([...importInDetailGrid])
    );
    tempImportInDetailGrid[
      serialEditModalInfo?.importInDetailIndex
    ].importInDetailSerialInfoDto = JSON.parse(
      JSON.stringify([...selectedSerialArray])
    );
    tempImportInDetailGrid[serialEditModalInfo?.importInDetailIndex].quantity =
      selectedSerialArray.length;
    setImportInDetailGrid([...tempImportInDetailGrid]);
    console.log('importInDetailGrid');

    console.log(importInDetailGrid);
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
        primaryKeyToDelete="importInDetailSerialId"
        parentPrimaryKey="importInDetailId"
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
          saveImportInDetailSerial();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default ImportInDetailSerial;
