import * as React from 'react';
import Button from '../Button';
import { useMutation } from '@apollo/react-hooks';
import { GET_DECKS, CREATE_DECK } from '../../api';
import {
  CreateDeckMutation,
  CreateDeckMutationVariables,
  GetDecksQuery,
} from '../../types/graphql';
import { TextField, FormError } from '../Form';
import Modal, { ModalFooter, ModalTitle } from './Modal';
import { useFormik } from 'formik';
import { object, string } from 'yup';

type CreateDeckFormProps = {
  onClose: () => void;
};

function CreateDeckForm({ onClose }: CreateDeckFormProps) {
  const [createDeck, { loading, error }] = useMutation<
    CreateDeckMutation,
    CreateDeckMutationVariables
  >(CREATE_DECK, {
    update(cache, { data }) {
      const queryCache = cache.readQuery<GetDecksQuery>({ query: GET_DECKS });
      const newDeck = data && data.createDeck;
      const newData =
        queryCache && newDeck && queryCache.getDecks.concat(newDeck);
      cache.writeQuery({ query: GET_DECKS, data: { getDecks: newData } });
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
    initialValues: { name: '' },
    validationSchema: object({
      name: string()
        .max(20, 'Name cannot be longer than 20 characters')
        .required('Name is required'),
    }),
    onSubmit: (values) => {
      createDeck({ variables: { input: { ...values } } })
        .then(() => onClose())
        .catch(() => {
          // error handled via object provided by apollo mutation hook
        });
    },
  });

  return (
    <>
      <ModalTitle>Create new deck</ModalTitle>
      <form onSubmit={handleSubmit}>
        {error && (
          <FormError>
            {error.graphQLErrors[0]
              ? error.graphQLErrors[0].message
              : 'Something went wrong'}
            . Please try again
          </FormError>
        )}
        <TextField
          name="name"
          placeholder="Deck name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          errorText={errors.name}
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
    </>
  );
}

type CreateDeckModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateDeckModal({
  isOpen,
  onClose,
}: CreateDeckModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CreateDeckForm onClose={onClose} />
    </Modal>
  );
}
