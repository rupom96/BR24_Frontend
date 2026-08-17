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
  IDeleteSalesReturnDetailSerialCommand,
  IDeleteSalesReturnDetailCommand,
  IDeleteSalesReturnDetailTaxCommand,
  ISalesReturnDetailSerialInfo,
  ISalesReturnDetailInfo,
  ISalesReturnInfo,
} from '../../../../domain/interfaces/SalesReturnInterface';
import { useGetProductByCompanyProductGroupIdQuery } from '../../../../infrastructure/api/ProductApiSlice';
// import { useLazyGetSalesReturnDetailBySalesReturnIdCopyQuery } from '../../../../infrastructure/api/SalesReturnApiSlice';
import SalesReturnDetailSerial from './SalesReturnDetailSerial/SalesReturnDetailSerial';
import { useLazyGetSalesReturnDetailBySalesReturnIdCopyQuery } from '../../../../infrastructure/api/SalesReturnApiSlice';

interface SalesReturnDetailProps {
  salesReturnGrid: ISalesReturnInfo[];
  setSalesReturnGrid: React.Dispatch<React.SetStateAction<any[]>>;

  salesReturnDetailRows: ISalesReturnDetailInfo[];
  setSalesReturnDetailRows: React.Dispatch<React.SetStateAction<any[]>>;

  deletedSalesReturnDetailRows: IDeleteSalesReturnDetailCommand[];
  setDeletedSalesReturnDetailRows: React.Dispatch<React.SetStateAction<any[]>>;
  deletedSalesReturnDetailSerialRows: IDeleteSalesReturnDetailSerialCommand[];
  setDeletedSalesReturnDetailSerialRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  deletedSalesReturnDetailTaxRows: IDeleteSalesReturnDetailTaxCommand[];
  setDeletedSalesReturnDetailTaxRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;
  detailEditModalInfo: any;
  setDetailEditModalInfo: React.Dispatch<React.SetStateAction<any[]>>;
  handleDetailEditModalClose: () => void;
  selectSalesReturnRowBySalesReturnId: (salesReturnId: string) => void;
}

// interface ChequeBookLeafProps {
//   chequeBookInfo: IChequeBook | null | undefined;
//   chequeBookMasterRefetch: VoidFunction;
// }

// const ChequeBookLeaf: React.FC<ChequeBookLeafProps> = ({
//   chequeBookInfo,
//   chequeBookMasterRefetch,
// }) => {

