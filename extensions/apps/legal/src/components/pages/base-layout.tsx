import React, { PropsWithChildren } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export interface IBaseLayout {
  title: string;
}
const BaseLayout: React.FC<PropsWithChildren<IBaseLayout>> = props => {
  const { title, children } = props;
  return (
    <Card className="p-0">
      <Stack className="p-4 border-b-1 border-solid border-grey8 dark:border-grey5">
        <Typography variant="h5" className="text-center">
          {title}
        </Typography>
      </Stack>

      {children}
    </Card>
  );
};
export default BaseLayout;
