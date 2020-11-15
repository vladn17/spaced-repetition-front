import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleButton from './ToggleButton';

test('renders without crash', () => {
  const handleChange = jest.fn();
  render(
    <ToggleButton
      ariaLabel="Switch theme"
      checked={false}
      handleChange={handleChange}
    />
  );
  expect(screen.getByLabelText('Switch theme')).toBeInTheDocument();
});

test('switch triggers', () => {
  const handleChange = jest.fn();
  render(
    <ToggleButton
      ariaLabel="Switch theme"
      checked={false}
      handleChange={handleChange}
    />
  );
  fireEvent.click(screen.getByLabelText('Switch theme'));
  expect(handleChange).toHaveBeenCalled();
});
