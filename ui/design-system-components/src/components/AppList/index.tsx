import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React, { ReactNode } from 'react';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { apply, tw } from '@twind/core';
import { getRadiusClasses } from '@akashaorg/design-system-core/lib/utils/getRadiusClasses';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';

type App = {
  name: string;
  description: string;
  action: ReactNode;
};

export type AppListProp = {
  apps: App[];
  onAppSelected: () => void;
};

const AppList: React.FC<AppListProp> = ({ apps, onAppSelected }) => {
  const iconStyle = `${getRadiusClasses(10)} ${getColorClasses(
    { light: 'grey6', dark: 'grey5' },
    'bg',
  )} w-[3.75rem] h-[3.75rem]`;

  return (
    <Stack direction="column" spacing="gap-y-4">
      {apps.map((app, index, array) => (
        <Stack key={app.name} direction="column" spacing="gap-y-4">
          <Stack justify="between">
            <Button onClick={onAppSelected} plain>
              <Stack spacing="gap-x-2">
                <div className={tw(apply(iconStyle))} />
                <Stack direction="column" customStyle="h-[3.75rem] w-[25rem]">
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
            <div className={tw('ml-auto')}>{app.action}</div>
          </Stack>
          {index < array.length - 1 && <Divider />}
        </Stack>
      ))}
    </Stack>
  );
};

export default AppList;
