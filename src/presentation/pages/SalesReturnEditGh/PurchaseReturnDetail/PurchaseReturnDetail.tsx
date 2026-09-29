/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Autocomplete,
  Box,
  IconButton,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_Virtualizer,
  useMaterialReactTable,
} from 'material-react-table';
import { toast } from 'react-toastify';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit } from '@mui/icons-material';
import {
  IDeletePurchaseReturnDetailSerialCommand,
  IDeletePurchaseReturnDetailCommand,
  IDeletePurchaseReturnDetailTaxCommand,
  IPurchaseReturnDetailSerialInfo,
  IPurchaseReturnDetailInfo,
  IPurchaseReturnInfo,
} from '../../../../domain/interfaces/PurchaseReturnInterface';
import { useGetProductByCompanyProductGroupIdQuery } from '../../../../infrastructure/api/ProductApiSlice';
// import { useLazyGetPurchaseReturnDetailByPurchaseReturnIdCopyQuery } from '../../../../infrastructure/api/PurchaseReturnApiSlice';
import PurchaseReturnDetailSerial from './PurchaseReturnDetailSerial/PurchaseReturnDetailSerial';
import { useLazyGetPurchaseReturnDetailByPurchaseReturnIdCopyQuery } from '../../../../infrastructure/api/PurchaseReturnApiSlice';

interface PurchaseReturnDetailProps {
  purchaseReturnGrid: IPurchaseReturnInfo[];
  setPurchaseReturnGrid: React.Dispatch<React.SetStateAction<any[]>>;

  purchaseReturnDetailRows: IPurchaseReturnDetailInfo[];
  setPurchaseReturnDetailRows: React.Dispatch<React.SetStateAction<any[]>>;

  deletedPurchaseReturnDetailRows: IDeletePurchaseReturnDetailCommand[];
  setDeletedPurchaseReturnDetailRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  deletedPurchaseReturnDetailSerialRows: IDeletePurchaseReturnDetailSerialCommand[];
  setDeletedPurchaseReturnDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  deletedPurchaseReturnDetailTaxRows: IDeletePurchaseReturnDetailTaxCommand[];
  setDeletedPurchaseReturnDetailTaxRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  detailEditModalInfo: any;
  setDetailEditModalInfo: React.Dispatch<React.SetStateAction<any[]>>;
  handleDetailEditModalClose: () => void;
}

// interface ChequeBookLeafProps {
//   chequeBookInfo: IChequeBook | null | undefined;
//   chequeBookMasterRefetch: VoidFunction;
// }

// const ChequeBookLeaf: React.FC<ChequeBookLeafProps> = ({
//   chequeBookInfo,
//   chequeBookMasterRefetch,
// }) => {

