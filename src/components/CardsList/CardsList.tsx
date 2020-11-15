import * as React from 'react';
import { ReactComponent as DeleteIcon } from '../../icons/delete.svg';
import { ReactComponent as EditIcon } from '../../icons/edit.svg';
import { useMutation } from '@apollo/react-hooks';
import { GET_CARDS, DELETE_CARD } from '../../api';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Card,
  DeleteCardMutation,
  DeleteCardMutationVariables,
  GetCardsQuery,
  GetCardsQueryVariables,
} from '../../types/graphql';
import EditCardModal from '../../components/Modals/EditCardModal';
import IconButton from '../../components/IconButton';
import { useToasts } from '../../context/toasts';
import styles from './CardsList.module.css';

type CardsListItemProps = {
  card: Card;
};

const CardsListItem = ({ card }: CardsListItemProps) => {
  const dispatchToast = useToasts();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [deleteCard, { loading }] = useMutation<
    DeleteCardMutation,
    DeleteCardMutationVariables
  >(DELETE_CARD, {
    update(cache, { data }) {
      const queryCache = cache.readQuery<GetCardsQuery, GetCardsQueryVariables>(
        { query: GET_CARDS, variables: { input: { deckId: card.deckId } } }
      );
      const deletedId = data && data.deleteCard;
      const newData =
        queryCache &&
        deletedId &&
        queryCache.getCards.filter((card) => card.id !== deletedId);
      cache.writeQuery({
        query: GET_CARDS,
        variables: { input: { deckId: card.deckId } },
        data: { getCards: newData },
      });
    },
  });
  const handleDelete = () => {
    deleteCard({
      variables: { input: { id: card.id } },
      optimisticResponse: {
        __typename: 'Mutation',
        deleteCard: card.id,
      },
    }).catch((e) => dispatchToast({ type: 'SHOW', message: e.message }));
  };
  return (
    <div className={styles.card}>
      <div className={styles.question}>
        <span className={styles.text}>{card.question}</span>
      </div>
      <div className={styles.answer}>
        <span className={styles.text}>{card.answer}</span>
      </div>
      <div className={styles.actions}>
        <IconButton title="Edit card" onClick={() => setModalIsOpen(true)}>
          <EditIcon />
        </IconButton>
        <IconButton
          title="Delete card"
          onClick={handleDelete}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <EditCardModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        card={card}
      />
    </div>
  );
};

export default function CardsList({ cards }: { cards: Card[] }) {
  const items = cards.map((card) => (
    <motion.li
      key={card.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CardsListItem card={card} />
    </motion.li>
  ));
  return (
    <ul className={styles.list}>
      <AnimatePresence>{items}</AnimatePresence>
    </ul>
  );
}
