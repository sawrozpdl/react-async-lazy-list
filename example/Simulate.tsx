import 'react-app-polyfill/ie11';
import * as React from 'react';

import ReactAsyncLazyList from 'react-async-lazy-list';
import { Divider, Footer, Loader, NodeItem } from './components';
import { generateRandomColor, invertColor, randomNumber } from './utils';

interface Node {
  name: string;
  value: number;
  background: string;
  color: string;
}

const getColorMap = (kinds: number[]) =>
  kinds.reduce((acc, kind) => {
    const color = generateRandomColor();
    acc[kind] = {
      background: color,
      color: invertColor(color, true),
    };
    return acc;
  }, {});

const buildDummyData = (
  kinds: number[],
  colorMap: { [key: number]: { background: string; color: string } },
  cVar: number[],
  hVar: number[]
) => {
  const data: { [key: number]: Node[] } = {};
  kinds.forEach(i => {
    data[i] = [];
    for (let j = 0; j < randomNumber(cVar[0], cVar[1]); j++) {
      data[i].push({
        name: `Group: ${i + 1} | Item: ${j + 1}`,
        value: randomNumber(hVar[0], hVar[1]),
        color: colorMap[i].color,
        background: colorMap[i].background,
      });
    }
  });

  return data;
};

const fetch = (idx: number, dataSrc): Promise<Node[]> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res(dataSrc[idx] || []);
    }, 1500);
  });

const formToData = formState => {
  const kinds = Array.from({ length: formState.groupCount }, (_, i) => i);
  const colorMap = getColorMap(kinds);
  const data = buildDummyData(
    kinds,
    colorMap,
    formState.groupItemVariance,
    formState.heightVariance
  );
  return data;
};

const Simulate = () => {
  const [iter, setIter] = React.useState(0);
  const [formState, setFormState] = React.useState({
    groupCount: 6,
    groupItemVariance: [4, 15],
    heightVariance: [60, 150],
  });

  const [dataScr, setDataSrc] = React.useState(formToData(formState));

  const handleFormChange = e => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const idx = parseInt(child, 10);
      setFormState({
        ...formState,
        [parent]: formState[parent].map((v, i) => (i === idx ? +value : v)),
      });
    } else
      setFormState({
        ...formState,
        [name]: +value,
      });
  };

  const contStyle = {
    height: '80vh',
    width: '50%',
    margin: 'auto',
    border: '2px solid grey',
    padding: '16px 0px',
  };

  const labelStyle = {
    display: 'block',
    width: '100%',
    fontSize: '20px',
    marginBottom: '22px',
  };

  const inputStyle = {
    width: '80px',
    'text-align': 'center',
    fontSize: '18px',
    marginLeft: '8px',
  };

  const buttonStyle = {
    display: 'block',
    width: '100px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          ...contStyle,
          maxWidth: '30%',
          padding: '16px',
        }}
      >
        <label style={labelStyle}>
          <span>Group count: </span>
          <input
            name="groupCount"
            onChange={handleFormChange}
            style={inputStyle}
            type={'number'}
            value={formState.groupCount}
          />
        </label>
        <label style={labelStyle}>
          <span>Group item count variance: </span>

          <div style={{ display: 'inline-block' }}>
            <input
              name="groupItemVariance.0"
              style={inputStyle}
              onChange={handleFormChange}
              type={'number'}
              min={1}
              value={formState.groupItemVariance[0]}
            />
            <span>{' to '}</span>
            <input
              name="groupItemVariance.1"
              type={'number'}
              min={1}
              style={inputStyle}
              onChange={handleFormChange}
              value={formState.groupItemVariance[1]}
            />
          </div>
        </label>
        <label style={labelStyle}>
          <span>Height variance: </span>
          <div style={{ display: 'inline-block' }}>
            <input
              name="heightVariance.0"
              type={'number'}
              style={inputStyle}
              min={1}
              onChange={handleFormChange}
              value={formState.heightVariance[0]}
            />
            <span>{' to '}</span>
            <input
              name="heightVariance.1"
              onChange={handleFormChange}
              style={inputStyle}
              type={'number'}
              min={1}
              value={formState.heightVariance[1]}
            />
          </div>
        </label>
        <button
          style={buttonStyle}
          onClick={() => {
            setDataSrc(formToData(formState));
            setIter(iter + 1);
          }}
        >
          Simulate
        </button>
      </div>
      <div style={contStyle}>
        <ReactAsyncLazyList
          key={iter}
          dataLoader={idx => fetch(idx, dataScr)}
          renderFunction={(node: Node) => <NodeItem node={node} />}
          dividerComponent={<Divider />}
          loadingComponent={<Loader />}
          footerComponent={<Footer label="No more records!" />}
        />
      </div>
    </div>
  );
};

export default Simulate;
