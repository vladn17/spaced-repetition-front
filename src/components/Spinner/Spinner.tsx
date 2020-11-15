import * as React from 'react';
import styles from './Spinner.module.css';
import clsx from 'clsx';

type SpinnerProps = {
  fullscreen?: boolean;
};

export default function Spinner({ fullscreen }: SpinnerProps) {
  const spinnerClass = clsx({
    [styles.spinner]: true,
    [styles.fullscreen]: fullscreen,
  });
  return <div className={spinnerClass} role="alert" aria-label="Loading"></div>;
}
