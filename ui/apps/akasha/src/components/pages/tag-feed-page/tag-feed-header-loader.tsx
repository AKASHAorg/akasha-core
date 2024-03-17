import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const TagFeedHeaderLoader: React.FC = () => {
  return (
    <Card customStyle="mb-2">
      <Stack direction="row" align="center" justify="between" spacing="gap-x-3">
        <Stack direction="row" spacing="gap-x-2" fullWidth>
          <TextLine
            round="rounded-full"
            height="h-10"
            width="w-10"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack
            direction="column"
            spacing="gap-y-1"
            customStyle="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
          >
            <TextLine title="tagName" animated={true} width="w-[110px]" height="h-[1rem]" />
            <TextLine title="tagName" animated={true} width="w-[88px]" height="h-[1rem]" />
          </Stack>
        </Stack>

        <Stack customStyle={`w-28 py-1 shrink-0`}>
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
