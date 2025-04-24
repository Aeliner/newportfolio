import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import BgImage from './assets/defaultBackground.jpg';
import Img from 'react-cool-img';

import BlurredImage from './assets/blurredBackground.jpg';
import File from './components/File/File';
import Footer from './components/Footer/Footer';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { WindowType } from '@/typings/Window';
import Window from '@/components/Window/Window';
import { ContextMenu, MenuItem } from './components/ContextMenu';
import NewFolderIcon from '@/assets/NewFolderIcon';
import RefreshIcon from '@/assets/RefreshIcon';
import EditImageIcon from '@/assets/EditImageIcon';
import TextFileIcon from '@/assets/TextFileIcon';
import DeleteIcon from '@/assets/DeleteIcon';
import { EntryDisplayState, EntryType } from '@/typings/File';
import { useWindows } from '@/store/slices/WindowSlice';
import { useFiles } from '@/store/slices/FileSlice';

const AppComponent = styled.div`
  ${tw`w-screen h-screen flex flex-col overflow-hidden`}
`;

const DesktopContainer = styled.div`
  ${tw`h-full w-full relative flex flex-col justify-between`}
  .preview {
    transform: scale(0.1);
  }
`;

const BackgroundComponent = styled(Img)`
  ${tw`absolute top-0 z-[-1] left-0 w-full h-full`}
`;

const FileContainer = styled.div`
  ${tw`grid grid-cols-24 grid-rows-10 w-full`}
`;

const renderWindows = (windows: Record<string, WindowType>) => {
  return Object.values(windows).map(window => (
    <Window
      key={window.id}
      coordinates={{ x: window.coordinates.x, y: window.coordinates.y }}
      id={window.id}
      content={window.content}
      title={window.title}
    />
  ));
};

const AppContainer = () => {
  const { windows } = useWindows();
  const { files } = useFiles();
  const [rightClickedFileId, setRightClickedFileId] = useState<string | null>(
    null,
  );

  const { addFile, removeFile, updateFile } = useFiles();

  const handleCreateFile = () => {
    console.log('create file');
    addFile({
      id: crypto.randomUUID(),
      fileName: 'Untitled',
      type: EntryType.FILE,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: EntryDisplayState.BEING_CREATED,
    });
  };

  const handleFileContextMenu = (fileId: string) => {
    setRightClickedFileId(fileId);
  };

  return (
    <AppComponent>
      <BackgroundComponent
        placeholder={BlurredImage}
        src={BgImage}
        error={BlurredImage}
        alt='REACT COOL IMG'
      />
      <DesktopContainer id='desktop'>
        {Object.keys(windows).length > 0 && renderWindows(windows)}
        <FileContainer>
          {Object.values(files).map(file => (
            <File
              key={file.id}
              {...file}
              onContextMenu={() => handleFileContextMenu(file.id)}
            />
          ))}
        </FileContainer>
        <Footer />
      </DesktopContainer>

      <ContextMenu onClose={() => setRightClickedFileId(null)}>
        {rightClickedFileId ? (
          // File-specific context menu
          <>
            <MenuItem
              label='Delete'
              icon={<DeleteIcon />}
              onClick={() => {
                if (rightClickedFileId) {
                  removeFile(rightClickedFileId);
                  setRightClickedFileId(null);
                }
              }}
            />
            <MenuItem
              label='Rename'
              icon={<EditImageIcon />}
              onClick={() => {
                if (rightClickedFileId) {
                  updateFile(rightClickedFileId, {
                    state: EntryDisplayState.BEING_RENAMED,
                  });
                }
              }}
            />
          </>
        ) : (
          <>
            <MenuItem
              label='New File'
              icon={<TextFileIcon />}
              onClick={handleCreateFile}
              onMouseEnter={() => console.log('new file hover')}
            />
            <MenuItem
              label='New Folder'
              icon={<NewFolderIcon />}
              onClick={() => console.log('new folder')}
            />
            <MenuItem
              label='Refresh'
              icon={
                <RefreshIcon
                  style={{ transform: 'rotate(45deg)' }}
                  className='text-white'
                />
              }
              onClick={() => console.log('refresh')}
            />
            <MenuItem
              label='Change Background'
              icon={<EditImageIcon />}
              onClick={() => console.log('change background')}
            />
          </>
        )}
      </ContextMenu>
    </AppComponent>
  );
};

export default AppContainer;
