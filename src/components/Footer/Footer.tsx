import WindowsLogo from '@/assets/WindowIcon';
import { useGlobal } from '@/store/slices/GlobalSlice';
import { WindowType } from '@/typings/Window';
import React from 'react';
import { ActionBarContainer } from './Footer.styles';
import { ImageContainer } from '../TaskBar/TaskBarElement.styles';
import TaskBarElement from '../TaskBar/TaskBarElement';

const Footer = () => {
  const { windowsArray } = useGlobal();

  return (
    <ActionBarContainer>
      <ImageContainer>
        <WindowsLogo />
      </ImageContainer>
      {windowsArray.map((window: WindowType) => (
        <TaskBarElement window={window} key={window.id} />
      ))}
    </ActionBarContainer>
  );
};

export default Footer;
