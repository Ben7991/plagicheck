import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LecturerState } from './lecturer.util';
import { Lecturer } from '@util/types/user.type';

const initialState: LecturerState = {
  count: 0,
  data: [],
};

const facultySlice = createSlice({
  name: 'lecturer',
  initialState,
  reducers: {
    loadLecturers: (
      state,
      action: PayloadAction<{ data: Lecturer[]; count: number }>,
    ) => {
      state.data = [...action.payload.data];
      state.count = action.payload.count;
    },
    addLecturer: (state, action: PayloadAction<Lecturer>) => {
      state.data = [action.payload, ...state.data];
      state.count = state.count + 1;
    },
    updateLecturer: (state, action: PayloadAction<Lecturer>) => {
      const existingIndex = state.data.findIndex(
        (lecturer) => lecturer.user.id === action.payload.user.id,
      );
      state.data[existingIndex] = action.payload;
    },
    removeLecturer: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(
        (lecturer) => lecturer.id !== action.payload,
      );
    },
  },
});

export default facultySlice.reducer;
export const { loadLecturers, addLecturer, updateLecturer, removeLecturer } =
  facultySlice.actions;
