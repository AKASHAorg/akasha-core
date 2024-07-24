import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

export const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues);
  return children;
};

export const initalDataAtom = atom(null);
