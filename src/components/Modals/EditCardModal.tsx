import * as React from 'react';
import Button from '../Button';
import { useMutation } from '@apollo/react-hooks';
import { EDIT_CARD } from '../../api';
import { Textarea, FormError } from '../Form';
import {
  Card,
  EditCardMutation,
  EditCardMutationVariables,
} from '../../types/graphql';
import Modal, { ModalFooter } from './Modal';
import { useFormik } from 'formik';
import { object, string } from 'yup';

type EditCardModalFormProps = {
  card: Card;
  onClose: () => void;
};

function EditCardModalForm({ card, onClose }: EditCardModalFormProps) {
  const [editCard, { loading, error }] = useMutation<
    EditCardMutation,
    EditCardMutationVariables
  >(EDIT_CARD);
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
  } = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: { question: card.question, answer: card.answer },
    validationSchema: object({
      question: string().required('Question is required'),
      answer: string().required('Answer is required'),
    }),
    onSubmit: ({ question, answer }) => {
      editCard({
        variables: { input: { id: card.id, question, answer } },
      })
        .then(() => onClose())
        .catch(() => {
          // error handled via object provided by apollo mutation hook
        });
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <FormError>
          {error.graphQLErrors[0]
            ? error.graphQLErrors[0].message
            : 'Something went wrong'}
          . Please try again
        </FormError>
      )}
      <Textarea
        aria-label="question"
        placeholder="Question"
        rows={6}
        name="question"
        value={values.question}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.question && Boolean(errors.question)}
        errorText={errors.question}
      />
      <Textarea
        aria-label="answer"
        placeholder="Answer"
        rows={6}
        name="answer"
        value={values.answer}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.answer && Boolean(errors.answer)}
        errorText={errors.answer}
      />
      <ModalFooter>
        <Button
          variant="outlined"
          type="button"
          disabled={loading}
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Save
        </Button>
      </ModalFooter>
    </form>
  );
}

type EditCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
};

export default function EditCardModal({
  isOpen,
  onClose,
  card,
}: EditCardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <EditCardModalForm card={card} onClose={onClose} />
    </Modal>
  );
}
