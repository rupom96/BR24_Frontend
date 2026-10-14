/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/** full = open panel · rail = icon shortcuts (hover expands overlay) · hidden = gone */
export type SidebarMode = 'full' | 'rail' | 'hidden';

export interface MenuState {
  mode: SidebarMode;
  /** true when mode !== 'hidden' (legacy callers) */
  active: boolean;
}

function withActive(mode: SidebarMode): MenuState {
  return { mode, active: mode !== 'hidden' };
}

const initialState: MenuState = withActive('full');

const cycle: Record<SidebarMode, SidebarMode> = {
  full: 'rail',
  rail: 'hidden',
  hidden: 'full',
};

export const ActiveMenuSlice = createSlice({
  name: 'activeMenu',
  initialState,
  reducers: {
    truthifyActiveMenu: () => withActive('full'),
    falsifyActiveMenu: () => withActive('hidden'),
    toggleActiveMenu: (state) => withActive(cycle[state.mode]),
    setSidebarMode: (_state, action: PayloadAction<SidebarMode>) =>
      withActive(action.payload),
  },
});

export default ActiveMenuSlice.reducer;
export const {
  truthifyActiveMenu,
  falsifyActiveMenu,
  toggleActiveMenu,
  setSidebarMode,
} = ActiveMenuSlice.actions;
