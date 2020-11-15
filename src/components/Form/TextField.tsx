import * as React from 'react';
import styles from './TextField.module.css';
import { FieldError } from './FieldError';
import clsx from 'clsx';

type OwnProps = {
  label?: string;
  error?: boolean;
  errorText?: string;
};

type TextFieldProps = OwnProps &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;

export function TextField({
  className,
  id,
  label,
  error,
  errorText,
  ...props
}: TextFieldProps) {
  const finalClassName = clsx(
    {
      [styles.textField]: true,
      [styles.inputError]: error,
    },
    className
  );
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input className={finalClassName} id={id} {...props} />
      {error && <FieldError error={errorText || ''} />}
    </div>
  );
}
