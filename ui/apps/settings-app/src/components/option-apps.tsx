import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
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
      <Box customStyle="px-4">
        {/* automatic updates */}
        <Box customStyle="py-4 border(b-1 solid grey8)">
          <Box customStyle="flex justify-between items-center mb-2">
            <Text weight="bold">{autoUpdatesLabel}</Text>

            <Toggle checked={checkedAutoUpdates} onChange={onAutoUpdatesChange} disabled={true} />
          </Box>

          <Text>{autoUpdatesInfo}</Text>
        </Box>

        {/* data and analytics */}
        <Box customStyle="py-4 border(b-1 solid grey8)">
          <Box customStyle="flex justify-between items-center mb-2">
            <Text weight="bold">{dataAnalyticsLabel}</Text>

            <Toggle
              checked={checkedDataAnalytics}
              onChange={onDataAnalyticsChange}
              disabled={true}
            />
          </Box>

          <Text>{dataAnalyticsinfo}</Text>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default AppsOption;
