import React, { ReactNode } from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { getRadiusClasses, getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import Box from '@akashaorg/design-system-core/lib/components/Box';

type App = {
  id?: string;
  name: string;
  description: string;
  action: ReactNode;
};

export type AppListProps = {
  apps: App[];
  onAppSelected: (appId: string) => void;
};

const AppList: React.FC<AppListProps> = ({ apps, onAppSelected }) => {
  const iconStyle = `shrink-0	${getRadiusClasses(10)} ${getColorClasses(
    { light: 'grey6', dark: 'grey5' },
    'bg',
  )} w-[3.75rem] h-[3.75rem]`;

  return (
    <Stack direction="column" spacing="gap-y-4">
      {apps?.map((app, index, array) => (
        <Stack key={app.name} direction="column" spacing="gap-y-4">
          <Stack justify="between" align="center">
            <Button onClick={() => onAppSelected(app.id)} plain>
              <Stack spacing="gap-x-2">
                <Box customStyle={iconStyle} />

                <Stack direction="column" customStyle="h-[3.75rem]">
                  <Text variant="button-sm">{app.name}</Text>

                  <Text
                    variant="footnotes2"
                    weight="normal"
                    color={{ light: 'grey4', dark: 'grey7' }}
                    lineClamp={2}
                  >
                    {app.description}
                  </Text>
                </Stack>
              </Stack>
            </Button>

            <Box customStyle="ml-auto">{app.action}</Box>
          </Stack>
          {index < array.length - 1 && <Divider />}
        </Stack>
      ))}
    </Stack>
  );
};

export default AppList;
