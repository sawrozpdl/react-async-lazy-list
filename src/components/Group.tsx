import React from 'react';
import { GroupProps } from '../types';
import { genericMemo } from '../utils';

function Group<T>(props: GroupProps<T>) {
  const {
    group,
    data,
    setElement,
    classes,
    style,
    renderFunction,
    dividerComponent,
  } = props;
  return (
    <div
      ref={com => {
        setElement(group, com);
      }}
      style={style}
      className={classes?.groupContainer}
    >
      {data.map((item, index) => (
        <div key={(group + 1) * index} className={classes?.nodeContainer}>
          {renderFunction(item, group, index)}
          {dividerComponent}
        </div>
      ))}
    </div>
  );
}

export default genericMemo(Group);
