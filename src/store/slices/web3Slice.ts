import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface web3Interface {
  web3?: object | null;
  account?: string;
  chainId?: string;
}

export const initialState: web3Interface = {
  web3: null,
  account: "",
  chainId: "",
};

export const web3Slice = createSlice({
  name: "web3Auth",
  initialState,
  reducers: {
    web3Init: (state, action: PayloadAction<any>) => {
      state.web3 = action.payload?.web3;
      state.account = action.payload?.account;
      state.chainId = action.payload?.chainId;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { web3Init, setAccount } = web3Slice.actions;

export default web3Slice.reducer;
