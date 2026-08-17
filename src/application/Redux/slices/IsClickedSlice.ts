/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IIsClicked {
  chat: boolean;
  cart: boolean;
  userProfile: boolean;
  notification: boolean;
}

const initialState: IIsClicked = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};
export const IsClickedSlice = createSlice({
  name: 'isClicked',
  initialState,
  reducers: {
    setAllFeatureIsClicked: (
      state,
      action: PayloadAction<{ obj: IIsClicked }>
    ) => {
      state.cart = action.payload.obj.cart;
      state.chat = action.payload.obj.chat;
      state.userProfile = action.payload.obj.userProfile;
      state.notification = action.payload.obj.notification;
    },

    toggleACertainFeatureClick: (
      state,
      action: PayloadAction<{ propertyName: keyof IIsClicked }>
    ) => {
      Object.keys(state).forEach((key) => {
        const typedKey = key as keyof IIsClicked;
        if (typedKey === action.payload.propertyName) {
          state[typedKey] = !state[typedKey];
        } else {
          state[typedKey] = false;
        }
      });
    },
  },
});

export default IsClickedSlice.reducer;
export const { toggleACertainFeatureClick, setAllFeatureIsClicked } =
  IsClickedSlice.actions;
