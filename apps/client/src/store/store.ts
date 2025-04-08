import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/auth/auth.slice';
import facultyReducer from './slice/faculty/faculty.slice';
import lecturerReducer from './slice/lecturer/lecturer.slice';
import studentReducer from './slice/student/student.slice';
import archiveReducer from './slice/archive/archive.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    faculty: facultyReducer,
    lecturer: lecturerReducer,
    student: studentReducer,
    archive: archiveReducer,
  },
});
