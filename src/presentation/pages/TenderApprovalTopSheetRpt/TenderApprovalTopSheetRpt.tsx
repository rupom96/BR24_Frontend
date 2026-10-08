/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  CircularProgress,
  TextField,
} from '@mui/material';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ITenderNoComboBox } from '../../../domain/interfaces/ProcurementTenderInterface';
import {
  useGetAllTenderNoQuery,
  useLazyGetTenderApprovalTopSheetQuery,
} from '../../../infrastructure/api/TenderApiSlice';
import { useAppSelector } from '../../../application/Redux/store/store';
import { hexToRgba } from '../../Utils/colorUtils';

interface TenderApprovalTopSheetRptProps {
  modalPageOpenerClose?: () => void;
  clickedCardInfo?: any;
  operationMode?: 'view' | 'edit' | string;
}

interface HeaderForm {
  tenderNo: ITenderNoComboBox | null;
}

const inputFont = { fontSize: '0.78rem' };

function errorTitleFromUnknown(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Report download failed';
  const err = error as {
    data?: { title?: string; Title?: string; detail?: string };
    error?: string;
    status?: number | string;
  };
  const title =
    err.data?.title ||
    err.data?.Title ||
    err.data?.detail ||
    (typeof err.error === 'string' ? err.error : null);
  if (title) return String(title);
  if (err.status === 401) return 'Unauthorized — please sign in again';
  return 'Report download failed';
}

const TenderApprovalTopSheetRpt: React.FC<TenderApprovalTopSheetRptProps> = ({
  clickedCardInfo,
  operationMode,
}) => {
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const accentSoft = hexToRgba(currentColor, 0.06);
  const accentSoftStrong = hexToRgba(currentColor, 0.12);
  const accentRing = hexToRgba(currentColor, 0.35);
  const biznessEventName = clickedCardInfo?.biznessEventName?.replace(
    /([a-z])([A-Z])/g,
    '$1 $2'
  );
  const isViewMode = operationMode === 'view';
  const chainLocked = !!clickedCardInfo?.biznessEventProcessConfigurationId;

  const { control, setValue, getValues, watch } = useForm<HeaderForm>({
    defaultValues: { tenderNo: null },
  });
  const watchedTenderNo = watch('tenderNo');
  const formReady = !!watchedTenderNo?.tenderNo;
  const tenderNoInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: tenderComboOptions,
    isLoading: tenderComboLoading,
    isError: tenderComboIsError,
  } = useGetAllTenderNoQuery();

  const [triggerDownload, { isFetching: downloadFetching }] =
    useLazyGetTenderApprovalTopSheetQuery();

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
  }, [clickedCardInfo, tenderComboOptions, setValue]);

  const downloadBlob = (blob: Blob, fileName: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleReportDownload = async () => {
    const tender = getValues('tenderNo');
    if (!tender?.tenderNo) {
      toast.warn('Select a Tender No first!');
      requestAnimationFrame(() => tenderNoInputRef.current?.focus());
      return;
    }

    try {
      const result = await triggerDownload({
        tenderNo: tender.tenderNo,
      }).unwrap();
      downloadBlob(result.blob, result.fileName);
      toast.success('Report downloaded');
    } catch (error) {
      const message = errorTitleFromUnknown(error);
      toast.error(message);
      console.log('getTenderApprovalTopSheet error ➜', error);
    }
  };

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
            <div className="te-page-head">
              <div className="te-page-head-left">
                <div
                  className="te-page-accent-dot"
                  style={{ background: currentColor }}
                />
                <h1 className="te-page-title">
                  {biznessEventName ?? 'Tender Approval Top Sheet Rpt'}
                </h1>
              </div>
            </div>

            <div className="px-3 pb-2 text-start pt-2">
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
                        onChange={(_e, item) => onChange(item)}
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
                              endAdornment: (
                                <>
                                  {tenderComboLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={16}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
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
            </div>

            <div className="te-footer">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  className="te-btn-primary"
                  style={{ background: currentColor }}
                  disabled={downloadFetching || !formReady}
                  onClick={() => {
                    if (downloadFetching) {
                      toast.warning('Please wait until the report is ready!');
                      return;
                    }
                    handleReportDownload();
                  }}
                >
                  {downloadFetching ? 'Please wait…' : 'Report Download'}
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
        }
        .te-tender-row:focus-within {
          border-color: var(--te-accent);
          box-shadow: 0 0 0 3px var(--te-accent-ring);
        }
        .te-tender-row--ready {
          border-color: color-mix(in srgb, var(--te-accent) 35%, var(--te-input-border));
        }
        .dark .te-tender-row {
          box-shadow: none;
        }
        .te-tender-row .MuiInputBase-root,
        .te-tender-row .MuiInputBase-input {
          color: var(--te-input-fg);
        }
        .te-tender-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin: 2px;
          padding: 6px 10px;
          border-radius: 8px;
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
      `}</style>
    </div>
  );
};

export default TenderApprovalTopSheetRpt;
