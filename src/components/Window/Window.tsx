import React, { useMemo, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { useGlobal } from '@/store/slices/GlobalSlice';
import domtoimage from 'dom-to-image';
import WindowTaskBar from './WindowTaskBar';
import { useFiles } from '@/store/slices/FileSlice';
import { EntryType, FileSystemEntry } from '@/typings/File';
import { getParentPath, isFilePath, joinPaths } from '@/utils/createPath';
import {
  ButtonsContainer,
  FileIcon,
  FileItem,
  FileName,
  FolderContents,
  WindowContainer,
  WindowLayout,
  WindowTextContent,
  WindowTitle,
} from './Window.styles';
import { WindowState } from '@/typings/Window';
import {
  findEntryByPath,
  getFolderContents,
  getFileType,
  getFullPathForEntry,
} from '@/utils/fileSystem';

interface WindowProps extends React.ComponentProps<'div'> {
  id: string;
  title: string;
  content: string;
  coordinates: { x: number; y: number };
}

const Window = ({
  id,
  title,
  content,
  coordinates = { x: 0, y: 0 },
}: WindowProps) => {
  const { windows, activeWindow, setActiveWindow, updateWindow, removeWindow } =
    useGlobal();
  const { files } = useFiles();

  const thisWindow = useMemo(() => windows[id], [id, windows]);
  const isMinimized = thisWindow?.state === WindowState.MINIMIZED;
  const isActiveWindow = activeWindow === id;
  const isMaximized = thisWindow?.state === WindowState.MAXIMIZED;

  const [position, setPosition] = React.useState({
    x: coordinates.x,
    y: coordinates.y,
  });
  const [size, setSize] = React.useState(
    thisWindow?.size || {
      width: 400,
      height: 300,
    },
  );

  const finalSize = isMaximized
    ? { width: window.innerWidth, height: window.innerHeight }
    : size;

  const finalCoordinates = isMaximized ? { x: 0, y: 0 } : position;

  const handleMinimize = async () => {
    if (!thisWindow) return;

    // First, update the window state
    const newState =
      thisWindow.state === WindowState.MINIMIZED
        ? WindowState.OPEN
        : WindowState.MINIMIZED;

    updateWindow(id, { state: newState });

    // Generate preview if minimizing
    if (newState === WindowState.MINIMIZED) {
      const windowElement = document.getElementById(`child${id}`);
      if (!windowElement) return;

      try {
        const dataUrl = await domtoimage.toPng(windowElement);
        updateWindow(id, { previewImage: dataUrl });
      } catch (error) {
        console.error('Preview generation failed:', error);
      }
    }
  };

  const handleMaximize = () => {
    if (!thisWindow) return;

    if (thisWindow.state === WindowState.MAXIMIZED) {
      updateWindow(id, {
        state: WindowState.OPEN,
      });
    } else {
      updateWindow(id, { state: WindowState.MAXIMIZED });
    }
  };

  const handleClose = () => {
    removeWindow(id);
  };

  const handleResize = (width: number, height: number) => {
    if (!isMinimized) {
      updateWindow(id, {
        size: {
          width,
          height,
          previewWidth: width,
          previewHeight: height,
        },
      });
    }
  };

  const handleNavigate = (newPath: string) => {
    // Update the window's path
    updateWindow(id, { path: newPath });

    // Check if this is a file or folder path
    const entry = findEntryByPath(files, newPath);

    if (entry) {
      if (entry.type === EntryType.FILE) {
        // If it's a file, update the window content with file contents
        updateWindow(id, {
          content: entry.content || '',
          type: 'file',
          title: entry.fileName,
          contentType: getFileType(entry.fileName),
        });
      } else if (entry.type === EntryType.FOLDER) {
        // If it's a folder, update the window to show folder contents
        updateWindow(id, {
          type: 'folder',
          title: entry.fileName,
        });
      }
    } else if (newPath === '') {
      // Root path (Desktop)
      updateWindow(id, {
        type: 'folder',
        title: 'Desktop',
        path: '',
      });
    }
  };

  const handleSearch = (query: string) => {
    // Handle search when implemented
    console.log('Search for:', query);
  };

  // Render folder contents when the window is a folder
  const renderFolderContents = () => {
    // Get the current path from the window
    const currentPath = thisWindow.path || '';

    // Get the folder contents for this path
    const folderContents = getFolderContents(files, currentPath);

    return (
      <FolderContents>
        {folderContents.map(file => (
          <FileItem
            key={file.id}
            onClick={() => {
              const filePath = joinPaths(currentPath, file.fileName);
              handleNavigate(filePath);
            }}
            onDoubleClick={() => {
              // Double click behavior could be different
              console.log('Double clicked:', file.fileName);
            }}
          >
            <FileIcon>{file.type === EntryType.FOLDER ? '📁' : '📄'}</FileIcon>
            <FileName>{file.fileName}</FileName>
          </FileItem>
        ))}
        {folderContents.length === 0 && (
          <div
            style={{ gridColumn: 'span 4', textAlign: 'center', color: '#888' }}
          >
            This folder is empty
          </div>
        )}
      </FolderContents>
    );
  };

  return (
    <Rnd
      size={finalSize}
      position={finalCoordinates}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      dragHandleClassName='window-drag-handle'
      onResize={(e, direction, ref) => {
        const newSize = {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          previewWidth: ref.offsetWidth,
          previewHeight: ref.offsetHeight,
        };
        setSize(newSize);
        handleResize(ref.offsetWidth, ref.offsetHeight);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setPosition(position);
      }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      style={{ zIndex: isActiveWindow ? 100 : 1 }}
      onClick={() => setActiveWindow(id)}
    >
      <WindowContainer
        style={{
          width: finalSize.width,
          height: finalSize.height,
        }}
        data-minimized={isMinimized}
        id={`child${id}`}
      >
        <WindowLayout className='window-drag-handle'>
          <WindowTitle>{title}</WindowTitle>
          <ButtonsContainer>
            <button onClick={handleMinimize}>_</button>
            <button onClick={handleMaximize}>[]</button>
            <button onClick={handleClose}>x</button>
          </ButtonsContainer>
        </WindowLayout>
        <WindowTaskBar
          path={thisWindow.path || ''}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          window={thisWindow}
        />

        {/* Render different content based on window type */}
        {thisWindow.type === 'folder' ? (
          renderFolderContents()
        ) : (
          <WindowTextContent>
            <textarea
              className='w-full h-full'
              value={content}
              onChange={e => updateWindow(id, { content: e.target.value })}
            />
          </WindowTextContent>
        )}
      </WindowContainer>
    </Rnd>
  );
};

export default Window;
