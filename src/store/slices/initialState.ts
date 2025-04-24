import {
  EntryDisplayState,
  EntryType,
  type FileSystemEntry,
} from '@/typings/File';

const dummyFiles: FileSystemEntry[] = [
  {
    id: 'welcome.md',
    fileName: 'welcome.md',
    content:
      '# Welcome\nThis is your workspace. Start creating or open existing files.',
    type: EntryType.FILE,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: EntryDisplayState.STATIC,
  },
  {
    id: 'example.js',
    fileName: 'example.js',
    content: 'console.log("Hello, World!");\n\n// Start coding here',
    type: EntryType.FILE,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: EntryDisplayState.STATIC,
  },
  {
    id: 'docs',
    fileName: 'docs',
    type: EntryType.FOLDER,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: EntryDisplayState.STATIC,
  },
  {
    id: 'docs/readme.md',
    fileName: 'readme.md',
    content: '# Documentation\nAdd your project documentation here.',
    type: EntryType.FILE,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: EntryDisplayState.STATIC,
  },
];

// Convert array to Record for initial state
export const initialFiles: Record<string, FileSystemEntry> = dummyFiles.reduce(
  (acc, file) => {
    acc[file.id] = file;
    return acc;
  },
  {} as Record<string, FileSystemEntry>,
);

export const initialFileState = {
  files: initialFiles,
  activeFile: 'welcome.md',
  recentFiles: ['welcome.md'],
};
