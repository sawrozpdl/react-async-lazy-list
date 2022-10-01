import React, {
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';

import {
  useThrottle,
  useElementSize,
  useElementSizes,
  useConditionalMemo,
} from '../hooks';
import Group from './Group';
import { areItemsEqual, hasData } from '../utils';
import { BUFFER_OFFSET, SCROLL_THROTTLE } from '../constants';
import { AsyncLazyListProps, DataMap, HeightMap, ScrollEvent } from '../types';

const checkpointComponent = <div style={{ height: 1, opacity: 0 }}></div>;

function ReactAsyncLazyList<T>(props: AsyncLazyListProps<T>) {
  const {
    style,
    classes,
    options = {},
    dataLoader,
    renderFunction,
    loadingComponent,
    footerComponent,
    dividerComponent,
  } = props;

  const bufferOffset = options.bufferOffset || BUFFER_OFFSET;
  const scrollThrottle = options.scrollThrottle || SCROLL_THROTTLE;

  const [{ height: containerHeight }, setContainer] = useElementSize();

  const [scrollPosition, setScrollPosition] = useState(0);

  const [onScroll] = useThrottle(function(e: ScrollEvent) {
    setScrollPosition(e.currentTarget.scrollTop);
  }, scrollThrottle);

  const [dataMap, setDataMap] = useState<DataMap<T>>({});

  const [sizeMap, setElement] = useElementSizes<HTMLDivElement>();

  const [visibleNodes, setVisibleNodes] = useState([0]);

  const [loading, setLoading] = useState<number | null>(null);

  const lastNode = useRef(0);

  const parsedHeights = useMemo(() => {
    const heightMap: HeightMap = {};

    let lastHeight = 0;
    for (let i = 0; i <= lastNode.current; i++) {
      if (!sizeMap[i]) continue;
      const { height } = sizeMap[i];
      heightMap[i] = lastHeight + height;

      lastHeight = heightMap[i];
    }

    return heightMap;
  }, [sizeMap]);

  const buildPositionalStyle = useCallback(
    (index: number): React.CSSProperties => {
      const height = parsedHeights[index - 1] || 0;

      return {
        position: 'absolute',
        top: height,
        width: '100%',
      };
    },
    [parsedHeights]
  );

  const loadData = (indices: number[]) => {
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      if (dataMap[index]) {
        continue; // Already loaded!
      }

      setLoading(index);
      dataLoader(index).then(list => {
        setDataMap({
          ...dataMap,
          [index]: list || [],
        });
        setLoading(val => (val === index ? null : val));
      });

      break; // Only load one group at a time
    }
  };

  // Load required data for visible nodes.
  useLayoutEffect(() => {
    loadData(visibleNodes);
  }, [visibleNodes]);

  const readyNextNode = async () => {
    lastNode.current += 1;
    setVisibleNodes(prev => [...prev, lastNode.current]);
  };

  const updateVisibleNodes = () => {
    const newVisibleNodes = Object.keys(parsedHeights).reduce<number[]>(
      (acc, idx) => {
        const currIdx = parseInt(idx);
        const startHeight = parsedHeights[currIdx - 1] || 0;
        const endHeight = parsedHeights[currIdx];

        const windowStart = scrollPosition - bufferOffset;
        const windowEnd = scrollPosition + containerHeight + bufferOffset;

        if (
          (startHeight >= windowStart && startHeight <= windowEnd) ||
          (endHeight >= windowStart && endHeight <= windowEnd) ||
          (startHeight <= windowStart && endHeight >= windowEnd)
        ) {
          acc.push(currIdx);
        }

        return acc;
      },
      []
    );

    if (!areItemsEqual(visibleNodes, newVisibleNodes)) {
      setVisibleNodes(newVisibleNodes);
    }
  };

  // Compute which nodes should be visible.
  useLayoutEffect(() => {
    if (
      loading ||
      !Boolean(containerHeight) ||
      !Object.keys(parsedHeights).length
    )
      return;

    if (
      parsedHeights[lastNode.current] - scrollPosition <=
        containerHeight + bufferOffset &&
      dataMap[lastNode.current].length !== 0
    ) {
      readyNextNode();
    } else {
      updateVisibleNodes();
    }
  }, [containerHeight, parsedHeights, scrollPosition]);

  const visibleData = useConditionalMemo(
    () => {
      return visibleNodes.map(
        node =>
          dataMap[node] && (
            <Group<T>
              key={node}
              group={node}
              setElement={setElement}
              data={dataMap[node]}
              style={buildPositionalStyle(node)}
              classes={classes}
              renderFunction={renderFunction}
              dividerComponent={dividerComponent}
            />
          )
      );
    },
    [visibleNodes, dataMap],
    () => visibleNodes.every(n => hasData(dataMap[n]))
  );

  // Will act as either of buffer checkpoint/loader or footer region.
  const footerData = useMemo(() => {
    const lastData = dataMap[lastNode.current];

    const isLoading = !Boolean(lastData);
    const isCheckpoint = lastData && lastData.length !== 0;

    return (
      <div
        style={buildPositionalStyle(lastNode.current + (isCheckpoint ? 1 : 0))}
        className={
          classes?.[
            dataMap[lastNode.current] ? 'footerContainer' : 'loadingContainer'
          ]
        }
      >
        {isLoading
          ? loadingComponent
          : isCheckpoint
          ? checkpointComponent
          : footerComponent}
      </div>
    );
  }, [visibleNodes, dataMap, parsedHeights]);

  return (
    <div
      onScroll={onScroll}
      style={{
        overflowY: 'scroll',
        position: 'relative',
        height: '100%',
        ...style,
      }}
      ref={setContainer}
      className={classes?.root}
    >
      {visibleData}
      {footerData}
    </div>
  );
}

export default ReactAsyncLazyList;
