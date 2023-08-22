import React from 'react';

import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const TrendingWidgetLoadingCard: React.FC = () => {
  return (
    <Stack direction="row" spacing="gap-y-2" align="center" justify="between">
      <Stack direction="row" spacing="gap-x-1">
        <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
        <Stack
          direction="column"
          spacing="gap-y-1"
          customStyle="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
        >
          <TextLine title="tagName" animated={true} width="w-[80px]" />
          <TextLine title="tagName" animated={true} width="w-[100px]" />
        </Stack>
      </Stack>

      <TextLine
        title="tagName"
        animated={true}
        width="w-[5rem]"
        height="h-[2rem]"
        round="rounded-full"
      />
    </Stack>
  );
};

export default TrendingWidgetLoadingCard;
