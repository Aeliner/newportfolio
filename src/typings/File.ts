export enum EntryType {
  FILE = 'file',
  FOLDER = 'folder',
}

export enum EntryDisplayState {
  BEING_RENAMED = 'naming',
  BEING_CREATED = 'creating',
  STATIC = 'static',
}

export interface FileSystemEntry {
  id: string;
  fileName: string;
  children?: FileSystemEntry[];
  parentId?: string;
  content?: string;
  type: EntryType;
  createdAt: Date;
  updatedAt: Date;
  state: EntryDisplayState;
  onContextMenu?: (id: string) => void;
}
