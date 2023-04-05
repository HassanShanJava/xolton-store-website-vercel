import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import web3SliceReducer from './slices/web3Slice';

export const store = configureStore({
  reducer: {
    web3: web3SliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
