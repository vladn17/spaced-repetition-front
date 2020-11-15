import * as React from 'react';
import styles from './Board.module.css';
import { ReactComponent as StartIcon } from '../../icons/play_circle_filled.svg';
import { ReactComponent as CreateIcon } from '../../icons/add_circle_outline.svg';
import { ReactComponent as ListIcon } from '../../icons/list.svg';
import { useQuery } from '@apollo/react-hooks';
import { GET_DECKS } from '../../api';
import Spinner from '../../components/Spinner';
import { GetDecksQuery, Deck } from '../../types/graphql';
import CreateDeckModal from '../../components/Modals/CreateDeckModal';
import IconLink from '../../components/IconLink';
import IconButton from '../../components/IconButton';
import InfoMessage from '../../components/InfoMessage';

type DecksListItemProps = {
  deck: Deck;
};

function CreateDeck() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  return (
    <div className={styles.boardDeck + ' ' + styles.createNew}>
      <h3 className={styles.deckTitle}>Create new deck</h3>
      <div className={styles.deckLinks}>
        <IconButton
          title="Create new deck"
          onClick={() => setModalIsOpen(true)}
        >
          <CreateIcon className={styles.createIcon} />
        </IconButton>
      </div>
      <CreateDeckModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </div>
  );
}

function DecksListItem({ deck }: DecksListItemProps) {
  return (
    <div className={styles.boardDeck}>
      <h3 className={styles.deckTitle}>{deck.name}</h3>
      <div className={styles.deckLinks}>
        <IconLink to={`/repetition/${deck.id}`} title="Start">
          <StartIcon className={styles.startIcon} />
        </IconLink>
        <IconLink to={`/decks/${deck.id}`} title="Manage deck">
          <ListIcon className={styles.listIcon} />
        </IconLink>
      </div>
    </div>
  );
}

export default function Board() {
  const { loading, error, data } = useQuery<GetDecksQuery>(GET_DECKS);
  if (loading) return <Spinner fullscreen />;
  if (error) {
    return <InfoMessage>Something went wrong. Please try again</InfoMessage>;
  }
  const decks = data?.getDecks.map((deck) => (
    <DecksListItem key={deck.id} deck={deck} />
  ));
  return (
    <div className={styles.board}>
      <CreateDeck />
      {decks}
    </div>
  );
}
