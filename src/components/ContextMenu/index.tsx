import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  useRole,
  useDismiss,
  useInteractions,
  useListNavigation,
  useTypeahead,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
} from '@floating-ui/react';
import styled from 'styled-components';
import tw from 'twin.macro';

const MenuContainer = styled.div`
  ${tw`bg-gray-700/90 text-white shadow-lg rounded-lg min-w-[200px] z-50`}
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const MenuItemButton = styled.button`
  ${tw`w-full px-4 py-2 text-left first:rounded-t-lg last:rounded-b-lg hover:bg-gray-600/90 flex items-center gap-2`}
  &:disabled {
    ${tw`opacity-50 cursor-not-allowed hover:bg-gray-800/80`}
  }
  svg {
    ${tw`w-4 h-4`}
  }
`;

export const MenuItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
  }
>(({ label, disabled, icon, onClick, ...props }, ref) => {
  return (
    <MenuItemButton
      {...props}
      ref={ref}
      role='menuitem'
      disabled={disabled}
      onClick={onClick}
    >
      {icon && icon}
      {label}
    </MenuItemButton>
  );
});

export const ContextMenu = forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; onClose?: () => void }
>((props, forwardedRef) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef<Array<string | null>>([]);
  const allowMouseUpCloseRef = useRef(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: open => {
      setIsOpen(open);
      if (!open && props.onClose) {
        props.onClose();
      }
    },
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ['left-start'],
      }),
      shift({ padding: 10 }),
    ],
    placement: 'right-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context, {
    outsidePress: true,
  });
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex,
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  useEffect(() => {
    let timeout: number;

    function onContextMenu(e: MouseEvent) {
      e.preventDefault();

      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });

      setIsOpen(true);
      clearTimeout(timeout);

      allowMouseUpCloseRef.current = false;
      timeout = window.setTimeout(() => {
        allowMouseUpCloseRef.current = true;
      }, 300);
    }

    function onMouseUp(e: MouseEvent) {
      if (
        allowMouseUpCloseRef.current &&
        !refs.floating.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('mouseup', onMouseUp);
      clearTimeout(timeout);
    };
  }, [refs]);

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingOverlay lockScroll>
          <FloatingFocusManager context={context} initialFocus={refs.floating}>
            <MenuContainer
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              onClick={() => setIsOpen(false)}
            >
              {React.Children.map(props.children, (child, index) =>
                React.cloneElement(child as React.ReactElement, {
                  ref: (node: HTMLButtonElement) => {
                    listItemsRef.current[index] = node;
                    listContentRef.current[index] = (
                      child as React.ReactElement
                    ).props.label;
                  },
                  ...getItemProps(),
                  onClick: () => {
                    (child as React.ReactElement).props.onClick?.();
                    setIsOpen(false);
                  },
                }),
              )}
            </MenuContainer>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  );
});
