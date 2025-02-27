import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const TagFeedHeaderLoader: React.FC = () => {
  return (
    <Card className="mb-2">
      <Stack direction="row" alignItems="center" justifyContent="between" spacing={3}>
        <Stack direction="row" spacing={2} className="w-full">
          <TextLine
            round="rounded-full"
            height="h-10"
            width="w-10"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack
            direction="column"
            spacing={1}
            className="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
          >
            <TextLine title="tagName" animated={true} width="w-[110px]" height="h-[1rem]" />
            <TextLine title="tagName" animated={true} width="w-[88px]" height="h-[1rem]" />
          </Stack>
        </Stack>

        <Stack className="w-28 py-1 shrink-0">
          <TextLine
            title="tagName"
            animated={true}
            width="w-[5rem]"
            height="h-[1.5rem]"
            round="rounded"
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default TagFeedHeaderLoader;
