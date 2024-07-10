import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';

type AppDescriptionPageProps = {
  appId: string;
};

export const AppDescriptionPage: React.FC<AppDescriptionPageProps> = ({ appId }) => {
  const { t } = useTranslation('app-extensions');
  // @TODO get app description from the hook when available

  const mockDescriptionData =
    'This is a brief description of the extension, highlighting its main features and functionality. Explaining what it does and how it benefits the user in a couple of concise sentences.';

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader
            appName={'Extension Name'}
            packageName="Package name"
            pageTitle={t('Description')}
          />
          <Divider />
          {!!mockDescriptionData && (
            <Stack spacing="gap-y-4">
              <Text variant="body2">
                {t('{{description}}', { description: mockDescriptionData })}
              </Text>
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};
