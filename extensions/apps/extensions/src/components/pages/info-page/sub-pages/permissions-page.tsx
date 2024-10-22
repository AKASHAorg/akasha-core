import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';
import { KeyIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

type PermissionsPageProps = {
  appId: string;
};

export const PermissionsPage: React.FC<PermissionsPageProps> = () => {
  const { t } = useTranslation('app-extensions');
  // @TODO get permission info from the hook when available

  const mockPermissionData = [
    'Access to Antenna App to curate the feed',
    'Access to Profile App to adjust profile actions',
  ];

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader
            appName={'Extension Name'}
            packageName="Package name"
            pageTitle={t('Permissions')}
            description={t(
              'The following permissions will be needed for you to get the full experience with this extension:',
            )}
          />
          <Divider />
          {mockPermissionData?.length > 0 &&
            mockPermissionData.map((permission, idx) => (
              <Stack key={idx} spacing="gap-y-4">
                <Stack direction="row" align="center" spacing="gap-x-2">
                  <Stack
                    direction="row"
                    align="center"
                    justify="center"
                    customStyle={'bg(grey8 dark:grey3) rounded-full w-8 h-8'}
                  >
                    <Icon icon={<KeyIcon />} size={{ width: 'w-4', height: 'h-5' }} />
                  </Stack>
                  <Text variant="footnotes2">{t('{{permission}}', { permission })}</Text>
                </Stack>
                {idx < mockPermissionData.length - 1 && <Divider />}
              </Stack>
            ))}
        </Stack>
      </Card>
    </>
  );
};
