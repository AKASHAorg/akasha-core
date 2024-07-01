import React, { ReactElement, ReactNode } from 'react';

import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { getRadiusClasses, getColorClasses } from '@akashaorg/design-system-core/lib/utils';

type App = {
  id?: string;
  name: string;
  icon?: ReactElement;
  isSolidIcon?: boolean;
  description: string;
  action: ReactNode;
};

export type AppListProps = {
  apps: App[];
};

/**
 * Component that renders a list of apps
 * @param apps - array of extensions
 * @param onAppSelected - handler for clicking on an app from the list
 */
const AppList: React.FC<AppListProps> = ({ apps }) => {
  const iconStyle = `shrink-0	${getRadiusClasses(10)} ${getColorClasses(
    { light: 'grey6', dark: 'grey5' },
    'bg',
  )} w-[3.75rem] h-[3.75rem]`;

  return (
    <Stack spacing="gap-y-4">
      {apps?.map((app, index, array) => (
        <Stack key={app.name} spacing="gap-y-4">
          <Stack direction="row" justify="between" align="center" spacing="gap-x-8">
            <Stack direction="row" spacing="gap-x-3">
              <Stack align="center" justify="center" customStyle={iconStyle}>
                {app.icon && (
                  <Icon
                    solid={app.isSolidIcon}
                    icon={app.icon}
                    accentColor={true}
                    size={{ width: 'w-8', height: 'h-8' }}
                  />
                )}
              </Stack>
              <Stack direction="column" justify="between">
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

            {app.action}
          </Stack>
          {index < array.length - 1 && <Divider />}
        </Stack>
      ))}
    </Stack>
  );
};

export default AppList;
