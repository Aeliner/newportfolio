/* A folder type of file can have a name and a list of files
	These files can also be folders, each with name and list of files
	based on the name and an arbitrary base path, we should divide the path to a folder to be able to
	build a component showing a path like this: base > folder > folder > file.txt
*/

export const createPath = (path: string, basePath: string) => {
  const pathParts = path.split('/');
  const basePathParts = basePath.split('/');
  const basePathPartsLength = basePathParts.length;
  const commonPath = pathParts.slice(0, basePathPartsLength).join('/');
  const remainingPath = pathParts.slice(basePathPartsLength).join('/');
  return {
    commonPath,
    remainingPath,
  };
};

const CONSTANT_BASE_PREFIX = 'C:/Portfolio/Aeliner/Desktop';

// Windows-style path visualization utility
export const createWindowsStylePath = (fullPath: string) => {
  // Example: basePrefix = "C:/Portfolio/Aeliner/Desktop"
  // fullPath = "Desktop/custom folder 1/subfolder"

  // Split the path by forward slashes
  const pathParts = fullPath.split('/').filter(part => part.trim() !== '');

  // Create breadcrumb segments with Windows-style root
  const segments = ['C:', 'Portfolio', 'Aeliner', 'Desktop', ...pathParts];

  return {
    // For visual representation: "C: > Portfolio > Aeliner > Desktop > custom folder 1 > subfolder"
    visualPath: segments.join(' > '),

    // For string representation: "C:/Portfolio/Aeliner/Desktop/custom folder 1/subfolder"
    stringPath: CONSTANT_BASE_PREFIX + '/' + pathParts.join('/'),

    // Individual segments for component rendering
    segments,
  };
};

// Function to join path segments correctly
export const joinPaths = (...parts: string[]): string => {
  return parts
    .map(part => part.trim().replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
};

// Function to navigate to a parent directory
export const getParentPath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  return segments.length > 1 ? segments.slice(0, -1).join('/') : '';
};

// Function to get the current directory/folder name from a path
export const getCurrentDirectory = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : '';
};

// Function to extract filename and extension
export const getFileInfo = (
  path: string,
): { name: string; extension: string | null } => {
  const segments = path.split('/').filter(Boolean);
  const filename = segments.length > 0 ? segments[segments.length - 1] : '';

  const dotIndex = filename.lastIndexOf('.');

  if (dotIndex === -1) {
    return { name: filename, extension: null };
  }

  return {
    name: filename.substring(0, dotIndex),
    extension: filename.substring(dotIndex + 1),
  };
};

// Function to check if a path ends with a file (has extension)
export const isFilePath = (path: string): boolean => {
  const { extension } = getFileInfo(path);
  return extension !== null;
};

// Function to convert from breadcrumb segment path to filesystem path
export const breadcrumbToPath = (breadcrumbPath: string): string => {
  const segments = breadcrumbPath.split(' > ');
  // Skip the base prefix parts (Portfolio, Aeliner, Desktop)
  return segments.slice(3).join('/');
};
