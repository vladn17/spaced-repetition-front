import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FocusOn } from 'react-focus-on';
import styles from './Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const ModalTitle: React.FC = ({ children }) => (
  <h2 className={styles.modalTitle}>{children}</h2>
);

export const ModalFooter: React.FC = ({ children }) => (
  <div className={styles.modalFooter}>{children}</div>
);

export const ModalText: React.FC = ({ children }) => (
  <div className={styles.modalText}>{children}</div>
);

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  const portal = (
    <div className={styles.modal}>
      <FocusOn onClickOutside={() => onClose()} onEscapeKey={() => onClose()}>
        <div className={styles.contentWrapper}>{children}</div>
      </FocusOn>
    </div>
  );
  return ReactDOM.createPortal(portal, document.body);
}
