import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Discord } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

type ContactSupportPageProps = {
  appId: string;
};

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ appId }) => {
  const { t } = useTranslation('app-extensions');
  // @TODO get contact data from the hook when available

  const mockContactDetails = ['https://supercarts.github.com', 'supercarts@supercarts.com'];
  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader
            appName={'Extension Name'}
            packageName="Package name"
            pageTitle={t('Extension Support')}
          />
          <Divider />
          {!!mockContactDetails &&
            mockContactDetails.map((contactDetails, idx) => {
              const icon = contactDetails.includes('@') ? <EnvelopeIcon /> : <Discord />;
              return (
                <CopyToClipboard key={idx} value={contactDetails}>
                  <Stack direction="row" align="center" spacing="gap-x-2">
                    <AppIcon placeholderIcon={icon} solid={false} size="xs" accentColor />
                    <Text
                      variant="body2"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      breakWord
                    >
                      {contactDetails}
                    </Text>
                  </Stack>
                </CopyToClipboard>
              );
            })}
        </Stack>
      </Card>
    </>
  );
};