const SalesReturnDetail: React.FC<SalesReturnDetailProps> = ({
  salesReturnGrid,
  setSalesReturnGrid,
  salesReturnDetailRows,
  setSalesReturnDetailRows,
  deletedSalesReturnDetailRows,
  setDeletedSalesReturnDetailRows,
  deletedSalesReturnDetailSerialRows,
  setDeletedSalesReturnDetailSerialRows,
  detailEditModalInfo,
  setDetailEditModalInfo,
  handleDetailEditModalClose,
  selectSalesReturnRowBySalesReturnId,
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
    //   salesReturn: null,
    //   buyer: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });

  const [salesReturnDetailGrid, setSalesReturnDetailGrid] = useState<
    ISalesReturnDetailInfo[]
  >([]);
  const [salesReturnDetailGridPrev, setSalesReturnDetailGridPrev] = useState<
    ISalesReturnDetailInfo[]
  >([]);

  const [deletedRowSalesReturnDetail, setDeletedRowSalesReturnDetail] =
    useState<IDeleteSalesReturnDetailCommand[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);
  //   grid virtualization states
  const [isSalesReturnDetailGridLoading, setIsSalesReturnDetailGridLoading] =
    useState(true);
  const [sortingSalesReturnDetailGrid, setSortingSalesReturnDetailGrid] =
    useState<MRT_SortingState>([]);

  const [serialEditModalInfo, setSerialEditModalInfo] = useState<any>();

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }
  // -----------------------------------API HOOK INIT-----------------------------------------

  const [
    triggerGetSalesReturnDetailInfo,
    {
      data: salesReturnDetailInfoData,
      error: salesReturnDetailInfoError,
      isError: salesReturnDetailInfoIsError,
      isSuccess: salesReturnDetailInfoIsSuccess,
      isLoading: salesReturnDetailInfoIsLoading,
      isFetching: salesReturnDetailInfoIsFetching,
    },
  ] = useLazyGetSalesReturnDetailBySalesReturnIdCopyQuery(); // RTK Query lazy fetch

  useEffect(() => {
    const salesReturnDetailRowsCopy: ISalesReturnDetailInfo[] = JSON.parse(
      JSON.stringify(salesReturnDetailRows)
    );
    const existingSalesReturnDetailRows = salesReturnDetailRowsCopy.filter(
      (row) => row.salesReturnId === detailEditModalInfo?.salesReturnId
    );
    const existingSalesReturnDetailDeletedRows =
      deletedSalesReturnDetailRows.filter(
        (row) => row.salesReturnId === detailEditModalInfo?.salesReturnId
      );

    const existingSalesReturnDetailSerialDeletedRows =
      deletedSalesReturnDetailSerialRows.filter(
        (row) => row.salesReturnId === detailEditModalInfo?.salesReturnId
      );

    if (salesReturnDetailInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching salesReturnDetailInfoData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching salesReturnDetailInfoData, see console--->:'
      );
      console.log(salesReturnDetailInfoError);

      const data: ISalesReturnDetailInfo[] = [];

      // Fill remaining with empty rows
      // while (data.length < 10) {
      //   data.push({
      //     salesReturnId: '',
      //     salesReturnDetailId: '',
      //     lPurchaseId: null,
      //     productId: 0,
      //     productName: '',
      //     price: null,
      //     quantity: null,
      //     taxAmount: null,
      //     vatAmount: null,
      //     isSerialProduct: false,
      //     salesReturnDetailSerialInfoDto: [],
      //     unitTypeId: 0,
      //     // discount: null,
      //     // locationId: null,
      //   });
      // }
      setSalesReturnDetailGrid([...data]);
      setSalesReturnDetailGridPrev([]);

      setIsSalesReturnDetailGridLoading(false);
    }

    if (
      // maane ei salesReturn row er jonno jodi salesReturnDetail aager theke user set met koira thakle oidai load hoibo... na thakle db/api theke load hobe
      (existingSalesReturnDetailRows.length ||
        existingSalesReturnDetailDeletedRows.length ||
        existingSalesReturnDetailSerialDeletedRows.length) &&
      salesReturnDetailInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !salesReturnDetailInfoIsLoading &&
      !salesReturnDetailInfoIsError &&
      !salesReturnDetailInfoIsFetching
    ) {
      console.log('existingSalesReturnDetailRows');
      console.log(existingSalesReturnDetailRows);

      const data: ISalesReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...existingSalesReturnDetailRows])
      );
      const data2: ISalesReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...existingSalesReturnDetailRows])
      );

      // Fill remaining with empty rows
      // while (data.length < 10) {
      //   data.push({
      //     salesReturnId: '',
      //     salesReturnDetailId: '',
      //     lPurchaseId: null,
      //     productId: 0,
      //     productName: '',
      //     price: null,
      //     quantity: null,
      //     taxAmount: null,
      //     vatAmount: null,
      //     isSerialProduct: false,
      //     salesReturnDetailSerialInfoDto: [],
      //     unitTypeId: 0,
      //     // discount: null,
      //     // locationId: null,
      //   });
      // }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setSalesReturnDetailGrid([...dataCopy]);
      setSalesReturnDetailGridPrev([...dataCopy2]);
      setIsSalesReturnDetailGridLoading(false);
    } else if (
      !existingSalesReturnDetailRows.length &&
      !existingSalesReturnDetailDeletedRows.length &&
      !existingSalesReturnDetailSerialDeletedRows.length &&
      salesReturnDetailInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !salesReturnDetailInfoIsLoading &&
      !salesReturnDetailInfoIsError &&
      !salesReturnDetailInfoIsFetching
    ) {
      console.log('salesReturnDetailInfoIsSuccess');
      console.log(salesReturnDetailInfoData);

      const data: ISalesReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...(salesReturnDetailInfoData ?? [])])
      );
      const data2: ISalesReturnDetailInfo[] = JSON.parse(
        JSON.stringify([...(salesReturnDetailInfoData ?? [])])
      );

      // Fill remaining with empty rows
      // while (data.length < 10) {
      //   data.push({
      //     salesReturnId: '',
      //     salesReturnDetailId: '',
      //     lPurchaseId: null,
      //     productId: 0,
      //     productName: '',
      //     price: null,
      //     quantity: null,
      //     taxAmount: null,
      //     vatAmount: null,
      //     isSerialProduct: false,
      //     salesReturnDetailSerialInfoDto: [],
      //     unitTypeId: 0,
      //     // discount: null,
      //     // locationId: null,
      //   });
      // }

      const dataCopy = JSON.parse(JSON.stringify([...data]));
      const dataCopy2 = JSON.parse(JSON.stringify([...data2]));

      setSalesReturnDetailGrid([...dataCopy]);
      setSalesReturnDetailGridPrev([...dataCopy2]);
      setIsSalesReturnDetailGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsSalesReturnDetailGridLoading(true);
    }
  }, [
    salesReturnDetailInfoData,
    salesReturnDetailInfoIsLoading,
    salesReturnDetailInfoError,
    salesReturnDetailInfoIsError,
    salesReturnDetailInfoIsFetching,
    salesReturnDetailInfoIsSuccess,
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
  // Trigger GetSalesReturnDetail RTK Query whenever a form field changes
  useEffect(() => {
    // Trigger your RTK Query
    triggerGetSalesReturnDetailInfo({
      salesReturnId: detailEditModalInfo?.salesReturnId,
      //   buyerGroupId: buyerGroup?.buyerGroupId || null,
      // departmentId: department?.departmentId || null,
    });
  }, [detailEditModalInfo?.salesReturnId]);

  //   ----------------------------------FUNCTIONS------------------------------------
  const checkAndSetSalesReturnDetailTableValues = useCallback(
    (index: number) => {
      if (index === salesReturnDetailGrid.length - 1) {
        // const emptySalesReturnDetail: ISalesReturnDetailInfo = {
        //   salesReturnId: '',
        //   salesReturnDetailId: '',
        //   lPurchaseId: null,
        //   productId: 0,
        //   productName: '',
        //   price: null,
        //   quantity: null,
        //   taxAmount: null,
        //   vatAmount: null,
        //   isSerialProduct: false,
        //   salesReturnDetailSerialInfoDto: [],
        //   unitTypeId: 0,
        //   // discount: null,
        //   // locationId: null,
        // };
        // setSalesReturnDetailGrid([
        //   ...salesReturnDetailGrid,
        //   emptySalesReturnDetail,
        // ]);
        setSalesReturnDetailGrid([...salesReturnDetailGrid]);
      } else {
        setSalesReturnDetailGrid([...salesReturnDetailGrid]);
      }
    },
    [salesReturnDetailGrid]
  );

  const handleSerialEdit = (index: number, row: ISalesReturnDetailInfo) => {
    const objTemp = {
      salesReturnDetailIndex: index,
      salesReturnDetailRow: row,
      salesReturnDetailId: row.salesReturnDetailId || null,
      salesReturnId: row.salesReturnId,
      productId: row.productId,
      productName: row.productName,
      serialModalOpen: true,
    };

    setSerialEditModalInfo(objTemp);
  };

  const handleSerialEditModalClose = () => {
    const objTemp = {
      salesReturnDetailIndex: null,
      salesReturnDetailRow: null,
      salesReturnDetailId: null,
      salesReturnId: null,
      productId: null,
      productName: null,
      serialModalOpen: false,
    };

    setSerialEditModalInfo(objTemp);
  };

  const saveSalesReturnDetailAndSalesReturnDetailSerial = () => {
    console.log('SalesReturnDetail');
    console.log(salesReturnDetailGrid);

    console.log('DeletedRowSalesReturnDetail');
    console.log(deletedRowSalesReturnDetail);

    console.log('deletedSalesReturnDetailSerialRows');
    console.log(deletedSalesReturnDetailSerialRows);

    const tempSalesReturnDetailRows: ISalesReturnDetailInfo[] = JSON.parse(
      JSON.stringify([...salesReturnDetailGrid])
    );

    const tempSalesReturnDetailRowsWithoutEmpty =
      tempSalesReturnDetailRows.filter(
        (obj) => obj.productId && obj.quantity && obj.price
      );

    if (
      JSON.stringify(tempSalesReturnDetailRowsWithoutEmpty) ===
      JSON.stringify(salesReturnDetailGridPrev)
    ) {
      toast.info('No changes to save!');
      return;
    }

    // alert('helloww');
    // console.log('current tempSalesReturnDetailRowsWithoutEmpty');
    // console.log(tempSalesReturnDetailRowsWithoutEmpty);

    // storing deletedRowSalesReturnDetail to deletedSalesReturnDetailSerialRows(global)
    const deletedSalesReturnArray: IDeleteSalesReturnDetailCommand[] =
      JSON.parse(JSON.stringify([...deletedSalesReturnDetailRows]));
    for (let i = 0; i < deletedRowSalesReturnDetail.length; i++) {
      const tempDeleteObj: IDeleteSalesReturnDetailCommand = {
        salesReturnDetailId: deletedRowSalesReturnDetail[i].salesReturnDetailId,
        salesReturnId: detailEditModalInfo?.salesReturnId,
      };
      deletedSalesReturnArray.push(tempDeleteObj);
    }
    setDeletedSalesReturnDetailRows([...new Set(deletedSalesReturnArray)]);

    // storing salesReturnDetailGrid to salesReturnDetailRows

    const totalAmount = tempSalesReturnDetailRowsWithoutEmpty.reduce(
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
    const vat = tempSalesReturnDetailRowsWithoutEmpty.reduce((sum, obj) => {
      return sum + (obj.vatAmount || 0) * (obj.quantity || 0);
    }, 0);
    const tax = tempSalesReturnDetailRowsWithoutEmpty.reduce((sum, obj) => {
      return sum + (obj.taxAmount || 0) * (obj.quantity || 0);
    }, 0);

    console.log('totalAmount');
    console.log(totalAmount);

    console.log('vat');
    console.log(vat);

    console.log('tax');
    console.log(tax);

    salesReturnGrid[detailEditModalInfo?.salesReturnInfoGridIndex].totalAmount =
      totalAmount;
    salesReturnGrid[detailEditModalInfo?.salesReturnInfoGridIndex].vat = vat;
    salesReturnGrid[detailEditModalInfo?.salesReturnInfoGridIndex].tax = tax;

    console.log('setting the salesReturnDetail Array--->');
    console.log(tempSalesReturnDetailRowsWithoutEmpty);

    // setSalesReturnDetailRows([...tempSalesReturnDetailRowsWithoutEmpty]);
    // 1️⃣ remove matching rows
    const filteredSalesReturnDetailRows = salesReturnDetailRows.filter(
      (row) => row.salesReturnId !== detailEditModalInfo?.salesReturnId
    );
    // 2️⃣ merge arrays
    const updatedSalesOrderDetailRows = [
      ...filteredSalesReturnDetailRows,
      ...tempSalesReturnDetailRowsWithoutEmpty,
    ];

    setSalesReturnDetailRows([...updatedSalesOrderDetailRows]);
    // console.log(salesReturnDetailRows);
    setSalesReturnGrid([...salesReturnGrid]);
    selectSalesReturnRowBySalesReturnId(detailEditModalInfo?.salesReturnId);
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

  const salesReturnDetailGridColumns = useMemo<
    MRT_ColumnDef<ISalesReturnDetailInfo>[]
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
                  if (row.original.salesReturnDetailId) {
                    const tempDeletedObj: IDeleteSalesReturnDetailCommand = {
                      salesReturnDetailId: row.original.salesReturnDetailId,
                    };

                    // tax/vat delete from salesReturnDetailTax
                    const deleteArraySalesReturnDetailTax: IDeleteSalesReturnDetailTaxCommand[] =
                      [];
                    if (row.original.taxRowId) {
                      const tempObj: IDeleteSalesReturnDetailTaxCommand = {
                        salesReturnDetail_TaxId: row.original.taxRowId,
                        salesReturnId: row.original.salesReturnId,
                      };
                      deleteArraySalesReturnDetailTax.push(tempObj);
                    }

                    if (row.original.vatRowId) {
                      const tempObj: IDeleteSalesReturnDetailTaxCommand = {
                        salesReturnDetail_TaxId: row.original.vatRowId,
                        salesReturnId: row.original.salesReturnId,
                      };
                      deleteArraySalesReturnDetailTax.push(tempObj);
                    }
                    // tax/vat delete from salesReturnDetailTax...ENDS....

                    deletedRowSalesReturnDetail?.push(tempDeletedObj);
                  }
                  salesReturnDetailGrid?.splice(row.index, 1);
                  if (salesReturnDetailGrid) {
                    setSalesReturnDetailGrid([...salesReturnDetailGrid]);
                    setDeletedRowSalesReturnDetail([
                      ...deletedRowSalesReturnDetail,
                    ]);
                  } else {
                    setSalesReturnDetailGrid([]);
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

                    salesReturnDetailGrid[row.index].productId =
                      selectedOption?.productId || null;
                    salesReturnDetailGrid[row.index].productName =
                      selectedOption?.productName || '';

                    salesReturnDetailGrid[row.index].quantity = null;
                    salesReturnDetailGrid[row.index].price = null;

                    salesReturnDetailGrid[row.index].isSerialProduct =
                      selectedOption?.isSerialProduct || false;

                    salesReturnDetailGrid[row.index].unitTypeId =
                      selectedOption?.unitTypeId || 0;

                    salesReturnDetailGrid[row.index].salesReturnId =
                      detailEditModalInfo?.salesReturnId;

                    if (
                      salesReturnDetailGrid[row.index]
                        .salesReturnDetailSerialInfoDto.length > 0
                    ) {
                      const tempSalesReturnDetailSerialToDelete: IDeleteSalesReturnDetailSerialCommand[] =
                        [];

                      salesReturnDetailGrid[
                        row.index
                      ].salesReturnDetailSerialInfoDto.forEach(
                        (item, index) => {
                          if (item.salesReturnDetailSerialId) {
                            const tempObj: IDeleteSalesReturnDetailSerialCommand =
                              {
                                salesReturnDetailSerialId:
                                  item.salesReturnDetailSerialId,
                                salesReturnId:
                                  detailEditModalInfo?.salesReturnId || 0,
                              };
                            tempSalesReturnDetailSerialToDelete.push(tempObj);
                          }
                        }
                      );

                      salesReturnDetailGrid[
                        row.index
                      ].salesReturnDetailSerialInfoDto = [];
                    }
                    checkAndSetSalesReturnDetailTableValues(row.index);
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
                salesReturnDetailGrid[row.index].quantity = Number.isNaN(
                  parseInt(e.target.value, 10)
                )
                  ? null
                  : Math.abs(parseInt(e.target.value, 10));
                checkAndSetSalesReturnDetailTableValues(row.index);
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
                salesReturnDetailGrid[row.index].price = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetSalesReturnDetailTableValues(row.index);
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
                style: { fontSize: 13 },
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
                salesReturnDetailGrid[row.index].vatAmount = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetSalesReturnDetailTableValues(row.index);
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
                style: { fontSize: 13 },
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
                salesReturnDetailGrid[row.index].taxAmount = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetSalesReturnDetailTableValues(row.index);
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
      //           salesReturnDetailGrid[row.index].discount = Number.isNaN(
      //             parseFloat(e.target.value)
      //           )
      //             ? null
      //             : Math.abs(parseFloat(e.target.value));
      //           checkAndSetSalesReturnDetailTableValues(row.index);
      //         }}
      //       />
      //     );
      //   },
      // },
    ],
    [
      // PopperMy,
      // checkAndSetSalesReturnDetailTableValues,
      // columnVisibility?.price,
      // columnVisibility?.productName,
      // columnVisibility?.quantity,
      // control,
      // deletedRowSalesReturnDetail,
      // productComboOptions,
      // salesReturnDetailGrid,
      PopperMy,
      checkAndSetSalesReturnDetailTableValues,
      salesReturnDetailGrid,
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
  }, [sortingSalesReturnDetailGrid]);

  // ---------- material table virtualization---------

  const salesReturnDetailGridInitializer: MRT_TableInstance<ISalesReturnDetailInfo> =
    useMaterialReactTable({
      columns: salesReturnDetailGridColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: salesReturnDetailGrid || [],
      state: {
        // isLoading:
        //   buyerSalesRptGridInfoIsFetching || buyerSalesRptGridInfoLoading,
        columnVisibility,
        isLoading: isSalesReturnDetailGridLoading,
        sorting: sortingSalesReturnDetailGrid,
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
      //     return !!row.original.salesReturnId; // eikhane actually condition ta hobe= lastProcessedDate jodi monthYear er theke choto hoy, then enable selection, else disable selection... pore mone hoise, actually, eitai thikase, code e jeita lekha ekhon
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
                //     salesReturnGridColumns
                //   );
                // const buyerSalesRptGridInfoWithoutEmpty =
                //   buyerSalesRptGridInfo.filter(
                //     (row) => row.employeeId
                //   );
                handleExportData(
                  salesReturnDetailGrid,
                  salesReturnDetailGridColumns
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
      onSortingChange: setSortingSalesReturnDetailGrid,
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
              <div className="font-semibold">Sales Return Detail</div>
              <div className="text-sm font-thin mt-1 text-gray-600 dark:text-gray-400">
                Sales Return No:{' '}
                {detailEditModalInfo?.salesReturnInfoGridRow?.salesReturnNo}
              </div>
              <div className="text-sm font-thin text-gray-600 dark:text-gray-400">
                Buyer: {detailEditModalInfo?.salesReturnInfoGridRow?.buyerName}
              </div>
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="w-full m-1 modifiedEditTable">
                <MaterialReactTable table={salesReturnDetailGridInitializer} />
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
                    saveSalesReturnDetailAndSalesReturnDetailSerial();
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
          <SalesReturnDetailSerial
            serialEditModalInfo={serialEditModalInfo}
            // salesReturnDetailSerialRows={salesReturnDetailSerialRows}
            // setSalesReturnDetailSerialRows={setSalesReturnDetailSerialRows}
            salesReturnDetailGrid={salesReturnDetailGrid}
            setSalesReturnDetailGrid={setSalesReturnDetailGrid}
            deletedSalesReturnDetailSerialRows={
              deletedSalesReturnDetailSerialRows
            }
            setDeletedSalesReturnDetailSerialRows={
              setDeletedSalesReturnDetailSerialRows
            }
            handleSerialEditModalClose={handleSerialEditModalClose}
          />
        </Box>
      </Modal>

      {/* // modals --- out of html normal body/position */}
    </div>
  );
};

export default SalesReturnDetail;
