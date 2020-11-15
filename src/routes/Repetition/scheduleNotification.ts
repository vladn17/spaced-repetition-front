import { Card } from '../../types/graphql';
import logoImg from '../../icons/logo.png';

const createNotification = async (time: number, deckId: string) => {
  const registration = await navigator.serviceWorker.getRegistration();
  registration?.showNotification('Time to repeat', {
    tag: deckId,
    body: "It's time to repeat due cards",
    icon: logoImg,
    renotify: true,
    showTrigger: new TimestampTrigger(time),
  });
};

const cancelNotifications = async (deckId: string) => {
  const registration = await navigator.serviceWorker.getRegistration();
  const notifications = await registration?.getNotifications({
    tag: deckId,
    includeTriggered: true,
  });
  notifications?.forEach((notification) => notification.close());
};

export async function scheduleNotification(cards: Card[], deckId: string) {
  if ('Notification' in window && 'showTrigger' in Notification.prototype) {
    const sortedCards = cards.sort((a, b) => Number(a.date) - Number(b.date));
    const nextDueCard = sortedCards?.find(
      (card) => Number(card.date) > Date.now()
    );
    if (nextDueCard) {
      await cancelNotifications(deckId);
      await createNotification(Number(nextDueCard.date), deckId);
    }
  }
}
