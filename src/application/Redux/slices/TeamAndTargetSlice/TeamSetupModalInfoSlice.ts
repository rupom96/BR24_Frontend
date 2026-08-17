/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface TeamSetupModalInfo {
  teamId: number;
}

const initialState: TeamSetupModalInfo = {
  teamId: 0,
};
export const TeamSetupModalInfoSlice = createSlice({
  name: 'teamSetupModalInfo',
  initialState,
  reducers: {
    changeTeamSetupModalInfo: (
      state,
      action: PayloadAction<{ teamId: number }>
    ) => {
      state.teamId = action.payload.teamId;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default TeamSetupModalInfoSlice.reducer;
export const { changeTeamSetupModalInfo } = TeamSetupModalInfoSlice.actions;
