import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Toast from './Toast';
import { ToastsContext } from '../../context/toasts';

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('renders without crash and fires dispatch after timeout', () => {
  jest.useFakeTimers();
  const dispatch = jest.fn();
  const toast = {
    key: 1231,
    message: 'Hello',
  };
  render(
    <ToastsContext.Provider value={dispatch}>
      <Toast toast={toast} />
    </ToastsContext.Provider>
  );
  expect(screen.getByText('Hello')).toBeInTheDocument();
  jest.runAllTimers();
  expect(dispatch).toHaveBeenCalled();
});
