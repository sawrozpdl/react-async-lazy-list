import React, {
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';

import Group from './Group';
import { areItemsEqual, hasData, log } from '../utils';
import { BUFFER_OFFSET, SCROLL_THROTTLE } from '../constants';
import { AsyncLazyListProps, DataMap, HeightMap } from '../types';
import { useThrottle, useElementSize, useElementSizes } from '../hooks';

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

  const [loading, setLoading] = useState(false);
  const [{ height: containerHeight }, setContainer] = useElementSize();

  const [scrollPosition, setScrollPosition] = useState(0);

  const onScroll = useThrottle(function(e: any) {
    setScrollPosition(e.target.scrollTop);
  }, scrollThrottle);

  const [dataMap, setDataMap] = useState<DataMap<T>>({});

  const [sizeMap, setElement] = useElementSizes<HTMLDivElement>();

  const [visibleNodes, setVisibleNodes] = useState([0]);

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

    log('Updated height map for: ', Object.keys(heightMap));
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
    if (loading) return;

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      if (dataMap[index]) {
        continue; // Already loaded!
      }

      log('Load data for:', index);
      setLoading(true);
      dataLoader(index).then(list => {
        log('Got data for:', index);
        setDataMap({
          ...dataMap,
          [index]: list || [],
        });
        setLoading(false);
      });

      break; // Only load one group at a time
    }
  };

  // Load required data for visible nodes.
  useLayoutEffect(() => {
    loadData(visibleNodes);
    log('Visible nodes:', visibleNodes);
  }, [visibleNodes]);

  const readyNextNode = async () => {
    lastNode.current += 1;
    setVisibleNodes(prev => [...prev, lastNode.current]);
  };

  const updateVisibleNodes = () => {
    const newVisibleNodes = [];

    let touchedVisibleRange = false;
    
    const windowStart = scrollPosition - bufferOffset;
    const windowEnd = scrollPosition + containerHeight + bufferOffset;

    for (let currIdx = 0; currIdx <= lastNode.current; currIdx++) {
      if (currIdx === lastNode.current) {
        if (loading) {
          // Load the last node if it reaches here and hasn't loaded
          newVisibleNodes.push(currIdx);
          break;
        } else if (!hasData(dataMap[currIdx])) {
          break;
        }
      }

      const startHeight = parsedHeights[currIdx - 1] || 0;
      const endHeight = parsedHeights[currIdx];

      if (
        (startHeight >= windowStart && startHeight <= windowEnd) ||
        (endHeight >= windowStart && endHeight <= windowEnd) ||
        (startHeight <= windowStart && endHeight >= windowEnd)
      ) {
        touchedVisibleRange = true;
        newVisibleNodes.push(currIdx);
      } else if (touchedVisibleRange) {
        break;
      }
    }

    if (!areItemsEqual(visibleNodes, newVisibleNodes)) {
      setVisibleNodes(newVisibleNodes);
    }
  };

  // Compute which nodes should be visible.
  useLayoutEffect(() => {
    if (!Boolean(containerHeight) || !Object.keys(parsedHeights).length) return;

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

  const visibleData = useMemo(() => {
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
  }, [visibleNodes, dataMap]);

  // Will act as either of buffer checkpoint/loader or footer region.
  const footerData = useMemo(() => {
    const lastData = dataMap[lastNode.current];

    const isLoading = !Boolean(lastData);
    const isCheckpoint = lastData && lastData.length !== 0;

    return (
      <div
        style={buildPositionalStyle(
          lastNode.current +
            (isCheckpoint && parsedHeights[lastNode.current] ? 1 : 0)
        )}
        className={
          isCheckpoint
            ? undefined
            : classes?.[isLoading ? 'loadingContainer' : 'footerContainer']
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
