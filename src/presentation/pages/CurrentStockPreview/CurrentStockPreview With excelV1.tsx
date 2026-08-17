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
  Box,
  Button,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
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

import * as XLSX from 'xlsx';

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

    const makeGroupedLabel = (name: string, count: number) =>
      `${name ?? ''}${count ? ` (${count})` : ''}`;

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
          return (
            <span style={{ fontWeight: 600 }}>
              {makeGroupedLabel(name, count)}
            </span>
          );
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
          return (
            <span style={{ fontWeight: 600 }}>
              {makeGroupedLabel(name, count)}
            </span>
          );
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
          return (
            <span style={{ fontWeight: 600 }}>
              {makeGroupedLabel(pname, count)}
            </span>
          );
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
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },
      muiTableBodyCellProps: { sx: { fontSize: '13px' } },
      muiTableContainerProps: { sx: { maxHeight: '60vh' } },

      renderToolbarInternalActions: ({ table: t }) => (
        <>
          <MRT_ToggleGlobalFilterButton table={t} />
          <MRT_ShowHideColumnsButton table={t} />
          <MRT_ToggleFullScreenButton table={t} />
          <MRT_ToggleFiltersButton table={t} />
        </>
      ),

      rowVirtualizerInstanceRef,
      rowVirtualizerOptions: { overscan: 10 },

      //  this is what shows the "Grouped by ..." chips bar
      positionToolbarAlertBanner: 'top',
    });

  /** --------------------- EXPORT EXCEL (matches UI shape) --------------------- */
  const extractName = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return s.includes(COMPOSITE_SPLIT) ? s.split(COMPOSITE_SPLIT)[0] : s;
  };

  const getVisibleExportColumns = () => {
    // only visible, only data columns (skip mrt expand/selection/etc)
    return table
      .getVisibleLeafColumns()
      .filter((c) => !String(c.id).startsWith('mrt-'));
  };

  const toSerialText = (v: any) =>
    v === 'Y' ? 'Serial' : v === 'N' ? 'Non-serial' : '';

  const handleExportExcel = () => {
    try {
      const visibleCols = getVisibleExportColumns();
      const groupedCols = table.getState().grouping ?? [];

      const headers = visibleCols.map((c) =>
        typeof c.columnDef.header === 'string'
          ? c.columnDef.header
          : String(c.id)
      );

      const aoa: any[][] = [];
      aoa.push(headers);

      // THIS is the actual rendered row order (group rows + leaf rows)
      const rows = table.getRowModel().rows;

      rows.forEach((r: any) => {
        const isGroupRow = r.getIsGrouped?.() || false;

        // group row knows which column it is grouped by
        const groupColId =
          r.groupingColumnId || r.getGroupingColumnId?.() || null;

        const groupHeader =
          groupColId && table.getColumn(groupColId)
            ? table.getColumn(groupColId)?.columnDef?.header
            : null;

        const groupLabel =
          typeof groupHeader === 'string' ? groupHeader : 'Group';

        const rowArr = visibleCols.map((col) => {
          const colId = String(col.id);

          // 1) GROUP HEADER ROW (like "MOBILE ACCESSORIES (1)" + totals)
          if (isGroupRow) {
            if (groupColId && colId === String(groupColId)) {
              const name = extractName(r.getValue?.(groupColId));
              const count = r.subRows?.length || 0;
              return `${name}${count ? ` (${count})` : ''}`;
            }

            if (colId === 'quantity' || colId === 'cost') {
              const sumVal = r.getValue?.(colId) ?? 0;
              return `${groupLabel} Total: ${sumVal}`;
            }

            return null;
          }

          // 2) LEAF ROW UNDER GROUPING: keep grouped columns blank (to match UI/excel sample)
          if (
            groupedCols.length > 0 &&
            r.depth > 0 &&
            groupedCols.includes(colId)
          ) {
            return null;
          }

          // 3) LEAF ROW NORMAL VALUE
          if (colId === 'productGroupName')
            return (r.original as any)?.productGroupName ?? '';
          if (colId === 'brandName')
            return (r.original as any)?.brandName ?? '';
          if (colId === 'productName')
            return (r.original as any)?.productName ?? '';

          if (colId === 'serialAvailable')
            return toSerialText((r.original as any)?.serialAvailable);

          // accessorKey columns
          const v = r.getValue?.(colId);
          return v ?? null;
        });

        aoa.push(rowArr);
      });

      const ws = XLSX.utils.aoa_to_sheet(aoa);

      // basic auto width
      const colWidths = headers.map((h, i) => {
        const maxLen = Math.max(
          String(h ?? '').length,
          ...aoa.slice(1).map((row) => String(row?.[i] ?? '').length)
        );
        return { wch: Math.min(Math.max(maxLen + 2, 10), 60) };
      });
      (ws as any)['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Current Stock');

      const fileName = `CurrentStockPreview_${dayjs().format(
        'YYYYMMDD_HHmmss'
      )}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (e: any) {
      toast.error('Excel export failed. See console.');
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  /** --------------------- UI --------------------- */
  return (
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300 flex items-center justify-between">
              <span>Current Stock Preview</span>

              <Tooltip title="Export exactly what you see (grouping + totals + hidden columns + column order)">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleExportExcel}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  Export Excel
                </Button>
              </Tooltip>
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
    </div>
  );
};

export default CurrentStockPreview;
