import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('nmind link', () => {
  render(<App />);
  const linkElement = screen.getByText("NMIND Coding Standards Checklist");
  expect(linkElement).toBeInTheDocument();
});
