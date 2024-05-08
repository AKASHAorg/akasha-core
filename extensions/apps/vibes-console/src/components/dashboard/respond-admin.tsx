import React from 'react';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type RespondAdminProps = PageHeaderProps & {
  introLabel: string;
  tasks: string[];
};

export const RespondAdmin: React.FC<RespondAdminProps> = props => {
  const { introLabel, tasks } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4" customStyle="mb-24">
        <Text variant="button-lg" color={{ light: 'secondaryLight', dark: 'secondaryLight' }}>
          @helloKitty{' '}
          <Text as="span" variant="body1" weight="normal">
            {introLabel}:
          </Text>
        </Text>
        <ul className="ml-4 list-disc text(black dark:white)">
          {tasks.map(t => (
            <li key={t}>
              <Text variant="body1" weight="normal">
                {t}.
              </Text>
            </li>
          ))}
        </ul>
      </Stack>
    </PageHeader>
  );
};
