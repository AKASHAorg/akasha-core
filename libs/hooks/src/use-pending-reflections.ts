import { useReactiveVar } from '@apollo/client';
import type { RawReflectionData } from '@akashaorg/typings/lib/ui';
import { createReactiveVar } from './utils/create-reactive-var';

let pendingReflectionsVar;

export const PENDING_REFLECTION_PREFIX = 'pending-reflection';

type PendingReflection = RawReflectionData & { published?: boolean };

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
    pendingReflectionsVar = createReactiveVar<PendingReflection[]>([]);
  }
  const pendingReflections = useReactiveVar<PendingReflection[]>(pendingReflectionsVar);

  const addPendingReflection = (pendingReflection: PendingReflection) => {
    const oldState = pendingReflectionsVar();

    pendingReflectionsVar([...oldState, pendingReflection]);
  };

  const removePendingReflection = (reflectionId: string) => {
    const oldState = pendingReflectionsVar().filter(refl => refl.id !== reflectionId);

    pendingReflectionsVar([...oldState]);
  };

  const updatePendingReflection = (reflectionId: string, reflectionData: PendingReflection) => {
    const newState = pendingReflectionsVar().map(reflection => {
      if (reflection.id === reflectionId) return reflectionData;
      return reflection;
    });

    pendingReflectionsVar([...newState]);
  };

  const removePendingReflections = () => {
    pendingReflectionsVar([]);
  };

  return {
    addPendingReflection,
    removePendingReflection,
    removePendingReflections,
    updatePendingReflection,
    pendingReflections,
  };
};
