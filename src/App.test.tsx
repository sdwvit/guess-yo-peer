import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders a game name', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/A Guessing game/i);
  expect(linkElement).toBeInTheDocument();
});
