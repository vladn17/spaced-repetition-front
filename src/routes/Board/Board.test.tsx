import * as React from 'react';
import {
  render,
  waitFor,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Board from './Board';
import { MockedProvider } from '@apollo/react-testing';
import { GET_DECKS, CREATE_DECK } from '../../api';
import { BrowserRouter } from 'react-router-dom';
import createTestError from '../../createTestError';

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
  {
    request: {
      query: CREATE_DECK,
      variables: { input: { name: 'New deck' } },
    },
    result: {
      data: {
        createDeck: { id: '4', name: 'New deck' },
      },
    },
  },
];

const mocksWithError = [
  {
    request: {
      query: GET_DECKS,
    },
    result: {
      errors: [createTestError('Something went wrong')],
    },
  },
];

test('displays decks', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Board />
      </MockedProvider>
    </BrowserRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();

  await waitFor(() => screen.getByText('first'));

  expect(screen.getByText('first')).toBeInTheDocument();
  expect(screen.getByText('second')).toBeInTheDocument();
  expect(screen.getByText('third')).toBeInTheDocument();
});

test('shows error', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocksWithError} addTypename={false}>
        <Board />
      </MockedProvider>
    </BrowserRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  const errorText = await screen.findByText(/Something went wrong/i);
  expect(errorText).toBeInTheDocument();
});

test('creates new deck', async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Board />
      </MockedProvider>
    </BrowserRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  await waitFor(() => screen.getByText('first'));
  fireEvent.click(screen.getByTitle('Create new deck'));
  const name = screen.getByPlaceholderText('Deck name');
  fireEvent.change(name, { target: { value: 'New deck' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitForElementToBeRemoved(name);
  expect(screen.getByText('New deck')).toBeInTheDocument();
});
