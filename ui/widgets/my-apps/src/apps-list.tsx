import * as React from 'react';
import { IconType } from '@akashaorg/typings/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type AppListProps = {
  apps: { name: string; appId: string; appIcon: IconType }[];
  onAppClick?: (appId: string) => void;
  onAppActionClick?: (appId: string) => void;
  appAction?: React.ReactElement;
};

const AppsList: React.FC<AppListProps> = props => {
  const { apps, onAppClick, onAppActionClick, appAction } = props;

  const handleAppClick = (appId: string) => () => {
    if (onAppClick) {
      onAppClick(appId);
    }
  };
  const handleAppActionClick = (appId: string) => () => {
    if (onAppActionClick) {
      onAppActionClick(appId);
    }
  };

  return (
    <Stack direction="column" spacing="gap-y-4">
      {apps.map((app, index) => (
        <Stack
          key={`${app.name}-${index}`}
          direction="row"
          align="center"
          spacing="gap-x-4"
          customStyle="px-4"
          fullWidth={true}
        >
          <Stack direction="row" customStyle="content-between flex-grow justify-between">
            <Box customStyle="cursor-pointer flex flex-row" onClick={handleAppClick(app.name)}>
              <Icon
                type="PaperAirplaneIcon"
                size="md"
                customStyle="p-4 bg(grey6 dark:grey5) rounded-xl mr-4"
              />
              <Stack direction="column" customStyle="cursor-pointer">
                <Text variant="body2" customStyle="truncate">
                  {app.name}
                </Text>
                <Text
                  weight="normal"
                  variant="footnotes2"
                  color={{ light: 'grey4', dark: 'grey7' }}
                  customStyle="truncate"
                >
                  {app.name}
                </Text>
              </Stack>
            </Box>
            <Stack justify="center" align="center">
              <Box onClick={handleAppActionClick(app.appId)}>{React.cloneElement(appAction)}</Box>
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default AppsList;
