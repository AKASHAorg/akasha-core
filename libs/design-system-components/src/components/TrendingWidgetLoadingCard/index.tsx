import React from 'react';

import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';
import TrendingWidgetItemLoader from './trending-widget-item-loader';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the trending widget
 */
const TrendingWidgetLoadingCard: React.FC = () => {
  return (
    <Card>
      <Stack direction="column" spacing={2} alignItems="center" className="w-full">
        <Stack direction="column" spacing={6} alignItems="start" className="w-full">
          <Skeleton className="w-3/6 h-[1.5rem]" />
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
