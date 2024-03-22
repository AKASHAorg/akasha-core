import { type ReactiveVar, useReactiveVar } from '@apollo/client';
import type { ReflectEntryData } from '@akashaorg/typings/lib/ui';

/**
 * Hook that makes use of the Apollo Client's reactivity model to allow the adding,
 * removing and returning of pending Reflections to a component (i.e. the Beam Page)
 * 
 * @example usePendingReflections hook
 * ```typescript
 * // createReactiveVar is another function that makes use of the `makeVar` method
 * from Apollo Client to create a reactive variable.
 *   const pendingReflectionsVar = createReactiveVar<ReflectEntryData[]>([]);
  const { pendingReflections } = usePendingReflections(pendingReflectionsVar);
 * ```
 */
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
