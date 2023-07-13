import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type DataGeneratorFn = ({ pageParam = 0 }) => any[];

export function useInfiniteDummy(queryKey: string, dataGeneratorFn: DataGeneratorFn) {
  return useInfiniteQuery([`infinite_dummy_${queryKey}`], dataGeneratorFn, {
    getNextPageParam: (lastPage, pages) => {
      return pages.length;
    },
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
