import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

type DataGeneratorFn<TData = unknown> = () => TData ;

export function useInfiniteDummy<
  TQueryReturnData,
  TQueryStateData = TQueryReturnData,
  TErr = Error,
>(
  queryKey: string,
  dataGeneratorFn: DataGeneratorFn<TQueryReturnData>,
  options?: UseInfiniteQueryOptions<TQueryReturnData, TErr, TQueryStateData>,
) {
  return useInfiniteQuery([`infinite_dummy_${queryKey}`], dataGeneratorFn, {
    getNextPageParam: (lastPage, pages) => {
      return pages.length;
    },
    ...options,
  });
}

export function useDummyQuery(initialData: any) {
  const qc = useQueryClient();
  return useQuery([initialData], () => Promise.resolve(), {
    onSuccess: () => {
      qc.setQueryData([initialData], initialData);
    },
    initialData,
  });
}

export function useDummyMutation(returnData: any) {
  return useMutation((...args: any[]) => Promise.resolve(), {
    onSuccess: () => {
      return returnData;
    },
  });
}
