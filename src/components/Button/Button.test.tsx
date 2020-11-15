import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders without crash', () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole('button', { name: /click/i })).toBeInTheDocument();
});

test('button click triggers', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click</Button>);
  fireEvent.click(screen.getByRole('button', { name: /click/i }));
  expect(onClick).toHaveBeenCalled();
});

test('button is disabled in loading state', () => {
  render(<Button isLoading={true}>Click</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});

test('button shows spinner in loading state', () => {
  render(<Button isLoading={true}>Click</Button>);
  expect(screen.queryByText('Click')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
});
