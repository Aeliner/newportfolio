import {
  useFloating,
  useHover,
  useInteractions,
  offset,
  shift,
  autoUpdate,
  safePolygon,
} from '@floating-ui/react';
import { WindowState, WindowType } from '@/typings/Window';
import { ImageContainer } from './TaskBarElement.styles';
import React, { Key, useState } from 'react';
import Img from 'react-cool-img';
import { Icons } from '../File/FileIcons';
import { useGlobal } from '../../store/slices/GlobalSlice';
import PreviewWindow from '@/components/Window/PreviewWindow';

interface TaskBarElementProps {
  key: Key;
  window: WindowType;
}

const TaskBarElement = ({ window }: TaskBarElementProps) => {
  const { updateWindow, setActiveWindow } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(10), // Distance from taskbar icon
      shift(), // Keeps preview within viewport
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 350, close: 350 },
    handleClose: safePolygon({ buffer: 10 }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const handleClick = (id: string) => {
    updateWindow(id, {
      state:
        window.state === WindowState.MINIMIZED
          ? WindowState.OPEN
          : WindowState.MINIMIZED,
    });
    setActiveWindow(id);
  };

  return (
    <ImageContainer
      ref={refs.setReference}
      {...getReferenceProps()}
      onClick={() => handleClick(window.id)}
    >
      <Img src={Icons[window.type]} />
      {isOpen && (
        <PreviewWindow
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          windowId={window.id}
        />
      )}
    </ImageContainer>
  );
};

export default TaskBarElement;
