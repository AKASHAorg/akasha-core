import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { IntegrationReleaseInfoFragmentFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { IntegrationReleaseInfo } from '@akashaorg/typings/sdk/graphql-types';
import { AppList } from '@akashaorg/design-system-components/lib/components/AppList';
import { INFO } from '../../routes';

export interface IMyAppsPage extends RootComponentProps {
  latestReleasesInfo?: IntegrationReleaseInfoFragmentFragment[];
  installedAppsInfo?: IntegrationReleaseInfo[];
  defaultIntegrations?: string[];
  isFetching?: boolean;
}

const MyAppsPage: React.FC<IMyAppsPage> = props => {
  const { worldConfig, latestReleasesInfo, installedAppsInfo, defaultIntegrations, isFetching } =
    props;

  const { t } = useTranslation('app-integration-center');

  const defaultApps = [].concat(worldConfig.defaultApps, [worldConfig.homepageApp]);

  const defaultAppsNamesNormalized = React.useMemo(() => {
    return defaultApps.map(app => {
      if (typeof app === 'string') {
        return {
          name: app,
        };
      }
      return app;
    });
  }, [defaultApps]);

  // select default apps from list of installed apps
  const filteredDefaultApps = latestReleasesInfo?.filter(app => {
    if (defaultAppsNamesNormalized?.some(defaultApp => defaultApp.name === app.name)) {
      return app;
    }
  });
  // select user installed apps from list of installed apps
  const filteredInstalledApps = latestReleasesInfo
    ?.filter(app => {
      if (!installedAppsInfo?.length) {
        return null;
      }
      if (!defaultIntegrations?.some(defaultApp => defaultApp === app.name)) {
        return app;
      }
    })
    .filter(Boolean);

  const handleAppClick = (app: IntegrationReleaseInfoFragmentFragment) => {
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: routes => `${routes[INFO]}/${app.integrationID}`,
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

  /*@TODO: replace with the relevant hook once it's ready */
  const dummyDefaultApps = [
    {
      name: 'Social Feed',
      description:
        'Keep up with what’s happening in the world! The social feed is the star app of AKASHA World.',
      action: (
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
          Default App
        </Text>
      ),
    },
    {
      name: 'Profile App',
      description:
        'Control your profile, your preferences and everything else about you from the profile app.',
      action: (
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
          Default App
        </Text>
      ),
    },
    {
      name: 'Settings App',
      description:
        'You can control many things through the Settings app, like changing your theme, analytics options among many other things.',
      action: (
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
          Default App
        </Text>
      ),
    },
  ];

  return (
    <Stack direction="column" spacing="gap-y-4">
      <Text variant="h6">{t('Installed Apps')}</Text>
      {dummyInstalledApps.length ? (
        <AppList apps={dummyInstalledApps} />
      ) : (
        <InfoCard
          titleLabel={t('There are no apps installed yet')}
          bodyLabel={t('You can install cool apps from the apps section')}
          titleVariant="h6"
          bodyVariant="footnotes2"
        />
      )}
      <Text variant="h6">{t('Default Apps')}</Text>
      <AppList apps={dummyDefaultApps} />
    </Stack>
  );
};

export default MyAppsPage;
