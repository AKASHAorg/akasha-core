import { QueryFunction, QueryKey, useQuery, useQueryClient } from 'react-query';
import { Observable } from 'rxjs';
import { useEffect } from 'react';
import { UseQueryOptions } from 'react-query/types/react/types';
import { ILogger } from '@akashaorg/typings/sdk';

export const useQueryStream = (
  queryKey: QueryKey,
  fetcher: QueryFunction,
  config?: UseQueryOptions,
  logger?: ILogger,
) => {
  const queryClient = useQueryClient();
  const queryResult = useQuery(queryKey, fetcher, config);

  useEffect(() => {
    if (queryResult.data instanceof Observable) {
      const sub = queryResult.data.subscribe({
        next: res => {
          queryClient.setQueryData<unknown[]>(queryKey, currentQueryData => {
            return currentQueryData.length ? currentQueryData.concat(res.data) : [res.data];
          });
        },
        error: error => {
          logger.error(error);
        },
      });
      return () => sub.unsubscribe();
    }
  }, [logger, queryClient, queryKey, queryResult.data]);

  return queryResult;
};
