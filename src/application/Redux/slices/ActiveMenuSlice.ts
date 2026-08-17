/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export interface MenuState {
  active: boolean;
}

const initialState: MenuState = {
  active: true,
};
export const ActiveMenuSlice = createSlice({
  name: 'activeMenu',
  initialState,
  reducers: {
    truthifyActiveMenu: (state) => {
      state.active = true;
    },
    falsifyActiveMenu: (state) => {
      state.active = false;
    },
    toggleActiveMenu: (state) => {
      state.active = !state.active;
    },
  },
});

export default ActiveMenuSlice.reducer;
export const { truthifyActiveMenu, falsifyActiveMenu, toggleActiveMenu } =
  ActiveMenuSlice.actions;
