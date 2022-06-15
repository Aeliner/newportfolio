import { useGlobal } from '@/store/slices/GlobalSlice';
import { useDraggable, useResize } from '@/utils/useDraggable';
import React, { useRef } from 'react';
import {
  ButtonsContainer,
  Container,
  WindowContainer,
  WindowLayout,
} from './StyledWindow';
interface WindowProps {
  id: string;
  title: string;
  content: string;
  coordinates: { x: number; y: number };
  isPreview?: boolean;
}

const Window = ({
  id,
  title,
  content,
  coordinates = { x: 0, y: 0 },
  isPreview = false,
}: WindowProps) => {
  const { windows, setWindows, activeWindow, setActiveWindow } = useGlobal();
  const thisWindow = windows.find(window => window.id === id);
  const isMinimized = thisWindow?.state === 'minimized' || false;
  const isActiveWindow = activeWindow === id;
  const size = useRef({ x: Infinity, y: Infinity });

  const parentRef = useResize(
    (newSize: { x: number; y: number }) => (size.current = newSize),
  );

  const [ref, pressed] = useDraggable();

  const handleMinimize = () => {
    setWindows(
      windows.map(window =>
        window.id === id ? { ...window, state: 'minimized' } : window,
      ),
    );
  };

  const handleBringToFront = () => {
    setActiveWindow(id);
  };

  return (
    <Container
      ref={parentRef}
      style={{
        position: isPreview ? 'relative' : undefined,
        transform: !isPreview
          ? `translate(${coordinates.x}px, ${coordinates.y}px)`
          : '',
        zIndex: isActiveWindow ? 100 : '',
      }}
      id={id}
      onClick={handleBringToFront}
    >
      <WindowContainer
        style={{
          position: isPreview ? 'relative' : undefined,
        }}
        ref={ref}
        id={`child${id}`}
        const
        className={`${isMinimized ? 'minimized' : 'maximized'} window
        }`}
      >
        <WindowLayout>
          <ButtonsContainer>
            <button onClick={handleMinimize}>_</button>
          </ButtonsContainer>
        </WindowLayout>
        {title}
        {content}
      </WindowContainer>
    </Container>
  );
};

export default Window;
