import { ReactComponent as WindowsLogo } from '@/assets/window.svg';
import { Icons } from '@/components/File/FileIcons';
import Window from '@/components/Window/Window';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { WindowType } from '@/typings/Window';
import React from 'react';
import Img from 'react-cool-img';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import store from '@/store';
import { Provider } from 'react-redux';
const ActionBarContainer = styled.div`
  ${tw`bg-gray-700 w-full h-12 flex`}
`;

const ImageContainer = styled.div`
  ${tw`h-12 w-12 flex justify-center items-center text-white hover:cursor-pointer hover:bg-gray-600 hover:text-[#00adef]`}
  svg {
    ${tw`w-6 h-6`}
  }
  img {
    ${tw`w-6 h-6`}
  }
`;

const handleMouseEnter = (window: WindowType): void => {
  const previewContainer = document.getElementById('preview');
  const Component = (
    <Provider store={store}>
      <Window
        id={`preview${window.id}`}
        title={window.title}
        content={window.content}
        coordinates={window.coordinates}
        isPreview={true}
      />
    </Provider>
  );
  console.log(Component);

  ReactDOM.render(Component, previewContainer);
};

const handleMouseLeave = (window: WindowType): void => {
  // throw new Error('Function not implemented.');
};

const Footer = () => {
  const { windows, setWindows, setActiveWindow } = useGlobal();
  const handleClick = (id: string) => {
    setWindows(
      windows.map(window =>
        window.id === id
          ? {
              ...window,
              state: window.state === 'minimized' ? 'maximized' : 'minimized',
            }
          : window,
      ),
    );
    setActiveWindow(id);
  };

  return (
    <ActionBarContainer>
      <ImageContainer>
        <WindowsLogo />
      </ImageContainer>
      {windows.map((window: WindowType) => (
        <ImageContainer
          onMouseEnter={() => handleMouseEnter(window)}
          onMouseLeave={() => handleMouseLeave(window)}
          id={`Icon${window.id}`}
          onClick={() => handleClick(window.id)}
        >
          <Img src={Icons[window.type]} />
        </ImageContainer>
      ))}
    </ActionBarContainer>
  );
};

export default Footer;
