import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../root-reducer';

const initialState = {
  reference_type: null,
  reference_id: null,
};

const PrevPageReferenceTracker = createSlice({
  name: 'prevPage',
  initialState,
  reducers: {
    setPrevPage(state, action) {
      state.reference_type = action.payload.reference_type;
      state.reference_id = action.payload.reference_id;
    },
    resetPrevPage(state) {
      state.reference_type = null;
      state.reference_id = null;
    },
  },
});

export const { setPrevPage, resetPrevPage } = PrevPageReferenceTracker.actions;
export const selectPrevPage = (state: RootState) => state.PrevPageReferenceTracker;

export default PrevPageReferenceTracker.reducer;
