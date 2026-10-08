/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Checkbox,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

import { ITenderNoComboBox } from '../../../domain/interfaces/ProcurementTenderInterface';
import { ICreateBiznessEventPCTrackCommand } from '../../../domain/interfaces/BiznessEventPCTrackVMInterface';
import {
  GetTenderExpenseForSalesPersonDto,
  ProcessTenderExpenseForSalesPersonDto,
  TenderExpenseForSalesPersonCommandsVM,
} from '../../../domain/interfaces/TenderExpenseForSalesPersonInterface';
import {
  useGetAllTenderNoQuery,
  useLazyGetTenderExpenseForSalesPersonQuery,
  useProcessTenderExpenseForSalesPersonMutation,
} from '../../../infrastructure/api/TenderApiSlice';
import { useAppSelector } from '../../../application/Redux/store/store';
import { hexToRgba } from '../../Utils/colorUtils';

type SalesExpenseMode = 'amount' | 'percentage';

/**
 * Layout switch — side-by-side trial.
 * Undo to previous stacked version: set to `false`.
 */
const LAYOUT_SIDE_BY_SIDE = true;

interface TenderExpenseForSalesPersonProps {
  modalPageOpenerClose?: () => void;
  clickedCardInfo?: any;
  operationMode?: 'view' | 'edit' | string;
}

interface HeaderForm {
  tenderNo: ITenderNoComboBox | null;
  earnestMoney: { optionName: string } | null;
}

const EARNEST_MONEY_OPTIONS = [
  { optionName: 'BG' },
  { optionName: 'PAY ORDER' },
  { optionName: 'OTHER' },
  { optionName: 'N/A' },
];

const emptyExpense = (
  procurementTenderId = 0
): GetTenderExpenseForSalesPersonDto => ({
  procurementTenderId,
  bgAmount: null,
  securityDepositP: null,
  securityDepositT: null,
  performanceGuaranteeP: null,
  performanceGuaranteeT: null,
  earnestMoney: null,
  vat: null,
  tax: null,
  salesExpenseAdvanceA: null,
  salesExpenseAdvanceP: null,
  salesExpenseDueA: null,
  salesExpenseDueP: null,
  salesExpenseBufferA: null,
  salesExpenseBufferP: null,
  agExpenseA: null,
  agExpenseP: null,
  deliveryA: null,
  deliveryP: null,
  installationA: null,
  installationP: null,
  trainingA: null,
  trainingP: null,
  preShipmentInspectionA: null,
  preShipmentInspectionP: null,
  bufferA: null,
  bufferP: null,
});

const toNum = (v: unknown): number => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

const inputVal = (v: number | null | undefined): string | number =>
  v === null || v === undefined ? '' : v;

const detectSalesExpenseMode = (
  dto: GetTenderExpenseForSalesPersonDto | null | undefined
): SalesExpenseMode => {
  if (!dto) return 'percentage';
  const anyAmount =
    toNum(dto.salesExpenseAdvanceA) > 0 ||
    toNum(dto.salesExpenseDueA) > 0 ||
    toNum(dto.salesExpenseBufferA) > 0;
  return anyAmount ? 'amount' : 'percentage';
};

const inputFont = { fontSize: '0.78rem' };

