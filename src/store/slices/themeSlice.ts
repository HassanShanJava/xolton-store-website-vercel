import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface StoreWebThemeData {
    themeData?: object | null;
 
}

export const initialState: StoreWebThemeData = {
    themeData: null,

};

export const themeSlice = createSlice({
  name: 'themeData',
  initialState,
  reducers: {
    storeWebThemeData: (state, action: PayloadAction<any>) => {
        console.log("ACTION ... : ",action.payload)    
        state.themeData = action.payload;
    },

  },
});

// Action creators are generated for each case reducer function
export const { storeWebThemeData } = themeSlice.actions;

export default themeSlice.reducer;
