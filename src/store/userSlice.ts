import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";

interface UserState {
  user: User | null;
  isAuthorized: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthorized: false,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startUserLoading(state) {
      state.isLoading = true;
    },

    finishUserLoading(state) {
      state.isLoading = false;
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthorized = true;
      state.isLoading = false;
    },

    clearUser(state) {
      state.user = null;
      state.isAuthorized = false;
      state.isLoading = false;
    },
  },
});

export const { startUserLoading, finishUserLoading, setUser, clearUser } =
  userSlice.actions;

export const userReducer = userSlice.reducer;
