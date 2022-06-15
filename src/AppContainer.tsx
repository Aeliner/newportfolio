import React from 'react';
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
import { Animation, ReverseAnimation } from '@/components/Window/StyledWindow';

const AppComponent = styled.div`
  ${tw`w-screen h-screen flex flex-col overflow-hidden`}
`;

const DesktopContainer = styled.div`
  ${tw`h-full w-full relative flex flex-col justify-between`}
  .window {
    width: 0;
    height: 0;
    opacity: 0;
    transition: width 0.15s cubic-bezier(0.47, 0, 0.745, 0.715),
      height 0.15s cubic-bezier(0.47, 0, 0.745, 0.715),
      opacity 0.15s cubic-bezier(0.47, 0, 0.745, 0.715);
  }
  .minimized {
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
  }
  .maximized {
    width: 800px;
    height: 600px;
    opacity: 1;
  }
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
const PreviewContainer = styled.div`
  ${tw`absolute bottom-[calc(4rem * -3)] left-[calc(4rem * -4.5)] bg-white scale-[0.2]`}
`;

const renderWindows = (windows: WindowType[]) => {
  return windows.map(window => {
    return (
      <Window
        coordinates={{ x: window.coordinates.x, y: window.coordinates.y }}
        id={window.id}
        content={window.content}
        title={window.title}
      />
    );
  });
};

const AppContainer = () => {
  const { windows } = useGlobal();
  return (
    <AppComponent>
      <BackgroundComponent
        placeholder={BlurredImage}
        src={BgImage}
        error={BlurredImage}
        alt='REACT COOL IMG'
      />

      <DesktopContainer id='desktop'>
        <PreviewContainer id='preview' />
        {renderWindows.length > 0 && renderWindows(windows)}
        <FileContainer>
          <File type='folder' fileName='Folder 1' />
          <File type='file' fileName='File 2' />
          <File type='file' fileName='File 3' />
          <File type='file' fileName='File 4' />
          <File type='file' fileName='File 5' />
          <File type='file' fileName='File 6' />
          <File type='file' fileName='File 7' />
          <File type='file' fileName='File 8' />
        </FileContainer>
        <Footer />
      </DesktopContainer>
    </AppComponent>
  );
};

export default AppContainer;
