import {
  useRef,
  useState,
  useEffect,
  useCallback,
  RefObject,
  useReducer,
  useMemo,
} from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';

// Types

/**
 * Represents a function that has been throttled to run at most once per animation frame.
 * @template T The type of the original function
 */
type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

/**
 * A function that handles changes to a ref value.
 * @template T The type of the ref value
 * @param value The current value of the ref
 * @returns A cleanup function or void
 */
type RefHandler<T> = (value: T | null) => void | (() => void);

/**
 * Represents a 2D position with x and y coordinates.
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Options for the useDraggable hook.
 */
interface DraggableOptions {
  /**
   * Callback function called on each drag movement.
   * @param position The current position
   * @returns The new position
   */
  onDrag?: (position: Position) => Position;
  /** Initial x coordinate */
  x?: number;
  /** Initial y coordinate */
  y?: number;
}

/**
 * Throttles a function to run at most once per animation frame.
 * @template T The type of the function to throttle
 * @param f The function to throttle
 * @returns A throttled version of the function
 */
export const throttle = <T extends (...args: any[]) => any>(
  f: T,
): ThrottledFunction<T> => {
  let token: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invoke = () => {
    f(...(lastArgs as Parameters<T>));
    token = null;
  };

  const result = (...args: Parameters<T>) => {
    lastArgs = args;
    if (!token) {
      token = requestAnimationFrame(invoke);
    }
  };

  result.cancel = () => token && cancelAnimationFrame(token);
  return result;
};

/**
 * A hook that combines useRef and useEffect to handle side effects with refs.
 * @template T The type of the ref value
 * @param handler A function that handles changes to the ref value
 * @returns A function to update the ref value
 */
export const useRefEffect = <T>(
  handler: RefHandler<T>,
): ((value: T | null) => void) => {
  const storedValue = useRef<T | null>(null);
  const unsubscribe = useRef<(() => void) | undefined>();

  const result = useCallback(
    (value: T | null) => {
      storedValue.current = value;
      if (unsubscribe.current) {
        unsubscribe.current();
        unsubscribe.current = undefined;
      }
      const cleanup = handler(value);
      if (typeof cleanup === 'function') {
        unsubscribe.current = cleanup;
      }
    },
    [handler],
  );

  useEffect(() => {
    result(storedValue.current);
  }, [result]);

  return result;
};

/**
 * Combines multiple refs into a single ref callback.
 * @template T The type of the ref value
 * @param refs An array of refs to combine
 * @returns A ref callback that updates all provided refs
 */
const useCombinedRef = <T>(
  ...refs: (RefObject<T> | ((instance: T | null) => void))[]
) => {
  const initialRefs = useRef(refs);
  return useCallback((value: T | null) => {
    initialRefs.current.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  }, []);
};

/**
 * Creates a ref callback that adds an event listener to the element.
 * @template K The type of the event key
 * @param name The name of the event to listen for
 * @param handler The event handler function
 * @returns A ref callback that sets up the event listener
 */
const useDomEvent = <K extends keyof HTMLElementEventMap>(
  name: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions,
) => {
  return useCallback(
    (elem: HTMLElement | null) => {
      if (elem) {
        elem.addEventListener(name, handler, options);
        return () => {
          elem.removeEventListener(name, handler);
        };
      }
    },
    [name, handler],
  );
};

/**
 * Creates a callback with a persistent reference that updates on every render.
 * @template T The type of the callback function
 * @param f The callback function
 * @returns A memoized version of the callback that always calls the latest version
 */
const usePersistentCallback = <T extends (...args: any[]) => any>(f: T): T => {
  const realF = useRef<T>(f);
  useEffect(() => {
    realF.current = f;
  }, [f]);
  return useCallback((...args: Parameters<T>) => {
    return realF.current(...args);
  }, []) as T;
};

/**
 * Identity function that returns its input unchanged.
 * @template T The type of the input
 * @param x The input value
 * @returns The input value unchanged
 */
const id = <T>(x: T): T => x;

type DragAction =
  | { type: 'press' }
  | { type: 'release' }
  | { type: 'terminate' };

type DragState = {
  pressed: boolean;
  position: Position;
};

const reducer = (state: DragState, action: DragAction): DragState => {
  switch (action.type) {
    case 'press':
      return { ...state, pressed: true };
    case 'release':
    case 'terminate':
      return { ...state, pressed: false };
    default:
      return state;
  }
};

/**
 * Makes an element draggable.
 * @param options Options for draggable behavior
 * @returns A tuple containing [ref callback, isDragging, position]
 */
const useDraggable = ({ onDrag = id, x = 0, y = 0 }: DraggableOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    pressed: false,
    position: { x, y },
  });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }
    dispatch({ type: 'press' });
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const elem = ref.current;
    elem.style.userSelect = 'none';
    return () => {
      elem.style.userSelect = 'auto';
    };
  }, []);

  const subscribeMouseDown = useDomEvent('pointerdown', handleMouseDown, {
    passive: true,
  });
  const ref2 = useRefEffect(subscribeMouseDown);
  const combinedRef = useCombinedRef<HTMLElement>(ref, ref2);
  const persistentOnDrag = usePersistentCallback(onDrag);

  const handleMouseMove = useMemo(
    () =>
      throttle(({ movementX, movementY }: MouseEvent) => {
        const { x, y } = state.position;
        const newPosition = { x: x + movementX, y: y + movementY };
        const finalPosition = persistentOnDrag(newPosition);

        if (ref.current) {
          ref.current.style.transform = `translate3d(${finalPosition.x}px, ${finalPosition.y}px, 0)`;
        }
      }),
    [state.position, persistentOnDrag],
  );

  useEffect(() => {
    if (!state.pressed) {
      return;
    }

    const handleMouseUp = (e: MouseEvent) => {
      handleMouseMove(e);
      batch(() => {
        dispatch({ type: 'release' });
      });
    };

    const terminate = () => {
      dispatch({ type: 'terminate' });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        terminate();
      }
    };

    document.addEventListener('pointermove', handleMouseMove);
    document.addEventListener('pointerup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', terminate);

    return () => {
      handleMouseMove.cancel();
      document.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('pointerup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', terminate);
    };
  }, [state.position, state.pressed, persistentOnDrag]);

  return [combinedRef, state.pressed, state.position];
};

/**
 * Subscribes to an element's resize events.
 * @param onResize Callback function called when the element resizes
 * @returns A ref callback to attach to the element
 */
const useResize = (onResize: (size: Position) => void) => {
  const persistentOnResize = usePersistentCallback(onResize);
  const obs = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    obs.current = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          const { inlineSize: x, blockSize: y } = contentBoxSize;
          persistentOnResize({ x, y });
        } else {
          const { width: x, height: y } = entry.contentRect;
          persistentOnResize({ x, y });
        }
      }
    });
  }, [persistentOnResize]);

  return useRefEffect<HTMLElement>(elem => {
    if (elem && obs.current) {
      obs.current.observe(elem);
      return () => {
        obs.current?.unobserve(elem);
      };
    }
  });
};

export {
  useResize,
  useDraggable,
  useCombinedRef,
  useDomEvent,
  usePersistentCallback,
};
