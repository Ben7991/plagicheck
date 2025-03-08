import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/auth/auth.slice';
import facultyReducer from './slice/faculty/faculty.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    faculty: facultyReducer,
  },
});
