import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import web3SliceReducer from './slices/web3Slice';
import pageSliceReducer from './slices/pageSlice';
import themeSliceReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    web3: web3SliceReducer,
    page: pageSliceReducer,
    theme: themeSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
