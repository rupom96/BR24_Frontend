/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-void */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Popper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

import { Controller, useForm, useWatch } from 'react-hook-form';

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

//  Excel export (supports bold/italic/center + richText)
import ExcelJS from 'exceljs';

//  same as your SalesOrderEdit style
import {
  useLazyGetProductGroupByCompanyIdQuery,
  useLazyGetBrandByCompanyIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,
} from '../../../infrastructure/api/ProductApiSlice';

import { useGetLocationByCompanyQuery } from '../../../infrastructure/api/LocationApiSlice';

import {
  ICurrentStockPreviewRow,
  IGetCurrentStockPreviewFilterDto,
} from '../../../domain/interfaces/CurrentStockPreviewInterface';
import { useLazyGetCurrentStockPreviewInfoQuery } from '../../../infrastructure/api/CurrentStockApiSlice';

/** ---------------- TYPES ---------------- */
type AnyObj = Record<string, any>;
type ProductTypeOption = { value: 'N' | 'Y' | ''; label: string };

// used to make group-key unique by including IDs (but display only names)
const COMPOSITE_SPLIT = '|||';

// Excel blue-600
const EXCEL_BLUE_600 = 'FF2563EB';

// NEW: grey for "(10)" in Excel (close to Tailwind gray-500)
const EXCEL_GREY_500 = 'FF6B7280';

