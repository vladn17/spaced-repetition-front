import * as React from 'react';

type Context = {
  isEnabled: boolean;
  toggleNotifications: () => void;
};

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }
  return true;
}

function getInitialNotifications() {
  if ('Notification' in window) {
    return (
      Notification.permission === 'granted' &&
      localStorage.getItem('notifications') === 'on'
    );
  }
  return false;
}

const NotificationsContext = React.createContext<Context | undefined>(
  undefined
);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isEnabled, setIsEnabled] = React.useState(() =>
    getInitialNotifications()
  );

  const toggleNotifications = () => {
    if (!('Notification' in window)) {
      return;
    }
    if (isEnabled) {
      localStorage.setItem('notifications', 'off');
      setIsEnabled(false);
    } else if (Notification.permission === 'granted') {
      localStorage.setItem('notifications', 'on');
      setIsEnabled(true);
    } else {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            localStorage.setItem('notifications', 'on');
            setIsEnabled(true);
          }
        });
      } else {
        Notification.requestPermission((permission) => {
          if (permission === 'granted') {
            localStorage.setItem('notifications', 'on');
            setIsEnabled(true);
          }
        });
      }
    }
  };
  return (
    <NotificationsContext.Provider value={{ isEnabled, toggleNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = (): Context => {
  const ctx = React.useContext(NotificationsContext);
  if (ctx === undefined) {
    throw new Error(
      'useNotifications must be used inside NotificationsProvider'
    );
  }
  return ctx;
};
