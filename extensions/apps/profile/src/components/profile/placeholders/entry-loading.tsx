import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

type EntryLoadingProps = {
  customStyle?: string;
};
const EntryLoading: React.FC<EntryLoadingProps> = props => {
  const { customStyle } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="between"
      className={`pb-4 ${customStyle}`}
    >
      <Stack direction="row" spacing={1}>
        <Skeleton className="rounded-full h-10 w-10 shrink-0" />
        <Stack direction="column" justifyContent="center" spacing={1}>
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-24 h-4" />
        </Stack>
      </Stack>
      <Skeleton className="w-24" />
    </Stack>
  );
};

export default EntryLoading;
