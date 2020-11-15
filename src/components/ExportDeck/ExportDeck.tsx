import * as React from 'react';
import { Card } from '../../types/graphql';
import IconButton from '../IconButton';
import { ReactComponent as ExportIcon } from '../../icons/import_export.svg';
import { useToasts } from '../../context/toasts';

type ExportProps = {
  deckName: string;
  cards: Card[];
};

export default function ExportDeck({ deckName, cards }: ExportProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatchToast = useToasts();
  const exportToXlsx = () => {
    setIsLoading(true);
    import('xlsx')
      .then((xlsx) => {
        if (cards) {
          const dataToExport = cards.map((card) => {
            const { __typename, id, deckId, ...rest } = card;
            return rest;
          });
          const wb = xlsx.utils.book_new();
          const ws = xlsx.utils.json_to_sheet(dataToExport);
          xlsx.utils.book_append_sheet(wb, ws, `${deckName}`);
          xlsx.writeFile(wb, `${deckName}_deck.xlsx`);
          setIsLoading(false);
        }
      })
      .catch(() => {
        dispatchToast({
          type: 'SHOW',
          message: 'Please check you network connection and try again.',
        });
        setIsLoading(false);
      });
  };
  const isDisabled = cards.length < 1;

  return (
    <IconButton
      title="Export deck"
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={exportToXlsx}
    >
      <ExportIcon />
    </IconButton>
  );
}
