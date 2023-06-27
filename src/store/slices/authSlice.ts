import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface authInterface {
  user: object | null;
}

export const initialState: authInterface = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProcess: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    finishUserProcess: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserProcess, finishUserProcess } = userSlice.actions;

export default userSlice.reducer;
