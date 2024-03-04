import { useContext } from 'react';

export const useContextStrict = <T>(context: React.Context<T>) => {
  const value = useContext(context);
  if (!value) {
    throw new Error(`Unable to use hook outside of a ${context.displayName} Provider`);
  }

  return value;
};
