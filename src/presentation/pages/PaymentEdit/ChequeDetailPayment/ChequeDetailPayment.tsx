/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
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
import { useForm } from 'react-hook-form';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ShowHideColumnsButton,
  MRT_Virtualizer,
  useMaterialReactTable,
} from 'material-react-table';
import { toast } from 'react-toastify';
import { ExportToCsv } from 'export-to-csv';
import { Delete } from '@mui/icons-material';
import dayjs from 'dayjs';

import {
  IChequeDetailPaymentInfo,
  IChequeHistory,
  IPaymentInfo,
  IDeleteChequeAWBPaymentCommand,
  IDeleteChequeDetailPaymentCommand,
  IDeleteChequeHistoryPaymentCommand,
} from '../../../../domain/interfaces/PaymentInterface';
import { useLazyGetChequeDetailPaymentByPaymentIdQuery } from '../../../../infrastructure/api/PaymentApiSlice';
import { useGetBanksComboOptionsQuery } from '../../../../infrastructure/api/GetBanksForChequeBookApiSlice';
import ChequeHistory from './ChequeHistory/ChequeHistory';

interface ChequeDetailPaymentProps {
  paymentGrid: IPaymentInfo[];
  setPaymentGrid: React.Dispatch<React.SetStateAction<any[]>>;

  chequeDetailPaymentRows: IChequeDetailPaymentInfo[];
  setChequeDetailPaymentRows: React.Dispatch<React.SetStateAction<any[]>>;

  deletedChequeDetailPaymentRows: IDeleteChequeDetailPaymentCommand[];
  setDeletedChequeDetailPaymentRows: React.Dispatch<
    React.SetStateAction<any[]>
  >;

  deletedChequeHistoryRows: IDeleteChequeHistoryPaymentCommand[];
  setDeletedChequeHistoryRows: React.Dispatch<React.SetStateAction<any[]>>;

  deletedChequeAWBPaymentRows: IDeleteChequeAWBPaymentCommand[];
  setDeletedChequeAWBPaymentRows: React.Dispatch<React.SetStateAction<any[]>>;

  selectPaymentRowByPaymentId: (paymentId: number) => void;
  detailEditModalInfo: any;
  setDetailEditModalInfo: React.Dispatch<React.SetStateAction<any[]>>;
  handleDetailEditModalClose: () => void;
}

