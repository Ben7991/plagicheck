import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthData, AuthState } from './auth.util';

const initialState: AuthState = {
  isAuthenticated: false,
  data: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthData>) => {
      state.isAuthenticated = true;
      state.data = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setAuthUser } = authSlice.actions;
