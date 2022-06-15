import { useRef, useState, useEffect, useCallback } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';

// call `f` no more frequently than once a frame
export const throttle = f => {
  let token = null,
    lastArgs = null;
  const invoke = () => {
    f(...lastArgs);
    token = null;
  };
  const result = (...args) => {
    lastArgs = args;
    if (!token) {
      token = requestAnimationFrame(invoke);
    }
  };
  result.cancel = () => token && cancelAnimationFrame(token);
  return result;
};

export const useRefEffect = handler => {
  const storedValue = useRef();
  const unsubscribe = useRef();
  const result = useCallback(
    value => {
      storedValue.current = value;
      if (unsubscribe.current) {
        unsubscribe.current();
        unsubscribe.current = undefined;
      }
      if (value) {
        unsubscribe.current = handler(value);
      }
    },
    [handler],
  );
  useEffect(() => {
    result(storedValue.current);
  }, [result]);
  return result;
};

// combine several `ref`s into one
// list of refs is supposed to be immutable after first render
const useCombinedRef = (...refs) => {
  const initialRefs = useRef(refs);
  return useCallback(value => {
    initialRefs.current.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else {
        ref.current = value;
      }
    });
  }, []);
};

// create a ref to subscribe to given element's event
const useDomEvent = (name, handler) => {
  return useCallback(
    elem => {
      elem.addEventListener(name, handler);
      return () => {
        elem.removeEventListener(name, handler);
      };
    },
    [name, handler],
  );
};

// callback with persistent reference,
// but updated on every render
const usePersistentCallback = f => {
  const realF = useRef(f);
  useEffect(() => {
    realF.current = f;
  }, [f]);
  return useCallback((...args) => {
    return realF.current(...args);
  }, []);
};

// persistent reference to identity function
const id = x => x;

// make element draggable
// returns [ref, isDragging, position]
// position doesn't update while dragging
// position is relative to initial position
const useDraggable = ({ onDrag = id, x = 0, y = 0 } = {}) => {
  const [pressed, setPressed] = useState(false);
  const [position, setPosition] = useState({ x: x, y: y });
  const ref = useRef();
  const handleMouseDown = useCallback(e => {
    if (e.button !== 0) {
      return;
    }
    setPressed(true);
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const elem = ref.current;
    elem.style.userSelect = 'none';
    return () => {
      elem.style.userSelect = 'auto';
    };
  }, []);
  const subscribeMouseDown = useDomEvent('pointerdown', handleMouseDown);
  const ref2 = useRefEffect(subscribeMouseDown);
  const combinedRef = useCombinedRef(ref, ref2);
  const persistentOnDrag = usePersistentCallback(onDrag);
  useEffect(() => {
    if (!pressed) {
      return;
    }
    let delta = position,
      lastPosition = position;
    const applyTransform = () => {
      if (!ref.current) {
        return;
      }
      const { x, y } = lastPosition;
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    const handleMouseMove = throttle(({ movementX, movementY }) => {
      const { x, y } = delta;
      delta = { x: x + movementX, y: y + movementY };
      lastPosition = persistentOnDrag(delta);
      applyTransform();
    });
    const handleMouseUp = e => {
      handleMouseMove(e);
      batch(() => {
        setPressed(false);
        setPosition(lastPosition);
      });
    };
    const terminate = () => {
      lastPosition = position;
      applyTransform();
      setPressed(false);
    };
    const handleKeyDown = e => {
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
  }, [position, pressed, persistentOnDrag]);
  return [combinedRef, pressed, position];
};

// subscribe to element's `resize`
const useResize = onResize => {
  const persistentOnResize = usePersistentCallback(onResize);
  const obs = useRef();
  useEffect(() => {
    obs.current = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          const { inlineSize: x, blockSize: y } = Array.isArray(
            entry.contentBoxSize,
          )
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          persistentOnResize({ x, y });
        } else {
          const { width: x, height: y } = entry.contentRect;
          persistentOnResize({ x, y });
        }
      }
    });
  }, [persistentOnResize]);
  return useRefEffect(elem => {
    obs.current && obs.current.observe(elem);
    return () => {
      obs.current && obs.current.unobserve(elem);
    };
  });
};

export { useResize, useDraggable };
