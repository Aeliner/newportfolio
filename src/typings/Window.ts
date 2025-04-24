export enum WindowState {
  OPEN = 'open',
  MINIMIZED = 'minimized',
  MAXIMIZED = 'maximized',
}

export interface WindowType {
  id: string;
  title: string;
  icon: string;
  content: string;
  state: WindowState;
  coordinates: { x: number; y: number };
  type: 'file' | 'folder';
  path: string; // Current path relative to Desktop
  contentType?: string; // For files, store MIME type or extension
  size: {
    width: number;
    height: number;
    previewWidth: number;
    previewHeight: number;
  };
  previewImage?: string;
}
