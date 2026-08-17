/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ShowPanel {
  bool: boolean;
}

const initialState: ShowPanel = {
  bool: true,
};
export const ShowPanelSlice = createSlice({
  name: 'showPanel',
  initialState,
  reducers: {
    truthifyShowPanel: (state) => {
      state.bool = true;
    },
    setPanelShow: (state, action: PayloadAction<boolean>) => {
      if (state.bool !== action.payload) {
        state.bool = action.payload;
      }
    },
    falsifyShowPanel: (state) => {
      state.bool = false;
    },
  },
});

export default ShowPanelSlice.reducer;
export const { truthifyShowPanel, falsifyShowPanel, setPanelShow } =
  ShowPanelSlice.actions;
