import * as React from 'react';
import Modal, { ModalTitle, ModalFooter, ModalText } from './Modal';
import Button from '../Button';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import {
  DeleteDeckMutation,
  DeleteDeckMutationVariables,
  GetDecksQuery,
} from '../../types/graphql';
import { GET_DECKS, DELETE_DECK } from '../../api';
import { useToasts } from '../../context/toasts';

type DeleteDeckModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
};

export default function DeleteDeckModal({
  isOpen,
  onClose,
  deckId,
}: DeleteDeckModalProps) {
  const history = useHistory();
  const dispatch = useToasts();
  const [deleteDeck, { loading }] = useMutation<
    DeleteDeckMutation,
    DeleteDeckMutationVariables
  >(DELETE_DECK, {
    update(cache, { data }) {
      const queryCache = cache.readQuery<GetDecksQuery>({ query: GET_DECKS });
      const deletedId = data && data.deleteDeck;
      const newData =
        queryCache &&
        deletedId &&
        queryCache.getDecks.filter((deck) => deck.id !== deletedId);
      cache.writeQuery({ query: GET_DECKS, data: { getDecks: newData } });
    },
  });
  const handleDelete = () => {
    deleteDeck({ variables: { input: { deckId } } })
      .then(() => history.push('/decks'))
      .catch((e: Error) => dispatch({ type: 'SHOW', message: e.message }));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle>Delete deck?</ModalTitle>
      <ModalText>Are you sure? You can&apos;t undo this action.</ModalText>
      <ModalFooter>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDelete} isLoading={loading}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
