/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export interface IFromMonthYear {
  fromMonthYear: Dayjs;
}

const initialState: IFromMonthYear = {
  fromMonthYear: dayjs(),
};
export const FromMonthYearSlice = createSlice({
  name: 'fromMonthYear',
  initialState,
  reducers: {
    changeFromMonthYear: (
      state,
      action: PayloadAction<{ fromMonthYear: Dayjs }>
    ) => {
      state.fromMonthYear = action.payload.fromMonthYear;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default FromMonthYearSlice.reducer;
export const { changeFromMonthYear } = FromMonthYearSlice.actions;
