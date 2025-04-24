import React, { useState, useEffect } from 'react';
import {
  TaskBarContainer,
  TaskBarInput,
  SearchInput,
} from './WindowTaskBar.styles';
import BackArrowIcon from '@/assets/BackArrowIcon';
import ForwardArrowIcon from '@/assets/ForwardArrowIcon';
import { getParentPath } from '@/utils/createPath';
import PathBreadcrumb from '@/components/PathBreadcrumb/PathBreadcrumb';
import { WindowType } from '@/typings/Window';

interface WindowTaskBarProps {
  path: string;
  onNavigate?: (path: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
  window: WindowType;
}

const WindowTaskBar: React.FC<WindowTaskBarProps> = ({
  path,
  onNavigate,
  onSearch,
  className,
  window,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [navigationHistory, setNavigationHistory] = useState<string[]>([path]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Update history when path changes from outside this component
  useEffect(() => {
    if (path !== navigationHistory[historyIndex]) {
      // If we're navigating to a new path that's not in our history
      const newHistory = [
        ...navigationHistory.slice(0, historyIndex + 1),
        path,
      ];
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [path]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleBackClick = () => {
    if (onNavigate && historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousPath = navigationHistory[newIndex];
      setHistoryIndex(newIndex);
      onNavigate(previousPath);
    }
  };

  const handleForwardClick = () => {
    if (onNavigate && historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextPath = navigationHistory[newIndex];
      setHistoryIndex(newIndex);
      onNavigate(nextPath);
    }
  };

  const handleBreadcrumbClick = (
    segment: string,
    fullPathUpToSegment: string,
  ) => {
    if (onNavigate) {
      // Navigate directly to the path segment
      navigateToPath(fullPathUpToSegment);
    }
  };

  // Handle parent directory navigation
  const navigateToParent = () => {
    if (!path || path === '') return;

    const parentPath = getParentPath(path);
    navigateToPath(parentPath);
  };

  // Centralized navigation function to handle history updates
  const navigateToPath = (newPath: string) => {
    // Always default to Desktop (empty path) if trying to navigate to base folders
    // This prevents navigation to C:, Portfolio, or Aeliner
    if (
      !newPath ||
      ['c:', 'portfolio', 'aeliner', 'desktop'].includes(newPath.toLowerCase())
    ) {
      newPath = '';
    }

    if (path !== newPath && onNavigate) {
      // Add to history if it's a new path
      const newHistory = [
        ...navigationHistory.slice(0, historyIndex + 1),
        newPath,
      ];
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      onNavigate(newPath);
    }
  };

  // Handle entering a new path directly
  const handlePathInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      navigateToPath(e.currentTarget.value);
    }
  };

  return (
    <TaskBarContainer className={className}>
      <BackArrowIcon
        onClick={handleBackClick}
        style={{
          cursor: historyIndex > 0 ? 'pointer' : 'default',
          opacity: historyIndex > 0 ? 1 : 0.5,
        }}
      />
      <ForwardArrowIcon
        onClick={handleForwardClick}
        style={{
          cursor:
            historyIndex < navigationHistory.length - 1 ? 'pointer' : 'default',
          opacity: historyIndex < navigationHistory.length - 1 ? 1 : 0.5,
        }}
      />
      <PathBreadcrumb path={path} onSegmentClick={handleBreadcrumbClick} />
      <SearchInput
        type='text'
        placeholder='Search'
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      />
    </TaskBarContainer>
  );
};

export default WindowTaskBar;
