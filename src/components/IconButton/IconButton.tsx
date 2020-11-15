import * as React from 'react';
import styles from './IconButton.module.css';
import clsx from 'clsx';
import Spinner from '../Spinner';

export default function IconButton({
  isLoading,
  children,
  className,
  disabled,
  ...props
}: { isLoading?: boolean } & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const constructedClassName = clsx(styles.iconButton, className);

  return (
    <button
      className={constructedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
