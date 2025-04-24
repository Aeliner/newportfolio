import { FileSystemEntry, EntryType } from '@/typings/File';
import {
  getFileInfo,
  isFilePath,
  getParentPath,
  joinPaths,
} from './createPath';

/**
 * Finds a file or folder by path in the file system
 */
export const findEntryByPath = (
  files: Record<string, FileSystemEntry>,
  path: string,
): FileSystemEntry | null => {
  if (!path || path === '') {
    // Return null for root path - root is not represented as an entry
    return null;
  }

  const pathParts = path.split('/').filter(Boolean);

  // First, find entries that might match the last segment of the path
  const lastSegment = pathParts[pathParts.length - 1];
  const potentialMatches = Object.values(files).filter(
    file => file.fileName === lastSegment,
  );

  if (potentialMatches.length === 0) {
    return null;
  }

  // For each potential match, check if its full path matches the given path
  for (const entry of potentialMatches) {
    const entryPath = getFullPathForEntry(files, entry);
    if (entryPath === path) {
      return entry;
    }
  }

  return null;
};

/**
 * Gets the full path for a file system entry by traversing its parent hierarchy
 */
export const getFullPathForEntry = (
  files: Record<string, FileSystemEntry>,
  entry: FileSystemEntry,
): string => {
  const pathParts: string[] = [entry.fileName];
  let currentEntry = entry;

  // Traverse up the parent hierarchy to build the full path
  while (currentEntry.parentId) {
    const parentEntry = files[currentEntry.parentId];
    if (!parentEntry) break;

    pathParts.unshift(parentEntry.fileName);
    currentEntry = parentEntry;
  }

  return pathParts.join('/');
};

/**
 * Gets the children of a folder at a specific path
 */
export const getFolderContents = (
  files: Record<string, FileSystemEntry>,
  path: string,
): FileSystemEntry[] => {
  if (!path || path === '') {
    // Return root level files (those without parents)
    return Object.values(files).filter(file => !file.parentId);
  }

  // Find the parent folder
  const parentFolder = findEntryByPath(files, path);
  if (!parentFolder || parentFolder.type !== EntryType.FOLDER) {
    return [];
  }

  // Return all entries that have this folder as parent
  return Object.values(files).filter(file => file.parentId === parentFolder.id);
};

/**
 * Creates a nested file system entry at the specified path
 */
export const createEntryAtPath = (
  files: Record<string, FileSystemEntry>,
  path: string,
  entry: Omit<FileSystemEntry, 'id' | 'parentId'> & { id?: string },
): FileSystemEntry => {
  const parentPath = getParentPath(path);

  const newEntry: FileSystemEntry = {
    ...entry,
    id: entry.id || crypto.randomUUID(),
    parentId: undefined,
  };

  if (parentPath) {
    const parentFolder = findEntryByPath(files, parentPath);
    if (parentFolder && parentFolder.type === EntryType.FOLDER) {
      newEntry.parentId = parentFolder.id;
    }
  }

  return newEntry;
};

/**
 * Breadcrumb navigation - get path segments for a given full path
 */
export const getPathSegments = (
  path: string,
): { name: string; path: string }[] => {
  // Base segments (always shown) - Hide the C: in visual representation
  const segments: { name: string; path: string }[] = [
    // All base segments should navigate to Desktop (our root)
    { name: 'Portfolio', path: '' },
    { name: 'Aeliner', path: '' },
    { name: 'Desktop', path: '' },
  ];

  if (!path || path === '') {
    return segments;
  }

  const pathParts = path.split('/').filter(Boolean);

  // Build the paths for each part after the base path
  let currentPath = '';
  for (const part of pathParts) {
    currentPath = joinPaths(currentPath, part);
    segments.push({ name: part, path: currentPath });
  }

  return segments;
};

/**
 * Determine if a file is an image, document, etc. based on extension
 */
export const getFileType = (path: string): string => {
  const { extension } = getFileInfo(path);

  if (!extension) return 'folder';

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
  const docExts = ['txt', 'md', 'doc', 'docx', 'pdf'];
  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json'];

  if (imageExts.includes(extension.toLowerCase())) return 'image';
  if (docExts.includes(extension.toLowerCase())) return 'document';
  if (codeExts.includes(extension.toLowerCase())) return 'code';

  return 'file';
};
