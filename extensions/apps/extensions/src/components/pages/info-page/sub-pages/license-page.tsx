import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';

type LicensePageProps = {
  appId: string;
};

export const LicensePage: React.FC<LicensePageProps> = ({ appId }) => {
  const { t } = useTranslation('app-extensions');
  // @TODO get license data from the hook when available

  const mockLicenseData =
    'Explanations of what does this license mean for consumer and also for app dev and collab.';
  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader
            appName={'Extension Name'}
            packageName="Package name"
            pageTitle={t('Permissions')}
          />
          <Divider />
          {!!mockLicenseData && (
            <Stack spacing="gap-y-4">
              <Text variant="body2">{t('{{licenseText}}', { licenseText: mockLicenseData })}</Text>
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};
