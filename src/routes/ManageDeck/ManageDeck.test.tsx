import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import {
  GET_CARDS,
  GET_DECKS,
  DELETE_CARD,
  CREATE_CARD,
  DELETE_DECK,
  EDIT_CARD,
} from '../../api';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { Card } from '../../types/graphql';
import { createMemoryHistory } from 'history';
import ManageDeck from './ManageDeck';
import cache from '../../cache';
import createTestError from '../../createTestError';
import { ToastsProvider } from '../../context/toasts';
import Board from '../Board';

const fakeCards: Card[] = [
  {
    __typename: 'Card',
    id: '1',
    question: 'first question',
    answer: 'first answer',
    date: '1581790793000',
    repetition: 5,
    interval: '60000',
    factor: 2.5,
    deckId: '123',
  },
  {
    __typename: 'Card',
    id: '2',
    question: 'second question',
    answer: 'second answer',
    date: '1581790794000',
    repetition: 4,
    interval: '60000',
    factor: 2.5,
    deckId: '123',
  },
  {
    __typename: 'Card',
    id: '3',
    question: 'third question',
    answer: 'third answer',
    date: '1581790795000',
    repetition: 6,
    interval: '60000',
    factor: 2.5,
    deckId: '123',
  },
];

const mocks: MockedResponse[] = [
  {
    request: {
      query: GET_DECKS,
    },
    result: {
      data: {
        getDecks: [{ __typename: 'Deck', id: '123', name: 'Test deck' }],
      },
    },
  },
  {
    request: {
      query: GET_CARDS,
      variables: { input: { deckId: '123' } },
    },
    result: {
      data: {
        getCards: fakeCards,
      },
    },
  },
  {
    request: {
      query: GET_CARDS,
      variables: { input: { deckId: '888' } },
    },
    result: {
      errors: [createTestError('No permission to access', 'FORBIDDEN')],
    },
  },
  {
    request: {
      query: GET_CARDS,
      variables: { input: { deckId: '999' } },
    },
    result: {
      errors: [createTestError('Something went wrong')],
    },
  },
  {
    request: {
      query: DELETE_CARD,
      variables: { input: { id: '1' } },
    },
    result: {
      data: {
        deleteCard: '1',
      },
    },
  },
  {
    request: {
      query: EDIT_CARD,
      variables: {
        input: {
          id: '1',
          question: 'edited question',
          answer: 'edited answer',
        },
      },
    },
    result: {
      data: {
        editCard: {
          __typename: 'EditCardPayload',
          id: '1',
          question: 'edited question',
          answer: 'edited answer',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_CARD,
      variables: {
        input: {
          question: 'new question',
          answer: 'new answer',
          date: '1581807823691',
          deckId: '123',
        },
      },
    },
    result: {
      data: {
        createCard: {
          __typename: 'Card',
          id: '555',
          question: 'new question',
          answer: 'new answer',
          date: '1581807823691',
          repetition: 5,
          interval: '60000',
          factor: 2.5,
          deckId: '123',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_DECK,
      variables: { input: { deckId: '123' } },
    },
    result: {
      data: {
        deleteDeck: '123',
      },
    },
  },
];

test("shows deck's info and cards", async () => {
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/decks/123']}>
          <Route path="/decks/:id" component={ManageDeck} />
        </MemoryRouter>
      </MockedProvider>
    </ToastsProvider>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByText('Test deck')).toBeInTheDocument()
  );
  expect(screen.getByText('Cards: 3')).toBeInTheDocument();
  expect(screen.getByText('first question')).toBeInTheDocument();
});

test('shows forbidden error', async () => {
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/decks/888']}>
          <Route path="/decks/:id" component={ManageDeck} />
        </MemoryRouter>
      </MockedProvider>
    </ToastsProvider>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  const errorText = await screen.findByText(
    /Sorry, this page isn't available/i
  );
  expect(errorText).toBeInTheDocument();
});

test('shows server error', async () => {
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/decks/999']}>
          <Route path="/decks/:id" component={ManageDeck} />
        </MemoryRouter>
      </MockedProvider>
    </ToastsProvider>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  const errorText = await screen.findByText(/Something went wrong/i);
  expect(errorText).toBeInTheDocument();
});

test('deletes card', async () => {
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/decks/123']}>
          <Route path="/decks/:id" component={ManageDeck} />
        </MemoryRouter>
      </MockedProvider>
    </ToastsProvider>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByText('Test deck')).toBeInTheDocument()
  );
  fireEvent.click(screen.getAllByTitle('Delete card')[0]);
  await waitForElementToBeRemoved(screen.queryByText('first question'));
  expect(screen.queryByText('first question')).not.toBeInTheDocument();
  expect(screen.getByText('Cards: 2')).toBeInTheDocument();
});

test('edits card', async () => {
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks} cache={cache}>
        <MemoryRouter initialEntries={['/decks/123']}>
          <Route path="/decks/:id" component={ManageDeck} />
        </MemoryRouter>
      </MockedProvider>
    </ToastsProvider>
  );
  await waitFor(() =>
    expect(screen.getByText('Test deck')).toBeInTheDocument()
  );

  fireEvent.click(screen.getAllByTitle('Edit card')[0]);
  const question = screen.getByPlaceholderText('Question');
  const answer = screen.getByPlaceholderText('Answer');
  fireEvent.change(question, { target: { value: 'edited question' } });
  fireEvent.change(answer, { target: { value: 'edited answer' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitForElementToBeRemoved(question);
  expect(screen.getByText('edited answer')).toBeInTheDocument();
  expect(screen.queryByText('first answer')).not.toBeInTheDocument();
});

test('creates new card', async () => {
  Date.now = jest.fn().mockReturnValue(1581807823691);
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/decks/123']}>
          <Route path="/decks/:id" component={ManageDeck} />
        </MemoryRouter>
      </MockedProvider>
    </ToastsProvider>
  );
  await waitFor(() =>
    expect(screen.getByText('Test deck')).toBeInTheDocument()
  );
  fireEvent.click(screen.getByRole('button', { name: 'Add new card' }));

  const question = screen.getByPlaceholderText('Question');
  const answer = screen.getByPlaceholderText('Answer');
  fireEvent.change(question, { target: { value: 'new question' } });
  fireEvent.change(answer, { target: { value: 'new answer' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitForElementToBeRemoved(question);
  expect(screen.getByText('Cards: 4')).toBeInTheDocument();
  expect(screen.getByText('new question')).toBeInTheDocument();
  expect(screen.getByText('new answer')).toBeInTheDocument();
});

test('deletes deck', async () => {
  const history = createMemoryHistory();
  history.push('/decks/123');
  render(
    <ToastsProvider>
      <MockedProvider mocks={mocks}>
        <Router history={history}>
          <Route path="/decks" component={Board} />
          <Route path="/decks/:id" component={ManageDeck} />
        </Router>
      </MockedProvider>
    </ToastsProvider>
  );
  await waitFor(() =>
    expect(screen.getByText('Test deck')).toBeInTheDocument()
  );
  fireEvent.click(screen.getByTitle('Delete deck'));
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  await waitForElementToBeRemoved(() => screen.getByText('Delete deck?'));
  expect(history.location.pathname).toEqual('/decks');
});
