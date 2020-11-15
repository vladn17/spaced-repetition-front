import xlsx from 'xlsx';
import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ExportDeck from './ExportDeck';
import { ToastsProvider } from '../../context/toasts';

const fakeCard = {
  id: '123',
  question: 'test question',
  answer: 'test answer',
  date: '1581790793000',
  repetition: 5,
  interval: '60000',
  factor: 2.5,
  deckId: '123',
};

test('exports deck', async () => {
  xlsx.writeFile = jest.fn();
  render(
    <ToastsProvider>
      <ExportDeck deckName="English" cards={[fakeCard]} />
    </ToastsProvider>
  );
  expect(screen.getByTitle('Export deck')).toBeInTheDocument();
  fireEvent.click(screen.getByTitle('Export deck'));
  await waitForElementToBeRemoved(() => screen.getByLabelText('Loading'));
  expect(xlsx.writeFile).toHaveBeenCalled();
});
