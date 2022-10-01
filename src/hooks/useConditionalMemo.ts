import { useEffect, useState } from 'react';

function useConditionalMemo<T>(
  factory: () => T,
  deps: any[],
  condition: (...args: any[]) => boolean
) {
  const [ref, setRef] = useState<T | null>(null);

  useEffect(() => {
    if (condition(...deps)) {
      setRef(factory());
    }
  }, deps);

  return ref;
}

export default useConditionalMemo;
