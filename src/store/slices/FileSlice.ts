import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FileSystemEntry } from '@/typings/File';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../index';
import { initialFiles } from '@/store/slices/initialState';

const initialState = {
  files: initialFiles,
  activeFile: '',
  recentFiles: [] as string[],
};

const FileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles(state, action: PayloadAction<FileSystemEntry[]>) {
      state.files = action.payload.reduce((acc, file) => {
        acc[file.id] = file;
        return acc;
      }, {} as Record<string, FileSystemEntry>);
    },
    addFile(state, action: PayloadAction<FileSystemEntry>) {
      state.files[action.payload.id] = action.payload;
      if (!state.recentFiles.includes(action.payload.id)) {
        state.recentFiles.unshift(action.payload.id);
      }
    },
    removeFile(state, action: PayloadAction<string>) {
      delete state.files[action.payload];
      state.recentFiles = state.recentFiles.filter(id => id !== action.payload);
    },
    updateFile(
      state,
      action: PayloadAction<{ id: string; updates: Partial<FileSystemEntry> }>,
    ) {
      if (state.files[action.payload.id]) {
        state.files[action.payload.id] = {
          ...state.files[action.payload.id],
          ...action.payload.updates,
        };
      }
    },
    getFileByName: {
      reducer(
        state,
        action: PayloadAction<{
          name: string;
          result: FileSystemEntry | undefined;
        }>,
      ) {
        // reducer doesn't return anything, just modifies state if needed
      },
      prepare(name: string) {
        const result = Object.values(initialState.files).find(
          file => file.fileName === name,
        );
        return { payload: { name, result } };
      },
    },
    setActiveFile(state, action: PayloadAction<string>) {
      state.activeFile = action.payload;
      if (action.payload && !state.recentFiles.includes(action.payload)) {
        state.recentFiles.unshift(action.payload);
      }
    },
  },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useFiles() {
  const dispatch = useAppDispatch();
  const { files, activeFile, recentFiles } = useAppSelector(
    state => state.files,
  );

  const generateUniqueFileName = (baseName: string): string => {
    let fileName = baseName;
    let counter = 1;

    while (Object.values(files).some(file => file.fileName === fileName)) {
      fileName = `${baseName} (${counter})`;
      counter++;
    }

    return fileName;
  };

  return {
    files,
    filesArray: Object.values(files),
    getFile: (id: string) => files[id],
    activeFile,
    recentFiles: recentFiles.map(id => files[id]).filter(Boolean),
    setFiles: (payload: FileSystemEntry[]) =>
      dispatch(FileSlice.actions.setFiles(payload)),
    addFile: (file: FileSystemEntry) =>
      dispatch(FileSlice.actions.addFile(file)),
    removeFile: (id: string) => dispatch(FileSlice.actions.removeFile(id)),
    updateFile: (id: string, updates: Partial<FileSystemEntry>) =>
      dispatch(FileSlice.actions.updateFile({ id, updates })),
    setActiveFile: (id: string) =>
      dispatch(FileSlice.actions.setActiveFile(id)),
    getFileByName: (name: string) =>
      dispatch(FileSlice.actions.getFileByName(name)),
    generateUniqueFileName,
  };
}

export default FileSlice.reducer;
