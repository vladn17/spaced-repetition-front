export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Card = {
  __typename?: 'Card';
  id: Scalars['ID'];
  question: Scalars['String'];
  answer: Scalars['String'];
  date: Scalars['String'];
  repetition: Scalars['Int'];
  interval: Scalars['String'];
  factor: Scalars['Float'];
  deckId: Scalars['String'];
};

export type CreateCardInput = {
  question: Scalars['String'];
  answer: Scalars['String'];
  date: Scalars['String'];
  deckId: Scalars['ID'];
};

export type CreateDeckInput = {
  name: Scalars['String'];
};

export type Deck = {
  __typename?: 'Deck';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type DeleteCardInput = {
  id: Scalars['ID'];
};

export type DeleteDeckInput = {
  deckId: Scalars['ID'];
};

export type EditCardInput = {
  id: Scalars['ID'];
  question: Scalars['String'];
  answer: Scalars['String'];
};

export type EditCardPayload = {
  __typename?: 'EditCardPayload';
  id: Scalars['ID'];
  question: Scalars['String'];
  answer: Scalars['String'];
};

export type GetCardsInput = {
  deckId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Scalars['String'];
  signUp: Scalars['String'];
  createDeck: Deck;
  updateDeck: Deck;
  deleteDeck: Scalars['ID'];
  createCard: Card;
  deleteCard: Scalars['ID'];
  editCard?: Maybe<EditCardPayload>;
  scheduleCard?: Maybe<ScheduleCardPayload>;
};

export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationCreateDeckArgs = {
  input: CreateDeckInput;
};

export type MutationUpdateDeckArgs = {
  input: UpdateDeckInput;
};

export type MutationDeleteDeckArgs = {
  input: DeleteDeckInput;
};

export type MutationCreateCardArgs = {
  input: CreateCardInput;
};

export type MutationDeleteCardArgs = {
  input: DeleteCardInput;
};

export type MutationEditCardArgs = {
  input: EditCardInput;
};

export type MutationScheduleCardArgs = {
  input: ScheduleCardInput;
};

export type Query = {
  __typename?: 'Query';
  getDecks: Array<Deck>;
  getCards: Array<Card>;
};

export type QueryGetCardsArgs = {
  input: GetCardsInput;
};

export type ScheduleCardInput = {
  id: Scalars['ID'];
  date: Scalars['String'];
  repetition: Scalars['Int'];
  interval: Scalars['String'];
  factor: Scalars['Float'];
};

export type ScheduleCardPayload = {
  __typename?: 'ScheduleCardPayload';
  id: Scalars['ID'];
  date: Scalars['String'];
  repetition: Scalars['Int'];
  interval: Scalars['String'];
  factor: Scalars['Float'];
};

export type UpdateDeckInput = {
  deckId: Scalars['ID'];
  name: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'login'
>;

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignUpMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'signUp'
>;

export type CreateDeckMutationVariables = Exact<{
  input: CreateDeckInput;
}>;

export type CreateDeckMutation = { __typename?: 'Mutation' } & {
  createDeck: { __typename?: 'Deck' } & Pick<Deck, 'id' | 'name'>;
};

export type UpdateDeckMutationVariables = Exact<{
  input: UpdateDeckInput;
}>;

export type UpdateDeckMutation = { __typename?: 'Mutation' } & {
  updateDeck: { __typename?: 'Deck' } & Pick<Deck, 'id' | 'name'>;
};

export type DeleteDeckMutationVariables = Exact<{
  input: DeleteDeckInput;
}>;

export type DeleteDeckMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteDeck'
>;

export type CreateCardMutationVariables = Exact<{
  input: CreateCardInput;
}>;

export type CreateCardMutation = { __typename?: 'Mutation' } & {
  createCard: { __typename?: 'Card' } & Pick<
    Card,
    | 'id'
    | 'question'
    | 'answer'
    | 'date'
    | 'repetition'
    | 'interval'
    | 'factor'
    | 'deckId'
  >;
};

export type DeleteCardMutationVariables = Exact<{
  input: DeleteCardInput;
}>;

export type DeleteCardMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteCard'
>;

export type GetDecksQueryVariables = Exact<{ [key: string]: never }>;

export type GetDecksQuery = { __typename?: 'Query' } & {
  getDecks: Array<{ __typename?: 'Deck' } & Pick<Deck, 'id' | 'name'>>;
};

export type GetCardsQueryVariables = Exact<{
  input: GetCardsInput;
}>;

export type GetCardsQuery = { __typename?: 'Query' } & {
  getCards: Array<
    { __typename?: 'Card' } & Pick<
      Card,
      | 'id'
      | 'question'
      | 'answer'
      | 'date'
      | 'repetition'
      | 'interval'
      | 'factor'
      | 'deckId'
    >
  >;
};

export type ScheduleCardMutationVariables = Exact<{
  input: ScheduleCardInput;
}>;

export type ScheduleCardMutation = { __typename?: 'Mutation' } & {
  scheduleCard?: Maybe<
    { __typename?: 'ScheduleCardPayload' } & Pick<
      ScheduleCardPayload,
      'id' | 'date' | 'repetition' | 'interval' | 'factor'
    >
  >;
};

export type EditCardMutationVariables = Exact<{
  input: EditCardInput;
}>;

export type EditCardMutation = { __typename?: 'Mutation' } & {
  editCard?: Maybe<
    { __typename?: 'EditCardPayload' } & Pick<
      EditCardPayload,
      'id' | 'question' | 'answer'
    >
  >;
};
