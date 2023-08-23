import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollStateDBWrapper, ScrollStateSchema } from './scroll-state-db';

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
  data: Omit<ScrollStateSchema, 'id'>,
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
  return useQuery([key], () => getScrollState(key, database));
};

export const useSaveScrollState = (key: string, database: ScrollStateDBWrapper) => {
  const queryClient = useQueryClient();
  return useMutation(
    [key],
    (data: Omit<ScrollStateSchema, 'id'>) => saveScrollState(key, data, database),
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
