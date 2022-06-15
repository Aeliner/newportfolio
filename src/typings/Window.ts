export type WindowType = {
  id: string;
  title: string;
  content: string;
  state: 'open' | 'minimized' | 'maximized';
  coordinates: { x: number; y: number };
  type: 'file' | 'folder';
};