const PurchaseReturnDetail: React.FC<PurchaseReturnDetailProps> = ({
  purchaseReturnGrid,
  setPurchaseReturnGrid,
  purchaseReturnDetailRows,
  setPurchaseReturnDetailRows,
  deletedPurchaseReturnDetailRows,
  setDeletedPurchaseReturnDetailRows,
  deletedPurchaseReturnDetailSerialRows,
  setDeletedPurchaseReturnDetailSerialRows,
  detailEditModalInfo,
  setDetailEditModalInfo,
  handleDetailEditModalClose,
}) => {
  const {
    register,
    getValues,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   purchaseReturn: null,
    //   buyer: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });

  const [purchaseReturnDetailGrid, setPurchaseReturnDetailGrid] = useState<
    IPurchaseReturnDetailInfo[]
  >([]);
  const [purchaseReturnDetailGridPrev, setPurchaseReturnDetailGridPrev] =
    useState<IPurchaseReturnDetailInfo[]>([]);

  const [deletedRowPurchaseReturnDetail, setDeletedRowPurchaseReturnDetail] =
    useState<IDeletePurchaseReturnDetailCommand[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);
  //   grid virtualization states
  const [
    isPurchaseReturnDetailGridLoading,
    setIsPurchaseReturnDetailGridLoading,
  ] = useState(true);
  const [sortingPurchaseReturnDetailGrid, setSortingPurchaseReturnDetailGrid] =
    useState<MRT_SortingState>([]);

  const [serialEditModalInfo, setSerialEditModalInfo] = useState<any>();

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }
  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetPurchaseReturnDetailInfo,
    {
      data: purchaseReturnDetailInfoData,
      error: purchaseReturnDetailInfoError,
      isError: purchaseReturnDetailInfoIsError,
      isSuccess: purchaseReturnDetailInfoIsSuccess,
      isLoading: purchaseReturnDetailInfoIsLoading,
      isFetching: purchaseReturnDetailInfoIsFetching,
    },
  ] = useLazyGetPurchaseReturnDetailByPurchaseReturnIdCopyQuery(); // RTK Query lazy fetch

  useEffect(() => {
    const purchaseReturnDetailRowsCopy: IPurchaseReturnDetailInfo[] =
      JSON.parse(JSON.stringify(purchaseReturnDetailRows));
    const existingPurchaseReturnDetailRows =
      purchaseReturnDetailRowsCopy.filter(
        (row) => row.purchaseReturnId === detailEditModalInfo?.purchaseReturnId
      );
    const existingPurchaseReturnDetailDeletedRows =
      deletedPurchaseReturnDetailRows.filter(
        (row) => row.purchaseReturnId === detailEditModalInfo?.purchaseReturnId
      );

    if (purchaseReturnDetailInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching purchaseReturnDetailInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching purchaseReturnDetailInfoData, see console--->:'
      );
      console.log(purchaseReturnDetailInfoError);

      const data: IPurchaseReturnDetailInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          purchaseReturnId: '',
          purchaseReturnDetailId: '',
          lPurchaseId: null,
          productId: 0,
          productName: '',
          price: null,
          quantity: null,
          taxAmount: null,
          vatAmount: null,
          isSerialProduct: false,
          purchaseReturnDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discount: null,
        });
      }
      setPurchaseReturnDetailGrid([...data]);
      setPurchaseReturnDetailGridPrev([]);

      setIsPurchaseReturnDetailGridLoading(false);
    }

    if (
      // maane ei purchaseReturn row er jonno jodi purchaseReturnDetail aager theke user set met koira thakle oidai load hoibo... na thakle db/api theke load hobe
      (existingPurchaseReturnDetailRows.length ||
        existingPurchaseReturnDetailDeletedRows.length) &&
      purchaseReturnDetailInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !purchaseReturnDetailInfoIsLoading &&
      !purchaseReturnDetailInfoIsError &&
      !purchaseReturnDetailInfoIsFetching
    ) {
      console.log('existingPurchaseReturnDetailRows');
      console.log(existingPurchaseReturnDetailRows);

      const data: IPurchaseReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...existingPurchaseReturnDetailRows])
      );
      const data2: IPurchaseReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...existingPurchaseReturnDetailRows])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          purchaseReturnId: '',
          purchaseReturnDetailId: '',
          lPurchaseId: null,
          productId: 0,
          productName: '',
          price: null,
          quantity: null,
          taxAmount: null,
          vatAmount: null,
          isSerialProduct: false,
          purchaseReturnDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discount: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setPurchaseReturnDetailGrid([...dataCopy]);
      setPurchaseReturnDetailGridPrev([...dataCopy2]);
      setIsPurchaseReturnDetailGridLoading(false);
    } else if (
      !existingPurchaseReturnDetailRows.length &&
      !existingPurchaseReturnDetailDeletedRows.length &&
      purchaseReturnDetailInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !purchaseReturnDetailInfoIsLoading &&
      !purchaseReturnDetailInfoIsError &&
      !purchaseReturnDetailInfoIsFetching
    ) {
      console.log('purchaseReturnDetailInfoIsSuccess');
      console.log(purchaseReturnDetailInfoData);

      const data: IPurchaseReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...(purchaseReturnDetailInfoData ?? [])])
      );
      const data2: IPurchaseReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...(purchaseReturnDetailInfoData ?? [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          purchaseReturnId: '',
          purchaseReturnDetailId: '',
          lPurchaseId: null,
          productId: 0,
          productName: '',
          price: null,
          quantity: null,
          taxAmount: null,
          vatAmount: null,
          isSerialProduct: false,
          purchaseReturnDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discount: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setPurchaseReturnDetailGrid([...dataCopy]);
      setPurchaseReturnDetailGridPrev([...dataCopy2]);
      setIsPurchaseReturnDetailGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsPurchaseReturnDetailGridLoading(true);
    }
  }, [
    purchaseReturnDetailInfoData,
    purchaseReturnDetailInfoIsLoading,
    purchaseReturnDetailInfoError,
    purchaseReturnDetailInfoIsError,
    purchaseReturnDetailInfoIsFetching,
    purchaseReturnDetailInfoIsSuccess,
  ]);

  const {
    data: productComboOptions,
    isLoading: productComboOptionsLoading,
    error: productComboOptionsError,
    isError: productComboOptionsIsError,
    isFetching: productComboOptionsIsFetching,
    refetch: productComboOptionsRefetch,
  } = useGetProductByCompanyProductGroupIdQuery({
    companyId: userInfo?.companyId || 0,
    productGroupId: 0,
  });
  useEffect(() => {
    if (productComboOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productComboOptions for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productComboOptions for autocomplete, see console--->:'
      );
      console.log(productComboOptionsError);
    }
  }, [
    productComboOptionsLoading,
    productComboOptionsIsError,
    productComboOptionsError,
    productComboOptions,
    productComboOptionsIsFetching,
  ]);

  //   ----------API Calls(Lazy)--------------------------
  // Trigger GetPurchaseReturnDetail RTK Query whenever a form field changes
  useEffect(() => {
    // Trigger your RTK Query
    triggerGetPurchaseReturnDetailInfo({
      purchaseReturnId: detailEditModalInfo?.purchaseReturnId,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [detailEditModalInfo?.purchaseReturnId]);

  //   ----------------------------------FUNCTIONS------------------------------------
  const checkAndSetPurchaseReturnDetailTableValues = useCallback(
    (index: number) => {
      if (index === purchaseReturnDetailGrid.length - 1) {
        const emptyPurchaseReturnDetail: IPurchaseReturnDetailInfo = {
          purchaseReturnId: '',
          purchaseReturnDetailId: '',
          lPurchaseId: null,
          productId: 0,
          productName: '',
          price: null,
          quantity: null,
          taxAmount: null,
          vatAmount: null,
          isSerialProduct: false,
          purchaseReturnDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discount: null,
        };
        setPurchaseReturnDetailGrid([
          ...purchaseReturnDetailGrid,
          emptyPurchaseReturnDetail,
        ]);
      } else {
        setPurchaseReturnDetailGrid([...purchaseReturnDetailGrid]);
      }
    },
    [purchaseReturnDetailGrid]
  );

  const handleSerialEdit = (index: number, row: IPurchaseReturnDetailInfo) => {
    const objTemp = {
      purchaseReturnDetailIndex: index,
      purchaseReturnDetailRow: row,
      purchaseReturnDetailId: row.purchaseReturnDetailId || null,
      purchaseReturnId: row.purchaseReturnId,
      productId: row.productId,
      productName: row.productName,
      serialModalOpen: true,
    };

    setSerialEditModalInfo(objTemp);
  };

  const handleSerialEditModalClose = () => {
    const objTemp = {
      purchaseReturnDetailIndex: null,
      purchaseReturnDetailRow: null,
      purchaseReturnDetailId: null,
      purchaseReturnId: null,
      productId: null,
      productName: null,
      serialModalOpen: false,
    };

    setSerialEditModalInfo(objTemp);
  };

  const savePurchaseReturnDetailAndPurchaseReturnDetailSerial = () => {
    console.log('PurchaseReturnDetail');
    console.log(purchaseReturnDetailGrid);

    console.log('DeletedRowPurchaseReturnDetail');
    console.log(deletedRowPurchaseReturnDetail);

    console.log('deletedPurchaseReturnDetailSerialRows');
    console.log(deletedPurchaseReturnDetailSerialRows);

    const tempPurchaseReturnDetailRows: IPurchaseReturnDetailInfo[] =
      JSON.parse(JSON.stringify([...purchaseReturnDetailGrid]));

    const tempPurchaseReturnDetailRowsWithoutEmpty =
      tempPurchaseReturnDetailRows.filter(
        (obj) => obj.productId && obj.quantity && obj.price
      );

    if (
      JSON.stringify(tempPurchaseReturnDetailRowsWithoutEmpty) ===
      JSON.stringify(purchaseReturnDetailGridPrev)
    ) {
      toast.info('No changes to save!');
      return;
    }

    // alert('helloww');
    // console.log('current tempPurchaseReturnDetailRowsWithoutEmpty');
    // console.log(tempPurchaseReturnDetailRowsWithoutEmpty);

    // storing deletedRowPurchaseReturnDetail to deletedPurchaseReturnDetailSerialRows(global)
    const deletedPurchaseReturnArray: IDeletePurchaseReturnDetailCommand[] =
      JSON.parse(JSON.stringify([...deletedPurchaseReturnDetailRows]));
    for (let i = 0; i < deletedRowPurchaseReturnDetail.length; i++) {
      const tempDeleteObj: IDeletePurchaseReturnDetailCommand = {
        purchaseReturnDetailId:
          deletedRowPurchaseReturnDetail[i].purchaseReturnDetailId,
        purchaseReturnId: detailEditModalInfo?.purchaseReturnId,
      };
      deletedPurchaseReturnArray.push(tempDeleteObj);
    }
    setDeletedPurchaseReturnDetailRows([
      ...new Set(deletedPurchaseReturnArray),
    ]);

    // storing purchaseReturnDetailGrid to purchaseReturnDetailRows

    const totalAmount = tempPurchaseReturnDetailRowsWithoutEmpty.reduce(
      (sum, obj) => {
        return (
          sum +
          (obj.price || 0) * (obj.quantity || 0) +
          (obj.vatAmount || 0) * (obj.quantity || 0) +
          (obj.taxAmount || 0) * (obj.quantity || 0)
          // -(obj.discount || 0) * (obj.quantity || 0)
        );
      },
      0
    );
    const totalVat = tempPurchaseReturnDetailRowsWithoutEmpty.reduce(
      (sum, obj) => {
        return sum + (obj.vatAmount || 0) * (obj.quantity || 0);
      },
      0
    );
    const totalTax = tempPurchaseReturnDetailRowsWithoutEmpty.reduce(
      (sum, obj) => {
        return sum + (obj.taxAmount || 0) * (obj.quantity || 0);
      },
      0
    );

    console.log('totalAmount');
    console.log(totalAmount);

    console.log('totalVat');
    console.log(totalVat);

    console.log('totalTax');
    console.log(totalTax);

    purchaseReturnGrid[detailEditModalInfo?.purchaseReturnInfoGridIndex].total =
      totalAmount;
    purchaseReturnGrid[detailEditModalInfo?.purchaseReturnInfoGridIndex].vat =
      totalVat;
    purchaseReturnGrid[detailEditModalInfo?.purchaseReturnInfoGridIndex].tax =
      totalTax;

    console.log('setting the purchaseReturnDetail Array--->');
    console.log(tempPurchaseReturnDetailRowsWithoutEmpty);

    setPurchaseReturnDetailRows([...tempPurchaseReturnDetailRowsWithoutEmpty]);
    // console.log(purchaseReturnDetailRows);
    setPurchaseReturnGrid([...purchaseReturnGrid]);
    // handleDetailEditModalClose();
  };

  //   ----------------------------------FUNCTIONS------------------------------------

  // ---------------------AUTOCOMPLETE POPPER INITIALIZATION-------------------------------

  interface AutoCompResStyles {
    popper: {
      maxWidth: string;
      // minWidth: string;
      fontSize: string;
    };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: {
      maxWidth: 'fit-content',
      // minWidth: 'inherit',
      fontSize: '0.75rem',
    },
  };

  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );
  // ---------------------AUTOCOMPLETE POPPER INITIALIZATION--------------ENDSS-----------------

  // --------------------------------------------excel csv-----------------------------------

  const handleExportData = (gridData: any[], gridColumns: any) => {
    if (!gridData.length) {
      toast.info('No data to download');
      return;
    }

    console.log('handleExportData');

    console.log('gridData');
    console.log(gridData);

    console.log('columnVisibility');
    console.log(columnVisibility);

    // --------[Getting the hidden columns as property names in an array]----------
    const falsePropertiesArr = Object.keys(columnVisibility).filter(
      (property) => columnVisibility[property] === false
    );
    console.log('falsePropertiesArr');
    console.log(falsePropertiesArr);

    console.log('gridColumns');
    console.log(gridColumns);

    // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
    const visibleGridDataTbColXcel = gridColumns
      .filter(
        (column: any) =>
          column?.id &&
          column?.id !== 'Actions' &&
          column?.id !== 'delete' &&
          !falsePropertiesArr.includes(column.id)
      )
      .map(({ id, header }: any) => ({ id, header }));

    console.log('visibleGridDataTbColXcel');
    console.log(visibleGridDataTbColXcel);

    // --------[Getting the data of excel without those columns which are hidden ]----------
    const gridDataTbXCEL = gridData.map((item: any) => {
      return Object.keys(item).reduce((acc: any, key: any) => {
        if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });

    console.log('gridDataTbXCEL');
    console.log(gridDataTbXCEL);

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

    const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
      const sortedItem: any = {};
      visibleGridDataTbColXcel.forEach((column: any) => {
        sortedItem[column.id] = item[column.id];
      });
      return sortedItem;
    });

    console.log('gridDataTbXCELSorted');
    console.log(gridDataTbXCELSorted);

    // ---[csv er settings]---
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: visibleGridDataTbColXcel.map((c: any) => c.header),
    };
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(gridDataTbXCELSorted);
  };

  // ------------------------------------excel csv-----------------END------------------

  const purchaseReturnDetailGridColumns = useMemo<
    MRT_ColumnDef<IPurchaseReturnDetailInfo>[]
  >(
    () => [
      {
        id: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
        grow: false,
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (
        //     isTheFieldDisabled(
        //       // row.original.productGroupId || 0,
        //       row.original.productId || 0
        //       // row.original.brandId || 0
        //     )
        //   ) {
        //     bgCellColor = '#f0f0f0';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                // row.original.productGroupId ||
                row.original.productId ? 'visible' : 'invisible'
              }
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (row.original.purchaseReturnDetailId) {
                    const tempDeletedObj: IDeletePurchaseReturnDetailCommand = {
                      purchaseReturnDetailId:
                        row.original.purchaseReturnDetailId,
                    };

                    // tax/vat delete from purchaseReturnDetailTax
                    const deleteArrayPurchaseReturnDetailTax: IDeletePurchaseReturnDetailTaxCommand[] =
                      [];
                    if (row.original.taxRowId) {
                      const tempObj: IDeletePurchaseReturnDetailTaxCommand = {
                        purchaseReturnDetail_TaxId: row.original.taxRowId,
                        purchaseReturnId: row.original.purchaseReturnId,
                      };
                      deleteArrayPurchaseReturnDetailTax.push(tempObj);
                    }

                    if (row.original.vatRowId) {
                      const tempObj: IDeletePurchaseReturnDetailTaxCommand = {
                        purchaseReturnDetail_TaxId: row.original.vatRowId,
                        purchaseReturnId: row.original.purchaseReturnId,
                      };
                      deleteArrayPurchaseReturnDetailTax.push(tempObj);
                    }
                    // tax/vat delete from purchaseReturnDetailTax...ENDS....

                    deletedRowPurchaseReturnDetail?.push(tempDeletedObj);
                  }
                  purchaseReturnDetailGrid?.splice(row.index, 1);
                  if (purchaseReturnDetailGrid) {
                    setPurchaseReturnDetailGrid([...purchaseReturnDetailGrid]);
                    setDeletedRowPurchaseReturnDetail([
                      ...deletedRowPurchaseReturnDetail,
                    ]);
                  } else {
                    setPurchaseReturnDetailGrid([]);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        id: 'editSerial', // access nested data with dot notation
        header: 'Edit Serial',
        size: 50, // small column
        grow: false,
        enableSorting: false,
        enableColumnActions: false,
        // enableResizing: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={row.original.isSerialProduct ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Edit Detail"
            >
              <IconButton
                color="error"
                onClick={() => {
                  handleSerialEdit(row.index, row.original);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.productName ?? '',
        id: 'productName',
        enableGlobalFilter: columnVisibility?.productName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Product Name',
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (
        //     isTheFieldDisabled(
        //       row.original.productGroupId || 0,
        //       row.original.productId || 0,
        //       row.original.brandId || 0
        //     )
        //   ) {
        //     bgCellColor = '#f0f0f0';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        Cell: ({ cell, row }) => {
          // ekhane error er value and message set korbi

          const currentProduct = {
            productId: row.original.productId || null,
            productName: row.original.productName || '',
          };
          // setValue(`product_row${row.index}`, currentProduct);
          return (
            <Controller
              name={`product_row${row.index}`}
              control={control}
              rules={
                {
                  // required: '*Required',
                  // validate: (value) => validateProduct(value, row.original),
                }
              }
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  // options={productOptions || []}
                  options={
                    Array.from(
                      new Map(
                        productComboOptions?.map((productOption) => [
                          productOption.productName,
                          productOption,
                        ])
                      ).values()
                    ) || []
                  } // making sure that the array is unique by productName, else autocomplete search ultapalta behave kore
                  value={currentProduct}
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  // disabled={isTheFieldDisabled(
                  //   row.original.productGroupId || 0,
                  //   row.original.productId || 0,
                  //   row.original.brandId || 0
                  // )}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  // loading={row.original.loading || false}
                  onChange={(event, selectedOption: any) => {
                    // handleProductChange(newValue as string, row.index)

                    purchaseReturnDetailGrid[row.index].productId =
                      selectedOption?.productId || null;
                    purchaseReturnDetailGrid[row.index].productName =
                      selectedOption?.productName || '';

                    purchaseReturnDetailGrid[row.index].quantity = null;
                    purchaseReturnDetailGrid[row.index].price = null;

                    purchaseReturnDetailGrid[row.index].isSerialProduct =
                      selectedOption?.isSerialProduct || false;

                    purchaseReturnDetailGrid[row.index].unitTypeId =
                      selectedOption?.unitTypeId || 0;

                    purchaseReturnDetailGrid[row.index].purchaseReturnId =
                      detailEditModalInfo?.purchaseReturnId;

                    if (
                      purchaseReturnDetailGrid[row.index]
                        .purchaseReturnDetailSerialInfoDto.length > 0
                    ) {
                      const tempPurchaseReturnDetailSerialToDelete: IDeletePurchaseReturnDetailSerialCommand[] =
                        [];

                      purchaseReturnDetailGrid[
                        row.index
                      ].purchaseReturnDetailSerialInfoDto.forEach(
                        (item, index) => {
                          if (item.purchaseReturnDetailSerialId) {
                            const tempObj: IDeletePurchaseReturnDetailSerialCommand =
                              {
                                purchaseReturnDetailSerialId:
                                  item.purchaseReturnDetailSerialId,
                                purchaseReturnId:
                                  detailEditModalInfo?.purchaseReturnId || 0,
                              };
                            tempPurchaseReturnDetailSerialToDelete.push(
                              tempObj
                            );
                          }
                        }
                      );

                      purchaseReturnDetailGrid[
                        row.index
                      ].purchaseReturnDetailSerialInfoDto = [];
                    }
                    checkAndSetPurchaseReturnDetailTableValues(row.index);
                    // setValue(`product_row${row.index}`, selectedOption);
                    onChange(selectedOption);
                  }}
                  onBlur={onBlur} // Trigger validation on blur
                  isOptionEqualToValue={(options, selectedOption) =>
                    options.productId === selectedOption.productId
                  }
                  getOptionLabel={(option: any) =>
                    option ? option.productName : ''
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // label="Product"

                      // onFocus={() => handleProductFocus(row.index)}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: '0.8125rem' },
                        disableUnderline: true,
                        // endAdornment: (
                        //   <>
                        //     {row.original.loading ? (
                        //       <CircularProgress color="inherit" size={20} />
                        //     ) : null}
                        //     {params.InputProps.endAdornment}
                        //   </>
                        // ),
                      }}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: '0.625rem', // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.quantity ?? '', // access nested data with dot notation
        id: 'quantity',
        enableGlobalFilter: columnVisibility?.quantity, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        size: 200,
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (
        //     isTheFieldDisabled(
        //       row.original.productGroupId || 0,
        //       row.original.productId || 0,
        //       row.original.brandId || 0
        //     )
        //   ) {
        //     bgCellColor = '#f0f0f0';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Quantity',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                readOnly: row.original.isSerialProduct,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                purchaseReturnDetailGrid[row.index].quantity = Number.isNaN(
                  parseInt(e.target.value, 10)
                )
                  ? null
                  : Math.abs(parseInt(e.target.value, 10));
                checkAndSetPurchaseReturnDetailTableValues(row.index);
                // checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.price ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'price',
        enableGlobalFilter: columnVisibility?.price, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Price',
        // size: 1, // small column
        size: 120,
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (
        //     isTheFieldDisabled(
        //       row.original.productGroupId || 0,
        //       row.original.productId || 0,
        //       row.original.brandId || 0
        //     )
        //   ) {
        //     bgCellColor = '#f0f0f0';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: isTheFieldDisabled(
                //   row.original.productGroupId || 0,
                //   row.original.productId || 0,
                //   row.original.brandId || 0
                // ),
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                purchaseReturnDetailGrid[row.index].price = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetPurchaseReturnDetailTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.vatAmount ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'vatAmount',
        enableGlobalFilter: columnVisibility?.vatAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Vat',
        // size: 1, // small column
        size: 120,
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (
        //     isTheFieldDisabled(
        //       row.original.productGroupId || 0,
        //       row.original.productId || 0,
        //       row.original.brandId || 0
        //     )
        //   ) {
        //     bgCellColor = '#f0f0f0';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: isTheFieldDisabled(
                //   row.original.productGroupId || 0,
                //   row.original.productId || 0,
                //   row.original.brandId || 0
                // ),
                readOnly: !row.original.productId,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                purchaseReturnDetailGrid[row.index].vatAmount = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetPurchaseReturnDetailTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.taxAmount ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'taxAmount',
        enableGlobalFilter: columnVisibility?.taxAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Tax',
        // size: 1, // small column
        size: 120,
        // muiTableBodyCellProps: ({ cell, column, row }) => {
        //   let bgCellColor = 'fafafc';
        //   if (
        //     isTheFieldDisabled(
        //       row.original.productGroupId || 0,
        //       row.original.productId || 0,
        //       row.original.brandId || 0
        //     )
        //   ) {
        //     bgCellColor = '#f0f0f0';
        //   }

        //   return {
        //     sx: {
        //       backgroundColor: `${bgCellColor}`,
        //     },
        //   };
        // },
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.8125rem' },
                disableUnderline: true,
                // readOnly: isTheFieldDisabled(
                //   row.original.productGroupId || 0,
                //   row.original.productId || 0,
                //   row.original.brandId || 0
                // ),
                readOnly: !row.original.productId,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                purchaseReturnDetailGrid[row.index].taxAmount = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetPurchaseReturnDetailTableValues(row.index);
              }}
            />
          );
        },
      },
      // {
      //   accessorFn: (row) => row.discount ?? '', // access nested data with dot notation
      //   // accessorKey: 'approved', // access nested data with dot notation
      //   id: 'discount',
      //   enableGlobalFilter: columnVisibility?.discount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   header: 'Discount',
      //   // size: 1, // small column
      //   size: 120,
      //   // muiTableBodyCellProps: ({ cell, column, row }) => {
      //   //   let bgCellColor = 'fafafc';
      //   //   if (
      //   //     isTheFieldDisabled(
      //   //       row.original.productGroupId || 0,
      //   //       row.original.productId || 0,
      //   //       row.original.brandId || 0
      //   //     )
      //   //   ) {
      //   //     bgCellColor = '#f0f0f0';
      //   //   }

      //   //   return {
      //   //     sx: {
      //   //       backgroundColor: `${bgCellColor}`,
      //   //     },
      //   //   };
      //   // },
      //   grow: false,
      //   // enableSorting: false,
      //   // enableColumnActions: false,
      //   // enableResizing: false,
      //   // enableColumnFilter: false,

      //   muiTableHeadCellProps: ({ column }) => ({
      //     align: 'left',
      //   }),

      //   Cell: ({ renderedCellValue, row }) => {
      //     return (
      //       <TextField
      //         type="number"
      //         sx={{ width: '100%' }}
      //         InputProps={{
      //           style: { fontSize: '0.8125rem' },
      //           disableUnderline: true,
      //           // readOnly: isTheFieldDisabled(
      //           //   row.original.productGroupId || 0,
      //           //   row.original.productId || 0,
      //           //   row.original.brandId || 0
      //           // ),
      //           readOnly: !row.original.productId,
      //         }}
      //         variant="standard"
      //         size="small"
      //         inputRef={(node) => {
      //           if (node) {
      //             node.value = renderedCellValue;
      //           }
      //         }}
      //         onBlur={(e) => {
      //           purchaseReturnDetailGrid[row.index].discount = Number.isNaN(
      //             parseFloat(e.target.value)
      //           )
      //             ? null
      //             : Math.abs(parseFloat(e.target.value));
      //           checkAndSetPurchaseReturnDetailTableValues(row.index);
      //         }}
      //       />
      //     );
      //   },
      // },
    ],
    [
      // PopperMy,
      // checkAndSetPurchaseReturnDetailTableValues,
      // columnVisibility?.price,
      // columnVisibility?.productName,
      // columnVisibility?.quantity,
      // control,
      // deletedRowPurchaseReturnDetail,
      // productComboOptions,
      // purchaseReturnDetailGrid,
      PopperMy,
      checkAndSetPurchaseReturnDetailTableValues,
      purchaseReturnDetailGrid,
    ]
  );

  // ---------- material table virtualization---------

  // optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && tableDataLoading === false) {
  //     // setData(makeData(10_000));
  //     setIsLoading(false);
  //   }
  // }, [tableDataLoading]);   //--------ei code ta getGridData anar j api, oitay ei if er condition ta add koira dite hobe
  useEffect(() => {
    // scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortingPurchaseReturnDetailGrid]);

  // ---------- material table virtualization---------

  const purchaseReturnDetailGridInitializer: MRT_TableInstance<IPurchaseReturnDetailInfo> =
    useMaterialReactTable({
      columns: purchaseReturnDetailGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: purchaseReturnDetailGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading: isPurchaseReturnDetailGridLoading,
        sorting: sortingPurchaseReturnDetailGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: '1.875rem',
      },
      //   enableRowSelection: (row) => {
      //     // if (row.original.lastProcessedDate) {
      //     //   toast.warning(
      //     //     'You cannot select/calculate commission for this buyer, as this is already processed before'
      //     //   );
      //     // }
      //     return !!row.original.purchaseReturnId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
      //   }, // enable row selection conditionally per row
      // enableRowSelection: true,
      enableRowVirtualization: true,
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enableFilterMatchHighlighting: false, // disable filter match highlighting
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      initialState: {
        density: 'compact',
      },
      muiTablePaperProps: {
        elevation: 0, // change the mui box shadow
        // customize paper styles
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '0.8125rem',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '25rem' } },
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />

          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[0.375rem] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     buyerSalesRptGridState,
                //     purchaseReturnGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(
                  purchaseReturnDetailGrid,
                  purchaseReturnDetailGridColumns
                );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      //   renderTopToolbarCustomActions: ({ table }) => (
      //     <div className=" w-[30%] mt-1 flex gap-3 justify-center items-center">

      //     </div>
      //   ),
      onSortingChange: setSortingPurchaseReturnDetailGrid,
      rowVirtualizerInstanceRef, // optional
      rowVirtualizerOptions: { overscan: 10 }, // optionally customize the row virtualizer
    });

  return (
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-[100%]">
          {/* Main Card */}
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
            {/* Main Card header */}
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              {/* -----[Laboratory experimental place starts here]----- */}
              Local Purchase Detail
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="w-full m-1 modifiedEditTable">
                <MaterialReactTable
                  table={purchaseReturnDetailGridInitializer}
                />
              </div>
            </div>
            {/* Main Card Body--/-- */}

            {/* Main Card footer */}
            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    savePurchaseReturnDetailAndPurchaseReturnDetailSerial();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
            {/* Main Card footer--/-- */}
          </div>
          {/* Main Card--/-- */}
        </div>
      </div>

      {/* // modals --- out of html normal body/position */}

      <Modal
        open={serialEditModalInfo?.serialModalOpen} // create leaf modal
        onClose={handleSerialEditModalClose}
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
            width: { xs: '80vw', md: '35vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleSerialEditModalClose}
            sx={{
              position: 'absolute',
              // top: { xs: '25%', sm: '25%', md: '4%' },
              // right: { xs: '4%', sm: '10%', md: '2%' },
              top: '4%',
              right: '4%',
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* <CreateChequeLeaf
            chequeBookInfo={chequeBookInfo}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
            chequeBookDetailRefetch={chequeBookDetailRefetch}
            handleCreateLeafModalClose={handleCreateLeafModalClose}

            serialEditModalInfo
          /> */}
          <PurchaseReturnDetailSerial
            serialEditModalInfo={serialEditModalInfo}
            // purchaseReturnDetailSerialRows={purchaseReturnDetailSerialRows}
            // setPurchaseReturnDetailSerialRows={setPurchaseReturnDetailSerialRows}
            purchaseReturnDetailGrid={purchaseReturnDetailGrid}
            setPurchaseReturnDetailGrid={setPurchaseReturnDetailGrid}
            deletedPurchaseReturnDetailSerialRows={
              deletedPurchaseReturnDetailSerialRows
            }
            setDeletedPurchaseReturnDetailSerialRows={
              setDeletedPurchaseReturnDetailSerialRows
            }
            handleSerialEditModalClose={handleSerialEditModalClose}
          />
        </Box>
      </Modal>

      {/* // modals --- out of html normal body/position */}
    </div>
  );
};

export default PurchaseReturnDetail;
