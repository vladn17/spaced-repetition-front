import * as React from 'react';
import styles from './Toast.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '../IconButton';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
import { useToasts } from '../../context/toasts';

type ToastProps = {
  toast: {
    key: number;
    message: string;
  };
};

export const ToastsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className={styles.toastsContainer}>
    <AnimatePresence initial={false}>{children}</AnimatePresence>
  </div>
);

export default function Toast({ toast }: ToastProps) {
  const dispatchToast = useToasts();
  React.useEffect(() => {
    const timeout = setTimeout(
      () => dispatchToast({ type: 'CLOSE', key: toast.key }),
      4000
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [toast, dispatchToast]);
  return (
    <motion.div
      className={styles.toast}
      layout
      key={toast.key}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.4 } }}
    >
      {toast.message}
      <IconButton
        title="Close"
        onClick={() => dispatchToast({ type: 'CLOSE', key: toast.key })}
      >
        <CloseIcon />
      </IconButton>
    </motion.div>
  );
}