const ChequeDetailPayment: React.FC<ChequeDetailPaymentProps> = ({
  paymentGrid,
  setPaymentGrid,
  chequeDetailPaymentRows,
  setChequeDetailPaymentRows,
  deletedChequeDetailPaymentRows,
  setDeletedChequeDetailPaymentRows,

  deletedChequeHistoryRows,
  setDeletedChequeHistoryRows,
  deletedChequeAWBPaymentRows,
  setDeletedChequeAWBPaymentRows,

  detailEditModalInfo,
  setDetailEditModalInfo,
  handleDetailEditModalClose,
  selectPaymentRowByPaymentId,
}) => {
  const { control } = useForm({ mode: 'onBlur' });

  const [chequeDetailPaymentGrid, setChequeDetailPaymentGrid] = useState<
    IChequeDetailPaymentInfo[]
  >([]);
  const [chequeDetailPaymentGridPrev, setChequeDetailPaymentGridPrev] =
    useState<IChequeDetailPaymentInfo[]>([]);

  const [deletedRowChequeDetailPayment, setDeletedRowChequeDetailPayment] =
    useState<IDeleteChequeDetailPaymentCommand[]>([]);

  const [deletedChequeHistories, setDeletedChequeHistories] = useState<
    IDeleteChequeHistoryPaymentCommand[]
  >([]);

  const [deletedChequeAWBPayments, setDeletedChequeAWBPayments] = useState<
    IDeleteChequeAWBPaymentCommand[]
  >([]);

  const [columnVisibility, setColumnVisibility] = useState<any>([]);
  const [
    isChequeDetailPaymentGridLoading,
    setIsChequeDetailPaymentGridLoading,
  ] = useState(true);
  const [sortingChequeDetailPaymentGrid, setSortingChequeDetailPaymentGrid] =
    useState<MRT_SortingState>([]);

  //  ChequeHistory modal state (MODAL IS IN THIS FILE)
  const [chequeHistoryOpen, setChequeHistoryOpen] = useState(false);
  const [chequeHistoryRows, setChequeHistoryRows] = useState<IChequeHistory[]>(
    []
  );
  const [chequeHistoryRowIndex, setChequeHistoryRowIndex] = useState<
    number | null
  >(null);

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) userInfo = JSON.parse(jsonUserInfo);

  const [
    triggerGetChequeDetailPaymentInfo,
    {
      data: chequeDetailPaymentInfoData,
      error: chequeDetailPaymentInfoError,
      isError: chequeDetailPaymentInfoIsError,
      isSuccess: chequeDetailPaymentInfoIsSuccess,
      isLoading: chequeDetailPaymentInfoIsLoading,
      isFetching: chequeDetailPaymentInfoIsFetching,
    },
  ] = useLazyGetChequeDetailPaymentByPaymentIdQuery();

  useEffect(() => {
    const chequeDetailPaymentRowsCopy: IChequeDetailPaymentInfo[] = JSON.parse(
      JSON.stringify(chequeDetailPaymentRows)
    );
    const existingChequeDetailPaymentRows = chequeDetailPaymentRowsCopy.filter(
      (row) => row.paymentId === detailEditModalInfo?.paymentId
    );
    const existingChequeDetailPaymentDeletedRows =
      deletedChequeDetailPaymentRows.filter(
        (row) => row.paymentId === detailEditModalInfo?.paymentId
      );
    const existingChequeHistoryDeletedRows = deletedChequeHistoryRows.filter(
      (row) => row.paymentId === detailEditModalInfo?.paymentId
    );
    const existingChequeAWBPaymentDeletedRows =
      deletedChequeAWBPaymentRows.filter(
        (row) => row.paymentId === detailEditModalInfo?.paymentId
      );

    if (chequeDetailPaymentInfoIsError) {
      toast.error(
        'Something wrong from backend while fetching chequeDetailPaymentInfoData, see console!'
      );
      console.log(chequeDetailPaymentInfoError);

      const data: IChequeDetailPaymentInfo[] = [];
      while (data.length < 10) {
        data.push({
          chequeDetailPaymentId: '',
          paymentId: 0,
          chequeNo: '',
          bankId: null,
          bankName: '',
          chequeDate: '',
          chequeAmount: null,
          cqdCollected: null,
          sendDate: '',
          honorDate: null,
          date: null,
          dateOfEntry: '',
          sendBankId: null,
          sendBankName: '',
          disreason: null,
          remarks: null,
          chequeHistories: [],
          chequeAWBPayments: [],
        } as any);
      }
      setChequeDetailPaymentGrid([...data]);
      setChequeDetailPaymentGridPrev([]);
      setIsChequeDetailPaymentGridLoading(false);
    }

    if (
      (existingChequeDetailPaymentRows.length ||
        existingChequeDetailPaymentDeletedRows.length ||
        existingChequeHistoryDeletedRows.length ||
        existingChequeAWBPaymentDeletedRows.length) &&
      chequeDetailPaymentInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !chequeDetailPaymentInfoIsLoading &&
      !chequeDetailPaymentInfoIsError &&
      !chequeDetailPaymentInfoIsFetching
    ) {
      const data: IChequeDetailPaymentInfo[] = JSON.parse(
        JSON.stringify([...existingChequeDetailPaymentRows])
      );
      const data2: IChequeDetailPaymentInfo[] = JSON.parse(
        JSON.stringify([...existingChequeDetailPaymentRows])
      );

      while (data.length < 10) {
        data.push({
          chequeDetailPaymentId: '',
          paymentId: 0,
          chequeNo: '',
          bankId: null,
          bankName: '',
          chequeDate: '',
          chequeAmount: null,
          cqdCollected: null,
          sendDate: '',
          honorDate: null,
          date: null,
          dateOfEntry: '',
          sendBankId: null,
          sendBankName: '',
          disreason: null,
          remarks: null,
          chequeHistories: [],
          chequeAWBPayments: [],
        } as any);
      }

      setChequeDetailPaymentGrid(JSON.parse(JSON.stringify([...data])));
      setChequeDetailPaymentGridPrev(JSON.parse(JSON.stringify([...data2])));
      setIsChequeDetailPaymentGridLoading(false);
    } else if (
      !existingChequeDetailPaymentRows.length &&
      !existingChequeDetailPaymentDeletedRows.length &&
      !existingChequeHistoryDeletedRows.length &&
      !existingChequeAWBPaymentDeletedRows.length &&
      chequeDetailPaymentInfoIsSuccess &&
      typeof window !== 'undefined' &&
      !chequeDetailPaymentInfoIsLoading &&
      !chequeDetailPaymentInfoIsError &&
      !chequeDetailPaymentInfoIsFetching
    ) {
      const data: IChequeDetailPaymentInfo[] = JSON.parse(
        JSON.stringify([...(chequeDetailPaymentInfoData ?? [])])
      );
      const data2: IChequeDetailPaymentInfo[] = JSON.parse(
        JSON.stringify([...(chequeDetailPaymentInfoData ?? [])])
      );

      while (data.length < 10) {
        data.push({
          chequeDetailPaymentId: '',
          paymentId: 0,
          chequeNo: '',
          bankId: null,
          bankName: '',
          chequeDate: '',
          chequeAmount: null,
          cqdCollected: null,
          sendDate: '',
          honorDate: null,
          date: null,
          dateOfEntry: '',
          sendBankId: null,
          sendBankName: '',
          disreason: null,
          remarks: null,
          chequeHistories: [],
          chequeAWBPayments: [],
        } as any);
      }

      setChequeDetailPaymentGrid(JSON.parse(JSON.stringify([...data])));
      setChequeDetailPaymentGridPrev(JSON.parse(JSON.stringify([...data2])));
      setIsChequeDetailPaymentGridLoading(false);
    } else if (typeof window === 'undefined') {
      setIsChequeDetailPaymentGridLoading(true);
    }
  }, [
    chequeDetailPaymentInfoData,
    chequeDetailPaymentInfoIsLoading,
    chequeDetailPaymentInfoError,
    chequeDetailPaymentInfoIsError,
    chequeDetailPaymentInfoIsFetching,
    chequeDetailPaymentInfoIsSuccess,
    detailEditModalInfo?.paymentId,
  ]);

  const {
    data: bankComboOptions,
    isError: bankComboOptionsIsError,
    error: bankComboOptionsError,
  } = useGetBanksComboOptionsQuery({
    companyId: userInfo?.companyId || 0,
  });

  useEffect(() => {
    if (bankComboOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching bankComboOptions for autocomplete, see console!'
      );
      console.log(bankComboOptionsError);
    }
  }, [bankComboOptionsIsError, bankComboOptionsError]);

  useEffect(() => {
    triggerGetChequeDetailPaymentInfo({
      paymentId: detailEditModalInfo?.paymentId,
      biznessEventId: 1,
      companyId: userInfo?.companyId,
      userId: userInfo?.securityUserId,
    });
  }, []);

  //  open history modal for a row (NOW PARENT OWNS MODAL)
  const openHistoryModalForRow = useCallback(
    (rowIndex: number) => {
      const row = chequeDetailPaymentGrid[rowIndex];
      if (!row || !row.chequeNo) return;

      const rows = (row.chequeHistories ?? []) as IChequeHistory[];
      setChequeHistoryRows([...rows]);
      setChequeHistoryRowIndex(rowIndex);
      setChequeHistoryOpen(true);
    },
    [chequeDetailPaymentGrid]
  );

  const statusMap: Record<string, string> = {
    F: 'Fresh Cheque',
    S: 'Sent to Bank',
    H: 'Honor',
    D: 'Dishonor',
    B: 'Adjusted with Balance',
  };

  interface AutoCompResStyles {
    popper: { maxWidth: string; fontSize: string };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: { maxWidth: 'fit-content', fontSize: '0.75rem' },
  };

  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  );

  const handleExportData = (gridData: any[], gridColumns: any) => {
    if (!gridData.length) {
      toast.info('No data to download');
      return;
    }

    const falsePropertiesArr = Object.keys(columnVisibility).filter(
      (property) => columnVisibility[property] === false
    );

    const visibleGridDataTbColXcel = gridColumns
      .filter(
        (column: any) =>
          column?.id &&
          column?.id !== 'Actions' &&
          column?.id !== 'delete' &&
          !falsePropertiesArr.includes(column.id)
      )
      .map(({ id, header }: any) => ({ id, header }));

    const gridDataTbXCEL = gridData.map((item: any) => {
      return Object.keys(item).reduce((acc: any, key: any) => {
        if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });

    const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
      const sortedItem: any = {};
      visibleGridDataTbColXcel.forEach((column: any) => {
        sortedItem[column.id] = item[column.id];
      });
      return sortedItem;
    });

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

  const chequeDetailPaymentGridColumns = useMemo<
    MRT_ColumnDef<IChequeDetailPaymentInfo>[]
  >(
    () => [
      {
        id: 'delete',
        header: '',
        size: 1,
        grow: false,
        muiTableHeadCellProps: () => ({ align: 'left' }),
        Cell: ({ row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={row.original.chequeNo ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  if (row.original.chequeDetailPaymentId) {
                    const tempDeletedObj: IDeleteChequeDetailPaymentCommand = {
                      chequeDetailPaymentId: row.original.chequeDetailPaymentId,
                      paymentId: detailEditModalInfo?.paymentId,
                      chequeNo: row.original.chequeNo,
                    };
                    deletedRowChequeDetailPayment?.push(tempDeletedObj);
                  }
                  chequeDetailPaymentGrid?.splice(row.index, 1);
                  if (chequeDetailPaymentGrid) {
                    setChequeDetailPaymentGrid([...chequeDetailPaymentGrid]);
                    setDeletedRowChequeDetailPayment([
                      ...deletedRowChequeDetailPayment,
                    ]);
                  } else {
                    setChequeDetailPaymentGrid([]);
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
        accessorFn: (row) => row.chequeNo ?? '',
        id: 'chequeNo',
        enableGlobalFilter: columnVisibility?.chequeNo,
        header: 'Cheque No',
        Cell: ({ renderedCellValue }) => (
          <TextField
            type="text"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={renderedCellValue as any}
          />
        ),
      },

      {
        accessorFn: (row) => row.bankName ?? '',
        id: 'bankName',
        enableGlobalFilter: columnVisibility?.bankName,
        header: 'Bank Name',
        Cell: ({ renderedCellValue }) => (
          <TextField
            type="text"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={renderedCellValue as any}
          />
        ),
      },

      {
        accessorFn: (row) => row.chequeDate ?? '',
        enableGlobalFilter: columnVisibility?.chequeDate,
        id: 'chequeDate',
        header: 'Cheque Date',
        Cell: ({ row }) => (
          <TextField
            type="text"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={
              row.original.chequeDate
                ? dayjs(row.original.chequeDate).format('DD/MM/YYYY')
                : ''
            }
          />
        ),
      },

      {
        accessorFn: (row) => row.chequeAmount ?? '',
        id: 'chequeAmount',
        enableGlobalFilter: columnVisibility?.chequeAmount,
        header: 'Cheque Amount',
        size: 120,
        grow: false,
        muiTableHeadCellProps: () => ({ align: 'left' }),
        Cell: ({ renderedCellValue }) => (
          <TextField
            type="number"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={renderedCellValue as any}
          />
        ),
      },

      {
        accessorFn: (row) => row.cqdCollected ?? '',
        id: 'cqdCollected',
        enableGlobalFilter: columnVisibility?.cqdCollected,
        header: 'Status',
        Cell: ({ row }) => {
          if (!row.original.chequeNo) {
            return (
              <Box
                sx={{
                  width: '100%',
                  minHeight: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  fontSize: '0.8125rem',
                }}
              />
            );
          }

          const code = row.original.cqdCollected || '';
          const label = statusMap[code] || '';

          return (
            <Box
              sx={{
                width: '100%',
                minHeight: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                fontSize: '0.8125rem',
              }}
            >
              <span>
                {label || <span style={{ color: '#bdbdbd' }}>—</span>}
              </span>

              <Tooltip title="Undo / View History">
                <IconButton
                  size="small"
                  onClick={() => openHistoryModalForRow(row.index)}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },

      {
        accessorFn: (row) => row.sendBankName ?? '',
        id: 'sendBankName',
        enableGlobalFilter: columnVisibility?.sendBankName,
        header: 'Send Bank Name',
        Cell: ({ row }) => (
          <TextField
            type="text"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={row.original.sendBankName ? row.original.sendBankName : ''}
          />
        ),
      },

      {
        accessorFn: (row) => row.disreason ?? '',
        id: 'disreason',
        enableGlobalFilter: columnVisibility?.disreason,
        header: 'Disreason',
        size: 120,
        grow: false,
        muiTableHeadCellProps: () => ({ align: 'left' }),
        Cell: ({ renderedCellValue }) => (
          <TextField
            type="text"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={renderedCellValue as any}
          />
        ),
      },

      {
        accessorFn: (row) => row.remarks ?? '',
        id: 'remarks',
        enableGlobalFilter: columnVisibility?.remarks,
        header: 'Remarks',
        size: 120,
        grow: false,
        muiTableHeadCellProps: () => ({ align: 'left' }),
        Cell: ({ renderedCellValue }) => (
          <TextField
            type="text"
            sx={{ width: '100%' }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
              readOnly: true,
            }}
            variant="standard"
            size="small"
            value={renderedCellValue as any}
          />
        ),
      },
    ],
    [
      PopperMy,
      bankComboOptions,
      chequeDetailPaymentGrid,
      chequeDetailPaymentGridPrev,
      columnVisibility?.chequeNo,
      columnVisibility?.bankName,
      columnVisibility?.chequeDate,
      columnVisibility?.chequeAmount,
      columnVisibility?.cqdCollected,
      columnVisibility?.sendBankName,
      columnVisibility?.disreason,
      columnVisibility?.remarks,
      control,
      deletedRowChequeDetailPayment,
      detailEditModalInfo?.paymentId,
      openHistoryModalForRow,
      statusMap,
    ]
  );

  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sortingChequeDetailPaymentGrid]);

  const chequeDetailPaymentGridInitializer: MRT_TableInstance<IChequeDetailPaymentInfo> =
    useMaterialReactTable({
      columns: chequeDetailPaymentGridColumns,
      data: chequeDetailPaymentGrid || [],
      state: {
        columnVisibility,
        isLoading: isChequeDetailPaymentGridLoading,
        sorting: sortingChequeDetailPaymentGrid,
      },
      positionToolbarAlertBanner: 'none',
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: { animation: 'pulse', height: '1.875rem' },
      enableRowVirtualization: true,
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enableFilterMatchHighlighting: false,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',
      initialState: { density: 'compact' },
      muiTablePaperProps: {
        elevation: 0,
        sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
      },
      muiTableBodyCellProps: { sx: { fontSize: '0.8125rem', color: '#ea1143' } },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
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
              onClick={() =>
                handleExportData(
                  chequeDetailPaymentGrid,
                  chequeDetailPaymentGridColumns
                )
              }
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
        </>
      ),
      onSortingChange: setSortingChequeDetailPaymentGrid,
      rowVirtualizerInstanceRef,
      rowVirtualizerOptions: { overscan: 10 },
    });

  const saveChequeDetailPayment = () => {
    const tempChequeDetailPaymentRows: IChequeDetailPaymentInfo[] = JSON.parse(
      JSON.stringify([...chequeDetailPaymentGrid])
    );

    const tempChequeDetailPaymentRowsWithoutEmpty =
      tempChequeDetailPaymentRows.filter(
        (obj) => obj.chequeNo && obj.chequeAmount
      );

    if (
      JSON.stringify(tempChequeDetailPaymentRowsWithoutEmpty) ===
      JSON.stringify(chequeDetailPaymentGridPrev)
    ) {
      toast.info('No changes to save!');
      return;
    }

    const deletedChequeDetailPaymentArray: IDeleteChequeDetailPaymentCommand[] =
      JSON.parse(JSON.stringify([...deletedChequeDetailPaymentRows]));
    for (let i = 0; i < deletedRowChequeDetailPayment.length; i++) {
      const tempDeleteObj: IDeleteChequeDetailPaymentCommand = {
        chequeDetailPaymentId:
          deletedRowChequeDetailPayment[i].chequeDetailPaymentId,
        paymentId: deletedRowChequeDetailPayment[i].paymentId,
        chequeNo: deletedRowChequeDetailPayment[i].chequeNo,
      };
      deletedChequeDetailPaymentArray.push(tempDeleteObj);
    }
    setDeletedChequeDetailPaymentRows([
      ...new Set(deletedChequeDetailPaymentArray),
    ]);

    const deletedChequeHistoryArray: IDeleteChequeHistoryPaymentCommand[] =
      JSON.parse(JSON.stringify([...deletedChequeHistoryRows]));
    for (let i = 0; i < deletedChequeHistories.length; i++) {
      const tempDeleteObj: IDeleteChequeHistoryPaymentCommand = {
        chequeHistoryId: deletedChequeHistories[i].chequeHistoryId,
        paymentId: deletedChequeHistories[i].paymentId,
        chequeNo: deletedChequeHistories[i].chequeNo,
        supplierId: deletedChequeHistories[i].supplierId,
        treatment: deletedChequeHistories[i].treatment,
        bankId: deletedChequeHistories[i].bankId,
        sendBankId: deletedChequeHistories[i].sendBankId || null,
      };
      deletedChequeHistoryArray.push(tempDeleteObj);
    }
    setDeletedChequeHistoryRows([...new Set(deletedChequeHistoryArray)]);

    const deletedChequeAWBPaymentArray: IDeleteChequeAWBPaymentCommand[] =
      JSON.parse(JSON.stringify([...deletedChequeAWBPaymentRows]));
    for (let i = 0; i < deletedChequeAWBPayments.length; i++) {
      const tempDeleteObj: IDeleteChequeAWBPaymentCommand = {
        chequeAWBPaymentId: deletedChequeAWBPayments[i].chequeAWBPaymentId,
        paymentId: deletedChequeAWBPayments[i].paymentId,
      };
      deletedChequeAWBPaymentArray.push(tempDeleteObj);
    }
    setDeletedChequeAWBPaymentRows([...new Set(deletedChequeAWBPaymentArray)]);

    const paidAmount = tempChequeDetailPaymentRowsWithoutEmpty.reduce(
      (sum, obj) => sum + (obj.chequeAmount || 0),
      0
    );

    paymentGrid[detailEditModalInfo?.paymentInfoGridIndex].paidAmount =
      paidAmount;

    // setChequeDetailPaymentRows([...tempChequeDetailPaymentRowsWithoutEmpty]);

    // 1️⃣ remove matching rows
    const filteredChequeDetailPaymentRows = chequeDetailPaymentRows.filter(
      (row) => row.chequeNo !== detailEditModalInfo?.chequeNo
    );
    // 2️⃣ merge arrays
    const updatedChequeDetailPaymentDetailRows = [
      ...filteredChequeDetailPaymentRows,
      ...tempChequeDetailPaymentRowsWithoutEmpty,
    ];

    setChequeDetailPaymentRows([...updatedChequeDetailPaymentDetailRows]);

    setPaymentGrid([...paymentGrid]);
    setChequeDetailPaymentGrid([...tempChequeDetailPaymentRows]);
    selectPaymentRowByPaymentId(detailEditModalInfo?.paymentId);
    handleDetailEditModalClose();
  };

  return (
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-[100%]">
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              <div className="font-semibold">Cheque Detail</div>
              <div className="text-sm font-thin mt-1 text-gray-600 dark:text-gray-400">
                Payment No: {detailEditModalInfo?.paymentInfoGridRow?.paymentNo}
              </div>
              <div className="text-sm font-thin text-gray-600 dark:text-gray-400">
                Supplier:{' '}
                {detailEditModalInfo?.paymentInfoGridRow?.supplierName}
              </div>
            </div>

            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="w-full m-1 modifiedEditTable">
                <MaterialReactTable
                  table={chequeDetailPaymentGridInitializer}
                />
              </div>
            </div>

            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => saveChequeDetailPayment()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  ChequeHistory MODAL IS HERE (NO transform -> fullscreen works) */}
      <Modal
        open={chequeHistoryOpen}
        onClose={() => setChequeHistoryOpen(false)}
      >
        <Box
          sx={{
            // IMPORTANT: flex centering (NO transform)
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box
            sx={{
              width: '80vw',
              maxWidth: '68.75rem',
              maxHeight: '85vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div className="flex justify-between items-center mb-2 px-6 pt-4">
              <div className="py-2 bg-white text-xl dark:text-gray-200 text-start border-gray-300">
                <div className="font-semibold">Cheque History</div>
                <div className="text-sm font-thin mt-1 text-gray-600 dark:text-gray-400">
                  Cheque No:{' '}
                  {chequeHistoryRowIndex !== null
                    ? chequeDetailPaymentGrid[chequeHistoryRowIndex]?.chequeNo
                    : ''}
                </div>
              </div>

              <IconButton
                size="small"
                onClick={() => setChequeHistoryOpen(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>

            <div className="modifiedEditTable px-2 pb-4">
              <ChequeHistory
                histories={chequeHistoryRows}
                chequeDetailPaymentRowIndex={chequeHistoryRowIndex}
                chequeDetailPaymentGrid={chequeDetailPaymentGrid}
                setChequeDetailPaymentGrid={setChequeDetailPaymentGrid}
                setChequeHistoryRows={setChequeHistoryRows}
                deletedChequeHistories={deletedChequeHistories}
                setDeletedChequeHistories={setDeletedChequeHistories}
                deletedChequeAWBPayments={deletedChequeAWBPayments}
                setDeletedChequeAWBPayments={setDeletedChequeAWBPayments}
                supplierId={
                  detailEditModalInfo?.paymentInfoGridRow.supplierId || 0
                }
              />
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ChequeDetailPayment;
