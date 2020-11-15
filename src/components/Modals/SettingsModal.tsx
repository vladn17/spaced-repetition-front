import * as React from 'react';
import Modal from './Modal';
import styles from './SettingsModal.module.css';
import { ReactComponent as LightThemeIcon } from '../../icons/light.svg';
import { ReactComponent as DarkThemeIcon } from '../../icons/dark.svg';
import { ReactComponent as AutoThemeIcon } from '../../icons/auto.svg';
import IconButton from '../IconButton';
import ToggleButton from '../ToggleButton';
import { useNotifications } from '../../context/notifications';
import { useTheme } from '../../context/theme';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NotificationPermissionSwitch() {
  const { isEnabled, toggleNotifications } = useNotifications();

  return (
    <div className={styles.notificationsBlock}>
      Notifications
      <ToggleButton
        ariaLabel="Toggle notifications"
        checked={isEnabled}
        handleChange={toggleNotifications}
      />
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.themeSwitchBlock}>
        Theme
        <div className={styles.themeIcons}>
          <IconButton
            title="Switch to system theme"
            className={theme === 'auto' ? styles.current : undefined}
            onClick={() => setTheme('auto')}
          >
            <AutoThemeIcon />
          </IconButton>
          <IconButton
            title="Switch to light theme"
            className={theme === 'light' ? styles.current : undefined}
            onClick={() => setTheme('light')}
          >
            <LightThemeIcon />
          </IconButton>
          <IconButton
            title="Switch to dark theme"
            className={theme === 'dark' ? styles.current : undefined}
            onClick={() => setTheme('dark')}
          >
            <DarkThemeIcon />
          </IconButton>
        </div>
      </div>
      <hr></hr>
      <NotificationPermissionSwitch />
    </Modal>
  );
}
