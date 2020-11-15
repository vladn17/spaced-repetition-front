import * as React from 'react';
import styles from './FieldError.module.css';

type FieldErrorProps = {
  error: string;
};

export function FieldError({ error }: FieldErrorProps) {
  return <div className={styles.errorMsg}>{error}</div>;
}
