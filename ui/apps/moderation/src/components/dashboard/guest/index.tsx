import React from 'react';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type GuestProps = {
  publicImgPath?: string;
  assetName?: string;
  assetExtension?: string;
  navigateTo: (args: NavigateToParams) => void;
};

const GuestDashboard: React.FC<GuestProps> = props => {
  const {
    assetName = 'moderation',
    assetExtension = 'webp',
    publicImgPath = '/images',
    navigateTo,
  } = props;
  const { t } = useTranslation('app-moderation-ewa');

  const handleCodeOfConductClick = () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  return (
    <Card padding="p-4">
      <Box customStyle="grid gap-4 grid-cols-1">
        <Text variant="h5" align="center">
          {t('Moderating')}
        </Text>

        <Box customStyle="w-40 h-40 my-2 mx-auto">
          <Image src={`${publicImgPath}/${assetName}.${assetExtension}`} />
        </Box>

        <Text weight="bold" align="center">
          {t('Are you interested in Moderating?')}
        </Text>

        <Text variant="subtitle2" align="center">
          {t(
            "We are currently creating new Moderating Systems for Akasha World. If you'd like to join us click",
          )}{' '}
          <Anchor
            href="https://akasha-foundation.notion.site/The-AKASHA-Moderating-Open-Design-Challenge-15cb49cf57e740be92534958828ca210"
            customStyle="font-bold"
          >
            {t('here')}
          </Anchor>
        </Text>

        <Text variant="subtitle2" align="center">
          {t('Visit our')}{' '}
          <Button plain={true} onClick={handleCodeOfConductClick}>
            <Text
              variant="subtitle2"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              weight="bold"
              align="center"
            >
              {t('Code of Conduct')}
            </Text>
          </Button>{' '}
          {t('to learn more about our moderation criteria')}
        </Text>
      </Box>
    </Card>
  );
};

export default GuestDashboard;
