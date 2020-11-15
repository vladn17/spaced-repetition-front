import * as React from 'react';
import CurrentCard from '../../components/CurrentCard';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { GET_CARDS } from '../../api';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { GetCardsQuery, GetCardsQueryVariables } from '../../types/graphql';
import styles from './Repetition.module.css';
import InfoMessage from '../../components/InfoMessage';
import { useNotifications } from '../../context/notifications';
import { scheduleNotification } from './scheduleNotification';

const NoDueCards = ({ deckId }: { deckId: string }) => (
  <InfoMessage>
    No due cards in deck.<Link to={`/decks/${deckId}`}>Add new cards</Link>
  </InfoMessage>
);

export default function Repetition() {
  const { id: deckId } = useParams<{ id: string }>();
  const { isEnabled } = useNotifications();
  const { loading, error, data } = useQuery<
    GetCardsQuery,
    GetCardsQueryVariables
  >(GET_CARDS, { variables: { input: { deckId } } });

  React.useEffect(() => {
    if (isEnabled && data && data.getCards.length > 0) {
      scheduleNotification(data.getCards, deckId);
    }
  }, [data, deckId, isEnabled]);

  if (loading) {
    return <Spinner fullscreen />;
  }

  if (error) {
    let errorText: string;
    let errorCode = error?.graphQLErrors[0]?.extensions?.code;
    if (errorCode === 'FORBIDDEN' || errorCode === 'BAD_USER_INPUT') {
      errorText = `Sorry, this page isn't available.`;
    } else {
      errorText = 'Something went wrong. Please try again';
    }
    return <InfoMessage>{errorText}</InfoMessage>;
  }
  if (data && data.getCards.length > 0) {
    const filteredCards = data.getCards.filter(
      (card) => Number(card.date) < Date.now()
    );
    if (filteredCards.length === 0) return <NoDueCards deckId={deckId} />;
    const cardToDisplay = filteredCards[0];
    return (
      <div className={styles.currentCardWrapper}>
        <AnimatePresence>
          <motion.div
            key={cardToDisplay.id}
            style={{ position: 'relative' }}
            initial={{ scale: 0.5, x: -1000, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            exit={{ scale: 0.8, x: 1000, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <CurrentCard key={cardToDisplay.id} card={cardToDisplay} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
  return <NoDueCards deckId={deckId} />;
}
