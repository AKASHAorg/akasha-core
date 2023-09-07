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
  data: Omit<ScrollerState, 'id'>,
  database: ScrollStateDBWrapper,
) => {
  const collection = database.scrollState;
  const doc = await collection.where('id').equals(key).first();
  const updated = Object.assign(doc ?? { id: key }, data);
  await collection.put(updated, key);
  return updated;
};

const removeScrollState = async (key: string, database: ScrollStateDBWrapper) => {
  return database.scrollState.where('id').equals(key).delete();
};

export const useGetScrollState = (key: string, database: ScrollStateDBWrapper) => {
  return useQuery([key], () => getScrollState(key, database), {
    // we don't want this to be updated
    // because it will mess up the list as the queryKey hash will change
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

export const useSaveScrollState = (key: string, database: ScrollStateDBWrapper) => {
  const queryClient = useQueryClient();
  return useMutation(
    [key],
    (data: Omit<ScrollerState, 'id'>) => saveScrollState(key, data, database),
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
