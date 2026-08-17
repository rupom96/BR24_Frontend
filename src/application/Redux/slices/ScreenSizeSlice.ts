/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ScreenSize {
  size?: number;
}

const initialState: ScreenSize = {
  size: undefined,
};
export const ScreenSizeSlice = createSlice({
  name: 'screenSize',
  initialState,
  reducers: {
    changeScreenSize: (state, action: PayloadAction<{ size: number }>) => {
      state.size = action.payload.size;
    },
  },
});

export default ScreenSizeSlice.reducer;
export const { changeScreenSize } = ScreenSizeSlice.actions;
