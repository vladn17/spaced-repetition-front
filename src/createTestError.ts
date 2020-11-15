import { GraphQLError } from 'graphql';

function createTestError(message: string, code?: string) {
  if (code === undefined) {
    return new GraphQLError(message);
  } else
    return new GraphQLError(
      message,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: code }
    );
}

export default createTestError;
