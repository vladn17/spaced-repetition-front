import * as React from 'react';
import styles from './FormTitle.module.css';

export const FormTitle: React.FC = ({ children }) => (
  <h1 className={styles.formTitle}>{children}</h1>
);
