import React from 'react';
import { useGetBeamsLazyQuery } from './generated/apollo';
import type {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type { GetBeamsQueryVariables } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

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
  const mergedVars: GetBeamsQueryVariables = React.useMemo(() => {
    const vars = {
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      mergedVars.filters = filters;
    }
    return vars;
  }, [sorting, filters]);

  const [fetchBeams, beamsQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
    onError: error => {
      console.error(error.message);
    },
  });

  const fetchNextPage = async (lastCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !lastCursor) return;

    const results = await beamsQuery.fetchMore({
      variables: {
        after: lastCursor,
        sorting: { createdAt: SortOrder.Desc },
      },
    });
    if (results.error) return;
    if (!results.data) return;
    setBeams(prev => [...prev, ...results.data.akashaBeamIndex.edges]);
  };

  const fetchPreviousPage = async (firstCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !firstCursor) return;
    const result = await beamsQuery.fetchMore({
      variables: {
        sorting: { createdAt: SortOrder.Asc },
        after: firstCursor,
      },
    });
    if (result.errors) return;
    if (!result.data) return;
    setBeams(prev => [...result.data.akashaBeamIndex.edges.reverse(), ...prev]);
  };

  const fetchInitialData = async (cursors: string[]) => {
    const resumeItemCursor = cursors[cursors.length - 1];
    if (resumeItemCursor && !beamsQuery.called) {
      const results = await fetchBeams({
        variables: {
          after: resumeItemCursor,
          sorting: { createdAt: SortOrder.Asc },
        },
      });
      if (results.error) return;
      if (!results.data) return;
      setBeams(results.data.akashaBeamIndex.edges.reverse());
    } else if (!beamsQuery.called) {
      const results = await fetchBeams({
        variables: {
          sorting: { createdAt: SortOrder.Desc },
        },
      });
      if (results.error) return;
      if (!results.data) return;
      setBeams(results.data.akashaBeamIndex.edges);
    }
  };

  const handleReset = async () => {
    // @TODO: reset queries
    setBeams([]);
    fetchBeams({
      variables: {
        sorting: { createdAt: SortOrder.Desc },
      },
    });
  };

  return {
    beams,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isFetching: beamsQuery.loading,
    onReset: handleReset,
    error: `${beamsQuery.error?.message || ''}`,
  };
};
