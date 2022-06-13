export type WindowType = {
  id: string;
  title: string;
  content: string;
  state: 'open' | 'closed';
  coordinates: { x: number; y: number };
  type: 'file' | 'folder';
};
