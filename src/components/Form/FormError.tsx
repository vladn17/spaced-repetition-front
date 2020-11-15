import * as React from 'react';
import styles from './FormError.module.css';
import { ReactComponent as ErrorIcon } from '../../icons/error.svg';

type FormErrorProps = {
  children: React.ReactNode;
};

export function FormError({ children }: FormErrorProps) {
  return (
    <div className={styles.formError}>
      <div className={styles.errorIcon}>
        <ErrorIcon />
      </div>
      <div>{children}</div>
    </div>
  );
}