/** -------------- COMPONENT -------------- */
const CurrentStockPreview = () => {
  const navigate = useNavigate();
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  if (!userInfo?.securityUserId) {
    if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('brFeature');
    }
    navigate('/loginUsername');
  }

  //  static Product Type options
  const productTypeOptions: ProductTypeOption[] = useMemo(
    () => [
      { value: '', label: 'All' },
      { value: 'N', label: 'Non-Serial' },
      { value: 'Y', label: 'Serial' },
    ],
    []
  );

  // -------- react-hook-form --------
  const { control, setValue } = useForm({
    defaultValues: {
      productGroup: null,
      brand: null,
      product: null,
      location: { locationId: 0, locationName: 'All Location' },

      pointingTime: dayjs(), //  current date-time by default
      productType: { value: '', label: 'All' } as ProductTypeOption,
    },
  });

  const productGroupTemp = useWatch({
    control,
    name: 'productGroup',
  }) as AnyObj | null;
  const brandTemp = useWatch({ control, name: 'brand' }) as AnyObj | null;
  const productTemp = useWatch({ control, name: 'product' }) as AnyObj | null;
  const locationTemp = useWatch({ control, name: 'location' }) as AnyObj | null;

  const pointingTimeTemp = useWatch({ control, name: 'pointingTime' }) as any;
  const productTypeTemp = useWatch({
    control,
    name: 'productType',
  }) as ProductTypeOption | null;

  // -------- states --------
  const [gridData, setGridData] = useState<ICurrentStockPreviewRow[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [isGridLoading, setIsGridLoading] = useState(true);

  //  grouping state (forced based on Product Type)
  const [grouping, setGrouping] = useState<string[]>([]);

  // -------- export UI state --------
  const [isExporting, setIsExporting] = useState(false);
  const [exportCanceling, setExportCanceling] = useState(false);
  const [exportProgress, setExportProgress] = useState({ done: 0, total: 0 });

  const exportAbortRef = useRef<{ aborted: boolean }>({ aborted: false });

  // -------- virtualizer ref --------
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (e) {
      // ignore
    }
  }, [sorting]);

  /** --------------------- AUTOCOMP POPPER --------------------- */
  interface AutoCompResStyles {
    popper: { maxWidth: string; fontSize: string };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: { maxWidth: 'fit-content', fontSize: '12px' },
  };

  const PopperMy = useCallback(
    (propsPopper: any) => (
      <Popper {...propsPopper} style={autoCompResStyles.popper} />
    ),
    [autoCompResStyles.popper]
  );

  /** --------------------- LOCATION OPTIONS --------------------- */
  const {
    data: locationOptions,
    isError: locationOptionsIsError,
    error: locationOptionsError,
  } = useGetLocationByCompanyQuery({ companyId: userInfo?.companyId });

  useEffect(() => {
    if (locationOptionsIsError) {
      toast.error('Failed to load Locations. See console.');
      // eslint-disable-next-line no-console
      console.log(locationOptionsError);
    }
  }, [locationOptionsIsError, locationOptionsError]);

  /** --------------------- PRODUCT FILTER OPTIONS --------------------- */
  const [
    triggerGetProductGroup,
    {
      data: productGroupOptionsData,
      isError: productGroupOptionsIsError,
      error: productGroupOptionsError,
    },
  ] = useLazyGetProductGroupByCompanyIdQuery();

  const [
    triggerGetBrand,
    {
      data: brandOptionsData,
      isError: brandOptionsIsError,
      error: brandOptionsError,
    },
  ] = useLazyGetBrandByCompanyIdQuery();

  const [
    triggerGetProduct,
    {
      data: productOptionsData,
      isError: productOptionsIsError,
      error: productOptionsError,
    },
  ] = useLazyGetProductByCompanyProductGroupIdQuery();

  /** --------------------- MAIN GRID: RTK LAZY HOOK --------------------- */
  const [
    triggerGetCurrentStockPreview,
    {
      data: currentStockPreviewData,
      isLoading: currentStockPreviewIsLoading,
      isFetching: currentStockPreviewIsFetching,
      isError: currentStockPreviewIsError,
      error: currentStockPreviewError,
      isSuccess: currentStockPreviewIsSuccess,
    },
  ] = useLazyGetCurrentStockPreviewInfoQuery();

  /** --------------------- ERROR TOASTS --------------------- */
  useEffect(() => {
    if (productGroupOptionsIsError) {
      toast.error('Failed to load Product Groups. See console.');
      // eslint-disable-next-line no-console
      console.log(productGroupOptionsError);
    }
  }, [productGroupOptionsIsError, productGroupOptionsError]);

  useEffect(() => {
    if (brandOptionsIsError) {
      toast.error('Failed to load Brands. See console.');
      // eslint-disable-next-line no-console
      console.log(brandOptionsError);
    }
  }, [brandOptionsIsError, brandOptionsError]);

  useEffect(() => {
    if (productOptionsIsError) {
      toast.error('Failed to load Products. See console.');
      // eslint-disable-next-line no-console
      console.log(productOptionsError);
    }
  }, [productOptionsIsError, productOptionsError]);

  useEffect(() => {
    if (currentStockPreviewIsError) {
      toast.error('Failed to load Current Stock Preview. See console.');
      // eslint-disable-next-line no-console
      console.log(currentStockPreviewError);
      setGridData([]);
      setIsGridLoading(false);
    }
  }, [currentStockPreviewIsError, currentStockPreviewError]);

  /** --------------------- DEPENDENT RESET LOGIC --------------------- */
  const prevProductGroupIdRef = useRef<number | null>(null);
  const prevBrandIdRef = useRef<number | null>(null);

  useEffect(() => {
    const currentPgId = productGroupTemp?.productGroupId ?? null;
    if (
      prevProductGroupIdRef.current !== null &&
      prevProductGroupIdRef.current !== currentPgId
    ) {
      setValue('brand', null);
      setValue('product', null);
    }
    prevProductGroupIdRef.current = currentPgId;
  }, [productGroupTemp, setValue]);

  useEffect(() => {
    const currentBrandId = brandTemp?.brandId ?? null;
    if (
      prevBrandIdRef.current !== null &&
      prevBrandIdRef.current !== currentBrandId
    ) {
      setValue('product', null);
    }
    prevBrandIdRef.current = currentBrandId;
  }, [brandTemp, setValue]);

  /** --------------------- LOAD FILTER OPTIONS --------------------- */
  useEffect(() => {
    triggerGetProductGroup({
      companyId: userInfo?.companyId,
      productId: productTemp?.productId || null,
      brandId: brandTemp?.brandId || null,
    });
  }, [productTemp?.productId, brandTemp?.brandId, triggerGetProductGroup]);

  useEffect(() => {
    triggerGetBrand({
      companyId: userInfo?.companyId,
      productGroupId: productGroupTemp?.productGroupId || null,
      productId: productTemp?.productId || null,
    });
  }, [
    productGroupTemp?.productGroupId,
    productTemp?.productId,
    triggerGetBrand,
  ]);

  useEffect(() => {
    triggerGetProduct({
      companyId: userInfo?.companyId,
      productGroupId: productGroupTemp?.productGroupId || null,
      brandId: brandTemp?.brandId || null,
    });
  }, [productGroupTemp?.productGroupId, brandTemp?.brandId, triggerGetProduct]);

  /** --------------------- FORCE GROUPING BASED ON PRODUCT TYPE ---------------------
   * If ProductType = 'Y' (Serial) -> group by Product
   * else -> ungroup
   */
  useEffect(() => {
    const pt = (productTypeTemp?.value ?? '') as 'N' | 'Y' | '';
    if (pt === 'Y') {
      if (grouping.length !== 1 || grouping[0] !== 'productName') {
        setGrouping(['productName']);
      }
    } else {
      if (grouping.length > 0) {
        setGrouping([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeTemp?.value]);

  /** --------------------- GRID FETCH WHEN FILTERS CHANGE --------------------- */
  useEffect(() => {
    if (!userInfo?.companyId) return;

    setIsGridLoading(true);

    const pgId =
      productGroupTemp?.productGroupId === 0
        ? null
        : productGroupTemp?.productGroupId ?? null;
    const brId = brandTemp?.brandId === 0 ? null : brandTemp?.brandId ?? null;
    const prId =
      productTemp?.productId === 0 ? null : productTemp?.productId ?? null;

    const locId =
      locationTemp?.locationId === undefined ||
      locationTemp?.locationId === null
        ? 0
        : locationTemp.locationId;

    const ptValue = pointingTimeTemp ? dayjs(pointingTimeTemp) : dayjs();
    const pointingTimeStr = (ptValue.isValid() ? ptValue : dayjs())
      .second(0)
      .millisecond(0)
      .format('YYYY-MM-DDTHH:mm:ss.SSS');

    const productTypeValue: 'N' | 'Y' | '' = (productTypeTemp?.value ?? '') as
      | 'N'
      | 'Y'
      | '';

    const filter: IGetCurrentStockPreviewFilterDto = {
      companyId: userInfo.companyId,
      locationId: locId,
      productGroupId: pgId,
      brandId: brId,
      productId: prId,
      date: pointingTimeStr,
      isSerialProduct: productTypeValue,
    };

    triggerGetCurrentStockPreview({ filter });
  }, [
    productGroupTemp?.productGroupId,
    brandTemp?.brandId,
    productTemp?.productId,
    locationTemp?.locationId,
    pointingTimeTemp,
    productTypeTemp?.value,
    triggerGetCurrentStockPreview,
  ]);

  useEffect(() => {
    if (
      currentStockPreviewIsSuccess &&
      !currentStockPreviewIsLoading &&
      !currentStockPreviewIsFetching
    ) {
      const data: ICurrentStockPreviewRow[] = JSON.parse(
        JSON.stringify([...(currentStockPreviewData || [])])
      );
      setGridData(data);
      setIsGridLoading(false);
    }
  }, [
    currentStockPreviewIsSuccess,
    currentStockPreviewIsLoading,
    currentStockPreviewIsFetching,
    currentStockPreviewData,
  ]);

  /** --------------------- GRID COLUMNS --------------------- */
  const columns = useMemo<MRT_ColumnDef<ICurrentStockPreviewRow>[]>(() => {
    const sumNullSafe = (columnId: string, leafRows: any[]) =>
      leafRows.reduce((acc: number, r: any) => {
        const v = r?.original?.[columnId];
        const n = Number(v ?? 0);
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0);

    const getFirstOriginal = (row: any): ICurrentStockPreviewRow | undefined =>
      (row?.subRows?.[0] as any)?.original;

    // NEW: (10) part grey in UI
    const renderGroupedLabel = (name: string, count: number) => (
      <span style={{ fontWeight: 600 }}>
        <span>{name ?? ''}</span>
        {count ? (
          <span style={{ color: '#9CA3AF' }}>{` (${count})`}</span> // tailwind gray-400-ish
        ) : null}
      </span>
    );

    return [
      {
        id: 'productGroupName',
        header: 'Product Group',
        size: 200,
        enableGrouping: true,
        accessorFn: (row) =>
          `${(row as any).productGroupName ?? ''}${COMPOSITE_SPLIT}${
            (row as any).productGroupId ?? ''
          }`,
        Cell: ({ row }) => (
          <span>{(row.original as any).productGroupName ?? ''}</span>
        ),
        GroupedCell: ({ row }) => {
          const first = getFirstOriginal(row);
          const name = (first as any)?.productGroupName ?? '';
          const count = row.subRows?.length || 0;
          return renderGroupedLabel(name, count);
        },
        sortingFn: (rowA, rowB) => {
          const a = ((rowA.original as any)?.productGroupName ?? '')
            .toString()
            .toLowerCase();
          const b = ((rowB.original as any)?.productGroupName ?? '')
            .toString()
            .toLowerCase();
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        },
      },
      {
        id: 'brandName',
        header: 'Brand',
        size: 180,
        enableGrouping: true,
        accessorFn: (row) =>
          `${(row as any).brandName ?? ''}${COMPOSITE_SPLIT}${
            (row as any).brandId ?? ''
          }`,
        Cell: ({ row }) => <span>{(row.original as any).brandName ?? ''}</span>,
        GroupedCell: ({ row }) => {
          const first = getFirstOriginal(row);
          const name = (first as any)?.brandName ?? '';
          const count = row.subRows?.length || 0;
          return renderGroupedLabel(name, count);
        },
        sortingFn: (rowA, rowB) => {
          const a = ((rowA.original as any)?.brandName ?? '')
            .toString()
            .toLowerCase();
          const b = ((rowB.original as any)?.brandName ?? '')
            .toString()
            .toLowerCase();
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        },
      },
      {
        id: 'productName',
        header: 'Product',
        size: 200,
        enableGrouping: true,
        accessorFn: (row) =>
          `${row.productName ?? ''}${COMPOSITE_SPLIT}${row.productId ?? ''}`,
        Cell: ({ row }) => <span>{row.original.productName ?? ''}</span>,
        GroupedCell: ({ row }) => {
          const first = getFirstOriginal(row);
          const pname = first?.productName ?? '';
          const count = row.subRows?.length || 0;
          return renderGroupedLabel(pname, count);
        },
        sortingFn: (rowA, rowB) => {
          const a = (rowA.original?.productName ?? '').toString().toLowerCase();
          const b = (rowB.original?.productName ?? '').toString().toLowerCase();
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        },
      },
      {
        accessorKey: 'serialNo',
        header: 'Serial No',
        size: 160,
        enableGrouping: false,
      },
      {
        accessorKey: 'modelNo',
        header: 'Model No',
        size: 130,
        enableGrouping: false,
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 180,
        enableGrouping: false,
        aggregationFn: (columnId, leafRows) => sumNullSafe(columnId, leafRows),
        AggregatedCell: ({ cell, row, table }) => {
          const groupColId =
            (row as any).groupingColumnId ||
            (row as any).getGroupingColumnId?.();
          const header = groupColId
            ? table.getColumn(groupColId)?.columnDef?.header
            : null;
          const label =
            typeof header === 'string' ? `${header} Total` : 'Total';
          const value = cell.getValue<number>() ?? 0;
          return (
            <span style={{ fontWeight: 600 }}>
              {label}: <span className="text-blue-600">{value}</span>
            </span>
          );
        },
        Cell: ({ row }) => <span>{row.original.quantity ?? ''}</span>,
      },
      {
        accessorKey: 'measuringUnitName',
        header: 'Unit Type',
        size: 50,
        enableGrouping: false,
      },
      {
        accessorKey: 'cost',
        header: 'Cost',
        size: 180,
        enableGrouping: false,
        aggregationFn: (columnId, leafRows) => sumNullSafe(columnId, leafRows),
        AggregatedCell: ({ cell, row, table }) => {
          const groupColId =
            (row as any).groupingColumnId ||
            (row as any).getGroupingColumnId?.();
          const header = groupColId
            ? table.getColumn(groupColId)?.columnDef?.header
            : null;
          const label =
            typeof header === 'string' ? `${header} Total` : 'Total';
          const value = cell.getValue<number>() ?? 0;
          return (
            <span style={{ fontWeight: 600 }}>
              {label}: <span className="text-blue-600">{value}</span>
            </span>
          );
        },
        Cell: ({ row }) => <span>{row.original.cost ?? ''}</span>,
      },
      {
        accessorKey: 'serialAvailable',
        header: 'Product Type',
        size: 150,
        enableGrouping: false,
        Cell: ({ row }) => {
          const v = row.original.serialAvailable;
          const txt = v === 'Y' ? 'Serial' : v === 'N' ? 'Non-serial' : '';
          return <span>{txt}</span>;
        },
      },
    ];
  }, []);

  /** --------------------- TABLE INIT --------------------- */
  const table: MRT_TableInstance<ICurrentStockPreviewRow> =
    useMaterialReactTable({
      columns,
      data: gridData || [],

      state: {
        columnVisibility,
        sorting,
        grouping,
        isLoading:
          isGridLoading ||
          currentStockPreviewIsLoading ||
          currentStockPreviewIsFetching,
      },

      onColumnVisibilityChange: setColumnVisibility,
      onSortingChange: setSorting,
      onGroupingChange: setGrouping,

      enableEditing: false,
      enableRowSelection: false,

      enableGrouping: true,
      enableExpanding: true,

      enableRowVirtualization: true,
      enablePagination: false,
      enableBottomToolbar: false,
      enableStickyHeader: true,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enableFilterMatchHighlighting: false,
      enableColumnPinning: true,

      layoutMode: 'grid',
      initialState: {
        density: 'compact',
        expanded: true,
        grouping: [],
      },

      muiSkeletonProps: { animation: 'pulse', height: 30 },
      muiTablePaperProps: {
        elevation: 0,
        sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
      },
      // NEW: center align cells + head
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
          textAlign: 'center',
          '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
        },
      },
      muiTableBodyCellProps: {
        sx: {
          fontSize: '13px',
          textAlign: 'center',
          '& *': { textAlign: 'center' },
        },
      },
      muiTableContainerProps: { sx: { maxHeight: '60vh' } },

      renderToolbarInternalActions: ({ table: t }) => (
        <>
          <MRT_ToggleGlobalFilterButton table={t} />
          <MRT_ShowHideColumnsButton table={t} />
          <MRT_ToggleFullScreenButton table={t} />

          {/*  Excel Export button beside Full Screen */}
          <Tooltip title="Export Excel (matches current grid view)">
            <span>
              <IconButton
                size="small"
                onClick={() => void handleExportExcel()}
                disabled={isExporting}
              >
                <FileDownloadOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <MRT_ToggleFiltersButton table={t} />
        </>
      ),

      rowVirtualizerInstanceRef,
      rowVirtualizerOptions: { overscan: 10 },

      //  shows the "Grouped by ..." chips bar
      positionToolbarAlertBanner: 'top',
    });

  /** --------------------- EXPORT HELPERS --------------------- */
  const extractName = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return s.includes(COMPOSITE_SPLIT) ? s.split(COMPOSITE_SPLIT)[0] : s;
  };

  const toSerialText = (v: any) =>
    v === 'Y' ? 'Serial' : v === 'N' ? 'Non-serial' : '';

  const getVisibleExportColumns = () =>
    table
      .getVisibleLeafColumns()
      .filter((c) => !String(c.id).startsWith('mrt-'));

  const cancelExport = () => {
    exportAbortRef.current.aborted = true;
    setExportCanceling(true);
  };

  const safeDownloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const yieldToUI = () => new Promise<void>((r) => setTimeout(() => r(), 0));

  const clampPercent = (n: number) => {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, n));
  };

  /** --------------------- EXPORT EXCEL (styled + cancel + non-blocking) --------------------- */
  const handleExportExcel = async () => {
    if (isExporting) return;

    try {
      const visibleCols = getVisibleExportColumns();
      const rows = table.getRowModel().rows;
      const groupedCols = table.getState().grouping ?? [];

      // Excel row limit per sheet
      if (rows.length + 1 > 1_048_576) {
        toast.error(
          `Too many rows for a single Excel sheet (${rows.length}). Please reduce filters/grouping or export in parts.`
        );
        return;
      }

      // Basic “Aw Snap” prevention guard (browser memory)
      const estimatedCells = rows.length * visibleCols.length;
      if (estimatedCells > 8_000_000) {
        toast.warn(
          'This export is very large and may be heavy for the browser. If it fails, please apply filters/grouping to reduce rows, or consider server-side export.'
        );
      }

      exportAbortRef.current.aborted = false;
      setExportCanceling(false);
      setExportProgress({ done: 0, total: rows.length });
      setIsExporting(true);

      //  Create workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'CurrentStockPreview';
      workbook.created = new Date();

      const ws = workbook.addWorksheet('Current Stock', {
        properties: { defaultRowHeight: 18 },
        pageSetup: { fitToPage: true },
      });

      // Headers (respect current column order + visibility)
      const headers = visibleCols.map((c) =>
        typeof c.columnDef.header === 'string'
          ? c.columnDef.header
          : String(c.id)
      );

      ws.columns = headers.map((h, i) => ({
        header: h,
        key: `c${i}`,
        width: Math.min(Math.max(String(h).length + 4, 12), 45),
        style: {
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          },
        },
      }));

      // Header row bold
      const headerRow = ws.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

      const bumpColWidth = (colIndex1Based: number, value: any) => {
        const col = ws.getColumn(colIndex1Based);
        const s = value === null || value === undefined ? '' : String(value);
        const len = s.length;
        const current = (col.width as number) || 12;
        const next = Math.min(Math.max(current, Math.min(len + 2, 60)), 60);
        col.width = next;
      };

      const makeRichTotal = (label: string, num: number | string) => ({
        richText: [
          { text: `${label} Total: `, font: { italic: true } },
          { text: String(num ?? 0), font: { color: { argb: EXCEL_BLUE_600 } } },
        ],
      });

      // NEW: grouped label in Excel where (10) is grey
      const makeRichGroupedLabel = (name: string, count: number) => {
        const n = name ?? '';
        if (!count) return n;
        return {
          richText: [
            { text: n, font: { bold: true } },
            {
              text: ` (${count})`,
              font: { color: { argb: EXCEL_GREY_500 } },
            },
          ],
        };
      };

      // Build rows (chunked to keep UI responsive + allow cancel)
      const CHUNK = 1500;
      for (let i = 0; i < rows.length; i++) {
        if (exportAbortRef.current.aborted) {
          toast.info('Excel download canceled.');
          return;
        }

        const r: any = rows[i];
        const isGroupRow = r.getIsGrouped?.() || false;

        // Group row knows which column it is grouped by
        const groupColId =
          r.groupingColumnId || r.getGroupingColumnId?.() || null;

        const groupHeader =
          groupColId && table.getColumn(groupColId)
            ? table.getColumn(groupColId)?.columnDef?.header
            : null;

        const groupLabel =
          typeof groupHeader === 'string' ? groupHeader : 'Group';

        // Construct row values in exact visible col order
        const rowValues: any[] = visibleCols.map((col) => {
          const colId = String(col.id);

          if (isGroupRow) {
            // group label cell (use richText so "(count)" can be grey)
            if (groupColId && colId === String(groupColId)) {
              const name = extractName(r.getValue?.(groupColId));
              const count = r.subRows?.length || 0;
              return makeRichGroupedLabel(name, count);
            }

            // totals cells (rich text)
            if (colId === 'quantity' || colId === 'cost') {
              const sumVal = r.getValue?.(colId) ?? 0;
              return makeRichTotal(groupLabel, sumVal);
            }

            return null;
          }

          // leaf rows under grouping: keep grouped columns blank
          if (
            groupedCols.length > 0 &&
            r.depth > 0 &&
            groupedCols.includes(colId)
          ) {
            return null;
          }

          // leaf normal values
          if (colId === 'productGroupName')
            return (r.original as any)?.productGroupName ?? '';
          if (colId === 'brandName')
            return (r.original as any)?.brandName ?? '';
          if (colId === 'productName')
            return (r.original as any)?.productName ?? '';
          if (colId === 'serialAvailable')
            return toSerialText((r.original as any)?.serialAvailable);

          const v = r.getValue?.(colId);
          return v ?? null;
        });

        const addedRow = ws.addRow(rowValues);
        addedRow.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };

        // Auto width scan (cheap-ish)
        for (let c = 0; c < rowValues.length; c++) {
          const v = rowValues[c];
          if (v && typeof v === 'object' && 'richText' in v) {
            const txt =
              (v as any).richText?.map((x: any) => x.text).join('') ?? '';
            bumpColWidth(c + 1, txt);
          } else {
            bumpColWidth(c + 1, v);
          }
        }

        // progress update + yield
        if ((i + 1) % CHUNK === 0) {
          setExportProgress({ done: i + 1, total: rows.length });
          await yieldToUI();
        }
      }

      setExportProgress({ done: rows.length, total: rows.length });
      await yieldToUI();

      if (exportAbortRef.current.aborted) {
        toast.info('Excel download canceled.');
        return;
      }

      // write buffer (can be heavy)
      const buffer = await workbook.xlsx.writeBuffer();

      if (exportAbortRef.current.aborted) {
        toast.info('Excel download canceled.');
        return;
      }

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = `CurrentStockPreview_${dayjs().format(
        'YYYYMMDD_HHmmss'
      )}.xlsx`;
      safeDownloadBlob(blob, fileName);
      toast.success('Excel exported successfully.');
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);

      const msg = String(e?.message ?? e ?? '').toLowerCase();
      if (
        msg.includes('memory') ||
        msg.includes('allocation') ||
        msg.includes('out of') ||
        msg.includes('heap')
      ) {
        toast.error(
          'Export is too large for the browser memory. Please apply filters/grouping to reduce rows, or implement server-side export.'
        );
      } else {
        toast.error('Excel export failed. See console.');
      }
    } finally {
      setIsExporting(false);
      setExportCanceling(false);
      exportAbortRef.current.aborted = false;
      setExportProgress((p) => ({ ...p, done: 0 }));
    }
  };

  // -------export progress percentage showing helper functions--------
  const exportPercent = useMemo(() => {
    const { done, total } = exportProgress;
    if (!total) return 0;
    return clampPercent(Math.round((done / total) * 100));
  }, [exportProgress]);

  const LinearProgressWithLabel = ({ value }: { value: number }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={value} />
        </Box>
        <Box sx={{ minWidth: 42 }}>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}
          >
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  /** --------------------- UI --------------------- */
  return (
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              Current Stock Preview
            </div>

            {/* Filters */}
            <div className="px-6 pb-4 text-start grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-6 mt-5">
              {/* Pointing Time */}
              <Controller
                name="pointingTime"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Pointing Time"
                      value={value || null}
                      inputFormat="DD MMMM YYYY, hh:mm A"
                      ampm
                      onChange={(newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          sx={{ width: '100%', marginTop: 1 }}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: 14 },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: 13 },
                          }}
                          size="small"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              {/* Product Type */}
              <Controller
                name="productType"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Autocomplete
                    size="small"
                    PopperComponent={PopperMy}
                    options={productTypeOptions}
                    value={value || productTypeOptions[0]}
                    onChange={(e, item) => onChange(item)}
                    onBlur={onBlur}
                    getOptionLabel={(option: ProductTypeOption) =>
                      option ? option.label : ''
                    }
                    isOptionEqualToValue={(option, selected) =>
                      option?.value === selected?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product Type"
                        variant="standard"
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: 14 },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: { fontSize: 13 },
                        }}
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    )}
                  />
                )}
              />

              {/* Location */}
              <Controller
                name="location"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Autocomplete
                    size="small"
                    PopperComponent={PopperMy}
                    options={[
                      { locationId: 0, locationName: 'All Location' },
                      ...(Array.from(
                        new Map(
                          locationOptions?.data
                            ?.map(({ locationId, locationName }: any) => ({
                              locationId,
                              locationName,
                            }))
                            .map((location: any) => [
                              location.locationId,
                              location,
                            ])
                        ).values()
                      ) || []),
                    ]}
                    value={value || null}
                    onChange={(e, item) => onChange(item)}
                    onBlur={onBlur}
                    getOptionLabel={(option: any) =>
                      option ? option.locationName : ''
                    }
                    isOptionEqualToValue={(option, selectedValue) =>
                      option.locationName === selectedValue?.locationName &&
                      option.locationId === selectedValue?.locationId
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location"
                        variant="standard"
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: 14 },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: { fontSize: 13 },
                        }}
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    )}
                  />
                )}
              />

              {/* Product Group */}
              <Controller
                name="productGroup"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Autocomplete
                    size="small"
                    PopperComponent={PopperMy}
                    options={[
                      { productGroupId: 0, productGroupName: 'All' },
                      ...(Array.from(
                        new Map(
                          productGroupOptionsData?.map(
                            (productGroupOption: any) => [
                              productGroupOption.productGroupName,
                              productGroupOption,
                            ]
                          )
                        ).values()
                      ) || []),
                    ]}
                    value={value || null}
                    onChange={(e, item) => onChange(item)}
                    onBlur={onBlur}
                    getOptionLabel={(option: any) =>
                      option ? option.productGroupName : ''
                    }
                    isOptionEqualToValue={(option, selectedValue) =>
                      option.productGroupName ===
                        selectedValue?.productGroupName &&
                      option.productGroupId === selectedValue?.productGroupId
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product Group"
                        variant="standard"
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: 14 },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: { fontSize: 13 },
                        }}
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    )}
                  />
                )}
              />

              {/* Brand */}
              <Controller
                name="brand"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Autocomplete
                    size="small"
                    PopperComponent={PopperMy}
                    options={[
                      { brandId: 0, brandName: 'All' },
                      ...(Array.from(
                        new Map(
                          brandOptionsData?.data?.map((brandOption: any) => [
                            brandOption.brandName,
                            brandOption,
                          ])
                        ).values()
                      ) || []),
                    ]}
                    value={value || null}
                    onChange={(e, item) => onChange(item)}
                    onBlur={onBlur}
                    getOptionLabel={(option: any) =>
                      option ? option.brandName : ''
                    }
                    isOptionEqualToValue={(option, selectedValue) =>
                      option.brandName === selectedValue?.brandName &&
                      option.brandId === selectedValue?.brandId
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Brand"
                        variant="standard"
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: 14 },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: { fontSize: 13 },
                        }}
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    )}
                  />
                )}
              />

              {/* Product */}
              <Controller
                name="product"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <Autocomplete
                    size="small"
                    PopperComponent={PopperMy}
                    options={[
                      { productId: 0, productName: 'All' },
                      ...(Array.from(
                        new Map(
                          productOptionsData?.map((productOption: any) => [
                            productOption.productName,
                            productOption,
                          ])
                        ).values()
                      ) || []),
                    ]}
                    value={value || null}
                    onChange={(e, item) => onChange(item)}
                    onBlur={onBlur}
                    getOptionLabel={(option: any) =>
                      option ? option.productName : ''
                    }
                    isOptionEqualToValue={(option, selectedValue) =>
                      option.productName === selectedValue?.productName &&
                      option.productId === selectedValue?.productId
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product"
                        variant="standard"
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: 14 },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: { fontSize: 13 },
                        }}
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    )}
                  />
                )}
              />

              {/* Grid */}
              <div className="w-full mt-4 mb-5 col-span-2 md:col-span-3 lg:col-span-6 modifiedEditTable">
                <MaterialReactTable table={table} />
              </div>
            </div>

            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600 flex items-center gap-3" />
          </div>
        </div>
      </div>

      <Box sx={{ height: 10 }} />

      {/*  Export loader overlay */}
      <Backdrop
        open={isExporting}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 10,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
      >
        <Box
          sx={{
            width: 'min(520px, 92vw)',
            bgcolor: '#111827',
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
            Downloading Current Stock in excel format, Please wait...
          </Typography>

          <Typography sx={{ fontSize: 12, opacity: 0.85, mt: 0.8 }}>
            {exportProgress.total > 0
              ? `Processed ${exportProgress.done} / ${exportProgress.total} rows`
              : 'Preparing export...'}
          </Typography>

          {/*  Beautiful horizontal progress bar with % label */}
          <LinearProgressWithLabel value={exportPercent} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              disabled={exportCanceling}
              onClick={cancelExport}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              {exportCanceling ? 'Canceling…' : 'Cancel Download'}
            </Button>
          </Box>
        </Box>
      </Backdrop>
    </div>
  );
};

export default CurrentStockPreview;
