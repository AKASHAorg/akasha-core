import React from 'react';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import {
  PageHeader,
  PageHeaderProps,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { TSection } from './admin';
export type ModeratorSettingsProps = PageHeaderProps & {
  sections: {
    one: TSection;
    two: TSection;
  };
};
export const ModeratorSettings: React.FC<ModeratorSettingsProps> = props => {
  const {
    sections: { one, two },
  } = props;
  return (
    <PageHeader {...props}>
      <Stack spacing={4} className="mb-24">
        <Stack direction="row" alignItems="center" justifyContent="between">
          <Typography variant="sm" bold className="text-black dark:text-grey6">
            {one.title}
          </Typography>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey7">
            01-Jan-2015
          </Typography>
        </Stack>
        <Separator />
        <Stack direction="row" alignItems="start" justifyContent="between">
          <Stack spacing={3}>
            <Typography variant="sm" bold className="text-black dark:text-grey6">
              {two.title}
            </Typography>
            <Typography variant="xs" className="font-medium font-normal">
              {two.description}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </PageHeader>
  );
};
