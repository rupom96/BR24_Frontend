/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CurrentColor {
  color: string;
}

const initialState: CurrentColor = {
  color: '#1c64f2',
};
export const CurrentColorSlice = createSlice({
  name: 'currentColor',
  initialState,
  reducers: {
    changeThemeColor: (state, action: PayloadAction<{ color: string }>) => {
      state.color = action.payload.color;
      localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default CurrentColorSlice.reducer;
export const { changeThemeColor } = CurrentColorSlice.actions;
