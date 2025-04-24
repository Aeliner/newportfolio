import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import GlobalSlice from './slices/GlobalSlice';
import WindowSlice from './slices/WindowSlice';
import FileSlice from './slices/FileSlice';

const store = configureStore({
  reducer: {
    global: GlobalSlice,
    windows: WindowSlice,
    files: FileSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
