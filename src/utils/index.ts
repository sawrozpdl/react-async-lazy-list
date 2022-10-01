import React from 'react';

export const genericMemo: <T>(component: T) => T = React.memo;

export function hasData<T>(data: Array<T>) {
  return data && data.length > 0;
}

export function areItemsEqual<T>(
  arr1: T[],
  arr2: T[],
  comparator: (p1: T, p2: T) => boolean = (a, b) => a === b
) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (!comparator(arr1[i], arr2[i])) return false;
  }

  return true;
}
