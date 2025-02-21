import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

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

      <TextLine
        title="tagName"
        animated={true}
        width="w-[5rem]"
        height="h-[1.5rem]"
        round="rounded"
      />
    </Stack>
  );
};

export default TrendingWidgetItemLoader;
