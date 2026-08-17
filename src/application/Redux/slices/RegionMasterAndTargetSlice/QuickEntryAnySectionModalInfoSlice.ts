/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export interface IQuickEntryAnySectionModalInfoProps {
  // fromMonth: number;
  // fromYear: number;
  // toMonth: number;
  // toYear: number;

  regionMasterId: number;
  regionMasterName: string;

  regionId: number;
  regionName: string;

  divisionId: number;
  divisionName: string;

  districtId: number;
  districtName: string;
  quickEntryAnySectionModal: boolean;
}

const initialState: IQuickEntryAnySectionModalInfoProps = {
  // fromMonth: dayjs().month() + 1,
  // fromYear: dayjs().year(),
  // toMonth: dayjs().month() + 1,
  // toYear: dayjs().year(),
  // employeeId: number;
  // employeeName: string;
  regionMasterId: 0,
  regionMasterName: '',

  regionId: 0,
  regionName: '',

  divisionId: 0,
  divisionName: '',

  districtId: 0,
  districtName: '',
  quickEntryAnySectionModal: false,
};
export const QuickEntryAnySectionModalInfoSlice = createSlice({
  name: 'quickEntryAnySectionModalInfo',
  initialState,
  reducers: {
    changeQuickEntryAnySectionModalInfo: (
      state,
      action: PayloadAction<{
        // toMonth: number;
        // fromMonth: number;
        // toYear: number;
        // fromYear: number;
        regionMasterId: number;
        regionMasterName: string;
        regionId: number;
        regionName: string;
        divisionId: number;
        divisionName: string;
        districtId: number;
        districtName: '';
        quickEntryAnySectionModal: boolean;
      }>
    ) => {
      // state.toMonth = action.payload.toMonth;
      // state.fromMonth = action.payload.fromMonth;
      // state.toYear = action.payload.toYear;
      // state.fromYear = action.payload.fromYear;
      state.regionMasterId = action.payload.regionMasterId;
      state.regionId = action.payload.regionId;
      state.regionName = action.payload.regionName;
      state.divisionId = action.payload.divisionId;
      state.divisionName = action.payload.divisionName;
      state.districtId = action.payload.districtId;
      state.districtName = action.payload.districtName;
      state.quickEntryAnySectionModal =
        action.payload.quickEntryAnySectionModal;
      //   localStorage.setItem('colorMode', action.payload.color);
    },
  },
});

export default QuickEntryAnySectionModalInfoSlice.reducer;
export const { changeQuickEntryAnySectionModalInfo } =
  QuickEntryAnySectionModalInfoSlice.actions;
