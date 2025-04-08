import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FacultyState } from './faculty.util';
import { Faculty } from '../../../util/types/faculty.type';
import { Department } from '../../../util/types/department.type';

const initialState: FacultyState = {
  data: [],
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
    updateFaculty: (state, action: PayloadAction<Faculty>) => {
      const existingFacultyIndex = state.data.findIndex(
        (faculty) => faculty.id === action.payload.id,
      );

      if (existingFacultyIndex !== -1) {
        return;
      }

      state.data[existingFacultyIndex].name = action.payload.name;
    },
    removeFaculty: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(
        (faculty) => faculty.id !== action.payload,
      );
      state.count--;
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
    updateDepartment: (
      state,
      action: PayloadAction<{
        department: Department;
        oldFacultyId: number;
        chosenFacultyId: number;
      }>,
    ) => {
      if (action.payload.oldFacultyId !== action.payload.chosenFacultyId) {
        const oldFacultyIndex = state.data.findIndex(
          (item) => item.id === action.payload.oldFacultyId,
        );
        state.data[oldFacultyIndex].departments = state.data[
          oldFacultyIndex
        ].departments.filter(
          (item) => item.id !== action.payload.department.id,
        );

        const chosenFacultyIndex = state.data.findIndex(
          (item) => item.id === action.payload.chosenFacultyId,
        );
        state.data[chosenFacultyIndex].departments.push(
          action.payload.department,
        );
        return;
      }

      const existingFacultyIndex = state.data.findIndex(
        (item) => item.id === action.payload.chosenFacultyId,
      );
      const departmentIndex = state.data[
        existingFacultyIndex
      ].departments.findIndex(
        (item) => item.id === action.payload.department.id,
      );
      state.data[existingFacultyIndex].departments[departmentIndex] =
        action.payload.department;
    },
    removeDepartment: (
      state,
      action: PayloadAction<{ departmentId: number; facultyId: number }>,
    ) => {
      const existingFacultyIndex = state.data.findIndex(
        (item) => item.id === action.payload.facultyId,
      );

      if (existingFacultyIndex === -1) {
        return;
      }

      state.data[existingFacultyIndex].departments = state.data[
        existingFacultyIndex
      ].departments.filter((item) => item.id !== action.payload.departmentId);
      state.count--;
    },
  },
});

export default facultySlice.reducer;
export const {
  loadFaculties,
  addFaculty,
  updateFaculty,
  removeFaculty,
  addDepartment,
  updateDepartment,
  removeDepartment,
} = facultySlice.actions;
