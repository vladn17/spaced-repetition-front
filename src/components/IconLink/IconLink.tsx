import * as React from 'react';
import styles from './IconLink.module.css';
import { Link, LinkProps } from 'react-router-dom';
import clsx from 'clsx';

export default function IconLink({ children, className, ...props }: LinkProps) {
  const constructedClassName = clsx(styles.iconLink, className);
  return (
    <Link className={constructedClassName} {...props}>
      {children}
    </Link>
  );
}
