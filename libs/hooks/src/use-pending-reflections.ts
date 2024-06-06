import { useReactiveVar } from '@apollo/client';
import type { ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { createReactiveVar } from './utils/create-reactive-var';

let pendingReflectionsVar;

export const PENDING_REFLECTION_PREFIX = 'pending-reflection';

/**
 * Hook that handles the adding, removing and returning of the
 * pending Reflections by making use of Apollo's reactive variables.
 * The updated pending reflections returned can be used to update/re-render
 * the components directly without the need to use `useQuery`.
 * @example usePendingReflections hook
 * ```typescript
 * const { pendingReflections, addPendingReflection } = usePendingReflections();
 * ```
 */
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
    const oldState = pendingReflectionsVar().filter(refl => refl.id !== tempId);

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
