/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import React, { useMemo, useRef, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ShowHideColumnsButton,
  MRT_Virtualizer,
  useMaterialReactTable,
} from 'material-react-table';
import dayjs from 'dayjs';
import {
  IChequeDetailInfo,
  IChequeHistory,
  IDeleteChequeAWBCommand,
  IDeleteChequeHistoryCommand,
} from '../../../../../domain/interfaces/CollectionInterface';

interface ChequeHistoryProps {
  histories: IChequeHistory[];

  chequeDetailRowIndex: number | null;
  chequeDetailGrid: IChequeDetailInfo[];
  setChequeDetailGrid: React.Dispatch<
    React.SetStateAction<IChequeDetailInfo[]>
  >;

  setChequeHistoryRows: React.Dispatch<React.SetStateAction<IChequeHistory[]>>;

  deletedChequeHistories: IDeleteChequeHistoryCommand[];
  setDeletedChequeHistories: React.Dispatch<
    React.SetStateAction<IDeleteChequeHistoryCommand[]>
  >;

  deletedChequeAWBs: IDeleteChequeAWBCommand[];
  setDeletedChequeAWBs: React.Dispatch<
    React.SetStateAction<IDeleteChequeAWBCommand[]>
  >;

  buyerId: number;
}

const ChequeHistory: React.FC<ChequeHistoryProps> = ({
  histories,
  chequeDetailRowIndex,
  chequeDetailGrid,
  setChequeDetailGrid,
  setChequeHistoryRows,
  deletedChequeHistories,
  setDeletedChequeHistories,
  deletedChequeAWBs,
  setDeletedChequeAWBs,
  buyerId,
}) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [hoverFromIndex, setHoverFromIndex] = useState<number | null>(null);

  const tableRef = useRef<MRT_TableInstance<IChequeHistory> | null>(null);

  const statusMap: Record<string, string> = {
    F: 'Fresh Cheque',
    S: 'Sent to Bank',
    H: 'Honor',
    D: 'Dishonor',
    B: 'Adjusted with Balance',
  };

  const columns = useMemo<MRT_ColumnDef<IChequeHistory>[]>(
    () => [
      {
        accessorKey: 'treatment',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => {
          const code = cell.getValue<string>();
          return statusMap[code] || '';
        },
      },
      {
        accessorKey: 'treatmentDate',
        header: 'Status Date',
        size: 140,
        Cell: ({ cell }) => {
          const v = cell.getValue<string>();
          return v ? dayjs(v).format('DD/MM/YYYY') : '';
        },
      },
      { accessorKey: 'chequeNo', header: 'Cheque No', size: 140 },
      { accessorKey: 'bankName', header: 'Bank Name', size: 120 },
      { accessorKey: 'sendBankName', header: 'Send Bank', size: 130 },
      {
        accessorKey: 'dateOfEntry',
        header: 'Entry Date',
        size: 140,
        Cell: ({ cell }) => {
          const v = cell.getValue<string>();
          return v ? dayjs(v).format('DD/MM/YYYY') : '';
        },
      },
    ],
    []
  );

  //  select row + below, and clear anything above
  const selectRangeFromVisibleIndex = (visibleIndex: number) => {
    const table = tableRef.current;
    if (!table) return;

    const visibleRows = table.getRowModel().rows;
    const nextSelection: MRT_RowSelectionState = {};

    for (let i = visibleIndex; i < visibleRows.length; i += 1) {
      nextSelection[visibleRows[i].id] = true;
    }

    setRowSelection(nextSelection);
  };

  //  keep your "unselect row + below" behavior for explicit uncheck
  const cascadeUnselectFromVisibleIndex = (visibleIndex: number) => {
    const table = tableRef.current;
    if (!table) return;

    const visibleRows = table.getRowModel().rows;
    const nextSelection: MRT_RowSelectionState = { ...rowSelection };

    for (let i = visibleIndex; i < visibleRows.length; i += 1) {
      const rid = visibleRows[i].id;
      delete nextSelection[rid];
    }

    setRowSelection(nextSelection);
  };

  const isRowInHoverRange = (rowIndex: number): boolean => {
    if (hoverFromIndex === null) return false;
    return rowIndex >= hoverFromIndex;
  };

  const applyLastHistoryToChequeDetailRow = (
    row: IChequeDetailInfo,
    last: IChequeHistory | null
  ): IChequeDetailInfo => {
    const next = { ...row };

    if (!last) {
      next.cqdCollected = 'F';

      next.sendDate = null as any;
      next.sendBankId = null as any;
      next.sendBankName = '' as any;

      next.honorDate = null as any;
      next.date = null as any;
      next.disreason = null as any;

      return next;
    }

    const status = (last.treatment || null) as any;
    next.cqdCollected = status;

    if (typeof (last as any).bankId !== 'undefined')
      next.bankId = (last as any).bankId;
    if (typeof (last as any).bankName !== 'undefined')
      next.bankName = (last as any).bankName;

    next.sendDate = null as any;
    next.sendBankId = null as any;
    next.sendBankName = '' as any;
    next.honorDate = null as any;
    next.date = null as any;
    next.disreason = null as any;

    if (status === 'S') {
      next.sendDate = (last.treatmentDate || null) as any;
      next.sendBankId = ((last as any).sendBankId ?? null) as any;
      next.sendBankName = ((last as any).sendBankName ?? '') as any;
    } else if (status === 'H') {
      next.honorDate = (last.treatmentDate || null) as any;
    } else if (status === 'D') {
      next.date = (last.treatmentDate || null) as any;
      next.disreason = ((last as any).disreason ?? null) as any;
    } else if (status === 'B') {
      next.date = (last.treatmentDate || null) as any;
    }

    return next;
  };

  const doUndo = () => {
    if (chequeDetailRowIndex === null) return;

    const currentRow = chequeDetailGrid[chequeDetailRowIndex];
    if (!currentRow) return;

    const table = tableRef.current;
    if (!table) return;

    const visibleRows = table.getRowModel().rows;

    let firstSelectedIndex: number | null = null;
    for (let i = 0; i < visibleRows.length; i += 1) {
      const rid = visibleRows[i].id;
      if (rowSelection[rid]) {
        firstSelectedIndex = i;
        break;
      }
    }

    let cutIndex: number | null = null;

    if (firstSelectedIndex !== null) {
      cutIndex = firstSelectedIndex;
    } else {
      if (!histories.length) return;
      cutIndex = histories.length - 1;
    }

    const remaining = histories.slice(0, cutIndex);
    const removed = histories.slice(cutIndex);

    const removedHasB = removed.some((h) => h.treatment === 'B');

    const deletedChequeAwbs = removedHasB
      ? (currentRow.chequeAWBs || []).filter(
          (a: any) =>
            a.chequeNo === currentRow.chequeNo &&
            a.collectionId === currentRow.collectionId
        )
      : [];

    const remainingChequeAwbs = removedHasB
      ? (currentRow.chequeAWBs || []).filter(
          (a: any) =>
            !(
              a.chequeNo === currentRow.chequeNo &&
              a.collectionId === currentRow.collectionId
            )
        )
      : currentRow.chequeAWBs;

    const updatedRow: IChequeDetailInfo = {
      ...currentRow,
      chequeHistories: [...remaining] as any,
      chequeAWBs: remainingChequeAwbs,
    };

    const lastHistory = remaining.length
      ? remaining[remaining.length - 1]
      : null;
    const finalRow = applyLastHistoryToChequeDetailRow(updatedRow, lastHistory);

    setChequeDetailGrid((prev) => {
      const copy = [...prev];
      copy[chequeDetailRowIndex] = finalRow;
      return copy;
    });

    setChequeHistoryRows([...remaining]);

    const deletedChequeHistoriesTemp: IDeleteChequeHistoryCommand[] =
      removed.map((h) => ({
        chequeHistoryId: h.chequeHistoryId,
        collectionId: h.collectionId,
        chequeNo: h.chequeNo,
        buyerId,
        treatment: h.treatment,
        bankId: h.bankId,
        sendBankId: h.sendBankId || null,
      }));

    setDeletedChequeHistories([...deletedChequeHistoriesTemp]);

    const deletedChequeAwbCommandsTemp: IDeleteChequeAWBCommand[] =
      deletedChequeAwbs.map((a: any) => ({
        chequeAWBId: a.chequeAWBId,
        collectionId: a.collectionId,
      }));

    setDeletedChequeAWBs([...deletedChequeAwbCommandsTemp]);

    setRowSelection({});
    setHoverFromIndex(null);
  };

  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const table = useMaterialReactTable({
    columns,
    data: histories || [],

    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSelectAll: false,

    state: { rowSelection },
    onRowSelectionChange: setRowSelection,

    enablePagination: false,
    enableBottomToolbar: false,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 10 },

    layoutMode: 'grid',
    initialState: { density: 'compact' },

    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
    },

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

    muiTableBodyCellProps: { sx: { fontSize: '0.8125rem' } },

    //  clicking anywhere on row selects range
    muiTableBodyRowProps: ({ row }) => ({
      onMouseEnter: () => setHoverFromIndex(row.index),
      onMouseLeave: () => setHoverFromIndex(null),
      onClick: () => selectRangeFromVisibleIndex(row.index),
      sx: {
        cursor: 'pointer',
        ...(isRowInHoverRange(row.index) ? { backgroundColor: '#f5f7ff' } : {}),
      },
    }),

    muiSelectCheckboxProps: ({ row }) => ({
      onClick: (e) => {
        e.stopPropagation();
        e.preventDefault();
        selectRangeFromVisibleIndex(row.index);
      },
      onChange: (e) => {
        e.stopPropagation();
        e.preventDefault();
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) selectRangeFromVisibleIndex(row.index);
        else cascadeUnselectFromVisibleIndex(row.index);
      },
    }),

    renderToolbarInternalActions: ({ table: t }) => {
      tableRef.current = t;
      const undoDisabled = !histories.length;

      return (
        <>
          <MRT_ToggleGlobalFilterButton table={t} />
          <MRT_ShowHideColumnsButton table={t} />
          <MRT_ToggleFullScreenButton table={t} />
          <MRT_ToggleFiltersButton table={t} />

          <Tooltip title={undoDisabled ? 'No history to undo' : 'UNDO'}>
            <span>
              <IconButton
                onClick={doUndo}
                disabled={undoDisabled}
                size="small"
                sx={{ ml: 1 }}
              >
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      );
    },
  });

  tableRef.current = table;

  return <MaterialReactTable table={table} />;
};

export default ChequeHistory;
