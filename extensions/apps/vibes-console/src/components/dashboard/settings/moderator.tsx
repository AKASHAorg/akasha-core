import React from 'react';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import {
  PageHeader,
  PageHeaderProps,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack spacing="gap-y-4" customStyle="mb-24">
        <Stack direction="row" align="center" justify="between">
          <Typography variant="sm" bold className="text-black dark:text-grey6">
            {one.title}
          </Typography>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey7">
            01-Jan-2015
          </Typography>
        </Stack>
        <Divider />
        <Stack direction="row" align="start" justify="between">
          <Stack spacing="gap-y-3">
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
