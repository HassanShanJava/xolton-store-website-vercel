import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface StoreWebPageData {
  pageData?: [] | null;
}

export const initialState: StoreWebPageData = {
  pageData: null,
};

export const pageSlice = createSlice({
  name: "pageData",
  initialState,
  reducers: {
    storeWebPageData: (state, action: PayloadAction<any>) => {
      console.log("ACTION ... : ", action.payload);
      state.pageData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { storeWebPageData } = pageSlice.actions;

export default pageSlice.reducer;
