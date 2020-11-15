import * as React from 'react';
import styles from './Button.module.css';
import Spinner from '../Spinner';
import clsx from 'clsx';

type OwnProps = {
  variant?: 'contained' | 'outlined';
  fullWidth?: boolean;
  isLoading?: boolean;
};

type ButtonProps = OwnProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

export default function Button({
  variant = 'contained',
  fullWidth,
  isLoading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const btnClass = clsx(
    {
      [styles.button]: true,
      [styles.outlined]: variant === 'outlined',
      [styles.fullWidth]: Boolean(fullWidth),
    },
    className
  );

  return (
    <button className={btnClass} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
