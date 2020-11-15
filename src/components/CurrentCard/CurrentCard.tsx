import * as React from 'react';
import Button from '../Button';
import styles from './CurrentCard.module.css';
import { useMutation } from '@apollo/react-hooks';
import { SCHEDULE_CARD } from '../../api';
import { motion } from 'framer-motion';
import { ReactComponent as RotateIcon } from '../../icons/rotate.svg';
import {
  Card,
  ScheduleCardMutation,
  ScheduleCardMutationVariables,
} from '../../types/graphql';
import { calculateInterval } from '../../calculateInterval';
import IconButton from '../IconButton';
import { useToasts } from '../../context/toasts';

type CurrentCardProps = {
  card: Card;
};

export default function CurrentCard({ card }: CurrentCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scheduleCard, { loading }] = useMutation<
    ScheduleCardMutation,
    ScheduleCardMutationVariables
  >(SCHEDULE_CARD);
  const dispatchToast = useToasts();
  const { question, answer, repetition, interval, factor } = card;

  const handleUpdate = (quality: number) => {
    const newData = calculateInterval(
      repetition,
      Number(interval),
      factor,
      quality
    );
    const intervalData = {
      ...newData,
      id: card.id,
      date: String(Date.now() + newData.interval),
      interval: String(newData.interval),
    };
    scheduleCard({
      variables: { input: intervalData },
      optimisticResponse: {
        __typename: 'Mutation',
        scheduleCard: {
          __typename: 'ScheduleCardPayload',
          ...intervalData,
        },
      },
    }).catch((e: Error) => {
      dispatchToast({ type: 'SHOW', message: e.message });
    });
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.div
        className={styles.currentCard + ' ' + styles.question}
        aria-hidden={isOpen}
        transition={{
          duration: 0.7,
          visibility: { duration: 0, delay: !isOpen ? 0 : 0.7 },
        }}
        initial={false}
        animate={{
          opacity: isOpen ? 0 : 1,
          rotateX: isOpen ? 180 : 0,
          zIndex: isOpen ? 1 : 5,
          pointerEvents: isOpen ? 'none' : 'auto',
          visibility: isOpen ? 'hidden' : 'visible',
        }}
      >
        <div className={styles.cardInnerBlock}>
          <p className={styles.text}>{question}</p>
          <Button className={styles.cardButton} onClick={handleOpen}>
            Show answer
          </Button>
        </div>
      </motion.div>
      <motion.div
        className={styles.currentCard + ' ' + styles.answer}
        aria-hidden={!isOpen}
        initial={false}
        transition={{
          duration: 0.7,
          visibility: { duration: 0, delay: isOpen ? 0 : 0.7 },
        }}
        animate={{
          opacity: isOpen ? 1 : 0,
          rotateX: isOpen ? 0 : 180,
          zIndex: isOpen ? 5 : 1,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        <div className={styles.cardInnerBlock}>
          <IconButton
            title="Rotate card"
            onClick={handleOpen}
            className={styles.rotateButton}
          >
            <RotateIcon />
          </IconButton>
          <p className={styles.text}>{answer}</p>
          <div className={styles.buttonsBlock}>
            <Button
              disabled={loading}
              className={styles.cardButton}
              onClick={() => handleUpdate(2)}
            >
              Again
            </Button>
            <Button
              disabled={loading}
              className={styles.cardButton}
              onClick={() => handleUpdate(3)}
            >
              Good
            </Button>
            <Button
              disabled={loading}
              className={styles.cardButton}
              onClick={() => handleUpdate(4)}
            >
              Easy
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
