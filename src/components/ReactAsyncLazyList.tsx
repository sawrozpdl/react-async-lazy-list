import React, { useState, useMemo, useLayoutEffect, useRef } from 'react';
import { useElementSize, useElementSizes, useThrottle } from '../hooks';

import { areItemsEqual } from '../utils';
import { AsyncLazyListProps, DataMap, HeightMap, ScrollEvent } from '../types';

const OFFSET = 50;

function ReactAsyncLazyList<T>(props: AsyncLazyListProps<T>) {
  const {
    style,
    dataLoader,
    renderFunction,
    loadingComponent,
    dividerComponent,
  } = props;

  const [{ height: containerHeight }, setContainer] = useElementSize();

  const [scrollPosition, setScrollPosition] = useState(0);

  const [onScroll] = useThrottle(function(e: ScrollEvent) {
    setScrollPosition(e.currentTarget.scrollTop);
  }, 50);

  const [dataMap, setDataMap] = useState<DataMap<T>>({});

  const [sizeMap, setElement] = useElementSizes();

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

  const readyNextNode = async () => {
    lastNode.current += 1;
    console.log('now Fetch ', lastNode.current);
    setVisibleNodes(prev => [...prev, lastNode.current]);
  };

  useLayoutEffect(() => {
    if (loading || !containerHeight || !parsedHeights[lastNode.current]) return;
    if (
      parsedHeights[lastNode.current] - scrollPosition <=
        containerHeight + OFFSET &&
      dataMap[lastNode.current].length !== 0
    ) {
      readyNextNode();
    }
  }, [scrollPosition, parsedHeights]);

  const buildPositionalStyle = (index: number): React.CSSProperties => {
    const height = parsedHeights[index - 1] || 0;

    return {
      position: 'absolute',
      top: height,
      width: '100%',
    };
  };

  const loadVisibleData = (indices: number[]) => {
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      if (dataMap[index]) {
        continue;
      }

      console.log('Fetching data for node: ', index);
      setLoading(index);
      dataLoader(index).then(list => {
        console.log('GOt list for ', index, list);
        setDataMap({
          ...dataMap,
          [index]: list || [],
        });
        setLoading(val => (val === index ? null : val));
      });
    }
  };

  // Load required data for visible nodes.
  useLayoutEffect(() => {
    loadVisibleData(visibleNodes);
  }, [visibleNodes]);

  // Figure out which nodes are visible.
  useLayoutEffect(() => {
    if (
      !Boolean(containerHeight) ||
      !Object.keys(parsedHeights).length ||
      !parsedHeights[lastNode.current]
    )
      return;

    console.log(
      'Parsed height: ',
      parsedHeights,
      scrollPosition,
      containerHeight
    );
    const newVisibleNodes = Object.keys(parsedHeights).reduce<number[]>(
      (acc, idx) => {
        const currIdx = parseInt(idx);
        const startHeight = parsedHeights[currIdx - 1] || 0;
        const endHeight = parsedHeights[currIdx];

        const windowStart = scrollPosition - OFFSET;
        const windowEnd = scrollPosition + containerHeight + OFFSET;

        if (
          (startHeight >= windowStart && startHeight <= windowEnd) ||
          (endHeight >= windowStart && endHeight <= windowEnd) ||
          (startHeight <= windowStart && endHeight >= windowEnd)
        ) {
          acc.push(currIdx);
        }

        return acc;
      },
      parsedHeights[lastNode.current] ? [] : [lastNode.current]
    );

    if (!areItemsEqual(visibleNodes, newVisibleNodes)) {
      console.log('Changed to : ', newVisibleNodes);
      setVisibleNodes(newVisibleNodes);
    }
  }, [containerHeight, parsedHeights, scrollPosition]);

  const visibleData = useMemo(() => {
    console.log('Rendering: ', visibleNodes);
    return visibleNodes.map(node =>
      dataMap[node] ? (
        <div
          id={node.toString()}
          ref={com => {
            setElement(node, com);
          }}
          style={buildPositionalStyle(node)}
          key={'node-' + node}
        >
          {dataMap[node].map((item, index) => (
            <div key={'idx-' + index}>
              {renderFunction(item, index)}
              {dividerComponent}
            </div>
          ))}
        </div>
      ) : (
        <div key={'load-' + node} style={buildPositionalStyle(node)}>
          {loadingComponent}
        </div>
      )
    );
  }, [visibleNodes, dataMap]);

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
      className="container"
    >
      {visibleData}
    </div>
  );
}

export default ReactAsyncLazyList;
