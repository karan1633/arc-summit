import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../root-reducer';

interface ReferenceTrackingState {
  reference_page: string;
  reference_id: string;
}

const initialState: ReferenceTrackingState = {
  reference_page: '',
  reference_id: '',
};

const ReferenceTrackingSlice = createSlice({
  name: 'referenceTracker',
  initialState,
  reducers: {
    AddReference: (state, action) => {
      state.reference_page = action?.payload?.reference_page;
      state.reference_id = action?.payload?.reference_id;
    },
  },
});

export const { AddReference } = ReferenceTrackingSlice.actions;

export const selectReferenceTracker = (state: RootState) => state.ReferenceTrackingSlice;

export default ReferenceTrackingSlice.reducer;
