import React, { useState, useEffect } from 'react';
import { getPathSegments } from '@/utils/fileSystem';
import {
  BreadcrumbContainer,
  Segment,
  Separator,
} from './PathBreadcrumb.styles';

interface PathBreadcrumbProps {
  path: string;
  basePrefix?: string;
  onSegmentClick?: (segment: string, fullPathUpToSegment: string) => void;
  mode?: 'visual' | 'string';
}

const BASE_PATH = 'C:/Portfolio/Aeliner/Desktop';

const PathBreadcrumb: React.FC<PathBreadcrumbProps> = ({
  path,
  basePrefix = BASE_PATH,
  onSegmentClick,
  mode = 'visual',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPath, setEditedPath] = useState(getFullEditingPath(path));

  // Get path segments for display
  const segments = getPathSegments(path);

  // Helper function to get the full editing path with base prefix
  function getFullEditingPath(relativePath: string): string {
    if (!relativePath) return BASE_PATH;
    return `${BASE_PATH}/${relativePath}`;
  }

  // When path prop changes, update editedPath
  useEffect(() => {
    if (!isEditing) {
      setEditedPath(getFullEditingPath(path));
    }
  }, [path, isEditing]);

  // Handle clicking on a segment
  const handleSegmentClick = (index: number, e: React.MouseEvent) => {
    if (!onSegmentClick) return;

    // Stop propagation to prevent the container's click handler from firing
    e.stopPropagation();

    // Get the path for this segment
    const segmentPath = segments[index].path;

    // Call the click handler with the segment name and path
    onSegmentClick(segments[index].name, segmentPath);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Ensure the base path is always present
    if (inputValue.startsWith(BASE_PATH)) {
      setEditedPath(inputValue);
    } else if (inputValue.toLowerCase().startsWith('c:/')) {
      // If they're typing a path that starts with C:/ but not our base path,
      // force it to use our base path
      setEditedPath(
        BASE_PATH +
          inputValue.substring(inputValue.toLowerCase().indexOf('desktop') + 7),
      );
    } else {
      // If they delete the base path, restore it
      setEditedPath(
        BASE_PATH +
          (inputValue.startsWith('/') ? inputValue : '/' + inputValue),
      );
    }
  };

  const handlePathKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSegmentClick) {
      // Convert the edited path (with base prefix) to a relative path
      const relativePath = editedPath
        .substring(BASE_PATH.length)
        .replace(/^\/+/, '');

      // Navigate to the path
      onSegmentClick('direct-input', relativePath);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedPath(getFullEditingPath(path));
    }
  };

  const handlePathBlur = () => {
    setIsEditing(false);
    setEditedPath(getFullEditingPath(path));
  };

  return (
    <BreadcrumbContainer onClick={handleContainerClick}>
      {isEditing ? (
        <input
          type='text'
          value={editedPath}
          onChange={handlePathChange}
          onKeyDown={handlePathKeyDown}
          onBlur={handlePathBlur}
          autoFocus
          style={{ width: '100%', padding: '2px 4px' }}
        />
      ) : (
        <>
          {segments.map((segment, index) => (
            <span key={`segment-${index}`}>
              {index > 0 && <Separator>&gt;</Separator>}
              <Segment onClick={e => handleSegmentClick(index, e)}>
                {segment.name}
              </Segment>
            </span>
          ))}
        </>
      )}
    </BreadcrumbContainer>
  );
};

export default PathBreadcrumb;
