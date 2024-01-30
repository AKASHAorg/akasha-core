import { makeVar, useReactiveVar } from '@apollo/client';
import type { ReflectEntryData } from '@akashaorg/typings/lib/ui';

const pendingReflectionsVar = makeVar([]);

export const usePendingReflections = () => {
  const pendingReflections = useReactiveVar<ReflectEntryData[]>(pendingReflectionsVar);
  const addPendingReflection = (pendingReflection: ReflectEntryData) => {
    pendingReflectionsVar([...pendingReflectionsVar(), pendingReflection]);
  };

  const removePendingReflection = (tempId: string) => {
    pendingReflectionsVar([...pendingReflectionsVar().filter(refl => refl.id === tempId)]);
  };

  const removePendingReflections = () => {
    pendingReflectionsVar([]);
  };

  return {
    addPendingReflection,
    removePendingReflection,
    removePendingReflections,
    pendingReflections,
  };
};
