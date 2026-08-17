/* eslint-disable react/jsx-props-no-spreading */
import { Box, Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';

type Props = {
  startDate: Dayjs;
  setStartDate: (date: Dayjs) => void;
  endDate: Dayjs;
  setEndDate: (date: Dayjs) => void;
};

const DateRangePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) => {
  const defaultDate = dayjs();
  //   const [startDate, setStartDate] = useState<Dayjs>(defaultDate);
  //   const [endDate, setEndDate] = useState<Dayjs>(defaultDate);

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date);
      if (date.isAfter(endDate)) {
        setEndDate(date); // Adjust end date if start date is after end date
      }
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      setEndDate(date);
      if (date.isBefore(startDate)) {
        setStartDate(date); // Adjust start date if end date is before start date
      }
    }
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-2 gap-x-4 w-[99%]">
          {/* Start Date Picker */}
          <DatePicker
            views={['year', 'month', 'day']}
            label="From Date"
            value={startDate}
            inputFormat="DD MMMM, YYYY"
            onChange={handleStartDateChange}
            renderInput={(params) => (
              //   <TextField
              //     {...params}
              //     fullWidth
              //     onBlur={(e) => {
              //       if (!e.target.value) setStartDate(defaultDate); // Reset on blur if empty
              //     }}
              //   />
              <TextField
                {...params}
                sx={{ width: '100%', marginTop: 1 }}
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: 13 },
                }}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  style: { fontSize: 14 },
                }}
                onBlur={(e) => {
                  //   if (!e.target.value) setStartDate(defaultDate); // Reset on blur if empty
                  if (!e.target.value) handleStartDateChange(defaultDate); // Reset on blur if empty
                }}
                variant="standard"
                size="small"
              />
            )}
            disableOpenPicker={false}
          />

          {/* End Date Picker */}
          <DatePicker
            views={['year', 'month', 'day']}
            label="To Date"
            value={endDate}
            inputFormat="DD MMMM, YYYY"
            onChange={handleEndDateChange}
            renderInput={(params) => (
              //   <TextField
              //     {...params}
              //     fullWidth
              //     onBlur={(e) => {
              //       if (!e.target.value) setEndDate(defaultDate); // Reset on blur if empty
              //     }}
              //   />
              <TextField
                {...params}
                sx={{ width: '100%', marginTop: 1 }}
                InputProps={{
                  ...params.InputProps,
                  style: { fontSize: 13 },
                }}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  style: { fontSize: 14 },
                }}
                onBlur={(e) => {
                  //   if (!e.target.value) setEndDate(defaultDate); // Reset on blur if empty
                  if (!e.target.value) handleEndDateChange(defaultDate); // Reset on blur if empty
                }}
                variant="standard"
                size="small"
              />
            )}
          />

          {/* Show Selected Range */}
          {/* <Button
            variant="contained"
            onClick={() =>
              alert(
                `Selected range: ${startDate?.format(
                  'YYYY-MM'
                )} to ${endDate?.format('YYYY-MM')}`
              )
            }
          >
            Show Range
          </Button> */}
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangePicker;
