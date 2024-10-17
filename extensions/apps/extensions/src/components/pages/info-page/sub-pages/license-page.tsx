import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import InfoSubRouteHeader from '../InfoSubroutePageHeader';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

type LicensePageProps = {
  appId: string;
  license?: string;
  extensionLogo?: AppImageSource;
  extensionName?: string;
  extensionDisplayName?: string;
  extensionType?: AkashaAppApplicationType;
};

export const LicensePage = (props: LicensePageProps) => {
  const { license, extensionDisplayName, extensionName, extensionLogo, extensionType } = props;
  const { t } = useTranslation('app-extensions');
  // @TODO get license data from the hook when available

  const mockLicenseData =
    'Explanations of what does this license mean for consumer and also for app dev and collab.';
  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <InfoSubRouteHeader
            pageTitle={t('License')}
            appName={extensionDisplayName}
            packageName={extensionName}
            appLogo={extensionLogo}
            appType={extensionType}
          />
          <Divider />
          <Text variant="h6">{`"${license}"`}</Text>
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
