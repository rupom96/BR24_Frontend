/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export interface IThemeSettings {
  bool: boolean;
}

const initialState: IThemeSettings = {
  bool: false,
};
export const ThemeSettingsSlice = createSlice({
  name: 'themeSettings',
  initialState,
  reducers: {
    truthifyThemeSettings: (state) => {
      state.bool = true;
    },
    falsifyThemeSettings: (state) => {
      state.bool = false;
    },
    toggleThemeSettings: (state) => {
      state.bool = !state.bool;
    },
  },
});

export default ThemeSettingsSlice.reducer;
export const {
  truthifyThemeSettings,
  falsifyThemeSettings,
  toggleThemeSettings,
} = ThemeSettingsSlice.actions;
