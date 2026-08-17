/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ListSample from '../ListSample/ListSample';
import AddSample from '../AddSample/AddSample';
import MonthYearRangePicker from '../../components/biz24Components/MonthYearRangePicker/MonthYearRangePicker';

const Sample = () => {
  const x: string = '11';
  console.log(`Hello from Sample page ${x}`);

  const defaultDate = dayjs().startOf('month');
  const [startDate, setStartDate] = useState<Dayjs>(defaultDate);
  const [endDate, setEndDate] = useState<Dayjs>(defaultDate);

  const changeEndDate = (date: Dayjs) => {
    setEndDate(date);
  };
  const changeStartDate = (date: Dayjs) => {
    setStartDate(date);
  };

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
      <AddSample />
      <ListSample />

      <MonthYearRangePicker
        startDate={startDate}
        endDate={endDate}
        setEndDate={changeEndDate}
        setStartDate={changeStartDate}
      />
    </div>
  );
};
export default Sample;
