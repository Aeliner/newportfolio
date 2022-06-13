import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../index';
import type { WindowType } from '../../typings/Window';

const initialState = {
  windows: Array<WindowType>(),
};

const GlobalSlice = createSlice({
  name: 'global',
  initialState: initialState,
  reducers: {
    setWindows(state, action: PayloadAction<Array<WindowType>>) {
      state.windows = action.payload;
    },
  },
  extraReducers: {},
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useGlobal() {
  const dispatch = useAppDispatch();
  const { windows } = useAppSelector(state => state.GlobalSlice);

  return {
    windows,
    setWindows: (payload: WindowType[]) =>
      dispatch(GlobalSlice.actions.setWindows(payload)),
  };
}

export default GlobalSlice.reducer;
