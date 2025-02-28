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
    logoutAuthUser: (state) => {
      state.data = undefined;
      state.isAuthenticated = false;
    },
    changeEmailandName: (
      state,
      action: PayloadAction<Pick<AuthData, 'email' | 'name'>>,
    ) => {
      if (!state.data) {
        return;
      }

      state.data.name = action.payload.name;
      state.data.email = action.payload.email;
    },
  },
});

export default authSlice.reducer;
export const { setAuthUser, logoutAuthUser, changeEmailandName } =
  authSlice.actions;
