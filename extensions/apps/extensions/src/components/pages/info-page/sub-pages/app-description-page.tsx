import React from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import InfoSubRoutePageHeader from '../InfoSubroutePageHeader';
import { useTranslation } from 'react-i18next';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

type AppDescriptionPageProps = {
  appId: string;
  description?: string;
  extensionLogo?: AppImageSource;
  extensionName?: string;
  extensionDisplayName?: string;
  extensionType?: AkashaAppApplicationType;
};

export const AppDescriptionPage = (props: AppDescriptionPageProps) => {
  const { description, extensionLogo, extensionDisplayName, extensionName, extensionType } = props;
  const { t } = useTranslation();

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <InfoSubRoutePageHeader
            pageTitle={t('Description')}
            appName={extensionDisplayName}
            packageName={extensionName}
            appLogo={extensionLogo}
            appType={extensionType}
          />
          <Divider />
          <Stack spacing="gap-y-4">
            <Text variant="body2">{description}</Text>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
