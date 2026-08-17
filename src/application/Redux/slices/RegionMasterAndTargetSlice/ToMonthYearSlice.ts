/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export interface IToMonthYear {
  toMonthYear: Dayjs;
}

const initialState: IToMonthYear = {
  toMonthYear: dayjs(),
};
export const ToMonthYearSlice = createSlice({
  name: 'toMonthYear',
  initialState,
  reducers: {
    changeToMonthYear: (
      state,
      action: PayloadAction<{ toMonthYear: Dayjs }>
    ) => {
      state.toMonthYear = action.payload.toMonthYear;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default ToMonthYearSlice.reducer;
export const { changeToMonthYear } = ToMonthYearSlice.actions;
