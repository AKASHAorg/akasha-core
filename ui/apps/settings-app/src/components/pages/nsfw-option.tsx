import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import PageLayout from './base-layout';
import { useGetLogin, useNsfwToggling, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

const NsfwOption: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');

  const { data, loading } = useGetLogin();
  const isLoggedIn = !!data?.id;

  const { getRoutingPlugin } = useRootComponentProps();
  const routingPlugin = useRef(getRoutingPlugin());

  const { showNsfw, toggleShowNsfw } = useNsfwToggling();

  if (!isLoggedIn && !loading) {
    // if not logged in, redirect to homepage
    routingPlugin.current?.navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: () => '/',
    });
  }

  const handleNsfwToggle = () => {
    toggleShowNsfw(!showNsfw);
  };

  return (
    <PageLayout title={t('NSFW Content')}>
      <Stack padding="p-4">
        <Stack direction="row" justify="between" align="center" customStyle="mb-2">
          <Text weight="bold">{t('Show NSFW Content')}</Text>
          <Toggle checked={showNsfw} onChange={handleNsfwToggle} />
        </Stack>

        <Text>
          {t(
            'If you enable NSFW content, any sensitive content will show up in your search results when you lookup anything.',
          )}
        </Text>
      </Stack>
    </PageLayout>
  );
};

export default NsfwOption;
