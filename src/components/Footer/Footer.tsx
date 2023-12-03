import WindowsLogo from '@/assets/WindowIcon';
import { Icons } from '@/components/File/FileIcons';
import Window from '@/components/Window/Window';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { WindowType } from '@/typings/Window';
import React from 'react';
import Img from 'react-cool-img';
import { ActionBarContainer, ImageContainer } from './Footer.styles';
import domtoimage from 'dom-to-image';

const handleMouseEnter = async (window: WindowType): Promise<void> => {
  const previewContainer = document.getElementById('preview');
  const windowElement = document.getElementById(`child${window.id}`);
  if (!previewContainer || !windowElement) return;
  domtoimage
    .toPng(windowElement)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
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
          key={window.id}
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
