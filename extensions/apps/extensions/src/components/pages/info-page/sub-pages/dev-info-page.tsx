import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { mockProfile } from '../info-page';

type DevInfoPageProps = {
  devDid: string;
};

export const DevInfoPage: React.FC<DevInfoPageProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const handleAppClick = (appId: string) => {
    navigate({
      to: '/info/$appId',
      params: {
        appId,
      },
    });
  };
  // @TODO fetch real data
  const ownExtensions = [];

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <Text variant="h5">{t('Developer')}</Text>
          <ProfileAvatarButton
            profileId={mockProfile.profileId}
            label={mockProfile.name}
            avatar={transformSource(mockProfile?.avatar?.default)}
            alternativeAvatars={mockProfile?.avatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
          />
          <Divider />
          <AppList
            apps={ownExtensions}
            onLoadMore={() => {
              return new Promise(res => res);
            }}
          />
          <Divider />
          <Text variant="h5">{t('Collaborations')}</Text>
          <AppList
            apps={ownExtensions.slice(0, 1)}
            onLoadMore={() => {
              return new Promise(res => res);
            }}
          />
        </Stack>
      </Card>
    </>
  );
};
