import React, { PropsWithChildren } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export interface IBaseLayout {
  title: string;
}
const BaseLayout: React.FC<PropsWithChildren<IBaseLayout>> = props => {
  const { title, children } = props;
  return (
    <Card className="p-0">
      <Stack padding="p-4" customStyle="border-b-1 border-solid border-grey8 dark:border-grey5">
        <Typography variant="h5" className="text-center">
          {title}
        </Typography>
      </Stack>

      {children}
    </Card>
  );
};
export default BaseLayout;
