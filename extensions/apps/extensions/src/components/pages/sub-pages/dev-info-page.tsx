import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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

  const description = t(
    'Play with your friends in AKASHA World and enjoy a couple of puzzle games or drawing games or any kind of game!',
  );

  const ownExtensions = Array.from({ length: 4 }, (_, i) => ({
    id: 'gamesapp' + i + 1,
    name: t('Games App'),
    description,
    action: (
      <Button
        variant="primary"
        label={t('Open')}
        onClick={() => handleAppClick('gamesapp' + i + 1)}
      />
    ),
  }));

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
          <AppList apps={ownExtensions} onAppSelected={handleAppClick} />
          <Divider />
          <Text variant="h5">{t('Collaborations')}</Text>
          <AppList apps={ownExtensions.slice(0, 1)} onAppSelected={handleAppClick} />
        </Stack>
      </Card>
    </>
  );
};
