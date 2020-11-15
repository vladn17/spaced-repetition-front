import * as React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import Repetition from './Repetition';
import { GET_CARDS, SCHEDULE_CARD } from '../../api';
import { MemoryRouter, Route } from 'react-router-dom';
import { Card } from '../../types/graphql';
import cache from '../../cache';
import createTestError from '../../createTestError';
import { ToastsProvider } from '../../context/toasts';
import { NotificationsProvider } from '../../context/notifications';

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

const newData = {
  id: '1',
  date: String(1581807823691 + 141600),
  repetition: 6,
  interval: '141600',
  factor: 2.36,
};

const mocks: MockedResponse[] = [
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
      query: SCHEDULE_CARD,
      variables: { intervalData: newData },
    },
    result: {
      data: {
        scheduleCard: { __typename: 'ScheduleCardPayload', ...newData },
      },
    },
  },
  {
    request: {
      query: GET_CARDS,
      variables: { input: { deckId: '8907' } },
    },
    result: {
      data: {
        getCards: [],
      },
    },
  },
  {
    request: {
      query: GET_CARDS,
      variables: { input: { deckId: '9999' } },
    },
    result: {
      errors: [createTestError('No permission to access', 'FORBIDDEN')],
    },
  },
  {
    request: {
      query: GET_CARDS,
      variables: { input: { deckId: '1099' } },
    },
    result: {
      errors: [createTestError('Something went wrong')],
    },
  },
];

test('displays card with earliest date', async () => {
  render(
    <MemoryRouter initialEntries={['/repetition/123']}>
      <MockedProvider mocks={mocks} cache={cache}>
        <NotificationsProvider>
          <ToastsProvider>
            <Route path="/repetition/:id" component={Repetition} />
          </ToastsProvider>
        </NotificationsProvider>
      </MockedProvider>
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();

  await waitFor(() => screen.getByText('first question'));
  expect(screen.getByText('first question')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
  expect(screen.getByText('first answer')).toBeInTheDocument();
});

test('displays next card', async () => {
  Date.now = jest.fn().mockReturnValue(1581807823691);
  render(
    <MemoryRouter initialEntries={['/repetition/123']}>
      <MockedProvider mocks={mocks} cache={cache}>
        <NotificationsProvider>
          <ToastsProvider>
            <Route path="/repetition/:id" component={Repetition} />
          </ToastsProvider>
        </NotificationsProvider>
      </MockedProvider>
    </MemoryRouter>
  );

  await waitFor(() => screen.getByText('first question'));
  fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
  await waitFor(() => screen.getByRole('button', { name: 'Good' }));
  fireEvent.click(screen.getByRole('button', { name: 'Good' }));
  await waitFor(() =>
    expect(screen.getByText('second question')).toBeInTheDocument()
  );
});

test('informs if deck is empty', async () => {
  render(
    <MemoryRouter initialEntries={['/repetition/8907']}>
      <MockedProvider mocks={mocks} cache={cache}>
        <NotificationsProvider>
          <ToastsProvider>
            <Route path="/repetition/:id" component={Repetition} />
          </ToastsProvider>
        </NotificationsProvider>
      </MockedProvider>
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  const informBlock = await screen.findByText(/No due cards in deck/i);
  expect(informBlock).toBeInTheDocument();
});

test('shows forbidden error', async () => {
  render(
    <MemoryRouter initialEntries={['/repetition/9999']}>
      <MockedProvider mocks={mocks} cache={cache}>
        <NotificationsProvider>
          <ToastsProvider>
            <Route path="/repetition/:id" component={Repetition} />
          </ToastsProvider>
        </NotificationsProvider>
      </MockedProvider>
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  const errorText = await screen.findByText(
    /Sorry, this page isn't available/i
  );
  expect(errorText).toBeInTheDocument();
});

test('shows server error', async () => {
  render(
    <MemoryRouter initialEntries={['/repetition/1099']}>
      <MockedProvider mocks={mocks} cache={cache}>
        <NotificationsProvider>
          <ToastsProvider>
            <Route path="/repetition/:id" component={Repetition} />
          </ToastsProvider>
        </NotificationsProvider>
      </MockedProvider>
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  const errorText = await screen.findByText(/Something went wrong/i);
  expect(errorText).toBeInTheDocument();
});
