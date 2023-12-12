import React from 'react';
import { useGetBeamsLazyQuery, useGetBeamsByAuthorDidLazyQuery } from './generated/apollo';
import type {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type {
  GetBeamsByAuthorDidQuery,
  GetBeamsQuery,
  GetBeamsQueryVariables,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';
import { hasOwn } from './utils/has-own';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  did?: string;
};

const defaultSorting: AkashaBeamSortingInput = {
  createdAt: SortOrder.Desc,
};

function isGetBeamsByAuthorDid(
  query: GetBeamsByAuthorDidQuery | GetBeamsQuery,
): query is GetBeamsByAuthorDidQuery {
  if ((query as GetBeamsByAuthorDidQuery).node) {
    return true;
  }
  return false;
}

function isGetBeams(query: GetBeamsByAuthorDidQuery | GetBeamsQuery): query is GetBeamsQuery {
  if ((query as GetBeamsQuery).akashaBeamIndex) {
    return true;
  }
  return false;
}

export const useBeams = ({ overscan, filters, sorting, did }: UseBeamsOptions) => {
  const [beams, setBeams] = React.useState<AkashaBeamEdge[]>([]);
  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);
  const mergedVars: GetBeamsQueryVariables = React.useMemo(() => {
    const vars = {
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      mergedVars.filters = filters;
    }
    return vars;
  }, [sorting, filters]);

  const [fetchAllBeams, allBeamsQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
    onError: error => {
      setErrors(prev => prev.concat(error));
    },
  });

  const [fetchBeamsByDid, beamsByDidQuery] = useGetBeamsByAuthorDidLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
      id: did,
    },
    onError: error => {
      setErrors(prev => prev.concat(error));
    },
  });

  const queryClient = React.useRef(did ? beamsByDidQuery.client : allBeamsQuery.client);

  const fetchBeams = did ? fetchBeamsByDid : fetchAllBeams;
  const beamsQuery = did ? beamsByDidQuery : allBeamsQuery;

  const processData = (results: GetBeamsQuery | GetBeamsByAuthorDidQuery) => {
    const newBeams = [];
    if (isGetBeamsByAuthorDid(results)) {
      if (results.node && hasOwn(results.node, 'akashaBeamList')) {
        results.node.akashaBeamList.edges.forEach(e => {
          if (beams.some(b => b.cursor === e.cursor)) {
            return;
          }
          newBeams.push(e);
        });
      }
    }
    if (isGetBeams(results)) {
      results.akashaBeamIndex.edges.forEach(e => {
        if (beams.some(b => b.cursor === e.cursor)) {
          return;
        }
        newBeams.push(e);
      });
    }
    return newBeams;
  };

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

    const variables = did
      ? {
          variables: {
            id: did,
            after: lastCursor,
            sorting: { createdAt: SortOrder.Desc },
          },
        }
      : {
          variables: {
            after: lastCursor,
            sorting: { createdAt: SortOrder.Desc },
          },
        };
    try {
      const results = await beamsQuery.fetchMore(variables);
      if (results.error) return;
      if (!results.data) return;
      const newBeams = processData(results.data);

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
      if (results.error) return;
      if (!results.data) return;
      const newBeams = processData(results.data);
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
            id: did ?? null,
            after: resumeItemCursor,
            sorting: { createdAt: SortOrder.Asc },
          },
        });
        if (results.error) return;
        if (!results.data) return;
        const newBeams = processData(results.data);
        setBeams(newBeams.reverse());
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    } else if (!beamsQuery.called) {
      try {
        const results = await fetchBeams({
          variables: {
            id: did,
            sorting: { createdAt: SortOrder.Desc },
          },
          fetchPolicy: 'network-only',
        });
        if (results.error) return;
        if (!results.data) return;
        const newBeams = processData(results.data);
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
