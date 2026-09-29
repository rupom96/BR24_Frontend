/* eslint-disable no-void */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/control-has-associated-label */

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
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Popper,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

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

import {
  IBuyerOption,
  IGetSalesOrderDetailTrackingDto,
  IProductInfoDto,
  IProductOption,
  ISalesOrderDetailRow,
  ISalesOrderTrackingFormModel,
} from '../../../domain/interfaces/SalesOrderTrackingInterface';

import {
  useLazyGetBuyerOptionsQuery,
  useLazyGetProductInfoQuery,
  useLazyGetProductOptionsQuery,
  useLazyGetSalesOrderDetailTrackingQuery,
  useSaveSalesOrderMutation,
} from '../../../infrastructure/api/SalesOrderTrackingApiSlice';
import {
  ICreateSalesOrderCommand,
  ICreateSalesOrderDeliveryCommand,
  ICreateSalesOrderDetailCommand,
  ICreateSalesOrderDetailTaxCommand,
  IDeleteSalesOrderDetailCommand,
  ISalesOrderTrackingProcessCommandsVM,
  IUpdateSalesOrderCommand,
  IUpdateSalesOrderDetailCommand,
  IUpdateSalesOrderDetailTaxCommand,
} from '../../../domain/interfaces/SalesOrderInterface';

type Props = {
  salesOrderId?: string | null;
  salesOrderNo?: string | null;
  salesOrderDeliveryId?: string | null;
  deliveryType?: string | null;
};

type RowModalMode = 'add' | 'edit';
type ProductSpecificationComponentKey = 'spectacles-lens' | null;
type FocalType = 'UniFocal' | 'BiFocal';
type EyeSide = 'right' | 'left';
type LensSign = '+' | '-';

interface IRowModalFormModel {
  product: IProductOption | null;
  quantity: string;
  price: string;
}

interface ISignedLensValue {
  sign: LensSign;
  value: string;
}

interface ISpectacleLensEyeState {
  type: string;
  sph: ISignedLensValue;
  sph1: ISignedLensValue;
  sph2: ISignedLensValue;
  cyl: ISignedLensValue;
  cyl1: ISignedLensValue;
  cyl2: ISignedLensValue;
  axis: ISignedLensValue;
  axis1: ISignedLensValue;
  axis2: ISignedLensValue;
  additional: ISignedLensValue;
  additional1: ISignedLensValue;
  additional2: ISignedLensValue;
}

interface ISpectacleLensFormState {
  base: string;
  ipd: string;
  size: string;
  focalType: FocalType;
  right: ISpectacleLensEyeState;
  left: ISpectacleLensEyeState;
}

interface ISpectacleLensSpecificationFormProps {
  productName?: string | null;
  initialValue?: string | null;
  onSubmit: (serializedValue: string) => void;
  onClose: () => void;
}

const lensTypeOptions = ['Thin', 'Medium', 'Regular', 'Premium'];
const deliveryTypeOptions = ['Normal', 'Express'];

const makeEmptyDetailRow = (): ISalesOrderDetailRow => ({
  salesOrderDetailId: null,
  salesOrderId: null,
  productId: null,
  productName: null,
  unitTypeId: null,
  quantity: null,
  price: null,
  specificationValue: null,
  productVat: null,
  productTax: null,
  vatRowId: null,
  taxRowId: null,
});

const ensureMinRows = (rows: ISalesOrderDetailRow[], min = 10) => {
  const copy = rows ? JSON.parse(JSON.stringify(rows)) : [];
  while (copy.length < min) copy.push(makeEmptyDetailRow());
  return copy as ISalesOrderDetailRow[];
};

const ensureTrailingEmptyRow = (rows: ISalesOrderDetailRow[]) => {
  const copy = rows ? [...rows] : [];
  if (!copy.length) return [makeEmptyDetailRow()];
  const last = copy[copy.length - 1];
  if (last?.productId != null) copy.push(makeEmptyDetailRow());
  return copy;
};

const parseNumberSafe = (v: string): number | null => {
  const s = String(v ?? '').trim();
  if (!s) return null;

  const cleaned = s.replace(/[^\d.]/g, '');
  if (!cleaned) return null;

  const parts = cleaned.split('.');
  const normalized =
    parts.length <= 2 ? cleaned : `${parts[0]}.${parts.slice(1).join('')}`;

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;

  return n < 0 ? 0 : n;
};

const sanitizeDecimalInput = (v: string) => {
  const raw = String(v ?? '');
  const cleaned = raw.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  return parts.length <= 2 ? cleaned : `${parts[0]}.${parts.slice(1).join('')}`;
};

const makeSignedLensValue = (raw?: string | null): ISignedLensValue => {
  const value = String(raw ?? '').trim();
  if (!value) return { sign: '-', value: '' };

  if (value.startsWith('-')) {
    return { sign: '-', value: sanitizeDecimalInput(value.slice(1)) };
  }

  if (value.startsWith('+')) {
    return { sign: '+', value: sanitizeDecimalInput(value.slice(1)) };
  }

  return { sign: '+', value: sanitizeDecimalInput(value) };
};

const serializeSignedLensValue = (signedValue: ISignedLensValue): string => {
  const normalized = sanitizeDecimalInput(
    String(signedValue?.value ?? '').trim()
  );
  if (!normalized) return '';

  if (Number(normalized) === 0) return '0';
  return signedValue.sign === '-' ? `-${normalized}` : normalized;
};

const getSignedInputDisplayValue = (signedValue: ISignedLensValue): string => {
  const normalized = sanitizeDecimalInput(
    String(signedValue?.value ?? '').trim()
  );

  if (!normalized) return '';
  return signedValue.sign === '-' ? `-${normalized}` : normalized;
};

const makeDefaultSpectacleLensEyeState = (): ISpectacleLensEyeState => ({
  type: '',
  sph: { sign: '-', value: '' },
  sph1: { sign: '-', value: '' },
  sph2: { sign: '-', value: '' },
  cyl: { sign: '-', value: '' },
  cyl1: { sign: '-', value: '' },
  cyl2: { sign: '-', value: '' },
  axis: { sign: '-', value: '' },
  axis1: { sign: '-', value: '' },
  axis2: { sign: '-', value: '' },
  additional: { sign: '-', value: '' },
  additional1: { sign: '-', value: '' },
  additional2: { sign: '-', value: '' },
});

const parseKeyValueSpecification = (specificationValue?: string | null) => {
  const map: Record<string, string> = {};

  String(specificationValue ?? '')
    .split(',')
    .forEach((part) => {
      const segment = part.trim();
      if (!segment) return;

      const idx = segment.indexOf('#');
      if (idx < 0) return;

      const key = segment.slice(0, idx).trim();
      const value = segment.slice(idx + 1).trim();

      if (key) map[key] = value;
    });

  return map;
};

const parseSpectacleLensSpecification = (
  specificationValue?: string | null
): ISpectacleLensFormState => {
  const parsed = parseKeyValueSpecification(specificationValue);
  const right = makeDefaultSpectacleLensEyeState();
  const left = makeDefaultSpectacleLensEyeState();

  right.type = parsed['Type(R)'] ?? '';
  left.type = parsed['Type(L)'] ?? '';

  right.sph = makeSignedLensValue(parsed['SPH(R)']);
  right.sph1 = makeSignedLensValue(parsed['SPH1(R)']);
  right.sph2 = makeSignedLensValue(parsed['SPH2(R)']);

  right.cyl = makeSignedLensValue(parsed['CYL(R)']);
  right.cyl1 = makeSignedLensValue(parsed['CYL1(R)']);
  right.cyl2 = makeSignedLensValue(parsed['CYL2(R)']);

  right.axis = makeSignedLensValue(parsed['AXIS(R)']);
  right.axis1 = makeSignedLensValue(parsed['AXIS1(R)']);
  right.axis2 = makeSignedLensValue(parsed['AXIS2(R)']);

  right.additional = makeSignedLensValue(parsed['Additional(R)']);
  right.additional1 = makeSignedLensValue(parsed['Additional1(R)']);
  right.additional2 = makeSignedLensValue(parsed['Additional2(R)']);

  left.sph = makeSignedLensValue(parsed['SPH(L)']);
  left.sph1 = makeSignedLensValue(parsed['SPH1(L)']);
  left.sph2 = makeSignedLensValue(parsed['SPH2(L)']);

  left.cyl = makeSignedLensValue(parsed['CYL(L)']);
  left.cyl1 = makeSignedLensValue(parsed['CYL1(L)']);
  left.cyl2 = makeSignedLensValue(parsed['CYL2(L)']);

  left.axis = makeSignedLensValue(parsed['AXIS(L)']);
  left.axis1 = makeSignedLensValue(parsed['AXIS1(L)']);
  left.axis2 = makeSignedLensValue(parsed['AXIS2(L)']);

  left.additional = makeSignedLensValue(parsed['Additional(L)']);
  left.additional1 = makeSignedLensValue(parsed['Additional1(L)']);
  left.additional2 = makeSignedLensValue(parsed['Additional2(L)']);

  return {
    base: parsed.Base ?? '',
    ipd: parsed.IPD ?? '',
    size: parsed.Size ?? '',
    focalType: parsed.FocalType === 'BiFocal' ? 'BiFocal' : 'UniFocal',
    right,
    left,
  };
};

