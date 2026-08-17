/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export interface IToDate {
  toDate: Dayjs;
}

const initialState: IToDate = {
  toDate: dayjs(),
};
export const ToDateSlice = createSlice({
  name: 'toDate',
  initialState,
  reducers: {
    changeToDate: (state, action: PayloadAction<{ toDate: Dayjs }>) => {
      state.toDate = action.payload.toDate;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default ToDateSlice.reducer;
export const { changeToDate } = ToDateSlice.actions;
