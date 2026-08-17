/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IShowNavbar {
  bool: boolean;
}

const initialState: IShowNavbar = {
  bool: true,
};
export const ShowNavbarSlice = createSlice({
  name: 'showNavbar',
  initialState,
  reducers: {
    truthifyShowNavbar: (state) => {
      state.bool = true;
    },
    falsifyShowNavbar: (state) => {
      state.bool = false;
    },
    setNavbarShow: (state, action: PayloadAction<boolean>) => {
      if (state.bool !== action.payload) {
        state.bool = action.payload;
      }
    },
    toggleShowNavbar: (state) => {
      state.bool = !state.bool;
    },
  },
});

export default ShowNavbarSlice.reducer;
export const {
  truthifyShowNavbar,
  falsifyShowNavbar,
  setNavbarShow,
  toggleShowNavbar,
} = ShowNavbarSlice.actions;
