import * as React from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';

export const NodeItem = ({ node }) => (
  <div
    style={{
      height: node.value,
      width: '90%',
      backgroundColor: node.background,
      fontSize: Math.ceil(node.value / 4),
      fontWeight: 'bold',
      color: node.color,
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

export const Divider = () => (
  <div
    style={{
      height: '2px',
      width: '100%',
      backgroundColor: 'lightgrey',
      boxSizing: 'border-box',
      margin: '8px 0px',
    }}
  />
);

export const Footer = ({ label }) => (
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

export const Loader = () => (
  <MagnifyingGlass
    visible={true}
    height="80"
    width="100%"
    ariaLabel="MagnifyingGlass-loading"
    wrapperStyle={{}}
    glassColor="#c0efff"
    color="#e15b64"
  />
);
