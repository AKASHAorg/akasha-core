import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

const TagFeedHeaderLoader: React.FC = () => {
  return (
    <Card className="mb-2">
      <Stack direction="row" alignItems="center" justifyContent="between" spacing={3}>
        <Stack direction="row" spacing={2} className="w-full">
          <Skeleton className="rounded-full h-10 w-10 shrink-0" />
          <Stack
            direction="column"
            spacing={1}
            className="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
          >
            <Skeleton title="tagName" className="w-[110px] h-[1rem]" />
            <Skeleton title="tagName" className="w-[110px] h-[1rem]" />
          </Stack>
        </Stack>

        <Stack className="w-28 py-1 shrink-0">
          <Skeleton title="tagName" className="rounded w-[5rem] h-[1.5rem]" />
        </Stack>
      </Stack>
    </Card>
  );
};

export default TagFeedHeaderLoader;
