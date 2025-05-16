import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

const TrendingWidgetItemLoader: React.FC = () => {
  return (
    <Stack
      direction="row"
      spacing={12}
      alignItems="center"
      justifyContent="between"
      className="w-full"
    >
      <Stack direction="row" spacing={2} className="w-full">
        <Skeleton className="rounded-full h-10 w-10 shrink-0" />
        <Stack
          direction="column"
          spacing={1}
          className="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
        >
          <Skeleton title="tagName" className="w-[110px] h-[1rem]" />
          <Skeleton title="tagName" className="w-[88px] h-[1rem]" />
        </Stack>
      </Stack>

      <Skeleton title="tagName" className="rounded w-[5rem] h-[1.5rem]" />
    </Stack>
  );
};

export default TrendingWidgetItemLoader;