const serializeSpectacleLensSpecification = (
  state: ISpectacleLensFormState
): string => {
  const parts: string[] = [
    `Base#${String(state.base ?? '').trim()}`,
    `IPD#${String(state.ipd ?? '').trim()}`,
    `Size#${String(state.size ?? '').trim()}`,
    `FocalType#${state.focalType}`,
  ];

  parts.push(`Type(R)#${state.right.type ?? ''}`);

  if (state.focalType === 'UniFocal') {
    parts.push(`SPH(R)#${serializeSignedLensValue(state.right.sph)}`);
    parts.push(`CYL(R)#${serializeSignedLensValue(state.right.cyl)}`);
    parts.push(`AXIS(R)#${serializeSignedLensValue(state.right.axis)}`);
    parts.push(
      `Additional(R)#${serializeSignedLensValue(state.right.additional)}`
    );
  } else {
    parts.push(`SPH1(R)#${serializeSignedLensValue(state.right.sph1)}`);
    parts.push(`SPH2(R)#${serializeSignedLensValue(state.right.sph2)}`);
    parts.push(`CYL1(R)#${serializeSignedLensValue(state.right.cyl1)}`);
    parts.push(`CYL2(R)#${serializeSignedLensValue(state.right.cyl2)}`);
    parts.push(`AXIS1(R)#${serializeSignedLensValue(state.right.axis1)}`);
    parts.push(`AXIS2(R)#${serializeSignedLensValue(state.right.axis2)}`);
    parts.push(
      `Additional1(R)#${serializeSignedLensValue(state.right.additional1)}`
    );
    parts.push(
      `Additional2(R)#${serializeSignedLensValue(state.right.additional2)}`
    );
  }

  parts.push(`Type(L)#${state.left.type ?? ''}`);

  if (state.focalType === 'UniFocal') {
    parts.push(`SPH(L)#${serializeSignedLensValue(state.left.sph)}`);
    parts.push(`CYL(L)#${serializeSignedLensValue(state.left.cyl)}`);
    parts.push(`AXIS(L)#${serializeSignedLensValue(state.left.axis)}`);
    parts.push(
      `Additional(L)#${serializeSignedLensValue(state.left.additional)}`
    );
  } else {
    parts.push(`SPH1(L)#${serializeSignedLensValue(state.left.sph1)}`);
    parts.push(`SPH2(L)#${serializeSignedLensValue(state.left.sph2)}`);
    parts.push(`CYL1(L)#${serializeSignedLensValue(state.left.cyl1)}`);
    parts.push(`CYL2(L)#${serializeSignedLensValue(state.left.cyl2)}`);
    parts.push(`AXIS1(L)#${serializeSignedLensValue(state.left.axis1)}`);
    parts.push(`AXIS2(L)#${serializeSignedLensValue(state.left.axis2)}`);
    parts.push(
      `Additional1(L)#${serializeSignedLensValue(state.left.additional1)}`
    );
    parts.push(
      `Additional2(L)#${serializeSignedLensValue(state.left.additional2)}`
    );
  }

  return parts.join(', ');
};

const SpectacleLensSpecificationForm = ({
  productName,
  initialValue,
  onSubmit,
  onClose,
}: ISpectacleLensSpecificationFormProps) => {
  const [form, setForm] = useState<ISpectacleLensFormState>(
    parseSpectacleLensSpecification(initialValue)
  );

  useEffect(() => {
    setForm(parseSpectacleLensSpecification(initialValue));
  }, [initialValue]);

  const updateEyeType = (eye: EyeSide, value: string) => {
    setForm((prev) => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        type: value,
      },
    }));
  };

  const updateSignedFieldValue = (
    eye: EyeSide,
    fieldKey: keyof ISpectacleLensEyeState,
    value: string
  ) => {
    setForm((prev) => {
      const nextEye: any = { ...prev[eye] };
      const current: ISignedLensValue = nextEye[fieldKey];

      const raw = String(value ?? '').trim();
      const nextSign = raw.startsWith('-')
        ? '-'
        : raw.startsWith('+')
          ? '+'
          : current.sign;

      nextEye[fieldKey] = {
        ...current,
        sign: nextSign,
        value: sanitizeDecimalInput(raw.replace(/^[+-]/, '')),
      };

      return {
        ...prev,
        [eye]: nextEye,
      };
    });
  };

  const toggleSignedFieldSign = (
    eye: EyeSide,
    fieldKey: keyof ISpectacleLensEyeState
  ) => {
    setForm((prev) => {
      const nextEye: any = { ...prev[eye] };
      const current: ISignedLensValue = nextEye[fieldKey];

      nextEye[fieldKey] = {
        ...current,
        sign: current.sign === '-' ? '+' : '-',
      };

      return {
        ...prev,
        [eye]: nextEye,
      };
    });
  };

  const updateCommonField = (field: 'base' | 'ipd' | 'size', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderSingleSignedField = (
    eye: EyeSide,
    label: string,
    fieldKey: keyof ISpectacleLensEyeState,
    placeholder: string
  ) => {
    const eyeState: any = form[eye];
    const fieldValue: ISignedLensValue = eyeState[fieldKey];

    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-[0.8125rem] font-semibold text-gray-700">{label}</div>
          <button
            type="button"
            className="min-w-[1.5rem] h-[1.5rem] px-2 rounded bg-red-500 text-white text-xs font-bold shadow-sm"
            onClick={() => toggleSignedFieldSign(eye, fieldKey)}
          >
            {fieldValue.sign}
          </button>
        </div>

        <TextField
          fullWidth
          value={getSignedInputDisplayValue(fieldValue)}
          onChange={(e) =>
            updateSignedFieldValue(eye, fieldKey, e.target.value)
          }
          placeholder={placeholder}
          variant="outlined"
          size="small"
          inputMode="decimal"
          InputProps={{
            style: { fontSize: '0.8125rem' },
          }}
        />
      </div>
    );
  };

  const renderDoubleSignedField = (
    eye: EyeSide,
    firstLabel: string,
    secondLabel: string,
    firstKey: keyof ISpectacleLensEyeState,
    secondKey: keyof ISpectacleLensEyeState,
    firstPlaceholder: string,
    secondPlaceholder: string
  ) => {
    const eyeState: any = form[eye];
    const firstValue: ISignedLensValue = eyeState[firstKey];
    const secondValue: ISignedLensValue = eyeState[secondKey];

    return (
      <div className="mb-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[0.8125rem] font-semibold text-gray-700">
                {firstLabel}
              </div>
              <button
                type="button"
                className="min-w-[1.5rem] h-[1.5rem] px-2 rounded bg-red-500 text-white text-xs font-bold shadow-sm"
                onClick={() => toggleSignedFieldSign(eye, firstKey)}
              >
                {firstValue.sign}
              </button>
            </div>

            <TextField
              fullWidth
              value={getSignedInputDisplayValue(firstValue)}
              onChange={(e) =>
                updateSignedFieldValue(eye, firstKey, e.target.value)
              }
              placeholder={firstPlaceholder}
              variant="outlined"
              size="small"
              inputMode="decimal"
              InputProps={{
                style: { fontSize: '0.8125rem' },
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[0.8125rem] font-semibold text-gray-700">
                {secondLabel}
              </div>
              <button
                type="button"
                className="min-w-[1.5rem] h-[1.5rem] px-2 rounded bg-red-500 text-white text-xs font-bold shadow-sm"
                onClick={() => toggleSignedFieldSign(eye, secondKey)}
              >
                {secondValue.sign}
              </button>
            </div>

            <TextField
              fullWidth
              value={getSignedInputDisplayValue(secondValue)}
              onChange={(e) =>
                updateSignedFieldValue(eye, secondKey, e.target.value)
              }
              placeholder={secondPlaceholder}
              variant="outlined"
              size="small"
              inputMode="decimal"
              InputProps={{
                style: { fontSize: '0.8125rem' },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderEyePanel = (eye: EyeSide, title: string) => {
    const eyeState = form[eye];

    return (
      <div className="border border-gray-300 rounded-xl p-4 bg-white">
        <div className="text-center text-blue-600 text-lg font-semibold mb-3">
          {title}
        </div>

        <div className="border-b border-gray-200 mb-4" />

        <div className="mb-3">
          <TextField
            select
            fullWidth
            value={eyeState.type}
            onChange={(e) => updateEyeType(eye, e.target.value)}
            label="Type"
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { fontSize: '0.875rem' } }}
            InputProps={{ style: { fontSize: '0.8125rem' } }}
          >
            <MenuItem value="">Select Type</MenuItem>
            {lensTypeOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {form.focalType === 'UniFocal' ? (
          <>
            {renderSingleSignedField(eye, 'SPH', 'sph', 'Enter SPH')}
            {renderSingleSignedField(eye, 'CYL', 'cyl', 'Enter CYL')}
            {renderSingleSignedField(eye, 'AXIS', 'axis', 'Enter AXIS')}
            {renderSingleSignedField(
              eye,
              'Additional',
              'additional',
              'Enter Additional'
            )}
          </>
        ) : (
          <>
            {renderDoubleSignedField(
              eye,
              'SPH1',
              'SPH2',
              'sph1',
              'sph2',
              'Enter SPH1',
              'Enter SPH2'
            )}
            {renderDoubleSignedField(
              eye,
              'CYL1',
              'CYL2',
              'cyl1',
              'cyl2',
              'Enter CYL1',
              'Enter CYL2'
            )}
            {renderDoubleSignedField(
              eye,
              'AXIS1',
              'AXIS2',
              'axis1',
              'axis2',
              'Enter AXIS1',
              'Enter AXIS2'
            )}
            {renderDoubleSignedField(
              eye,
              'Additional1',
              'Additional2',
              'additional1',
              'additional2',
              'Enter Additional1',
              'Enter Additional2'
            )}
          </>
        )}
      </div>
    );
  };

  const onLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(serializeSpectacleLensSpecification(form));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '92vw', md: '900px' },
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: 24,
      }}
    >
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-blue-600 rounded-t-xl"
        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}
      >
        <div className="text-white text-lg font-semibold">
          Additional Information
        </div>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={onLocalSubmit} className="p-4 md:p-6 bg-gray-50">
        {!!productName && (
          <div className="text-sm text-gray-600 mb-4">{productName}</div>
        )}

        <div className="border border-gray-300 rounded-xl bg-slate-100 px-4 py-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <TextField
              fullWidth
              value={form.base}
              onChange={(e) => updateCommonField('base', e.target.value)}
              label="Base"
              variant="outlined"
              size="small"
              inputMode="decimal"
              InputLabelProps={{ style: { fontSize: '0.875rem' } }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
            />

            <TextField
              fullWidth
              value={form.ipd}
              onChange={(e) => updateCommonField('ipd', e.target.value)}
              label="IPD"
              variant="outlined"
              size="small"
              inputMode="decimal"
              InputLabelProps={{ style: { fontSize: '0.875rem' } }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
            />

            <TextField
              fullWidth
              value={form.size}
              onChange={(e) => updateCommonField('size', e.target.value)}
              label="Size"
              variant="outlined"
              size="small"
              InputLabelProps={{ style: { fontSize: '0.875rem' } }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              type="button"
              className={`min-w-[9.375rem] h-[3rem] rounded-lg border text-sm font-semibold transition-all duration-150 ${
                form.focalType === 'UniFocal'
                  ? 'border-blue-500 text-gray-700 bg-white shadow-md'
                  : 'border-gray-300 text-gray-600 bg-white'
              }`}
              onClick={() =>
                setForm((prev) => ({ ...prev, focalType: 'UniFocal' }))
              }
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full border-2 inline-block ${
                    form.focalType === 'UniFocal'
                      ? 'border-blue-600'
                      : 'border-gray-400'
                  }`}
                />
                Uni Focal
              </span>
            </button>

            <button
              type="button"
              className={`min-w-[9.375rem] h-[3rem] rounded-lg border text-sm font-semibold transition-all duration-150 ${
                form.focalType === 'BiFocal'
                  ? 'border-blue-500 text-gray-700 bg-white shadow-md'
                  : 'border-gray-300 text-gray-600 bg-white'
              }`}
              onClick={() =>
                setForm((prev) => ({ ...prev, focalType: 'BiFocal' }))
              }
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full border-2 inline-block ${
                    form.focalType === 'BiFocal'
                      ? 'border-blue-600'
                      : 'border-gray-400'
                  }`}
                />
                Bi Focal
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderEyePanel('right', 'Right Eye (OD)')}
          {renderEyePanel('left', 'Left Eye (OS)')}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg transform-all duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    </Box>
  );
};

