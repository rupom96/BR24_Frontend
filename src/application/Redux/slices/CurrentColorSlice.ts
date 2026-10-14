/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/** Default matches login teal; ThemeSettings can override (persisted in colorMode). */
export const BR24_DEFAULT_ACCENT = '#0d9488';

function readStoredColor(): string {
  try {
    const saved = localStorage.getItem('colorMode');
    if (saved && /^#?[0-9a-fA-F]{3,8}$/.test(saved.trim())) {
      return saved.startsWith('#') ? saved : `#${saved}`;
    }
  } catch {
    /* ignore */
  }
  return BR24_DEFAULT_ACCENT;
}

export interface CurrentColor {
  color: string;
}

const initialState: CurrentColor = {
  color: readStoredColor(),
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
