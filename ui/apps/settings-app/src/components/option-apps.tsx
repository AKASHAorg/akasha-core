import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import PageLayout from './base-layout';
import { BaseOption } from './settings-page';

export interface IAppsOption extends BaseOption {
  autoUpdatesLabel: string;
  autoUpdatesInfo: string;
  dataAnalyticsLabel: string;
  dataAnalyticsinfo: string;
  checkedAutoUpdates: boolean;
  checkedDataAnalytics: boolean;
  onAutoUpdatesChange: (ev: React.SyntheticEvent) => void;
  onDataAnalyticsChange: (ev: React.SyntheticEvent) => void;
}

const AppsOption: React.FC<IAppsOption> = props => {
  const {
    titleLabel,
    autoUpdatesLabel,
    autoUpdatesInfo,
    dataAnalyticsLabel,
    dataAnalyticsinfo,
    checkedAutoUpdates,
    checkedDataAnalytics,
    onAutoUpdatesChange,
    onDataAnalyticsChange,
  } = props;

  return (
    <PageLayout title={titleLabel}>
      <Stack customStyle="px-4">
        {/* automatic updates */}
        <Stack customStyle="py-4 border(b-1 solid grey8)">
          <Stack justify="between" align="center" customStyle="mb-2">
            <Text weight="bold">{autoUpdatesLabel}</Text>

            <Toggle checked={checkedAutoUpdates} onChange={onAutoUpdatesChange} disabled={true} />
          </Stack>

          <Text>{autoUpdatesInfo}</Text>
        </Stack>

        {/* data and analytics */}
        <Stack customStyle="py-4 border(b-1 solid grey8)">
          <Stack justify="between" align="center" customStyle="mb-2">
            <Text weight="bold">{dataAnalyticsLabel}</Text>

            <Toggle
              checked={checkedDataAnalytics}
              onChange={onDataAnalyticsChange}
              disabled={true}
            />
          </Stack>

          <Text>{dataAnalyticsinfo}</Text>
        </Stack>
      </Stack>
    </PageLayout>
  );
};

export default AppsOption;
