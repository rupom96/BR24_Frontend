/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

function readStoredMode(): string {
  try {
    const saved = (localStorage.getItem('themeMode') || '').toLowerCase();
    if (saved === 'dark') return 'Dark';
    if (saved === 'light') return 'Light';
  } catch {
    /* ignore */
  }
  return 'Light';
}

export interface ICurrentMode {
  mode: string;
}

const initialState: ICurrentMode = {
  mode: readStoredMode(),
};

export const CurrentModeSlice = createSlice({
  name: 'currentMode',
  initialState,
  reducers: {
    darkenCurrentMode: (state) => {
      state.mode = 'Dark';
      localStorage.setItem('themeMode', 'Dark');
    },
    lightenCurrentMode: (state) => {
      state.mode = 'Light';
      localStorage.setItem('themeMode', 'Light');
    },
    toggleCurrentMode: (state) => {
      state.mode = state.mode === 'Light' ? 'Dark' : 'Light';
      localStorage.setItem('themeMode', state.mode);
    },
  },
});

export default CurrentModeSlice.reducer;
export const { darkenCurrentMode, lightenCurrentMode, toggleCurrentMode } =
  CurrentModeSlice.actions;
