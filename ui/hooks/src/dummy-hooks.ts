import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type DataGeneratorFn = () => any[];

export function useInfiniteDummy(queryKey: string, dataGeneratorFn: DataGeneratorFn) {
  const qc = useQueryClient();
  return useInfiniteQuery([`infinite_dummy_${queryKey}`], () => dataGeneratorFn(), {
    onSuccess: data => {
      qc.setQueryData([`infinite_dummy_${queryKey}`], data);
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
