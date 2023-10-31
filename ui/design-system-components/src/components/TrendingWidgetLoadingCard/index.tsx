import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import TrendingWidgetItemLoader from './trending-widget-item-loader';

const TrendingWidgetLoadingCard: React.FC = () => {
  return (
    <Card radius="rounded-2xl">
      <Stack direction="column" spacing="gap-y-2" align="center" fullWidth>
        <Stack direction="column" spacing="gap-y-6" align="start" fullWidth>
          <TextLine width="w-3/6" height="h-[1.5rem]" animated />
          {Array.from({ length: 3 }, (_el, index: number) => (
            <React.Fragment key={index}>
              <TrendingWidgetItemLoader />
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default TrendingWidgetLoadingCard;
