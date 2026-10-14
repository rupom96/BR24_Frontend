/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import {
  useLazyGetElementPermissionStatusByEventQuery,
  useLazyGetProductGroupAndBrandByProductIdQuery,
} from '../../../infrastructure/api/BiznessEventPCTrackVMForJobHistoryApiSlice';
import {
  IElementPermissionPerson,
  IElementPermissionStatus,
} from '../../../domain/interfaces/ElementPermissionStatusInterface';

type Props = {
  eventNo: string;
  firstEventNo: string;
  sequence: number;
  biznessEventProcessConfigurationId: number;
  companyId: number;
};

const personDisplayName = (person: IElementPermissionPerson) =>
  (person.name || '').trim() || person.userName || '—';

const PersonHoverList = ({
  people,
  label,
}: {
  people: IElementPermissionPerson[];
  label: string;
}) => {
  if (!people.length) {
    return <span className="text-slate-400">N/A</span>;
  }

  const text =
    people.length === 1
      ? personDisplayName(people[0])
      : `${people.length} persons`;

  return (
    <Tooltip
      arrow
      placement="top"
      enterDelay={100}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'transparent',
            p: 0,
            maxWidth: 'none',
            boxShadow: 'none',
          },
        },
        arrow: {
          sx: { color: '#0f172a' },
        },
      }}
      title={
        <Box
          sx={{
            width: '17.5rem',
            maxHeight: '20rem',
            overflowY: 'auto',
            borderRadius: '14px',
            border: '1px solid rgba(148,163,184,0.28)',
            background:
              'linear-gradient(165deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)',
            boxShadow:
              '0 22px 50px rgba(15,23,42,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
            p: 1.25,
          }}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#94a3b8',
              }}
            >
              {label}
            </Typography>
            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[0.62rem] font-semibold text-sky-300">
              {people.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {people.map((person) => (
              <div
                key={`${person.biznessEventPCUserId}-${person.securityUserId}`}
                className="rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 backdrop-blur-sm transition-colors hover:border-sky-400/30 hover:bg-sky-400/[0.07]"
              >
                <div className="text-[0.8rem] font-semibold leading-snug tracking-tight text-slate-50">
                  {personDisplayName(person)}
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="min-w-[3.4rem] text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500">
                      User
                    </span>
                    <span className="truncate font-mono text-[0.68rem] text-sky-300/90">
                      {person.userName || '—'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="min-w-[3.4rem] text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500">
                      Loc
                    </span>
                    <span className="truncate text-[0.68rem] text-slate-300">
                      {person.locationName || '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      }
    >
      <span className="cursor-default border-b border-dotted border-slate-400 font-medium text-slate-700">
        {text}
      </span>
    </Tooltip>
  );
};

const ProductNameCell = ({ row }: { row: IElementPermissionStatus }) => {
  const [trigger, { data, isFetching, isError }] =
    useLazyGetProductGroupAndBrandByProductIdQuery();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && row.elementIdentity === 'Product' && row.elementId) {
      trigger({ productId: row.elementId });
    }
  }, [open, row.elementId, row.elementIdentity, trigger]);

  const displayName = (row.elementName || '').replace(/^"+|"+$/g, '');

  if (row.elementIdentity !== 'Product') {
    return (
      <span className="break-words font-medium text-slate-800">
        {displayName}
      </span>
    );
  }

  return (
    <Tooltip
      arrow
      placement="top"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      title={
        <Box className="min-w-[10rem] py-1">
          {isFetching && (
            <Typography variant="caption">Loading…</Typography>
          )}
          {isError && (
            <Typography variant="caption">Could not load details</Typography>
          )}
          {!isFetching && !isError && data && (
            <>
              <div className="text-[0.7rem] text-slate-300">Product Group</div>
              <div className="mb-1.5 text-[0.78rem] font-semibold text-white">
                {data.productGroupName || '—'}
              </div>
              <div className="text-[0.7rem] text-slate-300">Brand</div>
              <div className="text-[0.78rem] font-semibold text-white">
                {data.brandName || '—'}
              </div>
            </>
          )}
        </Box>
      }
    >
      <span className="cursor-default break-words border-b border-dotted border-sky-500 font-medium text-sky-800">
        {displayName}
      </span>
    </Tooltip>
  );
};

const ElementPermissionPopover = ({
  eventNo,
  firstEventNo,
  sequence,
  biznessEventProcessConfigurationId,
  companyId,
}: Props) => {
  const [open, setOpen] = useState(false);
  const iconRef = React.useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverId = open ? 'element-permission-popover' : undefined;

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 160);
  };

  const [
    triggerGetStatus,
    {
      data,
      isLoading,
      isFetching,
      isError,
      isSuccess,
      originalArgs,
    },
  ] = useLazyGetElementPermissionStatusByEventQuery();

  useEffect(() => {
    if (!open) return;
    triggerGetStatus({
      eventNo,
      firstEventNo,
      sequence,
      biznessEventProcessConfigurationId,
      companyId,
    });
  }, [
    open,
    eventNo,
    firstEventNo,
    sequence,
    biznessEventProcessConfigurationId,
    companyId,
    triggerGetStatus,
  ]);

  const rows = useMemo(() => data ?? [], [data]);
  const matchingArgs =
    originalArgs?.eventNo === eventNo &&
    originalArgs?.firstEventNo === firstEventNo &&
    originalArgs?.sequence === sequence &&
    originalArgs?.biznessEventProcessConfigurationId ===
      biznessEventProcessConfigurationId &&
    originalArgs?.companyId === companyId;

  const columns = useMemo<MRT_ColumnDef<IElementPermissionStatus>[]>(
    () => [
      {
        accessorKey: 'elementName',
        header: 'Elements',
        size: 320,
        minSize: 200,
        Cell: ({ row }) => <ProductNameCell row={row.original} />,
      },
      {
        accessorKey: 'elementIdentity',
        header: 'Identity',
        size: 130,
        minSize: 110,
      },
      {
        id: 'authorizedTo',
        header: 'Authorized To',
        size: 130,
        minSize: 110,
        Cell: ({ row }) => (
          <PersonHoverList
            people={row.original.authorizedTo || []}
            label="Authorized"
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        minSize: 90,
        Cell: ({ cell }) => {
          const status = String(cell.getValue() ?? '');
          const done = status === 'Done';
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${
                done
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {status || '—'}
            </span>
          );
        },
      },
      {
        id: 'doneBy',
        header: 'Done By',
        size: 130,
        minSize: 100,
        Cell: ({ row }) => {
          const people = row.original.doneBy || [];
          if (!people.length) {
            return <span className="text-slate-400">N/A</span>;
          }
          return <PersonHoverList people={people} label="Done by" />;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: rows,
    layoutMode: 'grid',
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnResizing: false,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        width: '100%',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxWidth: '100%',
        overflowX: 'visible',
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
        width: '100%',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f8fafc',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#475569',
        letterSpacing: '0.02em',
        py: 1,
        whiteSpace: 'nowrap',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor:
          row.original.status === 'Done' ? '#ecfdf5' : '#fff1f2',
        '&:hover': {
          backgroundColor:
            row.original.status === 'Done' ? '#d1fae5' : '#ffe4e6',
        },
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.78rem',
        py: 1.1,
        borderBottom: '1px solid #f1f5f9',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        verticalAlign: 'top',
      },
    },
  });

  const showLoading = open && (isLoading || isFetching);
  const showEmpty =
    open &&
    isSuccess &&
    matchingArgs &&
    !isLoading &&
    !isFetching &&
    rows.length === 0;
  const showTable =
    open &&
    isSuccess &&
    matchingArgs &&
    !isLoading &&
    !isFetching &&
    rows.length > 0;

  return (
    <>
      <Tooltip title="Element permissions" arrow>
        <IconButton
          ref={iconRef}
          size="small"
          aria-describedby={popoverId}
          className="!ml-1 !text-slate-600 hover:!bg-slate-100 hover:!text-sky-700"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            clearCloseTimer();
            setOpen(true);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            scheduleClose();
          }}
        >
          <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={iconRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
        sx={{ pointerEvents: 'none' }}
        PaperProps={{
          onMouseEnter: () => {
            clearCloseTimer();
            setOpen(true);
          },
          onMouseLeave: () => scheduleClose(),
          sx: {
            pointerEvents: 'auto',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 18px 40px rgb(15 23 42 / 14%)',
            mt: 0.5,
            overflow: 'hidden',
            maxWidth: 'min(56rem, 96vw)',
            width: 'min(56rem, 96vw)',
          },
        }}
      >
        <div
          className="w-full max-w-[56rem] p-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Permission detail
              </div>
              <div className="text-sm font-semibold text-slate-800">
                Elements coverage
              </div>
            </div>
            <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] text-slate-500">
              Seq {sequence}
            </div>
          </div>

          {showLoading && (
            <div className="space-y-2 py-1">
              <Skeleton variant="rounded" height={28} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
            </div>
          )}

          {isError && !showLoading && (
            <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-4 text-center text-sm text-rose-700">
              Could not load permission details.
            </div>
          )}

          {showEmpty && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
              No details available for this
            </div>
          )}

          {showTable && <MaterialReactTable table={table} />}
        </div>
      </Popover>
    </>
  );
};

export default ElementPermissionPopover;
