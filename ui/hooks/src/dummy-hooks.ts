import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useInfiniteDummy(initialData: any[]) {
  const qc = useQueryClient();
  return useInfiniteQuery([initialData], () => Promise.resolve(), {
    onSuccess: () => {
      qc.setQueryData([initialData], initialData);
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
