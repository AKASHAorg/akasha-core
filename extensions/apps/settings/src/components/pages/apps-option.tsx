import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import PageLayout from './base-layout';

const AppsOption: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');

  const [checkedAutoUpdates, setCheckedAutoUpdates] = useState<boolean>(false);
  const [checkedDataAnalytics, setCheckedDataAnalytics] = useState<boolean>(false);

  const handleAutoUpdatesChange = event => {
    setCheckedAutoUpdates(event.target.checked);
    // @TODO: handle auto updates subscription
  };

  const handleDataAnalyticsChange = event => {
    setCheckedDataAnalytics(event.target.checked);
    // @TODO: handle data analytics subscription
  };

  return (
    <PageLayout title={t('Apps')}>
      <Stack className="px-4">
        {/* automatic updates */}
        <Stack className="py-4 border border-border">
          <Stack justifyContent="between" alignItems="center" className="mb-2">
            <Text weight="bold">{t('Automatic Updates')}</Text>

            <Toggle
              checked={checkedAutoUpdates}
              onChange={handleAutoUpdatesChange}
              disabled={true}
            />
          </Stack>

          <Text>
            {t('Ensure you have all the latest version of your apps, widgets & plugins. ')}
          </Text>
        </Stack>

        {/* data and analytics */}
        <Stack className="py-4 border border-border">
          <Stack justifyContent="between" alignItems="center" className="mb-2">
            <Text weight="bold">{t('Data & Analytics')}</Text>

            <Toggle
              checked={checkedDataAnalytics}
              onChange={handleDataAnalyticsChange}
              disabled={true}
            />
          </Stack>

          <Text>
            {t(
              'We track usage data and report any bugs or issues, by activting data will be able to report any issues one app usage.',
            )}
          </Text>
        </Stack>
      </Stack>
    </PageLayout>
  );
};

export default AppsOption;
