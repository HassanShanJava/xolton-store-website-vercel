import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface authInterface {
  nftStep: number | null;
}

export const initialState: authInterface = {
  nftStep: null,
};

export const nftsOfferSlice = createSlice({
  name: 'userOfferNfts',
  initialState,
  reducers: {
    setNftOfferCreateProcess: (state, action) => {
      state.nftStep = action.payload;
    },
    finishNftOfferCreateProcess: (state) => {
      state.nftStep = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNftOfferCreateProcess, finishNftOfferCreateProcess } =
nftsOfferSlice.actions;

export default nftsOfferSlice.reducer;
