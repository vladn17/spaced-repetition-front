import * as React from 'react';
import clsx from 'clsx';
import styles from './ToggleButton.module.css';

type ToggleButtonProps = {
  checked: boolean;
  handleChange: () => void;
  ariaLabel: string;
};

export default function ToggleButton({
  checked,
  handleChange,
  ariaLabel,
}: ToggleButtonProps) {
  const btnClass = clsx({
    [styles.slider]: true,
    [styles.checked]: checked,
  });

  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        aria-label={ariaLabel}
        checked={checked}
        onChange={handleChange}
      />
      <span className={btnClass}></span>
    </label>
  );
}