/** No underline — flat cell input; parent state commits only on blur (or Enter). */
const NumCell: React.FC<{
  value: number | null | undefined;
  onCommit: (raw: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  formReady: boolean;
  isViewMode: boolean;
  /** Always-visible suffix, e.g. `%` or `Years` */
  suffix?: string;
  /** When no tender selected — toast + focus Tender No */
  onRequireTender?: () => void;
}> = ({
  value,
  onCommit,
  readOnly,
  disabled,
  formReady,
  isViewMode,
  suffix,
  onRequireTender,
}) => {
  const [draft, setDraft] = useState(() => String(inputVal(value)));

  useEffect(() => {
    setDraft(String(inputVal(value)));
  }, [value]);

  const locked = readOnly || isViewMode;
  const blockWithoutTender = !formReady && !isViewMode;

  const interceptFocus = (
    e: React.MouseEvent | React.FocusEvent | React.KeyboardEvent
  ) => {
    if (!blockWithoutTender) return;
    e.preventDefault();
    e.stopPropagation();
    onRequireTender?.();
  };

  return (
    <TextField
      size="small"
      variant="standard"
      type="number"
      value={draft}
      onChange={(e) => {
        if (blockWithoutTender) return;
        setDraft(e.target.value);
      }}
      onBlur={(e) => {
        if (blockWithoutTender) return;
        onCommit(e.target.value);
      }}
      onKeyDown={(e) => {
        if (blockWithoutTender) {
          interceptFocus(e);
          return;
        }
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      onMouseDown={interceptFocus}
      onFocus={(e) => {
        if (blockWithoutTender) {
          e.target.blur();
          onRequireTender?.();
        }
      }}
      disabled={disabled}
      InputProps={{
        disableUnderline: true,
        readOnly: locked || blockWithoutTender,
        style: inputFont,
        endAdornment: suffix ? (
          <InputAdornment position="end">
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: '#9ca3af',
                paddingRight: 2,
              }}
            >
              {suffix}
            </span>
          </InputAdornment>
        ) : undefined,
      }}
      inputProps={{ step: 'any' }}
      sx={{
        width: '100%',
        maxWidth: '100%',
        marginTop: 0,
        '& .MuiInputBase-root': {
          backgroundColor: locked ? 'transparent' : 'var(--te-input-bg)',
          borderRadius: '5px',
          border: locked
            ? '1px solid transparent'
            : '1px solid var(--te-input-border)',
          paddingLeft: '6px',
          paddingRight: suffix ? '2px' : '6px',
          minHeight: '28px',
          transition: 'border-color .15s, box-shadow .15s',
          cursor: blockWithoutTender ? 'pointer' : undefined,
          color: 'var(--te-input-fg)',
          '&:hover': locked
            ? undefined
            : { borderColor: 'var(--te-input-border-hover)' },
          '&.Mui-focused': {
            borderColor: 'var(--te-accent)',
            boxShadow: '0 0 0 2px var(--te-accent-ring)',
          },
        },
        '& .MuiInputBase-input': {
          paddingTop: '3px',
          paddingBottom: '3px',
          color: 'inherit',
          cursor: blockWithoutTender ? 'pointer' : undefined,
          WebkitTextFillColor: 'var(--te-input-fg)',
        },
      }}
    />
  );
};

/** Stable row component (must stay outside parent) — avoids double-click-to-focus. */
const ApRow: React.FC<{
  label: string;
  aValue: number | null | undefined;
  pValue?: number | null;
  onCommitA: (raw: string) => void;
  onCommitP?: (raw: string) => void;
  formReady: boolean;
  isViewMode: boolean;
  onRequireTender?: () => void;
  /** Hide % input (like VAT/Tax hide Time Period) — save sends 0 for % */
  omitPercentage?: boolean;
}> = ({
  label,
  aValue,
  pValue,
  onCommitA,
  onCommitP,
  formReady,
  isViewMode,
  onRequireTender,
  omitPercentage,
}) => (
  <tr>
    <td className="lbl">{label}</td>
    <td>
      <NumCell
        value={aValue}
        onCommit={onCommitA}
        formReady={formReady}
        isViewMode={isViewMode}
        onRequireTender={onRequireTender}
      />
    </td>
    <td className={omitPercentage ? 'muted-cell' : undefined}>
      {omitPercentage ? (
        '—'
      ) : (
        <NumCell
          value={pValue}
          onCommit={onCommitP!}
          formReady={formReady}
          isViewMode={isViewMode}
          suffix="%"
          onRequireTender={onRequireTender}
        />
      )}
    </td>
  </tr>
);

/** Compact skeleton panel matching a section card while expense API loads. */
const SectionSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <div className="te-col-panel te-skeleton-panel">
    <div className="te-skeleton-banner">
      <Skeleton
        variant="rounded"
        width={28}
        height={16}
        sx={{ borderRadius: 999, bgcolor: 'var(--te-accent-soft-strong)' }}
      />
      <Skeleton
        variant="text"
        width="55%"
        height={16}
        sx={{ bgcolor: 'var(--te-accent-soft-strong)' }}
      />
    </div>
    <div className="te-skeleton-body">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="te-skeleton-row" key={i}>
          <Skeleton variant="text" width="38%" height={18} />
          <Skeleton
            variant="rounded"
            width="28%"
            height={26}
            sx={{ borderRadius: '5px' }}
          />
          <Skeleton
            variant="rounded"
            width="28%"
            height={26}
            sx={{ borderRadius: '5px' }}
          />
        </div>
      ))}
    </div>
  </div>
);

const TenderExpenseForSalesPerson: React.FC<
  TenderExpenseForSalesPersonProps
