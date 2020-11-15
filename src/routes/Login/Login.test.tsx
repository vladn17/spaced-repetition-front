import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { LOGIN } from '../../api';
import Login from './Login';
import { AuthProvider, AuthContext } from '../../context/auth';
import createTestError from '../../createTestError';

const mocks: MockedResponse[] = [
  {
    request: {
      query: LOGIN,
      variables: { email: 'qwe@qwe.com', password: 'qweqwe' },
    },
    result: {
      data: {
        login: 'token',
      },
    },
  },
  {
    request: {
      query: LOGIN,
      variables: { email: 'wrong@qwe.com', password: 'qweqwe' },
    },
    result: {
      errors: [
        createTestError('Incorrect email or password', 'BAD_USER_INPUT'),
      ],
    },
  },
];

test('renders form', () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MockedProvider>
    </BrowserRouter>
  );
  expect(screen.getByText('LOG IN')).toBeInTheDocument();
});

test('successfully logs in', async () => {
  const login = jest.fn();
  const logout = jest.fn();
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ isAuth: false, logout, login }}>
          <Login />
        </AuthContext.Provider>
      </MockedProvider>
    </BrowserRouter>
  );
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  fireEvent.change(emailInput, { target: { value: 'qwe@qwe.com' } });
  fireEvent.change(passwordInput, { target: { value: 'qweqwe' } });

  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  const loading = await screen.findByLabelText('Loading');
  await waitForElementToBeRemoved(loading);
  expect(login).toHaveBeenCalled();
});

test('shows error response', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MockedProvider>
    </BrowserRouter>
  );
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  fireEvent.change(emailInput, { target: { value: 'wrong@qwe.com' } });
  fireEvent.change(passwordInput, { target: { value: 'qweqwe' } });

  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await screen.findByText('Incorrect email or password. Please try again');
  expect(
    screen.getByText('Incorrect email or password. Please try again')
  ).toBeInTheDocument();
});
