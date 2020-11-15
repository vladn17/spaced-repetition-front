import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Modal from './Modal';

test('modal shows the children and closes with espace key', async () => {
  const handleClose = jest.fn();
  render(
    <Modal isOpen={true} onClose={handleClose}>
      <div>Text inside modal</div>
    </Modal>
  );
  expect(screen.getByText('Text inside modal')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByText('Text inside modal'), {
    key: 'Escape',
    code: 'Escape',
  });
  expect(handleClose).toHaveBeenCalled();
});
