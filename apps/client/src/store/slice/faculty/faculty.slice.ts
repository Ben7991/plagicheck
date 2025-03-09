import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FacultyState } from './faculty.util';
import { Faculty } from '../../../util/types/faculty.type';
import { Department } from '../../../util/types/department.type';

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
    addDepartment: (
      state,
      action: PayloadAction<{ department: Department; facultyId: number }>,
    ) => {
      const existingFacultyIndex = state.data.findIndex(
        (faculty) => faculty.id === action.payload.facultyId,
      );

      if (existingFacultyIndex === -1) {
        return;
      }

      state.data[existingFacultyIndex].departments.push(
        action.payload.department,
      );
    },
  },
});

export default facultySlice.reducer;
export const { loadFaculties, addFaculty, addDepartment } =
  facultySlice.actions;
