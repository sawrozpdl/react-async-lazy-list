import { useCallback, useRef } from 'react';

type Callback<K, T> = (param: K) => T | void;

function useThrottle<K, T>(
  callback: Callback<K, T>,
  timeout = 300
): Callback<K, T> {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const throttledFunction = useCallback(
    (param: K) => {
      if (timerRef.current === null) {
        timerRef.current = setTimeout(() => {
          callback(param);
          timerRef.current = null;
        }, timeout);
      }
    },
    [timeout]
  );

  return throttledFunction;
}

export default useThrottle;
