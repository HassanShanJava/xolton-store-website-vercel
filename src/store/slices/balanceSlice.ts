import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface authInterface {
  balance: {
    matic: number | 0;
    wmatic: number | 0;
  };
}

export const initialState: authInterface = {
  balance: {
    matic: 0,
    wmatic: 0,
  },
};

export const userSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    setUserProcess: (state, action: PayloadAction<any>) => {
      state.balance = action.payload;
    },
    finishUserProcess: (state) => {
      state.balance.matic = 0;
      state.balance.wmatic = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserProcess, finishUserProcess } = userSlice.actions;

export default userSlice.reducer;
