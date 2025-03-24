import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StudentState } from './student.util';
import { Student } from '@util/types/user.type';

const initialState: StudentState = {
  count: 0,
  data: [],
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    loadStudents: (
      state,
      action: PayloadAction<Omit<StudentState, 'hasData'>>,
    ) => {
      state.count = action.payload.count;
      state.data = [...action.payload.data];
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.data = [action.payload, ...state.data];
      state.count = state.count + 1;
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const existingIndex = state.data.findIndex(
        (lecturer) => lecturer.user.id === action.payload.user.id,
      );
      state.data[existingIndex] = action.payload;
    },
    removeStudent: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(
        (lecturer) => lecturer.id !== action.payload,
      );
    },
  },
});

export default studentSlice.reducer;
export const { loadStudents, addStudent, updateStudent, removeStudent } =
  studentSlice.actions;
