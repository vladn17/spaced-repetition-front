import * as React from 'react';
import styles from './FormBottomText.module.css';

export const FormBottomText: React.FC = ({ children }) => (
  <div className={styles.bottomText}>{children}</div>
);
