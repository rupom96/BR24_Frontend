/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export interface IFromDate {
  fromDate: Dayjs;
}

const initialState: IFromDate = {
  fromDate: dayjs(),
};
export const FromDateSlice = createSlice({
  name: 'fromDate',
  initialState,
  reducers: {
    changeFromDate: (state, action: PayloadAction<{ fromDate: Dayjs }>) => {
      state.fromDate = action.payload.fromDate;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default FromDateSlice.reducer;
export const { changeFromDate } = FromDateSlice.actions;
