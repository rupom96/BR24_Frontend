/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  useLazyGetBuyerOptionsQuery,
  useLazyGetSalesOrderTrackingQuery,
} from '../../../infrastructure/api/SalesOrderTrackingApiSlice';
import { IBuyerOption } from '../../../domain/interfaces/SalesOrderTrackingInterface';
import SalesOrderTracking from '../SalesOrderTracking/SalesOrderTracking';

interface ISalesOrderCardItem {
  salesOrderId: string;
  salesOrderNo: string;
  salesOrderDate: string;
  orderQuantity: number;
  totalAmount: number;
  salesOrderDeliveryId: string | null;
  deliveryType: string | null;
}

const SalesOrderSummary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().startOf('month')
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [status, setStatus] = useState<'P' | 'D'>('P');
  const [selectedBuyer, setSelectedBuyer] = useState<IBuyerOption | null>(null);
  const [salesOrders, setSalesOrders] = useState<ISalesOrderCardItem[]>([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSalesOrder, setSelectedSalesOrder] =
    useState<ISalesOrderCardItem | null>(null);

  const [triggerGetBuyerOptions, buyerOptionsState] =
    useLazyGetBuyerOptionsQuery();
  const [triggerGetSalesOrderTracking, salesOrderTrackingState] =
    useLazyGetSalesOrderTrackingQuery();

  const buyerOptions: IBuyerOption[] = Array.isArray(buyerOptionsState?.data)
    ? buyerOptionsState.data
    : [];

  const buyerInfo = useMemo(() => {
    try {
      const json = localStorage.getItem('buyerInfo');
      return json ? JSON.parse(json) : null;
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    const companyId = buyerInfo?.companyId || null;

    if (companyId) {
      triggerGetBuyerOptions({ companyId });
    } else {
      triggerGetBuyerOptions();
    }
  }, [triggerGetBuyerOptions, buyerInfo?.companyId]);

  useEffect(() => {
    if (buyerOptionsState.error) {
      toast.error('Failed to load customers.');
      console.log('buyerOptionsState.error', buyerOptionsState.error);
    }
  }, [buyerOptionsState.error]);

  useEffect(() => {
    if (!buyerInfo?.buyerId) return;

    if (!buyerOptions.length) {
      setSelectedBuyer({
        buyerId: buyerInfo.buyerId || 0,
        name: buyerInfo.buyerName || '',
        address: buyerInfo.address || '',
        phone: buyerInfo.phoneNo || '',
      });
      return;
    }

    const matchedBuyer = buyerOptions.find(
      (item) => item.buyerId === buyerInfo.buyerId
    );

    if (matchedBuyer) {
      setSelectedBuyer(matchedBuyer);
    }
  }, [buyerOptions, buyerInfo]);

  useEffect(() => {
    const loadSalesOrders = async () => {
      if (!selectedBuyer?.buyerId || !fromDate || !toDate) {
        setSalesOrders([]);
        return;
      }

      try {
        const response = await triggerGetSalesOrderTracking({
          fromDate: fromDate.toDate(),
          toDate: toDate.toDate(),
          buyerId: selectedBuyer.buyerId,
          status,
        }).unwrap();

        setSalesOrders(Array.isArray(response) ? response : []);
      } catch (error) {
        toast.error('Failed to load sales orders.');
        console.log('getSalesOrderTracking error', error);
        setSalesOrders([]);
      }
    };

    loadSalesOrders();
  }, [fromDate, toDate, selectedBuyer, status, triggerGetSalesOrderTracking]);

  const handleOpenDetails = (item: ISalesOrderCardItem) => {
    setSelectedSalesOrder(item);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedSalesOrder(null);
  };

  const formatDate = (value?: string) => {
    if (!value) return '';
    return dayjs(value).format('DD MMM YYYY');
  };

  const formatAmount = (value?: number) => Number(value || 0).toLocaleString();

  const displayBuyerName =
    selectedBuyer?.name || buyerInfo?.buyerName || 'Unknown Customer';

  const displayBuyerPhone = selectedBuyer?.phone || buyerInfo?.phoneNo || '';

  const StatusButton = ({
    label,
    value,
  }: {
    label: string;
    value: 'P' | 'D';
  }) => {
    const active = status === value;

    return (
      <button
        type="button"
        onClick={() => setStatus(value)}
        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
          active
            ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
            : 'border-gray-300 bg-white text-gray-700 hover:border-sky-300'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
              active ? 'border-sky-500' : 'border-gray-400'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                active ? 'bg-sky-500' : 'bg-transparent'
              }`}
            />
          </span>
          <span>{label}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              Sales Order Summary
            </div>

            <div className="px-6 pb-4 text-start grid grid-cols-1 gap-y-4 gap-x-6 mt-5">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Filters
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date From"
                      inputFormat="DD/MM/YYYY"
                      value={fromDate}
                      onChange={(newValue) => {
                        console.log(newValue);
                        setFromDate(newValue);
                      }}
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
                          error={false}
                          helperText={null}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date To"
                      inputFormat="DD/MM/YYYY"
                      value={toDate}
                      onChange={(newValue) => {
                        console.log(newValue);
                        setToDate(newValue);
                      }}
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
                          error={false}
                          helperText={null}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Autocomplete<IBuyerOption, false, false, false>
                    options={buyerOptions}
                    value={selectedBuyer}
                    readOnly
                    loading={
                      buyerOptionsState.isLoading ||
                      buyerOptionsState.isFetching
                    }
                    onChange={(_e, newValue) => setSelectedBuyer(newValue)}
                    isOptionEqualToValue={(opt, val) =>
                      opt.buyerId === val?.buyerId
                    }
                    getOptionLabel={(opt) => (opt ? opt.name : '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer"
                        variant="standard"
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          style: { fontSize: '0.875rem' },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          readOnly: true,
                          style: { fontSize: '0.8125rem' },
                          endAdornment: (
                            <>
                              {buyerOptionsState.isLoading ||
                              buyerOptionsState.isFetching ? (
                                <CircularProgress size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        sx={{ width: '100%', marginTop: 1 }}
                      />
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2 mt-2 md:mt-4">
                    <StatusButton label="Pending" value="P" />
                    <StatusButton label="Delivered" value="D" />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Sales Orders
                </div>

                {!selectedBuyer?.buyerId ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                    Please select a customer to view sales orders.
                  </div>
                ) : salesOrderTrackingState.isLoading ||
                  salesOrderTrackingState.isFetching ? (
                  <div className="flex min-h-[13.75rem] items-center justify-center">
                    <CircularProgress />
                  </div>
                ) : salesOrders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                    No sales orders found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {salesOrders.map((item) => (
                      <button
                        key={item.salesOrderId}
                        type="button"
                        onClick={() => handleOpenDetails(item)}
                        className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="inline-flex rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 w-fit">
                            {item.salesOrderNo}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                            <span>{formatDate(item.salesOrderDate)}</span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-xl bg-gray-50 p-3">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                              <PersonOutlineIcon sx={{ fontSize: '1.125rem' }} />
                              <span>Customer</span>
                            </div>

                            <div className="text-sm text-gray-800">
                              {displayBuyerName}
                            </div>

                            {displayBuyerPhone ? (
                              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <LocalPhoneOutlinedIcon sx={{ fontSize: '1rem' }} />
                                <span>{displayBuyerPhone}</span>
                              </div>
                            ) : null}
                          </div>

                          <div className="rounded-xl bg-gray-50 p-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <Inventory2OutlinedIcon
                                    sx={{ fontSize: '1.125rem' }}
                                  />
                                  <span>Order Quantity</span>
                                </div>
                                <div className="text-sm text-gray-800">
                                  {item.orderQuantity}
                                </div>
                              </div>

                              <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <PaidOutlinedIcon sx={{ fontSize: '1.125rem' }} />
                                  <span>Total Amount</span>
                                </div>
                                <div className="text-sm font-semibold text-sky-700">
                                  {formatAmount(item.totalAmount)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={detailsModalOpen}
        onClose={handleCloseDetails}
        aria-labelledby="sales-order-details-modal"
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          px: { xs: 1, sm: 2, md: 0 },
          pt: { xs: '72px', sm: '80px', md: 0 },
          pb: { xs: 1, sm: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: {
              xs: 'calc(100vw - 16px)',
              sm: 'calc(100vw - 32px)',
              md: '92vw',
            },
            maxWidth: { md: '1200px' },
            height: {
              xs: 'calc(100dvh - 88px)',
              sm: 'calc(100dvh - 104px)',
              md: '92vh',
            },
            maxHeight: {
              xs: 'calc(100dvh - 88px)',
              sm: 'calc(100dvh - 104px)',
              md: '92vh',
            },
            backgroundColor: 'white',
            borderRadius: { xs: '12px', md: '12px' },
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200">
            <div>
              <div className="text-base md:text-lg font-semibold text-gray-800">
                Sales Order Details
              </div>
              <div className="text-sm text-gray-500">
                {selectedSalesOrder?.salesOrderNo || ''}
              </div>
            </div>

            <IconButton
              aria-label="close"
              onClick={handleCloseDetails}
              sx={{ color: 'gray' }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50 p-2 md:p-4">
            {selectedSalesOrder ? (
              <SalesOrderTracking
                salesOrderId={selectedSalesOrder.salesOrderId}
                salesOrderNo={selectedSalesOrder.salesOrderNo}
                deliveryType={selectedSalesOrder.deliveryType}
                salesOrderDeliveryId={selectedSalesOrder.salesOrderDeliveryId}
              />
            ) : null}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SalesOrderSummary;
