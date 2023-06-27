import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface authInterface {
  maticToUsd: string | "0";
}

export const initialState: authInterface = {
  maticToUsd: "0",
};

export const maticSlice = createSlice({
  name: "matic",
  initialState,
  reducers: {
    setMaticToUsdProcess: (state, action: PayloadAction<any>) => {
      state.maticToUsd = action.payload;
    },
    finishUserProcess: (state) => {
      state.maticToUsd = "0";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMaticToUsdProcess, finishUserProcess } = maticSlice.actions;

export default maticSlice.reducer;
