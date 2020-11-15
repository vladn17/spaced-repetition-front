import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CurrentCard from './CurrentCard';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { ToastsProvider } from '../../context/toasts';

const fakeCard = {
  id: '1',
  question: 'first question',
  answer: 'first answer',
  date: '1581790793000',
  repetition: 5,
  interval: '60000',
  factor: 2.5,
  deckId: '123',
};

const wrapper: React.FunctionComponent = ({ children }) => (
  <BrowserRouter>
    <MockedProvider>
      <ToastsProvider>{children}</ToastsProvider>
    </MockedProvider>
  </BrowserRouter>
);

test('displays question', () => {
  render(<CurrentCard card={fakeCard} />, { wrapper });
  expect(screen.getByText('first question')).toBeInTheDocument();
});

test('answer isnt displayed until clicked', () => {
  render(<CurrentCard card={fakeCard} />, { wrapper });
  expect(screen.queryByText('first answer')).not.toBeVisible();
});

test('displays answer and buttons after click', async () => {
  render(<CurrentCard card={fakeCard} />, { wrapper });
  fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
  expect(screen.getByText('first answer')).toBeInTheDocument();
  await screen.findByRole('button', { name: 'Again' });
  expect(screen.getByRole('button', { name: 'Again' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Good' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Easy' })).toBeInTheDocument();
});
