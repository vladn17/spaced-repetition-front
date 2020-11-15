import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/auth';
import { ReactComponent as LogoutIcon } from '../../icons/log_out.svg';
import { ReactComponent as SettingsIcon } from '../../icons/settings.svg';
import { useApolloClient } from '@apollo/react-hooks';
import IconButton from '../IconButton';
import SettingsModal from '../Modals/SettingsModal';

const Header = () => {
  const client = useApolloClient();
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const { logout } = useAuth();
  const handleLogout = () => {
    client.clearStore().then(() => logout());
  };
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        REPEAT
      </Link>
      <div className={styles.headerActions}>
        <IconButton title="Settings" onClick={() => setDialogIsOpen(true)}>
          <SettingsIcon />
        </IconButton>
        <SettingsModal
          isOpen={dialogIsOpen}
          onClose={() => setDialogIsOpen(false)}
        />
        <IconButton title="Log out" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;
