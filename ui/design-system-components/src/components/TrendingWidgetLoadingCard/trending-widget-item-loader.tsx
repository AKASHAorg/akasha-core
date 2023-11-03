import React from 'react';

import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const TrendingWidgetItemLoader: React.FC = () => {
  return (
    <Stack direction="row" spacing="gap-x-12" align="center" justify="between" fullWidth>
      <Stack direction="row" spacing="gap-x-2" fullWidth>
        <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
        <Stack
          direction="column"
          spacing="gap-y-1"
          customStyle="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
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
