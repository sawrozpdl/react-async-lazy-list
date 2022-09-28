import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import ReactAsyncLazyList from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    render(<ReactAsyncLazyList />);
    const divElement = screen.getByText(/Work in progress/i);
    expect(divElement).toBeInTheDocument();
  });
});