> = ({ modalPageOpenerClose, clickedCardInfo, operationMode }) => {
  const isViewMode = operationMode === 'view';
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const accentSoft = hexToRgba(currentColor, 0.06);
  const accentSoftStrong = hexToRgba(currentColor, 0.12);
  const accentRing = hexToRgba(currentColor, 0.35);
  const biznessEventName = clickedCardInfo?.biznessEventName?.replace(
    /([a-z])([A-Z])/g,
    '$1 $2'
  );

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const { control, setValue, getValues, watch } = useForm<HeaderForm>({
    defaultValues: { tenderNo: null, earnestMoney: null },
  });

  const [expense, setExpense] =
    useState<GetTenderExpenseForSalesPersonDto>(emptyExpense());
  const [salesExpenseMode, setSalesExpenseMode] =
    useState<SalesExpenseMode>('percentage');

  const {
    data: tenderComboOptions,
    isLoading: tenderComboLoading,
    isError: tenderComboIsError,
  } = useGetAllTenderNoQuery();

  const [
    triggerGetExpense,
    {
      data: expenseData,
      isFetching: expenseFetching,
      isError: expenseIsError,
      error: expenseError,
      isSuccess: expenseIsSuccess,
    },
  ] = useLazyGetTenderExpenseForSalesPersonQuery();

  const [
    processExpense,
    {
      isLoading: processLoading,
      isError: processIsError,
      error: processError,
      isSuccess: processIsSuccess,
      data: processData,
    },
  ] = useProcessTenderExpenseForSalesPersonMutation();

  const watchedTenderNo = watch('tenderNo');
  watch('earnestMoney');

  useEffect(() => {
    if (tenderComboIsError) {
      toast.error('Failed to load Tender No options');
    }
  }, [tenderComboIsError]);

  // Chain open: pre-select tender from clickedCardInfo.eventNo
  useEffect(() => {
    if (!clickedCardInfo?.eventNo || !tenderComboOptions?.length) return;
    const flowed = tenderComboOptions.find(
      (t) => t.tenderNo === clickedCardInfo.eventNo
    );
    if (!flowed) return;
    setValue('tenderNo', flowed);
    triggerGetExpense({
      procurementTenderId: flowed.procurementTenderId || 0,
    });
  }, [clickedCardInfo, tenderComboOptions, setValue, triggerGetExpense]);

  useEffect(() => {
    if (expenseIsError) {
      toast.error(
        'Something wrong from backend while fetching expense data, see console!'
      );
      console.log(expenseError);
      return;
    }
    if (!expenseIsSuccess) return;

    const dto = expenseData
      ? { ...emptyExpense(), ...expenseData }
      : emptyExpense(getValues('tenderNo')?.procurementTenderId || 0);

    setExpense(dto);
    setSalesExpenseMode(detectSalesExpenseMode(dto));

    if (dto.earnestMoney) {
      setValue('earnestMoney', { optionName: dto.earnestMoney });
    } else {
      setValue('earnestMoney', null);
    }
  }, [
    expenseData,
    expenseIsError,
    expenseError,
    expenseIsSuccess,
    getValues,
    setValue,
  ]);

  useEffect(() => {
    if (processIsSuccess) {
      Swal.fire({
        title: 'Tender Expense For SP has been saved successfully!',
        text: '',
        showDenyButton: false,
        allowOutsideClick: false,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK!',
      }).then(() => {
        console.log('processTenderExpenseForSalesPerson success ➜', processData);
      });
    } else if (processIsError) {
      toast.error(
        'Something is wrong in backend while saving expense data, see console---->'
      );
      console.log(processError);
    }
  }, [
    processIsSuccess,
    processIsError,
    processData,
    processError,
    processLoading,
  ]);

  const setField = (
    key: keyof GetTenderExpenseForSalesPersonDto,
    raw: string
  ) => {
    setExpense((prev) => ({
      ...prev,
      [key]: raw === '' ? null : toNum(raw),
    }));
  };

  /** AG / Delivery / … — clear opposite side on blur (load may show both until blur). */
  const handleApBlur = (
    side: 'A' | 'P',
    aKey: keyof GetTenderExpenseForSalesPersonDto,
    pKey: keyof GetTenderExpenseForSalesPersonDto,
    raw: string
  ) => {
    const val = raw === '' ? null : toNum(raw);
    setExpense((prev) => {
      const next = { ...prev, [side === 'A' ? aKey : pKey]: val };
      if (side === 'A' && toNum(val) !== 0) {
        next[pKey] = null as never;
      } else if (side === 'P' && toNum(val) !== 0) {
        next[aKey] = null as never;
      }
      return next;
    });
  };

  const salesExpenseHasValues = (mode: SalesExpenseMode) => {
    if (mode === 'amount') {
      return (
        toNum(expense.salesExpenseAdvanceA) > 0 ||
        toNum(expense.salesExpenseDueA) > 0 ||
        toNum(expense.salesExpenseBufferA) > 0
      );
    }
    return (
      toNum(expense.salesExpenseAdvanceP) > 0 ||
      toNum(expense.salesExpenseDueP) > 0 ||
      toNum(expense.salesExpenseBufferP) > 0
    );
  };

  const applySalesExpenseMode = (next: SalesExpenseMode) => {
    setSalesExpenseMode(next);
    setExpense((prev) => {
      if (next === 'amount') {
        return {
          ...prev,
          salesExpenseAdvanceP: null,
          salesExpenseDueP: null,
          salesExpenseBufferP: null,
        };
      }
      return {
        ...prev,
        salesExpenseAdvanceA: null,
        salesExpenseDueA: null,
        salesExpenseBufferA: null,
      };
    });
  };

  const handleSalesExpenseModeChange = async (next: SalesExpenseMode) => {
    if (next === salesExpenseMode) return;
    if (salesExpenseHasValues(salesExpenseMode)) {
      const result = await Swal.fire({
        title: 'Existing values will get lost',
        text: 'Are you sure you want to switch? Values on the other side will be cleared.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, switch',
        cancelButtonText: 'Cancel',
      });
      if (!result.isConfirmed) return;
    }
    applySalesExpenseMode(next);
  };

  const handleTenderChange = (
    item: ITenderNoComboBox | null,
    onChange: (v: ITenderNoComboBox | null) => void
  ) => {
    onChange(item);
    setValue('earnestMoney', null);
    if (!item?.procurementTenderId) {
      setExpense(emptyExpense());
      setSalesExpenseMode('percentage');
      return;
    }
    setExpense(emptyExpense(item.procurementTenderId));
    setSalesExpenseMode('percentage');
    triggerGetExpense({ procurementTenderId: item.procurementTenderId });
  };

  const salesExpenseTotalA = useMemo(
    () =>
      toNum(expense.salesExpenseAdvanceA) +
      toNum(expense.salesExpenseDueA) +
      toNum(expense.salesExpenseBufferA),
    [expense]
  );
  const salesExpenseTotalP = useMemo(
    () =>
      toNum(expense.salesExpenseAdvanceP) +
      toNum(expense.salesExpenseDueP) +
      toNum(expense.salesExpenseBufferP),
    [expense]
  );

  const buildSaveDto = (): ProcessTenderExpenseForSalesPersonDto | null => {
    const tender = getValues('tenderNo');
    const earnest = getValues('earnestMoney');
    if (!tender?.procurementTenderId) {
      toast.warn('Please select Tender No');
      return null;
    }

    const vat = toNum(expense.vat);
    const tax = toNum(expense.tax);

    const amountMode = salesExpenseMode === 'amount';

    return {
      procurementTenderId: tender.procurementTenderId,
      bgAmount: toNum(expense.bgAmount),
      securityDepositP: toNum(expense.securityDepositP),
      securityDepositT: toNum(expense.securityDepositT),
      performanceGuaranteeP: toNum(expense.performanceGuaranteeP),
      performanceGuaranteeT: toNum(expense.performanceGuaranteeT),
      earnestMoney: earnest?.optionName || '',
      vat,
      tax,
      vatTaxP: vat + tax,
      salesExpenseAdvanceA: amountMode
        ? toNum(expense.salesExpenseAdvanceA)
        : 0,
      salesExpenseAdvanceP: amountMode
        ? 0
        : toNum(expense.salesExpenseAdvanceP),
      salesExpenseDueA: amountMode ? toNum(expense.salesExpenseDueA) : 0,
      salesExpenseDueP: amountMode ? 0 : toNum(expense.salesExpenseDueP),
      salesExpenseBufferA: amountMode
        ? toNum(expense.salesExpenseBufferA)
        : 0,
      salesExpenseBufferP: amountMode
        ? 0
        : toNum(expense.salesExpenseBufferP),
      salesExpenseA: amountMode ? salesExpenseTotalA : 0,
      salesExpenseP: amountMode ? 0 : salesExpenseTotalP,
      agExpenseA: toNum(expense.agExpenseA),
      agExpenseP: toNum(expense.agExpenseP),
      deliveryA: toNum(expense.deliveryA),
      deliveryP: 0,
      installationA: toNum(expense.installationA),
      installationP: 0,
      trainingA: toNum(expense.trainingA),
      trainingP: 0,
      preShipmentInspectionA: toNum(expense.preShipmentInspectionA),
      preShipmentInspectionP: 0,
      bufferA: toNum(expense.bufferA),
      bufferP: 0,
    };
  };

  const saveFunct = () => {
    if (isViewMode) return;
    const data = buildSaveDto();
    if (!data) return;

    let pcTrackToSave: ICreateBiznessEventPCTrackCommand | null = null;
    if (clickedCardInfo?.biznessEventProcessConfigurationId) {
      pcTrackToSave = {
        eventNo: clickedCardInfo.eventNo,
        performedBy: userInfo?.securityUserId,
        startDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]HH:mm:00.000[Z]'),
        note: operationMode === 'edit' ? 'Edited' : 'Added',
        progressPReported: 100,
        originalSequence: clickedCardInfo.sequence,
        nextSequence: clickedCardInfo.sequence + 1,
        complete: false,
        biznessEventProcessConfigurationId:
          clickedCardInfo.biznessEventProcessConfigurationId,
        firstEventNo: clickedCardInfo.firstEventNo,
        locationId:
          clickedCardInfo.eventLocationId || userInfo?.locationId || 0,
      };
    }

    const sendingObj: TenderExpenseForSalesPersonCommandsVM = {
      tenderExpenseForSalesPersonData: data,
      createBiznessEventPCTrackCommand: pcTrackToSave,
    };
    processExpense(sendingObj);
  };

  const chainLocked = !!clickedCardInfo?.biznessEventProcessConfigurationId;
  const formReady = !!watchedTenderNo?.procurementTenderId;
  const tenderNoInputRef = useRef<HTMLInputElement | null>(null);

  const requireTenderFirst = useCallback(() => {
    toast.warn('Select a Tender No first!');
    requestAnimationFrame(() => {
      tenderNoInputRef.current?.focus();
    });
  }, []);

  return (
    <div
      className="mt-16 md:mt-2 te-expense-root"
      style={
        {
          '--te-accent': currentColor,
          '--te-accent-soft': accentSoft,
          '--te-accent-soft-strong': accentSoftStrong,
          '--te-accent-ring': accentRing,
        } as React.CSSProperties
      }
    >
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <div className="block rounded-lg shadow-md bg-white dark:bg-secondary-dark-bg text-center overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Page chrome: title only */}
            <div className="te-page-head">
              <div className="te-page-head-left">
                <div
                  className="te-page-accent-dot"
                  style={{ background: currentColor }}
                />
                <h1 className="te-page-title">
                  {biznessEventName ?? 'Tender Expense For SP'}
                </h1>
              </div>
            </div>

            <div className="px-3 pb-2 text-start pt-2">
              {/* Full-width Tender No selector — above the 3 sections */}
              <div
                className={`te-tender-row${formReady ? ' te-tender-row--ready' : ''}`}
              >
                <div className="te-tender-badge">
                  <TagOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>Tender No</span>
                </div>
                <div className="te-tender-divider" />
                <div className="te-tender-field">
                  <Controller
                    name="tenderNo"
                    control={control}
                    rules={{ required: '*Required' }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        size="small"
                        options={tenderComboOptions || []}
                        loading={tenderComboLoading}
                        value={value || null}
                        readOnly={chainLocked || isViewMode}
                        onChange={(_e, item) =>
                          handleTenderChange(item, onChange)
                        }
                        onBlur={onBlur}
                        getOptionLabel={(option) =>
                          option ? option.tenderNo : ''
                        }
                        isOptionEqualToValue={(option, selected) =>
                          option.tenderNo === selected?.tenderNo &&
                          option.procurementTenderId ===
                            selected?.procurementTenderId
                        }
                        popupIcon={
                          <KeyboardArrowDownRoundedIcon
                            sx={{ fontSize: 18, color: 'var(--te-accent)' }}
                          />
                        }
                        fullWidth
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Search or select a tender…"
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                              style: {
                                ...inputFont,
                                fontWeight: 600,
                                letterSpacing: '0.01em',
                              },
                            }}
                            sx={{
                              width: '100%',
                              '& .MuiInputBase-root': {
                                minHeight: '30px',
                                paddingLeft: '2px',
                              },
                              '& .MuiInputBase-input::placeholder': {
                                opacity: 0.55,
                                fontWeight: 500,
                              },
                              '& .MuiFormHelperText-root': {
                                marginTop: 0,
                                fontSize: '0.65rem',
                              },
                            }}
                            inputRef={(el) => {
                              tenderNoInputRef.current = el;
                              if (typeof ref === 'function') ref(el);
                              else if (ref) {
                                (
                                  ref as React.MutableRefObject<HTMLInputElement | null>
                                ).current = el;
                              }
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
              </div>

              {/*
                LAYOUT_SIDE_BY_SIDE=true → 3 panels in a row (trial).
                Set LAYOUT_SIDE_BY_SIDE=false to restore previous stacked single-table.
              */}
              {expenseFetching ? (
                <div
                  className={
                    LAYOUT_SIDE_BY_SIDE
                      ? 'te-cols'
                      : 'te-cols te-cols--stacked'
                  }
                >
                  <SectionSkeleton rows={7} />
                  <SectionSkeleton rows={5} />
                  <SectionSkeleton rows={7} />
                </div>
              ) : (
              <div
                className={
                  LAYOUT_SIDE_BY_SIDE
                    ? 'te-cols'
                    : 'overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 te-sheet-wrap'
                }
              >
                {/* ——— Section 1 ——— */}
                <div className={LAYOUT_SIDE_BY_SIDE ? 'te-col-panel' : undefined}>
                  <table className="w-full border-collapse text-sm te-sp-sheet">
                    <tbody className="dark:text-gray-200">
                      <tr className="section-banner">
                        <td colSpan={3}>
                          <span className="section-num">01</span>
                          Securities, VAT &amp; Tax
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">
                          Tender Security
                          <small>BG Amount</small>
                        </td>
                        <td colSpan={2}>
                          <NumCell
                            value={expense.bgAmount}
                            onCommit={(raw) => setField('bgAmount', raw)}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                      </tr>
                      <tr className="col-head">
                        <th aria-label="label" />
                        <th className="text-center font-semibold">%</th>
                        <th className="text-center font-semibold">
                          Time Period
                        </th>
                      </tr>
                      <tr>
                        <td className="lbl">
                          SD
                          <small>Security Deposit</small>
                        </td>
                        <td>
                          <NumCell
                            value={expense.securityDepositP}
                            onCommit={(raw) =>
                              setField('securityDepositP', raw)
                            }
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td>
                          <NumCell
                            value={expense.securityDepositT}
                            onCommit={(raw) =>
                              setField('securityDepositT', raw)
                            }
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="Years"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">
                          Performance Security
                          <small>PG</small>
                        </td>
                        <td>
                          <NumCell
                            value={expense.performanceGuaranteeP}
                            onCommit={(raw) =>
                              setField('performanceGuaranteeP', raw)
                            }
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td>
                          <NumCell
                            value={expense.performanceGuaranteeT}
                            onCommit={(raw) =>
                              setField('performanceGuaranteeT', raw)
                            }
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="Years"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">PG Mode</td>
                        <td colSpan={2}>
                          <Controller
                            name="earnestMoney"
                            control={control}
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => (
                              <Autocomplete
                                size="small"
                                options={EARNEST_MONEY_OPTIONS}
                                value={value || null}
                                readOnly={isViewMode || !formReady}
                                onOpen={(e) => {
                                  if (!formReady && !isViewMode) {
                                    e.preventDefault();
                                    requireTenderFirst();
                                  }
                                }}
                                onChange={(_e, item) => {
                                  if (!formReady) return;
                                  onChange(item);
                                }}
                                onBlur={onBlur}
                                getOptionLabel={(o) =>
                                  o ? o.optionName : ''
                                }
                                isOptionEqualToValue={(a, b) =>
                                  a.optionName === b?.optionName
                                }
                                fullWidth
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder="Select PG Mode"
                                    onMouseDown={(e) => {
                                      if (!formReady && !isViewMode) {
                                        e.preventDefault();
                                        requireTenderFirst();
                                      }
                                    }}
                                    onFocus={(e) => {
                                      if (!formReady && !isViewMode) {
                                        e.target.blur();
                                        requireTenderFirst();
                                      }
                                    }}
                                    InputProps={{
                                      ...params.InputProps,
                                      disableUnderline: true,
                                      style: inputFont,
                                    }}
                                    sx={{
                                      width: '100%',
                                      marginTop: 0,
                                      '& .MuiInputBase-root': {
                                        backgroundColor: 'var(--te-input-bg)',
                                        color: 'var(--te-input-fg)',
                                        borderRadius: '5px',
                                        border:
                                          '1px solid var(--te-input-border)',
                                        paddingLeft: '6px',
                                        paddingRight: '6px',
                                        minHeight: '28px',
                                        transition:
                                          'border-color .15s, box-shadow .15s',
                                        cursor:
                                          !formReady && !isViewMode
                                            ? 'pointer'
                                            : undefined,
                                        '&:hover': {
                                          borderColor:
                                            'var(--te-input-border-hover)',
                                        },
                                        '&.Mui-focused': {
                                          borderColor: 'var(--te-accent)',
                                          boxShadow:
                                            '0 0 0 2px var(--te-accent-ring)',
                                        },
                                      },
                                      '& .MuiInputBase-input': {
                                        color: 'inherit',
                                        WebkitTextFillColor:
                                          'var(--te-input-fg)',
                                      },
                                    }}
                                    inputRef={ref}
                                  />
                                )}
                              />
                            )}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">VAT</td>
                        <td>
                          <NumCell
                            value={expense.vat}
                            onCommit={(raw) => setField('vat', raw)}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td className="muted-cell">—</td>
                      </tr>
                      <tr>
                        <td className="lbl">Tax</td>
                        <td>
                          <NumCell
                            value={expense.tax}
                            onCommit={(raw) => setField('tax', raw)}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td className="muted-cell">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ——— Section 2 ——— */}
                <div className={LAYOUT_SIDE_BY_SIDE ? 'te-col-panel' : undefined}>
                  <table className="w-full border-collapse text-sm te-sp-sheet">
                    <tbody className="dark:text-gray-200">
                      <tr className="section-banner">
                        <td colSpan={3}>
                          <span className="section-num">02</span>
                          Sales Expense
                        </td>
                      </tr>
                      <tr className="col-head">
                        <th aria-label="label" />
                        <th className="text-center font-semibold">
                          <label className="inline-flex items-center justify-center gap-0.5 cursor-pointer select-none">
                            <Checkbox
                              size="small"
                              checked={salesExpenseMode === 'amount'}
                              disabled={isViewMode}
                              onChange={() => {
                                if (!formReady) {
                                  requireTenderFirst();
                                  return;
                                }
                                if (salesExpenseMode !== 'amount') {
                                  handleSalesExpenseModeChange('amount');
                                }
                              }}
                              sx={{
                                color: 'var(--te-accent)',
                                '&.Mui-checked': {
                                  color: 'var(--te-accent)',
                                },
                                padding: '1px',
                              }}
                            />
                            Amount
                          </label>
                        </th>
                        <th className="text-center font-semibold">
                          <label className="inline-flex items-center justify-center gap-0.5 cursor-pointer select-none">
                            <Checkbox
                              size="small"
                              checked={salesExpenseMode === 'percentage'}
                              disabled={isViewMode}
                              onChange={() => {
                                if (!formReady) {
                                  requireTenderFirst();
                                  return;
                                }
                                if (salesExpenseMode !== 'percentage') {
                                  handleSalesExpenseModeChange('percentage');
                                }
                              }}
                              sx={{
                                color: 'var(--te-accent)',
                                '&.Mui-checked': {
                                  color: 'var(--te-accent)',
                                },
                                padding: '1px',
                              }}
                            />
                            %
                          </label>
                        </th>
                      </tr>
                      <tr>
                        <td className="sublbl">Advance</td>
                        <td>
                          <NumCell
                            value={expense.salesExpenseAdvanceA}
                            onCommit={(raw) =>
                              setField('salesExpenseAdvanceA', raw)
                            }
                            readOnly={salesExpenseMode === 'percentage'}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td>
                          <NumCell
                            value={expense.salesExpenseAdvanceP}
                            onCommit={(raw) =>
                              setField('salesExpenseAdvanceP', raw)
                            }
                            readOnly={salesExpenseMode === 'amount'}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="sublbl">Due</td>
                        <td>
                          <NumCell
                            value={expense.salesExpenseDueA}
                            onCommit={(raw) =>
                              setField('salesExpenseDueA', raw)
                            }
                            readOnly={salesExpenseMode === 'percentage'}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td>
                          <NumCell
                            value={expense.salesExpenseDueP}
                            onCommit={(raw) =>
                              setField('salesExpenseDueP', raw)
                            }
                            readOnly={salesExpenseMode === 'amount'}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="sublbl">Buffer (Others)</td>
                        <td>
                          <NumCell
                            value={expense.salesExpenseBufferA}
                            onCommit={(raw) =>
                              setField('salesExpenseBufferA', raw)
                            }
                            readOnly={salesExpenseMode === 'percentage'}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                        <td>
                          <NumCell
                            value={expense.salesExpenseBufferP}
                            onCommit={(raw) =>
                              setField('salesExpenseBufferP', raw)
                            }
                            readOnly={salesExpenseMode === 'amount'}
                            formReady={formReady}
                            isViewMode={isViewMode}
                            suffix="%"
                            onRequireTender={requireTenderFirst}
                          />
                        </td>
                      </tr>
                      <tr className="total-row">
                        <td className="font-semibold">Total</td>
                        <td className="font-semibold text-left">
                          {salesExpenseMode === 'amount'
                            ? salesExpenseTotalA.toLocaleString()
                            : '0'}
                        </td>
                        <td className="font-semibold text-left">
                          {salesExpenseMode === 'percentage'
                            ? `${salesExpenseTotalP.toLocaleString()}%`
                            : '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ——— Section 3 ——— */}
                <div className={LAYOUT_SIDE_BY_SIDE ? 'te-col-panel' : undefined}>
                  <table className="w-full border-collapse text-sm te-sp-sheet">
                    <tbody className="dark:text-gray-200">
                      <tr className="section-banner">
                        <td colSpan={3}>
                          <span className="section-num">03</span>
                          AG &amp; Additional Costs
                        </td>
                      </tr>
                      <tr className="col-head">
                        <th aria-label="label" />
                        <th className="text-center font-semibold">Amount</th>
                        <th className="text-center font-semibold">%</th>
                      </tr>
                      <ApRow
                        label="AG"
                        aValue={expense.agExpenseA}
                        pValue={expense.agExpenseP}
                        onCommitA={(raw) =>
                          handleApBlur('A', 'agExpenseA', 'agExpenseP', raw)
                        }
                        onCommitP={(raw) =>
                          handleApBlur('P', 'agExpenseA', 'agExpenseP', raw)
                        }
                        formReady={formReady}
                        isViewMode={isViewMode}
                        onRequireTender={requireTenderFirst}
                      />
                      <ApRow
                        label="Delivery"
                        aValue={expense.deliveryA}
                        onCommitA={(raw) => setField('deliveryA', raw)}
                        formReady={formReady}
                        isViewMode={isViewMode}
                        onRequireTender={requireTenderFirst}
                        omitPercentage
                      />
                      <ApRow
                        label="Installation"
                        aValue={expense.installationA}
                        onCommitA={(raw) => setField('installationA', raw)}
                        formReady={formReady}
                        isViewMode={isViewMode}
                        onRequireTender={requireTenderFirst}
                        omitPercentage
                      />
                      <ApRow
                        label="Training"
                        aValue={expense.trainingA}
                        onCommitA={(raw) => setField('trainingA', raw)}
                        formReady={formReady}
                        isViewMode={isViewMode}
                        onRequireTender={requireTenderFirst}
                        omitPercentage
                      />
                      <ApRow
                        label="Pre Shipment Insp."
                        aValue={expense.preShipmentInspectionA}
                        onCommitA={(raw) =>
                          setField('preShipmentInspectionA', raw)
                        }
                        formReady={formReady}
                        isViewMode={isViewMode}
                        onRequireTender={requireTenderFirst}
                        omitPercentage
                      />
                      <ApRow
                        label="Buffer / Others"
                        aValue={expense.bufferA}
                        onCommitA={(raw) => setField('bufferA', raw)}
                        formReady={formReady}
                        isViewMode={isViewMode}
                        onRequireTender={requireTenderFirst}
                        omitPercentage
                      />
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>

            <div className="te-footer">
              <div className="flex gap-x-3">
                {!isViewMode && (
                  <button
                    type="button"
                    className="te-btn-primary"
                    style={{ background: currentColor }}
                    onClick={saveFunct}
                    disabled={processLoading || !formReady}
                  >
                    {processLoading ? 'Saving…' : 'Save'}
                  </button>
                )}
                <button
                  type="button"
                  className="te-btn-ghost"
                  onClick={() => {
                    modalPageOpenerClose?.();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .te-expense-root {
          --te-input-bg: #ffffff;
          --te-input-fg: #111827;
          --te-input-border: #e5e7eb;
          --te-input-border-hover: #d1d5db;
        }
        .dark .te-expense-root {
          --te-input-bg: #1f2937;
          --te-input-fg: #e5e7eb;
          --te-input-border: #4b5563;
          --te-input-border-hover: #6b7280;
        }
        .te-page-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          padding: 8px 12px;
          border-bottom: 1px solid #eef0f3;
          background: linear-gradient(180deg, var(--te-accent-soft) 0%, transparent 100%);
        }
        .dark .te-page-head { border-bottom-color: #374151; }
        .te-page-head-left {
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
        }
        .te-page-accent-dot {
          width: 6px;
          height: 22px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .te-page-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #111827;
          line-height: 1.2;
        }
        .dark .te-page-title { color: #f3f4f6; }
        .te-tender-row {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 8px;
          padding: 4px;
          border: 1px solid var(--te-input-border);
          border-radius: 10px;
          background:
            linear-gradient(135deg, var(--te-accent-soft) 0%, var(--te-input-bg) 55%);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          transition: border-color .15s, box-shadow .15s;
          color: var(--te-input-fg);
        }
        .te-tender-row:focus-within {
          border-color: var(--te-accent);
          box-shadow:
            0 0 0 3px var(--te-accent-ring),
            0 1px 2px rgba(15, 23, 42, 0.04);
        }
        .te-tender-row--ready {
          border-color: color-mix(in srgb, var(--te-accent) 35%, var(--te-input-border));
        }
        .dark .te-tender-row {
          background: linear-gradient(135deg, var(--te-accent-soft-strong) 0%, #1f2937 55%);
          border-color: #4b5563;
        }
        .te-tender-row .MuiInputBase-root,
        .te-tender-row .MuiInputBase-input {
          color: var(--te-input-fg) !important;
          -webkit-text-fill-color: var(--te-input-fg) !important;
        }
        .te-tender-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          margin: 2px;
          padding: 6px 10px;
          border-radius: 7px;
          background: var(--te-accent);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.15);
          white-space: nowrap;
        }
        .te-tender-divider {
          width: 1px;
          align-self: stretch;
          margin: 6px 8px;
          background: color-mix(in srgb, var(--te-accent) 25%, #e5e7eb);
        }
        .te-tender-field {
          flex: 1;
          min-width: 0;
          padding-right: 4px;
        }
        /* 3-column trial — set LAYOUT_SIDE_BY_SIDE=false to undo */
        .te-cols {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          align-items: stretch;
        }
        .te-cols--stacked {
          grid-template-columns: 1fr;
        }
        .te-col-panel {
          border: 1px solid var(--te-input-border);
          border-radius: 6px;
          overflow: hidden;
          background: var(--te-input-bg);
          min-width: 0;
        }
        .dark .te-col-panel {
          border-color: #4b5563;
          background: #111827;
        }
        .te-col-panel .te-sp-sheet td.lbl {
          width: 38%;
        }
        .te-skeleton-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-bottom: 1px solid #eef0f3;
          box-shadow: inset 3px 0 0 var(--te-accent);
        }
        .te-skeleton-body {
          padding: 8px 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .te-skeleton-row {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: space-between;
        }
        @media (max-width: 1200px) {
          .te-cols {
            grid-template-columns: 1fr;
          }
        }
        .te-sp-sheet {
          font-size: 0.78rem;
        }
        .te-sp-sheet td,
        .te-sp-sheet th {
          border: 1px solid #eef0f3;
          padding: 3px 8px;
          vertical-align: middle;
          line-height: 1.25;
        }
        .dark .te-sp-sheet td,
        .dark .te-sp-sheet th {
          border-color: #374151;
        }
        .te-sp-sheet tr.section-banner td {
          background: var(--te-input-bg);
          color: var(--te-input-fg);
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 5px 8px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid var(--te-input-border);
          box-shadow: inset 3px 0 0 var(--te-accent);
        }
        .dark .te-sp-sheet tr.section-banner td {
          background: #111827;
          color: #f3f4f6;
          border-bottom-color: #374151;
        }
        .te-sp-sheet .section-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 16px;
          margin-right: 6px;
          padding: 0 5px;
          border-radius: 999px;
          background: var(--te-accent);
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
          vertical-align: middle;
        }
        .te-sp-sheet tr.col-head th {
          background: #fafbfc;
          color: #94a3b8;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-bottom: 1px solid #eef0f3;
        }
        .dark .te-sp-sheet tr.col-head th {
          background: #1f2937;
          color: #9ca3af;
        }
        .te-sp-sheet td.lbl {
          font-weight: 600;
          background: transparent;
          width: 26%;
          color: var(--te-input-fg);
          border-right: 1px solid var(--te-input-border);
          font-size: 0.75rem;
        }
        .dark .te-sp-sheet td.lbl {
          background: transparent;
          color: #e5e7eb;
        }
        .te-sp-sheet td.lbl small {
          display: inline;
          font-weight: 400;
          color: #94a3b8;
          font-size: 0.65rem;
          margin-left: 4px;
        }
        .te-sp-sheet td.lbl small::before {
          content: '· ';
        }
        .te-sp-sheet td.sublbl {
          color: var(--te-input-fg);
          font-style: normal;
          font-weight: 500;
          padding-left: 1.25rem;
          background: transparent;
          font-size: 0.75rem;
        }
        .dark .te-sp-sheet td.sublbl {
          color: #d1d5db;
          background: transparent;
        }
        .te-sp-sheet td.muted-cell {
          color: #cbd5e1;
          text-align: center;
          font-size: 0.75rem;
        }
        .te-sp-sheet tr.total-row td {
          background: var(--te-accent-soft);
          color: var(--te-accent);
          font-weight: 700;
          padding: 4px 8px;
          border-top: 1px solid var(--te-accent-soft-strong);
        }
        .te-footer {
          padding: 8px 12px;
          border-top: 1px solid #eef0f3;
          text-align: left;
          background: #fafbfc;
        }
        .dark .te-footer {
          background: #111827;
          border-top-color: #374151;
        }
        .te-btn-primary {
          padding: 5px 16px;
          color: #fff;
          font-weight: 600;
          font-size: 0.75rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: filter .15s, opacity .15s;
        }
        .te-btn-primary:hover { filter: brightness(0.95); }
        .te-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .te-btn-ghost {
          padding: 5px 14px;
          background: var(--te-input-bg);
          color: var(--te-input-fg);
          font-weight: 600;
          font-size: 0.75rem;
          border-radius: 6px;
          border: 1px solid var(--te-input-border);
          cursor: pointer;
        }
        .te-btn-ghost:hover { filter: brightness(0.95); }
        .dark .te-btn-ghost:hover { filter: brightness(1.1); }

        /* Checkbox denser in col heads */
        .te-sp-sheet tr.col-head .MuiCheckbox-root {
          padding: 2px;
        }
        .te-sp-sheet tr.col-head .MuiSvgIcon-root {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default TenderExpenseForSalesPerson;
