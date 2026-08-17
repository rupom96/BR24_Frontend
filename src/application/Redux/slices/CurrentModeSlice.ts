/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export interface ICurrentMode {
  mode: string;
}

const initialState: ICurrentMode = {
  mode: 'Light',
};
export const CurrentModeSlice = createSlice({
  name: 'currentMode',
  initialState,
  reducers: {
    darkenCurrentMode: (state) => {
      state.mode = 'Dark';
    },
    lightenCurrentMode: (state) => {
      state.mode = 'Light';
    },
    toggleCurrentMode: (state) => {
      state.mode = state.mode === 'Light' ? 'Dark' : 'Light';
    },
  },
});

export default CurrentModeSlice.reducer;
export const { darkenCurrentMode, lightenCurrentMode, toggleCurrentMode } =
  CurrentModeSlice.actions;