const SalesOrderTracking = ({
  salesOrderId,
  salesOrderNo,
  salesOrderDeliveryId,
  deliveryType,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [currentSalesOrderId, setCurrentSalesOrderId] = useState<string | null>(
    salesOrderId ?? null
  );
  const [currentSalesOrderNo, setCurrentSalesOrderNo] = useState<string>(
    salesOrderNo ?? ''
  );

  const [productInfoMap, setProductInfoMap] = useState<
    Record<number, IProductInfoDto>
  >({});

  const buyerInfo = useMemo(() => {
    try {
      const jsonBuyerInfo = localStorage.getItem('buyerInfo');
      return jsonBuyerInfo ? JSON.parse(jsonBuyerInfo) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, []);

  const loggedInBuyerOption = useMemo<IBuyerOption | null>(() => {
    if (!buyerInfo) return null;

    return {
      buyerId: Number(buyerInfo.buyerId) || 0,
      name: buyerInfo.buyerName ?? '',
      address: buyerInfo.address ?? '',
      phone: buyerInfo.phoneNo ?? '',
      restLimit: Number(buyerInfo.restLimit) || 0,
    };
  }, [buyerInfo]);

  const { control, setValue } = useForm<ISalesOrderTrackingFormModel>({
    defaultValues: {
      salesOrderNo: currentSalesOrderNo,
      date: dayjs(),
      buyer: loggedInBuyerOption,
      buyerAddress: loggedInBuyerOption?.address ?? '',
      buyerPhone: loggedInBuyerOption?.phone ?? '',
      restLimit: Number(loggedInBuyerOption?.restLimit) || 0,
      deliveryType: deliveryType || 'Normal',
    },
  });

  const watchedBuyer = useWatch({ control, name: 'buyer' });
  const watchedDate = useWatch({ control, name: 'date' }) as Dayjs | null;
  const watchedDeliveryType = useWatch({
    control,
    name: 'deliveryType',
  }) as string | null;

  const {
    control: rowModalControl,
    handleSubmit: handleRowModalSubmit,
    reset: resetRowModal,
    setValue: setRowModalValue,
  } = useForm<IRowModalFormModel>({
    defaultValues: {
      product: null,
      quantity: '',
      price: '',
    },
  });

  const [detailGrid, setDetailGrid] = useState<ISalesOrderDetailRow[]>(
    ensureMinRows([], 10)
  );

  const [deletedDetails, setDeletedDetails] = useState<
    IDeleteSalesOrderDetailCommand[]
  >([]);

  const [sortingGrid, setSortingGrid] = useState<MRT_SortingState>([]);
  const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  const [rowModalOpen, setRowModalOpen] = useState<boolean>(false);
  const [rowModalMode, setRowModalMode] = useState<RowModalMode>('add');
  const [editingRowIdx, setEditingRowIdx] = useState<number | null>(null);

  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [mobileMenuRowIdx, setMobileMenuRowIdx] = useState<number | null>(null);

  const [specificationModalOpen, setSpecificationModalOpen] =
    useState<boolean>(false);
  const [specificationModalRowIdx, setSpecificationModalRowIdx] = useState<
    number | null
  >(null);
  const [specificationModalComponentKey, setSpecificationModalComponentKey] =
    useState<ProductSpecificationComponentKey>(null);

  const openMobileMenu = (e: React.MouseEvent<HTMLElement>, idx: number) => {
    e.stopPropagation();
    setMobileMenuAnchorEl(e.currentTarget);
    setMobileMenuRowIdx(idx);
  };

  const closeMobileMenu = () => {
    setMobileMenuAnchorEl(null);
    setMobileMenuRowIdx(null);
  };

  const [
    triggerBuyerOptions,
    {
      data: buyerOptionsData,
      isFetching: buyerFetching,
      isError: buyerIsError,
      error: buyerError,
    },
  ] = useLazyGetBuyerOptionsQuery();

  const buyerAutocompleteOptions = useMemo<IBuyerOption[]>(() => {
    const base = buyerOptionsData ?? [];

    if (!loggedInBuyerOption?.buyerId) return base;

    const exists = base.some(
      (b) => Number(b.buyerId) === Number(loggedInBuyerOption.buyerId)
    );

    return exists ? base : [loggedInBuyerOption, ...base];
  }, [buyerOptionsData, loggedInBuyerOption]);

  const [
    triggerProductOptions,
    {
      data: productOptionsData,
      isFetching: productFetching,
      isError: productIsError,
      error: productError,
    },
  ] = useLazyGetProductOptionsQuery();

  const [
    triggerGetSalesOrderDetailTracking,
    {
      data: detailTrackingData,
      isFetching: detailTrackingFetching,
      isError: detailTrackingIsError,
      error: detailTrackingError,
      isSuccess: detailTrackingIsSuccess,
    },
  ] = useLazyGetSalesOrderDetailTrackingQuery();

  const [
    triggerGetProductInfo,
    {
      isFetching: productInfoFetching,
      isError: productInfoIsError,
      error: productInfoError,
    },
  ] = useLazyGetProductInfoQuery();

  const [saveSalesOrder, { isLoading: saveLoading }] =
    useSaveSalesOrderMutation();

  useEffect(() => {
    setCurrentSalesOrderId(salesOrderId ?? null);
    setCurrentSalesOrderNo(salesOrderNo ?? '');
  }, [salesOrderId, salesOrderNo]);

  useEffect(() => {
    setValue('salesOrderNo', currentSalesOrderNo ?? '', {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [currentSalesOrderNo, setValue]);

  useEffect(() => {
    if (!loggedInBuyerOption) return;

    setValue('buyer', loggedInBuyerOption, {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('buyerAddress', loggedInBuyerOption.address ?? '', {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('buyerPhone', loggedInBuyerOption.phone ?? '', {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('restLimit', Number(loggedInBuyerOption.restLimit) || 0, {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('deliveryType', deliveryType || 'Normal', {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [loggedInBuyerOption, setValue, deliveryType]);

  useEffect(() => {
    triggerBuyerOptions({ companyId: buyerInfo?.companyId });
    triggerProductOptions({ companyId: buyerInfo?.companyId });
  }, [triggerBuyerOptions, triggerProductOptions, buyerInfo?.companyId]);

  useEffect(() => {
    if (!currentSalesOrderId) {
      setDetailGrid(ensureMinRows([], 10));
      setDeletedDetails([]);
      return;
    }

    triggerGetSalesOrderDetailTracking({ salesOrderId: currentSalesOrderId });
  }, [currentSalesOrderId, triggerGetSalesOrderDetailTracking]);

  useEffect(() => {
    if (buyerIsError) {
      toast.error('Buyer options fetch failed, see console!');
      console.log(buyerError);
    }
    if (productIsError) {
      toast.error('Product options fetch failed, see console!');
      console.log(productError);
    }
    if (detailTrackingIsError) {
      toast.error('Sales order detail tracking fetch failed, see console!');
      console.log(detailTrackingError);
    }
    if (productInfoIsError) {
      toast.error('Product info fetch failed, see console!');
      console.log(productInfoError);
    }
  }, [
    buyerIsError,
    buyerError,
    productIsError,
    productError,
    detailTrackingIsError,
    detailTrackingError,
    productInfoIsError,
    productInfoError,
  ]);

  const cacheProductInfo = useCallback((productInfo: IProductInfoDto) => {
    setProductInfoMap((prev) => ({
      ...prev,
      [productInfo.productId]: productInfo,
    }));
  }, []);

  const resolveProductInfo = useCallback(
    async (productId: number) => {
      if (productInfoMap[productId]) {
        return productInfoMap[productId];
      }

      const info = await triggerGetProductInfo({ productId }).unwrap();
      cacheProductInfo(info);
      return info;
    },
    [productInfoMap, triggerGetProductInfo, cacheProductInfo]
  );

  const getSpecificationComponentKeyFromText = useCallback(
    (specificationText?: string | null): ProductSpecificationComponentKey => {
      const specText = String(specificationText ?? '')
        .trim()
        .toLowerCase();

      if (specText === 'spectacles lens' || specText === 'spectacle lens') {
        return 'spectacles-lens';
      }

      return null;
    },
    []
  );

  const populateFromSalesOrderDetailTracking = useCallback(
    (response: IGetSalesOrderDetailTrackingDto) => {
      const header: any = response?.salesOrderHeader ?? {};
      const details = response?.salesOrderDetails ?? [];

      const buyerId =
        header?.buyerId ?? header?.BuyerId ?? header?.buyerID ?? null;
      const buyerName = header?.buyerName ?? header?.BuyerName ?? '';
      const buyerAddress = header?.buyerAddress ?? header?.BuyerAddress ?? '';
      const buyerPhone = header?.buyerPhone ?? header?.BuyerPhone ?? '';

      setCurrentSalesOrderId(header?.salesOrderId ?? currentSalesOrderId);
      setCurrentSalesOrderNo(header?.salesOrderNo ?? currentSalesOrderNo);

      setValue('salesOrderNo', header?.salesOrderNo ?? '', {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue('date', dayjs(header?.date), {
        shouldDirty: false,
        shouldValidate: false,
      });

      const buyerObj: IBuyerOption | null =
        buyerId != null
          ? ((buyerAutocompleteOptions ?? []).find(
              (b) => b.buyerId === Number(buyerId)
            ) ?? {
              buyerId: Number(buyerId),
              name: buyerName || '',
              address: buyerAddress || '',
              phone: buyerPhone || '',
              restLimit: Number(buyerInfo?.restLimit) || 0,
            })
          : loggedInBuyerOption;

      setValue('buyer', buyerObj, {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue('buyerAddress', buyerObj?.address ?? buyerAddress ?? '', {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue('buyerPhone', buyerObj?.phone ?? buyerPhone ?? '', {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue(
        'restLimit',
        Number(buyerObj?.restLimit ?? buyerInfo?.restLimit ?? 0),
        {
          shouldDirty: false,
          shouldValidate: false,
        }
      );

      setValue('deliveryType', header?.deliveryType ?? 'Normal', {
        shouldDirty: false,
        shouldValidate: false,
      });

      const mappedRows: ISalesOrderDetailRow[] = details.map((d) => ({
        salesOrderDetailId: d.salesOrderDetailId ?? null,
        salesOrderId: d.salesOrderId ?? null,
        productId: d.productId ?? null,
        productName: d.productName ?? null,
        unitTypeId: d.unitTypeId ?? null,
        quantity: d.quantity ?? null,
        price: d.price ?? null,
        specificationValue: d.specificationValue ?? null,
        productVat: d.vatAmount ?? null,
        productTax: d.taxAmount ?? null,
        vatRowId: d.vatRowId ?? null,
        taxRowId: d.taxRowId ?? null,
      }));

      const hydratedRows = ensureMinRows(
        ensureTrailingEmptyRow(mappedRows),
        10
      );
      setDetailGrid(hydratedRows);
      setDeletedDetails([]);
    },
    [
      buyerAutocompleteOptions,
      buyerInfo?.restLimit,
      loggedInBuyerOption,
      currentSalesOrderId,
      currentSalesOrderNo,
      setValue,
    ]
  );

  useEffect(() => {
    if (detailTrackingFetching) {
      setIsGridLoading(true);
      return;
    }

    if (detailTrackingIsSuccess && detailTrackingData) {
      setIsGridLoading(false);
      populateFromSalesOrderDetailTracking(detailTrackingData);
    }
  }, [
    detailTrackingFetching,
    detailTrackingIsSuccess,
    detailTrackingData,
    populateFromSalesOrderDetailTracking,
  ]);

  const applyProductInfoToRow = useCallback(
    (
      rowIndex: number,
      productOption: IProductOption,
      productInfo: IProductInfoDto,
      overrides?: Partial<ISalesOrderDetailRow>
    ) => {
      cacheProductInfo(productInfo);

      setDetailGrid((prev) => {
        const existing = prev[rowIndex] ?? makeEmptyDetailRow();
        const shouldResetSpecification =
          Number(existing.productId ?? 0) !== Number(productOption.productId);

        const nextRow: ISalesOrderDetailRow = {
          ...existing,
          productId: productOption.productId,
          productName: productInfo.productName ?? productOption.name,
          unitTypeId:
            (productInfo.unitTypeId as number | null | undefined) ??
            productOption.unitTypeId ??
            null,
          quantity:
            overrides?.quantity !== undefined
              ? (overrides.quantity ?? null)
              : existing.quantity,
          price:
            overrides?.price !== undefined
              ? (overrides.price ?? null)
              : (productInfo.price ?? existing.price),
          productVat: productInfo.productVat ?? existing.productVat ?? null,
          productTax: productInfo.productTax ?? existing.productTax ?? null,
          vatRowId: productInfo.vatRowId ?? existing.vatRowId ?? null,
          taxRowId: productInfo.taxRowId ?? existing.taxRowId ?? null,
          specificationValue: shouldResetSpecification
            ? null
            : (existing.specificationValue ?? null),
        };

        const next = [...prev];
        next[rowIndex] = nextRow;
        return ensureMinRows(ensureTrailingEmptyRow(next), 10);
      });
    },
    [cacheProductInfo]
  );

  const fetchAndApplyProductInfo = useCallback(
    async (
      rowIndex: number,
      productOption: IProductOption,
      overrides?: Partial<ISalesOrderDetailRow>
    ) => {
      try {
        const productInfo = await resolveProductInfo(productOption.productId);
        applyProductInfoToRow(rowIndex, productOption, productInfo, overrides);
      } catch (e) {
        toast.error('Product info fetch failed, see console!');
        console.log(e);

        setDetailGrid((prev) => {
          const existing = prev[rowIndex] ?? makeEmptyDetailRow();
          const shouldResetSpecification =
            Number(existing.productId ?? 0) !== Number(productOption.productId);

          const nextRow: ISalesOrderDetailRow = {
            ...existing,
            productId: productOption.productId,
            productName: productOption.name,
            unitTypeId: productOption.unitTypeId ?? null,
            quantity:
              overrides?.quantity !== undefined
                ? (overrides.quantity ?? null)
                : existing.quantity,
            price:
              overrides?.price !== undefined
                ? (overrides.price ?? null)
                : existing.price,
            specificationValue: shouldResetSpecification
              ? null
              : (existing.specificationValue ?? null),
          };

          const next = [...prev];
          next[rowIndex] = nextRow;
          return ensureMinRows(ensureTrailingEmptyRow(next), 10);
        });
      }
    },
    [resolveProductInfo, applyProductInfoToRow]
  );

  const handleRowModalProductChange = useCallback(
    async (
      selected: IProductOption | null,
      onChange: (value: IProductOption | null) => void
    ) => {
      onChange(selected ?? null);

      if (!selected?.productId) {
        setRowModalValue('price', '', {
          shouldDirty: true,
          shouldValidate: false,
        });
        return;
      }

      try {
        const info = await resolveProductInfo(selected.productId);
        setRowModalValue(
          'price',
          info?.price != null ? String(info.price) : '',
          {
            shouldDirty: true,
            shouldValidate: false,
          }
        );
      } catch (e) {
        console.log(e);
        setRowModalValue('price', '', {
          shouldDirty: true,
          shouldValidate: false,
        });
      }
    },
    [resolveProductInfo, setRowModalValue]
  );

  const checkAndAddEmptyRow = useCallback(
    (index: number) => {
      if (index === detailGrid.length - 1) {
        setDetailGrid([...detailGrid, makeEmptyDetailRow()]);
      } else {
        setDetailGrid([...detailGrid]);
      }
    },
    [detailGrid]
  );

  const handleDeleteRowByIndex = useCallback(
    (idx: number) => {
      const row = detailGrid[idx];
      if (!row) return;

      if (row.salesOrderDetailId) {
        deletedDetails.push({ salesOrderDetailId: row.salesOrderDetailId });
        setDeletedDetails([...deletedDetails]);
      }

      detailGrid.splice(idx, 1);
      const next = ensureMinRows(ensureTrailingEmptyRow([...detailGrid]), 10);
      setDetailGrid(next);
    },
    [detailGrid, deletedDetails]
  );

  const openAddModal = useCallback(() => {
    setRowModalMode('add');
    setEditingRowIdx(null);
    resetRowModal({ product: null, quantity: '', price: '' });
    setRowModalOpen(true);
  }, [resetRowModal]);

  const openEditModal = useCallback(
    (idx: number) => {
      const row = detailGrid[idx];
      if (!row?.productId) return;

      const resolvedProduct: IProductOption | null =
        (productOptionsData ?? []).find(
          (p) => p.productId === Number(row.productId)
        ) ??
        (row.productId != null
          ? {
              productId: Number(row.productId),
              name: row.productName || '',
              unitTypeId: row.unitTypeId || 0,
              productSpecification:
                productInfoMap[Number(row.productId)]?.productSpecification ??
                null,
            }
          : null);

      setRowModalMode('edit');
      setEditingRowIdx(idx);
      resetRowModal({
        product: resolvedProduct,
        quantity: row.quantity != null ? String(row.quantity) : '',
        price: row.price != null ? String(row.price) : '',
      });
      setRowModalOpen(true);
    },
    [detailGrid, productOptionsData, resetRowModal, productInfoMap]
  );

  const openSpecificationModal = useCallback(
    async (idx: number) => {
      const row = detailGrid[idx];
      if (!row?.productId) return;

      try {
        const productInfo = await resolveProductInfo(Number(row.productId));
        const componentKey = getSpecificationComponentKeyFromText(
          productInfo?.productSpecification
        );

        if (!componentKey) {
          toast.info(
            'No additional info component configured for this product yet.'
          );
          return;
        }

        setSpecificationModalRowIdx(idx);
        setSpecificationModalComponentKey(componentKey);
        setSpecificationModalOpen(true);
      } catch (e) {
        toast.error('Product info fetch failed, see console!');
        console.log(e);
      }
    },
    [detailGrid, resolveProductInfo, getSpecificationComponentKeyFromText]
  );

  const closeSpecificationModal = useCallback(() => {
    setSpecificationModalOpen(false);
    setSpecificationModalRowIdx(null);
    setSpecificationModalComponentKey(null);
  }, []);

  const saveSpecificationValue = useCallback(
    (serializedValue: string) => {
      if (specificationModalRowIdx == null) return;

      detailGrid[specificationModalRowIdx].specificationValue = serializedValue;
      setDetailGrid([...detailGrid]);
      closeSpecificationModal();
    },
    [detailGrid, specificationModalRowIdx, closeSpecificationModal]
  );

  const onSubmitRowModal = useCallback(
    async (values: IRowModalFormModel) => {
      if (!values.product?.productId) {
        toast.warning('Product is required.');
        return;
      }

      const qty = parseNumberSafe(values.quantity);
      const price = parseNumberSafe(values.price);

      if (!qty || qty <= 0) {
        toast.warning('Quantity must be greater than 0.');
        return;
      }
      if (!price || price <= 0) {
        toast.warning('Price must be greater than 0.');
        return;
      }

      if (rowModalMode === 'edit' && editingRowIdx != null) {
        await fetchAndApplyProductInfo(editingRowIdx, values.product, {
          quantity: qty,
          price,
        });
      } else {
        const firstEmpty = detailGrid.findIndex((r) => r.productId == null);
        const insertIdx = firstEmpty >= 0 ? firstEmpty : detailGrid.length;

        await fetchAndApplyProductInfo(insertIdx, values.product, {
          quantity: qty,
          price,
        });
      }

      setRowModalOpen(false);
    },
    [rowModalMode, editingRowIdx, detailGrid, fetchAndApplyProductInfo]
  );

  const onMobileMenuAdditionalInfo = () => {
    if (mobileMenuRowIdx == null) return;
    const idx = mobileMenuRowIdx;

    closeMobileMenu();
    void openSpecificationModal(idx);
  };

  const onMobileMenuEdit = () => {
    if (mobileMenuRowIdx == null) return;
    const idx = mobileMenuRowIdx;
    closeMobileMenu();
    openEditModal(idx);
  };

  const onMobileMenuDelete = async () => {
    if (mobileMenuRowIdx == null) return;
    const idx = mobileMenuRowIdx;

    closeMobileMenu();

    const result = await Swal.fire({
      title: 'Delete this item?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      handleDeleteRowByIndex(idx);
    }
  };

  const handleClear = useCallback(() => {
    setCurrentSalesOrderId(null);
    setCurrentSalesOrderNo('');
    setProductInfoMap({});
    setDetailGrid(ensureMinRows([], 10));
    setDeletedDetails([]);
    setSortingGrid([]);
    setIsGridLoading(false);

    setRowModalOpen(false);
    setRowModalMode('add');
    setEditingRowIdx(null);
    resetRowModal({ product: null, quantity: '', price: '' });

    closeMobileMenu();
    closeSpecificationModal();

    setValue('salesOrderNo', '', {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('date', dayjs(), {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('buyer', loggedInBuyerOption, {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('buyerAddress', loggedInBuyerOption?.address ?? '', {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('buyerPhone', loggedInBuyerOption?.phone ?? '', {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('restLimit', Number(loggedInBuyerOption?.restLimit) || 0, {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue('deliveryType', deliveryType || 'Normal', {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [
    closeSpecificationModal,
    closeMobileMenu,
    deliveryType,
    loggedInBuyerOption,
    resetRowModal,
    setValue,
  ]);

  const autoCompResStyles = useMemo(
    () => ({ popper: { maxWidth: 'fit-content', fontSize: '0.75rem' } }),
    []
  );

  const PopperMy = useCallback(
    (propsPopper: any) => (
      <Popper {...propsPopper} style={autoCompResStyles.popper} />
    ),
    [autoCompResStyles.popper]
  );

  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (e) {
      console.log(e);
    }
  }, [sortingGrid]);

  const totals = useMemo(() => {
    const valid = (detailGrid ?? []).filter((r) => r.productId != null);
    const totalQty = valid.reduce(
      (sum, r) => sum + (Number(r.quantity) || 0),
      0
    );
    const totalAmount = valid.reduce(
      (sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.price) || 0),
      0
    );
    return { totalQty, totalAmount };
  }, [detailGrid]);

  const vatTaxSummary = useMemo(() => {
    const validRows = (detailGrid ?? []).filter((row) => row.productId != null);

    const totalVat = validRows.reduce(
      (sum, row) => sum + (Number(row.productVat) || 0),
      0
    );

    const totalTax = validRows.reduce(
      (sum, row) => sum + (Number(row.productTax) || 0),
      0
    );

    return {
      totalVat,
      totalTax,
    };
  }, [detailGrid]);

  const desktopColumns = useMemo<MRT_ColumnDef<ISalesOrderDetailRow>[]>(
    () => [
      {
        id: 'delete',
        header: '',
        size: 54,
        grow: false,
        muiTableHeadCellProps: { align: 'left' },
        Cell: ({ row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={row.original.productId ? 'visible' : 'invisible'}
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  if (row.original.salesOrderDetailId) {
                    deletedDetails.push({
                      salesOrderDetailId: row.original.salesOrderDetailId,
                    });
                    setDeletedDetails([...deletedDetails]);
                  }

                  detailGrid.splice(row.index, 1);
                  const next = ensureMinRows(
                    ensureTrailingEmptyRow([...detailGrid]),
                    10
                  );
                  setDetailGrid(next);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorFn: (r) => r.productName ?? '',
        id: 'productName',
        header: 'Product',
        size: 220,
        grow: true,
        Cell: ({ row }) => {
          const currentProduct: IProductOption | null =
            (productOptionsData ?? []).find(
              (p) => p.productId === Number(row.original.productId)
            ) ??
            (row.original.productId != null
              ? {
                  productId: Number(row.original.productId),
                  name: row.original.productName || '',
                  unitTypeId: row.original.unitTypeId || 0,
                  productSpecification:
                    productInfoMap[Number(row.original.productId)]
                      ?.productSpecification ?? null,
                }
              : null);

          return (
            <Autocomplete
              forcePopupIcon={false}
              PopperComponent={PopperMy}
              options={
                Array.from(
                  new Map(
                    (productOptionsData ?? []).map((p: any) => [p.productId, p])
                  ).values()
                ) as IProductOption[]
              }
              value={currentProduct}
              sx={{ width: '100%' }}
              onChange={(_e, selected: any) => {
                if (!selected || typeof selected === 'string') return;
                void fetchAndApplyProductInfo(row.index, selected);
              }}
              isOptionEqualToValue={(opt: any, val: any) =>
                opt.productId === (val?.productId ?? -1)
              }
              getOptionLabel={(opt: any) =>
                typeof opt === 'string' ? opt : (opt?.name ?? '')
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: { fontSize: '0.8125rem' },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  size="small"
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (r) => r.quantity ?? '',
        id: 'quantity',
        header: 'Qty',
        size: 70,
        Cell: ({ row }) => (
          <TextField
            type="text"
            inputMode="decimal"
            variant="standard"
            size="small"
            value={row.original.quantity ?? ''}
            disabled={!row.original.productId}
            onChange={(e) => {
              const n = parseNumberSafe(e.target.value);
              detailGrid[row.index].quantity = n;
              setDetailGrid([...detailGrid]);
            }}
            onBlur={() => {
              if (row.original.productId) checkAndAddEmptyRow(row.index);
            }}
            InputProps={{
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
            }}
            sx={{ width: '100%' }}
          />
        ),
      },
      {
        accessorFn: (r) => r.price ?? '',
        id: 'price',
        header: 'Price',
        size: 90,
        Cell: ({ row }) => (
          <TextField
            type="text"
            inputMode="decimal"
            variant="standard"
            size="small"
            value={row.original.price ?? ''}
            onChange={(e) => {
              const n = parseNumberSafe(e.target.value);
              detailGrid[row.index].price = n;
              setDetailGrid([...detailGrid]);
            }}
            onBlur={() => {
              if (row.original.productId) checkAndAddEmptyRow(row.index);
            }}
            InputProps={{
              readOnly: true,
              style: { fontSize: '0.8125rem' },
              disableUnderline: true,
            }}
            sx={{ width: '100%' }}
          />
        ),
      },
      {
        id: 'additionalInfo',
        header: 'Additional Info',
        size: 140,
        Cell: ({ row }) => {
          const hasProduct = !!row.original.productId;

          return (
            <div className="w-full flex justify-center">
              {hasProduct ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white font-medium text-xs rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform-all duration-150 ease-in-out"
                  onClick={() => {
                    void openSpecificationModal(row.index);
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                  {row.original.specificationValue ? 'Edit Info' : 'Add Info'}
                </button>
              ) : null}
            </div>
          );
        },
      },
    ],
    [
      PopperMy,
      productOptionsData,
      productInfoMap,
      detailGrid,
      deletedDetails,
      checkAndAddEmptyRow,
      openSpecificationModal,
      fetchAndApplyProductInfo,
    ]
  );

  type IMobileDisplayRow = ISalesOrderDetailRow & {
    __idx: number;
    amount: number;
  };

  const mobileRows = useMemo<IMobileDisplayRow[]>(() => {
    return (detailGrid ?? [])
      .map((r, idx) => ({
        ...r,
        __idx: idx,
        amount: (Number(r.quantity) || 0) * (Number(r.price) || 0),
      }))
      .filter((r) => r.productId != null);
  }, [detailGrid]);

  // const mobileColumns = useMemo<MRT_ColumnDef<IMobileDisplayRow>[]>(
  //   () => [
  //     {
  //       id: 'actions',
  //       header: '',
  //       size: 52,
  //       grow: true,
  //       Cell: ({ row }) => {
  //         const idx = row.original.__idx;

  //         return (
  //           <div className="w-full flex justify-center">
  //             <Tooltip title="More actions" arrow placement="right">
  //               <IconButton
  //                 size="small"
  //                 onClick={(e) => openMobileMenu(e, idx)}
  //                 sx={{
  //                   border: '1px solid #dbeafe',
  //                   backgroundColor: '#eff6ff',
  //                   borderRadius: '0.5rem',
  //                 }}
  //               >
  //                 <MoreVertIcon sx={{ fontSize: '1.125rem', color: '#2563eb' }} />
  //               </IconButton>
  //             </Tooltip>
  //           </div>
  //         );
  //       },
  //     },

  //     {
  //       accessorFn: (r) => r.productName ?? '',
  //       id: 'productName',
  //       header: 'Product',
  //       size: 200,
  //       grow: true,
  //       Cell: ({ row }) => (
  //         <div className="text-[0.8125rem] text-gray-800 whitespace-normal break-words leading-[1.25rem]">
  //           {row.original.productName ?? ''}
  //         </div>
  //       ),
  //     },
  //     {
  //       accessorFn: (r) => r.quantity ?? '',
  //       id: 'quantity',
  //       header: 'Qty',
  //       size: 100,
  //       grow: true,
  //       Cell: ({ row }) => (
  //         <div className="text-[0.8125rem] text-gray-800">
  //           {row.original.quantity ?? ''}
  //         </div>
  //       ),
  //     },
  //     {
  //       accessorFn: (r) => r.price ?? '',
  //       id: 'price',
  //       header: 'Price',
  //       size: 100,
  //       grow: true,
  //       Cell: ({ row }) => (
  //         <div className="text-[0.8125rem] text-gray-800">
  //           {row.original.price ?? ''}
  //         </div>
  //       ),
  //     },
  //     {
  //       accessorFn: (r) => r.amount ?? 0,
  //       id: 'amount',
  //       header: 'Amount',
  //       size: 110,
  //       grow: true,
  //       Cell: ({ row }) => (
  //         <div className="text-[0.8125rem] font-semibold text-gray-900">
  //           {Number(row.original.amount || 0).toFixed(2)}
  //         </div>
  //       ),
  //     },
  //   ],
  //   []
  // );

  const mobileColumns = useMemo<MRT_ColumnDef<IMobileDisplayRow>[]>(
    () => [
      {
        id: 'actions',
        header: '',
        size: 52,
        grow: false,
        Cell: ({ row }) => {
          const idx = row.original.__idx;

          return (
            <div className="w-full flex justify-center">
              <Tooltip title="More actions" arrow placement="right">
                <IconButton
                  size="small"
                  onClick={(e) => openMobileMenu(e, idx)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'primary.light',
                    backgroundColor: (t) => `${t.palette.primary.main}14`,
                    borderRadius: '0.5rem',
                  }}
                >
                  <MoreVertIcon
                    sx={{ fontSize: '1.125rem', color: 'primary.main' }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
      {
        accessorFn: (r) => r.productName ?? '',
        id: 'productName',
        header: 'Product',
        size: 80,
        grow: true,
        Cell: ({ row }) => (
          <div className="text-[0.8125rem] text-gray-800 whitespace-normal break-words leading-[1.25rem]">
            {row.original.productName ?? ''}
          </div>
        ),
      },
      {
        accessorFn: (r) => r.quantity ?? '',
        id: 'quantity',
        header: 'Qty',
        size: 80,
        grow: false,
        Cell: ({ row }) => (
          <div className="text-[0.8125rem] text-gray-800">
            {row.original.quantity ?? ''}
          </div>
        ),
      },
      {
        accessorFn: (r) => r.price ?? '',
        id: 'price',
        header: 'Price',
        size: 80,
        grow: false,
        Cell: ({ row }) => (
          <div className="text-[0.8125rem] text-gray-800">
            {row.original.price ?? ''}
          </div>
        ),
      },
      {
        accessorFn: (r) => r.amount ?? 0,
        id: 'amount',
        header: 'Amount',
        size: 80,
        grow: false,
        Cell: ({ row }) => (
          <div className="text-[0.8125rem] font-semibold text-gray-900">
            {Number(row.original.amount || 0).toFixed(2)}
          </div>
        ),
      },
    ],
    []
  );

  const commonTableConfig = {
    positionToolbarAlertBanner: 'none' as const,
    muiSkeletonProps: { animation: 'pulse' as const, height: '1.875rem' },
    enableBottomToolbar: false,
    enableColumnResizing: true,
    enableGlobalFilterModes: true,
    enableFilterMatchHighlighting: false,
    enablePagination: false,
    enableRowNumbers: false,
    enableColumnPinning: true,
    enableStickyHeader: true,
    layoutMode: 'grid' as const,
    // initialState: { density: 'compact' as const },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: '0', border: '1px dashed #e0e0e0' },
    },
    muiTableBodyCellProps: {
      sx: { fontSize: '0.8125rem', color: '#ea1143' },
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
    muiTableContainerProps: {
      sx: {
        maxHeight: '25rem',
        // overflowX: 'hidden',
      },
    },
    onSortingChange: setSortingGrid,
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 10 },
  };

  const desktopTable: MRT_TableInstance<ISalesOrderDetailRow> =
    useMaterialReactTable({
      columns: desktopColumns,
      data: detailGrid ?? [],
      state: { isLoading: isGridLoading, sorting: sortingGrid },
      enableRowVirtualization: true,
      renderToolbarInternalActions: ({ table: t }) => (
        <>
          <MRT_ToggleGlobalFilterButton table={t} />
          <MRT_ShowHideColumnsButton table={t} />
          <MRT_ToggleFullScreenButton table={t} />
          <MRT_ToggleFiltersButton table={t} />
        </>
      ),
      ...commonTableConfig,
    });

  const mobileTable = useMaterialReactTable({
    ...commonTableConfig,
    columns: mobileColumns,
    data: mobileRows,
    state: { isLoading: isGridLoading, sorting: sortingGrid },
    enableRowVirtualization: true,
    renderToolbarInternalActions: ({ table: t }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={t} />
        <MRT_ShowHideColumnsButton table={t} />
        <MRT_ToggleFullScreenButton table={t} />
        <MRT_ToggleFiltersButton table={t} />

        <div className="mx-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white font-medium text-xs rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform-all duration-150 ease-in-out"
            onClick={openAddModal}
          >
            Add +
          </button>
        </div>
      </>
    ),
    ...commonTableConfig,
  });

  const onSave = async () => {
    if (!watchedBuyer?.buyerId) {
      toast.warning('Customer is required.');
      return;
    }

    const validRows = (detailGrid ?? []).filter((r) => r.productId != null);
    if (!validRows.length) {
      toast.warning('Please add at least 1 product.');
      return;
    }

    let sendingObj: ISalesOrderTrackingProcessCommandsVM = {};

    let createSalesOrder: ICreateSalesOrderCommand | null = null;
    let updateSalesOrder: IUpdateSalesOrderCommand | null = null;
    let createSalesOrderDelivery: ICreateSalesOrderDeliveryCommand | null =
      null;

    const createSalesOrderDetail: ICreateSalesOrderDetailCommand[] = [];
    const updateSalesOrderDetail: IUpdateSalesOrderDetailCommand[] = [];
    const updateSalesOrderDetailTax: IUpdateSalesOrderDetailTaxCommand[] = [];
    const createSalesOrderDetailTax: ICreateSalesOrderDetailTaxCommand[] = [];

    if (!currentSalesOrderId) {
      createSalesOrder = {
        buyerId: buyerInfo?.buyerId || 0,
        date: watchedDate ? watchedDate.toISOString() : dayjs().toISOString(),
        createSalesOrder_DeliveryCommand: {
          salesOrderId: null,
          deliveryType: watchedDeliveryType === 'Normal' ? 'N' : 'E',
        },
      };
    } else {
      updateSalesOrder = {
        salesOrderId: currentSalesOrderId,
        date: watchedDate ? watchedDate.toISOString() : dayjs().toISOString(),
      };

      if (salesOrderDeliveryId) {
        updateSalesOrder.updateSalesOrder_DeliveryCommand = {
          salesOrderDeliveryId,
          deliveryType: watchedDeliveryType === 'Normal' ? 'N' : 'E',
        };
      } else {
        createSalesOrderDelivery = {
          salesOrderId: currentSalesOrderId,
          deliveryType: watchedDeliveryType === 'Normal' ? 'N' : 'E',
        };
      }
    }

    validRows.forEach((element) => {
      if (!element.salesOrderDetailId) {
        const objTemp: ICreateSalesOrderDetailCommand = {
          salesOrderId: currentSalesOrderId || null,
          productId: element.productId,
          quantity: element.quantity,
          price: element.price,
          unitTypeId: element.unitTypeId || 0,
          companyId: buyerInfo?.companyId || 0,
          locationId: null,
          discount: 0,
          specificationValue: element.specificationValue,
          createSalesOrderDetail_TaxCommand: [],
        };

        if (element.productTax) {
          const taxObj: ICreateSalesOrderDetailTaxCommand = {
            taxId: 2,
            taxAmount: element.productTax,
          };
          objTemp.createSalesOrderDetail_TaxCommand?.push(taxObj);
        }

        if (element.productVat) {
          const vatObj: ICreateSalesOrderDetailTaxCommand = {
            taxId: 1,
            taxAmount: element.productVat,
          };
          objTemp.createSalesOrderDetail_TaxCommand?.push(vatObj);
        }

        createSalesOrderDetail.push(objTemp);
      }

      if (element.salesOrderDetailId) {
        const objTemp: IUpdateSalesOrderDetailCommand = {
          salesOrderId: element.salesOrderId || currentSalesOrderId || '',
          salesOrderDetailId: element.salesOrderDetailId,
          productId: element.productId,
          quantity: element.quantity,
          price: element.price,
          unitTypeId: element.unitTypeId || 0,
          specificationValue: element.specificationValue,
        };

        updateSalesOrderDetail.push(objTemp);

        if (element.taxRowId) {
          const taxObj: IUpdateSalesOrderDetailTaxCommand = {
            salesOrderDetailTaxId: element.taxRowId,
            taxAmount: element.productTax || 0,
          };
          updateSalesOrderDetailTax.push(taxObj);
        } else if (!element.taxRowId && element.productTax) {
          const taxObj: ICreateSalesOrderDetailTaxCommand = {
            salesOrderDetailId: element.salesOrderDetailId,
            taxId: 2,
            taxAmount: element.productTax || 0,
          };
          createSalesOrderDetailTax.push(taxObj);
        }

        if (element.vatRowId) {
          const vatObj: IUpdateSalesOrderDetailTaxCommand = {
            salesOrderDetailTaxId: element.vatRowId,
            taxAmount: element.productVat || 0,
          };
          updateSalesOrderDetailTax.push(vatObj);
        } else if (!element.vatRowId && element.productVat) {
          const vatObj: ICreateSalesOrderDetailTaxCommand = {
            salesOrderDetailId: element.salesOrderDetailId,
            taxId: 1,
            taxAmount: element.productVat || 0,
          };
          createSalesOrderDetailTax.push(vatObj);
        }
      }
    });

    sendingObj = {
      createSalesOrderCommand: createSalesOrder,
      updateSalesOrderCommand: updateSalesOrder,
      createSalesOrder_DeliveryCommand: createSalesOrderDelivery,
      createSalesOrderDetailCommand: [...createSalesOrderDetail],
      updateSalesOrderDetailCommand: [...updateSalesOrderDetail],
      deleteSalesOrderDetailCommand: [...deletedDetails],
      updateSalesOrderDetail_TaxCommand: [...updateSalesOrderDetailTax],
      createSalesOrderDetail_TaxCommand: [...createSalesOrderDetailTax],
    };

    console.log('HAHA please dekh');
    console.log('sendingObj');
    console.log(sendingObj);

    try {
      const response = await saveSalesOrder(sendingObj).unwrap();

      if (response?.salesOrderId) {
        setCurrentSalesOrderId(response.salesOrderId);
      }

      if (response?.salesOrderNo) {
        setCurrentSalesOrderNo(response.salesOrderNo);
        setValue('salesOrderNo', response.salesOrderNo, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }

      setDeletedDetails([]);

      if (response?.salesOrderId) {
        await triggerGetSalesOrderDetailTracking({
          salesOrderId: response.salesOrderId,
        }).unwrap();
      }

      toast.success('Sales order saved successfully.');
    } catch (error: any) {
      const backendMessage =
        error?.data?.message ??
        error?.data?.Message ??
        error?.error ??
        'Save failed, see console!';

      toast.error(
        Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : String(backendMessage)
      );
      console.log('saveSalesOrder error:', error);
    }
  };

  const isHydrating =
    buyerFetching || productFetching || detailTrackingFetching;
  const isBusy = isHydrating || saveLoading || productInfoFetching;

  const currentSpecificationRow =
    specificationModalRowIdx != null
      ? detailGrid[specificationModalRowIdx]
      : null;

  return (
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              Sales Order Tracking
            </div>

            <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-3 gap-x-6 mt-5">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Customer Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Controller
                    name="buyer"
                    control={control}
                    rules={{ required: '*Required' as any }}
                    render={({
                      field: { onChange, value, onBlur, ref },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        forcePopupIcon={false}
                        PopperComponent={PopperMy}
                        options={buyerAutocompleteOptions}
                        value={value || undefined}
                        readOnly
                        disableClearable
                        open={false}
                        onChange={(_e, selected: any) => {
                          onChange(selected ?? null);

                          setValue('buyerAddress', selected?.address ?? '', {
                            shouldDirty: false,
                          });

                          setValue('buyerPhone', selected?.phone ?? '', {
                            shouldDirty: false,
                          });

                          setValue(
                            'restLimit',
                            Number(selected?.restLimit ?? 0),
                            {
                              shouldDirty: false,
                            }
                          );
                        }}
                        onBlur={onBlur}
                        isOptionEqualToValue={(opt, val) =>
                          opt.buyerId === val?.buyerId
                        }
                        getOptionLabel={(opt) => (opt ? opt.name : '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Customer"
                            variant="standard"
                            error={!!error}
                            helperText={error ? (error.message as any) : null}
                            InputLabelProps={{
                              ...params.InputLabelProps,
                              style: { fontSize: '0.875rem' },
                            }}
                            InputProps={{
                              ...params.InputProps,
                              readOnly: true,
                              style: { fontSize: '0.8125rem' },
                            }}
                            sx={{ width: '100%', marginTop: 1 }}
                            inputRef={ref}
                          />
                        )}
                      />
                    )}
                  />

                  {/* <Controller
                    name="salesOrderNo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Sales Order No"
                        variant="standard"
                        size="small"
                        sx={{ width: '100%', marginTop: 1 }}
                        InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                        InputProps={{
                          readOnly: true,
                          style: { fontSize: '0.8125rem' },
                        }}
                      />
                    )}
                  /> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: '*Required' as any }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date"
                          inputFormat="DD/MM/YYYY"
                          value={value}
                          onChange={(newValue) => onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: '100%', marginTop: 1 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              variant="standard"
                              size="small"
                              error={!!error}
                              helperText={error ? (error.message as any) : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  <Controller
                    name="buyerAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        variant="standard"
                        size="small"
                        sx={{ width: '100%', marginTop: 1 }}
                        InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                        InputProps={{ style: { fontSize: '0.8125rem' }, readOnly: true }}
                      />
                    )}
                  />

                  <Controller
                    name="buyerPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone No"
                        variant="standard"
                        size="small"
                        sx={{ width: '100%', marginTop: 1 }}
                        InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                        InputProps={{ style: { fontSize: '0.8125rem' }, readOnly: true }}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Controller
                    name="deliveryType"
                    control={control}
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <Autocomplete
                        forcePopupIcon={false}
                        PopperComponent={PopperMy}
                        options={deliveryTypeOptions}
                        value={value ?? 'Normal'}
                        onChange={(_e, selected) =>
                          onChange(selected ?? 'Normal')
                        }
                        onBlur={onBlur}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Delivery Type"
                            variant="standard"
                            sx={{ width: '100%', marginTop: 1 }}
                            InputLabelProps={{
                              ...params.InputLabelProps,
                              style: { fontSize: '0.875rem' },
                            }}
                            InputProps={{
                              ...params.InputProps,
                              style: { fontSize: '0.8125rem' },
                            }}
                            inputRef={ref}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="restLimit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Rest Limit"
                        variant="standard"
                        size="small"
                        type="number"
                        sx={{ width: '100%', marginTop: 1 }}
                        InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                        InputProps={{
                          readOnly: true,
                          style: { fontSize: '0.8125rem' },
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Product Information
                </div>

                <div className="w-full m-1 modifiedEditTable">
                  {isMobile ? (
                    <MaterialReactTable table={mobileTable} />
                  ) : (
                    <MaterialReactTable table={desktopTable} />
                  )}
                </div>

                <div className="flex justify-end gap-6 mt-2 px-2 text-sm">
                  <div className="font-semibold text-gray-700">
                    Total Qty:{' '}
                    <span className="text-gray-900">{totals.totalQty}</span>
                  </div>
                  <div className="font-semibold text-gray-700">
                    Total Amount:{' '}
                    <span className="text-gray-900">
                      {Number(totals.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 px-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Total VAT"
                      variant="outlined"
                      size="small"
                      value={Number(vatTaxSummary.totalVat || 0).toFixed(2)}
                      InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                      InputProps={{
                        readOnly: true,
                        style: { fontSize: '0.8125rem' },
                      }}
                      sx={{ width: '100%' }}
                    />

                    <TextField
                      label="Total Tax"
                      variant="outlined"
                      size="small"
                      value={Number(vatTaxSummary.totalTax || 0).toFixed(2)}
                      InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                      InputProps={{
                        readOnly: true,
                        style: { fontSize: '0.8125rem' },
                      }}
                      sx={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onSave}
                  disabled={isBusy}
                >
                  {saveLoading && <CircularProgress size={16} thickness={5} />}
                  {saveLoading ? 'Saving…' : 'Save'}
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-110 focus:bg-gray-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleClear}
                  disabled={isBusy}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={closeMobileMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {mobileMenuRowIdx != null &&
        detailGrid[mobileMenuRowIdx]?.productId != null ? (
          <MenuItem onClick={onMobileMenuAdditionalInfo}>
            <ListItemIcon>
              <InfoOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Additional Info" />
          </MenuItem>
        ) : null}

        <MenuItem onClick={onMobileMenuEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>

        <MenuItem onClick={onMobileMenuDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      <Modal
        open={rowModalOpen}
        onClose={() => setRowModalOpen(false)}
        aria-labelledby="sales-order-row-modal"
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
            width: { xs: '92vw', md: '520px' },
            backgroundColor: 'white',
            borderRadius: '0.625rem',
            boxShadow: 24,
            p: 3,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setRowModalOpen(false)}
            sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>

          <div className="text-base font-semibold text-gray-800 mb-4">
            {rowModalMode === 'add' ? 'Add Product' : 'Edit Product'}
          </div>

          <form
            onSubmit={handleRowModalSubmit(onSubmitRowModal)}
            className="grid grid-cols-1 gap-3"
          >
            <Controller
              name="product"
              control={rowModalControl}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  forcePopupIcon={false}
                  PopperComponent={PopperMy}
                  options={productOptionsData ?? []}
                  value={value}
                  onChange={(_e, selected: any) =>
                    void handleRowModalProductChange(selected ?? null, onChange)
                  }
                  isOptionEqualToValue={(opt, val) =>
                    opt.productId === val?.productId
                  }
                  getOptionLabel={(opt) => (opt ? opt.name : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product"
                      variant="standard"
                      InputLabelProps={{
                        ...params.InputLabelProps,
                        style: { fontSize: '0.875rem' },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: '0.8125rem' },
                      }}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="quantity"
              control={rowModalControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantity"
                  variant="standard"
                  inputMode="decimal"
                  sx={{ width: '100%' }}
                  InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                  InputProps={{ style: { fontSize: '0.8125rem' } }}
                />
              )}
            />

            <Controller
              name="price"
              control={rowModalControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  variant="standard"
                  inputMode="decimal"
                  sx={{ width: '100%' }}
                  InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                  InputProps={{
                    readOnly: true,
                    style: { fontSize: '0.8125rem' },
                  }}
                />
              )}
            />

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium text-xs uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform-all duration-150 ease-in-out"
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium text-xs uppercase rounded shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-105 transform-all duration-150 ease-in-out"
                onClick={() => setRowModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={specificationModalOpen}
        onClose={closeSpecificationModal}
        aria-labelledby="sales-order-specification-modal"
        style={{
          display: 'flex',
          margin: 0,
          padding: '72px 0 24px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <>
          {specificationModalComponentKey === 'spectacles-lens' ? (
            <SpectacleLensSpecificationForm
              productName={currentSpecificationRow?.productName}
              initialValue={currentSpecificationRow?.specificationValue ?? null}
              onSubmit={saveSpecificationValue}
              onClose={closeSpecificationModal}
            />
          ) : (
            <Box
              sx={{
                width: { xs: '92vw', md: '520px' },
                maxHeight: 'calc(100vh - 96px)',
                overflowY: 'auto',
                backgroundColor: 'white',
                borderRadius: '0.625rem',
                boxShadow: 24,
                p: 3,
              }}
            >
              <div className="text-base font-semibold text-gray-800 mb-4">
                Additional Information
              </div>

              <div className="text-sm text-gray-600 mb-4">
                No component configured for this product yet.
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium text-xs uppercase rounded shadow-md hover:bg-gray-600 hover:shadow-lg hover:scale-105 transform-all duration-150 ease-in-out"
                  onClick={closeSpecificationModal}
                >
                  Close
                </button>
              </div>
            </Box>
          )}
        </>
      </Modal>

      <Backdrop
        open={isBusy}
        sx={{ color: '#fff', zIndex: (t) => t.zIndex.modal + 1 }}
      >
        <CircularProgress color="inherit" />
        <Box sx={{ ml: 2 }}>
          {isHydrating
            ? 'Loading…'
            : productInfoFetching
              ? 'Loading product info…'
              : saveLoading
                ? 'Saving…'
                : ''}
        </Box>
      </Backdrop>
    </div>
  );
};

export default SalesOrderTracking;
