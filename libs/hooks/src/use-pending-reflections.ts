import { useReactiveVar } from '@apollo/client';
import type { ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { createReactiveVar } from './utils/create-reactive-var';

let pendingReflectionsVar;

export const PENDING_REFLECTION_PREFIX = 'pending-reflection';

export const usePendingReflections = () => {
  if (!pendingReflectionsVar) {
    pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);
  }
  const pendingReflections = useReactiveVar<ReflectEntryData[]>(pendingReflectionsVar);

  const addPendingReflection = (pendingReflection: ReflectEntryData) => {
    const oldState = pendingReflectionsVar();

    pendingReflectionsVar([...oldState, pendingReflection]);
  };

  const removePendingReflection = (tempId: string) => {
    const oldState = pendingReflectionsVar().filter(refl => refl.id === tempId);

    pendingReflectionsVar([...oldState]);
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
