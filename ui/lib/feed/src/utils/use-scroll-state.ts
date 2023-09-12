import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollStateDBWrapper } from './scroll-state-db';
import { ScrollerState } from '@akashaorg/design-system-components/lib/components/EntryList';

const getScrollState = async (key: string, database: ScrollStateDBWrapper) => {
  const collection = database.scrollState;
  const doc = await collection?.where('id').equals(key).first();
  if (!doc) {
    return null;
  }
  return doc;
};

const saveScrollState = async (
  key: string,
  data: Partial<Omit<ScrollerState, 'id'>>,
  database: ScrollStateDBWrapper,
) => {
  const collection = database.scrollState;
  const doc = await collection.where('id').equals(key).first();

  const mergedState: ScrollerState & { id: string } = {
    id: doc?.id || key,
    startItemCursor: undefined,
    measurementsCache: [],
    itemsCount: 0,
    totalHeight: 0,
    totalWidth: 0,
    visibleCursorRange: {
      startCursor: undefined,
      endCursor: undefined,
    },
    ...doc,
    ...data,
  };

  await collection.put(mergedState, key);
  return mergedState;
};

const removeScrollState = async (key: string, database: ScrollStateDBWrapper) => {
  return database.scrollState.where('id').equals(key).delete();
};

export const useGetScrollState = (key: string, database: ScrollStateDBWrapper) => {
  return useQuery([key], () => getScrollState(key, database));
};

export const useSaveScrollState = (key: string, database: ScrollStateDBWrapper) => {
  const queryClient = useQueryClient();
  return useMutation(
    [key],
    (data: Partial<Omit<ScrollerState, 'id'>>) => saveScrollState(key, data, database),
    {
      onMutate: async () => {
        await queryClient.invalidateQueries([key]);
      },
    },
  );
};

export const useRemoveScrollState = (key: string, database: ScrollStateDBWrapper) => {
  const queryClient = useQueryClient();
  return useMutation([key], () => removeScrollState(key, database), {
    onMutate: async () => {
      await queryClient.invalidateQueries([key]);
    },
  });
};
