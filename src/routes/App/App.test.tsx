import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { GET_DECKS } from '../../api';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider, AuthContext } from '../../context/auth';

const fakeDecks = [
  { id: '1', name: 'first' },
  { id: '2', name: 'second' },
  { id: '3', name: 'third' },
];

const mocks = [
  {
    request: {
      query: GET_DECKS,
    },
    result: {
      data: {
        getDecks: fakeDecks,
      },
    },
  },
];

test('renders unAuth app', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MockedProvider>
    </BrowserRouter>
  );
  const loginButton = await screen.findByRole('button', { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});

test('renders auth app if token is provided', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider
          value={{ isAuth: true, logout: () => {}, login: () => {} }}
        >
          <App />
        </AuthContext.Provider>
      </MockedProvider>
    </BrowserRouter>
  );
  const logo = await screen.findByText('REPEAT');
  expect(logo).toBeInTheDocument();
});
