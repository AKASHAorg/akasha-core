import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  GetAppsQuery,
  GetAppsByIdQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { INFO } from '../../routes';

export type MyAppsPageProps = {
  availableApps?: GetAppsQuery['akashaAppIndex']['edges'];
  installedAppsInfo?: GetAppsByIdQuery['node'][];
  defaultIntegrations?: string[];
};

export const MyAppsPage: React.FC<MyAppsPageProps> = props => {
  const { availableApps } = props;

  const { t } = useTranslation('app-extensions');
  const { worldConfig, getRoutingPlugin } = useRootComponentProps();

  const defaultApps = [].concat(worldConfig.defaultApps, [worldConfig.homepageApp]);

  const defaultAppsNamesNormalized = React.useMemo(() => {
    return defaultApps?.map(app => {
      if (typeof app === 'string') {
        return {
          name: app,
        };
      }
      return app;
    });
  }, [defaultApps]);

  // select default apps from list of installed apps
  const filteredDefaultApps = availableApps?.filter(app => {
    if (defaultAppsNamesNormalized?.some(defaultApp => defaultApp.name === app.node?.name)) {
      return app;
    }
  });

  const defaultAppsInfo = filteredDefaultApps?.map(app => {
    return {
      id: app.node.id,
      name: app.node.displayName,
      description: app.node.description,
      action: (
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
          Default App
        </Text>
      ),
    };
  });

  /**
   * TODO: select user installed apps from list of installed apps
   */
  // const filteredInstalledApps = availableApps
  //   ?.filter(app => {
  //     if (!installedAppsInfo?.length) {
  //       return null;
  //     }
  //     if (!defaultIntegrations?.some(defaultApp => defaultApp === app.node?.name)) {
  //       return app;
  //     }
  //   })
  //   .filter(Boolean);

  const handleAppClick = appId => {
    getRoutingPlugin().navigateTo?.({
      appName: '@akashaorg/app-extensions',
      getNavigationUrl: routes => `${routes[INFO]}/${appId}`,
    });
  };

  /*@TODO: replace with the relevant hook once it's ready */
  const dummyInstalledApps = [
    {
      name: 'Direct Messaging',
      description:
        'Send direct messages to your followers or people who have this application, you must be following each other to be able to send messages.',
      action: <Button label="Open" variant="primary" />,
    },
    {
      name: 'Emoji App',
      description:
        'Add some custom emojis to your posts, replies, Articles or even in your messages. Just so you know, for people to be able to see these ...',
      action: <Button label="Open" variant="primary" />,
    },
  ];

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h6">{t('Installed Apps')}</Text>
      {dummyInstalledApps.length ? (
        <AppList
          apps={dummyInstalledApps}
          onAppSelected={() => {
            /*TODO: get app id from new hooks when they are ready and navigate to info page*/
          }}
        />
      ) : (
        <InfoCard
          titleLabel={t('There are no apps installed yet')}
          bodyLabel={t('You can install cool apps from the apps section')}
          titleVariant="h6"
          bodyVariant="footnotes2"
        />
      )}
      <Text variant="h6">{t('Default Apps')}</Text>
      <AppList apps={defaultAppsInfo} onAppSelected={handleAppClick} />
    </Stack>
  );
};
