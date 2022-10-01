import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { MagnifyingGlass } from 'react-loader-spinner';

import ReactAsyncLazyList from 'react-async-lazy-list';

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

const KINDS = [0, 1, 2, 3, 4, 5];

const KIND_COLOR_MAP = KINDS.reduce((acc, kind) => {
  acc[kind] = generateRandomColor();
  return acc;
}, {});

const buildDummyData = () => {
  const data: { [key: number]: Node[] } = {};

  KINDS.forEach(i => {
    data[i] = [];
    for (let j = 0; j < randomNumber(4, 15); j++) {
      data[i].push({
        name: `Item ${i}-${j}`,
        value: randomNumber(60, 150),
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

const NodeItem = ({ node }) => (
  <div
    style={{
      height: node.value,
      width: '90%',
      backgroundColor: node.color,
      fontSize: Math.ceil(node.value / 4),
      fontWeight: 'bold',
      color: 'white',
      border: '1px dotted green',
      boxSizing: 'border-box',
      display: 'flex',
      margin: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div>{node.name}</div>
  </div>
);

const Divider = () => (
  <div
    style={{
      height: '2px',
      width: '100%',
      backgroundColor: 'blue',
      boxSizing: 'border-box',
      margin: '8px 0px',
    }}
  />
);

const Footer = ({ label }) => (
  <div
    style={{
      height: '80px',
      width: '50%',
      margin: 'auto',
      justifyContent: 'center',
      display: 'flex',
      backgroundColor: 'lightblue',
      alignItems: 'center',
      color: 'white',
      borderRadius: '6px',
      fontSize: '28px',
      boxSizing: 'border-box',
      marginBottom: '8px',
    }}
  >
    {label}
  </div>
);

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height: '80vh',
          width: '60%',
          margin: 'auto',
          padding: '80px 0px',
        }}
      >
        <ReactAsyncLazyList
          style={{
            border: '2px solid grey',
          }}
          dataLoader={fetch}
          renderFunction={(node: Node) => <NodeItem node={node} />}
          dividerComponent={<Divider />}
          loadingComponent={
            <MagnifyingGlass
              visible={true}
              height="80"
              width="100%"
              ariaLabel="MagnifyingGlass-loading"
              wrapperStyle={{}}
              glassColor="#c0efff"
              color="#e15b64"
            />
          }
          footerComponent={<Footer label="No more records!" />}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
