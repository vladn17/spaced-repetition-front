import * as React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { SIGNUP } from '../../api';
import { AuthProvider } from '../../context/auth';
import { createMemoryHistory } from 'history';
import SignUp from './SignUp';
import createTestError from '../../createTestError';

const mocks: MockedResponse[] = [
  {
    request: {
      query: SIGNUP,
      variables: { email: 'qwe@qwe.com', password: 'qweqwe' },
    },
    result: {
      data: {
        signUp: 'success',
      },
    },
  },
  {
    request: {
      query: SIGNUP,
      variables: { email: 'wrong@qwe.com', password: 'qweqwe' },
    },
    result: {
      errors: [createTestError('Email already exists', 'BAD_USER_INPUT')],
    },
  },
];

test('renders form', () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <SignUp />
        </AuthProvider>
      </MockedProvider>
    </BrowserRouter>
  );
  expect(screen.getByText('SIGN UP')).toBeInTheDocument();
});

test('successfully signs up in', async () => {
  const history = createMemoryHistory();
  history.push('/signup');
  render(
    <Router history={history}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <SignUp />
        </AuthProvider>
      </MockedProvider>
    </Router>
  );
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  fireEvent.change(emailInput, { target: { value: 'qwe@qwe.com' } });
  fireEvent.change(passwordInput, { target: { value: 'qweqwe' } });

  fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  const loading = await screen.findByLabelText('Loading');
  await waitForElementToBeRemoved(loading);
  expect(history.location.pathname).toEqual('/');
});

test('shows error response', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <SignUp />
        </AuthProvider>
      </MockedProvider>
    </BrowserRouter>
  );
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  fireEvent.change(emailInput, { target: { value: 'wrong@qwe.com' } });
  fireEvent.change(passwordInput, { target: { value: 'qweqwe' } });

  fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  await screen.findByText('Email already exists');
  expect(screen.getByText('Email already exists')).toBeInTheDocument();
});
