import { gql } from 'apollo-boost';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const SIGNUP = gql`
  mutation signUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password)
  }
`;

export const CREATE_DECK = gql`
  mutation createDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_DECK = gql`
  mutation updateDeck($input: UpdateDeckInput!) {
    updateDeck(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_DECK = gql`
  mutation deleteDeck($input: DeleteDeckInput!) {
    deleteDeck(input: $input)
  }
`;

export const CREATE_CARD = gql`
  mutation createCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      question
      answer
      date
      repetition
      interval
      factor
      deckId
    }
  }
`;

export const DELETE_CARD = gql`
  mutation deleteCard($input: DeleteCardInput!) {
    deleteCard(input: $input)
  }
`;

export const GET_DECKS = gql`
  query getDecks {
    getDecks {
      id
      name
    }
  }
`;

export const GET_CARDS = gql`
  query getCards($input: GetCardsInput!) {
    getCards(input: $input) {
      id
      question
      answer
      date
      repetition
      interval
      factor
      deckId
    }
  }
`;

export const SCHEDULE_CARD = gql`
  mutation scheduleCard($input: ScheduleCardInput!) {
    scheduleCard(input: $input) {
      id
      date
      repetition
      interval
      factor
    }
  }
`;

export const EDIT_CARD = gql`
  mutation editCard($input: EditCardInput!) {
    editCard(input: $input) {
      id
      question
      answer
    }
  }
`;
