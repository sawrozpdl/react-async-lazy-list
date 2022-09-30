import { useCallback, useRef, useState } from 'react';

import useEventListener from './useEventListener';
import { ContainerMap, ElementRegistrar, Size, SizeMap } from '../types';

function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  Size,
  (node: T | null) => void
] {
  const [element, _setElement] = useState<T | null>(null);

  const elementSize = useRef<Size>({
    width: 0,
    height: 0,
  });

  const handleResize = useCallback(() => {
    elementSize.current = {
      width: element?.offsetWidth || 0,
      height: element?.offsetHeight || 0,
    };
  }, []);

  const setElement = (element: T | null) => {
    _setElement(element);

    elementSize.current = {
      width: element?.offsetWidth || 0,
      height: element?.offsetHeight || 0,
    };
  };

  useEventListener('resize', handleResize);

  return [elementSize.current, setElement];
}

function useElementSizes<T extends HTMLElement = HTMLDivElement>(): [
  SizeMap,
  ElementRegistrar<T>
] {
  const [sizeMap, setSizeMap] = useState<SizeMap>({});

  const containerMap = useRef<ContainerMap<T>>({});

  const setElement = (key: number, container: T | null) => {
    if (container) {
      setSizeMap(prev => ({
        ...prev,
        [key]: {
          width: container.offsetWidth,
          height: container.offsetHeight,
        },
      }));

      containerMap.current[key] = container;
    }
  };

  const handleResize = useCallback(() => {
    setSizeMap(() => {
      const next: SizeMap = {};

      Object.keys(containerMap.current).forEach(key => {
        const container = containerMap.current[+key];

        next[+key] = {
          width: container?.offsetWidth || 0,
          height: container?.offsetHeight || 0,
        };
      });

      return next;
    });
  }, []);

  useEventListener('resize', handleResize);

  return [sizeMap, setElement];
}

export { useElementSizes as default, useElementSize };
