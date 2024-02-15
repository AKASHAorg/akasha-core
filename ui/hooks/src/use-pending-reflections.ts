import { type ReactiveVar, useReactiveVar } from '@apollo/client';
import type { ReflectEntryData } from '@akashaorg/typings/lib/ui';

export const usePendingReflections = (
  pendingReflectionsReactiveVar: ReactiveVar<ReflectEntryData[]>,
) => {
  const pendingReflections = useReactiveVar<ReflectEntryData[]>(pendingReflectionsReactiveVar);
  const addPendingReflection = (pendingReflection: ReflectEntryData) => {
    pendingReflectionsReactiveVar([...pendingReflectionsReactiveVar(), pendingReflection]);
  };

  const removePendingReflection = (tempId: string) => {
    pendingReflectionsReactiveVar([
      ...pendingReflectionsReactiveVar().filter(refl => refl.id === tempId),
    ]);
  };

  const removePendingReflections = () => {
    pendingReflectionsReactiveVar([]);
  };

  return {
    addPendingReflection,
    removePendingReflection,
    removePendingReflections,
    pendingReflections,
  };
};
