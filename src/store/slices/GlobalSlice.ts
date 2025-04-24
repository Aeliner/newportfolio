import { createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../index';
import { useWindows } from './WindowSlice';
import { useFiles } from './FileSlice';

const initialState = {
  // Global app state that isn't specific to windows or files
  isLoading: false,
  theme: 'light' as 'light' | 'dark',
};

const GlobalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useGlobal() {
  const dispatch = useAppDispatch();
  const { isLoading, theme } = useAppSelector(state => state.global);
  const windowsUtils = useWindows();
  const filesUtils = useFiles();

  return {
    // Global state
    isLoading,
    theme,
    setLoading: (loading: boolean) =>
      dispatch(GlobalSlice.actions.setLoading(loading)),
    setTheme: (theme: 'light' | 'dark') =>
      dispatch(GlobalSlice.actions.setTheme(theme)),
    ...windowsUtils,
    ...filesUtils,
  };
}

export default GlobalSlice.reducer;
