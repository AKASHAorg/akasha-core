import { makeVar } from '@apollo/client';

export const createReactiveVar = <T>(initialState: T) => {
  return makeVar(initialState);
};
