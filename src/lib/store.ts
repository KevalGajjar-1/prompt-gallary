// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { promptApi } from '@/services/promptApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [promptApi.reducerPath]: promptApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(promptApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];