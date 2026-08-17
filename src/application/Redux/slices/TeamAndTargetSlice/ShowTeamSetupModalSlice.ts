/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ShowTeamSetupModal {
  bool: boolean;
}

const initialState: ShowTeamSetupModal = {
  bool: false,
};
export const ShowTeamSetupModalSlice = createSlice({
  name: 'showTeamSetupModal',
  initialState,
  reducers: {
    truthifyShowTeamSetupModal: (state) => {
      state.bool = true;
    },
    setShowTeamSetupModal: (state, action: PayloadAction<boolean>) => {
      if (state.bool !== action.payload) {
        state.bool = action.payload;
      }
    },
    falsifyShowTeamSetupModal: (state) => {
      state.bool = false;
    },
  },
});

export default ShowTeamSetupModalSlice.reducer;
export const {
  truthifyShowTeamSetupModal,
  falsifyShowTeamSetupModal,
  setShowTeamSetupModal,
} = ShowTeamSetupModalSlice.actions;
