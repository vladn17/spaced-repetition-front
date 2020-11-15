import * as React from 'react';
import Button from '../Button';
import { useMutation } from '@apollo/react-hooks';
import { GET_CARDS, CREATE_CARD } from '../../api';
import { Textarea, FormError } from '../Form';
import {
  GetCardsQuery,
  CreateCardMutation,
  CreateCardMutationVariables,
  GetCardsQueryVariables,
} from '../../types/graphql';
import Modal, { ModalFooter } from './Modal';
import { useFormik } from 'formik';
import { object, string } from 'yup';

type CreateCardFormProps = {
  deckId: string;
  onClose: () => void;
};

function CreateCardForm({ deckId, onClose }: CreateCardFormProps) {
  const [createCard, { loading, error }] = useMutation<
    CreateCardMutation,
    CreateCardMutationVariables
  >(CREATE_CARD, {
    update(cache, { data }) {
      const queryCache = cache.readQuery<GetCardsQuery, GetCardsQueryVariables>(
        { query: GET_CARDS, variables: { input: { deckId } } }
      );
      const newCard = data && data.createCard;
      const newData =
        queryCache && newCard && queryCache.getCards.concat(newCard);
      cache.writeQuery({
        query: GET_CARDS,
        variables: { input: { deckId } },
        data: { getCards: newData },
      });
    },
  });

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
    initialValues: { question: '', answer: '' },
    validationSchema: object({
      question: string().required('Question is required'),
      answer: string().required('Answer is required'),
    }),
    onSubmit: ({ question, answer }) => {
      createCard({
        variables: {
          input: { question, answer, deckId, date: String(Date.now()) },
        },
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
          type="button"
          variant="outlined"
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

type CreateCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
};

export default function CreateCardModal({
  isOpen,
  onClose,
  deckId,
}: CreateCardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CreateCardForm deckId={deckId} onClose={onClose} />
    </Modal>
  );
}
