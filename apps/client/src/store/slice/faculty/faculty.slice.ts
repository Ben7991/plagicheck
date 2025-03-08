import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FacultyState } from './faculty.util';
import { Faculty } from '../../../util/types/faculty.type';

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
    addFaculty: (state, action: PayloadAction<Faculty>) => {
      state.count++;
      const perPage = 9;
      const updatedState = [action.payload, ...state.data];
      if (updatedState.length > perPage) {
        state.data = updatedState.slice(0, perPage);
      } else {
        state.data = [...updatedState];
      }
    },
  },
});

export default facultySlice.reducer;
export const { loadFaculties, addFaculty } = facultySlice.actions;
