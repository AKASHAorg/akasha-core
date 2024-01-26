import React, { useRef, useState } from 'react';
import { EventTypes } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import PageLayout from './base-layout';
import { BaseOption } from './settings-page';
import { useGetLogin, useNsfwToggling, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export type NsfwOption = BaseOption & {
  introLabel: string;
  subtitleLabel: string;
};

const NsfwOption: React.FC<NsfwOption> = props => {
  const { titleLabel, introLabel, subtitleLabel } = props;
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
    <PageLayout title={titleLabel}>
      <Stack padding="p-4">
        <Stack direction="row" justify="between" align="center" customStyle="mb-2">
          <Text weight="bold">{introLabel}</Text>
          <Toggle checked={showNsfw} onChange={handleNsfwToggle} />
        </Stack>

        <Text>{subtitleLabel}</Text>
      </Stack>
    </PageLayout>
  );
};

export default NsfwOption;
