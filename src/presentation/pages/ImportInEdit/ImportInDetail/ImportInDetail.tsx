/* eslint-disable prettier/prettier */
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
  IDeleteImportInDetailSerialCommand,
  IDeleteImportInDetailCommand,
  // IDeleteImportInDetailTaxCommand,
  IImportInDetailSerialInfo,
  IImportInDetailInfo,
  IImportInInfo,
} from '../../../../domain/interfaces/ImportInInterface';

import { useGetPreImportInProductQuery, useLazyGetImportInDetailByImportInIdCopyQuery } from '../../../../infrastructure/api/ImportInApiSlice';
import ImportInDetailSerial from './ImportInDetailSerial/ImportInDetailSerial';
// import {
//   useGetPreImportInProductQuery,
//   useLazyGetPreImportInProductQuery,
// } from '../../../../infrastructure/api/PreImportInApiSlice';

interface ImportInDetailProps {
  importInGrid: IImportInInfo[];
  setImportInGrid: React.Dispatch<React.SetStateAction<any[]>>;

  importInDetailRows: IImportInDetailInfo[];
  setImportInDetailRows: React.Dispatch<React.SetStateAction<any[]>>;

  deletedImportInDetailRows: IDeleteImportInDetailCommand[];
  setDeletedImportInDetailRows: React.Dispatch<React.SetStateAction<any[]>>;
  deletedImportInDetailSerialRows: IDeleteImportInDetailSerialCommand[];
  setDeletedImportInDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  // deletedImportInDetailTaxRows: IDeleteImportInDetailTaxCommand[];
  // setDeletedImportInDetailTaxRows: React.Dispatch<React.SetStateAction<any[]>>;
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

const ImportInDetail: React.FC<ImportInDetailProps> = ({
  importInGrid,
  setImportInGrid,
  importInDetailRows,
  setImportInDetailRows,
  deletedImportInDetailRows,
  setDeletedImportInDetailRows,
  deletedImportInDetailSerialRows,
  setDeletedImportInDetailSerialRows,
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
    //   importIn: null,
    //   buyer: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });

  const [importInDetailGrid, setImportInDetailGrid] = useState<
    IImportInDetailInfo[]
  >([]);
  const [importInDetailGridPrev, setImportInDetailGridPrev] = useState<
    IImportInDetailInfo[]
  >([]);

  const [deletedRowImportInDetail, setDeletedRowImportInDetail] = useState<
    IDeleteImportInDetailCommand[]
  >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);
  //   grid virtualization states
  const [isImportInDetailGridLoading, setIsImportInDetailGridLoading] =
    useState(true);
  const [sortingImportInDetailGrid, setSortingImportInDetailGrid] =
    useState<MRT_SortingState>([]);

  const [serialEditModalInfo, setSerialEditModalInfo] = useState<any>();

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }
  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetImportInDetailInfo,
    {
      data: importInDetailInfoData,
      error: importInDetailInfoError,
      isError: importInDetailInfoIsError,
      isSuccess: importInDetailInfoIsSuccess,
      isLoading: importInDetailInfoIsLoading,
      isFetching: importInDetailInfoIsFetching,
    },
  ] = useLazyGetImportInDetailByImportInIdCopyQuery(); // RTK Query lazy fetch

  useEffect(() => {
    console.log('importInDetailInfoData');
    console.log(importInDetailInfoData);

    const importInDetailRowsCopy: IImportInDetailInfo[] = JSON.parse(
      JSON.stringify(importInDetailRows)
    );
    const existingImportInDetailRows = importInDetailRowsCopy.filter(
      (row) => row.importInId === detailEditModalInfo?.importInId
    );
    const existingImportInDetailDeletedRows = deletedImportInDetailRows.filter(
      (row) => row.importInId === detailEditModalInfo?.importInId
    );

    const existingImportInDetailSerialDeletedRows =
      deletedImportInDetailSerialRows.filter(
        (row) => row.importInId === detailEditModalInfo?.importInId
      );

    if (importInDetailInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching importInDetailInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching importInDetailInfoData, see console--->:'
      );
      console.log(importInDetailInfoError);

      const data: IImportInDetailInfo[] = [];

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          importInId: '',
          importInDetailId: '',
          productId: 0,
          productName: '',
          cost: null,
          quantity: null,
          maxQuantityLimit: null,
          // taxAmount: null,
          // vatAmount: null,
          isSerialProduct: false,
          importInDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discountAmount: null,
          locationId: null,
        });
      }
      setImportInDetailGrid([...data]);
      setImportInDetailGridPrev([]);

      setIsImportInDetailGridLoading(false);
    }

    if (
      // maane ei importIn row er jonno jodi importInDetail aager theke user set met koira thakle oidai load hoibo... na thakle db/api theke load hobe
      (existingImportInDetailRows.length ||
        existingImportInDetailDeletedRows.length ||
        existingImportInDetailSerialDeletedRows.length) &&
      importInDetailInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !importInDetailInfoIsLoading &&
      !importInDetailInfoIsError &&
      !importInDetailInfoIsFetching
    ) {
      console.log('existingImportInDetailRows');
      console.log(!!existingImportInDetailRows.length);
      console.log(!!existingImportInDetailDeletedRows.length);
      console.log(!!existingImportInDetailSerialDeletedRows.length);

      const data: IImportInDetailInfo[] = JSON.parse(
        JSON.stringify([...existingImportInDetailRows])
      );
      const data2: IImportInDetailInfo[] = JSON.parse(
        JSON.stringify([...existingImportInDetailRows])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          importInId: '',
          importInDetailId: '',
          productId: 0,
          productName: '',
          cost: null,
          quantity: null,
          maxQuantityLimit: null,
          // taxAmount: null,
          // vatAmount: null,
          isSerialProduct: false,
          importInDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discountAmount: null,
          locationId: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setImportInDetailGrid([...dataCopy]);
      setImportInDetailGridPrev([...dataCopy2]);
      setIsImportInDetailGridLoading(false);
    } else if (
      !existingImportInDetailRows.length &&
      !existingImportInDetailDeletedRows.length &&
      !existingImportInDetailSerialDeletedRows.length &&
      importInDetailInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !importInDetailInfoIsLoading &&
      !importInDetailInfoIsError &&
      !importInDetailInfoIsFetching
    ) {
      console.log('importInDetailInfoIsSuccess');
      console.log(importInDetailInfoData);

      const data: IImportInDetailInfo[] = JSON.parse(
        JSON.stringify([...(importInDetailInfoData ?? [])])
      );
      const data2: IImportInDetailInfo[] = JSON.parse(
        JSON.stringify([...(importInDetailInfoData ?? [])])
      );

      // Fill remaining with empty rows
      while (data.length < 10) {
        data.push({
          importInId: '',
          importInDetailId: '',
          productId: 0,
          productName: '',
          cost: null,
          quantity: null,
          maxQuantityLimit: null,
          // taxAmount: null,
          // vatAmount: null,
          isSerialProduct: false,
          importInDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discountAmount: null,
          locationId: null,
        });
      }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setImportInDetailGrid([...dataCopy]);
      setImportInDetailGridPrev([...dataCopy2]);
      setIsImportInDetailGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsImportInDetailGridLoading(true);
    }
  }, [
    importInDetailInfoData,
    importInDetailInfoIsLoading,
    importInDetailInfoError,
    importInDetailInfoIsError,
    importInDetailInfoIsFetching,
    importInDetailInfoIsSuccess,
  ]);

  const {
    data: productComboOptions,
    isLoading: productComboOptionsLoading,
    error: productComboOptionsError,
    isError: productComboOptionsIsError,
    isFetching: productComboOptionsIsFetching,
    refetch: productComboOptionsRefetch,
  } = useGetPreImportInProductQuery({
    lcNo: detailEditModalInfo?.importInInfoGridRow?.lcNo || '',
    importInId: detailEditModalInfo?.importInInfoGridRow?.importInId,
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
  // Trigger GetImportInDetail RTK Query whenever a form field changes
  useEffect(() => {
    // Trigger your RTK Query
    triggerGetImportInDetailInfo({
      importInId: detailEditModalInfo?.importInId,
      lcNo: detailEditModalInfo?.importInInfoGridRow?.lcNo || '',
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [detailEditModalInfo?.importInId, detailEditModalInfo?.importInInfoGridRow?.lcNo, triggerGetImportInDetailInfo]);

  //   ----------------------------------FUNCTIONS------------------------------------
  const checkAndSetImportInDetailTableValues = useCallback(
    (index: number) => {
      if (index === importInDetailGrid.length - 1) {
        const emptyImportInDetail: IImportInDetailInfo = {
          importInId: '',
          importInDetailId: '',
          productId: 0,
          productName: '',
          cost: null,
          quantity: null,
          maxQuantityLimit: null,
          // taxAmount: null,
          // vatAmount: null,
          isSerialProduct: false,
          importInDetailSerialInfoDto: [],
          unitTypeId: 0,
          // discountAmount: null,
          locationId: null,
        };
        setImportInDetailGrid([...importInDetailGrid, emptyImportInDetail]);
      } else {
        setImportInDetailGrid([...importInDetailGrid]);
      }
    },
    [importInDetailGrid]
  );

  const handleSerialEdit = (index: number, row: IImportInDetailInfo) => {
    const objTemp = {
      importInDetailIndex: index,
      importInDetailRow: row,
      importInDetailId: row.importInDetailId || null,
      importInId: row.importInId,
      productId: row.productId,
      productName: row.productName,
      maxQuantityLimit: row.maxQuantityLimit,
      serialModalOpen: true,
    };

    setSerialEditModalInfo(objTemp);
  };

  const handleSerialEditModalClose = () => {
    const objTemp = {
      importInDetailIndex: null,
      importInDetailRow: null,
      importInDetailId: null,
      importInId: null,
      productId: null,
      productName: null,
      maxQuantityLimit: null,
      serialModalOpen: false,
    };

    setSerialEditModalInfo(objTemp);
  };

  const saveImportInDetailAndImportInDetailSerial = () => {
    console.log('ImportInDetail');
    console.log(importInDetailGrid);

    console.log('DeletedRowImportInDetail');
    console.log(deletedRowImportInDetail);

    console.log('deletedImportInDetailSerialRows');
    console.log(deletedImportInDetailSerialRows);

    const tempImportInDetailRows: IImportInDetailInfo[] = JSON.parse(
      JSON.stringify([...importInDetailGrid])
    );

    const tempImportInDetailRowsWithoutEmpty = tempImportInDetailRows.filter(
      (obj) => obj.productId && obj.quantity && obj.cost
    );

    if (
      JSON.stringify(tempImportInDetailRowsWithoutEmpty) ===
      JSON.stringify(importInDetailGridPrev)
    ) {
      toast.info('No changes to save!');
      return;
    }

    // alert('helloww');
    // console.log('current tempImportInDetailRowsWithoutEmpty');
    // console.log(tempImportInDetailRowsWithoutEmpty);

    // storing deletedRowImportInDetail to deletedImportInDetailSerialRows(global)
    const deletedImportInArray: IDeleteImportInDetailCommand[] = JSON.parse(
      JSON.stringify([...deletedImportInDetailRows])
    );
    for (let i = 0; i < deletedRowImportInDetail.length; i++) {
      const tempDeleteObj: IDeleteImportInDetailCommand = {
        importInDetailId: deletedRowImportInDetail[i].importInDetailId,
        importInId: detailEditModalInfo?.importInId,
      };
      deletedImportInArray.push(tempDeleteObj);
    }
    setDeletedImportInDetailRows([...new Set(deletedImportInArray)]);

    // storing importInDetailGrid to importInDetailRows

    const totalAmount = tempImportInDetailRowsWithoutEmpty.reduce(
      (sum, obj) => {
        return (
          sum + (obj.cost || 0) * (obj.quantity || 0)
          // +
          // (obj.vatAmount || 0) * (obj.quantity || 0) +
          // (obj.taxAmount || 0) * (obj.quantity || 0) -
          // (obj.discountAmount || 0) * (obj.quantity || 0)
        );
      },
      0
    );
    const totalVat = tempImportInDetailRowsWithoutEmpty.reduce((sum, obj) => {
      // return sum + (obj.vatAmount || 0) * (obj.quantity || 0);
      return sum;
    }, 0);
    const totalTax = tempImportInDetailRowsWithoutEmpty.reduce((sum, obj) => {
      // return sum + (obj.taxAmount || 0) * (obj.quantity || 0);
      return sum;
    }, 0);

    console.log('totalAmount');
    console.log(totalAmount);

    console.log('totalVat');
    console.log(totalVat);

    console.log('totalTax');
    console.log(totalTax);

    // importInGrid[
    //   detailEditModalInfo?.importInInfoGridIndex
    // ].totalAmountWithoutPurchaseDiscount = totalAmount;
    importInGrid[detailEditModalInfo?.importInInfoGridIndex].totalAmount =
      totalAmount;
    // totalAmount -
    // (importInGrid[detailEditModalInfo?.importInInfoGridIndex]
    //   .purchaseDiscount || 0);
    // importInGrid[detailEditModalInfo?.importInInfoGridIndex].totalVat =
    //   totalVat;
    // importInGrid[detailEditModalInfo?.importInInfoGridIndex].totalTax =
    //   totalTax;

    console.log('setting the importInDetail Array--->');
    console.log(tempImportInDetailRowsWithoutEmpty);

    // 1️⃣ remove matching rows
    const filteredImportInDetailRows = importInDetailRows.filter(
      (row) => row.importInId !== detailEditModalInfo?.importInId
    );
    // 2️⃣ merge arrays
    const updatedImportInDetailRows = [
      ...filteredImportInDetailRows,
      ...tempImportInDetailRowsWithoutEmpty,
    ];

    setImportInDetailRows([...updatedImportInDetailRows]);

    // console.log(importInDetailRows);
    setImportInGrid([...importInGrid]);
    // handleDetailEditModalClose();
  };

  const getAvailableProductOptions = useCallback(
    (rowIndex: number) => {
      const uniqueProductOptions =
        Array.from(
          new Map(
            (productComboOptions ?? []).map((productOption) => [
              productOption.productName,
              productOption,
            ])
          ).values()
        ) || [];

      const selectedProductIds = new Set(
        importInDetailGrid
          .filter((row, index) => index !== rowIndex && !!row.productId)
          .map((row) => row.productId)
      );

      const currentRowProductId = importInDetailGrid[rowIndex]?.productId;

      return uniqueProductOptions.filter(
        (productOption) =>
          productOption.productId === currentRowProductId ||
          !selectedProductIds.has(productOption.productId)
      );
    },
    [productComboOptions, importInDetailGrid]
  );

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
      fontSize: '12px',
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

  const importInDetailGridColumns = useMemo<
    MRT_ColumnDef<IImportInDetailInfo>[]
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
                  if (row.original.importInDetailId) {
                    const tempDeletedObj: IDeleteImportInDetailCommand = {
                      importInDetailId: row.original.importInDetailId,
                    };

                    // tax/vat delete from importInDetailTax
                    // const deleteArrayImportInDetailTax: IDeleteImportInDetailTaxCommand[] =
                    //   [];
                    // if (row.original.taxRowId) {
                    //   const tempObj: IDeleteImportInDetailTaxCommand = {
                    //     importInDetailTaxId: row.original.taxRowId,
                    //     importInId: row.original.importInId,
                    //   };
                    //   deleteArrayImportInDetailTax.push(tempObj);
                    // }

                    // if (row.original.vatRowId) {
                    //   const tempObj: IDeleteImportInDetailTaxCommand = {
                    //     importInDetailTaxId: row.original.vatRowId,
                    //     importInId: row.original.importInId,
                    //   };
                    //   deleteArrayImportInDetailTax.push(tempObj);
                    // }
                    // tax/vat delete from importInDetailTax...ENDS....

                    deletedRowImportInDetail?.push(tempDeletedObj);
                  }
                  importInDetailGrid?.splice(row.index, 1);
                  if (importInDetailGrid) {
                    setImportInDetailGrid([...importInDetailGrid]);
                    setDeletedRowImportInDetail([...deletedRowImportInDetail]);
                  } else {
                    setImportInDetailGrid([]);
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
                  options={getAvailableProductOptions(row.index)}
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
                      if(selectedOption?.productId){
                        
                    importInDetailGrid[row.index].productId =
                      selectedOption?.productId || null;
                    importInDetailGrid[row.index].productName =
                      selectedOption?.productName || '';

                    const currentQuantity = importInDetailGrid[row.index]?.quantity;
                    importInDetailGrid[row.index].quantity =
                      currentQuantity !== null &&
                      currentQuantity > (selectedOption?.maxQuantityLimit ?? 0)
                        ? selectedOption?.maxQuantityLimit
                        : currentQuantity;

                    importInDetailGrid[row.index].cost = selectedOption?.cost;

                    importInDetailGrid[row.index].isSerialProduct =
                      selectedOption?.isSerialProduct || false;

                    importInDetailGrid[row.index].unitTypeId =
                      selectedOption?.unitTypeId || 0;

                    importInDetailGrid[row.index].importInId =
                      detailEditModalInfo?.importInId;

                    if (
                      importInDetailGrid[row.index].importInDetailSerialInfoDto
                        .length > 0
                    ) {
                      const tempImportInDetailSerialToDelete: IDeleteImportInDetailSerialCommand[] =
                        [];

                      importInDetailGrid[
                        row.index
                      ].importInDetailSerialInfoDto.forEach((item, index) => {
                        if (item.importInDetailSerialId) {
                          const tempObj: IDeleteImportInDetailSerialCommand = {
                            importInDetailSerialId: item.importInDetailSerialId,
                            importInId: detailEditModalInfo?.importInId || 0,
                          };
                          tempImportInDetailSerialToDelete.push(tempObj);
                        }
                      });

                      importInDetailGrid[
                        row.index
                      ].importInDetailSerialInfoDto = [];
                    }
                    checkAndSetImportInDetailTableValues(row.index);
                    // setValue(`product_row${row.index}`, selectedOption);
                    onChange(selectedOption);
                      }
                  }}
                  
                  onBlur={(e) => {
                    checkAndSetImportInDetailTableValues(row.index);
                    onBlur();
                  }}
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
                        style: { fontSize: 13 },
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
                          fontSize: 10, // Set the font size
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
                style: { fontSize: 13 },
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
                const enteredQuantity = Number.isNaN(
                  parseInt(e.target.value, 10)
                )
                  ? null
                  : Math.abs(parseInt(e.target.value, 10));

                const maxQuantityLimit =
                  importInDetailGrid[row.index].maxQuantityLimit;

                if (
                  enteredQuantity !== null &&
                  maxQuantityLimit !== null &&
                  enteredQuantity > maxQuantityLimit
                ) {
                  importInDetailGrid[row.index].quantity = maxQuantityLimit;

                  toast.warning(
                    `Maximum allowed quantity for '${importInDetailGrid[row.index].productName}' is ${maxQuantityLimit}. Based on PreImportIn and other Import In records for this LC, the quantity has been adjusted to the allowed limit.`
                  );

                  e.target.value = String(maxQuantityLimit);
                } else {
                  importInDetailGrid[row.index].quantity = enteredQuantity;
                }

                checkAndSetImportInDetailTableValues(row.index);
                // checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.cost ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'cost',
        enableGlobalFilter: columnVisibility?.cost, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
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
                style: { fontSize: 13 },
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
                importInDetailGrid[row.index].cost = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetImportInDetailTableValues(row.index);
              }}
            />
          );
        },
      },
      // {
      //   accessorFn: (row) => row.vatAmount ?? '', // access nested data with dot notation
      //   // accessorKey: 'approved', // access nested data with dot notation
      //   id: 'vatAmount',
      //   enableGlobalFilter: columnVisibility?.vatAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   header: 'VAT',
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
      //           style: { fontSize: 13 },
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
      //           importInDetailGrid[row.index].vatAmount = Number.isNaN(
      //             parseFloat(e.target.value)
      //           )
      //             ? null
      //             : Math.abs(parseFloat(e.target.value));
      //           checkAndSetImportInDetailTableValues(row.index);
      //         }}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorFn: (row) => row.taxAmount ?? '', // access nested data with dot notation
      //   // accessorKey: 'approved', // access nested data with dot notation
      //   id: 'taxAmount',
      //   enableGlobalFilter: columnVisibility?.taxAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
      //   header: 'TAX',
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
      //           style: { fontSize: 13 },
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
      //           importInDetailGrid[row.index].taxAmount = Number.isNaN(
      //             parseFloat(e.target.value)
      //           )
      //             ? null
      //             : Math.abs(parseFloat(e.target.value));
      //           checkAndSetImportInDetailTableValues(row.index);
      //         }}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorFn: (row) => row.discountAmount ?? '', // access nested data with dot notation
      //   // accessorKey: 'approved', // access nested data with dot notation
      //   id: 'discountAmount',
      //   enableGlobalFilter: columnVisibility?.discountAmount, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
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
      //           style: { fontSize: 13 },
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
      //           importInDetailGrid[row.index].discountAmount = Number.isNaN(
      //             parseFloat(e.target.value)
      //           )
      //             ? null
      //             : Math.abs(parseFloat(e.target.value));
      //           checkAndSetImportInDetailTableValues(row.index);
      //         }}
      //       />
      //     );
      //   },
      // },
    ],
    [
      PopperMy,
      checkAndSetImportInDetailTableValues,
      getAvailableProductOptions,
      importInDetailGrid,
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
  }, [sortingImportInDetailGrid]);

  // ---------- material table virtualization---------

  const importInDetailGridInitializer: MRT_TableInstance<IImportInDetailInfo> =
    useMaterialReactTable({
      columns: importInDetailGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: importInDetailGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading: isImportInDetailGridLoading,
        sorting: sortingImportInDetailGrid,
        // rowSelection: selectedBepcRow,
      },
      // enableRowOrdering: true,
      positionToolbarAlertBanner: 'none',
      // enableSorting: false, // usually you do not want to sort when re-ordering
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 30,
      },
      //   enableRowSelection: (row) => {
      //     // if (row.original.lastProcessedDate) {
      //     //   toast.warning(
      //     //     'You cannot select/calculate commission for this buyer, as this is already processed before'
      //     //   );
      //     // }
      //     return !!row.original.importInId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
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
          fontSize: '13px',
          color: '#ea1143',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '400px' } },
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
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                //   handleExportData(
                //     buyerSalesRptGridState,
                //     importInGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(importInDetailGrid, importInDetailGridColumns);
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
      onSortingChange: setSortingImportInDetailGrid,
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

              <div className="font-semibold">Import In Detail</div>
              <div className="text-sm font-thin mt-1 text-gray-600 dark:text-gray-400">
                Import In No:{' '}
                {detailEditModalInfo?.importInInfoGridRow?.importInNo}
              </div>
              <div className="text-sm font-thin text-gray-600 dark:text-gray-400">
                Supplier:{' '}
                {detailEditModalInfo?.importInInfoGridRow?.supplierName}
              </div>
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="w-full m-1 modifiedEditTable">
                <MaterialReactTable table={importInDetailGridInitializer} />
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
                    saveImportInDetailAndImportInDetailSerial();
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
          <ImportInDetailSerial
            serialEditModalInfo={serialEditModalInfo}
            // importInDetailSerialRows={importInDetailSerialRows}
            // setImportInDetailSerialRows={setImportInDetailSerialRows}
            importInDetailGrid={importInDetailGrid}
            setImportInDetailGrid={setImportInDetailGrid}
            deletedImportInDetailSerialRows={deletedImportInDetailSerialRows}
            setDeletedImportInDetailSerialRows={
              setDeletedImportInDetailSerialRows
            }
            handleSerialEditModalClose={handleSerialEditModalClose}
          />
        </Box>
      </Modal>

      {/* // modals --- out of html normal body/position */}
    </div>
  );
};

export default ImportInDetail;
