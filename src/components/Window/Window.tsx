import { useGlobal } from '@/store/slices/GlobalSlice';
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import {
  ButtonsContainer,
  WindowContainer,
  WindowLayout,
} from './StyledWindow';

interface WindowProps {
  id: string;
  title: string;
  content: string;
  coordinates: { x: number; y: number };
}

const Window = ({ id, title, content, coordinates }: WindowProps) => {
  const { windows, setWindows } = useGlobal();
  const thisWindow = windows.find(window => window.id === id);
  const isMinimized = thisWindow?.state === 'closed' || false;
  const handleMinimize = () => {
    setWindows(
      windows.map(window =>
        window.id === id ? { ...window, state: 'closed' } : window,
      ),
    );
  };

  return (
    <Rnd
      default={{
        x: coordinates.x,
        y: coordinates.y,
        width: 800,
        height: 600,
      }}
      className={`${isMinimized ? 'minimized' : ''}`}
      id={id}
    >
      <WindowContainer minimized={isMinimized}>
        <WindowLayout>
          <ButtonsContainer>
            <button onClick={handleMinimize}>_</button>
          </ButtonsContainer>
        </WindowLayout>
        {title}
        {content}
      </WindowContainer>
    </Rnd>
  );
};

export default Window;
