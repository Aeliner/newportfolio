import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import BgImage from './assets/defaultBackground.jpg';
import Img from 'react-cool-img';

import BlurredImage from './assets/blurredBackground.jpg';
import File from './components/File';

const AppComponent = styled.div`
  ${tw`w-screen h-screen flex flex-col`}
`;

const DesktopContainer = styled.div`
  ${tw`grid grid-cols-24 grid-rows-12 h-full w-full relative`}
`;

const ActionBarContainer = styled.div`
  ${tw`bg-gray-700 w-full h-8`}
`;

const BackgroundComponent = styled(Img)`
  ${tw`absolute top-0 z-[-1] left-0 w-full h-full`}
`;

const AppContainer = () => {
  return (
    <AppComponent>
      <BackgroundComponent
        placeholder={BlurredImage}
        src={BgImage}
        error={BlurredImage}
        alt='REACT COOL IMG'
      />
      <DesktopContainer>
        <File fileName='File 1' />
        <File fileName='File 2' />
        <File fileName='File 3' />
        <File fileName='File 4' />
        <File fileName='File 5' />
        <File fileName='File 6' />
        <File fileName='File 7' />
        <File fileName='File 8' />
      </DesktopContainer>
      <ActionBarContainer></ActionBarContainer>
    </AppComponent>
  );
};

export default AppContainer;
