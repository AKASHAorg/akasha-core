import React from 'react';
import { useGetBeamsLazyQuery } from './generated/apollo';
import type {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type { GetBeamsQueryVariables } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
};

const defaultSorting: AkashaBeamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeams = ({ overscan, filters, sorting }: UseBeamsOptions) => {
  const [beams, setBeams] = React.useState<AkashaBeamEdge[]>([]);
  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const mergedVars: GetBeamsQueryVariables = React.useMemo(() => {
    const vars: { sorting: AkashaBeamSortingInput; filters?: AkashaBeamFiltersInput } = {
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      vars.filters = filters;
    }
    return vars;
  }, [sorting, filters]);

  const [fetchBeams, beamsQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
    onError: error => {
      setErrors(prev => prev.concat(error));
    },
  });
  const queryClient = React.useRef(beamsQuery.client);

  React.useEffect(() => {
    const unsub = queryClient.current.onClearStore(() => {
      return fetchInitialData([]);
    });
    return () => {
      unsub();
    };
  }, []);

  const fetchNextPage = async (lastCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !lastCursor) return;
    try {
      const results = await beamsQuery.fetchMore({
        variables: {
          after: lastCursor,
          sorting: { createdAt: SortOrder.Desc },
        },
      });
      if (results.error) return;
      if (!results.data) return;
      const newBeams = [];
      results.data.akashaBeamIndex.edges.forEach(e => {
        if (beams.some(b => b.cursor === e.cursor)) {
          return;
        }
        newBeams.push(e);
      });
      setBeams(prev => [...prev, ...newBeams]);
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchPreviousPage = async (firstCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !firstCursor) return;
    try {
      const results = await beamsQuery.fetchMore({
        variables: {
          sorting: { createdAt: SortOrder.Asc },
          after: firstCursor,
        },
      });
      if (results.error) {
        setErrors(prev => [...prev, results.error]);
        return;
      }
      if (!results.data) return;
      const newBeams = [];
      results.data.akashaBeamIndex.edges.forEach(e => {
        if (beams.some(b => b.cursor === e.cursor)) {
          return;
        }
        newBeams.push(e);
      });
      setBeams(prev => [...newBeams.reverse(), ...prev]);
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchInitialData = async (cursors: string[]) => {
    const resumeItemCursor = cursors[cursors.length - 1];
    if (resumeItemCursor && !beamsQuery.called) {
      try {
        const results = await fetchBeams({
          variables: {
            after: resumeItemCursor,
            sorting: { createdAt: SortOrder.Asc },
          },
        });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }
        if (!results.data) return;
        const newBeams = [];
        results.data.akashaBeamIndex.edges.forEach(e => {
          if (beams.some(b => b.cursor === e.cursor)) {
            return;
          }
          newBeams.push(e);
        });
        setBeams(newBeams.reverse());
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    } else if (!beamsQuery.called) {
      try {
        const results = await fetchBeams({
          variables: {
            sorting: { createdAt: SortOrder.Desc },
          },
          fetchPolicy: 'network-only',
        });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }
        if (!results.data) return;
        const newBeams = [];
        results.data.akashaBeamIndex.edges.forEach(e => {
          if (beams.some(b => b.cursor === e.cursor)) {
            return;
          }
          newBeams.push(e);
        });
        setBeams(newBeams);
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    }
  };

  const handleReset = async () => {
    setBeams([]);
    try {
      await queryClient.current.clearStore();
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  return {
    beams,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isFetching: beamsQuery.loading,
    onReset: handleReset,
    hasErrors: errors.length > 0,
    errors: errors.map(err => {
      if (err instanceof ApolloError) {
        console.log('Apollo error:', JSON.stringify(err));
        return err.message;
      } else {
        console.log('Error:', err);
        return err.message;
      }
    }),
  };
};
