import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { IntegrationReleaseInfoFragmentFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { IntegrationReleaseInfo } from '@akashaorg/typings/sdk/graphql-types';
import { INFO } from '../../routes';

export interface IWidgetsPage extends RootComponentProps {
  latestReleasesInfo?: IntegrationReleaseInfoFragmentFragment[];
  installedAppsInfo?: IntegrationReleaseInfo[];
  defaultIntegrations?: string[];
  isFetching?: boolean;
}

const MyWidgetsPage: React.FC<IWidgetsPage> = props => {
  const { worldConfig, latestReleasesInfo, isFetching } = props;

  const { t } = useTranslation('app-integration-center');

  const defaultWidgetNamesNormalized = React.useMemo(() => {
    return worldConfig?.defaultWidgets.map(app => {
      if (typeof app === 'string') {
        return {
          name: app,
        };
      }
      return app;
    });
  }, [worldConfig.defaultWidgets]);

  // select default widgets from list of installed integrations
  const filteredDefaultWidgets = latestReleasesInfo?.filter(app => {
    if (defaultWidgetNamesNormalized?.some(defaultWidget => defaultWidget.name === app.name)) {
      return app;
    }
  });

  const handleAppClick = (app: IntegrationReleaseInfo) => {
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: routes => `${routes[INFO]}/${app.integrationID}`,
    });
  };

  /*@TODO: replace with the relevant hook once it's ready */
  const dummyNewestWidgets = [
    {
      name: 'Widget 1',
      description:
        'Send direct messages to your followers or people who have this application, you must be following each other to be able to send messages.',
      action: <Button label="Install" variant="primary" />,
    },
    {
      name: 'Widget 2',
      description:
        'Add some custom emojis to your posts, replies, Articles or even in your messages. Just so you know, for people to be able to see these ...',
      action: <Button label="Install" variant="primary" />,
    },
  ];

  return (
    <Stack direction="column" spacing="gap-y-4">
      <Text variant="h6">{t('Newest Widgets')}</Text>
      <AppList apps={dummyNewestWidgets} />
    </Stack>
  );
};

export default MyWidgetsPage;
