import * as React from 'react';
import { useParams } from 'react-router';
import Button from '../../components/Button';
import { ReactComponent as DeleteDeckIcon } from '../../icons/delete_forever.svg';
import { useQuery } from '@apollo/react-hooks';
import { GET_CARDS, GET_DECKS } from '../../api';
import Spinner from '../../components/Spinner';
import {
  GetCardsQuery,
  GetCardsQueryVariables,
  GetDecksQuery,
} from '../../types/graphql';
import ExportDeck from '../../components/ExportDeck';
import CreateCardModal from '../../components/Modals/CreateCardModal';
import DeleteDeckModal from '../../components/Modals/DeleteDeckModal';
import IconButton from '../../components/IconButton';
import InfoMessage from '../../components/InfoMessage';
import CardsList from '../../components/CardsList';
import styles from './ManageDeck.module.css';

function AddCard({ deckId }: { deckId: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add new card</Button>
      <CreateCardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        deckId={deckId}
      />
    </>
  );
}

function DeleteDeck({ deckId }: { deckId: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <IconButton
        title="Delete deck"
        className={styles.deleteDeckButton}
        onClick={() => setIsOpen(true)}
      >
        <DeleteDeckIcon />
      </IconButton>
      <DeleteDeckModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        deckId={deckId}
      />
    </>
  );
}

export default function ManageDeck() {
  const { id: deckId } = useParams<{ id: string }>();
  const {
    loading: loadingGetCards,
    error: getCardsError,
    data: getCardsData,
  } = useQuery<GetCardsQuery, GetCardsQueryVariables>(GET_CARDS, {
    variables: { input: { deckId } },
  });
  const {
    loading: loadingGetDecks,
    error: getDecksError,
    data: getDecksData,
  } = useQuery<GetDecksQuery>(GET_DECKS);

  if (loadingGetCards || loadingGetDecks) return <Spinner fullscreen />;

  if (getCardsError || getDecksError) {
    let errorText: string;
    let errorCode = getCardsError?.graphQLErrors[0]?.extensions?.code;
    if (errorCode === 'FORBIDDEN' || errorCode === 'BAD_USER_INPUT') {
      errorText = `Sorry, this page isn't available.`;
    } else {
      errorText = 'Something went wrong. Please try again';
    }
    return <InfoMessage>{errorText}</InfoMessage>;
  }

  const deck = getDecksData?.getDecks.find((d) => d.id === deckId);
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.deckData}>
          <h1 className={styles.deckName}>{deck?.name}</h1>
          <span className={styles.cardsTotal}>
            Cards: {getCardsData?.getCards.length}
          </span>
        </div>
        <div className={styles.deckActions}>
          <ExportDeck
            deckName={deck?.name ?? ''}
            cards={getCardsData?.getCards ?? []}
          />
          <DeleteDeck deckId={deckId} />
          <AddCard deckId={deckId} />
        </div>
      </div>
      <CardsList cards={getCardsData?.getCards || []} />
    </div>
  );
}
