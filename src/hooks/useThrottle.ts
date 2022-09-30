import { useState, useEffect, useCallback, useRef } from 'react';

const noop = () => {};
type Callback<T> = (...args: T[]) => void;

function useThrottle<T>(
  callback: Callback<T>,
  timeout = 300
): [Callback<T>, boolean] {
  const [ready, setReady] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);

  const throttledFunction = useCallback(
    (...args: T[]) => {
      if (!ready) {
        return;
      }

      setReady(false);
      callback(...args);
    },
    [ready, callback]
  );

  useEffect(() => {
    if (!ready) {
      timerRef.current = window.setTimeout(() => {
        setReady(true);
      }, timeout);

      return () => window.clearTimeout(timerRef.current);
    }

    return noop;
  }, [ready, timeout]);

  return [throttledFunction, ready];
}

export default useThrottle;
