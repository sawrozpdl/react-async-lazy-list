import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import ReactAsyncLazyList from '../.';

function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber: string | number = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, '0');
  return `#${randColor.toUpperCase()}`;
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

interface Node {
  name: string;
  value: number;
  color: string;
}

const KINDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const KIND_COLOR_MAP = KINDS.reduce((acc, kind) => {
  acc[kind] = generateRandomColor();
  return acc;
}, {});

const buildDummyData = () => {
  const data: { [key: number]: Node[] } = {};

  KINDS.forEach(i => {
    data[i] = [];
    for (let j = 0; j < randomNumber(5, 15); j++) {
      data[i].push({
        name: `Item ${i}-${j}`,
        value: randomNumber(60, 100),
        color: KIND_COLOR_MAP[i],
      });
    }
  });

  return data;
};

const data = buildDummyData();

const fetch = (idx: number): Promise<Node[]> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res(data[idx] || []);
    }, 1500);
  });

const App = () => {
  return (
    <div
      style={{
        height: '80vh',
        width: '80%',
        margin: 'auto',
        padding: '80px 0px',
      }}
    >
      <ReactAsyncLazyList
        style={{
          border: '2px solid grey',
          padding: '8px 0px',
        }}
        dataLoader={fetch}
        renderFunction={(node: Node) => (
          <div
            style={{
              height: node.value,
              width: '90%',
              backgroundColor: node.color,
              color: 'white',
              border: '1px solid green',
              boxSizing: 'border-box',
              display: 'flex',
              margin: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{node.name}</div>
          </div>
        )}
        dividerComponent={
          <div
            style={{
              height: '2px',
              width: '100%',
              backgroundColor: 'blue',
              boxSizing: 'border-box',
              margin: '8px 0px',
            }}
          />
        }
        loadingComponent={
          <div
            style={{
              height: 100,
              marginTop: '8px',
              width: '90%',
              margin: 'auto',
              color: 'white',
              backgroundColor: 'darkolivegreen',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              justifyContent: 'center',
            }}
          >
            ......Loading......
          </div>
        }
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
