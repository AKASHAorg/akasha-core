import React from 'react';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type RespondAdminProps = PageHeaderProps & {
  introLabel: string;
  tasks: string[];
};
export const RespondAdmin: React.FC<RespondAdminProps> = props => {
  const { introLabel, tasks } = props;
  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4" customStyle="mb-24">
        <Typography bold className="text-secondaryLight dark:text-secondaryLight">
          @helloKitty <Typography className="font-normal">{introLabel}:</Typography>
        </Typography>
        <ul className="ml-4 list-disc text-black dark:text-white">
          {tasks.map(t => (
            <li key={t}>
              <Typography className="font-normal">{t}.</Typography>
            </li>
          ))}
        </ul>
      </Stack>
    </PageHeader>
  );
};
