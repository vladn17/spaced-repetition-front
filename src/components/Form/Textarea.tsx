import * as React from 'react';
import styles from './Textarea.module.css';
import { FieldError } from './FieldError';
import clsx from 'clsx';

type OwnProps = {
  error?: boolean;
  errorText?: string;
};

type TextareaProps = OwnProps &
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;

export function Textarea({
  className,
  error,
  errorText,
  ...props
}: TextareaProps) {
  const finalClassName = clsx(
    {
      [styles.textarea]: true,
      [styles.inputError]: error,
    },
    className
  );
  return (
    <div className={styles.field}>
      <textarea className={finalClassName} {...props} />
      {error && <FieldError error={errorText || ''} />}
    </div>
  );
}
