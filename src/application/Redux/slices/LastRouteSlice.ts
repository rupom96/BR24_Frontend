/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ILastRoute {
  from: any;
}

const initialState: ILastRoute = {
  from: '',
};
export const LastRouteSlice = createSlice({
  name: 'lastRoute',
  initialState,
  reducers: {
    saveLastRoute: (state, action: PayloadAction<{ from: any }>) => {
      state.from = action.payload.from;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default LastRouteSlice.reducer;
export const { saveLastRoute } = LastRouteSlice.actions;
