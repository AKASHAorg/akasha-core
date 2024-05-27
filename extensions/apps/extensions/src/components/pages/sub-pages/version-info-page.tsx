import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';
import ExtensionVersionBulletPointCard from '@akashaorg/design-system-components/lib/components/ExtensionVersionBulletPointCard';
import ContentBlock from '@akashaorg/design-system-core/lib/components/ContentBlock';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

type VersionHeaderProps = {
  version: string;
  versionDate: string;
  ethAddressLabel: string;
  ethAddress: string;
};
const VersionHeader: React.FC<VersionHeaderProps> = ({
  version,
  versionDate,
  ethAddressLabel,
  ethAddress,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="row" justify="between">
        <Text variant="h6">{version}</Text>
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
          {versionDate}
        </Text>
      </Stack>
      <Stack direction="column" spacing="gap-y-2">
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
          {ethAddressLabel}
        </Text>
        <Text variant="footnotes2" color={{ light: 'grey5', dark: 'grey7' }}>
          {ethAddress}
        </Text>
      </Stack>
    </Stack>
  );
};
type VersionInfoPageProps = {
  appId: string;
};

export const VersionInfoPage: React.FC<VersionInfoPageProps> = ({ appId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  // @TODO get version info from the hook when available
  const mockAppVersionData = {
    version: '2.8.0',
    versionDate: 'April 2024',
    ethAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
    newFeatures: ['Edit image after upload', 'Ability to add filters and stickers'],
    bugFixes: [
      'Image upload problems',
      'Stickers not appearing when searching',
      'Gallery Carrousel problem',
    ],
    releaseNote:
      'All problems from previous version have been fixed. We cannot guarantee that it’ll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.',
  };

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader appName={'Extension Name'} packageName="Package name" />
          <Divider />
          <VersionHeader
            version={mockAppVersionData.version}
            versionDate={t('Version {{version}}', { version: mockAppVersionData.versionDate })}
            ethAddressLabel={t('Eth Address')}
            ethAddress={mockAppVersionData.ethAddress}
          />
          <Divider />
          <ExtensionVersionBulletPointCard
            featureTitle={t('New Features')}
            itemList={mockAppVersionData.newFeatures}
          />
          <ExtensionVersionBulletPointCard
            featureTitle={t('Bug Fixes')}
            itemList={mockAppVersionData.bugFixes}
          />
          <Stack direction="column" spacing="gap-y-2">
            <Text variant="h6">{t('Additional Notes')}</Text>
            <Text variant="body2">
              {t('{{releaseNote}}', { releaseNote: mockAppVersionData.releaseNote })}
            </Text>
          </Stack>
          <Divider />
          <ContentBlock
            blockTitle={t('Version History')}
            viewMoreIcon={<ChevronRightIcon />}
            showDivider={false}
            onClickviewMoreLabel={() => {
              navigate({
                to: '/info/$appId',
                params: {
                  appId,
                },
              });
            }}
          ></ContentBlock>
        </Stack>
      </Card>
    </>
  );
};
