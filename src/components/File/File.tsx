import React, { Key, MouseEvent, useEffect, useCallback, useRef } from 'react';
import Img from 'react-cool-img';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { revisedRandId } from '@/utils/generateId';
import { Icons } from './FileIcons';
import { WindowState } from '@/typings/Window';
import { FileSystemEntry, EntryType, EntryDisplayState } from '@/typings/File';
import { useFiles } from '@/store/slices/FileSlice';
import { FileContainer, FileName, FileNameInput } from './File.styles';

interface FileProps extends FileSystemEntry {
  key: Key;
}

const File = ({
  id,
  fileName,
  content = 'Write your content here',
  type = EntryType.FILE,
  state = EntryDisplayState.STATIC,
  key,
  onContextMenu,
  ...props
}: FileProps) => {
  const isBeingCreated = state === EntryDisplayState.BEING_CREATED;
  const isBeingRenamed = state === EntryDisplayState.BEING_RENAMED;
  const isEditing = isBeingCreated || isBeingRenamed;
  if (isEditing) {
    console.log('isEditing', id, fileName);
  }
  const [editValue, setEditValue] = React.useState(
    isBeingCreated ? '' : fileName,
  );
  const [isSelected, setIsSelected] = React.useState(isBeingCreated);
  const inputRef = useRef<HTMLInputElement>(null);
  const justStartedEditing = useRef(false);

  const { addWindow } = useGlobal();
  const { updateFile, removeFile, generateUniqueFileName } = useFiles();

  // Effect to handle focusing and preventing immediate blur when renaming starts
  useEffect(() => {
    if (isEditing) {
      justStartedEditing.current = true;
      // Use a small timeout to ensure the focus happens after the context menu closes
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
        justStartedEditing.current = false;
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isEditing]);

  const handleNameFinalize = useCallback(() => {
    // Don't finalize if we're just starting to edit (prevents immediate blur issue)
    if (justStartedEditing.current) return;

    const finalName = editValue.trim() || 'Untitled';
    const uniqueName = generateUniqueFileName(finalName);
    updateFile(id, { fileName: uniqueName, state: EntryDisplayState.STATIC });
  }, [editValue, generateUniqueFileName, id, updateFile]);

  const handleKeyboardEvent = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Del') && isSelected) {
        e.preventDefault();
        handleDeleteFile();
      }
      if (e.key === 'Enter' && isEditing) {
        e.preventDefault();
        handleNameFinalize();
      }
    },
    [isSelected, isEditing, handleNameFinalize],
  );

  const handleDeleteFile = useCallback(() => removeFile(id), [id, removeFile]);

  const handleDoubleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      addWindow({
        id: revisedRandId(),
        coordinates: { x: e.clientX, y: e.clientY },
        title: fileName,
        content,
        type,
        icon: Icons[type],
        state: WindowState.OPEN,
        size: { width: 800, height: 600, previewWidth: 80, previewHeight: 60 },
      });
    },
    [addWindow, content, fileName, type],
  );

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSelected(true);
  }, []);

  return (
    <FileContainer
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onKeyDown={handleKeyboardEvent}
      tabIndex={0}
      key={key}
      className={isSelected ? 'selected' : ''}
      data-file-id={id}
      onContextMenu={() => onContextMenu?.(id)}
      {...props}
    >
      <Img src={Icons[type]} />
      {isEditing ? (
        <FileNameInput
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyboardEvent}
          onBlur={handleNameFinalize}
        />
      ) : (
        <FileName>{fileName}</FileName>
      )}
    </FileContainer>
  );
};

export default File;
