import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Switch } from '@akashaorg/ui/lib/components/switch';
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
            <Typography bold>{t('Automatic Updates')}</Typography>
            <Switch
              checked={checkedAutoUpdates}
              onCheckedChange={handleAutoUpdatesChange}
              disabled={true}
            />
          </Stack>

          <Typography>
            {t('Ensure you have all the latest version of your apps, widgets & plugins. ')}
          </Typography>
        </Stack>

        {/* data and analytics */}
        <Stack className="py-4 border border-border">
          <Stack justifyContent="between" alignItems="center" className="mb-2">
            <Typography bold>{t('Data & Analytics')}</Typography>

            <Switch
              checked={checkedDataAnalytics}
              onCheckedChange={handleDataAnalyticsChange}
              disabled={true}
            />
          </Stack>

          <Typography>
            {t(
              'We track usage data and report any bugs or issues, by activting data will be able to report any issues one app usage.',
            )}
          </Typography>
        </Stack>
      </Stack>
    </PageLayout>
  );
};
export default AppsOption;
