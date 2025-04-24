import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WindowType } from '@/typings/Window';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../index';

const initialState = {
  windows: {} as Record<string, WindowType>,
  activeWindow: '',
  activePreviewWindow: '',
  isInActivePreviewWindow: false,
};

const WindowSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    setWindows(state, action: PayloadAction<WindowType[]>) {
      state.windows = action.payload.reduce((acc, window) => {
        acc[window.id] = window;
        return acc;
      }, {} as Record<string, WindowType>);
    },
    setActiveWindow(state, action: PayloadAction<string>) {
      state.activeWindow = action.payload;
    },
    setActivePreviewWindow(state, action: PayloadAction<string>) {
      state.activePreviewWindow = action.payload;
    },
    setIsInActivePreviewWindow(state, action: PayloadAction<boolean>) {
      state.isInActivePreviewWindow = action.payload;
    },
    updateWindow(
      state,
      action: PayloadAction<{ id: string; updates: Partial<WindowType> }>,
    ) {
      if (state.windows[action.payload.id]) {
        state.windows[action.payload.id] = {
          ...state.windows[action.payload.id],
          ...action.payload.updates,
        };
      }
    },
    addWindow(state, action: PayloadAction<WindowType>) {
      state.windows[action.payload.id] = action.payload;
    },
    removeWindow(state, action: PayloadAction<string>) {
      delete state.windows[action.payload];
    },
  },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useWindows() {
  const dispatch = useAppDispatch();
  const {
    windows,
    activeWindow,
    activePreviewWindow,
    isInActivePreviewWindow,
  } = useAppSelector(state => state.windows);

  return {
    windows,
    windowsArray: Object.values(windows),
    getWindow: (id: string) => windows[id],
    activeWindow,
    activePreviewWindow,
    isInActivePreviewWindow,
    setActiveWindow: (id: string) =>
      dispatch(WindowSlice.actions.setActiveWindow(id)),
    setWindows: (payload: WindowType[]) =>
      dispatch(WindowSlice.actions.setWindows(payload)),
    setActivePreviewWindow: (id: string) =>
      dispatch(WindowSlice.actions.setActivePreviewWindow(id)),
    setIsInActivePreviewWindow: (payload: boolean) =>
      dispatch(WindowSlice.actions.setIsInActivePreviewWindow(payload)),
    updateWindow: (id: string, updates: Partial<WindowType>) =>
      dispatch(WindowSlice.actions.updateWindow({ id, updates })),
    addWindow: (window: WindowType) =>
      dispatch(WindowSlice.actions.addWindow(window)),
    removeWindow: (id: string) =>
      dispatch(WindowSlice.actions.removeWindow(id)),
  };
}

export default WindowSlice.reducer;
