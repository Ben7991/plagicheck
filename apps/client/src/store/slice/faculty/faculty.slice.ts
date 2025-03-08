import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FacultyState } from './faculty.util';

const initialState: FacultyState = {
  data: [],
  hasData: false,
  count: 0,
};

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    loadFaculties: (
      state,
      action: PayloadAction<Omit<FacultyState, 'hasData'>>,
    ) => {
      state.data = action.payload.data;
      state.count = action.payload.count;
      state.hasData = true;
    },
  },
});

export default facultySlice.reducer;
export const { loadFaculties } = facultySlice.actions;
