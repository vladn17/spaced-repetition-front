import * as React from 'react';
import styles from './InfoMessage.module.css';

const InfoMessage: React.FC = ({ children }) => (
  <div className={styles.infoMessage}>{children}</div>
);

export default InfoMessage;
